import { Box } from '@mui/material';

import Navbar from '@/features/admin/nav-bar/Navbar';
import SideBar from '@/features/admin/side-bar/Sidebar';

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, padding: '2.4rem 1.8rem', minHeight: '100vh' }}>
        <Navbar />
        {children}
      </Box>
    </Box>
  );
}
