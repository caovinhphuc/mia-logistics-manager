export type Status = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  district: string;
  city: string;
  coordinates?: Coordinates;
}

export interface Dimensions {
  length: number; // cm
  width: number; // cm
  height: number; // cm
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface Employee {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Transfer {
  id: string;
  transferCode: string;
  fromWarehouse: string;
  toWarehouse: string;
  items: TransferItem[];
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
  condition: 'good' | 'damaged' | 'expired';
}
