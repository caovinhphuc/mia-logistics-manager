import type { ReactNode } from 'react';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../../utils/rbac';
import { useAuth } from '../../contexts/AuthContext';

type PermissionGateProps = {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: ReactNode;
};

/**
 * PermissionGate Component
 * Show/hide children based on permissions
 */
const PermissionGate = ({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: PermissionGateProps) => {
  const { user } = useAuth();

  if (!user) return fallback;

  // Check single permission
  let hasAccess = false;
  if (permission) {
    hasAccess = hasPermission(user.role, permission);
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(user.role, permissions)
      : hasAnyPermission(user.role, permissions);
  }

  return hasAccess ? children : fallback;
};

export default PermissionGate;
