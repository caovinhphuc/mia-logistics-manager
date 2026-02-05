import { sessionService } from '../services/sesionService.js';
import { googleApiLoader } from './googleApiLoader';
import { googleSheetsUserService } from './googleSheetsUserService.js';
import { logService } from './logService';

const formatError = (error) =>
  error instanceof Error ? { message: error.message, stack: error.stack } : error;

const authLogger = {
  debug: (message, data) => logService.debug('GoogleAuthService', message, data),
  info: (message, data) => logService.info('GoogleAuthService', message, data),
  warn: (message, data) => logService.warn('GoogleAuthService', message, data),
  error: (message, error, data = {}) =>
    logService.error('GoogleAuthService', message, { ...data, error: formatError(error) }),
};

class GoogleAuthService {
  cache = [];
  lastCacheTime = 0;
  cacheDuration = 1000 * 60 * 5; // 5 minutes

  constructor() {
    this.isInitialized = false;
    this.currentUser = null;
  }

  async initialize() {
    try {
      // Initialize Google API client
      await googleApiLoader.initializeClient();
      this.isInitialized = true;
      authLogger.info('Google Auth Service initialized');
    } catch (error) {
      authLogger.error('Google Auth initialization failed', error);
      throw error;
    }
  }

  async loginWithGoogle() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Sign in with Google
      const googleUser = await googleApiLoader.signIn();
      const profile = googleUser.getBasicProfile();

      // Create user object
      const user = {
        id: profile.getId(),
        email: profile.getEmail(),
        name: profile.getName(),
        picture: profile.getImageUrl(),
        role: this.determineUserRole(profile.getEmail()),
        googleId: profile.getId(),
        loginMethod: 'google',
        lastLogin: new Date().toISOString(),
      };

      this.currentUser = user;
      authLogger.info('Google login successful', { name: user.name, email: user.email });
      return user;
    } catch (error) {
      authLogger.error('Google login failed', error);
      throw new Error('Đăng nhập Google thất bại');
    }
  }

  async login(email, password) {
    try {
      authLogger.debug('Attempting login with Google Sheets', { email });

      // Use Google Sheets for authentication
      const validationResult = await googleSheetsUserService.validateUserCredentials(
        email,
        password
      );

      if (!validationResult.success) {
        authLogger.warn('Authentication failed', { email, error: validationResult.error });
        throw new Error(validationResult.error);
      }

      const user = validationResult.user;
      authLogger.info('Login successful with Google Sheets', {
        name: user.name,
        email: user.email,
      });

      this.currentUser = user;
      return user;
    } catch (error) {
      authLogger.error('Login failed', error, { email });

      // Fallback to demo accounts if Google Sheets fails
      authLogger.warn('Falling back to demo accounts');
      return await this.loginWithDemoAccounts(email, password);
    }
  }

  async loginWithDemoAccounts(email, password) {
    try {
      authLogger.debug('Using demo accounts for login', { email });

      // Demo accounts as fallback
      const demoAccounts = [
        {
          email: 'admin@mialogistics.com',
          password: 'admin123',
          role: 'admin',
          name: 'Quản trị viên (Demo)',
        },
        {
          email: 'manager@mialogistics.com',
          password: 'manager123',
          role: 'manager',
          name: 'Quản lý (Demo)',
        },
        {
          email: 'operator@mialogistics.com',
          password: 'operator123',
          role: 'operator',
          name: 'Nhân viên điều hành (Demo)',
        },
        {
          email: 'driver@mialogistics.com',
          password: 'driver123',
          role: 'driver',
          name: 'Tài xế (Demo)',
        },
        {
          email: 'warehouse@mialogistics.com',
          password: 'warehouse123',
          role: 'warehouse_staff',
          name: 'Nhân viên kho (Demo)',
        },
      ];

      authLogger.debug('Checking credentials against demo accounts');

      const account = demoAccounts.find((acc) => acc.email.toLowerCase() === email.toLowerCase());

      if (!account) {
        authLogger.warn('Email not found in demo accounts', { email });
        throw new Error('Email không tồn tại trong hệ thống');
      }

      if (account.password !== password) {
        authLogger.warn('Password mismatch for demo account', { email });
        throw new Error('Mật khẩu không chính xác');
      }

      authLogger.info('Demo login successful', { name: account.name, email: account.email });

      const user = {
        id: `demo_${account.role}_${Date.now()}`,
        email: account.email,
        name: account.name,
        role: account.role,
        loginMethod: 'demo',
        lastLogin: new Date().toISOString(),
        picture: null,
        permissions: [],
        metadata: {
          source: 'demo_accounts',
          isDemoUser: true,
        },
      };

      this.currentUser = user;
      authLogger.debug('Demo user object created', { user });
      return user;
    } catch (error) {
      authLogger.error('Demo login failed', error, { email });
      throw error;
    }
  }
  async logout() {
    try {
      this.currentUser = null;
      // Clear any stored tokens
      localStorage.removeItem('google_token');
      authLogger.info('User logged out');
    } catch (error) {
      authLogger.error('Logout failed', error);
      throw error;
    }
  }

  async getCurrentUser() {
    // Try to get from memory first
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from session
    try {
      const session = sessionService.getSession();
      if (session && session.user) {
        this.currentUser = session.user;
        return this.currentUser;
      }
    } catch (error) {
      authLogger.warn('Failed to restore user from session', { error: formatError(error) });
    }

    return null;
  }

  isGoogleUser() {
    return this.currentUser?.loginMethod === 'google';
  }

  determineUserRole(email) {
    // Determine role based on email domain or specific emails
    if (email.includes('admin')) return 'admin';
    if (email.includes('manager')) return 'manager';
    if (email.includes('driver')) return 'driver';
    if (email.includes('warehouse')) return 'warehouse_staff';

    // Default role for external users
    return 'operator';
  }

  async refreshToken() {
    try {
      if (!this.auth) {
        throw new Error('Auth not initialized');
      }

      const client = await this.auth.getClient();
      await client.getAccessToken();

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  async getAuthHeaders() {
    try {
      if (!googleApiLoader.isSignedIn()) {
        throw new Error('User not signed in');
      }

      return googleApiLoader.getAuthHeaders();
    } catch (error) {
      authLogger.error('Failed to get auth headers', error);
      throw error;
    }
  }

  // Check Google Sheets connection status
  async checkSheetsConnection() {
    try {
      authLogger.debug('Checking Google Sheets connection');
      const sheetInfo = await googleSheetsUserService.getSheetInfo();
      authLogger.debug('Sheet info retrieved', { sheetInfo });
      return sheetInfo;
    } catch (error) {
      authLogger.error('Google Sheets connection failed', error);
      return {
        connected: false,
        error: error.message,
        fallbackMode: true,
      };
    }
  }

  // Test method to get users from sheets (for debugging)
  async testSheetsConnection() {
    try {
      authLogger.debug('Testing Google Sheets connection');
      const users = await googleSheetsUserService.getUsersFromSheet();
      authLogger.debug('Users retrieved from sheets', {
        userCount: users.length,
      });
      return { success: true, userCount: users.length, users };
    } catch (error) {
      authLogger.error('Sheets connection test failed', error);
      return { success: false, error: error.message };
    }
  }
}

export const googleAuthService = new GoogleAuthService();
