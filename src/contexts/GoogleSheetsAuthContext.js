// Google Sheets Authentication Context
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { logService } from '../services/logService';
import { authService } from '../services/user/authService';

const GoogleSheetsAuthContext = createContext(null);

/**
 * Google Sheets Auth Provider
 */
export const GoogleSheetsAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();

        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
          logService.debug('GoogleSheetsAuthContext', 'User restored from session', {
            userId: currentUser.id,
          });
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setError(err.message);
        logService.error('GoogleSheetsAuthContext', 'Failed to initialize auth', { error: err });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Check session timeout periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const timeoutInterval = setInterval(() => {
      const timedOut = authService.checkSessionTimeout();
      if (timedOut) {
        setUser(null);
        setIsAuthenticated(false);
        logService.warn('GoogleSheetsAuthContext', 'Session timed out');
      }
    }, 60000); // Check every minute

    return () => clearInterval(timeoutInterval);
  }, [isAuthenticated]);

  // Update activity time on user interaction
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      authService.updateActivityTime();
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [isAuthenticated]);

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const sessionData = await authService.login(email, password);
      setUser(sessionData.user);
      setIsAuthenticated(true);

      logService.info('GoogleSheetsAuthContext', 'User logged in', { userId: sessionData.user.id });

      return sessionData.user;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      logService.error('GoogleSheetsAuthContext', 'Login failed', {
        error: err,
        email,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);

      logService.info('GoogleSheetsAuthContext', 'User logged out');
    } catch (err) {
      setError(err.message);
      logService.error('GoogleSheetsAuthContext', 'Logout failed', { error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register new user
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const newUser = await authService.register(userData);

      logService.info('GoogleSheetsAuthContext', 'User registered', { userId: newUser.id });

      return newUser;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      logService.error('GoogleSheetsAuthContext', 'Registration failed', {
        error: err,
        email: userData.email,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if user has role
   */
  const hasRole = useCallback((roleId) => {
    return authService.hasRole(roleId);
  }, []);

  /**
   * Check if user has permission
   */
  const hasPermission = useCallback((permissionId) => {
    return authService.hasPermission(permissionId);
  }, []);

  /**
   * Refresh session
   */
  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      const sessionData = await authService.refreshSession();
      setUser(sessionData.user);

      logService.info('GoogleSheetsAuthContext', 'Session refreshed');

      return sessionData.user;
    } catch (err) {
      setError(err.message);
      logService.error('GoogleSheetsAuthContext', 'Failed to refresh session', { error: err });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    hasRole,
    hasPermission,
    refreshSession,
  };

  return (
    <GoogleSheetsAuthContext.Provider value={value}>{children}</GoogleSheetsAuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 */
export const useGoogleSheetsAuth = () => {
  const context = useContext(GoogleSheetsAuthContext);

  if (!context) {
    throw new Error('useGoogleSheetsAuth must be used within GoogleSheetsAuthProvider');
  }

  return context;
};
