import React, { useState, useEffect, useRef } from "react";
import OrderStaffAllocation from "../src/components/OrderStaffAllocation";

import {
  Package,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  User,
  Activity,
  MapPin,
  BarChart2,
  Filter,
  Search,
  ArrowRight,
  Zap,
  Settings,
  Calendar,
  List,
  Check,
  X,
  Printer,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Upload,
  FileUp,
  File,
  Trash,
  PlusCircle,
  Edit,
  Save,
  Sliders,
  Bell,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Clock8,
  ClipboardList,
  Layers,
  Table,
  BarChart,
  HelpCircle,
  ChevronsRight,
  UserPlus,
  Archive,
  Clipboard,
  Award,
  PieChart,
} from "lucide-react";

const WarehouseDashboard = () => {
  // State

  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filePreviewData, setFilePreviewData] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importMessages, setImportMessages] = useState([]);
  const [slaSettings, setSlaSettings] = useState({
    p1Threshold: 2,
    p2Threshold: 4,
    p3Threshold: 8,
    alertThreshold: 1,
    peakHoursStart: "08:00",
    peakHoursEnd: "18:00",
    peakHoursP1Threshold: 1.5,
    autoAssignEnabled: true,
    maxOrdersPerStaff: 8,
    maxP1OrdersPerStaff: 3,
    prioritizeLocation: true,
    balanceWorkload: true,
  });

  const [view, setView] = useState(null); // Khai báo state để điều khiển view
  const renderView = () => {
    if (view === "order") {
      return (
        <section className="mt-6 border rounded-lg p-4 shadow bg-white">
          <OrderStaffAllocation />
        </section>
      );
    }
    return null;
  };

  // Statistics data
  const [stats, setStats] = useState({
    totalOrders: 145,
    pendingOrders: 87,
    processingOrders: 42,
    completedOrders: 16,
    p1Orders: 12,
    p2Orders: 24,
    staffUtilization: 78,
    avgPickingTime: 3.5,
    slaCompliance: 97,
    autoAllocationSuccess: 95,
  });

  // Sample staff data
  const [staffPerformance, setStaffPerformance] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Trưởng ca",
      efficiency: 98,
      orders: 25,
      p1Count: 4,
      status: "busy",
      skills: ["vali", "balo", "đóng gói"],
      area: "A",
      maxCapacity: 10,
      currentLoad: 5,
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Nhân viên",
      efficiency: 95,
      orders: 22,
      p1Count: 5,
      status: "busy",
      skills: ["vali", "phụ kiện"],
      area: "B",
      maxCapacity: 8,
      currentLoad: 7,
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Nhân viên",
      efficiency: 88,
      orders: 18,
      p1Count: 3,
      status: "busy",
      skills: ["balo", "phụ kiện"],
      area: "C",
      maxCapacity: 8,
      currentLoad: 6,
    },
    {
      id: 4,
      name: "Phạm Thị D",
      role: "Nhân viên",
      efficiency: 92,
      orders: 20,
      p1Count: 0,
      status: "available",
      skills: ["vali", "QC", "đóng gói"],
      area: "A",
      maxCapacity: 9,
      currentLoad: 4,
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      role: "Nhân viên",
      efficiency: 90,
      orders: 15,
      p1Count: 1,
      status: "available",
      skills: ["balo", "phụ kiện"],
      area: "B",
      maxCapacity: 7,
      currentLoad: 2,
    },
  ]);

  // Sample order data
  const [priorityOrders, setPriorityOrders] = useState([
    {
      id: "SO11032025:0845550",
      location: "HN-20-15-PD02",
      timeLeft: "01:25:18",
      sla: "P1",
      detail: "Valinice Yari ID2041_24 M Orange(1)",
      status: "pending",
      productType: "vali",
      complexity: "đơn giản",
      assignedTo: null,
      suggestedStaff: 2,
      priority: 95,
    },
    {
      id: "SO11032025:0845552",
      location: "290-B-05-A2",
      timeLeft: "01:45:32",
      sla: "P1",
      detail: "Balore Rio BR0224_23 M Black(1), Mia Luggage Tag S Black(1)",
      status: "pending",
      productType: "mix",
      complexity: "trung bình",
      assignedTo: null,
      suggestedStaff: 1,
      priority: 92,
    },
    {
      id: "SO11032025:0845554",
      location: "300-C-01-A4",
      timeLeft: "03:18:45",
      sla: "P2",
      detail: "Cerave Kem dưỡng ẩm 7ml S Blue/White(3)",
      status: "pending",
      productType: "phụ kiện",
      complexity: "đơn giản",
      assignedTo: null,
      suggestedStaff: 3,
      priority: 85,
    },
    {
      id: "SO11032025:0845556",
      location: "HN-15-10-PD05",
      timeLeft: "03:40:22",
      sla: "P2",
      detail: "Valinice Vera VB0324_24 M Blue(1)",
      status: "pending",
      productType: "vali",
      complexity: "đơn giản",
      assignedTo: null,
      suggestedStaff: 4,
      priority: 82,
    },
    {
      id: "SO11032025:0845558",
      location: "300-D-02-A1",
      timeLeft: "04:15:33",
      sla: "P3",
      detail:
        "Balore Zaino BK0125_16 S Black(1), Mia Pack-it shoes bag II S Orange(1)",
      status: "pending",
      productType: "mix",
      complexity: "trung bình",
      assignedTo: null,
      suggestedStaff: 5,
      priority: 78,
    },
    {
      id: "SO11032025:0845560",
      location: "290-A-03-B2",
      timeLeft: "05:25:10",
      sla: "P3",
      detail: "The Travel Star Clearguard Cover_20 S Black(2)",
      status: "pending",
      productType: "phụ kiện",
      complexity: "đơn giản",
      assignedTo: null,
      suggestedStaff: 3,
      priority: 70,
    },
    {
      id: "SO11032025:0845562",
      location: "HN-22-14-PD03",
      timeLeft: "07:40:52",
      sla: "P3",
      detail:
        'Valinice Verna VB0323_24 M Green(1), The Travel Star Sleeve Pad 15" M Black(1)',
      status: "pending",
      productType: "mix",
      complexity: "trung bình",
      assignedTo: null,
      suggestedStaff: 1,
      priority: 65,
    },
    {
      id: "SO11032025:0845564",
      location: "500-Z-03-00",
      timeLeft: "09:30:20",
      sla: "P4",
      detail: "Larita Rota MG0324_28 L Blue(1)",
      status: "pending",
      productType: "vali",
      complexity: "đơn giản",
      assignedTo: null,
      suggestedStaff: 4,
      priority: 50,
    },
  ]);

  // Sample order processing history
  const [orderProcessingHistory, setOrderProcessingHistory] = useState([
    {
      orderId: "SO11032025:0845550",
      events: [
        {
          timestamp: new Date(2025, 2, 22, 9, 30, 15),
          status: "created",
          description: "Đơn hàng được tạo",
          staff: null,
        },
        {
          timestamp: new Date(2025, 2, 22, 9, 32, 45),
          status: "assigned",
          description: "Phân công cho Nguyễn Văn A",
          staff: "Nguyễn Văn A",
        },
        {
          timestamp: new Date(2025, 2, 22, 9, 40, 20),
          status: "picking_started",
          description: "Bắt đầu lấy hàng",
          staff: "Nguyễn Văn A",
        },
        {
          timestamp: new Date(2025, 2, 22, 9, 46, 10),
          status: "picking_completed",
          description: "Hoàn thành lấy hàng",
          staff: "Nguyễn Văn A",
        },
      ],
      currentStatus: "picking_completed",
      timeStarted: new Date(2025, 2, 22, 9, 40, 20),
      timeCompleted: new Date(2025, 2, 22, 9, 46, 10),
    },
    {
      orderId: "SO11032025:0845552",
      events: [
        {
          timestamp: new Date(2025, 2, 22, 9, 35, 10),
          status: "created",
          description: "Đơn hàng được tạo",
          staff: null,
        },
        {
          timestamp: new Date(2025, 2, 22, 9, 38, 25),
          status: "assigned",
          description: "Phân công cho Trần Thị B",
          staff: "Trần Thị B",
        },
        {
          timestamp: new Date(2025, 2, 22, 9, 42, 35),
          status: "picking_started",
          description: "Bắt đầu lấy hàng",
          staff: "Trần Thị B",
        },
      ],
      currentStatus: "picking_started",
      timeStarted: new Date(2025, 2, 22, 9, 42, 35),
      timeCompleted: null,
    },
    {
      orderId: "SO11032025:0845554",
      events: [
        {
          timestamp: new Date(2025, 2, 22, 9, 40, 22),
          status: "created",
          description: "Đơn hàng được tạo",
          staff: null,
        },
        {
          timestamp: new Date(2025, 2, 22, 9, 43, 15),
          status: "assigned",
          description: "Phân công cho Lê Văn C",
          staff: "Lê Văn C",
        },
      ],
      currentStatus: "assigned",
      timeStarted: null,
      timeCompleted: null,
    },
    {
      orderId: "SO11032025:0845556",
      events: [
        {
          timestamp: new Date(2025, 2, 22, 9, 45, 30),
          status: "created",
          description: "Đơn hàng được tạo",
          staff: null,
        },
      ],
      currentStatus: "created",
      timeStarted: null,
      timeCompleted: null,
    },
  ]);

  // Function to refresh the dashboard data
  const refreshData = () => {
    setRefreshing(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      // Update statistics
      setStats((prev) => ({
        ...prev,
        pendingOrders: prev.pendingOrders + Math.floor(Math.random() * 5) - 2,
        processingOrders:
          prev.processingOrders + Math.floor(Math.random() * 3) - 1,
        completedOrders: prev.completedOrders + Math.floor(Math.random() * 2),
        p1Orders: prev.p1Orders + Math.floor(Math.random() * 3) - 1,
        staffUtilization: Math.min(
          100,
          Math.max(
            60,
            prev.staffUtilization + Math.floor(Math.random() * 5) - 2
          )
        ),
      }));

      // Update staff data
      setStaffPerformance((prev) =>
        prev.map((staff) => ({
          ...staff,
          efficiency: Math.min(
            100,
            Math.max(80, staff.efficiency + Math.floor(Math.random() * 2) - 1)
          ),
          orders: staff.orders + (Math.random() > 0.7 ? 1 : 0),
          currentLoad: Math.min(
            staff.maxCapacity,
            Math.max(0, staff.currentLoad + Math.floor(Math.random() * 2) - 1)
          ),
        }))
      );

      // Update order data
      setPriorityOrders((prev) =>
        prev.map((order) => ({
          ...order,
          timeLeft: updateTimeLeft(order.timeLeft),
          priority: Math.max(
            1,
            Math.min(
              99,
              order.priority +
                (Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0)
            )
          ),
        }))
      );

      setRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  // Update time left for SLA
  const updateTimeLeft = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    let totalSeconds =
      hours * 3600 + minutes * 60 + seconds - Math.floor(Math.random() * 60);
    if (totalSeconds < 0) totalSeconds = 0;

    const newHours = Math.floor(totalSeconds / 3600);
    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
    const newSeconds = totalSeconds % 60;

    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;
  };

  // Update SLA settings
  const updateSLASettings = (key, value) => {
    setSlaSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);

    // Parse and preview first file
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          // Simple parsing for preview based on file type
          const fileType = file.name.split(".").pop().toLowerCase();
          let previewData = {};

          if (fileType === "json") {
            previewData = {
              type: "json",
              data: JSON.parse(event.target.result).slice(0, 5),
              columns: Object.keys(JSON.parse(event.target.result)[0] || {}),
            };
          } else if (fileType === "csv") {
            const lines = event.target.result.split("\n");
            const headers = lines[0].split(",");
            const rows = lines.slice(1, 6).map((line) => line.split(","));
            previewData = {
              type: "csv",
              data: rows,
              columns: headers,
            };
          } else {
            previewData = {
              type: "unknown",
              data: "Preview not available",
              columns: [],
            };
          }

          setFilePreviewData(previewData);
        } catch (error) {
          console.error("Error parsing file:", error);
          setFilePreviewData({
            type: "error",
            data: "Error parsing file",
            columns: [],
          });
        }
      };

      if (file.type === "application/json") {
        reader.readAsText(file);
      } else if (file.type === "text/csv") {
        reader.readAsText(file);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        // For XLSX files, just show file info without parsing
        setFilePreviewData({
          type: "xlsx",
          data: `Excel file (${file.size} bytes)`,
          columns: [],
        });
      } else {
        setFilePreviewData({
          type: "unsupported",
          data: "Unsupported file type",
          columns: [],
        });
      }
    }
  };

  // Process file upload
  const processFileUpload = () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessingFile(true);

    // Simulate processing
    setTimeout(() => {
      // Generate some sample results
      const newOrders = Math.floor(Math.random() * 10) + 5;
      const duplicates = Math.floor(Math.random() * 3);
      const errors = Math.floor(Math.random() * 2);

      setImportMessages(
        [
          `Đã nhập ${newOrders} đơn hàng mới`,
          duplicates > 0 ? `Phát hiện ${duplicates} đơn trùng lặp` : null,
          errors > 0 ? `${errors} lỗi trong quá trình nhập` : null,
        ].filter(Boolean)
      );

      setImportSuccess(true);
      setIsProcessingFile(false);

      // Update order stats to reflect new imports
      setStats((prev) => ({
        ...prev,
        totalOrders: prev.totalOrders + newOrders,
        pendingOrders: prev.pendingOrders + newOrders,
      }));
    }, 2000);
  };

  // Add a sample processing event
  const addProcessingEvent = (orderId, status, staff = null) => {
    const description = getStatusDescription(status);
    const timestamp = new Date();

    setOrderProcessingHistory((prev) => {
      return prev.map((order) => {
        if (order.orderId === orderId) {
          const updatedEvents = [
            ...order.events,
            {
              timestamp,
              status,
              description,
              staff:
                staff?.name ||
                order.events[order.events.length - 1]?.staff ||
                null,
            },
          ];

          let timeStarted = order.timeStarted;
          let timeCompleted = order.timeCompleted;

          if (status === "picking_started") {
            timeStarted = timestamp;
          } else if (status === "picking_completed" || status === "completed") {
            timeCompleted = timestamp;
          }

          return {
            ...order,
            events: updatedEvents,
            currentStatus: status,
            timeStarted,
            timeCompleted,
          };
        }
        return order;
      });
    });
  };

  // Get description for status updates
  const getStatusDescription = (status) => {
    switch (status) {
      case "created":
        return "Đơn hàng được tạo";
      case "assigned":
        return "Phân công nhân viên";
      case "picking_started":
        return "Bắt đầu lấy hàng";
      case "picking_completed":
        return "Hoàn thành lấy hàng";
      case "packing_started":
        return "Bắt đầu đóng gói";
      case "packing_completed":
        return "Hoàn thành đóng gói";
      case "qc_started":
        return "Bắt đầu kiểm tra chất lượng";
      case "qc_completed":
        return "Hoàn thành kiểm tra chất lượng";
      case "completed":
        return "Đơn hàng hoàn thành";
      case "cancelled":
        return "Đơn hàng bị hủy";
      case "issue_detected":
        return "Phát hiện vấn đề";
      default:
        return "Cập nhật trạng thái";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "created":
        return "bg-gray-100 text-gray-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "picking_started":
        return "bg-yellow-100 text-yellow-800";
      case "picking_completed":
        return "bg-green-100 text-green-800";
      case "packing_started":
        return "bg-yellow-100 text-yellow-800";
      case "packing_completed":
        return "bg-green-100 text-green-800";
      case "qc_started":
        return "bg-purple-100 text-purple-800";
      case "qc_completed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "issue_detected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format duration in minutes and seconds
  const formatDuration = (startDate, endDate) => {
    if (!startDate) return "-";

    const end = endDate || new Date();
    const diffMs = end - new Date(startDate);
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffSeconds = Math.floor((diffMs % 60000) / 1000);

    const newLocal = `${diffMinutes}m ${diffSeconds}s`;
    return newLocal;
  };

  // Use effect for auto refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshData, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold">Hệ thống Quản lý Kho Vận</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Cập nhật: {lastUpdated.toLocaleTimeString()}
            </div>

            <button
              className={`px-3 py-1.5 rounded text-sm flex items-center ${
                refreshing
                  ? "bg-gray-100 text-gray-500"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
              onClick={refreshData}
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Đang cập nhật" : "Cập nhật"}
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-sm">Tự động:</span>
              <button
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                  autoRefresh ? "bg-blue-600" : "bg-gray-200"
                }`}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <span
                  className={`inline-block w-4 h-4 transform transition rounded-full bg-white ${
                    autoRefresh ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <button
              className="px-3 py-1.5 rounded text-sm bg-green-50 text-green-600 hover:bg-green-100 flex items-center"
              onClick={() => setShowFileUploadModal(true)}
            >
              <Upload className="h-4 w-4 mr-1" />
              Tải lên
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "dashboard"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <div className="flex items-center">
              <BarChart className="h-4 w-4 mr-1" />
              <span>Tổng quan</span>
            </div>
          </button>

          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "orders"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-1" />
              <span>Quản lý đơn</span>
            </div>
          </button>

          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "processing"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("processing")}
          >
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              <span>Theo dõi xử lý</span>
            </div>
          </button>

          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "staff"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("staff")}
          >
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>Nhân viên</span>
            </div>
          </button>

          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "settings"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-1" />
              <span>Cài đặt</span>
            </div>
          </button>
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Tổng đơn hàng</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {stats.pendingOrders} chờ xử lý | {stats.processingOrders}{" "}
                  đang xử lý | {stats.completedOrders} hoàn thành
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Đơn SLA gấp</p>
                    <p className="text-2xl font-bold text-red-600">
                      {stats.p1Orders}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <span className="text-red-600 font-medium">
                    {stats.p1Orders}
                  </span>{" "}
                  đơn P1 |
                  <span className="text-yellow-600 font-medium ml-1">
                    {stats.p2Orders}
                  </span>{" "}
                  đơn P2
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Hiệu suất nhân viên</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.staffUtilization}%
                    </p>
                  </div>
                  <User className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      stats.staffUtilization > 90
                        ? "bg-red-500"
                        : stats.staffUtilization > 75
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${stats.staffUtilization}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Thời gian xử lý TB</p>
                    <p className="text-2xl font-bold">
                      {stats.avgPickingTime} phút
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  SLA tuân thủ:{" "}
                  <span className="font-medium text-green-600">
                    {stats.slaCompliance}%
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-medium mb-3">Thao tác nhanh</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  className="p-3 border rounded-lg hover:bg-blue-50 text-sm flex flex-col items-center justify-center"
                  onClick={() => setView("order")}
                >
                  <Package className="h-6 w-6 text-blue-500 mb-1" />
                  <span>Quản lý đơn hàng</span>
                </button>

                <button
                  className="p-3 border rounded-lg hover:bg-blue-50 text-sm flex flex-col items-center justify-center"
                  onClick={() => setShowFileUploadModal(true)}
                >
                  <Upload className="h-6 w-6 text-blue-500 mb-1" />
                  <span>Tải lên danh sách đơn</span>
                </button>

                <button className="p-3 border rounded-lg hover:bg-blue-50 text-sm flex flex-col items-center justify-center">
                  <Printer className="h-6 w-6 text-blue-500 mb-1" />
                  <span>In đơn hàng</span>
                </button>

                <button className="p-3 border rounded-lg hover:bg-blue-50 text-sm flex flex-col items-center justify-center">
                  <Download className="h-6 w-6 text-blue-500 mb-1" />
                  <span>Xuất báo cáo</span>
                </button>
              </div>
            </div>

            {/* Recent Orders & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium">Đơn hàng gần đây</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã đơn
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SLA
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thời gian
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {priorityOrders.slice(0, 5).map((order) => (
                        <tr
                          key={order.id}
                          className={order.sla === "P1" ? "bg-red-50" : ""}
                        >
                          <td className="px-3 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {order.id}
                            </div>
                            <div
                              className="text-xs text-gray-500 truncate"
                              style={{ maxWidth: "200px" }}
                            >
                              {order.detail}
                            </div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                order.sla === "P1"
                                  ? "bg-red-100 text-red-800"
                                  : order.sla === "P2"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.sla === "P3"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {order.sla}
                            </span>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                            {order.timeLeft}
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                order.status === "pending"
                                  ? "bg-gray-100 text-gray-800"
                                  : order.status === "assigned"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "processing"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                              }`}
                            >
                              {order.status === "pending"
                                ? "Chờ xử lý"
                                : order.status === "assigned"
                                  ? "Đã phân công"
                                  : order.status === "processing"
                                    ? "Đang xử lý"
                                    : "Hoàn thành"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 border-t">
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <span>Xem tất cả đơn hàng</span>
                    <ChevronsRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium">Hoạt động gần đây</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {orderProcessingHistory.slice(0, 3).flatMap((order) =>
                      order.events.slice(-1).map((event, index) => (
                        <div key={`${order.orderId}-${index}`} className="flex">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            {event.status === "assigned" ? (
                              <User className="h-5 w-5 text-blue-600" />
                            ) : event.status === "picking_started" ? (
                              <Play className="h-5 w-5 text-yellow-600" />
                            ) : event.status === "picking_completed" ? (
                              <Check className="h-5 w-5 text-green-600" />
                            ) : (
                              <Package className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-medium">
                                {order.orderId}
                              </span>
                              <span className="text-gray-500">
                                {" "}
                                - {event.description}
                              </span>
                              {event.staff && (
                                <span className="text-gray-500">
                                  {" "}
                                  bởi {event.staff}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {event.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="p-3 border-t">
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <span>Xem tất cả hoạt động</span>
                    <ChevronsRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Tracking Tab */}
        {activeTab === "processing" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Theo dõi xử lý đơn hàng</h2>

              <div className="flex space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng..."
                    className="pl-8 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                <div className="relative">
                  <select className="appearance-none bg-white border rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="created">Mới tạo</option>
                    <option value="assigned">Đã phân công</option>
                    <option value="picking">Đang lấy hàng</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                  <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Processing Tracking Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SLA
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian bắt đầu
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian xử lý
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderProcessingHistory.map((order) => {
                    // Find corresponding order details
                    const orderDetails =
                      priorityOrders.find((o) => o.id === order.orderId) || {};

                    return (
                      <tr
                        key={order.orderId}
                        className={orderDetails.sla === "P1" ? "bg-red-50" : ""}
                      >
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderId}
                          </div>
                          <div className="text-xs text-gray-500">
                            {orderDetails.detail}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {orderDetails.sla && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                orderDetails.sla === "P1"
                                  ? "bg-red-100 text-red-800"
                                  : orderDetails.sla === "P2"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : orderDetails.sla === "P3"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {orderDetails.sla}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.currentStatus)}`}
                          >
                            {getStatusDescription(order.currentStatus)}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          {order.timeStarted
                            ? new Date(order.timeStarted).toLocaleTimeString()
                            : "-"}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDuration(
                            order.timeStarted,
                            order.timeCompleted
                          )}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.events[order.events.length - 1]?.staff ||
                              "-"}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="Chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {order.currentStatus === "created" && (
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                title="Phân công nhân viên"
                                onClick={() =>
                                  addProcessingEvent(
                                    order.orderId,
                                    "assigned",
                                    staffPerformance[0]
                                  )
                                }
                              >
                                <UserPlus className="h-4 w-4" />
                              </button>
                            )}

                            {order.currentStatus === "assigned" && (
                              <button
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Bắt đầu lấy hàng"
                                onClick={() =>
                                  addProcessingEvent(
                                    order.orderId,
                                    "picking_started"
                                  )
                                }
                              >
                                <Play className="h-4 w-4" />
                              </button>
                            )}

                            {order.currentStatus === "picking_started" && (
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Hoàn thành lấy hàng"
                                onClick={() =>
                                  addProcessingEvent(
                                    order.orderId,
                                    "picking_completed"
                                  )
                                }
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}

                            {[
                              "picking_completed",
                              "packing_completed",
                              "qc_completed",
                            ].includes(order.currentStatus) && (
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Hoàn thành đơn hàng"
                                onClick={() =>
                                  addProcessingEvent(order.orderId, "completed")
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Processing Timeline */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium mb-4">
                Lịch sử xử lý chi tiết
              </h3>

              <div className="flex space-x-3 mb-4">
                <div className="relative">
                  <select
                    className="appearance-none bg-white border rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={orderProcessingHistory[0]?.orderId}
                  >
                    {orderProcessingHistory.map((order) => (
                      <option key={order.orderId} value={order.orderId}>
                        {order.orderId}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="h-4 w-4 absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="relative pl-8">
                <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200"></div>

                {orderProcessingHistory[0].events.map((event, index) => (
                  <div key={index} className="mb-4 relative">
                    <div
                      className={`absolute left-4 top-1 w-4 h-4 rounded-full transform -translate-x-1/2 ${
                        event.status === "created"
                          ? "bg-gray-200"
                          : event.status === "assigned"
                            ? "bg-blue-200"
                            : event.status === "picking_started"
                              ? "bg-yellow-200"
                              : event.status === "picking_completed"
                                ? "bg-green-200"
                                : "bg-purple-200"
                      }`}
                    ></div>

                    <div className="ml-6">
                      <div className="text-sm font-medium">
                        {event.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {event.timestamp.toLocaleTimeString()}{" "}
                        {event.staff && `- ${event.staff}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Processing Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-3">Xử lý theo SLA</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>P1 (Gấp)</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>P2 (Cảnh báo)</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>P3 (Bình thường)</span>
                      <span>98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "98%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-3">
                  Thời gian xử lý TB
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  3.8 phút
                </div>
                <div className="text-sm text-gray-500">
                  Thời gian xử lý trung bình đơn hàng
                </div>
                <div className="mt-3 grid grid-cols-3 text-center">
                  <div>
                    <div className="text-xl font-bold text-red-600">2.1</div>
                    <div className="text-xs text-gray-500">P1</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-yellow-600">3.5</div>
                    <div className="text-xs text-gray-500">P2</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">4.2</div>
                    <div className="text-xs text-gray-500">P3/P4</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-3">Hiệu suất xử lý</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  94%
                </div>
                <div className="text-sm text-gray-500">
                  Đơn hoàn thành trong SLA
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mục tiêu: 95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "94%" }}
                    ></div>
                  </div>
                  <div className="absolute" style={{ left: "95%" }}>
                    <div className="h-full w-0.5 bg-black"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Cài đặt SLA và Phân bổ</h2>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <Save className="h-4 w-4 mr-1" />
                <span>Lưu cài đặt</span>
              </button>
            </div>

            {/* SLA Configuration */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Cài đặt SLA (Service Level Agreement)
                </h3>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngưỡng P1 (giờ)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full px-3 py-2"
                        value={slaSettings.p1Threshold}
                        onChange={(e) =>
                          updateSLASettings(
                            "p1Threshold",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                      <span className="ml-2 text-sm text-gray-500">giờ</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Thời gian còn lại để hoàn thành đơn hàng dưới ngưỡng này
                      sẽ được đánh dấu là P1
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngưỡng P2 (giờ)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full px-3 py-2"
                        value={slaSettings.p2Threshold}
                        onChange={(e) =>
                          updateSLASettings(
                            "p2Threshold",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                      <span className="ml-2 text-sm text-gray-500">giờ</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Thời gian còn lại từ {slaSettings.p1Threshold} đến{" "}
                      {slaSettings.p2Threshold} giờ sẽ được đánh dấu là P2
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngưỡng P3 (giờ)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        step="1"
                        min="1"
                        className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full px-3 py-2"
                        value={slaSettings.p3Threshold}
                        onChange={(e) =>
                          updateSLASettings(
                            "p3Threshold",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                      <span className="ml-2 text-sm text-gray-500">giờ</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Thời gian còn lại từ {slaSettings.p2Threshold} đến{" "}
                      {slaSettings.p3Threshold} giờ sẽ được đánh dấu là P3
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngưỡng cảnh báo (giờ)
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full px-3 py-2"
                        value={slaSettings.alertThreshold}
                        onChange={(e) =>
                          updateSLASettings(
                            "alertThreshold",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                      <span className="ml-2 text-sm text-gray-500">giờ</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Đơn hàng có thời gian còn lại dưới ngưỡng này sẽ gửi cảnh
                      báo cho quản lý
                    </p>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Điều chỉnh theo giờ cao điểm
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Giờ bắt đầu
                        </label>
                        <input
                          type="time"
                          className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full px-3 py-2"
                          value={slaSettings.peakHoursStart}
                          onChange={(e) =>
                            updateSLASettings("peakHoursStart", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Giờ kết thúc
                        </label>
                        <input
                          type="time"
                          className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full px-3 py-2"
                          value={slaSettings.peakHoursEnd}
                          onChange={(e) =>
                            updateSLASettings("peakHoursEnd", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Trong giờ cao điểm, ngưỡng P1 sẽ được điều chỉnh xuống còn{" "}
                      {slaSettings.peakHoursP1Threshold} giờ
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="flex items-start">
                    <Bell className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800">
                        Cài đặt thông báo SLA
                      </p>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            defaultChecked={true}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Gửi thông báo khi đơn P1 mới xuất hiện
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            defaultChecked={true}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Gửi cảnh báo khi đơn P1 gần hết thời gian
                          </span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            defaultChecked={true}
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Gửi báo cáo tuân thủ SLA hàng ngày
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Allocation Configuration */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium flex items-center">
                  <Sliders className="h-5 w-5 mr-2 text-blue-600" />
                  Cài đặt phân bổ đơn hàng
                </h3>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    Tự động phân bổ đơn hàng
                  </span>
                  <button
                    className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                      slaSettings.autoAssignEnabled
                        ? "bg-blue-600"
                        : "bg-gray-200"
                    }`}
                    onClick={() =>
                      updateSLASettings(
                        "autoAssignEnabled",
                        !slaSettings.autoAssignEnabled
                      )
                    }
                  >
                    <span
                      className={`inline-block w-4 h-4 transform transition rounded-full bg-white ${
                        slaSettings.autoAssignEnabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số đơn tối đa mỗi nhân viên
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full px-3 py-2"
                      value={slaSettings.maxOrdersPerStaff}
                      onChange={(e) =>
                        updateSLASettings(
                          "maxOrdersPerStaff",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Số lượng đơn tối đa mà một nhân viên có thể xử lý cùng lúc
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số đơn P1 tối đa mỗi nhân viên
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-opacity-50 w-full px-3 py-2"
                      value={slaSettings.maxP1OrdersPerStaff}
                      onChange={(e) =>
                        updateSLASettings(
                          "maxP1OrdersPerStaff",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Số lượng đơn P1 (gấp) tối đa mà một nhân viên có thể xử lý
                      cùng lúc
                    </p>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chiến lược phân bổ
                    </label>

                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={slaSettings.prioritizeLocation}
                          onChange={(e) =>
                            updateSLASettings(
                              "prioritizeLocation",
                              e.target.checked
                            )
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Ưu tiên vị trí (phân bổ đơn cho nhân viên gần khu vực)
                        </span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={slaSettings.balanceWorkload}
                          onChange={(e) =>
                            updateSLASettings(
                              "balanceWorkload",
                              e.target.checked
                            )
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Cân bằng khối lượng công việc giữa các nhân viên
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trọng số của các tiêu chí phân bổ
                  </label>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>SLA (Mức độ ưu tiên)</span>
                        <span>90%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Vị trí kho</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Kỹ năng nhân viên</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cân bằng tải</span>
                        <span>50%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: "50%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-green-50 border border-green-100 rounded-lg">
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-800">
                        Hiệu suất phân bổ tự động
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Tỷ lệ phân bổ thành công:{" "}
                        <span className="font-medium">
                          {stats.autoAllocationSuccess}%
                        </span>
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Dựa trên 253 đơn hàng được phân bổ trong 7 ngày qua
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {renderView()}
      </main>

      {/* File Upload Modal */}
      {showFileUploadModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          onClick={() => setShowFileUploadModal(false)}
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Upload className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Tải lên danh sách đơn hàng
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Tải lên file CSV, JSON, hoặc XLSX chứa danh sách đơn
                        hàng để nhập vào hệ thống.
                      </p>

                      {!isProcessingFile && !importSuccess && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Chọn file
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                  <span>Tải lên file</span>
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept=".csv,.json,.xlsx,.xls"
                                    onChange={handleFileUpload}
                                  />
                                </label>
                                <p className="pl-1">hoặc kéo và thả</p>
                              </div>
                              <p className="text-xs text-gray-500">
                                CSV, JSON, XLSX không quá 10MB
                              </p>
                            </div>
                          </div>

                          {uploadedFiles.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700">
                                File đã tải lên
                              </h4>
                              <ul className="mt-2 border rounded-md divide-y divide-gray-200">
                                {uploadedFiles.map((file, index) => (
                                  <li
                                    key={index}
                                    className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                                  >
                                    <div className="w-0 flex-1 flex items-center">
                                      <File className="flex-shrink-0 h-5 w-5 text-gray-400" />
                                      <span className="ml-2 flex-1 w-0 truncate">
                                        {file.name}
                                      </span>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                      <button
                                        type="button"
                                        className="font-medium text-red-600 hover:text-red-500"
                                        onClick={() => setUploadedFiles([])}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {filePreviewData && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700">
                                Xem trước dữ liệu
                              </h4>
                              <div className="mt-2 border rounded-md p-3 max-h-40 overflow-auto bg-gray-50">
                                {filePreviewData.type === "json" && (
                                  <pre className="text-xs text-gray-700">
                                    {JSON.stringify(
                                      filePreviewData.data,
                                      null,
                                      2
                                    )}
                                  </pre>
                                )}

                                {filePreviewData.type === "csv" && (
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        {filePreviewData.columns.map(
                                          (col, i) => (
                                            <th
                                              key={i}
                                              className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                              {col}
                                            </th>
                                          )
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {filePreviewData.data.map((row, i) => (
                                        <tr key={i}>
                                          {row.map((cell, j) => (
                                            <td
                                              key={j}
                                              className="px-2 py-1 whitespace-nowrap text-xs text-gray-500"
                                            >
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}

                                {(filePreviewData.type === "xlsx" ||
                                  filePreviewData.type === "unsupported") && (
                                  <div className="text-sm text-gray-500 text-center py-2">
                                    {filePreviewData.data}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {isProcessingFile && (
                        <div className="mt-4 text-center">
                          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Đang xử lý...
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Vui lòng đợi trong khi hệ thống xử lý dữ liệu
                          </p>
                        </div>
                      )}

                      {importSuccess && (
                        <div className="mt-4">
                          <div className="rounded-md bg-green-50 p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">
                                  Nhập dữ liệu thành công
                                </h3>
                                <div className="mt-2 text-sm text-green-700">
                                  <ul className="list-disc pl-5 space-y-1">
                                    {importMessages.map((message, index) => (
                                      <li key={index}>{message}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => {
                              setShowFileUploadModal(false);
                              setImportSuccess(false);
                              setUploadedFiles([]);
                              setFilePreviewData(null);
                            }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Hoàn thành
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {!importSuccess && (
                  <>
                    <button
                      type="button"
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                        uploadedFiles.length === 0 || isProcessingFile
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={processFileUpload}
                      disabled={uploadedFiles.length === 0 || isProcessingFile}
                    >
                      {isProcessingFile ? "Đang xử lý..." : "Nhập dữ liệu"}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setShowFileUploadModal(false)}
                    >
                      Hủy
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseDashboard;
