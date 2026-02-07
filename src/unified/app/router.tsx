import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import MainLayout from '../shared/layout/MainLayout';
import { useAuth } from '../../contexts/AuthContext';

const Login = lazy(() => import('../../components/auth/Login'));
// Trang Cài đặt 7 tab (cùng component với app chính – không phụ thuộc API settings)
const SettingsPage = lazy(() => import('../../components/settings/Settings'));

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
    <CircularProgress />
  </Box>
);

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const Placeholder = ({ title }: { title: string }) => (
  <Box p={3}>
    <h2>{title}</h2>
    <p>Nội dung đang được xây dựng.</p>
  </Box>
);

const UnifiedRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Placeholder title="Tổng quan" />} />
          <Route path="dashboard" element={<Placeholder title="Dashboard" />} />
          <Route path="orders" element={<Placeholder title="Đơn hàng" />} />
          <Route path="warehouse" element={<Placeholder title="Kho vận" />} />
          <Route path="reports" element={<Placeholder title="Báo cáo" />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default UnifiedRouter;
