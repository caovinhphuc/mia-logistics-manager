/**
 * Order_items Types
 */

export interface Order_items {
  id: string;
  name: string;
  status: Order_itemsStatus;
  createdAt: string;
  updatedAt: string;
}

export type Order_itemsStatus = 'active' | 'inactive' | 'pending';

export interface Order_itemsFormData {
  name: string;
  description?: string;
}

export interface Order_itemsFilterParams {
  status?: Order_itemsStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
