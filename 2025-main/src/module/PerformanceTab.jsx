//PerformanceTab.jsx
import React, { useState, useEffect, useMemo, useContext } from "react";
import PropTypes from 'prop-types';
import {
   LineChart,
   BarChart,
   AreaChart,
   ResponsiveContainer,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   Line,
   Bar,
   Area,
   ReferenceLine
} from "recharts";
import {
  Package,
  Clock,
  TrendingUp,
  CheckCircle,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";

// Tab Hiệu Suất
const PerformanceTab = ({ themeClasses = {}, darkMode = false }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Define CSS classes based on theme
  const buttonSecondaryClass = themeClasses?.buttonSecondary ||
    `border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`;

  const buttonPrimaryClass = themeClasses?.buttonPrimary ||
    `bg-blue-500 text-white hover:bg-blue-600`;

  const cardClass = themeClasses?.card ||
    `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`;

  // Mock data for staff performance
  const staffPerformance = {
    todayStats: {
      totalCompletedOrders: 145,
      totalItems: 890,
      avgTimePerOrder: 12.5,
      slaCompliance: 94.2
    },
    topPerformers: [
      {
        name: "Nguyễn Văn A",
        efficiency: 15.2,
        completedOrders: 45
      },
      {
        name: "Trần Thị B",
        efficiency: 14.8,
        completedOrders: 42
      },
      {
        name: "Lê Văn C",
        efficiency: 14.1,
        completedOrders: 38
      }
    ],
    bottlenecks: [
      {
        area: "Khu vực A - Picking",
        congestion: 85,
        time: "10:00-11:00"
      },
      {
        area: "Khu vực B - Packing",
        congestion: 78,
        time: "14:00-15:00"
      },
      {
        area: "QC Station 1",
        congestion: 72,
        time: "16:00-17:00"
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">
          Phân tích hiệu suất kho vận
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <Filter className="h-4 w-4 mr-1" /> Bộ lọc
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonPrimaryClass}`}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
            />{" "}
            Làm mới
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <Download className="h-4 w-4 mr-1" /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Đơn hôm nay</p>
              <p className="text-2xl font-bold">
                {staffPerformance?.todayStats.totalCompletedOrders}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-20">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> +8% so với hôm qua
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Sản phẩm xử lý</p>
              <p className="text-2xl font-bold">
                {staffPerformance?.todayStats.totalItems}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
              <Package className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% so với hôm qua
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Thời gian TB/đơn</p>
              <p className="text-2xl font-bold">
                {staffPerformance?.todayStats.avgTimePerOrder} phút
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500 bg-opacity-20">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> -5% so với hôm qua
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Tỷ lệ đạt SLA</p>
              <p className="text-2xl font-bold">
                {staffPerformance?.todayStats.slaCompliance}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-500 bg-opacity-20">
              <CheckCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> +1.3% so với hôm qua
            </span>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Hiệu suất xử lý theo ngày
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { date: "14/05", orders: 75, target: 80 },
                  { date: "15/05", orders: 82, target: 80 },
                  { date: "16/05", orders: 95, target: 80 },
                  { date: "17/05", orders: 88, target: 80 },
                  { date: "18/05", orders: 65, target: 80 },
                  { date: "19/05", orders: 78, target: 80 },
                  { date: "20/05", orders: 102, target: 80 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="date"
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
                <Line
                  type="monotone"
                  dataKey="orders"
                  name="Đơn xử lý"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Mục tiêu"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Phân tích hiệu suất theo vai trò
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Picking", productivity: 85, target: 80, gap: 5 },
                  { name: "Packing", productivity: 90, target: 80, gap: 10 },
                  { name: "QC", productivity: 75, target: 80, gap: -5 },
                  { name: "Logistics", productivity: 78, target: 80, gap: -2 },
                ]}
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
                <Bar dataKey="productivity" name="Hiệu suất" fill="#3b82f6" />
                <Bar dataKey="target" name="Mục tiêu" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performers & Bottlenecks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass} lg:col-span-2`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              Top 3 nhân viên hiệu suất cao (20%)
            </h3>
            <button
              className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-3">
            {staffPerformance?.topPerformers.map((performer, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-medium mr-3">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium">{performer.name}</div>
                    <div className="text-xs text-gray-400">
                      {performer.efficiency} đơn/giờ
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <div className="font-medium">
                      {performer.completedOrders} đơn
                    </div>
                    <div className="text-xs text-gray-400">
                      hoàn thành hôm nay
                    </div>
                  </div>

                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      idx === 0
                        ? "bg-yellow-500 bg-opacity-20 text-yellow-300"
                        : idx === 1
                        ? "bg-gray-500 bg-opacity-20 text-gray-300"
                        : "bg-orange-500 bg-opacity-20 text-orange-300"
                    }`}
                  >
                    {idx === 0
                      ? "Top 1 🥇"
                      : idx === 1
                      ? "Top 2 🥈"
                      : "Top 3 🥉"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Điểm nghẽn (Bottlenecks)</h3>
            <button
              className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
            >
              Phân tích
            </button>
          </div>

          <div className="space-y-3">
            {staffPerformance?.bottlenecks.map((bottleneck, idx) => (
              <div
                key={idx}
                className="p-3 bg-red-900 bg-opacity-10 border-l-4 border-red-600 rounded-r-lg"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{bottleneck.area}</span>
                  <span className="text-xs px-2 py-0.5 bg-red-500 bg-opacity-20 text-red-400 rounded-full">
                    {bottleneck.congestion}% tải
                  </span>
                </div>
                <div className="text-sm">{bottleneck.time}</div>

                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-red-500 h-1.5 rounded-full"
                      style={{ width: `${bottleneck.congestion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-3 bg-blue-900 bg-opacity-10 border border-blue-800 rounded-lg mt-4">
              <h4 className="text-sm font-medium mb-2">Đề xuất giải pháp:</h4>
              <ul className="text-xs space-y-1">
                <li>• Tăng cường 2 nhân viên cho Khu A (10:00-11:00)</li>
                <li>• Điều chỉnh quy trình picking khu B (14:00-15:00)</li>
                <li>• Ứng dụng nguyên tắc 80/20 phân bổ nhân sự</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pareto Analysis */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-4">
          Phân tích Pareto chi tiết (80/20)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                Phân tích nhân sự theo hiệu suất
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { percent: 0, value: 0 },
                      { percent: 20, value: 80 },
                      { percent: 40, value: 88 },
                      { percent: 60, value: 93 },
                      { percent: 80, value: 97 },
                      { percent: 100, value: 100 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? "#374151" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="percent"
                      label={{
                        value: "% Nhân viên",
                        position: "insideBottomRight",
                        offset: -10,
                      }}
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                    />
                    <YAxis
                      label={{
                        value: "% Đơn hàng",
                        angle: -90,
                        position: "insideLeft",
                      }}
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#374151" : "#ffffff",
                        borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                        color: darkMode ? "#f9fafb" : "#111827",
                      }}
                      formatter={(value, name) => [
                        `${value}%`,
                        "Tỷ lệ đơn hàng",
                      ]}
                      labelFormatter={(value) => `${value}% nhân viên`}
                    />
                    <ReferenceLine
                      x={20}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                    />
                    <ReferenceLine
                      y={80}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f640"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                20% nhân viên (Top 5) xử lý 80% khối lượng đơn hàng
              </p>
            </div>

            <div className="p-3 bg-blue-900 bg-opacity-10 border border-blue-800 rounded-lg">
              <h4 className="text-sm font-medium mb-2">
                Yếu tố hiệu suất cao:
              </h4>
              <ul className="text-xs space-y-1">
                <li>• Đa kỹ năng (picking, packing, QC)</li>
                <li>• Kinh nghiệm &gt; 6 tháng</li>
                <li>• Thành thạo quy trình xử lý đơn P1</li>
                <li>• Khả năng làm việc đa nhiệm</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                Phân tích thời gian xử lý đơn
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { percent: 0, value: 0 },
                      { percent: 20, value: 70 },
                      { percent: 40, value: 85 },
                      { percent: 60, value: 92 },
                      { percent: 80, value: 97 },
                      { percent: 100, value: 100 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? "#374151" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="percent"
                      label={{
                        value: "% Quy trình",
                        position: "insideBottomRight",
                        offset: -10,
                      }}
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                    />
                    <YAxis
                      label={{
                        value: "% Thời gian",
                        angle: -90,
                        position: "insideLeft",
                      }}
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#374151" : "#ffffff",
                        borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                        color: darkMode ? "#f9fafb" : "#111827",
                      }}
                      formatter={(value, name) => [
                        `${value}%`,
                        "Tỷ lệ thời gian",
                      ]}
                      labelFormatter={(value) => `${value}% quy trình`}
                    />
                    <ReferenceLine
                      x={20}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                    />
                    <ReferenceLine
                      y={70}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      fill="#10b98140"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                20% quy trình chiếm 70% thời gian xử lý đơn
              </p>
            </div>

            <div className="p-3 bg-blue-900 bg-opacity-10 border border-blue-800 rounded-lg">
              <h4 className="text-sm font-medium mb-2">
                Quy trình tốn thời gian nhất:
              </h4>
              <ul className="text-xs space-y-1">
                <li>• Tìm kiếm vị trí sản phẩm (35% thời gian)</li>
                <li>• Kiểm tra đơn hàng đặc biệt (20% thời gian)</li>
                <li>• Đối chiếu số lượng sản phẩm (15% thời gian)</li>
                <li>• Xử lý đơn từ khu vực xa (10% thời gian)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>  );
};

// PropTypes validation
PerformanceTab.propTypes = {
  themeClasses: PropTypes.object,
  darkMode: PropTypes.bool
};

// ==================== EXPORTS ====================
export default PerformanceTab;


