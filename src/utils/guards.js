/**
 * Permission Guards và HOC Components
 * Bảo vệ routes và components dựa trên permissions
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import { hasPermission, hasAnyPermission, hasAllPermissions, hasAccess } from './rbac';

/**
 * HOC: withPermission
 * Wrap component với permission check
 */
export const withPermission = (Component, permission) => {
  return function WithPermissionWrapper({ user, ...props }) {
    if (!hasPermission(user?.role, permission)) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">
            <Typography variant="h6">Không có quyền truy cập</Typography>
            <Typography variant="body2">Bạn không có quyền để thực hiện hành động này.</Typography>
          </Alert>
        </Box>
      );
    }

    return <Component user={user} {...props} />;
  };
};

/**
 * HOC: requirePermission
 * Redirect nếu không có permission
 */
export const requirePermission = (Component, permission) => {
  return function RequirePermissionWrapper({ user, ...props }) {
    if (!hasPermission(user?.role, permission)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Component user={user} {...props} />;
  };
};

/**
 * HOC: requireAnyPermission
 * Check nếu user có ít nhất 1 trong các permissions
 */
export const requireAnyPermission = (Component, permissions) => {
  return function RequireAnyPermissionWrapper({ user, ...props }) {
    if (!hasAnyPermission(user?.role, permissions)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Component user={user} {...props} />;
  };
};

/**
 * HOC: requireAllPermissions
 * Check nếu user có tất cả permissions
 */
export const requireAllPermissions = (Component, permissions) => {
  return function RequireAllPermissionsWrapper({ user, ...props }) {
    if (!hasAllPermissions(user?.role, permissions)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Component user={user} {...props} />;
  };
};

/**
 * Component: SecurityGuard
 * Bảo vệ route với authentication và permissions
 */
export const SecurityGuard = ({
  children,
  requireAuth = true,
  permission = null,
  permissions = null,
  requireAll = false,
  fallback = null,
}) => {
  return function SecurityGuardWrapper({ user, isAuthenticated }) {
    // Check authentication
    if (requireAuth && !isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // Check single permission
    if (permission) {
      if (!hasPermission(user?.role, permission)) {
        return fallback || <Navigate to="/unauthorized" replace />;
      }
    }

    // Check multiple permissions
    if (permissions && permissions.length > 0) {
      const hasAccess = requireAll
        ? hasAllPermissions(user?.role, permissions)
        : hasAnyPermission(user?.role, permissions);

      if (!hasAccess) {
        return fallback || <Navigate to="/unauthorized" replace />;
      }
    }

    return children;
  };
};

/**
 * Component: PermissionGate
 * Show/hide content based on permission
 */
export const PermissionGate = ({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
  user,
}) => {
  if (!user) return null;

  // Check single permission
  if (permission) {
    if (!hasPermission(user.role, permission)) {
      return fallback;
    }
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(user.role, permissions)
      : hasAnyPermission(user.role, permissions);

    if (!hasAccess) {
      return fallback;
    }
  }

  return children;
};

/**
 * Hook: usePermission
 * Hook để check permission trong component
 */
export const usePermission = (user) => {
  return {
    hasPermission: (permission) => hasPermission(user?.role, permission),
    hasAnyPermission: (permissions) => hasAnyPermission(user?.role, permissions),
    hasAllPermissions: (permissions) => hasAllPermissions(user?.role, permissions),
    hasAccess: (resource, action) => hasAccess(user?.role, resource, action),
  };
};

export default {
  withPermission,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  SecurityGuard,
  PermissionGate,
  usePermission,
};
