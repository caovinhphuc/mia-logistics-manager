/**
 * Customer Types
 */

export interface Customer {
  id: string;
  name: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export type CustomerStatus = 'active' | 'inactive' | 'pending';

export interface CustomerFormData {
  name: string;
  description?: string;
}

export interface CustomerFilterParams {
  status?: CustomerStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
