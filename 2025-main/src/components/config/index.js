export   const SYSTEM_CONFIG = {
    API_BASE_URL: 'https://api.example.com',
    TIMEOUT: 30000,
    DATE_FORMATS: {
        display: 'dd/MM/yyyy',
        api: 'yyyy-MM-dd'
    },
    PAGINATION: {
        defaultPageSize: 10,
        pageSizeOptions: [10, 20, 50, 100]
    },
    DEFAULT_THEME: 'light'
};
export const ROLES = {
    ADMIN: {
        id: 'admin',
        label: 'Quản trị viên',
        permissions: ['dashboard', 'orders', 'staff', 'analytics', 'settings', 'reports', 'permissions', 'profile']
    },
    MANAGER: {
        id: 'manager',
        label: 'Quản lý',
        permissions: ['dashboard', 'orders', 'staff', 'analytics', 'reports', 'profile']
    },
    STAFF: {
        id: 'staff',
        label: 'Nhân viên',
        permissions: ['dashboard', 'orders', 'profile']
    }
};
