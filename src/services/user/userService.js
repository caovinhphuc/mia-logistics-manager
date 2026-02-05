// User Service - Google Sheets based user management
import { logService } from '../logService';

class UserService {
  constructor() {
    this.spreadsheetId = process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID;
    this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3100';
  }

  /**
   * Get all users from Google Sheets
   */
  async getAllUsers() {
    try {
      logService.debug('UserService', 'Fetching all users');

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'Users',
          range: 'A:G',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.values || [];
    } catch (error) {
      logService.error('UserService', 'Failed to fetch users', { error });
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      logService.debug('UserService', 'Fetching user', { userId });

      const users = await this.getAllUsers();
      const user = users.find((u) => u[0] === userId);

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      return this.mapRowToUser(user);
    } catch (error) {
      logService.error('UserService', 'Failed to fetch user', { error, userId });
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email) {
    try {
      logService.debug('UserService', 'Fetching user by email', { email });

      const users = await this.getAllUsers();
      const user = users.find((u) => u[2] === email);

      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }

      return this.mapRowToUser(user);
    } catch (error) {
      logService.error('UserService', 'Failed to fetch user by email', { error, email });
      throw error;
    }
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    try {
      logService.debug('UserService', 'Creating user', { userData });

      const newRow = [
        userData.id,
        userData.username,
        userData.email,
        userData.fullName || '',
        userData.roleId || 'employee',
        userData.passwordHash || '',
        new Date().toISOString(),
      ];

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/append`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'Users',
          values: [newRow],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return this.mapRowToUser(newRow);
    } catch (error) {
      logService.error('UserService', 'Failed to create user', { error, userData });
      throw error;
    }
  }

  /**
   * Update user
   */
  async updateUser(userId, updates) {
    try {
      logService.debug('UserService', 'Updating user', { userId, updates });

      const user = await this.getUserById(userId);
      const updated = { ...user, ...updates };

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'Users',
          userId,
          values: [
            updated.id,
            updated.username,
            updated.email,
            updated.fullName || '',
            updated.roleId || 'employee',
            updated.passwordHash || '',
            updated.createdAt || new Date().toISOString(),
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return updated;
    } catch (error) {
      logService.error('UserService', 'Failed to update user', { error, userId, updates });
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    try {
      logService.debug('UserService', 'Deleting user', { userId });

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'Users',
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      logService.error('UserService', 'Failed to delete user', { error, userId });
      throw error;
    }
  }

  /**
   * Map spreadsheet row to user object
   */
  mapRowToUser(row) {
    return {
      id: row[0],
      username: row[1],
      email: row[2],
      fullName: row[3],
      roleId: row[4],
      passwordHash: row[5],
      createdAt: row[6],
    };
  }

  /**
   * Verify password (basic implementation)
   */
  async verifyPassword(userId, password) {
    try {
      logService.debug('UserService', 'Verifying password', { userId });

      const user = await this.getUserById(userId);
      // In production, use bcrypt to compare hashed passwords
      // This is a placeholder - implement actual password verification
      return user.passwordHash === password;
    } catch (error) {
      logService.error('UserService', 'Failed to verify password', { error, userId });
      return false;
    }
  }
}

export const userService = new UserService();
