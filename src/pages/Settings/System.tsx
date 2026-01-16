import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { Build as SystemIcon } from '@mui/icons-material';

const System: React.FC = () => {
  return (
    <PageTemplate
      title="Cài đặt hệ thống"
      subtitle="Cấu hình hệ thống và cơ sở hạ tầng"
      description="Tính năng này cho phép bạn quản lý các cài đặt hệ thống như cơ sở dữ liệu, lưu trữ, sao lưu, nhật ký hệ thống và bảo trì."
      icon={<SystemIcon sx={{ fontSize: 80, color: 'warning.main' }} />}
    />
  );
};

export default System;
