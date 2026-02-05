import { apiClient } from '@/services/api/client';
import type {
  Invoices,
  InvoicesFormData,
  InvoicesFilterParams,
} from '../types';

export class InvoicesService {
  private static BASE_URL = '/invoices';

  /**
   * Get all invoices
   */
  static async getAll(
    params?: InvoicesFilterParams
  ): Promise<Invoices[]> {
    return apiClient.get<Invoices[]>(this.BASE_URL, { params });
  }

  /**
   * Get invoices by ID
   */
  static async getById(id: string): Promise<Invoices> {
    return apiClient.get<Invoices>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Create new invoices
   */
  static async create(
    data: InvoicesFormData
  ): Promise<Invoices> {
    return apiClient.post<Invoices>(this.BASE_URL, data);
  }

  /**
   * Update invoices
   */
  static async update(
    id: string,
    data: Partial<InvoicesFormData>
  ): Promise<Invoices> {
    return apiClient.put<Invoices>(`${this.BASE_URL}/${id}`, data);
  }

  /**
   * Delete invoices
   */
  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${this.BASE_URL}/${id}`);
  }
}
