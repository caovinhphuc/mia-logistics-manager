import {
  Campaign as CampaignIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  ReceiptLong as ExportIcon,
  FilterList as FilterListIcon,
  GridView as GridViewIcon,
  MoreVert as MoreVertIcon,
  Pending as PendingIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  LocalShipping as ShippingIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Popover,
  Select,
  Snackbar,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// Services
import { logService } from '../../../services/logService';
import { GoogleMapsService } from '../../../services/maps/mapsService';

// Shared components
import {
  ActionButton,
  ActionIcons,
  DataTable,
  Icon,
  StatusChip,
} from '../../../shared/components/ui';

// Store
import { useUIStore } from '../../../stores/uiStore';

interface Transfer {
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
  // Trạng thái vận chuyển
  transportStatus?: string;
  // Các cột Kiện (số nguyên)
  pkgS?: number;
  pkgM?: number;
  pkgL?: number;
  pkgBagSmall?: number;
  pkgBagMedium?: number;
  pkgBagLarge?: number;
  pkgOther?: number;
  // Các cột Khối (m3 - số thực)
  volS?: number;
  volM?: number;
  volL?: number;
  volBagSmall?: number;
  volBagMedium?: number;
  volBagLarge?: number;
  volOther?: number;
  // Các cột thông tin địa điểm
  address?: string;
  ward?: string;
  district?: string;
  province?: string;
}

interface Location {
  id: string;
  code: string;
  address: string;
  ward: string;
  district: string;
  province: string;
}

// Helpers for safe value extraction
const getStringFrom = (obj: Record<string, unknown>, key: string): string => {
  const v = obj[key];
  if (v == null) return '';
  return typeof v === 'string' ? v : String(v);
};

const getNumberFrom = (obj: Record<string, unknown>, key: string): number => {
  const raw = obj[key];
  if (raw == null) return 0;

  if (typeof raw === 'number') {
    if (!Number.isFinite(raw) || raw < 0 || raw > 1000000) return 0;
    return raw;
  }

  const str = String(raw).trim();
  if (!str) return 0;

  const normalized = str.replace(/\./g, '').replace(',', '.');
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1000000) return 0;

  return parsed;
};

const normalizeHasVali = (value: string): 'Có vali' | 'Không vali' => {
  const raw = (value || '').toString().trim();
  if (!raw) return 'Không vali';

  const ascii = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const positiveValues = new Set([
    'co vali',
    'co',
    'co hang',
    'co hang vali',
    'co vali hang',
    'yes',
    'true',
    '1',
  ]);

  const negativeValues = new Set([
    'khong vali',
    'khong',
    'khong hang',
    'khong hang vali',
    'ko vali',
    'ko hang',
    'no',
    'false',
    '0',
  ]);

  if (positiveValues.has(ascii) || ascii.includes('co vali') || ascii.includes('co hang')) {
    return 'Có vali';
  }

  if (negativeValues.has(ascii) || ascii.includes('khong') || ascii.includes('ko')) {
    return 'Không vali';
  }

  return ascii.includes('co') ? 'Có vali' : 'Không vali';
};

// Mock data đã được xóa để đảm bảo chỉ load từ Google Sheet

const getStatusLabel = (state: string) => {
  // Chuẩn hóa tên trạng thái
  switch (state) {
    // === TRẠNG THÁI PHIẾU (4 loại) ===
    case 'Đề nghị chuyển kho':
    case 'Xuất chuyển kho':
    case 'Nhập chuyển kho':
    case 'Đã hủy':
      return state;

    // === TRẠNG THÁI VẬN CHUYỂN (9 loại) ===
    case 'Chờ báo kiện':
    case 'Chờ chuyển giao':
    case 'Đang chuyển giao':
    case 'Đã chuyển giao':
    case 'Chờ xác nhận':
    case 'Đã xác nhận':
    case 'Đang vận chuyển':
    case 'Đã giao hàng':
      return state;

    default:
      return state;
  }
};

// Helper: round number to n decimals safely
const roundTo = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round((Number(value) || 0) * factor) / factor;
};

const debugTransferList = (message: string, data?: unknown) => {
  if (process.env.NODE_ENV !== 'production') {
    logService.debug('TransferList', message, data ? { data } : {});
  }
};

const logTransferError = (message: string, error: unknown) => {
  const payload =
    error instanceof Error
      ? { message: error.message, stack: error.stack }
      : { errorString: String(error) };
  logService.error('TransferList', message, payload);
};

