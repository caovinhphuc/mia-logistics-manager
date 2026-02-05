import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { ShoppingCart as OrdersIcon } from '@mui/icons-material';

const Orders: React.FC = () => {
  return (
    <PageTemplate
      title="Quản lý đơn hàng kho"
      subtitle="Quản lý đơn hàng nhập xuất kho"
      description="Tính năng này cho phép bạn quản lý các đơn hàng liên quan đến kho, bao gồm đơn nhập kho, xuất kho và chuyển kho."
      icon={<OrdersIcon sx={{ fontSize: 80, color: 'primary.main' }} />}
    />
  );
};

export default Orders;
