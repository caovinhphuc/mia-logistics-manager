// src/components/custom/YourMetricsWidget.jsx (CREATE THIS FILE)
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';

const YourMetricsWidget = () => {
  const [salesData, setSalesData] = useState(null);
  const [userMetrics, setUserMetrics] = useState(null);

  useEffect(() => {
    // Fetch your specific metrics
    fetchYourMetrics();
  }, []);

  const fetchYourMetrics = async () => {
    try {
      const [sales, users] = await Promise.all([
        fetch('/api/custom/sales-metrics').then((r) => r.json()),
        fetch('/api/custom/user-analytics').then((r) => r.json()),
      ]);
      setSalesData(sales);
      setUserMetrics(users);
    } catch (error) {
      console.error('Error fetching custom metrics:', error);
    }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 2,
      }}
    >
      {/* Sales Performance Card */}
      <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            📊 Sales Performance
          </Typography>
          <Typography variant="h4" sx={{ color: 'white' }}>
            ${salesData?.totalRevenue?.toLocaleString() || 'Loading...'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {salesData?.growthRate > 0 ? '📈' : '📉'} {salesData?.growthRate}% vs last period
          </Typography>
        </CardContent>
      </Card>

      {/* Your Custom KPI Card */}
      <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            🎯 Your Key Metric
          </Typography>
          <Typography variant="h4" sx={{ color: 'white' }}>
            {userMetrics?.yourKPI || 'Loading...'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            Target: {userMetrics?.target} | Status: {userMetrics?.status}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default YourMetricsWidget;
