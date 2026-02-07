//DashboardTab.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Download, Filter, Package, Target, Clock, TrendingUp, Settings } from 'lucide-react';
import KPICard from './KPICard';
import OrderStatusChart from '../chart/OrderStatusChart';
import StaffPerformanceWidget from '../widget/StaffPerformanceWidget';
import RecentActivitiesWidget from '../widget/RecentActivitiesWidget';
import AlertsWidget from '../widget/AlertsWidget';
import LayoutManager from '../components/layout/LayoutManager';
import LayoutConfigManager from '../components/LayoutConfigManager';
import StaffScheduleWidget from '../widget/StaffScheduleWidget';
// ==================== DASHBOARD TAB COMPONENT ====================
const DashboardTab = ({ metrics, data, themeClasses, user }) => {
  const [isLayoutConfigOpen, setIsLayoutConfigOpen] = useState(false);

  const handleOpenLayoutConfig = () => {
    setIsLayoutConfigOpen(true);
  };

  const handleCloseLayoutConfig = () => {
    setIsLayoutConfigOpen(false);
  };

  return (
    <div className="w-full h-full min-h-0 space-y-6">{/* Welcome header - Responsive và full width */}
    <div className="w-full">
      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className={`text-2xl lg:text-3xl font-bold ${themeClasses.text.primary} mb-2 truncate`}>
            Chào mừng, {user?.name || 'Người dùng'}! <span className="hidden sm:inline">👋</span>
          </h1>
          <p className={`${themeClasses.text.muted} text-sm lg:text-lg leading-relaxed line-clamp-2 sm:line-clamp-none`}>
            Tổng quan hệ thống kho vận • {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>        <div className="flex flex-row sm:flex-row gap-2 lg:gap-3 flex-shrink-0">
          <button className="flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg lg:rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm lg:text-base">
            <Download size={16} className="mr-2" />
            <span className="hidden sm:inline">Xuất báo cáo</span>
            <span className="sm:hidden">Xuất</span>
          </button>
          <button className={`flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 ${themeClasses.surface} ${themeClasses.border} border rounded-lg lg:rounded-xl hover:shadow-md transition-all duration-200 text-sm lg:text-base`}>
            <Filter size={16} className="mr-2" />
            <span className="hidden sm:inline">Bộ lọc</span>
            <span className="sm:hidden">Lọc</span>
          </button>
          <button
            onClick={handleOpenLayoutConfig}
            className={`flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 ${themeClasses.surface} ${themeClasses.border} border rounded-lg lg:rounded-xl hover:shadow-md transition-all duration-200 text-sm lg:text-base`}
            title="Cấu hình giao diện"
          >
            <Settings size={16} className="mr-2" />
            <span className="hidden sm:inline">Cấu hình</span>
            <span className="sm:hidden">Cài đặt</span>
          </button>
        </div>
      </div>
    </div>

    {/* Layout Manager với full width và không bị cắt */}    <div className="w-full min-w-0 overflow-hidden">
      <LayoutManager themeClasses={themeClasses} useLayoutContext={true} pageId="dashboard" data={data} metrics={metrics}>
      {/* KPI Stats Widget */}
      <div widgetId="stats">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Chỉ số hiệu suất chính</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            <KPICard
              title="Tổng đơn hàng"
              value={metrics.orders.total}
              subtitle="đơn trong hệ thống"
              change="+12%"
              trend="up"
              icon={Package}
              gradient="from-blue-500 to-cyan-500"
              themeClasses={themeClasses}
            />
            <KPICard
              title="Tỷ lệ đạt SLA"
              value={`${metrics.performance.slaRate}%`}
              subtitle="hiệu suất hệ thống"
              change="+2.1%"
              trend="up"
              icon={Target}
              gradient="from-green-500 to-emerald-500"
              themeClasses={themeClasses}
            />
            <KPICard
              title="Thời gian xử lý"
              value={`${metrics.performance.avgProcessTime}m`}
              subtitle="trung bình mỗi đơn"
              change="-5m"
              trend="up"
              icon={Clock}
              gradient="from-purple-500 to-violet-500"
              themeClasses={themeClasses}
            />
            <KPICard
              title="Throughput"
              value={`${metrics.performance.throughput}/h`}
              subtitle="đơn hàng mỗi giờ"
              change="+8%"
              trend="up"
              icon={TrendingUp}
              gradient="from-orange-500 to-red-500"
              themeClasses={themeClasses}
            />
          </div>
        </div>
      </div>

      {/* Staff Schedule Widget */}
      <div widgetId="schedule">
        <StaffScheduleWidget
          staffData={data.staff}
          themeClasses={themeClasses}
          onScheduleUpdate={(schedule) => console.log('Schedule updated:', schedule)}
        />
      </div>

      {/* Order Analytics Widget */}
      <div widgetId="analytics">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg lg:text-xl font-semibold">Phân bổ trạng thái đơn hàng</h3>
            <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
              Xem chi tiết →
            </button>
          </div>
          <div className="h-64 lg:h-80">
            <OrderStatusChart data={metrics.orders} themeClasses={themeClasses} />
          </div>
        </div>
      </div>

      {/* KPI Performance Widget */}
      <div widgetId="kpi">
        <div className="space-y-4">
          <h3 className="text-lg lg:text-xl font-semibold">Hiệu suất tổng quan</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${themeClasses.text.muted}`}>Hiệu suất nhân sự</span>
              <span className="text-lg font-semibold">{metrics.performance.staffEfficiency}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.performance.staffEfficiency}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${themeClasses.text.muted}`}>Tài nguyên sử dụng</span>
              <span className="text-lg font-semibold">{metrics.performance.resourceUtilization}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.performance.resourceUtilization}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>      {/* Staff Performance Widget */}
      <div widgetId="performance">
        <div className="space-y-4">
          <h3 className="text-lg lg:text-xl font-semibold">Hiệu suất nhân sự</h3>
          <StaffPerformanceWidget data={data.staff} themeClasses={themeClasses} />
        </div>
      </div>

      {/* Recent Activities Widget */}
      <div widgetId="activities">
        <RecentActivitiesWidget data={data} themeClasses={themeClasses} />
      </div>      {/* Alerts Widget */}
      <div widgetId="alerts">
        <AlertsWidget metrics={metrics} themeClasses={themeClasses} />
      </div>
      </LayoutManager>
    </div>

    {/* Layout Configuration Modal */}
    <LayoutConfigManager
      themeClasses={themeClasses}
      isOpen={isLayoutConfigOpen}
      onClose={handleCloseLayoutConfig}
    />
  </div>
  );
};

// ==================== EXPORT COMPONENT ====================
export default DashboardTab;


