import { getRandom, clamp } from "../src/utils/timeUtils";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";
import { mockStats } from "../src/data/mockStats";
import { mockPriorityOrders } from "../src/data/mockPriorityOrders";
import {
  autoAllocateOrders,
  assignOrderToStaff,
  updateStaffPerformance,
} from "../src/utils/orderUtils";

const WarehouseRealTimeDashboard = () => {
  // State cho dữ liệu real-time
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [intervalId, setIntervalId] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showAllocationPanel, setShowAllocationPanel] = useState(false);
  const [autoAllocationEnabled, setAutoAllocationEnabled] = useState(true);
  const [showAllocationRules, setShowAllocationRules] = useState(false);
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState("all");
  const [selectedAreaFilter, setSelectedAreaFilter] = useState("all");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState("order"); // "order" or "picking"
  const [selectedOrdersToPrint, setSelectedOrdersToPrint] = useState([]);
  const [orderViewMode, setOrderViewMode] = useState("table"); // "table" or "cards"
  const printFrameRef = useRef(null);

  // Dữ liệu mẫu
  const [stats, setStats] = useState(mockStats);

  // Danh sách đơn hàng chờ xử lý ưu tiên
  const [priorityOrders, setPriorityOrders] = useState(mockPriorityOrders);

  // Mô phỏng các đơn P1 đang xử lý
  const [p1Processing, setP1Processing] = useState([
    {
      id: "SO09032025:0845541",
      location: "HN-20-14-PD01",
      timeLeft: "00:42:18",
      staff: "Trần Thị B",
      detail: "Valinice Yari ID2041_20 S Orange, Mia Luggage Tag",
      progress: 60,
    },
    {
      id: "SO09032025:0845543",
      location: "290-A-05-A3",
      timeLeft: "01:05:32",
      staff: "Nguyễn Văn A",
      detail: "The Travel Star Clearguard Cover_20 S Black",
      progress: 45,
    },
    {
      id: "SO09032025:0845547",
      location: "300-D-04-A8",
      timeLeft: "00:28:15",
      staff: "Lê Văn C",
      detail: "Balore Rio BR0224_23 M Blue",
      progress: 75,
    },
  ]);

  // Mô phỏng hiệu suất khu vực
  const [zonePerformance, setZonePerformance] = useState([
    {
      zone: "A",
      name: "Khu vực Vali",
      orders: 42,
      p1Count: 5,
      utilization: 85,
      staff: 4,
    },
    {
      zone: "B",
      name: "Khu vực Balo",
      orders: 35,
      p1Count: 3,
      utilization: 72,
      staff: 3,
    },
    {
      zone: "C",
      name: "Khu vực Phụ kiện",
      orders: 28,
      p1Count: 2,
      utilization: 65,
      staff: 2,
    },
    {
      zone: "HN",
      name: "Kho Hà Nội",
      orders: 40,
      p1Count: 2,
      utilization: 88,
      staff: 4,
    },
  ]);

  // Mô phỏng bản đồ nhiệt độ kho vận
  const generateHeatmap = () => {
    const rows = 5;
    const cols = 8;
    const heatmap = [];

    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        // Tạo giá trị nhiệt ngẫu nhiên từ 0-100
        const heatValue = Math.floor(Math.random() * 100);
        let colorClass = "";

        if (heatValue < 20) colorClass = "bg-blue-100";
        else if (heatValue < 40) colorClass = "bg-green-100";
        else if (heatValue < 60) colorClass = "bg-yellow-100";
        else if (heatValue < 80) colorClass = "bg-orange-100";
        else colorClass = "bg-red-100";

        row.push({
          id: `${i}-${j}`,
          value: heatValue,
          colorClass: colorClass,
          zone: String.fromCharCode(65 + Math.floor(j / 2)),
        });
      }
      heatmap.push(row);
    }

    return heatmap;
  };

  const [heatmapData, setHeatmapData] = useState(generateHeatmap());

  // Mô phỏng hiệu suất nhân viên
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

  // Mô phỏng cập nhật dữ liệu real-time mỗi 5 giây
  const refreshData = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // 1. Cập nhật số liệu tổng quan
      setStats((prev) => ({
        ...prev,
        pendingOrders: Math.max(0, prev.pendingOrders + getRandom(-2, 2)),
        processingOrders: Math.max(0, prev.processingOrders + getRandom(-1, 2)),
        completedOrders: Math.min(200, prev.completedOrders + getRandom(0, 2)), // Giới hạn để test
        p1Orders: Math.max(0, prev.p1Orders + getRandom(-1, 2)),
        staffUtilization: clamp(
          prev.staffUtilization + getRandom(-2, 3),
          60,
          100
        ),
      }));

      // 2. Cập nhật đơn hàng P1
      setP1Processing((prev) =>
        prev.map((order) => ({
          ...order,
          timeLeft: updateTimeLeft(order.timeLeft),
          progress: Math.min(100, order.progress + getRandom(0, 10)),
        }))
      );

      // 3. Cập nhật hiệu suất theo khu vực
      setZonePerformance((prev) =>
        prev.map((zone) => ({
          ...zone,
          orders: Math.max(0, zone.orders + getRandom(-1, 2)),
          utilization: clamp(zone.utilization + getRandom(-2, 3), 60, 100),
        }))
      );

      // 4. Cập nhật hiệu suất nhân viên
      setStaffPerformance((prev) =>
        prev.map((staff) => ({
          ...staff,
          efficiency: clamp(staff.efficiency + getRandom(-1, 2), 80, 100),
          orders: staff.orders + (Math.random() > 0.7 ? 1 : 0),
          currentLoad: Math.min(
            staff.maxCapacity,
            Math.max(0, staff.currentLoad + getRandom(-1, 2))
          ),
        }))
      );

      // 5. Cập nhật đơn hàng ưu tiên
      setPriorityOrders((prev) =>
        prev.map((order) => ({
          ...order,
          timeLeft: updateTimeLeft(order.timeLeft),
          priority: clamp(
            order.priority + (Math.random() > 0.7 ? getRandom(-1, 2) : 0),
            1,
            99
          ),
        }))
      );

      // 6. Cập nhật bản đồ nhiệt ngẫu nhiên
      if (Math.random() > 0.8) {
        setHeatmapData(generateHeatmap());
      }

      // Kết thúc cập nhật
      setRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  }, []);

  // Hàm in đơn hàng hoặc phiếu soạn hàng
  const printOrders = () => {
    if (selectedOrdersToPrint.length === 0) return;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Vui lòng cho phép popup để in đơn hàng!");
      return;
    }

    // HTML cho trang in
    let printContent = `
      <html>
        <head>
          <title>${printType === "order" ? "Đơn Hàng" : "Phiếu Soạn Hàng"}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
            .page { page-break-after: always; margin: 15mm; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .logo { font-weight: bold; font-size: 24px; }
            .order-info { border: 1px solid #ddd; padding: 10px; margin-bottom: 20px; }
            .barcode { text-align: center; margin: 15px 0; }
            .footer { text-align: center; font-size: 12px; margin-top: 30px; color: #666; }
            .priority-p1 { background-color: #FEE2E2; }
            .priority-p2 { background-color: #FEF3C7; }
            .priority-p3 { background-color: #D1FAE5; }
            .priority-p4 { background-color: #DBEAFE; }
            .product-item { margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px dashed #eee; }
            .picking-instructions { background-color: #f8f8f8; padding: 10px; border-left: 3px solid #3b82f6; margin: 10px 0; }
            @media print {
              @page { size: A4; margin: 10mm; }
            }
          </style>
        </head>
        <body>
    `;

    // Lấy chi tiết các đơn hàng đã chọn
    const selectedOrders = priorityOrders.filter((order) =>
      selectedOrdersToPrint.includes(order.id)
    );

    // Tạo HTML cho từng đơn hàng
    selectedOrders.forEach((order) => {
      if (printType === "order") {
        // Template cho đơn hàng
        printContent += `
          <div class="page">
            <div class="header">
              <div class="logo">MIA.vn</div>
              <div>
                <strong>ĐƠN HÀNG</strong><br>
                Ngày: ${new Date().toLocaleDateString("vi-VN")}<br>
                Mã đơn: ${order.id}
              </div>
            </div>

            <div class="order-info priority-${order.sla.toLowerCase()}">
              <div><strong>SLA:</strong> ${order.sla} - ${order.timeLeft} còn lại</div>
              <div><strong>Vị trí kho:</strong> ${order.location}</div>
              <div><strong>Loại sản phẩm:</strong> ${order.productType}</div>
              <div><strong>Độ phức tạp:</strong> ${order.complexity}</div>
            </div>

            <h3>Chi tiết sản phẩm</h3>
            <div>${formatProductDetails(order.detail)}</div>

            <div class="barcode">
              [Mã vạch: ${order.id}]
            </div>

            <table>
              <tr>
                <th>Nhân viên soạn hàng</th>
                <th>Thời gian bắt đầu</th>
                <th>Thời gian hoàn thành</th>
              </tr>
              <tr>
                <td>${order.assignedTo ? staffPerformance.find((s) => s.id === order.assignedTo)?.name || `NV${order.assignedTo}` : "___________________"}</td>
                <td>___________________</td>
                <td>___________________</td>
              </tr>
            </table>

            <div class="footer">
              MIA.vn - Hệ thống quản lý kho vận thông minh<br>
              In lúc: ${new Date().toLocaleString("vi-VN")}
            </div>
          </div>
        `;
      } else {
        // Template cho phiếu soạn hàng
        printContent += `
          <div class="page">
            <div class="header">
              <div class="logo">MIA.vn</div>
              <div>
                <strong>PHIẾU SOẠN HÀNG</strong><br>
                Ngày: ${new Date().toLocaleDateString("vi-VN")}<br>
                Mã phiếu: SP-${order.id}
              </div>
            </div>

            <div class="order-info priority-${order.sla.toLowerCase()}">
              <table>
                <tr>
                  <td><strong>Mã đơn:</strong></td>
                  <td>${order.id}</td>
                  <td><strong>SLA:</strong></td>
                  <td>${order.sla} - ${order.timeLeft} còn lại</td>
                </tr>
                <tr>
                  <td><strong>Vị trí kho:</strong></td>
                  <td>${order.location}</td>
                  <td><strong>Nhân viên:</strong></td>
                  <td>${order.assignedTo ? staffPerformance.find((s) => s.id === order.assignedTo)?.name || `NV${order.assignedTo}` : "Chưa phân công"}</td>
                </tr>
              </table>
            </div>

            <h3>Danh sách sản phẩm cần soạn</h3>
            <table>
              <tr>
                <th style="width: 10%;">STT</th>
                <th style="width: 50%;">Sản phẩm</th>
                <th style="width: 20%;">Vị trí</th>
                <th style="width: 20%;">Đã soạn</th>
              </tr>
              ${generatePickingListItems(order.detail, order.location)}
            </table>

            <div class="picking-instructions">
              <strong>Hướng dẫn soạn hàng:</strong>
              <ul>
                <li>Kiểm tra chính xác mã sản phẩm và số lượng</li>
                <li>Ưu tiên đơn SLA ${order.sla} - xử lý trong ${getSLATimeLimit(order.sla)}</li>
                <li>Ghi chú đặc biệt khi có sản phẩm không tìm thấy hoặc hư hỏng</li>
              </ul>
            </div>

            <div class="barcode">
              [Mã vạch: SP-${order.id}]
            </div>

            <div class="footer">
              MIA.vn - Hệ thống quản lý kho vận thông minh<br>
              In lúc: ${new Date().toLocaleString("vi-VN")}
            </div>
          </div>
        `;
      }
    });

    printContent += `
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Đợi tải hoàn tất rồi mới in
    printWindow.onload = function () {
      printWindow.print();
      // Đôi khi các trình duyệt đóng cửa sổ sau khi in, nếu không thì người dùng có thể đóng
      // printWindow.close();
    };
  };

  // Định dạng chi tiết sản phẩm
  const formatProductDetails = (detail) => {
    const items = detail.split(",");
    return items
      .map(
        (item, index) =>
          `<div class="product-item">${index + 1}. ${item.trim()}</div>`
      )
      .join("");
  };

  // Tạo các mục cho phiếu soạn hàng
  const generatePickingListItems = (detail, location) => {
    const items = detail.split(",");
    return items
      .map((item, index) => {
        // Tách số lượng từ chi tiết sản phẩm (thường có dạng "sản phẩm(số lượng)")
        let quantity = "1";
        const quantityMatch = item.match(/\((\d+)\)$/);
        if (quantityMatch) {
          quantity = quantityMatch[1];
        }

        return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.trim()}</td>
          <td>${determineExactLocation(location, index)}</td>
          <td>□</td>
        </tr>
      `;
      })
      .join("");
  };

  // Xác định vị trí chính xác cho sản phẩm
  const determineExactLocation = (baseLocation, itemIndex) => {
    // Mô phỏng logic xác định vị trí chính xác
    // Trong thực tế, sẽ có logic phức tạp hơn dựa trên dữ liệu thực tế
    const parts = baseLocation.split("-");
    if (parts.length >= 3) {
      // Tăng chữ số cuối cùng cho mỗi mục
      const lastPart = parts[parts.length - 1];
      if (lastPart.match(/^[A-Z]\d+$/)) {
        // Nếu cuối cùng có dạng A1, B2, etc.
        const letter = lastPart.charAt(0);
        const number = parseInt(lastPart.substring(1)) + itemIndex;
        parts[parts.length - 1] = `${letter}${number}`;
      } else if (lastPart.match(/^\d+$/)) {
        // Nếu cuối cùng chỉ là số
        parts[parts.length - 1] = `${parseInt(lastPart) + itemIndex}`;
      }
      return parts.join("-");
    }
    return baseLocation;
  };

  // Lấy giới hạn thời gian SLA
  const getSLATimeLimit = (sla) => {
    switch (sla) {
      case "P1":
        return "2 giờ";
      case "P2":
        return "4 giờ";
      case "P3":
        return "8 giờ";
      case "P4":
        return "24 giờ";
      default:
        return "thời gian quy định";
    }
  };

  // Chuyển đổi trạng thái chọn cho đơn hàng
  const toggleOrderSelection = (orderId) => {
    if (selectedOrdersToPrint.includes(orderId)) {
      setSelectedOrdersToPrint(
        selectedOrdersToPrint.filter((id) => id !== orderId)
      );
    } else {
      setSelectedOrdersToPrint([...selectedOrdersToPrint, orderId]);
    }
  };

  // Chọn tất cả đơn hàng đã lọc
  const selectAllFilteredOrders = () => {
    setSelectedOrdersToPrint(filteredPriorityOrders.map((order) => order.id));
  };

  // Bỏ chọn tất cả đơn hàng
  const deselectAllOrders = () => {
    setSelectedOrdersToPrint([]);
  };

  // Hàm giảm thời gian còn lại
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

  const handleAutoAllocate = useCallback(() => {
    const updatedOrders = autoAllocateOrders(priorityOrders);
    setPriorityOrders(updatedOrders);

    const updatedStaff = updateStaffPerformance(
      staffPerformance,
      updatedOrders
    );
    setStaffPerformance(updatedStaff);
  }, [priorityOrders, staffPerformance]);

  useEffect(() => {
    if (autoRefresh) {
      console.log("⏱️ Tự động cập nhật đang BẬT");
      const id = setInterval(refreshData, 5000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else {
      console.log("⛔ Tự động cập nhật đã TẮT");
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [autoRefresh, refreshData]);

  // useEffect 2: Tự động phân bổ nếu bật autoAllocationEnabled
  useEffect(() => {
    if (!autoAllocationEnabled) return;

    const timer = setTimeout(() => {
      handleAutoAllocate();
    }, 2000);

    return () => clearTimeout(timer);
  }, [lastUpdated, autoAllocationEnabled, handleAutoAllocate]);

  // useEffect 3: Load lần đầu
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Lọc danh sách đơn hàng theo bộ lọc đã chọn
  const filteredPriorityOrders = priorityOrders
    .filter((order) => {
      // Lọc theo mức ưu tiên
      if (
        selectedPriorityFilter !== "all" &&
        order.sla !== selectedPriorityFilter
      ) {
        return false;
      }

      // Lọc theo khu vực
      if (selectedAreaFilter !== "all") {
        const orderArea = order.location.split("-")[0];
        if (orderArea !== selectedAreaFilter) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => b.priority - a.priority); // Sắp xếp theo độ ưu tiên

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      {/* Header với thông tin cập nhật */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold">
          Dashboard Kho Vận Thời Gian Thực
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Cập nhật lần cuối: {lastUpdated.toLocaleTimeString()}
          </div>
          <button
            className={`flex items-center px-3 py-1.5 rounded text-sm ${refreshing ? "bg-gray-200 text-gray-600" : "bg-blue-100 text-blue-700"}`}
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>{refreshing ? "Đang cập nhật..." : "Cập nhật"}</span>
          </button>
          <label className="flex items-center cursor-pointer">
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
          </label>

          <button
            className={`flex items-center px-3 py-1.5 rounded text-sm ${showAllocationPanel ? "bg-green-600 text-white" : "bg-green-100 text-green-700"}`}
            onClick={() => setShowAllocationPanel(!showAllocationPanel)}
          >
            <Zap className="h-4 w-4 mr-1" />
            <span>{showAllocationPanel ? "Ẩn phân bổ" : "Phân bổ đơn"}</span>
          </button>
          <button
            className="flex items-center px-3 py-1.5 rounded text-sm bg-purple-100 text-purple-700"
            onClick={() => setShowPrintModal(true)}
            disabled={selectedOrdersToPrint.length === 0}
          >
            <Printer className="h-4 w-4 mr-1" />
            <span>In đơn</span>
            {selectedOrdersToPrint.length > 0 && (
              <span className="ml-1 bg-purple-200 text-purple-800 rounded-full px-1.5 text-xs">
                {selectedOrdersToPrint.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500 mb-1">Tổng đơn hàng</div>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </div>
            <Package className="h-6 w-6 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stats.pendingOrders} chờ xử lý | {stats.processingOrders} đang xử
            lý | {stats.completedOrders} hoàn thành
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500 mb-1">Đơn P1 (gấp)</div>
              <div className="text-2xl font-bold text-red-600">
                {stats.p1Orders}
              </div>
            </div>
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {p1Processing.length} đang xử lý |{" "}
            {stats.p1Orders - p1Processing.length} chờ xử lý
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500 mb-1">Thời gian lấy TB</div>
              <div className="text-2xl font-bold">
                {stats.avgPickingTime} phút
              </div>
            </div>
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stats.slaCompliance}% đạt SLA
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500 mb-1">Tải nhân sự</div>
              <div className="text-2xl font-bold">
                {stats.staffUtilization}%
              </div>
            </div>
            <User className="h-6 w-6 text-green-500" />
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${
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

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500 mb-1">Hiệu suất kho</div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  (stats.completedOrders /
                    (stats.pendingOrders +
                      stats.processingOrders +
                      stats.completedOrders)) *
                    100
                )}
                %
              </div>
            </div>
            <Activity className="h-6 w-6 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            P2: {stats.p2Orders} đơn đang xử lý
          </div>
        </div>
      </div>

      {/* Theo dõi đơn P1 đang xử lý */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Đơn P1 đang xử lý</h3>
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
              Gấp 🚀
            </span>
          </div>

          <div className="space-y-3">
            {p1Processing.map((order, index) => (
              <div
                key={index}
                className="p-3 bg-red-50 border border-red-100 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium flex items-center">
                      <span>{order.id}</span>
                      <span className="ml-2 px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                        {order.location}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1 truncate max-w-md">
                      {order.detail}
                    </div>
                  </div>
                  <div className="text-sm text-red-600 font-medium">
                    {order.timeLeft}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Nhân viên: {order.staff}</span>
                    <span>{order.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${order.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bản đồ nhiệt kho */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Bản đồ nhiệt kho vận</h3>
            <div className="flex space-x-1 text-xs">
              <span className="bg-blue-100 px-2 py-0.5 rounded">Thấp</span>
              <span className="bg-green-100 px-2 py-0.5 rounded"></span>
              <span className="bg-yellow-100 px-2 py-0.5 rounded"></span>
              <span className="bg-orange-100 px-2 py-0.5 rounded"></span>
              <span className="bg-red-100 px-2 py-0.5 rounded">Cao</span>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1">
            {heatmapData.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${cell.colorClass} rounded-sm h-10 flex items-center justify-center relative ${
                    colIndex % 2 === 0 ? "border-l-2 border-gray-400" : ""
                  }`}
                  title={`Khu ${cell.zone}: ${cell.value}% hoạt động`}
                >
                  <span className="text-xs font-medium">{cell.zone}</span>
                  {cell.value > 80 && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="text-xs text-center mt-2 text-gray-500">
            * Màu đậm = hoạt động cao | Các điểm đỏ = cần bổ sung nhân viên
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {zonePerformance.map((zone, index) => (
              <div key={index} className="p-2 border rounded-lg">
                <div className="font-medium text-sm">Khu {zone.zone}</div>
                <div className="text-xs text-gray-500">{zone.orders} đơn</div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div
                    className={`h-1 rounded-full ${
                      zone.utilization > 90
                        ? "bg-red-500"
                        : zone.utilization > 75
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${zone.utilization}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bảng phân bổ đơn hàng */}
      {showAllocationPanel && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium flex items-center">
                <List className="h-5 w-5 mr-1 text-blue-500" />
                Danh sách đơn hàng ưu tiên
              </h3>

              <div className="flex space-x-2">
                <div className="relative">
                  <select
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1 px-3 pr-8 rounded text-xs"
                    value={selectedPriorityFilter}
                    onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                  >
                    <option value="all">Tất cả SLA</option>
                    <option value="P1">P1 - Gấp</option>
                    <option value="P2">P2 - Cảnh báo</option>
                    <option value="P3">P3 - Bình thường</option>
                    <option value="P4">P4 - Chờ xử lý</option>
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                </div>

                <div className="relative">
                  <select
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1 px-3 pr-8 rounded text-xs"
                    value={selectedAreaFilter}
                    onChange={(e) => setSelectedAreaFilter(e.target.value)}
                  >
                    <option value="all">Tất cả khu vực</option>
                    <option value="HN">Hà Nội</option>
                    <option value="290">Kho phụ kiện</option>
                    <option value="300">Kho miền Bắc</option>
                    <option value="500">Kho miền Nam</option>
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                </div>

                <div className="flex space-x-1">
                  <button
                    className="bg-blue-100 text-blue-700 text-xs rounded px-2 py-1 flex items-center"
                    onClick={autoAllocateOrders}
                  >
                    <ArrowRight className="h-3 w-3 mr-1" />
                    <span>Phân bổ tự động</span>
                  </button>

                  <button
                    className={`text-xs rounded px-2 py-1 flex items-center ${
                      orderViewMode === "table"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setOrderViewMode("table")}
                  >
                    <List className="h-3 w-3 mr-1" />
                  </button>

                  <button
                    className={`text-xs rounded px-2 py-1 flex items-center ${
                      orderViewMode === "cards"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => setOrderViewMode("cards")}
                  >
                    <div className="h-3 w-3 grid grid-cols-2 gap-0.5 mr-1">
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center mb-2 text-xs">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-1"
                  checked={
                    filteredPriorityOrders.length > 0 &&
                    selectedOrdersToPrint.length ===
                      filteredPriorityOrders.length
                  }
                  onChange={() => {
                    if (
                      selectedOrdersToPrint.length ===
                      filteredPriorityOrders.length
                    ) {
                      deselectAllOrders();
                    } else {
                      selectAllFilteredOrders();
                    }
                  }}
                />
                <span className="text-gray-700">Chọn tất cả</span>
              </div>

              <div className="ml-4 text-gray-500">
                Đã chọn{" "}
                <span className="font-medium text-blue-600">
                  {selectedOrdersToPrint.length}
                </span>{" "}
                / {filteredPriorityOrders.length} đơn
              </div>

              {selectedOrdersToPrint.length > 0 && (
                <div className="ml-4 flex space-x-2">
                  <button
                    className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded flex items-center"
                    onClick={() => {
                      setPrintType("order");
                      setShowPrintModal(true);
                    }}
                  >
                    <Printer className="h-3 w-3 mr-1" />
                    <span>In đơn hàng</span>
                  </button>

                  <button
                    className="bg-green-50 text-green-700 px-2 py-0.5 rounded flex items-center"
                    onClick={() => {
                      setPrintType("picking");
                      setShowPrintModal(true);
                    }}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    <span>In phiếu soạn hàng</span>
                  </button>
                </div>
              )}
            </div>

            {orderViewMode === "table" ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-6">
                        <span className="sr-only">Chọn</span>
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đơn
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SLA
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khu vực
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại SP
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời gian
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mức ưu tiên
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phân công
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPriorityOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={order.sla === "P1" ? "bg-red-50" : ""}
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedOrdersToPrint.includes(order.id)}
                            onChange={() => toggleOrderSelection(order.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.id}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">
                            {order.detail}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
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
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {order.location}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              order.productType === "vali"
                                ? "bg-blue-100 text-blue-800"
                                : order.productType === "balo"
                                  ? "bg-green-100 text-green-800"
                                  : order.productType === "phụ kiện"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.productType}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`text-xs font-medium ${
                              order.sla === "P1"
                                ? "text-red-600"
                                : order.sla === "P2"
                                  ? "text-yellow-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {order.timeLeft}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                order.priority > 90
                                  ? "bg-red-500"
                                  : order.priority > 80
                                    ? "bg-yellow-500"
                                    : order.priority > 70
                                      ? "bg-green-500"
                                      : "bg-blue-500"
                              }`}
                              style={{ width: `${order.priority}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {order.priority}%
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {order.assignedTo ? (
                            <div className="flex items-center text-xs text-green-600">
                              <Check className="h-3 w-3 mr-1" />
                              <span>
                                {staffPerformance.find(
                                  (s) => s.id === order.assignedTo
                                )?.name || `NV${order.assignedTo}`}
                              </span>
                            </div>
                          ) : (
                            <div className="flex space-x-1">
                              <select
                                className="text-xs border border-gray-200 rounded py-0.5 px-1"
                                onChange={(e) =>
                                  assignOrderToStaff(
                                    order.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                defaultValue=""
                              >
                                <option value="" disabled>
                                  Chọn NV
                                </option>
                                {staffPerformance.map((staff) => (
                                  <option key={staff.id} value={staff.id}>
                                    {staff.name} ({staff.currentLoad}/
                                    {staff.maxCapacity})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPriorityOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`border rounded-lg p-3 ${
                      order.sla === "P1"
                        ? "bg-red-50 border-red-100"
                        : order.sla === "P2"
                          ? "bg-yellow-50 border-yellow-100"
                          : order.sla === "P3"
                            ? "bg-green-50 border-green-100"
                            : "bg-blue-50 border-blue-100"
                    } relative`}
                  >
                    <div className="absolute top-3 right-3">
                      <input
                        type="checkbox"
                        checked={selectedOrdersToPrint.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="rounded"
                      />
                    </div>

                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-sm">{order.id}</div>
                        <div className="flex items-center space-x-1 mt-1">
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

                          <span
                            className={`text-xs font-medium ${
                              order.sla === "P1"
                                ? "text-red-600"
                                : order.sla === "P2"
                                  ? "text-yellow-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {order.timeLeft}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 mb-2 truncate">
                      {order.detail}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                      <div>
                        <span className="text-gray-500">Vị trí:</span>
                        <span className="ml-1">{order.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Loại:</span>
                        <span className="ml-1">{order.productType}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Mức ưu tiên</span>
                        <span>{order.priority}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            order.priority > 90
                              ? "bg-red-500"
                              : order.priority > 80
                                ? "bg-yellow-500"
                                : order.priority > 70
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                          }`}
                          style={{ width: `${order.priority}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {order.assignedTo ? (
                        <div className="flex items-center text-xs text-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          <span>
                            {staffPerformance.find(
                              (s) => s.id === order.assignedTo
                            )?.name || `NV${order.assignedTo}`}
                          </span>
                        </div>
                      ) : (
                        <select
                          className="text-xs border border-gray-200 rounded py-0.5 px-1 w-full"
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
                          {staffPerformance.map((staff) => (
                            <option key={staff.id} value={staff.id}>
                              {staff.name} ({staff.currentLoad}/
                              {staff.maxCapacity})
                            </option>
                          ))}
                        </select>
                      )}

                      <div className="flex space-x-1 ml-2">
                        <button
                          className="bg-blue-100 text-blue-700 p-1 rounded"
                          onClick={() => {
                            setSelectedOrdersToPrint([order.id]);
                            setPrintType("order");
                            setShowPrintModal(true);
                          }}
                        >
                          <Printer className="h-3 w-3" />
                        </button>

                        <button
                          className="bg-green-100 text-green-700 p-1 rounded"
                          onClick={() => {
                            setSelectedOrdersToPrint([order.id]);
                            setPrintType("picking");
                            setShowPrintModal(true);
                          }}
                        >
                          <FileText className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <div>
                Hiển thị {filteredPriorityOrders.length} đơn hàng ưu tiên
              </div>
              <div>
                <span className="text-green-600 font-medium">
                  {priorityOrders.filter((o) => o.assignedTo).length}
                </span>{" "}
                / {priorityOrders.length} đơn đã được phân công
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium flex items-center">
                <Settings className="h-5 w-5 mr-1 text-blue-500" />
                Tùy chỉnh phân bổ
              </h3>
              <button
                className="text-xs text-blue-600"
                onClick={() => setShowAllocationRules(!showAllocationRules)}
              >
                {showAllocationRules ? "Ẩn quy tắc" : "Xem quy tắc"}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-700">Tự động phân bổ</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      checked={autoAllocationEnabled}
                      onChange={() =>
                        setAutoAllocationEnabled(!autoAllocationEnabled)
                      }
                    />
                    <label
                      className={`toggle-label block overflow-hidden h-6 w-10 rounded-full cursor-pointer ${autoAllocationEnabled ? "bg-green-500" : "bg-gray-300"}`}
                    ></label>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Tự động phân bổ đơn hàng theo các tiêu chí
                </p>

                <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded text-xs">
                  <div className="font-medium text-green-800">
                    Tỷ lệ phân bổ thành công: {stats.autoAllocationSuccess}%
                  </div>
                </div>
              </div>

              {showAllocationRules && (
                <div className="space-y-2 text-sm">
                  <div className="font-medium">Quy tắc phân bổ:</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-start">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                      <div>
                        P1 xử lý ưu tiên 100%, phân cho nhân viên có khả năng xử
                        lý P1
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                      <div>
                        Ưu tiên phân bổ theo vị trí kho gần nhất với nhân viên
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                      <div>
                        Ưu tiên nhân viên có kỹ năng phù hợp với loại sản phẩm
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                      <div>Cân bằng tải cho nhân viên, không quá tải đơn</div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-3 w-3 text-green-500 mt-0.5 mr-1 flex-shrink-0" />
                      <div>Phân bổ đơn đơn giản cho nhân viên mới</div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-700 block mb-1">
                  Tiêu chí phân bổ
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">SLA</span>
                    <div className="w-32 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-red-500 h-1.5 rounded-full"
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Vị trí</span>
                    <div className="w-32 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Kỹ năng</span>
                    <div className="w-32 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-green-500 h-1.5 rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Tải hiện tại</span>
                    <div className="w-32 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-yellow-500 h-1.5 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-700 mb-1">
                  Nhân viên sẵn sàng
                </div>
                <div className="space-y-2">
                  {staffPerformance.map((staff) => (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full ${staff.status === "busy" ? "bg-yellow-500" : "bg-green-500"} mr-1`}
                        ></div>
                        <span>{staff.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-1">
                          {staff.currentLoad}/{staff.maxCapacity}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              staff.currentLoad / staff.maxCapacity > 0.8
                                ? "bg-red-500"
                                : staff.currentLoad / staff.maxCapacity > 0.6
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{
                              width: `${(staff.currentLoad / staff.maxCapacity) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hiệu suất nhân viên & Đồ thị SLA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Hiệu suất nhân viên</h3>
            <span className="text-sm text-blue-600">
              {staffPerformance.length} nhân viên
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hiệu suất
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khu vực
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kỹ năng
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffPerformance.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {staff.name}
                        </div>
                        <div className="text-xs text-gray-500 ml-1">
                          ({staff.role})
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {staff.p1Count} P1 / {staff.orders} đơn
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          staff.status === "busy"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {staff.status === "busy" ? "Đang bận" : "Sẵn sàng"}
                      </span>
                      <div className="mt-1 text-xs text-gray-500">
                        {staff.currentLoad}/{staff.maxCapacity} đơn
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium mr-2">
                          {staff.efficiency}%
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              staff.efficiency >= 95
                                ? "bg-green-500"
                                : staff.efficiency >= 90
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${staff.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs">
                      <span className="px-2 py-0.5 bg-gray-100 rounded">
                        Khu {staff.area}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {staff.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Biểu đồ đơn hàng theo SLA</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              Thời gian thực
            </span>
          </div>

          {/* Biểu đồ phân bố đơn hàng */}
          <div className="h-64 relative">
            <div className="flex items-end h-52 w-full space-x-4 justify-around">
              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-red-400 rounded-t"
                  style={{
                    height: `${Math.round((stats.p1Orders / stats.totalOrders) * 100) * 2}px`,
                  }}
                ></div>
                <div className="text-sm mt-2">P1</div>
                <div className="text-xs text-gray-500">
                  {stats.p1Orders} đơn
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-yellow-400 rounded-t"
                  style={{
                    height: `${Math.round((stats.p2Orders / stats.totalOrders) * 100) * 2}px`,
                  }}
                ></div>
                <div className="text-sm mt-2">P2</div>
                <div className="text-xs text-gray-500">
                  {stats.p2Orders} đơn
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-green-400 rounded-t"
                  style={{
                    height: `${Math.round(((stats.totalOrders - stats.p1Orders - stats.p2Orders) / stats.totalOrders) * 100) * 2}px`,
                  }}
                ></div>
                <div className="text-sm mt-2">P3/P4</div>
                <div className="text-xs text-gray-500">
                  {stats.totalOrders - stats.p1Orders - stats.p2Orders} đơn
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-blue-400 rounded-t"
                  style={{
                    height: `${Math.round((stats.pendingOrders / stats.totalOrders) * 100) * 2}px`,
                  }}
                ></div>
                <div className="text-sm mt-2">Chờ xử lý</div>
                <div className="text-xs text-gray-500">
                  {stats.pendingOrders} đơn
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-purple-400 rounded-t"
                  style={{
                    height: `${Math.round((stats.processingOrders / stats.totalOrders) * 100) * 2}px`,
                  }}
                ></div>
                <div className="text-sm mt-2">Đang xử lý</div>
                <div className="text-xs text-gray-500">
                  {stats.processingOrders} đơn
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className="w-16 bg-green-500 rounded-t"
                  style={{
                    height: `${Math.round((stats.completedOrders / stats.totalOrders) * 100) * 2}px`,
                  }}
                ></div>
                <div className="text-sm mt-2">Hoàn thành</div>
                <div className="text-xs text-gray-500">
                  {stats.completedOrders} đơn
                </div>
              </div>
            </div>

            {/* Grid lines */}
            <div className="absolute left-0 top-0 h-full w-full pointer-events-none">
              <div className="absolute left-0 top-0 w-full h-px bg-gray-200"></div>
              <div className="absolute left-0 top-1/4 w-full h-px bg-gray-200"></div>
              <div className="absolute left-0 top-2/4 w-full h-px bg-gray-200"></div>
              <div className="absolute left-0 top-3/4 w-full h-px bg-gray-200"></div>
              <div className="absolute left-0 bottom-0 w-full h-px bg-gray-200"></div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded mr-1"></div>
              <span className="text-xs">P1 (Gấp)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded mr-1"></div>
              <span className="text-xs">P2 (Cảnh báo)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded mr-1"></div>
              <span className="text-xs">P3/P4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chú thích */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Dashboard cập nhật thời gian thực mỗi 5 giây | Đã tích hợp phân bổ đơn
        hàng tự động
      </div>
    </div>
  );
};

export default WarehouseRealTimeDashboard;
