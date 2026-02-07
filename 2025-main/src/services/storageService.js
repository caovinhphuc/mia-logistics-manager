// storageService.js - Quản lý dữ liệu trong localStorage

// Định nghĩa các key cho localStorage
export const STORAGE_KEYS = {
  ORDERS: 'orderManagement_orders',
  STAFF: 'orderManagement_staff',
  SETTINGS: 'orderManagement_settings',
  ACTIVITY_HISTORY: 'orderManagement_activityHistory',
  LAST_SYNC: 'orderManagement_lastSync'
};

// Lưu dữ liệu vào localStorage
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Lỗi khi lưu dữ liệu vào localStorage: ${error}`);
    return false;
  }
};

// Đọc dữ liệu từ localStorage
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Lỗi khi đọc dữ liệu từ localStorage: ${error}`);
    return defaultValue;
  }
};

// Xóa dữ liệu từ localStorage
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Lỗi khi xóa dữ liệu từ localStorage: ${error}`);
    return false;
  }
};

// Kiểm tra xem có cần đồng bộ không
export const needsSync = (syncThresholdHours = 24) => {
  const lastSync = loadFromStorage(STORAGE_KEYS.LAST_SYNC);
  if (!lastSync) return true;

  const now = new Date().getTime();
  const hoursSinceLastSync = (now - lastSync) / (1000 * 60 * 60);
  return hoursSinceLastSync >= syncThresholdHours;
};

// Cập nhật thời gian đồng bộ
export const updateLastSync = () => {
  saveToStorage(STORAGE_KEYS.LAST_SYNC, new Date().getTime());
};

// Lưu trữ dữ liệu tạm thời (trong phiên làm việc)
export const sessionData = {
  save: (key, data) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Lỗi khi lưu dữ liệu vào sessionStorage: ${error}`);
      return false;
    }
  },
  load: (key, defaultValue = null) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Lỗi khi đọc dữ liệu từ sessionStorage: ${error}`);
      return defaultValue;
    }
  },
  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Lỗi khi xóa dữ liệu từ sessionStorage: ${error}`);
      return false;
    }
  }
};
