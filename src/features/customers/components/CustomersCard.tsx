import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import type { Customers } from '../types';

interface CustomersCardProps {
  customers: Customers;
}

export const CustomersCard: React.FC<CustomersCardProps> = ({ customers }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{customers.name}</Typography>
        <Chip
          label={customers.status}
          color={customers.status === 'active' ? 'success' : 'default'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};
