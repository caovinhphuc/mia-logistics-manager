import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAnalyticsList } from '../hooks';
import { AnalyticsCard } from './AnalyticsCard';

export const AnalyticsList: React.FC = () => {
  const { data, isLoading, error } = useAnalyticsList();

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
        Error loading analytics: {error.message}
      </Typography>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography color="text.secondary">
        No analytics found
      </Typography>
    );
  }

  return (
    <Box>
      {data.map((item) => (
        <AnalyticsCard key={item.id} analytics={item} />
      ))}
    </Box>
  );
};
