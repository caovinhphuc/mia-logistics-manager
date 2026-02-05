import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { Route as RouteIcon } from '@mui/icons-material';

const Routes: React.FC = () => {
  return (
    <PageTemplate
      title="Quản lý tuyến đường"
      subtitle="Quản lý và theo dõi các tuyến đường vận chuyển"
      description="Tính năng này cho phép bạn quản lý các tuyến đường vận chuyển, lập kế hoạch tuyến đường tối ưu và theo dõi hiệu quả vận chuyển."
      icon={<RouteIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
    />
  );
};

export default Routes;
