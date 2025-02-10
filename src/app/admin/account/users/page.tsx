'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import Users from '@/features/admin/users/Users';

const queryClient = new QueryClient();

const page = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  );
};

export default page;
