import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { googleAuthService } from '../services/googleAuthService';
import { logService } from '../services/logService';
import { sessionService } from '../services/sesionService';
import sessionManager from '../services/sessionManager';
import {
  getPermissionsByRole as getPermissionsByRoleFromRBAC,
  hasPermission as hasPermissionFromRBAC,
} from '../utils/rbac';

// Auth state structure
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  permissions: [],
  sessionId: null,
};

// Auth actions
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_PERMISSIONS: 'SET_PERMISSIONS',
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
        permissions: action.payload.permissions || [],
        sessionId: action.payload.sessionId,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
        permissions: [],
        sessionId: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case AUTH_ACTIONS.SET_PERMISSIONS:
      return { ...state, permissions: action.payload };

    default:
      return state;
  }
};

// Role-based permissions - NOW USING rbac.js
// Using the standardized RBAC system from utils/rbac.js
// This ensures consistency across the entire application

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const initializeAuth = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      // Check for existing session
      const session = sessionService.getSession();
      if (session && sessionService.isValidSession(session)) {
        const user = await googleAuthService.getCurrentUser();
        if (user) {
          const permissions = getPermissionsByRole(user.role);
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user, permissions, sessionId: session.id },
          });

          // Log successful session restore
          logService.log('auth', 'Session restored', { userId: user.id });
          return;
        }
      }

      // Clear invalid session
      sessionService.clearSession();
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    } catch (error) {
      logService.error('AuthContext', 'Auth initialization error', { error: error.message });
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Initialize auth on app start
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Session timeout is now handled by sessionManager in App.js
  // Removed this useEffect to avoid initialization order issues

  // Wrap login in useCallback to prevent re-creation
  const login = useCallback(async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      let user;

      if (credentials.googleToken) {
        // Google OAuth login
        user = await googleAuthService.loginWithGoogle(credentials.googleToken);
      } else {
        // Regular login
        user = await googleAuthService.login(credentials.email, credentials.password);
      }

      // Create session
      const session = sessionService.createSession(user);
      const permissions = getPermissionsByRole(user.role);

      // Initialize session manager
      const authToken = session.token || `${user.id}_${Date.now()}`;
      sessionManager.initializeSession(user, authToken);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, permissions, sessionId: session.id },
      });

      // Log successful login
      logService.log('auth', 'Login successful', {
        userId: user.id,
        method: credentials.googleToken ? 'google' : 'email',
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.message || 'Đăng nhập thất bại';
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: errorMessage });

      // Log failed login
      logService.log('auth', 'Login failed', {
        error: errorMessage,
        email: credentials.email,
      });

      return { success: false, error: errorMessage };
    }
  }, []); // No dependencies - all functions used are stable

  const logout = useCallback(
    async (reason = 'User logout') => {
      try {
        const userId = state.user?.id;

        // Clear session manager
        sessionManager.clearSession();

        // Clear session
        sessionService.clearSession();

        // Google logout if needed
        if (googleAuthService.isGoogleUser()) {
          await googleAuthService.logout();
        }

        dispatch({ type: AUTH_ACTIONS.LOGOUT });

        // Log logout
        logService.log('auth', 'Logout', { userId, reason });
      } catch (error) {
        logService.error('AuthContext', 'Logout error', { error: error.message });
        // Force logout anyway
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    },
    [state.user?.id]
  );

  const updateUser = useCallback((userData) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: userData });

    // Update session
    const session = sessionService.getSession();
    if (session) {
      sessionService.updateSession({ ...session.user, ...userData });
    }
  }, []); // No dependencies - sessionService is stable

  // Use standardized RBAC from rbac.js
  const getPermissionsByRole = (role) => {
    return getPermissionsByRoleFromRBAC(role);
  };

  // Check permission using rbac.js (format: resource:action)
  const hasPermission = useCallback(
    (permission) => {
      if (!state.user?.role) return false;
      return hasPermissionFromRBAC(state.user.role, permission);
    },
    [state.user?.role]
  );

  // Role-based checks (backward compatible)
  const hasRole = useCallback(
    (role) => {
      return state.user?.role === role || state.user?.role === 'admin';
    },
    [state.user?.role]
  );

  const hasAnyRole = useCallback(
    (roles) => {
      return roles.some((role) => hasRole(role));
    },
    [hasRole]
  );

  const refreshPermissions = useCallback(() => {
    if (state.user?.role) {
      const permissions = getPermissionsByRole(state.user.role);
      dispatch({ type: AUTH_ACTIONS.SET_PERMISSIONS, payload: permissions });
    }
  }, [state.user?.role]);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // State
      ...state,

      // Actions
      login,
      logout,
      updateUser,

      // Permission helpers
      hasPermission,
      hasRole,
      hasAnyRole,
      refreshPermissions,

      // Utilities
      clearError,
    }),
    [
      state,
      login,
      logout,
      updateUser,
      hasPermission,
      hasRole,
      hasAnyRole,
      refreshPermissions,
      clearError,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for role-based access control
export const withAuth = (WrappedComponent, requiredRoles = []) => {
  return (props) => {
    const { isAuthenticated, hasAnyRole, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Unauthorized</div>;
    }

    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      return <div>Access Denied</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default AuthContext;
