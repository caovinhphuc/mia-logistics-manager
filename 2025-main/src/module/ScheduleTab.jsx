// File: src/module/ScheduleTab.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar, Zap, Download, ArrowRight } from 'lucide-react';

// ==================== TYPES ====================
/**
 * @typedef {Object} WorkloadForecast
 * @property {string} date
 * @property {number} orders
 * @property {number} capacity
 */

/**
 * @typedef {Object} Employee
 * @property {string} name
 */

/**
 * @typedef {Object} ScheduleTabProps
 * @property {Object} [themeClasses]
 * @property {string} [themeClasses.card]
 * @property {string} [themeClasses.buttonPrimary]
 * @property {string} [themeClasses.buttonSecondary]
 * @property {string} [themeClasses.surface]
 * @property {string} [themeClasses.border]
 * @property {Object} [themeClasses.text]
 * @property {string} [themeClasses.text.primary]
 * @property {string} [themeClasses.text.secondary]
 * @property {string} [themeClasses.text.muted]
 * @property {string} [themeClasses.input]
 * @property {boolean} [darkMode]
 * @property {WorkloadForecast[]} [workloadForecast]
 * @property {Employee[]} [employees]
 */


const defaultWorkloadForecast = [
  { date: "20/05", orders: 120, capacity: 100 },
  { date: "21/05", orders: 150, capacity: 120 },
  { date: "22/05", orders: 180, capacity: 150 },
  { date: "23/05", orders: 220, capacity: 200 },
  { date: "24/05", orders: 200, capacity: 180 },
  { date: "25/05", orders: 160, capacity: 140 },
  { date: "26/05", orders: 140, capacity: 120 }
];


const defaultEmployees = [
  { name: "Nguyễn Văn A" },
  { name: "Trần Thị B" },
  { name: "Lê Văn C" },
  { name: "Phạm Thị D" },
  { name: "Đỗ Văn E" },
  { name: "Hoàng Thị F" },
  { name: "Vũ Văn G" },
  { name: "Đặng Thị H" }
];


