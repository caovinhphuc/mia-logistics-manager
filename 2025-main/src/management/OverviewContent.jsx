import React from 'react';

const OverviewContent = ({ themeClasses }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI Cards */}
      {[
        { label: 'Tổng đơn hôm nay', value: '1,247', change: '+12%', color: 'blue' },
        { label: 'SLA Compliance', value: '94.2%', change: '+2.1%', color: 'green' },
        { label: 'Đơn P1 chờ xử lý', value: '15', change: '-8', color: 'red' },
        { label: 'Hiệu suất trung bình', value: '87%', change: '+5%', color: 'purple' }
      ].map((kpi, index) => (
        <div key={index} className={`p-4 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
          <p className={`text-sm ${themeClasses.text.muted} mb-1`}>{kpi.label}</p>
          <p className="text-2xl font-bold mb-1">{kpi.value}</p>
          <p className={`text-xs ${kpi.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {kpi.change} từ hôm qua
          </p>
        </div>
      ))}
    </div>

    <div className={`p-6 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
      <h3 className="text-lg font-semibold mb-4">🏗️ Đây là khu vực hiển thị tổng quan</h3>
      <p className={themeClasses.text.muted}>
        Nội dung chi tiết của từng module sẽ được phát triển trong các giai đoạn tiếp theo.
        Hiện tại chúng ta đang tập trung vào việc xây dựng cấu trúc chính của dashboard.
      </p>
    </div>
  </div>
);

export default OverviewContent;
