// ==================== ORDERS MANAGEMENT MODULE ====================
// File: src/modules/orders/index.js
//
// Đây là "trung tâm chỉ huy" của module Orders Management.
// Tưởng tượng đây như văn phòng điều hành của một sân bay - nơi theo dõi mọi chuyến bay,
// đảm bảo chúng cất cánh và hạ cánh đúng giờ, và xử lý mọi tình huống khẩn cấp.

import React, { useState, useEffect, useContext, createContext, useMemo, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Import shared components và utilities
import { useNotification } from '../../shared/hooks/useNotification';
import { useAuth } from '../../App';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

// Import các components của module này
import { OrdersList } from './components/OrdersList';
import { OrderDetail } from './components/OrderDetail';
import { SLADashboard } from './components/SLADashboard';
import { BulkActions } from './components/BulkActions';

// Import services và utilities
import { GoogleSheetsService } from './services/googleSheetsAPI';
import { OrdersAPI } from './services/ordersAPI';
import { SLACalculator } from './utils/calculateSLA';
import { OrderFilters } from './utils/orderFilters';

// ==================== ORDERS CONTEXT ====================
// Context này hoạt động như "bảng điều khiển trung tâm" của module.
// Mọi component con đều có thể truy cập vào data và functions từ đây
// mà không cần truyền props qua nhiều tầng (tránh prop drilling).

const OrdersContext = createContext();

// Custom hook để sử dụng OrdersContext một cách an toàn
export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};

// ==================== SLA PRIORITY SYSTEM ====================
// Đây là "hệ thống phân loại ưu tiên" - trái tim của SLA tracking.
// Chúng ta phân chia đơn hàng thành 4 mức độ ưu tiên dựa trên thời gian còn lại.

const SLA_PRIORITIES = {
  P1: {
    name: 'Gấp 🚀',
    threshold: 2 * 60, // 2 hours in minutes
    color: 'red',
    description: 'Cần xử lý ngay lập tức',
    autoActions: ['assign_best_staff', 'priority_picking', 'supervisor_alert']
  },
  P2: {
    name: 'Cảnh báo ⚠️',
    threshold: 4 * 60, // 4 hours
    color: 'yellow',
    description: 'Ưu tiên cao',
    autoActions: ['assign_available_staff', 'queue_priority']
  },
  P3: {
    name: 'Bình thường ✅',
    threshold: 8 * 60, // 8 hours
    color: 'green',
    description: 'Theo lộ trình bình thường',
    autoActions: ['normal_processing']
  },
  P4: {
    name: 'Chờ xử lý 🕒',
    threshold: Infinity,
    color: 'blue',
    description: 'Có thể xử lý sau',
    autoActions: ['batch_processing']
  }
};

// ==================== ORDERS PROVIDER ====================
// Provider component quản lý toàn bộ state và logic của module Orders.
// Đây là "não bộ" của hệ thống, nơi mọi quyết định quan trọng được đưa ra.

