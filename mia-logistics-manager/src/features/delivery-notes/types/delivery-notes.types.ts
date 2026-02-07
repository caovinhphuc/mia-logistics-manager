/**
 * DeliveryUnotes Types
 */

export interface DeliveryUnotes {
  id: string;
  name: string;
  status: DeliveryUnotesStatus;
  createdAt: string;
  updatedAt: string;
}

export type DeliveryUnotesStatus = 'active' | 'inactive' | 'pending';

export interface DeliveryUnotesFormData {
  name: string;
  description?: string;
}

export interface DeliveryUnotesFilterParams {
  status?: DeliveryUnotesStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
