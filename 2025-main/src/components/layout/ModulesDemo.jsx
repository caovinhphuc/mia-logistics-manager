import React, { useState, useMemo, useCallback } from 'react';
import {
  Package, Users, BarChart3, Calendar, Settings, Bell, Search, Menu, X,
  LogOut, Eye, EyeOff, Shield, Clock, TrendingUp, AlertTriangle,
  CheckCircle, RefreshCw, Filter, Download, ChevronDown, ChevronRight,
  MapPin, Zap, Play, Pause, MoreHorizontal, PieChart, Activity,
  Truck, Inbox, FileText, Star, Target, Coffee, Home, Moon, Sun,
  Map, Route, Layers, Navigation, Warehouse, ShoppingCart, Archive,
  AlertCircle, CheckSquare, ClipboardList, History, Camera, Scan,
  BarChart2, Lightbulb, Gauge, ArrowUpDown, Timer, User
} from 'lucide-react';

// ==================== DEMO CONFIGURATION ====================
const DEMO_CONFIG = {
  modules: {
    orders: {
      id: 'orders',
      title: 'Orders Management',
      subtitle: 'Quản lý đơn hàng chi tiết',
      icon: Package,
      color: 'from-blue-500 to-cyan-500',
      priority: 'High',
      complexity: 'Medium',
      benefits: ['Tự động hóa workflow', 'SLA tracking real-time', 'Bulk operations'],
      features: ['Advanced filtering', 'Batch processing', 'Status automation', 'Customer portal']
    },
    picking: {
      id: 'picking',
      title: 'Smart Picking System',
      subtitle: 'Hệ thống lấy hàng thông minh',
      icon: Navigation,
      color: 'from-green-500 to-emerald-500',
      priority: 'High',
      complexity: 'High',
      benefits: ['Tối ưu route 40%', 'Giảm lỗi 60%', 'Tăng tốc độ 35%'],
      features: ['Route optimization', 'Barcode scanning', 'Voice picking', 'Error prevention']
    },
    warehouse: {
      id: 'warehouse',
      title: 'Warehouse Map & Layout',
      subtitle: 'Bản đồ kho và tối ưu hóa',
      icon: Map,
      color: 'from-purple-500 to-violet-500',
      priority: 'Medium',
      complexity: 'High',
      benefits: ['Visualization 3D', 'Space optimization', 'Heat mapping'],
      features: ['Interactive map', 'Zone management', 'Capacity planning', 'Flow analysis']
    },
    alerts: {
      id: 'alerts',
      title: 'Smart Alerts & Notifications',
      subtitle: 'Cảnh báo và thông báo thông minh',
      icon: Bell,
      color: 'from-orange-500 to-red-500',
      priority: 'Medium',
      complexity: 'Low',
      benefits: ['Proactive monitoring', 'Multi-channel alerts', 'Escalation rules'],
      features: ['Real-time alerts', 'Custom rules', 'Mobile push', 'Email/SMS']
    },
    reports: {
      id: 'reports',
      title: 'Advanced Reports & Analytics',
      subtitle: 'Báo cáo và phân tích nâng cao',
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-500',
      priority: 'High',
      complexity: 'Medium',
      benefits: ['Predictive analytics', 'Custom dashboards', 'Export formats'],
      features: ['Interactive charts', 'Drill-down analysis', 'Scheduled reports', 'KPI tracking']
    },
    history: {
      id: 'history',
      title: 'History & Audit Trail',
      subtitle: 'Lịch sử và kiểm toán hệ thống',
      icon: History,
      color: 'from-gray-500 to-slate-500',
      priority: 'Low',
      complexity: 'Low',
      benefits: ['Compliance ready', 'Full traceability', 'Data integrity'],
      features: ['Activity logging', 'Change tracking', 'User actions', 'Data export']
    }
  }
};

