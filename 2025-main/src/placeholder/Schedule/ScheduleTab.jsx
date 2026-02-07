import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  Download,
  Zap,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Award,
  Star,
  MapPin,
  Phone,
  Mail,
  X,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock Data
const employees = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    position: 'Quản lý kho',
    area: 'Khu A',
    skills: ['Forklift', 'Quản lý', 'An toàn'],
    status: 'active',
    performance: 95,
    experience: '3 năm',
    phone: '0901234567',
    email: 'an.nguyen@company.com',
    avatar: 'https://via.placeholder.com/40',
    schedule: {
      monday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
      tuesday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
      wednesday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
      thursday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
      friday: { start: '08:00', end: '17:00', break: '12:00-13:00' },
      saturday: { start: 'OFF', end: 'OFF', break: '' },
      sunday: { start: 'OFF', end: 'OFF', break: '' }
    },
    metrics: {
      ordersCompleted: 156,
      accuracy: 98.5,
      efficiency: 92,
      attendance: 96
    }
  },
  {
    id: 2,
    name: 'Trần Thị Bình',
    position: 'Nhân viên kho',
    area: 'Khu B',
    skills: ['Đóng gói', 'Kiểm tra chất lượng'],
    status: 'active',
    performance: 88,
    experience: '2 năm',
    phone: '0907654321',
    email: 'binh.tran@company.com',
    avatar: 'https://via.placeholder.com/40',
    schedule: {
      monday: { start: '09:00', end: '18:00', break: '12:30-13:30' },
      tuesday: { start: '09:00', end: '18:00', break: '12:30-13:30' },
      wednesday: { start: '09:00', end: '18:00', break: '12:30-13:30' },
      thursday: { start: '09:00', end: '18:00', break: '12:30-13:30' },
      friday: { start: '09:00', end: '18:00', break: '12:30-13:30' },
      saturday: { start: '09:00', end: '15:00', break: '12:00-12:30' },
      sunday: { start: 'OFF', end: 'OFF', break: '' }
    },
    metrics: {
      ordersCompleted: 134,
      accuracy: 94.2,
      efficiency: 88,
      attendance: 94
    }
  },
  {
    id: 3,
    name: 'Lê Minh Cường',
    position: 'Tài xế',
    area: 'Giao hàng',
    skills: ['Lái xe', 'GPS', 'Giao tiếp'],
    status: 'active',
    performance: 91,
    experience: '4 năm',
    phone: '0912345678',
    email: 'cuong.le@company.com',
    avatar: 'https://via.placeholder.com/40',
    schedule: {
      monday: { start: '07:00', end: '16:00', break: '11:30-12:30' },
      tuesday: { start: '07:00', end: '16:00', break: '11:30-12:30' },
      wednesday: { start: '07:00', end: '16:00', break: '11:30-12:30' },
      thursday: { start: '07:00', end: '16:00', break: '11:30-12:30' },
      friday: { start: '07:00', end: '16:00', break: '11:30-12:30' },
      saturday: { start: '08:00', end: '14:00', break: '11:00-11:30' },
      sunday: { start: 'OFF', end: 'OFF', break: '' }
    },
    metrics: {
      ordersCompleted: 189,
      accuracy: 96.8,
      efficiency: 91,
      attendance: 98
    }
  }
];

const workloadForecast = [
  { day: 'T2', workload: 85, capacity: 100 },
  { day: 'T3', workload: 92, capacity: 100 },
  { day: 'T4', workload: 78, capacity: 100 },
  { day: 'T5', workload: 95, capacity: 100 },
  { day: 'T6', workload: 88, capacity: 100 },
  { day: 'T7', workload: 65, capacity: 100 },
  { day: 'CN', workload: 45, capacity: 100 }
];

const performanceData = [
  { month: 'T1', efficiency: 85, accuracy: 92, attendance: 96 },
  { month: 'T2', efficiency: 88, accuracy: 94, attendance: 94 },
  { month: 'T3', efficiency: 91, accuracy: 95, attendance: 95 },
  { month: 'T4', efficiency: 87, accuracy: 93, attendance: 97 },
  { month: 'T5', efficiency: 93, accuracy: 96, attendance: 98 },
  { month: 'T6', efficiency: 90, accuracy: 94, attendance: 96 }
];

