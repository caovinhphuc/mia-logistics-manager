import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Clock,
  AlertTriangle,
  Check,
  X,
  Printer,
  FileText,
  ArrowRight,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Zap,
  Settings,
  User,
  Edit,
  Calendar,
  Download,
  Upload,
  MapPin,
  Users,
  History,
  Save,
  Activity,
  BarChart2,
  TrendingUp,
  BarcodeScan,
  Clipboard,
  AlertCircle
} from "lucide-react";

// Khởi tạo mẫu dữ liệu - trong thực tế sẽ được tải từ API
const initialMetrics = {
  totalOrders: 152,
  pendingOrders: 45,
  processingOrders: 35,
  completedOrders: 72,
  p1Orders: 12,
  p2Orders: 25,
  avgPickingTime: 4.3,
  slaCompliance: 92,
  staffUtilization: 78,
  autoAllocationSuccess: 86,
};

const OrderSLAManagementSystem = () => {
  // State quản lý đơn hàng
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [metrics, setMetrics] = useState(initialMetrics);

  // State cho nhân viên
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Trưởng ca",
      area: "A",
      skills: ["vali", "balo", "đóng gói"],
      status: "busy",
      currentOrder: "SO09032025:0845541",
      assignedOrders: ["SO09032025:0845541", "SO09032025:0845543"],
      orderCount: 8,
      efficiency: 98,
      maxCapacity: 10,
      currentLoad: 2,
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Nhân viên",
      area: "A",
      skills: ["vali", "phụ kiện"],
      status: "busy",
      currentOrder: "SO09032025:0845547",
      assignedOrders: ["SO09032025:0845547"],
      orderCount: 12,
      efficiency: 95,
      maxCapacity: 8,
      currentLoad: 1,
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Nhân viên",
      area: "B",
      skills: ["balo", "phụ kiện", "đóng gói"],
      status: "available",
      currentOrder: null,
      assignedOrders: [],
      orderCount: 15,
      efficiency: 92,
      maxCapacity: 8,
      currentLoad: 0,
    },
    {
      id: 4,
      name: "Phạm Thị D",
      role: "Nhân viên",
      area: "C",
      skills: ["QC", "đóng gói"],
      status: "available",
      currentOrder: null,
      assignedOrders: [],
      orderCount: 10,
      efficiency: 97,
      maxCapacity: 9,
      currentLoad: 0,
    },
  ]);

  // State giao diện
  const [isLoading, setIsLoading] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orderSort, setOrderSort] = useState({
    field: "priority",
    direction: "asc",
  });
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState("order"); // 'order' or 'picking'
  const [showStaffPanel, setShowStaffPanel] = useState(false);
  const [showAllocationPanel, setShowAllocationPanel] = useState(false);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const [staffFilter, setStaffFilter] = useState("all");
  const [currentStaffView, setCurrentStaffView] = useState(null);

  // State lịch sử hoạt động
  const [activityHistory, setActivityHistory] = useState([]);
  const [showActivityHistory, setShowActivityHistory] = useState(false);

  // State cấu hình
  const [slaConfig, setSlaConfig] = useState({
    p1Hours: 2,
    p2Hours: 4,
    p3Hours: 8,
    defaultSLA: 24,
  });

  const [allocationConfig, setAllocationConfig] = useState({
    autoAssignInterval: 5,
    p1MaxPerStaff: 3,
    balanceWorkload: true,
    prioritizeLocation: true,
    reassignOnCompletion: true,
  });

  // State cho chức năng quét mã sản phẩm
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannedProducts, setScannedProducts] = useState([]);
  const [scanningOrder, setScanningOrder] = useState(null);
  const [scanComplete, setScanComplete] = useState(false);

  // State cho chức năng upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);
  const scanInputRef = useRef(null);
  const lastUpdatedRef = useRef(new Date());

  // Giả lập tải đơn hàng từ file
  const loadSampleOrders = () => {
    setIsLoading(true);

    // Xử lý timeout để tạo hiệu ứng tải
    setTimeout(() => {
      // Tạo dữ liệu mẫu dựa trên file JSON đã upload
      const sampleOrders = [
        {
          id: "434819",
          name: "SO09032025:0845541",
          transporter: "S - SPX Express",
          customer: "Shopee",
          phone: "18002000",
          amount_total: "699000",
          cod_total: "0",
          shipment_id: "2503094EA6YXJT",
          shipment_code: "SPXVN057423890073",
          ecom_order_weight: "12635",
          ecom_recipient_code: "HN-20-14-PD01",
          ecom_cod_amount: "0",
          date_order: "2025-03-09 00:08:52",
          address:
            "******hẻm 193/64/87 phú diễn, Phường Phú Diễn, Quận Bắc Từ Liêm, Hà Nội",
          district: "Quận Bắc Từ Liêm",
          city: "Hà Nội",
          ward: "Phú Diễn",
          note: ".2503094EA6YXJT",
          detail:
            "Valinice Yari ID2041_20 S Orange(1), Mia Luggage Tag S Orange(1), Cerave Kem dưỡng ẩm 7ml S Blue/White(1)",
          status: "pending",
          sla: {
            code: "P1",
            label: "P1 - Gấp 🚀",
            color: "bg-red-100 text-red-800",
            description: "Cần xử lý ngay lập tức",
          },
          timeLeft: "01:15:22",
          priority: 95,
          productType: "vali",
          complexity: "nhiều sản phẩm",
          location: "HN-20-14-PD01",
          assignedTo: 1,
          viewTimestamp: null,
          printTimestamp: null,
        },
        {
          id: "434821",
          name: "SO09032025:0845543",
          transporter: "S - Giao hàng nhanh",
          customer: "Shopee",
          phone: "18002000",
          amount_total: "169000",
          cod_total: "0",
          shipment_id: "2503094EYPMYK9",
          shipment_code: "G8E6X7C3",
          ecom_order_weight: "250",
          ecom_recipient_code: "290-A-05-A3",
          ecom_cod_amount: "0",
          date_order: "2025-03-09 00:19:10",
          address:
            "****** p2, 1 Châu Văn Liêm, Phường Phú Đô, Quận Nam Từ Liêm, Hà Nội",
          district: "Quận Nam Từ Liêm",
          city: "Hà Nội",
          ward: "Phú Đô",
          note: ".2503094EYPMYK9",
          detail:
            "The Travel Star Clearguard Cover_20 S Black(1), Cerave Kem dưỡng ẩm 7ml S Blue/White(1)",
          status: "pending",
          sla: {
            code: "P1",
            label: "P1 - Gấp 🚀",
            color: "bg-red-100 text-red-800",
            description: "Cần xử lý ngay lập tức",
          },
          timeLeft: "01:25:05",
          priority: 92,
          productType: "phụ kiện",
          complexity: "nhiều sản phẩm",
          location: "290-A-05-A3",
          assignedTo: 1,
          viewTimestamp: null,
          printTimestamp: null,
        },
        {
          id: "434823",
          name: "SO09032025:0845547",
          transporter: "S - J&T Express",
          customer: "Shopee",
          phone: "18002000",
          amount_total: "1299000",
          cod_total: "0",
          shipment_id: "2503094E45POF2",
          shipment_code: "JT1234560025",
          ecom_order_weight: "8500",
          ecom_recipient_code: "HN-30-22-BA04",
          ecom_cod_amount: "0",
          date_order: "2025-03-09 00:25:30",
          address: "****** Chung cư CT2, KĐT Văn Khê, Hà Đông, Hà Nội",
          district: "Hà Đông",
          city: "Hà Nội",
          ward: "Văn Khê",
          note: ".2503094E45POF2",
          detail: "Balore Rio BR0224_23 M Blue(1)",
          status: "processing",
          sla: {
            code: "P1",
            label: "P1 - Gấp 🚀",
            color: "bg-red-100 text-red-800",
            description: "Cần xử lý ngay lập tức",
          },
          timeLeft: "00:55:12",
          priority: 98,
          productType: "vali",
          complexity: "đơn giản",
          location: "HN-30-22-BA04",
          assignedTo: 2,
          viewTimestamp: new Date(Date.now() - 600000).toISOString(), // 10 phút trước
          printTimestamp: null,
        },
        {
          id: "434825",
          name: "SO09032025:0855401",
          transporter: "S - Shopee Express",
          customer: "Shopee",
          amount_total: "249000",
          shipment_id: "2503094EYPD453",
          shipment_code: "SPXEX8764536",
          ecom_recipient_code: "290-B-12-C5",
          date_order: "2025-03-09 01:14:22",
          address: "****** 43 Nguyễn Chí Thanh, Đống Đa, Hà Nội",
          detail: "Túi đeo chéo Foldaway(1), Ví mini Compact(1)",
          status: "pending",
          sla: {
            code: "P2",
            label: "P2 - Cảnh báo ⚠️",
            color: "bg-yellow-100 text-yellow-800",
            description: "Không thể trì hoãn quá lâu",
          },
          timeLeft: "02:45:33",
          priority: 85,
          productType: "phụ kiện",
          complexity: "nhiều sản phẩm",
          location: "290-B-12-C5",
        },
        {
          id: "434827",
          name: "SO09032025:0855490",
          transporter: "S - Ninja Van",
          customer: "TikTok",
          amount_total: "1099000",
          shipment_id: "2503094E5PP782",
          shipment_code: "NJVAN763523",
          ecom_recipient_code: "300-C-08-D2",
          date_order: "2025-03-09 01:30:15",
          address: "****** 25 Trường Chinh, Thanh Xuân, Hà Nội",
          detail: "Set va li Traveler 24' (1), Tag hành lý Mini (2)",
          status: "pending",
          sla: {
            code: "P2",
            label: "P2 - Cảnh báo ⚠️",
            color: "bg-yellow-100 text-yellow-800",
            description: "Không thể trì hoãn quá lâu",
          },
          timeLeft: "03:10:45",
          priority: 80,
          productType: "vali",
          complexity: "đơn giản",
          location: "300-C-08-D2",
        },
        {
          id: "434829",
          name: "SO09032025:0855499",
          transporter: "S - Giao hàng nhanh",
          customer: "Lazada",
          amount_total: "329000",
          shipment_id: "2503094EYPJH12",
          shipment_code: "GHN9977651",
          ecom_recipient_code: "290-D-15-A8",
          date_order: "2025-03-09 02:05:33",
          address: "****** 112 Láng Hạ, Đống Đa, Hà Nội",
          detail: "Balo Lightweight Compact(1)",
          status: "pending",
          sla: {
            code: "P3",
            label: "P3 - Bình thường ✅",
            color: "bg-green-100 text-green-800",
            description: "Xử lý theo lộ trình hợp lý",
          },
          timeLeft: "05:40:15",
          priority: 65,
          productType: "balo",
          complexity: "đơn giản",
          location: "290-D-15-A8",
        },
        {
          id: "434831",
          name: "SO09032025:0855512",
          transporter: "S - J&T Express",
          customer: "TikTok",
          amount_total: "459000",
          shipment_id: "2503094EFC1209",
          shipment_code: "JT9987652",
          ecom_recipient_code: "300-A-03-B6",
          date_order: "2025-03-09 02:15:40",
          address: "****** 78 Trần Duy Hưng, Cầu Giấy, Hà Nội",
          detail: "Túi du lịch Weekender(1), Bình giữ nhiệt Travel Mug(1)",
          status: "completed",
          sla: {
            code: "P3",
            label: "P3 - Bình thường ✅",
            color: "bg-green-100 text-green-800",
            description: "Xử lý theo lộ trình hợp lý",
          },
          timeLeft: "06:05:22",
          priority: 60,
          productType: "phụ kiện",
          complexity: "nhiều sản phẩm",
          location: "300-A-03-B6",
        },
        {
          id: "434833",
          name: "SO09032025:0855525",
          transporter: "S - Viettel Post",
          customer: "Shopee",
          amount_total: "1899000",
          shipment_id: "2503094EPM5643",
          shipment_code: "VTP7651234",
          ecom_recipient_code: "HN-15-05-CD02",
          date_order: "2025-03-09 02:45:10",
          address: "****** 224 Minh Khai, Hai Bà Trưng, Hà Nội",
          detail: "Vali Explorer Pro 28'(1), Bộ khóa TSA(1), Áo trùm vali(1)",
          status: "pending",
          sla: {
            code: "P3",
            label: "P3 - Bình thường ✅",
            color: "bg-green-100 text-green-800",
            description: "Xử lý theo lộ trình hợp lý",
          },
          timeLeft: "06:25:55",
          priority: 55,
          productType: "vali",
          complexity: "nhiều sản phẩm",
          location: "HN-15-05-CD02",
        },
        {
          id: "434835",
          name: "SO09032025:0855533",
          transporter: "S - Shopee Express",
          customer: "Shopee",
          amount_total: "259000",
          shipment_id: "2503094EKLD098",
          shipment_code: "SPXEX8764123",
          ecom_recipient_code: "290-B-08-A3",
          date_order: "2025-03-09 03:15:05",
          address: "****** 56 Lê Văn Lương, Thanh Xuân, Hà Nội",
          detail: "Ví hộ chiếu Premium(1)",
          status: "pending",
          sla: {
            code: "P4",
            label: "P4 - Chờ xử lý 🕒",
            color: "bg-blue-100 text-blue-800",
            description: "Có thể lùi lại khi thuận tiện",
          },
          timeLeft: "23:45:10",
          priority: 45,
          productType: "phụ kiện",
          complexity: "đơn giản",
          location: "290-B-08-A3",
        },
        {
          id: "434837",
          name: "SO09032025:0855544",
          transporter: "S - Giao hàng tiết kiệm",
          customer: "TikTok",
          amount_total: "2299000",
          shipment_id: "2503094EPO9081",
          shipment_code: "GHTK6453231",
          ecom_recipient_code: "HN-25-18-AE07",
          date_order: "2025-03-09 03:30:45",
          address: "****** 145 Nguyễn Tuân, Thanh Xuân, Hà Nội",
          detail: "Set vali gia đình (3 size)(1)",
          status: "pending",
          sla: {
            code: "P4",
            label: "P4 - Chờ xử lý 🕒",
            color: "bg-blue-100 text-blue-800",
            description: "Có thể lùi lại khi thuận tiện",
          },
          timeLeft: "23:55:33",
          priority: 40,
          productType: "vali",
          complexity: "phức tạp",
          location: "HN-25-18-AE07",
        },
      ];

      setOrders(sampleOrders);

      // Thêm vào lịch sử hoạt động
      addToActivityHistory({
        type: "upload",
        timestamp: new Date().toISOString(),
        details: `Tải lên ${sampleOrders.length} đơn hàng`,
      });

      setIsLoading(false);
    }, 800);
  };

  // Xử lý upload file
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  // Xử lý upload đơn hàng
  const handleUploadOrders = () => {
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Giả lập tiến trình upload
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Giả lập đọc file
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Đọc file JSON
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);

          // Xử lý dữ liệu và tải vào hệ thống
          if (jsonData && jsonData.data && Array.isArray(jsonData.data)) {
            // Chuyển đổi dữ liệu từ JSON vào định dạng của hệ thống
            const processedOrders = jsonData.data.map(order => {
              // Xác định SLA dựa trên thời gian đặt và quy tắc
              const orderDate = new Date(order.date_order);
              const now = new Date();
              const hoursDiff = (now - orderDate) / (1000 * 60 * 60);

              let slaCode, slaLabel, slaColor, timeLeft, priority;

              if (hoursDiff < 2) {
                slaCode = "P1";
                slaLabel = "P1 - Gấp 🚀";
                slaColor = "bg-red-100 text-red-800";
                timeLeft = `${Math.floor(2 - hoursDiff)}:${Math.floor((2 - hoursDiff) % 1 * 60)}:00`;
                priority = 95;
              } else if (hoursDiff < 4) {
                slaCode = "P2";
                slaLabel = "P2 - Cảnh báo ⚠️";
                slaColor = "bg-yellow-100 text-yellow-800";
                timeLeft = `${Math.floor(4 - hoursDiff)}:${Math.floor((4 - hoursDiff) % 1 * 60)}:00`;
                priority = 85;
              } else if (hoursDiff < 8) {
                slaCode = "P3";
                slaLabel = "P3 - Bình thường ✅";
                slaColor = "bg-green-100 text-green-800";
                timeLeft = `${Math.floor(8 - hoursDiff)}:${Math.floor((8 - hoursDiff) % 1 * 60)}:00`;
                priority = 65;
              } else {
                slaCode = "P4";
                slaLabel = "P4 - Chờ xử lý 🕒";
                slaColor = "bg-blue-100 text-blue-800";
                timeLeft = "24:00:00";
                priority = 45;
              }

              return {
                ...order,
                status: "pending",
                sla: {
                  code: slaCode,
                  label: slaLabel,
                  color: slaColor,
                  description: getDescriptionForSLA(slaCode)
                },
                timeLeft,
                priority,
                productType: determineProductType(order.detail || ""),
                complexity: determineComplexity(order.detail || ""),
                location: order.ecom_recipient_code || "Unknown",
                viewTimestamp: null,
                printTimestamp: null
              };
            });

            setOrders(processedOrders);

            // Cập nhật metrics
            updateMetricsFromOrders(processedOrders);

            // Ghi nhận hoạt động
            addToActivityHistory({
              type: "upload",
              timestamp: new Date().toISOString(),
              details: `Tải lên thành công ${processedOrders.length} đơn hàng từ file ${uploadFile.name}`,
            });

            // Đóng modal và reset state
            setTimeout(() => {
              setShowUploadModal(false);
              setIsUploading(false);
              setUploadFile(null);
              setUploadProgress(0);
            }, 1000);
          } else {
            throw new Error("Định dạng file không hợp lệ");
          }
        } catch (error) {
          // Thông báo lỗi
          addToActivityHistory({
            type: "error",
            timestamp: new Date().toISOString(),
            details: `Lỗi khi tải file: ${error.message}`,
          });

          setIsUploading(false);
        }
      };

      reader.readAsText(uploadFile);
    }, 2000);
  };

  // Hàm xác định mô tả cho mã SLA
  const getDescriptionForSLA = (slaCode) => {
    switch (slaCode) {
      case "P1": return "Cần xử lý ngay lập tức";
      case "P2": return "Không thể trì hoãn quá lâu";
      case "P3": return "Xử lý theo lộ trình hợp lý";
      case "P4": return "Có thể lùi lại khi thuận tiện";
      default: return "";
    }
  };

  // Hàm xác định loại sản phẩm từ chi tiết đơn hàng
  const determineProductType = (orderDetail) => {
    const lowerDetail = orderDetail.toLowerCase();
    if (lowerDetail.includes("vali") || lowerDetail.includes("va li")) return "vali";
    if (lowerDetail.includes("balo")) return "balo";
    if (lowerDetail.includes("túi") || lowerDetail.includes("bag")) return "túi";
    return "phụ kiện";
  };

  // Hàm xác định độ phức tạp của đơn hàng
  const determineComplexity = (orderDetail) => {
    const products = orderDetail.split(",");
    if (products.length > 2) return "phức tạp";
    if (products.length > 1) return "nhiều sản phẩm";
    return "đơn giản";
  };

  // Cập nhật metrics từ dữ liệu đơn hàng
  const updateMetricsFromOrders = (ordersData) => {
    const newMetrics = {
      totalOrders: ordersData.length,
      pendingOrders: ordersData.filter(o => o.status === "pending").length,
      processingOrders: ordersData.filter(o => o.status === "processing").length,
      completedOrders: ordersData.filter(o => o.status === "completed").length,
      p1Orders: ordersData.filter(o => o.sla.code === "P1").length,
      p2Orders: ordersData.filter(o => o.sla.code === "P2").length,
      avgPickingTime: 4.3, // Giá trị mặc định
      slaCompliance: 92, // Giá trị mặc định
      staffUtilization: 78, // Giá trị mặc định
      autoAllocationSuccess: 86, // Giá trị mặc định
    };

    setMetrics(newMetrics);
  };

  // Xử lý quét mã sản phẩm
  const handleScanBarcode = () => {
    if (!scanInputRef.current.value) return;

    const scannedCode = scanInputRef.current.value;
    scanInputRef.current.value = "";

    if (!scanningOrder) return;

    // Phân tích sản phẩm từ chi tiết đơn hàng
    const products = scanningOrder.detail.split(", ").map(product => {
      const match = product.match(/(.*)\((\d+)\)$/);
      if (match) {
        return {
          name: match[1].trim(),
          quantity: parseInt(match[2]),
          scanned: 0,
          complete: false
        };
      }
      return null;
    }).filter(p => p !== null);

    // Kiểm tra mã quét với sản phẩm
    let found = false;

    const updatedProducts = scannedProducts.map(product => {
      // Giả định mã vạch chứa tên sản phẩm
      if (scannedCode.includes(product.name) && product.scanned < product.quantity) {
        found = true;
        return {
          ...product,
          scanned: product.scanned + 1,
          complete: product.scanned + 1 >= product.quantity
        };
      }
      return product;
    });

    if (found) {
      setScannedProducts(updatedProducts);

      // Kiểm tra xem tất cả sản phẩm đã được quét đủ chưa
      const allComplete = updatedProducts.every(p => p.complete);
      if (allComplete) {
        setScanComplete(true);

        // Ghi nhận hoạt động
        addToActivityHistory({
          type: "scan_complete",
          orderId: scanningOrder.id,
          orderName: scanningOrder.name,
          timestamp: new Date().toISOString(),
          details: `Hoàn thành quét mã đơn hàng ${scanningOrder.name}`,
        });
      }
    } else {
      // Ghi nhận quét mã sai
      addToActivityHistory({
        type: "scan_error",
        orderId: scanningOrder.id,
        orderName: scanningOrder.name,
        timestamp: new Date().toISOString(),
        details: `Quét mã không hợp lệ cho đơn hàng ${scanningOrder.name}: ${scannedCode}`,
      });
    }
  };

  // Bắt đầu quét mã cho đơn hàng
  const startScanning = (order) => {
    setScanningOrder(order);

    // Phân tích sản phẩm từ chi tiết đơn hàng
    const products = order.detail.split(", ").map(product => {
      const match = product.match(/(.*)\((\d+)\)$/);
      if (match) {
        return {
          name: match[1].trim(),
          quantity: parseInt(match[2]),
          scanned: 0,
          complete: false
        };
      }
      return null;
    }).filter(p => p !== null);

    setScannedProducts(products);
    setScanComplete(false);
    setShowScannerModal(true);

    // Ghi nhận hoạt động
    addToActivityHistory({
      type: "scan_start",
      orderId: order.id,
      orderName: order.name,
      timestamp: new Date().toISOString(),
      details: `Bắt đầu quét mã đơn hàng ${order.name}`,
    });

    // Focus vào input quét mã
    setTimeout(() => {
      if (scanInputRef.current) {
        scanInputRef.current.focus();
      }
    }, 100);
  };

  // Hoàn thành quét mã và in đơn
  const completeScanningAndPrint = () => {
    if (!scanningOrder) return;

    // Cập nhật trạng thái đơn hàng
    const updatedOrders = orders.map(order => {
      if (order.id === scanningOrder.id) {
        return {
          ...order,
          status: "processing"
        };
      }
      return order;
    });

    setOrders(updatedOrders);

    // Đóng modal quét mã
    setShowScannerModal(false);

    // Mở URL in đơn
    const printUrl = `https://one.tga.com.vn/so/invoicePrint?id=${scanningOrder.id}`;
    window.open(printUrl, "_blank");

    // Ghi nhận hoạt động
    addToActivityHistory({
      type: "print_after_scan",
      orderId: scanningOrder.id,
      orderName: scanningOrder.name,
      timestamp: new Date().toISOString(),
      details: `In đơn hàng ${scanningOrder.name} sau khi quét mã hoàn tất`,
    });

    // Reset state
    setScanningOrder(null);
    setScannedProducts([]);
    setScanComplete(false);
  };

  // Xử lý tự động cập nhật
  useEffect(() => {
    if (autoRefresh && orders.length > 0) {
      const interval = setInterval(() => {
        updateRealTimeData();
      }, 30000); // Cập nhật mỗi 30 giây

      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, orders]);

  // Load dữ liệu khi component được tạo
  useEffect(() => {
    loadSampleOrders();

    // Thêm một số hoạt động mẫu vào lịch sử
    const sampleActivities = [
      {
        type: "system",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: "Khởi động hệ thống Quản lý Đơn SLA",
      },
      {
        type: "auto_assign",
        orderId: "434819",
        orderName: "SO09032025:0845541",
        staffId: 1,
        staffName: "Nguyễn Văn A",
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        details: "Tự động gán đơn SO09032025:0845541 cho Nguyễn Văn A",
      },
    ];

    setActivityHistory(sampleActivities);
  }, []);

  // Cập nhật dữ liệu theo thời gian thực
  const updateRealTimeData = () => {
    // Ghi log cập nhật dữ liệu
    addToActivityHistory({
      type: "system_update",
      timestamp: new Date().toISOString(),
      details: `Cập nhật dữ liệu thời gian thực theo SLA`,
    });

    // Cập nhật thời gian còn lại cho đơn hàng
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.status === "completed") return order;

        // Cập nhật thời gian còn lại
        let timeLeft = order.timeLeft;
        const [hours, minutes, seconds] = timeLeft.split(":").map(Number);
        let totalSeconds = hours * 3600 + minutes * 60 + seconds - 30;

        if (totalSeconds < 0) {
          totalSeconds = 0;

          // Đơn đã hết thời gian nhưng chưa xử lý -> nâng độ ưu tiên
          if (order.status !== "completed" && order.sla.code !== "P1") {
            order.sla = {
              code: "P1",
              label: "P1 - Gấp 🚀",
              color: "bg-red-100 text-red-800",
              description: "Cần xử lý ngay lập tức",
            };
            order.priority = 99;

            // Thêm vào lịch sử
            addToActivityHistory({
              type: "sla_escalation",
              orderId: order.id,
              orderName: order.name,
              timestamp: new Date().toISOString(),
              details: `Đơn ${order.name} đã quá hạn - nâng cấp lên P1`,
            });
          }
        }

        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;

        timeLeft = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        // Giảm độ ưu tiên ngẫu nhiên cho một số đơn để tạo thực tế
        const priority = Math.max(
          1,
          order.priority -
            (Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0)
        );

        return {
          ...order,
          timeLeft,
          priority,
        };
      })
    );

    // Cập nhật các metrics
    setMetrics((prev) => ({
      ...prev,
      pendingOrders: Math.max(
        0,
        prev.pendingOrders - (Math.random() > 0.7 ? 1 : 0)
      ),
      processingOrders: Math.max(
        0,
        prev.processingOrders + (Math.random() > 0.5 ? 1 : -1)
      ),
      completedOrders: prev.completedOrders + (Math.random() > 0.6 ? 1 : 0),
      p1Orders: Math.max(0, prev.p1Orders + (Math.random() > 0.8 ? 1 : -1)),
      staffUtilization: Math.min(
        100,
        Math.max(60, prev.staffUtilization + (Math.random() > 0.5 ? 1 : -1))
      ),
    }));

    // Cập nhật thời gian cập nhật gần nhất
    lastUpdatedRef.current = new Date();
  };

  // Thêm hoạt động vào lịch sử
  const addToActivityHistory = (activity) => {
    setActivityHistory((prev) => [activity, ...prev]);
  };

  // Tự động phân bổ đơn hàng
  const autoAssignOrders = () => {
    if (isAutoAssigning) return;

    setIsAutoAssigning(true);

    // Thực hiện phân bổ tự động sau 1 giây (giả lập thời gian xử lý)
    setTimeout(() => {
      // Lấy danh sách đơn chưa được phân công
      const unassignedOrders = orders.filter(
        (order) => order.status === "pending" && !order.assignedTo
      );

      if (unassignedOrders.length === 0) {
        setIsAutoAssigning(false);
        return;
      }

      // Sắp xếp nhân viên theo trạng thái và khả năng
      const sortedStaff = [...staff].sort((a, b) => {
        // Ưu tiên nhân viên sẵn sàng
        if (a.status === "available" && b.status !== "available") return -1;
        if (a.status !== "available" && b.status === "available") return 1;

        // Sau đó ưu tiên nhân viên còn khả năng nhận đơn
        const aCapacity = a.maxCapacity - a.currentLoad;
        const bCapacity = b.maxCapacity - b.currentLoad;
        return bCapacity - aCapacity;
      });

      // Sắp xếp đơn hàng theo độ ưu tiên
      const sortedOrders = [...unassignedOrders].sort((a, b) => {
        // P1 luôn được ưu tiên cao nhất
        if (a.sla.code === "P1" && b.sla.code !== "P1") return -1;
        if (a.sla.code !== "P1" && b.sla.code === "P1") return 1;

        // Tiếp theo là P2
        if (a.sla.code === "P2" && b.sla.code !== "P2") return -1;
        if (a.sla.code !== "P2" && b.sla.code === "P2") return 1;

        // Sau đó là độ ưu tiên
        return (b.priority || 0) - (a.priority || 0);
      });

      // Thực hiện phân bổ
      const newOrders = [...orders];
      const newStaff = [...staff];

      sortedOrders.forEach((order) => {
        // Tìm nhân viên phù hợp
        const availableStaff = sortedStaff.find((s) => {
          // Kiểm tra còn khả năng nhận đơn
          if (s.currentLoad >= s.maxCapacity) return false;

          // Kiểm tra đơn P1 có vượt quá giới hạn không
          if (order.sla.code === "P1") {
            const p1Count = s.assignedOrders.filter((orderId) => {
              const orderObj = newOrders.find((o) => o.id === orderId);
              return orderObj && orderObj.sla.code === "P1";
            }).length;

            if (p1Count >= allocationConfig.p1MaxPerStaff) return false;
          }

          // Kiểm tra kỹ năng phù hợp với loại sản phẩm
          if (allocationConfig.prioritizeSkills) {
            if (order.productType === "vali" && !s.skills.includes("vali"))
              return false;
            if (order.productType === "balo" && !s.skills.includes("balo"))
              return false;
            if (
              order.productType === "phụ kiện" &&
              !s.skills.includes("phụ kiện")
            )
              return false;
          }

          // Kiểm tra khu vực
          if (allocationConfig.prioritizeLocation) {
            const orderArea = order.location.split("-")[0];
            // Trưởng ca có thể xử lý mọi khu vực
            if (s.role !== "Trưởng ca" && s.area !== orderArea) return false;
          }

          return true;
        });

        if (availableStaff) {
          // Tìm index của nhân viên được chọn
          const staffIndex = newStaff.findIndex(
            (s) => s.id === availableStaff.id
          );

          // Cập nhật đơn hàng
          const orderIndex = newOrders.findIndex((o) => o.id === order.id);
          if (orderIndex !== -1) {
            newOrders[orderIndex] = {
              ...newOrders[orderIndex],
              assignedTo: availableStaff.id,
              status: "processing",
            };
          }

          // Cập nhật nhân viên
          newStaff[staffIndex] = {
            ...newStaff[staffIndex],
            status: "busy",
            currentOrder: newStaff[staffIndex].currentOrder || order.id,
            assignedOrders: [...newStaff[staffIndex].assignedOrders, order.id],
            currentLoad: newStaff[staffIndex].currentLoad + 1,
          };

          // Thêm vào lịch sử hoạt động
          addToActivityHistory({
            type: "auto_assign",
            orderId: order.id,
            orderName: order.name,
            staffId: availableStaff.id,
            staffName: availableStaff.name,
            timestamp: new Date().toISOString(),
            details: `Tự động gán đơn ${order.name} cho ${availableStaff.name}`,
          });
        }
      });

      setOrders(newOrders);
      setStaff(newStaff);
      setIsAutoAssigning(false);
    }, 1000);
  };

  // Phân công đơn theo cách thủ công
  const assignOrderToStaff = (orderId, staffId) => {
    // Tìm đơn hàng cần phân công
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return;

    // Tìm nhân viên được phân công
    const staffIndex = staff.findIndex((s) => s.id === staffId);
    if (staffIndex === -1) return;

    // Kiểm tra nhân viên còn khả năng nhận đơn
    if (staff[staffIndex].currentLoad >= staff[staffIndex].maxCapacity) {
      alert("Nhân viên đã đạt giới hạn số đơn có thể xử lý!");
      return;
    }

    // Cập nhật đơn hàng
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...updatedOrders[orderIndex],
      assignedTo: staffId,
      status: "processing",
    };

    // Cập nhật nhân viên
    const updatedStaff = [...staff];
    updatedStaff[staffIndex] = {
      ...updatedStaff[staffIndex],
      status: "busy",
      currentOrder: updatedStaff[staffIndex].currentOrder || orderId,
      assignedOrders: [...updatedStaff[staffIndex].assignedOrders, orderId],
      currentLoad: updatedStaff[staffIndex].currentLoad + 1,
    };

    setOrders(updatedOrders);
    setStaff(updatedStaff);

    // Thêm vào lịch sử hoạt động
    addToActivityHistory({
      type: "manual_assign",
      orderId,
      orderName: orders[orderIndex].name,
      staffId,
      staffName: staff[staffIndex].name,
      timestamp: new Date().toISOString(),
      details: `Thủ công gán đơn ${orders[orderIndex].name} cho ${staff[staffIndex].name}`,
    });
  };

  // Hủy phân công đơn hàng
  const unassignOrder = (orderId, staffId) => {
    // Tìm đơn hàng cần hủy phân công
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return;

    // Tìm nhân viên được phân công
    const staffIndex = staff.findIndex((s) => s.id === staffId);
    if (staffIndex === -1) return;

    // Cập nhật đơn hàng
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...updatedOrders[orderIndex],
      assignedTo: null,
      status: "pending",
    };

    // Cập nhật nhân viên
    const updatedStaff = [...staff];
    const assignedOrders = updatedStaff[staffIndex].assignedOrders.filter(
      (id) => id !== orderId
    );

    updatedStaff[staffIndex] = {
      ...updatedStaff[staffIndex],
      status: assignedOrders.length > 0 ? "busy" : "available",
      currentOrder:
        assignedOrders.length > 0
          ? assignedOrders[0] !== orderId
            ? updatedStaff[staffIndex].currentOrder
            : assignedOrders[0]
          : null,
      assignedOrders,
      currentLoad: Math.max(0, updatedStaff[staffIndex].currentLoad - 1),
    };

    setOrders(updatedOrders);
    setStaff(updatedStaff);

    // Thêm vào lịch sử hoạt động
    addToActivityHistory({
      type: "unassign",
      orderId,
      orderName: orders[orderIndex].name,
      staffId,
      staffName: staff[staffIndex].name,
      timestamp: new Date().toISOString(),
      details: `Hủy phân công đơn ${orders[orderIndex].name} khỏi ${staff[staffIndex].name}`,
    });
  };

  // Đánh dấu đơn hàng đã hoàn thành
  const markOrderAsCompleted = (orderId) => {
    // Tìm đơn hàng cần đánh dấu
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return;

    // Cập nhật đơn hàng
    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = {
      ...updatedOrders[orderIndex],
      status: "completed",
    };

    // Nếu đơn hàng được phân công cho nhân viên, cập nhật nhân viên
    const assignedStaffId = updatedOrders[orderIndex].assignedTo;
    if (assignedStaffId) {
      const staffIndex = staff.findIndex((s) => s.id === assignedStaffId);
      if (staffIndex !== -1) {
        const updatedStaff = [...staff];
        const assignedOrders = updatedStaff[staffIndex].assignedOrders.filter(
          (id) => id !== orderId
        );

        updatedStaff[staffIndex] = {
          ...updatedStaff[staffIndex],
          status: assignedOrders.length > 0 ? "busy" : "available",
          currentOrder:
            assignedOrders.length > 0
              ? updatedStaff[staffIndex].currentOrder === orderId
                ? assignedOrders[0]
                : updatedStaff[staffIndex].currentOrder
              : null,
          assignedOrders,
          currentLoad: Math.max(0, updatedStaff[staffIndex].currentLoad - 1),
          orderCount: updatedStaff[staffIndex].orderCount + 1,
        };

        setStaff(updatedStaff);

        // Thêm vào lịch sử hoạt động
        addToActivityHistory({
          type: "complete",
          orderId,
          orderName: orders[orderIndex].name,
          staffId: assignedStaffId,
          staffName: updatedStaff[staffIndex].name,
          timestamp: new Date().toISOString(),
          details: `Hoàn thành đơn ${orders[orderIndex].name} bởi ${updatedStaff[staffIndex].name}`,
        });
      }
    }

    setOrders(updatedOrders);

    // Cập nhật metrics
    setMetrics((prev) => ({
      ...prev,
      pendingOrders: Math.max(0, prev.pendingOrders - 1),
      processingOrders: Math.max(0, prev.processingOrders - 1),
      completedOrders: prev.completedOrders + 1,
      p1Orders:
        updatedOrders[orderIndex].sla.code === "P1"
          ? Math.max(0, prev.p1Orders - 1)
          : prev.p1Orders,
    }));
  };

  // Chức năng in đơn hàng
  const printOrders = () => {
    if (selectedOrders.length === 0) return;

    const printUrl =
      printType === "order"
        ? `https://one.tga.com.vn/so/invoicePrint?id=${selectedOrders.join(",")}`
        : `https://one.tga.com.vn/so/prepare?id=${selectedOrders.join(",")}`;

    // Mở URL trong tab mới
    window.open(printUrl, "_blank");

    // Cập nhật thời gian in/xem đơn
    const currentTimestamp = new Date().toISOString();
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (selectedOrders.includes(order.id)) {
          return {
            ...order,
            [printType === "order" ? "printTimestamp" : "viewTimestamp"]:
              currentTimestamp,
          };
        }
        return order;
      })
    );

    // Thêm vào lịch sử hoạt động
    addToActivityHistory({
      type: printType === "order" ? "print_order" : "print_picking",
      timestamp: currentTimestamp,
      details: `${printType === "order" ? "In đơn hàng" : "Xem phiếu soạn hàng"} cho ${selectedOrders.length} đơn: ${selectedOrders.join(", ")}`,
    });

    // Đóng modal
    setShowPrintModal(false);
  };

  // Lọc đơn hàng theo các tiêu chí đã chọn
  const filteredOrders = orders
      .filter((order: {
        location: any;
        id: any;
        name: any;
        detail: any;
        customer: any;
        shipment_code: any; priority: number; sla: { code: string }; timeLeft: string
}) => {
      // Lọc theo mức độ ưu tiên SLA
      if (selectedPriority !== "all" && order.sla.code !== selectedPriority) {
        return false;
      }

      // Lọc theo khu vực
      if (selectedArea !== "all") {
        const orderArea = order.location.split("-")[0];
        if (orderArea !== selectedArea) {
          return false;
        }
      }

      // Lọc theo từ khóa tìm kiếm
      if (searchTerm) {
        const normalizedSearch = searchTerm.toLowerCase();

        return (
          order.id.toLowerCase().includes(normalizedSearch) ||
          order.name.toLowerCase().includes(normalizedSearch) ||
          order.detail.toLowerCase().includes(normalizedSearch) ||
          order.customer.toLowerCase().includes(normalizedSearch) ||
          order.shipment_code.toLowerCase().includes(normalizedSearch) ||
          order.location.toLowerCase().includes(normalizedSearch)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sắp xếp theo trường được chọn và hướng sắp xếp
      if (orderSort.field === "priority") {
        const priorityA = a.priority || 0;
        const priorityB = b.priority || 0;

        return orderSort.direction === "asc"
          ? priorityA - priorityB
          : priorityB - priorityA;
      } else if (orderSort.field === "sla") {
        const slaValueA = getSLAValue(a.sla.code);
        const slaValueB = getSLAValue(b.sla.code);

        return orderSort.direction === "asc"
          ? slaValueA - slaValueB
          : slaValueB - slaValueA;
      } else if (orderSort.field === "time") {
        // Sắp xếp theo thời gian còn lại
        const [hoursA, minsA, secsA] = a.timeLeft.split(":").map(Number);
        const [hoursB, minsB, secsB] = b.timeLeft.split(":").map(Number);

        const timeA = hoursA * 3600 + minsA * 60 + secsA;
        const timeB = hoursB * 3600 + minsB * 60 + secsB;

        return orderSort.direction === "asc" ? timeA - timeB : timeB - timeA;
      }

      // Mặc định sắp xếp theo id
      return a.id - b.id;
    });

  // Trả về giá trị số của mã SLA để sắp xếp
  const getSLAValue = (slaCode) => {
    switch (slaCode) {
      case "P1":
        return 1;
      case "P2":
        return 2;
      case "P3":
        return 3;
      case "P4":
        return 4;
      default:
        return 5;
    }
  };

  // Lọc nhân viên theo trạng thái
  const filteredStaff = staff.filter((s) => {
    if (staffFilter === "available" && s.status !== "available") {
      return false;
    }

    if (staffFilter === "busy" && s.status !== "busy") {
      return false;
    }

    return true;
  });

  // Toggle selected order
  const toggleOrderSelection = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Select/deselect all orders
  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };

  // Download lịch sử hoạt động
  const downloadActivityHistory = () => {
    if (activityHistory.length === 0) return;

    // Chuẩn bị dữ liệu CSV
    const headers = [
      "Thời gian",
      "Loại hoạt động",
      "Mã đơn",
      "Tên đơn",
      "Mã NV",
      "Tên NV",
      "Chi tiết",
    ];
    const rows = [headers.join(",")];

    activityHistory.forEach((activity) => {
      const row = [
        new Date(activity.timestamp).toLocaleString("vi-VN"),
        activity.type || "",
        activity.orderId || "",
        activity.orderName || "",
        activity.staffId || "",
        activity.staffName || "",
        `"${activity.details || ""}"`,
      ];

      rows.push(row.join(","));
    });

    // Tạo file blob
    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Tạo link tải xuống
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `activity_history_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Thêm vào lịch sử hoạt động
    addToActivityHistory({
      type: "export_history",
      timestamp: new Date().toISOString(),
      details: `Xuất lịch sử hoạt động (${activityHistory.length} bản ghi)`,
    });
  };

  // Chuyển sang chế độ xem như nhân viên
  const switchToStaffView = (staffId) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;

    setCurrentStaffView(staffMember);
    setTab("staff_view");
  };

  // Quay lại chế độ xem quản lý
  const exitStaffView = () => {
    setCurrentStaffView(null);
    setTab("staff");
  };

  // Render từng tab
  const renderDashboard = () => (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500 mb-1">Tổng đơn hàng</div>
                <div className="text-2xl font-bold">{metrics.totalOrders}</div>
              </div>
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {metrics.pendingOrders} chờ xử lý | {metrics.processingOrders}{" "}
              đang xử lý | {metrics.completedOrders} hoàn thành
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500 mb-1">Đơn P1 (gấp)</div>
                <div className="text-2xl font-bold text-red-600">
                  {metrics.p1Orders}
                </div>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {Math.floor(metrics.p1Orders / 2)} đang xử lý |{" "}
              {Math.ceil(metrics.p1Orders / 2)} chờ xử lý
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Thời gian lấy TB
                </div>
                <div className="text-2xl font-bold">
                  {metrics.avgPickingTime} phút
                </div>
              </div>
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {metrics.slaCompliance}% đạt SLA
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500 mb-1">Tải nhân sự</div>
                <div className="text-2xl font-bold">
                  {metrics.staffUtilization}%
                </div>
              </div>
              <User className="h-6 w-6 text-green-500" />
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  metrics.staffUtilization > 90
                    ? "bg-red-500"
                    : metrics.staffUtilization > 75
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${metrics.staffUtilization}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Đơn ưu tiên cao */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Đơn ưu tiên cao cần xử lý</h3>
            <button
              className="px-2 py-1 bg-blue-600 text-white text-xs rounded flex items-center"
              onClick={autoAssignOrders}
              disabled={isAutoAssigning}
            >
              {isAutoAssigning ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  <span>Đang phân bổ...</span>
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3 mr-1" />
                  <span>Phân bổ tự động</span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SLA
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian còn
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại SP
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vị trí kho
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders
                  .filter(
                    (order) =>
                      (order.sla.code === "P1" || order.sla.code === "P2") &&
                      order.status !== "completed"
                  )
                  .slice(0, 5)
                  .map((order) => (
                    <tr
                      key={order.id}
                      className={order.sla.code === "P1" ? "bg-red-50" : ""}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.customer}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${order.sla.color}`}
                        >
                          {order.sla.code}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div
                          className={`text-sm font-medium ${order.sla.code === "P1" ? "text-red-600" : "text-yellow-600"}`}
                        >
                          {order.timeLeft}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {order.productType}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                          {order.location}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        {order.assignedTo ? (
                          <div className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-1" />
                            <span>
                              {staff.find((s) => s.id === order.assignedTo)
                                ?.name || `NV${order.assignedTo}`}
                            </span>
                          </div>
                        ) : (
                          <select
                            className="text-xs border border-gray-200 rounded py-1 px-2"
                            onChange={(e) =>
                              assignOrderToStaff(
                                order.id,
                                parseInt(e.target.value)
                              )
                            }
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Chọn nhân viên
                            </option>
                            {staff
                              .filter((s) => s.currentLoad < s.maxCapacity)
                              .map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name} ({s.currentLoad}/{s.maxCapacity})
                                </option>
                              ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                {orders.filter(
                  (order) =>
                    (order.sla.code === "P1" || order.sla.code === "P2") &&
                    order.status !== "completed"
                ).length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-3 py-4 text-center text-gray-500"
                    >
                      Không có đơn ưu tiên cao cần xử lý
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-2 text-right">
            <button
              onClick={() => setTab("orders")}
              className="text-blue-600 text-sm"
            >
              Xem tất cả đơn
            </button>
          </div>
        </div>

        {/* Đơn đang xử lý */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Đơn đang xử lý</h3>
            <span className="text-xs text-gray-500">
              {orders.filter((order) => order.status === "processing").length}{" "}
              đơn
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {orders
              .filter((order) => order.status === "processing")
              .slice(0, 6)
              .map((order) => {
                const assignedStaffMember = staff.find(
                  (s) => s.id === order.assignedTo
                );

                return (
                  <div
                    key={order.id}
                    className={`border rounded-lg p-3 ${
                      order.sla.code === "P1"
                        ? "bg-red-50 border-red-200"
                        : order.sla.code === "P2"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-sm">{order.name}</div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${order.sla.color}`}
                      >
                        {order.sla.code}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 mb-2 line-clamp-1">
                      {order.detail}
                    </div>

                    <div className="text-xs text-gray-600 mb-2">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {order.location}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <User className="h-3 w-3 text-blue-500 mr-1" />
                        <span className="text-xs font-medium">
                          {assignedStaffMember?.name || "Chưa phân công"}
                        </span>
                      </div>

                      <div className="flex space-x-1">
                        <button
                          className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded flex items-center"
                          onClick={() => startScanning(order)}
                        >
                          <BarcodeScan className="h-3 w-3 mr-1" />
                          Quét mã
                        </button>

                        <button
                          className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded"
                          onClick={() => markOrderAsCompleted(order.id)}
                        >
                          Hoàn thành
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            {orders.filter((order) => order.status === "processing").length ===
              0 && (
              <div className="col-span-full text-center text-gray-500 py-4">
                Không có đơn đang xử lý
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Nhân viên đang làm việc */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Nhân viên đang làm việc</h3>
            <button
              className="text-xs text-blue-600"
              onClick={() => setShowStaffPanel(!showStaffPanel)}
            >
              {showStaffPanel ? "Ẩn bảng" : "Xem tất cả"}
            </button>
          </div>

          <div className="space-y-3">
            {staff
              .filter((s) => s.status === "busy")
              .map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between bg-yellow-50 p-2 rounded-lg border border-yellow-100"
                >
                  <div>
                    <div className="font-medium text-sm">{s.name}</div>
                    <div className="text-xs text-gray-500">
                      {s.role} • Khu {s.area}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium">
                      {s.currentLoad}/{s.maxCapacity} đơn
                    </div>
                    <div className="text-xs text-gray-500">
                      Hiệu suất: {s.efficiency}%
                    </div>
                  </div>
                </div>
              ))}

            {staff.filter((s) => s.status === "busy").length === 0 && (
              <div className="text-center text-gray-500 py-2">
                Không có nhân viên đang làm việc
              </div>
            )}
          </div>
        </div>

        {/* Thống kê SLA */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Thống kê theo SLA</h3>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
              {metrics.slaCompliance}% đạt SLA
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>P1 - Gấp</span>
                <span>{metrics.p1Orders} đơn</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-red-500 h-1.5 rounded-full"
                  style={{
                    width: `${(metrics.p1Orders / metrics.totalOrders) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>P2 - Cảnh báo</span>
                <span>{metrics.p2Orders} đơn</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-yellow-500 h-1.5 rounded-full"
                  style={{
                    width: `${(metrics.p2Orders / metrics.totalOrders) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>P3/P4 - Thường</span>
                <span>
                  {metrics.totalOrders - metrics.p1Orders - metrics.p2Orders}{" "}
                  đơn
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{
                    width: `${((metrics.totalOrders - metrics.p1Orders - metrics.p2Orders) / metrics.totalOrders) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="text-xs font-medium mb-2">Hiệu suất kho vận</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  (metrics.completedOrders / metrics.totalOrders) * 100
                )}
                %
              </div>
              <div className="text-xs text-gray-500">
                {metrics.completedOrders}/{metrics.totalOrders} đơn hoàn thành
              </div>
            </div>
          </div>
        </div>

        {/* Lịch sử hoạt động gần đây */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Hoạt động gần đây</h3>
            <button
              className="text-xs text-blue-600"
              onClick={() => setShowActivityHistory(!showActivityHistory)}
            >
              {showActivityHistory ? "Ẩn lịch sử" : "Xem tất cả"}
            </button>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto">
            {activityHistory.slice(0, 5).map((activity, index) => (
              <div
                key={index}
                className="text-xs border-l-2 border-blue-500 pl-2 py-1"
              >
                <div className="flex justify-between">
                  <span className="font-medium">
                    {activity.type === "auto_assign" && "Tự động phân bổ"}
                    {activity.type === "manual_assign" && "Phân bổ thủ công"}
                    {activity.type === "complete" && "Hoàn thành đơn"}
                    {activity.type === "upload" && "Tải lên đơn hàng"}
                    {activity.type === "system" && "Hệ thống"}
                    {activity.type === "print_order" && "In đơn hàng"}
                    {activity.type === "print_picking" && "Soạn hàng"}
                    {activity.type === "unassign" && "Hủy phân công"}
                    {activity.type === "sla_escalation" && "Nâng cấp SLA"}
                    {activity.type === "scan_start" && "Bắt đầu quét mã"}
                    {activity.type === "scan_complete" && "Hoàn thành quét mã"}
                    {activity.type === "scan_error" && "Lỗi quét mã"}
                    {activity.type === "print_after_scan" && "In sau quét mã"}
                    {activity.type === "error" && "Lỗi hệ thống"}
                  </span>
                  <span className="text-gray-500">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="mt-1">{activity.details}</div>
              </div>
            ))}

            {activityHistory.length === 0 && (
              <div className="text-center text-gray-500 py-2">
                Chưa có hoạt động nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Danh sách đơn hàng</h3>

        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              className="pl-8 pr-3 py-1.5 text-sm border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="h-4 w-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
          </div>

          <select
            className="px-3 py-1.5 text-sm border rounded"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="all">Tất cả SLA</option>
            <option value="P1">P1 - Gấp</option>
            <option value="P2">P2 - Cảnh báo</option>
            <option value="P3">P3 - Bình thường</option>
            <option value="P4">P4 - Chờ xử lý</option>
          </select>

          <select
            className="px-3 py-1.5 text-sm border rounded"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="all">Tất cả khu vực</option>
            <option value="HN">Hà Nội</option>
            <option value="290">Kho 290</option>
            <option value="300">Kho 300</option>
          </select>
        </div>
      </div>

      <div className="flex items-center mb-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="mr-1"
            checked={
              selectedOrders.length === filteredOrders.length &&
              filteredOrders.length > 0
            }
            onChange={toggleSelectAll}
          />
          <span className="text-sm">Chọn tất cả</span>
        </div>

        <div className="ml-4 text-sm">
          Đã chọn{" "}
          <span className="font-medium text-blue-600">
            {selectedOrders.length}
          </span>{" "}
          / {filteredOrders.length} đơn

        {selectedOrders.length > 0 && (
          <div className="ml-auto space-x-2">
            <button
              className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded flex items-center"
              onClick={() => {
                setPrintType("order");
                setShowPrintModal(true);
              }}
            >
              <Printer className="h-4 w-4 mr-1" />
              <span>In đơn</span>
            </button>

            <button
              className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded flex items-center"
              onClick={() => {
                setPrintType("picking");
                setShowPrintModal(true);
              }}
            >
              <FileText className="h-4 w-4 mr-1" />
              <span>Soạn hàng</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 px-3 py-3">
                  <span className="sr-only">Chọn</span>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn / Kênh
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      setOrderSort({
                        field: "sla",
                        direction:
                          orderSort.field === "sla" &&
                          orderSort.direction === "asc"
                            ? "desc"
                            : "asc",
                      })
                    }
                  >
                    <span>SLA</span>
                    {orderSort.field === "sla" &&
                      (orderSort.direction === "asc" ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      setOrderSort({
                        field: "time",
                        direction:
                          orderSort.field === "time" &&
                          orderSort.direction === "asc"
                            ? "desc"
                            : "asc",
                      })
                    }
                  >
                    <span>Thời gian còn</span>
                    {orderSort.field === "time" &&
                      (orderSort.direction === "asc" ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí kho
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() =>
                      setOrderSort({
                        field: "priority",
                        direction:
                          orderSort.field === "priority" &&
                          orderSort.direction === "asc"
                            ? "desc"
                            : "asc",
                      })
                    }
                  >
                    <span>Ưu tiên</span>
                    {orderSort.field === "priority" &&
                      (orderSort.direction === "asc" ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhân viên
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className={
                    order.status === "completed"
                      ? "bg-gray-50 text-gray-500"
                      : order.sla.code === "P1"
                        ? "bg-red-50"
                        : order.sla.code === "P2"
                          ? "bg-yellow-50"
                          : ""
                  }
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      disabled={order.status === "completed"}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium">{order.name}</div>
                    <div className="text-xs text-gray-500">
                      {order.customer}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${order.sla.color}`}
                    >
                      {order.sla.code}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        order.status === "completed"
                          ? "text-gray-500"
                          : order.sla.code === "P1"
                            ? "text-red-600"
                            : order.sla.code === "P2"
                              ? "text-yellow-600"
                              : "text-gray-600"
                      }`}
                    >
                      {order.timeLeft}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="text-sm line-clamp-1 max-w-xs">
                      {order.detail}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.productType} • {order.complexity}
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
                      {order.location}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          order.priority > 90
                            ? "bg-red-500"
                            : order.priority > 80
                              ? "bg-yellow-500"
                              : order.priority > 70
                                ? "bg-orange-500"
                                : order.priority > 50
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                        }`}
                        style={{ width: `${order.priority}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-right mt-1">
                      {order.priority}%
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status === "completed"
                        ? "Hoàn thành"
                        : order.status === "processing"
                          ? "Đang xử lý"
                          : "Chờ xử lý"}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {order.assignedTo ? (
                      <div className="flex items-center">
                        {order.status !== "completed" ? (
                          <>
                            <div className="text-sm">
                              {
                                staff.find((s) => s.id === order.assignedTo)
                                  ?.name
                              }
                            </div>
                            <button
                              className="ml-2 p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              onClick={() =>
                                unassignOrder(order.id, order.assignedTo)
                              }
                              title="Hủy phân công"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <div className="text-sm">
                            {staff.find((s) => s.id === order.assignedTo)?.name}
                          </div>
                        )}
                      </div>
                    ) : order.status !== "completed" ? (
                      <select
                        className="text-xs border border-gray-200 rounded py-1 px-2"
                        onChange={(e) =>
                          assignOrderToStaff(order.id, parseInt(e.target.value))
                        }
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Chọn nhân viên
                        </option>
                        {staff
                          .filter((s) => s.currentLoad < s.maxCapacity)
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} ({s.currentLoad}/{s.maxCapacity})
                            </option>
                          ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="px-3 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy đơn hàng nào phù hợp với điều kiện lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStaff = () => {
    // Log thời điểm xem đơn hàng
    const logOrderViewed = (orderId, staffId, viewType) => {
      const order = orders.find((o) => o.id === orderId);
      const staffMember = staff.find((s) => s.id === staffId);

      if (!order || !staffMember) return;

      // Thêm vào lịch sử hoạt động
      addToActivityHistory({
        type: viewType === "print" ? "view_print" : "view_picking",
        orderId,
        orderName: order.name,
        staffId: staffMember.id,
        staffName: staffMember.name,
        timestamp: new Date().toISOString(),
        details: `${staffMember.name} ${viewType === "print" ? "in đơn hàng" : "xem soạn hàng"} ${order.name || orderId}`,
      });
    };

    // In hoặc soạn hàng đơn lẻ
    const printSingleOrder = (orderId, type) => {
      const staffMember = staff.find((s) => s.assignedOrders.includes(orderId));

      if (!staffMember) return;

      // Ghi log thời điểm xem/in đơn
      logOrderViewed(orderId, staffMember.id, type);

      // Mở URL trong tab mới
      const url =
        type === "print"
          ? `https://one.tga.com.vn/so/invoicePrint?id=${orderId}`
          : `https://one.tga.com.vn/so/prepare?id=${orderId}`;

      window.open(url, "_blank");
    };

    // In hoặc soạn hàng tất cả đơn của nhân viên
    const printAllStaffOrders = (staffId, type) => {
      const staffMember = staff.find((s) => s.id === staffId);

      if (!staffMember || staffMember.assignedOrders.length === 0) return;

      // Ghi log cho tất cả đơn
      staffMember.assignedOrders.forEach((orderId) => {
        logOrderViewed(orderId, staffId, type);
      });

      // Mở URL trong tab mới
      const url =
        type === "print"
          ? `https://one.tga.com.vn/so/invoicePrint?id=${staffMember.assignedOrders.join(",")}`
          : `https://one.tga.com.vn/so/prepare?id=${staffMember.assignedOrders.join(",")}`;

      window.open(url, "_blank");
    };

    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Quản lý nhân sự</h3>

          <div className="flex space-x-2">
            <select
              className="px-3 py-1.5 text-sm border rounded"
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
            >
              <option value="all">Tất cả nhân viên</option>
              <option value="available">Sẵn sàng</option>
              <option value="busy">Đang làm việc</option>
            </select>

            <button
              className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded flex items-center"
              onClick={autoAssignOrders}
              disabled={isAutoAssigning}
            >
              {isAutoAssigning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                  <span>Đang phân bổ...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-1" />
                  <span>Phân bổ tự động</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khu vực
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kỹ năng
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn đang xử lý
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hiệu suất
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((person) => (
                  <tr
                    key={person.id}
                    className={person.status === "busy" ? "bg-yellow-50" : ""}
                  >
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="font-medium text-gray-900">
                          {person.name}
                        </div>
                        <div className="text-xs text-gray-500 ml-1">
                          ({person.role})
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        Khu {person.area}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {person.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          person.status === "busy"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {person.status === "busy"
                          ? "Đang làm việc"
                          : "Sẵn sàng"}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm">
                        {person.currentLoad}/{person.maxCapacity} đơn
                      </div>
                      {person.currentOrder && (
                        <div className="text-xs text-gray-500 mt-1">
                          Đang xử lý:{" "}
                          {orders.find((o) => o.id === person.currentOrder)
                            ?.name || person.currentOrder}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium mr-2">
                          {person.efficiency}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              person.efficiency >= 95
                                ? "bg-green-500"
                                : person.efficiency >= 90
                                  ? "bg-blue-500"
                                  : person.efficiency >= 85
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{ width: `${person.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {person.orderCount} đơn đã xử lý
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          title="Xem chi tiết"
                          onClick={() => switchToStaffView(person.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {person.assignedOrders.length > 0 && (
                          <>
                            <button
                              className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                              title="In tất cả đơn"
                              onClick={() =>
                                printAllStaffOrders(person.id, "print")
                              }
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                              title="Soạn tất cả đơn"
                              onClick={() =>
                                printAllStaffOrders(person.id, "picking")
                              }
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStaff.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-3 py-4 text-center text-gray-500"
                    >
                      Không tìm thấy nhân viên nào phù hợp với điều kiện lọc
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Đơn hàng được phân công cho từng nhân viên - Giao diện nhóm đơn theo nhân viên */}
        <h3 className="font-medium mb-3">
          Đơn hàng đã phân công theo nhân viên
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff
            .filter((s) => s.assignedOrders.length > 0)
            .map((person) => (
              <div
                key={person.id}
                className="bg-white rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium flex items-center">
                    <User className="h-4 w-4 mr-1 text-blue-600" />
                    {person.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      person.status === "busy"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {person.status === "busy" ? "Đang làm việc" : "Sẵn sàng"}
                  </span>
                </div>

                <div className="mb-3 text-xs text-gray-500">
                  {person.role} • Khu {person.area} • Hiệu suất:{" "}
                  {person.efficiency}%
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    <span className="font-medium">{person.currentLoad}</span>/
                    {person.maxCapacity} đơn
                  </div>

                  <div className="flex space-x-1">
                    <button
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded flex items-center"
                      onClick={() => printAllStaffOrders(person.id, "print")}
                      disabled={person.assignedOrders.length === 0}
                    >
                      <Printer className="h-3 w-3 mr-1" />
                      In tất cả
                    </button>
                    <button
                      className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center"
                      onClick={() => printAllStaffOrders(person.id, "picking")}
                      disabled={person.assignedOrders.length === 0}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Soạn tất cả
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {person.assignedOrders.map((orderId, index) => {
                    const order = orders.find((o) => o.id === orderId);
                    if (!order) return null;

                    return (
                      <div
                        key={orderId}
                        className={`p-3 rounded-lg border ${
                          order.sla.code === "P1"
                            ? "bg-red-50 border-red-200"
                            : order.sla.code === "P2"
                              ? "bg-yellow-50 border-yellow-200"
                              : order.sla.code === "P3"
                                ? "bg-green-50 border-green-200"
                                : "bg-blue-50 border-blue-200"
                        } ${index === 0 ? "border-l-4" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-sm">
                            {order.name}
                            {index === 0 && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                Đang xử lý
                              </span>
                            )}
                          </div>
                          <span
                            className={`px-1.5 py-0.5 text-xs rounded-full ${order.sla.color}`}
                          >
                            {order.sla.code}
                          </span>
                        </div>

                        <div className="text-xs text-gray-600 mt-2 line-clamp-2">
                          {order.detail}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="text-xs text-gray-600">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {order.location}
                          </div>

                          <div className="text-xs font-medium">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {order.timeLeft}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                          <div className="flex space-x-1">
                            <button
                              className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded flex items-center"
                              onClick={() =>
                                printSingleOrder(order.id, "print")
                              }
                              title="In đơn hàng"
                            >
                              <Printer className="h-3 w-3 mr-1" />
                              In đơn
                            </button>

                            <button
                              className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded flex items-center"
                              onClick={() =>
                                printSingleOrder(order.id, "picking")
                              }
                              title="Phiếu soạn hàng"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Soạn hàng
                            </button>
                          </div>

                          <div className="flex space-x-1">
                            <button
                              className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded flex items-center"
                              onClick={() => startScanning(order)}
                            >
                              <BarcodeScan className="h-3 w-3 mr-1" />
                              Quét mã
                            </button>

                            {index === 0 && (
                              <button
                                className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded flex items-center"
                                onClick={() => markOrderAsCompleted(order.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Hoàn thành
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {person.assignedOrders.length === 0 && (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                    Không có đơn hàng được phân công
                  </div>
                )}
              </div>
            ))}

          {staff.filter((s) => s.assignedOrders.length > 0).length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-4 bg-white rounded-lg shadow-sm">
              Không có nhân viên nào được phân công đơn hàng
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render giao diện cho nhân viên cụ thể
  const renderStaffView = () => {
    if (!currentStaffView) return null;

    // Lấy danh sách đơn của nhân viên
    const staffOrders = orders.filter(order =>
      currentStaffView.assignedOrders.includes(order.id)
    );

    return (
      <div className="mb-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium">
                Giao diện nhân viên: {currentStaffView.name}
              </h2>
              <p className="text-sm text-gray-600">
                {currentStaffView.role} • Khu vực {currentStaffView.area} •
                Đang xử lý {currentStaffView.currentLoad}/{currentStaffView.maxCapacity} đơn
              </p>
            </div>

            <button
              onClick={exitStaffView}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded"
            >
              Quay lại quản lý
            </button>
          </div>
        </div>

        <h3 className="font-medium mb-3">Đơn hàng của bạn</h3>

        {staffOrders.length > 0 ? (
          <div className="space-y-4">
            {staffOrders.map((order, index) => (
              <div
                key={order.id}
                className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${
                  order.sla.code === "P1"
                    ? "border-l-red-500"
                    : order.sla.code === "P2"
                      ? "border-l-yellow-500"
                      : "border-l-green-500"
                }`}
              >
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-lg">{order.name}</h4>
                    <div className="text-sm text-gray-600">{order.customer} • {order.transporter}</div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`px-2 py-1 rounded-full text-sm ${order.sla.color}`}>
                      {order.sla.label}
                    </span>
                    <span className="mt-1 text-sm font-medium">
                      Còn lại: {order.timeLeft}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <h5 className="font-medium mb-2">Chi tiết đơn hàng:</h5>
                  <p>{order.detail}</p>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="text-sm">
                      <span className="text-gray-600">Vị trí kho:</span>{" "}
                      <span className="font-medium">{order.location}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Loại sản phẩm:</span>{" "}
                      <span className="font-medium">{order.productType}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Mã vận đơn:</span>{" "}
                      <span className="font-medium">{order.shipment_code}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Ghi chú:</span>{" "}
                      <span className="font-medium">{order.note || "Không có"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => printSingleOrder(order.id, "print")}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded flex items-center"
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      In đơn hàng
                    </button>

                    <button
                      onClick={() => printSingleOrder(order.id, "picking")}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Xem soạn hàng
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => startScanning(order)}
                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded flex items-center"
                    >
                      <BarcodeScan className="h-4 w-4 mr-1" />
                      Quét mã SP
                    </button>

                    {index === 0 && (
                      <button
                        onClick={() => markOrderAsCompleted(order.id)}
                        className="px-3 py-2 bg-green-600 text-white rounded flex items-center"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Hoàn thành
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="text-gray-500 mb-2">Bạn chưa được gán đơn hàng nào</div>
            <p className="text-sm text-gray-400">Vui lòng chờ quản lý phân công đơn</p>
          </div>
        )}
      </div>
    );
  };

  const renderLayoutOptimization = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Tối ưu Layout và Lộ trình lấy hàng</h3>

        <button
          className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded flex items-center"
          onClick={() => {}}
        >
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>Tạo lộ trình mới</span>
        </button>
      </div>

      {/* Bản đồ nhiệt kho */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-3">Bản đồ nhiệt hoạt động kho</h4>

          <div className="h-64 relative overflow-hidden mb-3">
            {/* Giả lập bản đồ nhiệt với Grid */}
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 40 }).map((_, index) => {
                // Tạo mã màu ngẫu nhiên dựa trên mức độ hoạt động
                const activity = Math.floor(Math.random() * 100);
                let bgColor = "bg-blue-100";

                if (activity > 80) bgColor = "bg-red-100";
                else if (activity > 60) bgColor = "bg-orange-100";
                else if (activity > 40) bgColor = "bg-yellow-100";
                else if (activity > 20) bgColor = "bg-green-100";

                // Xác định khu vực
                const row = Math.floor(index / 8);
                const col = index % 8;
                const zone = String.fromCharCode(65 + Math.floor(col / 2)); // A, B, C, D

                return (
                  <div
                    key={index}
                    className={`${bgColor} rounded-sm h-10 flex items-center justify-center relative ${
                      col % 2 === 0 ? "border-l-2 border-gray-400" : ""
                    }`}
                    title={`Khu ${zone}: ${activity}% hoạt động`}
                  >
                    <span className="text-xs font-medium">{zone}</span>
                    {activity > 80 && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-1 text-xs">
              <span className="bg-blue-100 px-2 py-0.5 rounded">Thấp</span>
              <span className="bg-green-100 px-2 py-0.5 rounded"></span>
              <span className="bg-yellow-100 px-2 py-0.5 rounded"></span>
              <span className="bg-orange-100 px-2 py-0.5 rounded"></span>
              <span className="bg-red-100 px-2 py-0.5 rounded">Cao</span>
            </div>

            <div className="text-xs text-gray-500">
              * Màu đậm = hoạt động cao | Điểm đỏ = cần bổ sung nhân viên
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-3">Hiệu suất theo khu vực</h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Khu A</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Khu B</span>
                <span>72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "72%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Khu C</span>
                <span>94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: "94%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Khu D</span>
                <span>65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm font-medium mb-2">Đề xuất tối ưu</div>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-start">
                <div className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded mr-2">
                  Khu C
                </div>
                <div>Di chuyển SKU phổ biến ra gần lối đi chính</div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded mr-2">
                  Khu A
                </div>
                <div>Thêm nhân viên vào giờ cao điểm (9-11h)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hot SKUs và đề xuất tối ưu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-3">Top SKUs phổ biến</h4>

          <div className="space-y-3 mb-4">
            {[
              {
                sku: "ID2041_20",
                name: 'Valinice Yari 20"',
                count: 8,
                location: "A1-01",
              },
              {
                sku: "BR0224_23",
                name: 'Balore Rio 23"',
                count: 6,
                location: "A3-05",
              },
              {
                sku: "LUGHTAG-S",
                name: "Mia Luggage Tag",
                count: 5,
                location: "B5-03",
              },
              {
                sku: "CWGC_20",
                name: 'Clearguard Cover 20"',
                count: 4,
                location: "B2-08",
              },
              {
                sku: "CMKD-7ML",
                name: "Cerave Kem dưỡng ẩm 7ml",
                count: 4,
                location: "C1-12",
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{item.sku}</div>
                  <div className="text-xs text-gray-500">{item.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{item.count} đơn</div>
                  <div className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    {item.location}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500 text-center">
            * Số liệu dựa trên 50 đơn gần nhất
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-3">Đề xuất tái bố trí kho</h4>

          <div className="space-y-3">
            <div className="p-3 border border-green-100 bg-green-50 rounded-lg">
              <div className="font-medium text-sm">Di chuyển SKUs phổ biến</div>
              <div className="mt-1 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>ID2041_20</span>
                  <div className="flex items-center">
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                      A1-01
                    </span>
                    <ArrowRight className="h-3 w-3 mx-1" />
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded">
                      A0-05
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>CMKD-7ML</span>
                  <div className="flex items-center">
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                      C1-12
                    </span>
                    <ArrowRight className="h-3 w-3 mx-1" />
                    <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded">
                      B3-02
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border border-yellow-100 bg-yellow-50 rounded-lg">
              <div className="font-medium text-sm">Nhóm SKUs liên quan</div>
              <div className="mt-1 space-y-1 text-xs">
                <div>
                  <div className="font-medium">Nhóm Vali + Tag</div>
                  <div className="flex justify-between mt-1">
                    <span>ID2041_20 + LUGHTAG-S</span>
                    <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">
                      8 đơn
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border border-blue-100 bg-blue-50 rounded-lg">
              <div className="font-medium text-sm">
                Khu vực đề xuất giãn rộng
              </div>
              <div className="mt-1 text-xs">
                Khu vực B đang hoạt động với công suất cao, cần mở rộng thêm 2
                giá kệ
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-medium mb-3">Lộ trình lấy hàng tối ưu</h4>

          <div className="space-y-4">
            <div className="p-3 border border-blue-100 bg-blue-50 rounded-lg">
              <div className="font-medium text-sm">P1 - Đơn gấp</div>
              <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                <div className="bg-white px-2 py-1 rounded text-center">
                  A1-01
                </div>
                <div className="bg-white px-2 py-1 rounded text-center">
                  A3-05
                </div>
                <div className="bg-white px-2 py-1 rounded text-center">
                  B5-03
                </div>
                <div className="bg-white px-2 py-1 rounded text-center">
                  C1-12
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <div>• Lộ trình: Z (Theo hàng ngang)</div>
                <div>• Ưu tiên: Theo SLA</div>
                <div>• Thời gian dự kiến: 8 phút</div>
              </div>
            </div>

            <div className="p-3 border border-green-100 bg-green-50 rounded-lg">
              <div className="font-medium text-sm">Đơn cùng loại</div>
              <div className="mt-2 grid grid-cols-6 gap-1 text-xs">
                <div className="bg-white px-1.5 py-1 rounded text-center">
                  A1-01
                </div>
                <div className="bg-white px-1.5 py-1 rounded text-center">
                  A1-02
                </div>
                <div className="bg-white px-1.5 py-1 rounded text-center">
                  A1-05
                </div>
                <div className="bg-white px-1.5 py-1 rounded text-center">
                  A2-01
                </div>
                <div className="bg-white px-1.5 py-1 rounded text-center">
                  A2-08
                </div>
                <div className="bg-white px-1.5 py-1 rounded text-center">
                  A3-03
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <div>• Lộ trình: U (Theo dãy kệ)</div>
                <div>• Ưu tiên: Theo sản phẩm</div>
                <div>• Thời gian dự kiến: 12 phút</div>
              </div>
            </div>

            <div className="p-3 border border-purple-100 bg-purple-50 rounded-lg">
              <div className="font-medium text-sm">Đơn phụ kiện</div>
              <div className="mt-2 grid grid-cols-5 gap-1 text-xs">
                <div className="bg-white px-1.5 py-1 rounded text-center">
                  B2-08
                </div>
                <div className="bg-white px-1.5 py-1 rounded text-center">
                  B3-02
                </div>
                <div className="bg-white px-1.5 py-1 rounded text-center">
                  B5-03
                </div>
                <div className="bg-white px-1.5 py-1 rounded text-center">
                  C1-12
                </div>
                <div className="bg-white px-1.5 py-1 rounded text-center">
                  C3-05
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <div>• Lộ trình: S (Hình chữ S)</div>
                <div>• Ưu tiên: Theo khu vực</div>
                <div>• Thời gian dự kiến: 10 phút</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Báo cáo tối ưu và hiệu suất */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h4 className="font-medium mb-3">Báo cáo hiệu suất và tối ưu</h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="text-xl font-bold">27%</div>
            <div className="text-sm text-gray-500">
              Giảm thời gian di chuyển
            </div>
            <div className="mt-2 text-xs">Sau khi áp dụng lộ trình tối ưu</div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="text-xl font-bold">15%</div>
            <div className="text-sm text-gray-500">Tăng đơn xử lý / giờ</div>
            <div className="mt-2 text-xs">Sau khi điều chỉnh layout kho</div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="text-xl font-bold">38%</div>
            <div className="text-sm text-gray-500">Giảm tắc nghẽn kho</div>
            <div className="mt-2 text-xs">Nhờ phân bổ nhân sự hợp lý</div>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="text-xl font-bold">92%</div>
            <div className="text-sm text-gray-500">Đơn tuân thủ SLA</div>
            <div className="mt-2 text-xs">Tăng 8% so với tháng trước</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-center text-gray-500">
          Đánh giá được cập nhật vào 30/03/2025 - 10:45
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-medium mb-3">Cấu hình SLA</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 block mb-1">
              P1 - Gấp (dưới x giờ)
            </label>
            <input
              type="number"
              min="0.5"
              max="5"
              step="0.5"
              value={slaConfig.p1Hours}
              onChange={(e) =>
                setSlaConfig({
                  ...slaConfig,
                  p1Hours: parseFloat(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <div className="mt-1 text-xs text-gray-500">
              P1: Cần xử lý ngay lập tức
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">
              P2 - Cảnh báo (dưới x giờ)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              step="0.5"
              value={slaConfig.p2Hours}
              onChange={(e) =>
                setSlaConfig({
                  ...slaConfig,
                  p2Hours: parseFloat(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <div className="mt-1 text-xs text-gray-500">
              P2: Không thể trì hoãn quá lâu
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">
              P3 - Bình thường (dưới x giờ)
            </label>
            <input
              type="number"
              min="2"
              max="20"
              step="0.5"
              value={slaConfig.p3Hours}
              onChange={(e) =>
                setSlaConfig({
                  ...slaConfig,
                  p3Hours: parseFloat(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <div className="mt-1 text-xs text-gray-500">
              P3: Xử lý theo lộ trình hợp lý
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">
              Thời gian SLA mặc định (giờ)
            </label>
            <input
              type="number"
              min="6"
              max="72"
              value={slaConfig.defaultSLA}
              onChange={(e) =>
                setSlaConfig({
                  ...slaConfig,
                  defaultSLA: parseInt(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <div className="mt-1 text-xs text-gray-500">
              Thời gian mặc định để hoàn thành đơn hàng
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-medium mb-3">Cấu hình phân bổ đơn hàng</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 block mb-1">
              Tự động phân bổ mỗi (phút)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={allocationConfig.autoAssignInterval}
              onChange={(e) =>
                setAllocationConfig({
                  ...allocationConfig,
                  autoAssignInterval: parseInt(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <div className="mt-1 text-xs text-gray-500">
              Hệ thống sẽ tự động phân bổ đơn hàng theo chu kỳ
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">
              Tối đa đơn P1 mỗi nhân viên
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={allocationConfig.p1MaxPerStaff}
              onChange={(e) =>
                setAllocationConfig({
                  ...allocationConfig,
                  p1MaxPerStaff: parseInt(e.target.value),
                })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <div className="mt-1 text-xs text-gray-500">
              Giới hạn số đơn P1 mà một nhân viên có thể xử lý đồng thời
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={allocationConfig.balanceWorkload}
                onChange={(e) =>
                  setAllocationConfig({
                    ...allocationConfig,
                    balanceWorkload: e.target.checked,
                  })
                }
                className="mr-2 rounded"
              />
              <span className="text-sm text-gray-700">
                Cân bằng khối lượng công việc
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={allocationConfig.prioritizeLocation}
                onChange={(e) =>
                  setAllocationConfig({
                    ...allocationConfig,
                    prioritizeLocation: e.target.checked,
                  })
                }
                className="mr-2 rounded"
              />
              <span className="text-sm text-gray-700">
                Ưu tiên theo khu vực
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={allocationConfig.reassignOnCompletion}
                onChange={(e) =>
                  setAllocationConfig({
                    ...allocationConfig,
                    reassignOnCompletion: e.target.checked,
                  })
                }
                className="mr-2 rounded"
              />
              <span className="text-sm text-gray-700">
                Tự động gán lại khi hoàn thành
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Lịch sử hoạt động</h3>

          <button
            className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded flex items-center"
            onClick={downloadActivityHistory}
            disabled={activityHistory.length === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            <span>Xuất CSV</span>
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
          {activityHistory.map((activity, index) => (
            <div key={index} className="py-2">
              <div className="flex justify-between">
                <span className="font-medium text-sm">
                  {activity.type === "auto_assign" && "Tự động phân bổ"}
                  {activity.type === "manual_assign" && "Phân bổ thủ công"}
                  {activity.type === "complete" && "Hoàn thành đơn"}
                  {activity.type === "upload" && "Tải lên đơn hàng"}
                  {activity.type === "system" && "Hệ thống"}
                  {activity.type === "print_order" && "In đơn hàng"}
                  {activity.type === "print_picking" && "Soạn hàng"}
                  {activity.type === "unassign" && "Hủy phân công"}
                  {activity.type === "sla_escalation" && "Nâng cấp SLA"}
                  {activity.type === "export_history" && "Xuất lịch sử"}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(activity.timestamp).toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="mt-1 text-sm">{activity.details}</div>
              {(activity.orderId || activity.staffId) && (
                <div className="mt-1 text-xs text-gray-500">
                  {activity.orderId && (
                    <span className="mr-3">
                      Đơn: {activity.orderName || activity.orderId}
                    </span>
                  )}
                  {activity.staffId && (
                    <span>
                      Nhân viên: {activity.staffName || activity.staffId}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}

          {activityHistory.length === 0 && (
            <div className="py-4 text-center text-gray-500">
              Chưa có hoạt động nào được ghi lại
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render modal in đơn hàng
  const renderPrintModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h3 className="text-lg font-medium mb-4">
          {printType === "order" ? "In đơn hàng" : "Soạn hàng"}
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Bạn đang {printType === "order" ? "in" : "soạn hàng"} cho{" "}
          {selectedOrders.length} đơn hàng.
        </p>

        <div className="max-h-48 overflow-y-auto mb-4">
          <ul className="space-y-1 text-sm">
            {selectedOrders.map((orderId) => {
              const order = orders.find((o) => o.id === orderId);
              return (
                <li key={orderId} className="flex items-center justify-between">
                  <span>{order?.name || orderId}</span>
                  <span
                    className={`px-1.5 py-0.5 text-xs rounded-full ${order?.sla.color || "bg-gray-100"}`}
                  >
                    {order?.sla.code || "-"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-gray-50 p-3 rounded border mb-4 text-sm">
          <div className="font-medium mb-1">
            URL dùng để {printType === "order" ? "in" : "soạn hàng"}:
          </div>
          <div className="font-mono text-xs overflow-x-auto whitespace-nowrap">
            {printType === "order"
              ? `https://one.tga.com.vn/so/invoicePrint?id=${selectedOrders.join(",")}`
              : `https://one.tga.com.vn/so/prepare?id=${selectedOrders.join(",")}`}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-3 py-1.5 border text-sm rounded"
            onClick={() => setShowPrintModal(false)}
          >
            Hủy
          </button>

          <button
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center"
            onClick={printOrders}
          >
            {printType === "order" ? (
              <>
                <Printer className="h-4 w-4 mr-1" />
                <span>In đơn</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-1" />
                <span>Soạn hàng</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal upload file
  const renderUploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h3 className="text-lg font-medium mb-4">Tải lên dữ liệu đơn hàng</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn file JSON chứa dữ liệu đơn hàng
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {!uploadFile ? (
              <>
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  Kéo thả file vào đây hoặc{" "}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    chọn file
                  </span>
                </p>
                <p className="text-xs text-gray-400">Chỉ chấp nhận file .json</p>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileUpload}
                />
              </>
            ) : (
              <>
                <div className="flex items-center justify-center mb-3">
                  <Clipboard className="h-6 w-6 text-green-500 mr-2" />
                  <span className="text-sm font-medium">{uploadFile.name}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {(uploadFile.size / 1024).toFixed(2)} KB
                </p>
                <button
                  className="mt-2 text-xs text-red-600"
                  onClick={() => setUploadFile(null)}
                >
                  Xóa file
                </button>
              </>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-500">Đang tải lên...</span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            className="px-3 py-1.5 border text-sm rounded"
            onClick={() => setShowUploadModal(false)}
            disabled={isUploading}
          >
            Hủy
          </button>

          <button
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded flex items-center"
            onClick={handleUploadOrders}
            disabled={!uploadFile || isUploading}
          >
            {isUploading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                <span>Đang tải lên...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-1" />
                <span>Tải lên</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal quét mã
  const renderScannerModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <h3 className="text-lg font-medium mb-4">Quét mã sản phẩm</h3>

        {scanningOrder && (
          <>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="flex justify-between">
                <div>
                  <span className="text-sm font-medium">Đơn hàng:</span>
                  <span className="ml-2">{scanningOrder.name}</span>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${scanningOrder.sla.color}`}>
                  {scanningOrder.sla.code}
                </span>
              </div>
              <div className="mt-2 text-sm">
                <div className="font-medium">Chi tiết đơn hàng:</div>
                <div>{scanningOrder.detail}</div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quét mã sản phẩm
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-l px-3 py-2"
                  placeholder="Quét hoặc nhập mã sản phẩm..."
                  ref={scanInputRef}
                  disabled={scanComplete}
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-r"
                  onClick={handleScanBarcode}
                  disabled={scanComplete}
                >
                  <BarcodeScan className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Tiến độ quét:</div>
              <div className="space-y-2">
                {scannedProducts.map((product, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div className="text-sm">{product.name}</div>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">
                        {product.scanned}/{product.quantity}
                      </span>
                      {product.complete ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-200"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-3 py-1.5 border text-sm rounded"
                onClick={() => setShowScannerModal(false)}
              >
                Hủy
              </button>

              {scanComplete ? (
                <button
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded flex items-center"
                  onClick={completeScanningAndPrint}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  <span>Hoàn thành và in đơn</span>
                </button>
              ) : (
                <button
                  className="px-3 py-1.5 bg-gray-300 text-gray-700 text-sm rounded flex items-center cursor-not-allowed"
                  disabled
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Vui lòng quét đủ sản phẩm</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">
            Hệ thống quản lý xử lý đơn hàng theo SLA 1
          </h1>
          <p className="text-sm text-gray-500">
            Ngày {new Date().toLocaleDateString("vi-VN")} | Cập nhật gần nhất:{" "}
            {lastUpdatedRef.current.toLocaleTimeString("vi-VN")}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center mr-2">
            <span className="text-sm mr-2">Tự động cập nhật</span>
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoRefresh}
                onChange={() => setAutoRefresh(!autoRefresh)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-500 rounded-full transition-colors duration-300"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300"></div>
            </div>
          </div>

          <button
            className={`px-3 py-1.5 rounded text-sm flex items-center ${
              isLoading
                ? "bg-gray-200 text-gray-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            onClick={updateRealTimeData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>{isLoading ? "Đang cập nhật..." : "Cập nhật"}</span>
          </button>

          <button
            className="px-3 py-1.5 bg-white border text-sm rounded text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="h-4 w-4 mr-1" />
            <span>Tải lên đơn hàng</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4 overflow-x-auto">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "dashboard"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setTab("dashboard")}
        >
          Tổng quan
        </button>

        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "orders"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setTab("orders")}
        >
          Đơn hàng
        </button>

        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "staff"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setTab("staff")}
        >
          Nhân sự
        </button>

        {currentStaffView && (
          <button
            className={`px-4 py-2 text-sm font-medium ${
              tab === "staff_view"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setTab("staff_view")}
          >
            Nhân viên: {currentStaffView.name}
          </button>
        )}

        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "layout"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setTab("layout")}
        >
          Layout & Lộ trình
        </button>

        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "settings"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setTab("settings")}
        >
          Cài đặt
        </button>
      </div>

      {/* Main content based on active tab */}
      {tab === "dashboard" && renderDashboard()}
      {tab === "orders" && renderOrders()}
      {tab === "staff" && renderStaff()}
      {tab === "staff_view" && renderStaffView()}
      {tab === "layout" && renderLayoutOptimization()}
      {tab === "settings" && renderSettings()}

      {/* Modals */}
      {showPrintModal && renderPrintModal()}
      {showUploadModal && renderUploadModal()}
      {showScannerModal && renderScannerModal()}

      {/* Staff Panel */}
      {showStaffPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-5xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Quản lý nhân sự</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowStaffPanel(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {renderStaff()}
          </div>
        </div>
      )}

      {/* Activity History Panel */}
      {showActivityHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Lịch sử hoạt động</h3>
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded flex items-center"
                  onClick={downloadActivityHistory}
                  disabled={activityHistory.length === 0}
                >
                  <Download className="h-4 w-4 mr-1" />
                  <span>Xuất CSV</span>
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowActivityHistory(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {activityHistory.map((activity, index) => (
                <div key={index} className="py-3">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {activity.type === "auto_assign" && "Tự động phân bổ"}
                      {activity.type === "manual_assign" && "Phân bổ thủ công"}
                      {activity.type === "complete" && "Hoàn thành đơn"}
                      {activity.type === "upload" && "Tải lên đơn hàng"}
                      {activity.type === "system" && "Hệ thống"}
                      {activity.type === "print_order" && "In đơn hàng"}
                      {activity.type === "print_picking" && "Soạn hàng"}
                      {activity.type === "unassign" && "Hủy phân công"}
                      {activity.type === "sla_escalation" && "Nâng cấp SLA"}
                      {activity.type === "scan_start" && "Bắt đầu quét mã"}
                      {activity.type === "scan_complete" && "Hoàn thành quét mã"}
                      {activity.type === "scan_error" && "Lỗi quét mã"}
                      {activity.type === "print_after_scan" && "In sau quét mã"}
                      {activity.type === "error" && "Lỗi hệ thống"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="mt-1">{activity.details}</div>
                  {(activity.orderId || activity.staffId) && (
                    <div className="mt-1 text-sm text-gray-500">
                      {activity.orderId && (
                        <span className="mr-3">
                          Đơn: {activity.orderName || activity.orderId}
                        </span>
                      )}
                      {activity.staffId && (
                        <span>
                          Nhân viên: {activity.staffName || activity.staffId}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {activityHistory.length === 0 && (
                <div className="py-4 text-center text-gray-500">
                  Chưa có hoạt động nào được ghi lại
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSLAManagementSystem;
