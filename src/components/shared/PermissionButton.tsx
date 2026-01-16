import React from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../../utils/rbac';
import { useAuth } from '../../contexts/AuthContext';

/**
 * PermissionButton Component
 * Button chỉ hiển thị khi user có permission
 */
const PermissionButton = ({
  children,
  permission,
  permissions,
  requireAll = false,
  onClick,
  disabled = false,
  tooltip = '',
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  startIcon = null,
  endIcon = null,
  fullWidth = false,
  sx = {},
  ...otherProps
}) => {
  const { user } = useAuth();

  if (!user) return null;

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

  if (!hasAccess) return null;

  const buttonProps = {
    onClick,
    disabled,
    variant,
    color,
    size,
    startIcon,
    endIcon,
    fullWidth,
    sx,
    ...otherProps,
  };

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <Button {...buttonProps}>{children}</Button>
      </Tooltip>
    );
  }

  return <Button {...buttonProps}>{children}</Button>;
};

/**
 * PermissionIconButton Component
 * IconButton chỉ hiển thị khi user có permission
 */
export const PermissionIconButton = ({
  children,
  permission,
  permissions,
  requireAll = false,
  onClick,
  disabled = false,
  tooltip = '',
  color = 'default',
  size = 'medium',
  sx = {},
  ...otherProps
}) => {
  const { user } = useAuth();

  if (!user) return null;

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

  if (!hasAccess) return null;

  const iconButtonProps = {
    onClick,
    disabled,
    color,
    size,
    sx,
    ...otherProps,
  };

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <IconButton {...iconButtonProps}>{children}</IconButton>
      </Tooltip>
    );
  }

  return <IconButton {...iconButtonProps}>{children}</IconButton>;
};

export default PermissionButton;
