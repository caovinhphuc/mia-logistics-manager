import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import type { Invoices } from '../types';

interface InvoicesCardProps {
  invoices: Invoices;
}

export const InvoicesCard: React.FC<InvoicesCardProps> = ({ invoices }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{invoices.name}</Typography>
        <Chip
          label={invoices.status}
          color={invoices.status === 'active' ? 'success' : 'default'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};
