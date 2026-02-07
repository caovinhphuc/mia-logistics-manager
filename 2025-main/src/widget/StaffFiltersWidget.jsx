// StaffFiltersWidget.jsx
import React from 'react';
import PropTypes from 'prop-types';
import WidgetWrapper from '../components/layout/WidgetWrapper';
import { Search, RefreshCw, UserPlus } from 'lucide-react';

const StaffFiltersWidget = ({
  searchTerm,
  filterStatus,
  filterArea,
  sortBy,
  sortOrder,
  onSearchChange,
  onFilterStatusChange,
  onFilterAreaChange,
  onSortChange,
  onRefresh,
  onAddStaff,
  refreshing,
  themeClasses
}) => {
  return (
    <WidgetWrapper
      widgetId="staff-filters"
      title="Tìm kiếm và lọc nhân viên"
      description="Tùy chỉnh hiển thị danh sách nhân viên"
      themeClasses={themeClasses}
    >
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.text.muted}`} />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => onFilterStatusChange(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Sẵn sàng</option>
              <option value="busy">Đang bận</option>
              <option value="offline">Offline</option>
            </select>

            <select
              value={filterArea}
              onChange={(e) => onFilterAreaChange(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">Tất cả khu vực</option>
              <option value="A">Khu vực A</option>
              <option value="B">Khu vực B</option>
              <option value="C">Khu vực C</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                onSortChange(field, order);
              }}
              className={`px-3 py-2 rounded-lg border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="efficiency-desc">Hiệu suất ↓</option>
              <option value="efficiency-asc">Hiệu suất ↑</option>
              <option value="orderCount-desc">Số đơn ↓</option>
              <option value="orderCount-asc">Số đơn ↑</option>
              <option value="name-asc">Tên A→Z</option>
              <option value="name-desc">Tên Z→A</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className={`px-4 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover} transition-colors flex items-center gap-2`}
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              Làm mới
            </button>
            <button
              onClick={onAddStaff}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <UserPlus size={16} />
              Thêm NV
            </button>
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
};

StaffFiltersWidget.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  filterStatus: PropTypes.string.isRequired,
  filterArea: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onFilterStatusChange: PropTypes.func.isRequired,
  onFilterAreaChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onAddStaff: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  themeClasses: PropTypes.object.isRequired
};

export default StaffFiltersWidget;
