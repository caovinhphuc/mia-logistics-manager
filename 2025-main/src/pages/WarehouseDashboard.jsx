import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import OverviewTab from '../module/DashoardTab';
import {
  BarChart2, Package, Calendar, Users, Settings,
  Clock, Activity, CheckCircle
} from 'lucide-react';

const WarehouseDashboard = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Dữ liệu mẫu cho dashboard
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalOrders: 347,
      pendingOrders: 42,
      processingOrders: 87,
      completedOrders: 218,
      p1Orders: 12,
      p2Orders: 24,
      slaRate: 94.2,
      avgOrderTime: 27
    },
    orders: [
      {
        id: "ORD-12593",
        channel: "Shopee",
        priority: "P1",
        deadline: new Date(Date.now() + 45 * 60000).toISOString(),
        detail: "Vali Larita 28L (Xanh) x1, Tag hành lý x2",
        status: "pending"
      },
      {
        id: "ORD-12594",
        channel: "TikTok",
        priority: "P1",
        deadline: new Date(Date.now() + 32 * 60000).toISOString(),
        detail: "Vali Larita 20L (Đỏ) x1, Gối cổ x1",
        status: "processing"
      },
      {
        id: "ORD-12595",
        channel: "Lazada",
        priority: "P1",
        deadline: new Date(Date.now() + 68 * 60000).toISOString(),
        detail: "Balo du lịch Nomad x1, Ví passport x3",
        status: "processing"
      },
      {
        id: "ORD-12596",
        channel: "Shopee",
        priority: "P1",
        deadline: new Date(Date.now() + 90 * 60000).toISOString(),
        detail: "Vali Larita 28L (Đen) x2, Tag hành lý x4",
        status: "pending"
      }
    ],
    hourlyPerformanceData: [
      { hour: '08:00', orders: 18, completed: 15, sla: 92.3 },
      { hour: '09:00', orders: 23, completed: 20, sla: 93.1 },
      { hour: '10:00', orders: 27, completed: 25, sla: 94.7 },
      { hour: '11:00', orders: 31, completed: 28, sla: 95.2 },
      { hour: '12:00', orders: 19, completed: 17, sla: 97.8 },
      { hour: '13:00', orders: 22, completed: 20, sla: 96.5 },
      { hour: '14:00', orders: 32, completed: 29, sla: 93.4 },
      { hour: '15:00', orders: 29, completed: 26, sla: 92.8 }
    ],
    alerts: [
      {
        type: 'urgent',
        title: 'SLA sắp quá hạn',
        message: '3 đơn P1 còn dưới 30 phút để hoàn thành, cần xử lý ngay!',
        time: '5 phút trước'
      },
      {
        type: 'warning',
        title: 'Tồn kho sắp hết',
        message: 'Vali Larita 28L (Xanh) còn 3 sản phẩm cuối cùng',
        time: '27 phút trước'
      },
      {
        type: 'info',
        title: 'Hiệu suất nhân viên thấp',
        message: 'Nhân viên Nguyễn Văn C đang xử lý chậm hơn 20% so với TB',
        time: '1 giờ trước'
      },
      {
        type: 'info',
        title: 'Cập nhật hệ thống',
        message: 'Phiên bản mới 2.1 đã được cập nhật với tính năng tối ưu',
        time: '2 giờ trước'
      }
    ]
  });

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: <BarChart2 size={18} /> },
    { id: 'orders', label: 'Đơn hàng', icon: <Package size={18} /> },
    { id: 'schedule', label: 'Lịch trình', icon: <Calendar size={18} /> },
    { id: 'staff', label: 'Nhân viên', icon: <Users size={18} /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings size={18} /> },
  ];

  // Get theme-based styling
  const cardClass = darkMode
    ? "border-gray-700 bg-gray-800/60"
    : "border-gray-200 bg-white";

  const buttonSecondaryClass = darkMode
    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
    : "bg-gray-200 hover:bg-gray-300 text-gray-700";

  return (
    <div className="w-full h-full">
      {/* Dashboard header - chỉ hiển thị trong content area */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              Warehouse Dashboard
            </h1>
            <div className="flex items-center mt-1 text-sm">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                Hôm nay, {new Date().toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className={`flex items-center ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                <Clock size={14} className="mr-1" />
                Cập nhật lúc {new Date().toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          {/* Quick stats in header */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
              darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
            }`}>
              <Activity size={14} />
              <span className="text-sm font-medium">SLA: {dashboardData.stats.slaRate}%</span>
            </div>

            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
              darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
            }`}>
              <Package size={14} />
              <span className="text-sm font-medium">Đơn hàng: {dashboardData.stats.totalOrders}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto pb-0 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-4 py-3 mr-4 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? `${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                  : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard content - với padding phù hợp */}
      <div className="px-6 py-6 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewTab
                stats={dashboardData.stats}
                orders={dashboardData.orders}
                hourlyPerformanceData={dashboardData.hourlyPerformanceData}
                alerts={dashboardData.alerts}
                darkMode={darkMode}
                buttonSecondaryClass={buttonSecondaryClass}
                cardClass={cardClass}
              />
            )}

            {activeTab === 'orders' && (
              <div className={`p-8 rounded-lg border ${cardClass} text-center`}>
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Quản lý đơn hàng</h2>
                <p className="text-gray-500">Nội dung quản lý đơn hàng sẽ hiển thị ở đây</p>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className={`p-8 rounded-lg border ${cardClass} text-center`}>
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Lịch trình hoạt động</h2>
                <p className="text-gray-500">Nội dung lịch trình sẽ hiển thị ở đây</p>
              </div>
            )}

            {activeTab === 'staff' && (
              <div className={`p-8 rounded-lg border ${cardClass} text-center`}>
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Quản lý nhân viên</h2>
                <p className="text-gray-500">Nội dung quản lý nhân viên sẽ hiển thị ở đây</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className={`p-8 rounded-lg border ${cardClass} text-center`}>
                <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Cài đặt hệ thống</h2>
                <p className="text-gray-500">Nội dung cài đặt sẽ hiển thị ở đây</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick stats footer - optional */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} mr-3`}>
              <Package className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className="text-xs opacity-70">Tổng đơn</p>
              <p className="text-sm font-bold">{dashboardData.stats.totalOrders}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`p-2 rounded-full ${darkMode ? 'bg-green-900/30' : 'bg-green-100'} mr-3`}>
              <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div>
              <p className="text-xs opacity-70">Hoàn thành</p>
              <p className="text-sm font-bold">{dashboardData.stats.completedOrders}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`p-2 rounded-full ${darkMode ? 'bg-red-900/30' : 'bg-red-100'} mr-3`}>
              <Clock className={`h-4 w-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div>
              <p className="text-xs opacity-70">P1 (Gấp)</p>
              <p className="text-sm font-bold">{dashboardData.stats.p1Orders}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`p-2 rounded-full ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'} mr-3`}>
              <Activity className={`h-4 w-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <p className="text-xs opacity-70">TB xử lý</p>
              <p className="text-sm font-bold">{dashboardData.stats.avgOrderTime}m</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;
