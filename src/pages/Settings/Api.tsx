import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { Api as ApiIcon } from '@mui/icons-material';

const Api: React.FC = () => {
  return (
    <PageTemplate
      title="Tích hợp API"
      subtitle="Quản lý tích hợp API và webhook"
      description="Tính năng này cho phép bạn quản lý các tích hợp API, cấu hình webhook, quản lý API keys và theo dõi các kết nối bên ngoài."
      icon={<ApiIcon sx={{ fontSize: 80, color: 'secondary.main' }} />}
    />
  );
};

export default Api;
