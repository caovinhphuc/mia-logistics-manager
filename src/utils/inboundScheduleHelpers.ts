/**
 * InboundSchedule Helper Functions
 *
 * Utility functions for working with InboundSchedule data
 * Including parsing, validation, formatting, and business logic
 */

import {
  InboundSchedule,
  InboundScheduleStructured,
  PackagingItem,
  InboundTimeline,
  InboundDocumentStatus,
  TimelineMilestone,
  DocumentMilestone,
  TIMELINE_MILESTONES,
  DOCUMENT_MILESTONES,
  REQUIRED_FIELDS,
  InboundScheduleValidation,
  ValidationError,
  TimelineStatus,
  DocumentStatus,
} from '../types/inboundSchedule';

// ============================================
// ID Generation
// ============================================

export function generateInboundId(): string {
  const timestamp = Date.now();
  return `INB-${timestamp}`;
}

// ============================================
// Date Formatting
// ============================================

/**
 * Convert date from yyyy-MM-dd (HTML input) to dd/MM/yyyy (Vietnamese format)
 */
export function formatDateToVietnamese(date: string): string {
  if (!date) return '';

  const parts = date.split('-');
  if (parts.length !== 3) return date;

  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

/**
 * Convert date from dd/MM/yyyy to yyyy-MM-dd (for HTML date input)
 */
export function formatDateToISO(date: string): string {
  if (!date) return '';

  const parts = date.split('/');
  if (parts.length !== 3) return date;

  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Get current date in Vietnamese format
 */
export function getCurrentDateVietnamese(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Get current timestamp in format dd/MM/yyyy HH:mm:ss
 */
export function getCurrentTimestamp(): string {
  const now = new Date();
  const date = getCurrentDateVietnamese();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${date} ${hours}:${minutes}:${seconds}`;
}

// ============================================
// Packaging Parsing
// ============================================

/**
 * Parse semicolon-separated packaging data into array of objects
 */
export function parsePackaging(
  types: string,
  quantities: string,
  descriptions: string
): PackagingItem[] {
  const typeArr = types ? types.split(';').map((t) => t.trim()) : [];
  const quantityArr = quantities ? quantities.split(';').map((q) => parseInt(q.trim())) : [];
  const descArr = descriptions ? descriptions.split(';').map((d) => d.trim()) : [];

  const maxLength = Math.max(typeArr.length, quantityArr.length, descArr.length);

  return Array.from({ length: maxLength }, (_, i) => ({
    type: typeArr[i] || '',
    quantity: quantityArr[i] || 0,
    description: descArr[i] || '',
  }));
}

/**
 * Convert packaging array to semicolon-separated strings
 */
export function stringifyPackaging(packaging: PackagingItem[]): {
  types: string;
  quantities: string;
  descriptions: string;
} {
  return {
    types: packaging.map((p) => p.type).join(';'),
    quantities: packaging.map((p) => p.quantity).join(';'),
    descriptions: packaging.map((p) => p.description).join(';'),
  };
}

// ============================================
// Timeline Parsing
// ============================================

/**
 * Parse flat timeline fields into structured timeline object
 */
export function parseTimeline(data: InboundSchedule): InboundTimeline {
  const timeline: any = {};

  TIMELINE_MILESTONES.forEach((milestone) => {
    const estKey = `timeline_${milestone}_est` as keyof InboundSchedule;
    const actKey = `timeline_${milestone}_act` as keyof InboundSchedule;
    const statusKey = `timeline_${milestone}_status` as keyof InboundSchedule;

    timeline[milestone] = {
      est: data[estKey] || '',
      act: data[actKey] || '',
      status: data[statusKey] || TimelineStatus.PENDING,
    };
  });

  return timeline as InboundTimeline;
}

/**
 * Flatten timeline object to flat fields
 */
export function flattenTimeline(timeline: InboundTimeline): Partial<InboundSchedule> {
  const flat: any = {};

  Object.entries(timeline).forEach(([milestone, data]) => {
    flat[`timeline_${milestone}_est`] = data.est;
    flat[`timeline_${milestone}_act`] = data.act;
    flat[`timeline_${milestone}_status`] = data.status;
  });

  return flat;
}

// ============================================
// Document Status Parsing
// ============================================

/**
 * Parse flat document fields into structured document object
 */
export function parseDocumentStatus(data: InboundSchedule): InboundDocumentStatus {
  const documentStatus: any = {};

  DOCUMENT_MILESTONES.forEach((milestone) => {
    const estKey = `doc_${milestone}_est` as keyof InboundSchedule;
    const actKey = `doc_${milestone}_act` as keyof InboundSchedule;
    const statusKey = `doc_${milestone}_status` as keyof InboundSchedule;

    documentStatus[milestone] = {
      est: data[estKey] || '',
      act: data[actKey] || '',
      status: data[statusKey] || DocumentStatus.PENDING,
    };
  });

  return documentStatus as InboundDocumentStatus;
}

/**
 * Flatten document status object to flat fields
 */
export function flattenDocumentStatus(
  documentStatus: InboundDocumentStatus
): Partial<InboundSchedule> {
  const flat: any = {};

  Object.entries(documentStatus).forEach(([milestone, data]) => {
    flat[`doc_${milestone}_est`] = data.est;
    flat[`doc_${milestone}_act`] = data.act;
    flat[`doc_${milestone}_status`] = data.status;
  });

  return flat;
}

// ============================================
// Structured Data Conversion
// ============================================

/**
 * Convert flat InboundSchedule to structured format
 */
export function toStructuredFormat(data: InboundSchedule): InboundScheduleStructured {
  const packaging = parsePackaging(
    data.packagingTypes,
    data.packagingQuantities,
    data.packagingDescriptions
  );

  const timeline = parseTimeline(data);
  const documentStatus = parseDocumentStatus(data);

  return {
    // Basic info
    id: data.id,
    date: data.date,
    pi: data.pi,
    supplier: data.supplier,
    origin: data.origin,
    destination: data.destination,
    product: data.product,
    category: data.category,
    quantity: data.quantity,
    container: data.container,
    status: data.status,
    carrier: data.carrier,

    // Additional info
    purpose: data.purpose,
    receiveTime: data.receiveTime,
    poNumbers: data.poNumbers,

    // Structured data
    packaging,
    timeline,
    documentStatus,

    // System info
    notes: data.notes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Convert structured format to flat InboundSchedule
 */
export function toFlatFormat(data: InboundScheduleStructured): InboundSchedule {
  const packagingStrings = stringifyPackaging(data.packaging);
  const timelineFlat = flattenTimeline(data.timeline);
  const documentFlat = flattenDocumentStatus(data.documentStatus);

  return {
    ...data,
    ...packagingStrings,
    ...timelineFlat,
    ...documentFlat,
  } as InboundSchedule;
}

// ============================================
// Validation
// ============================================

/**
 * Validate InboundSchedule data
 */
export function validateInboundSchedule(data: Partial<InboundSchedule>): InboundScheduleValidation {
  const errors: ValidationError[] = [];

  // Check required fields
  REQUIRED_FIELDS.forEach((field) => {
    if (!data[field as keyof InboundSchedule]) {
      errors.push({
        field: field as string,
        message: `${field} is required`,
      });
    }
  });

  // Validate quantity
  if (data.quantity !== undefined && data.quantity <= 0) {
    errors.push({
      field: 'quantity',
      message: 'Quantity must be greater than 0',
    });
  }

  // Validate container
  if (data.container !== undefined && data.container <= 0) {
    errors.push({
      field: 'container',
      message: 'Container count must be greater than 0',
    });
  }

  // Validate date format
  if (data.date && !/^\d{2}\/\d{2}\/\d{4}$/.test(data.date)) {
    errors.push({
      field: 'date',
      message: 'Date must be in format dd/MM/yyyy',
    });
  }

  // Validate time format
  if (data.receiveTime && !/^\d{2}:\d{2}$/.test(data.receiveTime)) {
    errors.push({
      field: 'receiveTime',
      message: 'Time must be in format HH:mm',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================
// Business Logic
// ============================================

/**
 * Get display date for a milestone (actual > estimated > created date)
 */
export function getMilestoneDisplayDate(
  milestone: TimelineMilestone | DocumentMilestone,
  createdDate: string
): string {
  if (milestone.act) return milestone.act;
  if (milestone.est) return milestone.est;
  return createdDate;
}

/**
 * Check if timeline milestone is completed
 */
export function isMilestoneCompleted(milestone: TimelineMilestone | DocumentMilestone): boolean {
  return milestone.status === TimelineStatus.COMPLETED || !!milestone.act;
}

/**
 * Get next pending milestone in timeline
 */
export function getNextPendingMilestone(timeline: InboundTimeline): keyof InboundTimeline | null {
  for (const milestone of TIMELINE_MILESTONES) {
    if (!isMilestoneCompleted(timeline[milestone])) {
      return milestone;
    }
  }
  return null;
}

/**
 * Get next pending document milestone
 */
export function getNextPendingDocument(
  documentStatus: InboundDocumentStatus
): keyof InboundDocumentStatus | null {
  for (const milestone of DOCUMENT_MILESTONES) {
    if (!isMilestoneCompleted(documentStatus[milestone])) {
      return milestone;
    }
  }
  return null;
}

/**
 * Calculate completion percentage for timeline
 */
export function calculateTimelineCompletion(timeline: InboundTimeline): number {
  const completedCount = TIMELINE_MILESTONES.filter((m) =>
    isMilestoneCompleted(timeline[m])
  ).length;

  return Math.round((completedCount / TIMELINE_MILESTONES.length) * 100);
}

/**
 * Calculate completion percentage for documents
 */
export function calculateDocumentCompletion(documentStatus: InboundDocumentStatus): number {
  const completedCount = DOCUMENT_MILESTONES.filter((m) =>
    isMilestoneCompleted(documentStatus[m])
  ).length;

  return Math.round((completedCount / DOCUMENT_MILESTONES.length) * 100);
}

/**
 * Parse PO numbers from semicolon-separated string to array
 */
export function parsePONumbers(poNumbers: string): string[] {
  return poNumbers ? poNumbers.split(';').map((p) => p.trim()) : [];
}

/**
 * Stringify PO numbers array to semicolon-separated string
 */
export function stringifyPONumbers(poNumbers: string[]): string {
  return poNumbers.join(';');
}
