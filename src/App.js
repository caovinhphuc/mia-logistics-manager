//App.js
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Backdrop } from '@mui/material';
import { Helmet } from 'react-helmet-async';

// Import contexts
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import { useLanguage } from './contexts/LanguageContext';
import useActivityMonitor from './hooks/useActivityMonitor';
import SessionTimeoutWarning from './components/auth/SessionTimeoutWarning';

// Import layout components
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Import lazy-loaded pages
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const Login = React.lazy(() => import('./components/auth/Login'));
const TransportManagement = React.lazy(() => import('./pages/Transport/TransportManagement'));
const WarehouseManagement = React.lazy(() => import('./components/warehouses/WarehouseManagement'));
const PartnerManagement = React.lazy(() => import('./components/partners/PartnerManagement'));
const MapView = React.lazy(() => import('./components/maps/MapView'));
const NotificationCenter = React.lazy(
  () => import('./components/notifications/NotificationCenter')
);
const ReportsCenter = React.lazy(() => import('./components/reports/ReportsCenter'));
const Profile = React.lazy(() => import('./components/auth/Profile'));
const Settings = React.lazy(() => import('./components/settings/Settings'));
const NotFound = React.lazy(() => import('./components/notfound/NotFound'));

// Import Inbound Components
const InboundDomestic = React.lazy(() => import('./components/inbound/InboundDomestic'));
const InboundInternational = React.lazy(() => import('./components/inbound/InboundInternational'));
// Use advanced, production-ready InboundSchedule (backup version)
const InboundSchedule = React.lazy(() => import('./components/inbound-backup/InboundSchedule'));
const InboundReports = React.lazy(() => import('./components/inbound/InboundReports'));

// Import Carriers (features-based)
const CarriersManagement = React.lazy(() => import('./features/carriers/components/CarriersList'));

// Import Transfers Components
const TransfersManagement = React.lazy(
  () => import('./features/transfers/components/TransferList')
);

// Import Transport Components
const VolumeCalculator = React.lazy(
  () => import('./components/volumerules/components/VolumeCalculator')
);
const LocationsList = React.lazy(() => import('./features/locations/components/LocationsList'));
const TransportRoutes = React.lazy(() => import('./pages/Transport/Routes'));
const TransportRequestsSheet = React.lazy(
  () => import('./features/shipments/components/TransportRequestsSheet')
);
const Vehicles = React.lazy(() => import('./pages/Transport/Vehicles'));
const PendingDelivery = React.lazy(() => import('./features/shipments/components/PendingDelivery'));

// Import Warehouse Components
const Inventory = React.lazy(() => import('./pages/Warehouse/Inventory'));
const WarehouseOrders = React.lazy(() => import('./pages/Warehouse/Orders'));
const WarehouseLocations = React.lazy(() => import('./pages/Warehouse/Locations'));
const WarehouseTransfers = React.lazy(() => import('./pages/Warehouse/WarehouseTransfers'));

// Import Partners Components
const Suppliers = React.lazy(() => import('./pages/Partners/Suppliers'));
const Customers = React.lazy(() => import('./pages/Partners/Customers'));
const Contracts = React.lazy(() => import('./pages/Partners/Contracts'));

// Import Reports Components
const Analytics = React.lazy(() => import('./pages/Reports/Analytics'));
const Financial = React.lazy(() => import('./pages/Reports/Financial'));
const Performance = React.lazy(() => import('./pages/Reports/Performance'));

// Import Settings Components (General/Api/Security/System → redirect to /settings?tab=)
const Roles = React.lazy(() => import('./pages/Settings/Roles'));
const Permissions = React.lazy(() => import('./pages/Settings/Permissions'));
const Users = React.lazy(() => import('./pages/Settings/Users'));

// Import Employees Component
const Employees = React.lazy(() => import('./pages/Employees/Employees'));

