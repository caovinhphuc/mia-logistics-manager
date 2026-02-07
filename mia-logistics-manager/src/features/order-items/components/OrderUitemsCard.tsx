import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import type { OrderUitems } from '../types';

interface OrderUitemsCardProps {
  order-items: OrderUitems;
}

export const OrderUitemsCard: React.FC<OrderUitemsCardProps> = ({ order-items }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{order-items.name}</Typography>
        <Chip
          label={order-items.status}
          color={order-items.status === 'active' ? 'success' : 'default'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};
