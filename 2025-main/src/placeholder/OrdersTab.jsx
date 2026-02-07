// StaffTab.jsx
import React from 'react';
import PropTypes from 'prop-types';

import { Package } from 'lucide-react'; // Giả sử bạn đang sử dụng lucide-react cho icon
import { SYSTEM_CONFIG } from '../components/config/systemConfig'; // Giả sử bạn có một file config chứa các thông tin hệ thống
// ==================== PLACEHOLDER TABS ====================
/* Các tab còn lại được implement dưới dạng placeholder
   để hoàn thiện structure, có thể develop detail sau */

const OrdersTab = ({ data, filters, onFiltersChange, themeClasses }) => (
  <div className="space-y-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-2">Quản lý đơn hàng</h1>
        <p className={`${themeClasses.text.muted}`}>
          Quản lý và theo dõi tất cả đơn hàng trong hệ thống
        </p>
      </div>
    </div>

    <div className={`p-12 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border text-center`}>
      <Package size={64} className={`mx-auto mb-4 ${themeClasses.text.muted}`} />
      <h3 className="text-xl font-semibold mb-2">Tính năng đang phát triển</h3>
      <p className={`${themeClasses.text.muted} max-w-md mx-auto`}>
        Module quản lý đơn hàng chi tiết với tính năng lọc, tìm kiếm và cập nhật trạng thái đang được phát triển.
      </p>
    </div>
  </div>
);

// ==================== PROP TYPES ====================
OrdersTab.propTypes = {
  data: PropTypes.object,
  filters: PropTypes.object,
  onFiltersChange: PropTypes.func,
  themeClasses: PropTypes.object
};

// ==================== EXPORTS ====================
export default OrdersTab;
