import { AdminSectionHeading, AdminSectionsLayout, AdminSectionWrapper } from '@/features/admin/Admin.style';
import React from 'react';

const Page = () => {
  return (
    <AdminSectionsLayout>
      <AdminSectionWrapper>
        <AdminSectionHeading>Settings</AdminSectionHeading>
      </AdminSectionWrapper>
      <AdminSectionWrapper>
        <AdminSectionHeading>Profile Information</AdminSectionHeading>
      </AdminSectionWrapper>
      <AdminSectionWrapper>
        <AdminSectionHeading>Conversations</AdminSectionHeading>
      </AdminSectionWrapper>
    </AdminSectionsLayout>
  );
};

export default Page;