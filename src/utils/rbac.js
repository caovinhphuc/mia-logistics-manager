/**
 * RBAC (Role-Based Access Control) Utilities
 * Quản lý roles và permissions cho MIA Logistics Manager
 */

// ==================== ROLES ====================
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  OPERATOR: 'operator',
  DRIVER: 'driver',
  WAREHOUSE_STAFF: 'warehouse_staff',
  HR: 'hr',
};

// ==================== PERMISSIONS ====================
// Format: resource:action
export const PERMISSIONS = {
  // Employees
  EMPLOYEES_VIEW: 'employees:view',
  EMPLOYEES_CREATE: 'employees:create',
  EMPLOYEES_UPDATE: 'employees:update',
  EMPLOYEES_DELETE: 'employees:delete',

  // Transfers
  TRANSFERS_VIEW: 'transfers:view',
  TRANSFERS_CREATE: 'transfers:create',
  TRANSFERS_UPDATE: 'transfers:update',
  TRANSFERS_DELETE: 'transfers:delete',

  // Carriers
  CARRIERS_VIEW: 'carriers:view',
  CARRIERS_CREATE: 'carriers:create',
  CARRIERS_UPDATE: 'carriers:update',
  CARRIERS_DELETE: 'carriers:delete',

  // Locations
  LOCATIONS_VIEW: 'locations:view',
  LOCATIONS_CREATE: 'locations:create',
  LOCATIONS_UPDATE: 'locations:update',
  LOCATIONS_DELETE: 'locations:delete',

  // Transport Requests
  TRANSPORT_REQUESTS_VIEW: 'transport-requests:view',
  TRANSPORT_REQUESTS_CREATE: 'transport-requests:create',
  TRANSPORT_REQUESTS_UPDATE: 'transport-requests:update',
  TRANSPORT_REQUESTS_DELETE: 'transport-requests:delete',

  // Inbound
  INBOUND_INTERNATIONAL_VIEW: 'inbound-international:view',
  INBOUND_DOMESTIC_VIEW: 'inbound-domestic:view',
  INBOUND_SCHEDULE_VIEW: 'inbound-schedule:view',

  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_UPDATE: 'settings:update',

  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_CREATE: 'reports:create',

  // Partners
  PARTNERS_VIEW: 'partners:view',
  PARTNERS_CREATE: 'partners:create',
  PARTNERS_UPDATE: 'partners:update',
  PARTNERS_DELETE: 'partners:delete',
};

