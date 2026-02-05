import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Collapse } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalculateIcon from '@mui/icons-material/Calculate';

const drawerWidth = 240;

const menuItems = [
  { text: 'Tổng quan', icon: <DashboardIcon />, path: '/dashboard' },
  {
    text: 'Vận chuyển',
    icon: <LocalShippingIcon />,
    path: '/transport',
    children: [
      { text: 'Nhà vận chuyển', icon: <LocalShippingOutlinedIcon />, path: '/transport/carriers' },
      { text: 'Địa điểm', icon: <LocationOnIcon />, path: '/transport/locations' },
      { text: 'Bảng khối tương đối', icon: <CalculateIcon />, path: '/transport/volume-table' },
    ]
  },
  { text: 'Kho hàng', icon: <WarehouseIcon />, path: '/warehouses' },
  { text: 'Khách hàng', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Báo cáo', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Cài đặt', icon: <SettingsIcon />, path: '/settings' },
];

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleMenuClick = (item) => {
    if (item.children) {
      // Toggle submenu
      setExpandedMenus(prev => ({
        ...prev,
        [item.text]: !prev[item.text]
      }));
    } else {
      // Navigate to page
      navigate(item.path);
    }
  };

  const isActiveMenu = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const isActiveSubmenu = (path) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: '#1976d2',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ color: 'white' }}>
            MIA Logistics Manager
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f5f5f5',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            MIA Logistics
          </Typography>
        </Toolbar>

        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem
                button
                onClick={() => handleMenuClick(item)}
                sx={{
                  bgcolor: isActiveMenu(item.path) ? '#e3f2fd' : 'transparent',
                  '&:hover': {
                    bgcolor: '#e3f2fd',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActiveMenu(item.path) ? '#1976d2' : '#666' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    color: isActiveMenu(item.path) ? '#1976d2' : '#333',
                    fontWeight: isActiveMenu(item.path) ? 'bold' : 'normal',
                  }}
                />
                {item.children && (
                  expandedMenus[item.text] ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItem>

              {/* Submenu */}
              {item.children && (
                <Collapse in={expandedMenus[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem
                        key={child.text}
                        button
                        sx={{
                          pl: 4,
                          bgcolor: isActiveSubmenu(child.path) ? '#e3f2fd' : 'transparent',
                          '&:hover': {
                            bgcolor: '#e3f2fd',
                          },
                        }}
                        onClick={() => navigate(child.path)}
                      >
                        <ListItemIcon sx={{ color: isActiveSubmenu(child.path) ? '#1976d2' : '#666' }}>
                          {child.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={child.text}
                          sx={{
                            color: isActiveSubmenu(child.path) ? '#1976d2' : '#333',
                            fontWeight: isActiveSubmenu(child.path) ? 'bold' : 'normal',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f9f9f9',
          p: 3,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