// ==================== MOCK DATA FOR DEMOS ====================
const generateDemoData = () => {
  return {
    orders: {
      total: 1247,
      pending: 89,
      inProgress: 156,
      completed: 932,
      overdue: 15,
      avgProcessTime: 24,
      slaCompliance: 94.2,
      recentOrders: [
        { id: 'MIA001234', customer: 'Shopee VN', priority: 'P1', status: 'picking', slaRemaining: 45, value: 2450000 },
        { id: 'MIA001235', customer: 'TikTok Shop', priority: 'P2', status: 'pending', slaRemaining: 180, value: 890000 },
        { id: 'MIA001236', customer: 'Lazada', priority: 'P3', status: 'packing', slaRemaining: 320, value: 1680000 }
      ]
    },
    picking: {
      activeRoutes: 12,
      avgPickTime: 3.2,
      accuracy: 98.7,
      efficiency: 87,
      todayPicks: 2156,
      errorRate: 1.3,
      routes: [
        { id: 'RT001', picker: 'Nguyễn Văn A', zone: 'A1-A3', items: 24, completion: 75, estimatedTime: 15 },
        { id: 'RT002', picker: 'Trần Thị B', zone: 'B2-B5', items: 18, completion: 45, estimatedTime: 22 },
        { id: 'RT003', picker: 'Lê Văn C', zone: 'C1-C4', items: 31, completion: 90, estimatedTime: 8 }
      ]
    },
    warehouse: {
      totalZones: 8,
      utilization: 78,
      capacity: 12500,
      currentStock: 9750,
      hotspots: 5,
      zones: [
        { id: 'A1', type: 'Fast Moving', utilization: 95, items: 1250, temp: 22 },
        { id: 'B2', type: 'Bulk Storage', utilization: 68, items: 2100, temp: 20 },
        { id: 'C3', type: 'Cold Storage', utilization: 82, items: 890, temp: 4 }
      ]
    },
    alerts: {
      active: 7,
      critical: 2,
      warning: 3,
      info: 2,
      todayResolved: 23,
      avgResponseTime: 8.5,
      recent: [
        { type: 'critical', title: 'SLA Breach Alert', message: '3 đơn hàng P1 sắp quá hạn', time: '2 phút trước' },
        { type: 'warning', title: 'Stock Level Low', message: 'Zone A1 dưới mức tối thiểu', time: '15 phút trước' },
        { type: 'info', title: 'System Update', message: 'Backup hoàn tất thành công', time: '1 giờ trước' }
      ]
    },
    reports: {
      scheduledReports: 15,
      customDashboards: 8,
      exportedToday: 42,
      viewsThisWeek: 1340,
      insights: [
        { metric: 'Throughput Trend', value: '+12%', period: '7 ngày' },
        { metric: 'Cost per Order', value: '-8%', period: '30 ngày' },
        { metric: 'Staff Efficiency', value: '+5%', period: '14 ngày' }
      ]
    },
    history: {
      totalRecords: 125000,
      todayEntries: 1847,
      retentionDays: 2555,
      searchableFields: 24,
      recentActivities: [
        { user: 'Admin', action: 'Order Status Update', target: 'MIA001234', time: '14:25' },
        { user: 'Manager', action: 'Staff Assignment', target: 'Route RT001', time: '14:20' },
        { user: 'System', action: 'Auto Backup', target: 'Database', time: '14:00' }
      ]
    }
  };
};

