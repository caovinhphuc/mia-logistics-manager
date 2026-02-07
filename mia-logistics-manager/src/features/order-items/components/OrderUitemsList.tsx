import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useOrderUitemsList } from '../hooks';
import { OrderUitemsCard } from './OrderUitemsCard';

export const OrderUitemsList: React.FC = () => {
  const { data, isLoading, error } = useOrderUitemsList();

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
        Error loading order-items: {error.message}
      </Typography>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography color="text.secondary">
        No order-items found
      </Typography>
    );
  }

  return (
    <Box>
      {data.map((item) => (
        <OrderUitemsCard key={item.id} order-items={item} />
      ))}
    </Box>
  );
};
