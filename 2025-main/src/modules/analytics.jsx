import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, PieChart, TrendingUp, TrendingDown, Activity, Target,
  Download, Calendar, Filter, Search, Settings, RefreshCw, Eye,
  Clock, Package, Users, Truck, MapPin, Zap, AlertTriangle,
  CheckCircle, DollarSign, Percent, ArrowUp, ArrowDown, Minus,
  FileText, Mail, Smartphone, Globe, Database, LineChart,
  Layers, Route, Warehouse, ShoppingCart, Timer, Gauge, Star,
  Award, Lightbulb, Flag, Coffee, Moon, Sun, MoreVertical,
  ChevronDown, ChevronRight, Plus, Edit, Save, X, Share2
} from 'lucide-react';

// ==================== MOCK DATA ====================
const generateAnalyticsData = () => ({
  kpis: {
    totalOrders: 2847,
    completedOrders: 2698,
    slaCompliance: 94.8,
    avgProcessingTime: 22.5, // minutes
    throughputRate: 126, // orders/hour
    errorRate: 1.2,
    costPerOrder: 15500, // VND
    revenueImpact: 847000000, // VND
    staffUtilization: 87.3,
    warehouseUtilization: 78.9
  },

  trends: {
    daily: [
      { date: '2025-05-26', orders: 245, sla: 92.1, errors: 3, revenue: 78000000 },
      { date: '2025-05-27', orders: 267, sla: 94.3, errors: 2, revenue: 85000000 },
      { date: '2025-05-28', orders: 289, sla: 96.2, errors: 4, revenue: 92000000 },
      { date: '2025-05-29', orders: 312, sla: 93.8, errors: 5, revenue: 98000000 },
      { date: '2025-05-30', orders: 298, sla: 95.7, errors: 2, revenue: 94000000 },
      { date: '2025-05-31', orders: 334, sla: 97.1, errors: 3, revenue: 106000000 },
      { date: '2025-06-01', orders: 289, sla: 94.8, errors: 1, revenue: 89000000 }
    ],

    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      orders: Math.floor(Math.random() * 50) + 10,
      efficiency: Math.floor(Math.random() * 20) + 80,
      staff: Math.floor(Math.random() * 3) + 2
    })),

    monthly: [
      { month: 'Jan', orders: 7234, sla: 91.2, cost: 112000000, revenue: 2340000000 },
      { month: 'Feb', orders: 8156, sla: 93.1, cost: 119000000, revenue: 2680000000 },
      { month: 'Mar', orders: 9012, sla: 94.8, cost: 125000000, revenue: 2950000000 },
      { month: 'Apr', orders: 8789, sla: 96.2, cost: 118000000, revenue: 2870000000 },
      { month: 'May', orders: 9543, sla: 95.7, cost: 131000000, revenue: 3120000000 }
    ]
  },

  performance: {
    byStaff: [
      { id: 'NV001', name: 'Nguyễn Văn A', orders: 312, sla: 98.5, efficiency: 94, errors: 2 },
      { id: 'NV002', name: 'Trần Thị B', orders: 298, sla: 97.2, efficiency: 91, errors: 3 },
      { id: 'NV003', name: 'Lê Văn C', orders: 286, sla: 95.8, efficiency: 89, errors: 4 },
      { id: 'NV004', name: 'Phạm Thị D', orders: 267, sla: 94.1, efficiency: 87, errors: 5 },
      { id: 'NV005', name: 'Hoàng Văn E', orders: 245, sla: 92.6, efficiency: 85, errors: 7 }
    ],

    byZone: [
      { zone: 'A', utilization: 95, avgTime: 2.3, accuracy: 98.2, revenue: 156000000 },
      { zone: 'B', utilization: 78, avgTime: 2.8, accuracy: 97.1, revenue: 98000000 },
      { zone: 'C', utilization: 65, avgTime: 3.5, accuracy: 95.8, revenue: 67000000 },
      { zone: 'D', utilization: 88, avgTime: 4.2, accuracy: 99.1, revenue: 234000000 }
    ],

    byProduct: [
      { name: 'Vali Larita 28"', orders: 456, revenue: 198000000, margin: 23.5, stockTurns: 12.3 },
      { name: 'Vali Pisani 24"', orders: 398, revenue: 167000000, margin: 21.2, stockTurns: 10.8 },
      { name: 'Luggage Tag Set', orders: 623, revenue: 89000000, margin: 45.6, stockTurns: 24.1 },
      { name: 'Travel Pillow', orders: 389, revenue: 78000000, margin: 38.9, stockTurns: 18.7 },
      { name: 'TSA Lock', orders: 512, revenue: 56000000, margin: 42.1, stockTurns: 28.4 }
    ]
  },

  predictions: {
    nextWeek: {
      expectedOrders: 2156,
      peakDay: 'Wednesday',
      peakHour: 14,
      recommendedStaff: 6,
      riskFactors: ['Holiday surge', 'New product launch', 'Competitor promotion']
    },

    alerts: [
      { type: 'opportunity', message: 'Zone A có thể tăng capacity 15% với 1 nhân viên thêm' },
      { type: 'warning', message: 'Dự báo thiếu stock Vali Larita trong 3 ngày tới' },
      { type: 'insight', message: 'Peak hour 14:00-16:00 có thể tối ưu bằng pre-staging' }
    ]
  }
});

