import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setError, setTxHash } from "../common/commonSlice";
import { Unjail } from "../../txns/slashing/unjail";
import { signAndBroadcast } from "../../utils/signing";

const initialState = {
  tx: {
    status: "idle",
    type: "",
  },
};

export const txUnjail = createAsyncThunk(
  "slashing/unjail",
  async (data, { rejectWithValue, fulfillWithValue, dispatch }) => {
    try {
      const msg = Unjail(data.validator);
      const result = await signAndBroadcast(
        data.chainId,
        data.aminoConfig,
        data.prefix,
        [msg],
        260000,
        "",
        `${data.feeAmount}${data.denom}`,
        data.rest,
        data.feegranter?.length > 0 ? data.feegranter : undefined
      );
      if (result?.code === 0) {
        dispatch(
          setTxHash({
            hash: result?.transactionHash,
          })
        );
        return fulfillWithValue({ txHash: result?.transactionHash });
      } else {
        dispatch(
          setError({
            type: "error",
            message: result?.rawLog,
          })
        );
        return rejectWithValue(result?.rawLog);
      }
    } catch (error) {
      dispatch(
        setError({
          type: "error",
          message: error.message,
        })
      );
      return rejectWithValue(error.response);
    }
  }
);

export const slashingSlice = createSlice({
  name: "slashing",
  initialState,
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(txUnjail.pending, (state) => {
        state.tx.status = "pending";
        state.tx.type = "";
      })
      .addCase(txUnjail.fulfilled, (state, _) => {
        state.tx.status = "idle";
        state.tx.type = "delegate";
      })
      .addCase(txUnjail.rejected, (state, _) => {
        state.tx.status = "rejected";
        state.tx.type = "";
      });
  },
});

export default slashingSlice.reducer;
