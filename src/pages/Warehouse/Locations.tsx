import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { LocationOn as LocationsIcon } from '@mui/icons-material';

const Locations: React.FC = () => {
  return (
    <PageTemplate
      title="Vị trí kho"
      subtitle="Quản lý vị trí và khu vực trong kho"
      description="Tính năng này cho phép bạn quản lý các vị trí lưu trữ trong kho, sắp xếp hàng hóa theo khu vực và tối ưu hóa không gian kho."
      icon={<LocationsIcon sx={{ fontSize: 80, color: 'info.main' }} />}
    />
  );
};

export default Locations;
