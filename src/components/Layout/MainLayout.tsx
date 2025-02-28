import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 240;

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} drawerWidth={DRAWER_WIDTH} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: (theme) => theme.spacing(8),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 