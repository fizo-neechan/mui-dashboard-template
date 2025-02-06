'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import Users from '@/features/admin/users/Users';

const queryClient = new QueryClient();

// import User2 from '../../../../features/admin/users/User2'

const page = () => {
  return <div>
    <QueryClientProvider client={queryClient}>
      <Users />  
      {/* <User2 /> */}
    </QueryClientProvider>
  </div>;
};

export default page;