const skillDistribution = [
  { name: 'Forklift', value: 12, color: '#3B82F6' },
  { name: 'Đóng gói', value: 18, color: '#EF4444' },
  { name: 'Kiểm tra QC', value: 15, color: '#10B981' },
  { name: 'Lái xe', value: 8, color: '#F59E0B' },
  { name: 'Quản lý', value: 5, color: '#8B5CF6' }
];

// Overview Tab Component
const OverviewTab = ({ themeClasses }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng nhân viên</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{employees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đang làm việc</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {employees.filter(emp => emp.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hiệu suất TB</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(employees.reduce((acc, emp) => acc + emp.performance, 0) / employees.length)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tải công việc</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">85%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workload Forecast Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Dự báo tải công việc tuần này
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadForecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="workload" fill="#3B82F6" name="Tải công việc" />
              <Bar dataKey="capacity" fill="#E5E7EB" name="Công suất" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ themeClasses }) => {
  return (
    <div className="space-y-6">
      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Xu hướng hiệu suất 6 tháng qua
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="efficiency" stroke="#3B82F6" name="Hiệu suất" />
              <Line type="monotone" dataKey="accuracy" stroke="#10B981" name="Độ chính xác" />
              <Line type="monotone" dataKey="attendance" stroke="#F59E0B" name="Chuyên cần" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Phân bố kỹ năng
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pareto Analysis */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Phân tích Pareto (80/20)
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Top 20% nhân viên</span>
                <span className="font-medium">80% hiệu suất</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Khu vực hiệu quả</span>
                <span className="font-medium">75% sản lượng</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Ca làm việc tối ưu</span>
                <span className="font-medium">90% chuyên cần</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Schedule Management Tab Component
const ScheduleManagementTab = ({ themeClasses, onEmployeeClick, onAutoSchedule }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredEmployees = employees.filter(employee => {
    return (
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterArea === 'all' || employee.area === filterArea) &&
      (filterSkill === 'all' || employee.skills.some(skill => skill === filterSkill)) &&
      (filterStatus === 'all' || employee.status === filterStatus)
    );
  });

  const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-1 items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tất cả khu vực</option>
              <option value="Khu A">Khu A</option>
              <option value="Khu B">Khu B</option>
              <option value="Giao hàng">Giao hàng</option>
            </select>

            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Tất cả kỹ năng</option>
              <option value="Forklift">Forklift</option>
              <option value="Đóng gói">Đóng gói</option>
              <option value="Lái xe">Lái xe</option>
              <option value="Quản lý">Quản lý</option>
            </select>
          </div>

          <button
            onClick={onAutoSchedule}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Zap className="h-4 w-4 mr-2" />
            Tự động xếp lịch
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nhân viên
                </th>
                {weekDays.map((day) => (
                  <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {day}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full" src={employee.avatar} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {employee.position} • {employee.area}
                        </div>
                      </div>
                    </div>
                  </td>
                  {Object.entries(employee.schedule).map(([day, schedule]) => (
                    <td key={day} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {schedule.start === 'OFF' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          Nghỉ
                        </span>
                      ) : (
                        <div>
                          <div className="font-medium">{schedule.start} - {schedule.end}</div>
                          {schedule.break && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Nghỉ: {schedule.break}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEmployeeClick(employee)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                    >
                      Xem chi tiết
                    </button>
                    <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-3">
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Auto Schedule Modal Component
const AutoScheduleModal = ({ onClose, themeClasses }) => {
  const [scheduleSettings, setScheduleSettings] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    considerSkills: true,
    considerPerformance: true,
    balanceWorkload: true,
    maxHoursPerEmployee: 40,
    minRestHours: 8
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tự động xếp lịch</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={scheduleSettings.startDate}
                  onChange={(e) => setScheduleSettings(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={scheduleSettings.endDate}
                  onChange={(e) => setScheduleSettings(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tùy chọn xếp lịch</h3>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={scheduleSettings.considerSkills}
                  onChange={(e) => setScheduleSettings(prev => ({ ...prev, considerSkills: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Xem xét kỹ năng nhân viên</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={scheduleSettings.considerPerformance}
                  onChange={(e) => setScheduleSettings(prev => ({ ...prev, considerPerformance: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Ưu tiên theo hiệu suất làm việc</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={scheduleSettings.balanceWorkload}
                  onChange={(e) => setScheduleSettings(prev => ({ ...prev, balanceWorkload: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Cân bằng tải công việc</span>
              </label>
            </div>

            {/* Constraints */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Số giờ tối đa/nhân viên
                </label>
                <input
                  type="number"
                  value={scheduleSettings.maxHoursPerEmployee}
                  onChange={(e) => setScheduleSettings(prev => ({ ...prev, maxHoursPerEmployee: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thời gian nghỉ tối thiểu (giờ)
                </label>
                <input
                  type="number"
                  value={scheduleSettings.minRestHours}
                  onChange={(e) => setScheduleSettings(prev => ({ ...prev, minRestHours: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Hủy
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700">
                Tạo lịch tự động
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Employee Details Modal Component
const EmployeeDetailsModal = ({ employee, onClose, themeClasses }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Chi tiết nhân viên - {employee.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                <div className="text-center">
                  <img
                    className="h-24 w-24 rounded-full mx-auto"
                    src={employee.avatar}
                    alt={employee.name}
                  />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    {employee.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{employee.position}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{employee.area}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span>{employee.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Kỹ năng</h4>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đơn hàng</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{employee.metrics.ordersCompleted}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Độ chính xác</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{employee.metrics.accuracy}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                        <BarChart3 className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hiệu suất</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{employee.metrics.efficiency}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chuyên cần</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{employee.metrics.attendance}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Hoạt động gần đây</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Hoàn thành 15 đơn hàng</span>
                      <span className="text-xs text-gray-500">2 giờ trước</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Đạt mục tiêu hiệu suất</span>
                      <span className="text-xs text-gray-500">1 ngày trước</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Hoàn thành ca làm việc</span>
                      <span className="text-xs text-gray-500">2 ngày trước</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main ScheduleTab Component
const ScheduleTab = ({ themeClasses = {} }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAutoScheduleModal, setShowAutoScheduleModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
    { id: 'analytics', label: 'Phân tích', icon: TrendingUp },
    { id: 'schedule', label: 'Quản lý lịch', icon: Calendar },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab themeClasses={themeClasses} />;
      case 'analytics':
        return <AnalyticsTab themeClasses={themeClasses} />;
      case 'schedule':
        return (
          <ScheduleManagementTab
            themeClasses={themeClasses}
            onEmployeeClick={(employee) => {
              setSelectedEmployee(employee);
              setShowEmployeeModal(true);
            }}
            onAutoSchedule={() => setShowAutoScheduleModal(true)}
          />
        );
      default:
        return <OverviewTab themeClasses={themeClasses} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý lịch làm việc
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tối ưu hóa lịch làm việc và theo dõi hiệu suất nhân viên
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowAutoScheduleModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Zap className="h-4 w-4 mr-2" />
            Tự động xếp lịch
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderActiveTab()}

      {/* Modals */}
      {showAutoScheduleModal && (
        <AutoScheduleModal
          themeClasses={themeClasses}
          onClose={() => setShowAutoScheduleModal(false)}
        />
      )}

      {showEmployeeModal && selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          themeClasses={themeClasses}
          onClose={() => {
            setShowEmployeeModal(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};

// PropTypes validation
ScheduleTab.propTypes = {
  themeClasses: PropTypes.object,
};

OverviewTab.propTypes = {
  themeClasses: PropTypes.object,
};

AnalyticsTab.propTypes = {
  themeClasses: PropTypes.object,
};

ScheduleManagementTab.propTypes = {
  themeClasses: PropTypes.object,
  onEmployeeClick: PropTypes.func,
  onAutoSchedule: PropTypes.func,
};

AutoScheduleModal.propTypes = {
  themeClasses: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

EmployeeDetailsModal.propTypes = {
  employee: PropTypes.object.isRequired,
  themeClasses: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ScheduleTab;
