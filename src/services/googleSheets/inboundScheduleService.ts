// src/services/googleSheets/inboundScheduleService.ts
import {
  InboundItem,
  PackagingItem,
  TimelineItem,
  DocumentStatusItem,
  DescriptionEntry,
} from '../../features/inbound/types/inbound';
import { getInboundDomesticItems } from './inboundDomesticService';
import { formatDescriptionHistory } from '../../features/inbound/utils/descriptionUtils';
import { logService } from '../logService';

const inboundLogger = {
  debug: (message: string, data?: unknown) =>
    logService.debug('InboundScheduleService', message, data ? { data } : {}),
  info: (message: string, data?: unknown) =>
    logService.info('InboundScheduleService', message, data ? { data } : {}),
  warn: (message: string, data?: unknown) =>
    logService.warn('InboundScheduleService', message, data ? { data } : {}),
  error: (message: string, error: unknown, data?: unknown) =>
    logService.error('InboundScheduleService', message, {
      ...(data ? { data } : {}),
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    }),
};

const API_BASE_URL = 'http://localhost:3100'; // Backend API URL

// Interface for backend API response
interface InboundInternationalRecord {
  id: string;
  date: string;
  pi: string;
  supplier: string;
  origin: string;
  destination: string;
  product: string;
  category: string;
  quantity: number;
  container: number;
  status: string;
  carrier: string;
  purpose: string;
  receiveTime: string;
  poNumbers: string;
  packagingTypes: string;
  packagingQuantities: string;
  packagingDescriptions: string;
  // Timeline flattened columns
  timeline_created_description: string; // Mô tả cho "Ngày tạo phiếu"
  timeline_cargoReady_est: string;
  timeline_cargoReady_act: string;
  timeline_cargoReady_status: string;
  timeline_cargoReady_description: string;
  timeline_etd_est: string;
  timeline_etd_act: string;
  timeline_etd_status: string;
  timeline_etd_description: string;
  timeline_eta_est: string;
  timeline_eta_act: string;
  timeline_eta_status: string;
  timeline_eta_description: string;
  timeline_depart_est: string;
  timeline_depart_act: string;
  timeline_depart_status: string;
  timeline_depart_description: string;
  timeline_arrivalPort_est: string;
  timeline_arrivalPort_act: string;
  timeline_arrivalPort_status: string;
  timeline_arrivalPort_description: string;
  timeline_receive_est: string;
  timeline_receive_act: string;
  timeline_receive_status: string;
  timeline_receive_description: string;
  // Document status flattened columns
  doc_checkBill_est: string;
  doc_checkBill_act: string;
  doc_checkBill_status: string;
  doc_checkBill_description: string;
  doc_checkCO_est: string;
  doc_checkCO_act: string;
  doc_checkCO_status: string;
  doc_checkCO_description: string;
  doc_sendDocs_est: string;
  doc_sendDocs_act: string;
  doc_sendDocs_status: string;
  doc_sendDocs_description: string;
  doc_customs_est: string;
  doc_customs_act: string;
  doc_customs_status: string;
  doc_customs_description: string;
  doc_tax_est: string;
  doc_tax_act: string;
  doc_tax_status: string;
  doc_tax_description: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Helper: Parse description history string back to DescriptionEntry array
const parseDescriptionHistory = (historyString: string): DescriptionEntry[] => {
  if (!historyString || !historyString.trim()) return [];

  const lines = historyString.split('\n').filter(Boolean);
  const entries: DescriptionEntry[] = [];

  lines.forEach((line) => {
    // Parse format: "1. [timestamp] author: content"
    const match = line.match(/^\d+\.\s*\[(.*?)\]\s*(.*?):\s*(.*)$/);
    if (match) {
      const [, timestamp, author, content] = match;
      entries.push({
        id: `desc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: content.trim(),
        author: author.trim(),
        timestamp: new Date(timestamp).toISOString(),
      });
    }
  });

  return entries;
};

export class InboundScheduleService {
  // Lấy tất cả dữ liệu từ backend API (international + domestic)
  async getAllItems(): Promise<InboundItem[]> {
    try {
      // Lấy dữ liệu từ backend API (international) với fallback mềm
      let internationalData: InboundInternationalRecord[] | InboundInternationalRecord = [] as any;
      try {
        internationalData = await this.fetchFromAPI('/api/inboundinternational');
        inboundLogger.debug('International API response', internationalData);
      } catch (e) {
        // Fallback: nếu API quốc tế chưa sẵn sàng, tiếp tục với dữ liệu quốc nội
        inboundLogger.warn(
          'InboundInternational API not available. Proceeding with domestic data only.',
          e
        );
        internationalData = [] as any;
      }

      // Lấy dữ liệu domestic từ Google Sheets trực tiếp
      const domesticData = await getInboundDomesticItems();
      inboundLogger.debug('Domestic data response', domesticData);

      // Chuyển đổi dữ liệu từ backend thành InboundItem format
      const internationalArray = Array.isArray(internationalData)
        ? internationalData
        : [internationalData];
      const internationalItems: InboundItem[] = internationalArray.map(
        (record: InboundInternationalRecord) => this.convertRecordToItem(record)
      );

      // Chuyển đổi dữ liệu domestic thành InboundItem format
      const domesticItems: InboundItem[] = domesticData.map((item) => {
        return {
          id: item.id,
          date: item.date,
          supplier: item.supplier,
          origin: item.origin,
          destination: item.destination,
          product: item.product,
          quantity: item.quantity,
          status: item.status,
          estimatedArrival: item.estimatedArrival || '', // Ngày dự kiến
          actualArrival: item.actualArrival || '', // Ngày thực tế
          notes: item.notes || '',
          pi: item.pi || '',
          container: item.container || 0,
          category: item.category,
          poNumbers: [], // Domestic không có PO numbers
          packaging: item.packaging || [], // Sử dụng packaging data thực tế
          timeline: [
            // Tạo timeline cơ bản cho domestic
            {
              id: `${item.id}-tl-created`,
              name: 'Ngày tạo phiếu',
              estimatedDate: '',
              date: item.date,
              status: 'completed',
              description: '',
            },
            {
              id: `${item.id}-tl-receive`,
              name: 'Ngày nhận hàng',
              estimatedDate: item.estimatedArrival || '',
              date: item.actualArrival || '',
              status: item.actualArrival ? 'completed' : 'pending',
              description: '',
            },
          ].filter((t) => t.estimatedDate || t.date), // Chỉ giữ timeline có dữ liệu
          documentStatus: [], // Domestic không có document status phức tạp
          carrier: item.carrier,
          purpose: item.purpose,
          receiveTime: item.receiveTime,
          type: 'domestic' as const,
        } as InboundItem;
      });

      // Hợp nhất dữ liệu international và domestic
      const allItems = [...internationalItems, ...domesticItems];

      inboundLogger.info('Inbound items loaded', {
        internationalCount: internationalItems.length,
        domesticCount: domesticItems.length,
        total: allItems.length,
      });

      return allItems;
    } catch (error) {
      inboundLogger.error('Error fetching inbound items', error);
      // Fallback cuối: nếu có lỗi tổng thể, trả về mảng rỗng để UI vẫn render
      return [];
    }
  }

  // Helper: Tạo InboundInternationalRecord từ InboundItem
  private buildRecordFromItem(item: InboundItem, existingId?: string): InboundInternationalRecord {
    const record: InboundInternationalRecord = {
      id: existingId || '', // Backend will generate for new items
      date: item.date,
      pi: item.pi,
      supplier: item.supplier,
      origin: item.origin,
      destination: item.destination,
      product: item.product,
      category: item.category,
      quantity: item.quantity,
      container: item.container,
      status: item.status,
      carrier: item.carrier,
      purpose: item.purpose,
      receiveTime: item.receiveTime,
      poNumbers: item.poNumbers.join(';'),
      packagingTypes: item.packaging.map((p) => p.type).join(';'),
      packagingQuantities: item.packaging.map((p) => p.quantity.toString()).join(';'),
      packagingDescriptions: item.packaging.map((p) => p.description).join(';'),
      // Timeline flattened columns - populated by helper method
      timeline_created_description: '',
      timeline_cargoReady_est: '',
      timeline_cargoReady_act: '',
      timeline_cargoReady_status: '',
      timeline_cargoReady_description: '',
      timeline_etd_est: '',
      timeline_etd_act: '',
      timeline_etd_status: '',
      timeline_etd_description: '',
      timeline_eta_est: '',
      timeline_eta_act: '',
      timeline_eta_status: '',
      timeline_eta_description: '',
      timeline_depart_est: '',
      timeline_depart_act: '',
      timeline_depart_status: '',
      timeline_depart_description: '',
      timeline_arrivalPort_est: '',
      timeline_arrivalPort_act: '',
      timeline_arrivalPort_status: '',
      timeline_arrivalPort_description: '',
      timeline_receive_est: '',
      timeline_receive_act: '',
      timeline_receive_status: '',
      timeline_receive_description: '',
      // Document status flattened columns - populated by helper method
      doc_checkBill_est: '',
      doc_checkBill_act: '',
      doc_checkBill_status: '',
      doc_checkBill_description: '',
      doc_checkCO_est: '',
      doc_checkCO_act: '',
      doc_checkCO_status: '',
      doc_checkCO_description: '',
      doc_sendDocs_est: '',
      doc_sendDocs_act: '',
      doc_sendDocs_status: '',
      doc_sendDocs_description: '',
      doc_customs_est: '',
      doc_customs_act: '',
      doc_customs_status: '',
      doc_customs_description: '',
      doc_tax_est: '',
      doc_tax_act: '',
      doc_tax_status: '',
      doc_tax_description: '',
      notes: item.notes || '',
      createdAt: '',
      updatedAt: '',
    };

    // Populate timeline flattened columns
    this.populateTimelineFields(record, item);

    // Populate document status flattened columns
    this.populateDocumentStatusFields(record, item);

    // Note: Descriptions are now stored in individual columns, not in notes
    // this.appendDescriptionsToNotes(record, item); // Legacy method - disabled

    return record;
  }

  // Helper: Populate timeline flattened columns
  private populateTimelineFields(record: InboundInternationalRecord, item: InboundItem): void {
    const timelineNameToKey: Record<string, string> = {
      'Ngày tạo phiếu': 'Created',
      'Cargo Ready': 'Cargo Ready',
      ETD: 'ETD',
      ETA: 'ETA',
      'Ngày hàng đi': 'Depart',
      'Ngày hàng về cảng': 'Arrival Port',
      'Ngày nhận hàng': 'Ngày nhận hàng',
    };

    const timeline_created = item.timeline.find((t) => timelineNameToKey[t.name] === 'Created');
    const timeline_cargoReady = item.timeline.find(
      (t) => timelineNameToKey[t.name] === 'Cargo Ready'
    );
    const timeline_etd = item.timeline.find((t) => timelineNameToKey[t.name] === 'ETD');
    const timeline_eta = item.timeline.find((t) => timelineNameToKey[t.name] === 'ETA');
    const timeline_depart = item.timeline.find((t) => timelineNameToKey[t.name] === 'Depart');
    const timeline_arrivalPort = item.timeline.find(
      (t) => timelineNameToKey[t.name] === 'Arrival Port'
    );
    const timeline_receive = item.timeline.find(
      (t) => timelineNameToKey[t.name] === 'Ngày nhận hàng'
    );

    if (timeline_created) {
      record.timeline_created_description = formatDescriptionHistory(
        timeline_created.descriptions || []
      );
    }
    if (timeline_cargoReady) {
      record.timeline_cargoReady_est = timeline_cargoReady.estimatedDate || '';
      record.timeline_cargoReady_act = timeline_cargoReady.date || '';
      record.timeline_cargoReady_status = timeline_cargoReady.status;
      record.timeline_cargoReady_description = formatDescriptionHistory(
        timeline_cargoReady.descriptions || []
      );
    }
    if (timeline_etd) {
      record.timeline_etd_est = timeline_etd.estimatedDate || '';
      record.timeline_etd_act = timeline_etd.date || '';
      record.timeline_etd_status = timeline_etd.status;
      record.timeline_etd_description = formatDescriptionHistory(timeline_etd.descriptions || []);
    }
    if (timeline_eta) {
      record.timeline_eta_est = timeline_eta.estimatedDate || '';
      record.timeline_eta_act = timeline_eta.date || '';
      record.timeline_eta_status = timeline_eta.status;
      record.timeline_eta_description = formatDescriptionHistory(timeline_eta.descriptions || []);
    }
    if (timeline_depart) {
      record.timeline_depart_est = timeline_depart.estimatedDate || '';
      record.timeline_depart_act = timeline_depart.date || '';
      record.timeline_depart_status = timeline_depart.status;
      record.timeline_depart_description = formatDescriptionHistory(
        timeline_depart.descriptions || []
      );
    }
    if (timeline_arrivalPort) {
      record.timeline_arrivalPort_est = timeline_arrivalPort.estimatedDate || '';
      record.timeline_arrivalPort_act = timeline_arrivalPort.date || '';
      record.timeline_arrivalPort_status = timeline_arrivalPort.status;
      record.timeline_arrivalPort_description = formatDescriptionHistory(
        timeline_arrivalPort.descriptions || []
      );
    }
    if (timeline_receive) {
      record.timeline_receive_est = timeline_receive.estimatedDate || '';
      record.timeline_receive_act = timeline_receive.date || '';
      record.timeline_receive_status = timeline_receive.status;
      record.timeline_receive_description = formatDescriptionHistory(
        timeline_receive.descriptions || []
      );
    }
  }

  // Helper: Populate document status flattened columns
  private populateDocumentStatusFields(
    record: InboundInternationalRecord,
    item: InboundItem
  ): void {
    const doc_checkBill = item.documentStatus.find((d) => d.name === 'Check bill');
    const doc_checkCO = item.documentStatus.find((d) => d.name === 'Check CO');
    const doc_sendDocs = item.documentStatus.find((d) => d.name === 'Send docs');
    const doc_customs = item.documentStatus.find((d) => d.name === 'Customs');
    const doc_tax = item.documentStatus.find((d) => d.name === 'Tax');

    if (doc_checkBill) {
      record.doc_checkBill_est = doc_checkBill.estimatedDate || '';
      record.doc_checkBill_act = doc_checkBill.date || '';
      record.doc_checkBill_status = doc_checkBill.status;
      record.doc_checkBill_description = formatDescriptionHistory(doc_checkBill.descriptions || []);
    }
    if (doc_checkCO) {
      record.doc_checkCO_est = doc_checkCO.estimatedDate || '';
      record.doc_checkCO_act = doc_checkCO.date || '';
      record.doc_checkCO_status = doc_checkCO.status;
      record.doc_checkCO_description = formatDescriptionHistory(doc_checkCO.descriptions || []);
    }
    if (doc_sendDocs) {
      record.doc_sendDocs_est = doc_sendDocs.estimatedDate || '';
      record.doc_sendDocs_act = doc_sendDocs.date || '';
      record.doc_sendDocs_status = doc_sendDocs.status;
      record.doc_sendDocs_description = formatDescriptionHistory(doc_sendDocs.descriptions || []);
    }
    if (doc_customs) {
      record.doc_customs_est = doc_customs.estimatedDate || '';
      record.doc_customs_act = doc_customs.date || '';
      record.doc_customs_status = doc_customs.status;
      record.doc_customs_description = formatDescriptionHistory(doc_customs.descriptions || []);
    }
    if (doc_tax) {
      record.doc_tax_est = doc_tax.estimatedDate || '';
      record.doc_tax_act = doc_tax.date || '';
      record.doc_tax_status = doc_tax.status;
      record.doc_tax_description = formatDescriptionHistory(doc_tax.descriptions || []);
    }
  }

  // Thêm item mới (đã được tối ưu)
  async addItem(item: Omit<InboundItem, 'id'>): Promise<InboundItem> {
    try {
      // Chỉ xử lý international items, domestic được xử lý riêng
      if (item.type !== 'international') {
        throw new Error('Use domestic service for domestic items');
      }

      const record = this.buildRecordFromItem(item as InboundItem);
      const saved = await this.fetchFromAPI('/api/inboundinternational', {
        method: 'POST',
        body: JSON.stringify(record),
      });

      const savedRecord = Array.isArray(saved) ? saved[0] : saved;
      return this.convertRecordToItem(savedRecord);
    } catch (error) {
      inboundLogger.error('Error adding inbound item', error);
      throw error;
    }
  }

  // Cập nhật item (đã được tối ưu)
  async updateItem(item: InboundItem): Promise<InboundItem> {
    try {
      // Chỉ xử lý international items, domestic được xử lý riêng
      if (item.type !== 'international') {
        throw new Error('Use domestic service for domestic items');
      }

      const record = this.buildRecordFromItem(item, item.id);
      const updated = await this.fetchFromAPI(`/api/inboundinternational/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify(record),
      });

      const updatedRecord = Array.isArray(updated) ? updated[0] : updated;
      return this.convertRecordToItem(updatedRecord);
    } catch (error) {
      inboundLogger.error('Error updating inbound item', error, { id: item.id });
      throw error;
    }
  }

  // Xóa item
  async deleteItem(id: string): Promise<void> {
    try {
      await this.fetchFromAPI(`/api/inboundinternational/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      inboundLogger.error('Error deleting inbound item', error, { id });
      throw error;
    }
  }

  // Helper method to fetch from API
  private async fetchFromAPI(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<InboundInternationalRecord | InboundInternationalRecord[]> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Helper: Safe status casting
  private safeTimelineStatus(status?: string): TimelineItem['status'] {
    const validStatuses: TimelineItem['status'][] = [
      'pending',
      'completed',
      'confirmed',
      'in-progress',
    ];
    return validStatuses.includes(status as TimelineItem['status'])
      ? (status as TimelineItem['status'])
      : 'pending';
  }

  private safeDocumentStatus(status?: string): DocumentStatusItem['status'] {
    const validStatuses: DocumentStatusItem['status'][] = [
      'pending',
      'completed',
      'confirmed',
      'in-progress',
    ];
    return validStatuses.includes(status as DocumentStatusItem['status'])
      ? (status as DocumentStatusItem['status'])
      : 'pending';
  }

  // Helper method to convert record to item (full implementation)
  private convertRecordToItem(record: InboundInternationalRecord): InboundItem {
    // Build packaging from flat columns
    const packagingTypes = (record.packagingTypes || '').split(';').filter(Boolean);
    const packagingQuantities = (record.packagingQuantities || '').split(';').filter(Boolean);
    const packagingDescriptions = (record.packagingDescriptions || '').split(';').filter(Boolean);

    const packaging: PackagingItem[] = packagingTypes.map((type, index) => ({
      id: `${record.id}-pkg-${index}`,
      type: type.trim(),
      quantity: parseInt(packagingQuantities[index] || '0', 10),
      description: (packagingDescriptions[index] || '').trim(),
    }));

    // Build timeline from flat columns
    const timeline: TimelineItem[] = [
      {
        id: `${record.id}-tl-created`,
        name: 'Ngày tạo phiếu',
        estimatedDate: '',
        date: record.date,
        status: 'completed' as const,
        description: record.timeline_created_description || '',
        descriptions: parseDescriptionHistory(record.timeline_created_description || ''),
      },
      {
        id: `${record.id}-tl-cargo`,
        name: 'Cargo Ready',
        estimatedDate: record.timeline_cargoReady_est || '',
        date: record.timeline_cargoReady_act || '',
        status: this.safeTimelineStatus(record.timeline_cargoReady_status),
        description: record.timeline_cargoReady_description || '',
        descriptions: parseDescriptionHistory(record.timeline_cargoReady_description || ''),
      },
      {
        id: `${record.id}-tl-etd`,
        name: 'ETD',
        estimatedDate: record.timeline_etd_est || '',
        date: record.timeline_etd_act || '',
        status: this.safeTimelineStatus(record.timeline_etd_status),
        description: record.timeline_etd_description || '',
        descriptions: parseDescriptionHistory(record.timeline_etd_description || ''),
      },
      {
        id: `${record.id}-tl-eta`,
        name: 'ETA',
        estimatedDate: record.timeline_eta_est || '',
        date: record.timeline_eta_act || '',
        status: this.safeTimelineStatus(record.timeline_eta_status),
        description: record.timeline_eta_description || '',
        descriptions: parseDescriptionHistory(record.timeline_eta_description || ''),
      },
      {
        id: `${record.id}-tl-depart`,
        name: 'Ngày hàng đi',
        estimatedDate: record.timeline_depart_est || '',
        date: record.timeline_depart_act || '',
        status: this.safeTimelineStatus(record.timeline_depart_status),
        description: record.timeline_depart_description || '',
        descriptions: parseDescriptionHistory(record.timeline_depart_description || ''),
      },
      {
        id: `${record.id}-tl-arrival`,
        name: 'Ngày hàng về cảng',
        estimatedDate: record.timeline_arrivalPort_est || '',
        date: record.timeline_arrivalPort_act || '',
        status: this.safeTimelineStatus(record.timeline_arrivalPort_status),
        description: record.timeline_arrivalPort_description || '',
        descriptions: parseDescriptionHistory(record.timeline_arrivalPort_description || ''),
      },
      {
        id: `${record.id}-tl-receive`,
        name: 'Ngày nhận hàng',
        estimatedDate: record.timeline_receive_est || '',
        date: record.timeline_receive_act || '',
        status: this.safeTimelineStatus(record.timeline_receive_status),
        description: record.timeline_receive_description || '',
        descriptions: parseDescriptionHistory(record.timeline_receive_description || ''),
      },
    ].filter((t) => t.name === 'Ngày tạo phiếu' || t.estimatedDate || t.date); // Chỉ giữ timeline có dữ liệu

    // Build document status from flat columns
    const documentStatus: DocumentStatusItem[] = [
      {
        id: `${record.id}-doc-bill`,
        name: 'Check bill',
        estimatedDate: record.doc_checkBill_est || '',
        date: record.doc_checkBill_act || '',
        status: this.safeDocumentStatus(record.doc_checkBill_status),
        description: record.doc_checkBill_description || '',
        descriptions: parseDescriptionHistory(record.doc_checkBill_description || ''),
      },
      {
        id: `${record.id}-doc-co`,
        name: 'Check CO',
        estimatedDate: record.doc_checkCO_est || '',
        date: record.doc_checkCO_act || '',
        status: this.safeDocumentStatus(record.doc_checkCO_status),
        description: record.doc_checkCO_description || '',
        descriptions: parseDescriptionHistory(record.doc_checkCO_description || ''),
      },
      {
        id: `${record.id}-doc-send`,
        name: 'TQ Gửi chứng từ đi',
        estimatedDate: record.doc_sendDocs_est || '',
        date: record.doc_sendDocs_act || '',
        status: this.safeDocumentStatus(record.doc_sendDocs_status),
        description: record.doc_sendDocs_description || '',
        descriptions: parseDescriptionHistory(record.doc_sendDocs_description || ''),
      },
      {
        id: `${record.id}-doc-customs`,
        name: 'Lên tờ khai hải quan',
        estimatedDate: record.doc_customs_est || '',
        date: record.doc_customs_act || '',
        status: this.safeDocumentStatus(record.doc_customs_status),
        description: record.doc_customs_description || '',
        descriptions: parseDescriptionHistory(record.doc_customs_description || ''),
      },
      {
        id: `${record.id}-doc-tax`,
        name: 'Đóng thuế',
        estimatedDate: record.doc_tax_est || '',
        date: record.doc_tax_act || '',
        status: this.safeDocumentStatus(record.doc_tax_status),
        description: record.doc_tax_description || '',
        descriptions: parseDescriptionHistory(record.doc_tax_description || ''),
      },
    ].filter((d) => d.estimatedDate || d.date); // Chỉ giữ document status có dữ liệu

    // Lấy ngày nhận hàng từ timeline để set vào estimatedArrival/actualArrival
    const receiveTimeline = timeline.find((t) => t.name === 'Ngày nhận hàng');

    return {
      id: record.id,
      date: record.date,
      supplier: record.supplier,
      origin: record.origin,
      destination: record.destination,
      product: record.product,
      quantity: record.quantity,
      status: record.status as InboundItem['status'],
      estimatedArrival: receiveTimeline?.estimatedDate || '',
      actualArrival: receiveTimeline?.date || '',
      notes: record.notes || '',
      pi: record.pi,
      container: parseInt(record.container?.toString() || '0') || 0,
      category: record.category,
      poNumbers: record.poNumbers.split(';').filter(Boolean),
      packaging,
      timeline,
      documentStatus,
      carrier: record.carrier,
      purpose: record.purpose as 'online' | 'offline',
      receiveTime: record.receiveTime,
      type: 'international' as const,
    };
  }
}

// Backward-compatible function exports to avoid changing component logic
// These delegate to the class-based service while preserving existing imports
export async function getInboundScheduleItems() {
  const service = new InboundScheduleService();
  return service.getAllItems();
}

export async function deleteInboundScheduleItem(id: string) {
  const service = new InboundScheduleService();
  return service.deleteItem(id);
}

// Optional shims for add/update to maintain full API compatibility if used elsewhere
export async function addInboundScheduleItem(item: any) {
  const service = new InboundScheduleService();
  return service.addItem(item);
}

export async function updateInboundScheduleItem(item: any) {
  const service = new InboundScheduleService();
  return service.updateItem(item);
}
