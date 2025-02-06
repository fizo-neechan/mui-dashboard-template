'use client';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { UserButton } from './Users.style';

type User = {
  id: number,
  name: string;
username: string;
email: string;
phone: string;
};

// Fetch users from API
const fetchUsers = async () : Promise<User[]> => {
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
    <UserButton>Edit</UserButton>
    <UserButton>Delete</UserButton>
    <UserButton>Copy</UserButton>
  </Box>
);

const Users = () => {

  // Fetch users using react-query
  const {
    data: users=[],
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
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150   },
    { field: 'username', headerName: 'Username',width: 150  },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'phone', headerName: 'Phone',  width: 150},
    {
      field: 'action',
      headerName: 'Action',
      width: 230,
      sortable: false,
      renderCell: () => <ActionCell />,
    },
  ];

  return (
    <Box sx={{ height: 450, width: '100%' }}>
      <Box sx={{ py: '20px', textAlign: 'end' }}>
        <UserButton>Add new User</UserButton>
      </Box>
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
        getRowSpacing={(params)=>({
          top: params.isFirstVisible ? 0:5,
          bottom: params.isLastVisible ? 0 : 5 ,
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
