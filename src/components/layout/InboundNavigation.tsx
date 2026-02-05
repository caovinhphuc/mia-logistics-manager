import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import {
  Home as HomeIcon,
  Flight as FlightIcon,
  Schedule as ScheduleIcon,
  Assessment as ReportIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const InboundNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Quốc nội',
      path: '/inbound-domestic',
      icon: <HomeIcon />,
    },
    {
      label: 'Quốc tế',
      path: '/inbound-international',
      icon: <FlightIcon />,
    },
    {
      label: 'Lịch trình',
      path: '/inbound-schedule',
      icon: <ScheduleIcon />,
    },
    {
      label: 'Báo cáo',
      path: '/inbound-reports',
      icon: <ReportIcon />,
    },
  ];

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Container maxWidth="xl">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            📦 MIA Logistics - Quản lý nhập hàng
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor:
                    location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default InboundNavigation;
