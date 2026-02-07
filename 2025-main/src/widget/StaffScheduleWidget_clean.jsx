import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import WidgetWrapper from '../components/layout/WidgetWrapper';
import {
  Calendar, Clock, Users, Plus, ChevronLeft, ChevronRight,
  Edit, X, MapPin, CheckCircle, XCircle, RotateCcw, Loader
} from 'lucide-react';

const StaffScheduleWidget = ({ staffData, themeClasses, onScheduleUpdate }) => {
  const [scheduleData, setScheduleData] = useState([
    {
      id: 1,
      staffId: 1,
      staffName: 'Nguyễn Văn A',
      date: '2025-05-26',
      shift: 'morning',
      startTime: '06:00',
      endTime: '14:00',
      area: 'A',
      status: 'scheduled',
      overtime: false,
      type: 'regular',
      efficiency: 95,
      workload: 12
    },
    {
      id: 2,
      staffId: 2,
      staffName: 'Trần Thị B',
      date: '2025-05-26',
      shift: 'afternoon',
      startTime: '14:00',
      endTime: '22:00',
      area: 'A',
      status: 'scheduled',
      overtime: false,
      type: 'regular',
      efficiency: 92,
      workload: 11
    }
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');
  const [showAddShift, setShowAddShift] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showAutoSchedule, setShowAutoSchedule] = useState(false);
  const [showWorkloadForecast, setShowWorkloadForecast] = useState(false);

  // Workload forecast data
  const [workloadData] = useState([
    { date: '2025-05-26', dayName: 'T2', orders: 120, capacity: 150, required: 8, special: false },
    { date: '2025-05-27', dayName: 'T3', orders: 140, capacity: 150, required: 9, special: false },
    { date: '2025-05-28', dayName: 'T4', orders: 180, capacity: 150, required: 12, special: true },
    { date: '2025-05-29', dayName: 'T5', orders: 200, capacity: 150, required: 14, special: true },
    { date: '2025-05-30', dayName: 'T6', orders: 160, capacity: 150, required: 10, special: false },
    { date: '2025-05-31', dayName: 'T7', orders: 90, capacity: 150, required: 6, special: false },
    { date: '2025-06-01', dayName: 'CN', orders: 70, capacity: 100, required: 5, special: false }
  ]);

  // ==================== COMPUTED VALUES ====================
  const weekDates = useMemo(() => {
    const start = new Date(selectedDate);
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
  }, [selectedDate]);

  const scheduleByDate = useMemo(() => {
    const grouped = {};
    scheduleData.forEach(schedule => {
      if (!grouped[schedule.date]) {
        grouped[schedule.date] = [];
      }
      grouped[schedule.date].push(schedule);
    });
    return grouped;
  }, [scheduleData]);

  const scheduleStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todaySchedules = scheduleData.filter(s => s.date === today);

    return {
      totalShifts: scheduleData.length,
      todayShifts: todaySchedules.length,
      completedShifts: scheduleData.filter(s => s.status === 'completed').length,
      missedShifts: scheduleData.filter(s => s.status === 'no-show').length,
      overtimeShifts: scheduleData.filter(s => s.overtime).length,
      activeStaff: new Set(todaySchedules.map(s => s.staffId)).size
    };
  }, [scheduleData]);

  // ==================== HANDLERS ====================
  const handleDateChange = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === 'next') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setSelectedDate(newDate);
  };

  const handleAddShift = (shiftData) => {
    const newShift = {
      id: scheduleData.length + 1,
      ...shiftData,
      status: 'scheduled'
    };
    setScheduleData([...scheduleData, newShift]);
    setShowAddShift(false);
    if (onScheduleUpdate) onScheduleUpdate(newShift);
  };

  const handleEditShift = (shiftId, updatedData) => {
    setScheduleData(scheduleData.map(shift =>
      shift.id === shiftId ? { ...shift, ...updatedData } : shift
    ));
    setEditingShift(null);
  };

  const handleDeleteShift = (shiftId) => {
    setScheduleData(scheduleData.filter(shift => shift.id !== shiftId));
  };

  // ==================== RENDER FUNCTIONS ====================
  const renderScheduleStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <div className={`p-3 rounded-lg ${themeClasses.surfaceHover}`}>
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={16} className="text-blue-500" />
          <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Tổng ca</span>
        </div>
        <p className={`text-xl font-bold ${themeClasses.text.primary}`}>
          {scheduleStats.totalShifts}
        </p>
      </div>

      <div className={`p-3 rounded-lg ${themeClasses.surfaceHover}`}>
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-green-500" />
          <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Hôm nay</span>
        </div>
        <p className={`text-xl font-bold ${themeClasses.text.primary}`}>
          {scheduleStats.todayShifts}
        </p>
      </div>

      <div className={`p-3 rounded-lg ${themeClasses.surfaceHover}`}>
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={16} className="text-green-500" />
          <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Hoàn thành</span>
        </div>
        <p className={`text-xl font-bold ${themeClasses.text.primary}`}>
          {scheduleStats.completedShifts}
        </p>
      </div>

      <div className={`p-3 rounded-lg ${themeClasses.surfaceHover}`}>
        <div className="flex items-center gap-2 mb-2">
          <XCircle size={16} className="text-red-500" />
          <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Vắng mặt</span>
        </div>
        <p className={`text-xl font-bold ${themeClasses.text.primary}`}>
          {scheduleStats.missedShifts}
        </p>
      </div>

      <div className={`p-3 rounded-lg ${themeClasses.surfaceHover}`}>
        <div className="flex items-center gap-2 mb-2">
          <RotateCcw size={16} className="text-yellow-500" />
          <span className={`text-sm font-medium ${themeClasses.text.primary}`}>Tăng ca</span>
        </div>
        <p className={`text-xl font-bold ${themeClasses.text.primary}`}>
          {scheduleStats.overtimeShifts}
        </p>
      </div>

      <div className={`p-3 rounded-lg ${themeClasses.surfaceHover}`}>
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-purple-500" />
          <span className={`text-sm font-medium ${themeClasses.text.primary}`}>NV hoạt động</span>
        </div>
        <p className={`text-xl font-bold ${themeClasses.text.primary}`}>
          {scheduleStats.activeStaff}
        </p>
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div className="space-y-4">
      {/* Week Header */}
      <div className="grid grid-cols-8 gap-2">
        <div className={`p-3 font-semibold ${themeClasses.text.primary}`}>Ca làm việc</div>
        {weekDates.map((date, index) => (
          <div key={index} className="text-center">
            <div className={`text-sm ${themeClasses.text.muted}`}>
              {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-semibold ${themeClasses.text.primary} ${
              date.toDateString() === new Date().toDateString() ? 'text-blue-600' : ''
            }`}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="space-y-2">
        {['morning', 'afternoon', 'night'].map(shift => (
          <div key={shift} className="grid grid-cols-8 gap-2">
            <div className={`p-3 rounded-lg ${themeClasses.surfaceHover} flex items-center`}>
              <span className={`font-medium ${themeClasses.text.primary}`}>
                {shift === 'morning' ? 'Ca sáng (6:00-14:00)' :
                 shift === 'afternoon' ? 'Ca chiều (14:00-22:00)' :
                 'Ca đêm (22:00-6:00)'}
              </span>
            </div>
            {weekDates.map((date, dateIndex) => {
              const dateStr = date.toISOString().split('T')[0];
              const daySchedules = scheduleByDate[dateStr]?.filter(s => s.shift === shift) || [];

              return (
                <div key={dateIndex} className={`min-h-[80px] p-2 rounded-lg border-2 border-dashed ${
                  daySchedules.length > 0 ? themeClasses.border : 'border-gray-200 dark:border-gray-700'
                } ${themeClasses.surface}`}>
                  {daySchedules.map(schedule => (
                    <ShiftCard
                      key={schedule.id}
                      schedule={schedule}
                      themeClasses={themeClasses}
                      onEdit={() => setEditingShift(schedule)}
                      onDelete={() => handleDeleteShift(schedule.id)}
                    />
                  ))}
                  {daySchedules.length === 0 && (
                    <button
                      onClick={() => setShowAddShift({ date: dateStr, shift })}
                      className={`w-full h-full min-h-[60px] rounded border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors flex items-center justify-center ${themeClasses.text.muted} hover:text-blue-500`}
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  // ==================== SHIFT CARD COMPONENT ====================
  const ShiftCard = ({ schedule, themeClasses, onEdit, onDelete }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        case 'no-show': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      }
    };

    return (
      <div className={`p-2 rounded-lg ${themeClasses.surfaceHover} border ${themeClasses.border} mb-2`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-medium ${themeClasses.text.primary} truncate`}>
            {schedule.staffName}
          </span>
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className={`p-1 rounded hover:${themeClasses.surfaceHover} transition-colors`}
            >
              <Edit size={12} />
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <MapPin size={10} className={themeClasses.text.muted} />
            <span className={`text-xs ${themeClasses.text.muted}`}>Khu vực {schedule.area}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={10} className={themeClasses.text.muted} />
            <span className={`text-xs ${themeClasses.text.muted}`}>
              {schedule.startTime}-{schedule.endTime}
            </span>
          </div>
          <span className={`inline-block px-1 py-0.5 rounded text-xs font-medium ${getStatusColor(schedule.status)}`}>
            {schedule.status === 'scheduled' ? 'Đã lên lịch' :
             schedule.status === 'completed' ? 'Hoàn thành' :
             schedule.status === 'no-show' ? 'Vắng mặt' : schedule.status}
          </span>
          {schedule.overtime && (
            <span className="inline-block px-1 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 ml-1">
              Tăng ca
            </span>
          )}
        </div>
      </div>
    );
  };

  // ==================== MODAL COMPONENTS ====================
  const AddShiftModal = () => {
    const [formData, setFormData] = useState({
      staffId: '',
      date: showAddShift.date || '',
      shift: showAddShift.shift || 'morning',
      startTime: '06:00',
      endTime: '14:00',
      area: 'A',
      overtime: false,
      type: 'regular'
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const staff = staffData?.find(s => s.id === parseInt(formData.staffId));
      if (staff) {
        handleAddShift({
          ...formData,
          staffId: parseInt(formData.staffId),
          staffName: staff.name
        });
      }
    };

    if (!showAddShift) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`w-full max-w-md p-6 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
              Thêm ca làm việc
            </h3>
            <button
              onClick={() => setShowAddShift(false)}
              className={`p-2 rounded-lg ${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover} transition-colors`}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                Nhân viên
              </label>
              <select
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              >
                <option value="">Chọn nhân viên</option>
                {staffData?.map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                Ngày
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                  Giờ bắt đầu
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                  Giờ kết thúc
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
                Khu vực
              </label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="A">Khu vực A</option>
                <option value="B">Khu vực B</option>
                <option value="C">Khu vực C</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="overtime"
                checked={formData.overtime}
                onChange={(e) => setFormData({ ...formData, overtime: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="overtime" className={`text-sm ${themeClasses.text.primary}`}>
                Ca tăng ca
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddShift(false)}
                className={`flex-1 px-4 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover} transition-colors`}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm ca
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Mock modal components
  const EditShiftModal = ({ shift, onClose, onSave, themeClasses }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-xl ${themeClasses.surface}`}>
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Chỉnh sửa ca làm việc</h3>
        <p className={themeClasses.text.secondary}>Chức năng đang được phát triển...</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Đóng</button>
      </div>
    </div>
  );

  const SettingsModal = ({ onClose, themeClasses }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-xl ${themeClasses.surface}`}>
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Cài đặt</h3>
        <p className={themeClasses.text.secondary}>Chức năng đang được phát triển...</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Đóng</button>
      </div>
    </div>
  );

  const FilterModal = ({ onClose, themeClasses }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-xl ${themeClasses.surface}`}>
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Bộ lọc</h3>
        <p className={themeClasses.text.secondary}>Chức năng đang được phát triển...</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Đóng</button>
      </div>
    </div>
  );

  const ExportModal = ({ onClose, themeClasses }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-xl ${themeClasses.surface}`}>
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Xuất dữ liệu</h3>
        <p className={themeClasses.text.secondary}>Chức năng đang được phát triển...</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Đóng</button>
      </div>
    </div>
  );

  const ImportModal = ({ onClose, themeClasses }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-xl ${themeClasses.surface}`}>
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Nhập dữ liệu</h3>
        <p className={themeClasses.text.secondary}>Chức năng đang được phát triển...</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Đóng</button>
      </div>
    </div>
  );

  const AutoScheduleModal = ({ onClose, themeClasses }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-xl ${themeClasses.surface}`}>
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Tự động xếp lịch</h3>
        <p className={themeClasses.text.secondary}>Chức năng đang được phát triển...</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Đóng</button>
      </div>
    </div>
  );

  const WorkloadForecastModal = ({ workloadData, onClose, themeClasses }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md p-6 rounded-xl ${themeClasses.surface}`}>
        <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-4`}>Dự báo khối lượng công việc</h3>
        <p className={themeClasses.text.secondary}>Chức năng đang được phát triển...</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Đóng</button>
      </div>
    </div>
  );

  const Spinner = ({ size = 16, className = "" }) => (
    <Loader size={size} className={`animate-spin ${className}`} />
  );

  // ==================== MAIN RENDER ====================
  return (
    <WidgetWrapper
      widgetId="staff-schedule"
      title="Lịch Làm Việc Nhân Viên"
      description="Quản lý và theo dõi lịch làm việc của nhân viên"
      themeClasses={themeClasses}
      isExpandable={true}
      isRefreshable={true}
      onRefresh={() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
      }}
    >
      {/* Date Navigation & Controls */}
      <div className={`p-4 border-b ${themeClasses.border} ${themeClasses.surfaceHover}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className={`px-3 py-1 rounded border ${themeClasses.input} ${themeClasses.border} text-sm`}
            >
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="day">Ngày</option>
            </select>
            <button
              onClick={() => setShowAddShift({ date: new Date().toISOString().split('T')[0], shift: 'morning' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Thêm ca
            </button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleDateChange('prev')}
            className={`p-2 rounded-lg ${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover} transition-colors`}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <h4 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
              {viewMode === 'week'
                ? `Tuần ${Math.ceil(selectedDate.getDate() / 7)} - ${selectedDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`
                : selectedDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
              }
            </h4>
            <p className={`text-sm ${themeClasses.text.muted}`}>
              {weekDates[0]?.toLocaleDateString('vi-VN')} - {weekDates[6]?.toLocaleDateString('vi-VN')}
            </p>
          </div>
          <button
            onClick={() => handleDateChange('next')}
            className={`p-2 rounded-lg ${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover} transition-colors`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Schedule Stats */}
      {renderScheduleStats()}

      {/* Main Schedule View */}
      {renderWeekView()}

      {/* Modals */}
      {showAddShift && <AddShiftModal />}
      {editingShift && (
        <EditShiftModal
          shift={editingShift}
          onClose={() => setEditingShift(null)}
          onSave={handleEditShift}
          themeClasses={themeClasses}
        />
      )}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} themeClasses={themeClasses} />}
      {showFilter && <FilterModal onClose={() => setShowFilter(false)} themeClasses={themeClasses} />}
      {showExport && <ExportModal onClose={() => setShowExport(false)} themeClasses={themeClasses} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} themeClasses={themeClasses} />}
      {showAutoSchedule && <AutoScheduleModal onClose={() => setShowAutoSchedule(false)} themeClasses={themeClasses} />}
      {showWorkloadForecast && (
        <WorkloadForecastModal
          workloadData={workloadData}
          onClose={() => setShowWorkloadForecast(false)}
          themeClasses={themeClasses}
        />
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Spinner size={32} className="text-white" />
        </div>
      )}
    </WidgetWrapper>
  );
};

// PropTypes
StaffScheduleWidget.propTypes = {
  staffData: PropTypes.array.isRequired,
  themeClasses: PropTypes.object.isRequired,
  onScheduleUpdate: PropTypes.func.isRequired
};

// Default props
StaffScheduleWidget.defaultProps = {
  staffData: [],
  themeClasses: {
    surface: 'bg-white dark:bg-gray-800',
    surfaceHover: 'hover:bg-gray-50 dark:hover:bg-gray-700',
    border: 'border-gray-200 dark:border-gray-700',
    text: {
      primary: 'text-gray-900 dark:text-white',
      secondary: 'text-gray-600 dark:text-gray-400',
      muted: 'text-gray-500 dark:text-gray-500'
    },
    input: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500',
    buttonSecondary: 'bg-gray-100 dark:bg-gray-700',
    buttonSecondaryHover: 'bg-gray-200 dark:bg-gray-600'
  },
  onScheduleUpdate: () => {}
};

export default StaffScheduleWidget;
