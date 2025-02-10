import { GridColDef } from '@mui/x-data-grid';
import { UserRole } from '@prisma/client';

import ActionCell from './ActionCell';

export const UserDataGridColumns: GridColDef[] = [
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
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 1,
    editable: false,
    valueGetter: (params: { value: string }) => new Date(params.value).toLocaleString(),
  },
  {
    field: 'updatedAt',
    headerName: 'Updated At',
    flex: 1,
    editable: false,
    valueGetter: (params: { value: string }) => new Date(params.value).toLocaleString(),
  },
  {
    field: 'action',
    headerName: 'Action',
    flex: 1,
    sortable: false,
    renderCell: (params) => <ActionCell userId={params.row.id} />,
  },
];
