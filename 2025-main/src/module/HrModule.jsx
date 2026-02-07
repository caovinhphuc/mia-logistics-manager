import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  AlertTriangle,
  Users,
  BarChart2,
  Calendar,
  Filter,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Truck,
  Inbox,
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Map,
  PieChart,
  TrendingUp,
  User,
  List,
  Grid,
  FileText,
  Download,
  Eye,
  ArrowRight,
  ChevronUp,
  Sun,
  Moon,
  Zap,
  Check,
  X
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const HrModule = () => {
  // State chính cho dashboard
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSidebar, setShowSidebar] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showAllocationPanel, setShowAllocationPanel] = useState(false);
  const [showForecastPanel, setShowForecastPanel] = useState(false);

  // State cho dữ liệu
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [workloadForecast, setWorkloadForecast] = useState([]);
  const [staffPerformance, setStaffPerformance] = useState(null);

  // State cho bộ lọc
  const [filters, setFilters] = useState({
    channel: "all",
    transporter: "all",
    priority: "all",
    productType: "all",
    skuCount: "all",
    date: "today",
  });

  // State cho thống kê
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    p1Orders: 0,
    p2Orders: 0,
    slaRate: 95.5,
    avgOrderTime: 22, // phút
  });



  // Mô phỏng dữ liệu đơn hàng
  const mockOrders = [
    {
      id: "SO0405:123456",
      customer: "Shopee",
      channel: "Shopee",
      date: "2025-05-04T08:15:30",
      deadline: "2025-05-04T10:15:30",
      status: "pending",
      priority: "P1",
      detail: "Vali Larita 28L (1), Luggage Tag (2)",
      location: "A-12",
      transporter: "GHN Express",
    },
    {
      id: "SO0405:123457",
      customer: "TikTok Shop",
      channel: "TikTok",
      date: "2025-05-04T08:30:45",
      deadline: "2025-05-04T12:30:45",
      status: "processing",
      priority: "P2",
      detail: "Vali Pisani 24M (1)",
      location: "A-05",
      transporter: "J&T Express",
    },
    {
      id: "SO0405:123458",
      customer: "Lazada",
      channel: "Lazada",
      date: "2025-05-04T09:15:20",
      deadline: "2025-05-04T13:15:20",
      status: "pending",
      priority: "P2",
      detail: "Travel Neck Pillow (1), Travel Pouch (2)",
      location: "B-08",
      transporter: "Ninja Van",
    },
    {
      id: "SO0405:123459",
      customer: "Mia Online",
      channel: "Website",
      date: "2025-05-04T10:20:10",
      deadline: "2025-05-04T18:20:10",
      status: "pending",
      priority: "P3",
      detail: "Mia Cover (2), Pack-it Cube (1)",
      location: "B-15",
      transporter: "VNPost",
    },
    {
      id: "SO0405:123460",
      customer: "Shopee",
      channel: "Shopee",
      date: "2025-05-04T11:05:35",
      deadline: "2025-05-04T13:05:35",
      status: "pending",
      priority: "P1",
      detail: "Vali Larita 28L (1), Vali Larita 24M (1)",
      location: "A-12",
      transporter: "Shopee Express",
    },
    {
      id: "SO0405:123461",
      customer: "TikTok Shop",
      channel: "TikTok",
      date: "2025-05-04T11:30:40",
      deadline: "2025-05-04T15:30:40",
      status: "processing",
      priority: "P2",
      detail: "Herschel Backpack (1)",
      location: "C-04",
      transporter: "Best Express",
    },
  ];

  // Mô phỏng dữ liệu nhân viên
  const mockEmployees = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "senior",
      efficiency: 45,
      status: "active",
      currentOrders: 4,
      completedToday: 15,
      shift: "Ca sáng",
      skills: { picking: 90, packing: 85, qc: 70, logistics: 60 },
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "senior",
      efficiency: 42,
      status: "active",
      currentOrders: 3,
      completedToday: 12,
      shift: "Ca sáng",
      skills: { picking: 80, packing: 95, qc: 75, logistics: 50 },
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "regular",
      efficiency: 35,
      status: "break",
      currentOrders: 0,
      completedToday: 18,
      shift: "Ca sáng",
      skills: { picking: 75, packing: 70, qc: 90, logistics: 40 },
    },
    {
      id: 4,
      name: "Phạm Thị D",
      role: "regular",
      efficiency: 33,
      status: "active",
      currentOrders: 5,
      completedToday: 10,
      shift: "Ca sáng",
      skills: { picking: 85, packing: 60, qc: 80, logistics: 65 },
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      role: "junior",
      efficiency: 25,
      status: "active",
      currentOrders: 2,
      completedToday: 14,
      shift: "Ca chiều",
      skills: { picking: 70, packing: 65, qc: 60, logistics: 80 },
    },
  ];

  // Mô phỏng dữ liệu cảnh báo
  const mockAlerts = [
    {
      id: 1,
      type: "urgent",
      title: "Đơn sắp trễ hạn SLA",
      message: "Đơn SO0405:123456 còn 15 phút để hoàn thành",
      time: "09:30",
    },
    {
      id: 2,
      type: "warning",
      title: "Khu vực kho quá tải",
      message: "Khu vực A đang xử lý 15 đơn, vượt 30% công suất",
      time: "09:45",
    },
    {
      id: 3,
      type: "info",
      title: "Nhân viên hiệu suất cao",
      message: "Lê Văn C đã hoàn thành 18 đơn, vượt KPI 20%",
      time: "10:00",
    },
  ];

  // Mô phỏng dữ liệu hiệu suất theo giờ
  const hourlyPerformanceData = [
    { hour: "08:00", orders: 12, completed: 10, sla: 95 },
    { hour: "09:00", orders: 18, completed: 15, sla: 92 },
    { hour: "10:00", orders: 25, completed: 20, sla: 96 },
    { hour: "11:00", orders: 30, completed: 25, sla: 94 },
    { hour: "12:00", orders: 20, completed: 18, sla: 97 },
    { hour: "13:00", orders: 28, completed: 22, sla: 93 },
    { hour: "14:00", orders: 35, completed: 30, sla: 95 },
  ];

  // Dữ liệu dự báo khối lượng công việc 7 ngày
  const mockWorkloadForecast = [
    {
      date: "05/20",
      orders: 150,
      capacity: 160,
      p1: 35,
      p2: 65,
      p3: 50,
      picking: 70,
      packing: 45,
      qc: 35,
    },
    {
      date: "05/21",
      orders: 140,
      capacity: 160,
      p1: 30,
      p2: 60,
      p3: 50,
      picking: 65,
      packing: 40,
      qc: 35,
    },
    {
      date: "05/22",
      orders: 180,
      capacity: 160,
      p1: 45,
      p2: 80,
      p3: 55,
      picking: 80,
      packing: 55,
      qc: 45,
    },
    {
      date: "05/23",
      orders: 200,
      capacity: 180,
      p1: 50,
      p2: 90,
      p3: 60,
      picking: 90,
      packing: 60,
      qc: 50,
    },
    {
      date: "05/24",
      orders: 220,
      capacity: 190,
      p1: 55,
      p2: 100,
      p3: 65,
      picking: 100,
      packing: 65,
      qc: 55,
    },
    {
      date: "05/25",
      orders: 120,
      capacity: 160,
      p1: 25,
      p2: 50,
      p3: 45,
      picking: 55,
      packing: 35,
      qc: 30,
    },
    {
      date: "05/26",
      orders: 130,
      capacity: 160,
      p1: 30,
      p2: 55,
      p3: 45,
      picking: 60,
      packing: 40,
      qc: 30,
    },
  ];

  // Dữ liệu mẫu lịch làm việc
  const mockWorkSchedules = [
    {
      id: 1,
      employeeId: 1,
      date: "2025-05-20",
      shift: "Sáng",
      startTime: "08:00",
      endTime: "12:00",
      area: "Khu A - Vali",
      status: "confirmed",
    },
    {
      id: 2,
      employeeId: 1,
      date: "2025-05-20",
      shift: "Chiều",
      startTime: "13:00",
      endTime: "17:00",
      area: "Khu A - Vali",
      status: "confirmed",
    },
    {
      id: 3,
      employeeId: 2,
      date: "2025-05-20",
      shift: "Sáng",
      startTime: "08:00",
      endTime: "12:00",
      area: "Khu B - Phụ kiện",
      status: "confirmed",
    },
    {
      id: 4,
      employeeId: 2,
      date: "2025-05-20",
      shift: "Chiều",
      startTime: "13:00",
      endTime: "17:00",
      area: "Khu B - Phụ kiện",
      status: "confirmed",
    },
    {
      id: 5,
      employeeId: 3,
      date: "2025-05-20",
      shift: "Sáng",
      startTime: "08:00",
      endTime: "12:00",
      area: "Khu C - Đặc biệt",
      status: "confirmed",
    },
    {
      id: 6,
      employeeId: 4,
      date: "2025-05-20",
      shift: "Chiều",
      startTime: "13:00",
      endTime: "17:00",
      area: "Khu C - Đặc biệt",
      status: "confirmed",
    },
    {
      id: 7,
      employeeId: 5,
      date: "2025-05-20",
      shift: "Sáng",
      startTime: "08:00",
      endTime: "12:00",
      area: "Khu D - Vali cao cấp",
      status: "pending",
    },
  ];

  // Dữ liệu hiệu suất nhân viên
  const mockStaffPerformance = {
    todayStats: {
      totalCompletedOrders: 102,
      totalItems: 255,
      avgTimePerOrder: 18,
      slaCompliance: 97.5,
    },
    weeklyStats: {
      totalCompletedOrders: 712,
      totalItems: 1840,
      avgTimePerOrder: 19,
      slaCompliance: 96.2,
    },
    topPerformers: [
      { id: 1, name: "Nguyễn Văn A", completedOrders: 22, efficiency: 45 },
      { id: 3, name: "Lê Văn C", completedOrders: 18, efficiency: 35 },
      { id: 2, name: "Trần Thị B", completedOrders: 17, efficiency: 42 },
    ],
    bottlenecks: [
      { time: "10:00-11:00", area: "Khu A", congestion: 85 },
      { time: "14:00-15:00", area: "Khu B", congestion: 75 },
    ],
    paretoAnalysis: {
      topStaff: "20% nhân viên (5 người) xử lý 80% đơn hàng P1",
      topTime: "80% đơn được xử lý trong 20% thời gian (khung giờ cao điểm)",
      topProducts: "20% SKU chiếm 80% đơn hàng",
      topAreas: "20% vị trí kho được truy cập 80% thời gian",
    },
  };

  // Hook khởi tạo dữ liệu
  useEffect(() => {
    // Giả lập tải dữ liệu
    setOrders(mockOrders);
    setEmployees(mockEmployees);
    setAlerts(mockAlerts);
    setWorkloadForecast(mockWorkloadForecast);
    setStaffPerformance(mockStaffPerformance);

    // Tính toán thống kê
    setStats({
      totalOrders: mockOrders.length,
      pendingOrders: mockOrders.filter((o) => o.status === "pending").length,
      processingOrders: mockOrders.filter((o) => o.status === "processing")
        .length,
      completedOrders: mockOrders.filter(
        (o) => o.status === "completed" || Math.random() > 0.7
      ).length,
      p1Orders: mockOrders.filter((o) => o.priority === "P1").length,
      p2Orders: mockOrders.filter((o) => o.priority === "P2").length,
      slaRate: 95.5,
      avgOrderTime: 22,
    });
  }, []);

  // Hàm refresh dữ liệu
  const refreshData = () => {
    setIsRefreshing(true);

    // Giả lập thời gian tải
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());

      // Cập nhật một số giá trị ngẫu nhiên để mô phỏng dữ liệu thay đổi
      setStats((prev) => ({
        ...prev,
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 5),
        pendingOrders: prev.pendingOrders + Math.floor(Math.random() * 3) - 1,
        processingOrders:
          prev.processingOrders + Math.floor(Math.random() * 3) - 1,
        completedOrders: prev.completedOrders + Math.floor(Math.random() * 3),
        slaRate: Math.min(100, prev.slaRate + (Math.random() * 0.6 - 0.3)),
        avgOrderTime: Math.max(15, prev.avgOrderTime + (Math.random() * 2 - 1)),
      }));
    }, 1000);
  };

  // Hàm xử lý thay đổi bộ lọc
  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  // Hàm phân bổ tự động
  const autoAllocateOrders = () => {
    alert("Đã phân bổ đơn hàng tự động theo nguyên tắc 80/20");
  };

  // CSS động cho chế độ tối/sáng
  const themeClass = darkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gray-100 text-gray-900";
  const cardClass = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const headerClass = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const sidebarClass = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const buttonPrimaryClass = darkMode
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-blue-500 hover:bg-blue-600 text-white";
  const buttonSecondaryClass = darkMode
    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
    : "bg-gray-200 hover:bg-gray-300 text-gray-800";
  const inputClass = darkMode
    ? "bg-gray-700 border-gray-600 text-gray-100"
    : "bg-white border-gray-300 text-gray-900";
  const tabActiveClass = darkMode
    ? "bg-gray-700 text-blue-400"
    : "bg-blue-50 text-blue-600";
  const tabInactiveClass = darkMode
    ? "text-gray-400 hover:text-gray-300"
    : "text-gray-600 hover:text-gray-900";

  // Tab Tổng Quan
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Tổng đơn</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-20">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> +5% so với hôm qua
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Đơn P1 (Gấp)</p>
              <p className="text-2xl font-bold text-red-500">
                {stats.p1Orders}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-500 bg-opacity-20">
              <Clock className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-orange-500">
              <Clock className="h-3 w-3 mr-1" />{" "}
              {Math.round((stats.p1Orders / stats.totalOrders) * 100)}% tổng đơn
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Tỷ lệ đạt SLA</p>
              <p className="text-2xl font-bold text-green-500">
                {stats.slaRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> +1.2% so với hôm qua
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Thời gian xử lý TB</p>
              <p className="text-2xl font-bold text-purple-500">
                {Math.round(stats.avgOrderTime)} phút
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-500 bg-opacity-20">
              <Activity className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> -3 phút so với hôm qua
            </span>
          </div>
        </div>
      </div>

      {/* Biểu đồ hiệu suất */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`lg:col-span-2 p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Hiệu suất xử lý đơn theo giờ
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyPerformanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="hour"
                  stroke={darkMode ? "#9ca3af" : "#4b5563"}
                />
                <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                    color: darkMode ? "#f9fafb" : "#111827",
                  }}
                />
                <Legend />
                <Bar dataKey="orders" name="Tổng đơn" fill="#3b82f6" />
                <Bar dataKey="completed" name="Hoàn thành" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">Phân bổ đơn theo SLA</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPieChart>
                <Pie
                  data={[
                    { name: "P1 - Gấp", value: stats.p1Orders },
                    { name: "P2 - Cảnh báo", value: stats.p2Orders },
                    {
                      name: "P3 - Bình thường",
                      value:
                        stats.totalOrders - stats.p1Orders - stats.p2Orders - 1,
                    },
                    { name: "P4 - Chờ xử lý", value: 1 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#10b981" />
                  <Cell fill="#3b82f6" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                    color: darkMode ? "#f9fafb" : "#111827",
                  }}
                />
              </RechartPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cảnh báo và hoạt động */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass} lg:col-span-2`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Đơn cần xử lý ưu tiên</h3>
            <button
              className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
            >
              Xem tất cả
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Mã đơn
                  </th>
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Kênh
                  </th>
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    SLA
                  </th>
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Deadline
                  </th>
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Trạng thái
                  </th>
                  <th className="py-2 text-center text-xs font-medium text-gray-400">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(
                    (order) =>
                      order.priority === "P1" && order.status !== "completed"
                  )
                  .slice(0, 4)
                  .map((order, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2 text-sm">{order.id}</td>
                      <td className="py-2 text-sm">{order.channel}</td>
                      <td className="py-2 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-red-500 bg-opacity-20 text-red-400">
                          {order.priority}
                        </span>
                      </td>
                      <td className="py-2 text-sm">
                        {new Date(order.deadline).toLocaleTimeString("vi-VN")}
                      </td>
                      <td className="py-2 text-sm">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            order.status === "pending"
                              ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                              : order.status === "processing"
                              ? "bg-blue-500 bg-opacity-20 text-blue-400"
                              : "bg-green-500 bg-opacity-20 text-green-400"
                          }`}
                        >
                          {order.status === "pending"
                            ? "Chờ xử lý"
                            : order.status === "processing"
                            ? "Đang xử lý"
                            : "Hoàn thành"}
                        </span>
                      </td>
                      <td className="py-2 flex justify-center space-x-1">
                        <button
                          className="p-1 text-blue-400 hover:text-blue-300"
                          title="Chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1 text-green-400 hover:text-green-300"
                          title="Phân công"
                        >
                          <Users size={16} />
                        </button>
                        <button
                          className="p-1 text-purple-400 hover:text-purple-300"
                          title="In đơn"
                        >
                          <FileText size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Cảnh báo hoạt động</h3>
            <button
              className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
            >
              Quản lý
            </button>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === "urgent"
                    ? "bg-red-900 bg-opacity-20 border-red-600"
                    : alert.type === "warning"
                    ? "bg-yellow-900 bg-opacity-20 border-yellow-600"
                    : "bg-blue-900 bg-opacity-20 border-blue-600"
                }`}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    {alert.type === "urgent" ? (
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    ) : alert.type === "warning" ? (
                      <Bell className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-xs opacity-75 mt-1">{alert.message}</p>
                  </div>
                </div>
                <div className="mt-1 text-right text-xs opacity-75">
                  {alert.time}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-center">
            <button
              className={`px-3 py-1 rounded text-xs ${buttonSecondaryClass}`}
            >
              Xem tất cả cảnh báo
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Tab Quản Lý Nhân Sự
  const renderStaffTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">
          Quản lý nhân sự theo nguyên tắc 80/20
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <Filter className="h-4 w-4 mr-1" /> Lọc nhân viên
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonPrimaryClass}`}
          >
            <User className="h-4 w-4 mr-1" /> Thêm nhân viên
          </button>
        </div>
      </div>

      {/* Dashboard hiệu suất nhân viên */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className={`lg:col-span-2 p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Hiệu suất nhân viên hôm nay
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={employees.map((emp) => ({
                  name: emp.name,
                  efficiency: emp.efficiency,
                  completed: emp.completedToday,
                  target: 15,
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="name"
                  stroke={darkMode ? "#9ca3af" : "#4b5563"}
                />
                <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                    color: darkMode ? "#f9fafb" : "#111827",
                  }}
                />
                <Legend />
                <Bar dataKey="completed" name="Đơn hoàn thành" fill="#3b82f6" />
                <Bar dataKey="target" name="Mục tiêu" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">Phân tích Pareto</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-900 bg-opacity-10 rounded-lg">
              <h4 className="font-medium text-blue-400 text-sm mb-1">
                80% công việc được xử lý bởi 20% nhân viên
              </h4>
              <p className="text-sm">
                {staffPerformance?.paretoAnalysis.topStaff}
              </p>
            </div>
            <div className="p-3 bg-green-900 bg-opacity-10 rounded-lg">
              <h4 className="font-medium text-green-400 text-sm mb-1">
                80% đơn trong 20% thời gian
              </h4>
              <p className="text-sm">
                {staffPerformance?.paretoAnalysis.topTime}
              </p>
            </div>
            <div className="p-3 bg-purple-900 bg-opacity-10 rounded-lg">
              <h4 className="font-medium text-purple-400 text-sm mb-1">
                80% đơn hàng là 20% SKU
              </h4>
              <p className="text-sm">
                {staffPerformance?.paretoAnalysis.topProducts}
              </p>
            </div>
            <div className="p-3 bg-orange-900 bg-opacity-10 rounded-lg">
              <h4 className="font-medium text-orange-400 text-sm mb-1">
                Sử dụng 20% vị trí kho 80% thời gian
              </h4>
              <p className="text-sm">
                {staffPerformance?.paretoAnalysis.topAreas}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng nhân viên */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Danh sách nhân viên</h3>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                className={`pl-8 pr-4 py-1 rounded-lg text-sm w-48 lg:w-64 ${inputClass}`}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <select className={`p-1.5 rounded text-sm ${inputClass}`}>
              <option value="all">Tất cả vai trò</option>
              <option value="senior">Senior</option>
              <option value="regular">Regular</option>
              <option value="junior">Junior</option>
            </select>

            <select className={`p-1.5 rounded text-sm ${inputClass}`}>
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang làm việc</option>
              <option value="break">Giải lao</option>
              <option value="inactive">Ngừng làm việc</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 text-left text-xs font-medium text-gray-400">
                  Nhân viên
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400">
                  Vai trò
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400">
                  Hiệu suất
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400">
                  Tải hiện tại
                </th>
                <th className="py-3 text-left text-xs font-medium text-gray-400">
                  Đơn hoàn thành
                </th>
                <th className="py-3 text-center text-xs font-medium text-gray-400">
                  Kỹ năng
                </th>
                <th className="py-3 text-center text-xs font-medium text-gray-400">
                  Trạng thái
                </th>
                <th className="py-3 text-center text-xs font-medium text-gray-400">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-700 ${
                    index < Math.ceil(employees.length * 0.2)
                      ? "bg-blue-900 bg-opacity-10"
                      : ""
                  }`}
                >
                  <td className="py-2 text-sm font-medium">
                    {emp.name}
                    {index < Math.ceil(employees.length * 0.2) && (
                      <span className="ml-1 text-xs text-blue-400">
                        (Top 20%)
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        emp.role === "senior"
                          ? "bg-purple-500 bg-opacity-20 text-purple-400"
                          : emp.role === "regular"
                          ? "bg-blue-500 bg-opacity-20 text-blue-400"
                          : "bg-green-500 bg-opacity-20 text-green-400"
                      }`}
                    >
                      {emp.role === "senior"
                        ? "Senior"
                        : emp.role === "regular"
                        ? "Regular"
                        : "Junior"}
                    </span>
                  </td>
                  <td className="py-2 text-sm">{emp.efficiency} đơn/giờ</td>
                  <td className="py-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-700 rounded-full h-1.5 mr-2">
                        <div
                          className={`h-1.5 rounded-full ${
                            emp.currentOrders / 10 > 0.8
                              ? "bg-red-500"
                              : emp.currentOrders / 10 > 0.6
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{
                            width: `${(emp.currentOrders / 10) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {emp.currentOrders}/10
                      </span>
                    </div>
                  </td>
                  <td className="py-2 text-sm">{emp.completedToday} đơn</td>
                  <td className="py-2">
                    <div className="flex space-x-1 justify-center">
                      <div
                        className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-xs"
                        title="Picking"
                      >
                        P
                      </div>
                      <div
                        className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center text-xs"
                        title="Packing"
                      >
                        B
                      </div>
                      <div
                        className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-xs"
                        title="QC"
                      >
                        Q
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        emp.status === "active"
                          ? "bg-green-500 bg-opacity-20 text-green-400"
                          : emp.status === "break"
                          ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                          : "bg-gray-500 bg-opacity-20 text-gray-400"
                      }`}
                    >
                      {emp.status === "active"
                        ? "Đang làm việc"
                        : emp.status === "break"
                        ? "Giải lao"
                        : "Ngừng làm việc"}
                    </span>
                  </td>
                  <td className="py-2 flex justify-center space-x-1">
                    <button
                      className="p-1 text-blue-400 hover:text-blue-300"
                      title="Chi tiết"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-1 text-green-400 hover:text-green-300"
                      title="Phân công"
                    >
                      <Calendar size={16} />
                    </button>
                    <button
                      className="p-1 text-purple-400 hover:text-purple-300"
                      title="Chỉnh sửa"
                    >
                      <Settings size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Radar Chart kỹ năng */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-3">
          Phân tích kỹ năng nhân viên
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Hiển thị biểu đồ radar của các kỹ năng quan trọng theo nguyên tắc
          80/20
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <h4 className="text-md font-medium mb-2">Top 20% nhân viên</h4>
            <div className="flex-1 min-h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[
                    { name: "Picking", value: 90 },
                    { name: "Packing", value: 85 },
                    { name: "QC", value: 70 },
                    { name: "Xử lý đơn P1", value: 95 },
                    { name: "Đa nhiệm", value: 80 },
                  ]}
                  margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#374151" : "#e5e7eb"}
                  />
                  <XAxis
                    type="number"
                    stroke={darkMode ? "#9ca3af" : "#4b5563"}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke={darkMode ? "#9ca3af" : "#4b5563"}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#374151" : "#ffffff",
                      borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                      color: darkMode ? "#f9fafb" : "#111827",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="text-md font-medium mb-2">Phân tích Pareto</h4>
            <div className="bg-gray-800 rounded-lg p-4 flex-1">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">
                    20% nhân viên xử lý 78% đơn P1
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">
                    Nhân viên senior có hiệu suất cao hơn 45% so với junior
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">
                    Kỹ năng picking chiếm 60% thời gian xử lý đơn
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm">
                    Nhân viên đa kỹ năng có thể xử lý đơn nhanh hơn 35%
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">
                    78% lỗi phát sinh từ 22% quy trình
                  </span>
                </li>
              </ul>

              <div className="mt-6">
                <h5 className="text-sm font-medium mb-2">Đề xuất tối ưu</h5>
                <div className="p-3 bg-blue-900 bg-opacity-10 rounded border border-blue-800">
                  <p className="text-sm">
                    Phân công 4 nhân viên top 20% vào khung giờ cao điểm
                    10:00-12:00 và 14:00-16:00 để tối ưu hiệu suất
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tab Lịch Làm Việc
  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">
          Lịch làm việc & Phân ca tự động
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <Calendar className="h-4 w-4 mr-1" /> Tạo ca mới
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonPrimaryClass}`}
          >
            <Zap className="h-4 w-4 mr-1" /> Phân ca tự động
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <Download className="h-4 w-4 mr-1" /> Xuất lịch
          </button>
        </div>
      </div>

      {/* Dự báo khối lượng công việc */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-3">
          Dự báo khối lượng công việc & nhu cầu nhân sự
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={workloadForecast}
              margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? "#374151" : "#e5e7eb"}
              />
              <XAxis dataKey="date" stroke={darkMode ? "#9ca3af" : "#4b5563"} />
              <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#374151" : "#ffffff",
                  borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                  color: darkMode ? "#f9fafb" : "#111827",
                }}
              />
              <Legend />
              <Bar dataKey="orders" name="Tổng đơn" fill="#3b82f6" />
              <Bar dataKey="capacity" name="Công suất" fill="#10b981" />
              <Line
                type="monotone"
                dataKey="capacity"
                name="Công suất tối đa"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-3 rounded-lg ${
              workloadForecast[3]?.orders > workloadForecast[3]?.capacity
                ? "bg-red-900 bg-opacity-10 border border-red-800"
                : "bg-green-900 bg-opacity-10 border border-green-800"
            }`}
          >
            <h4 className="text-md font-medium mb-1">Ngày mai (21/05)</h4>
            <div className="flex justify-between text-sm mb-1">
              <span>Dự báo đơn:</span>
              <span className="font-medium">
                {workloadForecast[1]?.orders} đơn
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Công suất hiện tại:</span>
              <span className="font-medium">
                {workloadForecast[1]?.capacity} đơn
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Nhu cầu nhân sự:</span>
              <span className="font-medium">
                {Math.ceil(workloadForecast[1]?.orders / 12)} nhân viên
              </span>
            </div>
          </div>

          <div
            className={`p-3 rounded-lg ${
              workloadForecast[3]?.orders > workloadForecast[3]?.capacity
                ? "bg-red-900 bg-opacity-10 border border-red-800"
                : "bg-green-900 bg-opacity-10 border border-green-800"
            }`}
          >
            <h4 className="text-md font-medium mb-1">Ngày cao điểm (23/05)</h4>
            <div className="flex justify-between text-sm mb-1">
              <span>Dự báo đơn:</span>
              <span className="font-medium">
                {workloadForecast[3]?.orders} đơn
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Công suất hiện tại:</span>
              <span className="font-medium">
                {workloadForecast[3]?.capacity} đơn
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Nhu cầu nhân sự:</span>
              <span className="font-medium">
                {Math.ceil(workloadForecast[3]?.orders / 12)} nhân viên
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-blue-900 bg-opacity-10 border border-blue-800">
            <h4 className="text-md font-medium mb-1">Phân tích 80/20</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span>23-24/05: Ngày cao điểm (80% khối lượng)</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>Khung 10-12h, 14-16h: Cao điểm trong ngày</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span>Cần 100% nhân sự ngày cao điểm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lịch làm việc */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Lịch làm việc tuần này</h3>
          <div className="flex items-center gap-2">
            <button className={`p-1.5 rounded ${buttonSecondaryClass}`}>
              <ArrowRight className="h-4 w-4 transform rotate-180" />
            </button>
            <span className="text-sm">20/05 - 26/05/2025</span>
            <button className={`p-1.5 rounded ${buttonSecondaryClass}`}>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Nhân viên
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 2 (20/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 3 (21/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 4 (22/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 5 (23/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 6 (24/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  Thứ 7 (25/05)
                </th>
                <th className="border border-gray-700 p-2 text-xs font-medium text-gray-400">
                  CN (26/05)
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-700 p-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">
                        {employee.name.split(" ").pop().charAt(0)}
                      </div>
                      <span>{employee.name}</span>
                    </div>
                  </td>

                  {[...Array(7)].map((_, dayIdx) => {
                    // Mô phỏng ca làm việc
                    const hasShift = Math.random() > 0.3;
                    const isFullDay = Math.random() > 0.5;
                    const isHighDemandDay = dayIdx === 3 || dayIdx === 4; // 23, 24/05
                    const isTopEmployee =
                      idx < Math.ceil(employees.length * 0.2);

                    // Ưu tiên phân ca nhân viên hiệu suất cao vào ngày cao điểm
                    const assignedToHighDemandDay =
                      isHighDemandDay && (isTopEmployee || Math.random() > 0.3);

                    return (
                      <td
                        key={dayIdx}
                        className="border border-gray-700 p-1 text-center relative"
                      >
                        {hasShift || assignedToHighDemandDay ? (
                          <div>
                            {isFullDay ? (
                              <div
                                className={`p-1 text-xs rounded ${
                                  isHighDemandDay
                                    ? "bg-red-900 bg-opacity-20 text-red-400"
                                    : "bg-blue-900 bg-opacity-20 text-blue-400"
                                }`}
                              >
                                Ca Full: 08:00 - 17:00
                              </div>
                            ) : (
                              <>
                                <div className="p-1 text-xs rounded bg-blue-900 bg-opacity-20 text-blue-400 mb-1">
                                  Ca sáng: 08:00 - 12:00
                                </div>
                                {isHighDemandDay && isTopEmployee && (
                                  <div className="p-1 text-xs rounded bg-purple-900 bg-opacity-20 text-purple-400">
                                    Ca chiều: 13:00 - 17:00
                                  </div>
                                )}
                              </>
                            )}

                            <div className="mt-1 text-xs">
                              {isHighDemandDay ? "Khu A, B" : "Khu C, D"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Nghỉ</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thống kê phân ca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Thống kê phân ca theo kỹ năng
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPieChart>
                <Pie
                  data={[
                    { name: "Picking", value: 45 },
                    { name: "Packing", value: 30 },
                    { name: "QC", value: 15 },
                    { name: "Logistics", value: 10 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#8b5cf6" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                    color: darkMode ? "#f9fafb" : "#111827",
                  }}
                />
              </RechartPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Bảng phân tích Pareto (80/20)
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Phân bổ nhân sự theo hiệu suất:</span>
                <span>80/20</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>20% nhân viên hiệu suất cao</span>
                <span>80% công việc</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Phân bổ thời gian:</span>
                <span>80/20</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>20% thời gian (giờ cao điểm)</span>
                <span>80% đơn hàng</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Phân bổ khu vực kho:</span>
                <span>75/25</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>25% khu vực kho</span>
                <span>75% hoạt động picking</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-900 bg-opacity-10 rounded border border-blue-800">
              <h4 className="text-sm font-medium mb-2">Đề xuất tối ưu:</h4>
              <ul className="text-sm space-y-1">
                <li>• Tập trung 80% nhân viên senior vào khung giờ cao điểm</li>
                <li>• Bố trí 20% nhân viên hiệu suất cao cho 80% đơn P1</li>
                <li>• Cân đối tỷ lệ Picking/Packing/QC: 45%/30%/15%</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tab Hiệu Suất
  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">
          Phân tích hiệu suất kho vận
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <Filter className="h-4 w-4 mr-1" /> Bộ lọc
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonPrimaryClass}`}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
            />{" "}
            Làm mới
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <Download className="h-4 w-4 mr-1" /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Đơn hôm nay</p>
              <p className="text-2xl font-bold">
                {staffPerformance?.todayStats.totalCompletedOrders}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-20">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> +8% so với hôm qua
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Sản phẩm xử lý</p>
              <p className="text-2xl font-bold">
                {staffPerformance?.todayStats.totalItems}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-500 bg-opacity-20">
              <Package className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% so với hôm qua
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Thời gian TB/đơn</p>
              <p className="text-2xl font-bold">
                {staffPerformance?.todayStats.avgTimePerOrder} phút
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-500 bg-opacity-20">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> -5% so với hôm qua
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-70">Tỷ lệ đạt SLA</p>
              <p className="text-2xl font-bold">
                {staffPerformance?.todayStats.slaCompliance}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-500 bg-opacity-20">
              <CheckCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="flex mt-2 text-xs">
            <span className="flex items-center text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" /> +1.3% so với hôm qua
            </span>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Hiệu suất xử lý theo ngày
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { date: "14/05", orders: 75, target: 80 },
                  { date: "15/05", orders: 82, target: 80 },
                  { date: "16/05", orders: 95, target: 80 },
                  { date: "17/05", orders: 88, target: 80 },
                  { date: "18/05", orders: 65, target: 80 },
                  { date: "19/05", orders: 78, target: 80 },
                  { date: "20/05", orders: 102, target: 80 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="date"
                  stroke={darkMode ? "#9ca3af" : "#4b5563"}
                />
                <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                    color: darkMode ? "#f9fafb" : "#111827",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  name="Đơn xử lý"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Mục tiêu"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <h3 className="text-lg font-medium mb-3">
            Phân tích hiệu suất theo vai trò
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Picking", productivity: 85, target: 80, gap: 5 },
                  { name: "Packing", productivity: 90, target: 80, gap: 10 },
                  { name: "QC", productivity: 75, target: 80, gap: -5 },
                  { name: "Logistics", productivity: 78, target: 80, gap: -2 },
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#374151" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="name"
                  stroke={darkMode ? "#9ca3af" : "#4b5563"}
                />
                <YAxis stroke={darkMode ? "#9ca3af" : "#4b5563"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                    color: darkMode ? "#f9fafb" : "#111827",
                  }}
                />
                <Legend />
                <Bar dataKey="productivity" name="Hiệu suất" fill="#3b82f6" />
                <Bar dataKey="target" name="Mục tiêu" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performers & Bottlenecks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border ${cardClass} lg:col-span-2`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              Top 3 nhân viên hiệu suất cao (20%)
            </h3>
            <button
              className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-3">
            {staffPerformance?.topPerformers.map((performer, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-medium mr-3">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium">{performer.name}</div>
                    <div className="text-xs text-gray-400">
                      {performer.efficiency} đơn/giờ
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <div className="font-medium">
                      {performer.completedOrders} đơn
                    </div>
                    <div className="text-xs text-gray-400">
                      hoàn thành hôm nay
                    </div>
                  </div>

                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      idx === 0
                        ? "bg-yellow-500 bg-opacity-20 text-yellow-300"
                        : idx === 1
                        ? "bg-gray-500 bg-opacity-20 text-gray-300"
                        : "bg-orange-500 bg-opacity-20 text-orange-300"
                    }`}
                  >
                    {idx === 0
                      ? "Top 1 🥇"
                      : idx === 1
                      ? "Top 2 🥈"
                      : "Top 3 🥉"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${cardClass}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Điểm nghẽn (Bottlenecks)</h3>
            <button
              className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
            >
              Phân tích
            </button>
          </div>

          <div className="space-y-3">
            {staffPerformance?.bottlenecks.map((bottleneck, idx) => (
              <div
                key={idx}
                className="p-3 bg-red-900 bg-opacity-10 border-l-4 border-red-600 rounded-r-lg"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{bottleneck.area}</span>
                  <span className="text-xs px-2 py-0.5 bg-red-500 bg-opacity-20 text-red-400 rounded-full">
                    {bottleneck.congestion}% tải
                  </span>
                </div>
                <div className="text-sm">{bottleneck.time}</div>

                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-red-500 h-1.5 rounded-full"
                      style={{ width: `${bottleneck.congestion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-3 bg-blue-900 bg-opacity-10 border border-blue-800 rounded-lg mt-4">
              <h4 className="text-sm font-medium mb-2">Đề xuất giải pháp:</h4>
              <ul className="text-xs space-y-1">
                <li>• Tăng cường 2 nhân viên cho Khu A (10:00-11:00)</li>
                <li>• Điều chỉnh quy trình picking khu B (14:00-15:00)</li>
                <li>• Ứng dụng nguyên tắc 80/20 phân bổ nhân sự</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Pareto Analysis */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-4">
          Phân tích Pareto chi tiết (80/20)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                Phân tích nhân sự theo hiệu suất
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { percent: 0, value: 0 },
                      { percent: 20, value: 80 },
                      { percent: 40, value: 88 },
                      { percent: 60, value: 93 },
                      { percent: 80, value: 97 },
                      { percent: 100, value: 100 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? "#374151" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="percent"
                      label={{
                        value: "% Nhân viên",
                        position: "insideBottomRight",
                        offset: -10,
                      }}
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                    />
                    <YAxis
                      label={{
                        value: "% Đơn hàng",
                        angle: -90,
                        position: "insideLeft",
                      }}
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#374151" : "#ffffff",
                        borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                        color: darkMode ? "#f9fafb" : "#111827",
                      }}
                      formatter={(value, name) => [
                        `${value}%`,
                        "Tỷ lệ đơn hàng",
                      ]}
                      labelFormatter={(value) => `${value}% nhân viên`}
                    />
                    <ReferenceLine
                      x={20}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                    />
                    <ReferenceLine
                      y={80}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f640"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                20% nhân viên (Top 5) xử lý 80% khối lượng đơn hàng
              </p>
            </div>

            <div className="p-3 bg-blue-900 bg-opacity-10 border border-blue-800 rounded-lg">
              <h4 className="text-sm font-medium mb-2">
                Yếu tố hiệu suất cao:
              </h4>
              <ul className="text-xs space-y-1">
                <li>• Đa kỹ năng (picking, packing, QC)</li>
                <li>• Kinh nghiệm &gt; 6 tháng</li>
                <li>• Thành thạo quy trình xử lý đơn P1</li>
                <li>• Khả năng làm việc đa nhiệm</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                Phân tích thời gian xử lý đơn
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { percent: 0, value: 0 },
                      { percent: 20, value: 70 },
                      { percent: 40, value: 85 },
                      { percent: 60, value: 92 },
                      { percent: 80, value: 97 },
                      { percent: 100, value: 100 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={darkMode ? "#374151" : "#e5e7eb"}
                    />
                    <XAxis
                      dataKey="percent"
                      label={{
                        value: "% Quy trình",
                        position: "insideBottomRight",
                        offset: -10,
                      }}
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                    />
                    <YAxis
                      label={{
                        value: "% Thời gian",
                        angle: -90,
                        position: "insideLeft",
                      }}
                      stroke={darkMode ? "#9ca3af" : "#4b5563"}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? "#374151" : "#ffffff",
                        borderColor: darkMode ? "#4b5563" : "#e5e7eb",
                        color: darkMode ? "#f9fafb" : "#111827",
                      }}
                      formatter={(value, name) => [
                        `${value}%`,
                        "Tỷ lệ thời gian",
                      ]}
                      labelFormatter={(value) => `${value}% quy trình`}
                    />
                    <ReferenceLine
                      x={20}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                    />
                    <ReferenceLine
                      y={70}
                      stroke="#ef4444"
                      strokeDasharray="3 3"
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      fill="#10b98140"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                20% quy trình chiếm 70% thời gian xử lý đơn
              </p>
            </div>

            <div className="p-3 bg-blue-900 bg-opacity-10 border border-blue-800 rounded-lg">
              <h4 className="text-sm font-medium mb-2">
                Quy trình tốn thời gian nhất:
              </h4>
              <ul className="text-xs space-y-1">
                <li>• Tìm kiếm vị trí sản phẩm (35% thời gian)</li>
                <li>• Kiểm tra đơn hàng đặc biệt (20% thời gian)</li>
                <li>• Đối chiếu số lượng sản phẩm (15% thời gian)</li>
                <li>• Xử lý đơn từ khu vực xa (10% thời gian)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tab Cài Đặt
  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">Cài đặt hệ thống</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonSecondaryClass}`}
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Khôi phục mặc định
          </button>
          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${buttonPrimaryClass}`}
          >
            <CheckCircle className="h-4 w-4 mr-1" /> Lưu cài đặt
          </button>
        </div>
      </div>

      {/* General Settings */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-4">Cài đặt chung</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Chế độ hiển thị
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={darkMode}
                  onChange={() => setDarkMode(true)}
                />
                <span>Tối</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={!darkMode}
                  onChange={() => setDarkMode(false)}
                />
                <span>Sáng</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tự động làm mới dữ liệu
            </label>
            <div className="flex items-center">
              <select className={`p-2 rounded mr-2 w-40 ${inputClass}`}>
                <option value="30">30 giây</option>
                <option value="60">1 phút</option>
                <option value="300">5 phút</option>
                <option value="600">10 phút</option>
                <option value="0">Tắt</option>
              </select>
              <span className="text-sm text-gray-400">
                Cập nhật lần cuối: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ngôn ngữ</label>
            <select className={`p-2 rounded w-full ${inputClass}`}>
              <option value="vi">Tiếng Việt</option>
              <option value="en">Tiếng Anh</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Múi giờ</label>
            <select className={`p-2 rounded w-full ${inputClass}`}>
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
              <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
              <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SLA Settings */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-4">Cài đặt SLA</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              P1 - Gấp (thời gian xử lý tối đa)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className={`p-2 rounded w-20 ${inputClass}`}
                value="2"
              />
              <span className="ml-2">giờ</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Áp dụng cho đơn hàng ưu tiên cao nhất
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              P2 - Cảnh báo (thời gian xử lý tối đa)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className={`p-2 rounded w-20 ${inputClass}`}
                value="4"
              />
              <span className="ml-2">giờ</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Áp dụng cho đơn hàng ưu tiên trung bình
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              P3 - Bình thường (thời gian xử lý tối đa)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className={`p-2 rounded w-20 ${inputClass}`}
                value="8"
              />
              <span className="ml-2">giờ</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Áp dụng cho đơn hàng ưu tiên thấp
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              P4 - Chờ xử lý (thời gian xử lý tối đa)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                className={`p-2 rounded w-20 ${inputClass}`}
                value="24"
              />
              <span className="ml-2">giờ</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Áp dụng cho đơn hàng không ưu tiên
            </p>
          </div>
        </div>
      </div>

      {/* Pareto Principle Settings */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            Cài đặt nguyên tắc 80/20 Pareto
          </h3>
          <button
            className={`px-2 py-1 rounded text-xs ${buttonSecondaryClass}`}
          >
            Đặt lại
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tỷ lệ phân bổ nhân viên (Top 20%)
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="10"
                max="30"
                step="5"
                className="w-full"
                value="20"
              />
              <span className="ml-2 w-8">20%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              % nhân viên hiệu suất cao được ưu tiên phân công
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tỷ lệ khối lượng công việc
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="70"
                max="90"
                step="5"
                className="w-full"
                value="80"
              />
              <span className="ml-2 w-8">80%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              % khối lượng công việc được phân cho nhóm hiệu suất cao
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tỷ lệ Picking/Packing/QC
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                className={`p-2 rounded w-16 ${inputClass}`}
                value="45"
              />
              <span>/</span>
              <input
                type="number"
                className={`p-2 rounded w-16 ${inputClass}`}
                value="30"
              />
              <span>/</span>
              <input
                type="number"
                className={`p-2 rounded w-16 ${inputClass}`}
                value="15"
              />
              <span>%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Tỷ lệ phân bổ nhân sự theo vai trò (10% còn lại: Logistics)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Hiệu suất tối ưu
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="70"
                max="100"
                step="5"
                className="w-full"
                value="85"
              />
              <span className="ml-2 w-8">85%</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              % hiệu suất tối ưu sau phân ca (đảm bảo dự phòng 15%)
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-900 bg-opacity-10 rounded border border-blue-800">
          <h4 className="text-sm font-medium mb-2">
            Lưu ý về nguyên tắc 80/20:
          </h4>
          <ul className="text-sm space-y-1">
            <li>
              • Phân bổ top 20% nhân viên để xử lý 80% khối lượng công việc quan
              trọng
            </li>
            <li>• Tối ưu hóa 20% quy trình chiếm 80% thời gian xử lý</li>
            <li>• Tập trung vào 20% khu vực kho được sử dụng 80% thời gian</li>
            <li>• Khung giờ cao điểm (20% thời gian) phát sinh 80% đơn hàng</li>
          </ul>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`p-4 rounded-lg border ${cardClass}`}>
        <h3 className="text-lg font-medium mb-4">Cài đặt thông báo</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" checked />
              <span>Thông báo khi đơn hàng trễ deadline</span>
            </label>
            <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
              <option value="immediately">Ngay lập tức</option>
              <option value="5min">5 phút trước</option>
              <option value="15min">15 phút trước</option>
              <option value="30min">30 phút trước</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" checked />
              <span>Thông báo khi khu vực kho quá tải</span>
            </label>
            <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
              <option value="80">Trên 80%</option>
              <option value="90">Trên 90%</option>
              <option value="100">Trên 100%</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" checked />
              <span>Thông báo khi nhân viên đạt hiệu suất cao</span>
            </label>
            <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Thông báo khi có sự kiện đặc biệt</span>
            </label>
            <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
              <option value="1day">1 ngày trước</option>
              <option value="3days">3 ngày trước</option>
              <option value="1week">1 tuần trước</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Thông báo email các báo cáo tổng hợp</span>
            </label>
            <select className={`p-1.5 rounded text-sm w-32 ${inputClass}`}>
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
              <option value="monthly">Hàng tháng</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // Layout chính
  return (
    <div className={`min-h-screen ${themeClass}`}>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-10 border-b ${headerClass}`}
      >
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <button
              className="lg:hidden mr-2 text-gray-400 hover:text-gray-300"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <List className="w-6 h-6" />
            </button>
            <div className="flex items-center">
              <Package className="h-6 w-6 text-blue-500 mr-2" />
              <span className="font-bold text-lg">Dashboard SLA Kho Vận</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                className={`pl-8 pr-4 py-1 rounded-lg text-sm w-48 lg:w-64 ${inputClass}`}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <button className="p-1.5 rounded-full relative text-gray-400 hover:text-gray-300">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            <button
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-300"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                TP
              </div>
              <span className="ml-2 hidden lg:block">Trưởng phòng</span>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex space-x-1 px-4 pb-1 overflow-x-auto">
          <button
            className={`px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${
              activeTab === "overview" ? tabActiveClass : tabInactiveClass
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart2 className="w-4 h-4 mr-1" /> Tổng quan
          </button>
          <button
            className={`px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${
              activeTab === "staff" ? tabActiveClass : tabInactiveClass
            }`}
            onClick={() => setActiveTab("staff")}
          >
            <Users className="w-4 h-4 mr-1" /> Quản lý nhân sự
          </button>
          <button
            className={`px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${
              activeTab === "schedule" ? tabActiveClass : tabInactiveClass
            }`}
            onClick={() => setActiveTab("schedule")}
          >
            <Calendar className="w-4 h-4 mr-1" /> Lịch làm việc
          </button>
          <button
            className={`px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${
              activeTab === "performance" ? tabActiveClass : tabInactiveClass
            }`}
            onClick={() => setActiveTab("performance")}
          >
            <Activity className="w-4 h-4 mr-1" /> Hiệu suất
          </button>
          <button
            className={`px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${
              activeTab === "settings" ? tabActiveClass : tabInactiveClass
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-4 h-4 mr-1" /> Cài đặt
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-20 h-full w-64 transform transition-transform duration-200 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 pt-28 pb-4 border-r ${sidebarClass}`}
      >
        <div className="h-full flex flex-col p-4">
          <div className="mb-4">
            <h3 className="text-xs uppercase font-semibold opacity-50 mb-2">
              Bộ lọc
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm block mb-1">Kênh bán hàng</label>
                <select
                  className={`w-full p-2 rounded text-sm ${inputClass}`}
                  value={filters.channel}
                  onChange={(e) =>
                    handleFilterChange("channel", e.target.value)
                  }
                >
                  <option value="all">Tất cả kênh</option>
                  <option value="Shopee">Shopee</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Lazada">Lazada</option>
                  <option value="Website">Website</option>
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">Đơn vị vận chuyển</label>
                <select
                  className={`w-full p-2 rounded text-sm ${inputClass}`}
                  value={filters.transporter}
                  onChange={(e) =>
                    handleFilterChange("transporter", e.target.value)
                  }
                >
                  <option value="all">Tất cả ĐVVC</option>
                  <option value="GHN">GHN</option>
                  <option value="Shopee">Shopee Express</option>
                  <option value="J&T">J&T Express</option>
                  <option value="Ninja">Ninja Van</option>
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">Mức ưu tiên</label>
                <select
                  className={`w-full p-2 rounded text-sm ${inputClass}`}
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                >
                  <option value="all">Tất cả</option>
                  <option value="P1">P1 - Gấp</option>
                  <option value="P2">P2 - Cảnh báo</option>
                  <option value="P3">P3 - Bình thường</option>
                  <option value="P4">P4 - Chờ xử lý</option>
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">Loại sản phẩm</label>
                <select
                  className={`w-full p-2 rounded text-sm ${inputClass}`}
                  value={filters.productType}
                  onChange={(e) =>
                    handleFilterChange("productType", e.target.value)
                  }
                >
                  <option value="all">Tất cả</option>
                  <option value="vali-only">Chỉ vali</option>
                  <option value="mixed">Mix vali</option>
                  <option value="no-vali">Không vali</option>
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">Số lượng SKU</label>
                <select
                  className={`w-full p-2 rounded text-sm ${inputClass}`}
                  value={filters.skuCount}
                  onChange={(e) =>
                    handleFilterChange("skuCount", e.target.value)
                  }
                >
                  <option value="all">Tất cả</option>
                  <option value="single">1 SKU/đơn</option>
                  <option value="multiple">Nhiều SKU/đơn</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs uppercase font-semibold opacity-50 mb-2">
              Thống kê nhanh
            </h3>
            <div className="space-y-2">
              <div className={`p-3 rounded-lg ${cardClass}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Đơn đang chờ</span>
                  <span className="text-lg font-semibold">
                    {stats.pendingOrders}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${cardClass}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Đơn đang xử lý</span>
                  <span className="text-lg font-semibold">
                    {stats.processingOrders}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${cardClass}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Đơn hoàn thành</span>
                  <span className="text-lg font-semibold">
                    {stats.completedOrders}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs uppercase font-semibold opacity-50 mb-2">
              Phân tích 80/20
            </h3>
            <div className="space-y-2">
              <div
                className={`p-3 rounded-lg bg-blue-900 bg-opacity-10 text-sm border border-blue-700`}
              >
                <div className="font-medium mb-1">Top 20% nhân viên</div>
                <div>Xử lý 80% đơn P1</div>
              </div>
              <div
                className={`p-3 rounded-lg bg-green-900 bg-opacity-10 text-sm border border-green-700`}
              >
                <div className="font-medium mb-1">20% thời gian</div>
                <div>Phát sinh 80% khối lượng</div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-xs uppercase font-semibold opacity-50 mb-2">
              Hệ thống
            </h3>
            <div className="space-y-2">
              <button
                className={`w-full text-sm p-2 rounded text-left flex items-center ${buttonSecondaryClass}`}
                onClick={() => autoAllocateOrders()}
              >
                <Zap className="w-4 h-4 mr-2" /> Phân bổ tự động
              </button>
              <button
                className={`w-full text-sm p-2 rounded text-left flex items-center ${buttonSecondaryClass}`}
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="w-4 h-4 mr-2" /> Cài đặt
              </button>
              <button
                className={`w-full text-sm p-2 rounded text-left flex items-center ${buttonSecondaryClass}`}
              >
                <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`pt-32 pb-8 ${
          showSidebar ? "lg:ml-64" : ""
        } px-4 md:px-6 transition-all duration-200`}
      >
        {/* Date & filters bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Quản lý kho vận theo SLA</h1>
            <p className="text-sm opacity-70">
              Ngày 20/05/2025 - Áp dụng nguyên tắc 80/20
            </p>
          </div>

          <div className="flex space-x-2 mt-2 md:mt-0">
            <div>
              <select
                className={`p-2 rounded text-sm ${inputClass}`}
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              >
                <option value="today">Hôm nay</option>
                <option value="yesterday">Hôm qua</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
              </select>
            </div>
            <button
              className={`p-2 rounded flex items-center ${buttonSecondaryClass}`}
            >
              <Filter className="w-4 h-4 mr-1" /> Lọc nâng cao
            </button>
            <button
              className={`p-2 rounded ${buttonPrimaryClass} flex items-center`}
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "staff" && renderStaffTab()}
        {activeTab === "schedule" && renderScheduleTab()}
        {activeTab === "performance" && renderPerformanceTab()}
        {activeTab === "settings" && renderSettingsTab()}
      </main>

      {/* Footer */}
      <footer
        className={`fixed bottom-0 left-0 right-0 ${headerClass} border-t py-2 px-4 text-xs opacity-70 text-center`}
      >
        Dashboard SLA & Phân Bổ Đơn Hàng | Phiên bản 1.0 | 20/05/2025 | Trưởng
        phòng kho vận MIA
      </footer>
    </div>
  );
};

export default HrModule;
