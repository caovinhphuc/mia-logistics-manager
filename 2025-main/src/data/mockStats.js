// Thống kê mô phỏng cho Dashboard (demo)

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalOrders
 * @property {number} pendingOrders
 * @property {number} processingOrders
 * @property {number} completedOrders
 * @property {number} p1Orders
 * @property {number} p2Orders
 * @property {number} staffUtilization      % sử dụng nhân sự
 * @property {number} avgPickingTime        Thời gian lấy hàng TB (phút)
 * @property {number} slaCompliance         % SLA đúng hạn
 * @property {number} autoAllocationSuccess % phân bổ tự động thành công
 */

export const mockStats = {
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
};
