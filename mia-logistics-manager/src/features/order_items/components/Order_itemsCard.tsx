import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import type { Order_items } from '../types';

interface Order_itemsCardProps {
  order_items: Order_items;
}

export const Order_itemsCard: React.FC<Order_itemsCardProps> = ({ order_items }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{order_items.name}</Typography>
        <Chip
          label={order_items.status}
          color={order_items.status === 'active' ? 'success' : 'default'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};
