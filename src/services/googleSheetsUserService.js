// Google Sheets User Service - Browser compatible version
import { logService } from './logService';

const userSheetsLogger = {
  debug: (message, data) => logService.debug('GoogleSheetsUserService', message, data),
  info: (message, data) => logService.info('GoogleSheetsUserService', message, data),
  warn: (message, data) => logService.warn('GoogleSheetsUserService', message, data),
  error: (message, error, data) =>
    logService.error('GoogleSheetsUserService', message, {
      ...data,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    }),
};

class GoogleSheetsUserService {
  constructor() {
    this.cache = null;
    this.lastCacheTime = null;
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    this.spreadsheetId =
      process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID ||
      '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
  }

  // Read users from Google Sheets via backend API
  async getUsersFromSheet() {
    try {
      // Use cached data if available and fresh
      if (this.cache && this.lastCacheTime && Date.now() - this.lastCacheTime < this.cacheTimeout) {
        return this.cache;
      }

      userSheetsLogger.debug('Reading users from Users sheet');

      // Use backend API to read from Google Sheets
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3100'}/api/sheets/read`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spreadsheetId: this.spreadsheetId,
            sheetName: 'Users',
            range: 'A:H',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();
      const data = result.values || result.data || [];

      if (!data || data.length === 0) {
        userSheetsLogger.warn('No data found in Users sheet');
        return [];
      }

      // Parse header row
      const headers = data[0];
      const userIndexMap = {
        id: headers.indexOf('id'),
        email: headers.indexOf('email'),
        passwordHash: headers.indexOf('passwordHash'),
        fullName: headers.indexOf('fullName'),
        roleId: headers.indexOf('roleId'),
        status: headers.indexOf('status'),
        createdAt: headers.indexOf('createdAt'),
        updatedAt: headers.indexOf('updatedAt'),
      };

      // Parse user rows
      const users = data.slice(1).map((row) => ({
        id: row[userIndexMap.id],
        email: row[userIndexMap.email],
        passwordHash: row[userIndexMap.passwordHash],
        name: row[userIndexMap.fullName],
        role: row[userIndexMap.roleId],
        status: row[userIndexMap.status],
        createdAt: row[userIndexMap.createdAt],
        updatedAt: row[userIndexMap.updatedAt],
      }));

      // Cache the result
      this.cache = users;
      this.lastCacheTime = Date.now();

      userSheetsLogger.info('Users fetched from Google Sheets', { count: users.length });
      return users;
    } catch (error) {
      userSheetsLogger.error('Error reading users from Google Sheets', error);
      // Fallback to empty array
      return [];
    }
  }

  // Demo users fallback
  getDemoUsers() {
    return [
      {
        id: 'u-admin',
        email: 'admin@mia.vn',
        password: 'admin123',
        name: 'Administrator',
        role: 'admin',
        status: 'active',
        passwordHash: '$2b$10$z1gcqpzxSLNcpSswtwtbfud7GAhMPAdI844NkuR3lYmnZZxMVkKoy',
      },
    ];
  }

  async validateUserCredentials(email, password) {
    userSheetsLogger.debug('Validating credentials', { email });

    try {
      // Try to get users from Google Sheets
      let users = [];

      try {
        users = await this.getUsersFromSheet();
      } catch (sheetError) {
        userSheetsLogger.warn('Failed to read from Google Sheets, using demo users', {
          error:
            sheetError instanceof Error
              ? { message: sheetError.message, stack: sheetError.stack }
              : sheetError,
        });
        users = this.getDemoUsers();
      }

      // Find user by email
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        userSheetsLogger.warn('User not found', { email });
        return { success: false, error: 'Email không tồn tại trong hệ thống' };
      }

      if (user.status !== 'active') {
        userSheetsLogger.warn('User account is not active', { email });
        return { success: false, error: 'Tài khoản đã bị vô hiệu hóa' };
      }

      // TODO: Implement proper bcrypt comparison
      // For now, use simple comparison (NOT SECURE for production)
      const isPasswordValid = await this.comparePassword(password, user.passwordHash);

      if (!isPasswordValid) {
        userSheetsLogger.warn('Invalid password attempt', { email });
        return { success: false, error: 'Mật khẩu không chính xác' };
      }

      // Create authenticated user object
      const authenticatedUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department || 'N/A',
        phone: user.phone || 'N/A',
        picture: null,
        loginMethod: 'google_sheets',
        lastLogin: new Date().toISOString(),
      };

      userSheetsLogger.info('Authentication successful', {
        email: authenticatedUser.email,
        name: authenticatedUser.name,
      });
      return { success: true, user: authenticatedUser };
    } catch (error) {
      userSheetsLogger.error('Authentication error', error, { email });
      return { success: false, error: 'Đã xảy ra lỗi khi xác thực' };
    }
  }

  // Password comparison using backend bcrypt
  async comparePassword(plainPassword, hashedPassword) {
    try {
      // Use backend API for password verification
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3100'}/api/auth/verify-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: plainPassword,
            hash: hashedPassword,
          }),
        }
      );

      if (!response.ok) {
        userSheetsLogger.error('Password verification API error', null, {
          status: response.status,
        });
        return false;
      }

      const result = await response.json();
      return result.isValid === true;
    } catch (error) {
      userSheetsLogger.error('Error verifying password', error);
      // Fallback for development (NOT SECURE for production)
      return plainPassword === hashedPassword;
    }
  }

  async getSheetInfo() {
    userSheetsLogger.debug('Getting demo sheet info');
    return {
      connected: true,
      title: 'MIA Logistics Users (Demo)',
      userCount: this.demoUsers.length,
      source: 'demo_data',
    };
  }
}

export const googleSheetsUserService = new GoogleSheetsUserService();
