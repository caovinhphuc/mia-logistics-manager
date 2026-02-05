// Auth Service - Authentication and session management
import { logService } from '../logService';
import { permissionService } from './permissionService';
import { roleService } from './roleService';
import { userService } from './userService';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentToken = null;
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.lastActivityTime = null;
  }

  /**
   * Login user with email and password
   */
  async login(email, password) {
    try {
      logService.debug('AuthService', 'Attempting login', { email });

      // Get user by email
      const user = await userService.getUserByEmail(email);

      // Verify password (in production, use bcrypt)
      const isValidPassword = await userService.verifyPassword(user.id, password);

      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      // Get user roles
      const roles = await roleService.getUserRoles(user.id);

      // Get user permissions
      const permissions = await permissionService.getUserPermissions(user.id);

      // Create session
      const sessionData = {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          roleId: user.roleId,
          roles,
          permissions,
        },
        token: this.generateToken(user.id),
        loginTime: new Date().toISOString(),
        lastActivityTime: new Date().toISOString(),
      };

      // Store session in localStorage
      localStorage.setItem('authSession', JSON.stringify(sessionData));
      this.currentUser = sessionData.user;
      this.currentToken = sessionData.token;
      this.lastActivityTime = Date.now();

      logService.info('AuthService', 'User logged in successfully', { userId: user.id });

      return sessionData;
    } catch (error) {
      logService.error('AuthService', 'Login failed', { error, email });
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      logService.debug('AuthService', 'Logging out user', { userId: this.currentUser?.id });

      localStorage.removeItem('authSession');
      this.currentUser = null;
      this.currentToken = null;
      this.lastActivityTime = null;

      logService.info('AuthService', 'User logged out');

      return true;
    } catch (error) {
      logService.error('AuthService', 'Logout failed', { error });
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }

    const sessionData = localStorage.getItem('authSession');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        this.currentUser = parsed.user;
        this.currentToken = parsed.token;
        return this.currentUser;
      } catch (error) {
        logService.error('AuthService', 'Failed to parse session data', { error });
        return null;
      }
    }

    return null;
  }

  /**
   * Get current token
   */
  getCurrentToken() {
    if (this.currentToken) {
      return this.currentToken;
    }

    const sessionData = localStorage.getItem('authSession');
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        this.currentToken = parsed.token;
        return this.currentToken;
      } catch (error) {
        logService.error('AuthService', 'Failed to parse session token', { error });
        return null;
      }
    }

    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null && this.getCurrentToken() !== null;
  }

  /**
   * Check if user has role
   */
  hasRole(roleId) {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.roles?.some((role) => role.id === roleId);
  }

  /**
   * Check if user has permission
   */
  hasPermission(permissionId) {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.permissions?.some((permission) => permission.id === permissionId);
  }

  /**
   * Refresh user session
   */
  async refreshSession() {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No active session');
      }

      logService.debug('AuthService', 'Refreshing session', { userId: user.id });

      // Get fresh user data
      const freshUser = await userService.getUserById(user.id);
      const roles = await roleService.getUserRoles(user.id);
      const permissions = await permissionService.getUserPermissions(user.id);

      const sessionData = {
        user: {
          ...freshUser,
          roles,
          permissions,
        },
        token: this.generateToken(user.id),
        loginTime: new Date().toISOString(),
        lastActivityTime: new Date().toISOString(),
      };

      localStorage.setItem('authSession', JSON.stringify(sessionData));
      this.currentUser = sessionData.user;
      this.currentToken = sessionData.token;
      this.lastActivityTime = Date.now();

      logService.info('AuthService', 'Session refreshed');

      return sessionData;
    } catch (error) {
      logService.error('AuthService', 'Failed to refresh session', { error });
      throw error;
    }
  }

  /**
   * Generate JWT token (simple implementation)
   */
  generateToken(userId) {
    // In production, implement proper JWT token generation
    // This is a simple placeholder
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        userId,
        iat: Date.now(),
        exp: Date.now() + this.sessionTimeout,
      })
    );
    const signature = btoa('signature');

    return `${header}.${payload}.${signature}`;
  }

  /**
   * Check session timeout
   */
  checkSessionTimeout() {
    if (!this.lastActivityTime) return false;

    const now = Date.now();
    if (now - this.lastActivityTime > this.sessionTimeout) {
      this.logout();
      return true;
    }

    return false;
  }

  /**
   * Update activity time
   */
  updateActivityTime() {
    this.lastActivityTime = Date.now();
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      logService.debug('AuthService', 'Registering new user', { email: userData.email });

      const newUser = await userService.createUser({
        id: this.generateUserId(),
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        roleId: 'employee', // Default role
        passwordHash: userData.password, // In production, hash this with bcrypt
      });

      logService.info('AuthService', 'User registered successfully', { userId: newUser.id });

      return newUser;
    } catch (error) {
      logService.error('AuthService', 'Registration failed', { error });
      throw error;
    }
  }

  /**
   * Generate unique user ID
   */
  generateUserId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const authService = new AuthService();
