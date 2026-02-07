/**
 * OrderUitems Types
 */

export interface OrderUitems {
  id: string;
  name: string;
  status: OrderUitemsStatus;
  createdAt: string;
  updatedAt: string;
}

export type OrderUitemsStatus = 'active' | 'inactive' | 'pending';

export interface OrderUitemsFormData {
  name: string;
  description?: string;
}

export interface OrderUitemsFilterParams {
  status?: OrderUitemsStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
