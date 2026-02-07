import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as OrdersIcon,
  Warehouse as WarehouseIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 256;

const menuItems = [
  { label: 'Tổng quan', path: '/', icon: <DashboardIcon /> },
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Đơn hàng', path: '/orders', icon: <OrdersIcon /> },
  { label: 'Kho vận', path: '/warehouse', icon: <WarehouseIcon /> },
  { label: 'Báo cáo', path: '/reports', icon: <ReportsIcon /> },
  { label: 'Cài đặt', path: '/settings', icon: <SettingsIcon /> },
];

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          mt: '64px',
          borderRight: 1,
          borderColor: 'divider',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', py: 1 }}>
        <Typography variant="overline" color="text.secondary" sx={{ px: 2, py: 1 }}>
          Menu chính
        </Typography>
        <List dense>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                selected={isActive}
                onClick={() => navigate(item.path)}
                sx={{ mx: 1, borderRadius: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ px: 2, display: 'block' }}>
          MIA Logistics · Unified
        </Typography>
      </Box>
    </Drawer>
  );
};

export default AppSidebar;
