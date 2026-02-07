import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useCustomerList } from '../hooks';
import { CustomerCard } from './CustomerCard';

export const CustomerList: React.FC = () => {
  const { data, isLoading, error } = useCustomerList();

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
        Error loading customer: {error.message}
      </Typography>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography color="text.secondary">
        No customer found
      </Typography>
    );
  }

  return (
    <Box>
      {data.map((item) => (
        <CustomerCard key={item.id} customer={item} />
      ))}
    </Box>
  );
};
