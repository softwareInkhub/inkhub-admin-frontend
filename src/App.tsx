import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import { OpenOrders } from './pages/Dashboard/OpenOrders';
import { CacheProvider } from './context/CacheContext';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CacheProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/openorders" element={<OpenOrders />} />
              <Route path="/users" element={<div>Users Page</div>} />
              <Route path="/products" element={<div>Products Page</div>} />
              <Route path="/tasks" element={<div>Tasks Page</div>} />
              <Route path="/designs" element={<div>Designs Page</div>} />
            </Routes>
          </MainLayout>
        </Router>
      </CacheProvider>
    </ThemeProvider>
  );
}

export default App; 