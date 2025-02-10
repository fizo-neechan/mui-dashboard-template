import { Box, Button, IconButton, styled } from '@mui/material';

export const WrapButton = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'end',
  paddingTop: '1.4rem',
  paddingBottom: '1.4rem',
}));

export const UserButton = styled(Button)(({ theme }) => ({
  width: '18rem',
  display: 'flex',
  gap: '1.4rem',
  paddingTop: '1.4rem',
  paddingBottom: '1.4rem',
  fontSize: '1.2rem',
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
}));

export const IconButtons = styled(IconButton)(() => ({
  position: 'relative',
  '&:hover span': { opacity: 1 },
}));

export const SpanWrap = styled('span')(() => ({
  position: 'absolute',
  top: '-1rem',
  left: '50%',
  transform: 'translateX(-50%)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
  fontSize: '1rem',
}));
