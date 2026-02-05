/**
 * InboundSchedule Types & Interfaces
 *
 * Complete type definitions for Inbound Schedule with 54 columns
 * Organized into logical groups for better maintainability
 */

// ============================================
// Enums
// ============================================

export enum InboundStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_TRANSIT = 'in-transit',
  ARRIVED = 'arrived',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TimelineStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  IN_PROGRESS = 'in-progress',
}

export enum DocumentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  DELAYED = 'delayed',
  IN_PROGRESS = 'in-progress',
}

export enum Purpose {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

// ============================================
// Basic Info (12 columns)
// ============================================

export interface InboundBasicInfo {
  id: string; // INB-{timestamp}
  date: string; // dd/MM/yyyy
  pi: string; // Proforma Invoice
  supplier: string;
  origin: string;
  destination: string;
  product: string;
  category: string;
  quantity: number;
  container: number;
  status: InboundStatus;
  carrier: string;
}

// ============================================
// Additional Info (3 columns)
// ============================================

export interface InboundAdditionalInfo {
  purpose: Purpose;
  receiveTime: string; // HH:mm
  poNumbers: string; // Semicolon-separated
}

// ============================================
// Packaging Info (3 columns)
// ============================================

export interface InboundPackagingInfo {
  packagingTypes: string; // Semicolon-separated (1PCS/SET, 2PCS/SET, etc.)
  packagingQuantities: string; // Semicolon-separated numbers
  packagingDescriptions: string; // Semicolon-separated
}

// Parsed packaging object
export interface PackagingItem {
  type: string;
  quantity: number;
  description: string;
}

// ============================================
// Timeline (18 columns - 6 milestones × 3 fields)
// ============================================

export interface TimelineMilestone {
  est: string; // dd/MM/yyyy - Estimated date
  act: string; // dd/MM/yyyy - Actual date
  status: TimelineStatus;
}

export interface InboundTimeline {
  cargoReady: TimelineMilestone; // Hàng sẵn sàng
  etd: TimelineMilestone; // Estimated Time of Departure
  eta: TimelineMilestone; // Estimated Time of Arrival
  depart: TimelineMilestone; // Khởi hành
  arrivalPort: TimelineMilestone; // Đến cảng
  receive: TimelineMilestone; // Nhận hàng
}

// ============================================
// Document Status (15 columns - 5 milestones × 3 fields)
// ============================================

export interface DocumentMilestone {
  est: string; // dd/MM/yyyy
  act: string; // dd/MM/yyyy
  status: DocumentStatus;
}

export interface InboundDocumentStatus {
  checkBill: DocumentMilestone; // Kiểm tra Bill
  checkCO: DocumentMilestone; // Kiểm tra CO (Certificate of Origin)
  sendDocs: DocumentMilestone; // Gửi chứng từ
  customs: DocumentMilestone; // Thông quan
  tax: DocumentMilestone; // Nộp thuế
}

// ============================================
// System Info (3 columns)
// ============================================

export interface InboundSystemInfo {
  notes: string; // Ghi chú bổ sung và mô tả timeline/document status
  createdAt: string; // HH:mm or dd/MM/yyyy HH:mm:ss
  updatedAt: string; // dd/MM/yyyy HH:mm:ss
}

// ============================================
// Complete InboundSchedule (All 54 columns)
// ============================================

export interface InboundSchedule
  extends InboundBasicInfo, InboundAdditionalInfo, InboundPackagingInfo, InboundSystemInfo {
  // Timeline fields (flattened)
  timeline_cargoReady_est: string;
  timeline_cargoReady_act: string;
  timeline_cargoReady_status: TimelineStatus;
  timeline_etd_est: string;
  timeline_etd_act: string;
  timeline_etd_status: TimelineStatus;
  timeline_eta_est: string;
  timeline_eta_act: string;
  timeline_eta_status: TimelineStatus;
  timeline_depart_est: string;
  timeline_depart_act: string;
  timeline_depart_status: TimelineStatus;
  timeline_arrivalPort_est: string;
  timeline_arrivalPort_act: string;
  timeline_arrivalPort_status: TimelineStatus;
  timeline_receive_est: string;
  timeline_receive_act: string;
  timeline_receive_status: TimelineStatus;

  // Document status fields (flattened)
  doc_checkBill_est: string;
  doc_checkBill_act: string;
  doc_checkBill_status: DocumentStatus;
  doc_checkCO_est: string;
  doc_checkCO_act: string;
  doc_checkCO_status: DocumentStatus;
  doc_sendDocs_est: string;
  doc_sendDocs_act: string;
  doc_sendDocs_status: DocumentStatus;
  doc_customs_est: string;
  doc_customs_act: string;
  doc_customs_status: DocumentStatus;
  doc_tax_est: string;
  doc_tax_act: string;
  doc_tax_status: DocumentStatus;
}

// ============================================
// Structured Interface (for easier access)
// ============================================

export interface InboundScheduleStructured
  extends InboundBasicInfo, InboundAdditionalInfo, InboundSystemInfo {
  packaging: PackagingItem[];
  timeline: InboundTimeline;
  documentStatus: InboundDocumentStatus;
}

// ============================================
// Form Input Types
// ============================================

export interface InboundScheduleFormData {
  // Basic
  pi: string;
  supplier: string;
  origin: string;
  destination: string;
  product: string;
  category: string;
  quantity: number;
  container: number;
  carrier: string;
  purpose: Purpose;
  receiveTime: string;
  poNumbers: string[];

