import {
  Role,
  RolePermission,
  User,
  Permission,
} from '../../shared/types/commonTypes';

const API_BASE_URL = 'http://localhost:5050/api';

export const authService = {
  // Roles
  async getRoles(): Promise<Role[]> {
    const response = await fetch(`${API_BASE_URL}/auth/roles`);
    if (!response.ok) throw new Error('Failed to fetch roles');
    return response.json();
  },

  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    const response = await fetch(`${API_BASE_URL}/auth/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...role, id: `role-${Date.now()}` }),
    });
    if (!response.ok) throw new Error('Failed to create role');
    return response.json();
  },

  async updateRole(role: Role): Promise<Role> {
    const response = await fetch(`${API_BASE_URL}/auth/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    if (!response.ok) throw new Error('Failed to update role');
    return response.json();
  },

  // Role Permissions
  async getRolePermissions(roleId: string): Promise<RolePermission[]> {
    const response = await fetch(
      `${API_BASE_URL}/auth/role-permissions?roleId=${roleId}`
    );
    if (!response.ok) throw new Error('Failed to fetch role permissions');
    return response.json();
  },

  async updateRolePermissions(
    roleId: string,
    permissions: { resource: string; action: string }[]
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/role-permissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId, permissions }),
    });
    if (!response.ok) throw new Error('Failed to update role permissions');
  },

  // Users
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/auth/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async createUser(user: {
    email: string;
    password: string;
    fullName?: string;
    roleId?: string;
  }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async updateUser(
    id: string,
    updates: Partial<User & { password?: string }>
  ): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },
};

// Available permissions for the system
export const AVAILABLE_PERMISSIONS: Permission[] = [
  // Employees
  { resource: 'employees', action: 'view', label: 'Xem nhân viên' },
  { resource: 'employees', action: 'create', label: 'Thêm nhân viên' },
  { resource: 'employees', action: 'update', label: 'Sửa nhân viên' },
  { resource: 'employees', action: 'delete', label: 'Xóa nhân viên' },

  // Transfers
  { resource: 'transfers', action: 'view', label: 'Xem phiếu chuyển kho' },
  { resource: 'transfers', action: 'create', label: 'Tạo phiếu chuyển kho' },
  { resource: 'transfers', action: 'update', label: 'Sửa phiếu chuyển kho' },
  { resource: 'transfers', action: 'delete', label: 'Xóa phiếu chuyển kho' },

  // Carriers
  { resource: 'carriers', action: 'view', label: 'Xem nhà vận chuyển' },
  { resource: 'carriers', action: 'create', label: 'Thêm nhà vận chuyển' },
  { resource: 'carriers', action: 'update', label: 'Sửa nhà vận chuyển' },
  { resource: 'carriers', action: 'delete', label: 'Xóa nhà vận chuyển' },

  // Locations
  { resource: 'locations', action: 'view', label: 'Xem địa điểm' },
  { resource: 'locations', action: 'create', label: 'Thêm địa điểm' },
  { resource: 'locations', action: 'update', label: 'Sửa địa điểm' },
  { resource: 'locations', action: 'delete', label: 'Xóa địa điểm' },

  // Transport Requests
  {
    resource: 'transport-requests',
    action: 'view',
    label: 'Xem yêu cầu vận chuyển',
  },
  {
    resource: 'transport-requests',
    action: 'create',
    label: 'Tạo yêu cầu vận chuyển',
  },
  {
    resource: 'transport-requests',
    action: 'update',
    label: 'Sửa yêu cầu vận chuyển',
  },
  {
    resource: 'transport-requests',
    action: 'delete',
    label: 'Xóa yêu cầu vận chuyển',
  },

  // Settings
  { resource: 'settings', action: 'view', label: 'Xem cài đặt' },
  { resource: 'settings', action: 'update', label: 'Cập nhật cài đặt' },

  // Inbound (Nhập hàng)
  {
    resource: 'inbound-international',
    action: 'view',
    label: 'Xem Nhập hàng - Quốc tế',
  },
  {
    resource: 'inbound-domestic',
    action: 'view',
    label: 'Xem Nhập hàng - Quốc nội',
  },
  {
    resource: 'inbound-schedule',
    action: 'view',
    label: 'Xem Nhập hàng - Lịch nhập',
  },
];
