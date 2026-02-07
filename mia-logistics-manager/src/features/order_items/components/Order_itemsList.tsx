import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useOrder_itemsList } from '../hooks';
import { Order_itemsCard } from './Order_itemsCard';

export const Order_itemsList: React.FC = () => {
  const { data, isLoading, error } = useOrder_itemsList();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error">
        Error loading order_items: {error.message}
      </Typography>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography color="text.secondary">
        No order_items found
      </Typography>
    );
  }

  return (
    <Box>
      {data.map((item) => (
        <Order_itemsCard key={item.id} order_items={item} />
      ))}
    </Box>
  );
};
