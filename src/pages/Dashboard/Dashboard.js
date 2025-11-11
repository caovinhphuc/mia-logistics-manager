import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Typography,
} from '@mui/material';

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%', boxShadow: 2 }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color }}>
            {value}
          </Typography>
          {trend && (
            <Chip
              label={trend}
              size="small"
              color="success"
              icon={<TrendingUpIcon />}
              sx={{ mt: 1 }}
            />
          )}
        </Box>
        <Box sx={{ color, fontSize: 40 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const stats = [
    {
      title: 'Tổng đơn hàng',
      value: '1,234',
      icon: <LocalShippingIcon fontSize="inherit" />,
      color: '#1976d2',
      trend: '+12%',
    },
    {
      title: 'Kho hàng',
      value: '15',
      icon: <WarehouseIcon fontSize="inherit" />,
      color: '#2e7d32',
      trend: '+2',
    },
    {
      title: 'Khách hàng',
      value: '567',
      icon: <PeopleIcon fontSize="inherit" />,
      color: '#ed6c02',
      trend: '+8%',
    },
    {
      title: 'Doanh thu (VND)',
      value: '2.5M',
      icon: <TrendingUpIcon fontSize="inherit" />,
      color: '#9c27b0',
      trend: '+15%',
    },
  ];

  const recentShipments = [
    { id: 'SH001', customer: 'Công ty ABC', status: 'Đang vận chuyển', date: '07/10/2025' },
    { id: 'SH002', customer: 'Công ty XYZ', status: 'Đã giao', date: '06/10/2025' },
    { id: 'SH003', customer: 'Công ty DEF', status: 'Chuẩn bị', date: '07/10/2025' },
    { id: 'SH004', customer: 'Công ty GHI', status: 'Đang vận chuyển', date: '05/10/2025' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã giao': return 'success';
      case 'Đang vận chuyển': return 'primary';
      case 'Chuẩn bị': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
        Tổng quan hệ thống
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Shipments */}
      <Paper sx={{ p: 3, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Đơn hàng gần đây
        </Typography>

        <Box>
          {recentShipments.map((shipment) => (
            <Box
              key={shipment.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
                borderBottom: '1px solid #e0e0e0',
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {shipment.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {shipment.customer}
                </Typography>
              </Box>

              <Box textAlign="center">
                <Chip
                  label={shipment.status}
                  color={getStatusColor(shipment.status)}
                  size="small"
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {shipment.date}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
