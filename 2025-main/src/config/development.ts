export const DEV_CONFIG = {  // Mock users for development
  MOCK_USERS: [
    {
      id: 1,
      email: 'admin@mia.vn',
      password: '123456',
      name: 'Nguyễn Văn Admin',
      role: 'admin',
      permissions: [
        '*', 'dashboard', 'dashboard.view', 'orders', 'orders.view', 'orders.manage',
        'staff', 'staff.view', 'staff.manage', 'picking', 'picking.view', 'picking.manage',
        'history', 'history.view', 'alerts', 'alerts.view', 'analytics', 'analytics.view',
        'reports', 'reports.view', 'settings', 'settings.manage', 'permissions', 'permissions.manage',
        'view_reports', 'manage_users', 'warehouse.view', 'warehouse.edit', 'staff.edit',
        'schedule.view', 'schedule.edit', 'inventory.view', 'inventory.edit', 'settings.view', 'settings.edit'
      ]
    },
    {
      id: 2,
      email: 'manager@mia.vn',
      password: '123456',
      name: 'Trần Thị Manager',
      role: 'manager',
      permissions: [
        'dashboard', 'dashboard.view', 'orders', 'orders.view', 'orders.manage',
        'staff', 'staff.view', 'staff.manage', 'picking', 'picking.view', 'picking.manage',
        'history', 'history.view', 'alerts', 'alerts.view', 'analytics', 'analytics.view',
        'reports', 'reports.view', 'view_reports', 'manage_users', 'warehouse.view',
        'warehouse.edit', 'schedule.view', 'inventory.view'
      ]
    },
    {
      id: 3,
      email: 'staff@mia.vn',
      password: '123456',
      name: 'Lê Văn Staff',
      role: 'staff',
      permissions: [
        'dashboard', 'dashboard.view', 'orders', 'orders.view', 'picking', 'picking.view',
        'history', 'history.view', 'view_reports', 'warehouse.view', 'schedule.view'
      ]
    }
  ],

  // API URLs
  GOOGLE_SHEETS_API: {
    SCRIPT_ID: 'YOUR_ACTUAL_SCRIPT_ID_HERE',
    BASE_URL: 'https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID_HERE/exec'
  },

  // Feature flags
  FEATURES: {
    MOCK_API: true,
    AUTO_LOGIN: false,
    DEBUG_MODE: true
  }
};
