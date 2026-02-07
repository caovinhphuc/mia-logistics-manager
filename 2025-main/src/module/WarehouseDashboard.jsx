import React, { useState, useEffect } from "react";

import {
  Package,
  Clock,
  AlertTriangle,
  Users,
  BarChart2,
  Settings,
  Bell,
  Search,
  LogOut,
  Activity,
  CheckCircle,
  RefreshCw,
  Map,
  PieChart,
  User,
  List,
  Grid,
  FileText,
  Download,
  Eye,
  EyeOff,
  LogIn,
  Cpu,
  Menu,
  X,
  Zap,
  Check,
  Play,
  History,
  XCircle,
  Filter
} from "lucide-react";


// Thêm các constants cho nguyên tắc 80/20
const PARETO_PRINCIPLES = {
  P1_FIRST: {
    id: "p1_first",
    name: "Xử lý đơn P1 trước 100%",
    description: "Ưu tiên cao nhất cho đơn P1 để đảm bảo SLA",
  },
  SINGLE_PRODUCT: {
    id: "single_product",
    name: "Xử lý đơn 1 sản phẩm (nhanh chóng hoàn thành)",
    description: "Đơn 1 sản phẩm được xử lý nhanh hơn, giúp giảm backlog",
  },
  SAME_PRODUCTS: {
    id: "same_products",
    name: "Gom nhóm đơn cùng loại sản phẩm (giảm di chuyển)",
    description: "Cùng loại sản phẩm được gom nhóm để giảm thời gian di chuyển",
  },
  NEARBY_LOCATIONS: {
    id: "nearby_locations",
    name: "Nhóm đơn gần vị trí nhau (tối ưu lộ trình)",
    description:
      "Các vị trí gần nhau được gom nhóm để tối ưu lộ trình lấy hàng",
  },
  MULTI_PRODUCTS: {
    id: "multi_products",
    name: "Xử lý đơn nhiều loại sản phẩm sau cùng",
    description:
      "Đơn nhiều loại sản phẩm được xử lý sau để không làm chậm các đơn khác",
  },
};

// Dữ liệu giả lập
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
    location: "A12",
    transporter: "GHN Express",
    productType: "vali-mix",
    skuType: "multi-sku",
    items: [
      { sku: "VL28L", name: "Vali Larita 28L", location: "A12", quantity: 1 },
      { sku: "LT01", name: "Luggage Tag", location: "B2", quantity: 2 },
    ],
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
    location: "A5",
    transporter: "J&T Express",
    productType: "vali-only",
    skuType: "single-sku",
    items: [
      { sku: "VP24M", name: "Vali Pisani 24M", location: "A5", quantity: 1 },
    ],
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
    location: "B8",
    transporter: "Ninja Van",
    productType: "no-vali",
    skuType: "multi-sku",
    items: [
      { sku: "TNP01", name: "Travel Neck Pillow", location: "B8", quantity: 1 },
      { sku: "TP01", name: "Travel Pouch", location: "B4", quantity: 2 },
    ],
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
    location: "B15",
    transporter: "VNPost",
    productType: "no-vali",
    skuType: "multi-sku",
    items: [
      { sku: "MC01", name: "Mia Cover", location: "B15", quantity: 2 },
      { sku: "PIC01", name: "Pack-it Cube", location: "B12", quantity: 1 },
    ],
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
    location: "A12",
    transporter: "Shopee Express",
    productType: "vali-only",
    skuType: "single-sku-multi",
    items: [
      { sku: "VL28L", name: "Vali Larita 28L", location: "A12", quantity: 1 },
      { sku: "VL24M", name: "Vali Larita 24M", location: "A8", quantity: 1 },
    ],
  },
];

const mockEmployees = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Nhân viên kho",
    efficiency: 42,
    status: "active",
    currentOrders: 4,
    completedToday: 15,
    shift: "Ca sáng",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Nhân viên kho",
    efficiency: 38,
    status: "active",
    currentOrders: 3,
    completedToday: 12,
    shift: "Ca sáng",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 3,
    name: "Lê Văn C",
    role: "Nhân viên kho",
    efficiency: 45,
    status: "break",
    currentOrders: 0,
    completedToday: 18,
    shift: "Ca sáng",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    role: "Nhân viên kho",
    efficiency: 35,
    status: "active",
    currentOrders: 5,
    completedToday: 10,
    shift: "Ca sáng",
    avatar: "/api/placeholder/40/40",
  },
];

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

const activityLogs = [
  {
    id: 1,
    type: "order",
    action: "Phân bổ đơn SO0405:123456 cho NV01",
    user: "Admin",
    time: "09:15:30",
  },
  {
    id: 2,
    type: "staff",
    action: "NV02 bắt đầu ca làm việc",
    user: "System",
    time: "09:00:00",
  },
  {
    id: 3,
    type: "sla",
    action: "Cảnh báo SLA cho đơn SO0405:123457",
    user: "System",
    time: "09:25:45",
  },
  {
    id: 4,
    type: "picking",
    action: "Hoàn thành lộ trình picking Batch #1",
    user: "NV01",
    time: "09:35:20",
  },
];

