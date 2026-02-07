/**
 * Analytics Types
 */

export interface Analytics {
  id: string;
  name: string;
  status: AnalyticsStatus;
  createdAt: string;
  updatedAt: string;
}

export type AnalyticsStatus = 'active' | 'inactive' | 'pending';

export interface AnalyticsFormData {
  name: string;
  description?: string;
}

export interface AnalyticsFilterParams {
  status?: AnalyticsStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}
