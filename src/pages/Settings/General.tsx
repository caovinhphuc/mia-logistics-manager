import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { Settings as SettingsIcon } from '@mui/icons-material';

const General: React.FC = () => {
  return (
    <PageTemplate
      title="Cài đặt chung"
      subtitle="Cấu hình các thiết lập chung của hệ thống"
      description="Tính năng này cho phép bạn cấu hình các thiết lập chung như thông tin công ty, ngôn ngữ, múi giờ và các tùy chọn hệ thống khác."
      icon={<SettingsIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
    />
  );
};

export default General;