  // Packaging
  packaging: PackagingItem[];

  // Timeline (optional)
  timeline?: Partial<InboundTimeline>;

  // Documents (optional)
  documentStatus?: Partial<InboundDocumentStatus>;

  // Notes
  notes?: string;
}

// ============================================
// API Response Types
// ============================================

export interface InboundScheduleResponse {
  success: boolean;
  data: InboundSchedule | InboundSchedule[];
  message?: string;
  error?: string;
}

export interface InboundScheduleListResponse {
  success: boolean;
  data: InboundSchedule[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================
// Filter & Query Types
// ============================================

export interface InboundScheduleFilter {
  status?: InboundStatus[];
  supplier?: string;
  carrier?: string;
  dateFrom?: string;
  dateTo?: string;
  pi?: string;
  product?: string;
  category?: string;
  purpose?: Purpose;
  timelineMilestone?: keyof InboundTimeline;
  timelineStatus?: TimelineStatus;
  documentMilestone?: keyof InboundDocumentStatus;
  documentStatus?: DocumentStatus;
}

export interface InboundScheduleQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: InboundScheduleFilter;
}

// ============================================
// Validation Types
// ============================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface InboundScheduleValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// ============================================
// Constants
// ============================================

export const INBOUND_SCHEDULE_COLUMN_GROUPS = {
  BASIC: 12,
  ADDITIONAL: 3,
  PACKAGING: 3,
  TIMELINE: 18, // 6 milestones × 3 fields
  DOCUMENT: 15, // 5 milestones × 3 fields
  SYSTEM: 3,
  TOTAL: 54,
} as const;

export const TIMELINE_MILESTONES = [
  'cargoReady',
  'etd',
  'eta',
  'depart',
  'arrivalPort',
  'receive',
] as const;

export const DOCUMENT_MILESTONES = ['checkBill', 'checkCO', 'sendDocs', 'customs', 'tax'] as const;

export const REQUIRED_FIELDS = [
  'id',
  'date',
  'pi',
  'supplier',
  'origin',
  'destination',
  'product',
  'category',
  'quantity',
  'container',
  'status',
  'carrier',
  'purpose',
  'receiveTime',
  'poNumbers',
] as const;

// ============================================
// Type Guards
// ============================================

export function isInboundSchedule(obj: any): obj is InboundSchedule {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.pi === 'string' &&
    typeof obj.supplier === 'string' &&
    Object.values(InboundStatus).includes(obj.status)
  );
}

export function isTimelineStatus(status: string): status is TimelineStatus {
  return Object.values(TimelineStatus).includes(status as TimelineStatus);
}

export function isDocumentStatus(status: string): status is DocumentStatus {
  return Object.values(DocumentStatus).includes(status as DocumentStatus);
}

// ============================================
// Utility Types
// ============================================

export type InboundScheduleUpdate = Partial<InboundSchedule>;
export type InboundScheduleCreate = Omit<InboundSchedule, 'id' | 'createdAt' | 'updatedAt'>;
