import React from 'react';
import { Box, Typography, Paper, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddIcon from '@mui/icons-material/Add';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Carriers = () => {
  const carriers = [
    {
      id: 1,
      name: 'Vận tải Minh Phát',
      avatar: '🚛',
      phone: '0901234567',
      email: 'minhphat@transport.com',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      serviceAreas: 'TP.HCM, Đồng Nai, Bình Dương',
      vehicleTypes: 'Xe tải 5 tấn, Xe container',
      status: 'active',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Logistics Thành Đạt',
      avatar: '🚚',
      phone: '0907654321',
      email: 'thanhdat@logistics.com',
      address: '456 Đường XYZ, Quận 3, TP.HCM',
      serviceAreas: 'Toàn quốc',
      vehicleTypes: 'Xe tải nhỏ, Xe van',
      status: 'active',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Chuyển phát Hòa Bình',
      avatar: '📦',
      phone: '0909876543',
      email: 'hoabinh@express.com',
      address: '789 Đường DEF, Quận 7, TP.HCM',
      serviceAreas: 'Miền Nam',
      vehicleTypes: 'Xe máy, Xe tải nhỏ',
      status: 'inactive',
      rating: 4.2
    }
  ];

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'default';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Hoạt động' : 'Tạm dừng';
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <LocalShippingIcon sx={{ fontSize: 32, color: '#1976d2', mr: 1 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
            Nhà vận chuyển
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ px: 3, py: 1.5 }}
        >
          Thêm nhà vận chuyển
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center', boxShadow: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {carriers.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng nhà vận chuyển
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center', boxShadow: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              {carriers.filter(c => c.status === 'active').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đang hoạt động
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center', boxShadow: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
              4.5
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đánh giá trung bình
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: 'center', boxShadow: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
              156
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chuyến hàng tháng này
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Carriers List */}
      <Grid container spacing={3}>
        {carriers.map((carrier) => (
          <Grid item xs={12} md={6} lg={4} key={carrier.id}>
            <Card sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="h3" sx={{ mr: 2 }}>
                    {carrier.avatar}
                  </Typography>
                  <Box flex={1}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {carrier.name}
                    </Typography>
                    <Chip 
                      label={getStatusText(carrier.status)}
                      color={getStatusColor(carrier.status)}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box mb={2}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <PhoneIcon sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                    <Typography variant="body2">{carrier.phone}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <EmailIcon sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                    <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                      {carrier.email}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="flex-start" mb={1}>
                    <LocationOnIcon sx={{ fontSize: 16, color: '#666', mr: 1, mt: 0.2 }} />
                    <Typography variant="body2">{carrier.address}</Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    Khu vực phục vụ:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {carrier.serviceAreas}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    Loại xe:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {carrier.vehicleTypes}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" sx={{ mr: 1 }}>Đánh giá:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                      ⭐ {carrier.rating}
                    </Typography>
                  </Box>
                  <Button size="small" variant="outlined">
                    Chi tiết
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Carriers;