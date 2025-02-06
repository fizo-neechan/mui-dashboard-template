import React from 'react';

import { useUsers } from '@/hooks/users/useUsers';

const Users2 = () => {
  const { data, isLoading, error } = useUsers({}); // Fetch users data

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching users</div>;

  console.log('useUsers Response:', { data, isLoading, error });

  return (
    <div>
      <h2>User Names:</h2>
      <ul>
        {data?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users2;
