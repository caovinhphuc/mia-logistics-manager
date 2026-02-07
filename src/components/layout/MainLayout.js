import {
  AccountCircle,
  Assessment as ReportsIcon,
  Brightness4,
  Brightness7,
  Business as PartnersIcon,
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  Help as HelpIcon,
  Home as HomeIcon,
  KeyboardArrowRight as ArrowRightIcon,
  LocalShipping as TransportIcon,
  Logout,
  Map as MapIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Speed as SpeedIcon,
  Warehouse as WarehouseIcon,
  Inventory as InboundIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminPanelIcon,
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  AppBar,
  Avatar,
  Backdrop,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Fab,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useTheme as useThemeContext } from '../../contexts/ThemeContext';
import { CONSTANTS } from '../../utils/constants';

const drawerWidth = CONSTANTS.UI.MOBILE_DRAWER_WIDTH;
const drawerWidthCollapsed = CONSTANTS.UI.SIDEBAR_COLLAPSED_WIDTH;

// Function to generate menu items with translations
const getMenuItems = (t) => [
  {
    key: 'dashboard',
    text: t('navigation.dashboard'),
    icon: <DashboardIcon />,
    path: '/dashboard',
    roles: ['admin', 'manager', 'operator', 'driver', 'warehouse_staff'],
    color: 'primary',
  },
  {
    key: 'transport',
    text: t('navigation.transport'),
    icon: <TransportIcon />,
    path: '/transport',
    roles: ['admin', 'manager', 'operator'],
    color: 'secondary',
    children: [
      {
        key: 'requests',
        text: 'Đề nghị vận chuyển',
        path: '/transport/requests',
        roles: ['admin', 'manager', 'operator'],
      },
      {
        key: 'routes',
        text: t('navigation.routes'),
        path: '/transport/routes',
        roles: ['admin', 'manager'],
      },
      {
        key: 'vehicles',
        text: t('navigation.vehicles'),
        path: '/transport/vehicles',
        roles: ['admin', 'manager'],
      },
      {
        key: 'volume_rules',
        text: 'Quy tắc tính khối',
        path: '/transport/volume-rules',
        roles: ['admin', 'manager', 'operator'],
      },
      {
        key: 'carriers',
        text: 'Nhà vận chuyển',
        path: '/carriers',
        roles: ['admin', 'manager', 'operator'],
      },
      {
        key: 'locations_saved',
        text: 'Địa điểm lưu',
        path: '/transport/locations-saved',
        roles: ['admin', 'manager', 'operator'],
      },
      {
        key: 'pending_delivery',
        text: 'Chờ chuyển giao',
        path: '/transport/pending-delivery',
        roles: ['admin', 'manager', 'operator'],
      },
      {
        key: 'volume_calculator',
        text: 'Bảng tính khối',
        path: '/transport/volume-calculator',
        roles: ['admin', 'manager', 'operator'],
      },
    ],
  },
  {
    key: 'warehouse',
    text: t('navigation.warehouse'),
    icon: <WarehouseIcon />,
    path: '/warehouse',
    roles: ['admin', 'manager', 'warehouse_staff'],
    color: 'info',
    children: [
      {
        key: 'inventory',
        text: t('navigation.inventory'),
        path: '/warehouse/inventory',
        roles: ['admin', 'manager', 'warehouse_staff'],
      },
      {
        key: 'orders',
        text: t('navigation.orders'),
        path: '/warehouse/orders',
        roles: ['admin', 'manager'],
      },
      {
        key: 'locations',
        text: t('navigation.locations'),
        path: '/warehouse/locations',
        roles: ['admin', 'manager'],
      },
      {
        key: 'warehouse_transfers',
        text: 'Phiếu chuyển kho',
        path: '/warehouse/transfers',
        roles: ['admin', 'manager', 'warehouse_staff'],
      },
    ],
  },
  {
    key: 'inbound',
    text: 'Nhập hàng',
    icon: <InboundIcon />,
    path: '/inbound-domestic',
    roles: ['admin', 'manager', 'warehouse_staff'],
    color: 'success',
    children: [
      {
        key: 'domestic',
        text: 'Quốc nội',
        path: '/inbound-domestic',
        roles: ['admin', 'manager', 'warehouse_staff'],
      },
      {
        key: 'international',
        text: 'Quốc tế',
        path: '/inbound-international',
        roles: ['admin', 'manager', 'warehouse_staff'],
      },
      {
        key: 'schedule',
        text: 'Lịch trình',
        path: '/inbound-schedule',
        roles: ['admin', 'manager', 'warehouse_staff'],
      },
      { key: 'reports', text: 'Báo cáo', path: '/inbound-reports', roles: ['admin', 'manager'] },
    ],
  },
  {
    key: 'employees',
    text: 'Nhân sự',
    icon: <PeopleIcon />,
    path: '/employees',
    roles: ['admin', 'manager', 'hr'],
    color: 'info',
  },
  {
    key: 'authorization',
    text: 'Phân quyền',
    icon: <AdminPanelIcon />,
    path: '/settings/roles',
    roles: ['admin'],
    color: 'warning',
    children: [
      {
        key: 'roles',
        text: 'Vai trò',
        path: '/settings/roles',
        roles: ['admin'],
      },
      {
        key: 'permissions',
        text: 'Quyền hạn',
        path: '/settings/permissions',
        roles: ['admin'],
      },
      {
        key: 'users',
        text: 'Người dùng',
        path: '/settings/users',
        roles: ['admin'],
      },
    ],
  },
  {
    key: 'partners',
    text: t('navigation.partners'),
    icon: <PartnersIcon />,
    path: '/partners',
    roles: ['admin', 'manager', 'operator'],
    color: 'warning',
    children: [
      {
        key: 'suppliers',
        text: t('navigation.suppliers'),
        path: '/partners/suppliers',
        roles: ['admin', 'manager'],
      },
      {
        key: 'customers',
        text: t('navigation.customers'),
        path: '/partners/customers',
        roles: ['admin', 'manager', 'operator'],
      },
      {
        key: 'contracts',
        text: t('navigation.contracts'),
        path: '/partners/contracts',
        roles: ['admin', 'manager'],
      },
    ],
  },
  {
    key: 'maps',
    text: t('navigation.maps'),
    icon: <MapIcon />,
    path: '/maps',
    roles: ['admin', 'manager', 'operator', 'driver'],
    color: 'error',
  },
  {
    key: 'reports',
    text: t('navigation.reports'),
    icon: <ReportsIcon />,
    path: '/reports',
    roles: ['admin', 'manager'],
    color: 'primary',
    children: [
      {
        key: 'analytics',
        text: t('navigation.analytics'),
        path: '/reports/analytics',
        roles: ['admin', 'manager'],
      },
      {
        key: 'financial',
        text: t('navigation.financial'),
        path: '/reports/financial',
        roles: ['admin', 'manager'],
      },
      {
        key: 'performance_reports',
        text: t('navigation.performance'),
        path: '/reports/performance',
        roles: ['admin', 'manager'],
      },
    ],
  },
  {
    key: 'settings',
    text: t('navigation.settings'),
    icon: <SettingsIcon />,
    path: '/settings',
    roles: ['admin'],
    color: 'secondary',
    children: [
      {
        key: 'general',
        text: t('navigation.general_settings'),
        path: '/settings?tab=general',
        roles: ['admin'],
      },
      {
        key: 'api_integration',
        text: t('navigation.api_integration'),
        path: '/settings?tab=api',
        roles: ['admin'],
      },
      {
        key: 'security',
        text: t('navigation.security_settings'),
        path: '/settings?tab=security',
        roles: ['admin'],
      },
      {
        key: 'system',
        text: t('navigation.system_settings'),
        path: '/settings?tab=system',
        roles: ['admin'],
      },
    ],
  },
];

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasRole } = useAuth();
  const { isDarkMode, toggleDarkMode } = useThemeContext();
  const { t } = useLanguage();
  const { unreadCount } = useNotification();

  // Quick actions
  const quickActions = [
    { label: 'Tạo đơn vận chuyển', icon: <TransportIcon />, path: '/transport/new' },
    { label: 'Thêm hàng tồn kho', icon: <WarehouseIcon />, path: '/warehouse/add' },
    { label: 'Báo cáo nhanh', icon: <ReportsIcon />, path: '/reports/quick' },
    {
      label: 'Tìm kiếm',
      icon: <SearchIcon />,
      action: () => {
        /* Search functionality */
      },
    },
  ];

  // System status
  const systemStatus = {
    status: 'healthy',
    message: 'Tất cả hệ thống hoạt động bình thường',
    uptime: '99.9%',
    lastUpdate: new Date().toISOString(),
  };

  useEffect(() => {
    // Auto-collapse drawer on tablet
    if (isTablet) {
      setCollapsed(true);
    }
  }, [isTablet]);

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
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    setLoading(true);
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
    setTimeout(() => setLoading(false), 500);
  };

  const handleQuickAction = (action) => {
    if (action.path) {
      handleNavigation(action.path);
    } else if (action.action) {
      action.action();
    }
    setShowQuickActions(false);
  };

  const renderMenuItem = (item, level = 0) => {
    const tabFromUrl = new URLSearchParams(location.search).get('tab');
    const itemTab = item.path.match(/tab=(\w+)/)?.[1];
    const isActive = item.path.includes('?')
      ? location.pathname === '/settings' && tabFromUrl === itemTab
      : location.pathname.startsWith(item.path);
    const hasAccess = item.roles.some((role) => hasRole(role));

    // Auto-expand parent menu if any child is active
    const hasChildren = item.children && item.children.length > 0;
    const hasActiveChild =
      hasChildren &&
      item.children.some(
        (child) =>
          location.pathname === '/settings' &&
          new URLSearchParams(location.search).get('tab') === child.path.match(/tab=(\w+)/)?.[1]
      );
    const isExpanded = expandedItems[item.key] || hasActiveChild;

    if (!hasAccess) return null;

    return (
      <motion.div
        key={item.key}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: level * 0.1 }}
      >
        <ListItem disablePadding>
          <ListItemButton
            selected={isActive}
            onClick={() => {
              if (hasChildren) {
                setExpandedItems((prev) => ({ ...prev, [item.key]: true }));
              }
              handleNavigation(item.path);
            }}
            sx={{
              minHeight: 48,
              px: 2.5,
              pl: 2.5 + level * 2,
              '&.Mui-selected': {
                bgcolor: `${item.color}.main`,
                color: `${item.color}.contrastText`,
                '&:hover': {
                  bgcolor: `${item.color}.dark`,
                },
                '& .MuiListItemIcon-root': {
                  color: `${item.color}.contrastText`,
                },
              },
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: 3 }}>{item.icon}</ListItemIcon>
            {!collapsed && (
              <>
                <ListItemText primary={item.text} />
                {hasChildren && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
              </>
            )}
          </ListItemButton>
        </ListItem>

        {hasChildren && !collapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </motion.div>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Toolbar sx={{ minHeight: 64, position: 'relative' }}>
        <Box display="flex" alignItems="center" gap={2} sx={{ width: '100%' }}>
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
              flexShrink: 0,
            }}
          >
            MIA
          </Box>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
                Logistics
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Manager v2.0
              </Typography>
            </motion.div>
          )}
        </Box>

        {/* Collapse Toggle Button - only show on desktop */}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            display: { xs: 'none', md: 'flex' },
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          {collapsed ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
      </Toolbar>

      <Divider />

      {/* System Status */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Box sx={{ p: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Hệ thống hoạt động tốt</AlertTitle>
              <Typography variant="caption">Uptime: {systemStatus.uptime}</Typography>
            </Alert>
          </Box>
        </motion.div>
      )}

      <Divider />

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <List>{getMenuItems(t).map((item) => renderMenuItem(item))}</List>
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{ p: 2, display: { xs: 'none', md: 'block' } }}>
        {!collapsed ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card sx={{ bgcolor: 'background.paper' }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('common.need_help')}
                </Typography>
                <Button
                  size="small"
                  startIcon={<HelpIcon />}
                  onClick={() => setShowHelpDialog(true)}
                  fullWidth
                >
                  {t('common.help')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <IconButton
            onClick={() => setCollapsed(false)}
            sx={{
              width: '100%',
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ExpandMore />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  const currentPath = location.pathname;
  const pathSegments = currentPath.split('/').filter(Boolean);

  // Breadcrumb mapping for better translations
  const getBreadcrumbLabel = (segment) => {
    // Try navigation keys first
    const navigationKey = `navigation.${segment}`;
    const navigationLabel = t(navigationKey);
    if (navigationLabel !== navigationKey) {
      return navigationLabel;
    }

    // Try common keys
    const commonKey = `common.${segment}`;
    const commonLabel = t(commonKey);
    if (commonLabel !== commonKey) {
      return commonLabel;
    }

    // Special cases for common URL segments
    const specialMappings = {
      add: t('common.add'),
      edit: t('common.edit'),
      view: t('common.view'),
      details: t('common.details'),
      new: t('common.add'),
      create: t('common.add'),
      update: t('common.edit'),
    };

    return specialMappings[segment] || segment;
  };

  const breadcrumbs = pathSegments.map((segment, index) => ({
    label: getBreadcrumbLabel(segment),
    path: '/' + pathSegments.slice(0, index + 1).join('/'),
  }));

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Loading indicator */}
      {loading && (
        <Box sx={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
          <LinearProgress />
        </Box>
      )}

      {/* App Bar */}
      <AppBar
        position="fixed"
        color="primary"
        elevation={2}
        sx={{
          width: { md: `calc(100% - ${collapsed ? drawerWidthCollapsed : drawerWidth}px)` },
          ml: { md: `${collapsed ? drawerWidthCollapsed : drawerWidth}px` },
          backgroundColor: isDarkMode ? theme.palette.primary.dark : theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          boxShadow: theme.shadows[2],
          '& .MuiIconButton-root': {
            color: theme.palette.primary.contrastText,
          },
          '& .MuiSvgIcon-root': {
            color: theme.palette.primary.contrastText,
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
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

          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<ArrowRightIcon fontSize="small" sx={{ color: 'inherit' }} />}
            sx={{
              flexGrow: 1,
              color: 'inherit',
              '& .MuiLink-root': {
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                  opacity: 0.8,
                },
              },
              '& .MuiSvgIcon-root': {
                color: 'inherit',
              },
            }}
          >
            <Link
              color="inherit"
              underline="hover"
              onClick={() => handleNavigation('/dashboard')}
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <HomeIcon fontSize="small" />
              {t('navigation.home')}
            </Link>
            {breadcrumbs.map((breadcrumb, index) => (
              <Link
                key={index}
                color="inherit"
                underline="hover"
                onClick={() => handleNavigation(breadcrumb.path)}
                sx={{ cursor: 'pointer' }}
              >
                {breadcrumb.label}
              </Link>
            ))}
          </Breadcrumbs>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Quick Actions */}
            <Tooltip title={t('common.quick_actions')}>
              <IconButton
                color="inherit"
                onClick={() => setShowQuickActions(!showQuickActions)}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                <SpeedIcon />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title={t('common.notifications')}>
              <IconButton
                color="inherit"
                onClick={() => handleNavigation('/notifications')}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Theme toggle */}
            <Tooltip title={isDarkMode ? t('common.light_mode') : t('common.dark_mode')}>
              <IconButton
                color="inherit"
                onClick={toggleDarkMode}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* User menu */}
            <Tooltip title={user?.name || user?.email}>
              <IconButton
                color="inherit"
                onClick={handleUserMenuOpen}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                  },
                }}
              >
                {user?.picture ? (
                  <Avatar src={user.picture} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: collapsed ? drawerWidthCollapsed : drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
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
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: collapsed ? drawerWidthCollapsed : drawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${collapsed ? drawerWidthCollapsed : drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* User menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            handleUserMenuClose();
            handleNavigation('/profile');
          }}
        >
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('navigation.profile')} />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('auth.logout')} />
        </MenuItem>
      </Menu>

      {/* Quick Actions Dialog */}
      <Dialog
        open={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('common.quick_actions')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => handleQuickAction(action)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    {action.icon}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {action.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog
        open={showHelpDialog}
        onClose={() => setShowHelpDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('common.help_center')}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {t('common.help_welcome')}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t('common.help_description')}
          </Typography>
          {/* Add help content here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelpDialog(false)}>{t('common.close')}</Button>
        </DialogActions>
      </Dialog>

      {/* Quick Actions FAB */}
      <Zoom in={!showQuickActions}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={() => setShowQuickActions(true)}
        >
          <SpeedIcon />
        </Fab>
      </Zoom>

      {/* Loading backdrop */}
      <Backdrop sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default MainLayout;
