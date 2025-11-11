// Shared types for Inbound features

export interface PackagingItem {
  id: string;
  type: string; // "2PCS/SET", "3PCS/SET", "1PCS/SET"
  quantity: number; // Số lượng SET
  description?: string; // Mô tả thêm
}

export interface DescriptionEntry {
  id: string;
  content: string; // Nội dung mô tả
  author: string; // Người viết mô tả
  timestamp: string; // Thời gian thêm mô tả (ISO string)
}

export interface TimelineItem {
  id: string;
  name: string; // Tên mốc thời gian
  date: string; // Ngày thực tế
  estimatedDate?: string; // Ngày dự kiến (nếu có)
  status: 'completed' | 'pending' | 'in-progress' | 'confirmed'; // Trạng thái
  description?: string; // Mô tả thêm (backward compatibility)
  descriptions?: DescriptionEntry[]; // Lịch sử mô tả (mới)
}

export interface DocumentStatusItem {
  id: string;
  name: string; // Tên trạng thái chứng từ
  date: string; // Ngày thực tế
  estimatedDate?: string; // Ngày dự kiến (nếu có)
  status: 'completed' | 'pending' | 'in-progress' | 'confirmed'; // Trạng thái
  description?: string; // Mô tả thêm (backward compatibility)
  descriptions?: DescriptionEntry[]; // Lịch sử mô tả (mới)
}

export interface InboundItem {
  id: string;
  date: string;
  supplier: string;
  origin: string;
  destination: string;
  product: string;
  quantity: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'in-transit'
    | 'arrived'
    | 'completed'
    | 'cancelled';
  estimatedArrival: string;
  actualArrival?: string;
  type: 'international' | 'domestic';
  carrier: string;
  pi: string;
  container: number;
  category: string;
  purpose: 'online' | 'offline';
  receiveTime: string;
  notes?: string;
  poNumbers: string[];
  packaging: PackagingItem[];
  timeline: TimelineItem[];
  documentStatus: DocumentStatusItem[];
}

// Form field types
export interface FormFields {
  id: string;
  date: string;
  supplier: string;
  origin: string;
  destination: string;
  product: string;
  quantity: number;
  status: string;
  estimatedArrival: string;
  actualArrival: string;
  carrier: string;
  pi: string;
  container: number;
  category: string;
  purpose: 'online' | 'offline';
  receiveTime: string;
  notes: string;
  poNumbers: string;
  poNumbersInput: string;
}

// Filter types
export interface Filters {
  status: string[];
  carrier: string[];
  destination: string[];
  product: string[];
  category: string[];
  documentStatus: string[];
  timelineStatus: string[];
}

// Edit dialog types
export interface EditItemDialog {
  open: boolean;
  type: 'packaging' | 'timeline' | 'documentStatus';
  item: PackagingItem | TimelineItem | DocumentStatusItem | null;
  index: number;
}

export interface EditItemForm {
  description: string;
}

// Snackbar types
export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

// View mode types
export type ViewMode = 'calendar' | 'table';

// Status types
export type ItemStatus =
  | 'pending'
  | 'confirmed'
  | 'in-transit'
  | 'arrived'
  | 'completed'
  | 'cancelled';

export type TimelineStatus =
  | 'completed'
  | 'pending'
  | 'in-progress'
  | 'confirmed';

export type Purpose = 'online' | 'offline';

// Action menu types
export type ActionMenuAction = 'edit' | 'delete' | 'add_calendar';

// Calendar types
export interface CalendarState {
  currentDate: Date;
  selectedDate: Date | null;
  selectedDateItems: InboundItem[];
  addFromCalendar: Date | null;
  calendarMenuAnchor: HTMLElement | null;
  calendarMenuDate: Date | null;
}

// Table types
export interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: unknown) => string;
}

// Stats types
export interface StatsData {
  totalItems: number;
  inTransit: number;
  arrived: number;
  pending: number;
  totalQuantity: number;
}
