import React, { useState, useEffect, useMemo, useCallback } from "react";

// Import recharts components
import {
  BarChart as RechartsBarChart,
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
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
} from "recharts";

// Import Lucide React icons
import {
  Calendar,
  Clock,
  Users,
  Save,
  Plus,
  Edit,
  Check,
  Settings,
  AlertTriangle,
  BarChart,
  ArrowRight,
  RefreshCw,
  Zap,
  TrendingUp,
  FileText,
  Bell,
  ChevronRight,
  Package,
  Shield,
  Truck,
  Filter,
  MoreVertical,
  User,
  Home,
  Activity,
  Target,
  Award,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  Search,
  Download,
} from "lucide-react";

// ===== UTILITY FUNCTIONS FOR DATE FORMATTING =====
const formatDate = (date, format = 'dd/MM/yyyy') => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  switch (format) {
    case 'dd/MM/yyyy':
      return `${day}/${month}/${year}`;
    case 'HH:mm:ss':
      return `${hours}:${minutes}:${seconds}`;
    case 'HH:mm':
      return `${hours}:${minutes}`;
    default:
      return date.toLocaleDateString('vi-VN');
  }
};

// ===== DESIGN SYSTEM & THEME =====
const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a'
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      500: '#64748b',
      600: '#475569',
      700: '#334155'
    },
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      500: '#10b981',
      600: '#059669'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706'
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  }
};

