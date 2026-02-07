// Tab Đơn Hàng
//OrderTab.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
   BarChart,
   CartesianGrid,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer
} from 'recharts';

import {
   Bar,
   Pie as RechartPieChart,
   Cell,
   Pie,
   Legend
} from 'recharts';
import {
  Package,
  Clock,
  AlertTriangle,
  Users,
  BarChart2,
  Settings,
  Bell,
  Search,
  LogOut,
  Activity,
  CheckCircle,
  RefreshCw,
  Map,
  PieChart,
  User,
  List,
  Grid,
  FileText,
  Download,
  Eye,
  EyeOff,
  LogIn,
  Cpu,
  Menu,
  X,
  Zap,
  Check,
  Play,
  History,
  XCircle,
  Filter,
  TrendingUp
} from "lucide-react";

const OrderTab = ({ themeClasses, darkMode = false }) => {
  // Mock data and variables
  const stats = {
    totalOrders: 156,
    p1Orders: 12,
    p2Orders: 34,
    slaRate: 95.7,
    avgOrderTime: 23
  };

  const cardClass = `${themeClasses?.surface || 'bg-white dark:bg-gray-800'} ${themeClasses?.border || 'border-gray-200 dark:border-gray-700'}`;
  const buttonSecondaryClass = `${themeClasses?.surfaceHover || 'hover:bg-gray-100 dark:hover:bg-gray-700'} ${themeClasses?.text?.secondary || 'text-gray-600 dark:text-gray-300'}`;

  const hourlyPerformanceData = [
    { hour: '08:00', orders: 12, completed: 10 },
    { hour: '09:00', orders: 18, completed: 16 },
    { hour: '10:00', orders: 25, completed: 22 },
    { hour: '11:00', orders: 30, completed: 28 },
    { hour: '12:00', orders: 15, completed: 14 },
    { hour: '13:00', orders: 20, completed: 18 },
    { hour: '14:00', orders: 28, completed: 25 },
    { hour: '15:00', orders: 22, completed: 20 },
    { hour: '16:00', orders: 35, completed: 32 },
    { hour: '17:00', orders: 28, completed: 26 }
  ];

  const orders = [
    {
      id: 'ORD-001',
      channel: 'Shopee',
      priority: 'P1',
      deadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      status: 'pending'
    },
    {
      id: 'ORD-002',
      channel: 'Lazada',
      priority: 'P1',
      deadline: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
      status: 'processing'
    },
    {
      id: 'ORD-003',
      channel: 'Tiki',
      priority: 'P1',
      deadline: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      status: 'pending'
    },
    {
      id: 'ORD-004',
      channel: 'Website',
      priority: 'P1',
      deadline: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
      status: 'processing'
    }
  ];

  const alerts = [
    {
      type: 'urgent',
      title: 'SLA cảnh báo',
      message: '3 đơn P1 sắp hết hạn xử lý',
      time: '2 phút trước'
    },
    {
      type: 'warning',
      title: 'Nhân viên vắng mặt',
      message: '2 nhân viên chưa check-in',
      time: '5 phút trước'
    },
    {
      type: 'info',
      title: 'Đơn mới',
      message: '15 đơn P2 vừa được tạo',
      time: '10 phút trước'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Tổng đơn</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-20">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> +5% so với hôm qua
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Đơn P1 (Gấp)</p>
              <p className="text-2xl font-bold text-red-500">
                {stats.p1Orders}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-500 bg-opacity-20">
              <Clock className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-orange-500">
              <Clock className="h-3 w-3 mr-1" />{" "}
              {Math.round((stats.p1Orders / stats.totalOrders) * 100)}% tổng đơn
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Tỷ lệ đạt SLA</p>
              <p className="text-2xl font-bold text-green-500">
                {stats.slaRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> +1.2% so với hôm qua
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Thời gian xử lý TB</p>
              <p className="text-2xl font-bold text-purple-500">
                {Math.round(stats.avgOrderTime)} phút
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500 bg-opacity-20">
              <Activity className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> -3 phút so với hôm qua
            </span>
          </div>
        </div>
      </div>

      {/* Biểu đồ hiệu suất */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`lg:col-span-2 p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Hiệu suất xử lý đơn theo giờ
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyPerformanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="hour"
                  stroke={darkMode ? "#9ca3af" : "#4b5563"}
                />
                <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                    color: darkMode ? "#f9fafb" : "#111827",
                  }}
                />
                <Legend />
                <Bar dataKey="orders" name="Tổng đơn" fill="#3b82f6" />
                <Bar dataKey="completed" name="Hoàn thành" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">Phân bổ đơn theo SLA</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPieChart>
                <Pie
                  data={[
                    { name: "P1 - Gấp", value: stats.p1Orders },
                    { name: "P2 - Cảnh báo", value: stats.p2Orders },
                    {
                      name: "P3 - Bình thường",
                      value:
                        stats.totalOrders - stats.p1Orders - stats.p2Orders - 1,
                    },
                    { name: "P4 - Chờ xử lý", value: 1 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#10b981" />
                  <Cell fill="#3b82f6" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                    color: darkMode ? "#f9fafb" : "#111827",
                  }}
                />
              </RechartPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cảnh báo và hoạt động */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass} lg:col-span-2`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Đơn cần xử lý ưu tiên</h3>
            <button
              className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
            >
              Xem tất cả
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Mã đơn
                  </th>
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Kênh
                  </th>
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    SLA
                  </th>
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Deadline
                  </th>
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Trạng thái
                  </th>
                  <th className="py-2 text-center text-xs font-medium text-gray-400">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(
                    (order) =>
                      order.priority === "P1" && order.status !== "completed"
                  )
                  .slice(0, 4)
                  .map((order, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2 text-sm">{order.id}</td>
                      <td className="py-2 text-sm">{order.channel}</td>
                      <td className="py-2 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-red-500 bg-opacity-20 text-red-400">
                          {order.priority}
                        </span>
                      </td>
                      <td className="py-2 text-sm">
                        {new Date(order.deadline).toLocaleTimeString("vi-VN")}
                      </td>
                      <td className="py-2 text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.status === "pending"
                              ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                              : order.status === "processing"
                              ? "bg-blue-500 bg-opacity-20 text-blue-400"
                              : "bg-green-500 bg-opacity-20 text-green-400"
                          }`}
                        >
                          {order.status === "pending"
                            ? "Chờ xử lý"
                            : order.status === "processing"
                            ? "Đang xử lý"
                            : "Hoàn thành"}
                        </span>
                      </td>
                      <td className="py-2 flex justify-center space-x-1">
                        <button
                          className="p-1 text-blue-400 hover:text-blue-300"
                          title="Chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1 text-green-400 hover:text-green-300"
                          title="Phân công"
                        >
                          <Users size={16} />
                        </button>
                        <button
                          className="p-1 text-purple-400 hover:text-purple-300"
                          title="In đơn"
                        >
                          <FileText size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Cảnh báo hoạt động</h3>
            <button
              className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
            >
              Quản lý
            </button>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === "urgent"
                    ? "bg-red-900 bg-opacity-20 border-red-600"
                    : alert.type === "warning"
                    ? "bg-yellow-900 bg-opacity-20 border-yellow-600"
                    : "bg-blue-900 bg-opacity-20 border-blue-600"
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {alert.type === "urgent" ? (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    ) : alert.type === "warning" ? (
                      <Bell className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-xs opacity-75 mt-1">{alert.message}</p>
                  </div>
                </div>
                <div className="mt-1 text-right text-xs opacity-75">
                  {alert.time}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-center">
            <button
              className={`px-3 py-1 rounded text-xs ${buttonSecondaryClass}`}
            >
              Xem tất cả cảnh báo
            </button>
          </div>        </div>
      </div>
    </div>
  );
};

// PropTypes for better development experience
OrderTab.propTypes = {
  themeClasses: PropTypes.object,
  darkMode: PropTypes.bool
};

OrderTab.defaultProps = {
  themeClasses: {
    surface: 'bg-white dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    surfaceHover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
    text: {
      secondary: 'text-gray-600 dark:text-gray-300'
    }
  },
  darkMode: false
};

// ==================== EXPORTS ====================
export default OrderTab;
