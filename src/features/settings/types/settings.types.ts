/**
 * Settings Types
 */

export interface Settings {
  id: string;
  name: string;
  status: SettingsStatus;
  createdAt: string;
  updatedAt: string;
}

export type SettingsStatus = 'active' | 'inactive' | 'pending';

export interface SettingsFormData {
  name: string;
  description?: string;
}

export interface SettingsFilterParams {
  status?: SettingsStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
