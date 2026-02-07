// WidgetRegistry.jsx - Registry để map widget ID với component tương ứng
import React from 'react';

// Import tất cả widget components
import AlertsWidget from '../../widget/AlertsWidget';
import RecentActivitiesWidget from '../../widget/RecentActivitiesWidget';
import StaffMetricsWidget from '../../widget/StaffMetricsWidget';
import StaffTableWidget from '../../widget/StaffTableWidget';
import StaffFiltersWidget from '../../widget/StaffFiltersWidget';
import StaffPerformanceWidget from '../../widget/StaffPerformanceWidget';
import StaffScheduleWidget from '../../widget/StaffScheduleWidget';
import StaffAnalyticsWidget from '../../widget/StaffAnalyticsWidget';
import StaffKPITracker from '../../widget/StaffKPITracker';
import KPICard from '../../placeholder/KPICard';
import OrderStatusChart from '../../chart/OrderStatusChart';

// Widget Registry - Map widget IDs to their components
const WIDGET_COMPONENTS = {
  'stats': ({ themeClasses, data, metrics }) => (
    <div className={`p-6 ${themeClasses.surface} rounded-lg`}>
      <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
        Thống kê tổng quan
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <p className={`text-sm ${themeClasses.text.muted}`}>Đơn hàng đang xử lý</p>
          <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
            {metrics?.orders?.pending || 0}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <p className={`text-sm ${themeClasses.text.muted}`}>SLA Rate</p>
          <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
            {metrics?.performance?.slaRate || 0}%
          </p>
        </div>
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <p className={`text-sm ${themeClasses.text.muted}`}>Nhân viên hoạt động</p>
          <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
            {data?.staff?.filter(s => s.status === 'active').length || 0}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <p className={`text-sm ${themeClasses.text.muted}`}>Throughput</p>
          <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
            {metrics?.performance?.throughput || 0}/h
          </p>
        </div>
      </div>
    </div>
  ),

  'alerts': ({ themeClasses, data, metrics }) => (
    <AlertsWidget metrics={metrics} themeClasses={themeClasses} />
  ),

  'analytics': ({ themeClasses, data, metrics }) => (
    <div className={`p-6 ${themeClasses.surface} rounded-lg`}>
      <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
        Phân tích dữ liệu
      </h3>
      <OrderStatusChart data={data} themeClasses={themeClasses} />
    </div>
  ),

  'activities': ({ themeClasses, data, metrics }) => (
    <RecentActivitiesWidget data={data} themeClasses={themeClasses} />
  ),

  'staff-metrics': ({ themeClasses, data, metrics }) => (
    <StaffMetricsWidget
      staffMetrics={{
        totalStaff: data?.staff?.length || 0,
        activeStaff: data?.staff?.filter(s => s.status === 'active').length || 0,
        avgEfficiency: data?.staff?.reduce((acc, s) => acc + (s.efficiency || 0), 0) / (data?.staff?.length || 1) || 0,
        topPerformer: data?.staff?.sort((a, b) => (b.efficiency || 0) - (a.efficiency || 0))[0]?.name || 'N/A'
      }}
      themeClasses={themeClasses}
    />
  ),

  'staff-performance': ({ themeClasses, data, metrics }) => (
    <StaffPerformanceWidget data={data?.staff || []} themeClasses={themeClasses} />
  ),

  'staff-schedule': ({ themeClasses, data, metrics }) => (
    <StaffScheduleWidget
      staffData={data?.staff || []}
      themeClasses={themeClasses}
      onScheduleUpdate={(schedule) => console.log('Schedule updated:', schedule)}
    />
  ),

  'staff-table': ({ themeClasses, data, metrics }) => (
    <StaffTableWidget
      staffData={data?.staff || []}
      onViewStaff={(staff) => console.log('View staff:', staff)}
      themeClasses={themeClasses}
      searchTerm=""
      filterStatus="all"
      filterArea="all"
    />
  ),

  'staff-analytics': ({ themeClasses, data, metrics }) => (
    <StaffAnalyticsWidget
      staffData={data?.staff || []}
      themeClasses={themeClasses}
      timeRange="week"
    />
  ),

  'staff-filters': ({ themeClasses, data, metrics }) => (
    <StaffFiltersWidget
      searchTerm=""
      filterStatus="all"
      filterArea="all"
      sortBy="efficiency"
      sortOrder="desc"
      onSearchChange={() => {}}
      onFilterStatusChange={() => {}}
      onFilterAreaChange={() => {}}
      onSortChange={() => {}}
      onRefresh={() => {}}
      onAddStaff={() => {}}
      refreshing={false}
      themeClasses={themeClasses}
    />
  ),
  'staff-kpi': ({ themeClasses, data, metrics }) => (
    <StaffKPITracker
      staffData={data?.staff || []}
      themeClasses={themeClasses}
      timeRange="week"
      toLocaleTimeString={(date) => date?.toLocaleTimeString() || '--:--'}
    />
  ),

  'orders-overview': ({ themeClasses, data, metrics }) => (
    <div className={`p-6 ${themeClasses.surface} rounded-lg`}>
      <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
        Tổng quan đơn hàng
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <p className={`text-sm ${themeClasses.text.muted}`}>Tổng đơn hàng</p>
          <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
            {data?.orders?.length || 0}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <p className={`text-sm ${themeClasses.text.muted}`}>Đang xử lý</p>
          <p className={`text-2xl font-bold text-blue-600`}>
            {data?.orders?.filter(o => o.status === 'processing').length || 0}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <p className={`text-sm ${themeClasses.text.muted}`}>Hoàn thành</p>
          <p className={`text-2xl font-bold text-green-600`}>
            {data?.orders?.filter(o => o.status === 'completed').length || 0}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <p className={`text-sm ${themeClasses.text.muted}`}>Đã hủy</p>
          <p className={`text-2xl font-bold text-red-600`}>
            {data?.orders?.filter(o => o.status === 'cancelled').length || 0}
          </p>
        </div>
      </div>
    </div>
  ),

  'orders-table': ({ themeClasses, data, metrics }) => (
    <div className={`p-6 ${themeClasses.surface} rounded-lg`}>
      <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
        Bảng đơn hàng
      </h3>
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse ${themeClasses.border}`}>
          <thead>
            <tr className={`border-b ${themeClasses.border}`}>
              <th className={`text-left p-3 ${themeClasses.text.primary}`}>Mã đơn</th>
              <th className={`text-left p-3 ${themeClasses.text.primary}`}>Khách hàng</th>
              <th className={`text-left p-3 ${themeClasses.text.primary}`}>Trạng thái</th>
              <th className={`text-left p-3 ${themeClasses.text.primary}`}>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {(data?.orders || []).slice(0, 10).map((order, index) => (
              <tr key={index} className={`border-b ${themeClasses.border}`}>
                <td className={`p-3 ${themeClasses.text.primary}`}>{order.id}</td>
                <td className={`p-3 ${themeClasses.text.primary}`}>{order.customer}</td>
                <td className={`p-3`}>
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className={`p-3 ${themeClasses.text.primary}`}>{order.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),

  'orders-status': ({ themeClasses, data, metrics }) => (
    <div className={`p-6 ${themeClasses.surface} rounded-lg`}>
      <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
        Trạng thái đơn hàng
      </h3>
      <OrderStatusChart data={data} themeClasses={themeClasses} />
    </div>
  ),

  'settings-general': ({ themeClasses, data, metrics }) => (
    <div className={`p-6 ${themeClasses.surface} rounded-lg`}>
      <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
        Cài đặt chung
      </h3>
      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
            Tên hệ thống
          </label>
          <input
            type="text"
            value="Warehouse Management System"
            className={`w-full px-3 py-2 border rounded-lg ${themeClasses.input}`}
            readOnly
          />
        </div>
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
            Múi giờ
          </label>
          <select className={`w-full px-3 py-2 border rounded-lg ${themeClasses.input}`}>
            <option value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</option>
          </select>
        </div>
      </div>
    </div>
  ),

  'settings-notifications': ({ themeClasses, data, metrics }) => (
    <div className={`p-6 ${themeClasses.surface} rounded-lg`}>
      <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
        Cài đặt thông báo
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`${themeClasses.text.primary}`}>Email thông báo</span>
          <input type="checkbox" defaultChecked className="toggle" />
        </div>
        <div className="flex items-center justify-between">
          <span className={`${themeClasses.text.primary}`}>Push notifications</span>
          <input type="checkbox" defaultChecked className="toggle" />
        </div>
        <div className="flex items-center justify-between">
          <span className={`${themeClasses.text.primary}`}>SMS alerts</span>
          <input type="checkbox" className="toggle" />
        </div>
      </div>
    </div>
  ),

  'kpi': ({ themeClasses, data, metrics }) => (
    <KPICard
      title="KPI Dashboard"
      value={metrics?.performance?.slaRate || 0}
      unit="%"
      trend="up"
      themeClasses={themeClasses}
    />
  ),

  'schedule': ({ themeClasses, data, metrics }) => (
    <div className={`p-6 ${themeClasses.surface} rounded-lg`}>
      <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
        Lịch trình
      </h3>
      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <p className={`font-medium ${themeClasses.text.primary}`}>Hôm nay</p>
          <p className={`text-sm ${themeClasses.text.muted}`}>5 ca làm việc đã lên lịch</p>
        </div>
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <p className={`font-medium ${themeClasses.text.primary}`}>Tuần này</p>
          <p className={`text-sm ${themeClasses.text.muted}`}>35 ca làm việc</p>
        </div>
      </div>
    </div>
  ),

  'performance': ({ themeClasses, data, metrics }) => (
    <div className={`p-6 ${themeClasses.surface} rounded-lg`}>
      <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>
        Hiệu suất hệ thống
      </h3>
      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${themeClasses.text.muted}`}>CPU Usage</span>
            <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
              {metrics?.system?.cpu || 45}%
            </span>
          </div>
          <div className={`w-full bg-gray-200 rounded-full h-2`}>
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${metrics?.system?.cpu || 45}%` }}
            ></div>
          </div>
        </div>
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm ${themeClasses.text.muted}`}>Memory Usage</span>
            <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
              {metrics?.system?.memory || 62}%
            </span>
          </div>
          <div className={`w-full bg-gray-200 rounded-full h-2`}>
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${metrics?.system?.memory || 62}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
};

// Function to render widget by ID
export const renderWidget = (widgetId, props = {}) => {
  const WidgetComponent = WIDGET_COMPONENTS[widgetId];

  if (!WidgetComponent) {
    return (
      <div className={`p-6 ${props.themeClasses?.surface || 'bg-white'} rounded-lg border-2 border-dashed border-gray-300`}>
        <div className="text-center">
          <p className={`text-lg font-medium ${props.themeClasses?.text?.primary || 'text-gray-900'} mb-2`}>
            Widget: {widgetId}
          </p>
          <p className={`text-sm ${props.themeClasses?.text?.muted || 'text-gray-500'}`}>
            Component chưa được tạo
          </p>
        </div>
      </div>
    );
  }

  return <WidgetComponent {...props} />;
};

export default WIDGET_COMPONENTS;
