/**
 * Invoices Types
 */

export interface Invoices {
  id: string;
  name: string;
  status: InvoicesStatus;
  createdAt: string;
  updatedAt: string;
}

export type InvoicesStatus = 'active' | 'inactive' | 'pending';

export interface InvoicesFormData {
  name: string;
  description?: string;
}

export interface InvoicesFilterParams {
  status?: InvoicesStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
