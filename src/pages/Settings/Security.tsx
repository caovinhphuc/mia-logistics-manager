import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { Security as SecurityIcon } from '@mui/icons-material';

const Security: React.FC = () => {
  return (
    <PageTemplate
      title="Bảo mật hệ thống"
      subtitle="Cài đặt bảo mật và quyền truy cập"
      description="Tính năng này cho phép bạn quản lý các thiết lập bảo mật như xác thực hai yếu tố, quyền truy cập, nhật ký bảo mật và các chính sách bảo mật."
      icon={<SecurityIcon sx={{ fontSize: 80, color: 'error.main' }} />}
    />
  );
};

export default Security;
