import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { useSelector } from "react-redux";

export function DrawerListItems({ currentPath, onNavigate, showAirdrop }) {
  const wallet = useSelector((state) => state?.wallet);
  const { chainInfo } = wallet;

  return (
    <>
      <ListItemButton
        onClick={() => onNavigate("/")}
        selected={currentPath === "/"}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Overview" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate("/multisig")}
        selected={currentPath === "/multisig"}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <GroupsOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Multisig" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate("/staking")}
        selected={currentPath === "/staking"}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <BarChartOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Staking" />
      </ListItemButton>
      <ListItemButton
        onClick={() => onNavigate("/governance")}
        selected={currentPath === "/governance"}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <DocumentScannerOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Governance" />
      </ListItemButton>
      <ListItemButton
        disabled={!chainInfo?.enableModules.authz}
        onClick={() => onNavigate("/authz")}
        selected={currentPath === "/authz"}
        sx={{ pb: 0.5, pt: 0.5 }}
      >
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText
          primary="Authz"
          secondary={chainInfo?.enableModules.authz ? null : "Not supported"}
        />
      </ListItemButton>
      <ListItemButton
        disabled={!chainInfo?.enableModules.feegrant}
        onClick={() => onNavigate("/feegrant")}
        sx={{ pb: 0.5, pt: 0.5 }}
        selected={currentPath === "/feegrant"}
      >
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText
          primary="Feegrant"
          secondary={chainInfo?.enableModules.feegrant ? null : "Not supported"}
        />
      </ListItemButton>
      <ListItemButton
        disabled={!chainInfo?.enableModules.group}
        onClick={() => onNavigate("/group")}
        sx={{ pb: 0.5, pt: 0.5 }}
        selected={currentPath === "/group"}
      >
        <ListItemIcon>
          <GroupsOutlinedIcon />
        </ListItemIcon>
        <ListItemText
          primary="Groups"
          secondary={chainInfo?.enableModules.group ? null : "Not supported"}
        />
      </ListItemButton>

      {showAirdrop ? (
        <ListItemButton
          onClick={() => onNavigate("/airdrop-check")}
          selected={currentPath === "/airdrop-check"}
          sx={{ pb: 0.5, pt: 0.5 }}
        >
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Airdrop" />
        </ListItemButton>
      ) : (
        <></>
      )}
    </>
  );
}
