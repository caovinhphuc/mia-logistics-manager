import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useInvoicesList } from '../hooks';
import { InvoicesCard } from './InvoicesCard';

export const InvoicesList: React.FC = () => {
  const { data, isLoading, error } = useInvoicesList();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error loading invoices: {error.message}</Typography>;
  }

  if (!data || data.length === 0) {
    return <Typography color="text.secondary">No invoices found</Typography>;
  }

  return (
    <Box>
      {data.map((item) => (
        <InvoicesCard key={item.id} invoices={item} />
      ))}
    </Box>
  );
};
