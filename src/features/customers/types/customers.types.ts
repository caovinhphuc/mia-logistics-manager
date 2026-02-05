/**
 * Customers Types
 */

export interface Customers {
  id: string;
  name: string;
  status: CustomersStatus;
  createdAt: string;
  updatedAt: string;
}

export type CustomersStatus = 'active' | 'inactive' | 'pending';

export interface CustomersFormData {
  name: string;
  description?: string;
}

export interface CustomersFilterParams {
  status?: CustomersStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
