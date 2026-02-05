// Simple permission check utility
export const hasPermission = (_resource: string, _action: string): boolean => {
  // For now, return true for all permissions
  // In a real app, this would check user roles and permissions
  return true;
};

// Mock session utility
export const getSession = () => {
  // Mock session data
  return {
    user: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    },
    isAuthenticated: true,
  };
};