// ===== REUSABLE UI COMPONENTS =====
const Card = ({ children, className = "", variant = "default", onClick, ...props }) => {
  const baseStyles = "bg-white rounded-xl border border-gray-200 transition-all duration-200";
  const variants = {
    default: "shadow-sm",
    elevated: "shadow-md hover:shadow-lg",
    interactive: "shadow-sm hover:shadow-md hover:border-gray-300 cursor-pointer"
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", size = "lg" }) => {
  const sizes = {
    sm: "text-sm font-semibold",
    md: "text-base font-semibold",
    lg: "text-lg font-semibold",
    xl: "text-xl font-bold"
  };

  return (
    <h3 className={`${sizes[size]} text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-300",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-100",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default", size = "sm" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    outline: "border border-gray-300 text-gray-700"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm"
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  );
};

const Progress = ({ value = 0, className = "", size = "md" }) => {
  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  };

  return (
    <div className={`bg-gray-200 rounded-full overflow-hidden ${sizes[size]} ${className}`}>
      <div
        className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color = "blue",
  onClick
}) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600"
  };

  return (
    <Card variant={onClick ? "interactive" : "elevated"} onClick={onClick}>
      <CardContent className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}
            {trend && (
              <div className="flex items-center">
                {trend.direction === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-red-500 mr-1 rotate-180" />
                )}
                <span className={`text-xs font-medium ${
                  trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.value}
                </span>
              </div>
            )}
          </div>

          {Icon && (
            <div className={`p-3 rounded-lg bg-gradient-to-r ${colors[color]} opacity-90`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// ===== DATA MANAGEMENT & METRICS =====
const useWarehouseMetrics = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  // Centralized metrics calculation
  const metrics = useMemo(() => {
    const currentDate = new Date();

    // Base metrics - Thống nhất tất cả metrics ở đây
    const staffMetrics = {
      total: 27,
      active: 23,
      onBreak: 2,
      offline: 2,
      regular: 9,
      partTime: 18
    };

    const orderMetrics = {
      todayOrders: 486,
      processedOrders: 324,
      pendingOrders: 162,
      avgProcessingTime: 8.5,
      slaCompliance: 94.2
    };

    const performanceMetrics = {
      avgEfficiency: 87.3,
      topPerformerAvg: 94.8,
      throughputPerHour: 42,
      qualityScore: 96.5
    };

    // Calculated metrics - Derived từ base metrics
    const utilizationRate = (staffMetrics.active / staffMetrics.total) * 100;
    const completionRate = (orderMetrics.processedOrders / orderMetrics.todayOrders) * 100;
    const efficiencyTrend = { direction: 'up', value: '+3.2%' };
    const throughputTrend = { direction: 'up', value: '+5.1%' };

    return {
      staff: staffMetrics,
      orders: orderMetrics,
      performance: performanceMetrics,
      derived: {
        utilizationRate,
        completionRate,
        efficiencyTrend,
        throughputTrend
      }
    };
  }, [refreshKey]);

  const refreshMetrics = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return { metrics, refreshMetrics };
};

// ===== SAMPLE DATA GENERATION =====
const generateSampleData = () => {
  // Staff data với phân bố thực tế theo nguyên tắc 20/80
  const staff = {
    regular: [
      {
        id: 1,
        name: "Nguyễn Văn A",
        role: "Picking",
        efficiency: 98,
        experience: 36,
        skills: ["picking", "packing", "qc"],
        currentShift: "morning",
        status: "active",
        isTopPerformer: true
      },
      {
        id: 2,
        name: "Trần Thị B",
        role: "Picking",
        efficiency: 96,
        experience: 24,
        skills: ["picking", "qc"],
        currentShift: "morning",
        status: "active",
        isTopPerformer: true
      },
      {
        id: 3,
        name: "Lê Văn C",
        role: "Packing",
        efficiency: 90,
        experience: 18,
        skills: ["packing", "picking"],
        currentShift: "afternoon",
        status: "active",
        isTopPerformer: false
      },
      {
        id: 4,
        name: "Phạm Thị D",
        role: "Packing",
        efficiency: 88,
        experience: 12,
        skills: ["packing"],
        currentShift: "morning",
        status: "break",
        isTopPerformer: false
      },
      {
        id: 5,
        name: "Võ Văn E",
        role: "QC",
        efficiency: 95,
        experience: 30,
        skills: ["qc", "packing"],
        currentShift: "afternoon",
        status: "active",
        isTopPerformer: true
      },
      {
        id: 6,
        name: "Trần Văn F",
        role: "Picking",
        efficiency: 85,
        experience: 9,
        skills: ["picking"],
        currentShift: "morning",
        status: "active",
        isTopPerformer: false
      },
      {
        id: 7,
        name: "Nguyễn Thị G",
        role: "QC",
        efficiency: 92,
        experience: 15,
        skills: ["qc"],
        currentShift: "afternoon",
        status: "active",
        isTopPerformer: false
      },
      {
        id: 8,
        name: "Lê Thị H",
        role: "Picking",
        efficiency: 82,
        experience: 6,
        skills: ["picking"],
        currentShift: "morning",
        status: "offline",
        isTopPerformer: false
      },
      {
        id: 9,
        name: "Hoàng Văn I",
        role: "Packing",
        efficiency: 84,
        experience: 8,
        skills: ["packing"],
        currentShift: "afternoon",
        status: "active",
        isTopPerformer: false
      }
    ],
    partTime: Array.from({ length: 18 }, (_, i) => ({
      id: 100 + i,
      name: `CTV${i + 1}`,
      role: ['Picking', 'Packing', 'QC'][i % 3],
      efficiency: 70 + Math.floor(Math.random() * 20),
      experience: 1 + Math.floor(Math.random() * 6),
      skills: [['Picking', 'Packing', 'QC'][i % 3].toLowerCase()],
      currentShift: ['morning', 'afternoon'][i % 2],
      status: ['active', 'break', 'offline'][Math.floor(Math.random() * 3)],
      isTopPerformer: false
    }))
  };

  // Weekly schedule data - Dựa trên pattern thực tế
  const weeklyData = [
    { day: 'T2', orders: 450, workload: 85, staff: 15, specialEvent: false },
    { day: 'T3', orders: 380, workload: 72, staff: 13, specialEvent: false },
    { day: 'T4', orders: 520, workload: 95, staff: 17, specialEvent: true, eventName: 'Container' },
    { day: 'T5', orders: 420, workload: 80, staff: 14, specialEvent: false },
    { day: 'T6', orders: 650, workload: 100, staff: 20, specialEvent: true, eventName: 'Ngày đôi' },
    { day: 'T7', orders: 320, workload: 60, staff: 10, specialEvent: false },
    { day: 'CN', orders: 180, workload: 35, staff: 6, specialEvent: false }
  ];

  // Performance trends - 7 ngày gần nhất
  const performanceTrends = Array.from({ length: 7 }, (_, i) => ({
    day: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i],
    efficiency: 82 + Math.floor(Math.random() * 15),
    throughput: 35 + Math.floor(Math.random() * 15),
    quality: 90 + Math.floor(Math.random() * 10),
    sla: 88 + Math.floor(Math.random() * 12)
  }));

  return { staff, weeklyData, performanceTrends };
};

// ===== MAIN DASHBOARD COMPONENT =====
const WarehouseDashboard = () => {
  const { metrics, refreshMetrics } = useWarehouseMetrics();
  const { staff, weeklyData, performanceTrends } = generateSampleData();

  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRealTimeMode, setIsRealTimeMode] = useState(false);

  // Auto refresh every 30 seconds in real-time mode
  useEffect(() => {
    if (!isRealTimeMode) return;

    const interval = setInterval(() => {
      refreshMetrics();
      setLastRefresh(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshMetrics, isRealTimeMode]);

  const handleRefresh = useCallback(() => {
    refreshMetrics();
    setLastRefresh(new Date());
  }, [refreshMetrics]);

  const currentDate = formatDate(new Date(), 'dd/MM/yyyy');
  const refreshTime = formatDate(lastRefresh, 'HH:mm:ss');

  // ===== TAB NAVIGATION =====
  const tabs = [
    { id: 'overview', label: 'Tổng Quan', icon: Home },
    { id: 'schedule', label: 'Lịch Làm Việc', icon: Calendar },
    { id: 'performance', label: 'Hiệu Suất', icon: TrendingUp },
    { id: 'staff', label: 'Nhân Sự', icon: Users },
    { id: 'analytics', label: 'Phân Tích', icon: BarChart }
  ];

  // ===== OVERVIEW TAB CONTENT =====
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tổng Nhân Sự"
          value={metrics.staff.total}
          subtitle={`${metrics.staff.active} đang hoạt động`}
          trend={metrics.derived.efficiencyTrend}
          icon={Users}
          color="blue"
        />

        <MetricCard
          title="Tỷ Lệ Sử Dụng"
          value={`${metrics.derived.utilizationRate.toFixed(1)}%`}
          subtitle="nhân lực hiện tại"
          trend={metrics.derived.throughputTrend}
          icon={Activity}
          color="green"
        />

        <MetricCard
          title="Đơn Hàng Hôm Nay"
          value={metrics.orders.todayOrders}
          subtitle={`${metrics.orders.processedOrders} đã xử lý`}
          trend={{ direction: 'up', value: '+12%' }}
          icon={Package}
          color="purple"
        />

        <MetricCard
          title="Hiệu Suất TB"
          value={`${metrics.performance.avgEfficiency}%`}
          subtitle="toàn kho"
          trend={metrics.derived.efficiencyTrend}
          icon={Target}
          color="yellow"
        />
      </div>

      {/* Pareto Principle Analysis */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Phân Tích Theo Nguyên Tắc 20/80 (Pareto)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Top 20% Nhân Viên (3 người)</h4>
                <div className="space-y-2">
                  {staff.regular
                    .filter(s => s.isTopPerformer)
                    .map(s => (
                      <div key={s.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{s.name}</span>
                        <Badge variant="success">{s.efficiency}%</Badge>
                      </div>
                    ))}
                </div>
                <div className="mt-3 p-2 bg-blue-100 rounded text-sm text-blue-800">
                  <strong>Đóng góp:</strong> 80% hiệu suất tổng thể kho
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">80% Nhân Viên Còn Lại (6 người)</h4>
                <div className="text-sm text-gray-600">
                  <p>Hiệu suất trung bình: {
                    Math.round(staff.regular
                      .filter(s => !s.isTopPerformer)
                      .reduce((sum, s) => sum + s.efficiency, 0) /
                      staff.regular.filter(s => !s.isTopPerformer).length)
                  }%</p>
                  <div className="mt-2 p-2 bg-gray-100 rounded text-gray-700">
                    <strong>Đóng góp:</strong> 20% hiệu suất còn lại
                  </div>
                </div>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Top 20% (3 NV)', value: 80, fill: '#3b82f6' },
                      { name: '80% còn lại (6 NV)', value: 20, fill: '#e5e7eb' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workload Chart */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Khối Lượng Công Việc Tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="workloadGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="workload"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#workloadGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Xu Hướng Hiệu Suất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Hiệu suất (%)"
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="throughput"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Throughput"
                    dot={{ fill: '#f59e0b', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sla"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="SLA (%)"
                    dot={{ fill: '#8b5cf6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Summary */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Tình Trạng Nhân Sự Real-time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Active Staff */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.staff.active}</div>
              <div className="text-sm text-gray-600">Đang hoạt động</div>
              <div className="mt-2">
                <Progress value={(metrics.staff.active / metrics.staff.total) * 100} size="sm" />
              </div>
            </div>

            {/* On Break */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-3">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.staff.onBreak}</div>
              <div className="text-sm text-gray-600">Đang nghỉ</div>
              <div className="mt-2">
                <Progress value={(metrics.staff.onBreak / metrics.staff.total) * 100} size="sm" />
              </div>
            </div>

            {/* Offline */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.staff.offline}</div>
              <div className="text-sm text-gray-600">Offline</div>
              <div className="mt-2">
                <Progress value={(metrics.staff.offline / metrics.staff.total) * 100} size="sm" />
              </div>
            </div>

            {/* Efficiency */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.performance.avgEfficiency}%</div>
              <div className="text-sm text-gray-600">Hiệu suất TB</div>
              <div className="mt-2">
                <Progress value={metrics.performance.avgEfficiency} size="sm" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===== SCHEDULE TAB CONTENT =====
  const ScheduleTab = () => (
    <div className="space-y-6">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lịch Làm Việc Tuần Này</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Thêm Ca
              </Button>
              <Button variant="primary" size="sm">
                <Zap className="w-4 h-4 mr-1" />
                Tự Động Phân Ca
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-900">Ngày</th>
                  <th className="text-left p-3 font-medium text-gray-900">Khối Lượng</th>
                  <th className="text-left p-3 font-medium text-gray-900">Ca Sáng</th>
                  <th className="text-left p-3 font-medium text-gray-900">Ca Chiều</th>
                  <th className="text-left p-3 font-medium text-gray-900">Trạng Thái</th>
                  <th className="text-left p-3 font-medium text-gray-900">Ghi Chú</th>
                </tr>
              </thead>
              <tbody>
                {weeklyData.map((day, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{day.day}</div>
                      <div className="text-sm text-gray-500">{day.orders} đơn</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Progress value={day.workload} className="flex-1" />
                        <span className="text-sm font-medium text-gray-900">{day.workload}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="primary">
                        {Math.floor(day.staff * 0.6)} người
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="success">
                        {Math.floor(day.staff * 0.4)} người
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={day.workload > 90 ? "warning" : "default"}>
                        {day.workload > 90 ? "Cao điểm" : "Bình thường"}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {day.specialEvent ? (
                        <Badge variant="error">{day.eventName}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===== PERFORMANCE TAB CONTENT =====
  const PerformanceTab = () => (
    <div className="space-y-6">
      {/* Performance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="SLA Compliance"
          value={`${metrics.orders.slaCompliance}%`}
          subtitle="đúng thời hạn"
          trend={{ direction: 'up', value: '+2.1%' }}
          icon={CheckCircle}
          color="green"
        />
        <MetricCard
          title="Throughput/Hour"
          value={`${metrics.performance.throughputPerHour}`}
          subtitle="đơn/giờ"
          trend={{ direction: 'up', value: '+5.2%' }}
          icon={Zap}
          color="blue"
        />
        <MetricCard
          title="Quality Score"
          value={`${metrics.performance.qualityScore}%`}
          subtitle="chất lượng"
          trend={{ direction: 'up', value: '+1.8%' }}
          icon={Award}
          color="purple"
        />
        <MetricCard
          title="Avg Process Time"
          value={`${metrics.orders.avgProcessingTime}h`}
          subtitle="thời gian TB"
          trend={{ direction: 'down', value: '-12%' }}
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pareto Analysis Chart */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Phân Tích Pareto - Hiệu Suất Nhân Viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={staff.regular
                    .sort((a, b) => b.efficiency - a.efficiency)
                    .map((s, index) => ({
                      name: s.name.split(' ').pop(),
                      efficiency: s.efficiency,
                      cumulative: staff.regular
                        .sort((a, b) => b.efficiency - a.efficiency)
                        .slice(0, index + 1)
                        .reduce((sum, emp) => sum + emp.efficiency, 0) / staff.regular.reduce((sum, emp) => sum + emp.efficiency, 0) * 100,
                      isTopPerformer: s.isTopPerformer
                    }))}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Bar
                    dataKey="efficiency"
                    fill={(entry) => entry?.isTopPerformer ? '#3b82f6' : '#e5e7eb'}
                    name="Hiệu suất (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Tích lũy (%)"
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Insight từ Pareto:</h4>
              <p className="text-sm text-blue-800">
                Top 20% nhân viên ({staff.regular.filter(s => s.isTopPerformer).length} người)
                đóng góp ~80% hiệu suất tổng thể. Tập trung đào tạo và động viên nhóm này.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Performance by Role */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Hiệu Suất Theo Vai Trò</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Picking', 'Packing', 'QC'].map(role => {
                const roleStaff = staff.regular.filter(s => s.role === role);
                const avgEfficiency = roleStaff.reduce((sum, s) => sum + s.efficiency, 0) / roleStaff.length;
                const topPerformersInRole = roleStaff.filter(s => s.isTopPerformer).length;

                return (
                  <div key={role} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{role}</h4>
                      <Badge variant={
                        avgEfficiency >= 90 ? 'success' :
                        avgEfficiency >= 80 ? 'warning' : 'error'
                      }>
                        {avgEfficiency.toFixed(1)}%
                      </Badge>
                    </div>
                    <Progress value={avgEfficiency} className="mb-2" />
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Số lượng: {roleStaff.length} người</span>
                        <span>Top performers: {topPerformersInRole}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Xu Hướng Hiệu Suất 7 Ngày</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Hiệu suất (%)"
                  dot={{ fill: '#10b981', r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Throughput"
                  dot={{ fill: '#3b82f6', r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="quality"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  name="Chất lượng (%)"
                  dot={{ fill: '#8b5cf6', r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="sla"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name="SLA (%)"
                  dot={{ fill: '#f59e0b', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Đề Xuất Cải Thiện (Dựa Trên Nguyên Tắc 20/80)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">✅ Tập Trung Top 20%</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Giao nhiệm vụ quan trọng cho top performers</li>
                  <li>• Tăng lương/thưởng để retention</li>
                  <li>• Cho mentor nhân viên mới</li>
                  <li>• Phân tích phương pháp làm việc để nhân rộng</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">📈 Nâng Cao 80% Còn Lại</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Đào tạo chéo kỹ năng</li>
                  <li>• Ghép đôi với top performers</li>
                  <li>• Thiết lập KPI cá nhân rõ ràng</li>
                  <li>• Feedback định kỳ hàng tuần</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">⚡ Tối Ưu Quy Trình</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Standardize phương pháp của top performers</li>
                  <li>• Automation các task lặp đi lặp lại</li>
                  <li>• Cải thiện layout kho theo frequency</li>
                  <li>• Implement lean management principles</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">📊 Monitoring & KPIs</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Real-time dashboard cho supervisors</li>
                  <li>• Weekly performance reviews</li>
                  <li>• Benchmark với industry standards</li>
                  <li>• Predictive analytics cho workforce planning</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===== ANALYTICS TAB CONTENT =====
  const AnalyticsTab = () => (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="ROI từ Top 20%"
          value="340%"
          subtitle="return on investment"
          trend={{ direction: 'up', value: '+45%' }}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Cost per Order"
          value="12,500 VND"
          subtitle="chi phí/đơn"
          trend={{ direction: 'down', value: '-8%' }}
          icon={Target}
          color="blue"
        />
        <MetricCard
          title="Productivity Index"
          value="127"
          subtitle="vs industry avg (100)"
          trend={{ direction: 'up', value: '+15%' }}
          icon={BarChart}
          color="purple"
        />
      </div>

      {/* Pareto Analysis */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Phân Tích Chi Tiết Theo Nguyên Tắc 20/80</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: 'Top 20% NV',
                        value: 80,
                        fill: '#3b82f6',
                        count: staff.regular.filter(s => s.isTopPerformer).length
                      },
                      {
                        name: '80% NV còn lại',
                        value: 20,
                        fill: '#e5e7eb',
                        count: staff.regular.filter(s => !s.isTopPerformer).length
                      }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent, count }) =>
                      `${name}: ${(percent * 100).toFixed(0)}% (${count} người)`
                    }
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Impact Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Orders handled by top 20%:</span>
                    <span className="font-semibold">~390 đơn/ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orders handled by 80% còn lại:</span>
                    <span className="font-semibold">~96 đơn/ngày</span>
                  </div>
                  <div className="flex justify-between text-blue-900 font-semibold">
                    <span>Efficiency ratio:</span>
                    <span>4:1</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Cost Optimization</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Training budget focus:</span>
                    <span className="font-semibold">80% → 80% NV</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retention budget focus:</span>
                    <span className="font-semibold">70% → Top 20%</span>
                  </div>
                  <div className="flex justify-between text-green-900 font-semibold">
                    <span>Expected ROI:</span>
                    <span>300%+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecasting */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Dự Báo Và Xu Hướng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: 'T1', current: 87, optimized: 87, target: 95 },
                    { month: 'T2', current: 89, optimized: 91, target: 95 },
                    { month: 'T3', current: 87, optimized: 93, target: 95 },
                    { month: 'T4', current: 88, optimized: 95, target: 95 },
                    { month: 'T5', current: 90, optimized: 97, target: 95 },
                    { month: 'T6', current: 91, optimized: 99, target: 95 }
                  ]}
                >
                  <defs>
                    <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="optimizedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} domain={[80, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="current"
                    stackId="1"
                    stroke="#ef4444"
                    fill="url(#currentGradient)"
                    name="Hiện tại"
                  />
                  <Area
                    type="monotone"
                    dataKey="optimized"
                    stackId="2"
                    stroke="#10b981"
                    fill="url(#optimizedGradient)"
                    name="Sau tối ưu"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Mục tiêu"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🎯 Kịch Bản Tối Ưu</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nếu tập trung top 20%:</span>
                    <span className="font-semibold text-green-600">+12% hiệu suất</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nếu đào tạo 80% còn lại:</span>
                    <span className="font-semibold text-blue-600">+8% hiệu suất</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Kết hợp cả hai:</span>
                    <span className="font-semibold text-purple-600">+18% hiệu suất</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">💰 Impact Tài Chính</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Tiết kiệm chi phí/tháng:</span>
                    <span className="font-semibold">45 triệu VND</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tăng throughput:</span>
                    <span className="font-semibold">+150 đơn/ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROI trong 6 tháng:</span>
                    <span className="font-semibold text-green-600">420%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  const StaffTab = () => (
    <div className="space-y-6">
      {/* Staff Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Nhân Viên Chính"
          value={staff.regular.length}
          subtitle="full-time"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Cộng Tác Viên"
          value={staff.partTime.length}
          subtitle="part-time"
          icon={User}
          color="green"
        />
        <MetricCard
          title="Top Performers"
          value={staff.regular.filter(s => s.isTopPerformer).length}
          subtitle="20% nhân viên xuất sắc"
          icon={Award}
          color="yellow"
        />
        <MetricCard
          title="Hiệu Suất TB"
          value={`${metrics.performance.avgEfficiency}%`}
          subtitle="toàn bộ nhân sự"
          icon={Target}
          color="purple"
        />
      </div>

      {/* Staff List */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Danh Sách Nhân Viên</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-1" />
                Tìm Kiếm
              </Button>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Thêm Nhân Viên
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 font-medium text-gray-900">Họ Tên</th>
                  <th className="text-left p-3 font-medium text-gray-900">Vai Trò</th>
                  <th className="text-left p-3 font-medium text-gray-900">Hiệu Suất</th>
                  <th className="text-left p-3 font-medium text-gray-900">Trạng Thái</th>
                  <th className="text-left p-3 font-medium text-gray-900">Ca Làm</th>
                  <th className="text-left p-3 font-medium text-gray-900">Phân Loại</th>
                  <th className="text-center p-3 font-medium text-gray-900">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {staff.regular.map((member) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.experience} tháng kinh nghiệm</div>
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        member.role === 'Picking' ? 'primary' :
                        member.role === 'Packing' ? 'success' : 'warning'
                      }>
                        {member.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Progress value={member.efficiency} className="w-16" />
                        <span className="text-sm font-medium">{member.efficiency}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={
                        member.status === 'active' ? 'success' :
                        member.status === 'break' ? 'warning' : 'error'
                      }>
                        {member.status === 'active' ? 'Hoạt động' :
                         member.status === 'break' ? 'Nghỉ' : 'Offline'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-gray-900">
                        {member.currentShift === 'morning' ? 'Ca sáng' : 'Ca chiều'}
                      </span>
                    </td>
                    <td className="p-3">
                      {member.isTopPerformer ? (
                        <Badge variant="success">Top 20%</Badge>
                      ) : (
                        <Badge variant="outline">Standard</Badge>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===== MAIN RENDER =====
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Dashboard Quản Lý Nhân Sự Kho Vận
                  </h1>
                  <p className="text-sm text-gray-500">
                    {currentDate} - Cập nhật lúc {refreshTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Real-time:</label>
                <input
                  type="checkbox"
                  checked={isRealTimeMode}
                  onChange={(e) => setIsRealTimeMode(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Làm mới
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Xuất báo cáo
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'schedule' && <ScheduleTab />}
          {activeTab === 'staff' && <StaffTab />}
          {activeTab === 'performance' && <PerformanceTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500">
            Dashboard Quản Lý Nhân Sự Kho Vận - Tối Ưu 2025 - Cao Vĩnh Phúc - {currentDate}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WarehouseDashboard;
