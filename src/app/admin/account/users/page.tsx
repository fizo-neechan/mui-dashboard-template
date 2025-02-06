'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import Users from '@/features/admin/users/Users';

// import Users2 from  '../../../../features/admin/users/users2'; 

const queryClient = new QueryClient();

const page = () => {
  return <div>
    <QueryClientProvider client={queryClient}>
      <Users />  
      {/* <Users2 /> */}
    </QueryClientProvider>
  </div>;
};

export default page;