// Component chính
//
const WarehouseDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // admin, manager, staff
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState(mockOrders);
  const [employees, setEmployees] = useState(mockEmployees);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activityHistory, setActivityHistory] = useState(activityLogs);
  const [autoAllocation, setAutoAllocation] = useState(false);



  // Thêm state để quản lý dữ liệu bản đồ
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showPicking, setShowPicking] = useState(true);
  // Các bộ lọc
  const [filters, setFilters] = useState({
    channel: "all",
    transporter: "all",
    priority: "all",
    productType: "all",
    skuType: "all",
    skuCount: "all",
    date: "today",
  });

  // Thêm state để lưu trữ dữ liệu từ WarehouseLayoutMap
  const [optimizedRoutes, setOptimizedRoutes] = useState([]);
  const [warehouseData, setWarehouseData] = useState({
    zones: [],
    shelves: [],
    orders: [],
  });

  // Thêm state mới theo yêu cầu
  const [pickingBatches, setPickingBatches] = useState([]);
  const [activeBatch, setActiveBatch] = useState(null);
  const [batchInProgress, setBatchInProgress] = useState(false);
  const [highlightedLocations, setHighlightedLocations] = useState([]);
  const [warehouseViewMode, setWarehouseViewMode] = useState("default"); // 'default', 'heatmap', 'picking'
  const [showLocationDetails, setShowLocationDetails] = useState(false);

  // Function xử lý khi click vào vị trí trên mô hình kho
  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    setShowLocationDetails(true);

    // Lấy danh sách đơn hàng tại vị trí này
    const ordersAtLocation = orders.filter(
      (order) =>
        order.status !== "completed" &&
        order.items &&
        order.items.some((item) => item.location === location.id)
    );

    // Thêm vào lịch sử hoạt động
    const newLog = {
      id: activityHistory.length + 1,
      type: "picking",
      action: `Xem vị trí kho ${location.id} (${ordersAtLocation.length} đơn)`,
      user: currentUser?.name || "System",
      time: new Date().toLocaleTimeString("vi-VN"),
    };
    setActivityHistory([newLog, ...activityHistory]);
  };

  // Function tạo gợi ý tối ưu lấy hàng
  const generatePickingOptimizations = () => {
    // Lọc các đơn chưa được xử lý
    const pendingOrders = orders.filter((o) => o.status !== "completed");
    if (pendingOrders.length === 0) return [];

    const optimizations = [];

    // Phân tích sản phẩm được đặt nhiều nhất
    const productCounts = {};
    const locationCounts = {};

    pendingOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!productCounts[item.sku]) {
          productCounts[item.sku] = {
            count: 0,
            name: item.name,
            orders: [],
          };
        }

        productCounts[item.sku].count += 1;
        if (!productCounts[item.sku].orders.includes(order)) {
          productCounts[item.sku].orders.push(order);
        }

        if (!locationCounts[item.location]) {
          locationCounts[item.location] = {
            count: 0,
            orders: [],
          };
        }

        locationCounts[item.location].count += 1;
        if (!locationCounts[item.location].orders.includes(order)) {
          locationCounts[item.location].orders.push(order);
        }
      });
    });

    // Sắp xếp sản phẩm theo số lượng đơn đặt hàng
    const sortedProducts = Object.entries(productCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 2); // Lấy 2 sản phẩm hàng đầu

    sortedProducts.forEach(([sku, data]) => {
      if (data.count >= 2) {
        // Tối thiểu 2 đơn hàng
        optimizations.push({
          type: "product",
          location: sku,
          message: `${data.name} (${sku}) xuất hiện trong ${data.count} đơn hàng. Gộp lại sẽ tiết kiệm thời gian di chuyển.`,
          orders: data.orders,
        });
      }
    });

    // Sắp xếp vị trí theo số lượng đơn đặt hàng
    const sortedLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 2); // Lấy 2 vị trí hàng đầu

    sortedLocations.forEach(([location, data]) => {
      if (data.count >= 3) {
        // Tối thiểu 3 đơn hàng
        optimizations.push({
          type: "location",
          location: location,
          message: `Vị trí ${location} có ${data.count} sản phẩm cần lấy. Gộp chung các đơn sẽ tối ưu lộ trình.`,
          orders: data.orders,
        });
      }
    });

    // Phân tích đơn hàng đơn lẻ có thể xử lý nhanh
    const singleProductOrders = pendingOrders.filter(
      (order) => order.items?.length === 1 && order.priority === "P2"
    );

    if (singleProductOrders.length >= 3) {
      optimizations.push({
        type: "batch",
        message: `Có ${singleProductOrders.length} đơn chỉ có 1 sản phẩm. Xử lý nhanh các đơn này sẽ giảm khối lượng công việc.`,
        orders: singleProductOrders.slice(
          0,
          Math.min(5, singleProductOrders.length)
        ),
      });
    }

    return optimizations;
  };

  // Render nút tương tác cho mỗi batch
  const renderBatchActionButton = (batch) => {
    if (batch.status === "pending") {
      return (
        <button
          className={ `px-3 py-1.5 rounded text-sm flex items-center
            ${batchInProgress
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
            }` }
          onClick={ () => !batchInProgress && handleStartBatchPicking(batch) }
          disabled={ batchInProgress }
        >
          <Play size={ 16 } className="mr-1" />
          Bắt đầu lấy hàng
        </button>
      );
    } else if (batch.status === "processing") {
      return (
        <button
          className="px-3 py-1.5 rounded text-sm flex items-center bg-green-600 hover:bg-green-700 text-white"
          onClick={ () => handleCompleteBatchPicking(batch) }
        >
          <Check size={ 16 } className="mr-1" />
          Hoàn thành
        </button>
      );
    } else {
      return (
        <div className="flex items-center text-green-500">
          <Check size={ 16 } className="mr-1" />
          <span className="text-xs">
            Hoàn thành lúc { new Date(batch.completeTime).toLocaleTimeString() }
          </span>
        </div>
      );
    }
  };

  // Function xử lý sự kiện bắt đầu lấy hàng cho batch
  const handleStartBatchPicking = (batchId) => {
    // Tìm batch từ id
    const batch = pickingBatches.find((b) => b.id === batchId);
    if (!batch) return;

    // Cập nhật trạng thái batch
    setPickingBatches((prevBatches) =>
      prevBatches.map((b) =>
        b.id === batchId
          ? {
            ...b,
            status: "processing",
            startTime: new Date().toISOString(),
          }
          : b
      )
    );

    // Đặt batch này làm batch đang hoạt động
    setActiveBatch(batchId);
    setBatchInProgress(true);

    // Highlight các vị trí lấy hàng
    const batchLocations = batch.locations || [];
    setHighlightedLocations(batchLocations);

    // Thêm vào lịch sử hoạt động
    const newLog = {
      id: activityHistory.length + 1,
      type: "picking",
      action: `Bắt đầu lấy hàng cho batch "${batch.name}"`,
      user: currentUser?.name || "System",
      time: new Date().toLocaleTimeString("vi-VN"),
    };
    setActivityHistory([newLog, ...activityHistory]);

    // Thông báo
    setAlerts([
      {
        id: Math.random().toString(36).substr(2, 9),
        type: "info",
        title: "Bắt đầu lấy hàng",
        message: `Đã bắt đầu lấy hàng cho batch "${batch.name}"`,
        time: new Date().toLocaleTimeString("vi-VN"),
      },
      ...alerts,
    ]);
  };

  // Function xử lý hoàn thành batch picking
  const handleCompleteBatchPicking = (batchId) => {
    // Tìm batch từ id
    const batch = pickingBatches.find((b) => b.id === batchId);
    if (!batch) return;

    // Tính thời gian xử lý (phút)
    const startTime = new Date(batch.startTime);
    const endTime = new Date();
    const processingTime = Math.round((endTime - startTime) / (1000 * 60));

    // Cập nhật trạng thái batch
    setPickingBatches((prevBatches) =>
      prevBatches.map((b) =>
        b.id === batchId
          ? {
            ...b,
            status: "completed",
            completeTime: endTime.toISOString(),
            processingTime,
          }
          : b
      )
    );

    // Cập nhật trạng thái đơn hàng trong batch
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (batch.orders.some((o) => o.id === order.id)) {
          return {
            ...order,
            status: "completed",
            completionTime: new Date().toISOString(),
          };
        }
        return order;
      })
    );

    // Xóa batch khỏi hoạt động
    setActiveBatch(null);
    setBatchInProgress(false);
    setHighlightedLocations([]);

    // Cập nhật thống kê
    setStats((prevStats) => ({
      ...prevStats,
      pendingOrders: prevStats.pendingOrders - batch.orders.length,
      completedOrders: prevStats.completedOrders + batch.orders.length,
    }));

    // Thêm vào lịch sử hoạt động
    const newLog = {
      id: activityHistory.length + 1,
      type: "picking",
      action: `Hoàn thành lấy hàng cho batch "${batch.name}" (${batch.orders.length} đơn) trong ${processingTime} phút`,
      user: currentUser?.name || "System",
      time: new Date().toLocaleTimeString("vi-VN"),
    };
    setActivityHistory([newLog, ...activityHistory]);

    // Thông báo
    setAlerts([
      {
        id: Math.random().toString(36).substr(2, 9),
        type: "success",
        title: "Hoàn thành lấy hàng",
        message: `Đã hoàn thành batch "${batch.name}" (${batch.orders.length} đơn) trong ${processingTime} phút`,
        time: new Date().toLocaleTimeString("vi-VN"),
      },
      ...alerts,
    ]);
  };

  // Thêm function để tính toán lộ trình tối ưu từ dữ liệu đơn hàng
  const calculateOptimalRoute = (orders) => {
    // Sử dụng thuật toán từ PickingOptimizationModule.js
    const pendingOrders = orders.filter(
      (o) => o.status === "pending" || o.status === "processing"
    );

    // Phân loại đơn hàng theo nguyên tắc 80/20
    const p1Orders = pendingOrders.filter((o) => o.priority === "P1");
    const p2Orders = pendingOrders.filter((o) => o.priority === "P2");
    const otherOrders = pendingOrders.filter(
      (o) => o.priority !== "P1" && o.priority !== "P2"
    );

    // Nhóm đơn theo loại sản phẩm
    const valiOrders = pendingOrders.filter(
      (o) => o.productType === "vali-only"
    );
    const singleProductOrders = pendingOrders.filter(
      (o) => o.items && o.items.length === 1
    );

    // Tạo lộ trình tối ưu theo nguyên tắc:
    // 1. Xử lý đơn P1 trước
    // 2. Xử lý đơn 1 sản phẩm (nhanh)
    // 3. Gom nhóm đơn cùng loại (giảm di chuyển)

    // Trả về lộ trình theo các khu vực
    return [
      {
        zone: "A",
        count:
          p1Orders.filter((o) => o.zone === "A").length +
          p2Orders.filter((o) => o.zone === "A").length,
      },
      {
        zone: "B",
        count:
          p1Orders.filter((o) => o.zone === "B").length +
          p2Orders.filter((o) => o.zone === "B").length,
      },
      {
        zone: "C",
        count:
          p1Orders.filter((o) => o.zone === "C").length +
          p2Orders.filter((o) => o.zone === "C").length,
      },
    ];
  };

  // Thêm function để tạo batch picking
  const createPickingBatches = () => {
    const pendingOrders = orders.filter((o) => o.status === "pending");

    // Áp dụng nguyên tắc 80/20:
    // - 20% khu vực kho (các khu vực hot) chứa 80% đơn hàng
    // - 20% SKU (SKU hot) chiếm 80% đơn hàng

    // Batch 1: Khu A - Vali (ưu tiên P1, P2)
    const batch1Orders = pendingOrders.filter(
      (o) =>
        o.location?.startsWith("A") &&
        (o.priority === "P1" || o.priority === "P2")
    );

    // Batch 2: Khu B - Phụ kiện
    const batch2Orders = pendingOrders.filter(
      (o) =>
        o.location?.startsWith("B") &&
        (o.priority === "P1" || o.priority === "P2")
    );

    // Batch 3: Khu C - Hàng đặc biệt
    const batch3Orders = pendingOrders.filter((o) =>
      o.location?.startsWith("C")
    );

    // Batch 4: Còn lại
    const batch4Orders = pendingOrders.filter(
      (o) =>
        !batch1Orders.includes(o) &&
        !batch2Orders.includes(o) &&
        !batch3Orders.includes(o)
    );

    return [
      {
        id: "batch1",
        name: "Batch #1: Khu A - Vali",
        orders: batch1Orders,
        locations: ["A1", "A2", "A5", "A12"],
        status: "pending",
      },
      {
        id: "batch2",
        name: "Batch #2: Khu B - Phụ kiện",
        orders: batch2Orders,
        locations: ["B2", "B8", "B15"],
        status: "pending",
      },
      {
        id: "batch3",
        name: "Batch #3: Khu C - Hàng đặc biệt",
        orders: batch3Orders,
        locations: ["C4", "C10"],
        status: "pending",
      },
    ];
  };

  // Function này thay thế cho startPickingBatch cũ
  const startPickingBatch = (batchId) => {
    handleStartBatchPicking(batchId);
  };

  const checkSLAWarnings = () => {
    // Kiểm tra đơn hàng sắp hết hạn SLA
    const urgentOrders = orders.filter((order) => {
      if (order.status === "pending" || order.status === "processing") {
        const deadline = new Date(order.deadline);
        const now = new Date();
        const minutesLeft = (deadline - now) / (1000 * 60);
        return minutesLeft <= 30; // Cảnh báo khi còn ít hơn 30 phút
      }
      return false;
    });

    if (urgentOrders.length > 0) {
      const newAlerts = urgentOrders.map((order) => ({
        id: Math.random().toString(36).substr(2, 9),
        type: "urgent",
        title: "Đơn sắp trễ hạn SLA",
        message: `Đơn ${order.id} còn ít hơn 30 phút để hoàn thành`,
        time: new Date().toLocaleTimeString("vi-VN"),
      }));

      // Thêm cảnh báo mới vào hàng đợi
      setAlerts([...newAlerts, ...alerts].slice(0, 10)); // Giữ tối đa 10 cảnh báo
    }
  };

  // Thêm useEffect để kiểm tra định kỳ
  useEffect(() => {
    const interval = setInterval(checkSLAWarnings, 60000); // Kiểm tra mỗi phút
    return () => clearInterval(interval);
  }, [orders]);

  // State cho thống kê
  const [stats, setStats] = useState({
    totalOrders: mockOrders.length,
    pendingOrders: mockOrders.filter((o) => o.status === "pending").length,
    processingOrders: mockOrders.filter((o) => o.status === "processing")
      .length,
    completedOrders: mockOrders.filter((o) => o.status === "completed").length,
    p1Orders: mockOrders.filter((o) => o.priority === "P1").length,
    p2Orders: mockOrders.filter((o) => o.priority === "P2").length,
    slaRate: 95.5,
    avgOrderTime: 22,
  });

  const render80_20AnalysisSection = () => (
    <div className={ `mt-6 p-4 rounded-lg border ${cardClass}` }>
      <h3 className="text-lg font-medium mb-4">
        Phân tích theo nguyên tắc 80/20
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-md mb-3">Phân bổ đơn hàng</h4>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  20% khách hàng lớn
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  80%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={ { width: "80%" } }
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  80% khách hàng còn lại
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">
                  20%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
              <div
                style={ { width: "20%" } }
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-md mb-3">
            Sử dụng thời gian lấy hàng
          </h4>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                  20% SKU phổ biến nhất
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-purple-600">
                  76%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
              <div
                style={ { width: "76%" } }
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
              ></div>
            </div>
          </div>

          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                  80% SKU còn lại
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-yellow-600">
                  24%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
              <div
                style={ { width: "24%" } }
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <h4 className="font-medium text-md mb-3">
          Đề xuất tối ưu hóa theo nguyên tắc 80/20
        </h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Đặt 20% sản phẩm bán chạy nhất tại vị trí dễ lấy nhất (khu A1-A5)
          </li>
          <li>
            Phân bổ 80% đơn hàng P1 cho 20% nhân viên có hiệu suất cao nhất
          </li>
          <li>
            Ưu tiên gom đơn theo lô (batch) cho các sản phẩm bán chạy nhất
          </li>
          <li>
            Tối ưu thời gian giao ca, tập trung nhân lực vào khung giờ sinh 80%
            đơn hàng (9:00-14:00)
          </li>
          <li>
            Thực hiện huấn luyện chuyên sâu cho 20% nhân viên xuất sắc nhất để
            đạt hiệu suất tối ưu
          </li>
        </ul>
      </div>
    </div>
  );

  // Component Login
  const LoginComponent = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
      e.preventDefault();
      // Giả lập đăng nhập với các vai trò khác nhau
      if (username === "admin" && password === "admin123") {
        setIsLoggedIn(true);
        setUserRole("admin");
        setCurrentUser({ name: "Admin", role: "Quản trị viên" });
      } else if (username === "manager" && password === "manager123") {
        setIsLoggedIn(true);
        setUserRole("manager");
        setCurrentUser({ name: "Trưởng phòng", role: "Trưởng phòng kho vận" });
      } else if (username === "staff" && password === "staff123") {
        setIsLoggedIn(true);
        setUserRole("staff");
        setCurrentUser({ name: "Nhân viên", role: "Nhân viên kho" });
      } else {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
      }
    };

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
          <div className="text-center mb-8">
            <Package className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Dashboard SLA Kho Vận
            </h1>
            <p className="text-gray-400">Đăng nhập để tiếp tục</p>
          </div>

          <form onSubmit={ handleLogin }>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={ username }
                onChange={ (e) => setUsername(e.target.value) }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={ showPassword ? "text" : "password" }
                  value={ password }
                  onChange={ (e) => setPassword(e.target.value) }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={ () => setShowPassword(!showPassword) }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  { showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  ) }
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
              <div className="flex items-center justify-center">
                <LogIn className="h-5 w-5 mr-2" />
                Đăng nhập
              </div>
            </button>
          </form>

          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>Thông tin demo:</p>
            <p>Admin: admin/admin123</p>
            <p>Manager: manager/manager123</p>
            <p>Staff: staff/staff123</p>
          </div>
        </div>
      </div>
    );
  };

  // Component Navigation cho nhân viên
  const StaffNavigation = () => (
    <div className="flex space-x-1 px-4 pb-1">
      <button
        className={ `px-4 py-2 rounded-t text-sm flex items-center ${activeTab === "myOrders" ? tabActiveClass : tabInactiveClass
          }` }
        onClick={ () => setActiveTab("myOrders") }
      >
        <Package className="w-4 h-4 mr-1" /> Đơn của tôi
      </button>
      <button
        className={ `px-4 py-2 rounded-t text-sm flex items-center ${activeTab === "profile" ? tabActiveClass : tabInactiveClass
          }` }
        onClick={ () => setActiveTab("profile") }
      >
        <User className="w-4 h-4 mr-1" /> Thông tin cá nhân
      </button>
      <button
        className={ `px-4 py-2 rounded-t text-sm flex items-center ${activeTab === "performance" ? tabActiveClass : tabInactiveClass
          }` }
        onClick={ () => setActiveTab("performance") }
      >
        <Activity className="w-4 h-4 mr-1" /> Hiệu suất làm việc
      </button>
    </div>
  );

  // Component Navigation cho admin/manager
  const AdminNavigation = () => (
    <div className="flex space-x-1 px-4 pb-1 overflow-x-auto">
      <button
        className={ `px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${activeTab === "overview" ? tabActiveClass : tabInactiveClass
          }` }
        onClick={ () => setActiveTab("overview") }
      >
        <BarChart2 className="w-4 h-4 mr-1" /> Tổng quan
      </button>
      <button
        className={ `px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${activeTab === "orders" ? tabActiveClass : tabInactiveClass
          }` }
        onClick={ () => setActiveTab("orders") }
      >
        <Package className="w-4 h-4 mr-1" /> Đơn hàng
      </button>
      <button
        className={ `px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${activeTab === "staff" ? tabActiveClass : tabInactiveClass
          }` }
        onClick={ () => setActiveTab("staff") }
      >
        <Users className="w-4 h-4 mr-1" /> Nhân sự
      </button>
      <button
        className={ `px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${activeTab === "picking" ? tabActiveClass : tabInactiveClass
          }` }
        onClick={ () => setActiveTab("picking") }
      >
        <Map className="w-4 h-4 mr-1" /> Picking
      </button>
      <button
        className={ `px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${activeTab === "WarehouseMap" ? tabActiveClass : tabInactiveClass
          }` }
        onClick={ () => setActiveTab("WarehouseMap") }
      >
        <Map className="w-4 h-4 mr-1" /> Bản đồ kho
      </button>

      <button
        className={ `px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${activeTab === "alerts" ? tabActiveClass : tabInactiveClass
          }` }
        onClick={ () => setActiveTab("alerts") }
      >
        <Bell className="w-4 h-4 mr-1" /> Cảnh báo
      </button>
      <button
        className={ `px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${activeTab === "reports" ? tabActiveClass : tabInactiveClass
          }` }
        onClick={ () => setActiveTab("reports") }
      >
        <PieChart className="w-4 h-4 mr-1" /> Báo cáo
      </button>
      <button
        className={ `px-4 py-2 rounded-t text-sm flex items-center whitespace-nowrap ${activeTab === "history" ? tabActiveClass : tabInactiveClass
          }` }
        onClick={ () => setActiveTab("history") }
      >
        <History className="w-4 h-4 mr-1" /> Lịch sử
      </button>
    </div>
  );

  // Dữ liệu hiệu suất theo giờ
  const hourlyPerformanceData = [
    { hour: "08:00", orders: 12, completed: 10, sla: 95 },
    { hour: "09:00", orders: 18, completed: 15, sla: 92 },
    { hour: "10:00", orders: 25, completed: 20, sla: 96 },
    { hour: "11:00", orders: 30, completed: 25, sla: 94 },
    { hour: "12:00", orders: 20, completed: 18, sla: 97 },
    { hour: "13:00", orders: 28, completed: 22, sla: 93 },
    { hour: "14:00", orders: 35, completed: 30, sla: 95 },
  ];

  // Hàm đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole("");
    setCurrentUser(null);
    setActiveTab("overview");
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Chế độ giao diện
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Lọc đơn hàng
  const filteredOrders = orders.filter((order) => {
    if (filters.channel !== "all" && order.channel !== filters.channel)
      return false;
    if (
      filters.transporter !== "all" &&
      !order.transporter.includes(filters.transporter)
    )
      return false;
    if (filters.priority !== "all" && order.priority !== filters.priority)
      return false;

    // Lọc theo loại sản phẩm
    if (
      filters.productType !== "all" &&
      order.productType !== filters.productType
    )
      return false;

    // Lọc theo SKU type
    if (filters.skuType !== "all" && order.skuType !== filters.skuType)
      return false;

    return true;
  });

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
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

  // Tự động phân bổ đơn hàng
  const handleAutoAllocation = () => {
    setAutoAllocation(true);

    // Thêm vào log hoạt động
    const newLog = {
      id: activityHistory.length + 1,
      type: "order",
      action: `Phân bổ tự động ${orders.filter((o) => o.status === "pending").length
        } đơn hàng`,
      user: currentUser?.name || "System",
      time: new Date().toLocaleTimeString("vi-VN"),
    };
    setActivityHistory([newLog, ...activityHistory]);

    // Phân loại đơn hàng theo SLA
    const pendingP1Orders = orders.filter(
      (o) => o.status === "pending" && o.priority === "P1"
    );
    const pendingP2Orders = orders.filter(
      (o) => o.status === "pending" && o.priority === "P2"
    );
    const otherPendingOrders = orders.filter(
      (o) =>
        o.status === "pending" && o.priority !== "P1" && o.priority !== "P2"
    );

    // Lọc nhân viên theo hiệu suất (cao -> thấp)
    const highPerformanceStaff = employees
      .filter((emp) => emp.status === "active" && emp.efficiency >= 40)
      .sort((a, b) => b.efficiency - a.efficiency);

    const regularStaff = employees
      .filter(
        (emp) =>
          emp.status === "active" && emp.efficiency < 40 && emp.efficiency >= 30
      )
      .sort((a, b) => b.efficiency - a.efficiency);

    const juniorStaff = employees
      .filter((emp) => emp.status === "active" && emp.efficiency < 30)
      .sort((a, b) => b.efficiency - a.efficiency);

    // Áp dụng nguyên tắc 80/20: gán 80% đơn quan trọng cho 20% nhân viên giỏi nhất
    const updatedOrders = [...orders];

    // Phân bổ đơn P1 cho nhân viên hiệu suất cao
    pendingP1Orders.forEach((order) => {
      const availableStaff = highPerformanceStaff.find(
        (s) => s.currentOrders < s.maxLoad * 0.8
      );
      if (availableStaff) {
        availableStaff.currentOrders += 1;
        const orderIndex = updatedOrders.findIndex((o) => o.id === order.id);
        if (orderIndex !== -1) {
          updatedOrders[orderIndex] = {
            ...updatedOrders[orderIndex],
            assignedTo: availableStaff.id,
            status: "processing",
          };
        }
      }
    });

    // Phân bổ đơn P2 cho nhân viên hiệu suất cao còn lại hoặc nhân viên thường
    pendingP2Orders.forEach((order) => {
      const availableHighPerf = highPerformanceStaff.find(
        (s) => s.currentOrders < s.maxLoad * 0.8
      );
      const availableRegular = regularStaff.find(
        (s) => s.currentOrders < s.maxLoad * 0.8
      );

      const staffToAssign = availableHighPerf || availableRegular;
      if (staffToAssign) {
        staffToAssign.currentOrders += 1;
        const orderIndex = updatedOrders.findIndex((o) => o.id === order.id);
        if (orderIndex !== -1) {
          updatedOrders[orderIndex] = {
            ...updatedOrders[orderIndex],
            assignedTo: staffToAssign.id,
            status: "processing",
          };
        }
      }
    });

    // Phân bổ đơn còn lại cho tất cả nhân viên còn khả năng nhận đơn
    otherPendingOrders.forEach((order) => {
      const allAvailableStaff = [
        ...highPerformanceStaff,
        ...regularStaff,
        ...juniorStaff,
      ].filter((s) => s.currentOrders < s.maxLoad);

      if (allAvailableStaff.length > 0) {
        // Sắp xếp theo tải hiện tại (% tải)
        allAvailableStaff.sort(
          (a, b) => a.currentOrders / a.maxLoad - b.currentOrders / b.maxLoad
        );

        const staffToAssign = allAvailableStaff[0];
        staffToAssign.currentOrders += 1;
        const orderIndex = updatedOrders.findIndex((o) => o.id === order.id);
        if (orderIndex !== -1) {
          updatedOrders[orderIndex] = {
            ...updatedOrders[orderIndex],
            assignedTo: staffToAssign.id,
            status: "processing",
          };
        }
      }
    });

    setOrders(updatedOrders);
    setEmployees([...employees]); // Cập nhật nhân viên (currentOrders đã thay đổi)

    setTimeout(() => setAutoAllocation(false), 2000);
  };

  // Thêm function để xử lý khi hoàn thành một đơn hàng
  const handleCompleteOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
            ...order,
            status: "completed",
            completionTime: new Date().toISOString(),
          }
          : order
      )
    );

    // Cập nhật thống kê
    setStats((prevStats) => ({
      ...prevStats,
      pendingOrders: prevStats.pendingOrders - 1,
      completedOrders: prevStats.completedOrders + 1,
    }));

    // Thêm vào lịch sử hoạt động
    const newLog = {
      id: activityHistory.length + 1,
      type: "order",
      action: `Hoàn thành đơn hàng ${orderId}`,
      user: currentUser?.name || "System",
      time: new Date().toLocaleTimeString("vi-VN"),
    };
    setActivityHistory([newLog, ...activityHistory]);
  };

  // Các biểu đồ và component
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* KPI Cards */ }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={ `p-4 rounded-lg border ${cardClass}` }>
          <h3 className="text-lg font-medium mb-3">Phân bổ đơn theo SLA</h3>
          <div className="h-52 flex justify-center items-center">
            <div className="w-full h-full flex flex-col space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">P1 - Gấp</span>
                <div className="flex-1 h-5 bg-gray-700 rounded-full overflow-hidden ml-2">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={ {
                      width: `${(stats.p1Orders / stats.totalOrders) * 100}%`,
                    } }
                  ></div>
                </div>
                <span className="text-sm ml-2">{ stats.p1Orders } đơn</span>
              </div>

              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">P2 - Cảnh báo</span>
                <div className="flex-1 h-5 bg-gray-700 rounded-full overflow-hidden ml-2">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={ {
                      width: `${(stats.p2Orders / stats.totalOrders) * 100}%`,
                    } }
                  ></div>
                </div>
                <span className="text-sm ml-2">{ stats.p2Orders } đơn</span>
              </div>

              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">P3 - Bình thường</span>
                <div className="flex-1 h-5 bg-gray-700 rounded-full overflow-hidden ml-2">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={ {
                      width: `${((stats.totalOrders -
                        stats.p1Orders -
                        stats.p2Orders -
                        1) /
                        stats.totalOrders) *
                        100
                        }%`,
                    } }
                  ></div>
                </div>
                <span className="text-sm ml-2">
                  { stats.totalOrders - stats.p1Orders - stats.p2Orders - 1 } đơn
                </span>
              </div>

              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm">P4 - Chờ xử lý</span>
                <div className="flex-1 h-5 bg-gray-700 rounded-full overflow-hidden ml-2">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={ { width: `${(1 / stats.totalOrders) * 100}%` } }
                  ></div>
                </div>
                <span className="text-sm ml-2">1 đơn</span>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-1">Lưu ý SLA</h4>
                <div className="text-xs opacity-75">
                  <p>• P1: ≤ 2 giờ để hoàn thành</p>
                  <p>• P2: 2-4 giờ để hoàn thành</p>
                  <p>• P3: 4-8 giờ để hoàn thành</p>
                  <p>• P4: &gt; 8 giờ để hoàn thành</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Biểu đồ hiệu suất */ }

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={ `lg:col-span-2 p-4 rounded-lg border ${cardClass}` }>
          <h3 className="text-lg font-medium mb-3">
            Hiệu suất xử lý đơn theo giờ
          </h3>
          <div className="h-64">
            <div className="w-full h-full flex items-end">
              { hourlyPerformanceData.map((item, index) => (
                <div key={ index } className="flex-1 flex flex-col items-center">
                  <div className="relative w-full flex justify-center space-x-1 mb-1">
                    <div
                      className="w-5 bg-blue-500 rounded-t"
                      style={ { height: `${(item.orders / 35) * 100}%` } }
                      title={ `Tổng đơn: ${item.orders}` }
                    ></div>
                    <div
                      className="w-5 bg-green-500 rounded-t"
                      style={ { height: `${(item.completed / 35) * 100}%` } }
                      title={ `Hoàn thành: ${item.completed}` }
                    ></div>
                  </div>
                  <div className="text-xs pt-1">{ item.hour }</div>
                </div>
              )) }
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
              <span>Tổng đơn</span>
            </div>
            <div className="flex items-center text-xs">
              <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
              <span>Hoàn thành</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cảnh báo và hoạt động */ }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={ `p-4 rounded-lg border ${cardClass} lg:col-span-2` }>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Đơn cần xử lý ưu tiên</h3>
            <button
              className={ `px-2 py-1 rounded text-xs ${buttonSecondaryClass}` }
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
                { filteredOrders
                  .filter(
                    (order) =>
                      order.priority === "P1" && order.status !== "completed"
                  )
                  .slice(0, 4)
                  .map((order, index) => (
                    <tr key={ index } className="border-b border-gray-700">
                      <td className="py-2 text-sm">{ order.id }</td>
                      <td className="py-2 text-sm">{ order.channel }</td>
                      <td className="py-2 text-sm">
                        <span className="px-2 py-1 text-xs rounded-full bg-red-500 bg-opacity-20 text-red-400">
                          { order.priority }
                        </span>
                      </td>
                      <td className="py-2 text-sm">
                        { new Date(order.deadline).toLocaleTimeString("vi-VN") }
                      </td>
                      <td className="py-2 text-sm">
                        <span
                          className={ `px-2 py-1 text-xs rounded-full ${order.status === "pending"
                            ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                            : order.status === "processing"
                              ? "bg-blue-500 bg-opacity-20 text-blue-400"
                              : "bg-green-500 bg-opacity-20 text-green-400"
                            }` }
                        >
                          { order.status === "pending"
                            ? "Chờ xử lý"
                            : order.status === "processing"
                              ? "Đang xử lý"
                              : "Hoàn thành" }
                        </span>
                      </td>
                      <td className="py-2 flex justify-center space-x-1">
                        <button
                          className="p-1 text-blue-400 hover:text-blue-300"
                          title="Chi tiết"
                        >
                          <Eye size={ 16 } />
                        </button>
                        <button
                          className="p-1 text-green-400 hover:text-green-300"
                          title="Phân công"
                        >
                          <Users size={ 16 } />
                        </button>
                        <button
                          className="p-1 text-purple-400 hover:text-purple-300"
                          title="In đơn"
                        >
                          <FileText size={ 16 } />
                        </button>
                      </td>
                    </tr>
                  )) }
              </tbody>
            </table>
          </div>
        </div>

        <div className={ `p-4 rounded-lg border ${cardClass}` }>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Cảnh báo hoạt động</h3>
            <button
              className={ `px-2 py-1 rounded text-xs ${buttonSecondaryClass}` }
            >
              Quản lý
            </button>
          </div>
          <div className="space-y-3">
            { alerts.map((alert, index) => (
              <div
                key={ index }
                className={ `p-3 rounded-lg ${alert.type === "urgent"
                  ? "bg-red-900 bg-opacity-20 border-l-4 border-red-600"
                  : alert.type === "warning"
                    ? "bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-600"
                    : "bg-blue-900 bg-opacity-20 border-l-4 border-blue-600"
                  }` }
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    { alert.type === "urgent" ? (
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
                    ) : alert.type === "warning" ? (
                      <Bell className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                    ) }
                    <div>
                      <p className="font-medium text-sm">{ alert.title }</p>
                      <p className="text-xs opacity-75 mt-1">{ alert.message }</p>
                    </div>
                  </div>
                  <span className="text-xs opacity-75">{ alert.time }</span>
                </div>
              </div>
            )) }
          </div>
          <div className="mt-3 flex justify-center">
            <button
              className={ `px-3 py-1 rounded text-xs ${buttonSecondaryClass}` }
            >
              Xem tất cả cảnh báo
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className={ `p-4 rounded-lg border ${cardClass}` }>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Quản lý đơn hàng</h3>
        <div className="flex space-x-2">
          <button
            className={ `px-3 py-1 rounded text-sm flex items-center ${autoAllocation ? buttonPrimaryClass : buttonSecondaryClass
              }` }
            onClick={ handleAutoAllocation }
            disabled={ autoAllocation }
          >
            <Zap size={ 16 } className="mr-1" />
            { autoAllocation ? "Đang phân bổ..." : "Phân bổ tự động" }
          </button>
          <button
            className={ `px-3 py-1 rounded text-sm flex items-center ${buttonSecondaryClass}` }
          >
            <Download size={ 16 } className="mr-1" /> Xuất Excel
          </button>
          <button
            className={ `px-3 py-1 rounded text-sm flex items-center ${buttonPrimaryClass}` }
          >
            <RefreshCw size={ 16 } className="mr-1" /> Làm mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Mã đơn
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Khách hàng
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Kênh
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                SLA
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Chi tiết
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                ĐVVC
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Loại hàng
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                SKU
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
            { filteredOrders.map((order, index) => (
              <tr
                key={ index }
                className={ `border-b border-gray-700 ${order.priority === "P1"
                  ? "bg-red-900 bg-opacity-10"
                  : order.priority === "P2"
                    ? "bg-yellow-900 bg-opacity-10"
                    : ""
                  }` }
              >
                <td className="py-2 text-sm">{ order.id }</td>
                <td className="py-2 text-sm">{ order.customer }</td>
                <td className="py-2 text-sm">{ order.channel }</td>
                <td className="py-2 text-sm">
                  <span
                    className={ `px-2 py-1 text-xs rounded-full ${order.priority === "P1"
                      ? "bg-red-500 bg-opacity-20 text-red-400"
                      : order.priority === "P2"
                        ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                        : order.priority === "P3"
                          ? "bg-green-500 bg-opacity-20 text-green-400"
                          : "bg-blue-500 bg-opacity-20 text-blue-400"
                      }` }
                  >
                    { order.priority }
                  </span>
                </td>
                <td className="py-2 text-sm max-w-xs truncate">
                  { order.detail }
                </td>
                <td className="py-2 text-sm">{ order.transporter }</td>
                <td className="py-2 text-sm">
                  <span
                    className={ `px-2 py-1 text-xs rounded-full ${order.productType === "vali-only"
                      ? "bg-blue-500 bg-opacity-20 text-blue-400"
                      : order.productType === "vali-mix"
                        ? "bg-purple-500 bg-opacity-20 text-purple-400"
                        : "bg-gray-500 bg-opacity-20 text-gray-400"
                      }` }
                  >
                    { order.productType === "vali-only"
                      ? "Chỉ vali"
                      : order.productType === "vali-mix"
                        ? "Mix vali"
                        : "Không vali" }
                  </span>
                </td>
                <td className="py-2 text-sm">
                  <span
                    className={ `px-2 py-1 text-xs rounded-full ${order.skuType === "single-sku"
                      ? "bg-green-500 bg-opacity-20 text-green-400"
                      : order.skuType === "single-sku-multi"
                        ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                        : "bg-red-500 bg-opacity-20 text-red-400"
                      }` }
                  >
                    { order.skuType === "single-sku"
                      ? "1 SKU"
                      : order.skuType === "single-sku-multi"
                        ? "1 SKU nhiều"
                        : "Nhiều SKU" }
                  </span>
                </td>
                <td className="py-2 text-sm">
                  <span
                    className={ `px-2 py-1 text-xs rounded-full ${order.status === "pending"
                      ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                      : order.status === "processing"
                        ? "bg-blue-500 bg-opacity-20 text-blue-400"
                        : "bg-green-500 bg-opacity-20 text-green-400"
                      }` }
                  >
                    { order.status === "pending"
                      ? "Chờ xử lý"
                      : order.status === "processing"
                        ? "Đang xử lý"
                        : "Hoàn thành" }
                  </span>
                </td>
                <td className="py-2 flex justify-center space-x-1">
                  <button
                    className="p-1 text-blue-400 hover:text-blue-300"
                    title="Chi tiết"
                  >
                    <Eye size={ 16 } />
                  </button>
                  <button
                    className="p-1 text-green-400 hover:text-green-300"
                    title="Phân công"
                  >
                    <Users size={ 16 } />
                  </button>
                  <button
                    className="p-1 text-purple-400 hover:text-purple-300"
                    title="In đơn"
                  >
                    <FileText size={ 16 } />
                  </button>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStaffTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={ `p-4 rounded-lg border ${cardClass}` }>
          <h3 className="text-lg font-medium mb-4">Hiệu suất nhân viên</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Nhân viên
                  </th>
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Hiệu suất
                  </th>
                  <th className="py-2 text-center text-xs font-medium text-gray-400">
                    Đơn hiện tại
                  </th>
                  <th className="py-2 text-center text-xs font-medium text-gray-400">
                    Hoàn thành
                  </th>
                  <th className="py-2 text-center text-xs font-medium text-gray-400">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                { employees.map((employee, index) => (
                  <tr key={ index } className="border-b border-gray-700">
                    <td className="py-2 text-sm">{ employee.name }</td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={ { width: `${employee.efficiency}%` } }
                          ></div>
                        </div>
                        <span className="text-xs">{ employee.efficiency }%</span>
                      </div>
                    </td>
                    <td className="py-2 text-sm text-center">
                      { employee.currentOrders }
                    </td>
                    <td className="py-2 text-sm text-center">
                      { employee.completedToday }
                    </td>
                    <td className="py-2 text-center">
                      <span
                        className={ `px-2 py-1 text-xs rounded-full ${employee.status === "active"
                          ? "bg-green-500 bg-opacity-20 text-green-400"
                          : employee.status === "break"
                            ? "bg-orange-500 bg-opacity-20 text-orange-400"
                            : "bg-gray-500 bg-opacity-20 text-gray-400"
                          }` }
                      >
                        { employee.status === "active"
                          ? "Đang làm"
                          : employee.status === "break"
                            ? "Giải lao"
                            : "Offline" }
                      </span>
                    </td>
                  </tr>
                )) }
              </tbody>
            </table>
          </div>
        </div>

        <div className={ `p-4 rounded-lg border ${cardClass}` }>
          <h3 className="text-lg font-medium mb-4">Lịch làm việc hôm nay</h3>

          <div className="relative overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Ca làm việc
                  </th>
                  <th className="py-2 text-left text-xs font-medium text-gray-400">
                    Thời gian
                  </th>
                  <th className="py-2 text-center text-xs font-medium text-gray-400">
                    Số nhân viên
                  </th>
                  <th className="py-2 text-center text-xs font-medium text-gray-400">
                    Hiệu suất
                  </th>
                  <th className="py-2 text-center text-xs font-medium text-gray-400">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-2 text-sm">Ca sáng</td>
                  <td className="py-2 text-sm">06:00 - 14:00</td>
                  <td className="py-2 text-sm text-center">4</td>
                  <td className="py-2">
                    <div className="flex items-center justify-center">
                      <div className="w-24 bg-gray-700 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={ { width: "85%" } }
                        ></div>
                      </div>
                      <span className="text-xs">85%</span>
                    </div>
                  </td>
                  <td className="py-2 text-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500 bg-opacity-20 text-green-400">
                      Đang hoạt động
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 text-sm">Ca chiều</td>
                  <td className="py-2 text-sm">14:00 - 22:00</td>
                  <td className="py-2 text-sm text-center">2</td>
                  <td className="py-2">
                    <div className="flex items-center justify-center">
                      <div className="w-24 bg-gray-700 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={ { width: "0%" } }
                        ></div>
                      </div>
                      <span className="text-xs">0%</span>
                    </div>
                  </td>
                  <td className="py-2 text-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-500 bg-opacity-20 text-gray-400">
                      Chưa bắt đầu
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 text-sm">Ca đêm</td>
                  <td className="py-2 text-sm">22:00 - 06:00</td>
                  <td className="py-2 text-sm text-center">2</td>
                  <td className="py-2">
                    <div className="flex items-center justify-center">
                      <div className="w-24 bg-gray-700 rounded-full h-2.5 mr-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={ { width: "0%" } }
                        ></div>
                      </div>
                      <span className="text-xs">0%</span>
                    </div>
                  </td>
                  <td className="py-2 text-center">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-500 bg-opacity-20 text-gray-400">
                      Chưa bắt đầu
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              Đề xuất phân bổ nhân sự
            </h4>
            <div
              className={ `p-3 rounded-lg bg-blue-900 bg-opacity-10 border-l-4 border-blue-600 text-sm` }
            >
              <p>
                Khối lượng đơn hàng từ 14:00-17:00 tăng 25%, đề xuất điều chuyển
                1 nhân viên từ ca sáng sang ca chiều.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={ `p-4 rounded-lg border ${cardClass}` }>
        <h3 className="text-lg font-medium mb-4">
          Phân bổ đơn hàng theo nhân viên
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 text-left text-xs font-medium text-gray-400">
                  Nhân viên
                </th>
                <th className="py-2 text-left text-xs font-medium text-gray-400">
                  Đơn đang xử lý
                </th>
                <th className="py-2 text-left text-xs font-medium text-gray-400">
                  P1
                </th>
                <th className="py-2 text-left text-xs font-medium text-gray-400">
                  P2
                </th>
                <th className="py-2 text-left text-xs font-medium text-gray-400">
                  P3/P4
                </th>
                <th className="py-2 text-center text-xs font-medium text-gray-400">
                  Mức tải
                </th>
                <th className="py-2 text-center text-xs font-medium text-gray-400">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              { employees
                .filter((e) => e.status === "active")
                .map((employee, index) => (
                  <tr key={ index } className="border-b border-gray-700">
                    <td className="py-2 text-sm">{ employee.name }</td>
                    <td className="py-2 text-sm">
                      { employee.currentOrders } đơn
                    </td>
                    <td className="py-2 text-sm">
                      { Math.floor(Math.random() * 2) }
                    </td>
                    <td className="py-2 text-sm">
                      { Math.floor(Math.random() * 3) }
                    </td>
                    <td className="py-2 text-sm">
                      { Math.floor(Math.random() * 4) }
                    </td>
                    <td className="py-2">
                      <div className="flex items-center justify-center">
                        <div className="w-24 bg-gray-700 rounded-full h-2.5 mr-2">
                          <div
                            className={ `h-2.5 rounded-full ${(employee.currentOrders / 10) * 100 > 80
                              ? "bg-red-600"
                              : (employee.currentOrders / 10) * 100 > 50
                                ? "bg-yellow-600"
                                : "bg-green-600"
                              }` }
                            style={ {
                              width: `${(employee.currentOrders / 10) * 100}%`,
                            } }
                          ></div>
                        </div>
                        <span className="text-xs">
                          { (employee.currentOrders / 10) * 100 }%
                        </span>
                      </div>
                    </td>
                    <td className="py-2 flex justify-center space-x-1">
                      <button
                        className="p-1 text-blue-400 hover:text-blue-300"
                        title="Xem đơn"
                      >
                        <Eye size={ 16 } />
                      </button>
                      <button
                        className="p-1 text-green-400 hover:text-green-300"
                        title="Thêm đơn"
                      >
                        <Package size={ 16 } />
                      </button>
                      <button
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Bỏ đơn"
                      >
                        <XCircle size={ 16 } />
                      </button>
                    </td>
                  </tr>
                )) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Function tạo đơn hàng mẫu nếu chưa có
  const generateSampleOrders = () => {
    const locations = [
      { id: "A1", type: "Vali S" },
      { id: "A2", type: "Vali M" },
      { id: "A5", type: "Vali M" },
      { id: "A12", type: "Vali L" },
      { id: "B2", type: "Phụ kiện" },
      { id: "B8", type: "Phụ kiện" },
      { id: "B10", type: "Phụ kiện" },
      { id: "B15", type: "Phụ kiện" },
      { id: "C4", type: "Đặc biệt" },
      { id: "C10", type: "Đặc biệt" },
    ];

    const products = [
      {
        sku: "LAR-BLK-28L",
        name: "Vali Larita 28L",
        location: "A12",
        zone: "A",
      },
      {
        sku: "LAR-BLK-24M",
        name: "Vali Larita 24M",
        location: "A5",
        zone: "A",
      },
      {
        sku: "LAR-BLK-20S",
        name: "Vali Larita 20S",
        location: "A1",
        zone: "A",
      },
      {
        sku: "PIS-BLU-24M",
        name: "Vali Pisani 24M",
        location: "A2",
        zone: "A",
      },
      {
        sku: "TAG-BLK-01",
        name: "Luggage Tag Black",
        location: "B2",
        zone: "B",
      },
      {
        sku: "COV-BLK-M",
        name: "Cover Medium Black",
        location: "B8",
        zone: "B",
      },
      {
        sku: "TRK-BLK-01",
        name: "Travel Kit Black",
        location: "B10",
        zone: "B",
      },
      {
        sku: "PCK-BLK-S",
        name: "Pack-it Cube Small",
        location: "B15",
        zone: "B",
      },
      {
        sku: "HER-BLK-01",
        name: "Herschel Backpack Black",
        location: "C4",
        zone: "C",
      },
      {
        sku: "LTH-BRW-01",
        name: "Leather Travel Bag Brown",
        location: "C10",
        zone: "C",
      },
    ];

    // Tạo 15 đơn hàng mẫu
    const sampleOrders = [];
    for (let i = 1; i <= 15; i++) {
      // Số lượng sản phẩm trong đơn (1-3)
      const itemCount = Math.floor(Math.random() * 3) + 1;

      // Chọn ngẫu nhiên các sản phẩm
      const orderItems = [];
      const usedSkus = new Set();

      for (let j = 0; j < itemCount; j++) {
        let product = products[Math.floor(Math.random() * products.length)];

        // Tránh trùng lặp sản phẩm
        while (usedSkus.has(product.sku)) {
          product = products[Math.floor(Math.random() * products.length)];
        }

        usedSkus.add(product.sku);

        orderItems.push({
          ...product,
          quantity: Math.floor(Math.random() * 2) + 1,
        });
      }

      // Xác định priority
      let priority = "P3";
      if (i <= 3) priority = "P1";
      else if (i <= 7) priority = "P2";

      // Tạo đơn hàng
      sampleOrders.push({
        id: `SO0405:${123460 + i}`,
        priority,
        status: "pending",
        items: orderItems,
        createdAt: new Date().toISOString(),
        channel: Math.random() > 0.5 ? "Shopee" : "TikTok",
        deadline: new Date(
          new Date().getTime() + (24 + Math.random() * 24) * 60 * 60 * 1000
        ).toISOString(),
      });
    }

    return sampleOrders;
  };

  // Thêm useEffect để khởi tạo dữ liệu cho ví dụ
  useEffect(() => {
    // Chỉ chạy khi tab Picking được chọn
    if (activeTab === "picking") {
      // Thêm các đơn hàng mẫu nếu chưa có
      if (orders.length === 0) {
        const sampleOrders = generateSampleOrders();
        setOrders(sampleOrders);
      }

      // Tạo gợi ý tối ưu
      const optimizations = generatePickingOptimizations();

      // Thêm vào lịch sử hoạt động
      const newLog = {
        id: activityHistory.length + 1,
        type: "picking",
        action: "Xem tab Picking",
        user: currentUser?.name || "System",
        time: new Date().toLocaleTimeString("vi-VN"),
      };
      setActivityHistory((prev) => [newLog, ...prev]);
    }
  }, [activeTab]);

  const renderPickingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={ `p-4 rounded-lg border ${cardClass}` }>
          <h3 className="text-lg font-medium mb-4">Lộ trình lấy hàng tối ưu</h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-900 bg-opacity-10 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-blue-400 mb-2">Khu A</h4>
              <p className="text-xs opacity-75">Vali theo Size</p>
              <div className="mt-2 text-xs">Đơn: 8</div>
              <div className="mt-1 text-xs">SKU: 12</div>
            </div>
            <div className="bg-green-900 bg-opacity-10 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-green-400 mb-2">Khu B</h4>
              <p className="text-xs opacity-75">Phụ kiện</p>
              <div className="mt-2 text-xs">Đơn: 6</div>
              <div className="mt-1 text-xs">SKU: 15</div>
            </div>
            <div className="bg-purple-900 bg-opacity-10 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-purple-400 mb-2">
                Khu C
              </h4>
              <p className="text-xs opacity-75">Hàng đặc biệt</p>
              <div className="mt-2 text-xs">Đơn: 3</div>
              <div className="mt-1 text-xs">SKU: 5</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Lộ trình đề xuất</h4>
            <div className="p-3 rounded-lg bg-gray-800">
              <div className="flex items-center space-x-2 text-sm">
                <span className="inline-block px-2 py-1 bg-blue-500 rounded text-white text-xs">
                  A1
                </span>
                <span className="text-gray-400">→</span>
                <span className="inline-block px-2 py-1 bg-blue-500 rounded text-white text-xs">
                  A2
                </span>
                <span className="text-gray-400">→</span>
                <span className="inline-block px-2 py-1 bg-blue-500 rounded text-white text-xs">
                  A5
                </span>
                <span className="text-gray-400">→</span>
                <span className="inline-block px-2 py-1 bg-blue-500 rounded text-white text-xs">
                  A12
                </span>
                <span className="text-gray-400">→</span>
                <span className="inline-block px-2 py-1 bg-green-500 rounded text-white text-xs">
                  B2
                </span>
                <span className="text-gray-400">→</span>
                <span className="inline-block px-2 py-1 bg-green-500 rounded text-white text-xs">
                  B8
                </span>
              </div>
              <div className="mt-2 text-xs opacity-75">
                Áp dụng nguyên tắc: Đơn 1 sản phẩm → Đơn cùng loại → Đơn gần vị
                trí
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Gọi ý tối ưu lấy hàng</h4>
            <div
              className={ `p-3 rounded-lg bg-blue-900 bg-opacity-10 border-l-4 border-blue-600 text-sm` }
            >
              <p>
                Xử lý 5 đơn Vali Larita 28L cùng lúc từ vị trí A12 sẽ giảm 25%
                thời gian di chuyển.
              </p>
            </div>
          </div>
        </div>

        <div className={ `p-4 rounded-lg border ${cardClass}` }>
          <h3 className="text-lg font-medium mb-4">
            Đơn hàng theo lộ trình picking
          </h3>
          <div className="space-y-3">
            <div
              className={ `p-3 rounded-lg ${cardClass} border-l-4 border-blue-600` }
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium">
                    Batch #1: Khu A - Vali
                  </span>
                  <div className="flex space-x-1 mt-1">
                    <span className="px-1.5 py-0.5 text-xs rounded bg-blue-900 text-blue-400">
                      5 đơn
                    </span>
                    <span className="px-1.5 py-0.5 text-xs rounded bg-green-900 text-green-400">
                      8 SKU
                    </span>
                  </div>
                </div>
                <button
                  className={ `px-2 py-1 rounded text-xs ${buttonPrimaryClass}` }
                >
                  Bắt đầu lấy hàng
                </button>
              </div>
              <div className="mt-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="opacity-75">Đơn:</span> SO0405:123456,
                    SO0405:123460...
                  </div>
                  <div>
                    <span className="opacity-75">Vị trí:</span> A1, A2, A5, A12
                  </div>
                </div>
              </div>
            </div>

            <div
              className={ `p-3 rounded-lg ${cardClass} border-l-4 border-green-600` }
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium">
                    Batch #2: Khu B - Phụ kiện
                  </span>
                  <div className="flex space-x-1 mt-1">
                    <span className="px-1.5 py-0.5 text-xs rounded bg-blue-900 text-blue-400">
                      4 đơn
                    </span>
                    <span className="px-1.5 py-0.5 text-xs rounded bg-green-900 text-green-400">
                      10 SKU
                    </span>
                  </div>
                </div>
                <button
                  className={ `px-2 py-1 rounded text-xs ${buttonSecondaryClass}` }
                >
                  Bắt đầu lấy hàng
                </button>
              </div>
              <div className="mt-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="opacity-75">Đơn:</span> SO0405:123458,
                    SO0405:123459...
                  </div>
                  <div>
                    <span className="opacity-75">Vị trí:</span> B2, B8, B15
                  </div>
                </div>
              </div>
            </div>

            <div
              className={ `p-3 rounded-lg ${cardClass} border-l-4 border-purple-600` }
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium">
                    Batch #3: Khu C - Hàng đặc biệt
                  </span>
                  <div className="flex space-x-1 mt-1">
                    <span className="px-1.5 py-0.5 text-xs rounded bg-blue-900 text-blue-400">
                      2 đơn
                    </span>
                    <span className="px-1.5 py-0.5 text-xs rounded bg-green-900 text-green-400">
                      3 SKU
                    </span>
                  </div>
                </div>
                <button
                  className={ `px-2 py-1 rounded text-xs ${buttonSecondaryClass}` }
                >
                  Bắt đầu lấy hàng
                </button>
              </div>
              <div className="mt-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="opacity-75">Đơn:</span> SO0405:123461,
                    SO0405:123462
                  </div>
                  <div>
                    <span className="opacity-75">Vị trí:</span> C4, C10
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              Nguyên tắc lấy hàng theo 80/20
            </h4>
            <div className={ `p-3 rounded-lg bg-gray-900 text-sm` }>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Xử lý đơn P1 trước 100%</li>
                <li>Xử lý đơn 1 sản phẩm (nhanh chóng hoàn thành)</li>
                <li>Gom nhóm đơn cùng loại sản phẩm (giảm di chuyển)</li>
                <li>Nhóm đơn gần vị trí nhau (tối ưu lộ trình)</li>
                <li>Xử lý đơn nhiều loại sản phẩm sau cùng</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className={ `p-4 rounded-lg border ${cardClass}` }>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            Mô hình kho và vị trí đơn hàng
          </h3>
          <div className="flex space-x-2">
            <button
              className={ `px-3 py-1 rounded text-sm flex items-center ${buttonSecondaryClass}` }
            >
              <List size={ 16 } className="mr-1" /> Danh sách
            </button>
            <button
              className={ `px-3 py-1 rounded text-sm flex items-center ${buttonPrimaryClass}` }
            >
              <Grid size={ 16 } className="mr-1" /> Mô hình kho
            </button>
          </div>
        </div>

        <div className="relative p-4 border border-gray-700 rounded-lg">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-blue-900 text-white text-center p-2 rounded">
              A1
              <div className="text-xs mt-1">Vali S</div>
            </div>
            <div className="bg-blue-900 text-white text-center p-2 rounded">
              A2
              <div className="text-xs mt-1">Vali M</div>
            </div>
            <div className="bg-blue-900 text-white text-center p-2 rounded relative">
              A5
              <div className="text-xs mt-1">Vali M</div>
              <div className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                2
              </div>
            </div>
            <div className="bg-blue-900 text-white text-center p-2 rounded relative">
              A12
              <div className="text-xs mt-1">Vali L</div>
              <div className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </div>
            </div>
          </div>

          <div className="bg-gray-700 h-6 mb-4 flex items-center justify-center text-xs">
            Lối đi
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-green-900 text-white text-center p-2 rounded relative">
              B2
              <div className="text-xs mt-1">Phụ kiện</div>
              <div className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                1
              </div>
            </div>
            <div className="bg-green-900 text-white text-center p-2 rounded relative">
              B8
              <div className="text-xs mt-1">Phụ kiện</div>
              <div className="absolute -top-1 -right-1 bg-red-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                2
              </div>
            </div>
            <div className="bg-green-900 text-white text-center p-2 rounded">
              B10
              <div className="text-xs mt-1">Phụ kiện</div>
            </div>
            <div className="bg-green-900 text-white text-center p-2 rounded relative">
              B15
              <div className="text-xs mt-1">Phụ kiện</div>
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                1
              </div>
            </div>
          </div>

          <div className="bg-gray-700 h-6 mb-4 flex items-center justify-center text-xs">
            Lối đi
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="bg-purple-900 text-white text-center p-2 rounded relative">
              C4
              <div className="text-xs mt-1">Đặc biệt</div>
              <div className="absolute -top-1 -right-1 bg-yellow-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                1
              </div>
            </div>
            <div className="bg-purple-900 text-white text-center p-2 rounded">
              C8
              <div className="text-xs mt-1">Đặc biệt</div>
            </div>
            <div className="bg-purple-900 text-white text-center p-2 rounded relative">
              C10
              <div className="text-xs mt-1">Đặc biệt</div>
              <div className="absolute -top-1 -right-1 bg-blue-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                1
              </div>
            </div>
            <div className="bg-purple-900 text-white text-center p-2 rounded">
              C12
              <div className="text-xs mt-1">Đặc biệt</div>
            </div>
          </div>

          <div className="mt-4 text-xs flex justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span>Đơn P1</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
              <span>Đơn P2</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <span>Đơn P3/P4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  // Render tab mô hình kho
  const renderWarehouseMapTab = () => {

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap md:flex-nowrap gap-4">
          <div className="w-full md:w-8/12 space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Mô hình kho hàng</h3>
                <div className="flex space-x-2">
                  <select
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                    value={ warehouseViewMode }
                    onChange={ (e) => setWarehouseViewMode(e.target.value) }
                  >
                    <option value="default">Xem thường</option>
                    <option value="heat">Xem mật độ đơn</option>
                    <option value="efficiency">Xem hiệu suất khu vực</option>
                  </select>
                  <button
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm flex items-center"
                    onClick={ () => setShowPicking(!showPicking) }
                  >
                    { showPicking ? (
                      <>
                        <EyeOff size={ 14 } className="mr-1" />
                        Ẩn lộ trình
                      </>
                    ) : (
                      <>
                        <Eye size={ 14 } className="mr-1" />
                        Xem lộ trình
                      </>
                    ) }
                  </button>
                </div>
              </div>
              { renderWarehouseMap() }
            </div>

            { renderPickingOptimizations() }
          </div>

          <div className="w-full md:w-4/12 space-y-4">
            { renderBatchPicking() }
          </div>
        </div>

        {/* Hiển thị chi tiết vị trí khi được chọn */ }
        { renderLocationDetailsModal() }
      </div>
    );
  };

  const renderAlertsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={ `lg:col-span-2 p-4 rounded-lg border ${cardClass}` }>
          <h3 className="text-lg font-medium mb-4">Cấu hình cảnh báo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">
                Ngưỡng cảnh báo thời gian
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm block mb-1">
                    Cảnh báo khẩn cấp (phút)
                  </label>
                  <input
                    type="number"
                    className={ `w-full p-2 rounded ${inputClass}` }
                    defaultValue="30"
                  />
                  <p className="text-xs opacity-75 mt-1">
                    Cảnh báo khi đơn hàng còn ít hơn số phút này để hoàn thành
                  </p>
                </div>
                <div>
                  <label className="text-sm block mb-1">
                    Cảnh báo thông thường (phút)
                  </label>
                  <input
                    type="number"
                    className={ `w-full p-2 rounded ${inputClass}` }
                    defaultValue="120"
                  />
                  <p className="text-xs opacity-75 mt-1">
                    Cảnh báo khi đơn hàng còn ít hơn số phút này để hoàn thành
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-medium mb-2 mt-4">
                Tần suất kiểm tra
              </h4>
              <div>
                <select className={ `w-full p-2 rounded ${inputClass}` }>
                  <option>Mỗi 5 phút</option>
                  <option>Mỗi 10 phút</option>
                  <option>Mỗi 15 phút</option>
                  <option>Mỗi 30 phút</option>
                </select>
                <p className="text-xs opacity-75 mt-1">
                  Hệ thống sẽ tự động kiểm tra đơn hàng sắp trễ hạn với tần suất
                  này
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">
                Kích hoạt cảnh báo khi
              </h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Đơn trễ hạn SLA</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Tồn kho thấp</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Hiệu suất nhân viên thấp</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Khu vực kho quá tải</span>
                </label>
              </div>

              <h4 className="text-sm font-medium mb-2 mt-4">
                Nhận thông báo qua
              </h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Dashboard</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">Email</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Telegram</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button className={ `px-4 py-2 rounded ${buttonPrimaryClass}` }>
              Lưu cấu hình
            </button>
          </div>
        </div>

        <div className={ `p-4 rounded-lg border ${cardClass}` }>
          <h3 className="text-lg font-medium mb-4">Cảnh báo hoạt động</h3>
          <div className="space-y-3">
            { alerts.map((alert, index) => (
              <div
                key={ index }
                className={ `p-3 rounded-lg ${alert.type === "urgent"
                  ? "bg-red-900 bg-opacity-20 border-l-4 border-red-600"
                  : alert.type === "warning"
                    ? "bg-yellow-900 bg-opacity-20 border-l-4 border-yellow-600"
                    : "bg-blue-900 bg-opacity-20 border-l-4 border-blue-600"
                  }` }
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    { alert.type === "urgent" ? (
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500 mt-0.5" />
                    ) : alert.type === "warning" ? (
                      <Bell className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 mr-2 text-blue-500 mt-0.5" />
                    ) }
                    <div>
                      <p className="font-medium text-sm">{ alert.title }</p>
                      <p className="text-xs opacity-75 mt-1">{ alert.message }</p>
                    </div>
                  </div>
                  <span className="text-xs opacity-75">{ alert.time }</span>
                </div>
                <div className="mt-2 flex justify-end space-x-2">
                  <button className="text-xs text-blue-400 hover:text-blue-300">
                    Xử lý
                  </button>
                  <button className="text-xs text-gray-400 hover:text-gray-300">
                    Bỏ qua
                  </button>
                </div>
              </div>
            )) }
            <button
              className={ `w-full py-2 rounded text-sm ${buttonSecondaryClass}` }
            >
              Tải thêm cảnh báo
            </button>
          </div>
        </div>
      </div>

      <div className={ `p-4 rounded-lg border ${cardClass}` }>
        <h3 className="text-lg font-medium mb-4">Đề xuất tối ưu theo SLA</h3>
        <div className="space-y-4">
          <div
            className={ `p-4 rounded-lg bg-blue-900 bg-opacity-10 border-l-4 border-blue-600` }
          >
            <h4 className="font-medium text-blue-400 mb-2">
              Tối ưu bố trí kho
            </h4>
            <p className="text-sm mb-2">
              Dựa trên dữ liệu 30 ngày qua, các khu vực sau nên được sắp xếp lại
              để tối ưu hiệu suất lấy hàng:
            </p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>
                Di chuyển Vali Larita size M từ A5 → A3 (gần khu vực lấy hàng
                chính)
              </li>
              <li>
                Tập trung phụ kiện Mia Tag tại B2 (25% đơn hàng có sản phẩm này)
              </li>
              <li>Tạo khu vực riêng cho đơn có hàng mix Vali + Phụ kiện</li>
            </ul>
            <div className="mt-2 flex justify-end">
              <button
                className={ `px-3 py-1 rounded text-xs ${buttonSecondaryClass}` }
              >
                Xem chi tiết
              </button>
            </div>
          </div>

          <div
            className={ `p-4 rounded-lg bg-green-900 bg-opacity-10 border-l-4 border-green-600` }
          >
            <h4 className="font-medium text-green-400 mb-2">Tối ưu nhân sự</h4>
            <p className="text-sm mb-2">
              Khuyến nghị điều chỉnh lịch ca làm việc để đáp ứng tốt hơn SLA
              trong những thời điểm cao điểm:
            </p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Tăng 1 nhân viên vào khung giờ 14:00-17:00 (đơn tăng 25%)</li>
              <li>
                Bố trí nhân viên hiệu suất cao xử lý đơn P1 trong khung giờ
                9:00-11:00
              </li>
              <li>
                Điều chuyển Lê Văn C để hỗ trợ xử lý đơn khu vực A (hiệu suất
                45%)
              </li>
            </ul>
            <div className="mt-2 flex justify-end">
              <button
                className={ `px-3 py-1 rounded text-xs ${buttonSecondaryClass}` }
              >
                Xem chi tiết
              </button>
            </div>
          </div>

          <div
            className={ `p-4 rounded-lg bg-purple-900 bg-opacity-10 border-l-4 border-purple-600` }
          >
            <h4 className="font-medium text-purple-400 mb-2">
              Tối ưu quy trình xử lý đơn
            </h4>
            <p className="text-sm mb-2">
              Áp dụng các chiến lược sau để tối ưu quy trình xử lý đơn hàng:
            </p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>
                Gom nhóm đơn Shopee trước 10:00 để xử lý cùng lúc (giảm 30% thời
                gian)
              </li>
              <li>
                Xử lý đơn 1 sản phẩm trước để giải phóng nhanh backlog (15 đơn)
              </li>
              <li>
                Tạo batch processing cho đơn cùng loại sản phẩm (Vali 28L, Mia
                Tag)
              </li>
            </ul>
            <div className="mt-2 flex justify-end">
              <button
                className={ `px-3 py-1 rounded text-xs ${buttonSecondaryClass}` }
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className={ `lg:col-span-2 p-4 rounded-lg border ${cardClass}` }>
          <h3 className="text-lg font-medium mb-4">
            Báo cáo hiệu suất hệ thống
          </h3>

          <div className="mb-6">
            <h4 className="font-medium text-sm mb-2">Tỷ lệ đơn đúng hạn SLA</h4>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-1">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={ { width: "95.5%" } }
              ></div>
            </div>
            <div className="flex justify-between text-xs">
              <div>0%</div>
              <div>SLA đạt: 95.5%</div>
              <div>100%</div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-sm mb-2">
              Thời gian xử lý trung bình theo loại đơn
            </h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-24 text-sm">P1 - Gấp:</div>
                <div className="flex-1 bg-gray-700 rounded-full h-3 mx-2">
                  <div
                    className="bg-red-500 h-3 rounded-full"
                    style={ { width: "35%" } }
                  ></div>
                </div>
                <div className="text-sm">18 phút</div>
              </div>
              <div className="flex items-center">
                <div className="w-24 text-sm">P2 - Cảnh báo:</div>
                <div className="flex-1 bg-gray-700 rounded-full h-3 mx-2">
                  <div
                    className="bg-yellow-500 h-3 rounded-full"
                    style={ { width: "42%" } }
                  ></div>
                </div>
                <div className="text-sm">22 phút</div>
              </div>
              <div className="flex items-center">
                <div className="w-24 text-sm">P3 - Bình thường:</div>
                <div className="flex-1 bg-gray-700 rounded-full h-3 mx-2">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={ { width: "68%" } }
                  ></div>
                </div>
                <div className="text-sm">35 phút</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">
              Hiệu suất kho theo ngày (đơn/giờ)
            </h4>
            <div className="h-44">
              <div className="w-full h-full flex items-end">
                { [38, 42, 45, 38, 52, 48, 41].map((value, index) => (
                  <div
                    key={ index }
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-6 bg-blue-500 rounded-t"
                      style={ { height: `${(value / 52) * 100}%` } }
                    ></div>
                    <div className="text-xs pt-1">T{ index + 2 }</div>
                  </div>
                )) }
              </div>
            </div>
          </div>
        </div>

        <div className={ `p-4 rounded-lg border ${cardClass}` }>
          <h3 className="text-lg font-medium mb-4">
            Phân bổ đơn hàng theo kênh
          </h3>
          <div className="relative h-44 mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" width="160" height="160">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="10"
                  strokeDasharray="282.74"
                  strokeDashoffset="212"
                  transform="rotate(-90 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="10"
                  strokeDasharray="282.74"
                  strokeDashoffset="226.2"
                  transform="rotate(25 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="10"
                  strokeDasharray="282.74"
                  strokeDashoffset="254.5"
                  transform="rotate(56 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="10"
                  strokeDasharray="282.74"
                  strokeDashoffset="268"
                  transform="rotate(75 50 50)"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill={ darkMode ? "#1F2937" : "#F9FAFB" }
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="flex-1">Shopee</div>
              <div>45%</div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <div className="flex-1">TikTok</div>
              <div>25%</div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <div className="flex-1">Lazada</div>
              <div>15%</div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <div className="flex-1">Website & Khác</div>
              <div>15%</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-sm mb-2">Xuất báo cáo</h4>
            <div className="space-y-2">
              <button
                className={ `w-full py-2 px-3 flex items-center justify-center rounded ${buttonSecondaryClass}` }
              >
                <Download size={ 16 } className="mr-2" />
                Báo cáo ngày hôm nay
              </button>
              <button
                className={ `w-full py-2 px-3 flex items-center justify-center rounded ${buttonSecondaryClass}` }
              >
                <Download size={ 16 } className="mr-2" />
                Báo cáo 7 ngày qua
              </button>
              <button
                className={ `w-full py-2 px-3 flex items-center justify-center rounded ${buttonSecondaryClass}` }
              >
                <Download size={ 16 } className="mr-2" />
                Báo cáo theo tùy chọn
              </button>
            </div>
          </div>
        </div>
      </div>

      { render80_20AnalysisSection() }

      <div className={ `p-4 rounded-lg border ${cardClass}` }>
        <h3 className="text-lg font-medium mb-4">
          So sánh hiệu suất nhân viên
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 text-left text-xs font-medium text-gray-400">
                  Nhân viên
                </th>
                <th className="py-2 text-center text-xs font-medium text-gray-400">
                  Đơn/giờ
                </th>
                <th className="py-2 text-center text-xs font-medium text-gray-400">
                  SLA đạt
                </th>
                <th className="py-2 text-center text-xs font-medium text-gray-400">
                  Tỷ lệ P1
                </th>
                <th className="py-2 text-center text-xs font-medium text-gray-400">
                  Thời gian TB
                </th>
                <th className="py-2 text-center text-xs font-medium text-gray-400">
                  Xếp hạng
                </th>
              </tr>
            </thead>
            <tbody>
              { employees.map((employee, index) => (
                <tr key={ index } className="border-b border-gray-700">
                  <td className="py-2 text-sm">{ employee.name }</td>
                  <td className="py-2 text-sm text-center">
                    { employee.efficiency }
                  </td>
                  <td className="py-2 text-sm text-center">
                    { 90 + Math.floor(Math.random() * 10) }%
                  </td>
                  <td className="py-2 text-sm text-center">
                    { 10 + Math.floor(Math.random() * 20) }%
                  </td>
                  <td className="py-2 text-sm text-center">
                    { 15 + Math.floor(Math.random() * 10) } phút
                  </td>
                  <td className="py-2 text-center">
                    <div className="flex justify-center">
                      { employee.efficiency >= 40 ? (
                        <span className="px-2 py-1 text-xs bg-green-500 bg-opacity-20 text-green-400 rounded-full">
                          Xuất sắc
                        </span>
                      ) : employee.efficiency >= 35 ? (
                        <span className="px-2 py-1 text-xs bg-blue-500 bg-opacity-20 text-blue-400 rounded-full">
                          Tốt
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-500 bg-opacity-20 text-yellow-400 rounded-full">
                          Bình thường
                        </span>
                      ) }
                    </div>
                  </td>
                </tr>
              )) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Component cho tab lịch sử hoạt động
  const renderHistoryTab = () => (
    <div className={ `p-4 rounded-lg border ${cardClass}` }>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Lịch sử hoạt động</h3>
        <div className="flex space-x-2">
          <select className={ `px-3 py-1 rounded text-sm ${inputClass}` }>
            <option value="all">Tất cả</option>
            <option value="order">Đơn hàng</option>
            <option value="staff">Nhân viên</option>
            <option value="sla">SLA</option>
            <option value="picking">Picking</option>
          </select>
          <button
            className={ `px-3 py-1 rounded text-sm flex items-center ${buttonSecondaryClass}` }
          >
            <RefreshCw size={ 16 } className="mr-1" /> Làm mới
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Thời gian
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Loại
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Hành động
              </th>
              <th className="py-2 text-left text-xs font-medium text-gray-400">
                Người thực hiện
              </th>
            </tr>
          </thead>
          <tbody>
            { activityHistory.map((log, index) => (
              <tr key={ index } className="border-b border-gray-700">
                <td className="py-2 text-sm">{ log.time }</td>
                <td className="py-2 text-sm">
                  <span
                    className={ `px-2 py-1 text-xs rounded-full ${log.type === "order"
                      ? "bg-blue-500 bg-opacity-20 text-blue-400"
                      : log.type === "staff"
                        ? "bg-green-500 bg-opacity-20 text-green-400"
                        : log.type === "sla"
                          ? "bg-red-500 bg-opacity-20 text-red-400"
                          : "bg-purple-500 bg-opacity-20 text-purple-400"
                      }` }
                  >
                    { log.type === "order"
                      ? "Đơn hàng"
                      : log.type === "staff"
                        ? "Nhân viên"
                        : log.type === "sla"
                          ? "SLA"
                          : "Picking" }
                  </span>
                </td>
                <td className="py-2 text-sm">{ log.action }</td>
                <td className="py-2 text-sm">{ log.user }</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  );

  // Component view cho nhân viên
  const renderMyOrdersTab = () => (
    <div className="space-y-6">
      <div className={ `p-4 rounded-lg border ${cardClass}` }>
        <h3 className="text-lg font-medium mb-4">Đơn hàng được phân công</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 text-left text-xs font-medium text-gray-400">
                  Mã đơn
                </th>
                <th className="py-2 text-left text-xs font-medium text-gray-400">
                  SLA
                </th>
                <th className="py-2 text-left text-xs font-medium text-gray-400">
                  Chi tiết
                </th>
                <th className="py-2 text-left text-xs font-medium text-gray-400">
                  Vị trí
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
              { filteredOrders
                .filter((order) => order.assignedTo === currentUser?.id)
                .map((order, index) => (
                  <tr key={ index } className="border-b border-gray-700">
                    <td className="py-2 text-sm">{ order.id }</td>
                    <td className="py-2 text-sm">
                      <span
                        className={ `px-2 py-1 text-xs rounded-full ${order.priority === "P1"
                          ? "bg-red-500 bg-opacity-20 text-red-400"
                          : order.priority === "P2"
                            ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                            : "bg-green-500 bg-opacity-20 text-green-400"
                          }` }
                      >
                        { order.priority }
                      </span>
                    </td>
                    <td className="py-2 text-sm max-w-xs truncate">
                      { order.detail }
                    </td>
                    <td className="py-2 text-sm">{ order.location }</td>
                    <td className="py-2 text-sm">
                      <span
                        className={ `px-2 py-1 text-xs rounded-full ${order.status === "pending"
                          ? "bg-yellow-500 bg-opacity-20 text-yellow-400"
                          : order.status === "processing"
                            ? "bg-blue-500 bg-opacity-20 text-blue-400"
                            : "bg-green-500 bg-opacity-20 text-green-400"
                          }` }
                      >
                        { order.status === "pending"
                          ? "Chờ xử lý"
                          : order.status === "processing"
                            ? "Đang xử lý"
                            : "Hoàn thành" }
                      </span>
                    </td>
                    <td className="py-2 flex justify-center space-x-1">
                      <button
                        className="p-1 text-green-400 hover:text-green-300"
                        title="Bắt đầu"
                      >
                        <CheckCircle size={ 16 } />
                      </button>
                      <button
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Báo lỗi"
                      >
                        <XCircle size={ 16 } />
                      </button>
                    </td>
                  </tr>
                )) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className={ `p-4 rounded-lg border ${cardClass}` }>
      <h3 className="text-lg font-medium mb-4">Thông tin cá nhân</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-white">
            { currentUser?.name?.charAt(0) }
          </div>
          <div>
            <h4 className="text-xl font-semibold">{ currentUser?.name }</h4>
            <p className="text-sm text-gray-400">{ currentUser?.role }</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mã nhân viên
            </label>
            <p className="text-sm opacity-80">NV001</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Ca làm việc
            </label>
            <p className="text-sm opacity-80">Ca sáng (6:00 - 14:00)</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <p className="text-sm opacity-80">nhanvien@example.com</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Điện thoại</label>
            <p className="text-sm opacity-80">0123 456 789</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={ `p-4 rounded-lg border ${cardClass}` }>
          <h4 className="text-sm font-medium mb-2">Đơn hoàn thành hôm nay</h4>
          <p className="text-3xl font-bold">15</p>
          <p className="text-xs text-gray-400 mt-1">+3 so với hôm qua</p>
        </div>
        <div className={ `p-4 rounded-lg border ${cardClass}` }>
          <h4 className="text-sm font-medium mb-2">Hiệu suất</h4>
          <p className="text-3xl font-bold">42%</p>
          <p className="text-xs text-gray-400 mt-1">Trung bình team: 38%</p>
        </div>
        <div className={ `p-4 rounded-lg border ${cardClass}` }>
          <h4 className="text-sm font-medium mb-2">Tỷ lệ đúng hạn</h4>
          <p className="text-3xl font-bold text-green-500">98%</p>
          <p className="text-xs text-gray-400 mt-1">Target: 95%</p>
        </div>
      </div>

      <div className={ `p-4 rounded-lg border ${cardClass}` }>
        <h3 className="text-lg font-medium mb-4">Hiệu suất 7 ngày qua</h3>
        <div className="h-64">
          <div className="w-full h-full flex items-end justify-between">
            { [15, 18, 16, 20, 22, 17, 15].map((value, index) => (
              <div key={ index } className="flex flex-col items-center w-full">
                <div
                  className="w-8 bg-blue-500 rounded-t"
                  style={ { height: `${(value / 25) * 100}%` } }
                  title={ `${value} đơn` }
                ></div>
                <div className="text-xs mt-1">T{ index + 2 }</div>
              </div>
            )) }
          </div>
        </div>
      </div>
    </div>
  );

  // Render mô hình kho với hiệu ứng trực quan
  const renderWarehouseMap = () => {
    const warehouseZones = [
      { id: "A", name: "Khu A - Vali", color: "#3B82F6", rows: 3, cols: 4 },
      { id: "B", name: "Khu B - Phụ kiện", color: "#10B981", rows: 2, cols: 4 },
      { id: "C", name: "Khu C - Đặc biệt", color: "#8B5CF6", rows: 2, cols: 4 },
    ];

    // Chuyển đổi từ flat list sang grid để dễ render
    const createLocationGrid = (zone) => {
      const grid = [];
      let locationIndex = 1;

      for (let row = 0; row < zone.rows; row++) {
        const rowItems = [];
        for (let col = 0; col < zone.cols; col++) {
          const locationId = `${zone.id}${locationIndex}`;

          // Tìm số lượng đơn tại vị trí này
          const p1Count = orders.filter(
            (o) =>
              o.status !== "completed" &&
              o.priority === "P1" &&
              o.items?.some((item) => item.location === locationId)
          ).length;

          const p2Count = orders.filter(
            (o) =>
              o.status !== "completed" &&
              o.priority === "P2" &&
              o.items?.some((item) => item.location === locationId)
          ).length;

          const p3Count = orders.filter(
            (o) =>
              o.status !== "completed" &&
              o.priority === "P3" &&
              o.items?.some((item) => item.location === locationId)
          ).length;

          const isHighlighted = highlightedLocations.includes(locationId);

          rowItems.push({
            id: locationId,
            p1Count,
            p2Count,
            p3Count,
            total: p1Count + p2Count + p3Count,
            isHighlighted,
          });

          locationIndex++;
        }
        grid.push(rowItems);
      }

      return grid;
    };

    return (
      <div className="space-y-4">
        { warehouseZones.map((zone) => {
          const locationGrid = createLocationGrid(zone);

          return (
            <div key={ zone.id } className="space-y-2">
              { locationGrid.map((row, rowIndex) => (
                <div
                  key={ `${zone.id}-row-${rowIndex}` }
                  className="flex space-x-2"
                >
                  { row.map((location) => (
                    <div
                      key={ location.id }
                      className={ `flex-1 p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 ${location.isHighlighted
                        ? "border-2 border-yellow-400 shadow-lg animate-pulse"
                        : "border border-gray-700"
                        }` }
                      style={ {
                        backgroundColor:
                          location.total > 0 ? `${zone.color}30` : "#1F2937",
                        boxShadow: location.isHighlighted
                          ? "0 0 15px rgba(251, 191, 36, 0.5)"
                          : "none",
                      } }
                      onClick={ () =>
                        handleLocationClick({
                          id: location.id,
                          zone: zone.id,
                          type:
                            zone.id === "A"
                              ? "Vali"
                              : zone.id === "B"
                                ? "Phụ kiện"
                                : "Đặc biệt",
                        })
                      }
                    >
                      <div className="text-center">
                        <div className="font-medium mb-1">{ location.id }</div>
                        <div className="text-xs text-gray-400">
                          { zone.id === "A"
                            ? "Vali"
                            : zone.id === "B"
                              ? "Phụ kiện"
                              : "Đặc biệt" }
                        </div>

                        {/* Hiển thị số lượng đơn */ }
                        { location.total > 0 && (
                          <div className="mt-2 flex justify-center space-x-2">
                            { location.p1Count > 0 && (
                              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                { location.p1Count }
                              </span>
                            ) }
                            { location.p2Count > 0 && (
                              <span className="w-5 h-5 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">
                                { location.p2Count }
                              </span>
                            ) }
                            { location.p3Count > 0 && (
                              <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                                { location.p3Count }
                              </span>
                            ) }
                          </div>
                        ) }
                      </div>
                    </div>
                  )) }
                </div>
              )) }

              {/* Lối đi giữa các khu vực */ }
              { zone.id !== "C" && (
                <div className="h-6 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                  Lối đi
                </div>
              ) }
            </div>
          );
        }) }

        <div className="flex justify-center space-x-4 mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span className="text-xs">Đơn P1</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
            <span className="text-xs">Đơn P2</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs">Đơn P3/P4</span>
          </div>
          { highlightedLocations.length > 0 && (
            <div className="flex items-center">
              <div className="w-3 h-3 border-2 border-yellow-400 rounded-full mr-1 animate-pulse"></div>
              <span className="text-xs">Đang lấy hàng</span>
            </div>
          ) }
        </div>
      </div>
    );
  };

  // Render modal chi tiết vị trí kho khi click vào một vị trí
  const renderLocationDetailsModal = () => {
    if (!showLocationDetails || !selectedLocation) {
      return null;
    }

    // Tìm các đơn hàng tại vị trí này
    const ordersAtLocation = orders.filter(
      (order) =>
        order.status !== "completed" &&
        order.items &&
        order.items.some((item) => item.location === selectedLocation.id)
    );

    // Dữ liệu thống kê cho vị trí
    const totalItems = ordersAtLocation.reduce(
      (acc, order) =>
        acc +
        order.items.filter((item) => item.location === selectedLocation.id)
          .length,
      0
    );

    const p1Orders = ordersAtLocation.filter((o) => o.priority === "P1");
    const p2Orders = ordersAtLocation.filter((o) => o.priority === "P2");
    const p3Orders = ordersAtLocation.filter((o) => o.priority === "P3");

    // Tạo batch từ đơn hàng tại vị trí này
    const handleCreateBatchFromLocation = () => {
      if (ordersAtLocation.length === 0) return;

      const newBatch = {
        id: `batch-loc-${new Date().getTime()}`,
        name: `Batch: Vị trí ${selectedLocation.id}`,
        orders: ordersAtLocation,
        locations: [selectedLocation.id],
        status: "pending",
        createdAt: new Date().toISOString(),
        principle: PARETO_PRINCIPLES.NEARBY_LOCATIONS.id,
        principleLabel: PARETO_PRINCIPLES.NEARBY_LOCATIONS.name,
      };

      setPickingBatches([newBatch, ...pickingBatches]);

      // Thông báo
      setAlerts([
        {
          id: Math.random().toString(36).substr(2, 9),
          type: "success",
          title: "Tạo batch mới",
          message: `Đã tạo batch mới cho ${ordersAtLocation.length} đơn tại vị trí ${selectedLocation.id}`,
          time: new Date().toLocaleTimeString("vi-VN"),
        },
        ...alerts,
      ]);

      // Thêm vào lịch sử hoạt động
      const newLog = {
        id: activityHistory.length + 1,
        type: "picking",
        action: `Tạo batch từ vị trí ${selectedLocation.id} (${ordersAtLocation.length} đơn)`,
        user: currentUser?.name || "System",
        time: new Date().toLocaleTimeString("vi-VN"),
      };
      setActivityHistory([newLog, ...activityHistory]);

      // Đóng modal
      setShowLocationDetails(false);

      // Cuộn đến phần batch picking
      document.getElementById("batch-picking-section")?.scrollIntoView({
        behavior: "smooth",
      });
    };

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">
              Chi tiết vị trí: { selectedLocation.id }
            </h3>
            <button
              className="text-gray-400 hover:text-white"
              onClick={ () => setShowLocationDetails(false) }
            >
              <X size={ 24 } />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  { ordersAtLocation.length }
                </div>
                <div className="text-sm text-gray-300">Đơn hàng</div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{ totalItems }</div>
                <div className="text-sm text-gray-300">Sản phẩm</div>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-center">
                <div className="flex justify-center space-x-3 mb-2">
                  { p1Orders.length > 0 && (
                    <div className="bg-red-500 px-2 py-1 rounded text-sm">
                      P1: { p1Orders.length }
                    </div>
                  ) }
                  { p2Orders.length > 0 && (
                    <div className="bg-yellow-500 px-2 py-1 rounded text-sm">
                      P2: { p2Orders.length }
                    </div>
                  ) }
                  { p3Orders.length > 0 && (
                    <div className="bg-blue-500 px-2 py-1 rounded text-sm">
                      P3: { p3Orders.length }
                    </div>
                  ) }
                </div>
                <div className="text-sm text-gray-300">Phân loại</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-3">Đơn hàng tại vị trí này</h4>

            { ordersAtLocation.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-700 rounded-lg">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs uppercase">
                        Mã đơn
                      </th>
                      <th className="px-4 py-2 text-left text-xs uppercase">
                        Ưu tiên
                      </th>
                      <th className="px-4 py-2 text-left text-xs uppercase">
                        Sản phẩm
                      </th>
                      <th className="px-4 py-2 text-left text-xs uppercase">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    { ordersAtLocation.map((order) => (
                      <tr key={ order.id } className="hover:bg-gray-600">
                        <td className="px-4 py-2">
                          <span className="font-medium">{ order.id }</span>
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={ `inline-block px-2 py-1 rounded-full text-xs ${order.priority === "P1"
                              ? "bg-red-900 text-red-300"
                              : order.priority === "P2"
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-blue-900 text-blue-300"
                              }` }
                          >
                            { order.priority }
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="text-sm">
                            { order.items
                              .filter(
                                (item) => item.location === selectedLocation.id
                              )
                              .map((item, idx) => (
                                <div key={ idx } className="mb-1 last:mb-0">
                                  { item.name } ({ item.sku })
                                </div>
                              )) }
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={ `inline-block px-2 py-1 rounded-full text-xs ${order.status === "pending"
                              ? "bg-gray-600 text-gray-300"
                              : order.status === "processing"
                                ? "bg-blue-900 text-blue-300"
                                : "bg-green-900 text-green-300"
                              }` }
                          >
                            { order.status }
                          </span>
                        </td>
                      </tr>
                    )) }
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-700 p-4 rounded-lg text-center">
                <p className="text-gray-400">
                  Không có đơn hàng nào tại vị trí này
                </p>
              </div>
            ) }
          </div>

          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded"
              onClick={ () => setShowLocationDetails(false) }
            >
              Đóng
            </button>

            { ordersAtLocation.length > 0 && (
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center"
                onClick={ handleCreateBatchFromLocation }
              >
                <Package size={ 16 } className="mr-2" />
                Tạo batch từ vị trí này
              </button>
            ) }
          </div>
        </div>
      </div>
    );
  };

  // Render phần gợi ý tối ưu lấy hàng
  const renderPickingOptimizations = () => {
    // Tạo các gợi ý tối ưu
    const optimizations = generatePickingOptimizations();

    return (
      <div className="mb-4">
        <h3 className="font-medium text-lg mb-3">Gợi ý tối ưu lấy hàng</h3>

        { optimizations.length > 0 ? (
          <div className="bg-blue-900 bg-opacity-10 border-l-4 border-blue-600 p-4 rounded-r-lg">
            { optimizations.map((optimization, index) => (
              <div key={ index } className="mb-2 last:mb-0">
                <p className="text-sm">{ optimization.message }</p>

                { optimization.orders && optimization.orders.length > 0 && (
                  <div className="mt-2 flex justify-end">
                    <button
                      className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                      onClick={ () => {
                        // Tạo batch mới cho gợi ý này
                        const newBatch = {
                          id: `batch-opt-${new Date().getTime()}`,
                          name: `Batch: ${optimization.type === "product"
                            ? "Sản phẩm"
                            : "Vị trí"
                            } ${optimization.location}`,
                          orders: optimization.orders,
                          locations: [optimization.location],
                          status: "pending",
                          createdAt: new Date().toISOString(),
                          principle:
                            optimization.type === "product"
                              ? PARETO_PRINCIPLES.SAME_PRODUCTS.id
                              : PARETO_PRINCIPLES.NEARBY_LOCATIONS.id,
                          principleLabel:
                            optimization.type === "product"
                              ? PARETO_PRINCIPLES.SAME_PRODUCTS.name
                              : PARETO_PRINCIPLES.NEARBY_LOCATIONS.name,
                        };

                        setPickingBatches([newBatch, ...pickingBatches]);

                        // Thông báo
                        setAlerts([
                          {
                            id: Math.random().toString(36).substr(2, 9),
                            type: "success",
                            title: "Tạo batch mới",
                            message: `Đã tạo batch mới cho ${optimization.orders.length} đơn theo gợi ý`,
                            time: new Date().toLocaleTimeString("vi-VN"),
                          },
                          ...alerts,
                        ]);

                        // Thêm vào lịch sử hoạt động
                        const newLog = {
                          id: activityHistory.length + 1,
                          type: "picking",
                          action: `Tạo batch từ gợi ý tối ưu: ${optimization.message}`,
                          user: currentUser?.name || "System",
                          time: new Date().toLocaleTimeString("vi-VN"),
                        };
                        setActivityHistory([newLog, ...activityHistory]);

                        // Cuộn đến phần batch picking
                        document
                          .getElementById("batch-picking-section")
                          ?.scrollIntoView({
                            behavior: "smooth",
                          });
                      } }
                    >
                      Tạo batch
                    </button>
                  </div>
                ) }
              </div>
            )) }
          </div>
        ) : (
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-gray-400">Không có gợi ý tối ưu nào</p>
          </div>
        ) }
      </div>
    );
  };

  // Function render batch picking với hiệu ứng trực quan
  const renderBatchPicking = () => {
    return (
      <div id="batch-picking-section" className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">
            Đơn hàng theo lộ trình picking
          </h3>
          <div className="flex space-x-2">
            <button
              className={ `px-3 py-1.5 rounded text-sm flex items-center ${batchInProgress
                ? "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
                : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                }` }
              onClick={ () => !batchInProgress && createOptimizedBatches() }
              disabled={ batchInProgress }
            >
              <RefreshCw size={ 16 } className="mr-1" />
              { pickingBatches.length === 0
                ? "Tạo batch mới"
                : "Tối ưu lại batch" }
            </button>
          </div>
        </div>

        <div className="space-y-4">
          { pickingBatches.length > 0 ? (
            pickingBatches.map((batch, index) => (
              <div
                key={ batch.id }
                className={ `p-4 rounded-lg border ${batch.status === "processing"
                  ? "border-l-4 border-blue-600 bg-blue-900 bg-opacity-5"
                  : batch.status === "completed"
                    ? "border-l-4 border-green-600 bg-green-900 bg-opacity-5"
                    : index === 0 &&
                      batch.principle === PARETO_PRINCIPLES.P1_FIRST.id
                      ? "border-l-4 border-red-600 bg-red-900 bg-opacity-5"
                      : "border-gray-700"
                  } transition-all duration-300 ${batch.status === "processing" ? "shadow-lg" : ""
                  }` }
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{ batch.name }</span>
                      <span
                        className={ `ml-2 px-2 py-0.5 text-xs rounded-full ${batch.status === "pending"
                          ? "bg-gray-700 text-gray-300"
                          : batch.status === "processing"
                            ? "bg-blue-900 bg-opacity-30 text-blue-400"
                            : "bg-green-900 bg-opacity-30 text-green-400"
                          }` }
                      >
                        { batch.status === "pending"
                          ? "Chờ xử lý"
                          : batch.status === "processing"
                            ? "Đang xử lý"
                            : "Hoàn thành" }
                      </span>
                    </div>
                    <div className="flex space-x-1 mt-1">
                      <span className="px-1.5 py-0.5 text-xs rounded bg-blue-900 text-blue-400">
                        { batch.orders.length } đơn
                      </span>
                      <span className="px-1.5 py-0.5 text-xs rounded bg-green-900 text-green-400">
                        { batch.orders.reduce(
                          (acc, order) => acc + (order.items?.length || 0),
                          0
                        ) }{ " " }
                        SKU
                      </span>
                      { batch.principle && (
                        <span className="px-1.5 py-0.5 text-xs rounded bg-purple-900 text-purple-400">
                          { batch.principleLabel }
                        </span>
                      ) }
                    </div>
                  </div>

                  { renderBatchActionButton(batch) }
                </div>

                <div className="mt-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="opacity-75">Đơn:</span>{ " " }
                      { batch.orders
                        .slice(0, 2)
                        .map((o) => o.id)
                        .join(", ") }
                      { batch.orders.length > 2 &&
                        `, +${batch.orders.length - 2} đơn khác` }
                    </div>
                    <div>
                      <span className="opacity-75">Vị trí:</span>{ " " }
                      { batch.locations.join(", ") }
                    </div>
                  </div>
                </div>

                { batch.status === "processing" && (
                  <div className="mt-3 bg-blue-900 bg-opacity-20 p-2 rounded">
                    <div className="flex justify-between items-center text-xs">
                      <span>
                        Tiến độ: { Math.floor(Math.random() * 50) + 50 }%
                      </span>
                      <span className="text-blue-400">
                        { new Date(
                          new Date(batch.startTime).getTime() +
                          Math.floor(Math.random() * 10) * 60000
                        ).toLocaleTimeString() }{ " " }
                        - Dự kiến hoàn thành trong{ " " }
                        { Math.floor(Math.random() * 10) + 5 } phút
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={ {
                          width: `${Math.floor(Math.random() * 50) + 50}%`,
                        } }
                      ></div>
                    </div>
                  </div>
                ) }
              </div>
            ))
          ) : (
            <div className="text-center py-6 border border-dashed border-gray-700 rounded-lg">
              <div className="mb-2">
                <Package className="w-10 h-10 text-gray-500 mx-auto" />
              </div>
              <p className="text-gray-400 mb-3">Chưa có batch lấy hàng nào</p>
              <button
                className="px-3 py-1.5 rounded text-sm flex items-center mx-auto bg-blue-600 hover:bg-blue-700 text-white"
                onClick={ createOptimizedBatches }
              >
                <RefreshCw size={ 16 } className="mr-1" />
                Tạo batch tự động
              </button>
            </div>
          ) }
        </div>

        <div className="mt-2">
          <h4 className="text-sm font-medium mb-2">
            Nguyên tắc lấy hàng theo 80/20
          </h4>
          <div className="bg-gray-900 p-3 rounded-lg">
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>{ PARETO_PRINCIPLES.P1_FIRST.name }</li>
              <li>{ PARETO_PRINCIPLES.SINGLE_PRODUCT.name }</li>
              <li>{ PARETO_PRINCIPLES.SAME_PRODUCTS.name }</li>
              <li>{ PARETO_PRINCIPLES.NEARBY_LOCATIONS.name }</li>
              <li>{ PARETO_PRINCIPLES.MULTI_PRODUCTS.name }</li>
            </ol>
          </div>
        </div>
      </div>
    );
  };

  // Tạo batch tối ưu dựa trên nguyên tắc Pareto (80/20)
  const createOptimizedBatches = () => {
    // Reset batch hiện tại nếu đang có
    setPickingBatches([]);
    setActiveBatch(null);
    setBatchInProgress(false);
    setHighlightedLocations([]);

    // Lọc các đơn hàng chưa xử lý
    const pendingOrders = orders.filter((o) => o.status === "pending");

    if (pendingOrders.length === 0) {
      setAlerts([
        {
          id: Math.random().toString(36).substr(2, 9),
          type: "warning",
          title: "Không có đơn hàng",
          message: "Không có đơn hàng nào cần xử lý",
          time: new Date().toLocaleTimeString("vi-VN"),
        },
        ...alerts,
      ]);
      return;
    }

    const newBatches = [];
    const processedOrderIds = new Set();

    // 1. Ưu tiên P1 trước
    const p1Orders = pendingOrders.filter((o) => o.priority === "P1");
    if (p1Orders.length > 0) {
      // Tìm các vị trí của đơn P1
      const p1Locations = new Set();
      p1Orders.forEach((order) => {
        order.items?.forEach((item) => {
          p1Locations.add(item.location);
        });
      });

      newBatches.push({
        id: `batch-p1-${new Date().getTime()}`,
        name: `Batch: Đơn P1 ưu tiên (${p1Orders.length} đơn)`,
        orders: p1Orders,
        locations: [...p1Locations],
        status: "pending",
        createdAt: new Date().toISOString(),
        principle: PARETO_PRINCIPLES.P1_FIRST.id,
        principleLabel: PARETO_PRINCIPLES.P1_FIRST.name,
      });

      p1Orders.forEach((order) => processedOrderIds.add(order.id));
    }

    // 2. Xử lý đơn 1 sản phẩm (nhanh)
    const singleProductOrders = pendingOrders.filter(
      (order) => order.items?.length === 1 && !processedOrderIds.has(order.id)
    );

    if (singleProductOrders.length > 0) {
      // Tìm các vị trí của đơn 1 sản phẩm
      const singleProductLocations = new Set();
      singleProductOrders.forEach((order) => {
        order.items?.forEach((item) => {
          singleProductLocations.add(item.location);
        });
      });

      newBatches.push({
        id: `batch-single-${new Date().getTime()}`,
        name: `Batch: Đơn 1 sản phẩm (${singleProductOrders.length} đơn)`,
        orders: singleProductOrders,
        locations: [...singleProductLocations],
        status: "pending",
        createdAt: new Date().toISOString(),
        principle: PARETO_PRINCIPLES.SINGLE_PRODUCT.id,
        principleLabel: PARETO_PRINCIPLES.SINGLE_PRODUCT.name,
      });

      singleProductOrders.forEach((order) => processedOrderIds.add(order.id));
    }

    // 3. Gom nhóm đơn hàng theo vị trí
    const locationMap = new Map();
    pendingOrders.forEach((order) => {
      if (processedOrderIds.has(order.id)) return;

      order.items?.forEach((item) => {
        if (!locationMap.has(item.location)) {
          locationMap.set(item.location, []);
        }

        if (!locationMap.get(item.location).includes(order)) {
          locationMap.get(item.location).push(order);
        }
      });
    });

    // Tìm các vị trí có từ 2 đơn trở lên
    for (const [location, locationOrders] of locationMap.entries()) {
      if (locationOrders.length >= 2) {
        // Lọc các đơn chưa được xử lý
        const unprocessedOrders = locationOrders.filter(
          (order) => !processedOrderIds.has(order.id)
        );

        if (unprocessedOrders.length >= 2) {
          newBatches.push({
            id: `batch-loc-${location}-${new Date().getTime()}`,
            name: `Batch: Vị trí ${location} (${unprocessedOrders.length} đơn)`,
            orders: unprocessedOrders,
            locations: [location],
            status: "pending",
            createdAt: new Date().toISOString(),
            principle: PARETO_PRINCIPLES.NEARBY_LOCATIONS.id,
            principleLabel: PARETO_PRINCIPLES.NEARBY_LOCATIONS.name,
          });

          unprocessedOrders.forEach((order) => processedOrderIds.add(order.id));
        }
      }
    }

    // 4. Gom nhóm đơn còn lại theo SKU
    const skuMap = new Map();
    pendingOrders.forEach((order) => {
      if (processedOrderIds.has(order.id)) return;

      order.items?.forEach((item) => {
        if (!skuMap.has(item.sku)) {
          skuMap.set(item.sku, []);
        }

        if (!skuMap.get(item.sku).includes(order)) {
          skuMap.get(item.sku).push(order);
        }
      });
    });

    // Tìm các SKU có từ 2 đơn trở lên
    for (const [sku, skuOrders] of skuMap.entries()) {
      if (skuOrders.length >= 2) {
        // Lọc các đơn chưa được xử lý
        const unprocessedOrders = skuOrders.filter(
          (order) => !processedOrderIds.has(order.id)
        );

        if (unprocessedOrders.length >= 2) {
          // Tìm tên sản phẩm từ SKU
          const product = unprocessedOrders[0].items.find(
            (item) => item.sku === sku
          );
          const productName = product ? product.name : sku;

          // Tìm các vị trí của đơn hàng
          const skuLocations = new Set();
          unprocessedOrders.forEach((order) => {
            order.items?.forEach((item) => {
              if (item.sku === sku) {
                skuLocations.add(item.location);
              }
            });
          });

          newBatches.push({
            id: `batch-sku-${sku}-${new Date().getTime()}`,
            name: `Batch: ${productName} (${unprocessedOrders.length} đơn)`,
            orders: unprocessedOrders,
            locations: [...skuLocations],
            status: "pending",
            createdAt: new Date().toISOString(),
            principle: PARETO_PRINCIPLES.SAME_PRODUCTS.id,
            principleLabel: PARETO_PRINCIPLES.SAME_PRODUCTS.name,
          });

          unprocessedOrders.forEach((order) => processedOrderIds.add(order.id));
        }
      }
    }

    // 5. Xử lý đơn còn lại (đa sản phẩm)
    const remainingOrders = pendingOrders.filter(
      (order) => !processedOrderIds.has(order.id)
    );

    if (remainingOrders.length > 0) {
      // Tìm các vị trí của đơn còn lại
      const remainingLocations = new Set();
      remainingOrders.forEach((order) => {
        order.items?.forEach((item) => {
          remainingLocations.add(item.location);
        });
      });

      newBatches.push({
        id: `batch-multi-${new Date().getTime()}`,
        name: `Batch: Đơn đa sản phẩm (${remainingOrders.length} đơn)`,
        orders: remainingOrders,
        locations: [...remainingLocations],
        status: "pending",
        createdAt: new Date().toISOString(),
        principle: PARETO_PRINCIPLES.MULTI_PRODUCTS.id,
        principleLabel: PARETO_PRINCIPLES.MULTI_PRODUCTS.name,
      });
    }

    setPickingBatches(newBatches);

    // Log hoạt động
    const newLog = {
      id: activityHistory.length + 1,
      type: "picking",
      action: `Tạo ${newBatches.length} batch tối ưu cho ${pendingOrders.length} đơn`,
      user: currentUser?.name || "System",
      time: new Date().toLocaleTimeString("vi-VN"),
    };
    setActivityHistory([newLog, ...activityHistory]);

    // Thông báo
    setAlerts([
      {
        id: Math.random().toString(36).substr(2, 9),
        type: "success",
        title: "Tạo batch tối ưu",
        message: `Đã tạo ${newBatches.length} batch tối ưu theo nguyên tắc 80/20`,
        time: new Date().toLocaleTimeString("vi-VN"),
      },
      ...alerts,
    ]);
  };

  // Layout chính
  return isLoggedIn ? (
    <div className={ `min-h-screen ${themeClass}` }>
      {/* Header */ }
      <header
        className={ `fixed top-0 left-0 right-0 z-40 border-b ${headerClass}` }
      >
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <button
              className="lg:hidden mr-2 text-gray-400 hover:text-gray-300"
              onClick={ toggleSidebar }
            >
              <Menu className="w-6 h-6" />
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
                className={ `pl-8 pr-4 py-1 rounded-lg text-sm w-48 lg:w-64 ${inputClass}` }
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
              onClick={ toggleDarkMode }
            >
              { darkMode ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              ) }
            </button>

            <div
              className="flex items-center cursor-pointer"
              onClick={ handleLogout }
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-2">
                { currentUser?.name?.charAt(0) }
              </div>
              <span className="hidden lg:block mr-2">{ currentUser?.name }</span>
              <LogOut className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tab navigation */ }
        { userRole === "staff" ? <StaffNavigation /> : <AdminNavigation /> }
      </header>

      {/* Sidebar */ }
      <aside
        className={ `fixed top-0 left-0 z-30 h-full w-64 transform transition-transform duration-200 ease-in-out ${showSidebar ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 pt-28 pb-4 border-r ${sidebarClass}` }
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
                  className={ `w-full p-2 rounded text-sm ${inputClass}` }
                  value={ filters.channel }
                  onChange={ (e) =>
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
                  className={ `w-full p-2 rounded text-sm ${inputClass}` }
                  value={ filters.transporter }
                  onChange={ (e) =>
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
                  className={ `w-full p-2 rounded text-sm ${inputClass}` }
                  value={ filters.priority }
                  onChange={ (e) =>
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
                  className={ `w-full p-2 rounded text-sm ${inputClass}` }
                  value={ filters.productType }
                  onChange={ (e) =>
                    handleFilterChange("productType", e.target.value)
                  }
                >
                  <option value="all">Tất cả</option>
                  <option value="vali-only">Chỉ vali</option>
                  <option value="vali-mix">Mix vali</option>
                  <option value="no-vali">Không vali</option>
                </select>
              </div>
              <div>
                <label className="text-sm block mb-1">Loại SKU</label>
                <select
                  className={ `w-full p-2 rounded text-sm ${inputClass}` }
                  value={ filters.skuType }
                  onChange={ (e) =>
                    handleFilterChange("skuType", e.target.value)
                  }
                >
                  <option value="all">Tất cả</option>
                  <option value="single-sku">1 SKU/đơn</option>
                  <option value="single-sku-multi">1 SKU nhiều</option>
                  <option value="multi-sku">Nhiều SKU/đơn</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xs uppercase font-semibold opacity-50 mb-2">
              Thống kê nhanh
            </h3>
            <div className="space-y-2">
              <div className={ `p-3 rounded-lg ${cardClass}` }>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Đơn đang chờ</span>
                  <span className="text-lg font-semibold">
                    { stats.pendingOrders }
                  </span>
                </div>
              </div>
              <div className={ `p-3 rounded-lg ${cardClass}` }>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Đơn đang xử lý</span>
                  <span className="text-lg font-semibold">
                    { stats.processingOrders }
                  </span>
                </div>
              </div>
              <div className={ `p-3 rounded-lg ${cardClass}` }>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Đơn hoàn thành</span>
                  <span className="text-lg font-semibold">
                    { stats.completedOrders }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-xs uppercase font-semibold opacity-50 mb-2">
              Hệ thống
            </h3>
            <div className="space-y-2">
              { userRole === "admin" && (
                <button
                  className={ `w-full text-sm p-2 rounded text-left flex items-center ${buttonSecondaryClass}` }
                >
                  <Cpu className="w-4 h-4 mr-2" /> Cấu hình hệ thống
                </button>
              ) }
              <button
                className={ `w-full text-sm p-2 rounded text-left flex items-center ${buttonSecondaryClass}` }
              >
                <Settings className="w-4 h-4 mr-2" /> Cài đặt
              </button>
              <button
                className={ `w-full text-sm p-2 rounded text-left flex items-center ${buttonSecondaryClass}` }
                onClick={ handleLogout }
              >
                <LogOut className="w-4 h-4 mr-2" /> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */ }
      <main
        className={ `pt-32 pb-8 ${showSidebar ? "lg:ml-64" : ""
          } px-4 md:px-6 transition-all duration-200` }
      >
        {/* Date & filters bar */ }
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              { userRole === "staff"
                ? "Quản lý đơn hàng cá nhân"
                : "Quản lý kho vận theo SLA" }
            </h1>
            <p className="text-sm opacity-70">
              Ngày 04/05/2025 - Áp dụng nguyên tắc 80/20
            </p>
          </div>

          <div className="flex space-x-2 mt-2 md:mt-0">
            <div>
              <select
                className={ `p-2 rounded text-sm ${inputClass}` }
                value={ filters.date }
                onChange={ (e) => handleFilterChange("date", e.target.value) }
              >
                <option value="today">Hôm nay</option>
                <option value="yesterday">Hôm qua</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
              </select>
            </div>
            <button
              className={ `p-2 rounded flex items-center ${buttonSecondaryClass}` }
            >
              <Filter className="w-4 h-4 mr-1" /> Lọc nâng cao
            </button>
            <button className={ `p-2 rounded ${buttonPrimaryClass}` }>
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab content */ }
        { activeTab === "overview" && renderOverviewTab() }
        { activeTab === "orders" && renderOrdersTab() }
        { activeTab === "staff" && renderStaffTab() }
        { activeTab === "picking" && renderPickingTab() }
        { activeTab === "WarehouseMap" && renderWarehouseMapTab() }
        { activeTab === "alerts" && renderAlertsTab() }
        { activeTab === "reports" && renderReportsTab() }
        { activeTab === "history" && renderHistoryTab() }
        { activeTab === "myOrders" && renderMyOrdersTab() }
        { activeTab === "profile" && renderProfileTab() }
        { activeTab === "performance" && renderPerformanceTab() }
      </main>

      {/* Footer */ }
      <footer
        className={ `fixed bottom-0 left-0 right-0 ${headerClass} border-t py-2 px-4 text-xs opacity-70 text-center` }
      >
        Dashboard SLA & Phân Bổ Đơn Hàng | Phiên bản 1.0 | 04/05/2025 |{ " " }
        { currentUser?.role } - { currentUser?.name }
      </footer>

      {/* Modal chi tiết vị trí */ }
      { renderLocationDetailsModal() }
    </div>
  ) : (
    <LoginComponent />
  );
};

export default WarehouseDashboard;
