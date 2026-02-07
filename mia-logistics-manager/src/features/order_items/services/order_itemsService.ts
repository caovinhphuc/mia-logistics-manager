import { apiClient } from '@/services/api/client';
import type {
  Order_items,
  Order_itemsFormData,
  Order_itemsFilterParams,
} from '../types';

export class Order_itemsService {
  private static BASE_URL = '/order_items';

  /**
   * Get all order_items
   */
  static async getAll(
    params?: Order_itemsFilterParams
  ): Promise<Order_items[]> {
    return apiClient.get<Order_items[]>(this.BASE_URL, { params });
  }

  /**
   * Get order_items by ID
   */
  static async getById(id: string): Promise<Order_items> {
    return apiClient.get<Order_items>(`${this.BASE_URL}/${id}`);
  }

  /**
   * Create new order_items
   */
  static async create(
    data: Order_itemsFormData
  ): Promise<Order_items> {
    return apiClient.post<Order_items>(this.BASE_URL, data);
  }

  /**
   * Update order_items
   */
  static async update(
    id: string,
    data: Partial<Order_itemsFormData>
  ): Promise<Order_items> {
    return apiClient.put<Order_items>(`${this.BASE_URL}/${id}`, data);
  }

  /**
   * Delete order_items
   */
  static async delete(id: string): Promise<void> {
    return apiClient.delete(`${this.BASE_URL}/${id}`);
  }
}
