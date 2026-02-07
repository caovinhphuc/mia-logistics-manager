import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import type { Settings } from '../types';

interface SettingsCardProps {
  settings: Settings;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ settings }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{settings.name}</Typography>
        <Chip
          label={settings.status}
          color={settings.status === 'active' ? 'success' : 'default'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};
