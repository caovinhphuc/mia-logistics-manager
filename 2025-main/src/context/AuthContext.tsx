import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { DEV_CONFIG } from '../config/development';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  refreshUserPermissions: () => void;
}

// Export the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize user from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Development login with mock users
      if (process.env.NODE_ENV === 'development') {
        const mockUser = DEV_CONFIG.MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );
        if (mockUser) {
          const user: User = {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
            role: mockUser.role as 'admin' | 'manager' | 'staff',
            permissions: mockUser.permissions,
          };
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          return;
        } else {
          throw new Error('Invalid credentials');
        }
      }

      // Production login logic here
      throw new Error('Production login not implemented yet');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const refreshUserPermissions = useCallback(() => {
    if (!user) return;
    const updatedUser = { ...user }; // Add logic to refresh permissions if needed
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    hasPermission,
    refreshUserPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook để sử dụng AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
