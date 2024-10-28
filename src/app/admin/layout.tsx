import Navbar from "@/features/admin/nav-bar/Navbar";
import SideBar from "@/features/admin/side-bar/Sidebar";
import { Box } from "@mui/material";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, padding: '2.4rem 1.8rem' }}>
        <Navbar />
        {children}</Box>
    </Box>
  );
}
