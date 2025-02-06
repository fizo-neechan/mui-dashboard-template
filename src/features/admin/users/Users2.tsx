import React from 'react';

import { useUsers } from '@/hooks/users/useUsers';

const Users2 = () => {
  const { data, isLoading, error } = useUsers({
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc',
    showDeleted: false,
    showBlocked: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching users</div>;

  const users = data?.data;

  return (
    <div>
      <h2>User Names:</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users2;