// ==================== ROLE PERMISSIONS MAPPING ====================
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Full access
    ...Object.values(PERMISSIONS),
  ],

  [ROLES.MANAGER]: [
    // Employees
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.EMPLOYEES_CREATE,
    PERMISSIONS.EMPLOYEES_UPDATE,

    // Transfers
    PERMISSIONS.TRANSFERS_VIEW,
    PERMISSIONS.TRANSFERS_CREATE,
    PERMISSIONS.TRANSFERS_UPDATE,

    // Carriers
    PERMISSIONS.CARRIERS_VIEW,
    PERMISSIONS.CARRIERS_CREATE,
    PERMISSIONS.CARRIERS_UPDATE,

    // Locations
    PERMISSIONS.LOCATIONS_VIEW,
    PERMISSIONS.LOCATIONS_CREATE,
    PERMISSIONS.LOCATIONS_UPDATE,

    // Transport Requests
    PERMISSIONS.TRANSPORT_REQUESTS_VIEW,
    PERMISSIONS.TRANSPORT_REQUESTS_CREATE,
    PERMISSIONS.TRANSPORT_REQUESTS_UPDATE,

    // Inbound
    PERMISSIONS.INBOUND_INTERNATIONAL_VIEW,
    PERMISSIONS.INBOUND_DOMESTIC_VIEW,
    PERMISSIONS.INBOUND_SCHEDULE_VIEW,

    // Reports
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,

    // Partners
    PERMISSIONS.PARTNERS_VIEW,
    PERMISSIONS.PARTNERS_CREATE,
    PERMISSIONS.PARTNERS_UPDATE,
  ],

  [ROLES.OPERATOR]: [
    // Employees
    PERMISSIONS.EMPLOYEES_VIEW,

    // Transfers
    PERMISSIONS.TRANSFERS_VIEW,
    PERMISSIONS.TRANSFERS_CREATE,
    PERMISSIONS.TRANSFERS_UPDATE,

    // Carriers
    PERMISSIONS.CARRIERS_VIEW,
    PERMISSIONS.CARRIERS_CREATE,
    PERMISSIONS.CARRIERS_UPDATE,

    // Transport Requests
    PERMISSIONS.TRANSPORT_REQUESTS_VIEW,
    PERMISSIONS.TRANSPORT_REQUESTS_CREATE,
    PERMISSIONS.TRANSPORT_REQUESTS_UPDATE,

    // Partners
    PERMISSIONS.PARTNERS_VIEW,
  ],

  [ROLES.DRIVER]: [
    // Transport Requests
    PERMISSIONS.TRANSPORT_REQUESTS_VIEW,

    // Locations
    PERMISSIONS.LOCATIONS_VIEW,
  ],

  [ROLES.WAREHOUSE_STAFF]: [
    // Transfers
    PERMISSIONS.TRANSFERS_VIEW,
    PERMISSIONS.TRANSFERS_CREATE,
    PERMISSIONS.TRANSFERS_UPDATE,

    // Locations
    PERMISSIONS.LOCATIONS_VIEW,

    // Inbound
    PERMISSIONS.INBOUND_INTERNATIONAL_VIEW,
    PERMISSIONS.INBOUND_DOMESTIC_VIEW,
    PERMISSIONS.INBOUND_SCHEDULE_VIEW,
  ],

  [ROLES.HR]: [
    // Employees
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.EMPLOYEES_CREATE,
    PERMISSIONS.EMPLOYEES_UPDATE,
  ],
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {Array} Array of permissions
 */
export const getPermissionsByRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if user has a specific permission
 * @param {string} userRole - User's role
 * @param {string} permission - Permission to check
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;

  // Admin has all permissions
  if (userRole === ROLES.ADMIN) return true;

  const permissions = getPermissionsByRole(userRole);
  return permissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {string} userRole - User's role
 * @param {Array} permissions - Array of permissions to check
 * @returns {boolean} True if user has at least one permission
 */
export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole) return false;

  // Admin has all permissions
  if (userRole === ROLES.ADMIN) return true;

  const userPermissions = getPermissionsByRole(userRole);
  return permissions.some((permission) => userPermissions.includes(permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {string} userRole - User's role
 * @param {Array} permissions - Array of permissions to check
 * @returns {boolean} True if user has all permissions
 */
export const hasAllPermissions = (userRole, permissions) => {
  if (!userRole) return false;

  // Admin has all permissions
  if (userRole === ROLES.ADMIN) return true;

  const userPermissions = getPermissionsByRole(userRole);
  return permissions.every((permission) => userPermissions.includes(permission));
};

/**
 * Get available actions for a resource based on user role
 * @param {string} userRole - User's role
 * @param {string} resource - Resource name (e.g., 'employees', 'transfers')
 * @returns {Array} Array of available actions ['view', 'create', 'update', 'delete']
 */
export const getAvailableActions = (userRole, resource) => {
  if (!userRole) return [];

  const actions = [];
  const permissionPrefix = `${resource}:`;

  getPermissionsByRole(userRole).forEach((permission) => {
    if (permission.startsWith(permissionPrefix)) {
      const action = permission.split(':')[1];
      actions.push(action);
    }
  });

  return actions;
};

/**
 * Check if user has access to a resource
 * @param {string} userRole - User's role
 * @param {string} resource - Resource name
 * @param {string} action - Action name (optional)
 * @returns {boolean} True if user has access
 */
export const hasAccess = (userRole, resource, action = 'view') => {
  if (!userRole) return false;

  const permission = action ? `${resource}:${action}` : `${resource}:view`;
  return hasPermission(userRole, permission);
};

// ==================== EXPORTS ====================
const rbacUtils = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getPermissionsByRole,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getAvailableActions,
  hasAccess,
};

export default rbacUtils;
