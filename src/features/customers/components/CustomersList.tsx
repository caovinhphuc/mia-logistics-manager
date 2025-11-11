import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useCustomersList } from '../hooks';
import { CustomersCard } from './CustomersCard';

export const CustomersList: React.FC = () => {
  const { data, isLoading, error } = useCustomersList();

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
        Error loading customers: {error.message}
      </Typography>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography color="text.secondary">
        No customers found
      </Typography>
    );
  }

  return (
    <Box>
      {data.map((item) => (
        <CustomersCard key={item.id} customers={item} />
      ))}
    </Box>
  );
};
