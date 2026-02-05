import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { Directions, Schedule, Route } from '@mui/icons-material';

interface DistanceDisplayProps {
  calculation: {
    distance: number;
    duration: string;
    route: string;
  } | null;
}

export const DistanceDisplay: React.FC<DistanceDisplayProps> = ({ calculation }) => {
  if (!calculation) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Route color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle2" color="primary">
          Thông tin tuyến đường
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <Chip
          icon={<Directions />}
          label={`${calculation.distance.toFixed(1)} km`}
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<Schedule />}
          label={calculation.duration}
          color="secondary"
          variant="outlined"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {calculation.route}
      </Typography>
    </Paper>
  );
};

export default DistanceDisplay;
