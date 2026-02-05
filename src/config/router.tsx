import ForgotPasswordPage from '@/components/ForgotPasswordPage';
import LoginPage from '@/components/LoginPage';
import RegisterPage from '@/components/RegisterPage';
import { SecurityGuard } from '@/components/security/SecurityGuard';
import CarriersList from '@/features/carriers/components/CarriersList';
import Dashboard from '@/features/dashboard/Dashboard';
import AuthorizationGuide from '@/features/docs/AuthorizationGuide';
import { Employees } from '@/features/employees/Employees';
import EmployeesMigrated from '@/features/employees/EmployeesMigrated';
import EmployeesMigratedSimple from '@/features/employees/EmployeesMigratedSimple';
import InboundDomestic from '@/features/inbound/InboundDomestic';
import InboundInternational from '@/features/inbound/InboundInternational';
import InboundReports from '@/features/inbound/InboundReports';
import InboundSchedule from '@/features/inbound/InboundSchedule';
import InventoryManager from '@/features/inventory/components/InventoryManager';
import LocationsList from '@/features/locations/components/LocationsList';
import Logs from '@/features/logs/Logs';
import AuthorizationPermissions from '@/features/settings/AuthorizationPermissions';
import AuthorizationRoles from '@/features/settings/AuthorizationRoles';
import AuthorizationUsers from '@/features/settings/AuthorizationUsers';
import Settings from '@/features/settings/Settings';
import PendingTransfer from '@/features/shipments/components/PendingTransfer';
import TransportRequests from '@/features/shipments/components/TransportRequests';
import TransportRequestsSheet from '@/features/shipments/components/TransportRequestsSheet';
import VolumeCalculator from '@/features/shipments/components/VolumeCalculator';
import TrackingDashboard from '@/features/tracking/components/TrackingDashboard';
import TransferList from '@/features/transfers/components/TransferList';
import AdminPage from '@/pages/AdminPage';
import Layout from '@/shared/components/layout/Layout';
import { requirePermission } from '@/shared/utils/auth';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/employees-migrated',
    element: <EmployeesMigrated />,
  },
  {
    path: '/employees-migrated-simple',
    element: <EmployeesMigratedSimple />,
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: (
      <div className="error-page">
        Có lỗi xảy ra khi tải trang. Vui lòng thử lại hoặc báo cho quản trị.
      </div>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'admin',
        element: (
          <SecurityGuard requireAuth={true}>
            <AdminPage />
          </SecurityGuard>
        ),
      },
      {
        path: 'shipments',
        element: requirePermission('transportRequests', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <TransportRequestsSheet />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: 'shipments/pending-transfer',
        element: (
          <SecurityGuard requireAuth={true}>
            <PendingTransfer />
          </SecurityGuard>
        ),
      },
      {
        path: 'shipments/transport-requests',
        element: requirePermission('transportRequests', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <TransportRequests />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: 'shipments/transport-sheet',
        element: (
          <SecurityGuard requireAuth={true}>
            <Navigate to="/shipments" replace />
          </SecurityGuard>
        ),
      },
      {
        path: 'locations',
        element: requirePermission('locations', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <LocationsList />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: 'inventory',
        element: (
          <SecurityGuard requireAuth={true}>
            <InventoryManager />
          </SecurityGuard>
        ),
      },
      {
        path: 'transfers',
        element: requirePermission('transfers', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <TransferList />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: 'carriers',
        element: requirePermission('carriers', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <CarriersList />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: 'employees',
        element: <Employees />,
      },
      {
        path: 'tracking',
        element: (
          <SecurityGuard requireAuth={true}>
            <TrackingDashboard />
          </SecurityGuard>
        ),
      },
      {
        path: 'settings',
        element: (
          <SecurityGuard requireAuth={true}>
            <Settings />
          </SecurityGuard>
        ),
      },
      {
        path: 'shipments/volume-calculator',
        element: (
          <SecurityGuard requireAuth={true}>
            <VolumeCalculator />
          </SecurityGuard>
        ),
      },
      {
        path: 'authorization/roles',
        element: requirePermission('settings', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <AuthorizationRoles />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: 'authorization/permissions',
        element: requirePermission('settings', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <AuthorizationPermissions />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: 'authorization/users',
        element: requirePermission('settings', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <AuthorizationUsers />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: 'authorization',
        element: <Navigate to="/authorization/roles" replace />,
      },
      {
        path: 'logs',
        element: requirePermission('settings', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <Logs />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: 'guide/authorization',
        element: (
          <SecurityGuard requireAuth={true}>
            <AuthorizationGuide />
          </SecurityGuard>
        ),
      },
      {
        path: 'inbound',
        element: <Navigate to="/inbound/schedule" replace />,
      },
      {
        path: 'inbound/international',
        element: requirePermission('inbound-international', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <InboundInternational />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: 'inbound/domestic',
        element: requirePermission('inbound-domestic', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <InboundDomestic />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
      {
        path: 'inbound/schedule',
        element: (
          <SecurityGuard requireAuth={true}>
            <InboundSchedule />
          </SecurityGuard>
        ),
      },
      {
        path: 'inbound/reports',
        element: requirePermission('inbound-schedule', 'view') ? (
          <SecurityGuard requireAuth={true}>
            <InboundReports />
          </SecurityGuard>
        ) : (
          <Navigate to="/" replace />
        ),
      },
    ],
  },
]);
