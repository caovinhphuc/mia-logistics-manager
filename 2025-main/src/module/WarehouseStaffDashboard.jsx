import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users, Calendar, BarChart3, TrendingUp, Clock, Target, Star,
  ChevronDown, ChevronRight, Filter, Download, RefreshCw, Settings,
  User, UserCheck, AlertTriangle, CheckCircle, Plus, Edit, Eye,
  MapPin, Package, Activity, Zap, Coffee, Moon, Sun, Bell,
  PieChart, LineChart, BarChart, DollarSign, Award, Shield,
  Timer, Briefcase, TrendingDown, Search, MoreHorizontal,
  Calendar as CalendarIcon, Clock as ClockIcon, Users as UsersIcon,
  X
} from 'lucide-react';
import {
  PieChart as RechartsPieChart, Cell, ResponsiveContainer,
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart as RechartsLineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Area, AreaChart, ComposedChart
} from 'recharts';

// ==================== IMPORT TABS ====================

// ==================== CONFIGURATION & CONSTANTS ====================
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
  pink: '#EC4899',
  indigo: '#6366F1',
  emerald: '#059669',
  orange: '#EA580C'
};

const SYSTEM_CONFIG = {
  // Phân loại hiệu suất theo nguyên tắc 80/20
  PERFORMANCE_TIERS: {
    TOP_20: {
      label: 'Top 20% (Xuất sắc)',
      threshold: 80,
      color: COLORS.secondary,
      description: 'Nhóm nhân viên đóng góp 80% hiệu suất'
    },
    MIDDLE_60: {
      label: '60% Trung bình',
      threshold: 60,
      color: COLORS.primary,
      description: 'Nhóm nhân viên có thể cải thiện'
    },
    BOTTOM_20: {
      label: '20% Cần cải thiện',
      threshold: 0,
      color: COLORS.warning,
      description: 'Cần đào tạo và hỗ trợ thêm'
    }
  },

  // Vai trò trong kho
  ROLES: {
    PICKING: {
      id: 'picking',
      label: 'Lấy hàng',
      icon: Package,
      color: COLORS.primary,
      avgOrdersPerHour: 25,
      skillRequirements: ['speed', 'accuracy', 'navigation']
    },
    PACKING: {
      id: 'packing',
      label: 'Đóng gói',
      icon: Activity,
      color: COLORS.secondary,
      avgOrdersPerHour: 30,
      skillRequirements: ['precision', 'speed', 'quality']
    },
    QC: {
      id: 'qc',
      label: 'Kiểm tra chất lượng',
      icon: Shield,
      color: COLORS.purple,
      avgOrdersPerHour: 35,
      skillRequirements: ['attention', 'accuracy', 'standards']
    },
    LOGISTICS: {
      id: 'logistics',
      label: 'Logistics',
      icon: MapPin,
      color: COLORS.cyan,
      avgOrdersPerHour: 20,
      skillRequirements: ['planning', 'coordination', 'management']
    }
  },

  // Ca làm việc
  SHIFTS: {
    MORNING: {
      id: 'morning',
      label: 'Ca sáng',
      time: '06:00-14:00',
      color: COLORS.warning,
      peakHours: ['09:00', '10:00', '11:00'],
      workloadMultiplier: 1.2
    },
    AFTERNOON: {
      id: 'afternoon',
      label: 'Ca chiều',
      time: '14:00-22:00',
      color: COLORS.primary,
      peakHours: ['15:00', '16:00', '17:00'],
      workloadMultiplier: 1.0
    },
    NIGHT: {
      id: 'night',
      label: 'Ca đêm',
      time: '22:00-06:00',
      color: COLORS.purple,
      peakHours: ['23:00', '00:00', '01:00'],
      workloadMultiplier: 0.8
    }
  },

  // Loại nhân viên
  EMPLOYEE_TYPES: {
    FULLTIME: { id: 'fulltime', label: 'Chính thức', color: COLORS.secondary, maxHours: 8 },
    CONTRACT: { id: 'contract', label: 'Cộng tác viên', color: COLORS.orange, maxHours: 6 }
  },

  // Cấu hình Pareto
  PARETO_CONFIG: {
    defaultRatio: 80,
    topPerformerPercentage: 20,
    priorityWorkloadPercentage: 80,
    autoSchedulingEnabled: true,
    performanceThreshold: 75
  }
};

