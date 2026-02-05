// Global Constants for MIA Logistics Manager
export const CONSTANTS = {
  // API Endpoints
  API: {
    BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
  },

  // Google Services
  GOOGLE: {
    CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    API_KEY: process.env.REACT_APP_GOOGLE_SHEETS_API_KEY,
    SPREADSHEET_ID: process.env.REACT_APP_GOOGLE_SPREADSHEET_ID,
    SCOPES: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  },

  // UI Configuration
  UI: {
    DRAWER_WIDTH: 240,
    MOBILE_DRAWER_WIDTH: 280,
    HEADER_HEIGHT: 64,
    SIDEBAR_COLLAPSED_WIDTH: 60,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
  },

  // Data Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    MAX_PAGE_SIZE: 100,
  },

  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf', 'text/csv'],
    CHUNK_SIZE: 1024 * 1024, // 1MB chunks
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'mia_auth_token',
    USER_PREFERENCES: 'mia_user_preferences',
    THEME_SETTINGS: 'mia-theme',
    LANGUAGE: 'mia_language',
    SIDEBAR_STATE: 'mia_sidebar_collapsed',
  },

  // User Roles
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    OPERATOR: 'operator',
    DRIVER: 'driver',
    WAREHOUSE_STAFF: 'warehouse_staff',
  },

  // Status Types
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    IN_PROGRESS: 'in-progress',
    DELETED: 'deleted',
  },

  // Transport Status
  TRANSPORT_STATUS: {
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    IN_TRANSIT: 'in-transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    DELAYED: 'delayed',
  },

  // Warehouse Status
  WAREHOUSE_STATUS: {
    IN_STOCK: 'in-stock',
    OUT_OF_STOCK: 'out-of-stock',
    LOW_STOCK: 'low-stock',
    RESERVED: 'reserved',
  },

  // Date Formats
  DATE_FORMATS: {
    DISPLAY: 'DD/MM/YYYY',
    DATETIME: 'DD/MM/YYYY HH:mm',
    API: 'YYYY-MM-DD',
    TIME: 'HH:mm',
  },

  // Validation Rules
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[0-9+\-\s()]+$/,
    PASSWORD_MIN_LENGTH: 8,
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
  },

  // Colors (matching theme)
  COLORS: {
    PRIMARY: '#1976d2',
    SECONDARY: '#FFCD00',
    SUCCESS: '#4caf50',
    ERROR: '#f44336',
    WARNING: '#ff9800',
    INFO: '#2196f3',
    GREY: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  // Messages
  MESSAGES: {
    SUCCESS: {
      SAVE: 'Dữ liệu đã được lưu thành công',
      DELETE: 'Đã xóa thành công',
      UPDATE: 'Cập nhật thành công',
      UPLOAD: 'Tải lên thành công',
    },
    ERROR: {
      NETWORK: 'Lỗi kết nối mạng',
      UNAUTHORIZED: 'Bạn không có quyền thực hiện thao tác này',
      NOT_FOUND: 'Không tìm thấy dữ liệu',
      SERVER: 'Lỗi server, vui lòng thử lại sau',
      VALIDATION: 'Dữ liệu không hợp lệ',
      GENERIC: 'Đã xảy ra lỗi, vui lòng thử lại',
    },
  },

  // Menu Priorities (for sorting)
  MENU_ORDER: {
    DASHBOARD: 1,
    TRANSPORT: 2,
    WAREHOUSE: 3,
    CUSTOMERS: 4,
    STAFF: 5,
    PARTNERS: 6,
    MAPS: 7,
    REPORTS: 8,
    SETTINGS: 99,
  },
};

// Utility Functions
export const UTILS = {
  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  },

  // Format date
  formatDate: (date, _format = CONSTANTS.DATE_FORMATS.DISPLAY) => {
    if (!date) return '';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toLocaleDateString('vi-VN');
    } catch (error) {
      console.warn('Error formatting date:', error);
      return '';
    }
  },

  // Generate UUID
  generateUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  // Debounce function
  debounce: (func, delay = CONSTANTS.UI.DEBOUNCE_DELAY) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  },

  // Deep clone object
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  // Check if user has role
  hasRole: (userRoles, requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!userRoles || userRoles.length === 0) return false;
    return requiredRoles.some((role) => userRoles.includes(role));
  },

  // Validate email
  isValidEmail: (email) => {
    return CONSTANTS.VALIDATION.EMAIL_REGEX.test(email);
  },

  // Validate phone
  isValidPhone: (phone) => {
    return CONSTANTS.VALIDATION.PHONE_REGEX.test(phone);
  },

  // Get status color
  getStatusColor: (status) => {
    const colorMap = {
      [CONSTANTS.STATUS.ACTIVE]: CONSTANTS.COLORS.SUCCESS,
      [CONSTANTS.STATUS.INACTIVE]: CONSTANTS.COLORS.GREY[400],
      [CONSTANTS.STATUS.PENDING]: CONSTANTS.COLORS.WARNING,
      [CONSTANTS.STATUS.COMPLETED]: CONSTANTS.COLORS.SUCCESS,
      [CONSTANTS.STATUS.CANCELLED]: CONSTANTS.COLORS.ERROR,
      [CONSTANTS.STATUS.IN_PROGRESS]: CONSTANTS.COLORS.INFO,
    };
    return colorMap[status] || CONSTANTS.COLORS.GREY[400];
  },

  // Get status label
  getStatusLabel: (status) => {
    const labelMap = {
      [CONSTANTS.STATUS.ACTIVE]: 'Hoạt động',
      [CONSTANTS.STATUS.INACTIVE]: 'Không hoạt động',
      [CONSTANTS.STATUS.PENDING]: 'Chờ xử lý',
      [CONSTANTS.STATUS.COMPLETED]: 'Hoàn thành',
      [CONSTANTS.STATUS.CANCELLED]: 'Đã hủy',
      [CONSTANTS.STATUS.IN_PROGRESS]: 'Đang xử lý',
    };
    return labelMap[status] || status;
  },
};

export default CONSTANTS;