const OrdersProvider = ({ children }) => {
  // ==================== STATE MANAGEMENT ====================
  // State cơ bản
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // State cho filters và search
  const [filters, setFilters] = useState({
    status: 'all',        // all, pending, picking, packing, completed, overdue
    priority: 'all',      // all, P1, P2, P3, P4
    platform: 'all',     // all, shopee, tiktok, lazada, website
    assignee: 'all',     // all, specific staff member
    dateRange: 'today',  // today, yesterday, week, month, custom
    customDate: { from: null, to: null }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'desc'
  });

  // State cho SLA tracking
  const [slaMetrics, setSlaMetrics] = useState({
    totalOrders: 0,
    onTimeOrders: 0,
    overdueOrders: 0,
    averageProcessingTime: 0,
    complianceRate: 0
  });

  // State cho Google Sheets integration
  const [syncStatus, setSyncStatus] = useState({
    lastSync: null,
    isConnected: false,
    isSyncing: false,
    errors: []
  });

  // Hooks
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ==================== SLA CALCULATION LOGIC ====================
  // Đây là "bộ não tính toán SLA" - logic cốt lõi để xác định mức độ ưu tiên

  const calculateOrderPriority = useCallback((order) => {
    const now = new Date();
    const deadline = new Date(order.slaDeadline);
    const remainingMinutes = Math.max(0, (deadline - now) / (1000 * 60));

    // Xác định priority dựa trên thời gian còn lại
    for (const [priority, config] of Object.entries(SLA_PRIORITIES)) {
      if (remainingMinutes <= config.threshold) {
        return {
          priority,
          remainingMinutes,
          config,
          isOverdue: remainingMinutes === 0,
          urgencyLevel: remainingMinutes <= 30 ? 'critical' :
                       remainingMinutes <= 60 ? 'high' : 'normal'
        };
      }
    }

    return {
      priority: 'P4',
      remainingMinutes,
      config: SLA_PRIORITIES.P4,
      isOverdue: false,
      urgencyLevel: 'low'
    };
  }, []);

  // ==================== GOOGLE SHEETS INTEGRATION ====================
  // Logic đồng bộ hóa với Google Sheets - "cầu nối" với hệ thống bên ngoài

  const syncWithGoogleSheets = useCallback(async (action = 'pull') => {
    if (syncStatus.isSyncing) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      const googleSheets = new GoogleSheetsService();

      if (action === 'pull') {
        // Đọc dữ liệu từ Google Sheets
        const sheetsData = await googleSheets.readOrdersData();
        const transformedOrders = sheetsData.map(row => {
          // Transform raw sheets data thành order object
          const order = {
            id: row[0],
            platform: row[1],
            customerId: row[2],
            priority: row[3],
            status: row[4],
            createdAt: new Date(row[5]),
            slaDeadline: new Date(row[6]),
            assignedTo: row[7] || null,
            totalValue: parseFloat(row[8]) || 0,
            notes: row[9] || '',
            carrierName: row[10] || '',
            updatedAt: new Date(row[11] || row[5]),
            updatedBy: row[12] || 'System',
            items: [] // Sẽ được populate từ sheet Products
          };

          // Tính toán SLA priority
          const slaInfo = calculateOrderPriority(order);
          return { ...order, ...slaInfo };
        });

        setOrders(transformedOrders);
        addNotification({
          type: 'success',
          title: 'Sync thành công',
          message: `Đã đồng bộ ${transformedOrders.length} đơn hàng từ Google Sheets`
        });

      } else if (action === 'push') {
        // Đẩy dữ liệu lên Google Sheets
        const sheetsFormat = orders.map(order => [
          order.id,
          order.platform,
          order.customerId,
          order.priority,
          order.status,
          order.createdAt.toISOString(),
          order.slaDeadline.toISOString(),
          order.assignedTo || '',
          order.totalValue.toString(),
          order.notes || '',
          order.carrierName || '',
          order.updatedAt.toISOString(),
          order.updatedBy || user?.name || 'System'
        ]);

        await googleSheets.writeOrdersData(sheetsFormat);
        addNotification({
          type: 'success',
          title: 'Cập nhật thành công',
          message: 'Đã cập nhật dữ liệu lên Google Sheets'
        });
      }

      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        isConnected: true,
        errors: []
      }));

    } catch (error) {
      console.error('Google Sheets sync error:', error);
      setSyncStatus(prev => ({
        ...prev,
        errors: [...prev.errors, {
          timestamp: new Date(),
          message: error.message,
          action
        }]
      }));

      addNotification({
        type: 'error',
        title: 'Lỗi đồng bộ',
        message: `Không thể ${action === 'pull' ? 'đọc từ' : 'ghi lên'} Google Sheets: ${error.message}`
      });
    } finally {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
    }
  }, [orders, calculateOrderPriority, addNotification, user]);

  // ==================== DATA FILTERING & SORTING ====================
  // Logic lọc và sắp xếp dữ liệu - "hệ thống tìm kiếm thông minh"

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // Apply text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(term) ||
        order.customerId.toLowerCase().includes(term) ||
        order.notes.toLowerCase().includes(term) ||
        order.items.some(item =>
          item.productName.toLowerCase().includes(term) ||
          item.sku.toLowerCase().includes(term)
        )
      );
    }

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(order => order.priority === filters.priority);
    }

    if (filters.platform !== 'all') {
      filtered = filtered.filter(order => order.platform === filters.platform);
    }

    if (filters.assignee !== 'all') {
      filtered = filtered.filter(order => order.assignedTo === filters.assignee);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let startDate, endDate;

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 'yesterday':
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          endDate = now;
          break;
        case 'custom':
          startDate = filters.customDate.from;
          endDate = filters.customDate.to;
          break;
      }

      if (startDate && endDate) {
        filtered = filtered.filter(order =>
          order.createdAt >= startDate && order.createdAt <= endDate
        );
      }
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle special sorting cases
        if (sortConfig.key === 'remainingMinutes') {
          aValue = a.remainingMinutes || 0;
          bValue = b.remainingMinutes || 0;
        } else if (sortConfig.key === 'priority') {
          // Sort by priority level (P1 highest)
          const priorityOrder = { P1: 4, P2: 3, P3: 2, P4: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
        }

        // Handle different data types
        if (aValue instanceof Date && bValue instanceof Date) {
          aValue = aValue.getTime();
          bValue = bValue.getTime();
        } else if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [orders, searchTerm, filters, sortConfig]);

  // ==================== SLA METRICS CALCULATION ====================
  // Tính toán các chỉ số SLA - "bảng điểm hiệu suất"

  useEffect(() => {
    const calculateSLAMetrics = () => {
      const total = filteredAndSortedOrders.length;
      if (total === 0) {
        setSlaMetrics({
          totalOrders: 0,
          onTimeOrders: 0,
          overdueOrders: 0,
          averageProcessingTime: 0,
          complianceRate: 0
        });
        return;
      }

      const onTime = filteredAndSortedOrders.filter(order => !order.isOverdue).length;
      const overdue = filteredAndSortedOrders.filter(order => order.isOverdue).length;

      // Calculate average processing time for completed orders
      const completedOrders = filteredAndSortedOrders.filter(order =>
        order.status === 'completed' && order.completedAt
      );

      const avgProcessTime = completedOrders.length > 0
        ? completedOrders.reduce((sum, order) => {
            const processTime = (order.completedAt - order.createdAt) / (1000 * 60); // minutes
            return sum + processTime;
          }, 0) / completedOrders.length
        : 0;

      const complianceRate = total > 0 ? (onTime / total) * 100 : 0;

      setSlaMetrics({
        totalOrders: total,
        onTimeOrders: onTime,
        overdueOrders: overdue,
        averageProcessingTime: Math.round(avgProcessTime),
        complianceRate: Math.round(complianceRate * 100) / 100
      });
    };

    calculateSLAMetrics();
  }, [filteredAndSortedOrders]);

  // ==================== ORDER OPERATIONS ====================
  // Các operations để manipulate orders - "công cụ làm việc"

  const updateOrder = useCallback(async (orderId, updates) => {
    try {
      setLoading(true);

      // Optimistic update - update UI immediately
      setOrders(prevOrders =>
        prevOrders.map(order => {
          if (order.id === orderId) {
            const updatedOrder = {
              ...order,
              ...updates,
              updatedAt: new Date(),
              updatedBy: user?.name || 'User'
            };

            // Recalculate SLA priority if deadline changed
            if (updates.slaDeadline) {
              const slaInfo = calculateOrderPriority(updatedOrder);
              return { ...updatedOrder, ...slaInfo };
            }

            return updatedOrder;
          }
          return order;
        })
      );

      // Sync with Google Sheets in background
      await syncWithGoogleSheets('push');

      addNotification({
        type: 'success',
        title: 'Cập nhật thành công',
        message: `Đơn hàng ${orderId} đã được cập nhật`
      });

      return true;
    } catch (error) {
      console.error('Update order error:', error);
      addNotification({
        type: 'error',
        title: 'Lỗi cập nhật',
        message: `Không thể cập nhật đơn hàng ${orderId}: ${error.message}`
      });

      // Reload data from Google Sheets to ensure consistency
      await syncWithGoogleSheets('pull');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, calculateOrderPriority, syncWithGoogleSheets, addNotification]);

  const bulkUpdateOrders = useCallback(async (orderIds, updates) => {
    try {
      setLoading(true);

      const updatedOrders = orders.map(order => {
        if (orderIds.includes(order.id)) {
          const updatedOrder = {
            ...order,
            ...updates,
            updatedAt: new Date(),
            updatedBy: user?.name || 'User'
          };

          if (updates.slaDeadline) {
            const slaInfo = calculateOrderPriority(updatedOrder);
            return { ...updatedOrder, ...slaInfo };
          }

          return updatedOrder;
        }
        return order;
      });

      setOrders(updatedOrders);
      await syncWithGoogleSheets('push');

      addNotification({
        type: 'success',
        title: 'Cập nhật hàng loạt thành công',
        message: `Đã cập nhật ${orderIds.length} đơn hàng`
      });

      return true;
    } catch (error) {
      console.error('Bulk update error:', error);
      addNotification({
        type: 'error',
        title: 'Lỗi cập nhật hàng loạt',
        message: error.message
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [orders, user, calculateOrderPriority, syncWithGoogleSheets, addNotification]);

  const assignOrderToStaff = useCallback(async (orderId, staffMember) => {
    return updateOrder(orderId, {
      assignedTo: staffMember,
      status: 'assigned'
    });
  }, [updateOrder]);

  const markOrderComplete = useCallback(async (orderId) => {
    return updateOrder(orderId, {
      status: 'completed',
      completedAt: new Date()
    });
  }, [updateOrder]);

  // ==================== REAL-TIME SLA MONITORING ====================
  // Monitoring thời gian thực - "hệ thống cảnh báo sớm"

  useEffect(() => {
    const monitorSLA = () => {
      const criticalOrders = filteredAndSortedOrders.filter(order =>
        order.priority === 'P1' && !order.isOverdue
      );

      const overdueOrders = filteredAndSortedOrders.filter(order => order.isOverdue);

      // Send notifications for critical orders
      criticalOrders.forEach(order => {
        if (order.remainingMinutes <= 15 && order.remainingMinutes > 10) {
          addNotification({
            type: 'warning',
            title: 'SLA Cảnh báo',
            message: `Đơn ${order.id} sẽ quá hạn trong ${Math.round(order.remainingMinutes)} phút`
          });
        }
      });

      // Send notifications for overdue orders
      overdueOrders.forEach(order => {
        const overdueMinutes = Math.abs(order.remainingMinutes);
        if (overdueMinutes >= 1 && overdueMinutes <= 5) {
          addNotification({
            type: 'error',
            title: 'SLA Vi phạm',
            message: `Đơn ${order.id} đã quá hạn ${Math.round(overdueMinutes)} phút`
          });
        }
      });
    };

    // Run monitoring every minute
    const interval = setInterval(monitorSLA, 60000);
    return () => clearInterval(interval);
  }, [filteredAndSortedOrders, addNotification]);

  // ==================== INITIAL DATA LOAD ====================
  // Load dữ liệu ban đầu khi component mount

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await syncWithGoogleSheets('pull');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [syncWithGoogleSheets]);

  // ==================== CONTEXT VALUE ====================
  // Tất cả data và functions được provide cho các components con

  const contextValue = {
    // Data
    orders: filteredAndSortedOrders,
    allOrders: orders,
    selectedOrders,
    slaMetrics,
    loading,
    error,

    // Filters & Search
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    sortConfig,
    setSortConfig,

    // Selection
    selectedOrders,
    setSelectedOrders,

    // Operations
    updateOrder,
    bulkUpdateOrders,
    assignOrderToStaff,
    markOrderComplete,

    // Google Sheets
    syncWithGoogleSheets,
    syncStatus,

    // Utilities
    calculateOrderPriority,
    SLA_PRIORITIES
  };

  return (
    <OrdersContext.Provider value={contextValue}>
      {children}
    </OrdersContext.Provider>
  );
};

// ==================== MAIN ORDERS MODULE COMPONENT ====================
// Component chính của module - "điểm vào" của toàn bộ hệ thống Orders
const OrdersModule = () => {
  return (
    <OrdersProvider>
      <div className="orders-module">
        <Routes>
          {/* Route chính - Dashboard tổng quan */}
          <Route index element={<OrdersDashboard />} />

          {/* Route danh sách đơn hàng với các sub-routes */}
          <Route path="list" element={<OrdersList />} />
          <Route path="list/:status" element={<OrdersList />} />

          {/* Route chi tiết đơn hàng */}
          <Route path="detail/:orderId" element={<OrderDetail />} />

          {/* Route SLA Dashboard */}
          <Route path="sla" element={<SLADashboard />} />

          {/* Route Bulk Actions */}
          <Route path="bulk" element={<BulkActions />} />
        </Routes>
      </div>
    </OrdersProvider>
  );
};

// ==================== ORDERS DASHBOARD COMPONENT ====================
// Component dashboard chính hiển thị tổng quan
const OrdersDashboard = () => {
  const {
    slaMetrics,
    orders,
    loading,
    syncStatus,
    syncWithGoogleSheets
  } = useOrders();

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
        <span className="ml-3 text-lg">Đang tải dữ liệu đơn hàng...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header với sync controls */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management & SLA Tracking</h1>
          <p className="text-gray-600 mt-1">
            Quản lý {slaMetrics.totalOrders} đơn hàng •
            SLA Compliance: {slaMetrics.complianceRate}% •
            Sync: {syncStatus.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => syncWithGoogleSheets('pull')}
            disabled={syncStatus.isSyncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {syncStatus.isSyncing ? 'Đang sync...' : 'Sync từ Sheets'}
          </button>

          <button
            onClick={() => navigate('list')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Xem tất cả đơn hàng
          </button>
        </div>
      </div>

      {/* SLA Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Tổng đơn hàng</h3>
          <p className="text-3xl font-bold text-gray-900">{slaMetrics.totalOrders}</p>
          <p className="text-sm text-gray-600 mt-1">Đang xử lý trong hệ thống</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">SLA Compliance</h3>
          <p className="text-3xl font-bold text-gray-900">{slaMetrics.complianceRate}%</p>
          <p className="text-sm text-gray-600 mt-1">{slaMetrics.onTimeOrders} đơn đúng hạn</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Đơn quá hạn</h3>
          <p className="text-3xl font-bold text-gray-900">{slaMetrics.overdueOrders}</p>
          <p className="text-sm text-gray-600 mt-1">Cần xử lý khẩn cấp</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500 uppercase">Thời gian TB</h3>
          <p className="text-3xl font-bold text-gray-900">{slaMetrics.averageProcessingTime}m</p>
          <p className="text-sm text-gray-600 mt-1">Xử lý mỗi đơn hàng</p>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Phân bổ theo mức ưu tiên</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(SLA_PRIORITIES).map(([priority, config]) => {
            const count = orders.filter(order => order.priority === priority).length;
            const percentage = slaMetrics.totalOrders > 0 ? (count / slaMetrics.totalOrders) * 100 : 0;

            return (
              <div key={priority} className="text-center">
                <div className={`w-full h-24 bg-${config.color}-100 border-2 border-${config.color}-300 rounded-lg flex items-center justify-center mb-2`}>
                  <div>
                    <p className={`text-2xl font-bold text-${config.color}-700`}>{count}</p>
                    <p className={`text-sm text-${config.color}-600`}>{percentage.toFixed(1)}%</p>
                  </div>
                </div>
                <p className="text-sm font-medium">{config.name}</p>
                <p className="text-xs text-gray-500">{config.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Đơn hàng gần đây</h2>
          <button
            onClick={() => navigate('list')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả →
          </button>
        </div>

        <div className="space-y-3">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full bg-${SLA_PRIORITIES[order.priority].color}-500`}></div>
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.platform} • {order.customerId}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-sm font-medium ${order.isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                  {order.isOverdue ? 'Quá hạn' : `${Math.round(order.remainingMinutes)} phút còn lại`}
                </p>
                <p className="text-xs text-gray-500">{order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersModule;
