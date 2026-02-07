import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  Brightness4,
  Brightness7,
  ViewModule,
} from '@mui/icons-material';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme as useThemeContext } from '../../../contexts/ThemeContext';
import LayoutConfigManager from './LayoutConfigManager';

interface AppHeaderProps {
  onMenuClick?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { toggleDarkMode, isDarkMode } = useThemeContext();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [layoutConfigOpen, setLayoutConfigOpen] = useState(false);

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          MIA Logistics
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <Tooltip title="Cấu hình Layout">
            <IconButton color="inherit" onClick={() => setLayoutConfigOpen(true)}>
              <ViewModule />
            </IconButton>
          </Tooltip>
          <LayoutConfigManager open={layoutConfigOpen} onClose={() => setLayoutConfigOpen(false)} />
          {isAuthenticated && (
            <>
              <IconButton color="inherit" onClick={handleUserMenu}>
                <Avatar sx={{ width: 32, height: 32 }}>{user?.name?.charAt(0) ?? 'U'}</Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">{user?.name ?? user?.email ?? 'User'}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
