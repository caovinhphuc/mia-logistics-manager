// ScheduleTab.jsx - Hệ thống quản lý lịch làm việc và phân ca tự động
import React, { useState, useMemo  } from 'react';
import PropTypes from 'prop-types';

import {
  Calendar,
  Zap,
  Download,
  ArrowLeft,
  ArrowRight,
  Filter,
  Settings,
  Users,
  BarChart3,
  TrendingUp,

  Clock,
    MapPin,
  Award,
  Target,
  Plus as _Plus,
  Edit as _Edit,
  Trash2 as _Trash2,
  Eye as _Eye,
  ChevronDown,
  Search,
  Bell,
  X
} from 'lucide-react';
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
  Cell,
  LineChart as _LineChart,
  Line
} from 'recharts';

//


const ScheduleTab = ({ data: _data, themeClasses }) => {
  // ==================== STATE MANAGEMENT ====================
  const [data, _setData] = useState(_data);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [_selectedDate, _setSelectedDate] = useState(new Date());
  const [_viewMode, _setViewMode] = useState('week'); // week, month, day
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAutoSchedule, setShowAutoSchedule] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  // Filter states
  const [filters, setFilters] = useState({

    area: 'all',
    shift: 'all',
    skill: 'all',
    status: 'all'
  });




  // ==================== PROPTYPES ====================
  ScheduleTab.propTypes = {
    data: PropTypes.array.isRequired,
    themeClasses: PropTypes.string
  };
  ScheduleTab.defaultProps = {
    data: [],
    themeClasses: {
      container: 'bg-white dark:bg-gray-800',
      header: 'text-gray-800 dark:text-gray-200',
      body: 'text-gray-600 dark:text-gray-400',
      footer: 'text-gray-500 dark:text-gray-500'
    }
  };



  // ==================== MOCK DATA ====================
  const workloadForecast = [
    { date: '26/05', dayName: 'T2', orders: 120, capacity: 150, required: 8, special: false, efficiency: 85 },
    { date: '27/05', dayName: 'T3', orders: 140, capacity: 150, required: 9, special: false, efficiency: 88 },
    { date: '28/05', dayName: 'T4', orders: 180, capacity: 150, required: 12, special: true, efficiency: 92 },
    { date: '29/05', dayName: 'T5', orders: 200, capacity: 150, required: 14, special: true, efficiency: 95 },
    { date: '30/05', dayName: 'T6', orders: 160, capacity: 150, required: 10, special: false, efficiency: 90 },
    { date: '31/05', dayName: 'T7', orders: 90, capacity: 150, required: 6, special: false, efficiency: 78 },
    { date: '01/06', dayName: 'CN', orders: 70, capacity: 100, required: 5, special: false, efficiency: 75 }  ];

  const employees = useMemo(() => [
    { id: 1, name: 'Nguyễn Văn A', skill: 'Picking', performance: 95, area: 'A', avatar: 'A' },
    { id: 2, name: 'Trần Thị B', skill: 'Packing', performance: 88, area: 'B', avatar: 'B' },
    { id: 3, name: 'Lê Minh C', skill: 'QC', performance: 92, area: 'A', avatar: 'C' },
    { id: 4, name: 'Phạm Thu D', skill: 'Logistics', performance: 87, area: 'C', avatar: 'D' },
    { id: 5, name: 'Hoàng Nam E', skill: 'Picking', performance: 91, area: 'B', avatar: 'E' },
    { id: 6, name: 'Võ Thị F', skill: 'Packing', performance: 89, area: 'A', avatar: 'F' },
    { id: 7, name: 'Đặng Văn G', skill: 'QC', performance: 94, area: 'C', avatar: 'G' },
    { id: 8, name: 'Bùi Thị H', skill: 'Logistics', performance: 86, area: 'B', avatar: 'H' }
  ], []);

  const skillDistribution = [
    { name: "Picking", value: 45, color: "#3b82f6" },
    { name: "Packing", value: 30, color: "#10b981" },
    { name: "QC", value: 15, color: "#f59e0b" },
    { name: "Logistics", value: 10, color: "#8b5cf6" }
  ];


  // ==================== PROPTYPES ====================
  ScheduleTab.propTypes = {
    data: PropTypes.array.isRequired,
    themeClasses: PropTypes.object
  };
  ScheduleTab.defaultProps = {
    data: [],
    themeClasses: {
      container: 'bg-white dark:bg-gray-800',
      header: 'text-gray-800 dark:text-gray-200',
      body: 'text-gray-600 dark:text-gray-400',
      footer: 'text-gray-500 dark:text-gray-500'
    }  };

  // ==================== HOOKS ====================
  // ==================== INITIALIZATION ====================
  // No initialization needed here - state is already set

  // ==================== PROPTYPES ====================





  // ==================== COMPUTED VALUES ====================
  const weekDates = useMemo(() => {
    const start = new Date(currentWeek);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, [currentWeek]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArea = filters.area === 'all' || emp.area === filters.area;
      const matchesSkill = filters.skill === 'all' || emp.skill === filters.skill;
      return matchesSearch && matchesArea && matchesSkill;
    });  }, [employees, searchTerm, filters]);

  // ==================== VALIDATION (AFTER ALL HOOKS) ====================
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Invalid data provided to ScheduleTab. Expected a non-empty array.');
    return <div className="text-red-500">Lỗi: Dữ liệu không hợp lệ.</div>;
  }
  if (typeof themeClasses !== 'object') {
    console.error('Invalid themeClasses provided to ScheduleTab. Expected an object.');
    return <div className="text-red-500">Lỗi: Cấu hình giao diện không hợp lệ.</div>;
  }

  // ==================== HELPER FUNCTIONS ====================
  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const getDayName = (date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  };

  const getShiftData = (employeeId, dayIndex) => {
    // Mô phỏng dữ liệu ca làm việc
    const hasShift = Math.random() > 0.3;
    const isFullDay = Math.random() > 0.5;
    const isHighDemandDay = dayIndex === 3 || dayIndex === 4; // T5, T6
    const employee = employees.find(emp => emp.id === employeeId);
    const isTopEmployee = employee?.performance > 90;

    if (!hasShift && !isHighDemandDay) return null;

    return {
      type: isFullDay ? 'full' : 'split',
      morning: hasShift || isHighDemandDay,
      afternoon: isHighDemandDay && isTopEmployee,
      area: isHighDemandDay ? 'A,B' : 'C,D',
      overtime: isHighDemandDay && isTopEmployee,
      priority: isHighDemandDay ? 'high' : 'normal'
    };
  };

  // ==================== EVENT HANDLERS ====================
  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const handleAutoSchedule = () => {
    setShowAutoSchedule(true);
  };

  const handleExportSchedule = () => {
    // Logic xuất lịch
    window.alert('Đang xuất lịch làm việc...');
  };
  // ==================== THEME CLASSES ====================
  const buttonPrimaryClass = "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors";
  const buttonSecondaryClass = "bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 px-4 py-2 rounded-lg font-medium transition-colors";
  const cardClass = `${themeClasses.surface || 'bg-white dark:bg-gray-800'} ${themeClasses.border || 'border-gray-200 dark:border-gray-700'}`;
  const isDarkMode = themeClasses.mode === 'dark';

  return (
    <div className="space-y-6 p-4">      {/* ==================== HEADER SECTION ==================== */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-500" />
            Lịch làm việc & Phân ca tự động (Đã cập nhật)
          </h1>
          <p className={`${themeClasses.text.muted} text-sm lg:text-base`}>
            Quản lý lịch trình và tối ưu hóa phân ca nhân viên
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${buttonSecondaryClass} transition-all`}
          >
            <Filter className="h-4 w-4" />
            Bộ lọc
            {showFilters && <ChevronDown className="h-3 w-3 rotate-180" />}
          </button>

          <button
            onClick={handleAutoSchedule}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${buttonPrimaryClass} transition-all`}
          >
            <Zap className="h-4 w-4" />
            Phân ca tự động
          </button>

          <button
            onClick={handleExportSchedule}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${buttonSecondaryClass} transition-all`}
          >
            <Download className="h-4 w-4" />
            Xuất lịch
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${buttonSecondaryClass} transition-all`}
          >
            <Settings className="h-4 w-4" />
            Cài đặt
          </button>
        </div>
      </div>

      {/* ==================== FILTERS SECTION ==================== */}
      {showFilters && (
        <div className={`p-4 rounded-xl border ${cardClass} transition-all duration-300`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tìm kiếm nhân viên</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tên nhân viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${themeClasses.input} transition-colors`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Khu vực</label>
              <select
                value={filters.area}
                onChange={(e) => setFilters({...filters, area: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} transition-colors`}
              >
                <option value="all">Tất cả khu vực</option>
                <option value="A">Khu vực A</option>
                <option value="B">Khu vực B</option>
                <option value="C">Khu vực C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Kỹ năng</label>
              <select
                value={filters.skill}
                onChange={(e) => setFilters({...filters, skill: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} transition-colors`}
              >
                <option value="all">Tất cả kỹ năng</option>
                <option value="Picking">Picking</option>
                <option value="Packing">Packing</option>
                <option value="QC">QC</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Trạng thái</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} transition-colors`}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="break">Nghỉ giải lao</option>
                <option value="overtime">Tăng ca</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ==================== WORKLOAD FORECAST ==================== */}
      <div className={`p-6 rounded-xl border ${cardClass} shadow-sm`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
          <h3 className="text-xl font-semibold mb-2 lg:mb-0 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Dự báo khối lượng công việc & nhu cầu nhân sự
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4" />
            Cập nhật: {new Date().toLocaleTimeString('vi-VN')}
          </div>
        </div>

        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadForecast} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                stroke={isDarkMode ? "#9ca3af" : "#4b5563"}
                fontSize={12}
              />
              <YAxis
                stroke={isDarkMode ? "#9ca3af" : "#4b5563"}
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#374151" : "#ffffff",
                  borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
                  color: isDarkMode ? "#f9fafb" : "#111827",
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey="orders" name="Đơn hàng dự báo" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="capacity" name="Công suất hiện tại" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Line
                type="monotone"
                dataKey="efficiency"
                name="Hiệu suất (%)"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${
            workloadForecast[1]?.orders > workloadForecast[1]?.capacity
              ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
              : "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
          } border transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Ngày mai (27/05)</h4>
              <Clock className="h-4 w-4 text-gray-500" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Dự báo đơn:</span>
                <span className="font-medium">{workloadForecast[1]?.orders} đơn</span>
              </div>
              <div className="flex justify-between">
                <span>Công suất:</span>
                <span className="font-medium">{workloadForecast[1]?.capacity} đơn</span>
              </div>
              <div className="flex justify-between">
                <span>Nhu cầu nhân sự:</span>
                <span className="font-medium">{Math.ceil(workloadForecast[1]?.orders / 12)} người</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            workloadForecast[3]?.orders > workloadForecast[3]?.capacity
              ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
              : "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
          } border transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Ngày cao điểm (29/05)</h4>
              <Bell className="h-4 w-4 text-orange-500" />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Dự báo đơn:</span>
                <span className="font-medium text-red-600 dark:text-red-400">{workloadForecast[3]?.orders} đơn</span>
              </div>
              <div className="flex justify-between">
                <span>Công suất:</span>
                <span className="font-medium">{workloadForecast[3]?.capacity} đơn</span>
              </div>
              <div className="flex justify-between">
                <span>Thiếu hụt:</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {workloadForecast[3]?.orders - workloadForecast[3]?.capacity} đơn
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Phân tích 80/20</h4>
              <Target className="h-4 w-4 text-blue-500" />
            </div>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>29-30/05: Ngày cao điểm (80% khối lượng)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>10-12h, 14-16h: Khung giờ vàng</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span>Cần 100% nhân sự ngày cao điểm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>      {/* ==================== WEEKLY SCHEDULE ==================== */}
      <div className={`p-6 rounded-xl border ${cardClass} shadow-sm`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            Lịch làm việc tuần này
          </h3>

          {/* Week Navigation */}
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <button
              onClick={handlePreviousWeek}
              className={`p-2 rounded-lg ${buttonSecondaryClass} transition-all hover:scale-105`}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="text-center">
              <div className="font-semibold text-sm lg:text-base">
                {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
              </div>
              <div className="text-xs text-gray-500">Tuần {Math.ceil(new Date().getDate() / 7)}/2025</div>
            </div>

            <button
              onClick={handleNextWeek}
              className={`p-2 rounded-lg ${buttonSecondaryClass} transition-all hover:scale-105`}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <button
            onClick={() => setShowAutoSchedule(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:scale-105 shadow-md"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Phân ca tự động</span>
            <span className="sm:hidden">Auto</span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className={`flex items-center gap-2 px-4 py-2 ${buttonSecondaryClass} rounded-lg transition-all hover:scale-105 shadow-md`}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Cài đặt phân ca</span>
            <span className="sm:hidden">Settings</span>
          </button>

          <button
            onClick={handleExportSchedule}
            className={`flex items-center gap-2 px-4 py-2 ${buttonSecondaryClass} rounded-lg transition-all hover:scale-105 shadow-md`}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Xuất Excel</span>
            <span className="sm:hidden">Export</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              Cập nhật: {new Date().toLocaleTimeString('vi-VN')}
            </span>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <th className="border p-3 text-left font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Nhân viên ({filteredEmployees.length})
                  </div>
                </th>
                {weekDates.map((date, index) => (
                  <th key={index} className="border p-3 text-center font-semibold text-sm min-w-[120px]">
                    <div>
                      <div className="font-bold">{getDayName(date)}</div>
                      <div className="text-xs text-gray-500">{formatDate(date)}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>            <tbody>
              {filteredEmployees.map((employee, _empIndex) => (
                <tr
                  key={employee.id}
                  className={`hover:${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors cursor-pointer`}
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <td className="border p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                        employee.performance > 90 ? 'from-green-500 to-emerald-600' :
                        employee.performance > 85 ? 'from-blue-500 to-cyan-600' :
                        'from-gray-500 to-slate-600'
                      } flex items-center justify-center text-white font-bold text-sm`}>
                        {employee.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{employee.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>Khu {employee.area}</span>
                          <span>•</span>
                          <span>{employee.skill}</span>
                          <Award className={`h-3 w-3 ${employee.performance > 90 ? 'text-yellow-500' : 'text-gray-400'}`} />
                          <span>{employee.performance}%</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {weekDates.map((date, dayIndex) => {
                    const shiftData = getShiftData(employee.id, dayIndex);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

                    return (
                      <td key={dayIndex} className={`border p-2 text-center relative ${
                        isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}>
                        {shiftData ? (
                          <div className="space-y-1">
                            {shiftData.type === 'full' ? (
                              <div className={`p-2 text-xs rounded-lg font-medium ${
                                shiftData.priority === 'high'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              }`}>
                                <div>Ca Full</div>
                                <div>08:00-17:00</div>
                              </div>
                            ) : (
                              <>
                                {shiftData.morning && (
                                  <div className="p-2 text-xs rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                                    <div>Ca sáng</div>
                                    <div>08:00-12:00</div>
                                  </div>
                                )}
                                {shiftData.afternoon && (
                                  <div className="p-2 text-xs rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 font-medium">
                                    <div>Ca chiều</div>
                                    <div>13:00-17:00</div>
                                  </div>
                                )}
                              </>
                            )}

                            <div className="text-xs text-gray-500 flex items-center justify-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {shiftData.area}
                            </div>

                            {shiftData.overtime && (
                              <div className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 rounded px-1 py-0.5">
                                Tăng ca
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`text-xs p-2 rounded-lg ${
                            isWeekend
                              ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                              : 'text-gray-500'
                          }`}>
                            {isWeekend ? 'Nghỉ cuối tuần' : 'Nghỉ'}
                          </div>
                        )}

                        {isToday && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-2xl font-bold text-blue-600">{filteredEmployees.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng nhân viên</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(filteredEmployees.reduce((acc, emp) => acc + emp.performance, 0) / filteredEmployees.length)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hiệu suất TB</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <div className="text-2xl font-bold text-orange-600">24</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng ca/ngày</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="text-2xl font-bold text-purple-600">96</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tổng giờ/tuần</div>
          </div>
        </div>
      </div>

      {/* ==================== ANALYTICS SECTION ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Distribution Chart */}
        <div className={`p-6 rounded-xl border ${cardClass} shadow-sm`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-green-500" />
            Phân bổ kỹ năng nhân viên
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#374151" : "#ffffff",
                    borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
                    color: isDarkMode ? "#f9fafb" : "#111827",
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pareto Analysis */}
        <div className={`p-6 rounded-xl border ${cardClass} shadow-sm`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Phân tích Pareto (80/20)
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Phân bổ nhân sự theo hiệu suất:</span>
                <span className="font-semibold">80/20</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-1000" style={{ width: "80%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>20% nhân viên hiệu suất cao</span>
                <span>80% khối lượng công việc</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Phân bổ thời gian làm việc:</span>
                <span className="font-semibold">80/20</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000" style={{ width: "80%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>20% thời gian (giờ cao điểm)</span>
                <span>80% đơn hàng được xử lý</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Phân bổ khu vực kho:</span>
                <span className="font-semibold">75/25</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-1000" style={{ width: "75%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>25% khu vực kho</span>
                <span>75% hoạt động picking</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Đề xuất tối ưu hóa:
              </h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <span>Tập trung 80% nhân viên senior vào khung giờ cao điểm (10-12h, 14-16h)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <span>Bố trí 20% nhân viên hiệu suất cao xử lý 80% đơn hàng ưu tiên</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                  <span>Cân đối tỷ lệ kỹ năng: Picking(45%) / Packing(30%) / QC(15%) / Logistics(10%)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}
      {/* Auto Schedule Modal */}
      {showAutoSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardClass} rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Phân ca tự động</h3>
              <button
                onClick={() => setShowAutoSchedule(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium mb-2">Thuật toán 80/20</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tự động phân bổ 20% nhân viên hiệu suất cao vào 80% khối lượng công việc quan trọng.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Tuần áp dụng:</label>
                <input
                  type="week"
                  className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input}`}
                  defaultValue={`2025-W${Math.ceil(new Date().getDate() / 7).toString().padStart(2, '0')}`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Ưu tiên khu vực:</label>
                <select className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input}`}>
                  <option value="all">Tất cả khu vực</option>
                  <option value="A,B">Khu vực A, B (cao điểm)</option>
                  <option value="C,D">Khu vực C, D (thông thường)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowAutoSchedule(false);
                    window.alert('Đã áp dụng phân ca tự động theo nguyên tắc 80/20!');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg ${buttonPrimaryClass} transition-all`}
                >
                  Áp dụng
                </button>
                <button
                  onClick={() => setShowAutoSchedule(false)}
                  className={`flex-1 px-4 py-2 rounded-lg ${buttonSecondaryClass} transition-all`}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cardClass} rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chi tiết nhân viên</h3>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${
                  selectedEmployee.performance > 90 ? 'from-green-500 to-emerald-600' :
                  selectedEmployee.performance > 85 ? 'from-blue-500 to-cyan-600' :
                  'from-gray-500 to-slate-600'
                } flex items-center justify-center text-white font-bold text-xl`}>
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{selectedEmployee.name}</h4>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>Khu vực {selectedEmployee.area}</span>
                    <span>•</span>
                    <span>{selectedEmployee.skill}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedEmployee.performance}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hiệu suất</div>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">28</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Giờ/tuần</div>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-medium">Lịch tuần này:</h5>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {weekDates.map((date, index) => (
                    <div key={index} className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span>{getDayName(date)} ({formatDate(date)})</span>
                      <span className="font-medium">08:00 - 17:00</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== PROP TYPES ====================
ScheduleTab.propTypes = {
  data: PropTypes.object,
  themeClasses: PropTypes.object.isRequired
};

ScheduleTab.defaultProps = {
  data: {},
  themeClasses: {
    mode: 'light',
    surface: 'bg-white',
    border: 'border-gray-200',
    text: {
      muted: 'text-gray-500'
    },
    button: {
      primary: 'bg-blue-600 text-white',
      primaryHover: 'bg-blue-700',
      secondary: 'bg-gray-200 text-gray-700',
      secondaryHover: 'bg-gray-300'
    },
    input: 'border-gray-300 focus:border-blue-500'
  }
};

// ==================== EXPORTS ====================
export default ScheduleTab;




