import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';

import { useDeleteUser, useUsers } from '@/hooks/users/useUsers';

import { IconButtons, SpanWrap, UserButton, WrapButton } from './Users.style';

interface ActionCellProps {
  userId: string; 
}

// Action buttons for each row
const ActionCell: React.FC<ActionCellProps> = ({ userId }) => {
  const { mutate: deleteUser} = useDeleteUser();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <IconButtons>
        <EditIcon />
        <SpanWrap className='edit-text'>Edit</SpanWrap>
      </IconButtons>
      <IconButtons onClick={handleDelete}>
        <SpanWrap className='edit-text'>Delete</SpanWrap>
        <DeleteIcon />
      </IconButtons>
      <IconButtons>
        <SpanWrap className='edit-text'>Copy</SpanWrap>
        <ContentCopyIcon />
      </IconButtons>
    </Box>
  );
};

const Users = () => {
  // Fetch users using useUsers hook
  const { data, isLoading, error } = useUsers({
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc',
    showDeleted: false,
    showBlocked: false,
  });

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error fetching users</p>;

  // Extract users data
  const users = data?.data ?? [];

  // Map API data to rows
  const rows = users.map((user, index) => ({
    id: user.id || index,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    isBlocked: user.isBlocked,
    isDeleted: user.isDeleted,
    createdAt: new Date(user.createdAt).toLocaleString(),
    updatedAt: new Date(user.updatedAt).toLocaleString(),
  }));

  // Define columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1, editable: false },
    { field: 'name', headerName: 'Name', flex: 1, editable: true },
    { field: 'email', headerName: 'Email', flex: 1, editable: true },
    { field: 'role',
      headerName: 'Role',
      flex: 0.5,
      editable: true,
      type: 'singleSelect',
      valueOptions: ['ADMIN', 'MODERATOR', 'USER'],
    },
    {
      field: 'emailVerified',
      headerName: 'Email Verified',
      flex: 0.5,
      type: 'boolean',
      editable: true,
    },
    { field: 'isBlocked', headerName: 'Blocked',  flex: 0.5,
      type: 'boolean', editable: true },
    { field: 'isDeleted', headerName: 'Deleted', flex: 0.5,
      type: 'boolean', editable: true },
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
        <UserButton>
          Add new User <PersonAddIcon />
        </UserButton>
      </WrapButton>
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
