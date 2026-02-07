import { apiClient } from '@/services/api/client';
import type {
  OrderUitems,
  OrderUitemsFormData,
  OrderUitemsFilterParams,
} from '../types';

export class OrderUitemsService {
  private static BASE_URL = '/order-items';

  /**
   * Get all order-items
   */
  static async getAll(
    params?: OrderUitemsFilterParams
  ): Promise<OrderUitems[]> {
    return apiClient.get<OrderUitems[]>(this.BASE_URL, { params });
  }

  /**
   * Get order-items by ID
   */
  static async getById(id: string): Promise<OrderUitems> {
    return apiClient.get<OrderUitems>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Create new order-items
   */
  static async create(
    data: OrderUitemsFormData
  ): Promise<OrderUitems> {
    return apiClient.post<OrderUitems>(this.BASE_URL, data);
  }

  /**
   * Update order-items
   */
  static async update(
    id: string,
    data: Partial<OrderUitemsFormData>
  ): Promise<OrderUitems> {
    return apiClient.put<OrderUitems>(`${this.BASE_URL}/${id}`, data);
  }

  /**
   * Delete order-items
   */
  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${this.BASE_URL}/${id}`);
  }
}
