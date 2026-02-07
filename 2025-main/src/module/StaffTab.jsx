// File: src/module/StaffTab.jsx
import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Search, Filter, User, Eye, Calendar, Settings } from 'lucide-react';

// Tab Quản Lý Nhân Sự
const StaffTab = ({ data, themeClasses, activeView = "overview", darkMode = false }) => {
  // Mock data và variables
  const cardClass = `${themeClasses?.surface || 'bg-white dark:bg-gray-800'} ${themeClasses?.border || 'border-gray-200 dark:border-gray-700'}`;
  const buttonPrimaryClass = 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600';
  const buttonSecondaryClass = `${themeClasses?.surfaceHover || 'hover:bg-gray-100 dark:hover:bg-gray-700'} ${themeClasses?.text?.secondary || 'text-gray-600 dark:text-gray-300'} border border-gray-300 dark:border-gray-600`;
  const inputClass = `${themeClasses?.input || 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'} rounded px-3 py-2`;

  // Mock employees data
  const employees = [
    { name: 'Nguyễn Văn A', efficiency: 92, orders: 45, area: 'Picking' },
    { name: 'Trần Thị B', efficiency: 88, orders: 38, area: 'Packing' },
    { name: 'Lê Văn C', efficiency: 85, orders: 35, area: 'Picking' },
    { name: 'Phạm Thị D', efficiency: 78, orders: 28, area: 'Shipping' },
    { name: 'Hoàng Văn E', efficiency: 75, orders: 25, area: 'Receiving' }
  ];

  const staffPerformance = {
    paretoAnalysis: {
      topStaff: "5 nhân viên hàng đầu xử lý 80% tổng đơn hàng",
      topTime: "Từ 9:00-11:00 và 14:00-16:00 xử lý 80% đơn hàng",
      topArea: "Khu vực Picking chiếm 80% hiệu suất tổng thể"
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">
          Quản lý nhân sự theo nguyên tắc 80/20
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <Filter className="h-4 w-4 mr-1" /> Lọc nhân viên
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonPrimaryClass}`}
          >
            <User className="h-4 w-4 mr-1" /> Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Dashboard hiệu suất nhân viên */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className={`lg:col-span-2 p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Hiệu suất nhân viên hôm nay
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={employees.map((emp) => ({
                  name: emp.name,
                  efficiency: emp.efficiency,
                  completed: emp.completedToday,
                  target: 15,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="name"
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
                <Bar dataKey="completed" name="Đơn hoàn thành" fill="#3b82f6" />
                <Bar dataKey="target" name="Mục tiêu" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">Phân tích Pareto</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-900 bg-opacity-10 rounded-lg">
              <h4 className="font-medium text-blue-400 text-sm mb-1">
                80% công việc được xử lý bởi 20% nhân viên
              </h4>
              <p className="text-sm">
                {staffPerformance?.paretoAnalysis.topStaff}
              </p>
            </div>
            <div className="p-3 bg-green-900 bg-opacity-10 rounded-lg">
              <h4 className="font-medium text-green-400 text-sm mb-1">
                80% đơn trong 20% thời gian
              </h4>
              <p className="text-sm">
                {staffPerformance?.paretoAnalysis.topTime}
              </p>
            </div>
            <div className="p-3 bg-purple-900 bg-opacity-10 rounded-lg">
              <h4 className="font-medium text-purple-400 text-sm mb-1">
                80% đơn hàng là 20% SKU
              </h4>
              <p className="text-sm">
                {staffPerformance?.paretoAnalysis.topProducts}
              </p>
            </div>
            <div className="p-3 bg-orange-900 bg-opacity-10 rounded-lg">
              <h4 className="font-medium text-orange-400 text-sm mb-1">
                Sử dụng 20% vị trí kho 80% thời gian
              </h4>
              <p className="text-sm">
                {staffPerformance?.paretoAnalysis.topAreas}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng nhân viên */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Danh sách nhân viên</h3>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                className={`pl-8 pr-4 py-1 rounded-lg text-sm w-48 lg:w-64 ${inputClass}`}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <select className={`p-1.5 rounded text-sm ${inputClass}`}>
              <option value="all">Tất cả vai trò</option>
              <option value="senior">Senior</option>
              <option value="regular">Regular</option>
              <option value="junior">Junior</option>
            </select>

            <select className={`p-1.5 rounded text-sm ${inputClass}`}>
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="break">Giải lao</option>
              <option value="inactive">Ngừng làm việc</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 text-left text-xs font-medium text-gray-400">
                  Nhân viên
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400">
                  Vai trò
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400">
                  Hiệu suất
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400">
                  Tải hiện tại
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400">
                  Đơn hoàn thành
                </th>
                <th className="py-3 text-center text-xs font-medium text-gray-400">
                  Kỹ năng
                </th>
                <th className="py-3 text-center text-xs font-medium text-gray-400">
                  Trạng thái
                </th>
                <th className="py-3 text-center text-xs font-medium text-gray-400">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-700 ${
                    index < Math.ceil(employees.length * 0.2)
                      ? "bg-blue-900 bg-opacity-10"
                      : ""
                  }`}
                >
                  <td className="py-2 text-sm font-medium">
                    {emp.name}
                    {index < Math.ceil(employees.length * 0.2) && (
                      <span className="ml-1 text-xs text-blue-400">
                        (Top 20%)
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        emp.role === "senior"
                          ? "bg-purple-500 bg-opacity-20 text-purple-400"
                          : emp.role === "regular"
                          ? "bg-blue-500 bg-opacity-20 text-blue-400"
                          : "bg-green-500 bg-opacity-20 text-green-400"
                      }`}
                    >
                      {emp.role === "senior"
                        ? "Senior"
                        : emp.role === "regular"
                        ? "Regular"
                        : "Junior"}
                    </span>
                  </td>
                  <td className="py-2 text-sm">{emp.efficiency} đơn/giờ</td>
                  <td className="py-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-700 rounded-full h-1.5 mr-2">
                        <div
                          className={`h-1.5 rounded-full ${
                            emp.currentOrders / 10 > 0.8
                              ? "bg-red-500"
                              : emp.currentOrders / 10 > 0.6
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${(emp.currentOrders / 10) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {emp.currentOrders}/10
                      </span>
                    </div>
                  </td>
                  <td className="py-2 text-sm">{emp.completedToday} đơn</td>
                  <td className="py-2">
                    <div className="flex space-x-1 justify-center">
                      <div
                        className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-xs"
                        title="Picking"
                      >
                        P
                      </div>
                      <div
                        className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-xs"
                        title="Packing"
                      >
                        B
                      </div>
                      <div
                        className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs"
                        title="QC"
                      >
                        Q
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        emp.status === "active"
                          ? "bg-green-500 bg-opacity-20 text-green-400"
                          : emp.status === "break"
                          ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                          : "bg-gray-500 bg-opacity-20 text-gray-400"
                      }`}
                    >
                      {emp.status === "active"
                        ? "Đang làm việc"
                        : emp.status === "break"
                        ? "Giải lao"
                        : "Ngừng làm việc"}
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
                      <Calendar size={16} />
                    </button>
                    <button
                      className="p-1 text-purple-400 hover:text-purple-300"
                      title="Chỉnh sửa"
                    >
                      <Settings size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar Chart kỹ năng */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-3">
          Phân tích kỹ năng nhân viên
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Hiển thị biểu đồ radar của các kỹ năng quan trọng theo nguyên tắc
          80/20
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <h4 className="text-md font-medium mb-2">Top 20% nhân viên</h4>
            <div className="flex-1 min-h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { name: "Picking", value: 90 },
                    { name: "Packing", value: 85 },
                    { name: "QC", value: 70 },
                    { name: "Xử lý đơn P1", value: 95 },
                    { name: "Đa nhiệm", value: 80 },
                  ]}
                  margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    type="number"
                    stroke={darkMode ? "#9ca3af" : "#4b5563"}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke={darkMode ? "#9ca3af" : "#4b5563"}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#374151" : "#ffffff",
                      borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                      color: darkMode ? "#f9fafb" : "#111827",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-md font-medium mb-2">Phân tích Pareto</h4>
            <div className="bg-gray-800 rounded-lg p-4 flex-1">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">
                    20% nhân viên xử lý 78% đơn P1
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">
                    Nhân viên senior có hiệu suất cao hơn 45% so với junior
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">
                    Kỹ năng picking chiếm 60% thời gian xử lý đơn
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm">
                    Nhân viên đa kỹ năng có thể xử lý đơn nhanh hơn 35%
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">
                    78% lỗi phát sinh từ 22% quy trình
                  </span>
                </li>
              </ul>

              <div className="mt-6">
                <h5 className="text-sm font-medium mb-2">Đề xuất tối ưu</h5>
                <div className="p-3 bg-blue-900 bg-opacity-10 rounded border border-blue-800">
                  <p className="text-sm">
                    Phân công 4 nhân viên top 20% vào khung giờ cao điểm
                    10:00-12:00 và 14:00-16:00 để tối ưu hiệu suất
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>      </div>
    </div>
  );
};

// PropTypes
StaffTab.propTypes = {
  data: PropTypes.object,
  themeClasses: PropTypes.object,
  activeView: PropTypes.string,
  darkMode: PropTypes.bool
};

StaffTab.defaultProps = {
  themeClasses: {
    surface: 'bg-white dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    surfaceHover: 'hover:bg-gray-100 dark:hover:bg-gray-700',
    text: {
      secondary: 'text-gray-600 dark:text-gray-300'
    },
    input: 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
  },
  activeView: 'overview',
  darkMode: false
};

export default StaffTab;
