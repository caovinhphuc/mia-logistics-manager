import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { DirectionsCar as VehicleIcon } from '@mui/icons-material';

const Vehicles: React.FC = () => {
  return (
    <PageTemplate
      title="Quản lý phương tiện"
      subtitle="Quản lý đội xe và phương tiện vận chuyển"
      description="Tính năng này cho phép bạn quản lý thông tin phương tiện, theo dõi tình trạng xe, lịch bảo trì và phân công xe cho các tuyến đường."
      icon={<VehicleIcon sx={{ fontSize: 80, color: 'info.main' }} />}
    />
  );
};

export default Vehicles;
