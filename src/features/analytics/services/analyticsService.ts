import { apiClient } from '@/services/api/client';
import type {
  Analytics,
  AnalyticsFormData,
  AnalyticsFilterParams,
} from '../types';

export class AnalyticsService {
  private static BASE_URL = '/analytics';

  /**
   * Get all analytics
   */
  static async getAll(
    params?: AnalyticsFilterParams
  ): Promise<Analytics[]> {
    return apiClient.get<Analytics[]>(this.BASE_URL, { params });
  }

  /**
   * Get analytics by ID
   */
  static async getById(id: string): Promise<Analytics> {
    return apiClient.get<Analytics>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Create new analytics
   */
  static async create(
    data: AnalyticsFormData
  ): Promise<Analytics> {
    return apiClient.post<Analytics>(this.BASE_URL, data);
  }

  /**
   * Update analytics
   */
  static async update(
    id: string,
    data: Partial<AnalyticsFormData>
  ): Promise<Analytics> {
    return apiClient.put<Analytics>(`${this.BASE_URL}/${id}`, data);
  }

  /**
   * Delete analytics
   */
  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${this.BASE_URL}/${id}`);
  }
}