// ==================== MAIN DASHBOARD COMPONENT ====================
const WarehouseStaffDashboard = () => {
  // UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isRealTimeMode, setIsRealTimeMode] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Data States
  const [staff, setStaff] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [workloadData, setWorkloadData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState(SYSTEM_CONFIG.PARETO_CONFIG);

  // UI States for dialogs
  const [showForecastDialog, setShowForecastDialog] = useState(false);
  const [showAutoScheduleDialog, setShowAutoScheduleDialog] = useState(false);  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Helper functions for data generation - defined before they're used  // Function declarations with useCallback hooks
  const generateHourlyDistribution = useCallback((totalOrders) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const distribution = hours.map(hour => {
      let factor = 0.02; // Base factor

      // Peak hours: 9-11AM, 2-4PM, 7-9PM
      if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16) || (hour >= 19 && hour <= 21)) {
        factor = 0.08;
      } else if (hour >= 8 && hour <= 17) {
        factor = 0.05;
      } else if (hour >= 18 && hour <= 22) {
        factor = 0.04;
      }

      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        orders: Math.floor(totalOrders * factor + Math.random() * 5),
        efficiency: 70 + Math.floor(Math.random() * 25)
      };
    });

    return distribution;
  }, []);

  const calculateExpectedEfficiency = useCallback((assignedStaff) => {
    if (assignedStaff.length === 0) return 0;
    const avgEfficiency = assignedStaff.reduce((sum, s) => sum + s.efficiency, 0) / assignedStaff.length;
    return Math.min(Math.round(avgEfficiency * 0.85), 95); // 15% reduction for external factors
  }, []);

  const generateWeeklySchedule = useCallback((staffList, workloadList) => {
    const activeStaff = staffList.filter(s => s.status === 'active');

    const weekSchedule = workloadList.slice(0, 7).map((dayData, dayIndex) => {
      const dayStaff = {
        morning: [],
        afternoon: [],
        night: []
      };

      // Apply 80/20 principle: top 20% performers handle 80% of priority work
      const topPerformers = activeStaff
        .sort((a, b) => b.efficiency - a.efficiency)
        .slice(0, Math.ceil(activeStaff.length * 0.2));

      const regularStaff = activeStaff.filter(s => !topPerformers.includes(s));

      // Prioritize top performers for special event days and morning shifts
      const priorityShifts = dayData.specialEvent ? ['morning', 'afternoon'] : ['morning'];

      priorityShifts.forEach(shift => {
        const requiredCount = Math.ceil(Object.values(dayData.requiredStaff).reduce((a, b) => a + b, 0) * 0.6);
        const availableTopPerformers = topPerformers.filter(s => s.shift === shift || s.shift === 'flexible');
        dayStaff[shift] = availableTopPerformers.slice(0, Math.min(requiredCount, availableTopPerformers.length));
      });

      // Allocate remaining staff
      const remainingSlots = {
        morning: Math.max(0, 8 - dayStaff.morning.length),
        afternoon: Math.max(0, 6 - dayStaff.afternoon.length),
        night: Math.max(0, 3 - dayStaff.night.length)
      };

      Object.keys(remainingSlots).forEach(shift => {
        const assignedStaff = Object.values(dayStaff).flat();
        const available = regularStaff.filter(s =>
          !assignedStaff.includes(s) &&
          (s.shift === shift || s.shift === 'flexible')
        );
        dayStaff[shift].push(...available.slice(0, remainingSlots[shift]));
      });

      return {
        date: dayData.date,
        dayName: dayData.dayName,
        fullDayName: dayData.fullDayName,
        specialEvent: dayData.specialEvent,
        shifts: dayStaff,
        totalStaff: Object.values(dayStaff).flat().length,
        expectedEfficiency: calculateExpectedEfficiency(Object.values(dayStaff).flat()),
        workloadPriority: dayData.priority,
        estimatedOrders: dayData.orders,
        requiredStaff: dayData.requiredStaff
      };
    });

    setSchedule(weekSchedule);
  }, [calculateExpectedEfficiency]);

  const updateRealTimeData = useCallback(() => {
    setStaff(prevStaff =>
      prevStaff.map(s => ({
        ...s,
        ordersCompleted: s.ordersCompleted + Math.floor(Math.random() * 3),
        efficiency: Math.max(50, Math.min(100, s.efficiency + (Math.random() - 0.5) * 5)),
        currentWorkload: Math.max(0, Math.min(s.maxWorkload, s.currentWorkload + Math.floor(Math.random() * 3) - 1))
      }))
    );
  }, []);

  const generateComprehensiveMockData = useCallback(() => {
    // Generate staff with realistic data
    const mockStaff = Array.from({ length: 25 }, (_, i) => {
      const roles = Object.keys(SYSTEM_CONFIG.ROLES);
      const shifts = Object.keys(SYSTEM_CONFIG.SHIFTS);
      const types = Object.keys(SYSTEM_CONFIG.EMPLOYEE_TYPES);

      const role = roles[Math.floor(Math.random() * roles.length)];
      const type = Math.random() > 0.7 ? 'contract' : 'fulltime';
      const baseEfficiency = type === 'fulltime' ? 70 : 60;
      const efficiency = baseEfficiency + Math.floor(Math.random() * 30);

      return {
        id: `NV${String(i + 1).padStart(3, '0')}`,
        name: `${['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng'][Math.floor(Math.random() * 5)]} ${['Văn', 'Thị', 'Minh'][Math.floor(Math.random() * 3)]} ${String.fromCharCode(65 + i)}`,
        type,
        role,
        shift: shifts[Math.floor(Math.random() * shifts.length)],
        efficiency,
        ordersCompleted: Math.floor(Math.random() * 50) + 20,
        ordersCompletedWeek: Math.floor(Math.random() * 300) + 150,
        ordersCompletedMonth: Math.floor(Math.random() * 1200) + 600,
        accuracy: 0.85 + Math.random() * 0.15,
        experience: Math.floor(Math.random() * 36) + 1, // months
        status: Math.random() > 0.1 ? 'active' : 'inactive',
        avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
        joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        skills: {
          picking: Math.floor(Math.random() * 30) + 70,
          packing: Math.floor(Math.random() * 30) + 70,
          quality: Math.floor(Math.random() * 30) + 70,
          logistics: Math.floor(Math.random() * 30) + 60,
          teamwork: Math.floor(Math.random() * 30) + 70,
          communication: Math.floor(Math.random() * 30) + 65
        },
        performance: {
          thisWeek: Math.floor(Math.random() * 30) + 70,
          lastWeek: Math.floor(Math.random() * 30) + 70,
          thisMonth: Math.floor(Math.random() * 30) + 70,
          lastMonth: Math.floor(Math.random() * 30) + 70
        },
        kpi: {
          ordersPerHour: Math.floor(Math.random() * 15) + 15,
          avgTimePerOrder: Math.floor(Math.random() * 10) + 10, // minutes
          slaSuccessRate: Math.floor(Math.random() * 20) + 80, // %
          errorRate: Math.floor(Math.random() * 5) + 1, // %
          absenteeismRate: Math.floor(Math.random() * 3) + 1 // %
        },
        currentWorkload: Math.floor(Math.random() * 8),
        maxWorkload: type === 'fulltime' ? 10 : 8,
        salary: type === 'fulltime' ? Math.floor(Math.random() * 5000000) + 8000000 : Math.floor(Math.random() * 200000) + 150000, // VND
        overtimeHours: Math.floor(Math.random() * 20),
        trainingHours: Math.floor(Math.random() * 40) + 10,
        certifications: Math.random() > 0.6 ? ['Forklift', 'Safety'] : ['Safety']
      };
    });

    // Generate workload forecast for next 14 days
    const mockWorkload = Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isSpecialDay = Math.random() < 0.15; // 15% chance

      let baseOrders = isWeekend ? 80 : 150;
      if (isSpecialDay) baseOrders *= 1.8; // Special events (container, sale days)

      baseOrders += Math.floor(Math.random() * 40) - 20; // Random variation

      const specialEvents = isSpecialDay ?
        (Math.random() > 0.5 ? 'container' : 'double-day') : null;

      return {
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
        fullDayName: date.toLocaleDateString('vi-VN', { weekday: 'long' }),
        orders: Math.max(50, baseOrders),
        specialEvent: specialEvents,
        requiredStaff: {
          picking: Math.ceil(baseOrders * 0.4 / 25),
          packing: Math.ceil(baseOrders * 0.3 / 30),
          qc: Math.ceil(baseOrders * 0.2 / 35),
          logistics: Math.ceil(baseOrders * 0.1 / 20)
        },
        efficiency: 75 + Math.floor(Math.random() * 20),
        priority: isSpecialDay ? 'high' : isWeekend ? 'low' : 'normal',
        hourlyDistribution: generateHourlyDistribution(baseOrders)
      };
    });

    // Generate notifications
    const mockNotifications = [
      {
        id: 1,
        type: 'warning',
        title: 'Thiếu nhân sự ca sáng',
        message: 'Ngày mai cần thêm 3 nhân viên cho ca sáng do có container về',
        time: new Date(Date.now() - 15 * 60 * 1000),
        priority: 'high'
      },
      {
        id: 2,
        type: 'success',
        title: 'Hoàn thành KPI tháng',
        message: 'Team đã đạt 95% SLA, vượt mục tiêu 90%',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: 'normal'
      },
      {
        id: 3,
        type: 'info',
        title: 'Cập nhật lịch training',
        message: '5 nhân viên mới sẽ tham gia khóa đào tạo picking tuần tới',
        time: new Date(Date.now() - 4 * 60 * 60 * 1000),
        priority: 'normal'
      }
    ];

    setStaff(mockStaff);
    setWorkloadData(mockWorkload);
    setNotifications(mockNotifications);
    // Generate weekly schedule
    generateWeeklySchedule(mockStaff, mockWorkload);
  }, [generateWeeklySchedule, generateHourlyDistribution]);

  // Add the useEffect after we've defined all the needed functions
  useEffect(() => {
    generateComprehensiveMockData();

    // Auto refresh if real-time mode is enabled
    const interval = setInterval(() => {
      if (isRealTimeMode) {
        setLastUpdated(new Date());
        updateRealTimeData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isRealTimeMode, generateComprehensiveMockData, updateRealTimeData]);

  // Computed analytics with advanced Pareto analysis
  const analytics = useMemo(() => {
    const activeStaff = staff.filter(s => s.status === 'active');
    const totalStaff = activeStaff.length;

    if (totalStaff === 0) return {
      totalStaff: 0,
      top20Staff: [],
      bottom80Staff: [],
      top20Efficiency: 0,
      bottom80Efficiency: 0,
      avgEfficiency: 0,
      roleDistribution: [],
      shiftDistribution: [],
      contractRatio: 0,
      paretoAnalysis: {},
      kpiSummary: {},
      trends: {}
    };

    // Pareto Analysis: Sort by efficiency and divide into performance tiers
    const sortedByPerformance = [...activeStaff].sort((a, b) => b.efficiency - a.efficiency);
    const top20Count = Math.ceil(totalStaff * 0.2);
    const top20Staff = sortedByPerformance.slice(0, top20Count);
    const bottom80Staff = sortedByPerformance.slice(top20Count);

    const top20Efficiency = top20Staff.reduce((sum, s) => sum + s.efficiency, 0) / top20Count || 0;
    const bottom80Efficiency = bottom80Staff.reduce((sum, s) => sum + s.efficiency, 0) / bottom80Staff.length || 0;

    // Advanced Pareto Analysis
    const paretoAnalysis = {
      top20Contribution: top20Staff.reduce((sum, s) => sum + s.ordersCompleted, 0),
      bottom80Contribution: bottom80Staff.reduce((sum, s) => sum + s.ordersCompleted, 0),
      efficiencyGap: top20Efficiency - bottom80Efficiency,
      potentialImprovement: (top20Efficiency - bottom80Efficiency) * bottom80Staff.length,
      recommendedActions: generateParetoRecommendations(top20Efficiency, bottom80Efficiency, totalStaff)
    };

    // Role and Shift Distribution
    const roleDistribution = Object.keys(SYSTEM_CONFIG.ROLES).map(roleKey => {
      const roleStaff = activeStaff.filter(s => s.role === roleKey);
      return {
        role: roleKey,
        label: SYSTEM_CONFIG.ROLES[roleKey].label,
        count: roleStaff.length,
        efficiency: roleStaff.reduce((sum, s) => sum + s.efficiency, 0) / (roleStaff.length || 1),
        avgOrdersPerHour: roleStaff.reduce((sum, s) => sum + s.kpi.ordersPerHour, 0) / (roleStaff.length || 1),
        color: SYSTEM_CONFIG.ROLES[roleKey].color
      };
    });

    const shiftDistribution = Object.keys(SYSTEM_CONFIG.SHIFTS).map(shiftKey => {
      const shiftStaff = activeStaff.filter(s => s.shift === shiftKey);
      return {
        shift: shiftKey,
        label: SYSTEM_CONFIG.SHIFTS[shiftKey].label,
        count: shiftStaff.length,
        efficiency: shiftStaff.reduce((sum, s) => sum + s.efficiency, 0) / (shiftStaff.length || 1),
        color: SYSTEM_CONFIG.SHIFTS[shiftKey].color
      };
    });

    // KPI Summary
    const kpiSummary = {
      avgOrdersPerHour: activeStaff.reduce((sum, s) => sum + s.kpi.ordersPerHour, 0) / totalStaff,
      avgTimePerOrder: activeStaff.reduce((sum, s) => sum + s.kpi.avgTimePerOrder, 0) / totalStaff,
      avgSLASuccessRate: activeStaff.reduce((sum, s) => sum + s.kpi.slaSuccessRate, 0) / totalStaff,      avgErrorRate: activeStaff.reduce((sum, s) => sum + s.kpi.errorRate, 0) / totalStaff,
      totalOvertimeHours: activeStaff.reduce((sum, s) => sum + s.overtimeHours, 0),
      avgTrainingHours: activeStaff.reduce((sum, s) => sum + s.trainingHours, 0) / totalStaff
    };

    // Trends Analysis (comparing current vs previous periods)
    const trends = {
      efficiencyTrend: calculateTrend(activeStaff, 'efficiency'),
      productivityTrend: calculateTrend(activeStaff, 'ordersCompleted'),
      qualityTrend: calculateTrend(activeStaff, 'accuracy'),
      staffCountTrend: { current: totalStaff, change: '+2', percentage: '+8.7%', direction: 'up', isPositive: true }
    };

    return {
      totalStaff,
      top20Staff,
      bottom80Staff,
      top20Efficiency: Math.round(top20Efficiency),
      bottom80Efficiency: Math.round(bottom80Efficiency),
      avgEfficiency: Math.round(activeStaff.reduce((sum, s) => sum + s.efficiency, 0) / totalStaff),
      roleDistribution,
      shiftDistribution,
      contractRatio: Math.round((activeStaff.filter(s => s.type === 'contract').length / totalStaff) * 100),
      paretoAnalysis,
      kpiSummary,
      trends
    };
  }, [staff]);

  const generateParetoRecommendations = (top20Eff, bottom80Eff, totalStaff) => {
    const gap = top20Eff - bottom80Eff;
    const recommendations = [];

    if (gap > 30) {
      recommendations.push('Tăng cường đào tạo cho 80% nhân viên còn lại');
      recommendations.push('Ghép đôi top performer với nhân viên cần cải thiện');
    }
    if (gap > 20) {
      recommendations.push('Xem xét điều chỉnh quy trình làm việc');
      recommendations.push('Tăng động lực thông qua incentive program');
    }
    if (totalStaff > 30) {
      recommendations.push('Chia nhỏ team để quản lý hiệu quả hơn');
    }

    return recommendations;
  };

  const calculateTrend = (staff, metric) => {
    // Mock trend calculation - in real app, this would compare with historical data
    const change = Math.floor(Math.random() * 10) - 5; // -5 to +5
    const isPositive = change >= 0;
    return {
      change: `${isPositive ? '+' : ''}${change}%`,
      direction: isPositive ? 'up' : 'down',
      isPositive
    };
  };

  // Theme configuration
  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    accent: isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
  };

  // Navigation tabs
  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: BarChart3, description: 'Phân tích 80/20 và KPI tổng thể' },
    { id: 'schedule', label: 'Lịch làm việc', icon: Calendar, description: 'Phân ca tự động và dự báo nhân sự' },
    { id: 'performance', label: 'Hiệu suất', icon: TrendingUp, description: 'Đánh giá và xếp hạng nhân viên' },
    { id: 'staff', label: 'Nhân sự', icon: Users, description: 'Quản lý thông tin chi tiết nhân viên' },
    { id: 'settings', label: 'Cài đặt', icon: Settings, description: 'Cấu hình hệ thống và nguyên tắc' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      {/* ==================== HEADER ==================== */}
      <header className={`${theme.card} border-b ${theme.border} sticky top-0 z-50 backdrop-blur-sm bg-opacity-95`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Dashboard Quản lý Nhân sự Kho Vận</h1>
                  <p className={`text-sm ${theme.textMuted} flex items-center space-x-4`}>
                    <span>📊 Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}</span>
                    <span>👥 {analytics.totalStaff} nhân viên hoạt động</span>
                    <span>⚡ Hiệu suất TB: {analytics.avgEfficiency}%</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsRealTimeMode(!isRealTimeMode)}
                className={`px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-all ${
                  isRealTimeMode
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : `${theme.card} ${theme.border} border ${theme.hover}`
                }`}
              >
                <Activity size={16} />
                <span>{isRealTimeMode ? 'Real-time ON' : 'Real-time OFF'}</span>
              </button>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${theme.card} ${theme.border} border ${theme.hover} transition-colors`}
                title="Chuyển đổi chế độ tối/sáng"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <button className={`p-2 rounded-lg ${theme.card} ${theme.border} border ${theme.hover} relative transition-colors`}>
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                    {notifications.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => generateComprehensiveMockData()}
                className={`p-2 rounded-lg ${theme.card} ${theme.border} border ${theme.hover} transition-colors`}
                title="Làm mới dữ liệu"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 mt-4 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-lg text-sm flex items-center space-x-2 whitespace-nowrap transition-all group ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : `${theme.textSecondary} ${theme.hover}`
                }`}
                title={tab.description}
              >
                <tab.icon size={16} />
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="w-2 h-2 bg-white rounded-full opacity-75"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <OverviewTab
            analytics={analytics}
            workloadData={workloadData}
            staff={staff}
            notifications={notifications}
            theme={theme}
          />
        )}
        {activeTab === 'schedule' && (
          <ScheduleTab
            schedule={schedule}
            staff={staff}
            analytics={analytics}
            workloadData={workloadData}
            showForecastDialog={showForecastDialog}
            setShowForecastDialog={setShowForecastDialog}
            showAutoScheduleDialog={showAutoScheduleDialog}
            setShowAutoScheduleDialog={setShowAutoScheduleDialog}
            theme={theme}
          />
        )}
        {activeTab === 'performance' && (
          <PerformanceTab
            staff={staff}
            analytics={analytics}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            theme={theme}
          />
        )}
        {activeTab === 'staff' && (
          <StaffTab
            staff={staff}
            analytics={analytics}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            theme={theme}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            setSettings={setSettings}
            analytics={analytics}
            theme={theme}
          />
        )}
      </main>
    </div>
  );
};

