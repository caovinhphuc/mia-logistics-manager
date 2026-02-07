import { apiClient } from '@/services/api/client';
import type { Reports, ReportsFormData, ReportsFilterParams } from '../types';

export class ReportsService {
  private static BASE_URL = '/reports';

  /**
   * Get all reports
   */
  static async getAll(params?: ReportsFilterParams): Promise<Reports[]> {
    return apiClient.get<Reports[]>(this.BASE_URL, { params });
  }

  /**
   * Get reports by ID
   */
  static async getById(id: string): Promise<Reports> {
    return apiClient.get<Reports>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Create new reports
   */
  static async create(data: ReportsFormData): Promise<Reports> {
    return apiClient.post<Reports>(this.BASE_URL, data);
  }

  /**
   * Update reports
   */
  static async update(id: string, data: Partial<ReportsFormData>): Promise<Reports> {
    return apiClient.put<Reports>(`${this.BASE_URL}/${id}`, data);
  }

  /**
   * Delete reports
   */
  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${this.BASE_URL}/${id}`);
  }
}
