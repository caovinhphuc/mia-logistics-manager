import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import type { Analytics } from '../types';

interface AnalyticsCardProps {
  analytics: Analytics;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ analytics }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{analytics.name}</Typography>
        <Chip
          label={analytics.status}
          color={analytics.status === 'active' ? 'success' : 'default'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};