// Loading component
const LoadingScreen = ({ message = 'Đang tải...' }) => (
  <Backdrop open={true} sx={{ color: '#fff', zIndex: 9999 }}>
    <Box display="flex" flexDirection="column" alignItems="center">
      <CircularProgress color="inherit" size={60} />
      <Box mt={2} fontSize="16px">
        {message}
      </Box>
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
    const hasRequiredRole = requiredRoles.some(
      (role) => user.role === role || user.role === 'admin'
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
  const { language } = useLanguage();
  const location = useLocation();

  // Enable activity monitoring for session management
  useActivityMonitor(true);

  // Update document title based on route
  useEffect(() => {
    const titles = {
      '/': 'Trang chủ',
      '/dashboard': 'Bảng điều khiển',
      '/transport': 'Quản lý vận chuyển',
      '/warehouse': 'Quản lý kho',
      '/partners': 'Quản lý đối tác',
      '/maps': 'Bản đồ',
      '/notifications': 'Thông báo',
      '/reports': 'Báo cáo',
      '/profile': 'Hồ sơ cá nhân',
      '/settings': 'Cài đặt',
      '/login': 'Đăng nhập',
      '/inbound-domestic': 'Nhập hàng quốc nội',
      '/inbound-international': 'Nhập hàng quốc tế',
      '/inbound-schedule': 'Lịch trình nhập hàng',
      '/inbound-reports': 'Báo cáo nhập hàng',
      '/carriers': 'Quản lý nhà vận chuyển',
      '/transport/volume-rules': 'Quy tắc tính khối',
      '/transport/locations-saved': 'Địa điểm lưu',
      '/transport/requests': 'Đề nghị vận chuyển',
      '/transport/routes': 'Quản lý tuyến đường',
      '/transport/vehicles': 'Quản lý phương tiện',
      '/transport/pending-delivery': 'Chờ chuyển giao',
      '/warehouse/inventory': 'Quản lý tồn kho',
      '/warehouse/orders': 'Quản lý đơn hàng kho',
      '/warehouse/locations': 'Vị trí kho',
      '/warehouse/transfers': 'Phiếu chuyển kho',
      '/partners/suppliers': 'Quản lý nhà cung cấp',
      '/partners/customers': 'Quản lý khách hàng',
      '/partners/contracts': 'Quản lý hợp đồng',
      '/reports/analytics': 'Phân tích dữ liệu',
      '/reports/financial': 'Báo cáo tài chính',
      '/reports/performance': 'Báo cáo hiệu suất',
      '/settings/general': 'Cài đặt chung',
      '/settings/api': 'Tích hợp API',
      '/settings/security': 'Bảo mật hệ thống',
      '/settings/system': 'Cài đặt hệ thống',
      '/settings/roles': 'Quản lý vai trò',
      '/settings/permissions': 'Quản lý quyền hạn',
      '/settings/users': 'Quản lý người dùng',
      '/employees': 'Quản lý nhân sự',
    };

    const currentTitle = titles[location.pathname] || 'MIA Logistics Manager';
    document.title = `${currentTitle} - MIA Logistics Manager`;
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <html lang={language} />
        <meta name="theme-color" content={isDarkMode ? '#121212' : '#1976d2'} />
        <meta
          name="description"
          content="MIA Logistics Manager - Hệ thống quản lý vận chuyển chuyên nghiệp"
        />
      </Helmet>

      {/* Session Timeout Warning Dialog */}
      <SessionTimeoutWarning />

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthLayout>
                  <Login />
                </AuthLayout>
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Navigate to="/dashboard" replace />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transport/*"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'operator']}>
                <MainLayout>
                  <TransportManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/warehouse/*"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'warehouse_staff']}>
                <MainLayout>
                  <WarehouseManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/partners/*"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'operator']}>
                <MainLayout>
                  <PartnerManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/maps"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MapView />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <NotificationCenter />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/*"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <MainLayout>
                  <ReportsCenter />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Inbound Routes */}
          <Route
            path="/inbound-domestic"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'warehouse_staff']}>
                <MainLayout>
                  <InboundDomestic />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/inbound-international"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'warehouse_staff']}>
                <MainLayout>
                  <InboundInternational />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/inbound-schedule"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'warehouse_staff']}>
                <MainLayout>
                  <InboundSchedule />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/inbound-reports"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <MainLayout>
                  <InboundReports />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Carriers Routes */}
          <Route
            path="/carriers"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'operator']}>
                <MainLayout>
                  <CarriersManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Transfers Routes */}
          <Route
            path="/transfers"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'warehouse_staff']}>
                <MainLayout>
                  <TransfersManagement />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transport/requests"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'operator']}>
                <MainLayout>
                  <TransportRequestsSheet />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transport/volume-rules"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'operator']}>
                <MainLayout>
                  <VolumeCalculator />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transport/locations-saved"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'operator']}>
                <MainLayout>
                  <LocationsList />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transport/routes"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <MainLayout>
                  <TransportRoutes />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transport/vehicles"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <MainLayout>
                  <Vehicles />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/transport/pending-delivery"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'operator']}>
                <MainLayout>
                  <PendingDelivery />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Warehouse Routes */}
          <Route
            path="/warehouse/inventory"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'warehouse_staff']}>
                <MainLayout>
                  <Inventory />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/warehouse/orders"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <MainLayout>
                  <WarehouseOrders />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/warehouse/locations"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <MainLayout>
                  <WarehouseLocations />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/warehouse/transfers"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'warehouse_staff']}>
                <MainLayout>
                  <WarehouseTransfers />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Partners Routes */}
          <Route
            path="/partners/suppliers"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <MainLayout>
                  <Suppliers />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/partners/customers"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'operator']}>
                <MainLayout>
                  <Customers />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/partners/contracts"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <MainLayout>
                  <Contracts />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Reports Routes */}
          <Route
            path="/reports/analytics"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <MainLayout>
                  <Analytics />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/financial"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <MainLayout>
                  <Financial />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports/performance"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager']}>
                <MainLayout>
                  <Performance />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Settings sub-routes → redirect to /settings?tab= (đồng bộ với trang tab) */}
          <Route
            path="/settings/general"
            element={<Navigate to="/settings?tab=general" replace />}
          />
          <Route path="/settings/api" element={<Navigate to="/settings?tab=api" replace />} />
          <Route
            path="/settings/security"
            element={<Navigate to="/settings?tab=security" replace />}
          />
          <Route path="/settings/system" element={<Navigate to="/settings?tab=system" replace />} />

          <Route
            path="/settings/roles"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <MainLayout>
                  <Roles />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/permissions"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <MainLayout>
                  <Permissions />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/users"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <MainLayout>
                  <Users />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Employees Routes */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute requiredRoles={['admin', 'manager', 'hr']}>
                <MainLayout>
                  <Employees />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Error Routes */}
          <Route
            path="/unauthorized"
            element={
              <AuthLayout>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="100vh"
                >
                  <h2>Không có quyền truy cập</h2>
                  <p>Bạn không có quyền truy cập vào trang này.</p>
                </Box>
              </AuthLayout>
            }
          />

          <Route
            path="*"
            element={
              <MainLayout>
                <NotFound />
              </MainLayout>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
