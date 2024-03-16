import React from "react";
import Box from "@mui/material/Box";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <Box display="block" width="100%" height="100%">
      <Box flexGrow={1}>
        <Navbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
