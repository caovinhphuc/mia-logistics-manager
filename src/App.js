//App.js
import { Backdrop, Box, CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

// Import contexts
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';

// Import layout components
import AuthLayout from './components/layout/AuthLayout';
import MainLayout from './components/layout/MainLayout';


// Import pages
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import Profile from './components/auth/Profile';
import TransportManagement from './components/transport/TransportManagement';
import WarehouseManagement from './components/warehouse/WarehouseManagement';
import CustomerManagement from './components/customer/CustomerManagement';
import StaffManagement from './components/staff/StaffManagement';
import PartnerManagement from './components/partners/PartnerManagement';
import MapView from './components/maps/MapView';
import NotificationCenter from './components/notifications/NotificationCenter';
import ReportsCenter from './components/reports/ReportsCenter';
import Settings from './components/settings/Settings';
import GeneralSettings from './components/settings/GeneralSettings';
import ApiIntegration from './components/settings/ApiIntegration';
import SecuritySettings from './components/settings/SecuritySettings';
import SystemSettings from './components/settings/SystemSettings';
import UIComponentsDemo from './components/ui/UIComponentsDemo';
import NotFound from './components/common/NotFound';

// Loading component
const LoadingScreen = ({ message = 'Đang tải...' }) => (
  <Backdrop open={true} sx={{ color: '#fff', zIndex: 9999 }}>
    <Box display="flex" flexDirection="column" alignItems="center">
      <CircularProgress color="inherit" size={60} />
      <Box mt={2} fontSize="16px">{message}</Box>
    </Box>
  </Backdrop>
);

// Protected Route component
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Đang xác thực..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions
  if (requiredRoles.length > 0 && user?.role) {
    const hasRequiredRole = requiredRoles.some(role =>
      user.role === role || user.role === 'admin'
    );

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

// Public Route component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Đang kiểm tra đăng nhập..." />;
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return children;
};

// Main App Component
const App = () => {
  const { isDarkMode } = useTheme();
  const { language, t } = useLanguage();
  const location = useLocation();

  // Update document title based on route
  useEffect(() => {
    const titles = {
      '/': 'Trang chủ',
      '/dashboard': 'Bảng điều khiển',
      '/transport': 'Quản lý vận chuyển',
      '/warehouse': 'Quản lý kho',
      '/staff': 'Quản lý nhân viên',
      '/partners': 'Quản lý đối tác',
      '/maps': 'Bản đồ',
      '/notifications': 'Thông báo',
      '/reports': 'Báo cáo',
      '/profile': 'Hồ sơ cá nhân',
      '/settings': 'Cài đặt',
      '/settings/general': 'Cài đặt chung',
      '/settings/api': 'Tích hợp API',
      '/settings/security': 'Cài đặt bảo mật',
      '/settings/system': 'Cài đặt hệ thống',
      '/login': 'Đăng nhập'
    };

    const currentTitle = titles[location.pathname] || 'MIA Logistics Manager';
    document.title = `${currentTitle} - MIA Logistics Manager`;
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <html lang={language} />
        <meta name="theme-color" content={isDarkMode ? '#121212' : '#1976d2'} />
        <meta name="description" content="MIA Logistics Manager - Hệ thống quản lý vận chuyển chuyên nghiệp" />
      </Helmet>

      <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Navigate to="/dashboard" replace />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/transport/*" element={
            <ProtectedRoute requiredRoles={['admin', 'manager', 'operator']}>
              <MainLayout>
                <TransportManagement />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/warehouse/*" element={
            <ProtectedRoute requiredRoles={['admin', 'manager', 'warehouse_staff']}>
              <MainLayout>
                <WarehouseManagement />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/customers/*" element={
            <ProtectedRoute requiredRoles={['admin', 'manager', 'operator']}>
              <MainLayout>
                <CustomerManagement />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/staff/*" element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <MainLayout>
                <StaffManagement />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/partners/*" element={
            <ProtectedRoute requiredRoles={['admin', 'manager', 'operator']}>
              <MainLayout>
                <PartnerManagement />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/maps" element={
            <ProtectedRoute>
              <MainLayout>
                <MapView />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/notifications" element={
            <ProtectedRoute>
              <MainLayout>
                <NotificationCenter />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/reports/*" element={
            <ProtectedRoute requiredRoles={['admin', 'manager']}>
              <MainLayout>
                <ReportsCenter />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings/*" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <MainLayout>
                <Routes>
                  <Route index element={<Settings />} />
                  <Route path="general" element={<GeneralSettings />} />
                  <Route path="api" element={<ApiIntegration />} />
                  <Route path="security" element={<SecuritySettings />} />
                  <Route path="system" element={<SystemSettings />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/ui-demo" element={
            <ProtectedRoute requiredRoles={['admin']}>
              <MainLayout>
                <UIComponentsDemo />
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Error Routes */}
          <Route path="/unauthorized" element={
            <AuthLayout>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
                <h2>Không có quyền truy cập</h2>
                <p>Bạn không có quyền truy cập vào trang này.</p>
              </Box>
            </AuthLayout>
          } />

          <Route path="*" element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          } />
        </Routes>
    </>
  );
};

export default App;
