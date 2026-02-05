// Role Service - Google Sheets based role management
import { logService } from '../logService';

class RoleService {
  constructor() {
    this.spreadsheetId = process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID;
    this.apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3100';
  }

  /**
   * Get all roles from Google Sheets
   */
  async getAllRoles() {
    try {
      logService.debug('RoleService', 'Fetching all roles');

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'Roles',
          range: 'A:D',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return (data.values || []).map((row) => this.mapRowToRole(row));
    } catch (error) {
      logService.error('RoleService', 'Failed to fetch roles', { error });
      throw error;
    }
  }

  /**
   * Get role by ID
   */
  async getRoleById(roleId) {
    try {
      logService.debug('RoleService', 'Fetching role', { roleId });

      const roles = await this.getAllRoles();
      const role = roles.find((r) => r.id === roleId);

      if (!role) {
        throw new Error(`Role with ID ${roleId} not found`);
      }

      return role;
    } catch (error) {
      logService.error('RoleService', 'Failed to fetch role', { error, roleId });
      throw error;
    }
  }

  /**
   * Get roles for user
   */
  async getUserRoles(userId) {
    try {
      logService.debug('RoleService', 'Fetching user roles', { userId });

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'UserRoles',
          range: 'A:B',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const userRoleRows = (data.values || []).filter((row) => row[0] === userId);

      const roles = await this.getAllRoles();
      return roles.filter((role) => userRoleRows.some((row) => row[1] === role.id));
    } catch (error) {
      logService.error('RoleService', 'Failed to fetch user roles', { error, userId });
      throw error;
    }
  }

  /**
   * Create new role
   */
  async createRole(roleData) {
    try {
      logService.debug('RoleService', 'Creating role', { roleData });

      const newRow = [
        roleData.id,
        roleData.name,
        roleData.description || '',
        new Date().toISOString(),
      ];

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/append`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'Roles',
          values: [newRow],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return this.mapRowToRole(newRow);
    } catch (error) {
      logService.error('RoleService', 'Failed to create role', { error, roleData });
      throw error;
    }
  }

  /**
   * Update role
   */
  async updateRole(roleId, updates) {
    try {
      logService.debug('RoleService', 'Updating role', { roleId, updates });

      const role = await this.getRoleById(roleId);
      const updated = { ...role, ...updates };

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'Roles',
          roleId,
          values: [updated.id, updated.name, updated.description || '', updated.createdAt],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return updated;
    } catch (error) {
      logService.error('RoleService', 'Failed to update role', { error, roleId, updates });
      throw error;
    }
  }

  /**
   * Delete role
   */
  async deleteRole(roleId) {
    try {
      logService.debug('RoleService', 'Deleting role', { roleId });

      const response = await fetch(`${this.apiBaseUrl}/api/sheets/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spreadsheetId: this.spreadsheetId,
          sheetName: 'Roles',
          roleId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      logService.error('RoleService', 'Failed to delete role', { error, roleId });
      throw error;
    }
  }

  /**
   * Map spreadsheet row to role object
   */
  mapRowToRole(row) {
    return {
      id: row[0],
      name: row[1],
      description: row[2],
      createdAt: row[3],
    };
  }
}

export const roleService = new RoleService();
