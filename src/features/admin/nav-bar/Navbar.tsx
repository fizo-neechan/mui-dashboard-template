"use client";

import { alpha, Box, Icon, IconButton, Menu, MenuProps, styled, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

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
      <IconButton >
        <PersonIcon />
      </IconButton>
      <IconButton >
        <SettingsIcon />
      </IconButton>
      <IconButton >
        <NotificationsIcon />
      </IconButton>
    </Box>
  </Box>;
};

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