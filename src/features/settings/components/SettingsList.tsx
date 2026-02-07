import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSettingsList } from '../hooks';
import { SettingsCard } from './SettingsCard';

export const SettingsList: React.FC = () => {
  const { data, isLoading, error } = useSettingsList();

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
        Error loading settings: {error.message}
      </Typography>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Typography color="text.secondary">
        No settings found
      </Typography>
    );
  }

  return (
    <Box>
      {data.map((item) => (
        <SettingsCard key={item.id} settings={item} />
      ))}
    </Box>
  );
};
