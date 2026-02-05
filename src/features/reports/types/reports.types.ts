/**
 * Reports Types
 */

export interface Reports {
  id: string;
  name: string;
  status: ReportsStatus;
  createdAt: string;
  updatedAt: string;
}

export type ReportsStatus = 'active' | 'inactive' | 'pending';

export interface ReportsFormData {
  name: string;
  description?: string;
}

export interface ReportsFilterParams {
  status?: ReportsStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
