import { Box } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';

// Import components
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Customers from './components/customers/Customers';
import Dashboard from './components/dashboard/Dashboard';
import NotFound from './components/notfound/NotFound';
import Reports from './components/reports/Reports';
import Settings from './components/settings/Settings';
import Shipments from './components/shipments/Shipments';
import Warehouses from './components/warehouses/Warehouses';

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
                    <Route path="warehouses" element={<Warehouses />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                </Route>

                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Box>
    );
}

export default App;
