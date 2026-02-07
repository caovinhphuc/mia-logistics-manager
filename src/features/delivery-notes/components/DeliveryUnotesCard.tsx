import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import type { DeliveryUnotes } from '../types';

interface DeliveryUnotesCardProps {
  delivery-notes: DeliveryUnotes;
}

export const DeliveryUnotesCard: React.FC<DeliveryUnotesCardProps> = ({ delivery-notes }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{delivery-notes.name}</Typography>
        <Chip
          label={delivery-notes.status}
          color={delivery-notes.status === 'active' ? 'success' : 'default'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};
