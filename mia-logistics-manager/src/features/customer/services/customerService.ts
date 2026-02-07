import { apiClient } from '@/services/api/client';
import type {
  Customer,
  CustomerFormData,
  CustomerFilterParams,
} from '../types';

export class CustomerService {
  private static BASE_URL = '/customer';

  /**
   * Get all customer
   */
  static async getAll(
    params?: CustomerFilterParams
  ): Promise<Customer[]> {
    return apiClient.get<Customer[]>(this.BASE_URL, { params });
  }

  /**
   * Get customer by ID
   */
  static async getById(id: string): Promise<Customer> {
    return apiClient.get<Customer>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Create new customer
   */
  static async create(
    data: CustomerFormData
  ): Promise<Customer> {
    return apiClient.post<Customer>(this.BASE_URL, data);
  }

  /**
   * Update customer
   */
  static async update(
    id: string,
    data: Partial<CustomerFormData>
  ): Promise<Customer> {
    return apiClient.put<Customer>(`${this.BASE_URL}/${id}`, data);
  }

  /**
   * Delete customer
   */
  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${this.BASE_URL}/${id}`);
  }
}
