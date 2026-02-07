import React, { createContext, useContext, ReactNode, useCallback } from 'react';
// Remove duplicate import or rename to avoid conflict
// import { ROLE_PERMISSIONS } from '../constants';
import { AuthContext } from './AuthContext';
// Define the User interface


interface User {
   role?: string;
   id?: number;
   email?: string;
   name?: string;
   permissions?: string[];
   // Add other user properties as needed
}

// Define the permissions for each role
const ROLE_PERMISSIONS: Record<string, string[]> = {
   // Admin has all permissions
   admin: [
     '*', 'dashboard', 'dashboard.view', 'orders', 'orders.view', 'orders.manage',
     'staff', 'staff.view', 'staff.manage', 'picking', 'picking.view', 'picking.manage',
     'history', 'history.view', 'alerts', 'alerts.view', 'analytics', 'analytics.view',
     'reports', 'reports.view', 'settings', 'settings.manage', 'permissions', 'permissions.manage',
     'view_reports', 'manage_users'
   ],
   // Manager has most permissions except some admin-only features
   manager: [
     'dashboard', 'dashboard.view', 'orders', 'orders.view', 'orders.manage',
     'staff', 'staff.view', 'staff.manage', 'picking', 'picking.view', 'picking.manage',
     'history', 'history.view', 'alerts', 'alerts.view', 'analytics', 'analytics.view',
     'reports', 'reports.view', 'view_reports', 'manage_users'
   ],
   // Staff has limited permissions
   staff: [
     'dashboard', 'dashboard.view', 'orders', 'orders.view', 'picking', 'picking.view',
     'history', 'history.view', 'view_reports'
   ],
   // Regular user can only view basic reports
   user: ['dashboard', 'dashboard.view', 'view_reports'],
   // Guest has minimal access
   guest: ['dashboard', 'dashboard.view']
};
export interface PermissionContextType {
   // Methods to check permissions
   canAccess: (permissions: string[]) => boolean;
   // Methods to check if a user has a specific permission
  hasPermission: (permission: string) => boolean;
  checkPermission: (permission: string) => boolean;
  permissions: string[];
  getUserPermissions: () => string[];
  getUserRole: () => string | null;
};

interface PermissionContextProps {
   // Props for the permission context provider
   canAccess: (permissions: string[]) => boolean;
   hasPermission: (permission: string) => boolean;
   checkPermission: (permission: string) => boolean;
   permissions: string[];
   getUserPermissions: () => string[];
   getUserRole: () => string | null;
   children: ReactNode;
}



export interface PermissionProviderProps {

   // Props for the PermissionProvider component
   children: ReactNode;
   user: User | null;
   getUserPermissions?: () => string[];
   getUserRole?: () => string | null;
   canAccess?: (permissions: string[]) => boolean;
   hasPermission?: (permission: string) => boolean;
   checkPermission?: (permission: string) => boolean;
   permissions?: string[];
   getUser?: () => User | null;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);


export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
   // Use AuthContext to get the current user

   const authContext = useContext(AuthContext);
   // Ensure that the PermissionProvider is used within an AuthProvider
   // If not, throw an error
  if (!authContext) {
     throw new Error('PermissionProvider must be used within an AuthProvider');

  }
   const { user } = authContext;
   // Define methods to get user role and permissions


   const getUserRole = (): string | null => {
      if (!user) return null;
      // Return the user's role or null if not available
   if (typeof user.role === 'string') {
         return user.role;
      }
      // Fallback if role is not a string or object
      if (typeof user.role === 'undefined' || user.role === null) {
         return null;
      }
      // If role is not a string, object, or array, return null
      if (typeof user.role !== 'string' && typeof user.role !== 'object') {
         return null;
      }
      // If role is an object, return its string representation
      if (typeof user.role === 'object') {
         return JSON.stringify(user.role);
      }
      return user?.role || null;


   };


   // Function to get user permissions based on their role

   const getUserPermissions = (): string[] => {

      if (!user) return [];
      // If user is not defined, return an empty Array

    const role = user.role;
    if (!role) return [];

    const permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
    return [...permissions];
  };

  const userPermissions = getUserPermissions();
  const canAccess = useCallback((permissions: string[]) => {
    if (!user) return false;

    // Admin with wildcard permission has access to everything
    if (userPermissions.includes('*')) return true;

    // Check if user has any of the required permissions
    return permissions.some(permission => userPermissions.includes(permission));
  }, [userPermissions, user]);

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;

    // Admin with wildcard permission has access to everything
    if (userPermissions.includes('*')) return true;

    return userPermissions.includes(permission);
  }, [userPermissions, user]);

  const checkPermission = useCallback((permission: string) => {
    if (!user) return false;

    // Admin with wildcard permission has access to everything
    if (userPermissions.includes('*')) return true;

    return userPermissions.includes(permission);
  }, [userPermissions, user]);

  const value: PermissionContextType = {
    canAccess,
    hasPermission,
    checkPermission,
    permissions: userPermissions,
    getUserPermissions,
    getUserRole,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

// Export the PermissionContext for use in other components
export { PermissionContext, ROLE_PERMISSIONS };
// Export the PermissionProvider for wrapping the application
// PermissionProvider is already exported with its declaration
// Export the PermissionContextType for use in other parts of the application
export type { PermissionContextProps };
// Export the PermissionContextType for use in other parts of the application

