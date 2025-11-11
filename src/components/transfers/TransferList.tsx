// src/components/transfers/TransferList.tsx
// Interface for Transfer data
export interface Transfer {
  transfer_id: string; // ID phiếu CK (ID chính)
  orderCode: string; // Mã đơn hàng
  hasVali: string; // Có vali
  date: string; // Thời gian
  source: string; // Kho nguồn
  dest: string; // Kho đích
  quantity: number; // Số lượng SP
  state: string; // Trạng thái
  note: string; // Ghi chú
  dest_id: string; // ID Kho đích
  source_id: string; // ID Kho nguồn
  employee: string; // Nhân viên
  transportStatus?: string; // Trạng thái vận chuyển
  // Packages (số nguyên)
  pkgS?: number;
  pkgM?: number;
  pkgL?: number;
  pkgBagSmall?: number;
  pkgBagMedium?: number;
  pkgBagLarge?: number;
  pkgOther?: number;
  // Volumes (m³ - số thực)
  volS?: number;
  volM?: number;
  volL?: number;
  volBagSmall?: number;
  volBagMedium?: number;
  volBagLarge?: number;
  volOther?: number;
  // Location fields
  address?: string;
  ward?: string;
  district?: string;
  province?: string;
  // Computed field
  id?: string; // Alias for transfer_id
}
