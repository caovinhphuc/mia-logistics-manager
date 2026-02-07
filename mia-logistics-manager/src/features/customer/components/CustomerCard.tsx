import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import type { Customer } from '../types';

interface CustomerCardProps {
  customer: Customer;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{customer.name}</Typography>
        <Chip
          label={customer.status}
          color={customer.status === 'active' ? 'success' : 'default'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};