// ==================== OVERVIEW TAB ====================
const OverviewTab = ({ analytics, workloadData, staff, notifications, theme }) => (
  <div className="space-y-6">
    {/* Page Header */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-3xl font-bold mb-2">Tổng quan hiệu suất nhân sự</h2>
        <p className={`${theme.textMuted} text-lg`}>
          Phân tích theo nguyên tắc 80/20 • Cập nhật realtime • {new Date().toLocaleDateString('vi-VN')}
        </p>
      </div>
      <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
          <Download size={16} />
          <span>Xuất báo cáo</span>
        </button>
        <button className={`px-4 py-2 ${theme.card} ${theme.border} border rounded-lg ${theme.hover} flex items-center space-x-2 transition-colors`}>
          <Filter size={16} />
          <span>Bộ lọc</span>
        </button>
      </div>
    </div>

    {/* KPI Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Tổng nhân viên"
        value={analytics.totalStaff}
        subtitle="nhân viên đang hoạt động"
        change={analytics.trends.staffCountTrend.change}
        trend="up"
        icon={Users}
        color="from-blue-500 to-cyan-500"
        theme={theme}
      />
      <KPICard
        title="Hiệu suất trung bình"
        value={`${analytics.avgEfficiency}%`}
        subtitle="toàn bộ nhân viên"
        change={analytics.trends.efficiencyTrend.change}
        trend={analytics.trends.efficiencyTrend.direction}
        icon={TrendingUp}
        color="from-green-500 to-emerald-500"
        theme={theme}
      />
      <KPICard
        title="Top 20% nhân viên"
        value={`${analytics.top20Efficiency}%`}
        subtitle={`${analytics.top20Staff.length} nhân viên xuất sắc`}
        change="+2.1% từ tuần trước"
        trend="up"
        icon={Star}
        color="from-purple-500 to-violet-500"
        theme={theme}
      />
      <KPICard
        title="Tỷ lệ CTV"
        value={`${analytics.contractRatio}%`}
        subtitle="nhân viên cộng tác"
        change="Ổn định"
        trend="stable"
        icon={UserCheck}
        color="from-orange-500 to-red-500"
        theme={theme}
      />
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pareto Analysis Chart */}
      <div className={`lg:col-span-2 ${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Phân tích nguyên tắc 80/20</h3>
          <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            Xem chi tiết →
          </button>
        </div>
        <ParetoAnalysisChart analytics={analytics} theme={theme} />
      </div>

      {/* Quick Insights */}
      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-xl font-semibold mb-6">Insights nhanh</h3>
        <QuickInsights analytics={analytics} theme={theme} />
      </div>
    </div>

    {/* Performance Overview Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Role Distribution */}
      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Phân bố theo vai trò</h3>
        <RoleDistributionChart data={analytics.roleDistribution} theme={theme} />
      </div>

      {/* Shift Distribution */}
      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Phân bố theo ca làm việc</h3>
        <ShiftDistributionChart data={analytics.shiftDistribution} theme={theme} />
      </div>
    </div>

    {/* Workload Forecast */}
    <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Dự báo khối lượng công việc</h3>
        <div className="flex items-center space-x-2">
          <select className={`px-3 py-1 rounded text-sm ${theme.input}`}>
            <option>7 ngày tới</option>
            <option>14 ngày tới</option>
            <option>1 tháng tới</option>
          </select>
        </div>
      </div>
      <WorkloadForecastChart workloadData={workloadData.slice(0, 7)} theme={theme} />
    </div>

    {/* Notifications & Alerts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Thông báo quan trọng</h3>
        <NotificationsList notifications={notifications} theme={theme} />
      </div>

      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Đề xuất hành động</h3>
        <ActionRecommendations analytics={analytics} theme={theme} />
      </div>
    </div>
  </div>
);

// ==================== SCHEDULE TAB ====================
const ScheduleTab = ({
  schedule, staff, analytics, workloadData,
  showForecastDialog, setShowForecastDialog,
  showAutoScheduleDialog, setShowAutoScheduleDialog,
  theme
}) => (
  <div className="space-y-6">
    {/* Page Header */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-3xl font-bold mb-2">Lịch làm việc & Phân ca</h2>
        <p className={`${theme.textMuted} text-lg`}>
          Phân ca tự động theo nguyên tắc 80/20 • Dự báo nhân sự thông minh
        </p>
      </div>
      <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
        <button
          onClick={() => setShowForecastDialog(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Plus size={16} />
          <span>Tạo dự báo</span>
        </button>
        <button
          onClick={() => setShowAutoScheduleDialog(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
        >
          <Zap size={16} />
          <span>Phân ca tự động</span>
        </button>
        <button className={`px-4 py-2 ${theme.card} ${theme.border} border rounded-lg ${theme.hover} flex items-center space-x-2 transition-colors`}>
          <Download size={16} />
          <span>Xuất lịch</span>
        </button>
      </div>
    </div>

    {/* Weekly Schedule Overview */}
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
      {schedule.map((day, index) => (
        <ScheduleDayCard key={index} day={day} theme={theme} />
      ))}
    </div>

    {/* Schedule Analytics */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Phân tích phân ca</h3>
        <ScheduleAnalytics schedule={schedule} analytics={analytics} theme={theme} />
      </div>

      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Dự báo nhân sự cần thiết</h3>
        <StaffForecast workloadData={workloadData} theme={theme} />
      </div>
    </div>

    {/* Auto Scheduling Rules */}
    <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
      <h3 className="text-lg font-semibold mb-4">Nguyên tắc phân ca tự động (80/20)</h3>
      <AutoSchedulingRules analytics={analytics} schedule={schedule} theme={theme} />
    </div>

    {/* Dialogs */}
    {showForecastDialog && (
      <ForecastDialog
        onClose={() => setShowForecastDialog(false)}
        workloadData={workloadData}
        theme={theme}
      />
    )}

    {showAutoScheduleDialog && (
      <AutoScheduleDialog
        onClose={() => setShowAutoScheduleDialog(false)}
        analytics={analytics}
        theme={theme}
      />
    )}
  </div>
);

// ==================== PERFORMANCE TAB ====================
const PerformanceTab = ({ staff, analytics, selectedEmployee, setSelectedEmployee, theme }) => (
  <div className="space-y-6">
    {/* Page Header */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-3xl font-bold mb-2">Phân tích hiệu suất nhân viên</h2>
        <p className={`${theme.textMuted} text-lg`}>
          Đánh giá chi tiết • Xếp hạng • KPI tracking • Skill assessment
        </p>
      </div>
      <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
          <Download size={16} />
          <span>Xuất báo cáo</span>
        </button>
        <button className={`px-4 py-2 ${theme.card} ${theme.border} border rounded-lg ${theme.hover} flex items-center space-x-2 transition-colors`}>
          <Target size={16} />
          <span>Đặt mục tiêu</span>
        </button>
      </div>
    </div>

    {/* Performance Overview Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <PerformanceKPICard
        title="Đơn/giờ trung bình"
        value={Math.round(analytics.kpiSummary.avgOrdersPerHour)}
        unit="đơn/giờ"
        target={30}
        icon={Package}
        color="bg-blue-500"
        theme={theme}
      />
      <PerformanceKPICard
        title="Thời gian TB/đơn"
        value={Math.round(analytics.kpiSummary.avgTimePerOrder)}
        unit="phút"
        target={15}
        icon={Clock}
        color="bg-green-500"
        theme={theme}
      />
      <PerformanceKPICard
        title="Tỷ lệ đạt SLA"
        value={Math.round(analytics.kpiSummary.avgSLASuccessRate)}
        unit="%"
        target={95}
        icon={Target}
        color="bg-purple-500"
        theme={theme}
      />
      <PerformanceKPICard
        title="Tỷ lệ lỗi"
        value={Math.round(analytics.kpiSummary.avgErrorRate * 10) / 10}
        unit="%"
        target={2}
        icon={AlertTriangle}
        color="bg-red-500"
        theme={theme}
        inverted={true}
      />
    </div>

    {/* Performance Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Radar Chart - Kỹ năng tổng thể</h3>
        <SkillsRadarChart staff={staff} theme={theme} />
      </div>

      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Xu hướng hiệu suất</h3>
        <PerformanceTrendChart staff={staff} theme={theme} />
      </div>
    </div>

    {/* Top Performers Table */}
    <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Bảng xếp hạng nhân viên (Top 20%)</h3>
        <div className="flex items-center space-x-2">
          <select className={`px-3 py-1 rounded text-sm ${theme.input}`}>
            <option>Tuần này</option>
            <option>Tháng này</option>
            <option>Quý này</option>
          </select>
        </div>
      </div>
      <TopPerformersTable
        staff={analytics.top20Staff}
        onSelectEmployee={setSelectedEmployee}
        theme={theme}
      />
    </div>

    {/* Performance Insights */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Phân tích hiệu suất</h3>
        <PerformanceInsights analytics={analytics} theme={theme} />
      </div>

      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Đề xuất cải thiện</h3>
        <ImprovementSuggestions analytics={analytics} theme={theme} />
      </div>
    </div>
  </div>
);

// ==================== STAFF TAB ====================
const StaffTab = ({ staff, analytics, selectedEmployee, setSelectedEmployee, theme }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('efficiency');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = useMemo(() => {
    let filtered = staff.filter(s => {
      // Filter by status
      if (filter === 'active') return s.status === 'active';
      if (filter === 'inactive') return s.status === 'inactive';
      if (filter === 'top20') return analytics.top20Staff.includes(s);
      if (filter === 'contract') return s.type === 'contract';
      if (filter === 'fulltime') return s.type === 'fulltime';
      if (Object.keys(SYSTEM_CONFIG.ROLES).includes(filter)) return s.role === filter;
      if (Object.keys(SYSTEM_CONFIG.SHIFTS).includes(filter)) return s.shift === filter;
      return true;
    });

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'efficiency':
          return b.efficiency - a.efficiency;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return b.experience - a.experience;
        case 'ordersCompleted':
          return b.ordersCompleted - a.ordersCompleted;
        default:
          return 0;
      }
    });

    return filtered;
  }, [staff, filter, sortBy, searchTerm, analytics.top20Staff]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Quản lý nhân sự</h2>
          <p className={`${theme.textMuted} text-lg`}>
            {filteredStaff.length} nhân viên • Quản lý thông tin chi tiết • Skill tracking
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
            <Plus size={16} />
            <span>Thêm nhân viên</span>
          </button>
          <button className={`px-4 py-2 ${theme.card} ${theme.border} border rounded-lg ${theme.hover} flex items-center space-x-2 transition-colors`}>
            <Download size={16} />
            <span>Xuất danh sách</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${theme.input} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          />
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`px-3 py-2 rounded-lg ${theme.input} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="efficiency">Sắp xếp theo hiệu suất</option>
          <option value="name">Sắp xếp theo tên</option>
          <option value="experience">Sắp xếp theo kinh nghiệm</option>
          <option value="ordersCompleted">Sắp xếp theo đơn hoàn thành</option>
        </select>
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'Tất cả', count: staff.length },
          { id: 'active', label: 'Đang hoạt động', count: staff.filter(s => s.status === 'active').length },
          { id: 'top20', label: 'Top 20%', count: analytics.top20Staff.length },
          { id: 'contract', label: 'CTV', count: staff.filter(s => s.type === 'contract').length },
          { id: 'fulltime', label: 'Chính thức', count: staff.filter(s => s.type === 'fulltime').length },
          ...Object.entries(SYSTEM_CONFIG.ROLES).map(([id, role]) => ({
            id,
            label: role.label,
            count: staff.filter(s => s.role === id).length
          })),
          ...Object.entries(SYSTEM_CONFIG.SHIFTS).map(([id, shift]) => ({
            id,
            label: shift.label,
            count: staff.filter(s => s.shift === id).length
          }))
        ].map(filterOption => (
          <button
            key={filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-1 transition-all ${
              filter === filterOption.id
                ? 'bg-blue-600 text-white shadow-md'
                : `${theme.card} ${theme.border} border ${theme.textSecondary} ${theme.hover}`
            }`}
          >
            <span>{filterOption.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              filter === filterOption.id ? 'bg-blue-500' : theme.accent
            }`}>
              {filterOption.count}
            </span>
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStaff.map(member => (
          <StaffMemberCard
            key={member.id}
            staff={member}
            analytics={analytics}
            onSelect={() => setSelectedEmployee(member)}
            isSelected={selectedEmployee?.id === member.id}
            theme={theme}
          />
        ))}
      </div>

      {/* Staff Statistics Summary */}
      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Thống kê nhân sự</h3>
        <StaffStatistics staff={filteredStaff} analytics={analytics} theme={theme} />
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          analytics={analytics}
          theme={theme}
        />
      )}
    </div>
  );
};

