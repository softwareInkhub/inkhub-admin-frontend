import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  ListItemButton,
  Divider,
  Box
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as ProductsIcon,
  Assignment as TasksIcon,
  Palette as DesignIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  drawerWidth: number;
}

const Sidebar = ({ open, drawerWidth }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: <DashboardIcon />, text: 'Dashboard' },
    { path: '/dashboard/openorders', icon: <ShoppingCartIcon />, text: 'Order Management' },
    { text: 'Users', icon: <PeopleIcon />, path: '/users' },
    { text: 'Products', icon: <ProductsIcon />, path: '/products' },
    { text: 'Tasks', icon: <TasksIcon />, path: '/tasks' },
    { text: 'Designs', icon: <DesignIcon />, path: '/designs' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          ...(!open && {
            width: theme => theme.spacing(7),
            overflowX: 'hidden'
          })
        },
      }}
    >
      <Box sx={{ height: (theme) => theme.spacing(8) }} /> {/* Toolbar spacer */}
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 