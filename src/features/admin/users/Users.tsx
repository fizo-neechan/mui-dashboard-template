import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';

import {
  useBlockUser,
  useChangeRole,
  useDeleteUser,
  useUnblockUser,
  useUsers,
} from '@/hooks/users/useUsers';

import CreateNewUser from './CreateNewUser';
import { IconButtons, SpanWrap, UserButton, WrapButton } from './Users.style';

export enum UserRole {
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

interface ActionCellProps {
  userId: string;
}

const roles: UserRole[] = [UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER];

const ActionCell: React.FC<ActionCellProps> = ({ userId }) => {
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: changeRole } = useChangeRole();
  const { mutate: blockUser } = useBlockUser();
  const { mutate: unblockUser } = useUnblockUser();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [blockMenuAnchorEl, setBlockMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
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
    <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <IconButtons onClick={handleOpenMenu}>
        <EditIcon />
        <SpanWrap className='edit-text'>Change role</SpanWrap>
      </IconButtons>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        {roles.map((role) => (
          <MenuItem key={role} onClick={() => handleRoleChange(role)}>
            {role}
          </MenuItem>
        ))}
      </Menu>
      <IconButtons onClick={handleDelete}>
        <SpanWrap className='edit-text'>Delete</SpanWrap>
        <DeleteIcon />
      </IconButtons>
      <IconButtons onClick={handleOpenBlockMenu}>
        <BlockIcon />
        <SpanWrap className='edit-text'>Block user</SpanWrap>
      </IconButtons>

      <Menu anchorEl={blockMenuAnchorEl} open={Boolean(blockMenuAnchorEl)} onClose={handleCloseBlockMenu}>
        <MenuItem onClick={() => handleBlockAction('block')}>Block</MenuItem>
        <MenuItem onClick={() => handleBlockAction('unblock')}>Unblock</MenuItem>
      </Menu>
    </Box>
  );
};

const Users = () => {
  const { data, isLoading, error } = useUsers({
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc',
    showDeleted: false,
    showBlocked: false,
  });

  const [open, setOpen] = useState(false);

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error fetching users</p>;

  const users = data?.data ?? [];

  const rows = users.map((user, index) => ({
    id: user.id || index,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    emailVerified: user.emailVerified,
    isBlocked: user.isBlocked,
    isDeleted: user.isDeleted,
    createdAt: new Date(user.createdAt).toLocaleString(),
    updatedAt: new Date(user.updatedAt).toLocaleString(),
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1, editable: false },
    { field: 'name', headerName: 'Name', flex: 1, editable: false },
    { field: 'email', headerName: 'Email', flex: 1, editable: false },
    {
      field: 'role',
      headerName: 'Role',
      flex: 0.5,
      editable: false,
      type: 'singleSelect',
      valueOptions: Object.values(UserRole),
    },
    {
      field: 'emailVerified',
      headerName: 'Email Verified',
      flex: 0.5,
      type: 'boolean',
      editable: false,
    },
    {
      field: 'isBlocked',
      headerName: 'Blocked',
      flex: 0.5,
      type: 'boolean',
      editable: false,
    },
    {
      field: 'isDeleted',
      headerName: 'Deleted',
      flex: 0.5,
      type: 'boolean',
      editable: false,
    },
    { field: 'createdAt', headerName: 'Created At', flex: 1, editable: false },
    { field: 'updatedAt', headerName: 'Updated At', flex: 1, editable: false },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: (params) => <ActionCell userId={params.row.id} />,
    },
  ];

  return (
    <Box>
      <WrapButton>
        <UserButton variant='contained' onClick={() => setOpen(true)}>
          Add new User <PersonAddIcon />
        </UserButton>
      </WrapButton>
      <CreateNewUser open={open} onClose={() => setOpen(false)} />
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          '& .MuiDataGrid-cell': {
            borderRight: '1px solid rgba(224, 224, 224, 1)',
          },
        }}
      />
    </Box>
  );
};

export default Users;