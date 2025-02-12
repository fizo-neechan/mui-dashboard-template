import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Skeleton, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';

import CreateNewUser from '@/components/create-new-user/CreateNewUser';
import { User } from '@/components/users/UserDataGridRow';
import { UserDataGridRow } from '@/components/users/UserDataGridRow';
import { useUsers } from '@/hooks/users/useUsers';

import { UserButton, WrapButton } from './Users.style';
import { UserDataGridColumns } from '../../../components/users/UserDataGridColumns';

const Users = () => {
  const { data, isLoading, error } = useUsers({
    page: 1,
    limit: 1000,
    sortBy: 'name',
    sortOrder: 'asc',
    showDeleted: true,
    showBlocked: true,
  });

  const [open, setOpen] = useState(false);

  if (isLoading) return <Skeleton variant='rounded' width='100%' height={400} />;
  if (error) return <Alert severity='error'>Error fetching users</Alert>;

  const users = data?.data ?? [];

  const rows = users.map((user: User, index: number) => UserDataGridRow({ user, index }));

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
        columns={UserDataGridColumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50, 100]}
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
