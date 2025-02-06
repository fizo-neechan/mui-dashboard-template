import { Button, styled } from '@mui/material';

export const UserButton = styled(Button) (({theme})=>({
  px:'10px',
  py:'4px',
  backgroundColor: theme.palette.secondary.main,
}));
