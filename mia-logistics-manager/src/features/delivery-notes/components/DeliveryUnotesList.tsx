import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useDeliveryUnotesList } from '../hooks';
import { DeliveryUnotesCard } from './DeliveryUnotesCard';

export const DeliveryUnotesList: React.FC = () => {
  const { data, isLoading, error } = useDeliveryUnotesList();

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
        Error loading delivery-notes: {error.message}
      </Typography>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography color="text.secondary">
        No delivery-notes found
      </Typography>
    );
  }

  return (
    <Box>
      {data.map((item) => (
        <DeliveryUnotesCard key={item.id} delivery-notes={item} />
      ))}
    </Box>
  );
};
