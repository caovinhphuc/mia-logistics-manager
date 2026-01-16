import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { Factory as SupplierIcon } from '@mui/icons-material';

const Suppliers: React.FC = () => {
  return (
    <PageTemplate
      title="Quản lý nhà cung cấp"
      subtitle="Quản lý thông tin nhà cung cấp và hợp đồng"
      description="Tính năng này cho phép bạn quản lý danh sách nhà cung cấp, thông tin liên hệ, hợp đồng và đánh giá hiệu quả làm việc."
      icon={<SupplierIcon sx={{ fontSize: 80, color: 'success.main' }} />}
    />
  );
};

export default Suppliers;
