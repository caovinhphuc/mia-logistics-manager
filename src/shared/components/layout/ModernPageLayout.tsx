import React from 'react';
import { Box, Paper } from '@mui/material';

interface ModernPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const ModernPageLayout: React.FC<ModernPageLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <Box sx={{ p: 3 }}>
      {title && (
        <Box sx={{ mb: 3 }}>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 600 }}>{title}</h1>
          {subtitle && <p style={{ margin: '8px 0 0 0', color: '#666' }}>{subtitle}</p>}
        </Box>
      )}
      <Paper sx={{ p: 3 }}>{children}</Paper>
    </Box>
  );
};
