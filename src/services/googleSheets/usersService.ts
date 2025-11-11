// src/services/googleSheets/usersService.ts
import { BaseGoogleSheetsService } from './baseService';

export interface GoogleSheetsUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  roleId: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'driver' | 'customer' | 'guest';
  permissions: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  company?: string;
  position?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    language: 'vi' | 'en';
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

class UsersService extends BaseGoogleSheetsService {
  private sheetName = 'Users';

  // Convert Google Sheets user to app user format
  private convertToAppUser(sheetsUser: GoogleSheetsUser): User {
    const [firstName, ...lastNameParts] = sheetsUser.fullName.split(' ');
    const lastName = lastNameParts.join(' ') || '';

    // Map roleId to role
    const roleMap: Record<string, User['role']> = {
      '1': 'admin',
      '2': 'manager',
      '3': 'driver',
      '4': 'customer',
      '5': 'guest',
    };

    // Map roleId to permissions
    const permissionsMap: Record<string, string[]> = {
      '1': [
        'read:users',
        'write:users',
        'delete:users',
        'read:orders',
        'write:orders',
        'delete:orders',
        'read:carriers',
        'write:carriers',
        'delete:carriers',
      ],
      '2': [
        'read:users',
        'read:orders',
        'write:orders',
        'read:carriers',
        'write:carriers',
      ],
      '3': ['read:orders', 'write:orders'],
      '4': ['read:orders'],
      '5': [],
    };

    return {
      id: sheetsUser.id,
      email: sheetsUser.email,
      firstName,
      lastName,
      role: roleMap[sheetsUser.roleId] || 'guest',
      permissions: permissionsMap[sheetsUser.roleId] || [],
      isActive: sheetsUser.status === 'active',
      isEmailVerified: true, // Assume verified for Google Sheets users
      createdAt: sheetsUser.createdAt,
      updatedAt: sheetsUser.updatedAt,
    };
  }

  // Convert app user to Google Sheets format
  private convertToSheetsUser(user: Partial<User>): Partial<GoogleSheetsUser> {
    const roleMap: Record<string, string> = {
      admin: '1',
      manager: '2',
      driver: '3',
      customer: '4',
      guest: '5',
    };

    return {
      id: user.id,
      email: user.email,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      roleId: roleMap[user.role || 'guest'],
      status: user.isActive ? 'active' : 'inactive',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getRecords<GoogleSheetsUser>(this.sheetName);
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      return user ? this.convertToAppUser(user) : null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const users = await this.getRecords<GoogleSheetsUser>(this.sheetName);
      const user = users.find((u) => u.id === id);
      return user ? this.convertToAppUser(user) : null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  // Verify password (simple hash comparison for demo)
  async verifyPassword(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) return null;

      // Get the raw Google Sheets user to access passwordHash
      const users = await this.getRecords<GoogleSheetsUser>(this.sheetName);
      const sheetsUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!sheetsUser) return null;

      // Simple password verification (in production, use proper hashing)
      // For demo purposes, we'll use a simple comparison
      const isValidPassword =
        this.simpleHash(password) === sheetsUser.passwordHash;

      return isValidPassword ? user : null;
    } catch (error) {
      console.error('Error verifying password:', error);
      return null;
    }
  }

  // Simple hash function for demo (use bcrypt in production)
  private simpleHash(password: string): string {
    // This is just for demo - use proper hashing in production
    return btoa(password + 'salt');
  }

  // Create new user
  async createUser(userData: Partial<User>, password: string): Promise<User> {
    try {
      const newUser: Partial<GoogleSheetsUser> = {
        id: Date.now().toString(), // Simple ID generation
        email: userData.email,
        passwordHash: this.simpleHash(password),
        fullName:
          `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        roleId:
          userData.role === 'admin'
            ? '1'
            : userData.role === 'manager'
              ? '2'
              : userData.role === 'driver'
                ? '3'
                : userData.role === 'customer'
                  ? '4'
                  : '5',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const createdUser = await this.addRecord<GoogleSheetsUser>(
        this.sheetName,
        newUser
      );
      return this.convertToAppUser(createdUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const users = await this.getRecords<GoogleSheetsUser>(this.sheetName);
      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const sheetsUpdates = this.convertToSheetsUser(updates);
      sheetsUpdates.updatedAt = new Date().toISOString();

      const updatedUser = await this.updateRecord<GoogleSheetsUser>(
        this.sheetName,
        id,
        'id',
        sheetsUpdates
      );

      return this.convertToAppUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.getRecords<GoogleSheetsUser>(this.sheetName);
      return users.map((user) => this.convertToAppUser(user));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }
}

export const usersService = new UsersService();
export default usersService;
