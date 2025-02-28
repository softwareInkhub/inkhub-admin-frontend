import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { OpenOrders } from './OpenOrders';

const Dashboard = () => {
  const location = useLocation();
  const isMainDashboard = location.pathname === '/dashboard';

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isMainDashboard ? 'Dashboard Overview' : 'Open Orders'}
      </Typography>
      {isMainDashboard ? (
        <Box>
          {/* Your dashboard overview content */}
          <Typography>Welcome to the dashboard</Typography>
        </Box>
      ) : (
        <OpenOrders />
      )}
    </Box>
  );
};

export default Dashboard; 