"use client";
import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Drawer, DrawerBox, DrawerHeader } from "./Sidebar.style";
import { usePathname, useRouter } from "next/navigation";

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
}

interface MenuItems {
  section: string;
  items: MenuItem[];
}

const MENU_ITEMS: MenuItems[] = [
  {
    section: 'Main', items: [
      {
        text: 'Dashboard',
        icon: <InboxIcon />,
        path: '/admin',
      },
      {
        text: 'Inbox',
        icon: <InboxIcon />,
        path: '/admin/inbox',
      },
      {
        text: 'Starred',
        icon: <InboxIcon />,
        path: '/admin/starred',
      },
      {
        text: 'Drafts',
        icon: <InboxIcon />,
        path: '/admin/drafts',
      },
    ]
  },
  {
    section: 'Account', items: [
      {
        text: 'Your Account',
        icon: <InboxIcon />,
        path: '/admin/account/manage',
      },
      {
        text: 'Settings',
        icon: <InboxIcon />,
        path: '/admin/account/settings',
      },
      {
        text: 'Users',
        icon: <InboxIcon />,
        path: '/admin/account/users',
      },
    ]
  },
]

export default function SideBar() {
  const pathname = usePathname();
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
        <DrawerHeader>
          <ListItemText
            primaryTypographyProps={{
              fontWeight: "600",
              fontSize: "1.2rem",
              color: "text.main",
              marginTop: '0.5rem'
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
            primary="Dashboard"
          />
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <List>
          {MENU_ITEMS.map((section, idx) => (
            <>
              <MenuSectionDivider name={section.section} open={open} />
              {section.items.map((item, jdx) => (
                <StyledListItem text={item.text} icon={item.icon} selected={pathname === item.path} path={item.path} open={open} />
              ))}
            </>
          ))}
        </List>
      </DrawerBox>
    </Drawer>
  );
}

const MenuSectionDivider = ({ name, open }: { name: string, open: boolean }) => {
  return <Box sx={{
    display: 'flex',
    gap: '0.8rem',
    alignItems: 'center',
    margin: "0.8rem 0",
    opacity: open ? 1 : 0,
    transition: 'opacity 0.1s ease-in-out',
  }}>
    <Box sx={{
      backgroundColor: 'accent.main',
      width: '1.4rem',
      height: '0.1rem',
    }}></Box>

    <Typography sx={{
      color: 'accent.main',
      fontSize: '1.2rem',
      fontWeight: '600',
      lineHeight: '150%',
    }}>
      {name}
    </Typography>

    <Box sx={{
      backgroundColor: 'accent.main',
      width: '100%',
      height: '0.1rem',
    }}></Box>
  </Box>;
}

interface StyledListItemProps extends MenuItem {
  open: boolean;
  selected: boolean;
}

export const StyledListItem: React.FC<StyledListItemProps> = ({ text, icon, selected, open, path }) => {
  const router = useRouter();
  return (
    <ListItem
      disablePadding
      sx={{
        display: "block",
        backgroundColor: open && selected ? "background.white" : "",
        borderRadius: "8px",
        marginBottom: "0.4rem",
      }}
    >
      <ListItemButton
        onClick={() => { router.push(path) }}
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
              color: !selected ? "accent.main" : "text.light",
              borderRadius: "8px",
              padding: "0.5rem",
              justifyContent: "center",
              backgroundColor: !selected ? "background.white" : "accent.main",
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
        {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{
            fontWeight: "600 !important",
            fontSize: "1.2rem",
            color: !selected ? "text.secondary" : "text.main",
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
