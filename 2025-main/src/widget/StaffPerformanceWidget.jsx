import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { User, TrendingUp, Search, Filter } from 'lucide-react';
import WidgetWrapper from './WidgetWrapper';

const StaffPerformanceWidget = ({ staffData, themeClasses, onPerformanceUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('performance');
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock data if none provided
  const [data, setData] = useState(() => {
    if (staffData && staffData.length > 0) {
      return staffData;
    }

    return [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        status: 'active',
        efficiency: 85,
        performance: 92,
        tasksCompleted: 45,
        totalTasks: 50,
        workHours: 8.5,
        department: 'Kho'
      },
      {
        id: '2',
        name: 'Trần Thị B',
        status: 'active',
        efficiency: 78,
        performance: 88,
        tasksCompleted: 38,
        totalTasks: 42,
        workHours: 8.0,
        department: 'Giao hàng'
      },
      {
        id: '3',
        name: 'Lê Văn C',
        status: 'break',
        efficiency: 92,
        performance: 95,
        tasksCompleted: 55,
        totalTasks: 58,
        workHours: 8.2,
        department: 'Kho'
      }
    ];
  });

  // Filter and search logic
  const filteredData = data.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter === 'high') {
      matchesFilter = staff.efficiency >= 80;
    } else if (filter === 'medium') {
      matchesFilter = staff.efficiency >= 60 && staff.efficiency < 80;
    } else if (filter === 'low') {
      matchesFilter = staff.efficiency < 60;
    }

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'efficiency') {
      return b.efficiency - a.efficiency;
    } else {
      return b.performance - a.performance;
    }
  });

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, []);

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (onPerformanceUpdate) {
        onPerformanceUpdate(data);
      }
      setIsLoading(false);
    }, 1000);
  }, [data, onPerformanceUpdate]);

  useEffect(() => {
    if (staffData && staffData.length > 0) {
      setData(staffData);
    }
  }, [staffData]);

  return (
    <WidgetWrapper
      widgetId="staff-performance"
      title="Hiệu Suất Nhân Viên"
      description="Theo dõi và đánh giá hiệu suất làm việc của nhân viên"
      themeClasses={themeClasses}
      isExpandable={true}
      isRefreshable={true}
      onRefresh={handleRefresh}
    >
      {/* Search and Filter Controls */}
      <div className={`p-4 border-b ${themeClasses.border}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className={`pl-10 pr-8 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">Tất cả</option>
                <option value="high">Hiệu suất cao (≥80%)</option>
                <option value="medium">Hiệu suất trung bình (60-79%)</option>
                <option value="low">Hiệu suất thấp (&lt;60%)</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="performance">Hiệu suất</option>
              <option value="name">Tên</option>
              <option value="efficiency">Hiệu quả</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((staff) => (
              <StaffPerformanceCard
                key={staff.id}
                staff={staff}
                themeClasses={themeClasses}
              />
            ))}
            {filteredData.length === 0 && (
              <div className={`text-center py-8 ${themeClasses.text?.muted || 'text-gray-500'}`}>
                Không tìm thấy nhân viên nào phù hợp
              </div>
            )}
          </div>
        )}
      </div>
    </WidgetWrapper>
  );
};

// Individual staff performance card component
const StaffPerformanceCard = ({ staff, themeClasses }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang làm việc';
      case 'break': return 'Nghỉ giải lao';
      case 'offline': return 'Offline';
      default: return 'Không xác định';
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`p-4 rounded-lg border ${themeClasses.border} hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${themeClasses.surface || 'bg-gray-100'}`}>
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h4 className={`font-medium ${themeClasses.text?.primary || 'text-gray-900'}`}>
              {staff.name}
            </h4>
            <p className={`text-sm ${themeClasses.text?.muted || 'text-gray-500'}`}>
              {staff.department}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
            {getStatusText(staff.status)}
          </span>
          <div className="text-right">
            <div className={`flex items-center gap-1 ${getPerformanceColor(staff.performance)}`}>
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold">{staff.performance}%</span>
            </div>
            <p className={`text-xs ${themeClasses.text?.muted || 'text-gray-500'}`}>
              Hiệu suất
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className={`${themeClasses.text?.muted || 'text-gray-500'}`}>Hiệu quả</p>
          <p className={`font-medium ${themeClasses.text?.primary || 'text-gray-900'}`}>
            {staff.efficiency}%
          </p>
        </div>
        <div>
          <p className={`${themeClasses.text?.muted || 'text-gray-500'}`}>Công việc</p>
          <p className={`font-medium ${themeClasses.text?.primary || 'text-gray-900'}`}>
            {staff.tasksCompleted}/{staff.totalTasks}
          </p>
        </div>
        <div>
          <p className={`${themeClasses.text?.muted || 'text-gray-500'}`}>Giờ làm</p>
          <p className={`font-medium ${themeClasses.text?.primary || 'text-gray-900'}`}>
            {staff.workHours}h
          </p>
        </div>
      </div>

      {/* Progress bar for task completion */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(staff.tasksCompleted / staff.totalTasks) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

StaffPerformanceWidget.propTypes = {
  staffData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      efficiency: PropTypes.number.isRequired,
      performance: PropTypes.number.isRequired,
      tasksCompleted: PropTypes.number.isRequired,
      totalTasks: PropTypes.number.isRequired,
      workHours: PropTypes.number.isRequired,
      department: PropTypes.string.isRequired
    })
  ),
  themeClasses: PropTypes.object,
  onPerformanceUpdate: PropTypes.func
};

StaffPerformanceCard.propTypes = {
  staff: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    efficiency: PropTypes.number.isRequired,
    performance: PropTypes.number.isRequired,
    tasksCompleted: PropTypes.number.isRequired,
    totalTasks: PropTypes.number.isRequired,
    workHours: PropTypes.number.isRequired,
    department: PropTypes.string.isRequired
  }).isRequired,
  themeClasses: PropTypes.object
};

export default StaffPerformanceWidget;
