import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { TrendingUp as PerformanceIcon } from '@mui/icons-material';

const Performance: React.FC = () => {
  return (
    <PageTemplate
      title="Báo cáo hiệu suất"
      subtitle="Đánh giá và theo dõi hiệu suất hoạt động"
      description="Tính năng này cung cấp các báo cáo về hiệu suất hoạt động của từng bộ phận, nhân viên và quy trình trong hệ thống."
      icon={<PerformanceIcon sx={{ fontSize: 80, color: 'info.main' }} />}
    />
  );
};

export default Performance;
