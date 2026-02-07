import { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Printer,
  Package,
  AlertTriangle,
  Check,
  ChevronDown,
  Clock,
  Search,
  ExternalLink,
  RefreshCw,
  Zap,
  BarChart2,
  Lightbulb,
  User,
  Settings,
  PlusCircle,
  Edit,
  Save,
  X,
  CornerDownRight,
  MapPin,
  UserPlus,
  Users,
  History,
  Star,
  ArrowRight,
  Award,
  Calendar,
  Download,
  FileCheck,
  Trash2,
  Eye,
  Archive,
  CheckCircle,
  BarChart,
} from "lucide-react";

const OrderStaffAllocation = () => {
  // State quản lý đơn hàng
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // State upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
  });
  const [uploadError, setUploadError] = useState(null);

  // State bộ lọc và sắp xếp
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [pickingStrategy, setPickingStrategy] = useState("priority");
  const [sortDirection, setSortDirection] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");

  // State modal và thao tác
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkActions, setLinkActions] = useState({ type: "", ids: [] });
  const [isOptimizing, setIsOptimizing] = useState(false);

  // State hiệu suất và phân tích
  const [recommendedStrategy, setRecommendedStrategy] = useState(null);
  const [performance, setPerformance] = useState({
    totalOrders: 0,
    p1Completed: 0,
    p1Pending: 0,
    p2Pending: 0,
    estimatedTimeLeft: 0,
    efficiency: 0,
  });

  // State cho các khu vực kho
  const [warehouseZones, setWarehouseZones] = useState({});

  // *** STATE NHÂN VIÊN & PHÂN BỔ ***
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Trưởng ca",
      area: "HN",
      skills: ["vali", "balo", "đóng gói"],
      status: "available",
      currentOrder: null,
      assignedOrders: [],
      orderCount: 8,
      handlingP1: true,
      efficiency: 98,
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Nhân viên",
      area: "A",
      skills: ["vali", "phụ kiện"],
      status: "available",
      currentOrder: null,
      assignedOrders: [],
      orderCount: 12,
      handlingP1: true,
      efficiency: 95,
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
      handlingP1: false,
      efficiency: 92,
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
      handlingP1: false,
      efficiency: 97,
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      role: "Nhân viên",
      area: "C",
      skills: ["đóng gói", "vali"],
      status: "available",
      currentOrder: null,
      assignedOrders: [],
      orderCount: 9,
      handlingP1: false,
      efficiency: 90,
    },
  ]);

  // State cho quá trình phân bổ
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState("auto"); // auto, manual
  const [assignmentMetrics, setAssignmentMetrics] = useState({
    p1OrdersAssigned: 0,
    p2OrdersAssigned: 0,
    totalOrdersAssigned: 0,
    staffUtilization: 0,
    estimatedCompletionTime: 0,
  });
  const [staffFilter, setStaffFilter] = useState("all"); // all, available, busy
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editingStaffData, setEditingStaffData] = useState(null);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaffData, setNewStaffData] = useState({
    name: "",
    role: "Nhân viên",
    area: "",
    skills: [],
    handlingP1: false,
    efficiency: 90,
  });

  // State cho cấu hình và tuỳ chỉnh
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [slaConfigOpen, setSlaConfigOpen] = useState(false);
  const [allocationConfig, setAllocationConfig] = useState({
    autoAssignInterval: 5, // phút
    p1MaxPerStaff: 3,
    balanceWorkload: true,
    prioritizeLocation: true,
    reassignOnCompletion: true,
  });
  const [slaConfig, setSlaConfig] = useState({
    p1Hours: 2, // Dưới 2h = P1
    p2Hours: 4, // Dưới 4h = P2
    p3Hours: 8, // Dưới 8h = P3
    defaultSLA: 24, // Thời gian mặc định của SLA (24h)
  });

  // State lịch sử hoạt động
  const [activityHistory, setActivityHistory] = useState([]);
  const [showActivityHistory, setShowActivityHistory] = useState(false);

  const fileInputRef = useRef(null);

  // Cập nhật giả lập real-time
  useEffect(() => {
    if (orders.length > 0) {
      updatePerformanceMetrics();
      analyzeWarehouseZones();
      analyzeOptimalStrategy();

      // Giả lập cập nhật real-time
      const interval = setInterval(() => {
        updateRealTimeData();
      }, 30000); // Mỗi 30 giây

      return () => clearInterval(interval);
    }
  }, [orders]);

  // Auto assign theo interval nếu bật tự động
  useEffect(() => {
    if (
      assignmentMode === "auto" &&
      orders.length > 0 &&
      allocationConfig.autoAssignInterval > 0
    ) {
      const interval = setInterval(
        () => {
          if (!isAutoAssigning) {
            autoAssignOrders();
          }
        },
        allocationConfig.autoAssignInterval * 60 * 1000
      ); // Chuyển đổi phút sang mili giây

      return () => clearInterval(interval);
    }
  }, [
    assignmentMode,
    orders,
    allocationConfig.autoAssignInterval,
    isAutoAssigning,
  ]);

  // Cập nhật dữ liệu real-time
  const updateRealTimeData = () => {
    // Cập nhật SLA dựa trên thời gian
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        // Tính lại SLA dựa trên thời gian hiện tại
        const sla = calculateSLA(order);

        // Cập nhật thời gian còn lại
        let timeLeft = "";
        if (order.timeLeft) {
          const [hours, minutes, seconds] = order.timeLeft
            .split(":")
            .map(Number);
          let totalSeconds = hours * 3600 + minutes * 60 + seconds - 30;
          if (totalSeconds < 0) totalSeconds = 0;

          const newHours = Math.floor(totalSeconds / 3600);
          const newMinutes = Math.floor((totalSeconds % 3600) / 60);
          const newSeconds = totalSeconds % 60;

          timeLeft = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;
        }

        return {
          ...order,
          sla,
          timeLeft: timeLeft || order.timeLeft,
        };
      });
    });

    // Cập nhật metrics
    updatePerformanceMetrics();

    // Cập nhật trạng thái nhân viên
    updateStaffStatus();
  };

  // Cập nhật trạng thái của nhân viên
  const updateStaffStatus = () => {
    // Giả lập tiến trình hoàn thành đơn hàng
    setStaff((prevStaff) => {
      return prevStaff.map((member) => {
        // Nếu nhân viên đang bận và có đơn giao, giả lập tiến độ xử lý đơn
        if (member.status === "busy" && member.assignedOrders.length > 0) {
          // Giả lập 5% cơ hội hoàn thành đơn đầu tiên được giao
          if (Math.random() < 0.05) {
            const completedOrderId = member.assignedOrders[0];

            // Cập nhật trạng thái đơn thành completed
            setOrders((prevOrders) => {
              return prevOrders.map((order) => {
                if (order.id.toString() === completedOrderId.toString()) {
                  return { ...order, status: "completed" };
                }
                return order;
              });
            });

            // Thêm vào lịch sử hoạt động
            const completedOrder = orders.find(
              (o) => o.id.toString() === completedOrderId.toString()
            );
            if (completedOrder) {
              addToActivityHistory({
                type: "order_completed",
                orderId: completedOrderId,
                orderName: completedOrder.name,
                staffId: member.id,
                staffName: member.name,
                timestamp: new Date().toISOString(),
                details: `Hoàn thành đơn hàng ${completedOrder.name || completedOrderId}`,
              });
            }

            // Loại bỏ đơn đã hoàn thành khỏi danh sách
            const newAssignedOrders = [...member.assignedOrders];
            newAssignedOrders.shift();

            // Nếu không còn đơn, đổi trạng thái thành available
            if (newAssignedOrders.length === 0) {
              return {
                ...member,
                status: "available",
                currentOrder: null,
                assignedOrders: [],
              };
            }

            // Nếu còn đơn, đổi currentOrder thành đơn tiếp theo
            return {
              ...member,
              currentOrder: newAssignedOrders[0],
              assignedOrders: newAssignedOrders,
            };
          }
        }

        return member;
      });
    });
  };

  // Phân tích khu vực kho
  const analyzeWarehouseZones = () => {
    const zones = {};

    orders.forEach((order) => {
      if (!order.ecom_recipient_code) return;

      const zone = order.ecom_recipient_code.split("-")[0] || "unknown";

      if (!zones[zone]) {
        zones[zone] = {
          count: 0,
          p1Count: 0,
          p2Count: 0,
          orders: [],
        };
      }

      zones[zone].count++;
      if (order.sla?.code === "P1") zones[zone].p1Count++;
      if (order.sla?.code === "P2") zones[zone].p2Count++;
      zones[zone].orders.push(order.id);
    });

    setWarehouseZones(zones);
  };

  // Cập nhật metrics hiệu suất
  const updatePerformanceMetrics = () => {
    const p1Orders = orders.filter((o) => o.sla?.code === "P1");
    const p2Orders = orders.filter((o) => o.sla?.code === "P2");
    const pendingOrders = orders.filter((o) => o.status !== "completed");

    // Tính thời gian còn lại ước tính cho toàn bộ đơn
    let totalMinutesLeft = 0;
    pendingOrders.forEach((order) => {
      if (order.timeLeft) {
        const [hours, minutes] = order.timeLeft.split(":");
        totalMinutesLeft += parseInt(hours) * 60 + parseInt(minutes);
      }
    });

    // Tính hiệu suất dựa trên số đơn đã xử lý so với tổng số
    const completedOrders = orders.filter((o) => o.status === "completed");
    const efficiency =
      orders.length > 0
        ? Math.round((completedOrders.length / orders.length) * 100)
        : 0;

    setPerformance({
      totalOrders: orders.length,
      p1Completed: p1Orders.filter((o) => o.status === "completed").length,
      p1Pending: p1Orders.filter((o) => o.status !== "completed").length,
      p2Pending: p2Orders.filter((o) => o.status !== "completed").length,
      estimatedTimeLeft: totalMinutesLeft,
      efficiency,
    });
  };

  // Tính SLA cho đơn hàng
  const calculateSLA = (order) => {
    const orderDate = new Date(order.date_order);
    const now = new Date();
    const hoursDiff = (now - orderDate) / (1000 * 60 * 60);

    // Tính thời gian còn lại theo SLA (mặc định 24h)
    const slaHours = slaConfig.defaultSLA - hoursDiff;

    if (slaHours < slaConfig.p1Hours) {
      return {
        code: "P1",
        label: "P1 - Gấp 🚀",
        level: 1,
        color: "bg-red-100 text-red-800 border-red-200",
        description: "Cần xử lý ngay lập tức",
      };
    } else if (slaHours < slaConfig.p2Hours) {
      return {
        code: "P2",
        label: "P2 - Cảnh báo ⚠️",
        level: 2,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        description: "Không thể trì hoãn quá lâu",
      };
    } else if (slaHours < slaConfig.p3Hours) {
      return {
        code: "P3",
        label: "P3 - Bình thường ✅",
        level: 3,
        color: "bg-green-100 text-green-800 border-green-200",
        description: "Xử lý theo lộ trình hợp lý",
      };
    } else {
      return {
        code: "P4",
        label: "P4 - Chờ xử lý 🕒",
        level: 4,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        description: "Có thể lùi lại khi thuận tiện",
      };
    }
  };

  // Phân tích sản phẩm
  const analyzeProduct = (detail) => {
    if (!detail) return { count: 1, type: "unknown" };

    // Đếm số loại sản phẩm dựa trên dấu phẩy
    const items = detail.split(",");

    // Xác định loại sản phẩm chính
    const detail_lower = detail.toLowerCase();
    let type = "unknown";

    if (detail_lower.includes("vali")) type = "vali";
    else if (detail_lower.includes("balo")) type = "balo";
    else if (
      detail_lower.includes("tag") ||
      detail_lower.includes("cover") ||
      detail_lower.includes("kem") ||
      detail_lower.includes("túi")
    )
      type = "phụ kiện";

    return { count: items.length, type };
  };

  // Kiểm tra khả năng phù hợp của nhân viên với đơn hàng
  const checkStaffOrderCompatibility = (staff, order) => {
    // Nếu là đơn P1, chỉ nhân viên xử lý P1 mới được gán
    if (order.sla?.code === "P1" && !staff.handlingP1) {
      return { compatible: false, reason: "Không xử lý đơn P1" };
    }

    // Kiểm tra phù hợp về khu vực
    const orderZone = order.ecom_recipient_code?.split("-")[0] || "";
    if (orderZone && staff.area && allocationConfig.prioritizeLocation) {
      // Ưu tiên nhân viên cùng khu vực
      if (staff.area !== orderZone && staff.area !== "HN") {
        return { compatible: false, reason: "Khác khu vực" };
      }
    }

    // Kiểm tra khả năng xử lý đơn nhiều sản phẩm
    const productInfo = analyzeProduct(order.detail);
    if (productInfo.count > 2 && staff.efficiency < 90) {
      return {
        compatible: false,
        reason: "Không đủ hiệu suất cho đơn phức tạp",
      };
    }

    // Kiểm tra có kỹ năng phù hợp không
    if (staff.skills.length > 0) {
      const productType = productInfo.type;
      if (
        (productType === "vali" && !staff.skills.includes("vali")) ||
        (productType === "balo" && !staff.skills.includes("balo")) ||
        (productType === "phụ kiện" && !staff.skills.includes("phụ kiện"))
      ) {
        return { compatible: false, reason: "Không có kỹ năng phù hợp" };
      }
    }

    return { compatible: true, reason: "" };
  };

  // Tính điểm phù hợp giữa nhân viên và đơn hàng
  const calculateOrderMatchScore = (staff, order) => {
    let score = 0;

    // Kiểm tra tính phù hợp cơ bản
    const compatibility = checkStaffOrderCompatibility(staff, order);
    if (!compatibility.compatible) return -1; // Không phù hợp

    // Cộng điểm cho hiệu suất
    score += staff.efficiency / 10; // max 10

    // Cộng điểm cho khu vực
    const orderZone = order.ecom_recipient_code?.split("-")[0] || "";
    if (orderZone && staff.area) {
      if (staff.area === orderZone) score += 5;
      if (staff.area === "HN") score += 3; // Trưởng ca có thể làm mọi khu vực nhưng ưu tiên thấp hơn
    }

    // Cộng điểm cho kỹ năng phù hợp
    const productType = analyzeProduct(order.detail).type;
    if (staff.skills.includes(productType)) score += 3;

    // Trừ điểm nếu nhân viên đã có nhiều đơn
    score -= staff.assignedOrders.length;

    // Ưu tiên nhân viên chuyên xử lý P1 cho đơn P1
    if (order.sla?.code === "P1" && staff.handlingP1) score += 10;

    return score;
  };

  // Thêm hoạt động vào lịch sử
  const addToActivityHistory = (activity) => {
    setActivityHistory((prev) => [activity, ...prev]);
  };

  // Tự động phân bổ đơn hàng cho nhân viên
  const autoAssignOrders = () => {
    setIsAutoAssigning(true);

    // Lấy danh sách đơn chưa gán và nhân viên có thể gán
    const unassignedOrders = orders.filter(
      (o) =>
        o.status === "pending" &&
        !staff.some((s) => s.assignedOrders.includes(o.id.toString()))
    );

    const availableStaff = staff.filter(
      (s) => s.status === "available" || s.assignedOrders.length < 5
    );

    if (unassignedOrders.length === 0 || availableStaff.length === 0) {
      setIsAutoAssigning(false);
      return;
    }

    // Sắp xếp đơn theo độ ưu tiên
    const sortedOrders = [...unassignedOrders].sort((a, b) => {
      // P1 luôn được ưu tiên cao nhất
      if (a.sla?.code === "P1" && b.sla?.code !== "P1") return -1;
      if (a.sla?.code !== "P1" && b.sla?.code === "P1") return 1;

      // Tiếp theo là P2
      if (a.sla?.code === "P2" && b.sla?.code !== "P2") return -1;
      if (a.sla?.code !== "P2" && b.sla?.code === "P2") return 1;

      // Sau đó là P3
      if (a.sla?.code === "P3" && b.sla?.code !== "P3") return -1;
      if (a.sla?.code !== "P3" && b.sla?.code === "P3") return 1;

      // Tiếp theo là độ phức tạp (ưu tiên đơn đơn giản)
      const aComplexity = analyzeProduct(a.detail).count;
      const bComplexity = analyzeProduct(b.detail).count;
      if (aComplexity !== bComplexity) return aComplexity - bComplexity;

      // Cuối cùng là thời gian
      const aDate = new Date(a.date_order);
      const bDate = new Date(b.date_order);
      return aDate - bDate;
    });

    // Bản đồ phân bổ mới
    const newStaffState = [...staff];
    const p1Assigned = { count: 0, staffs: {} };
    const p2Assigned = { count: 0, staffs: {} };
    const totalAssigned = { count: 0, staffs: {} };

    // Giả lập xử lý phân bổ (diễn ra trong 2 giây)
    setTimeout(() => {
      // Duyệt qua từng đơn hàng theo thứ tự ưu tiên
      sortedOrders.forEach((order) => {
        // Tính điểm phù hợp cho mỗi nhân viên với đơn hàng này
        const staffScores = [];

        newStaffState.forEach((staffMember, index) => {
          // Bỏ qua nhân viên không rảnh
          if (
            staffMember.status !== "available" &&
            staffMember.assignedOrders.length >= 5
          ) {
            return;
          }

          // P1 orders should be limited per staff
          if (order.sla?.code === "P1") {
            const p1Count = staffMember.assignedOrders.filter((orderId) => {
              const foundOrder = orders.find(
                (o) => o.id.toString() === orderId.toString()
              );
              return foundOrder && foundOrder.sla?.code === "P1";
            }).length;

            if (p1Count >= allocationConfig.p1MaxPerStaff) {
              return;
            }
          }

          const score = calculateOrderMatchScore(staffMember, order);
          if (score >= 0) {
            staffScores.push({ index, score });
          }
        });

        // Sắp xếp theo điểm phù hợp
        staffScores.sort((a, b) => b.score - a.score);

        // Chọn nhân viên phù hợp nhất
        if (staffScores.length > 0) {
          const bestStaffIndex = staffScores[0].index;
          const staffMember = newStaffState[bestStaffIndex];

          // Gán đơn cho nhân viên
          newStaffState[bestStaffIndex] = {
            ...staffMember,
            status: "busy",
            currentOrder: staffMember.currentOrder || order.id.toString(),
            assignedOrders: [
              ...staffMember.assignedOrders,
              order.id.toString(),
            ],
            orderCount: staffMember.orderCount + 1,
          };

          // Cập nhật thống kê
          totalAssigned.count++;
          totalAssigned.staffs[staffMember.id] =
            (totalAssigned.staffs[staffMember.id] || 0) + 1;

          if (order.sla?.code === "P1") {
            p1Assigned.count++;
            p1Assigned.staffs[staffMember.id] =
              (p1Assigned.staffs[staffMember.id] || 0) + 1;
          } else if (order.sla?.code === "P2") {
            p2Assigned.count++;
            p2Assigned.staffs[staffMember.id] =
              (p2Assigned.staffs[staffMember.id] || 0) + 1;
          }

          // Thêm vào lịch sử hoạt động
          addToActivityHistory({
            type: "auto_assign",
            orderId: order.id,
            orderName: order.name,
            staffId: staffMember.id,
            staffName: staffMember.name,
            timestamp: new Date().toISOString(),
            details: `Tự động gán đơn ${order.name || order.id} cho ${staffMember.name}`,
          });
        }
      });

      // Cập nhật state nhân viên
      setStaff(newStaffState);

      // Cập nhật metrics phân bổ
      const staffUtilization = calculateStaffUtilization(newStaffState);
      const estimatedCompletionTime =
        calculateEstimatedCompletionTime(newStaffState);

      setAssignmentMetrics({
        p1OrdersAssigned: p1Assigned.count,
        p2OrdersAssigned: p2Assigned.count,
        totalOrdersAssigned: totalAssigned.count,
        staffUtilization,
        estimatedCompletionTime,
      });

      setIsAutoAssigning(false);
    }, 2000); // Giả lập thời gian xử lý
  };

  // Tính % tận dụng nhân viên
  const calculateStaffUtilization = (staffList) => {
    const totalStaff = staffList.length;
    const busyStaff = staffList.filter((s) => s.status === "busy").length;
    return Math.round((busyStaff / totalStaff) * 100);
  };

  // Tính thời gian hoàn thành dự kiến (phút)
  const calculateEstimatedCompletionTime = (staffList) => {
    // Tổng số đơn đã gán
    const totalAssignedOrders = staffList.reduce(
      (sum, s) => sum + s.assignedOrders.length,
      0
    );

    // Ước tính thời gian trung bình để xử lý 1 đơn (phút)
    const avgTimePerOrder = 5;

    // Số nhân viên đang làm việc
    const workingStaff =
      staffList.filter((s) => s.status === "busy").length || 1;

    // Tính thời gian dự kiến (phút)
    return Math.ceil((totalAssignedOrders * avgTimePerOrder) / workingStaff);
  };

  // Gán đơn thủ công cho nhân viên
  const manuallyAssignOrder = (orderId, staffId) => {
    // Tìm đơn hàng và nhân viên
    const order = orders.find((o) => o.id.toString() === orderId.toString());
    const staffIndex = staff.findIndex((s) => s.id === staffId);

    if (!order || staffIndex === -1) return;

    // Kiểm tra tính phù hợp
    const compatibility = checkStaffOrderCompatibility(
      staff[staffIndex],
      order
    );
    if (!compatibility.compatible) {
      alert(`Không thể gán đơn cho nhân viên này: ${compatibility.reason}`);
      return;
    }

    // Gán đơn cho nhân viên
    setStaff((prevStaff) => {
      const updatedStaff = [...prevStaff];
      const staffMember = updatedStaff[staffIndex];

      updatedStaff[staffIndex] = {
        ...staffMember,
        status: "busy",
        currentOrder: staffMember.currentOrder || order.id.toString(),
        assignedOrders: [...staffMember.assignedOrders, order.id.toString()],
        orderCount: staffMember.orderCount + 1,
      };

      // Thêm vào lịch sử hoạt động
      addToActivityHistory({
        type: "manual_assign",
        orderId: order.id,
        orderName: order.name,
        staffId: staffMember.id,
        staffName: staffMember.name,
        timestamp: new Date().toISOString(),
        details: `Thủ công gán đơn ${order.name || order.id} cho ${staffMember.name}`,
      });

      return updatedStaff;
    });
  };

  // Hủy gán đơn cho nhân viên
  const unassignOrder = (orderId, staffId) => {
    setStaff((prevStaff) => {
      const updatedStaff = [...prevStaff];
      const staffIndex = updatedStaff.findIndex((s) => s.id === staffId);

      if (staffIndex === -1) return prevStaff;

      const staffMember = updatedStaff[staffIndex];
      const order = orders.find((o) => o.id.toString() === orderId.toString());
      const newAssignedOrders = staffMember.assignedOrders.filter(
        (id) => id.toString() !== orderId.toString()
      );

      // Thêm vào lịch sử hoạt động
      if (order) {
        addToActivityHistory({
          type: "unassign",
          orderId: orderId,
          orderName: order.name,
          staffId: staffMember.id,
          staffName: staffMember.name,
          timestamp: new Date().toISOString(),
          details: `Hủy gán đơn ${order.name || orderId} từ ${staffMember.name}`,
        });
      }

      updatedStaff[staffIndex] = {
        ...staffMember,
        status: newAssignedOrders.length > 0 ? "busy" : "available",
        currentOrder:
          newAssignedOrders.length > 0 ? newAssignedOrders[0] : null,
        assignedOrders: newAssignedOrders,
        orderCount: Math.max(0, staffMember.orderCount - 1),
      };

      return updatedStaff;
    });
  };

  // Xử lý đánh dấu đơn đã hoàn thành
  const markOrderComplete = (orderId, staffId) => {
    // Cập nhật trạng thái đơn
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        if (order.id.toString() === orderId.toString()) {
          return { ...order, status: "completed" };
        }
        return order;
      });
    });

    // Cập nhật danh sách đơn của nhân viên
    setStaff((prevStaff) => {
      const updatedStaff = [...prevStaff];
      const staffIndex = updatedStaff.findIndex((s) => s.id === staffId);

      if (staffIndex === -1) return prevStaff;

      const staffMember = updatedStaff[staffIndex];
      const order = orders.find((o) => o.id.toString() === orderId.toString());
      const newAssignedOrders = staffMember.assignedOrders.filter(
        (id) => id.toString() !== orderId.toString()
      );

      // Thêm vào lịch sử hoạt động
      if (order) {
        addToActivityHistory({
          type: "mark_complete",
          orderId: orderId,
          orderName: order.name,
          staffId: staffMember.id,
          staffName: staffMember.name,
          timestamp: new Date().toISOString(),
          details: `${staffMember.name} đánh dấu hoàn thành đơn ${order.name || orderId}`,
        });
      }

      updatedStaff[staffIndex] = {
        ...staffMember,
        status: newAssignedOrders.length > 0 ? "busy" : "available",
        currentOrder:
          newAssignedOrders.length > 0 ? newAssignedOrders[0] : null,
        assignedOrders: newAssignedOrders,
      };

      return updatedStaff;
    });
  };

  // Xử lý khi người dùng chọn file
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Đọc file dưới dạng text
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });

      // Parse JSON
      const jsonData = JSON.parse(text);

      // Xử lý dữ liệu
      let orderData = [];
      if (jsonData.data && Array.isArray(jsonData.data)) {
        orderData = jsonData.data;
      } else if (Array.isArray(jsonData)) {
        orderData = jsonData;
      } else {
        throw new Error("Cấu trúc JSON không hợp lệ");
      }

      // Xử lý thành công
      // Thêm thông tin SLA cho mỗi đơn hàng
      const processedOrders = orderData.map((order) => {
        // Thêm trạng thái mặc định nếu chưa có
        if (!order.status) {
          order.status = "pending";
        }

        // Tính SLA dựa vào thời gian đặt đơn
        const sla = calculateSLA(order);

        return {
          ...order,
          sla,
        };
      });

      setOrders(processedOrders);
      setUploadStats({
        total: processedOrders.length,
        successful: processedOrders.length,
        failed: 0,
      });

      // Thêm vào lịch sử hoạt động
      addToActivityHistory({
        type: "upload",
        timestamp: new Date().toISOString(),
        details: `Tải lên ${processedOrders.length} đơn hàng từ file ${file.name}`,
      });

      // Chọn tất cả đơn hàng vừa upload
      setSelectedOrders(processedOrders.map((order) => order.id.toString()));
    } catch (error) {
      console.error("Lỗi khi xử lý file:", error);
      setUploadError(`Đã xảy ra lỗi khi tải lên: ${error.message}`);
      setUploadStats({
        total: 0,
        successful: 0,
        failed: 1,
      });

      // Thêm vào lịch sử hoạt động
      addToActivityHistory({
        type: "upload_error",
        timestamp: new Date().toISOString(),
        details: `Lỗi khi tải lên file ${file.name}: ${error.message}`,
      });
    } finally {
      setIsUploading(false);
      event.target.value = null; // Reset file input
    }
  };

  // Tạo mẫu JSON
  const downloadSampleJSON = () => {
    const sampleData = {
      error: false,
      message: "OK",
      data: [
        {
          id: 434819,
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
        },
        {
          id: 434821,
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
        },
      ],
    };

    const blob = new Blob([JSON.stringify(sampleData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_orders.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Thêm vào lịch sử hoạt động
    addToActivityHistory({
      type: "download_sample",
      timestamp: new Date().toISOString(),
      details: "Tải xuống mẫu JSON đơn hàng",
    });
  };

  // Phân tích chiến lược tối ưu
  const analyzeOptimalStrategy = () => {
    if (!orders || orders.length === 0) return;

    // Đếm số lượng đơn theo mức độ ưu tiên
    const p1Count = orders.filter((o) => o.sla?.code === "P1").length;
    const p2Count = orders.filter((o) => o.sla?.code === "P2").length;

    // Phân tích số loại sản phẩm trên mỗi đơn
    const singleProductOrders = orders.filter(
      (o) => analyzeProduct(o.detail).count === 1
    ).length;
    const multiProductOrders = orders.length - singleProductOrders;

    // Phân tích khu vực và vị trí
    const locationMap = {};
    orders.forEach((order) => {
      if (!order.ecom_recipient_code) return;
      const location = order.ecom_recipient_code.split("-")[0] || "UNKNOWN";
      locationMap[location] = (locationMap[location] || 0) + 1;
    });

    const highestLocationCount = Object.entries(locationMap)
      .sort((a, b) => b[1] - a[1])
      .map(([location, count]) => ({ location, count }))[0];

    // Phân tích loại sản phẩm
    const productTypeMap = {};
    orders.forEach((order) => {
      const productType = analyzeProduct(order.detail).type;
      productTypeMap[productType] = (productTypeMap[productType] || 0) + 1;
    });

    const dominantProductType = Object.entries(productTypeMap)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }))[0];

    // Quyết định chiến lược tối ưu dựa trên dữ liệu và các nguyên tắc SLA
    let strategy = "priority";
    let reason = "";

    if (p1Count > 0 && p1Count / orders.length > 0.2) {
      strategy = "priority";
      reason = `Có ${p1Count} đơn P1 cần xử lý gấp theo SLA`;
    } else if (
      singleProductOrders > multiProductOrders &&
      singleProductOrders / orders.length > 0.6
    ) {
      strategy = "single_product";
      reason = `Đa số là đơn 1 sản phẩm (${singleProductOrders}/${orders.length}), nên xử lý theo độ phức tạp`;
    } else if (
      highestLocationCount &&
      highestLocationCount.count / orders.length > 0.4
    ) {
      strategy = "location";
      reason = `Đơn tập trung ở khu vực ${highestLocationCount.location} (${highestLocationCount.count}/${orders.length}), tối ưu đường đi`;
    } else if (
      dominantProductType &&
      dominantProductType.count / orders.length > 0.5
    ) {
      strategy = "product_type";
      reason = `Đa số đơn có sản phẩm cùng loại (${dominantProductType.type})`;
    }

    setRecommendedStrategy({
      strategy,
      reason,
      stats: {
        p1Count,
        p2Count,
        singleProductOrders,
        multiProductOrders,
        highestLocation: highestLocationCount,
        dominantProductType,
      },
    });
  };

  // Xử lý tối ưu giả lập
  const handleOptimizeOrders = () => {
    setIsOptimizing(true);

    // Giả lập xử lý tối ưu
    setTimeout(() => {
      analyzeOptimalStrategy();
      setIsOptimizing(false);

      // Tự động áp dụng chiến lược tối ưu
      if (recommendedStrategy) {
        setPickingStrategy(recommendedStrategy.strategy);

        // Thêm vào lịch sử hoạt động
        addToActivityHistory({
          type: "optimize",
          timestamp: new Date().toISOString(),
          details: `Áp dụng chiến lược tối ưu: ${getStrategyName(recommendedStrategy.strategy)} - ${recommendedStrategy.reason}`,
        });
      }
    }, 800);
  };

  // Lọc và sắp xếp đơn hàng theo chiến lược picking
  const getFilteredOrders = () => {
    if (!orders || orders.length === 0) return [];

    return orders
      .filter((order) => {
        // Lọc theo độ ưu tiên SLA
        if (
          selectedPriority !== "all" &&
          order.sla?.code !== selectedPriority
        ) {
          return false;
        }

        // Lọc theo kênh bán hàng
        if (
          selectedChannel !== "all" &&
          order.customer.toLowerCase() !== selectedChannel.toLowerCase()
        ) {
          return false;
        }

        // Lọc theo khu vực
        if (selectedLocation !== "all") {
          const orderLocation = order.ecom_recipient_code?.split("-")[0] || "";
          if (orderLocation !== selectedLocation) {
            return false;
          }
        }

        // Tìm kiếm
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            String(order.id).includes(searchLower) ||
            order.name.toLowerCase().includes(searchLower) ||
            order.customer.toLowerCase().includes(searchLower) ||
            order.phone.includes(searchLower) ||
            (order.shipment_code &&
              order.shipment_code.toLowerCase().includes(searchLower)) ||
            order.detail.toLowerCase().includes(searchLower) ||
            order.address.toLowerCase().includes(searchLower)
          );
        }

        return true;
      })
      .sort((a, b) => {
        const directionMultiplier = sortDirection === "asc" ? 1 : -1;

        // QUÁNT TRỌNG: Luôn ưu tiên đơn P1 đầu tiên, sau đó mới áp dụng chiến lược khác
        // Điều này tuân thủ quy tắc SLA
        if (a.sla?.code === "P1" && b.sla?.code !== "P1") return -1;
        if (a.sla?.code !== "P1" && b.sla?.code === "P1") return 1;

        switch (pickingStrategy) {
          case "priority":
            // Sắp xếp theo mức độ ưu tiên SLA (P1 > P2 > P3 > P4)
            return (
              ((a.sla?.level || 999) - (b.sla?.level || 999)) *
              directionMultiplier
            );

          case "single_product":
            // Đơn 1 sản phẩm trước, sau đó đến đơn nhiều sản phẩm
            const aItems = analyzeProduct(a.detail).count;
            const bItems = analyzeProduct(b.detail).count;

            if (aItems !== bItems) {
              return (aItems - bItems) * directionMultiplier;
            }

            // Nếu số lượng sản phẩm bằng nhau, ưu tiên theo SLA
            return (
              ((a.sla?.level || 999) - (b.sla?.level || 999)) *
              directionMultiplier
            );

          case "location":
            // Sắp xếp theo vị trí trong kho
            const locA = a.ecom_recipient_code || "";
            const locB = b.ecom_recipient_code || "";

            // Ưu tiên cùng khu vực
            const zoneA = locA.split("-")[0] || "";
            const zoneB = locB.split("-")[0] || "";

            if (zoneA !== zoneB) {
              return zoneA.localeCompare(zoneB) * directionMultiplier;
            }

            // Nếu cùng khu vực, ưu tiên theo SLA
            return (
              ((a.sla?.level || 999) - (b.sla?.level || 999)) *
              directionMultiplier
            );

          case "product_type":
            // Sắp xếp theo loại sản phẩm
            const typeA = analyzeProduct(a.detail).type;
            const typeB = analyzeProduct(b.detail).type;

            if (typeA !== typeB) {
              return typeA.localeCompare(typeB) * directionMultiplier;
            }

            // Nếu cùng loại sản phẩm, sắp xếp theo SLA
            return (
              ((a.sla?.level || 999) - (b.sla?.level || 999)) *
              directionMultiplier
            );

          default:
            // Mặc định sắp xếp theo ID
            return (
              String(a.id).localeCompare(String(b.id), undefined, {
                numeric: true,
              }) * directionMultiplier
            );
        }
      });
  };

  // Lọc nhân viên
  const getFilteredStaff = () => {
    return staff.filter((s) => {
      if (staffFilter === "available" && s.status !== "available") {
        return false;
      }
      if (staffFilter === "busy" && s.status !== "busy") {
        return false;
      }
      return true;
    });
  };

  // Xử lý chọn/bỏ chọn tất cả
  const toggleSelectAll = () => {
    const filteredOrders = getFilteredOrders();
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id.toString()));
    }
  };

  // Xử lý chọn/bỏ chọn một đơn hàng
  const toggleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId.toString())) {
      setSelectedOrders(
        selectedOrders.filter((id) => id !== orderId.toString())
      );
    } else {
      setSelectedOrders([...selectedOrders, orderId.toString()]);
    }
  };

  // Bắt đầu chỉnh sửa thông tin nhân viên
  const startEditStaff = (staffId) => {
    const staffMember = staff.find((s) => s.id === staffId);
    if (staffMember) {
      setEditingStaffId(staffId);
      setEditingStaffData({ ...staffMember });
    }
  };

  // Lưu thông tin nhân viên
  const saveStaffEdits = () => {
    if (!editingStaffData) return;

    setStaff((prevStaff) => {
      return prevStaff.map((s) => {
        if (s.id === editingStaffId) {
          return { ...editingStaffData };
        }
        return s;
      });
    });

    // Thêm vào lịch sử hoạt động
    addToActivityHistory({
      type: "edit_staff",
      staffId: editingStaffId,
      staffName: editingStaffData.name,
      timestamp: new Date().toISOString(),
      details: `Cập nhật thông tin nhân viên ${editingStaffData.name}`,
    });

    setEditingStaffId(null);
    setEditingStaffData(null);
  };

  // Hủy chỉnh sửa thông tin nhân viên
  const cancelStaffEdit = () => {
    setEditingStaffId(null);
    setEditingStaffData(null);
  };

  // Thêm nhân viên mới
  const addNewStaff = () => {
    if (!newStaffData.name || !newStaffData.area) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const maxId = staff.reduce((max, s) => Math.max(max, s.id), 0);

    const newStaff = {
      ...newStaffData,
      id: maxId + 1,
      status: "available",
      currentOrder: null,
      assignedOrders: [],
      orderCount: 0,
    };

    setStaff([...staff, newStaff]);

    // Thêm vào lịch sử hoạt động
    addToActivityHistory({
      type: "add_staff",
      staffId: newStaff.id,
      staffName: newStaff.name,
      timestamp: new Date().toISOString(),
      details: `Thêm nhân viên mới: ${newStaff.name}`,
    });

    setNewStaffData({
      name: "",
      role: "Nhân viên",
      area: "",
      skills: [],
      handlingP1: false,
      efficiency: 90,
    });

    setIsAddingStaff(false);
  };

  // Xử lý khi click vào nút in đơn
  const handlePrintOrders = () => {
    if (selectedOrders.length === 0) return;

    setLinkActions({
      type: "print",
      ids: selectedOrders,
    });

    // Thêm vào lịch sử hoạt động
    addToActivityHistory({
      type: "print",
      timestamp: new Date().toISOString(),
      details: `In ${selectedOrders.length} đơn hàng: ${selectedOrders.join(", ")}`,
    });

    setIsModalOpen(true);
  };

  // Xử lý khi click vào nút soạn hàng
  const handlePrepareOrders = () => {
    if (selectedOrders.length === 0) return;

    setLinkActions({
      type: "prepare",
      ids: selectedOrders,
    });

    // Thêm vào lịch sử hoạt động
    addToActivityHistory({
      type: "prepare",
      timestamp: new Date().toISOString(),
      details: `Soạn hàng cho ${selectedOrders.length} đơn: ${selectedOrders.join(", ")}`,
    });

    setIsModalOpen(true);
  };

  // Xử lý chọn đơn theo khu vực
  const handleSelectByZone = (zone) => {
    if (warehouseZones[zone] && warehouseZones[zone].orders) {
      setSelectedOrders(warehouseZones[zone].orders.map((id) => id.toString()));
      setSelectedLocation(zone);

      // Thêm vào lịch sử hoạt động
      addToActivityHistory({
        type: "select_zone",
        timestamp: new Date().toISOString(),
        details: `Chọn khu vực ${zone} với ${warehouseZones[zone].orders.length} đơn hàng`,
      });
    }
  };

  // Tạo URL cho nút in đơn/soạn hàng
  const getActionUrl = () => {
    const baseUrl = "https://one.tga.com.vn/so/";
    const ids = linkActions.ids.join(",");

    if (linkActions.type === "print") {
      return `${baseUrl}invoicePrint?id=${ids}`;
    } else if (linkActions.type === "prepare") {
      return `${baseUrl}prepare?id=${ids}`;
    }

    return "";
  };

  // Xử lý thay đổi cấu hình phân bổ tự động
  const handleConfigChange = (field, value) => {
    setAllocationConfig((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Thêm vào lịch sử hoạt động
    addToActivityHistory({
      type: "config_change",
      timestamp: new Date().toISOString(),
      details: `Thay đổi cấu hình phân bổ: ${field} = ${value}`,
    });
  };

  // Xử lý thay đổi cấu hình SLA
  const handleSlaConfigChange = (field, value) => {
    setSlaConfig((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Thêm vào lịch sử hoạt động
    addToActivityHistory({
      type: "sla_config_change",
      timestamp: new Date().toISOString(),
      details: `Thay đổi cấu hình SLA: ${field} = ${value}`,
    });

    // Tính toán lại SLA cho tất cả đơn hàng
    if (orders.length > 0) {
      setOrders((prevOrders) => {
        return prevOrders.map((order) => {
          const sla = calculateSLA(order);
          return {
            ...order,
            sla,
          };
        });
      });
    }
  };

  // Hiển thị tên chiến lược picking
  const getStrategyName = (strategy) => {
    switch (strategy) {
      case "priority":
        return "Theo SLA";
      case "single_product":
        return "Ưu tiên đơn 1 SP";
      case "location":
        return "Theo vị trí kho";
      case "product_type":
        return "Theo loại sản phẩm";
      default:
        return "Mặc định";
    }
  };

  // Hiển thị thời gian ước tính
  const formatEstimatedTime = (minutes) => {
    if (minutes < 60) return `${minutes} phút`;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} giờ ${mins} phút`;
  };

  // Hiển thị tên trạng thái nhân viên
  const getStaffStatusName = (status) => {
    switch (status) {
      case "available":
        return "Sẵn sàng";
      case "busy":
        return "Đang xử lý đơn";
      case "break":
        return "Đang nghỉ";
      default:
        return status;
    }
  };

  // Hiển thị màu trạng thái nhân viên
  const getStaffStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "break":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Xuất lịch sử hoạt động sang CSV
  const exportActivityHistory = () => {
    if (activityHistory.length === 0) return;

    // Chuẩn bị dữ liệu CSV
    const headers = [
      "Thời gian",
      "Loại",
      "Mã đơn",
      "Tên đơn",
      "Mã NV",
      "Tên NV",
      "Chi tiết",
    ];
    const csvRows = [headers.join(",")];

    activityHistory.forEach((activity) => {
      const row = [
        new Date(activity.timestamp).toLocaleString("vi-VN"),
        activity.type,
        activity.orderId || "",
        activity.orderName || "",
        activity.staffId || "",
        activity.staffName || "",
        `"${activity.details || ""}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
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

  // Hiển thị tên loại hoạt động
  const getActivityTypeName = (type) => {
    switch (type) {
      case "upload":
        return "Tải lên đơn hàng";
      case "upload_error":
        return "Lỗi tải lên";
      case "download_sample":
        return "Tải mẫu";
      case "auto_assign":
        return "Tự động phân bổ";
      case "manual_assign":
        return "Phân bổ thủ công";
      case "unassign":
        return "Hủy phân bổ";
      case "mark_complete":
        return "Hoàn thành đơn";
      case "order_completed":
        return "Đơn hoàn thành";
      case "optimize":
        return "Tối ưu lộ trình";
      case "print":
        return "In đơn hàng";
      case "prepare":
        return "Soạn hàng";
      case "select_zone":
        return "Chọn khu vực";
      case "config_change":
        return "Thay đổi cấu hình";
      case "sla_config_change":
        return "Thay đổi SLA";
      case "edit_staff":
        return "Sửa thông tin NV";
      case "add_staff":
        return "Thêm nhân viên";
      case "export_history":
        return "Xuất lịch sử";
      default:
        return type;
    }
  };

  // Hiển thị màu cho loại hoạt động
  const getActivityTypeColor = (type) => {
    switch (type) {
      case "upload":
        return "bg-green-100 text-green-800";
      case "upload_error":
        return "bg-red-100 text-red-800";
      case "auto_assign":
        return "bg-blue-100 text-blue-800";
      case "manual_assign":
        return "bg-purple-100 text-purple-800";
      case "unassign":
        return "bg-orange-100 text-orange-800";
      case "mark_complete":
      case "order_completed":
        return "bg-green-100 text-green-800";
      case "optimize":
        return "bg-yellow-100 text-yellow-800";
      case "print":
        return "bg-indigo-100 text-indigo-800";
      case "prepare":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Package className="h-5 w-5 text-blue-600 mr-2" />
          Hệ thống phân bổ đơn hàng theo SLA
        </h2>

        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1.5 bg-white border text-sm rounded text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload className="h-4 w-4 mr-1" />
            <span>Tải lên đơn hàng</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".json,.csv"
              className="hidden"
            />
          </button>

          <button
            className="px-3 py-1.5 bg-white border text-sm rounded text-gray-700 hover:bg-gray-50"
            onClick={downloadSampleJSON}
          >
            <span>Tải mẫu</span>
          </button>

          <button
            className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-sm rounded text-blue-700 hover:bg-blue-100 flex items-center"
            onClick={() => setIsConfigOpen(!isConfigOpen)}
          >
            <Settings className="h-4 w-4 mr-1" />
            <span>Cấu hình</span>
          </button>

          <button
            className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-sm rounded text-purple-700 hover:bg-purple-100 flex items-center"
            onClick={() => setSlaConfigOpen(!slaConfigOpen)}
          >
            <Clock className="h-4 w-4 mr-1" />
            <span>Cấu hình SLA</span>
          </button>

          <button
            className="px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-sm rounded text-yellow-700 hover:bg-yellow-100 flex items-center"
            onClick={() => setShowActivityHistory(!showActivityHistory)}
          >
            <History className="h-4 w-4 mr-1" />
            <span>Lịch sử</span>
          </button>
        </div>
      </div>

      {/* CONFIG PANEL */}
      {isConfigOpen && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-blue-800">
              Cấu hình phân bổ đơn hàng
            </h3>
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => setIsConfigOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            <div>
              <label className="text-xs text-blue-700 block mb-1">
                Tự động phân bổ mỗi (phút):
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={allocationConfig.autoAssignInterval}
                onChange={(e) =>
                  handleConfigChange(
                    "autoAssignInterval",
                    parseInt(e.target.value)
                  )
                }
                className="w-full border border-blue-200 rounded px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-blue-700 block mb-1">
                Tối đa đơn P1 mỗi nhân viên:
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={allocationConfig.p1MaxPerStaff}
                onChange={(e) =>
                  handleConfigChange("p1MaxPerStaff", parseInt(e.target.value))
                }
                className="w-full border border-blue-200 rounded px-2 py-1 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center text-xs text-blue-700">
              <input
                type="checkbox"
                checked={allocationConfig.balanceWorkload}
                onChange={(e) =>
                  handleConfigChange("balanceWorkload", e.target.checked)
                }
                className="mr-1 rounded"
              />
              Cân bằng khối lượng công việc
            </label>

            <label className="flex items-center text-xs text-blue-700">
              <input
                type="checkbox"
                checked={allocationConfig.prioritizeLocation}
                onChange={(e) =>
                  handleConfigChange("prioritizeLocation", e.target.checked)
                }
                className="mr-1 rounded"
              />
              Ưu tiên theo khu vực
            </label>

            <label className="flex items-center text-xs text-blue-700">
              <input
                type="checkbox"
                checked={allocationConfig.reassignOnCompletion}
                onChange={(e) =>
                  handleConfigChange("reassignOnCompletion", e.target.checked)
                }
                className="mr-1 rounded"
              />
              Tự động gán lại khi hoàn thành
            </label>
          </div>
        </div>
      )}

      {/* SLA CONFIG PANEL */}
      {slaConfigOpen && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-purple-800">
              Cấu hình khung thời gian SLA
            </h3>
            <button
              className="text-purple-500 hover:text-purple-700"
              onClick={() => setSlaConfigOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="text-xs text-purple-700 block mb-1">
                P1 - Gấp (dưới x giờ):
              </label>
              <input
                type="number"
                min="0.5"
                max="5"
                step="0.5"
                value={slaConfig.p1Hours}
                onChange={(e) =>
                  handleSlaConfigChange("p1Hours", parseFloat(e.target.value))
                }
                className="w-full border border-purple-200 rounded px-2 py-1 text-sm"
              />
              <div className="mt-1 text-xs text-purple-600">
                <div className="flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
                  <span>P1: Cần xử lý ngay lập tức</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-purple-700 block mb-1">
                P2 - Cảnh báo (dưới x giờ):
              </label>
              <input
                type="number"
                min="1"
                max="8"
                step="0.5"
                value={slaConfig.p2Hours}
                onChange={(e) =>
                  handleSlaConfigChange("p2Hours", parseFloat(e.target.value))
                }
                className="w-full border border-purple-200 rounded px-2 py-1 text-sm"
              />
              <div className="mt-1 text-xs text-purple-600">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-yellow-500" />
                  <span>P2: Không thể trì hoãn quá lâu</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-purple-700 block mb-1">
                P3 - Bình thường (dưới x giờ):
              </label>
              <input
                type="number"
                min="2"
                max="12"
                step="0.5"
                value={slaConfig.p3Hours}
                onChange={(e) =>
                  handleSlaConfigChange("p3Hours", parseFloat(e.target.value))
                }
                className="w-full border border-purple-200 rounded px-2 py-1 text-sm"
              />
              <div className="mt-1 text-xs text-purple-600">
                <div className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  <span>P3: Xử lý theo lộ trình hợp lý</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-purple-700 block mb-1">
                Thời gian SLA mặc định (giờ):
              </label>
              <input
                type="number"
                min="8"
                max="72"
                value={slaConfig.defaultSLA}
                onChange={(e) =>
                  handleSlaConfigChange("defaultSLA", parseInt(e.target.value))
                }
                className="w-full border border-purple-200 rounded px-2 py-1 text-sm"
              />
              <div className="mt-1 text-xs text-purple-600">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                  <span>SLA đơn hàng mặc định</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-purple-700 italic">
            Thay đổi cấu hình SLA sẽ tính toán lại mức độ ưu tiên cho tất cả đơn
            hàng hiện có.
          </div>
        </div>
      )}

      {/* ACTIVITY HISTORY PANEL */}
      {showActivityHistory && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Lịch sử hoạt động
            </h3>
            <div className="flex items-center space-x-2">
              <button
                className="text-yellow-600 hover:text-yellow-800 p-1.5 text-xs rounded flex items-center"
                onClick={exportActivityHistory}
                disabled={activityHistory.length === 0}
              >
                <Download className="h-3 w-3 mr-1" />
                Xuất CSV
              </button>
              <button
                className="text-yellow-500 hover:text-yellow-700"
                onClick={() => setShowActivityHistory(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {activityHistory.length === 0 ? (
              <div className="text-center text-sm text-yellow-700 py-6">
                Chưa có hoạt động nào được ghi lại
              </div>
            ) : (
              <div className="divide-y divide-yellow-100">
                {activityHistory.map((activity, index) => (
                  <div key={index} className="py-2">
                    <div className="flex justify-between">
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${getActivityTypeColor(activity.type)}`}
                      >
                        {getActivityTypeName(activity.type)}
                      </span>
                      <span className="text-xs text-yellow-700">
                        {new Date(activity.timestamp).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <div className="text-sm mt-1">{activity.details}</div>
                    {(activity.orderId || activity.staffId) && (
                      <div className="text-xs text-yellow-600 mt-1">
                        {activity.orderId && activity.orderName && (
                          <span className="mr-2">
                            Đơn: {activity.orderName}
                          </span>
                        )}
                        {activity.staffId && activity.staffName && (
                          <span>NV: {activity.staffName}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {uploadStats.successful > 0 && (
        <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-start">
          <Check className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-green-800">
              Tải lên thành công
            </div>
            <div className="text-xs text-green-700 mt-1">
              Đã tải lên {uploadStats.successful} đơn hàng và phân loại theo
              SLA.
            </div>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
          <AlertTriangle className="h-4 w-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-red-800">
              Lỗi khi tải lên
            </div>
            <div className="text-xs text-red-700 mt-1">{uploadError}</div>
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <>
          {/* DASHBOARD METRICS */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Tổng đơn hàng
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {orders.length}
                  </div>
                </div>
                <BarChart2 className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mt-2 grid grid-cols-4 gap-1 text-xs">
                <div>
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                  <span className="text-gray-600">
                    {orders.filter((o) => o.sla?.code === "P1").length}
                  </span>
                </div>
                <div>
                  <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                  <span className="text-gray-600">
                    {orders.filter((o) => o.sla?.code === "P2").length}
                  </span>
                </div>
                <div>
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                  <span className="text-gray-600">
                    {orders.filter((o) => o.sla?.code === "P3").length}
                  </span>
                </div>
                <div>
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                  <span className="text-gray-600">
                    {orders.filter((o) => o.sla?.code === "P4").length}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`bg-white border rounded-lg p-3 shadow-sm ${performance.p1Pending > 0 ? "border-l-4 border-l-red-500" : ""}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-gray-500 mb-1">P1 - Đơn gấp</div>
                  <div className="text-xl font-bold text-gray-800">
                    <span
                      className={
                        performance.p1Pending > 0
                          ? "text-red-600"
                          : "text-gray-800"
                      }
                    >
                      {performance.p1Pending}
                    </span>
                    <span className="text-gray-400 text-sm font-normal">
                      {" "}
                      / {performance.p1Pending + performance.p1Completed}
                    </span>
                  </div>
                </div>
                <Clock
                  className={`h-5 w-5 ${performance.p1Pending > 0 ? "text-red-500" : "text-blue-500"}`}
                />
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {performance.p1Pending > 0 ? (
                  <span className="text-red-600 font-medium">
                    Cần xử lý ngay &lt;2h
                  </span>
                ) : (
                  <span className="text-green-600">
                    Không có đơn P1 đang chờ
                  </span>
                )}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Thời gian xử lý ước tính
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {formatEstimatedTime(performance.estimatedTimeLeft)}
                  </div>
                </div>
                <Zap className="h-5 w-5 text-amber-500" />
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      performance.efficiency > 80
                        ? "bg-green-500"
                        : performance.efficiency > 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${performance.efficiency}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-right">
                  Hiệu suất: {performance.efficiency}%
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Nhân sự kho</div>
                  <div className="text-xl font-bold text-gray-800">
                    {staff.filter((s) => s.status === "busy").length}/
                    {staff.length}
                  </div>
                </div>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mt-2 text-xs text-gray-600">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      staff.filter((s) => s.status === "busy").length /
                        staff.length >
                      0.8
                        ? "bg-red-500"
                        : staff.filter((s) => s.status === "busy").length /
                              staff.length >
                            0.5
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{
                      width: `${(staff.filter((s) => s.status === "busy").length / staff.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="mt-1 flex justify-between">
                  <span>
                    Sẵn sàng:{" "}
                    {staff.filter((s) => s.status === "available").length}
                  </span>
                  <span>
                    Bận: {staff.filter((s) => s.status === "busy").length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ASSIGNMENT CONTROLS */}
          <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-1 text-blue-600" />
                Phân bổ đơn cho nhân sự
              </h3>

              <div className="flex items-center gap-2">
                <button
                  className={`px-2 py-1 rounded text-xs ${
                    assignmentMode === "auto"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setAssignmentMode("auto")}
                >
                  Tự động
                </button>

                <button
                  className={`px-2 py-1 rounded text-xs ${
                    assignmentMode === "manual"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setAssignmentMode("manual")}
                >
                  Thủ công
                </button>

                <button
                  className={`px-3 py-1 rounded text-xs flex items-center ${
                    isAutoAssigning
                      ? "bg-blue-100 text-blue-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={autoAssignOrders}
                  disabled={isAutoAssigning}
                >
                  {isAutoAssigning ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Đang phân bổ...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Phân bổ đơn
                    </>
                  )}
                </button>
              </div>
            </div>

            {assignmentMetrics.totalOrdersAssigned > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                <div className="bg-white p-2 rounded border text-xs">
                  <div className="text-gray-500">Đơn đã phân bổ</div>
                  <div className="font-medium">
                    {assignmentMetrics.totalOrdersAssigned} đơn
                  </div>
                </div>

                <div className="bg-white p-2 rounded border text-xs">
                  <div className="text-gray-500">Đơn P1 đã phân</div>
                  <div className="font-medium text-red-600">
                    {assignmentMetrics.p1OrdersAssigned} đơn
                  </div>
                </div>

                <div className="bg-white p-2 rounded border text-xs">
                  <div className="text-gray-500">Sử dụng nhân sự</div>
                  <div className="font-medium">
                    {assignmentMetrics.staffUtilization}%
                  </div>
                </div>

                <div className="bg-white p-2 rounded border text-xs">
                  <div className="text-gray-500">
                    Thời gian hoàn thành dự kiến
                  </div>
                  <div className="font-medium">
                    {formatEstimatedTime(
                      assignmentMetrics.estimatedCompletionTime
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STAFF LIST */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Danh sách nhân viên
                  </h4>

                  <div className="flex">
                    <button
                      className={`px-2 py-0.5 text-xs rounded-l ${
                        staffFilter === "all"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setStaffFilter("all")}
                    >
                      Tất cả
                    </button>
                    <button
                      className={`px-2 py-0.5 text-xs ${
                        staffFilter === "available"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setStaffFilter("available")}
                    >
                      Sẵn sàng
                    </button>
                    <button
                      className={`px-2 py-0.5 text-xs rounded-r ${
                        staffFilter === "busy"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      onClick={() => setStaffFilter("busy")}
                    >
                      Đang bận
                    </button>
                  </div>
                </div>

                <button
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded flex items-center hover:bg-blue-100"
                  onClick={() => setIsAddingStaff(true)}
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Thêm nhân viên
                </button>
              </div>

              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nhân viên
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khu vực
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kỹ năng
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đơn đang xử lý
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hiệu suất
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredStaff().map((staffMember) => (
                      <tr
                        key={staffMember.id}
                        className={
                          staffMember.status === "busy" ? "bg-yellow-50" : ""
                        }
                      >
                        {editingStaffId === staffMember.id ? (
                          // Editing mode
                          <>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                className="w-full border rounded px-2 py-1 text-xs"
                                value={editingStaffData.name}
                                onChange={(e) =>
                                  setEditingStaffData({
                                    ...editingStaffData,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                className="w-full border rounded px-2 py-1 text-xs"
                                value={editingStaffData.area}
                                onChange={(e) =>
                                  setEditingStaffData({
                                    ...editingStaffData,
                                    area: e.target.value,
                                  })
                                }
                              />
                            </td>
                            <td className="px-3 py-2">
                              <select
                                multiple
                                className="w-full border rounded px-2 py-1 text-xs"
                                value={editingStaffData.skills}
                                onChange={(e) => {
                                  const selectedOptions = Array.from(
                                    e.target.selectedOptions
                                  ).map((opt) => opt.value);
                                  setEditingStaffData({
                                    ...editingStaffData,
                                    skills: selectedOptions,
                                  });
                                }}
                              >
                                <option value="vali">Vali</option>
                                <option value="balo">Balo</option>
                                <option value="phụ kiện">Phụ kiện</option>
                                <option value="đóng gói">Đóng gói</option>
                                <option value="QC">QC</option>
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              <select
                                className="w-full border rounded px-2 py-1 text-xs"
                                value={editingStaffData.status}
                                onChange={(e) =>
                                  setEditingStaffData({
                                    ...editingStaffData,
                                    status: e.target.value,
                                  })
                                }
                              >
                                <option value="available">Sẵn sàng</option>
                                <option value="busy">Đang bận</option>
                                <option value="break">Nghỉ</option>
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              <div className="text-xs text-gray-500">
                                {staffMember.assignedOrders.length} đơn
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="number"
                                min="1"
                                max="100"
                                className="w-full border rounded px-2 py-1 text-xs"
                                value={editingStaffData.efficiency}
                                onChange={(e) =>
                                  setEditingStaffData({
                                    ...editingStaffData,
                                    efficiency: Math.min(
                                      100,
                                      Math.max(1, parseInt(e.target.value))
                                    ),
                                  })
                                }
                              />
                            </td>
                            <td className="px-3 py-2">
                              <div className="flex space-x-1">
                                <button
                                  className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                  onClick={saveStaffEdits}
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                                <button
                                  className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                  onClick={cancelStaffEdit}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          // Display mode
                          <>
                            <td className="px-3 py-2 whitespace-nowrap text-xs">
                              <div className="flex items-center">
                                <div className="font-medium text-gray-900">
                                  {staffMember.name}
                                </div>
                                {staffMember.handlingP1 && (
                                  <span className="ml-1 bg-red-100 text-red-800 text-xs px-1 rounded-sm">
                                    P1
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {staffMember.role}
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs">
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                                {staffMember.area}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs">
                              <div className="flex flex-wrap gap-1">
                                {staffMember.skills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs">
                              <span
                                className={`px-2 py-0.5 rounded ${getStaffStatusColor(staffMember.status)}`}
                              >
                                {getStaffStatusName(staffMember.status)}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-xs">
                              {staffMember.assignedOrders.length > 0 ? (
                                <div>
                                  <div className="font-medium">
                                    {staffMember.assignedOrders.length} đơn
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {staffMember.currentOrder && (
                                      <div className="flex items-center">
                                        <ArrowRight className="h-3 w-3 mr-1 text-blue-500" />
                                        <span className="truncate">
                                          {orders.find(
                                            (o) =>
                                              o.id.toString() ===
                                              staffMember.currentOrder
                                          )?.name || staffMember.currentOrder}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-gray-500">
                                  Không có đơn
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs">
                              <div className="flex items-center">
                                <div className="mr-2">
                                  {staffMember.efficiency}%
                                </div>
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      staffMember.efficiency > 95
                                        ? "bg-green-500"
                                        : staffMember.efficiency > 90
                                          ? "bg-blue-500"
                                          : staffMember.efficiency > 80
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                    }`}
                                    style={{
                                      width: `${staffMember.efficiency}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {staffMember.orderCount} đơn đã xử lý
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs">
                              <div className="flex space-x-1">
                                <button
                                  className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                  onClick={() => startEditStaff(staffMember.id)}
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}

                    {isAddingStaff && (
                      <tr>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            className="w-full border rounded px-2 py-1 text-xs"
                            placeholder="Tên nhân viên"
                            value={newStaffData.name}
                            onChange={(e) =>
                              setNewStaffData({
                                ...newStaffData,
                                name: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            className="w-full border rounded px-2 py-1 text-xs"
                            placeholder="Khu vực"
                            value={newStaffData.area}
                            onChange={(e) =>
                              setNewStaffData({
                                ...newStaffData,
                                area: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <select
                            multiple
                            className="w-full border rounded px-2 py-1 text-xs"
                            value={newStaffData.skills}
                            onChange={(e) => {
                              const selectedOptions = Array.from(
                                e.target.selectedOptions
                              ).map((opt) => opt.value);
                              setNewStaffData({
                                ...newStaffData,
                                skills: selectedOptions,
                              });
                            }}
                          >
                            <option value="vali">Vali</option>
                            <option value="balo">Balo</option>
                            <option value="phụ kiện">Phụ kiện</option>
                            <option value="đóng gói">Đóng gói</option>
                            <option value="QC">QC</option>
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Sẵn sàng
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-gray-500">0 đơn</span>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            className="w-full border rounded px-2 py-1 text-xs"
                            placeholder="Hiệu suất (%)"
                            value={newStaffData.efficiency}
                            onChange={(e) =>
                              setNewStaffData({
                                ...newStaffData,
                                efficiency: Math.min(
                                  100,
                                  Math.max(1, parseInt(e.target.value || "90"))
                                ),
                              })
                            }
                          />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex space-x-1">
                            <button
                              className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              onClick={addNewStaff}
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              onClick={() => setIsAddingStaff(false)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {getFilteredStaff().length === 0 && !isAddingStaff && (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-3 py-4 text-center text-sm text-gray-500"
                        >
                          Không tìm thấy nhân viên nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* STAFF ASSIGNMENTS */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Phân bổ đơn hàng theo nhân viên
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {staff
                  .filter((s) => s.assignedOrders.length > 0)
                  .map((staffMember) => (
                    <div
                      key={staffMember.id}
                      className="bg-white border rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium text-sm flex items-center">
                          <User className="h-4 w-4 mr-1 text-blue-500" />
                          {staffMember.name}
                        </div>
                        <span
                          className={`px-2 py-0.5 text-xs rounded ${getStaffStatusColor(staffMember.status)}`}
                        >
                          {getStaffStatusName(staffMember.status)}
                        </span>
                      </div>

                      <div className="mb-2">
                        <div className="text-xs text-gray-600 mb-1">
                          Đơn đang xử lý:
                        </div>
                        <div className="text-sm font-medium">
                          {orders.find(
                            (o) => o.id.toString() === staffMember.currentOrder
                          )?.name || staffMember.currentOrder}
                        </div>
                      </div>

                      {staffMember.assignedOrders.length > 1 && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-600 mb-1">
                            Chờ xử lý tiếp:
                          </div>
                          <div className="space-y-1">
                            {staffMember.assignedOrders
                              .slice(1)
                              .map((orderId) => {
                                const order = orders.find(
                                  (o) => o.id.toString() === orderId
                                );
                                return (
                                  <div
                                    key={orderId}
                                    className="flex items-center text-xs"
                                  >
                                    <CornerDownRight className="h-3 w-3 mr-1 text-gray-400" />
                                    <span className="truncate">
                                      {order?.name || orderId}
                                    </span>
                                    {order?.sla?.code === "P1" && (
                                      <span className="ml-1 bg-red-100 text-red-800 text-xs px-1 rounded-sm">
                                        P1
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">
                          Khu vực: {staffMember.area}
                        </span>
                        <span>{staffMember.assignedOrders.length} đơn</span>
                      </div>
                    </div>
                  ))}

                {staff.filter((s) => s.assignedOrders.length > 0).length ===
                  0 && (
                  <div className="col-span-full bg-gray-50 p-4 text-center text-sm text-gray-500 border rounded-lg">
                    Chưa có nhân viên nào được phân bổ đơn hàng
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ORDERS SECTION */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center">
                <Package className="h-4 w-4 mr-1 text-blue-600" />
                Danh sách đơn hàng
              </h3>

              <div className="flex items-center space-x-2">
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
                  <option value="all">Tất cả độ ưu tiên</option>
                  <option value="P1">P1 - Gấp</option>
                  <option value="P2">P2 - Cảnh báo</option>
                  <option value="P3">P3 - Bình thường</option>
                  <option value="P4">P4 - Chờ xử lý</option>
                </select>

                <select
                  className="px-3 py-1.5 text-sm border rounded"
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                >
                  <option value="all">Tất cả kênh</option>
                  <option value="shopee">Shopee</option>
                  <option value="tiktok">TikTok</option>
                  <option value="lazada">Lazada</option>
                </select>

                <select
                  className="px-3 py-1.5 text-sm border rounded"
                  value={pickingStrategy}
                  onChange={(e) => setPickingStrategy(e.target.value)}
                >
                  <option value="priority">Chiến lược: Theo SLA</option>
                  <option value="single_product">
                    Chiến lược: Ưu tiên đơn 1 SP
                  </option>
                  <option value="location">Chiến lược: Theo vị trí kho</option>
                  <option value="product_type">
                    Chiến lược: Theo loại sản phẩm
                  </option>
                </select>

                <button
                  className={`px-3 py-1.5 rounded text-xs flex items-center ${
                    isOptimizing
                      ? "bg-blue-100 text-blue-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={handleOptimizeOrders}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Đang tối ưu...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Tối ưu lộ trình lấy hàng
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RECOMMENDED STRATEGY */}
            {recommendedStrategy && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-start">
                  <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-blue-800">
                      Chiến lược tối ưu đề xuất:{" "}
                      {getStrategyName(recommendedStrategy.strategy)}
                    </div>
                    <div className="text-xs text-blue-700 mt-1">
                      {recommendedStrategy.reason}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        className={`px-2 py-1 text-xs rounded ${
                          pickingStrategy === recommendedStrategy.strategy
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-700 border border-blue-300"
                        }`}
                        onClick={() =>
                          setPickingStrategy(recommendedStrategy.strategy)
                        }
                      >
                        Áp dụng
                      </button>

                      <span className="inline-flex items-center text-xs text-blue-700">
                        <Clock className="h-3 w-3 mr-1" />
                        P1: {recommendedStrategy.stats.p1Count} đơn
                      </span>

                      <span className="inline-flex items-center text-xs text-blue-700">
                        <Package className="h-3 w-3 mr-1" />
                        Đơn 1 SP:{" "}
                        {recommendedStrategy.stats.singleProductOrders} đơn
                      </span>

                      {recommendedStrategy.stats.highestLocation && (
                        <span className="inline-flex items-center text-xs text-blue-700">
                          <MapPin className="h-3 w-3 mr-1" />
                          Khu vực{" "}
                          {
                            recommendedStrategy.stats.highestLocation.location
                          }: {recommendedStrategy.stats.highestLocation.count}{" "}
                          đơn
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* WAREHOUSE ZONES */}
            {Object.keys(warehouseZones).length > 0 && (
              <div className="mb-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {Object.entries(warehouseZones)
                  .sort(([, a], [, b]) => b.p1Count - a.p1Count)
                  .map(([zone, data]) => (
                    <button
                      key={zone}
                      className={`p-2 border rounded-lg text-center ${
                        selectedLocation === zone
                          ? "bg-blue-50 border-blue-300"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => handleSelectByZone(zone)}
                    >
                      <div className="text-xs font-medium">{zone}</div>
                      <div className="text-lg font-bold">{data.count}</div>
                      {data.p1Count > 0 && (
                        <div className="text-xs mt-1 text-red-600 font-medium">
                          P1: {data.p1Count}
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            )}

            {/* ACTIONS ROW */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={
                    selectedOrders.length === getFilteredOrders().length &&
                    selectedOrders.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded text-blue-600"
                />
                <label
                  htmlFor="selectAll"
                  className="text-sm text-gray-700 ml-1 cursor-pointer"
                >
                  {selectedOrders.length === 0
                    ? "Chọn tất cả"
                    : `Đã chọn ${selectedOrders.length} đơn`}
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1.5 bg-white border text-sm rounded text-gray-700 hover:bg-gray-50 flex items-center disabled:opacity-50"
                  onClick={handlePrintOrders}
                  disabled={selectedOrders.length === 0}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  <span>In đơn</span>
                </button>

                <button
                  className="px-3 py-1.5 bg-white border text-sm rounded text-gray-700 hover:bg-gray-50 flex items-center disabled:opacity-50"
                  onClick={handlePrepareOrders}
                  disabled={selectedOrders.length === 0}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  <span>Soạn hàng</span>
                </button>
              </div>
            </div>

            {/* ORDERS TABLE */}
            <div className="border rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-5 px-3 py-2">
                      <span className="sr-only">Chọn</span>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đơn / Kênh
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SLA
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vị trí kho
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày đặt
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        <span>Tình trạng</span>
                        <button
                          className="ml-1 text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setSortDirection(
                              sortDirection === "asc" ? "desc" : "asc"
                            )
                          }
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${sortDirection === "asc" ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredOrders().map((order, index) => {
                    // Tìm nhân viên được gán đơn này
                    const assignedStaff = staff.find((s) =>
                      s.assignedOrders.includes(order.id.toString())
                    );

                    return (
                      <tr
                        key={order.id}
                        className={`${
                          order.status === "completed"
                            ? "bg-gray-50 text-gray-500"
                            : order.sla?.code === "P1"
                              ? "bg-red-50"
                              : ""
                        } hover:bg-gray-50`}
                      >
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(
                              order.id.toString()
                            )}
                            onChange={() =>
                              toggleSelectOrder(order.id.toString())
                            }
                            className="rounded text-blue-600"
                            disabled={order.status === "completed"}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                          <div className="flex items-center">
                            {order.status !== "completed" &&
                              order.sla?.code === "P1" && (
                                <AlertTriangle className="h-3 w-3 mr-1 text-red-500 animate-pulse" />
                              )}
                            <div>
                              <div>{order.name || order.id}</div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                {order.customer}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          {order.sla ? (
                            <div>
                              <span
                                className={`px-1.5 py-0.5 rounded-full ${order.sla.color}`}
                              >
                                {order.sla.code}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {order.timeLeft ? `Còn: ${order.timeLeft}` : ""}
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs max-w-xs truncate">
                          <div className="flex items-start">
                            <div>
                              <div className="font-medium">
                                {order.detail?.split(",")[0]}
                              </div>
                              {analyzeProduct(order.detail).count > 1 && (
                                <div className="text-xs text-gray-500 mt-0.5">
                                  +{analyzeProduct(order.detail).count - 1} sản
                                  phẩm khác
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          {order.ecom_recipient_code ? (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded">
                              {order.ecom_recipient_code}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {order.date_order
                            ? new Date(order.date_order).toLocaleString(
                                "vi-VN",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "-"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          <span
                            className={`px-1.5 py-0.5 rounded-full ${
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
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          {assignedStaff ? (
                            <div className="flex items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1"></div>
                              <span>{assignedStaff.name}</span>
                            </div>
                          ) : (
                            <div className="text-gray-500">Chưa gán</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {getFilteredOrders().length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-3 py-4 text-center text-sm text-gray-500"
                      >
                        Không tìm thấy đơn hàng nào phù hợp với điều kiện lọc
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {orders.length === 0 && !isUploading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
            <Upload className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có dữ liệu đơn hàng
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Vui lòng tải lên file JSON đơn hàng để bắt đầu phân bổ theo SLA
          </p>
          <div className="flex justify-center">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2 flex items-center"
              onClick={() => fileInputRef.current.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Tải lên đơn hàng
            </button>
            <button
              className="px-4 py-2 bg-white border text-gray-700 rounded hover:bg-gray-50"
              onClick={downloadSampleJSON}
            >
              Tải mẫu
            </button>
          </div>
        </div>
      )}

      {/* Link Actions Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {linkActions.type === "print" ? "In đơn hàng" : "Soạn hàng"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {linkActions.type === "print"
                ? `Bạn đang chuẩn bị in ${linkActions.ids.length} đơn hàng.`
                : `Bạn đang chuẩn bị xem thông tin sản phẩm của ${linkActions.ids.length} đơn hàng.`}
            </p>

            <div className="mb-4 bg-gray-50 p-3 rounded border text-sm overflow-auto max-h-32">
              <code>{getActionUrl()}</code>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-white border text-gray-700 rounded hover:bg-gray-50"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>

              <a
                href={getActionUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                {linkActions.type === "print" ? "In đơn" : "Soạn hàng"}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStaffAllocation;
