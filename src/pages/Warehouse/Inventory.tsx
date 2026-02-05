import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { Inventory2 as InventoryIcon } from '@mui/icons-material';

const Inventory: React.FC = () => {
  return (
    <PageTemplate
      title="Quản lý tồn kho"
      subtitle="Theo dõi và quản lý tồn kho hàng hóa"
      description="Tính năng này cho phép bạn quản lý tồn kho, theo dõi số lượng hàng hóa, cảnh báo hết hàng và quản lý nhập xuất kho."
      icon={<InventoryIcon sx={{ fontSize: 80, color: 'success.main' }} />}
    />
  );
};

export default Inventory;
