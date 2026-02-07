import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Bell, CheckCircle } from 'lucide-react';
import WidgetWrapper from '../components/layout/WidgetWrapper';

const AlertsWidget = ({ metrics, themeClasses }) => {
  const alerts = [
    {
      type: 'warning',
      title: 'Đơn hàng sắp quá hạn',
      message: `${metrics.orders.pending} đơn cần được xử lý trong 2 giờ tới`,
      time: '5 phút trước'
    },
    {
      type: 'info',
      title: 'Hiệu suất tốt',
      message: `SLA rate đạt ${metrics.performance.slaRate}%, vượt target 95%`,
      time: '15 phút trước'
    },
    {
      type: 'success',
      title: 'Throughput cao',
      message: `Đạt ${metrics.performance.throughput} đơn/giờ trong ca sáng`,
      time: '1 giờ trước'
    }
  ];
  return (
    <WidgetWrapper
      title="Cảnh báo & Thông tin"
      themeClasses={themeClasses}
      isRefreshable={true}
    >
      <div className="space-y-4 p-4">
        {alerts.map((alert, index) => (
          <div key={index} className={`p-4 rounded-xl border-l-4 ${
            alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/20' :
            alert.type === 'info' ? 'bg-blue-50 border-blue-400 dark:bg-blue-900/20' :
            'bg-green-50 border-green-400 dark:bg-green-900/20'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">
                {alert.type === 'warning' ?
                  <AlertTriangle className="h-5 w-5 text-yellow-600" /> :
                  alert.type === 'info' ?
                  <Bell className="h-5 w-5 text-blue-600" /> :
                  <CheckCircle className="h-5 w-5 text-green-600" />
                }
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{alert.title}</p>
                <p className={`text-sm mt-1 ${themeClasses.text.muted}`}>{alert.message}</p>
                <p className={`text-xs mt-2 ${themeClasses.text.muted}`}>{alert.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetWrapper>
  );
};

// ==================== PROP TYPES ====================
AlertsWidget.propTypes = {
  metrics: PropTypes.object.isRequired,
  themeClasses: PropTypes.object.isRequired
};

// ==================== EXPORTS ====================
export default AlertsWidget;