const REPORT_TEMPLATES = [
  {
    id: 'daily-summary',
    name: 'Daily Operations Summary',
    icon: Calendar,
    schedule: 'Daily 08:00',
    recipients: ['manager@mia.com', 'operations@mia.com'],
    format: 'PDF + Excel',
    lastRun: '2025-06-01 08:00'
  },
  {
    id: 'weekly-performance',
    name: 'Weekly Performance Review',
    icon: TrendingUp,
    schedule: 'Monday 09:00',
    recipients: ['ceo@mia.com', 'warehouse@mia.com'],
    format: 'PDF',
    lastRun: '2025-05-27 09:00'
  },
  {
    id: 'monthly-analytics',
    name: 'Monthly Analytics Deep Dive',
    icon: BarChart3,
    schedule: '1st of month',
    recipients: ['board@mia.com'],
    format: 'Presentation + Data',
    lastRun: '2025-05-01 10:00'
  },
  {
    id: 'inventory-forecast',
    name: 'Inventory & Demand Forecast',
    icon: Package,
    schedule: 'Bi-weekly',
    recipients: ['supply@mia.com', 'finance@mia.com'],
    format: 'Excel + Dashboard',
    lastRun: '2025-05-28 14:00'
  }
];

// ==================== MAIN COMPONENT ====================
const WarehouseAnalytics = () => {
  const [data, setData] = useState(generateAnalyticsData());
  const [activeView, setActiveView] = useState('overview');
  const [timeRange, setTimeRange] = useState('7d');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
  const [selectedMetrics, setSelectedMetrics] = useState(['orders', 'sla', 'efficiency']);

  // Real-time data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateAnalyticsData());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const views = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'trends', label: 'Xu hướng', icon: TrendingUp },
    { id: 'performance', label: 'Hiệu suất', icon: Target },
    { id: 'reports', label: 'Báo cáo', icon: FileText },
    { id: 'predictions', label: 'Dự báo', icon: Lightbulb }
  ];

  const timeRanges = [
    { value: '1d', label: 'Hôm nay' },
    { value: '7d', label: '7 ngày' },
    { value: '30d', label: '30 ngày' },
    { value: '90d', label: '3 tháng' },
    { value: 'custom', label: 'Tùy chỉnh' }
  ];

  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    surface: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500'
    },
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200'
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${themeClasses.background} ${themeClasses.text.primary}`}>
      {/* Header */}
      <div className={`${themeClasses.surface} border-b ${themeClasses.border} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Warehouse Analytics & Reports</h1>
              <p className={`${themeClasses.text.muted}`}>
                Phân tích dữ liệu kho vận • 01/06/2025 14:40 • Auto-refresh: 30s
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Time range selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-3 py-2 border ${themeClasses.border} rounded-lg ${themeClasses.surface} ${themeClasses.text.primary}`}
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${themeClasses.surface} border ${themeClasses.border} hover:opacity-80 transition-colors`}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Export */}
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download size={16} />
              <span>Export</span>
            </button>

            {/* Settings */}
            <button className={`p-2 rounded-lg ${themeClasses.surface} border ${themeClasses.border} hover:opacity-80 transition-colors`}>
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-2 mt-6 overflow-x-auto">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeView === view.id
                  ? 'bg-blue-600 text-white'
                  : `${themeClasses.surface} ${themeClasses.text.secondary} hover:${themeClasses.text.primary}`
              }`}
            >
              <view.icon size={16} />
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeView === 'overview' && (
          <OverviewView data={data} themeClasses={themeClasses} />
        )}
        {activeView === 'trends' && (
          <TrendsView data={data.trends} themeClasses={themeClasses} />
        )}
        {activeView === 'performance' && (
          <PerformanceView data={data.performance} themeClasses={themeClasses} />
        )}
        {activeView === 'reports' && (
          <ReportsView templates={REPORT_TEMPLATES} themeClasses={themeClasses} />
        )}
        {activeView === 'predictions' && (
          <PredictionsView data={data.predictions} themeClasses={themeClasses} />
        )}
      </div>
    </div>
  );
};

// ==================== OVERVIEW VIEW ====================
const OverviewView = ({ data, themeClasses }) => {
  const kpiCards = [
    {
      label: 'Tổng đơn hàng',
      value: data.kpis.totalOrders,
      change: '+12.5%',
      positive: true,
      icon: Package,
      color: 'blue'
    },
    {
      label: 'SLA Compliance',
      value: `${data.kpis.slaCompliance}%`,
      change: '+2.3%',
      positive: true,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Thời gian xử lý TB',
      value: `${data.kpis.avgProcessingTime} phút`,
      change: '-8.7%',
      positive: true,
      icon: Clock,
      color: 'purple'
    },
    {
      label: 'Throughput Rate',
      value: `${data.kpis.throughputRate} đơn/giờ`,
      change: '+15.2%',
      positive: true,
      icon: TrendingUp,
      color: 'orange'
    },
    {
      label: 'Tỷ lệ lỗi',
      value: `${data.kpis.errorRate}%`,
      change: '-45.8%',
      positive: true,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      label: 'Chi phí/Đơn',
      value: `${Math.round(data.kpis.costPerOrder/1000)}K VND`,
      change: '-5.4%',
      positive: true,
      icon: DollarSign,
      color: 'indigo'
    },
    {
      label: 'Sử dụng nhân sự',
      value: `${data.kpis.staffUtilization}%`,
      change: '+3.1%',
      positive: true,
      icon: Users,
      color: 'teal'
    },
    {
      label: 'Sử dụng kho',
      value: `${data.kpis.warehouseUtilization}%`,
      change: '+7.8%',
      positive: true,
      icon: Warehouse,
      color: 'cyan'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <KPICard key={index} kpi={kpi} themeClasses={themeClasses} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily trends chart */}
        <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
          <h3 className="text-lg font-semibold mb-4">Xu hướng 7 ngày gần đây</h3>
          <div className="h-64 flex items-end space-x-2">
            {data.trends.daily.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(day.orders / 350) * 200}px` }}
                  ></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                    {day.orders}
                  </div>
                </div>
                <span className="text-xs mt-2">{day.date.slice(-2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SLA compliance chart */}
        <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
          <h3 className="text-lg font-semibold mb-4">SLA Compliance Trend</h3>
          <div className="h-64 flex items-end space-x-2">
            {data.trends.daily.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full">
                  <div
                    className={`w-full rounded-t ${day.sla >= 95 ? 'bg-green-500' : day.sla >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ height: `${(day.sla / 100) * 200}px` }}
                  ></div>
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                    {day.sla.toFixed(1)}%
                  </div>
                </div>
                <span className="text-xs mt-2">{day.date.slice(-2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time activity */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Hoạt động thời gian thực</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Activity className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-2xl font-bold text-blue-600">15</p>
            <p className="text-sm text-gray-600">Đơn đang xử lý</p>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Users className="mx-auto mb-2 text-green-600" size={24} />
            <p className="text-2xl font-bold text-green-600">8</p>
            <p className="text-sm text-gray-600">Nhân viên online</p>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Gauge className="mx-auto mb-2 text-purple-600" size={24} />
            <p className="text-2xl font-bold text-purple-600">94%</p>
            <p className="text-sm text-gray-600">Hiệu suất hiện tại</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== KPI CARD COMPONENT ====================
const KPICard = ({ kpi, themeClasses }) => {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    green: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
    red: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    indigo: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30',
    teal: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30',
    cyan: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30'
  };

  return (
    <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm ${themeClasses.text.muted} mb-1`}>{kpi.label}</p>
          <p className="text-2xl font-bold mb-2">{kpi.value}</p>
          <div className="flex items-center space-x-1">
            {kpi.positive ? (
              <ArrowUp size={14} className="text-green-500" />
            ) : (
              <ArrowDown size={14} className="text-red-500" />
            )}
            <span className={`text-sm font-medium ${kpi.positive ? 'text-green-600' : 'text-red-600'}`}>
              {kpi.change}
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${colorMap[kpi.color]}`}>
          <kpi.icon size={20} />
        </div>
      </div>
    </div>
  );
};

// ==================== TRENDS VIEW ====================
const TrendsView = ({ data, themeClasses }) => {
  return (
    <div className="space-y-6">
      {/* Monthly trends */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-6">Xu hướng theo tháng</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Orders trend */}
          <div>
            <h4 className="font-medium mb-4">Số lượng đơn hàng</h4>
            <div className="h-48 flex items-end space-x-3">
              {data.monthly.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                    style={{ height: `${(month.orders / 10000) * 160}px` }}
                  ></div>
                  <span className="text-xs mt-2">{month.month}</span>
                  <span className="text-xs text-gray-500">{(month.orders/1000).toFixed(1)}K</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue trend */}
          <div>
            <h4 className="font-medium mb-4">Doanh thu (tỷ VND)</h4>
            <div className="h-48 flex items-end space-x-3">
              {data.monthly.map((month, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                    style={{ height: `${(month.revenue / 3500000000) * 160}px` }}
                  ></div>
                  <span className="text-xs mt-2">{month.month}</span>
                  <span className="text-xs text-gray-500">{(month.revenue/1000000000).toFixed(1)}B</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hourly patterns */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-6">Mẫu hoạt động theo giờ</h3>
        <div className="h-64 flex items-end space-x-1">
          {data.hourly.map((hour, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative w-full">
                <div
                  className={`w-full rounded-t ${
                    hour.hour >= 8 && hour.hour <= 17 ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                  style={{ height: `${(hour.orders / 60) * 200}px` }}
                ></div>
                {hour.orders > 40 && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                    {hour.orders}
                  </div>
                )}
              </div>
              <span className="text-xs mt-1">{hour.hour}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Peak hours: 10:00-12:00, 14:00-16:00 • Off-peak: 20:00-06:00
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="text-green-500" size={20} />
            <span>Xu hướng tích cực</span>
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <ArrowUp size={14} className="text-green-500" />
              <span className="text-sm">SLA compliance tăng 2.3% trong tháng qua</span>
            </li>
            <li className="flex items-center space-x-2">
              <ArrowUp size={14} className="text-green-500" />
              <span className="text-sm">Throughput rate cải thiện 15.2%</span>
            </li>
            <li className="flex items-center space-x-2">
              <ArrowUp size={14} className="text-green-500" />
              <span className="text-sm">Giảm error rate 45.8%</span>
            </li>
          </ul>
        </div>

        <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Lightbulb className="text-yellow-500" size={20} />
            <span>Insights & Cơ hội</span>
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <Target size={14} className="text-blue-500" />
              <span className="text-sm">Peak efficiency tại 14:00-16:00 hàng ngày</span>
            </li>
            <li className="flex items-center space-x-2">
              <Zap size={14} className="text-purple-500" />
              <span className="text-sm">Zone A có thể optimize thêm 12%</span>
            </li>
            <li className="flex items-center space-x-2">
              <Star size={14} className="text-yellow-500" />
              <span className="text-sm">Top performer: Nguyễn Văn A (98.5% SLA)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ==================== PERFORMANCE VIEW ====================
const PerformanceView = ({ data, themeClasses }) => {
  return (
    <div className="space-y-6">
      {/* Staff performance */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-6">Hiệu suất nhân viên</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Nhân viên</th>
                <th className="text-left py-3 px-4">Đơn hàng</th>
                <th className="text-left py-3 px-4">SLA (%)</th>
                <th className="text-left py-3 px-4">Hiệu suất (%)</th>
                <th className="text-left py-3 px-4">Lỗi</th>
                <th className="text-left py-3 px-4">Xếp hạng</th>
              </tr>
            </thead>
            <tbody>
              {data.byStaff.map((staff, index) => (
                <tr key={staff.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {staff.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-xs text-gray-500">{staff.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{staff.orders}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span>{staff.sla}%</span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${staff.sla >= 95 ? 'bg-green-500' : 'bg-yellow-500'}`}
                          style={{ width: `${staff.sla}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span>{staff.efficiency}%</span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${staff.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      staff.errors <= 3 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {staff.errors}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      {index === 0 && <Award className="text-yellow-500" size={16} />}
                      <span className="font-medium">#{index + 1}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zone performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
          <h3 className="text-lg font-semibold mb-6">Hiệu suất theo khu vực</h3>
          <div className="space-y-4">
            {data.byZone.map((zone) => (
              <div key={zone.zone} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Zone {zone.zone}</span>
                  <span className="text-sm text-gray-500">{zone.utilization}% utilization</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Avg Time</p>
                    <p className="font-medium">{zone.avgTime} min</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Accuracy</p>
                    <p className="font-medium">{zone.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-medium">{Math.round(zone.revenue/1000000)}M</p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${zone.utilization}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product performance */}
        <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
          <h3 className="text-lg font-semibold mb-6">Top sản phẩm</h3>
          <div className="space-y-3">
            {data.byProduct.slice(0, 5).map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.orders} đơn • {product.stockTurns} turns</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{Math.round(product.revenue/1000000)}M</p>
                  <p className="text-sm text-green-600">{product.margin}% margin</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== REPORTS VIEW ====================
const ReportsView = ({ templates, themeClasses }) => {
  return (
    <div className="space-y-6">
      {/* Report templates */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Automated Report Templates</h3>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={16} />
            <span>Tạo mới</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <template.icon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-500">{template.schedule}</p>
                  </div>
                </div>
                <button className="p-1 text-gray-500 hover:text-gray-700">
                  <MoreVertical size={16} />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Recipients:</span>
                  <span>{template.recipients.length} users</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Format:</span>
                  <span>{template.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last run:</span>
                  <span>{template.lastRun}</span>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                  Run Now
                </button>
                <button className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export options */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <FileText className="mx-auto mb-2 text-red-500" size={24} />
            <p className="font-medium">PDF Report</p>
            <p className="text-sm text-gray-500">Executive summary</p>
          </button>

          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Database className="mx-auto mb-2 text-green-500" size={24} />
            <p className="font-medium">Excel Data</p>
            <p className="text-sm text-gray-500">Raw data export</p>
          </button>

          <button className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Share2 className="mx-auto mb-2 text-blue-500" size={24} />
            <p className="font-medium">Share Dashboard</p>
            <p className="text-sm text-gray-500">Live link</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== PREDICTIONS VIEW ====================
const PredictionsView = ({ data, themeClasses }) => {
  return (
    <div className="space-y-6">
      {/* Next week forecast */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
          <Lightbulb className="text-yellow-500" size={20} />
          <span>Dự báo tuần tới</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Package className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-2xl font-bold text-blue-600">{data.nextWeek.expectedOrders}</p>
            <p className="text-sm text-gray-600">Dự kiến đơn hàng</p>
          </div>

          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Calendar className="mx-auto mb-2 text-green-600" size={24} />
            <p className="text-2xl font-bold text-green-600">{data.nextWeek.peakDay}</p>
            <p className="text-sm text-gray-600">Ngày cao điểm</p>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Clock className="mx-auto mb-2 text-purple-600" size={24} />
            <p className="text-2xl font-bold text-purple-600">{data.nextWeek.peakHour}:00</p>
            <p className="text-sm text-gray-600">Giờ cao điểm</p>
          </div>

          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Users className="mx-auto mb-2 text-orange-600" size={24} />
            <p className="text-2xl font-bold text-orange-600">{data.nextWeek.recommendedStaff}</p>
            <p className="text-sm text-gray-600">Nhân viên cần</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Risk Factors</h4>
          <div className="space-y-2">
            {data.nextWeek.riskFactors.map((risk, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <AlertTriangle size={14} className="text-yellow-600" />
                <span className="text-sm">{risk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-6 flex items-center space-x-2">
          <Activity className="text-purple-500" size={20} />
          <span>AI-Generated Insights</span>
        </h3>

        <div className="space-y-4">
          {data.alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'opportunity' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex items-start space-x-3">
                {alert.type === 'opportunity' ? (
                  <TrendingUp className="text-green-600 mt-1" size={16} />
                ) : alert.type === 'warning' ? (
                  <AlertTriangle className="text-yellow-600 mt-1" size={16} />
                ) : (
                  <Lightbulb className="text-blue-600 mt-1" size={16} />
                )}
                <div>
                  <p className="text-sm font-medium capitalize">{alert.type}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization recommendations */}
      <div className={`${themeClasses.surface} rounded-xl border ${themeClasses.border} p-6`}>
        <h3 className="text-lg font-semibold mb-6">Đề xuất tối ưu hóa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Target className="mb-2 text-blue-600" size={20} />
            <h4 className="font-medium mb-2">Staffing Optimization</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Thêm 1 nhân viên vào ca chiều để tăng 15% throughput và giảm overtime cost.
            </p>
            <div className="mt-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Tiết kiệm: 2.3M VND/tháng
              </span>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Route className="mb-2 text-green-600" size={20} />
            <h4 className="font-medium mb-2">Layout Optimization</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Di chuyển fast-moving items gần picking station để giảm 25% di chuyển.
            </p>
            <div className="mt-3">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                Tiết kiệm: 1.8 phút/đơn
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseAnalytics;