// ==================== MAIN DEMO COMPONENT ====================
const ModulesDemo = () => {
  const [selectedModule, setSelectedModule] = useState('orders');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isComparing, setIsComparing] = useState(false);
  const [compareSelection, setCompareSelection] = useState([]);

  const demoData = useMemo(() => generateDemoData(), []);

  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    surface: isDarkMode ? 'bg-gray-800' : 'bg-white',
    surfaceHover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500'
    }
  };

  const handleCompareToggle = useCallback((moduleId) => {
    if (compareSelection.includes(moduleId)) {
      setCompareSelection(prev => prev.filter(id => id !== moduleId));
    } else if (compareSelection.length < 3) {
      setCompareSelection(prev => [...prev, moduleId]);
    }
  }, [compareSelection]);

  const renderModuleOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.values(DEMO_CONFIG.modules).map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          isSelected={selectedModule === module.id}
          isComparing={isComparing}
          isInComparison={compareSelection.includes(module.id)}
          onSelect={() => setSelectedModule(module.id)}
          onCompareToggle={() => handleCompareToggle(module.id)}
          themeClasses={themeClasses}
        />
      ))}
    </div>
  );

  const renderModuleDetail = () => {
    const module = DEMO_CONFIG.modules[selectedModule];
    const data = demoData[selectedModule];

    return (
      <div className="space-y-6">
        <ModuleDetailHeader module={module} themeClasses={themeClasses} />
        <ModuleMetrics moduleId={selectedModule} data={data} themeClasses={themeClasses} />
        <ModuleDemo moduleId={selectedModule} data={data} themeClasses={themeClasses} />
      </div>
    );
  };

  const renderComparison = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">So sánh Modules</h2>
        <button
          onClick={() => {setIsComparing(false); setCompareSelection([]);}}
          className="px-4 py-2 text-gray-500 hover:text-gray-700"
        >
          Đóng so sánh
        </button>
      </div>
      <ModuleComparison
        modules={compareSelection.map(id => DEMO_CONFIG.modules[id])}
        themeClasses={themeClasses}
      />
    </div>
  );

  return (
    <div className={`min-h-screen p-6 transition-colors duration-200 ${themeClasses.background} ${themeClasses.text.primary}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              MIA Warehouse Modules Demo
            </h1>
            <p className={`text-lg ${themeClasses.text.muted}`}>
              Khám phá và đánh giá từng module trước khi phát triển • 23/05/2025
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsComparing(!isComparing)}
              className={`px-4 py-2 rounded-xl transition-all ${
                isComparing
                  ? 'bg-blue-500 text-white'
                  : `${themeClasses.surface} ${themeClasses.border} border`
              }`}
            >
              <BarChart2 size={16} className="inline mr-2" />
              So sánh Modules {compareSelection.length > 0 && `(${compareSelection.length})`}
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${themeClasses.surfaceHover} transition-colors`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        {!isComparing && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedModule('overview')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedModule === 'overview'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : `${themeClasses.surfaceHover}`
              }`}
            >
              <Home size={16} className="inline mr-2" />
              Tổng quan
            </button>

            {Object.values(DEMO_CONFIG.modules).map((module) => (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center ${
                  selectedModule === module.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : `${themeClasses.surfaceHover}`
                }`}
              >
                <module.icon size={16} className="mr-2" />
                {module.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {isComparing ? renderComparison() :
       selectedModule === 'overview' ? renderModuleOverview() :
       renderModuleDetail()}
    </div>
  );
};

