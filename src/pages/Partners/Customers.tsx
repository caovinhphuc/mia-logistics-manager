import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { People as CustomersIcon } from '@mui/icons-material';

const Customers: React.FC = () => {
  return (
    <PageTemplate
      title="Quản lý khách hàng"
      subtitle="Quản lý thông tin khách hàng và quan hệ"
      description="Tính năng này cho phép bạn quản lý danh sách khách hàng, lịch sử đơn hàng, thông tin thanh toán và chăm sóc khách hàng."
      icon={<CustomersIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
    />
  );
};

export default Customers;