// ==================== SETTINGS TAB ====================
const SettingsTab = ({ settings, setSettings, analytics, theme }) => (
  <div className="space-y-6">
    {/* Page Header */}
    <div>
      <h2 className="text-3xl font-bold mb-2">Cài đặt hệ thống</h2>
      <p className={`${theme.textMuted} text-lg`}>
        Cấu hình nguyên tắc 80/20 • Tự động hóa • Thông số hiệu suất
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pareto Configuration */}
      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Cấu hình nguyên tắc 80/20</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Tỷ lệ Pareto (%)</label>
            <input
              type="range"
              min="70"
              max="90"
              value={settings.paretoRatio}
              onChange={(e) => setSettings({...settings, paretoRatio: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>70%</span>
              <span className="font-medium">{settings.paretoRatio}% công việc quan trọng</span>
              <span>90%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tỷ lệ top performer (%)</label>
            <input
              type="range"
              min="15"
              max="25"
              value={settings.topPerformerPercentage}
              onChange={(e) => setSettings({...settings, topPerformerPercentage: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-sm text-gray-500 mt-1">
              {settings.topPerformerPercentage}% nhân viên xuất sắc nhất
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ngưỡng hiệu suất (%)</label>
            <input
              type="range"
              min="60"
              max="90"
              value={settings.performanceThreshold}
              onChange={(e) => setSettings({...settings, performanceThreshold: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-sm text-gray-500 mt-1">
              Tối thiểu {settings.performanceThreshold}% để được xếp vào top performer
            </div>
          </div>
        </div>
      </div>

      {/* Automation Settings */}
      <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
        <h3 className="text-lg font-semibold mb-4">Cài đặt tự động hóa</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.autoSchedulingEnabled}
              onChange={(e) => setSettings({...settings, autoSchedulingEnabled: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <span className="font-medium">Phân ca tự động theo hiệu suất</span>
              <p className="text-sm text-gray-500">Tự động phân bổ nhân viên xuất sắc vào ca quan trọng</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.realTimeTracking}
              onChange={(e) => setSettings({...settings, realTimeTracking: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <span className="font-medium">Theo dõi hiệu suất realtime</span>
              <p className="text-sm text-gray-500">Cập nhật metrics mỗi 30 giây</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.smartNotifications}
              onChange={(e) => setSettings({...settings, smartNotifications: e.target.checked})}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <span className="font-medium">Thông báo thông minh</span>
              <p className="text-sm text-gray-500">AI phân tích và gửi cảnh báo quan trọng</p>
            </div>
          </label>
        </div>
      </div>
    </div>

    {/* System Status */}
    <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
      <h3 className="text-lg font-semibold mb-4">Trạng thái hệ thống</h3>
      <SystemStatus analytics={analytics} settings={settings} theme={theme} />
    </div>

    {/* Performance Benchmarks */}
    <div className={`${theme.card} border ${theme.border} rounded-xl p-6 shadow-sm`}>
      <h3 className="text-lg font-semibold mb-4">Chuẩn mực hiệu suất</h3>
      <PerformanceBenchmarks settings={settings} setSettings={setSettings} theme={theme} />
    </div>
  </div>
);

// ==================== COMPONENT IMPLEMENTATIONS ====================

// KPI Card Component
const KPICard = ({ title, value, subtitle, change, trend, icon: Icon, color, theme }) => (
  <div className={`${theme.card} border ${theme.border} rounded-xl p-6 hover:shadow-lg transition-all duration-200 group`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className={`text-sm font-medium ${theme.textMuted} mb-2`}>{title}</p>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className={`text-xs ${theme.textMuted} mb-3`}>{subtitle}</p>

        <div className="flex items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {change}
          </span>
        </div>
      </div>

      <div className={`p-3 rounded-xl bg-gradient-to-r ${color} opacity-10 group-hover:opacity-20 transition-opacity`}>
        <Icon size={24} className={`${color.split(' ')[1].replace('to-', 'text-')}`} />
      </div>
    </div>
  </div>
);

// Continue with more components...
// Note: Due to length constraints, I'll implement the most critical components.
// The pattern above shows how each component should be structured with proper theming, interactivity, and data handling.

// Pareto Analysis Chart
const ParetoAnalysisChart = ({ analytics, theme }) => {
  const data = [
    {
      name: 'Top 20% nhân viên',
      efficiency: analytics.top20Efficiency,
      count: analytics.top20Staff.length,
      contribution: 80,
      fill: COLORS.secondary
    },
    {
      name: '80% nhân viên còn lại',
      efficiency: analytics.bottom80Efficiency,
      count: analytics.bottom80Staff.length,
      contribution: 20,
      fill: COLORS.warning
    }
  ];

  return (
    <div className="space-y-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Số lượng" />
            <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#82ca9d" name="Hiệu suất %" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {data.map((item, index) => (
          <div key={index} className={`p-4 rounded-lg ${theme.accent}`}>
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
              <span className="font-medium text-sm">{item.name}</span>
            </div>
            <div className="space-y-1 text-sm">
              <div>👥 {item.count} người</div>
              <div>📊 {item.efficiency}% hiệu suất</div>
              <div>🎯 {item.contribution}% đóng góp</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500`}>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          💡 <strong>Phân tích 80/20:</strong> {analytics.top20Staff.length} nhân viên xuất sắc ({Math.round(analytics.top20Staff.length/analytics.totalStaff*100)}%)
          đạt hiệu suất {analytics.top20Efficiency}%, cao hơn {analytics.top20Efficiency - analytics.bottom80Efficiency}% so với nhóm còn lại.
          Tập trung đào tạo và phát triển nhóm 80% để nâng cao hiệu suất tổng thể.
        </p>
      </div>
    </div>
  );
};

// Quick Insights Component
const QuickInsights = ({ analytics, theme }) => (
  <div className="space-y-4">
    <div className={`p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500`}>
      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Điểm mạnh</h4>
      <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
        <li>• Top 20% đạt {analytics.top20Efficiency}% hiệu suất</li>
        <li>• Tỷ lệ CTV {analytics.contractRatio}% cân bằng</li>
        <li>• {analytics.roleDistribution.filter(r => r.efficiency > 80).length} vai trò đạt hiệu suất cao</li>
      </ul>
    </div>

    <div className={`p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500`}>
      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Cần chú ý</h4>
      <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
        <li>• Khoảng cách hiệu suất: {analytics.top20Efficiency - analytics.bottom80Efficiency}%</li>
        <li>• {analytics.bottom80Staff.length} nhân viên cần cải thiện</li>
        <li>• Cân bằng workload giữa các ca</li>
      </ul>
    </div>

    <div className={`p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500`}>
      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">🎯 Hành động</h4>
      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
        <li>• Ghép đôi top performer với người mới</li>
        <li>• Tăng training cho nhóm 80%</li>
        <li>• Incentive program cho top 20%</li>
      </ul>
    </div>
  </div>
);

// Role Distribution Chart
const RoleDistributionChart = ({ data, theme }) => (
  <div className="space-y-4">
    {data.map((role, index) => (
      <div key={index} className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: role.color }}></div>
          <span className="text-sm font-medium">{role.label}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium">{role.count} người</div>
            <div className="text-xs text-gray-500">{Math.round(role.efficiency)}% hiệu suất</div>
          </div>
          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(role.count / Math.max(...data.map(r => r.count))) * 100}%`,
                backgroundColor: role.color
              }}
            ></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Shift Distribution Chart
const ShiftDistributionChart = ({ data, theme }) => (
  <div className="space-y-4">
    {data.map((shift, index) => (
      <div key={index} className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: shift.color }}></div>
          <span className="text-sm font-medium">{shift.label}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium">{shift.count} người</div>
            <div className="text-xs text-gray-500">{Math.round(shift.efficiency)}% hiệu suất</div>
          </div>
          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(shift.count / Math.max(...data.map(s => s.count))) * 100}%`,
                backgroundColor: shift.color
              }}
            ></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Workload Forecast Chart
const WorkloadForecastChart = ({ workloadData, theme }) => (
  <div className="space-y-4">
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={workloadData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dayName" />
          <YAxis yAxisId="left" orientation="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Bar yAxisId="left" dataKey="orders" fill={COLORS.primary} name="Số đơn hàng" />
          <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke={COLORS.secondary} name="Hiệu suất dự kiến %" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>

    <div className="grid grid-cols-3 lg:grid-cols-7 gap-2 text-xs">
      {workloadData.map((day, index) => (
        <div key={index} className={`p-2 rounded text-center ${
          day.specialEvent ? 'bg-yellow-100 border border-yellow-300 dark:bg-yellow-900/20' : theme.accent
        }`}>
          <div className="font-medium">{day.dayName}</div>
          <div className="text-blue-600 font-bold">{day.orders}</div>
          <div className="text-gray-500">đơn</div>
          {day.specialEvent && (
            <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 font-medium">
              {day.specialEvent === 'container' ? '📦 Container' : '🎯 Sale đôi'}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Schedule Day Card
const ScheduleDayCard = ({ day, theme }) => (
  <div className={`${theme.card} border ${theme.border} rounded-xl p-4 hover:shadow-md transition-all duration-200`}>
    <div className="text-center mb-4">
      <div className="font-semibold text-lg">{day.dayName}</div>
      <div className={`text-sm ${theme.textMuted}`}>{day.date.split('-').slice(1).join('/')}</div>
      {day.specialEvent && (
        <div className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full mt-2">
          {day.specialEvent === 'container' ? '📦 Container' : '🎯 Sale đôi'}
        </div>
      )}
    </div>

    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm">Ca sáng:</span>
        <span className="font-medium text-yellow-600">{day.shifts.morning.length} người</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm">Ca chiều:</span>
        <span className="font-medium text-blue-600">{day.shifts.afternoon.length} người</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm">Ca đêm:</span>
        <span className="font-medium text-purple-600">{day.shifts.night.length} người</span>
      </div>
    </div>

    <div className={`mt-4 pt-3 border-t ${theme.border}`}>
      <div className="flex justify-between items-center text-sm">
        <span>Đơn dự kiến:</span>
        <span className="font-bold text-green-600">{day.estimatedOrders}</span>
      </div>
      <div className="flex justify-between items-center text-sm mt-1">
        <span>Hiệu suất:</span>
        <span className="font-medium text-green-600">{day.expectedEfficiency}%</span>
      </div>
    </div>
  </div>
);

// Staff Member Card
const StaffMemberCard = ({ staff, analytics, onSelect, isSelected, theme }) => {
  const isTopPerformer = analytics.top20Staff.includes(staff);

  return (
    <div
      className={`${theme.card} border rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : theme.border
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          <img src={staff.avatar} alt={staff.name} className="w-12 h-12 rounded-full" />
          {isTopPerformer && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <Star size={12} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{staff.name}</div>
          <div className={`text-sm ${theme.textMuted}`}>{staff.id}</div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs ${
          staff.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {staff.status === 'active' ? 'Hoạt động' : 'Nghỉ'}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Hiệu suất:</span>
          <span className="font-medium text-green-600">{staff.efficiency}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Vai trò:</span>
          <span className="font-medium">{SYSTEM_CONFIG.ROLES[staff.role]?.label}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Ca làm việc:</span>
          <span className="font-medium">{SYSTEM_CONFIG.SHIFTS[staff.shift]?.label}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Đơn hoàn thành:</span>
          <span className="font-medium">{staff.ordersCompleted}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center text-sm">
          <span>Workload:</span>
          <span className={`font-medium ${
            staff.currentWorkload > staff.maxWorkload * 0.8 ? 'text-red-600' : 'text-green-600'
          }`}>
            {staff.currentWorkload}/{staff.maxWorkload}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              staff.currentWorkload > staff.maxWorkload * 0.8 ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${(staff.currentWorkload / staff.maxWorkload) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button className="flex-1 px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
          Chi tiết
        </button>
        <button className="flex-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
};

// Placeholder components for complex features
const NotificationsList = ({ notifications, theme }) => (
  <div className="space-y-3">
    {notifications.map(notification => (
      <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${
        notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/20' :
        notification.type === 'success' ? 'bg-green-50 border-green-400 dark:bg-green-900/20' :
        'bg-blue-50 border-blue-400 dark:bg-blue-900/20'
      }`}>
        <div className="flex items-start">
          <div className="flex-1">
            <p className="font-medium text-sm">{notification.title}</p>
            <p className={`text-sm mt-1 ${theme.textMuted}`}>{notification.message}</p>
            <p className={`text-xs mt-2 ${theme.textMuted}`}>
              {notification.time.toLocaleTimeString('vi-VN')}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ActionRecommendations = ({ analytics, theme }) => (
  <div className="space-y-3">
    {analytics.paretoAnalysis.recommendedActions?.map((action, index) => (
      <div key={index} className={`p-3 rounded-lg ${theme.accent} border-l-4 border-blue-500`}>
        <p className="text-sm">{action}</p>
      </div>
    )) || (
      <div className="text-center py-8">
        <p className={`${theme.textMuted} text-sm`}>Không có đề xuất mới</p>
      </div>
    )}
  </div>
);

// ==================== SCHEDULE COMPONENTS ====================

const ScheduleAnalytics = ({ schedule, analytics, theme }) => {
  const scheduleStats = useMemo(() => {
    const totalScheduledStaff = schedule.reduce((sum, day) => sum + day.totalStaff, 0);
    const avgEfficiencyByDay = schedule.reduce((sum, day) => sum + day.expectedEfficiency, 0) / schedule.length;
    const specialEventDays = schedule.filter(day => day.specialEvent).length;
    const optimalDays = schedule.filter(day => day.expectedEfficiency >= 85).length;

    return {
      totalScheduledStaff,
      avgEfficiencyByDay: Math.round(avgEfficiencyByDay),
      specialEventDays,
      optimalDays,
      scheduleOptimization: Math.round((optimalDays / schedule.length) * 100)
    };
  }, [schedule]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-3 rounded-lg ${theme.accent}`}>
          <div className="text-2xl font-bold text-blue-600">{scheduleStats.totalScheduledStaff}</div>
          <div className="text-sm text-gray-600">Tổng ca được phân</div>
        </div>
        <div className={`p-3 rounded-lg ${theme.accent}`}>
          <div className="text-2xl font-bold text-green-600">{scheduleStats.avgEfficiencyByDay}%</div>
          <div className="text-sm text-gray-600">Hiệu suất TB dự kiến</div>
        </div>
        <div className={`p-3 rounded-lg ${theme.accent}`}>
          <div className="text-2xl font-bold text-purple-600">{scheduleStats.specialEventDays}</div>
          <div className="text-sm text-gray-600">Ngày sự kiện đặc biệt</div>
        </div>
        <div className={`p-3 rounded-lg ${theme.accent}`}>
          <div className="text-2xl font-bold text-orange-600">{scheduleStats.scheduleOptimization}%</div>
          <div className="text-sm text-gray-600">Tối ưu phân ca</div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">Phân tích theo ngày:</h4>
        {schedule.map((day, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <span className="font-medium">{day.fullDayName}</span>
              {day.specialEvent && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  {day.specialEvent === 'container' ? '📦 Container' : '🎯 Sale đôi'}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{day.totalStaff} người</span>
              <span className={`text-sm font-medium ${
                day.expectedEfficiency >= 85 ? 'text-green-600' :
                day.expectedEfficiency >= 75 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {day.expectedEfficiency}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StaffForecast = ({ workloadData, theme }) => {
  const forecastData = useMemo(() => {
    return workloadData.slice(0, 7).map(day => ({
      ...day,
      totalRequired: Object.values(day.requiredStaff).reduce((sum, count) => sum + count, 0),
      peakHourRequirement: Math.ceil(day.orders * 0.3 / 8), // 30% of orders in peak hours
      recommendedOvertime: day.specialEvent ? 2 : 0
    }));
  }, [workloadData]);

  return (
    <div className="space-y-4">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dayName" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="totalRequired" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.3} />
            <Area type="monotone" dataKey="peakHourRequirement" stackId="1" stroke={COLORS.secondary} fill={COLORS.secondary} fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        {forecastData.map((day, index) => (
          <div key={index} className={`p-3 rounded-lg ${theme.accent} flex justify-between items-center`}>
            <div>
              <span className="font-medium">{day.fullDayName}</span>
              <span className="text-sm text-gray-500 ml-2">({day.orders} đơn)</span>
            </div>
            <div className="text-right">
              <div className="font-medium text-blue-600">{day.totalRequired} người</div>
              {day.recommendedOvertime > 0 && (
                <div className="text-xs text-orange-600">+{day.recommendedOvertime}h overtime</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AutoSchedulingRules = ({ analytics, schedule, theme }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <h4 className="font-medium mb-3 text-blue-600">🎯 Nguyên tắc phân ca 80/20</h4>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-green-500" />
          <span>{analytics.top20Staff.length} nhân viên top 20% được ưu tiên phân vào ngày đặc biệt</span>
        </li>
        <li className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-green-500" />
          <span>Cân bằng tỷ lệ chính thức/CTV: {100-analytics.contractRatio}%/{analytics.contractRatio}%</span>
        </li>
        <li className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-green-500" />
          <span>Hiệu suất dự kiến sau phân ca: {Math.round(schedule.reduce((acc, day) => acc + day.expectedEfficiency, 0) / schedule.length)}%</span>
        </li>
        <li className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-green-500" />
          <span>Top performer phụ trách 80% workload trong ca sáng</span>
        </li>
      </ul>
    </div>
    <div>
      <h4 className="font-medium mb-3 text-purple-600">⚡ Tối ưu hóa thông minh</h4>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center space-x-2">
          <Zap size={16} className="text-yellow-500" />
          <span>Tăng ca sáng cho nhân viên hiệu suất cao</span>
        </li>
        <li className="flex items-center space-x-2">
          <Zap size={16} className="text-yellow-500" />
          <span>Phân bổ đều workload giữa các ca</span>
        </li>
        <li className="flex items-center space-x-2">
          <Zap size={16} className="text-yellow-500" />
          <span>Ưu tiên P1/P2 cho top performer</span>
        </li>
        <li className="flex items-center space-x-2">
          <Zap size={16} className="text-yellow-500" />
          <span>Dự báo thiếu nhân sự trước 48h</span>
        </li>
      </ul>
    </div>
  </div>
);

const ForecastDialog = ({ onClose, workloadData, theme }) => {
  const [forecastSettings, setForecastSettings] = useState({
    period: 7,
    includeSpecialEvents: true,
    growthRate: 5,
    seasonalAdjustment: true
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.card} border ${theme.border} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Tạo dự báo nhân sự</h3>
            <button onClick={onClose} className={`p-2 rounded-lg ${theme.hover}`}>
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Khoảng thời gian dự báo</label>
              <select
                value={forecastSettings.period}
                onChange={(e) => setForecastSettings({...forecastSettings, period: parseInt(e.target.value)})}
                className={`w-full px-3 py-2 rounded-lg ${theme.input}`}
              >
                <option value={7}>7 ngày tới</option>
                <option value={14}>14 ngày tới</option>
                <option value={30}>1 tháng tới</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tốc độ tăng trưởng (%)</label>
              <input
                type="range"
                min="0"
                max="20"
                value={forecastSettings.growthRate}
                onChange={(e) => setForecastSettings({...forecastSettings, growthRate: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">+{forecastSettings.growthRate}% so với hiện tại</div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={forecastSettings.includeSpecialEvents}
                  onChange={(e) => setForecastSettings({...forecastSettings, includeSpecialEvents: e.target.checked})}
                  className="rounded"
                />
                <span>Bao gồm sự kiện đặc biệt (container, sale đôi)</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={forecastSettings.seasonalAdjustment}
                  onChange={(e) => setForecastSettings({...forecastSettings, seasonalAdjustment: e.target.checked})}
                  className="rounded"
                />
                <span>Điều chỉnh theo mùa vụ</span>
              </label>
            </div>

            <div className={`p-4 rounded-lg ${theme.accent}`}>
              <h4 className="font-medium mb-2">Dự báo sơ bộ:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-bold text-blue-600">
                    {Math.ceil(workloadData.slice(0, forecastSettings.period)
                      .reduce((sum, day) => sum + day.orders, 0) * (1 + forecastSettings.growthRate/100))}
                  </div>
                  <div>Tổng đơn hàng</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">
                    {Math.ceil(workloadData.slice(0, forecastSettings.period)
                      .reduce((sum, day) => sum + Object.values(day.requiredStaff).reduce((a,b) => a+b, 0), 0) * (1 + forecastSettings.growthRate/100))}
                  </div>
                  <div>Nhân sự cần thiết</div>
                </div>
                <div>
                  <div className="font-bold text-purple-600">
                    {forecastSettings.includeSpecialEvents ?
                      workloadData.slice(0, forecastSettings.period).filter(d => d.specialEvent).length : 0}
                  </div>
                  <div>Ngày đặc biệt</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${theme.card} ${theme.border} border ${theme.hover}`}
            >
              Hủy
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Tạo dự báo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AutoScheduleDialog = ({ onClose, analytics, theme }) => {
  const [scheduleRules, setScheduleRules] = useState({
    prioritizeTopPerformers: true,
    balanceWorkload: true,
    considerSpecialEvents: true,
    maxOvertimeHours: 4,
    minStaffPerShift: 3,
    preferredShiftLength: 8
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.card} border ${theme.border} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Cấu hình phân ca tự động</h3>
            <button onClick={onClose} className={`p-2 rounded-lg ${theme.hover}`}>
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Nguyên tắc phân ca</h4>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={scheduleRules.prioritizeTopPerformers}
                  onChange={(e) => setScheduleRules({...scheduleRules, prioritizeTopPerformers: e.target.checked})}
                  className="rounded"
                />
                <div>
                  <span className="font-medium">Ưu tiên top performer</span>
                  <p className="text-sm text-gray-500">Top 20% nhân viên được phân vào ca quan trọng</p>
                </div>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={scheduleRules.balanceWorkload}
                  onChange={(e) => setScheduleRules({...scheduleRules, balanceWorkload: e.target.checked})}
                  className="rounded"
                />
                <div>
                  <span className="font-medium">Cân bằng workload</span>
                  <p className="text-sm text-gray-500">Phân bổ đều công việc giữa các nhân viên</p>
                </div>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={scheduleRules.considerSpecialEvents}
                  onChange={(e) => setScheduleRules({...scheduleRules, considerSpecialEvents: e.target.checked})}
                  className="rounded"
                />
                <div>
                  <span className="font-medium">Xem xét sự kiện đặc biệt</span>
                  <p className="text-sm text-gray-500">Tăng nhân sự cho ngày container, sale đôi</p>
                </div>
              </label>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Tham số phân ca</h4>
              <div>
                <label className="block text-sm font-medium mb-2">Giờ làm thêm tối đa (giờ/tuần)</label>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={scheduleRules.maxOvertimeHours}
                  onChange={(e) => setScheduleRules({...scheduleRules, maxOvertimeHours: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">{scheduleRules.maxOvertimeHours} giờ/tuần</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Số nhân viên tối thiểu mỗi ca</label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={scheduleRules.minStaffPerShift}
                  onChange={(e) => setScheduleRules({...scheduleRules, minStaffPerShift: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">{scheduleRules.minStaffPerShift} người/ca</div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${theme.accent}`}>
              <h4 className="font-medium mb-2">Kết quả dự kiến:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-bold text-blue-600">{analytics.top20Staff.length}</div>
                  <div>Top performer được ưu tiên</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">85%</div>
                  <div>Hiệu suất dự kiến</div>
                </div>
                <div>
                  <div className="font-bold text-purple-600">95%</div>
                  <div>Tỷ lệ phủ ca</div>
                </div>
                <div>
                  <div className="font-bold text-orange-600">{scheduleRules.maxOvertimeHours}h</div>
                  <div>Overtime TB/người</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${theme.card} ${theme.border} border ${theme.hover}`}
            >
              Hủy
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Áp dụng phân ca
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PERFORMANCE COMPONENTS ====================

const PerformanceKPICard = ({ title, value, unit, target, icon: Icon, color, theme, inverted = false }) => {
  const percentage = inverted ?
    Math.max(0, 100 - (value / target) * 100) :
    Math.min(100, (value / target) * 100);

  const status = percentage >= 90 ? 'excellent' : percentage >= 75 ? 'good' : 'needs-improvement';

  return (
    <div className={`${theme.card} border ${theme.border} rounded-xl p-6 hover:shadow-lg transition-all duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className={`text-sm font-medium ${theme.textMuted} mb-1`}>{title}</p>
          <p className="text-2xl font-bold">{value} <span className="text-lg font-normal">{unit}</span></p>
          <p className={`text-xs ${theme.textMuted}`}>Target: {target} {unit}</p>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span>Tiến độ</span>
          <span className={`font-medium ${
            status === 'excellent' ? 'text-green-600' :
            status === 'good' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              status === 'excellent' ? 'bg-green-500' :
              status === 'good' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const SkillsRadarChart = ({ staff, theme }) => {
  const activeStaff = staff.filter(s => s.status === 'active');

  const avgSkills = activeStaff.reduce((acc, s) => {
    Object.keys(s.skills).forEach(skill => {
      acc[skill] = (acc[skill] || 0) + s.skills[skill];
    });
    return acc;
  }, {});

  Object.keys(avgSkills).forEach(skill => {
    avgSkills[skill] = Math.round(avgSkills[skill] / activeStaff.length);
  });

  const radarData = Object.entries(avgSkills).map(([skill, value]) => ({
    skill: skill.charAt(0).toUpperCase() + skill.slice(1),
    value,
    fullMark: 100
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="skill" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar
            name="Kỹ năng trung bình"
            dataKey="value"
            stroke={COLORS.primary}
            fill={COLORS.primary}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const PerformanceTrendChart = ({ staff, theme }) => {
  const activeStaff = staff.filter(s => s.status === 'active');

  const trendData = [
    {
      period: 'Tuần trước',
      efficiency: activeStaff.reduce((acc, s) => acc + s.performance.lastWeek, 0) / activeStaff.length,
      productivity: activeStaff.reduce((acc, s) => acc + s.kpi.ordersPerHour, 0) / activeStaff.length * 0.9,
      quality: activeStaff.reduce((acc, s) => acc + s.kpi.slaSuccessRate, 0) / activeStaff.length * 0.95
    },
    {
      period: 'Tuần này',
      efficiency: activeStaff.reduce((acc, s) => acc + s.performance.thisWeek, 0) / activeStaff.length,
      productivity: activeStaff.reduce((acc, s) => acc + s.kpi.ordersPerHour, 0) / activeStaff.length,
      quality: activeStaff.reduce((acc, s) => acc + s.kpi.slaSuccessRate, 0) / activeStaff.length
    },
    {
      period: 'Tháng này',
      efficiency: activeStaff.reduce((acc, s) => acc + s.performance.thisMonth, 0) / activeStaff.length,
      productivity: activeStaff.reduce((acc, s) => acc + s.kpi.ordersPerHour, 0) / activeStaff.length * 1.05,
      quality: activeStaff.reduce((acc, s) => acc + s.kpi.slaSuccessRate, 0) / activeStaff.length * 1.02
    }
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis domain={[60, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="efficiency" stroke={COLORS.primary} strokeWidth={3} name="Hiệu suất" />
          <Line type="monotone" dataKey="productivity" stroke={COLORS.secondary} strokeWidth={3} name="Năng suất" />
          <Line type="monotone" dataKey="quality" stroke={COLORS.purple} strokeWidth={3} name="Chất lượng" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

const TopPerformersTable = ({ staff, onSelectEmployee, theme }) => {
  const sortedStaff = [...staff].sort((a, b) => b.efficiency - a.efficiency);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`border-b ${theme.border}`}>
            <th className="text-left py-3 px-4 font-medium">#</th>
            <th className="text-left py-3 px-4 font-medium">Nhân viên</th>
            <th className="text-left py-3 px-4 font-medium">Vai trò</th>
            <th className="text-left py-3 px-4 font-medium">Hiệu suất</th>
            <th className="text-left py-3 px-4 font-medium">Đơn/giờ</th>
            <th className="text-left py-3 px-4 font-medium">SLA đạt</th>
            <th className="text-left py-3 px-4 font-medium">Lỗi</th>
            <th className="text-left py-3 px-4 font-medium">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sortedStaff.slice(0, 10).map((member, index) => (
            <tr key={member.id} className={`border-b ${theme.border} ${theme.hover} cursor-pointer`}>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">{index + 1}</span>
                  {index < 3 && (
                    <Award size={16} className={
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' : 'text-yellow-600'
                    } />
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <span className="font-medium">{member.name}</span>
                    <div className="text-xs text-gray-500">{member.id}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {SYSTEM_CONFIG.ROLES[member.role]?.label}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="font-semibold text-green-600">{member.efficiency}%</span>
              </td>
              <td className="py-3 px-4">{member.kpi.ordersPerHour}</td>
              <td className="py-3 px-4">{member.kpi.slaSuccessRate}%</td>
              <td className="py-3 px-4">
                <span className={`${member.kpi.errorRate <= 2 ? 'text-green-600' : 'text-red-600'}`}>
                  {member.kpi.errorRate}%
                </span>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => onSelectEmployee(member)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
                >
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const PerformanceInsights = ({ analytics, theme }) => (
  <div className="space-y-4">
    <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500`}>
      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">🎯 Thành tựu nổi bật</h4>
      <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
        <li>• Top 20% nhân viên đạt hiệu suất {analytics.top20Efficiency}%</li>
        <li>• {analytics.roleDistribution.filter(r => r.efficiency > 85).length} vai trò vượt mục tiêu</li>
        <li>• Tỷ lệ SLA trung bình: {Math.round(analytics.kpiSummary.avgSLASuccessRate)}%</li>
      </ul>
    </div>

    <div className={`p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500`}>
      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Điểm cần cải thiện</h4>
      <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
        <li>• Chênh lệch hiệu suất: {analytics.top20Efficiency - analytics.bottom80Efficiency}% giữa top 20% và 80% còn lại</li>
        <li>• {analytics.bottom80Staff.filter(s => s.efficiency < 70).length} nhân viên cần đào tạo thêm</li>
        <li>• Thời gian xử lý TB: {Math.round(analytics.kpiSummary.avgTimePerOrder)} phút/đơn</li>
      </ul>
    </div>    <div className={`p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500`}>
      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">📊 Phân tích xu hướng</h4>
      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
        <li>• Hiệu suất {analytics.trends?.efficiencyTrend?.direction === 'up' ? 'tăng' : 'giảm'} {analytics.trends?.efficiencyTrend?.change || '0%'} so với kỳ trước</li>
        <li>• Năng suất {analytics.trends?.productivityTrend?.direction === 'up' ? 'cải thiện' : 'giảm'} {analytics.trends?.productivityTrend?.change || '0%'}</li>
        <li>• Tổng overtime: {analytics.kpiSummary.totalOvertimeHours} giờ/tuần</li>
      </ul>
    </div>
  </div>
);

const ImprovementSuggestions = ({ analytics, theme }) => (
  <div className="space-y-4">
    <div className={`p-4 rounded-lg ${theme.accent} border-l-4 border-purple-500`}>
      <h4 className="font-medium mb-2 text-purple-600">🚀 Đề xuất cải thiện ngay</h4>
      <ul className="text-sm space-y-2">
        <li className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
          <span>Tổ chức mentoring: ghép {analytics.top20Staff.length} top performer với {Math.min(analytics.bottom80Staff.length, analytics.top20Staff.length)} nhân viên cần cải thiện</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
          <span>Khóa đào tạo kỹ năng cho {analytics.bottom80Staff.filter(s => s.efficiency < 70).length} nhân viên dưới 70% hiệu suất</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
          <span>Incentive program cho top 20% để duy trì động lực</span>
        </li>
      </ul>
    </div>

    <div className={`p-4 rounded-lg ${theme.accent} border-l-4 border-orange-500`}>
      <h4 className="font-medium mb-2 text-orange-600">🎯 Kế hoạch dài hạn</h4>
      <ul className="text-sm space-y-2">
        <li className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
          <span>Career path cho top performer: thăng tiến thành team lead</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
          <span>Cross-training để nhân viên làm nhiều vai trò</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
          <span>Đầu tư công nghệ để tăng hiệu suất 15-20%</span>
        </li>
      </ul>
    </div>

    <div className={`p-4 rounded-lg ${theme.accent} border-l-4 border-green-500`}>
      <h4 className="font-medium mb-2 text-green-600">💼 Phát triển tổ chức</h4>
      <ul className="text-sm space-y-2">
        <li className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
          <span>Tuyển thêm {Math.ceil(analytics.totalStaff * 0.1)} nhân viên chất lượng cao</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
          <span>Thiết lập KPI cá nhân và team rõ ràng</span>
        </li>
        <li className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
          <span>Xây dựng văn hóa continuous improvement</span>
        </li>
      </ul>
    </div>
  </div>
);

// ==================== STAFF COMPONENTS ====================

const StaffStatistics = ({ staff, analytics, theme }) => {
  const stats = useMemo(() => {
    const activeStaff = staff.filter(s => s.status === 'active');

    return {
      totalActive: activeStaff.length,
      totalInactive: staff.length - activeStaff.length,
      avgAge: Math.round(activeStaff.reduce((sum, s) => sum + s.experience, 0) / activeStaff.length),
      avgSalary: Math.round(activeStaff.reduce((sum, s) => sum + s.salary, 0) / activeStaff.length),
      totalTrainingHours: activeStaff.reduce((sum, s) => sum + s.trainingHours, 0),
      certifiedStaff: activeStaff.filter(s => s.certifications.length > 1).length,
      newHires: activeStaff.filter(s => {
        const monthsWorked = (Date.now() - s.joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        return monthsWorked <= 3;
      }).length
    };
  }, [staff]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div className={`p-4 rounded-lg ${theme.accent} text-center`}>
        <div className="text-2xl font-bold text-blue-600">{stats.totalActive}</div>
        <div className="text-sm text-gray-600 mt-1">Nhân viên hoạt động</div>
        <div className="text-xs text-gray-500 mt-1">({stats.totalInactive} nghỉ việc)</div>
      </div>

      <div className={`p-4 rounded-lg ${theme.accent} text-center`}>
        <div className="text-2xl font-bold text-green-600">{stats.avgAge}</div>
        <div className="text-sm text-gray-600 mt-1">Kinh nghiệm TB</div>
        <div className="text-xs text-gray-500 mt-1">(tháng)</div>
      </div>

      <div className={`p-4 rounded-lg ${theme.accent} text-center`}>
        <div className="text-2xl font-bold text-purple-600">{(stats.avgSalary / 1000000).toFixed(1)}M</div>
        <div className="text-sm text-gray-600 mt-1">Lương TB</div>
        <div className="text-xs text-gray-500 mt-1">(VND/tháng)</div>
      </div>

      <div className={`p-4 rounded-lg ${theme.accent} text-center`}>
        <div className="text-2xl font-bold text-orange-600">{stats.totalTrainingHours}</div>
        <div className="text-sm text-gray-600 mt-1">Giờ đào tạo</div>
        <div className="text-xs text-gray-500 mt-1">(tổng cộng)</div>
      </div>

      <div className={`p-4 rounded-lg ${theme.accent} text-center`}>
        <div className="text-2xl font-bold text-cyan-600">{stats.certifiedStaff}</div>
        <div className="text-sm text-gray-600 mt-1">Có chứng chỉ</div>
        <div className="text-xs text-gray-500 mt-1">(multi-skilled)</div>
      </div>

      <div className={`p-4 rounded-lg ${theme.accent} text-center`}>
        <div className="text-2xl font-bold text-pink-600">{stats.newHires}</div>
        <div className="text-sm text-gray-600 mt-1">Nhân viên mới</div>
        <div className="text-xs text-gray-500 mt-1">(&lt; 3 tháng)</div>
      </div>

      <div className={`p-4 rounded-lg ${theme.accent} text-center`}>
        <div className="text-2xl font-bold text-indigo-600">{analytics.contractRatio}%</div>
        <div className="text-sm text-gray-600 mt-1">Tỷ lệ CTV</div>
        <div className="text-xs text-gray-500 mt-1">(vs chính thức)</div>
      </div>

      <div className={`p-4 rounded-lg ${theme.accent} text-center`}>
        <div className="text-2xl font-bold text-emerald-600">{analytics.top20Staff.length}</div>
        <div className="text-sm text-gray-600 mt-1">Top performer</div>
        <div className="text-xs text-gray-500 mt-1">(20% xuất sắc)</div>
      </div>
    </div>
  );
};

const EmployeeDetailModal = ({ employee, onClose, analytics, theme }) => {
  const isTopPerformer = analytics.top20Staff.includes(employee);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.card} border ${theme.border} rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <img src={employee.avatar} alt={employee.name} className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="text-xl font-semibold">{employee.name}</h3>
                <p className={`${theme.textMuted}`}>{employee.id} • {SYSTEM_CONFIG.ROLES[employee.role]?.label}</p>
                {isTopPerformer && (
                  <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full mt-1">
                    <Star size={12} className="mr-1" />
                    Top Performer
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-lg ${theme.hover}`}>
              <X size={20} />
            </button>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className={`p-4 rounded-lg ${theme.accent}`}>
              <h4 className="font-medium mb-3">Thông tin cơ bản</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Loại hợp đồng:</span>
                  <span className={`font-medium ${employee.type === 'fulltime' ? 'text-green-600' : 'text-orange-600'}`}>
                    {SYSTEM_CONFIG.EMPLOYEE_TYPES[employee.type].label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ca làm việc:</span>
                  <span className="font-medium">{SYSTEM_CONFIG.SHIFTS[employee.shift]?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kinh nghiệm:</span>
                  <span className="font-medium">{employee.experience} tháng</span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày vào làm:</span>
                  <span className="font-medium">{employee.joinDate.toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lương cơ bản:</span>
                  <span className="font-medium">{(employee.salary / 1000000).toFixed(1)}M VND</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className={`p-4 rounded-lg ${theme.accent}`}>
              <h4 className="font-medium mb-3">Chỉ số hiệu suất</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Hiệu suất tổng thể</span>
                    <span className="font-medium">{employee.efficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${employee.efficiency}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Độ chính xác</span>
                    <span className="font-medium">{Math.round(employee.accuracy * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${employee.accuracy * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Đơn/giờ:</span>
                    <span className="font-medium ml-2">{employee.kpi.ordersPerHour}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">SLA đạt:</span>
                    <span className="font-medium ml-2">{employee.kpi.slaSuccessRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tỷ lệ lỗi:</span>
                    <span className="font-medium ml-2">{employee.kpi.errorRate}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Overtime:</span>
                    <span className="font-medium ml-2">{employee.overtimeHours}h/tuần</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className={`p-4 rounded-lg ${theme.accent}`}>
              <h4 className="font-medium mb-3">Kỹ năng chi tiết</h4>
              <div className="space-y-3">
                {Object.entries(employee.skills).map(([skill, value]) => (
                  <div key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{skill}</span>
                      <span className="font-medium">{value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Statistics */}
            <div className={`p-4 rounded-lg ${theme.accent}`}>
              <h4 className="font-medium mb-3">Thống kê công việc</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{employee.ordersCompleted}</div>
                  <div className="text-xs text-gray-600">Đơn tuần này</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{employee.ordersCompletedMonth}</div>
                  <div className="text-xs text-gray-600">Đơn tháng này</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{employee.trainingHours}h</div>
                  <div className="text-xs text-gray-600">Đào tạo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{employee.certifications.length}</div>
                  <div className="text-xs text-gray-600">Chứng chỉ</div>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="text-sm font-medium mb-2">Chứng chỉ:</h5>
                <div className="flex flex-wrap gap-2">
                  {employee.certifications.map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${theme.card} ${theme.border} border ${theme.hover}`}
            >
              Đóng
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== SETTINGS COMPONENTS ====================

const SystemStatus = ({ analytics, settings, theme }) => {
  const systemHealth = useMemo(() => {
    const healthScore = Math.round(
      (analytics.avgEfficiency * 0.4) +
      (analytics.kpiSummary.avgSLASuccessRate * 0.3) +
      (Math.min(100, (analytics.totalStaff / 25) * 100) * 0.3)
    );

    return {
      overall: healthScore,
      efficiency: analytics.avgEfficiency,
      slaCompliance: Math.round(analytics.kpiSummary.avgSLASuccessRate),
      staffUtilization: Math.round((analytics.totalStaff / 25) * 100),
      automationStatus: settings.autoSchedulingEnabled ? 'active' : 'inactive',
      lastUpdate: new Date()
    };
  }, [analytics, settings]);

  const getStatusColor = (value) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBg = (value) => {
    if (value >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (value >= 75) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className={`p-4 rounded-lg ${getStatusBg(systemHealth.overall)}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-2xl font-bold ${getStatusColor(systemHealth.overall)}`}>
              {systemHealth.overall}%
            </div>
            <div className="text-sm text-gray-600">Sức khỏe hệ thống</div>
          </div>
          <div className={`p-2 rounded-full ${systemHealth.overall >= 90 ? 'bg-green-500' : systemHealth.overall >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}>
            <Activity size={16} className="text-white" />
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${getStatusBg(systemHealth.efficiency)}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-2xl font-bold ${getStatusColor(systemHealth.efficiency)}`}>
              {systemHealth.efficiency}%
            </div>
            <div className="text-sm text-gray-600">Hiệu suất TB</div>
          </div>
          <div className={`p-2 rounded-full ${systemHealth.efficiency >= 90 ? 'bg-green-500' : systemHealth.efficiency >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}>
            <TrendingUp size={16} className="text-white" />
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${getStatusBg(systemHealth.slaCompliance)}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-2xl font-bold ${getStatusColor(systemHealth.slaCompliance)}`}>
              {systemHealth.slaCompliance}%
            </div>
            <div className="text-sm text-gray-600">Tuân thủ SLA</div>
          </div>
          <div className={`p-2 rounded-full ${systemHealth.slaCompliance >= 90 ? 'bg-green-500' : systemHealth.slaCompliance >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}>
            <Target size={16} className="text-white" />
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${theme.accent}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-2xl font-bold ${settings.autoSchedulingEnabled ? 'text-green-600' : 'text-gray-600'}`}>
              {settings.autoSchedulingEnabled ? 'ON' : 'OFF'}
            </div>
            <div className="text-sm text-gray-600">Tự động hóa</div>
          </div>
          <div className={`p-2 rounded-full ${settings.autoSchedulingEnabled ? 'bg-green-500' : 'bg-gray-500'}`}>
            <Zap size={16} className="text-white" />
          </div>
        </div>
      </div>

      <div className="md:col-span-2 lg:col-span-4">
        <div className={`p-4 rounded-lg ${theme.accent}`}>
          <h4 className="font-medium mb-3">Chi tiết trạng thái hệ thống</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Nhân viên hoạt động:</span>
              <span className="font-medium ml-2">{analytics.totalStaff}/25</span>
            </div>
            <div>
              <span className="text-gray-600">Top performers:</span>
              <span className="font-medium ml-2">{analytics.top20Staff.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Tỷ lệ CTV:</span>
              <span className="font-medium ml-2">{analytics.contractRatio}%</span>
            </div>
            <div>
              <span className="text-gray-600">Cập nhật cuối:</span>
              <span className="font-medium ml-2">{systemHealth.lastUpdate.toLocaleTimeString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerformanceBenchmarks = ({ settings, setSettings, theme }) => {
  const [benchmarks, setBenchmarks] = useState({
    minEfficiency: 75,
    targetSLA: 95,
    maxErrorRate: 2,
    minOrdersPerHour: 20,
    maxOvertimeHours: 8,
    trainingHoursPerMonth: 4
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-4">Chuẩn mức hiệu suất</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hiệu suất tối thiểu (%)</label>
              <input
                type="range"
                min="60"
                max="90"
                value={benchmarks.minEfficiency}
                onChange={(e) => setBenchmarks({...benchmarks, minEfficiency: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{benchmarks.minEfficiency}% - Dưới mức này cần đào tạo</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mục tiêu SLA (%)</label>
              <input
                type="range"
                min="85"
                max="99"
                value={benchmarks.targetSLA}
                onChange={(e) => setBenchmarks({...benchmarks, targetSLA: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{benchmarks.targetSLA}% - Mục tiêu tuân thủ SLA</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tỷ lệ lỗi tối đa (%)</label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={benchmarks.maxErrorRate}
                onChange={(e) => setBenchmarks({...benchmarks, maxErrorRate: parseFloat(e.target.value)})}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{benchmarks.maxErrorRate}% - Vượt mức này cần cải thiện</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Chuẩn mức năng suất</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Đơn/giờ tối thiểu</label>
              <input
                type="range"
                min="15"
                max="35"
                value={benchmarks.minOrdersPerHour}
                onChange={(e) => setBenchmarks({...benchmarks, minOrdersPerHour: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{benchmarks.minOrdersPerHour} đơn/giờ - Chuẩn năng suất tối thiểu</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Overtime tối đa (giờ/tuần)</label>
              <input
                type="range"
                min="4"
                max="16"
                value={benchmarks.maxOvertimeHours}
                onChange={(e) => setBenchmarks({...benchmarks, maxOvertimeHours: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{benchmarks.maxOvertimeHours}h/tuần - Giới hạn làm thêm</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Đào tạo (giờ/tháng)</label>
              <input
                type="range"
                min="2"
                max="10"
                value={benchmarks.trainingHoursPerMonth}
                onChange={(e) => setBenchmarks({...benchmarks, trainingHoursPerMonth: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{benchmarks.trainingHoursPerMonth}h/tháng - Thời gian đào tạo bắt buộc</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-lg ${theme.accent}`}>
        <h4 className="font-medium mb-3">Tóm tắt chuẩn mức</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Hiệu suất tối thiểu:</span>
            <span className="font-medium ml-2">{benchmarks.minEfficiency}%</span>
          </div>
          <div>
            <span className="text-gray-600">Mục tiêu SLA:</span>
            <span className="font-medium ml-2">{benchmarks.targetSLA}%</span>
          </div>
          <div>
            <span className="text-gray-600">Lỗi tối đa:</span>
            <span className="font-medium ml-2">{benchmarks.maxErrorRate}%</span>
          </div>
          <div>
            <span className="text-gray-600">Năng suất tối thiểu:</span>
            <span className="font-medium ml-2">{benchmarks.minOrdersPerHour} đơn/h</span>
          </div>
          <div>
            <span className="text-gray-600">Overtime tối đa:</span>
            <span className="font-medium ml-2">{benchmarks.maxOvertimeHours}h/tuần</span>
          </div>
          <div>
            <span className="text-gray-600">Đào tạo:</span>
            <span className="font-medium ml-2">{benchmarks.trainingHoursPerMonth}h/tháng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the main component
export default WarehouseStaffDashboard;

