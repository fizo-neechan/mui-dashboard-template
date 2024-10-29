import Navbar from "@/features/admin/nav-bar/Navbar";
import React from "react";

const AdminAccountLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default AdminAccountLayout;
