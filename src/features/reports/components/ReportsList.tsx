import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useReportsList } from '../hooks';
import { ReportsCard } from './ReportsCard';

export const ReportsList: React.FC = () => {
  const { data, isLoading, error } = useReportsList();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error loading reports: {error.message}</Typography>;
  }

  if (!data || data.length === 0) {
    return <Typography color="text.secondary">No reports found</Typography>;
  }

  return (
    <Box>
      {data.map((item) => (
        <ReportsCard key={item.id} reports={item} />
      ))}
    </Box>
  );
};
