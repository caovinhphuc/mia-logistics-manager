import React from 'react';
import PropTypes from 'prop-types';
import { Package } from 'lucide-react';
import StatusBadge from './StatusBadge';
import WidgetWrapper from '../components/layout/WidgetWrapper';

const RecentActivitiesWidget = ({ data, themeClasses }) => (
  <WidgetWrapper
    widgetId="recent-activities"
    title="Hoạt động gần đây"
    description="Theo dõi các đơn hàng và hoạt động mới nhất"
    themeClasses={themeClasses}
    isRefreshable={true}
  >
    <div className="p-6">
      <div className="space-y-4">
        {data.orders.slice(0, 5).map((order) => (
          <div key={order.id} className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-xl ${
              order.status === 'completed' ? 'bg-green-100 text-green-600' :
              order.status === 'processing' ? 'bg-blue-100 text-blue-600' :
              order.status === 'overdue' ? 'bg-red-100 text-red-600' :
              'bg-yellow-100 text-yellow-600'
            } flex items-center justify-center`}>
              <Package size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">Đơn hàng {order.id}</p>
              <p className={`text-xs text-gray-600 dark:text-gray-400 truncate`}>
                {order.customerName} • {order.createdAt.toLocaleString('vi-VN')}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        ))}
      </div>
    </div>
  </WidgetWrapper>
);

// ==================== PROP TYPES ====================
RecentActivitiesWidget.propTypes = {
  data: PropTypes.object.isRequired,
  themeClasses: PropTypes.object.isRequired
};

// ==================== EXPORTS ====================
export default RecentActivitiesWidget;
