import React, { useState, useEffect, useRef } from 'react';
import {
  Package, Clock, AlertTriangle, CheckCircle, RefreshCw,
  User, Activity, Filter, Search, Zap, MapPin,
  Settings, Calendar, Check, X, Printer, Download,
  FileText, ChevronDown, ChevronUp, ExternalLink,
  Upload, Clipboard, Bell, BarChart2, Users,
  History, Save, Archive
} from 'lucide-react';

const SLADashboard = () => {
  // State quản lý đơn hàng
  const [orders, setOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printType, setPrintType] = useState('order'); // 'order' or 'picking'
  const fileInputRef = useRef(null);
  
  // State bộ lọc và view
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [pickingStrategy, setPickingStrategy] = useState('priority');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // State UI/UX
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSLAConfig, setShowSLAConfig] = useState(false);
  const [showAllocationPanel, setShowAllocationPanel] = useState(false);
  
  // State metrics
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    p1Orders: 0,
    p2Orders: 0,
    avgPickingTime: 5,
    slaCompliance: 92,
    staffUtilization: 78
  });
  
  // State nhân sự
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
      maxCapacity: 10,
      currentLoad: 0
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
      maxCapacity: 8,
      currentLoad: 0
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
      maxCapacity: 8,
      currentLoad: 0
    }
  ]);
  
  // State phân bổ
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState('auto');
  const [autoAllocationEnabled, setAutoAllocationEnabled] = useState(true);
  const [allocationConfig, setAllocationConfig] = useState({
    autoAssignInterval: 5, // phút
    p1MaxPerStaff: 3,
    balanceWorkload: true,
    prioritizeLocation: true,
    reassignOnCompletion: true
  });
  
  // State SLA config
  const [slaConfig, setSlaConfig] = useState({
    p1Hours: 2,   // Dưới 2h = P1
    p2Hours: 4,   // Dưới 4h = P2
    p3Hours: 8,   // Dưới 8h = P3
    defaultSLA: 24, // Thời gian mặc định SLA (24h)
  });
  
  // State lịch sử hoạt động
  const [activityHistory, setActivityHistory] = useState([]);
  
  // State hiệu suất khu vực
  const [zonePerformance, setZonePerformance] = useState([
    { zone: "A", name: "Khu vực Vali", orders: 42, p1Count: 5, utilization: 85, staff: 4 },
    { zone: "B", name: "Khu vực Balo", orders: 35, p1Count: 3, utilization: 72, staff: 3 },
    { zone: "C", name: "Khu vực Phụ kiện", orders: 28, p1Count: 2, utilization: 65, staff: 2 },
    { zone: "HN", name: "Kho Hà Nội", orders: 40, p1Count: 2, utilization: 88, staff: 4 }
  ]);
  
  // Lấy và phân tích dữ liệu đơn hàng khi tải lên
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Đọc file
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });
      
      // Parse JSON
      const jsonData = JSON.parse(text);
      
      // Xác định cấu trúc file
      let orderData = [];
      if (jsonData.data && Array.isArray(jsonData.data)) {
        orderData = jsonData.data;
      } else if (Array.isArray(jsonData)) {
        orderData = jsonData;
      } else {
        throw new Error("Cấu trúc JSON không hợp lệ");
      }
      
      // Xử lý dữ liệu
      const processedOrders = processOrderData(orderData);
      setOrders(processedOrders);
      
      // Cập nhật số liệu thống kê
      updateDashboardStats(processedOrders);
      
      // Thêm vào lịch sử hoạt động
      addToActivityHistory({
        type: 'upload',
        timestamp: new Date().toISOString(),
        details: `Tải lên ${processedOrders.length} đơn hàng từ file ${file.name}`
      });
      
      // Tự động chọn tất cả đơn mới
      setSelectedOrders(processedOrders.map(order => order.id.toString()));
      
    } catch (error) {
      console.error("Lỗi khi xử lý file:", error);
      setUploadError(`Đã xảy ra lỗi khi tải lên: ${error.message}`);
      
      // Thêm vào lịch sử hoạt động
      addToActivityHistory({
        type: 'upload_error',
        timestamp: new Date().toISOString(),
        details: `Lỗi khi tải lên file ${file.name}: ${error.message}`
      });
    } finally {
      setIsUploading(false);
      event.target.value = null; // Reset file input
    }
  };
  
  // Xử lý và làm giàu dữ liệu đơn hàng
  const processOrderData = (rawOrders) => {
    return rawOrders.map(order => {
      // Thêm SLA dựa trên thời gian đặt đơn
      const sla = calculateSLA(order);
      
      // Phân tích sản phẩm để xác định loại và độ phức tạp
      const productInfo = analyzeProduct(order.detail || '');
      
      // Tính toán thời gian còn lại
      const timeLeft = calculateTimeLeft(order.date_order, sla);
      
      // Xác định vị trí kho nếu chưa có
      const location = order.ecom_recipient_code || generateRandomLocation();
      
      // Tính độ ưu tiên tổng thể
      const priority = calculatePriority(sla, timeLeft, productInfo);
      
      // Thêm trạng thái mặc định nếu chưa có
      const status = order.status || 'pending';
      
      return {
        ...order,
        sla,
        productType: productInfo.type,
        complexity: productInfo.count,
        timeLeft,
        location,
        priority,
        status,
      };
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
        code: 'P1',
        label: 'P1 - Gấp 🚀',
        color: 'bg-red-100 text-red-800 border-red-200',
        description: 'Cần xử lý ngay lập tức'
      };
    } else if (slaHours < slaConfig.p2Hours) {
      return {
        code: 'P2',
        label: 'P2 - Cảnh báo ⚠️',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'Không thể trì hoãn quá lâu'
      };
    } else if (slaHours < slaConfig.p3Hours) {
      return {
        code: 'P3',
        label: 'P3 - Bình thường ✅',
        color: 'bg-green-100 text-green-800 border-green-200',
        description: 'Xử lý theo lộ trình hợp lý'
      };
    } else {
      return {
        code: 'P4',
        label: 'P4 - Chờ xử lý 🕒',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Có thể lùi lại khi thuận tiện'
      };
    }
  };
  
  // Tính thời gian còn lại theo SLA
  const calculateTimeLeft = (orderDate, sla) => {
    if (!orderDate) return '00:00:00';
    
    const orderTime = new Date(orderDate);
    const now = new Date();
    
    // Thời gian SLA dựa trên mã SLA
    let slaHours = 24; // mặc định
    if (sla.code === 'P1') slaHours = slaConfig.p1Hours;
    else if (sla.code === 'P2') slaHours = slaConfig.p2Hours;
    else if (sla.code === 'P3') slaHours = slaConfig.p3Hours;
    
    // Tính deadline
    const deadline = new Date(orderTime);
    deadline.setHours(deadline.getHours() + slaHours);
    
    // Tính thời gian còn lại (giây)
    let timeLeftSecs = Math.max(0, Math.floor((deadline - now) / 1000));
    
    // Chuyển đổi giây sang định dạng HH:MM:SS
    const hours = Math.floor(timeLeftSecs / 3600);
    const minutes = Math.floor((timeLeftSecs % 3600) / 60);
    const seconds = timeLeftSecs % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  
  // Phân tích sản phẩm
  const analyzeProduct = (detail) => {
    if (!detail) return { count: 1, type: 'unknown' };
    
    // Đếm số loại sản phẩm dựa trên dấu phẩy
    const items = detail.split(',');
    
    // Xác định loại sản phẩm chính
    const detail_lower = detail.toLowerCase();
    let type = 'unknown';
    
    if (detail_lower.includes('vali')) type = 'vali';
    else if (detail_lower.includes('balo')) type = 'balo';
    else if (
      detail_lower.includes('tag') || 
      detail_lower.includes('cover') || 
      detail_lower.includes('kem') || 
      detail_lower.includes('túi')
    ) type = 'phụ kiện';
    
    return { count: items.length, type };
  };
  
  // Tính toán mức độ ưu tiên (0-100)
  const calculatePriority = (sla, timeLeft, productInfo) => {
    // Điểm cơ bản theo SLA
    let priority = 0;
    if (sla.code === 'P1') priority = 90;
    else if (sla.code === 'P2') priority = 70;
    else if (sla.code === 'P3') priority = 50;
    else priority = 30;
    
    // Điều chỉnh theo thời gian còn lại
    if (timeLeft) {
      const [hours, minutes] = timeLeft.split(':').map(Number);
      const timeLeftHours = hours + minutes/60;
      
      if (timeLeftHours < 1) priority += 10;
      else if (timeLeftHours < 2) priority += 5;
    }
    
    // Điều chỉnh theo độ phức tạp sản phẩm
    if (productInfo.count === 1) priority += 5;
    else if (productInfo.count > 3) priority -= 5;
    
    // Giới hạn trong phạm vi 0-100
    return Math.min(100, Math.max(0, priority));
  };
  
  // Tạo vị trí kho ngẫu nhiên cho demo
  const generateRandomLocation = () => {
    const zones = ['HN', '290', '300', '500'];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const section = String.fromCharCode(65 + Math.floor(Math.random() * 4));
    const aisle = String(Math.floor(Math.random() * 10)).padStart(2, '0');
    const bin = String.fromCharCode(65 + Math.floor(Math.random() * 8)) + 
                String(Math.floor(Math.random() * 8) + 1);
    
    return `${zone}-${section}-${aisle}-${bin}`;
  };
  
  // Cập nhật số liệu thống kê
  const updateDashboardStats = (ordersData) => {
    const p1Orders = ordersData.filter(o => o.sla?.code === 'P1').length;
    const p2Orders = ordersData.filter(o => o.sla?.code === 'P2').length;
    const pendingOrders = ordersData.filter(o => o.status === 'pending').length;
    const processingOrders = ordersData.filter(o => o.status === 'processing').length;
    const completedOrders = ordersData.filter(o => o.status === 'completed').length;
    
    setStats({
      totalOrders: ordersData.length,
      pendingOrders,
      processingOrders,
      completedOrders,
      p1Orders,
      p2Orders,
      avgPickingTime: 5,
      slaCompliance: 92,
      staffUtilization: 78
    });
  };
  
  // Thêm hoạt động vào lịch sử
  const addToActivityHistory = (activity) => {
    setActivityHistory(prev => [activity, ...prev]);
  };
  
  // Tự động phân bổ đơn hàng
  const autoAssignOrders = () => {
    setIsAutoAssigning(true);
    
    setTimeout(() => {
      // Lấy đơn chưa được gán và nhân viên sẵn sàng
      const unassignedOrders = orders.filter(o => 
        o.status === 'pending' && 
        !staff.some(s => s.assignedOrders.includes(o.id.toString()))
      );
      
      const availableStaff = staff.filter(s => 
        s.status === 'available' || s.assignedOrders.length < s.maxCapacity
      );
      
      if (unassignedOrders.length === 0 || availableStaff.length === 0) {
        setIsAutoAssigning(false);
        return;
      }
      
      // Sắp xếp đơn theo độ ưu tiên
      const sortedOrders = [...unassignedOrders].sort((a, b) => {
        // P1 luôn ưu tiên cao nhất
        if (a.sla?.code === 'P1' && b.sla?.code !== 'P1') return -1;
        if (a.sla?.code !== 'P1' && b.sla?.code === 'P1') return 1;
        
        // Tiếp theo là P2
        if (a.sla?.code === 'P2' && b.sla?.code !== 'P2') return -1;
        if (a.sla?.code !== 'P2' && b.sla?.code === 'P2') return 1;
        
        // Sau đó là P3
        if (a.sla?.code === 'P3' && b.sla?.code !== 'P3') return -1;
        if (a.sla?.code !== 'P3' && b.sla?.code === 'P3') return 1;
        
        // Tiếp theo là độ phức tạp (ưu tiên đơn đơn giản)
        if (a.complexity !== b.complexity) return a.complexity - b.complexity;
        
        // Cuối cùng là thời gian còn lại
        return a.priority - b.priority;
      });
      
      // Bản đồ phân bổ mới
      const newStaffState = [...staff];
      const newOrdersState = [...orders];
      let assignedCount = 0;
      
      // Duyệt qua từng đơn hàng theo thứ tự ưu tiên
      sortedOrders.forEach(order => {
        // Tìm nhân viên phù hợp nhất
        const bestStaff = findBestStaffForOrder(order, newStaffState);
        
        if (bestStaff) {
          const staffIndex = newStaffState.findIndex(s => s.id === bestStaff.id);
          
          // Cập nhật trạng thái nhân viên
          newStaffState[staffIndex] = {
            ...bestStaff,
            status: 'busy',
            currentOrder: bestStaff.currentOrder || order.id.toString(),
            assignedOrders: [...bestStaff.assignedOrders, order.id.toString()],
            currentLoad: bestStaff.currentLoad + 1
          };
          
          // Cập nhật trạng thái đơn hàng
          const orderIndex = newOrdersState.findIndex(o => o.id === order.id);
          if (orderIndex !== -1) {
            newOrdersState[orderIndex] = {
              ...newOrdersState[orderIndex],
              status: 'processing',
              assignedTo: bestStaff.id
            };
          }
          
          assignedCount++;
          
          // Thêm vào lịch sử hoạt động
          addToActivityHistory({
            type: 'auto_assign',
            orderId: order.id,
            orderName: order.name || order.id,
            staffId: bestStaff.id,
            staffName: bestStaff.name,
            timestamp: new Date().toISOString(),
            details: `Tự động gán đơn ${order.name || order.id} cho ${bestStaff.name}`
          });
        }
      });
      
      // Cập nhật state
      setStaff(newStaffState);
      setOrders(newOrdersState);
      
      // Thông báo kết quả
      if (assignedCount > 0) {
        alert(`Đã phân bổ thành công ${assignedCount} đơn hàng`);
      } else {
        alert('Không có đơn hàng nào được phân bổ');
      }
      
      setIsAutoAssigning(false);
    }, 1000);
  };
  
  // Tìm nhân viên phù hợp nhất cho đơn hàng
  const findBestStaffForOrder = (order, staffList) => {
    // Tính điểm phù hợp cho mỗi nhân viên
    const staffScores = staffList
      .filter(s => s.currentLoad < s.maxCapacity) // Chỉ lấy nhân viên còn capacity
      .map(s => {
        const compatibility = checkStaffOrderCompatibility(s, order);
        if (!compatibility.compatible) return { staff: s, score: -1 };
        
        let score = 0;
        
        // Điểm cho hiệu suất
        score += s.efficiency / 10; // max 10
        
        // Điểm cho khu vực
        const orderZone = order.location?.split('-')[0] || '';
        if (orderZone && s.area) {
          if (s.area === orderZone) score += 5;
          if (s.area === 'HN') score += 3; // Trưởng ca làm mọi khu vực nhưng ưu tiên thấp hơn
        }
        
        // Điểm cho kỹ năng phù hợp
        if (s.skills.includes(order.productType)) score += 3;
        
        // Trừ điểm nếu đã có nhiều đơn
        score -= s.currentLoad;
        
        // Ưu tiên nhân viên xử lý P1 cho đơn P1
        if (order.sla?.code === 'P1' && s.handlingP1) score += 10;
        
        return { staff: s, score };
      })
      .filter(item => item.score >= 0) // Loại bỏ nhân viên không phù hợp
      .sort((a, b) => b.score - a.score); // Sắp xếp theo điểm cao nhất
    
    return staffScores.length > 0 ? staffScores[0].staff : null;
  };
  
  // Kiểm tra khả năng phù hợp của nhân viên với đơn hàng
  const checkStaffOrderCompatibility = (staff, order) => {
    // Nếu là đơn P1, chỉ nhân viên xử lý P1 mới được gán
    if (order.sla?.code === 'P1' && !staff.handlingP1) {
      return { compatible: false, reason: 'Không xử lý đơn P1' };
    }
    
    // Kiểm tra phù hợp về khu vực
    const orderZone = order.location?.split('-')[0] || '';
    if (orderZone && staff.area && allocationConfig.prioritizeLocation) {
      // Ưu tiên nhân viên cùng khu vực
      if (staff.area !== orderZone && staff.area !== 'HN') {
        return { compatible: false, reason: 'Khác khu vực' };
      }
    }
    
    // Kiểm tra khả năng xử lý đơn nhiều sản phẩm
    if (order.complexity > 2 && staff.efficiency < 90) {
      return { compatible: false, reason: 'Không đủ hiệu suất cho đơn phức tạp' };
    }
    
    // Kiểm tra có kỹ năng phù hợp không
    if (staff.skills.length > 0) {
      if (
        (order.productType === 'vali' && !staff.skills.includes('vali')) ||
        (order.productType === 'balo' && !staff.skills.includes('balo')) ||
        (order.productType === 'phụ kiện' && !staff.skills.includes('phụ kiện'))
      ) {
        return { compatible: false, reason: 'Không có kỹ năng phù hợp' };
      }
    }
    
    return { compatible: true, reason: '' };
  };
  
  // Cập nhật dữ liệu theo thời gian thực
  const refreshData = () => {
    setRefreshing(true);
    
    setTimeout(() => {
      // Cập nhật thời gian còn lại của đơn hàng
      setOrders(prevOrders => {
        return prevOrders.map(order => {
          // Bỏ qua đơn đã hoàn thành
          if (order.status === 'completed') return order;
          
          // Cập nhật thời gian còn lại
          let timeLeft = order.timeLeft;
          if (timeLeft) {
            const [hours, minutes, seconds] = timeLeft.split(':').map(Number);
            let totalSeconds = hours * 3600 + minutes * 60 + seconds - 30;
            
            if (totalSeconds <= 0) {
              // Thời gian hết, tự động nâng mức độ ưu tiên
              if (order.sla?.code === 'P2') {
                return {
                  ...order,
                  timeLeft: '00:00:00',
                  sla: {
                    code: 'P1',
                    label: 'P1 - Gấp 🚀',
                    color: 'bg-red-100 text-red-800 border-red-200',
                    description: 'Cần xử lý ngay lập tức'
                  },
                  priority: Math.min(100, order.priority + 10)
                };
              }
              
              return {
                ...order,
                timeLeft: '00:00:00',
                priority: Math.min(100, order.priority + 5)
              };
            }
            
            const newHours = Math.floor(totalSeconds / 3600);
            const newMinutes = Math.floor((totalSeconds % 3600) / 60);
            const newSeconds = totalSeconds % 60;
            
            timeLeft = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
          }
          
          return {
            ...order,
            timeLeft
          };
        });
      });
      
      // Cập nhật số liệu thống kê - chỉ cập nhật không thay thế
      updateDashboardStats(orders);
      
      // Mô phỏng tiến trình xử lý đơn của nhân viên
      simulateOrderProcessing();
      
      // Thêm log vào lịch sử hoạt động
      addToActivityHistory({
        type: 'auto_refresh',
        timestamp: new Date().toISOString(),
        details: `Tự động cập nhật dữ liệu (${new Date().toLocaleTimeString()})`
      });
      
      setRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };
  
  // Mô phỏng xử lý đơn hàng đang diễn ra
  const simulateOrderProcessing = () => {
    // Biến flag để kiểm soát có cập nhật hay không
    let hasChanges = false;
    
    // Xử lý ngẫu nhiên một số đơn đang trong trạng thái processing
    setOrders(prevOrders => {
      const newOrders = [...prevOrders];
      
      // Tìm đơn đang được xử lý
      const processingOrders = newOrders.filter(o => o.status === 'processing');
      
      // Hoàn thành ngẫu nhiên một số đơn (tối đa 10% số đơn đang xử lý)
      const maxCompletions = Math.max(1, Math.floor(processingOrders.length * 0.1));
      const completionsCount = Math.floor(Math.random() * maxCompletions);
      
      // Chọn ngẫu nhiên các đơn để hoàn thành
      if (completionsCount > 0 && processingOrders.length > 0) {
        // Xáo trộn mảng đơn đang xử lý
        const shuffled = [...processingOrders].sort(() => 0.5 - Math.random());
        
        // Lấy số lượng đơn cần hoàn thành
        const toComplete = shuffled.slice(0, completionsCount);
        
        // Cập nhật trạng thái các đơn đã chọn
        toComplete.forEach(order => {
          const orderIndex = newOrders.findIndex(o => o.id === order.id);
          if (orderIndex !== -1) {
            newOrders[orderIndex] = {
              ...order,
              status: 'completed'
            };
            hasChanges = true;
            
            // Cập nhật trạng thái nhân viên
            setStaff(prevStaff => {
              const newStaff = [...prevStaff];
              const staffIndex = newStaff.findIndex(s => s.id === order.assignedTo);
              
              if (staffIndex !== -1) {
                const staffMember = newStaff[staffIndex];
                const newAssignedOrders = staffMember.assignedOrders.filter(
                  id => id !== order.id.toString()
                );
                
                newStaff[staffIndex] = {
                  ...staffMember,
                  assignedOrders: newAssignedOrders,
                  currentOrder: newAssignedOrders.length > 0 ? newAssignedOrders[0] : null,
                  status: newAssignedOrders.length > 0 ? 'busy' : 'available',
                  currentLoad: Math.max(0, staffMember.currentLoad - 1)
                };
              }
              
              return newStaff;
            });
            
            // Thêm vào lịch sử hoạt động
            const staffMember = staff.find(s => s.id === order.assignedTo);
            if (staffMember) {
              addToActivityHistory({
                type: 'order_completed',
                orderId: order.id,
                orderName: order.name || order.id,
                staffId: staffMember.id,
                staffName: staffMember.name,
                timestamp: new Date().toISOString(),
                details: `${staffMember.name} đã hoàn thành đơn ${order.name || order.id}`
              });
            }
          }
        });
      }
      
      return newOrders;
    });
    
    // Nếu có sự thay đổi, tự động gán đơn mới cho nhân viên đã rảnh
    if (hasChanges && autoAllocationEnabled && Math.random() > 0.7) {
      setTimeout(() => {
        autoAssignOrders();
      }, 1000);
    }
  };
  
  // Tự động cập nhật theo thời gian thực
  useEffect(() => {
    if (autoRefresh) {
      const id = setInterval(refreshData, 30000); // 30 giây
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [autoRefresh]);
  
  // Tự động phân bổ đơn hàng
  useEffect(() => {
    if (autoAllocationEnabled && orders.length > 0) {
      const timer = setTimeout(() => {
        // Kiểm tra có đơn nào chưa được phân bổ không
        const pendingOrders = orders.filter(o => o.status === 'pending');
        if (pendingOrders.length > 0) {
          autoAssignOrders();
        }
      }, allocationConfig.autoAssignInterval * 60 * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoAllocationEnabled, orders, lastUpdated]);
  
  // Xử lý khi click vào nút in đơn
  const handlePrintOrders = (type) => {
    if (selectedOrders.length === 0) return;
    
    setPrintType(type);
    setShowPrintModal(true);
  };
  
  // Tạo URL in đơn
  const generatePrintUrl = () => {
    const baseUrl = printType === 'order' 
      ? 'https://one.tga.com.vn/so/invoicePrint?id=' 
      : 'https://one.tga.com.vn/so/prepare?id=';
    
    return baseUrl + selectedOrders.join(',');
  };
  
  // Toggle chọn đơn hàng
  const toggleOrderSelection = (orderId) => {
    if (selectedOrders.includes(orderId.toString())) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId.toString()));
    } else {
      setSelectedOrders([...selectedOrders, orderId.toString()]);
    }
  };
  
  // Toggle chọn tất cả đơn hàng
  const toggleSelectAll = () => {
    const filteredOrders = getFilteredOrders();
    
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id.toString()));
    }
  };
  
  // Lọc danh sách đơn hàng
  const getFilteredOrders = () => {
    if (!orders || orders.length === 0) return [];
    
    return orders.filter(order => {
      // Lọc theo mức độ ưu tiên SLA
      if (selectedPriority !== 'all' && order.sla?.code !== selectedPriority) {
        return false;
      }
      
      // Lọc theo kênh bán hàng
      if (selectedChannel !== 'all') {
        if (!order.customer) return false;
        if (order.customer.toLowerCase() !== selectedChannel.toLowerCase()) {
          return false;
        }
      }
      
      // Lọc theo khu vực
      if (selectedLocation !== 'all') {
        const orderLocation = order.location?.split('-')[0] || '';
        if (orderLocation !== selectedLocation) {
          return false;
        }
      }
      
      // Tìm kiếm
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          String(order.id).includes(searchLower) ||
          (order.name && order.name.toLowerCase().includes(searchLower)) ||
          (order.customer && order.customer.toLowerCase().includes(searchLower)) ||
          (order.shipment_code && order.shipment_code.toLowerCase().includes(searchLower)) ||
          (order.detail && order.detail.toLowerCase().includes(searchLower)) ||
          (order.address && order.address.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    }).sort((a, b) => {
      const directionMultiplier = sortDirection === 'asc' ? 1 : -1;
      
      // QUAN TRỌNG: Luôn ưu tiên đơn P1 đầu tiên, sau đó mới áp dụng chiến lược khác
      if (a.sla?.code === 'P1' && b.sla?.code !== 'P1') return -1;
      if (a.sla?.code !== 'P1' && b.sla?.code === 'P1') return 1;
      
      switch (pickingStrategy) {
        case 'priority':
          // Sắp xếp theo mức độ ưu tiên
          return (b.priority - a.priority) * directionMultiplier;
          
        case 'single_product':
          // Đơn 1 sản phẩm trước, sau đó đến đơn nhiều sản phẩm
          if (a.complexity !== b.complexity) {
            return (a.complexity - b.complexity) * directionMultiplier;
          }
          // Nếu số lượng sản phẩm bằng nhau, ưu tiên theo SLA
          return (b.priority - a.priority) * directionMultiplier;
          
        case 'location':
          // Sắp xếp theo vị trí trong kho
          const locA = a.location || '';
          const locB = b.location || '';
          
          // Ưu tiên cùng khu vực
          const zoneA = locA.split('-')[0] || '';
          const zoneB = locB.split('-')[0] || '';
          
          if (zoneA !== zoneB) {
            return zoneA.localeCompare(zoneB) * directionMultiplier;
          }
          
          // Nếu cùng khu vực, ưu tiên theo SLA
          return (b.priority - a.priority) * directionMultiplier;
          
        case 'product_type':
          // Sắp xếp theo loại sản phẩm
          if (a.productType !== b.productType) {
            return a.productType.localeCompare(b.productType) * directionMultiplier;
          }
          
          // Nếu cùng loại sản phẩm, sắp xếp theo SLA
          return (b.priority - a.priority) * directionMultiplier;
          
        default:
          // Mặc định sắp xếp theo mức độ ưu tiên
          return (b.priority - a.priority) * directionMultiplier;
      }
    });
  };
  
  // Phân bổ đơn cho nhân viên cụ thể (thủ công)
  const assignOrderToStaff = (orderId, staffId) => {
    // Tìm đơn hàng và nhân viên
    const order = orders.find(o => o.id.toString() === orderId.toString());
    const staffMember = staff.find(s => s.id === staffId);
    
    if (!order || !staffMember) return;
    
    // Kiểm tra tính phù hợp
    const compatibility = checkStaffOrderCompatibility(staffMember, order);
    if (!compatibility.compatible) {
      alert(`Không thể gán đơn cho nhân viên này: ${compatibility.reason}`);
      return;
    }
    
    // Cập nhật trạng thái đơn hàng
    setOrders(prevOrders => {
      return prevOrders.map(o => {
        if (o.id.toString() === orderId.toString()) {
          return {
            ...o,
            status: 'processing',
            assignedTo: staffId
          };
        }
        return o;
      });
    });
    
    // Cập nhật trạng thái nhân viên
    setStaff(prevStaff => {
      return prevStaff.map(s => {
        if (s.id === staffId) {
          return {
            ...s,
            status: 'busy',
            currentOrder: s.currentOrder || orderId.toString(),
            assignedOrders: [...s.assignedOrders, orderId.toString()],
            currentLoad: s.currentLoad + 1
          };
        }
        return s;
      });
    });
    
    // Ghi log hoạt động
    addToActivityHistory({
      type: 'manual_assign',
      orderId,
      orderName: order.name || order.id,
      staffId,
      staffName: staffMember.name,
      timestamp: new Date().toISOString(),
      details: `Gán thủ công đơn ${order.name || order.id} cho ${staffMember.name}`
    });
  };
  
  // Hủy gán đơn cho nhân viên
  const unassignOrderFromStaff = (orderId, staffId) => {
    // Tìm đơn hàng và nhân viên
    const order = orders.find(o => o.id.toString() === orderId.toString());
    const staffMember = staff.find(s => s.id === staffId);
    
    if (!order || !staffMember) return;
    
    // Cập nhật trạng thái đơn hàng
    setOrders(prevOrders => {
      return prevOrders.map(o => {
        if (o.id.toString() === orderId.toString()) {
          return {
            ...o,
            status: 'pending',
            assignedTo: null
          };
        }
        return o;
      });
    });
    
    // Cập nhật trạng thái nhân viên
    setStaff(prevStaff => {
      return prevStaff.map(s => {
        if (s.id === staffId) {
          const newAssignedOrders = s.assignedOrders.filter(
            id => id !== orderId.toString()
          );
          
          return {
            ...s,
            currentOrder: newAssignedOrders.length > 0 ? newAssignedOrders[0] : null,
            assignedOrders: newAssignedOrders,
            status: newAssignedOrders.length > 0 ? 'busy' : 'available',
            currentLoad: Math.max(0, s.currentLoad - 1)
          };
        }
        return s;
      });
    });
    
    // Ghi log hoạt động
    addToActivityHistory({
      type: 'unassign',
      orderId,
      orderName: order.name || order.id,
      staffId,
      staffName: staffMember.name,
      timestamp: new Date().toISOString(),
      details: `Hủy gán đơn ${order.name || order.id} khỏi ${staffMember.name}`
    });
  };
  
  // Hoàn thành đơn hàng
  const completeOrder = (orderId) => {
    // Tìm đơn hàng
    const order = orders.find(o => o.id.toString() === orderId.toString());
    if (!order) return;
    
    // Tìm nhân viên được gán đơn này
    const staffMember = staff.find(s => 
      s.assignedOrders.includes(orderId.toString())
    );
    
    // Cập nhật trạng thái đơn hàng
    setOrders(prevOrders => {
      return prevOrders.map(o => {
        if (o.id.toString() === orderId.toString()) {
          return {
            ...o,
            status: 'completed'
          };
        }
        return o;
      });
    });
    
    // Cập nhật trạng thái nhân viên nếu có
    if (staffMember) {
      setStaff(prevStaff => {
        return prevStaff.map(s => {
          if (s.id === staffMember.id) {
            const newAssignedOrders = s.assignedOrders.filter(
              id => id !== orderId.toString()
            );
            
            return {
              ...s,
              currentOrder: newAssignedOrders.length > 0 ? newAssignedOrders[0] : null,
              assignedOrders: newAssignedOrders,
              status: newAssignedOrders.length > 0 ? 'busy' : 'available',
              currentLoad: Math.max(0, s.currentLoad - 1)
            };
          }
          return s;
        });
      });
      
      // Ghi log hoạt động
      addToActivityHistory({
        type: 'complete',
        orderId,
        orderName: order.name || order.id,
        staffId: staffMember.id,
        staffName: staffMember.name,
        timestamp: new Date().toISOString(),
        details: `${staffMember.name} đã hoàn thành đơn ${order.name || order.id}`
      });
    }
  };
  
  // Công cụ điều hướng nhanh
  const QuickNav = () => (
    <div className="bg-white shadow-sm border-b py-2 px-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1 rounded text-sm flex items-center ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
        >
          <BarChart2 className="h-4 w-4 mr-1" />
          <span>Dashboard</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1 rounded text-sm flex items-center ${activeTab === 'orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
        >
          <Package className="h-4 w-4 mr-1" />
          <span>Đơn hàng</span>
          {stats.p1Orders > 0 && (
            <span className="ml-1 bg-red-100 text-red-800 text-xs px-1 rounded-full">
              {stats.p1Orders}
            </span>
          )}
        </button>
        
        <button 
          onClick={() => setActiveTab('staff')}
          className={`px-3 py-1 rounded text-sm flex items-center ${activeTab === 'staff' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
        >
          <Users className="h-4 w-4 mr-1" />
          <span>Nhân sự</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1 rounded text-sm flex items-center ${activeTab === 'history' ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}`}
        >
          <History className="h-4 w-4 mr-1" />
          <span>Lịch sử</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="text-xs text-gray-500">
          Cập nhật: {lastUpdated.toLocaleTimeString()}
        </div>
        
        <button
          className={`px-2 py-1 rounded text-xs flex items-center ${refreshing ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-700'}`}
          onClick={refreshData}
          disabled={refreshing}
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
        
        <label className="flex items-center cursor-pointer">
          <span className="text-xs mr-1">Auto</span>
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={autoRefresh}
              onChange={() => setAutoRefresh(!autoRefresh)}
            />
            <div className="w-8 h-4 bg-gray-200 peer-checked:bg-blue-500 rounded-full transition-colors"></div>
            <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transform peer-checked:translate-x-4 transition-transform"></div>
          </div>
        </label>
      </div>
    </div>
  );
  
  // Hiển thị Dashboard chính
  const DashboardArea = () => (
    <div className="space-y-4">
      <DashboardHeader />
      <SLAConfigPanel />
      <DashboardMetrics />
      {showAllocationPanel && <AllocationPanel />}
      
      {/* Biểu đồ và thông tin trực quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Theo dõi đơn P1 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium mb-3 flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
            Đơn P1 cần xử lý gấp
          </h3>
          
          <div className="space-y-2">
            {orders
              .filter(o => o.sla?.code === 'P1' && o.status !== 'completed')
              .sort((a, b) => {
                // Ưu tiên đơn chưa được gán
                if (!a.assignedTo && b.assignedTo) return -1;
                if (a.assignedTo && !b.assignedTo) return 1;
                
                // Sau đó sắp xếp theo thời gian còn lại
                const [aHours, aMinutes] = a.timeLeft.split(':').map(Number);
                const [bHours, bMinutes] = b.timeLeft.split(':').map(Number);
                
                const aMinutesTotal = aHours * 60 + aMinutes;
                const bMinutesTotal = bHours * 60 + bMinutes;
                
                return aMinutesTotal - bMinutesTotal;
              })
              .slice(0, 5)
              .map(order => (
                <div key={order.id} className="p-2 border border-red-100 rounded-lg bg-red-50">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">{order.name || order.id}</div>
                    <div className="text-xs text-red-600 font-medium">{order.timeLeft}</div>
                  </div>
                  
                  <div className="text-xs text-gray-600 mt-1 truncate">
                    {order.detail}
                  </div>
                  
                  <div className="mt-2 flex justify-between text-xs">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                      <span>{order.location}</span>
                    </div>
                    
                    <div>
                      {order.assignedTo ? (
                        <span className="text-green-600">
                          {staff.find(s => s.id === order.assignedTo)?.name || `NV${order.assignedTo}`}
                        </span>
                      ) : (
                        <span className="text-red-600">Chưa phân công</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            
            {orders.filter(o => o.sla?.code === 'P1' && o.status !== 'completed').length === 0 && (
              <div className="text-center py-4 text-sm text-gray-500">
                Không có đơn P1 cần xử lý gấp
              </div>
            )}
          </div>
        </div>
        
        {/* Thống kê theo khu vực */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium mb-3 flex items-center">
            <MapPin className="h-4 w-4 text-blue-500 mr-1" />
            Phân bố theo khu vực
          </h3>
          
          <div className="space-y-3">
            {zonePerformance.map((zone, index) => (
              <div key={index} className="border rounded-lg p-2">
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm font-medium">Khu {zone.zone}</div>
                    <div className="text-xs text-gray-500">{zone.name}</div>
                  </div>
                  <div className="text-sm font-medium">
                    {zone.orders} đơn
                    {zone.p1Count > 0 && (
                      <span className="ml-1 text-xs bg-red-100 text-red-800 px-1 rounded">
                        {zone.p1Count} P1
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Tải khu vực:</span>
                    <span>{zone.utilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        zone.utilization > 90
                          ? 'bg-red-500'
                          : zone.utilization > 75
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${zone.utilization}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  {zone.staff} nhân viên làm việc tại khu vực
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Hiệu suất nhân viên */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium mb-3 flex items-center">
            <User className="h-4 w-4 text-green-500 mr-1" />
            Hiệu suất nhân viên
          </h3>
          
          <div className="space-y-2">
            {staff
              .sort((a, b) => b.efficiency - a.efficiency)
              .map(staffMember => (
                <div key={staffMember.id} className="p-2 border rounded-lg">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">{staffMember.name}</div>
                    <div className="text-sm">{staffMember.efficiency}%</div>
                  </div>
                  
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        staffMember.efficiency >= 95
                          ? 'bg-green-500'
                          : staffMember.efficiency >= 90
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${staffMember.efficiency}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <div>Đã xử lý: {staffMember.orderCount} đơn</div>
                    <div>
                      Hiện tại: {staffMember.assignedOrders.length} đơn
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      
      {/* Đơn hàng gần đây */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Đơn hàng gần đây</h3>
          <button
            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded flex items-center"
            onClick={() => setActiveTab('orders')}
          >
            <Package className="h-3 w-3 mr-1" />
            <span>Xem tất cả</span>
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
                  Sản phẩm
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders
                .sort((a, b) => {
                  // Ưu tiên P1 trước
                  if (a.sla?.code === 'P1' && b.sla?.code !== 'P1') return -1;
                  if (a.sla?.code !== 'P1' && b.sla?.code === 'P1') return 1;
                  
                  // Sau đó là độ ưu tiên
                  return b.priority - a.priority;
                })
                .slice(0, 5)
                .map(order => (
                  <tr key={order.id} className={order.sla?.code === 'P1' ? 'bg-red-50' : ''}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.name || order.id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customer}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${order.sla?.color}`}>
                        {order.sla?.code}
                      </span>
                      <div className="text-xs mt-1">{order.timeLeft}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-sm truncate max-w-xs">
                        {order.detail}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      {order.location}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span 
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status === 'completed' 
                          ? 'Hoàn thành' 
                          : order.status === 'processing' 
                            ? 'Đang xử lý' 
                            : 'Chờ xử lý'
                        }
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {order.status !== 'completed' && (
                          <>
                            <button
                              className="p-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                              onClick={() => handlePrintOrders('order')}
                              title="In đơn hàng"
                            >
                              <Printer className="h-3 w-3" />
                            </button>
                            <button
                              className="p-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                              onClick={() => handlePrintOrders('picking')}
                              title="Soạn hàng"
                            >
                              <Clipboard className="h-3 w-3" />
                            </button>
                          </>
                        )}
                        {order.status === 'processing' && (
                          <button
                            className="p-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                            onClick={() => completeOrder(order.id)}
                            title="Hoàn thành"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-3 py-4 text-center text-sm text-gray-500">
                      Không có đơn hàng nào
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
  // Phần Header Dashboard
  const DashboardHeader = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Quản lý SLA & Phân bổ đơn hàng</h1>
          <p className="text-sm text-gray-500">Hiệu suất kho vận và tối ưu quy trình xử lý</p>
        </div>
        
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
            className={`px-3 py-1.5 rounded text-sm flex items-center ${
              showAllocationPanel ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'
            }`}
            onClick={() => setShowAllocationPanel(!showAllocationPanel)}
          >
            <Zap className="h-4 w-4 mr-1" />
            <span>{showAllocationPanel ? 'Ẩn phân bổ' : 'Phân bổ đơn'}</span>
          </button>
          
          <button
            className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-sm rounded text-blue-700 hover:bg-blue-100 flex items-center"
            onClick={() => setShowSLAConfig(!showSLAConfig)}
          >
            <Settings className="h-4 w-4 mr-1" />
            <span>Cấu hình SLA</span>
          </button>
        </div>
      </div>
    </div>
  );
  
  // Các thẻ Metrics tổng quan
  const DashboardMetrics = () => (
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
          {stats.pendingOrders} chờ xử lý • {stats.processingOrders} đang xử lý • {stats.completedOrders} hoàn thành
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500 mb-1">Đơn P1 (gấp)</div>
            <div className="text-2xl font-bold text-red-600">{stats.p1Orders}</div>
          </div>
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {stats.p1Orders > 0 ? `${Math.round(stats.p1Orders / stats.totalOrders * 100)}% tổng đơn cần xử lý gấp` : 'Không có đơn P1 cần xử lý gấp'}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500 mb-1">Thời gian lấy TB</div>
            <div className="text-2xl font-bold">{stats.avgPickingTime} phút</div>
          </div>
          <Clock className="h-6 w-6 text-yellow-500" />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {stats.slaCompliance}% đơn đạt SLA
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500 mb-1">Tải nhân sự</div>
            <div className="text-2xl font-bold">{stats.staffUtilization}%</div>
          </div>
          <User className="h-6 w-6 text-green-500" />
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${
              stats.staffUtilization > 90
                ? 'bg-red-500'
                : stats.staffUtilization > 75
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
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
                  Math.max(1, stats.totalOrders)) *
                  100
              )}%
            </div>
          </div>
          <Activity className="h-6 w-6 text-purple-500" />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          P2: {stats.p2Orders} đơn đang xử lý
        </div>
      </div>
    </div>
  );
  
  // Phần cấu hình SLA
  const SLAConfigPanel = () => (
    <div className={`mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg transition-all duration-300 ${showSLAConfig ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-blue-800">Cấu hình khung thời gian SLA</h3>
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => setShowSLAConfig(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
        <div>
          <label className="text-xs text-blue-700 block mb-1">
            P1 - Gấp (dưới x giờ):
          </label>
          <input
            type="number"
            min="0.5"
            max="5"
            step="0.5"
            value={slaConfig.p1Hours}
            onChange={(e) => setSlaConfig({
              ...slaConfig,
              p1Hours: parseFloat(e.target.value)
            })}
            className="w-full border border-blue-200 rounded px-2 py-1 text-sm"
          />
          <div className="mt-1 text-xs text-blue-600 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
            <span>P1: Cần xử lý ngay lập tức</span>
          </div>
        </div>

        <div>
          <label className="text-xs text-blue-700 block mb-1">
            P2 - Cảnh báo (dưới x giờ):
          </label>
          <input
            type="number"
            min="1"
            max="8"
            step="0.5"
            value={slaConfig.p2Hours}
            onChange={(e) => setSlaConfig({
              ...slaConfig,
              p2Hours: parseFloat(e.target.value)
            })}
            className="w-full border border-blue-200 rounded px-2 py-1 text-sm"
          />
          <div className="mt-1 text-xs text-blue-600 flex items-center">
            <Clock className="h-3 w-3 mr-1 text-yellow-500" />
            <span>P2: Không thể trì hoãn quá lâu</span>
          </div>
        </div>

        <div>
          <label className="text-xs text-blue-700 block mb-1">
            P3 - Bình thường (dưới x giờ):
          </label>
          <input
            type="number"
            min="2"
            max="12"
            step="0.5"
            value={slaConfig.p3Hours}
            onChange={(e) => setSlaConfig({
              ...slaConfig,
              p3Hours: parseFloat(e.target.value)
            })}
            className="w-full border border-blue-200 rounded px-2 py-1 text-sm"
          />
          <div className="mt-1 text-xs text-blue-600 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
            <span>P3: Xử lý theo lộ trình hợp lý</span>
          </div>
        </div>

        <div>
          <label className="text-xs text-blue-700 block mb-1">
            Thời gian SLA mặc định (giờ):
          </label>
          <input
            type="number"
            min="8"
            max="72"
            value={slaConfig.defaultSLA}
            onChange={(e) => setSlaConfig({
              ...slaConfig,
              defaultSLA: parseInt(e.target.value)
            })}
            className="w-full border border-blue-200 rounded px-2 py-1 text-sm"
          />
          <div className="mt-1 text-xs text-blue-600 flex items-center">
            <Calendar className="h-3 w-3 mr-1 text-blue-500" />
            <span>Thời gian mặc định cho mỗi đơn</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="text-xs text-blue-700 italic">
          Thay đổi cấu hình SLA sẽ tính toán lại mức độ ưu tiên cho tất cả đơn hàng hiện có.
        </div>
        
        <button
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded"
          onClick={() => {
            // Tính toán lại SLA cho tất cả đơn
            if (orders.length > 0) {
              const updatedOrders = orders.map(order => {
                const sla = calculateSLA(order);
                const timeLeft = calculateTimeLeft(order.date_order, sla);
                const priority = calculatePriority(sla, timeLeft, { count: order.complexity, type: order.productType });
                
                return {
                  ...order,
                  sla,
                  timeLeft,
                  priority
                };
              });
              
              setOrders(updatedOrders);
              updateDashboardStats(updatedOrders);
              
              // Ghi log hoạt động
              addToActivityHistory({
                type: 'sla_config_update',
                timestamp: new Date().toISOString(),
                details: `Cập nhật cấu hình SLA: P1=${slaConfig.p1Hours}h, P2=${slaConfig.p2Hours}h, P3=${slaConfig.p3Hours}h, Default=${slaConfig.defaultSLA}h`
              });
              
              setShowSLAConfig(false);
            }
          }}
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
  
  // Giao diện phân bổ đơn hàng
  const AllocationPanel = () => (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Phân bổ đơn hàng</h3>
          
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 text-xs rounded flex items-center ${
                isAutoAssigning
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
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
            
            <button
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center"
              onClick={() => setShowAllocationPanel(false)}
            >
              <X className="h-3 w-3 mr-1" />
              <span>Đóng</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Thống kê tổng quan */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 border rounded bg-blue-50">
              <div className="text-xs text-gray-500">Chờ phân bổ</div>
              <div className="text-lg font-medium">
                {orders.filter(o => o.status === 'pending').length}
              </div>
            </div>
            
            <div className="p-2 border rounded bg-yellow-50">
              <div className="text-xs text-gray-500">Đang xử lý</div>
              <div className="text-lg font-medium">
                {orders.filter(o => o.status === 'processing').length}
              </div>
            </div>
            
            <div className="p-2 border rounded bg-green-50">
              <div className="text-xs text-gray-500">Đã hoàn thành</div>
              <div className="text-lg font-medium">
                {orders.filter(o => o.status === 'completed').length}
              </div>
            </div>
          </div>
          
          {/* Danh sách đơn ưu tiên cần phân bổ */}
          <div className="border rounded overflow-x-auto">
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
                    Sản phẩm
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vị trí
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phân công
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders
                  .filter(o => o.status === 'pending')
                  .sort((a, b) => {
                    // Ưu tiên P1 trước
                    if (a.sla?.code === 'P1' && b.sla?.code !== 'P1') return -1;
                    if (a.sla?.code !== 'P1' && b.sla?.code === 'P1') return 1;
                    
                    // Sau đó là độ ưu tiên
                    return b.priority - a.priority;
                  })
                  .slice(0, 10) // Giới hạn 10 đơn để hiển thị
                  .map(order => (
                    <tr key={order.id} className={order.sla?.code === 'P1' ? 'bg-red-50' : ''}>
                      <td className="px-3 py-2 whitespace-nowrap text-xs">
                        <div className="font-medium">{order.name || order.id}</div>
                        <div className="text-gray-500">{order.customer}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${order.sla?.color}`}>
                          {order.sla?.code}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{order.timeLeft}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs">
                        <div className="truncate max-w-xs">{order.detail}</div>
                        <div className="flex mt-1">
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {order.productType}
                          </span>
                          <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {order.complexity} SP
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs">
                        {order.location}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <select
                          className="w-full text-xs border border-gray-200 rounded py-1 px-2"
                          onChange={(e) => assignOrderToStaff(order.id, parseInt(e.target.value))}
                          defaultValue=""
                        >
                          <option value="" disabled>Chọn nhân viên</option>
                          {staff
                            .filter(s => s.currentLoad < s.maxCapacity)
                            .map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.currentLoad}/{s.maxCapacity})
                              </option>
                            ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  
                {orders.filter(o => o.status === 'pending').length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-500">
                      Không có đơn hàng nào đang chờ phân bổ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-medium mb-3">Trạng thái nhân viên</h3>
        
        <div className="space-y-3">
          {staff.map(staffMember => (
            <div key={staffMember.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{staffMember.name}</div>
                  <div className="text-xs text-gray-500">{staffMember.role} • Khu {staffMember.area}</div>
                </div>
                <span 
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    staffMember.status === 'busy' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {staffMember.status === 'busy' ? 'Đang bận' : 'Sẵn sàng'}
                </span>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Tải công việc:</span>
                  <span>{staffMember.currentLoad}/{staffMember.maxCapacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      staffMember.currentLoad / staffMember.maxCapacity > 0.8
                        ? 'bg-red-500'
                        : staffMember.currentLoad / staffMember.maxCapacity > 0.5
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${(staffMember.currentLoad / staffMember.maxCapacity) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {staffMember.assignedOrders.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">Đơn đang xử lý:</div>
                  <div className="space-y-1">
                    {staffMember.assignedOrders.slice(0, 3).map(orderId => {
                      const order = orders.find(o => o.id.toString() === orderId);
                      return order ? (
                        <div key={orderId} className="text-xs flex justify-between">
                          <div className="truncate max-w-[140px]">{order.name || order.id}</div>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => unassignOrderFromStaff(order.id, staffMember.id)}
                            title="Hủy gán đơn"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : null;
                    })}
                    
                    {staffMember.assignedOrders.length > 3 && (
                      <div className="text-xs text-gray-500 italic">
                        +{staffMember.assignedOrders.length - 3} đơn khác
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-2 flex flex-wrap gap-1">
                {staffMember.skills.map((skill, index) => (
                  <span key={index} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                    {skill}
                  </span>
                ))}
                
                {staffMember.handlingP1 && (
                  <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-xs">
                    P1
                  </span>
                )}
              </div>
            </div>
          ))}
          
          <div className="text-xs text-center text-gray-500">
            {staff.filter(s => s.status === 'available').length} nhân viên sẵn sàng / 
            {staff.filter(s => s.status === 'busy').length} đang bận
          </div>
        </div>
        
        {/* Cấu hình phân bổ tự động */}
        <div className="mt-4 pt-4 border-t">
          <h3 className="font-medium mb-2 flex items-center">
            <Settings className="h-4 w-4 mr-1 text-gray-500" />
            Cấu hình phân bổ
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm">Tự động phân bổ</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={autoAllocationEnabled}
                    onChange={() => setAutoAllocationEnabled(!autoAllocationEnabled)}
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors"></div>
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-4 transition-transform"></div>
                </div>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Phân bổ đơn hàng tự động mỗi {allocationConfig.autoAssignInterval} phút
              </p>
            </div>
            
            <div>
              <div className="text-sm mb-1">Chiến lược phân bổ:</div>
              <select
                className="w-full text-xs border border-gray-200 rounded py-1.5 px-2"
                value={pickingStrategy}
                onChange={(e) => setPickingStrategy(e.target.value)}
              >
                <option value="priority">Ưu tiên theo SLA (P1, P2...)</option>
                <option value="location">Ưu tiên theo vị trí kho</option>
                <option value="single_product">Ưu tiên đơn một sản phẩm</option>
                <option value="product_type">Nhóm theo loại sản phẩm</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {pickingStrategy === 'priority' && 'Đơn P1 luôn được xử lý trước tiên, sau đó đến P2, P3...'}
                {pickingStrategy === 'location' && 'Đơn hàng được gom nhóm theo khu vực kho để di chuyển hiệu quả'}
                {pickingStrategy === 'single_product' && 'Ưu tiên đơn đơn giản (ít sản phẩm) trước'}
                {pickingStrategy === 'product_type' && 'Gom nhóm đơn theo loại sản phẩm (vali, balo, phụ kiện...)'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Tab quản lý đơn hàng
  const OrdersTab = () => {
    // State riêng cho tab này
    const [showCompletedOrders, setShowCompletedOrders] = useState(false);
    const [orderActionId, setOrderActionId] = useState(null);
    
    const filteredOrders = getFilteredOrders().filter(order => 
      showCompletedOrders ? true : order.status !== 'completed'
    );
    
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <h2 className="font-semibold">Quản lý đơn hàng</h2>
              
              <div className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {filteredOrders.length} đơn
                {selectedOrders.length > 0 && (
                  <span className="ml-1">
                    ({selectedOrders.length} đã chọn)
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  className="pl-8 pr-4 py-1.5 text-sm border border-gray-300 rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
              
              <select
                className="text-sm border border-gray-300 rounded py-1.5 px-3"
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
                className="text-sm border border-gray-300 rounded py-1.5 px-3"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="all">Tất cả khu vực</option>
                <option value="HN">Hà Nội</option>
                <option value="290">Kho phụ kiện</option>
                <option value="300">Kho miền Bắc</option>
                <option value="500">Kho miền Nam</option>
              </select>
              
              <select
                className="text-sm border border-gray-300 rounded py-1.5 px-3"
                value={pickingStrategy}
                onChange={(e) => setPickingStrategy(e.target.value)}
              >
                <option value="priority">Ưu tiên theo SLA</option>
                <option value="location">Ưu tiên theo vị trí</option>
                <option value="single_product">Ưu tiên đơn đơn giản</option>
                <option value="product_type">Nhóm theo loại SP</option>
              </select>
              
              <div className="flex border rounded">
                <button 
                  className={`px-2 py-1 text-sm flex items-center ${sortDirection === 'desc' ? 'bg-gray-100' : 'bg-white'}`}
                  onClick={() => setSortDirection('asc')}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button 
                  className={`px-2 py-1 text-sm flex items-center ${sortDirection === 'asc' ? 'bg-gray-100' : 'bg-white'}`}
                  onClick={() => setSortDirection('desc')}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mb-3">
            <label className="flex items-center space-x-1 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                onChange={toggleSelectAll}
                className="rounded"
              />
              <span>Chọn tất cả</span>
            </label>
            
            {selectedOrders.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded flex items-center"
                  onClick={() => handlePrintOrders('order')}
                >
                  <Printer className="h-4 w-4 mr-1" />
                  <span>In đơn</span>
                </button>
                
                <button
                  className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded flex items-center"
                  onClick={() => handlePrintOrders('picking')}
                >
                  <Clipboard className="h-4 w-4 mr-1" />
                  <span>Soạn hàng</span>
                </button>
                
                <button
                  className="px-2 py-1 bg-yellow-50 text-yellow-700 text-sm rounded flex items-center"
                  onClick={autoAssignOrders}
                >
                  <Zap className="h-4 w-4 mr-1" />
                  <span>Phân bổ tự động</span>
                </button>
              </div>
            )}
            
            <div className="ml-auto">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={showCompletedOrders}
                  onChange={() => setShowCompletedOrders(!showCompletedOrders)}
                  className="mr-1 rounded"
                />
                <span>Hiển thị đơn đã hoàn thành</span>
              </label>
            </div>
          </div>
          
          <div className="overflow-x-auto border rounded">
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
                    Sản phẩm
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vị trí
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhân viên
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className={order.sla?.code === 'P1' ? 'bg-red-50' : ''}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id.toString())}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.name || order.id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customer}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${order.sla?.color}`}>
                        {order.sla?.code}
                      </span>
                      <div className="text-xs mt-1">{order.timeLeft}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-sm truncate max-w-xs">
                        {order.detail}
                      </div>
                      <div className="flex mt-1 space-x-1">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {order.productType}
                        </span>
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                          {order.complexity} SP
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      {order.location}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span 
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status === 'completed' 
                          ? 'Hoàn thành' 
                          : order.status === 'processing' 
                            ? 'Đang xử lý' 
                            : 'Chờ xử lý'
                        }
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {order.assignedTo ? (
                        <div className="text-sm">
                          {staff.find(s => s.id === order.assignedTo)?.name || `NV${order.assignedTo}`}
                        </div>
                      ) : order.status !== 'completed' ? (
                        <select
                          className="text-xs border border-gray-200 rounded py-1 px-1"
                          onChange={(e) => assignOrderToStaff(order.id, parseInt(e.target.value))}
                          value=""
                        >
                          <option value="" disabled>Chọn NV</option>
                          {staff
                            .filter(s => s.currentLoad < s.maxCapacity)
                            .map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.currentLoad}/{s.maxCapacity})
                              </option>
                            ))}
                        </select>
                      ) : (
                        <span className="text-gray-500 text-xs">--</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {order.status !== 'completed' ? (
                          <>
                            <button
                              className="p-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                              onClick={() => {
                                setSelectedOrders([order.id.toString()]);
                                handlePrintOrders('order');
                              }}
                              title="In đơn hàng"
                            >
                              <Printer className="h-3 w-3" />
                            </button>
                            <button
                              className="p-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                              onClick={() => {
                                setSelectedOrders([order.id.toString()]);
                                handlePrintOrders('picking');
                              }}
                              title="Soạn hàng"
                            >
                              <Clipboard className="h-3 w-3" />
                            </button>
                            {order.status === 'processing' && (
                              <button
                                className="p-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                                onClick={() => completeOrder(order.id)}
                                title="Hoàn thành"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            {order.assignedTo && (
                              <button
                                className="p-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                                onClick={() => unassignOrderFromStaff(order.id, order.assignedTo)}
                                title="Hủy phân công"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="text-xs italic text-gray-500">
                            Đã hoàn thành
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-3 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy đơn hàng nào phù hợp với tiêu chí lọc
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <div>
              Hiển thị {filteredOrders.length} đơn hàng
            </div>
            <div>
              Tổng số: {stats.totalOrders} đơn | {stats.pendingOrders} chờ xử lý | 
              {stats.processingOrders} đang xử lý | {stats.completedOrders} hoàn thành
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Giao diện quản lý nhân sự
  const StaffTab = () => {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Quản lý hiệu suất nhân sự</h2>
            
            <div className="flex items-center space-x-2">
              <select
                className="text-sm border border-gray-300 rounded py-1.5 px-3"
                defaultValue="all"
              >
                <option value="all">Tất cả khu vực</option>
                <option value="HN">Hà Nội</option>
                <option value="A">Khu vực A</option>
                <option value="B">Khu vực B</option>
                <option value="C">Khu vực C</option>
              </select>
              
              <select
                className="text-sm border border-gray-300 rounded py-1.5 px-3"
                defaultValue="all"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="available">Sẵn sàng</option>
                <option value="busy">Đang bận</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
              <div className="text-sm text-gray-700">Nhân viên sẵn sàng</div>
              <div className="text-2xl font-bold text-green-700">
                {staff.filter(s => s.status === 'available').length}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(staff.filter(s => s.status === 'available').length / staff.length * 100)}% tổng nhân sự
              </div>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
              <div className="text-sm text-gray-700">Nhân viên đang bận</div>
              <div className="text-2xl font-bold text-yellow-700">
                {staff.filter(s => s.status === 'busy').length}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Trung bình {(staff.reduce((acc, s) => acc + s.currentLoad, 0) / Math.max(1, staff.filter(s => s.status === 'busy').length)).toFixed(1)} đơn/người
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="text-sm text-gray-700">Hiệu suất trung bình</div>
              <div className="text-2xl font-bold text-blue-700">
                {Math.round(staff.reduce((acc, s) => acc + s.efficiency, 0) / staff.length)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {staff.filter(s => s.efficiency >= 95).length} nhân viên hiệu suất cao
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto border rounded">
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
                    Khu vực
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hiệu suất
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tải hiện tại
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kỹ năng
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn đang xử lý
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map((staffMember) => (
                  <tr key={staffMember.id}>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium">{staffMember.name}</div>
                      <div className="text-xs text-gray-500">{staffMember.role}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span 
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          staffMember.status === 'busy' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {staffMember.status === 'busy' ? 'Đang bận' : 'Sẵn sàng'}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                      Khu {staffMember.area}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          {staffMember.efficiency}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              staffMember.efficiency >= 95
                                ? 'bg-green-500'
                                : staffMember.efficiency >= 90
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${staffMember.efficiency}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Đã xử lý: {staffMember.orderCount} đơn
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          {staffMember.currentLoad}/{staffMember.maxCapacity}
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              staffMember.currentLoad / staffMember.maxCapacity > 0.8
                                ? 'bg-red-500'
                                : staffMember.currentLoad / staffMember.maxCapacity > 0.5
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                            style={{ width: `${(staffMember.currentLoad / staffMember.maxCapacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {staffMember.skills.map((skill, index) => (
                          <span key={index} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        
                        {staffMember.handlingP1 && (
                          <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-xs">
                            P1
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="max-w-xs">
                        {staffMember.assignedOrders.map(orderId => {
                          const order = orders.find(o => o.id.toString() === orderId);
                          return order ? (
                            <div key={orderId} className="text-xs flex justify-between mb-1 bg-gray-50 p-1 rounded">
                              <div className="truncate max-w-[120px]">
                                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                                  order.sla?.code === 'P1' ? 'bg-red-500' : 
                                  order.sla?.code === 'P2' ? 'bg-yellow-500' : 
                                  'bg-green-500'
                                }`}></span>
                                {order.name || order.id}
                              </div>
                              <button
                                className="text-red-600 hover:text-red-800 ml-1"
                                onClick={() => unassignOrderFromStaff(order.id, staffMember.id)}
                                title="Hủy gán đơn"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : null;
                        })}
                        
                        {staffMember.assignedOrders.length === 0 && (
                          <div className="text-xs text-gray-500 italic">
                            Không có đơn đang xử lý
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  // Giao diện lịch sử hoạt động
  const HistoryTab = () => {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold flex items-center">
              <History className="h-5 w-5 mr-1 text-blue-500" />
              Lịch sử hoạt động
            </h2>
            
            <div className="flex items-center space-x-2">
              <select
                className="text-sm border border-gray-300 rounded py-1.5 px-3"
                defaultValue="all"
              >
                <option value="all">Tất cả hoạt động</option>
                <option value="assign">Phân bổ đơn</option>
                <option value="complete">Hoàn thành đơn</option>
                <option value="upload">Tải lên đơn</option>
                <option value="config">Thay đổi cấu hình</option>
              </select>
              
              <button 
                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded flex items-center"
                onClick={() => {
                  // Xuất lịch sử thành file
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activityHistory, null, 2));
                  const downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  downloadAnchorNode.setAttribute("download", `activity-log-${new Date().toISOString().split('T')[0]}.json`);
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                <span>Xuất lịch sử</span>
              </button>
            </div>
          </div>
          
          <div className="border rounded overflow-hidden max-h-[600px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại hoạt động
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chi tiết
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhân viên
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activityHistory.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        activity.type.includes('assign') ? 'bg-blue-100 text-blue-800' :
                        activity.type.includes('complete') ? 'bg-green-100 text-green-800' :
                        activity.type.includes('upload') ? 'bg-purple-100 text-purple-800' :
                        activity.type.includes('config') ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.type === 'auto_assign' && 'Phân bổ tự động'}
                        {activity.type === 'manual_assign' && 'Phân bổ thủ công'}
                        {activity.type === 'unassign' && 'Hủy phân công'}
                        {activity.type === 'complete' || activity.type === 'order_completed' ? 'Hoàn thành đơn' : ''}
                        {activity.type === 'upload' && 'Tải lên đơn'}
                        {activity.type === 'upload_error' && 'Lỗi tải lên'}
                        {activity.type === 'auto_refresh' && 'Tự động cập nhật'}
                        {activity.type === 'sla_config_update' && 'Cập nhật SLA'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm">
                      <div className="truncate max-w-md">{activity.details}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {activity.orderId && activity.orderName ? (
                        <span>{activity.orderName}</span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {activity.staffName ? (
                        <span>{activity.staffName}</span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                  </tr>
                ))}
                
                {activityHistory.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-500">
                      Chưa có hoạt động nào được ghi nhận
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };
  
  // Modal in đơn hàng
  const PrintModal = () => (
    <div className={`fixed inset-0 z-50 ${showPrintModal ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50" onClick={() => setShowPrintModal(false)}></div>
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">
            {printType === 'order' ? 'In đơn hàng' : 'In phiếu soạn hàng'}
          </h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowPrintModal(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="font-medium mb-2">Đơn hàng đã chọn:</div>
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            {selectedOrders.length > 0 ? (
              <ul className="space-y-1">
                {selectedOrders.map(orderId => {
                  const order = orders.find(o => o.id.toString() === orderId);
                  return order ? (
                    <li key={orderId} className="text-sm flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        order.sla?.code === 'P1' ? 'bg-red-500' : 
                        order.sla?.code === 'P2' ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}></span>
                      {order.name || order.id}
                    </li>
                  ) : null;
                })}
              </ul>
            ) : (
              <div className="text-sm text-gray-500 text-center py-2">
                Không có đơn hàng nào được chọn
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="font-medium mb-2">Loại in:</div>
          <div className="flex space-x-2">
            <button
              className={`flex-1 py-2 px-3 rounded border flex items-center justify-center ${
                printType === 'order' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white'
              }`}
              onClick={() => setPrintType('order')}
            >
              <Printer className="h-4 w-4 mr-2" />
              <span>Đơn hàng</span>
            </button>
            
            <button
              className={`flex-1 py-2 px-3 rounded border flex items-center justify-center ${
                printType === 'picking' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white'
              }`}
              onClick={() => setPrintType('picking')}
            >
              <Clipboard className="h-4 w-4 mr-2" />
              <span>Phiếu soạn hàng</span>
            </button>
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded text-sm mb-4">
          <div className="font-medium text-blue-700 mb-1">Đường dẫn in:</div>
          <div className="flex items-center">
            <input
              type="text"
              value={generatePrintUrl()}
              readOnly
              className="flex-1 py-1 px-2 border rounded text-xs bg-white"
            />
            <button
              className="ml-2 p-1 bg-blue-100 text-blue-700 rounded"
              onClick={() => {
                navigator.clipboard.writeText(generatePrintUrl());
                alert('Đã sao chép đường dẫn!');
              }}
              title="Sao chép"
            >
              <Clipboard className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded"
            onClick={() => setShowPrintModal(false)}
          >
            Hủy
          </button>
          
          <a
            href={generatePrintUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
            onClick={() => {
              // Thêm vào lịch sử hoạt động
              addToActivityHistory({
                type: printType === 'order' ? 'print_order' : 'print_picking',
                timestamp: new Date().toISOString(),
                details: `In ${printType === 'order' ? 'đơn hàng' : 'phiếu soạn hàng'} cho ${selectedOrders.length} đơn`
              });
              
              // Đóng modal sau khi mở liên kết
              setTimeout(() => setShowPrintModal(false), 500);
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            <span>Mở trang in</span>
          </a>
        </div>
      </div>
    </div>
  );
  
  // Hiển thị tab nội dung theo tab đang chọn
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardArea />;
      case 'orders':
        return <OrdersTab />;
      case 'staff':
        return <StaffTab />;
      case 'history':
        return <HistoryTab />;
      default:
        return <DashboardArea />;
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <QuickNav />
      
      <div className="container mx-auto px-4 py-4">
        {renderTabContent()}
      </div>
      
      {/* Modal in đơn hàng */}
      <PrintModal />
      
      {/* Thông báo đang tải lên */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <div className="flex justify-center mb-4">
              <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
            <div className="text-center font-medium">Đang tải lên và xử lý dữ liệu...</div>
            <div className="text-center text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</div>
          </div>
        </div>
      )}
      
      {/* Thông báo lỗi */}
      {uploadError && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Lỗi tải lên</h3>
              <div className="mt-1 text-xs">{uploadError}</div>
              <button 
                className="mt-1 text-xs text-red-700 hover:text-red-800"
                onClick={() => setUploadError(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SLADashboard;