import { apiClient } from '@/services/api/client';
import type {
  DeliveryUnotes,
  DeliveryUnotesFormData,
  DeliveryUnotesFilterParams,
} from '../types';

export class DeliveryUnotesService {
  private static BASE_URL = '/delivery-notes';

  /**
   * Get all delivery-notes
   */
  static async getAll(
    params?: DeliveryUnotesFilterParams
  ): Promise<DeliveryUnotes[]> {
    return apiClient.get<DeliveryUnotes[]>(this.BASE_URL, { params });
  }

  /**
   * Get delivery-notes by ID
   */
  static async getById(id: string): Promise<DeliveryUnotes> {
    return apiClient.get<DeliveryUnotes>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Create new delivery-notes
   */
  static async create(
    data: DeliveryUnotesFormData
  ): Promise<DeliveryUnotes> {
    return apiClient.post<DeliveryUnotes>(this.BASE_URL, data);
  }

  /**
   * Update delivery-notes
   */
  static async update(
    id: string,
    data: Partial<DeliveryUnotesFormData>
  ): Promise<DeliveryUnotes> {
    return apiClient.put<DeliveryUnotes>(`${this.BASE_URL}/${id}`, data);
  }

  /**
   * Delete delivery-notes
   */
  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${this.BASE_URL}/${id}`);
  }
}
