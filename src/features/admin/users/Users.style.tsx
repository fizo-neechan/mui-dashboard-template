import { Box, Button, IconButton, styled, Typography } from '@mui/material';

export const WrapButton = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'end',
  paddingTop: '14px',
  paddingBottom: '14px',
}));

export const UserButton = styled(Button)(({ theme }) => ({
  width: '180px',
  display: 'flex',
  gap: '14px',
  paddingTop: '14px',
  paddingBottom: '14px',
  fontSize: '12px',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.text.light,
}));

export const IconButtons = styled(IconButton)(() => ({
  position: 'relative',
  '&:hover .edit-text': { opacity: 1 },
}));

export const SpanWrap = styled(Typography)(() => ({
  position: 'absolute',
  top: '-10px',
  left: '50%',
  transform: 'translateX(-50%)',
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
}));
