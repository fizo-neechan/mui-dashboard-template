import BlockIcon from '@mui/icons-material/Block'; 
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Container } from '@mui/material';
import { UserRole } from '@prisma/client';
import React, { useState } from 'react';

import {
  useBlockUser,
  useChangeRole,
  useDeleteUser,
  useUnblockUser,
} from '@/hooks/users/useUsers';

interface ActionCellProps {
  userId: string;
}
import { IconButtons, SpanWrap } from '../../features/admin/users/Users.style';

const roles: UserRole[] = ['ADMIN', 'MODERATOR', 'USER'];

const ActionCell: React.FC<ActionCellProps> = ({ userId }) => {
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: changeRole } = useChangeRole();
  const { mutate: blockUser } = useBlockUser();
  const { mutate: unblockUser } = useUnblockUser();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [blockMenuAnchorEl, setBlockMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = () => {
    deleteUser(userId);
    setOpenDialog(false);
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleRoleChange = (newRole: UserRole) => {
    changeRole({ id: userId, role: newRole });
    setAnchorEl(null);
  };

  const handleOpenBlockMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBlockMenuAnchorEl(event.currentTarget);
  };

  const handleCloseBlockMenu = () => {
    setBlockMenuAnchorEl(null);
  };

  const handleBlockAction = (action: 'block' | 'unblock') => {
    if (action === 'block') {
      blockUser(userId);
    } else {
      unblockUser(userId);
    }
    setBlockMenuAnchorEl(null);
  };

  return (
    <Container maxWidth="sm">
      <IconButtons onClick={handleOpenMenu}>
        <EditIcon />
        <SpanWrap>Change role</SpanWrap>
      </IconButtons>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {roles.map((role) => (
          <MenuItem key={role} onClick={() => handleRoleChange(role)}>
            {role}
          </MenuItem>
        ))}
      </Menu>
      
      <IconButtons onClick={handleOpenDialog}>
        <SpanWrap>Delete</SpanWrap>
        <DeleteIcon />
      </IconButtons>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <IconButtons onClick={handleOpenBlockMenu}>
        <BlockIcon />
        <SpanWrap>Block user</SpanWrap>
      </IconButtons>

      <Menu anchorEl={blockMenuAnchorEl} open={Boolean(blockMenuAnchorEl)} onClose={handleCloseBlockMenu}>
        <MenuItem onClick={() => handleBlockAction('block')}>Block</MenuItem>
        <MenuItem onClick={() => handleBlockAction('unblock')}>Unblock</MenuItem>
      </Menu>
    </Container>
  );
};

export default ActionCell;
