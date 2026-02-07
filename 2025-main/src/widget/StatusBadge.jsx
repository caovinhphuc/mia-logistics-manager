// Helper component for status badges

import React from 'react';
import PropTypes from 'prop-types';
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    processing: { label: 'Đang xử lý', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    completed: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    overdue: { label: 'Quá hạn', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
  };

  const config = statusConfig[status];
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}>
      {config.label}
    </span>
  );
};

// ==================== PROP TYPES ====================
StatusBadge.propTypes = {
  status: PropTypes.oneOf(['pending', 'processing', 'completed', 'overdue']).isRequired
};
// ==================== EXPORTS ====================
export default StatusBadge;
