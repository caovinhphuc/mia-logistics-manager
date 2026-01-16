// src/services/googleSheets/inboundInternationalService.ts
import { SHEETS_CONFIG } from '../../config/sheetsConfig';
import { BaseGoogleSheetsService } from './baseService';

// Minimal interface matching frontend InboundItem (flattened)
export interface InboundInternationalRecord {
  id: string;
  date: string; // YYYY-MM-DD
  pi: string;
  supplier: string;
  origin: string;
  destination: string;
  product: string;
  category: string;
  quantity: number;
  container: number;
  status: 'pending' | 'confirmed' | 'waiting-notification' | 'notified' | 'received';
  carrier: string;
  purpose: 'online' | 'offline';
  receiveTime?: string; // HH:mm
  poNumbers?: string; // semicolon-separated
  // Backward-compatible JSON columns (may be absent in future)
  packagingJson?: string; // JSON.stringify(PackagingItem[])
  timelineJson?: string; // JSON.stringify(TimelineItem[])
  documentStatusJson?: string; // JSON.stringify(DocumentStatusItem[])
  // Flattened packaging (semicolon separated, aligned by index)
  packagingTypes?: string;
  packagingQuantities?: string;
  packagingDescriptions?: string;
  // Flattened timeline
  timeline_cargoReady_est?: string;
  timeline_cargoReady_act?: string;
  timeline_cargoReady_status?: string;
  timeline_etd_est?: string;
  timeline_etd_act?: string;
  timeline_etd_status?: string;
  timeline_eta_est?: string;
  timeline_eta_act?: string;
  timeline_eta_status?: string;
  timeline_depart_est?: string;
  timeline_depart_act?: string;
  timeline_depart_status?: string;
  timeline_arrivalPort_est?: string;
  timeline_arrivalPort_act?: string;
  timeline_arrivalPort_status?: string;
  timeline_receive_est?: string;
  timeline_receive_act?: string;
  timeline_receive_status?: string;
  // Flattened document statuses
  doc_checkBill_est?: string;
  doc_checkBill_act?: string;
  doc_checkBill_status?: string;
  doc_checkCO_est?: string;
  doc_checkCO_act?: string;
  doc_checkCO_status?: string;
  doc_sendDocs_est?: string;
  doc_sendDocs_act?: string;
  doc_sendDocs_status?: string;
  doc_customs_est?: string;
  doc_customs_act?: string;
  doc_customs_status?: string;
  doc_tax_est?: string;
  doc_tax_act?: string;
  doc_tax_status?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class InboundInternationalService extends BaseGoogleSheetsService {
  async add(
    record: Omit<InboundInternationalRecord, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<InboundInternationalRecord> {
    const payload: InboundInternationalRecord = {
      // Let backend generate id & VN-time timestamps to ensure correct Sheets formatting
      ...(record as InboundInternationalRecord),
    } as unknown as InboundInternationalRecord;

    const saved = await this.addRecord(
      SHEETS_CONFIG.SHEETS.INBOUND_INTERNATIONAL,
      payload as unknown as Record<string, unknown>
    );
    return saved as unknown as InboundInternationalRecord;
  }

  async list(limit?: number): Promise<InboundInternationalRecord[]> {
    return this.getRecords<InboundInternationalRecord>(
      SHEETS_CONFIG.SHEETS.INBOUND_INTERNATIONAL,
      limit
    );
  }

  async update(
    id: string,
    updates: Partial<InboundInternationalRecord>
  ): Promise<InboundInternationalRecord> {
    return this.updateRecord(
      SHEETS_CONFIG.SHEETS.INBOUND_INTERNATIONAL,
      id,
      'id',
      updates as unknown as Record<string, unknown>
    ) as unknown as Promise<InboundInternationalRecord>;
  }

  async remove(id: string): Promise<boolean> {
    return this.deleteRecord(SHEETS_CONFIG.SHEETS.INBOUND_INTERNATIONAL, id, 'id');
  }
}
