"use client";

import { alpha, Box, Divider, Icon, IconButton, Menu, MenuItem, MenuProps, styled, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useId, useState } from "react";
import { EditNotifications } from "@mui/icons-material";

import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Navbar = () => {
  const pathname = usePathname().split('/');

  return <Box sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  }}>
    <Box>
      <BreadCrumbs pathname={pathname} />
      <Typography
        sx={{
          color: "text.primary",
          fontWeight: "bold",
          fontSize: "1.4rem",
        }}
      >
        {pathname[pathname.length - 1].charAt(0).toUpperCase() + pathname[pathname.length - 1].slice(1)}
      </Typography>
    </Box>

    <Box sx={{
      display: "flex",
      color: 'text.primary',
    }}>
      <NavbarMenuIcon >
        <PersonIcon />
      </NavbarMenuIcon>
      <IconButton >
        <SettingsIcon />
      </IconButton>
      <IconButton >
        <NotificationsIcon />
      </IconButton>
    </Box>
  </Box>;
};

const NavbarMenuIcon = ({ children }: { children: React.ReactNode }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const id = useId();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
      >
        {children}
      </IconButton>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          <EditNotifications />
          Edit
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <FileCopyIcon />
          Duplicate
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose} disableRipple>
          <ArchiveIcon />
          Archive
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <MoreHorizIcon />
          More
        </MenuItem>
      </StyledMenu>
    </>

  )
}
const BreadCrumbs = ({ pathname }: { pathname: string[] }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {pathname.map((path, index) => {
        if (index === 0) return null;
        return (
          <Typography
            sx={{
              color: index === pathname.length - 1 ? "text.primary" : "text.secondary",
              fontWeight: "normal",
              fontSize: "1.2rem",
              lineHeight: "150%",
            }}
            key={index}
          >
            {path.charAt(0).toUpperCase() + path.slice(1)}{index !== pathname.length - 1 && <>
              &nbsp;/&nbsp;
            </>
            }
          </Typography>
        )
      })}
    </Box>
  );
};

export default Navbar;


const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));