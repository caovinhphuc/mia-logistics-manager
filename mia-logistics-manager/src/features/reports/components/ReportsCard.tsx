import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import type { Reports } from '../types';

interface ReportsCardProps {
  reports: Reports;
}

export const ReportsCard: React.FC<ReportsCardProps> = ({ reports }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{reports.name}</Typography>
        <Chip
          label={reports.status}
          color={reports.status === 'active' ? 'success' : 'default'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};
