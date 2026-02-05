// Permission Service - Google Sheets based permission management
import { logService } from '../logService';

class PermissionService {
  constructor() {
    this.spreadsheetId = process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID;
    this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3100';
  }

  /**
   * Get all permissions from Google Sheets
   */
  async getAllPermissions() {
    try {
      logService.debug('PermissionService', 'Fetching all permissions');

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'Permissions',
          range: 'A:C',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return (data.values || []).map((row) => this.mapRowToPermission(row));
    } catch (error) {
      logService.error('PermissionService', 'Failed to fetch permissions', { error });
      throw error;
    }
  }

  /**
   * Get permission by ID
   */
  async getPermissionById(permissionId) {
    try {
      logService.debug('PermissionService', 'Fetching permission', { permissionId });

      const permissions = await this.getAllPermissions();
      const permission = permissions.find((p) => p.id === permissionId);

      if (!permission) {
        throw new Error(`Permission with ID ${permissionId} not found`);
      }

      return permission;
    } catch (error) {
      logService.error('PermissionService', 'Failed to fetch permission', { error, permissionId });
      throw error;
    }
  }

  /**
   * Get permissions for role
   */
  async getRolePermissions(roleId) {
    try {
      logService.debug('PermissionService', 'Fetching role permissions', { roleId });

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'RolePermissions',
          range: 'A:B',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const rolePermissionRows = (data.values || []).filter((row) => row[0] === roleId);

      const permissions = await this.getAllPermissions();
      return permissions.filter((permission) =>
        rolePermissionRows.some((row) => row[1] === permission.id)
      );
    } catch (error) {
      logService.error('PermissionService', 'Failed to fetch role permissions', {
        error,
        roleId,
      });
      throw error;
    }
  }

  /**
   * Check if role has permission
   */
  async hasRolePermission(roleId, permissionId) {
    try {
      logService.debug('PermissionService', 'Checking role permission', { roleId, permissionId });

      const permissions = await this.getRolePermissions(roleId);
      return permissions.some((p) => p.id === permissionId);
    } catch (error) {
      logService.error('PermissionService', 'Failed to check role permission', {
        error,
        roleId,
        permissionId,
      });
      return false;
    }
  }

  /**
   * Get permissions for user
   */
  async getUserPermissions(userId) {
    try {
      logService.debug('PermissionService', 'Fetching user permissions', { userId });

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'Users',
          range: 'A:E',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const userRow = (data.values || []).find((row) => row[0] === userId);

      if (!userRow) {
        throw new Error(`User with ID ${userId} not found`);
      }

      const roleId = userRow[4];
      return await this.getRolePermissions(roleId);
    } catch (error) {
      logService.error('PermissionService', 'Failed to fetch user permissions', {
        error,
        userId,
      });
      throw error;
    }
  }

  /**
   * Create new permission
   */
  async createPermission(permissionData) {
    try {
      logService.debug('PermissionService', 'Creating permission', { permissionData });

      const newRow = [permissionData.id, permissionData.name, permissionData.description || ''];

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/append`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'Permissions',
          values: [newRow],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return this.mapRowToPermission(newRow);
    } catch (error) {
      logService.error('PermissionService', 'Failed to create permission', {
        error,
        permissionData,
      });
      throw error;
    }
  }

  /**
   * Assign permission to role
   */
  async assignPermissionToRole(roleId, permissionId) {
    try {
      logService.debug('PermissionService', 'Assigning permission to role', {
        roleId,
        permissionId,
      });

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/append`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'RolePermissions',
          values: [[roleId, permissionId]],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      logService.error('PermissionService', 'Failed to assign permission to role', {
        error,
        roleId,
        permissionId,
      });
      throw error;
    }
  }

  /**
   * Revoke permission from role
   */
  async revokePermissionFromRole(roleId, permissionId) {
    try {
      logService.debug('PermissionService', 'Revoking permission from role', {
        roleId,
        permissionId,
      });

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'RolePermissions',
          roleId,
          permissionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      logService.error('PermissionService', 'Failed to revoke permission from role', {
        error,
        roleId,
        permissionId,
      });
      throw error;
    }
  }

  /**
   * Map spreadsheet row to permission object
   */
  mapRowToPermission(row) {
    return {
      id: row[0],
      name: row[1],
      description: row[2],
    };
  }
}

export const permissionService = new PermissionService();
