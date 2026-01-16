import { apiClient } from '../../../services/api/client';
import type { Customers, CustomersFormData, CustomersFilterParams } from '../types';

export class CustomersService {
  private static BASE_URL = '/customers';

  /**
   * Get all customers
   */
  static async getAll(params?: CustomersFilterParams): Promise<Customers[]> {
    return apiClient.get<Customers[]>(this.BASE_URL, { params });
  }

  /**
   * Get customers by ID
   */
  static async getById(id: string): Promise<Customers> {
    return apiClient.get<Customers>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Create new customers
   */
  static async create(data: CustomersFormData): Promise<Customers> {
    return apiClient.post<Customers>(this.BASE_URL, data);
  }

  /**
   * Update customers
   */
  static async update(id: string, data: Partial<CustomersFormData>): Promise<Customers> {
    return apiClient.put<Customers>(`${this.BASE_URL}/${id}`, data);
  }

  /**
   * Delete customers
   */
  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${this.BASE_URL}/${id}`);
  }
}
