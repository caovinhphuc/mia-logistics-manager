import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  change?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({ title, value, icon, color = 'primary', change }: StatCardProps) {
  const colorMap = {
    primary: 'primary.main',
    secondary: 'secondary.main',
    success: 'success.main',
    error: 'error.main',
    warning: 'warning.main',
    info: 'info.main',
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              color: colorMap[color],
              mr: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {change && (
          <Chip
            label={change.value}
            size="small"
            color={change.positive ? 'success' : 'error'}
            variant="outlined"
            sx={{ fontSize: '0.75rem' }}
          />
        )}
      </CardContent>
    </Card>
  );
}