const TransferList: React.FC = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    hasVali: '',
    status: '',
    transportStatus: '',
    source: '',
    dest: '',
    dateFrom: '',
    dateTo: '',
  });

  // Selection states
  const [selected, setSelected] = useState<string[]>([]);

  // Pagination states
  const [rowsPerPage] = useState(10);

  // Date filter states
  const [dateFilterAnchor, setDateFilterAnchor] = useState<null | HTMLElement>(null);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Gridview dialog state
  const [gridOpen, setGridOpen] = useState(false);
  const [gridTransfer, setGridTransfer] = useState<Transfer | null>(null);
  const [gridIndex, setGridIndex] = useState<number>(-1); // -1: single mode; >=0: index in selected
  const [reportOpen, setReportOpen] = useState(false);
  const [reportTransfer, setReportTransfer] = useState<Transfer | null>(null);
  const [volumeRules, setVolumeRules] = useState<
    Array<{ id: string; name: string; unitVolume: number }>
  >([]);
  const [reportCounts, setReportCounts] = useState<Record<string, number>>({});
  const SHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';

  // Location dialog states
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationData, setLocationData] = useState<Location>({
    id: '',
    code: '',
    address: '',
    ward: '',
    district: '',
    province: '',
  });

  // Edit dialog states (chỉnh sửa địa chỉ)
  const [editOpen, setEditOpen] = useState(false);
  const [editTransfer, setEditTransfer] = useState<Transfer | null>(null);
  const [editForm, setEditForm] = useState({
    address: '',
    ward: '',
    district: '',
    province: '',
  });

  // Statistics state
  const [stats, setStats] = useState({
    pendingReport: 0,
    pendingTransfer: 0,
    inTransfer: 0,
    completed: 0,
    totalProducts: 0,
    totalPackages: 0,
    totalVolume: 0,
    // Chờ báo kiện details
    pendingReportWithLuggage: 0,
    pendingReportWithoutLuggage: 0,
    pendingReportProductsWithLuggage: 0,
    pendingReportProductsWithoutLuggage: 0,
    // Chờ chuyển giao details
    pendingTransferDeliveryPoints: 0,
    pendingTransferPackages: 0,
    pendingTransferVolume: 0,
  });

  // Dialog states

  // Action menu dropdown state
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTransferForAction, setSelectedTransferForAction] = useState<Transfer | null>(null);

  // Helper to reload transfers from server

  const reloadTransfers = async (): Promise<void> => {
    try {
      const res = await fetch(`/api/transfers?spreadsheetId=${encodeURIComponent(SHEET_ID)}`);
      if (!res.ok) throw new Error('reload failed');
      const data = await res.json();
      const mapped: Transfer[] = (data as Array<Record<string, unknown>>).map((r) => ({
        id: getStringFrom(r, 'id') || getStringFrom(r, 'transfer_id') || '',
        orderCode: getStringFrom(r, 'orderCode'),
        hasVali: normalizeHasVali(getStringFrom(r, 'hasVali')),
        date: getStringFrom(r, 'date'),
        source: getStringFrom(r, 'source'),
        dest: getStringFrom(r, 'dest'),
        quantity: getNumberFrom(r, 'quantity'),
        state: getStringFrom(r, 'state'),
        note: getStringFrom(r, 'note'),
        dest_id: getStringFrom(r, 'dest_id'),
        transfer_id: getStringFrom(r, 'transfer_id') || getStringFrom(r, 'id') || '',
        source_id: getStringFrom(r, 'source_id'),
        employee: getStringFrom(r, 'employee'),
        transportStatus: getStringFrom(r, 'transportStatus') || 'Chờ báo kiện',
        pkgS: getNumberFrom(r, 'pkgS'),
        pkgM: getNumberFrom(r, 'pkgM'),
        pkgL: getNumberFrom(r, 'pkgL'),
        pkgBagSmall: getNumberFrom(r, 'pkgBagSmall'),
        pkgBagMedium: getNumberFrom(r, 'pkgBagMedium'),
        pkgBagLarge: getNumberFrom(r, 'pkgBagLarge'),
        pkgOther: getNumberFrom(r, 'pkgOther'),
        volS: getNumberFrom(r, 'volS'),
        volM: getNumberFrom(r, 'volM'),
        volL: getNumberFrom(r, 'volL'),
        volBagSmall: getNumberFrom(r, 'volBagSmall'),
        volBagMedium: getNumberFrom(r, 'volBagMedium'),
        volBagLarge: getNumberFrom(r, 'volBagLarge'),
        volOther: getNumberFrom(r, 'volOther'),
        // Thêm các cột địa điểm
        address: getStringFrom(r, 'address'),
        ward: getStringFrom(r, 'ward'),
        district: getStringFrom(r, 'district'),
        province: getStringFrom(r, 'province'),
      }));
      setTransfers(mapped);
    } catch {
      // ignore reload error
    }
  };

  const handleEditTransfer = (transfer: Transfer) => {
    setEditTransfer(transfer);
    setEditForm({
      address: transfer.address || '',
      ward: transfer.ward || '',
      district: transfer.district || '',
      province: transfer.province || '',
    });
    setEditOpen(true);
  };

  const handleEditFormChange = (field: keyof typeof editForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitEdit = async () => {
    if (!editTransfer) return;
    const updateId = editTransfer.transfer_id;
    try {
      const res = await fetch(
        `/api/transfers/${encodeURIComponent(updateId)}?spreadsheetId=${encodeURIComponent(
          SHEET_ID
        )}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm),
        }
      );
      if (!res.ok) throw new Error('Update failed');
      await res.json();

      // Update UI optimistic
      setTransfers((prev) =>
        prev.map((t) => (t.transfer_id === updateId ? { ...t, ...editForm } : t))
      );
      setEditOpen(false);
      setEditTransfer(null);
      await reloadTransfers();
    } catch (e) {
      logTransferError('Cập nhật địa chỉ lỗi', e);
      alert('Cập nhật thất bại. Vui lòng thử lại.');
    }
  };

  // Cascading location selectors using Google Maps places (simple text-search fallback)
  const mapsServiceRef = useRef<GoogleMapsService | null>(null);
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [wardOptions, setWardOptions] = useState<string[]>([]);

  useEffect(() => {
    mapsServiceRef.current = new GoogleMapsService();
  }, []);

  const fetchCities = async (q: string) => {
    const svc = mapsServiceRef.current;
    if (!svc) return;
    const results = await svc.searchPlaces(q || 'Việt Nam');
    const cities = Array.from(
      new Set(
        results
          .map((r) => r.formatted_address || '')
          .flatMap((addr) => addr.split(','))
          .map((s) => s.trim())
      )
    ).filter(Boolean);
    setCityOptions(cities.slice(0, 50));
  };

  useEffect(() => {
    fetchCities('');
  }, []);

  const fetchDistricts = async (city: string) => {
    const svc = mapsServiceRef.current;
    if (!svc || !city) return;
    const results = await svc.searchPlaces(`Quận ${city}`);
    const districts = Array.from(
      new Set(
        results
          .map((r) => r.formatted_address || '')
          .flatMap((addr) => addr.split(','))
          .map((s) => s.trim())
          .filter((s) => s.toLowerCase().includes('quận') || s.toLowerCase().includes('huyện'))
      )
    );
    setDistrictOptions(districts.slice(0, 50));
  };

  const fetchWards = async (city: string, district: string) => {
    const svc = mapsServiceRef.current;
    if (!svc || !city || !district) return;
    const results = await svc.searchPlaces(`Phường ${district} ${city}`);
    const wards = Array.from(
      new Set(
        results
          .map((r) => r.formatted_address || '')
          .flatMap((addr) => addr.split(','))
          .map((s) => s.trim())
          .filter((s) => s.toLowerCase().includes('phường') || s.toLowerCase().includes('xã'))
      )
    );
    setWardOptions(wards.slice(0, 50));
  };

  // Action menu handlers
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, transfer: Transfer) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedTransferForAction(transfer);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedTransferForAction(null);
  };

  const handleActionClick = (action: string) => {
    if (!selectedTransferForAction) return;

    switch (action) {
      case 'report':
        openReportDialog(selectedTransferForAction);
        break;
      case 'view':
        handleViewTransfer(selectedTransferForAction);
        break;
      case 'print':
        handlePrintPicking(selectedTransferForAction);
        break;
      case 'export':
        handleExportTransfer(selectedTransferForAction);
        break;
      case 'edit':
        handleEditTransfer(selectedTransferForAction);
        break;
      case 'delete':
        handleDeleteTransfer(selectedTransferForAction);
        break;
    }
    handleActionMenuClose();
  };

  const handleDeleteTransfer = async (transfer: Transfer) => {
    const confirmText = `Bạn có chắc muốn xoá phiếu ${transfer.orderCode} (ID: ${transfer.transfer_id})?\n\nHành động này không thể hoàn tác.`;
    const ok = window.confirm(confirmText);
    if (!ok) return;

    try {
      const res = await fetch(
        `/api/transfers/${encodeURIComponent(transfer.transfer_id)}?spreadsheetId=${encodeURIComponent(
          SHEET_ID
        )}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Delete failed');

      // Xoá ngay trên UI để phản hồi nhanh
      setTransfers((prev) => prev.filter((t) => t.transfer_id !== transfer.transfer_id));
      setSelected((prev) => prev.filter((id) => id !== transfer.transfer_id));

      // Làm mới lại từ server để đồng bộ tuyệt đối
      await reloadTransfers();
    } catch (e) {
      logTransferError('Xoá phiếu lỗi', e);
      alert('Xoá phiếu thất bại. Vui lòng thử lại.');
    }
  };

  const handleViewTransfer = (transfer: Transfer) => {
    debugTransferList('View transfer', transfer);
    // Mở link in phiếu đơn lẻ
    const url = `https://one.tga.com.vn/so/ckprint/goods?id=${transfer.transfer_id}`;
    window.open(url, '_blank');
  };

  const handlePrintPicking = (transfer: Transfer) => {
    debugTransferList('Print picking', transfer);
    // Mở link in phiếu picking đơn lẻ
    const url = `https://one.tga.com.vn/so/ckprint/picking?id=${transfer.transfer_id}`;
    window.open(url, '_blank');
  };

  const handleExportTransfer = (transfer: Transfer) => {
    debugTransferList('Export transfer', transfer);
    // Mở link xuất phiếu đơn lẻ (detail/{id})
    const url = `https://one.tga.com.vn/picking/goodsdeliverynote/inventorytransfer/detail/${transfer.transfer_id}`;
    window.open(url, '_blank');
  };

  const handlePrintMultipleTransfers = () => {
    if (selected.length === 0) {
      alert('Vui lòng chọn ít nhất một phiếu để in');
      return;
    }

    // Lấy các transfer_id của các phiếu đã chọn
    const selectedTransfers = transfers.filter((transfer) =>
      selected.includes(transfer.transfer_id)
    );

    const transferIds = selectedTransfers
      .map((transfer) => transfer.transfer_id)
      .filter((id) => id) // Lọc bỏ các id rỗng
      .join(',');

    if (transferIds) {
      const url = `https://one.tga.com.vn/so/ckprint/goods?id=${transferIds}`;
      window.open(url, '_blank');
    } else {
      alert('Không tìm thấy ID phiếu hợp lệ để in');
    }
  };

  const handlePrintMultiplePicking = () => {
    if (selected.length === 0) {
      alert('Vui lòng chọn ít nhất một phiếu để in');
      return;
    }

    // Lấy các transfer_id của các phiếu đã chọn
    const selectedTransfers = transfers.filter((transfer) =>
      selected.includes(transfer.transfer_id)
    );

    const transferIds = selectedTransfers
      .map((transfer) => transfer.transfer_id)
      .filter((id) => id) // Lọc bỏ các id rỗng
      .join(',');

    if (transferIds) {
      const url = `https://one.tga.com.vn/so/ckprint/picking?id=${transferIds}`;
      window.open(url, '_blank');
    } else {
      alert('Không tìm thấy ID phiếu hợp lệ để in');
    }
  };

  const handleImportCSV = () => {
    fileInputRef.current?.click();
  };

  const openGridView = (transfer: Transfer) => {
    setGridTransfer(transfer);
    setGridOpen(true);
    setGridIndex(-1);
  };

  const openReportDialog = async (transfer: Transfer) => {
    setReportTransfer(transfer);

    // Kiểm tra xem phiếu đã có dữ liệu kiện chưa
    const totalPackages =
      (transfer.pkgS || 0) +
      (transfer.pkgM || 0) +
      (transfer.pkgL || 0) +
      (transfer.pkgBagSmall || 0) +
      (transfer.pkgBagMedium || 0) +
      (transfer.pkgBagLarge || 0) +
      (transfer.pkgOther || 0);

    if (totalPackages > 0) {
      // Nếu đã có dữ liệu, hỏi người dùng muốn báo mới hay chỉnh sửa
      const userChoice = window.confirm(
        `Phiếu ${transfer.orderCode} đã có ${totalPackages} kiện. Bạn muốn:\n\n` +
          `- Báo mới: Xóa dữ liệu cũ và nhập lại từ đầu\n` +
          `- Chỉnh sửa: Giữ lại dữ liệu hiện tại để chỉnh sửa\n\n` +
          `Nhấn "OK" để báo mới, "Cancel" để chỉnh sửa.`
      );

      if (userChoice) {
        // Báo mới - reset về 0
        setReportCounts({});
      } else {
        // Chỉnh sửa - giữ dữ liệu hiện tại
        setReportCounts({
          S: transfer.pkgS || 0,
          M: transfer.pkgM || 0,
          L: transfer.pkgL || 0,
          BAG_S: transfer.pkgBagSmall || 0,
          BAG_M: transfer.pkgBagMedium || 0,
          BAG_L: transfer.pkgBagLarge || 0,
          OTHER: transfer.pkgOther || 0,
        });
      }
    } else {
      // Chưa có dữ liệu - reset về 0
      setReportCounts({});
    }

    try {
      const SHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
      const res = await fetch(
        `/api/settings/volume-rules?spreadsheetId=${encodeURIComponent(SHEET_ID)}`
      );
      if (res.ok) {
        const data = (await res.json()) as Array<Record<string, unknown>>;
        const parse = (v: unknown) => {
          const s = String(v ?? '').trim();
          if (/^\d{1,3}(\.\d{3})*(,\d+)?$/.test(s))
            return Number(s.replace(/\./g, '').replace(',', '.'));
          return Number(String(v ?? '').replace(',', '.')) || 0;
        };
        const mapped = data.map((r) => ({
          id: String(r.id || ''),
          name: String(r.name || ''),
          unitVolume: parse(r.unitVolume),
        }));
        setVolumeRules(mapped);
      }
    } catch {
      // ignore
    }
    setReportOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportTransfer) return;
    const pkgS = reportCounts['S'] || 0;
    const pkgM = reportCounts['M'] || 0;
    const pkgL = reportCounts['L'] || 0;
    const pkgBagSmall = reportCounts['BAG_S'] || 0;
    const pkgBagMedium = reportCounts['BAG_M'] || 0;
    const pkgBagLarge = reportCounts['BAG_L'] || 0;
    const pkgOther = reportCounts['OTHER'] || 0;

    const getUnit = (id: string) => volumeRules.find((r) => r.id === id)?.unitVolume || 0;
    const volS = pkgS * getUnit('S');
    const volM = pkgM * getUnit('M');
    const volL = pkgL * getUnit('L');
    const volBagSmall = pkgBagSmall * getUnit('BAG_S');
    const volBagMedium = pkgBagMedium * getUnit('BAG_M');
    const volBagLarge = pkgBagLarge * getUnit('BAG_L');
    const volOther = pkgOther * getUnit('OTHER');

    // Tìm kiếm thông tin địa điểm từ sheet Locations
    const normalizeLocationId = (value: unknown) =>
      String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

    const normalizedDestId = normalizeLocationId(reportTransfer.dest_id);
    let locationInfo: Location | null = null;
    try {
      const locationRes = await fetch(
        `/api/locations?spreadsheetId=${encodeURIComponent(SHEET_ID)}`
      );
      if (locationRes.ok) {
        const locationData = await locationRes.json();
        debugTransferList('Tìm kiếm địa điểm theo dest_id', {
          destId: reportTransfer.dest_id,
          totalLocations: locationData.length,
        });

        const foundLocation = (locationData as Array<Record<string, unknown>>).find((loc) => {
          const locId = normalizeLocationId(loc.id || (loc as any).ID || '');
          return locId && locId === normalizedDestId;
        });

        if (foundLocation) {
          debugTransferList('Tìm thấy địa điểm', foundLocation);
          locationInfo = {
            id: String(foundLocation.id || ''),
            code: String(foundLocation.code || ''),
            address: String(foundLocation.address || ''),
            ward: String(foundLocation.ward || ''),
            district: String(foundLocation.district || ''),
            province: String(foundLocation.province || ''),
          };
        } else {
          debugTransferList('Không tìm thấy địa điểm cho dest_id', reportTransfer.dest_id);
        }
      }
    } catch (error) {
      logTransferError('Error fetching location data', error);
    }

    // Fallback: nếu sheet Locations không có nhưng phiếu đã có địa chỉ thủ công
    if (!locationInfo && Array.isArray(locationData)) {
      const cleaned =
        (locationData as Array<Record<string, unknown>>).find((loc) => {
          const code = normalizeLocationId(loc.code || (loc as any).Code || '');
          if (!code) return false;
          const destCode = normalizeLocationId(reportTransfer.dest || '');
          return code && destCode && code === destCode;
        }) || null;

      if (cleaned) {
        locationInfo = {
          id: normalizeLocationId(cleaned.id || (cleaned as any).ID || '') || normalizedDestId,
          code: String(cleaned.code || (cleaned as any).Code || reportTransfer.dest || ''),
          address: String(cleaned.address || (cleaned as any).Address || '').trim(),
          ward: String(cleaned.ward || (cleaned as any).Ward || '').trim(),
          district: String(cleaned.district || (cleaned as any).District || '').trim(),
          province: String(cleaned.province || (cleaned as any).Province || '').trim(),
        };
      }
    }

    if (!locationInfo) {
      const existingAddress = (reportTransfer.address || '').trim();
      const existingWard = (reportTransfer.ward || '').trim();
      const existingDistrict = (reportTransfer.district || '').trim();
      const existingProvince = (reportTransfer.province || '').trim();
      if (existingAddress || existingWard || existingDistrict || existingProvince) {
        locationInfo = {
          id: normalizedDestId,
          code: reportTransfer.dest || '',
          address: existingAddress,
          ward: existingWard,
          district: existingDistrict,
          province: existingProvince,
        };
      }
    }

    // Nếu tìm thấy địa điểm, tự động điền thông tin
    if (locationInfo) {
      const next = {
        ...reportTransfer,
        pkgS,
        pkgM,
        pkgL,
        pkgBagSmall,
        pkgBagMedium,
        pkgBagLarge,
        pkgOther,
        volS: roundTo(volS, 3),
        volM: roundTo(volM, 3),
        volL: roundTo(volL, 3),
        volBagSmall: roundTo(volBagSmall, 3),
        volBagMedium: roundTo(volBagMedium, 3),
        volBagLarge: roundTo(volBagLarge, 3),
        volOther: roundTo(volOther, 3),
        state: 'Xuất chuyển kho',
        transportStatus: 'Chờ chuyển giao',
        // Tự động điền thông tin địa điểm vào các cột riêng biệt
        // Giữ nguyên dest, chỉ điền vào các cột địa điểm riêng biệt
        address: locationInfo.address,
        ward: locationInfo.ward,
        district: locationInfo.district,
        province: locationInfo.province,
      } as Transfer;

      try {
        const updateId = next.transfer_id || (next as any).id;
        const res = await fetch(
          `/api/transfers/${encodeURIComponent(updateId)}?spreadsheetId=${encodeURIComponent(SHEET_ID)}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...next,
              // Làm tròn trước khi ghi sheet để tránh số dài (floating point)
              volS: roundTo(volS, 3),
              volM: roundTo(volM, 3),
              volL: roundTo(volL, 3),
              volBagSmall: roundTo(volBagSmall, 3),
              volBagMedium: roundTo(volBagMedium, 3),
              volBagLarge: roundTo(volBagLarge, 3),
              volOther: roundTo(volOther, 3),
              totalPackages: Number(
                pkgS + pkgM + pkgL + pkgBagSmall + pkgBagMedium + pkgBagLarge + pkgOther
              ),
              totalVolume: roundTo(
                volS + volM + volL + volBagSmall + volBagMedium + volBagLarge + volOther,
                2
              ),
            }),
          }
        );
        if (!res.ok) throw new Error('update failed');

        // update local list
        setTransfers((prev) => prev.map((t) => (t.transfer_id === updateId ? next : t)));

        setSnackbar({
          open: true,
          message: 'Đã báo kiện và tự động điền thông tin địa điểm',
          severity: 'success',
        });
      } catch {
        setSnackbar({
          open: true,
          message: 'Cập nhật Sheet thất bại',
          severity: 'error',
        });
      }
    } else {
      // Nếu không tìm thấy địa điểm, hiển thị dialog để người dùng nhập thủ công
      setLocationData({
        id: normalizedDestId,
        code: reportTransfer.dest,
        address: (reportTransfer.address || '').trim(),
        ward: (reportTransfer.ward || '').trim(),
        district: (reportTransfer.district || '').trim(),
        province: (reportTransfer.province || '').trim(),
      });
      setLocationDialogOpen(true);
      return; // Không đóng dialog báo kiện
    }

    // reload from sheet to reflect any normalization done server-side
    try {
      const r = await fetch(`/api/transfers?spreadsheetId=${encodeURIComponent(SHEET_ID)}`);
      if (r.ok) {
        const data = await r.json();
        const mapped: Transfer[] = (data as Array<Record<string, unknown>>).map((rr) => ({
          id: getStringFrom(rr, 'id') || getStringFrom(rr, 'transfer_id') || '',
          orderCode: getStringFrom(rr, 'orderCode'),
          hasVali: normalizeHasVali(getStringFrom(rr, 'hasVali')),
          date: getStringFrom(rr, 'date'),
          source: getStringFrom(rr, 'source'),
          dest: getStringFrom(rr, 'dest'),
          quantity: getNumberFrom(rr, 'quantity'),
          state: getStringFrom(rr, 'state'),
          note: getStringFrom(rr, 'note'),
          dest_id: getStringFrom(rr, 'dest_id'),
          transfer_id: getStringFrom(rr, 'transfer_id') || getStringFrom(rr, 'id') || '',
          source_id: getStringFrom(rr, 'source_id'),
          employee: getStringFrom(rr, 'employee'),
          transportStatus: getStringFrom(rr, 'transportStatus') || 'Chờ báo kiện',
          pkgS: getNumberFrom(rr, 'pkgS'),
          pkgM: getNumberFrom(rr, 'pkgM'),
          pkgL: getNumberFrom(rr, 'pkgL'),
          pkgBagSmall: getNumberFrom(rr, 'pkgBagSmall'),
          pkgBagMedium: getNumberFrom(rr, 'pkgBagMedium'),
          pkgBagLarge: getNumberFrom(rr, 'pkgBagLarge'),
          pkgOther: getNumberFrom(rr, 'pkgOther'),
          volS: getNumberFrom(rr, 'volS'),
          volM: getNumberFrom(rr, 'volM'),
          volL: getNumberFrom(rr, 'volL'),
          volBagSmall: getNumberFrom(rr, 'volBagSmall'),
          volBagMedium: getNumberFrom(rr, 'volBagMedium'),
          volBagLarge: getNumberFrom(rr, 'volBagLarge'),
          volOther: getNumberFrom(rr, 'volOther'),
          // Thêm các cột địa điểm
          address: getStringFrom(rr, 'address'),
          ward: getStringFrom(rr, 'ward'),
          district: getStringFrom(rr, 'district'),
          province: getStringFrom(rr, 'province'),
        }));
        setTransfers(mapped);
      }
    } catch {
      // ignore
    }
    setReportOpen(false);
    setReportTransfer(null);
  };

  const handleLocationSubmit = async () => {
    if (!reportTransfer) return;

    const pkgS = reportCounts['S'] || 0;
    const pkgM = reportCounts['M'] || 0;
    const pkgL = reportCounts['L'] || 0;
    const pkgBagSmall = reportCounts['BAG_S'] || 0;
    const pkgBagMedium = reportCounts['BAG_M'] || 0;
    const pkgBagLarge = reportCounts['BAG_L'] || 0;
    const pkgOther = reportCounts['OTHER'] || 0;

    const getUnit = (id: string) => volumeRules.find((r) => r.id === id)?.unitVolume || 0;
    const volS = pkgS * getUnit('S');
    const volM = pkgM * getUnit('M');
    const volL = pkgL * getUnit('L');
    const volBagSmall = pkgBagSmall * getUnit('BAG_S');
    const volBagMedium = pkgBagMedium * getUnit('BAG_M');
    const volBagLarge = pkgBagLarge * getUnit('BAG_L');
    const volOther = pkgOther * getUnit('OTHER');

    const next = {
      ...reportTransfer,
      pkgS,
      pkgM,
      pkgL,
      pkgBagSmall,
      pkgBagMedium,
      pkgBagLarge,
      pkgOther,
      volS: roundTo(volS, 3),
      volM: roundTo(volM, 3),
      volL: roundTo(volL, 3),
      volBagSmall: roundTo(volBagSmall, 3),
      volBagMedium: roundTo(volBagMedium, 3),
      volBagLarge: roundTo(volBagLarge, 3),
      volOther: roundTo(volOther, 3),
      state: 'Xuất chuyển kho',
      transportStatus: 'Chờ chuyển giao',
      // Sử dụng thông tin từ dialog vào các cột riêng biệt
      // Giữ nguyên dest, chỉ điền vào các cột địa điểm riêng biệt
      address: locationData.address,
      ward: locationData.ward,
      district: locationData.district,
      province: locationData.province,
    } as Transfer;

    try {
      const updateId = next.transfer_id || (next as any).id;
      const res = await fetch(
        `/api/transfers/${encodeURIComponent(updateId)}?spreadsheetId=${encodeURIComponent(SHEET_ID)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...next,
            totalPackages: pkgS + pkgM + pkgL + pkgBagSmall + pkgBagMedium + pkgBagLarge + pkgOther,
            totalVolume: volS + volM + volL + volBagSmall + volBagMedium + volBagLarge + volOther,
          }),
        }
      );
      if (!res.ok) throw new Error('update failed');

      // update local list
      setTransfers((prev) => prev.map((t) => (t.transfer_id === updateId ? next : t)));

      setSnackbar({
        open: true,
        message: 'Đã báo kiện và cập nhật thông tin địa điểm',
        severity: 'success',
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Cập nhật Sheet thất bại',
        severity: 'error',
      });
    }

    setLocationDialogOpen(false);
    setReportOpen(false);
    setReportTransfer(null);
  };

  const handleLocationChange = (field: keyof Location, value: string) => {
    setLocationData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openGridViewForSelected = () => {
    if (selected.length === 0) return;
    const t = transfers.find((x) => x.transfer_id === selected[0]);
    if (t) {
      setGridTransfer(t);
      setGridIndex(0);
      setGridOpen(true);
    }
  };

  const navigateGrid = (direction: 'prev' | 'next') => {
    if (gridIndex < 0) return;
    const newIndex = direction === 'prev' ? gridIndex - 1 : gridIndex + 1;
    if (newIndex < 0 || newIndex >= selected.length) return;
    const t = transfers.find((x) => x.transfer_id === selected[newIndex]);
    if (t) {
      setGridTransfer(t);
      setGridIndex(newIndex);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');

        const newTransfers: Transfer[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            // Parse CSV line properly, handling quoted values
            const line = lines[i];
            const values: string[] = [];
            let current = '';
            let inQuotes = false;

            for (let j = 0; j < line.length; j++) {
              const char = line[j];
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            values.push(current.trim()); // Add the last value

            // CSV có 13 cột theo format thực tế: "", "Mã đơn hàng", "Có vali", "Thời gian", "Kho nguồn", "Kho đích", "Số lượng SP", "Trạng thái", "Ghi chú", "ID Kho đích", "ID phiếu CK", "ID Kho nguồn", "Nhân viên"

            // Debug: Log the parsed values
            debugTransferList('Import row debug', {
              row: i,
              values,
              valuesLength: values.length,
              quantityRaw: values[6],
              quantity: parseInt(values[6] as string),
            });

            const clean = (v: string | undefined) => (v ?? '').trim().replace(/^"|"$/g, '');

            const transfer: Transfer = {
              transfer_id: clean(values[10]) || `import-${i}`, // ID phiếu CK (cột 11) - SỬ DỤNG ID THỰC
              orderCode: clean(values[1]) || '', // Mã đơn hàng (cột 2)
              hasVali: normalizeHasVali(clean(values[2]) || ''), // Có vali (cột 3)
              date: clean(values[3]) || '', // Thời gian (cột 4)
              source: clean(values[4]) || '', // Kho nguồn (cột 5)
              dest: clean(values[5]) || '', // Kho đích (cột 6)
              quantity: parseInt(clean(values[6]) || '0', 10) || 0, // Số lượng SP (cột 7)
              state: clean(values[7]) || '', // Trạng thái (cột 8)
              transportStatus: 'Chờ báo kiện', // Mặc định
              note: clean(values[8]) || '', // Ghi chú (cột 9)
              // Mặc định các cột package và volume = 0
              pkgS: 0,
              pkgM: 0,
              pkgL: 0,
              pkgBagSmall: 0,
              pkgBagMedium: 0,
              pkgBagLarge: 0,
              pkgOther: 0,
              volS: 0,
              volM: 0,
              volL: 0,
              volBagSmall: 0,
              volBagMedium: 0,
              volBagLarge: 0,
              volOther: 0,
              dest_id: clean(values[9]) || '', // ID Kho đích (cột 10)
              source_id: clean(values[11]) || '', // ID Kho nguồn (cột 12)
              employee: clean(values[12]) || '', // Nhân viên (cột 13)
              // Thêm các cột địa điểm (mặc định trống)
              address: '',
              ward: '',
              district: '',
              province: '',
            };
            newTransfers.push(transfer);
          }
        }

        // Gửi lên server để ghi vào Google Sheets và chống trùng theo id
        try {
          const SHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
          const res = await fetch(
            `/api/transfers/import?spreadsheetId=${encodeURIComponent(SHEET_ID)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rows: newTransfers }),
            }
          );
          if (!res.ok) throw new Error('Import API failed');
          const result = await res.json();

          // Reload danh sách từ sheet sau import bằng fetchTransfers
          debugTransferList('Reloading data from sheet after import');
          await fetchTransfers();

          setSnackbar({
            open: true,
            message: `Import: thành công ${result.imported}, trùng ${result.duplicated} / tổng ${result.total}`,
            severity: 'success',
          });
        } catch (err) {
          logTransferError('Import to sheet error', err);
          // Không set dữ liệu giả khi import fail
          setSnackbar({
            open: true,
            message: `Import thất bại: ${err}`,
            severity: 'error',
          });
        }
      } catch {
        setSnackbar({
          open: true,
          message: 'Lỗi khi import file CSV',
          severity: 'error',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const csvContent = [
      'id,orderCode,hasVali,date,source,dest,quantity,state,transportStatus,note,pkgS,pkgM,pkgL,pkgBagSmall,pkgBagMedium,pkgBagLarge,pkgOther,totalPackages,volS,volM,volL,volBagSmall,volBagMedium,volBagLarge,volOther,totalVolume,dest_id,transfer_id,source_id,employee',
      // Template trống - không có dữ liệu mẫu
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transfer-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filtered and paginated data
  const filteredTransfers = useMemo(() => {
    return transfers.filter((transfer) => {
      const matchesSearch =
        transfer.orderCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        transfer.note.toLowerCase().includes(filters.search.toLowerCase()) ||
        transfer.employee.toLowerCase().includes(filters.search.toLowerCase()) ||
        transfer.hasVali.toLowerCase().includes(filters.search.toLowerCase());

      const matchesHasVali = !filters.hasVali || transfer.hasVali === filters.hasVali;
      const matchesStatus = !filters.status || transfer.state === filters.status;
      const matchesSource = !filters.source || transfer.source === filters.source;
      const matchesDest = !filters.dest || transfer.dest === filters.dest;
      const matchesTransportStatus =
        !filters.transportStatus || transfer.transportStatus === filters.transportStatus;

      const transferDate = new Date(transfer.date.split('/').reverse().join('-'));
      const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

      const matchesDateFrom = !fromDate || transferDate >= fromDate;
      const matchesDateTo = !toDate || transferDate <= toDate;

      return (
        matchesSearch &&
        matchesHasVali &&
        matchesStatus &&
        matchesTransportStatus &&
        matchesSource &&
        matchesDest &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [transfers, filters]);

  // Get unique values for filter options
  const uniqueStatuses = useMemo(() => [...new Set(transfers.map((t) => t.state))], [transfers]);
  const uniqueTransportStatuses = useMemo(
    () => [...new Set(transfers.map((t) => t.transportStatus || ''))].filter(Boolean),
    [transfers]
  );
  const uniqueSources = useMemo(() => [...new Set(transfers.map((t) => t.source))], [transfers]);
  const uniqueDests = useMemo(() => [...new Set(transfers.map((t) => t.dest))], [transfers]);

  // Selection handlers
  // Selection handled by DataTable

  // Filter handlers
  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      hasVali: '',
      status: '',
      transportStatus: '',
      source: '',
      dest: '',
      dateFrom: '',
      dateTo: '',
    });
  };

  // Date filter functions
  const handleDateFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setDateFilterAnchor(event.currentTarget);
  };

  const handleDateFilterClose = () => {
    setDateFilterAnchor(null);
    setShowCustomDateRange(false);
  };

  const applyDatePreset = (preset: string) => {
    const today = new Date();
    let dateFrom = '';
    let dateTo = '';

    switch (preset) {
      case 'today':
        dateFrom = today.toISOString().split('T')[0];
        dateTo = today.toISOString().split('T')[0];
        break;
      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        dateFrom = yesterday.toISOString().split('T')[0];
        dateTo = yesterday.toISOString().split('T')[0];
        break;
      }
      case 'thisWeek': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
        dateFrom = startOfWeek.toISOString().split('T')[0];
        dateTo = endOfWeek.toISOString().split('T')[0];
        break;
      }
      case 'lastWeek': {
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
        dateFrom = lastWeekStart.toISOString().split('T')[0];
        dateTo = lastWeekEnd.toISOString().split('T')[0];
        break;
      }
      case 'thisMonth': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        dateFrom = startOfMonth.toISOString().split('T')[0];
        dateTo = endOfMonth.toISOString().split('T')[0];
        break;
      }
      case 'lastMonth': {
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        dateFrom = lastMonthStart.toISOString().split('T')[0];
        dateTo = lastMonthEnd.toISOString().split('T')[0];
        break;
      }
      case 'clear':
        dateFrom = '';
        dateTo = '';
        break;
    }

    setFilters((prev) => ({
      ...prev,
      dateFrom,
      dateTo,
    }));
    setShowCustomDateRange(false);
    handleDateFilterClose();
  };

  const getDateFilterLabel = () => {
    if (!filters.dateFrom && !filters.dateTo) return 'Chọn ngày';
    if (filters.dateFrom === filters.dateTo) {
      return new Date(filters.dateFrom).toLocaleDateString('vi-VN');
    }
    return `${new Date(filters.dateFrom).toLocaleDateString('vi-VN')} - ${new Date(filters.dateTo).toLocaleDateString('vi-VN')}`;
  };

  // Pagination handled by DataTable

  // Calculate statistics from transfers data
  const calculateStats = useCallback((transfers: Transfer[]) => {
    const stats = {
      pendingReport: 0,
      pendingTransfer: 0,
      inTransfer: 0,
      completed: 0,
      totalProducts: 0,
      totalPackages: 0,
      totalVolume: 0,
      // Chờ báo kiện details
      pendingReportWithLuggage: 0,
      pendingReportWithoutLuggage: 0,
      pendingReportProductsWithLuggage: 0,
      pendingReportProductsWithoutLuggage: 0,
      // Chờ chuyển giao details
      pendingTransferDeliveryPoints: 0,
      pendingTransferPackages: 0,
      pendingTransferVolume: 0,
    };

    // Track unique delivery addresses for pending transfers
    const pendingTransferAddresses = new Set();

    transfers.forEach((transfer) => {
      // Lấy riêng hai nguồn trạng thái để đếm chính xác
      const stateStatus = (transfer.state || '').trim();
      const transportStatus = (transfer.transportStatus || '').trim();

      // Ưu tiên đếm "Đang chuyển giao" theo TT vận chuyển; các nhóm khác theo state
      let bucket: 'pendingReport' | 'pendingTransfer' | 'inTransfer' | 'completed' =
        'pendingReport';
      if (
        transportStatus === 'Đang chuyển giao' ||
        stateStatus === 'Đang chuyển giao' ||
        stateStatus === 'Đang chuyển kho'
      ) {
        bucket = 'inTransfer';
      } else if (
        stateStatus === 'Đã chuyển giao' ||
        stateStatus === 'Hoàn thành' ||
        stateStatus === 'Đã hoàn thành' ||
        transportStatus === 'Đã chuyển giao' ||
        transportStatus === 'Hoàn thành' ||
        transportStatus === 'Đã hoàn thành'
      ) {
        bucket = 'completed';
      } else if (
        stateStatus === 'Chờ chuyển giao' ||
        stateStatus === 'Xuất chuyển kho' ||
        transportStatus === 'Chờ chuyển giao'
      ) {
        bucket = 'pendingTransfer';
      } else {
        bucket = 'pendingReport';
      }

      if (bucket === 'pendingReport') {
        stats.pendingReport++;
        const hasLuggage =
          (Number(transfer.pkgS) || 0) +
            (Number(transfer.pkgM) || 0) +
            (Number(transfer.pkgL) || 0) +
            (Number(transfer.pkgBagSmall) || 0) +
            (Number(transfer.pkgBagMedium) || 0) +
            (Number(transfer.pkgBagLarge) || 0) +
            (Number(transfer.pkgOther) || 0) >
          0;
        if (hasLuggage) {
          stats.pendingReportWithLuggage++;
          stats.pendingReportProductsWithLuggage += Number(transfer.quantity) || 0;
        } else {
          stats.pendingReportWithoutLuggage++;
          stats.pendingReportProductsWithoutLuggage += Number(transfer.quantity) || 0;
        }
      } else if (bucket === 'pendingTransfer') {
        stats.pendingTransfer++;
        const deliveryAddress =
          `${transfer.address || ''} ${transfer.ward || ''} ${transfer.district || ''} ${transfer.province || ''}`.trim();
        if (deliveryAddress) {
          pendingTransferAddresses.add(deliveryAddress);
        }
      } else if (bucket === 'inTransfer') {
        stats.inTransfer++;
      } else if (bucket === 'completed') {
        stats.completed++;
      } else {
        stats.pendingReport++;
      }

      // Calculate totals
      stats.totalProducts += Number(transfer.quantity) || 0;

      // Calculate total packages
      const packages =
        (Number(transfer.pkgS) || 0) +
        (Number(transfer.pkgM) || 0) +
        (Number(transfer.pkgL) || 0) +
        (Number(transfer.pkgBagSmall) || 0) +
        (Number(transfer.pkgBagMedium) || 0) +
        (Number(transfer.pkgBagLarge) || 0) +
        (Number(transfer.pkgOther) || 0);
      stats.totalPackages += packages;

      // Calculate total volume
      const volume =
        (Number(transfer.volS) || 0) +
        (Number(transfer.volM) || 0) +
        (Number(transfer.volL) || 0) +
        (Number(transfer.volBagSmall) || 0) +
        (Number(transfer.volBagMedium) || 0) +
        (Number(transfer.volBagLarge) || 0) +
        (Number(transfer.volOther) || 0);
      stats.totalVolume += volume;

      // Calculate pending transfer specific totals
      if (
        stateStatus === 'Chờ chuyển giao' ||
        stateStatus === 'Xuất chuyển kho' ||
        transportStatus === 'Chờ chuyển giao'
      ) {
        stats.pendingTransferPackages += packages;
        stats.pendingTransferVolume += volume;
      }
    });

    // Set unique delivery points count
    stats.pendingTransferDeliveryPoints = pendingTransferAddresses.size;

    return stats;
  }, []);

  // Update fetchTransfers to calculate stats
  const fetchTransfers = useCallback(async () => {
    debugTransferList('fetchTransfers called');
    setLoading(true);
    try {
      const response = await fetch(
        '/api/transfers?spreadsheetId=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As'
      );
      if (response.ok) {
        const data = await response.json();
        if (process.env.NODE_ENV !== 'production') {
          debugTransferList('Data loaded from API', {
            length: Array.isArray(data) ? data.length : 0,
          });
        }

        // Map kiểu số cho các cột số
        const mapped: Transfer[] = (data as Array<Record<string, unknown>>).map((r) => {
          return {
            id: getStringFrom(r, 'id') || getStringFrom(r, 'transfer_id') || '',
            orderCode: getStringFrom(r, 'orderCode'),
            hasVali: normalizeHasVali(getStringFrom(r, 'hasVali')),
            date: getStringFrom(r, 'date'),
            source: getStringFrom(r, 'source'),
            dest: getStringFrom(r, 'dest'),
            quantity: getNumberFrom(r, 'quantity'),
            state: getStringFrom(r, 'state'),
            note: getStringFrom(r, 'note'),
            dest_id: getStringFrom(r, 'dest_id'),
            transfer_id: getStringFrom(r, 'transfer_id') || getStringFrom(r, 'id') || '',
            source_id: getStringFrom(r, 'source_id'),
            employee: getStringFrom(r, 'employee'),
            transportStatus: getStringFrom(r, 'transportStatus') || 'Chờ báo kiện',
            pkgS: getNumberFrom(r, 'pkgS'),
            pkgM: getNumberFrom(r, 'pkgM'),
            pkgL: getNumberFrom(r, 'pkgL'),
            pkgBagSmall: getNumberFrom(r, 'pkgBagSmall'),
            pkgBagMedium: getNumberFrom(r, 'pkgBagMedium'),
            pkgBagLarge: getNumberFrom(r, 'pkgBagLarge'),
            pkgOther: getNumberFrom(r, 'pkgOther'),
            volS: getNumberFrom(r, 'volS'),
            volM: getNumberFrom(r, 'volM'),
            volL: getNumberFrom(r, 'volL'),
            volBagSmall: getNumberFrom(r, 'volBagSmall'),
            volBagMedium: getNumberFrom(r, 'volBagMedium'),
            volBagLarge: getNumberFrom(r, 'volBagLarge'),
            volOther: getNumberFrom(r, 'volOther'),
            // Thêm các cột địa điểm
            address: getStringFrom(r, 'address'),
            ward: getStringFrom(r, 'ward'),
            district: getStringFrom(r, 'district'),
            province: getStringFrom(r, 'province'),
          };
        });

        debugTransferList('Mapped transfers', { count: mapped.length });
        setTransfers(mapped);
        setStats(calculateStats(mapped));
      }
    } catch (error) {
      logTransferError('Error fetching transfers', error);
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  // Load data on component mount
  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  // Refresh handler
  const handleRefresh = () => {
    fetchTransfers();
  };

  return (
    <Box
      sx={{
        maxWidth: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 0.5, sm: 1 },
        overflow: 'auto',
        p: { xs: 1, sm: 1.5, md: 2 },
        backgroundColor: 'transparent',
      }}
    >
      {/* Statistics Cards - Centered Fixed Height */}
      <Box
        sx={{
          height: { xs: '100px', sm: '120px', md: '140px' },
          flexShrink: 0,
          mb: { xs: 0.5, sm: 1 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Grid
          container
          spacing={{ xs: 1, sm: 1.5, md: 2 }}
          sx={{
            height: '100%',
            maxWidth: sidebarOpen ? '1200px' : '1400px',
            mx: 'auto',
            '& .MuiGrid-item': {
              height: '100%',
              display: 'flex',
            },
            '& .MuiCard-root': {
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 'unset',
            },
            '& .MuiCardContent-root': {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              p: { xs: 1, sm: 1.5 },
            },
          }}
        >
          {/* Card 1: Chờ báo kiện */}
          <Grid item xs={6} sm={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid #e9ecef',
                borderRadius: 3,
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #fff3e0 100%)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #f57c00, #ff9800)',
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="flex-start" sx={{ height: '100%' }}>
                  <PendingIcon
                    sx={{
                      color: '#f57c00',
                      fontSize: { xs: 24, sm: 28, md: 32 },
                      mr: { xs: 0.75, sm: 1 },
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  />
                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                    }}
                  >
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      Chờ báo kiện
                    </Typography>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        fontSize: {
                          xs: '1.25rem',
                          sm: '1.5rem',
                          md: '1.75rem',
                        },
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {stats.pendingReport}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                        sx={{
                          fontSize: { xs: '0.6rem', sm: '0.7rem' },
                          lineHeight: 1.2,
                          mb: 0.25,
                        }}
                      >
                        Có vali: {stats.pendingReportWithLuggage} | Không vali:{' '}
                        {stats.pendingReportWithoutLuggage}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                        sx={{
                          fontSize: { xs: '0.6rem', sm: '0.7rem' },
                          lineHeight: 1.2,
                        }}
                      >
                        SP có vali: {stats.pendingReportProductsWithLuggage.toLocaleString()} | SP
                        không vali: {stats.pendingReportProductsWithoutLuggage.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: Chờ chuyển giao */}
          <Grid item xs={6} sm={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid #e9ecef',
                borderRadius: 3,
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e8f5e8 100%)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #388e3c, #4caf50)',
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="flex-start" sx={{ height: '100%' }}>
                  <ScheduleIcon
                    sx={{
                      color: '#388e3c',
                      fontSize: { xs: 24, sm: 28, md: 32 },
                      mr: { xs: 0.75, sm: 1 },
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  />
                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                    }}
                  >
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      Chờ chuyển giao
                    </Typography>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        fontSize: {
                          xs: '1.25rem',
                          sm: '1.5rem',
                          md: '1.75rem',
                        },
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {stats.pendingTransfer}
                    </Typography>
                    <Box sx={{ mt: 'auto' }}>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                        sx={{
                          fontSize: { xs: '0.6rem', sm: '0.7rem' },
                          lineHeight: 1.2,
                          mb: 0.25,
                        }}
                      >
                        Điểm giao: {stats.pendingTransferDeliveryPoints} | Kiện:{' '}
                        {stats.pendingTransferPackages.toLocaleString()}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        display="block"
                        sx={{
                          fontSize: { xs: '0.6rem', sm: '0.7rem' },
                          lineHeight: 1.2,
                        }}
                      >
                        Khối:{' '}
                        {Number(stats.pendingTransferVolume).toLocaleString('vi-VN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        m³
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 3: Đang chuyển giao */}
          <Grid item xs={6} sm={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid #e9ecef',
                borderRadius: 3,
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #1976d2, #2196f3)',
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="flex-start" sx={{ height: '100%' }}>
                  <ShippingIcon
                    sx={{
                      color: '#1976d2',
                      fontSize: { xs: 24, sm: 28, md: 32 },
                      mr: { xs: 0.75, sm: 1 },
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  />
                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                    }}
                  >
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      Đang chuyển giao
                    </Typography>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        fontSize: {
                          xs: '1.25rem',
                          sm: '1.5rem',
                          md: '1.75rem',
                        },
                        fontWeight: 600,
                      }}
                    >
                      {stats.inTransfer}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 4: Đã chuyển giao */}
          <Grid item xs={6} sm={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid #e9ecef',
                borderRadius: 3,
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f3e5f5 100%)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #7b1fa2, #9c27b0)',
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="flex-start" sx={{ height: '100%' }}>
                  <CheckCircleIcon
                    sx={{
                      color: '#7b1fa2',
                      fontSize: { xs: 24, sm: 28, md: 32 },
                      mr: { xs: 0.75, sm: 1 },
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  />
                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                    }}
                  >
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      Đã chuyển giao
                    </Typography>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{
                        fontSize: {
                          xs: '1.25rem',
                          sm: '1.5rem',
                          md: '1.75rem',
                        },
                        fontWeight: 600,
                      }}
                    >
                      {stats.completed}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Header actions - Left aligned */}
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        mb={{ xs: 0.25, sm: 0.5 }}
        flexWrap="wrap"
        gap={1}
        sx={{
          minHeight: { xs: '36px', sm: '40px' },
          maxWidth: sidebarOpen ? '1200px' : '1400px',
          mx: 'auto',
          width: '100%',
          px: { xs: 0.75, sm: 1, md: 1.5 },
        }}
      >
        {/* Actions */}
        <Box display="flex" gap={{ xs: 0.5, sm: 1 }} flexWrap="wrap" justifyContent="flex-start">
          <ActionButton
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<ActionIcons name="filter" />}
            size="small"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 },
            }}
          >
            {showFilters ? 'Ẩn lọc' : 'Lọc'}
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={() => setOpen(true)}
            startIcon={<ActionIcons name="add" />}
            size="small"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              px: { xs: 1, sm: 2 },
            }}
          >
            Thêm phiếu
          </ActionButton>
        </Box>
      </Box>

      {/* Filter Section - Professional Design */}
      {showFilters && (
        <Paper
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: { xs: 1, sm: 1.5 },
            backgroundColor: 'white',
            border: '1px solid',
            borderColor: 'grey.200',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            maxWidth: sidebarOpen ? '1200px' : '1400px',
            mx: 'auto',
            width: '100%',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          {/* Filter Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              pb: 1,
              borderBottom: '1px solid',
              borderColor: 'grey.100',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon
                sx={{
                  color: 'primary.main',
                  fontSize: '1.2rem',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                Bộ lọc nâng cao
              </Typography>
            </Box>
            <ActionButton
              variant="secondary"
              onClick={() => clearFilters()}
              size="small"
              sx={{
                fontSize: '0.75rem',
                color: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.50',
                },
              }}
            >
              Xóa tất cả
            </ActionButton>
          </Box>

          {/* Filter Grid - Single Row */}
          <Grid container spacing={1} sx={{ width: '100%' }}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Tìm kiếm"
                placeholder="Mã phiếu, sản phẩm, nhân viên..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'white',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'grey.50',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'primary.50',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                      },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: { xs: '0.5rem', sm: '0.55rem' },
                    '&.Mui-focused': {
                      color: 'primary.main',
                      fontWeight: 600,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: { xs: '0.55rem', sm: '0.6rem' },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Có vali</InputLabel>
                <Select
                  value={filters.hasVali || ''}
                  label="Có vali"
                  onChange={(e) => handleFilterChange('hasVali', e.target.value)}
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.55rem', sm: '0.6rem' },
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'grey.50',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'primary.50',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                          borderWidth: 2,
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: { xs: '0.65rem', sm: '0.7rem' },
                      '&.Mui-focused': {
                        color: 'primary.main',
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}>
                    Tất cả
                  </MenuItem>
                  <MenuItem value="Có vali" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}>
                    Có vali
                  </MenuItem>
                  <MenuItem value="Không vali" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}>
                    Không vali
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status}
                  label="Trạng thái"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.55rem', sm: '0.6rem' },
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'grey.50',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'primary.50',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                          borderWidth: 2,
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: { xs: '0.5rem', sm: '0.55rem' },
                      '&.Mui-focused': {
                        color: 'primary.main',
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}>
                    Tất cả
                  </MenuItem>
                  {uniqueStatuses.map((status) => (
                    <MenuItem
                      key={status}
                      value={status}
                      sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}
                    >
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>TT vận chuyển</InputLabel>
                <Select
                  value={filters.transportStatus}
                  label="TT vận chuyển"
                  onChange={(e) => handleFilterChange('transportStatus', e.target.value)}
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.55rem', sm: '0.6rem' },
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { backgroundColor: 'grey.50' },
                      '&.Mui-focused': {
                        backgroundColor: 'primary.50',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                          borderWidth: 2,
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: { xs: '0.65rem', sm: '0.7rem' },
                      '&.Mui-focused': {
                        color: 'primary.main',
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}>
                    Tất cả
                  </MenuItem>
                  {uniqueTransportStatuses.map((status) => (
                    <MenuItem
                      key={status}
                      value={status}
                      sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}
                    >
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Kho nguồn</InputLabel>
                <Select
                  value={filters.source}
                  label="Kho nguồn"
                  onChange={(e) => handleFilterChange('source', e.target.value)}
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.55rem', sm: '0.6rem' },
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'grey.50',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'primary.50',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                          borderWidth: 2,
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: { xs: '0.5rem', sm: '0.55rem' },
                      '&.Mui-focused': {
                        color: 'primary.main',
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}>
                    Tất cả
                  </MenuItem>
                  {uniqueSources.map((source) => (
                    <MenuItem
                      key={source}
                      value={source}
                      sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}
                    >
                      {source}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Kho đích</InputLabel>
                <Select
                  value={filters.dest}
                  label="Kho đích"
                  onChange={(e) => handleFilterChange('dest', e.target.value)}
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: { xs: '0.55rem', sm: '0.6rem' },
                    },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'white',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'grey.50',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'primary.50',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                          borderWidth: 2,
                        },
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: { xs: '0.5rem', sm: '0.55rem' },
                      '&.Mui-focused': {
                        color: 'primary.main',
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  <MenuItem value="" sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}>
                    Tất cả
                  </MenuItem>
                  {uniqueDests.map((dest) => (
                    <MenuItem
                      key={dest}
                      value={dest}
                      sx={{ fontSize: { xs: '0.55rem', sm: '0.6rem' } }}
                    >
                      {dest}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <ActionButton
                fullWidth
                variant="secondary"
                size="small"
                onClick={handleDateFilterClick}
                startIcon={<Icon name="calendar" />}
                endIcon={<Icon name="expand" />}
                sx={{
                  borderRadius: 2,
                  backgroundColor: 'white',
                  borderColor: filters.dateFrom || filters.dateTo ? 'primary.main' : '#e0e0e0',
                  color: filters.dateFrom || filters.dateTo ? 'primary.main' : 'text.secondary',
                  fontWeight: 500,
                  textTransform: 'none',
                  justifyContent: 'space-between',
                  px: 2,
                  fontSize: { xs: '0.55rem', sm: '0.6rem' },
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.50',
                  },
                }}
              >
                {getDateFilterLabel()}
              </ActionButton>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <ActionButton
                fullWidth
                variant="error"
                size="small"
                onClick={clearFilters}
                startIcon={<ActionIcons.Clear />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderWidth: 2,
                  px: 1,
                  minWidth: 'auto',
                  fontSize: { xs: '0.55rem', sm: '0.6rem' },
                  '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'error.50',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Xóa
              </ActionButton>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Date Filter Popover */}
      <Popover
        open={Boolean(dateFilterAnchor)}
        anchorEl={dateFilterAnchor}
        onClose={handleDateFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            minWidth: 250,
          },
        }}
      >
        <List sx={{ py: 0 }}>
          <ListItem sx={{ py: 1 }}>
            <Typography variant="subtitle2" color="primary">
              Chọn khoảng thời gian
            </Typography>
          </ListItem>
          <Divider />
          <ListItemButton onClick={() => applyDatePreset('today')} sx={{ py: 1.5 }}>
            <ListItemText primary="Hôm nay" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
          <ListItemButton onClick={() => applyDatePreset('yesterday')} sx={{ py: 1.5 }}>
            <ListItemText primary="Hôm qua" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
          <ListItemButton onClick={() => applyDatePreset('thisWeek')} sx={{ py: 1.5 }}>
            <ListItemText primary="Tuần này" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
          <ListItemButton onClick={() => applyDatePreset('lastWeek')} sx={{ py: 1.5 }}>
            <ListItemText primary="Tuần trước" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
          <ListItemButton onClick={() => applyDatePreset('thisMonth')} sx={{ py: 1.5 }}>
            <ListItemText primary="Tháng này" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
          <ListItemButton onClick={() => applyDatePreset('lastMonth')} sx={{ py: 1.5 }}>
            <ListItemText primary="Tháng trước" primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
          <Divider />
          <ListItemButton
            onClick={() => setShowCustomDateRange(!showCustomDateRange)}
            sx={{ py: 1.5 }}
          >
            <ListItemText
              primary="Khoảng thời gian"
              primaryTypographyProps={{ fontSize: '0.9rem' }}
            />
          </ListItemButton>
          {showCustomDateRange && (
            <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Từ ngày"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        backgroundColor: 'white',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Đến ngày"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        backgroundColor: 'white',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          <Divider />
          <ListItemButton onClick={() => applyDatePreset('clear')} sx={{ py: 1.5 }}>
            <ListItemText
              primary="Xóa bộ lọc ngày"
              primaryTypographyProps={{
                fontSize: '0.9rem',
                color: 'error.main',
              }}
            />
          </ListItemButton>
        </List>
      </Popover>

      {/* Action Toolbar */}
      <Toolbar
        sx={{
          pl: { sm: 1.5 },
          pr: { xs: 1, sm: 1 },
          mb: 1.5,
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            {transfers.length === 0
              ? 'Chưa có dữ liệu phiếu chuyển kho'
              : `Hiển thị ${filteredTransfers.length} / ${transfers.length} phiếu chuyển kho`}
            {selected.length > 0 && ` (${selected.length} đã chọn)`}
          </Typography>
        </Box>
        <Tooltip title="In soạn hàng (nhiều phiếu)">
          <span>
            <IconButton
              onClick={handlePrintMultipleTransfers}
              color="success"
              disabled={selected.length === 0}
            >
              <PrintIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="In phiếu (nhiều phiếu)">
          <span>
            <IconButton
              onClick={handlePrintMultiplePicking}
              color="primary"
              disabled={selected.length === 0}
            >
              <PrintIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Gridview (nhiều phiếu)">
          <span>
            <IconButton
              onClick={openGridViewForSelected}
              disabled={selected.length === 0}
              color="default"
            >
              <GridViewIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Tải template CSV">
          <IconButton onClick={handleDownloadTemplate} color="primary">
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Import CSV">
          <IconButton onClick={handleImportCSV} color="primary">
            <UploadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Làm mới">
          <span>
            <IconButton onClick={handleRefresh} disabled={loading} color="primary">
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Toolbar>

      <input
        type="file"
        ref={fileInputRef}
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        aria-label="Import CSV"
      />

      {/* DataTable Section - Full Height with Scroll */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'visible',
          position: 'relative',
          maxWidth: sidebarOpen ? '1200px' : '1400px',
          mx: 'auto',
          backgroundColor: 'transparent',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'transparent',
            minHeight: 0,
          }}
        >
          <DataTable
            title={`Danh sách phiếu chuyển kho (${filteredTransfers.length})`}
            columns={[
              {
                id: 'orderCode',
                label: 'MÃ PHIẾU',
                width: 150,
                render: (row: Transfer) => {
                  if (!row) return <Typography>—</Typography>;
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Avatar
                        sx={{
                          width: { xs: 24, sm: 28 },
                          height: { xs: 24, sm: 28 },
                          bgcolor: 'primary.main',
                          borderColor: 'primary.main',
                          fontSize: { xs: '0.65rem', sm: '0.7rem' },
                          fontWeight: 600,
                        }}
                      >
                        {row.orderCode ? row.orderCode[0] : 'T'}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            color: 'text.primary',
                            letterSpacing: '0.3px',
                            cursor: 'pointer',
                            '&:hover': {
                              color: 'primary.main',
                            },
                          }}
                          onClick={() => openGridView(row)}
                        >
                          {row.orderCode || '—'}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: { xs: '0.55rem', sm: '0.6rem' },
                            fontWeight: 500,
                          }}
                        >
                          ID: {row.transfer_id || '—'}
                        </Typography>
                      </Box>
                    </Box>
                  );
                },
              },
              {
                id: 'hasVali',
                label: 'CÓ VALI',
                width: 80,
                align: 'center',
                render: (row: Transfer) => {
                  if (!row) return <Typography>—</Typography>;
                  return (
                    <Typography
                      sx={{
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        fontWeight: 500,
                        color: row.hasVali === 'Có vali' ? 'success.main' : 'error.main',
                        backgroundColor: row.hasVali === 'Có vali' ? 'success.50' : 'error.50',
                        border: '1px solid',
                        borderColor: row.hasVali === 'Có vali' ? 'success.main' : 'error.main',
                        borderRadius: 1,
                        px: 0.5,
                        py: 0.25,
                        textAlign: 'center',
                        display: 'inline-block',
                        minWidth: 'fit-content',
                      }}
                    >
                      {row.hasVali === 'Có vali' ? 'Có vali' : 'Không vali'}
                    </Typography>
                  );
                },
              },
              {
                id: 'date',
                label: 'THỜI GIAN',
                width: 80,
                align: 'center',
                render: (row: Transfer) => {
                  if (!row) return <Typography>—</Typography>;
                  return (
                    <Typography
                      sx={{
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      {row.date || '—'}
                    </Typography>
                  );
                },
              },
              {
                id: 'source',
                label: 'KHO NGUỒN',
                width: 130,
                render: (row: Transfer) => {
                  if (!row) return <Typography>—</Typography>;
                  return (
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                        {row.source?.split(' - ')[0] || row.source || '—'}
                      </Typography>
                      {row.source?.includes(' - ') && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: '0.55rem' }}
                        >
                          {row.source.split(' - ').slice(1).join(' - ')}
                        </Typography>
                      )}
                    </Box>
                  );
                },
              },
              {
                id: 'dest',
                label: 'KHO ĐÍCH',
                width: 130,
                render: (row: Transfer) => {
                  if (!row) return <Typography>—</Typography>;
                  return (
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                        {row.dest?.split(' - ')[0] || row.dest || '—'}
                      </Typography>
                      {row.dest?.includes(' - ') && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: '0.55rem' }}
                        >
                          {row.dest.split(' - ').slice(1).join(' - ')}
                        </Typography>
                      )}
                    </Box>
                  );
                },
              },
              {
                id: 'quantity',
                label: 'SẢN PHẨM',
                width: 60,
                align: 'center',
                render: (row: Transfer) => {
                  if (!row) return <Typography>—</Typography>;
                  return (
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        color: (theme) =>
                          row.quantity > 0
                            ? theme.palette.success.main
                            : theme.palette.text.secondary,
                        backgroundColor: (theme) =>
                          row.quantity > 0
                            ? alpha(theme.palette.success.main, 0.08)
                            : 'transparent',
                        borderRadius: 1,
                        px: 0.4,
                        py: 0.2,
                      }}
                    >
                      {row.quantity || 0}
                    </Typography>
                  );
                },
              },
              {
                id: 'pkgS',
                label: 'KIỆN',
                width: 60,
                align: 'center',
                render: (row: Transfer) => {
                  if (!row) return <Typography>—</Typography>;
                  const pkg = [
                    'pkgS',
                    'pkgM',
                    'pkgL',
                    'pkgBagSmall',
                    'pkgBagMedium',
                    'pkgBagLarge',
                    'pkgOther',
                  ]
                    .map((k) => getNumberFrom(row as unknown as Record<string, unknown>, k))
                    .reduce((a, b) => a + b, 0);
                  const safePkg = Number.isFinite(pkg) ? pkg : 0;
                  return (
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        color: (theme) =>
                          safePkg > 0 ? theme.palette.primary.main : theme.palette.text.disabled,
                        backgroundColor: (theme) =>
                          safePkg > 0 ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                        borderRadius: 1,
                        px: 0.4,
                        py: 0.2,
                      }}
                    >
                      {safePkg === 0 ? '0' : safePkg.toLocaleString('vi-VN')}
                    </Typography>
                  );
                },
              },
              {
                id: 'volS',
                label: 'KHỐI (M³)',
                width: 60,
                align: 'right',
                render: (row: Transfer) => {
                  if (!row) return <Typography>—</Typography>;
                  const vol = [
                    'volS',
                    'volM',
                    'volL',
                    'volBagSmall',
                    'volBagMedium',
                    'volBagLarge',
                    'volOther',
                  ]
                    .map((k) => getNumberFrom(row as unknown as Record<string, unknown>, k))
                    .reduce((a, b) => a + b, 0);
                  const valid = Number.isFinite(vol) && vol <= 1000000;
                  const display =
                    !valid || vol === 0
                      ? '0,00'
                      : Number(vol).toLocaleString('vi-VN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        });
                  return (
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        color: (theme) =>
                          vol > 0 ? theme.palette.info.main : theme.palette.text.disabled,
                        backgroundColor: (theme) =>
                          vol > 0 ? alpha(theme.palette.info.main, 0.08) : 'transparent',
                        borderRadius: 1,
                        px: 0.5,
                        py: 0.25,
                      }}
                    >
                      {display}
                    </Typography>
                  );
                },
              },
              {
                id: 'state',
                label: 'TRẠNG THÁI',
                width: 110,
                align: 'center',
                render: (row: Transfer) => {
                  if (!row) return <Typography>—</Typography>;
                  const status = getStatusLabel(row.state);
                  const isWarning = status.includes('Xuất') || status.includes('Nhập');
                  const isSuccess = status.includes('Đã') || status.includes('Hoàn');
                  const isError = status.includes('Hủy');

                  let color = 'primary.main';
                  let bgColor = 'primary.50';

                  if (isWarning) {
                    color = 'warning.main';
                    bgColor = 'warning.50';
                  } else if (isSuccess) {
                    color = 'success.main';
                    bgColor = 'success.50';
                  } else if (isError) {
                    color = 'error.main';
                    bgColor = 'error.50';
                  }

                  return (
                    <Typography
                      sx={{
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        fontWeight: 500,
                        color: color,
                        backgroundColor: bgColor,
                        border: '1px solid',
                        borderColor: color,
                        borderRadius: 1,
                        px: 0.5,
                        py: 0.25,
                        textAlign: 'center',
                        display: 'inline-block',
                        minWidth: 'fit-content',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {status}
                    </Typography>
                  );
                },
              },
              {
                id: 'transportStatus',
                label: 'TT VẬN CHUYỂN',
                width: 110,
                align: 'center',
                render: (row: Transfer) => {
                  if (!row) return <Typography>—</Typography>;
                  const transportStatus = row.transportStatus || 'Chờ báo kiện';
                  const isPending = transportStatus.includes('Chờ');
                  const isInProgress = transportStatus.includes('Đang');
                  const isCompleted =
                    transportStatus.includes('Đã') || transportStatus.includes('Hoàn');

                  let color = 'primary.main';
                  let bgColor = 'primary.50';

                  if (isPending) {
                    color = 'warning.main';
                    bgColor = 'warning.50';
                  } else if (isInProgress) {
                    color = 'info.main';
                    bgColor = 'info.50';
                  } else if (isCompleted) {
                    color = 'success.main';
                    bgColor = 'success.50';
                  }

                  return (
                    <Typography
                      sx={{
                        fontSize: { xs: '0.65rem', sm: '0.7rem' },
                        fontWeight: 500,
                        color: color,
                        backgroundColor: bgColor,
                        border: '1px solid',
                        borderColor: color,
                        borderRadius: 1,
                        px: 0.5,
                        py: 0.25,
                        textAlign: 'center',
                        display: 'inline-block',
                        minWidth: 'fit-content',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {transportStatus}
                    </Typography>
                  );
                },
              },
              {
                id: 'transfer_id',
                label: 'Thao tác',
                align: 'center',
                width: 70,
                render: (row: Transfer) => {
                  if (!row) return <Typography>—</Typography>;
                  return (
                    <Box onClick={(e) => e.stopPropagation()}>
                      <Tooltip title="Thao tác">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionMenuOpen(e, row)}
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.light',
                              color: 'white',
                            },
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  );
                },
              },
            ]}
            data={filteredTransfers}
            selectable
            onSelectionChange={(ids) => setSelected(ids)}
            getRowId={(row: any) => row.transfer_id}
            rowsPerPageOptions={[5, 10, 25, 50]}
            defaultRowsPerPage={rowsPerPage}
            emptyMessage="Chưa có phiếu chuyển kho nào trong hệ thống"
          />
        </Box>
      </Box>
      {/* Toolbar Gridview button giữ nguyên, đã có ở action bar phía trên */}

      {/* Gridview Dialog */}
      <Dialog open={gridOpen} onClose={() => setGridOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Thông số chi tiết phiếu chuyển kho</Typography>
            {gridIndex >= 0 && (
              <StatusChip status="primary" label={`${gridIndex + 1}/${selected.length}`} />
            )}
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {gridTransfer && (
            <Box>
              <Grid container spacing={2}>
                {/* Thông tin chung */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, height: '100%' }} elevation={1}>
                    <Typography variant="subtitle1" gutterBottom fontWeight={600} color="primary">
                      📋 Thông tin chung
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Mã đơn hàng
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body1" fontWeight={600} color="primary">
                          {gridTransfer.orderCode || '—'}
                        </Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Thời gian
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2">{gridTransfer.date || '—'}</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Kho nguồn
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2">{gridTransfer.source || '—'}</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Kho đích
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2">{gridTransfer.dest || '—'}</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Trạng thái
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <StatusChip
                          status={getStatusLabel(gridTransfer.state).toLowerCase()}
                          label={getStatusLabel(gridTransfer.state)}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Vận chuyển
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <StatusChip
                          status={(gridTransfer.transportStatus || 'Chưa có').toLowerCase()}
                          label={gridTransfer.transportStatus || 'Chưa có'}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Nhân viên
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2">{gridTransfer.employee || '—'}</Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <Typography variant="body2" color="text.secondary">
                          Ghi chú
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          {gridTransfer.note || 'Không có ghi chú'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Thông tin địa chỉ */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2, height: '100%' }} elevation={1}>
                    <Typography variant="subtitle1" gutterBottom fontWeight={600} color="primary">
                      📍 Thông tin địa chỉ
                    </Typography>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Địa chỉ giao hàng
                      </Typography>
                      {gridTransfer.address ? (
                        <Box>
                          <Typography variant="body2" fontWeight={600} color="primary" gutterBottom>
                            {gridTransfer.address}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {[gridTransfer.ward, gridTransfer.district, gridTransfer.province]
                              .filter(Boolean)
                              .join(', ')}
                          </Typography>
                          <Box display="flex" gap={0.5} flexWrap="wrap" mt={1}>
                            {gridTransfer.ward && (
                              <StatusChip status="primary" label={gridTransfer.ward} />
                            )}
                            {gridTransfer.district && (
                              <StatusChip status="secondary" label={gridTransfer.district} />
                            )}
                            {gridTransfer.province && (
                              <StatusChip status="info" label={gridTransfer.province} />
                            )}
                          </Box>
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: 'italic' }}
                        >
                          Chưa có thông tin địa chỉ
                        </Typography>
                      )}
                    </Box>
                  </Card>
                </Grid>

                {/* Chi tiết kiện */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2 }} elevation={1}>
                    <Typography variant="subtitle1" gutterBottom fontWeight={600} color="primary">
                      📦 Chi tiết kiện
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="primary" fontWeight={600}>
                            {gridTransfer.pkgS ?? 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Size S
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="secondary" fontWeight={600}>
                            {gridTransfer.pkgM ?? 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Size M
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="info" fontWeight={600}>
                            {gridTransfer.pkgL ?? 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Size L
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="warning" fontWeight={600}>
                            {gridTransfer.pkgBagSmall ?? 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Bao nhỏ
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="success" fontWeight={600}>
                            {gridTransfer.pkgBagMedium ?? 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Bao trung
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="error" fontWeight={600}>
                            {gridTransfer.pkgBagLarge ?? 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Bao lớn
                          </Typography>
                        </Box>
                      </Grid>
                      {gridTransfer.pkgOther > 0 && (
                        <Grid item xs={12}>
                          <Box
                            textAlign="center"
                            p={1}
                            sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                          >
                            <Typography variant="h6" color="text.secondary" fontWeight={600}>
                              {gridTransfer.pkgOther}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Khác
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Box
                          textAlign="center"
                          p={1.5}
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            borderRadius: 1,
                            mt: 1,
                          }}
                        >
                          <Typography variant="h6">
                            {(gridTransfer.pkgS || 0) +
                              (gridTransfer.pkgM || 0) +
                              (gridTransfer.pkgL || 0) +
                              (gridTransfer.pkgBagSmall || 0) +
                              (gridTransfer.pkgBagMedium || 0) +
                              (gridTransfer.pkgBagLarge || 0) +
                              (gridTransfer.pkgOther || 0)}
                          </Typography>
                          <Typography variant="caption">TỔNG KIỆN</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Chi tiết khối */}
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 2 }} elevation={1}>
                    <Typography variant="subtitle1" gutterBottom fontWeight={600} color="primary">
                      📊 Chi tiết khối (m³)
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="primary" fontWeight={600}>
                            {(Number(gridTransfer.volS) || 0).toLocaleString('vi-VN', {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Size S
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="secondary" fontWeight={600}>
                            {(Number(gridTransfer.volM) || 0).toLocaleString('vi-VN', {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Size M
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="info" fontWeight={600}>
                            {(Number(gridTransfer.volL) || 0).toLocaleString('vi-VN', {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Size L
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="warning" fontWeight={600}>
                            {(Number(gridTransfer.volBagSmall) || 0).toLocaleString('vi-VN', {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Bao nhỏ
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="success" fontWeight={600}>
                            {(Number(gridTransfer.volBagMedium) || 0).toLocaleString('vi-VN', {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Bao trung
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box
                          textAlign="center"
                          p={1}
                          sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                        >
                          <Typography variant="h6" color="error" fontWeight={600}>
                            {(Number(gridTransfer.volBagLarge) || 0).toLocaleString('vi-VN', {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Bao lớn
                          </Typography>
                        </Box>
                      </Grid>
                      {gridTransfer.volOther > 0 && (
                        <Grid item xs={12}>
                          <Box
                            textAlign="center"
                            p={1}
                            sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}
                          >
                            <Typography variant="h6" color="text.secondary" fontWeight={600}>
                              {(Number(gridTransfer.volOther) || 0).toLocaleString('vi-VN', {
                                minimumFractionDigits: 3,
                                maximumFractionDigits: 3,
                              })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Khác
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <Box
                          textAlign="center"
                          p={1.5}
                          sx={{
                            backgroundColor: 'success.main',
                            color: 'white',
                            borderRadius: 1,
                            mt: 1,
                          }}
                        >
                          <Typography variant="h6">
                            {(
                              (Number(gridTransfer.volS) || 0) +
                              (Number(gridTransfer.volM) || 0) +
                              (Number(gridTransfer.volL) || 0) +
                              (Number(gridTransfer.volBagSmall) || 0) +
                              (Number(gridTransfer.volBagMedium) || 0) +
                              (Number(gridTransfer.volBagLarge) || 0) +
                              (Number(gridTransfer.volOther) || 0)
                            ).toLocaleString('vi-VN', {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            })}
                          </Typography>
                          <Typography variant="caption">TỔNG KHỐI (m³)</Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          {gridIndex >= 0 && (
            <>
              <ActionButton
                onClick={() => navigateGrid('prev')}
                disabled={gridIndex <= 0}
                variant="secondary"
                size="small"
                startIcon={<ActionIcons.Back />}
              >
                Trước
              </ActionButton>
              <ActionButton
                onClick={() => navigateGrid('next')}
                disabled={gridIndex >= selected.length - 1}
                variant="secondary"
                size="small"
                startIcon={<ActionIcons.Forward />}
              >
                Sau
              </ActionButton>
            </>
          )}
          <ActionButton
            onClick={() => setGridOpen(false)}
            variant="primary"
            size="small"
            sx={{ ml: 'auto' }}
          >
            Đóng
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* Edit Transfer (địa chỉ) */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa địa chỉ</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={editForm.address}
                onChange={(e) => handleEditFormChange('address', e.target.value)}
                size="small"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                freeSolo
                options={wardOptions}
                value={editForm.ward}
                onInputChange={(_, val) => handleEditFormChange('ward', val)}
                renderInput={(params) => <TextField {...params} label="Phường/Xã" size="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                freeSolo
                options={districtOptions}
                value={editForm.district}
                onInputChange={(_, val) => handleEditFormChange('district', val)}
                onChange={(_, val) => {
                  handleEditFormChange('district', String(val || ''));
                  fetchWards(editForm.province, String(val || ''));
                }}
                renderInput={(params) => <TextField {...params} label="Quận/Huyện" size="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Autocomplete
                freeSolo
                options={cityOptions}
                value={editForm.province}
                onInputChange={(_, val) => handleEditFormChange('province', val)}
                onChange={(_, val) => {
                  handleEditFormChange('province', String(val || ''));
                  fetchDistricts(String(val || ''));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Tỉnh/Thành phố" size="small" />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <ActionButton variant="secondary" onClick={() => setEditOpen(false)}>
            Hủy
          </ActionButton>
          <ActionButton variant="primary" onClick={submitEdit}>
            Lưu
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* Báo kiện Dialog */}
      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Báo kiện
          {reportTransfer &&
            (() => {
              const totalPackages = Object.values(reportCounts).reduce(
                (sum, count) => sum + (count || 0),
                0
              );
              const totalVolume = volumeRules.reduce((sum, rule) => {
                const count = reportCounts[rule.id] || 0;
                return sum + count * rule.unitVolume;
              }, 0);
              return (
                <Typography
                  variant="subtitle2"
                  component="span"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {reportTransfer.orderCode} • {reportTransfer.dest} • {totalPackages} Kiện (
                  {Number(totalVolume).toLocaleString('vi-VN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{' '}
                  m³)
                </Typography>
              );
            })()}
        </DialogTitle>
        <DialogContent dividers>
          {reportTransfer && (
            <Box>
              <Grid container spacing={1.5}>
                {volumeRules.map((r) => (
                  <Grid key={r.id} item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label={`${r.name} (${Number(r.unitVolume || 0).toLocaleString('vi-VN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m3/kiện)`}
                      value={reportCounts[r.id] || 0}
                      onChange={(e) =>
                        setReportCounts((prev) => ({
                          ...prev,
                          [r.id]: Number(e.target.value) || 0,
                        }))
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <ActionButton variant="secondary" onClick={() => setReportOpen(false)}>
            Hủy
          </ActionButton>
          <ActionButton variant="primary" onClick={handleSubmitReport}>
            Lưu
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* Dialog thông tin địa điểm */}
      <Dialog
        open={locationDialogOpen}
        onClose={() => setLocationDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Thông tin địa điểm không tìm thấy
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Vui lòng nhập thông tin địa điểm cho phiếu {reportTransfer?.orderCode}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mã điểm"
                value={locationData.code}
                onChange={(e) => handleLocationChange('code', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID điểm"
                value={locationData.id}
                onChange={(e) => handleLocationChange('id', e.target.value)}
                size="small"
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={locationData.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                size="small"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Phường/Xã"
                value={locationData.ward}
                onChange={(e) => handleLocationChange('ward', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quận/Huyện"
                value={locationData.district}
                onChange={(e) => handleLocationChange('district', e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tỉnh/Thành phố"
                value={locationData.province}
                onChange={(e) => handleLocationChange('province', e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <ActionButton variant="secondary" onClick={() => setLocationDialogOpen(false)}>
            Hủy
          </ActionButton>
          <ActionButton variant="primary" onClick={handleLocationSubmit}>
            Lưu và báo kiện
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* Action Menu Popover */}
      <Popover
        open={Boolean(actionMenuAnchor)}
        anchorEl={actionMenuAnchor}
        onClose={handleActionMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 180,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2,
          },
        }}
      >
        <List sx={{ py: 0 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleActionClick('report')}>
              <CampaignIcon sx={{ mr: 2, color: 'warning.main' }} />
              <ListItemText primary="Báo kiện" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleActionClick('view')}>
              <PrintIcon sx={{ mr: 2, color: 'success.main' }} />
              <ListItemText primary="In soạn hàng" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleActionClick('print')}>
              <PrintIcon sx={{ mr: 2, color: 'primary.main' }} />
              <ListItemText primary="In phiếu" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleActionClick('export')}>
              <ExportIcon sx={{ mr: 2, color: 'info.main' }} />
              <ListItemText primary="Xuất phiếu" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleActionClick('edit')}>
              <EditIcon sx={{ mr: 2, color: 'primary.main' }} />
              <ListItemText primary="Sửa" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleActionClick('delete')}>
              <DeleteIcon sx={{ mr: 2, color: 'error.main' }} />
              <ListItemText primary="Xóa" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TransferList;
