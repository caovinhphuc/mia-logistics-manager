// AppRouter.jsx - Quản lý routing tập trung
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import { useLayout } from '../context/LayoutContext';

// Layout Components
import WarehouseDashboard from '../components/WarehouseDashboard';
import MainLayout from '../components/layout/ModulesDemo';

// Module Components
import OverviewTab from '../module/OverviewTab';
import OrderTab from '../module/OrderTab';
import StaffTab from '../module/StaffTab';
import ScheduleTab from '../module/ScheduleTab';
import PerformanceTab from '../module/PerformanceTab';
import PickingTab from '../module/PickingTab';
import HistoryTab from '../module/HistoryTab';
import AlertsTab from '../module/AlertsTab';
import SettingsTab from '../module/SettingsTab';

// Route Configuration
const routes = [
  {
    path: '/',
    element: WarehouseDashboard,
    isLayout: true
  },
  {
    path: '/dashboard',
    element: OverviewTab,
    title: 'Dashboard'
  },
  {
    path: '/orders',
    element: OrderTab,
    title: 'Quản lý đơn hàng'
  },
  {
    path: '/staff',
    element: StaffTab,
    title: 'Quản lý nhân viên'
  },
  {
    path: '/staff/schedule',
    element: ScheduleTab,
    title: 'Lịch làm việc'
  },
  {
    path: '/staff/performance',
    element: PerformanceTab,
    title: 'Hiệu suất'
  },
  {
    path: '/picking',
    element: PickingTab,
    title: 'Picking'
  },
  {
    path: '/history',
    element: HistoryTab,
    title: 'Lịch sử'
  },
  {
    path: '/alerts',
    element: AlertsTab,
    title: 'Cảnh báo'
  },
  {
    path: '/settings',
    element: SettingsTab,
    title: 'Cài đặt'
  }
];

const AppRouter = () => {
  const { themeClasses, darkMode } = useLayout();

  const renderRoute = (route) => {
    const Component = route.element;

    if (route.isLayout) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <ErrorBoundary componentName={Component.name}>
              <Component />
            </ErrorBoundary>
          }
        />
      );
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <ErrorBoundary componentName={Component.name}>
            <MainLayout title={route.title}>
              <Component
                themeClasses={themeClasses}
                darkMode={darkMode}
              />
            </MainLayout>
          </ErrorBoundary>
        }
      />
    );
  };

  return (
    <Routes>
      {routes.map(renderRoute)}
      {/* Redirect unknown routes to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
