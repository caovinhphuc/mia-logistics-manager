import React from 'react';
import PageTemplate from '../../components/templates/PageTemplate';
import { AccountBalance as FinancialIcon } from '@mui/icons-material';

const Financial: React.FC = () => {
  return (
    <PageTemplate
      title="Báo cáo tài chính"
      subtitle="Báo cáo tài chính và kế toán"
      description="Tính năng này cung cấp các báo cáo tài chính chi tiết, bao gồm doanh thu, chi phí, lợi nhuận và các chỉ số tài chính khác."
      icon={<FinancialIcon sx={{ fontSize: 80, color: 'success.main' }} />}
    />
  );
};

export default Financial;
