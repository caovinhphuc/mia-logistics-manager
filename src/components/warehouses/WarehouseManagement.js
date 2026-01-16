import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add,
  Warehouse,
  Inventory,
  TrendingUp,
  TrendingDown,
  Edit,
  Delete,
} from '@mui/icons-material';

import TransferList from '../transfers/components/TransferList';

const WarehouseManagement = () => {
  const location = useLocation();
  const [warehouses] = useState([]);
  const [inventory] = useState([]);

  // Route to transfers sub-page (Phiếu chuyển kho)
  if (location.pathname === '/warehouse/transfers') {
    return <TransferList />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý kho hàng
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<Add />} sx={{ mr: 2 }}>
            Thêm sản phẩm
          </Button>
          <Button variant="contained" startIcon={<Warehouse />}>
            Thêm kho
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Warehouse Statistics */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warehouse sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">Tổng kho</Typography>
              <Typography variant="h4" color="primary">
                {warehouses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Inventory sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6">Tổng sản phẩm</Typography>
              <Typography variant="h4" color="info.main">
                {inventory.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6">Hàng nhập</Typography>
              <Typography variant="h4" color="success.main">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingDown sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6">Hàng xuất</Typography>
              <Typography variant="h4" color="warning.main">
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Warehouse List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Danh sách kho
            </Typography>
            {warehouses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="textSecondary">Chưa có kho nào được tạo</Typography>
              </Box>
            ) : (
              <List>
                {warehouses.map((warehouse) => (
                  <ListItem key={warehouse.id}>
                    <ListItemText
                      primary={warehouse.name}
                      secondary={`${warehouse.address} - Sức chứa: ${warehouse.capacity}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="primary" sx={{ mr: 1 }}>
                        <Edit />
                      </IconButton>
                      <IconButton edge="end" color="error">
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Inventory Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tình trạng tồn kho
            </Typography>
            {inventory.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="textSecondary">Chưa có sản phẩm trong kho</Typography>
              </Box>
            ) : (
              <List>
                {inventory.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(item.currentStock / item.maxStock) * 100}
                                color={
                                  item.currentStock / item.maxStock > 0.7
                                    ? 'success'
                                    : item.currentStock / item.maxStock > 0.3
                                      ? 'warning'
                                      : 'error'
                                }
                              />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                              <Typography variant="body2" color="text.secondary">
                                {`${item.currentStock}/${item.maxStock}`}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WarehouseManagement;
