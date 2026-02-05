import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { Description as ContractIcon } from '@mui/icons-material';

const Contracts: React.FC = () => {
  return (
    <PageTemplate
      title="Quản lý hợp đồng"
      subtitle="Quản lý và theo dõi hợp đồng với đối tác"
      description="Tính năng này cho phép bạn quản lý các hợp đồng với nhà cung cấp và khách hàng, theo dõi thời hạn và điều khoản hợp đồng."
      icon={<ContractIcon sx={{ fontSize: 80, color: 'warning.main' }} />}
    />
  );
};

export default Contracts;
