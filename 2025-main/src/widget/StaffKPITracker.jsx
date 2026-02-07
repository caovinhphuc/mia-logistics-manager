// Advanced Staff KPI Performance Tracker
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  User,
  Clock,
  Target,
  CheckCircle,
  Star,
  Zap,
  Award
} from 'lucide-react';
import WidgetWrapper from './WidgetWrapper';

const StaffKPITracker = ({
  staffData = [],
  themeClasses = {},
  onKPIUpdate,
  toLocaleTimeString = () => { },
  // Default time range for the KPI tracker
  timeRange = '7d'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('productivity');
  const [kpiData, setKpiData] = useState({
    productivity: 0,
    efficiency: 0,
    qualityScore: 0,
    attendanceRate: 0,
    taskCompletion: 0,
    customerRating: 0
  });

  // Calculate KPIs based on staff data
  const calculateKPIs = useCallback(() => {
    if (!staffData || staffData.length === 0) {
      return {
        productivity: 0,
        efficiency: 0,
        qualityScore: 0,
        attendanceRate: 0,
        taskCompletion: 0,
        customerRating: 0
      };
    }

    // Safely access staff data properties with fallbacks
    const avgProductivity = staffData.reduce((sum, staff) => sum + (staff?.productivity || 0), 0) / staffData.length;
    const avgEfficiency = staffData.reduce((sum, staff) => sum + (staff?.efficiency || 0), 0) / staffData.length;
    const avgQuality = staffData.reduce((sum, staff) => sum + (staff?.qualityScore || 0), 0) / staffData.length;
    const avgAttendance = staffData.reduce((sum, staff) => sum + (staff?.attendanceRate || 0), 0) / staffData.length;
    const avgCompletion = staffData.reduce((sum, staff) => sum + (staff?.taskCompletion || 0), 0) / staffData.length;
    const avgRating = staffData.reduce((sum, staff) => sum + (staff?.customerRating || 0), 0) / staffData.length;

    return {
      productivity: Math.round(avgProductivity),
      efficiency: Math.round(avgEfficiency),
      qualityScore: Math.round(avgQuality),
      attendanceRate: Math.round(avgAttendance),
      taskCompletion: Math.round(avgCompletion),
      customerRating: Math.round(avgRating * 10) / 10
    };
  }, [staffData]);

  useEffect(() => {
    setIsLoading(true);
    const newKPIs = calculateKPIs();
    setKpiData(newKPIs);

    if (onKPIUpdate) {
      onKPIUpdate(newKPIs);
    }

    setIsLoading(false);
  }, [staffData, calculateKPIs, onKPIUpdate]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newKPIs = calculateKPIs();
      setKpiData(newKPIs);
      setIsLoading(false);
    }, 1000);
  };

  const kpiMetrics = [
    {
      id: 'productivity',
      label: 'Năng suất',
      value: kpiData.productivity,
      unit: '%',
      icon: <Zap className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'efficiency',
      label: 'Hiệu quả',
      value: kpiData.efficiency,
      unit: '%',
      icon: <Target className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'qualityScore',
      label: 'Chất lượng',
      value: kpiData.qualityScore,
      unit: '%',
      icon: <Star className="h-5 w-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'attendanceRate',
      label: 'Chuyên cần',
      value: kpiData.attendanceRate,
      unit: '%',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'taskCompletion',
      label: 'Hoàn thành',
      value: kpiData.taskCompletion,
      unit: '%',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'customerRating',
      label: 'Đánh giá KH',
      value: kpiData.customerRating,
      unit: '/5',
      icon: <Award className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Helper function to safely format time strings
  const formatTimeString = (dateTime) => {
    if (!dateTime) return '--:--';
    try {
      // Use the provided function if available, otherwise fallback to native method
      if (typeof toLocaleTimeString === 'function') {
        return toLocaleTimeString(dateTime);
      }
      // Only try to use toLocaleTimeString if dateTime is a valid date object
      if (dateTime instanceof Date && !isNaN(dateTime)) {
        return dateTime.toLocaleTimeString();
      }
      return '--:--';
    } catch (error) {
      console.error('Error formatting time:', error);
      return '--:--';
    }
  };

  return (
    <WidgetWrapper
      widgetId="staff-kpi-tracker"
      title="Theo Dõi KPI Nhân Viên"
      description="Theo dõi các chỉ số hiệu suất chính của nhân viên"
      themeClasses={themeClasses}
      isExpandable={true}
      isRefreshable={true}
      onRefresh={handleRefresh}
    >
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiMetrics.map((metric) => (
              <div
                key={metric.id}
                className={`p-4 rounded-lg border ${themeClasses.border || 'border-gray-200'} ${
                  selectedMetric === metric.id ? 'ring-2 ring-blue-500' : ''
                } cursor-pointer transition-all hover:shadow-md`}
                onClick={() => setSelectedMetric(metric.id)}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <div className={metric.color}>
                      {metric.icon}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-2xl font-bold ${themeClasses.text?.primary || 'text-gray-900'}`}>
                      {metric.value}{metric.unit}
                    </div>
                    <div className={`text-sm ${themeClasses.text?.muted || 'text-gray-500'}`}>
                      {metric.label}
                    </div>
                  </div>
                </div>

                {/* Simple progress bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${metric.color.replace('text-', 'bg-')}`}
                      style={{ width: `${Math.min(metric.value, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Staff Count Info */}
        <div className={`mt-4 p-3 rounded-lg border ${themeClasses.border || 'border-gray-200'} bg-gray-50`}>          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-600" />
            <span className={`text-sm ${themeClasses.text?.secondary || 'text-gray-600'}`}>
              Tổng số nhân viên: {staffData?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </WidgetWrapper>
  );
};

StaffKPITracker.propTypes = {
  staffData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      productivity: PropTypes.number,
      efficiency: PropTypes.number,
      qualityScore: PropTypes.number,
      attendanceRate: PropTypes.number,
      taskCompletion: PropTypes.number,
      customerRating: PropTypes.number
    })
  ),
  themeClasses: PropTypes.object,
  onKPIUpdate: PropTypes.func,
  timeRange: PropTypes.string,
  toLocaleTimeString: PropTypes.func
};

export default StaffKPITracker;
