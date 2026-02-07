// ==================== THEME CONSTANTS ====================
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
} as const;

export const FONTS = {
  primary: '"Inter", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
} as const;

export const SIZES = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
} as const;

export const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;

// ==================== LAYOUT CONSTANTS ====================
export const LAYOUT = {
  header: {
    height: '4rem',
    zIndex: 1000,
  },
  sidebar: {
    width: '16rem',
    collapsedWidth: '4rem',
    zIndex: 999,
  },
  content: {
    padding: SPACING.lg,
  },
} as const;

// ==================== ROUTES CONSTANTS ====================
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  WAREHOUSE: '/dashboard',
  ORDERS: '/orders',
  SCHEDULE: '/staff/schedule',
  INVENTORY: '/inventory',
  REPORTS: '/reports',
  PICKING: '/picking',
  SETTINGS: '/settings',
} as const;

// ==================== PERMISSIONS CONSTANTS ====================
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  WAREHOUSE_VIEW: 'warehouse.view',
  WAREHOUSE_EDIT: 'warehouse.edit',
  STAFF_VIEW: 'staff.view',
  STAFF_EDIT: 'staff.edit',
  SCHEDULE_VIEW: 'schedule.view',
  SCHEDULE_EDIT: 'schedule.edit',
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_EDIT: 'inventory.edit',
  REPORTS_VIEW: 'reports.view',
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_EDIT: 'settings.edit',
  ALL: '*'
} as const;

export const ROLE_PERMISSIONS = {
  admin: ['*'] as const,
  manager: [
    'dashboard.view',
    'warehouse.view',
    'warehouse.edit',
    'staff.view',
    'schedule.view',
    'schedule.edit',
    'inventory.view',
    'reports.view'
  ] as const,
  staff: [
    'dashboard.view',
    'warehouse.view',
    'schedule.view',
    'inventory.view'
  ] as const
} as const;

// ==================== API CONSTANTS ====================
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  WAREHOUSE: {
    GET_ALL: '/warehouse',
    GET_BY_ID: '/warehouse/:id',
    CREATE: '/warehouse',
    UPDATE: '/warehouse/:id',
    DELETE: '/warehouse/:id',
  },
  SCHEDULE: {
    GET_ALL: '/schedule',
    GET_BY_USER: '/schedule/user/:userId',
    CREATE: '/schedule',
    UPDATE: '/schedule/:id',
  },
} as const;

// ==================== UI CONSTANTS ====================
export const ANIMATION = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
