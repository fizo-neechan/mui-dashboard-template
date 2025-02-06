'use client';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { IconButtons, SpanWrap, UserButton, WrapButton } from './Users.style';

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
};

// Fetch users from API
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

// Action buttons for each row
const ActionCell = () => (
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
      <SpanWrap className='edit-text' sx={{}}>
        Edit
      </SpanWrap>
    </IconButtons>
    <IconButtons>
      <SpanWrap className='edit-text' sx={{}}>
        Delete
      </SpanWrap>
      <DeleteIcon />
    </IconButtons>
    <IconButtons>
      <SpanWrap className='edit-text' sx={{}}>
        Copy
      </SpanWrap>
      <ContentCopyIcon />
    </IconButtons>
  </Box>
);

const Users = () => {
  // Fetch users using react-query
  const {
    data: users = [],
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Map API data to rows
  const rows = users.map((user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
  }));

  // Define columns
  const columns: GridColDef<User>[] = [
    { field: 'id', headerName: 'ID', flex: 0.5, editable: false },
    { field: 'name', headerName: 'Name', flex: 1, editable: true },
    { field: 'username', headerName: 'Username', flex: 1, editable: true },
    { field: 'email', headerName: 'Email', flex: 1, editable: true },
    { field: 'phone', headerName: 'Phone', flex: 1, editable: true },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      sortable: false,
      renderCell: () => <ActionCell />,
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
        pageSizeOptions={[5]}
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
