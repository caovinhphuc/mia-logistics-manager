import { Box } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';

// Import components
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Customers from './pages/Customers/Customers';
import Dashboard from './pages/Dashboard/Dashboard';
import NotFound from './pages/NotFound/NotFound';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import Shipments from './pages/Shipments/Shipments';
import Warehouses from './pages/Warehouses/Warehouses';

// Import Transport components
import Locations from './pages/Locations/LocationsList.tsx';
import Carriers from './pages/Transport/Carriers/Carriers';
import VolumeTable from './pages/Transport/VolumeTable/VolumeTable';

// Import hooks
import { useAuth } from './hooks/useAuth';

// Loading component
const LoadingSpinner = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <div>Đang tải...</div>
  </Box>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="shipments" element={<Shipments />} />

            {/* Transport routes */}
            <Route path="transport/carriers" element={<Carriers />} />
            <Route path="transport/locations" element={<Locations />} />
            <Route path="transport/volume-table" element={<VolumeTable />} />

            <Route path="warehouses" element={<Warehouses />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </ErrorBoundary>
  );
}

export default App;
