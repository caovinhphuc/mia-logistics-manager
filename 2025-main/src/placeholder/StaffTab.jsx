// Advanced Staff Management Module
import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  Calendar,
  MapPin,
  Star,
  Target,
  Zap,
  UserCheck,
  UserX,
  Plus,
  Minus,
  MoreVertical,
  RefreshCw,
  User,
  ArrowLeft,
  Briefcase,
  Settings
} from 'lucide-react';
import { SYSTEM_CONFIG } from '../components/config/systemConfig';
import { useTheme } from '../hooks/useTheme';
import PropTypes from 'prop-types';
import LayoutManager from '../components/layout/LayoutManager';
import LayoutConfigManager from '../components/LayoutConfigManager';
import WidgetWrapper from '../components/layout/WidgetWrapper';
import StaffMetricsWidget from '../widget/StaffMetricsWidget';
import StaffTableWidget from '../widget/StaffTableWidget';
import StaffFiltersWidget from '../widget/StaffFiltersWidget';
import StaffPerformanceWidget from '../widget/StaffPerformanceWidget';
import StaffScheduleWidget from '../widget/StaffScheduleWidget';
import StaffKPITracker from '../widget/StaffKPITracker';
import { useLayout } from '../context/LayoutContext';

const StaffTab = ({ data, themeClasses, activeView = 'overview' }) => {
  // ==================== STATE MANAGEMENT ====================
  const [selectedView, setSelectedView] = useState(activeView);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArea, setFilterArea] = useState('all');
  const [sortBy, setSortBy] = useState('efficiency');
  const [sortOrder, setSortOrder] = useState('desc');  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffData, setStaffData] = useState(data?.staff || []);
  const [refreshing, setRefreshing] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [isLayoutConfigOpen, setIsLayoutConfigOpen] = useState(false);

  // Use layout context
  const { layouts } = useLayout();

  // Cập nhật selectedView khi activeView thay đổi
  useEffect(() => {
    setSelectedView(activeView);
    setShowDetailView(false);
  }, [activeView]);

  // ==================== COMPUTED VALUES ====================
  const filteredAndSortedStaff = useMemo(() => {
    let filtered = staffData.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           staff.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || staff.status === filterStatus;
      const matchesArea = filterArea === 'all' || staff.area === filterArea;

      return matchesSearch && matchesStatus && matchesArea;
    });

    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'name' || sortBy === 'role') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [staffData, searchTerm, filterStatus, filterArea, sortBy, sortOrder]);

  const staffMetrics = useMemo(() => {
    const totalStaff = staffData.length;
    const activeStaff = staffData.filter(s => s.status === 'active').length;
    const busyStaff = staffData.filter(s => s.status === 'busy').length;
    const avgEfficiency = staffData.reduce((sum, s) => sum + s.efficiency, 0) / totalStaff;
    const totalOrders = staffData.reduce((sum, s) => sum + s.orderCount, 0);
    const areas = [...new Set(staffData.map(s => s.area))];

    return {
      totalStaff,
      activeStaff,
      busyStaff,
      avgEfficiency: Math.round(avgEfficiency),
      totalOrders,
      utilization: Math.round((busyStaff / totalStaff) * 100),
      areas: areas.length
    };
  }, [staffData]);

  // ==================== HANDLERS ====================
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleViewChange = (view) => {
    setSelectedView(view);
    setSelectedStaff(null);
    setShowDetailView(false);
  };

  const handleStaffSelect = (staff) => {
    setSelectedStaff(staff);
    setShowDetailView(true);
  };
  const handleFilterChange = {
    search: (value) => setSearchTerm(value),
    status: (value) => setFilterStatus(value),
    area: (value) => setFilterArea(value),
    sort: (field, order) => {
      setSortBy(field);
      setSortOrder(order);
    }
  };

  const handleOpenLayoutConfig = () => {
    setIsLayoutConfigOpen(true);
  };

  const handleCloseLayoutConfig = () => {
    setIsLayoutConfigOpen(false);
  };

  // ==================== RENDER CONTENT BASED ON VIEW ====================
  const renderStaffContent = () => {
    // If we're showing staff detail view
    if (showDetailView && selectedStaff) {
      return renderStaffDetailView();
    }

    // Otherwise, render the appropriate view based on selection
    switch (selectedView) {
      case 'overview':
        return renderOverviewContent();
      case 'performance':
        return renderPerformanceContent();
      case 'schedule':
        return renderScheduleContent();
      case 'assignments':
        return renderAssignmentsContent();
      default:
        return renderOverviewContent();
    }
  };

  // ==================== VIEW RENDERERS ====================
  const renderOverviewContent = () => (
    <div className="w-full h-full min-h-0 space-y-6">
      {/* Header with view switcher */}
      <div className="w-full">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className={`text-2xl lg:text-3xl font-bold ${themeClasses.text.primary} mb-2 truncate`}>
              Quản lý nhân sự
            </h1>
            <p className={`${themeClasses.text.muted} text-sm lg:text-lg leading-relaxed line-clamp-2 sm:line-clamp-none`}>
              Tổng quan về đội ngũ nhân viên • {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>          <div className="flex flex-row sm:flex-row gap-2 lg:gap-3 flex-shrink-0">
            <button className="flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg lg:rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm lg:text-base">
              <Download size={16} className="mr-2" />
              <span className="hidden sm:inline">Xuất báo cáo</span>
              <span className="sm:hidden">Xuất</span>
            </button>
            <button className={`flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 ${themeClasses.surface} ${themeClasses.border} border rounded-lg lg:rounded-xl hover:shadow-md transition-all duration-200 text-sm lg:text-base`}>
              <UserPlus size={16} className="mr-2" />
              <span className="hidden sm:inline">Thêm nhân viên</span>
              <span className="sm:hidden">Thêm</span>
            </button>
            <button
              onClick={handleOpenLayoutConfig}
              className={`flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 ${themeClasses.surface} ${themeClasses.border} border rounded-lg lg:rounded-xl hover:shadow-md transition-all duration-200 text-sm lg:text-base`}
              title="Cấu hình giao diện"
            >
              <Settings size={16} className="mr-2" />
              <span className="hidden sm:inline">Cấu hình</span>
              <span className="sm:hidden">Cài đặt</span>
            </button>
          </div>
        </div>      </div>      {/* Layout Manager với full width và không bị cắt */}
      <div className="w-full min-w-0 overflow-hidden">
        <LayoutManager themeClasses={themeClasses} useLayoutContext={true} pageId="staff-overview" data={data} metrics={staffMetrics}>
          {/* Staff Metrics Widget */}
          <div widgetId="staff-metrics">
            <StaffMetricsWidget
              staffMetrics={staffMetrics}
              themeClasses={themeClasses}
            />
          </div>

          {/* Staff Filters Widget */}
          <div widgetId="staff-filters">
            <StaffFiltersWidget
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              filterArea={filterArea}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSearchChange={handleFilterChange.search}
              onFilterStatusChange={handleFilterChange.status}
              onFilterAreaChange={handleFilterChange.area}
              onSortChange={handleFilterChange.sort}
              onRefresh={handleRefresh}
              onAddStaff={() => setShowAddStaff(true)}
              refreshing={refreshing}
              themeClasses={themeClasses}
            />
          </div>

          {/* Staff Table Widget */}
          <div widgetId="staff-table">
            <StaffTableWidget
              staffData={filteredAndSortedStaff}
              onViewStaff={handleStaffSelect}
              themeClasses={themeClasses}
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              filterArea={filterArea}
            />
          </div>

          {/* Staff Performance Widget */}
          <div widgetId="staff-performance">
            <StaffPerformanceWidget
              data={staffData}
              themeClasses={themeClasses}
            />
          </div>
        </LayoutManager>
      </div>
    </div>
  );

  const renderPerformanceContent = () => (
    <div className="w-full h-full min-h-0 space-y-6">
      {/* Header with view switcher */}
      <div className="w-full">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className={`text-2xl lg:text-3xl font-bold ${themeClasses.text.primary} mb-2 truncate`}>
              Hiệu suất nhân viên
            </h1>
            <p className={`${themeClasses.text.muted} text-sm lg:text-lg leading-relaxed line-clamp-2 sm:line-clamp-none`}>
              Phân tích hiệu quả làm việc và năng suất nhân viên
            </p>
          </div>          <div className="flex flex-row sm:flex-row gap-2 lg:gap-3 flex-shrink-0">
            <button className="flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg lg:rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm lg:text-base">
              <Download size={16} className="mr-2" />
              <span className="hidden sm:inline">Xuất báo cáo</span>
              <span className="sm:hidden">Xuất</span>
            </button>
            <button
              onClick={handleOpenLayoutConfig}
              className={`flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 ${themeClasses.surface} ${themeClasses.border} border rounded-lg lg:rounded-xl hover:shadow-md transition-all duration-200 text-sm lg:text-base`}
              title="Cấu hình giao diện"
            >
              <Settings size={16} className="mr-2" />
              <span className="hidden sm:inline">Cấu hình</span>
              <span className="sm:hidden">Cài đặt</span>
            </button>
            <button onClick={() => handleViewChange('overview')} className={`flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 ${themeClasses.surface} ${themeClasses.border} border rounded-lg lg:rounded-xl hover:shadow-md transition-all duration-200 text-sm lg:text-base`}>
              <ArrowLeft size={16} className="mr-2" />
              <span className="hidden sm:inline">Quay lại</span>
              <span className="sm:hidden">Quay lại</span>
            </button>
          </div>
        </div>
      </div>      {/* Layout Manager với full width và không bị cắt */}
      <div className="w-full min-w-0 overflow-hidden">
        <LayoutManager themeClasses={themeClasses} useLayoutContext={true} pageId="staff-performance" data={data} metrics={staffMetrics}>
          {/* Performance content will go here */}
          <div widgetId="performance-metrics">
            <WidgetWrapper
              widgetId="performance-metrics"
              title="Thống kê hiệu suất"
              description="Chỉ số hiệu suất nhân viên theo thời gian"
              themeClasses={themeClasses}
              isRefreshable={true}
            >
              <div className="p-4">
                <p className={`text-sm ${themeClasses.text.muted}`}>Biểu đồ hiệu suất sẽ được hiển thị ở đây</p>
              </div>
            </WidgetWrapper>
          </div>

          {/* Staff Performance Comparison */}
          <div widgetId="performance-comparison">
            <StaffPerformanceWidget
              data={staffData}
              themeClasses={themeClasses}
            />
          </div>

          {/* Staff KPI tracking */}
          <div widgetId="kpi-tracking">
            <WidgetWrapper
              widgetId="kpi-tracking"
              title="Đánh giá KPI nhân viên"
              description="Theo dõi và đánh giá KPI của từng nhân viên"
              themeClasses={themeClasses}
              isRefreshable={true}
            >
              <div className="p-4">
                <p className={`text-sm ${themeClasses.text.muted}`}>Bảng đánh giá KPI sẽ được hiển thị ở đây</p>
              </div>
            </WidgetWrapper>
          </div>
        </LayoutManager>
      </div>
    </div>
  );

  const renderScheduleContent = () => (
    <div className="w-full h-full min-h-0 space-y-6">
      {/* Header with view switcher */}
      <div className="w-full">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className={`text-2xl lg:text-3xl font-bold ${themeClasses.text.primary} mb-2 truncate`}>
              Lịch làm việc
            </h1>
            <p className={`${themeClasses.text.muted} text-sm lg:text-lg leading-relaxed line-clamp-2 sm:line-clamp-none`}>
              Quản lý lịch làm việc và ca trực của nhân viên
            </p>
          </div>          <div className="flex flex-row sm:flex-row gap-2 lg:gap-3 flex-shrink-0">
            <button className="flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg lg:rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm lg:text-base">
              <Plus size={16} className="mr-2" />
              <span className="hidden sm:inline">Thêm ca làm</span>
              <span className="sm:hidden">Thêm ca</span>
            </button>
            <button
              onClick={handleOpenLayoutConfig}
              className={`flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 ${themeClasses.surface} ${themeClasses.border} border rounded-lg lg:rounded-xl hover:shadow-md transition-all duration-200 text-sm lg:text-base`}
              title="Cấu hình giao diện"
            >
              <Settings size={16} className="mr-2" />
              <span className="hidden sm:inline">Cấu hình</span>
              <span className="sm:hidden">Cài đặt</span>
            </button>
            <button onClick={() => handleViewChange('overview')} className={`flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 ${themeClasses.surface} ${themeClasses.border} border rounded-lg lg:rounded-xl hover:shadow-md transition-all duration-200 text-sm lg:text-base`}>
              <ArrowLeft size={16} className="mr-2" />
              <span className="hidden sm:inline">Quay lại</span>
              <span className="sm:hidden">Quay lại</span>
            </button>
          </div>
        </div>
      </div>      {/* Layout Manager với full width và không bị cắt */}
      <div className="w-full min-w-0 overflow-hidden">
        <LayoutManager themeClasses={themeClasses} useLayoutContext={true} pageId="staff-schedule" data={data} metrics={staffMetrics}>
          {/* Schedule content will go here */}
          <div widgetId="scheduleCalendar">
            <StaffScheduleWidget
              staffData={staffData}
              themeClasses={themeClasses}
              onScheduleUpdate={(schedule) => console.log('Schedule updated:', schedule)}
            />
          </div>

          <div widgetId="scheduleList">
            <WidgetWrapper
              widgetId="scheduleList"
              title="Danh sách ca làm việc"
              description="Hiển thị danh sách ca làm việc của nhân viên"
              themeClasses={themeClasses}
              isRefreshable={true}
            >
              <div className="p-4">
                <p className={`text-sm ${themeClasses.text.muted}`}>Danh sách ca làm việc sẽ được hiển thị ở đây</p>
              </div>
            </WidgetWrapper>
          </div>
        </LayoutManager>
      </div>
    </div>
  );
  const renderAssignmentsContent = () => (
    <div className="w-full h-full min-h-0 space-y-6">
      {/* Header with view switcher */}
      <div className="w-full">
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className={`text-2xl lg:text-3xl font-bold ${themeClasses.text.primary} mb-2 truncate`}>
              Phân công công việc
            </h1>
            <p className={`${themeClasses.text.muted} text-sm lg:text-lg leading-relaxed line-clamp-2 sm:line-clamp-none`}>
              Quản lý và phân công nhiệm vụ cho nhân viên
            </p>
          </div>          <div className="flex flex-row sm:flex-row gap-2 lg:gap-3 flex-shrink-0">
            <button className="flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg lg:rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm lg:text-base">
              <Plus size={16} className="mr-2" />
              <span className="hidden sm:inline">Thêm nhiệm vụ</span>
              <span className="sm:hidden">Thêm</span>
            </button>
            <button
              onClick={handleOpenLayoutConfig}
              className={`flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 ${themeClasses.surface} ${themeClasses.border} border rounded-lg lg:rounded-xl hover:shadow-md transition-all duration-200 text-sm lg:text-base`}
              title="Cấu hình giao diện"
            >
              <Settings size={16} className="mr-2" />
              <span className="hidden sm:inline">Cấu hình</span>
              <span className="sm:hidden">Cài đặt</span>
            </button>
            <button onClick={() => handleViewChange('overview')} className={`flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 ${themeClasses.surface} ${themeClasses.border} border rounded-lg lg:rounded-xl hover:shadow-md transition-all duration-200 text-sm lg:text-base`}>
              <ArrowLeft size={16} className="mr-2" />
              <span className="hidden sm:inline">Quay lại</span>
              <span className="sm:hidden">Quay lại</span>
            </button>
          </div>
        </div>
      </div>      {/* Layout Manager với full width và không bị cắt */}
      <div className="w-full min-w-0 overflow-hidden">
        <LayoutManager themeClasses={themeClasses} useLayoutContext={true} pageId="staff-assignments" data={data} metrics={staffMetrics}>
          {/* Assignments content will go here */}
          <div widgetId="assignments-widget">
            <WidgetWrapper
              widgetId="assignments-widget"
              title="Danh sách công việc"
              description="Quản lý và theo dõi trạng thái công việc"
              themeClasses={themeClasses}
              isRefreshable={true}
            >
              <div className="p-4">
                <p className={`text-sm ${themeClasses.text.muted}`}>Bảng phân công và trạng thái nhiệm vụ sẽ được hiển thị ở đây</p>
              </div>
            </WidgetWrapper>
          </div>
        </LayoutManager>
      </div>
    </div>
  );

  const renderStaffDetailView = () => {
    if (!selectedStaff) return null;

    return (
      <div className="w-full h-full min-h-0 space-y-6">
        {/* Header with back button */}
        <div className="w-full">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => setShowDetailView(false)}
                className={`mb-4 flex items-center text-blue-600 hover:text-blue-700`}
              >
                <ArrowLeft size={16} className="mr-1" />
                <span>Quay lại danh sách</span>
              </button>
              <h1 className={`text-2xl lg:text-3xl font-bold ${themeClasses.text.primary} mb-2 truncate`}>
                {selectedStaff.name}
              </h1>
              <p className={`${themeClasses.text.muted} text-sm lg:text-lg leading-relaxed line-clamp-2 sm:line-clamp-none`}>
                {selectedStaff.role} • Khu vực {selectedStaff.area}
              </p>
            </div>
            <div className="flex flex-row sm:flex-row gap-2 lg:gap-3 flex-shrink-0">
              <button className="flex-1 sm:flex-auto flex items-center justify-center px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg lg:rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm lg:text-base">
                <Edit size={16} className="mr-2" />
                <span className="hidden sm:inline">Chỉnh sửa</span>
                <span className="sm:hidden">Sửa</span>
              </button>
            </div>
          </div>
        </div>        {/* Layout Manager với full width và không bị cắt */}
        <div className="w-full min-w-0 overflow-hidden">
          <LayoutManager themeClasses={themeClasses} useLayoutContext={true} pageId="staff-detail" data={{ ...data, staff: [selectedStaff] }} metrics={staffMetrics}>
            {/* Staff basic information */}
            <div widgetId="staff-info">
              <WidgetWrapper
                widgetId="staff-info"
                title="Thông tin chi tiết"
                description="Thông tin cá nhân và công việc"
                themeClasses={themeClasses}
                isRefreshable={true}
              >
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className={`font-semibold ${themeClasses.text.primary} mb-2`}>Thông tin cá nhân</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Tên:</span> {selectedStaff.name}</div>
                        <div><span className="font-medium">Vị trí:</span> {selectedStaff.role}</div>
                        <div><span className="font-medium">Khu vực:</span> {selectedStaff.area}</div>
                        <div><span className="font-medium">Trạng thái:</span>
                          <span className={`ml-2 px-2 py-1 rounded text-xs ${
                            selectedStaff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedStaff.status === 'active' ? 'Hoạt động' : 'Nghỉ'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${themeClasses.text.primary} mb-2`}>Hiệu suất</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Hiệu quả:</span> {selectedStaff.efficiency}%</div>
                        <div><span className="font-medium">Đơn hoàn thành:</span> {selectedStaff.ordersCompleted}</div>
                        <div><span className="font-medium">Xử lý P1:</span> {selectedStaff.handlingP1 ? 'Có' : 'Không'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </WidgetWrapper>
            </div>

            {/* Staff performance details */}
            <div widgetId="staff-performance-detail">
              <WidgetWrapper
                widgetId="staff-performance-detail"
                title="Chi tiết hiệu suất"
                description="Phân tích hiệu suất làm việc chi tiết"
                themeClasses={themeClasses}
                isRefreshable={true}
              >
                <div className="p-4">                  <StaffKPITracker
                    staffData={selectedStaff ? [selectedStaff] : []}
                    themeClasses={themeClasses}
                    viewMode="detail"
                    toLocaleTimeString={(date) => date?.toLocaleTimeString() || '--:--'}
                  />
                </div>
              </WidgetWrapper>
            </div>

            {/* Staff schedule details */}
            <div widgetId="staff-schedule-detail">
              <WidgetWrapper
                widgetId="staff-schedule-detail"
                title="Lịch làm việc"
                description="Lịch trình và ca làm việc"
                themeClasses={themeClasses}
                isRefreshable={true}
              >
                <div className="p-4">
                  <div className={`text-sm ${themeClasses.text.muted}`}>
                    Chi tiết lịch làm việc của {selectedStaff.name} sẽ được hiển thị ở đây
                  </div>
                </div>
              </WidgetWrapper>
            </div>
          </LayoutManager>
        </div>
      </div>
    );
  };
  // ==================== MAIN RENDER ====================
  return (
    <div className="w-full h-full overflow-y-auto">
      {renderStaffContent()}

      {/* Layout Configuration Modal */}
      <LayoutConfigManager
        themeClasses={themeClasses}
        isOpen={isLayoutConfigOpen}
        onClose={handleCloseLayoutConfig}
      />
    </div>
  );
};

StaffTab.propTypes = {
  data: PropTypes.object,
  themeClasses: PropTypes.object,
  activeView: PropTypes.string
};

export default StaffTab;



