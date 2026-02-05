import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { Analytics as AnalyticsIcon } from '@mui/icons-material';

const Analytics: React.FC = () => {
  return (
    <PageTemplate
      title="Phân tích dữ liệu"
      subtitle="Phân tích và báo cáo chi tiết về hoạt động"
      description="Tính năng này cung cấp các báo cáo phân tích chi tiết về hiệu quả hoạt động, xu hướng và các chỉ số KPI quan trọng."
      icon={<AnalyticsIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
    />
  );
};

export default Analytics;
