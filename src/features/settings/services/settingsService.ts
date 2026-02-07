import { apiClient } from '@/services/api/client';
import type {
  Settings,
  SettingsFormData,
  SettingsFilterParams,
} from '../types';

export class SettingsService {
  private static BASE_URL = '/settings';

  /**
   * Get all settings
   */
  static async getAll(
    params?: SettingsFilterParams
  ): Promise<Settings[]> {
    return apiClient.get<Settings[]>(this.BASE_URL, { params });
  }

  /**
   * Get settings by ID
   */
  static async getById(id: string): Promise<Settings> {
    return apiClient.get<Settings>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Create new settings
   */
  static async create(
    data: SettingsFormData
  ): Promise<Settings> {
    return apiClient.post<Settings>(this.BASE_URL, data);
  }

  /**
   * Update settings
   */
  static async update(
    id: string,
    data: Partial<SettingsFormData>
  ): Promise<Settings> {
    return apiClient.put<Settings>(`${this.BASE_URL}/${id}`, data);
  }

  /**
   * Delete settings
   */
  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${this.BASE_URL}/${id}`);
  }
}