const ScheduleTab = ({
  themeClasses = {},
  darkMode = false,
  workloadForecast,
  employees
}) => {
  // CSS classes based on theme
  const defaultCardClass = darkMode
    ? "bg-gray-800 border-gray-700 text-gray-300"
    : "bg-white border-gray-200 text-gray-900";
  const defaultButtonPrimaryClass = darkMode
    ? "bg-blue-600 text-white hover:bg-blue-700"
    : "bg-blue-500 text-white hover:bg-blue-600";
  const defaultButtonSecondaryClass = darkMode
    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  const { card, buttonPrimary, buttonSecondary } = themeClasses;
  const cardClass = card || defaultCardClass;
  const buttonPrimaryClass = buttonPrimary || defaultButtonPrimaryClass;
  const buttonSecondaryClass = buttonSecondary || defaultButtonSecondaryClass;

  // Use provided data or fall back to defaults
  const validWorkloadForecast = workloadForecast && workloadForecast.length > 0
    ? workloadForecast
    : defaultWorkloadForecast;
  const validEmployees = employees && employees.length > 0
    ? employees
    : defaultEmployees;

  // Generate employee performance data
  const employeePerformanceData = validEmployees.map((employee) => ({
    name: employee.name,
    performance: Math.floor(Math.random() * 100) + 1,
  }));

  return (
    <div className="p-4 space-y-6">
      {/* Tiêu đề và nút chức năng */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Calendar className="h-6 w-6 text-gray-400" />
          <h1 className="text-2xl font-semibold">Lịch làm việc</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className={`p-2 rounded ${buttonSecondaryClass}`}>
            <ArrowRight className="h-4 w-4 transform rotate-180" />
          </button>
          <span className="text-sm">20/05 - 26/05/2025</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">
          Lịch làm việc & Phân ca tự động
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <Calendar className="h-4 w-4 mr-1" /> Tạo ca mới
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonPrimaryClass}`}
          >
            <Zap className="h-4 w-4 mr-1" /> Phân ca tự động
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <Download className="h-4 w-4 mr-1" /> Xuất lịch
          </button>
        </div>
      </div>

      {/* Dự báo khối lượng công việc */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-3">
          Dự báo khối lượng công việc & nhu cầu nhân sự
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={validWorkloadForecast}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis dataKey="date" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
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
              <Bar dataKey="capacity" name="Công suất" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-3 rounded-lg ${
              validWorkloadForecast[3]?.orders > validWorkloadForecast[3]?.capacity
                ? "bg-red-900 bg-opacity-10 border border-red-800"
                : "bg-green-900 bg-opacity-10 border border-green-800"
            }`}
          >
            <h4 className="text-md font-medium mb-1">Ngày mai (21/05)</h4>
            <div className="flex justify-between text-sm mb-1">
              <span>Dự báo đơn:</span>
              <span className="font-medium">
                {validWorkloadForecast[1]?.orders} đơn
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Công suất hiện tại:</span>
              <span className="font-medium">
                {validWorkloadForecast[1]?.capacity} đơn
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Nhu cầu nhân sự:</span>
              <span className="font-medium">
                {Math.ceil((validWorkloadForecast[1]?.orders || 0) / 12)} nhân viên
              </span>
            </div>
          </div>

          <div
            className={`p-3 rounded-lg ${
              validWorkloadForecast[3]?.orders > validWorkloadForecast[3]?.capacity
                ? "bg-red-900 bg-opacity-10 border border-red-800"
                : "bg-green-900 bg-opacity-10 border border-green-800"
            }`}
          >
            <h4 className="text-md font-medium mb-1">Ngày cao điểm (23/05)</h4>
            <div className="flex justify-between text-sm mb-1">
              <span>Dự báo đơn:</span>
              <span className="font-medium">
                {validWorkloadForecast[3]?.orders} đơn
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Công suất hiện tại:</span>
              <span className="font-medium">
                {validWorkloadForecast[3]?.capacity} đơn
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Nhu cầu nhân sự:</span>
              <span className="font-medium">
                {Math.ceil((validWorkloadForecast[3]?.orders || 0) / 12)} nhân viên
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-900 bg-opacity-10 border border-blue-800">
            <h4 className="text-md font-medium mb-1">Phân tích 80/20</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span>23-24/05: Ngày cao điểm (80% khối lượng)</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>Khung 10-12h, 14-16h: Cao điểm trong ngày</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span>Cần 100% nhân sự ngày cao điểm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Biểu đồ phân tích hiệu suất nhân viên */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-3">
          Biểu đồ phân tích hiệu suất nhân viên
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={employeePerformanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="performance" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lịch làm việc */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-6 w-6 text-gray-400" />
            <span className="text-lg font-semibold">Lịch làm việc</span>
          </div>
          <h3 className="text-lg font-medium">Lịch làm việc tuần này</h3>
          <div className="flex items-center gap-2">
            <button className={`p-1.5 rounded ${buttonSecondaryClass}`}>
              <ArrowRight className="h-4 w-4 transform rotate-180" />
            </button>
            <span className="text-sm">20/05 - 26/05/2025</span>
            <button className={`p-1.5 rounded ${buttonSecondaryClass}`}>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Nhân viên
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 2 (20/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 3 (21/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 4 (22/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 5 (23/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 6 (24/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 7 (25/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  CN (26/05)
                </th>
              </tr>
            </thead>
            <tbody>
              {validEmployees.map((employee, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-700 p-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">
                        {employee.name.split(" ").pop()?.charAt(0)}
                      </div>
                      <span>{employee.name}</span>
                    </div>
                  </td>

                  {[...Array(7)].map((_, dayIdx) => {
                    const hasShift = Math.random() > 0.3;
                    const isFullDay = Math.random() > 0.5;
                    const isHighDemandDay = dayIdx === 3 || dayIdx === 4;
                    const isTopEmployee = idx < Math.ceil(validEmployees.length * 0.2);

                    const assignedToHighDemandDay =
                      isHighDemandDay && (isTopEmployee || Math.random() > 0.3);

                    return (
                      <td
                        key={dayIdx}
                        className="border border-gray-700 p-1 text-center relative"
                      >
                        {hasShift || assignedToHighDemandDay ? (
                          <div>
                            {isFullDay ? (
                              <div
                                className={`p-1 text-xs rounded ${
                                  isHighDemandDay
                                    ? "bg-red-900 bg-opacity-20 text-red-400"
                                    : "bg-blue-900 bg-opacity-20 text-blue-400"
                                }`}
                              >
                                Ca Full: 08:00 - 17:00
                              </div>
                            ) : (
                              <>
                                <div className="p-1 text-xs rounded bg-blue-900 bg-opacity-20 text-blue-400 mb-1">
                                  Ca sáng: 08:00 - 12:00
                                </div>
                                {isHighDemandDay && isTopEmployee && (
                                  <div className="p-1 text-xs rounded bg-purple-900 bg-opacity-20 text-purple-400">
                                    Ca chiều: 13:00 - 17:00
                                  </div>
                                )}
                              </>
                            )}

                            <div className="mt-1 text-xs">
                              {isHighDemandDay ? "Khu A, B" : "Khu C, D"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Nghỉ</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thống kê phân ca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Thống kê phân ca theo kỹ năng
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Picking", value: 45 },
                    { name: "Packing", value: 30 },
                    { name: "QC", value: 15 },
                    { name: "Logistics", value: 10 },
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
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#8b5cf6" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                    color: darkMode ? "#f9fafb" : "#111827",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Bảng phân tích Pareto (80/20)
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Phân bổ nhân sự theo hiệu suất:</span>
                <span>80/20</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>20% nhân viên hiệu suất cao</span>
                <span>80% công việc</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Phân bổ thời gian:</span>
                <span>80/20</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>20% thời gian (giờ cao điểm)</span>
                <span>80% đơn hàng</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Phân bổ khu vực kho:</span>
                <span>75/25</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>25% khu vực kho</span>
                <span>75% hoạt động picking</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-900 bg-opacity-10 rounded border border-blue-800">
              <h4 className="text-sm font-medium mb-2">Đề xuất tối ưu:</h4>
              <ul className="text-sm space-y-1">
                <li>• Tập trung 80% nhân viên senior vào khung giờ cao điểm</li>
                <li>• Bố trí 20% nhân viên hiệu suất cao cho 80% đơn P1</li>
                <li>• Cân đối tỷ lệ Picking/Packing/QC: 45%/30%/15%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;