// ==================== MODULE CARD COMPONENT ====================
const ModuleCard = ({
  module, isSelected, isComparing, isInComparison,
  onSelect, onCompareToggle, themeClasses
}) => (
  <div className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer ${
    isSelected
      ? 'border-blue-500 shadow-lg transform scale-105'
      : `${themeClasses.border} ${themeClasses.surface} hover:shadow-md`
  } ${isInComparison ? 'ring-2 ring-blue-400' : ''}`}>

    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-r ${module.color} opacity-20`}>
        <module.icon size={24} className="text-white" />
      </div>

      {isComparing && (
        <button
          onClick={(e) => {e.stopPropagation(); onCompareToggle();}}
          className={`p-2 rounded-lg transition-colors ${
            isInComparison
              ? 'bg-blue-500 text-white'
              : `${themeClasses.surfaceHover}`
          }`}
        >
          <CheckSquare size={16} />
        </button>
      )}
    </div>

    <div onClick={onSelect}>
      <h3 className="text-xl font-bold mb-2">{module.title}</h3>
      <p className={`${themeClasses.text.muted} mb-4`}>{module.subtitle}</p>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Độ ưu tiên:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            module.priority === 'High' ? 'bg-red-100 text-red-700' :
            module.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {module.priority}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Độ phức tạp:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            module.complexity === 'High' ? 'bg-red-100 text-red-700' :
            module.complexity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }`}>
            {module.complexity}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium mb-2">Lợi ích chính:</p>
          <ul className="text-sm space-y-1">
            {module.benefits.slice(0, 2).map((benefit, index) => (
              <li key={index} className={`${themeClasses.text.muted}`}>
                • {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// ==================== MODULE DETAIL COMPONENTS ====================
const ModuleDetailHeader = ({ module, themeClasses }) => (
  <div className={`p-6 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border`}>
    <div className="flex items-center space-x-4 mb-4">
      <div className={`p-4 rounded-xl bg-gradient-to-r ${module.color}`}>
        <module.icon size={32} className="text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold">{module.title}</h1>
        <p className={`text-lg ${themeClasses.text.muted}`}>{module.subtitle}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <h4 className="font-semibold">Tính năng chính</h4>
        <ul className={`text-sm space-y-1 ${themeClasses.text.muted}`}>
          {module.features.map((feature, index) => (
            <li key={index}>• {feature}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Lợi ích kinh doanh</h4>
        <ul className={`text-sm space-y-1 ${themeClasses.text.muted}`}>
          {module.benefits.map((benefit, index) => (
            <li key={index}>• {benefit}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Thông số đánh giá</h4>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm">Độ ưu tiên:</span>
            <span className="text-sm font-semibold">{module.priority}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Độ phức tạp:</span>
            <span className="text-sm font-semibold">{module.complexity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Thời gian phát triển:</span>
            <span className="text-sm font-semibold">
              {module.complexity === 'High' ? '6-8 tuần' :
               module.complexity === 'Medium' ? '4-6 tuần' : '2-4 tuần'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ModuleMetrics = ({ moduleId, data, themeClasses }) => {
  const getMetricsConfig = (moduleId, data) => {
    switch (moduleId) {
      case 'orders':
        return [
          { label: 'Tổng đơn hàng', value: data.total, unit: 'đơn', color: 'blue' },
          { label: 'Chờ xử lý', value: data.pending, unit: 'đơn', color: 'yellow' },
          { label: 'Đang xử lý', value: data.inProgress, unit: 'đơn', color: 'purple' },
          { label: 'SLA Compliance', value: data.slaCompliance, unit: '%', color: 'green' }
        ];
      case 'picking':
        return [
          { label: 'Route đang chạy', value: data.activeRoutes, unit: 'route', color: 'blue' },
          { label: 'Thời gian TB', value: data.avgPickTime, unit: 'phút', color: 'green' },
          { label: 'Độ chính xác', value: data.accuracy, unit: '%', color: 'emerald' },
          { label: 'Hiệu suất', value: data.efficiency, unit: '%', color: 'purple' }
        ];
      case 'warehouse':
        return [
          { label: 'Tổng số zone', value: data.totalZones, unit: 'zone', color: 'blue' },
          { label: 'Tỷ lệ sử dụng', value: data.utilization, unit: '%', color: 'yellow' },
          { label: 'Sức chứa', value: data.capacity, unit: 'items', color: 'green' },
          { label: 'Hotspots', value: data.hotspots, unit: 'zone', color: 'red' }
        ];
      case 'alerts':
        return [
          { label: 'Cảnh báo active', value: data.active, unit: 'alerts', color: 'blue' },
          { label: 'Mức độ nghiêm trọng', value: data.critical, unit: 'critical', color: 'red' },
          { label: 'Đã xử lý hôm nay', value: data.todayResolved, unit: 'alerts', color: 'green' },
          { label: 'Thời gian phản hồi', value: data.avgResponseTime, unit: 'phút', color: 'purple' }
        ];
      case 'reports':
        return [
          { label: 'Báo cáo tự động', value: data.scheduledReports, unit: 'reports', color: 'blue' },
          { label: 'Dashboard tùy chỉnh', value: data.customDashboards, unit: 'dashboards', color: 'purple' },
          { label: 'Export hôm nay', value: data.exportedToday, unit: 'files', color: 'green' },
          { label: 'Lượt xem tuần', value: data.viewsThisWeek, unit: 'views', color: 'yellow' }
        ];
      case 'history':
        return [
          { label: 'Tổng records', value: data.totalRecords, unit: 'records', color: 'blue' },
          { label: 'Entries hôm nay', value: data.todayEntries, unit: 'entries', color: 'green' },
          { label: 'Thời gian lưu trữ', value: data.retentionDays, unit: 'ngày', color: 'purple' },
          { label: 'Trường tìm kiếm', value: data.searchableFields, unit: 'fields', color: 'yellow' }
        ];
      default:
        return [];
    }
  };

  const metrics = getMetricsConfig(moduleId, data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className={`p-4 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
          <p className={`text-sm font-medium ${themeClasses.text.muted} mb-1`}>{metric.label}</p>
          <p className="text-2xl font-bold mb-1">
            {typeof metric.value === 'number' && metric.value > 1000
              ? (metric.value / 1000).toFixed(1) + 'K'
              : metric.value}
            <span className="text-sm font-normal ml-1">{metric.unit}</span>
          </p>
          <div className={`w-full h-1 rounded bg-${metric.color}-200`}>
            <div className={`h-1 rounded bg-${metric.color}-500`} style={{ width: '70%' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ModuleDemo = ({ moduleId, data, themeClasses }) => {
  switch (moduleId) {
    case 'orders':
      return <OrdersDemo data={data} themeClasses={themeClasses} />;
    case 'picking':
      return <PickingDemo data={data} themeClasses={themeClasses} />;
    case 'warehouse':
      return <WarehouseDemo data={data} themeClasses={themeClasses} />;
    case 'alerts':
      return <AlertsDemo data={data} themeClasses={themeClasses} />;
    case 'reports':
      return <ReportsDemo data={data} themeClasses={themeClasses} />;
    case 'history':
      return <HistoryDemo data={data} themeClasses={themeClasses} />;
    default:
      return null;
  }
};

// ==================== INDIVIDUAL MODULE DEMOS ====================
const OrdersDemo = ({ data, themeClasses }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className={`p-6 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border`}>
      <h3 className="text-lg font-semibold mb-4">Đơn hàng gần đây</h3>
      <div className="space-y-3">
        {data.recentOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div>
              <p className="font-medium">{order.id}</p>
              <p className={`text-sm ${themeClasses.text.muted}`}>{order.customer}</p>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded text-xs ${
                order.priority === 'P1' ? 'bg-red-100 text-red-700' :
                order.priority === 'P2' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {order.priority}
              </span>
              <p className="text-sm mt-1">SLA: {order.slaRemaining}m</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className={`p-6 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border`}>
      <h3 className="text-lg font-semibold mb-4">Workflow Automation</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="text-green-500" size={20} />
          <span>Auto-assignment theo skills</span>
        </div>
        <div className="flex items-center space-x-3">
          <Clock className="text-blue-500" size={20} />
          <span>SLA tracking real-time</span>
        </div>
        <div className="flex items-center space-x-3">
          <Bell className="text-orange-500" size={20} />
          <span>Escalation tự động</span>
        </div>
        <div className="flex items-center space-x-3">
          <BarChart3 className="text-purple-500" size={20} />
          <span>Analytics và reporting</span>
        </div>
      </div>
    </div>
  </div>
);

const PickingDemo = ({ data, themeClasses }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className={`p-6 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border`}>
      <h3 className="text-lg font-semibold mb-4">Route đang hoạt động</h3>
      <div className="space-y-3">
        {data.routes.map((route) => (
          <div key={route.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{route.id}</span>
              <span className="text-sm text-gray-500">{route.estimatedTime}m còn lại</span>
            </div>
            <p className={`text-sm ${themeClasses.text.muted} mb-2`}>
              {route.picker} • {route.zone} • {route.items} items
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${route.completion}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{route.completion}% hoàn thành</p>
          </div>
        ))}
      </div>
    </div>

    <div className={`p-6 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border`}>
      <h3 className="text-lg font-semibold mb-4">Smart Features</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Route Optimization</span>
          <Zap className="text-yellow-500" size={20} />
        </div>
        <div className="flex items-center justify-between">
          <span>Barcode Scanning</span>
          <Scan className="text-blue-500" size={20} />
        </div>
        <div className="flex items-center justify-between">
          <span>Voice Picking</span>
          <Lightbulb className="text-green-500" size={20} />
        </div>
        <div className="flex items-center justify-between">
          <span>Error Prevention</span>
          <Shield className="text-red-500" size={20} />
        </div>
      </div>
    </div>
  </div>
);

const WarehouseDemo = ({ data, themeClasses }) => (
  <div className="space-y-6">
    <div className={`p-6 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border`}>
      <h3 className="text-lg font-semibold mb-4">Warehouse Layout</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {data.zones.map((zone) => (
          <div key={zone.id} className={`p-4 rounded-lg border-2 ${
            zone.utilization > 90 ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
            zone.utilization > 70 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
            'border-green-500 bg-green-50 dark:bg-green-900/20'
          }`}>
            <h4 className="font-semibold">{zone.id}</h4>
            <p className="text-sm text-gray-600">{zone.type}</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs">
                <span>Sử dụng: {zone.utilization}%</span>
                <span>{zone.items} items</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div
                  className={`h-1 rounded-full ${
                    zone.utilization > 90 ? 'bg-red-500' :
                    zone.utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${zone.utilization}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className={`text-sm ${themeClasses.text.muted}`}>
        💡 Interactive 3D map sẽ hiển thị real-time flow, heat mapping và route optimization
      </p>
    </div>
  </div>
);

const AlertsDemo = ({ data, themeClasses }) => (
  <div className="space-y-4">
    {data.recent.map((alert, index) => (
      <div key={index} className={`p-4 rounded-xl border-l-4 ${
        alert.type === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
        alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
        'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      } ${themeClasses.surface}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {alert.type === 'critical' ? <AlertTriangle className="text-red-500 mt-1" size={20} /> :
             alert.type === 'warning' ? <AlertCircle className="text-yellow-500 mt-1" size={20} /> :
             <Bell className="text-blue-500 mt-1" size={20} />}
            <div>
              <h4 className="font-semibold">{alert.title}</h4>
              <p className={`text-sm ${themeClasses.text.muted} mt-1`}>{alert.message}</p>
            </div>
          </div>
          <span className={`text-xs ${themeClasses.text.muted}`}>{alert.time}</span>
        </div>
      </div>
    ))}
  </div>
);

const ReportsDemo = ({ data, themeClasses }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className={`p-6 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border`}>
      <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
      <div className="space-y-3">
        {data.insights.map((insight, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <span className="font-medium">{insight.metric}</span>
            <div className="text-right">
              <span className={`font-bold ${
                insight.value.startsWith('+') ? 'text-green-500' :
                insight.value.startsWith('-') ? 'text-blue-500' : 'text-gray-500'
              }`}>
                {insight.value}
              </span>
              <p className={`text-xs ${themeClasses.text.muted}`}>{insight.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className={`p-6 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border`}>
      <h3 className="text-lg font-semibold mb-4">Report Capabilities</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <PieChart className="text-blue-500" size={20} />
          <span>Interactive Charts</span>
        </div>
        <div className="flex items-center space-x-3">
          <Download className="text-green-500" size={20} />
          <span>Multiple Export Formats</span>
        </div>
        <div className="flex items-center space-x-3">
          <Clock className="text-purple-500" size={20} />
          <span>Scheduled Reports</span>
        </div>
        <div className="flex items-center space-x-3">
          <Gauge className="text-orange-500" size={20} />
          <span>Real-time Dashboards</span>
        </div>
      </div>
    </div>
  </div>
);

const HistoryDemo = ({ data, themeClasses }) => (
  <div className={`p-6 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border`}>
    <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
    <div className="space-y-3">
      {data.recentActivities.map((activity, index) => (
        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <div className="flex-1">
            <p className="font-medium">{activity.action}</p>
            <p className={`text-sm ${themeClasses.text.muted}`}>
              {activity.user} • {activity.target} • {activity.time}
            </p>
          </div>
          <Eye size={16} className={`${themeClasses.text.muted} cursor-pointer hover:text-blue-500`} />
        </div>
      ))}
    </div>
  </div>
);

// ==================== MODULE COMPARISON COMPONENT ====================
const ModuleComparison = ({ modules, themeClasses }) => {
  if (modules.length === 0) {
    return (
      <div className={`p-12 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border text-center`}>
        <BarChart2 size={64} className={`mx-auto mb-4 ${themeClasses.text.muted}`} />
        <p className={themeClasses.text.muted}>
          Chọn 2-3 modules từ trang tổng quan để so sánh chi tiết
        </p>
      </div>
    );
  }

  const comparisonMetrics = [
    { key: 'priority', label: 'Độ ưu tiên' },
    { key: 'complexity', label: 'Độ phức tạp' },
    { key: 'features', label: 'Số tính năng' },
    { key: 'benefits', label: 'Lợi ích chính' }
  ];

  return (
    <div className="space-y-6">
      {/* Comparison table */}
      <div className={`rounded-2xl ${themeClasses.surface} ${themeClasses.border} border overflow-hidden`}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left p-4 font-semibold">Tiêu chí</th>
              {modules.map(module => (
                <th key={module.id} className="text-left p-4 font-semibold">
                  <div className="flex items-center space-x-2">
                    <module.icon size={20} />
                    <span>{module.title}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonMetrics.map(metric => (
              <tr key={metric.key} className="border-b border-gray-100 dark:border-gray-800">
                <td className="p-4 font-medium">{metric.label}</td>
                {modules.map(module => (
                  <td key={module.id} className="p-4">
                    {metric.key === 'features' ? module.features.length :
                     metric.key === 'benefits' ? module.benefits.length :
                     module[metric.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Development timeline */}
      <div className={`p-6 rounded-2xl ${themeClasses.surface} ${themeClasses.border} border`}>
        <h3 className="text-lg font-semibold mb-4">Timeline phát triển ước tính</h3>
        <div className="space-y-4">
          {modules.map((module, index) => (
            <div key={module.id} className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${module.color} bg-opacity-20`}>
                <module.icon size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium">{module.title}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                  <div
                    className={`bg-gradient-to-r ${module.color} h-2 rounded-full`}
                    style={{ width: `${100 - index * 20}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-medium">
                {module.complexity === 'High' ? '6-8 tuần' :
                 module.complexity === 'Medium' ? '4-6 tuần' : '2-4 tuần'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModulesDemo;
