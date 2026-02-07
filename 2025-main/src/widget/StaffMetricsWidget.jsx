// StaffMetricsWidget.jsx
import React from 'react';
import PropTypes from 'prop-types';
import WidgetWrapper from '../components/layout/WidgetWrapper';
import { Users, Award, Target, CheckCircle } from 'lucide-react';

const StaffMetricsWidget = ({ staffMetrics, themeClasses }) => {
  return (
    <WidgetWrapper
      widgetId="staff-metrics"
      title="Thống kê nhân sự"
      description="Chỉ số tổng quan về đội ngũ nhân sự"
      themeClasses={themeClasses}
      isRefreshable={true}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div className={`p-4 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30`}>
              <Users size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-medium text-green-600">+5.2%</span>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {staffMetrics.totalStaff}
            </p>
            <p className={`text-sm ${themeClasses.text.muted}`}>Tổng nhân viên</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg bg-green-100 dark:bg-green-900/30`}>
              <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-medium text-green-600">
              {staffMetrics.utilization}%
            </span>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {staffMetrics.activeStaff + staffMetrics.busyStaff}
            </p>
            <p className={`text-sm ${themeClasses.text.muted}`}>Đang hoạt động</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30`}>
              <Target size={20} className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <span className="text-xs font-medium text-green-600">+2.1%</span>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {staffMetrics.avgEfficiency}%
            </p>
            <p className={`text-sm ${themeClasses.text.muted}`}>Hiệu suất TB</p>
          </div>
        </div>

        <div className={`p-4 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30`}>
              <Award size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-medium text-green-600">+12.5%</span>
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {staffMetrics.totalOrders}
            </p>
            <p className={`text-sm ${themeClasses.text.muted}`}>Đơn hàng xử lý</p>
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
};

StaffMetricsWidget.propTypes = {
  staffMetrics: PropTypes.object.isRequired,
  themeClasses: PropTypes.object.isRequired
};

export default StaffMetricsWidget;
