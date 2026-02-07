// syncService.js - Đồng bộ hóa dữ liệu giữa localStorage và Google Sheets
import {
  loadOrders, loadStaff, loadActivities, loadConfig,
  updateLastSync
} from './storageService';

import {
  fetchOrders, fetchStaff, fetchActivities, fetchConfig,
  saveOrder, updateOrder, saveActivity, updateConfig,
  batchSaveOrders, batchSaveActivities
} from './sheetService';

// Đồng bộ tất cả dữ liệu từ localStorage lên Google Sheets
export const syncToSheets = async () => {
  try {
    // Lấy dữ liệu từ localStorage
    const orders = loadOrders();
    const activities = loadActivities();
    const config = loadConfig();

    // Đồng bộ hóa lên Google Sheets
    // Sử dụng batch operations để giảm số lượng API calls
    await batchSaveOrders(orders);
    await batchSaveActivities(activities);
    await updateConfig(config);

    // Cập nhật thời gian đồng bộ cuối cùng
    updateLastSync();

    return {
      success: true,
      message: 'Đồng bộ dữ liệu thành công',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Lỗi khi đồng bộ dữ liệu:', error);
    return {
      success: false,
      message: `Lỗi khi đồng bộ: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
};

// Đồng bộ cấu hình từ Google Sheets xuống localStorage
export const syncConfigFromSheets = async () => {
  try {
    const sheetsConfig = await fetchConfig();
    if (Object.keys(sheetsConfig).length > 0) {
      // Cập nhật cấu hình vào localStorage
      const formattedConfig = {
        slaConfig: {
          p1Hours: sheetsConfig.p1_hours || 2,
          p2Hours: sheetsConfig.p2_hours || 4,
          p3Hours: sheetsConfig.p3_hours || 8,
          defaultSLA: sheetsConfig.default_sla || 24
        },
        allocationConfig: {
          autoAssignInterval: sheetsConfig.auto_assign_interval || 5,
          p1MaxPerStaff: sheetsConfig.p1_max_per_staff || 3,
          balanceWorkload: sheetsConfig.balance_workload,
          prioritizeLocation: sheetsConfig.prioritize_location,
          reassignOnCompletion: sheetsConfig.reassign_on_completion
        }
      };

      return formattedConfig;
    }
    return null;
  } catch (error) {
    console.error('Lỗi khi đồng bộ cấu hình:', error);
    return null;
  }
};

// Tải dữ liệu ban đầu từ Google Sheets (sử dụng khi khởi động ứng dụng)
export const initialLoadFromSheets = async () => {
  try {
    // Tải cấu hình
    const sheetsConfig = await syncConfigFromSheets();

    // Tải nhân viên
    const staffData = await fetchStaff();
    const formattedStaff = staffData.length > 0 ? staffData.map(staff => ({
      ...staff,
      assignedOrders: staff.assigned_orders ? staff.assigned_orders.split(',').filter(Boolean) : [],
      skills: staff.skills ? staff.skills.split(',') : [],
      handlingP1: !!staff.handling_p1
    })) : [];

    // Ngày hiện tại (yyyy-mm-dd)
    const today = new Date().toISOString().split('T')[0];

    // Chỉ tải đơn hàng của ngày hôm nay từ Google Sheets
    const allOrders = await fetchOrders();
    const todayOrders = allOrders.filter(order => {
      if (!order.date_order) return false;
      return order.date_order.startsWith(today);
    });

    const processedOrders = todayOrders.map(order => {
      const sla = {
        code: order.sla_code || 'P4',
        level: order.sla_level || 4,
        color: getSlaColorFromCode(order.sla_code)
      };

      return {
        ...order,
        sla,
        status: order.status || 'pending',
        timeLeft: order.time_left || ''
      };
    });

    return {
      config: sheetsConfig,
      staff: formattedStaff,
      orders: processedOrders
    };
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu ban đầu:', error);
    return {
      config: null,
      staff: [],
      orders: []
    };
  }
};

// Hàm phụ trợ để lấy màu SLA
const getSlaColorFromCode = (code) => {
  switch (code) {
    case 'P1': return 'bg-red-100 text-red-800 border-red-200';
    case 'P2': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'P3': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};
