import {
  AccountCircle, Assessment as ReportsIcon, Brightness4,
  Brightness7, Business as PartnersIcon, Dashboard as DashboardIcon,
  LocalShipping as TransportIcon, Logout, Map as MapIcon, Menu as MenuIcon, Notifications as NotificationsIcon, People as StaffIcon, Warehouse as WarehouseIcon
} from '@mui/icons-material';
import {
  AppBar, Avatar, Badge, Box, Divider, Drawer, IconButton, List, ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText, Menu,
  MenuItem, Toolbar, Tooltip, Typography, useMediaQuery, useTheme
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useTheme as useThemeContext } from '../../contexts/ThemeContext';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    roles: ['admin', 'manager', 'operator', 'driver', 'warehouse_staff'],
  },
  {
    text: 'transport',
    icon: <TransportIcon />,
    path: '/transport',
    roles: ['admin', 'manager', 'operator'],
  },
  {
    text: 'warehouse',
    icon: <WarehouseIcon />,
    path: '/warehouse',
    roles: ['admin', 'manager', 'warehouse_staff'],
  },
  {
    text: 'staff',
    icon: <StaffIcon />,
    path: '/staff',
    roles: ['admin', 'manager'],
  },
  {
    text: 'partners',
    icon: <PartnersIcon />,
    path: '/partners',
    roles: ['admin', 'manager', 'operator'],
  },
  {
    text: 'maps',
    icon: <MapIcon />,
    path: '/maps',
    roles: ['admin', 'manager', 'operator', 'driver'],
  },
  {
    text: 'reports',
    icon: <ReportsIcon />,
    path: '/reports',
    roles: ['admin', 'manager'],
  },
];

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();
  const { isDarkMode, toggleDarkMode } = useThemeContext();
  const { language, changeLanguage, availableLanguages, t } = useLanguage();
  const { unreadCount } = useNotification();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            MIA
          </Box>
          <Typography variant="h6" noWrap>
            Logistics
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const hasAccess = item.roles.some(role => hasRole(role));

          if (!hasAccess) return null;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: 3 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={t(`navigation.${item.text}`)} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            MIA Logistics Manager
          </Typography>

          <Tooltip title="Thông báo">
            <IconButton color="inherit" onClick={() => handleNavigation('/notifications')}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title={user?.name || user?.email}>
            <IconButton color="inherit" onClick={handleUserMenuOpen}>
              {user?.picture ? (
                <Avatar src={user.picture} sx={{ width: 32, height: 32 }} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { handleUserMenuClose(); handleNavigation('/profile'); }}>
          <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
          Hồ sơ cá nhân
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MainLayout;
