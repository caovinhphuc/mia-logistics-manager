// Common shared types
export type ID = string;
export type Timestamp = string;
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface Permission {
  id?: string;
  resource: string;
  action: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status?: Status;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Employee {
  id: string;
  code?: string;
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  status: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
