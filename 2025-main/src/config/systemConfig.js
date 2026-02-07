// src/config/systemConfig.js

export const ROLES = {
  ADMIN: {
    id: 'ADMIN',
    label: 'Quản trị viên',
    permissions: [
      'dashboard', 'orders', 'staff', 'analytics', 'settings', 'reports', 'permissions', 'profile'
    ]
  },
  MANAGER: {
    id: 'MANAGER',
    label: 'Quản lý',
    permissions: [
      'dashboard', 'orders', 'staff', 'analytics', 'reports', 'profile'
    ]
  },
  STAFF: {
    id: 'STAFF',
    label: 'Nhân viên',
    permissions: [
      'dashboard', 'orders', 'profile'
    ]
  }
};

export const API_CONFIG = {
  baseUrl: 'https://api.example.com',
  timeout: 30000
};

export const DATE_FORMATS = {
  display: 'dd/MM/yyyy',
  api: 'yyyy-MM-dd'
};

export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100]
};

export const ORDER_PRIORITIES = ['high', 'medium', 'low'];
export const SLA_PRIORITIES = ['P1', 'P2', 'P3', 'P4'];
export const STAFF_ROLES = ['Senior', 'Regular', 'Junior', 'Trainee'];
export const WORK_AREAS = ['A', 'B', 'C', 'D'];

export const SYSTEM_CONFIG = {
  ROLES,
  API_CONFIG,
  DATE_FORMATS,
  PAGINATION_CONFIG,
  ORDER_PRIORITIES,
  SLA_PRIORITIES,
  STAFF_ROLES,
  WORK_AREAS,
  DEFAULT_THEME: 'light'
};

export default SYSTEM_CONFIG;
