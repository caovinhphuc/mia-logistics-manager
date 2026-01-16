import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { AttachMoney, DirectionsCar, Person } from '@mui/icons-material';

interface CostCalculationDetailsProps {
  calculation: {
    distance: number;
    baseCost: number;
    fuelCost: number;
    driverCost: number;
    totalCost: number;
    costPerKm: number;
  } | null;
}

export const CostCalculationDetails: React.FC<CostCalculationDetailsProps> = ({ calculation }) => {
  if (!calculation) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Chi tiết tính toán chi phí
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DirectionsCar color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Khoảng cách: {calculation.distance.toFixed(2)} km
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <AttachMoney color="success" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Chi phí cơ bản: {formatCurrency(calculation.baseCost)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">
            Chi phí nhiên liệu: {formatCurrency(calculation.fuelCost)}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person color="info" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Chi phí tài xế: {formatCurrency(calculation.driverCost)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="primary">
              Tổng chi phí:
            </Typography>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(calculation.totalCost)}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
            ({formatCurrency(calculation.costPerKm)}/km)
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
