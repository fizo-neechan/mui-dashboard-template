"use client";
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React, { useState } from "react";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Drawer, DrawerBox, DrawerHeader } from "./Sidebar.style";

export default function MiniDrawer() {
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerBox>
        <DrawerHeader></DrawerHeader>
        <Divider />
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <StyledListItem index={index} text={text} open={open} />
          ))}
        </List>
      </DrawerBox>
    </Drawer>
  );
}

interface StyledListItemProps {
  text: string;
  index: number;
  open: boolean;
}

export const StyledListItem: React.FC<StyledListItemProps> = ({ text, index, open }) => {
  return (
    <ListItem
      disablePadding
      sx={{
        display: "block",
        backgroundColor: index === 0 ? "background.white" : "",
        borderRadius: "10px",
        marginBottom: "0.4rem",
      }}
    >
      <ListItemButton
        sx={[
          {
            minHeight: 48,
            px: 2.5,
          },
          open
            ? {
              justifyContent: "initial",
            }
            : {
              justifyContent: "center",
            },
        ]}
      >
        <ListItemIcon
          sx={[
            {
              minWidth: 0,
              color: index !== 0 ? "accent.main" : "text.light",
              borderRadius: "8px",
              padding: "0.5rem",
              justifyContent: "center",
              backgroundColor: index !== 0 ? "background.white" : "accent.main",
            },
            open
              ? {
                mr: 3,
              }
              : {
                mr: "auto",
              },
          ]}
        >
          {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
        </ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{
            fontWeight: "600 !important",
            fontSize: "1.2rem",
            color: index !== 0 ? "text.secondary" : "text.main",
          }}
          sx={[
            open
              ? {
                opacity: 1,
              }
              : {
                opacity: 0,
              },
          ]}
        />
      </ListItemButton>
    </ListItem>
  );
};
