// Shared types for Inbound features

// ============================================================================
// InboundSchedule - 54 Columns Complete Structure
// ============================================================================

// Enums
export type TimelineMilestone = 'cargoReady' | 'etd' | 'eta' | 'depart' | 'arrivalPort' | 'receive';
export type DocumentMilestone = 'checkBill' | 'checkCO' | 'sendDocs' | 'customs' | 'tax';
export type MilestoneStatus = 'pending' | 'confirmed' | 'completed' | 'delayed' | 'in-progress';
export type InboundItemStatus =
  | 'pending'
  | 'confirmed'
  | 'in-transit'
  | 'arrived'
  | 'completed'
  | 'cancelled';
export type Purpose = 'online' | 'offline';

// Timeline Item (3 fields per milestone)
export interface TimelineMilestoneData {
  est: string; // dd/MM/yyyy - Ngày dự kiến
  act: string; // dd/MM/yyyy - Ngày thực tế
  status: MilestoneStatus; // Trạng thái
}

// Document Status Item (3 fields per milestone)
export interface DocumentMilestoneData {
  est: string; // dd/MM/yyyy - Ngày dự kiến
  act: string; // dd/MM/yyyy - Ngày thực tế
  status: MilestoneStatus; // Trạng thái
}

// Complete Timeline Data (6 milestones × 3 fields = 18 fields)
export interface TimelineData {
  cargoReady: TimelineMilestoneData;
  etd: TimelineMilestoneData;
  eta: TimelineMilestoneData;
  depart: TimelineMilestoneData;
  arrivalPort: TimelineMilestoneData;
  receive: TimelineMilestoneData;
}

// Complete Document Status Data (5 milestones × 3 fields = 15 fields)
export interface DocumentStatusData {
  checkBill: DocumentMilestoneData;
  checkCO: DocumentMilestoneData;
  sendDocs: DocumentMilestoneData;
  customs: DocumentMilestoneData;
  tax: DocumentMilestoneData;
}

// Packaging Item (old structure - keep for backward compatibility)
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
  status: 'pending' | 'confirmed' | 'in-transit' | 'arrived' | 'completed' | 'cancelled';
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

export type TimelineStatus = 'completed' | 'pending' | 'in-progress' | 'confirmed';

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

// ============================================================================
// Complete InboundSchedule Item with 54 columns
// ============================================================================

export interface InboundScheduleItem {
  // ==================== THÔNG TIN CƠ BẢN (12 cột) ====================
  id: string; // INB-{timestamp} - Mã lịch nhập
  date: string; // dd/MM/yyyy - Ngày tạo lịch
  pi: string; // Mã PI (Proforma Invoice)
  supplier: string; // Nhà cung cấp
  origin: string; // Nơi xuất phát
  destination: string; // Nơi đến
  product: string; // Sản phẩm
  category: string; // Danh mục
  quantity: number; // Số lượng
  container: number; // Số container
  status: InboundItemStatus; // Trạng thái
  carrier: string; // Nhà vận chuyển

  // ==================== THÔNG TIN BỔ SUNG (3 cột) ====================
  purpose: Purpose; // online/offline - Mục đích
  receiveTime: string; // HH:mm - Giờ nhận hàng
  poNumbers: string; // Semicolon-separated - Mã PO

  // ==================== THÔNG TIN ĐÓNG GÓI (3 cột) ====================
  packagingTypes: string; // Semicolon-separated - Loại đóng gói
  packagingQuantities: string; // Semicolon-separated - Số lượng đóng gói
  packagingDescriptions: string; // Semicolon-separated - Mô tả đóng gói

  // ==================== TIMELINE VẬN CHUYỂN (18 cột) ====================
  timeline: TimelineData;

  // ==================== TRẠNG THÁI CHỨNG TỪ (15 cột) ====================
  documentStatus: DocumentStatusData;

  // ==================== THÔNG TIN HỆ THỐNG (3 cột) ====================
  notes: string; // Ghi chú
  createdAt: string; // Timestamp - Ngày tạo
  updatedAt: string; // Timestamp - Ngày cập nhật
}

// Export constant for milestone labels
export const TIMELINE_MILESTONES: Record<TimelineMilestone, string> = {
  cargoReady: 'Cargo Ready - Hàng sẵn sàng',
  etd: 'ETD - Thời gian khởi hành dự kiến',
  eta: 'ETA - Thời gian đến dự kiến',
  depart: 'Depart - Khởi hành',
  arrivalPort: 'Arrival Port - Đến cảng',
  receive: 'Receive - Nhận hàng',
};

export const DOCUMENT_MILESTONES: Record<DocumentMilestone, string> = {
  checkBill: 'Check Bill - Kiểm tra Bill',
  checkCO: 'Check CO - Kiểm tra CO',
  sendDocs: 'Send Docs - Gửi chứng từ',
  customs: 'Customs - Thông quan',
  tax: 'Tax - Nộp thuế',
};
