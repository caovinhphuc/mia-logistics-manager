import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import {
  useDashboardAlerts,
  useDashboardData,
  useDeliveryMetrics,
  useOrderMetrics,
  useWarehouseMetrics,
} from '../hooks'
import type { DashboardFilterParams } from '../types'
import { AlertCard } from './AlertCard'
import { StatCard } from './StatCard'

interface DashboardProps {
  filters?: DashboardFilterParams
}

const StatisticGrid = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(4, 1fr)',
      },
      gap: 2,
    }}
  >
    {children}
  </Box>
)

const OrderMetricsGrid = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(5, 1fr)',
      },
      gap: 2,
    }}
  >
    {children}
  </Box>
)

const MetricsGrid = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        md: 'repeat(2, 1fr)',
      },
      gap: 3,
    }}
  >
    {children}
  </Box>
)

export const Dashboard: React.FC<DashboardProps> = ({ filters }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today')

  // Fetch data
  const dashboardQuery = useDashboardData(filters)
  const ordersQuery = useOrderMetrics(filters)
  const deliveryQuery = useDeliveryMetrics(filters)
  const warehouseQuery = useWarehouseMetrics(filters)
  const alertsQuery = useDashboardAlerts()

  const isLoading =
    dashboardQuery.isLoading ||
    ordersQuery.isLoading ||
    deliveryQuery.isLoading ||
    warehouseQuery.isLoading

  const error =
    dashboardQuery.error || ordersQuery.error || deliveryQuery.error || warehouseQuery.error

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">Failed to load dashboard data. Please refresh the page.</Alert>
  }

  const data = dashboardQuery.data
  const alerts = alertsQuery.data || []

  if (!data) {
    return <Alert severity="info">No data available. Please check your configuration.</Alert>
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          📊 Logistics Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Real-time metrics and insights for your logistics operations
        </Typography>

        {/* Period Selector */}
        <Stack direction="row" spacing={1}>
          <Button
            variant={selectedPeriod === 'today' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setSelectedPeriod('today')}
          >
            Today
          </Button>
          <Button
            variant={selectedPeriod === 'week' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setSelectedPeriod('week')}
          >
            This Week
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setSelectedPeriod('month')}
          >
            This Month
          </Button>
        </Stack>
      </Box>

      {/* Alerts Section */}
      {alerts && alerts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            🚨 Active Alerts ({alerts.length})
          </Typography>
          <Stack spacing={1}>
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </Stack>
        </Box>
      )}

      {/* Key Statistics */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Key Statistics
        </Typography>
        <StatisticGrid>
          <StatCard
            title="Total Orders"
            value={data.stats.totalOrders}
            icon="📦"
            color="#3f51b5"
            trend={5}
          />
          <StatCard
            title="Active Deliveries"
            value={data.stats.activeDeliveries}
            icon="🚚"
            color="#ff9800"
            trend={2}
          />
          <StatCard
            title="Completed Today"
            value={data.stats.completedToday}
            icon="✅"
            color="#4caf50"
            trend={12}
          />
          <StatCard
            title="On-Time Rate"
            value={`${data.stats.onTimePercentage}%`}
            icon="⏱️"
            color="#9c27b0"
            trend={-1}
          />
        </StatisticGrid>
      </Box>

      {/* Order Metrics */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Order Status Breakdown
        </Typography>
        <OrderMetricsGrid>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h5">{ordersQuery.data?.pending || 0}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Processing
              </Typography>
              <Typography variant="h5">{ordersQuery.data?.processing || 0}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h5">{ordersQuery.data?.completed || 0}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Cancelled
              </Typography>
              <Typography variant="h5">{ordersQuery.data?.cancelled || 0}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="text.secondary" gutterBottom>
                Delayed
              </Typography>
              <Typography variant="h5">{ordersQuery.data?.delayed || 0}</Typography>
            </CardContent>
          </Card>
        </OrderMetricsGrid>
      </Box>

      {/* Delivery & Warehouse Metrics */}
      <MetricsGrid>
        {/* Delivery Metrics */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            🚛 Delivery Performance
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>In Transit</Typography>
              <Typography fontWeight="bold">{deliveryQuery.data?.inTransit || 0}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Delivered</Typography>
              <Typography fontWeight="bold" sx={{ color: '#4caf50' }}>
                {deliveryQuery.data?.delivered || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Failed</Typography>
              <Typography fontWeight="bold" sx={{ color: '#f44336' }}>
                {deliveryQuery.data?.failed || 0}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pt: 1,
                borderTop: '1px solid #ddd',
              }}
            >
              <Typography>Avg. Time</Typography>
              <Typography fontWeight="bold">{deliveryQuery.data?.averageTime || 0} min</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Warehouse Metrics */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            📦 Warehouse Status
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Total Items</Typography>
              <Typography fontWeight="bold">{warehouseQuery.data?.totalItems || 0}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Low Stock</Typography>
              <Typography fontWeight="bold" sx={{ color: '#ff9800' }}>
                {warehouseQuery.data?.lowStockItems || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Out of Stock</Typography>
              <Typography fontWeight="bold" sx={{ color: '#f44336' }}>
                {warehouseQuery.data?.outOfStockItems || 0}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                pt: 1,
                borderTop: '1px solid #ddd',
              }}
            >
              <Typography>Utilization</Typography>
              <Typography fontWeight="bold">
                {warehouseQuery.data?.utilizationRate || 0}%
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </MetricsGrid>

      {/* Recent Orders */}
      {data.recentOrders && data.recentOrders.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Recent Orders
          </Typography>
          <Paper sx={{ overflowX: 'auto' }}>
            <Box sx={{ p: 2 }}>
              {data.recentOrders.map((order) => (
                <Box
                  key={order.orderId}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    px: 2,
                    borderBottom: '1px solid #eee',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight="bold">{order.orderId}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.customerName} → {order.destination}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '4px',
                      backgroundColor:
                        order.status === 'delivered'
                          ? '#c8e6c9'
                          : order.status === 'in_transit'
                            ? '#fff9c4'
                            : '#ffccbc',
                    }}
                  >
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      )}
    </Container>
  )
}

export default Dashboard
