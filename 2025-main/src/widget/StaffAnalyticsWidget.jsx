// Advanced Staff Analytics Widget
import  { useState, useMemo } from 'react';

import {
  Users,
  Target,
  Activity,
  Download,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  Star
} from 'lucide-react';
import PropTypes from 'prop-types';

// ==================== COMPONENT ====================
/**
 * Staff Analytics Widget
 * Hiển thị các thống kê về nhân viên
 */


const StaffAnalyticsWidget = ({ staffData, themeClasses, timeRange = '7d' }) => {
  const [selectedMetric, setSelectedMetric] = useState('efficiency');
  const [viewType, setViewType] = useState('chart');
  const [loading, setLoading] = useState(false);

  // ==================== COMPUTED ANALYTICS ====================
  const analytics = useMemo(() => {
    if (!staffData || staffData.length === 0) return null;

    const totalStaff = staffData.length;
    const activeStaff = staffData.filter(s => s.status === 'active' || s.status === 'busy').length;
    const avgEfficiency = Math.round(staffData.reduce((sum, s) => sum + s.efficiency, 0) / totalStaff);
    const totalOrders = staffData.reduce((sum, s) => sum + s.orderCount, 0);
    const totalCapacity = staffData.reduce((sum, s) => sum + s.maxCapacity, 0);
    const currentLoad = staffData.reduce((sum, s) => sum + s.currentLoad, 0);

    // Performance distribution
    const performanceGroups = {
      excellent: staffData.filter(s => s.efficiency >= 95).length,
      good: staffData.filter(s => s.efficiency >= 85 && s.efficiency < 95).length,
      average: staffData.filter(s => s.efficiency >= 75 && s.efficiency < 85).length,
      poor: staffData.filter(s => s.efficiency < 75).length
    };

    // Area distribution
    const areaStats = {};
    staffData.forEach(staff => {
      if (!areaStats[staff.area]) {
        areaStats[staff.area] = { count: 0, totalEfficiency: 0, totalOrders: 0 };
      }
      areaStats[staff.area].count++;
      areaStats[staff.area].totalEfficiency += staff.efficiency;
      areaStats[staff.area].totalOrders += staff.orderCount;
    });

    Object.keys(areaStats).forEach(area => {
      areaStats[area].avgEfficiency = Math.round(areaStats[area].totalEfficiency / areaStats[area].count);
    });

    // Top performers
    const topPerformers = [...staffData]
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 5);

    // Skills analysis
    const skillsCount = {};
    staffData.forEach(staff => {
      staff.skills.forEach(skill => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
      });
    });

    return {
      overview: {
        totalStaff,
        activeStaff,
        avgEfficiency,
        totalOrders,
        utilizationRate: Math.round((currentLoad / totalCapacity) * 100),
        activeRate: Math.round((activeStaff / totalStaff) * 100)
      },
      performance: performanceGroups,
      areas: areaStats,
      topPerformers,
      skills: skillsCount,
      trends: {
        efficiency: { value: avgEfficiency, change: +2.3, trend: 'up' },
        productivity: { value: Math.round(totalOrders / totalStaff), change: +5.1, trend: 'up' },
        utilization: { value: Math.round((currentLoad / totalCapacity) * 100), change: -1.2, trend: 'down' }
      }
    };
  }, [staffData]);

  // ==================== COMPONENT FUNCTIONS ====================
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  };

  const handleExport = () => {
    // Export analytics data
    console.log('Exporting analytics data...');
  };

  // ==================== RENDER FUNCTIONS ====================
  const renderOverviewMetrics = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
        <div className="flex items-center justify-between mb-2">
          <Users size={20} className="text-blue-500" />
          <span className={`text-xs font-medium ${analytics.trends.efficiency.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {analytics.trends.efficiency.trend === 'up' ? '+' : ''}{analytics.trends.efficiency.change}%
          </span>
        </div>
        <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
          {analytics.overview.activeStaff}/{analytics.overview.totalStaff}
        </p>
        <p className={`text-sm ${themeClasses.text.muted}`}>Nhân viên hoạt động</p>
      </div>

      <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
        <div className="flex items-center justify-between mb-2">
          <Target size={20} className="text-green-500" />
          <span className={`text-xs font-medium ${analytics.trends.efficiency.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {analytics.trends.efficiency.trend === 'up' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {Math.abs(analytics.trends.efficiency.change)}%
          </span>
        </div>
        <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
          {analytics.overview.avgEfficiency}%
        </p>
        <p className={`text-sm ${themeClasses.text.muted}`}>Hiệu suất trung bình</p>
      </div>

      <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
        <div className="flex items-center justify-between mb-2">
          <Activity size={20} className="text-purple-500" />
          <span className={`text-xs font-medium ${analytics.trends.productivity.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {analytics.trends.productivity.trend === 'up' ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {Math.abs(analytics.trends.productivity.change)}%
          </span>
        </div>
        <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
          {analytics.trends.productivity.value}
        </p>
        <p className={`text-sm ${themeClasses.text.muted}`}>Đơn/nhân viên</p>
      </div>
    </div>
  );

  const renderPerformanceDistribution = () => (
    <div className="space-y-4">
      <h4 className={`font-semibold ${themeClasses.text.primary}`}>Phân bố hiệu suất</h4>
      <div className="space-y-3">
        {Object.entries(analytics.performance).map(([level, count]) => {
          const percentage = Math.round((count / analytics.overview.totalStaff) * 100);
          const colors = {
            excellent: 'bg-green-500',
            good: 'bg-blue-500',
            average: 'bg-yellow-500',
            poor: 'bg-red-500'
          };
          const labels = {
            excellent: 'Xuất sắc (≥95%)',
            good: 'Tốt (85-94%)',
            average: 'Trung bình (75-84%)',
            poor: 'Cần cải thiện (<75%)'
          };

          return (
            <div key={level} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
                    {labels[level]}
                  </span>
                  <span className={`text-sm ${themeClasses.text.muted}`}>
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${colors[level]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAreaAnalysis = () => (
    <div className="space-y-4">
      <h4 className={`font-semibold ${themeClasses.text.primary}`}>Phân tích theo khu vực</h4>
      <div className="grid gap-3">
        {Object.entries(analytics.areas).map(([area, stats]) => (
          <div key={area} className={`p-3 rounded-lg ${themeClasses.surfaceHover} border ${themeClasses.border}`}>
            <div className="flex justify-between items-center mb-2">
              <span className={`font-medium ${themeClasses.text.primary}`}>Khu vực {area}</span>
              <span className={`text-sm ${themeClasses.text.muted}`}>{stats.count} nhân viên</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className={themeClasses.text.muted}>Hiệu suất TB</p>
                <p className={`font-semibold ${themeClasses.text.primary}`}>{stats.avgEfficiency}%</p>
              </div>
              <div>
                <p className={themeClasses.text.muted}>Tổng đơn hàng</p>
                <p className={`font-semibold ${themeClasses.text.primary}`}>{stats.totalOrders}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTopPerformers = () => (
    <div className="space-y-4">
      <h4 className={`font-semibold ${themeClasses.text.primary}`}>Top nhân viên</h4>
      <div className="space-y-3">
        {analytics.topPerformers.map((staff, index) => (
          <div key={staff.id} className="flex items-center gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index === 0 ? 'bg-yellow-100 text-yellow-800' :
              index === 1 ? 'bg-gray-100 text-gray-800' :
              index === 2 ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {index < 3 ? <Star size={14} /> : index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${themeClasses.text.primary}`}>{staff.name}</p>
              <p className={`text-sm ${themeClasses.text.muted}`}>Khu vực {staff.area}</p>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${themeClasses.text.primary}`}>{staff.efficiency}%</p>
              <p className={`text-sm ${themeClasses.text.muted}`}>{staff.orderCount} đơn</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==================== MAIN RENDER ====================
  if (!analytics) {
    return (
      <div className={`p-6 rounded-xl ${themeClasses.surface} ${themeClasses.border} border`}>
        <div className="text-center py-8">
          <Users size={48} className={`mx-auto mb-4 ${themeClasses.text.muted}`} />
          <p className={`text-lg font-medium ${themeClasses.text.primary} mb-2`}>
            Không có dữ liệu
          </p>
          <p className={`${themeClasses.text.muted}`}>
            Chưa có dữ liệu nhân viên để phân tích
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl ${themeClasses.surface} ${themeClasses.border} border overflow-hidden`}>
      {/* Header */}
      <div className={`p-4 border-b ${themeClasses.border} ${themeClasses.surfaceHover}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
              Phân tích nhân sự
            </h3>
            <p className={`text-sm ${themeClasses.text.muted}`}>
              Báo cáo chi tiết hiệu suất và hoạt động
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              className={`px-3 py-1 rounded border ${themeClasses.input} ${themeClasses.border} text-sm`}
            >
              <option value="1d">24 giờ</option>
              <option value="7d">7 ngày</option>
              <option value="30d">30 ngày</option>
              <option value="90d">3 tháng</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`p-2 rounded ${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover} transition-colors`}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleExport}
              className={`p-2 rounded ${themeClasses.buttonSecondary} hover:${themeClasses.buttonSecondaryHover} transition-colors`}
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Overview Metrics */}
        {renderOverviewMetrics()}

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Distribution */}
          <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
            {renderPerformanceDistribution()}
          </div>

          {/* Top Performers */}
          <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
            {renderTopPerformers()}
          </div>
        </div>

        {/* Area Analysis */}
        <div className={`p-4 rounded-lg ${themeClasses.surfaceHover}`}>
          {renderAreaAnalysis()}
        </div>
      </div>
    </div>
  );
};

// ==================== PROP TYPES ====================
StaffAnalyticsWidget.propTypes = {
  staffData: PropTypes.array,
  themeClasses: PropTypes.object.isRequired,
  timeRange: PropTypes.string
};

// ==================== EXPORTS ====================
export default StaffAnalyticsWidget;
