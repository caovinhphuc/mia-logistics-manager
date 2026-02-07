//OrderStatusChart.jsx
import React from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { SYSTEM_CONFIG } from '../components/config/systemConfig'; // Updated path
import { useTheme } from '../hooks/useTheme.jsx'; // Giả sử bạn có một hook để lấy theme


// ==================== CHART COMPONENTS ====================
const OrderStatusChart = ({ data, themeClasses }) => {
  const chartData = [
    { name: 'Chờ xử lý', value: data.pending, color: '#f59e0b', bgColor: 'bg-yellow-500' },
    { name: 'Đang xử lý', value: data.processing, color: '#3b82f6', bgColor: 'bg-blue-500' },
    { name: 'Hoàn thành', value: data.completed, color: '#10b981', bgColor: 'bg-green-500' },
    { name: 'Quá hạn', value: data.overdue, color: '#ef4444', bgColor: 'bg-red-500' }
  ];

  const total = data.pending + data.processing + data.completed + data.overdue;
  return (
    <div className="space-y-4">
      {/* Mobile: Stack layout, Desktop: Grid layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
        {chartData.map((item) => {
          const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
          return (
            <div key={item.name} className="text-center p-2 lg:p-0">
              <div className={`w-2 h-2 lg:w-3 lg:h-3 ${item.bgColor} rounded-full mx-auto mb-1 lg:mb-2`}></div>
              <div className="text-lg lg:text-2xl font-bold mb-1" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className={`text-xs lg:text-sm ${themeClasses.text.muted} mb-1 truncate`}>{item.name}</div>
              <div className={`text-xs ${themeClasses.text.muted}`}>{percentage}%</div>
            </div>
          );
        })}
      </div>

      {/* Progress bars - Hidden on mobile, visible on tablet+ */}
      <div className="hidden md:block space-y-3 mt-6">
        {chartData.map((item) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={item.name} className="flex items-center space-x-3">
              <div className={`w-3 h-3 ${item.bgColor} rounded-full flex-shrink-0`}></div>
              <div className="flex-1">
                <div className={`h-2 rounded-full ${themeClasses.background}`}>
                  <div
                    className={`h-2 rounded-full ${item.bgColor} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-medium w-12 text-right">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==================== EXPORTS ====================
export default OrderStatusChart;

