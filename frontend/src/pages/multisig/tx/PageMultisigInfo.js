import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllValidators,
  getDelegations,
} from "../../../features/staking/stakeSlice";
import TransactionsList from "./TransactionsList";
import {
  multisigByAddress,
  getMultisigBalance,
} from "../../../features/multisig/multisigSlice";
import { shortenAddress } from "../../../utils/util";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import Chip from "@mui/material/Chip";
import { copyToClipboard } from "../../../utils/clipboard";

export default function PageMultisigInfo() {
  const dispatch = useDispatch();
  const { address: multisigAddress } = useParams();
  const multisigAccountDetails = useSelector(
    (state) => state.multisig.multisigAccount
  );
  const multisigAccount = multisigAccountDetails?.account || {};
  const members = multisigAccountDetails?.pubkeys || [];
  const multisigBal = useSelector((state) => state.multisig.balance);
  const multisigDel = useSelector((state) => state.staking.delegations);
  const currency = useSelector(
    (state) => state.wallet.chainInfo?.config?.currencies[0]
  );
  const [totalStake, setTotalStaked] = useState(0);

  useEffect(() => {
    let delegations = multisigDel?.delegations || [];
    let total = 0.0;
    if (delegations.length > 0) {
      for (let i = 0; i < delegations.length; i++)
        total +=
          parseFloat(delegations[i].delegation.shares) /
          10 ** currency?.coinDecimals;
    }
    setTotalStaked(total?.toFixed(6));
  }, [multisigDel]);

  const wallet = useSelector((state) => state.wallet);
  const { chainInfo, connected } = wallet;

  useEffect(() => {
    dispatch(multisigByAddress(multisigAddress));
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (connected) {
      dispatch(
        getMultisigBalance({
          baseURL: chainInfo.config.rest,
          address: multisigAddress,
          denom: chainInfo?.config?.currencies[0].coinMinimalDenom,
        })
      );

      dispatch(
        getDelegations({
          baseURL: chainInfo.config.rest,
          address: multisigAddress,
        })
      );

      dispatch(
        getAllValidators({
          baseURL: chainInfo.config.rest,
          status: null,
        })
      );
    }
  }, [chainInfo]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 0,
          p: 1,
          pl: 2,
          pr: 2,
        }}
      >
        <Typography
          variant="h6"
          color="text.primary"
          fontWeight={600}
          gutterBottom
        >
          Multisig Account Information
        </Typography>

        <Grid
          container
          sx={{
            textAlign: "left",
            p: 1,
          }}
          spacing={2}
        >
          <Grid item xs={6} md={3}>
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={500}
              gutterBottom
            >
              Account
            </Typography>
            <Chip
              label={
                multisigAccount?.address
                  ? shortenAddress(multisigAccount?.address, 24)
                  : ""
              }
              size="small"
              deleteIcon={<ContentCopyOutlined />}
              onDelete={() => {
                copyToClipboard(multisigAccount?.address, dispatch);
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={500}
              gutterBottom
            >
              Threshold
            </Typography>
            <Typography>
              &nbsp;&nbsp;{multisigAccount?.threshold || 0}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography
              gutterBottom
              variant="body1"
              color="text.primary"
              fontWeight={500}
            >
              Available
            </Typography>
            <Typography>
              {multisigBal?.balance?.amount / 10 ** currency?.coinDecimals || 0}{" "}
              &nbsp;
              {currency?.coinDenom}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography
              gutterBottom
              variant="body1"
              color="text.primary"
              fontWeight={500}
            >
              Staked
            </Typography>
            <Typography>
              {totalStake || 0} {currency?.coinDenom}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight={500}
              gutterBottom
            >
              Signers
            </Typography>
            {members.map((m, index) => (
              <Chip
                key={index}
                sx={{
                  ml: 0.5,
                  mr: 0.5,
                  mt: 1,
                }}
                label={m?.address ? shortenAddress(m.address, 24) : ""}
                size="small"
                deleteIcon={<ContentCopyOutlined />}
                onDelete={() => {
                  copyToClipboard(m?.address, dispatch);
                }}
              />
            ))}
          </Grid>
        </Grid>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mt: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Transactions
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
          }}
        >
          <Button
            onClick={() => navigate(`/multisig/${multisigAddress}/create-tx`)}
            disableElevation
            variant="contained"
            sx={{
              textTransform: "none",
            }}
          >
            Create Transaction
          </Button>
        </Box>
        {multisigAccountDetails.status === "idle" &&
        multisigAccount?.address?.length > 0 ? (
          <TransactionsList address={multisigAddress} />
        ) : (
          <CircularProgress size={40} />
        )}
      </Paper>
    </>
  );
}
