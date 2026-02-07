import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActionButton,
  ActionIcons,
  Checkbox,
  GridView,
  GridViewItem,
  StatusChip,
  ViewIcons,
} from '../../../components/ui';
import { getStatusLabel } from '../../../components/ui/statusUtils';
import { useTransportRequestPDF } from '../../../hooks/useTransportRequestPDF';
import { logService } from '../../../services/logService';

// Helper: tách danh sách transfer_id và tạo URL In Seri
const parseTransferIds = (value: string | undefined): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};

const buildSerialPrintUrl = (ids: string[]): string => {
  if (!ids || ids.length === 0) return 'https://one.tga.com.vn/so/serials/printOut/?id=';
  const joined = ids.map((id) => encodeURIComponent(id)).join(',');
  return `https://one.tga.com.vn/so/serials/printOut/?id=${joined}`;
};

// Build URL In Phiếu CK: https://one.tga.com.vn/so/ckprint/picking?id=1910608,1910605
const buildPickingPrintUrl = (ids: string[]): string => {
  if (!ids || ids.length === 0) return 'https://one.tga.com.vn/so/ckprint/picking?id=';
  const joined = ids
    .map((id) => id.trim())
    .filter(Boolean)
    .join(',');
  return `https://one.tga.com.vn/so/ckprint/picking?id=${joined}`;
};

const sheetLogger = (message: string, ...details: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    const payload = details.length ? { details } : {};
    logService.debug('TransportRequestsSheet', message, payload);
  }
};

export interface StopDetail {
  stopNumber: number;
  address: string;
  mn: string;
  products: string;
  volume: number;
  packages: number;
  orderCount: number;
  transferIds: string;
  distance: number;
}

export interface TransportRequest {
  requestId: string;
  requestCode?: string;
  transferId?: string;
  createdAt?: string;
  pickupAddress?: string;
  carrierName?: string;
  carrierId?: string;
  carrierContact?: string;
  carrierPhone?: string;
  carrierEmail?: string;
  vehicleType?: string;
  status?: string;
  estimatedCost?: number;
  totalDistance?: number;
  totalProducts?: string;
  totalPackages?: number;
  totalVolumeM3?: number;
  totalOrderCount?: number;
  department?: string;
  serviceArea?: string;
  pricingMethod?: string;
  note?: string;

  // Thông tin các điểm dừng
  stop1Address?: string;
  stop1MN?: string;
  stop2Address?: string;
  stop2MN?: string;
  stop3Address?: string;
  stop3MN?: string;
  stop4Address?: string;
  stop4MN?: string;
  stop5Address?: string;
  stop5MN?: string;
  stop6Address?: string;
  stop6MN?: string;
  stop7Address?: string;
  stop7MN?: string;
  stop8Address?: string;
  stop8MN?: string;
  stop9Address?: string;
  stop9MN?: string;
  stop10Address?: string;
  stop10MN?: string;

  // Sản phẩm từng điểm dừng
  stop1Products?: string;
  stop2Products?: string;
  stop3Products?: string;
  stop4Products?: string;
  stop5Products?: string;
  stop6Products?: string;
  stop7Products?: string;
  stop8Products?: string;
  stop9Products?: string;
  stop10Products?: string;

  // Khối lượng từng điểm dừng
  stop1VolumeM3?: number;
  stop2VolumeM3?: number;
  stop3VolumeM3?: number;
  stop4VolumeM3?: number;
  stop5VolumeM3?: number;
  stop6VolumeM3?: number;
  stop7VolumeM3?: number;
  stop8VolumeM3?: number;
  stop9VolumeM3?: number;
  stop10VolumeM3?: number;

  // Kiện hàng từng điểm dừng
  stop1Packages?: number;
  stop2Packages?: number;
  stop3Packages?: number;
  stop4Packages?: number;
  stop5Packages?: number;
  stop6Packages?: number;
  stop7Packages?: number;
  stop8Packages?: number;
  stop9Packages?: number;
  stop10Packages?: number;

  // Số đơn hàng từng điểm dừng
  stop1OrderCount?: number;
  stop2OrderCount?: number;
  stop3OrderCount?: number;
  stop4OrderCount?: number;
  stop5OrderCount?: number;
  stop6OrderCount?: number;
  stop7OrderCount?: number;
  stop8OrderCount?: number;
  stop9OrderCount?: number;
  stop10OrderCount?: number;

  // Mã chuyển kho từng điểm dừng
  stop1TransferIds?: string;
  stop2TransferIds?: string;
  stop3TransferIds?: string;
  stop4TransferIds?: string;
  stop5TransferIds?: string;
  stop6TransferIds?: string;
  stop7TransferIds?: string;
  stop8TransferIds?: string;
  stop9TransferIds?: string;
  stop10TransferIds?: string;

  // Khoảng cách từng điểm dừng
  distance1?: number;
  distance2?: number;
  distance3?: number;
  distance4?: number;
  distance5?: number;
  distance6?: number;
  distance7?: number;
  distance8?: number;
  distance9?: number;
  distance10?: number;
}

const formatNumber = (value: number | string | undefined): string => {
  if (value === undefined || value === null) return '-';
  const num = Number(value);
  if (isNaN(num)) return String(value);
  return num.toLocaleString('vi-VN');
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');

const FIELD_ALIASES: Record<string, string[]> = {
  requestId: ['request_id', 'masochuyen', 'mayeucau', 'transportid'],
  requestCode: ['ordercode', 'documentcode', 'code', 'masochuyen'],
  transferId: ['transfer_id', 'transfercode'],
  createdAt: ['created_at', 'createddate', 'createdtime', 'ngaytao'],
  pickupAddress: ['pickup', 'pickup_location', 'diachilayhang', 'diemnguon'],
  carrierName: ['carrier', 'carrier_name', 'nhavanchuyen', 'transportpartner'],
  carrierId: ['carrier_id'],
  carrierContact: ['carrier_contact', 'contactperson', 'nguoilienhe'],
  carrierPhone: ['carrier_phone', 'phone', 'sdt', 'hotline'],
  carrierEmail: ['carrier_email', 'email'],
  vehicleType: ['vehicle', 'vehicle_name', 'loaixe', 'phuongtien'],
  pricingMethod: ['pricing', 'phuongthuc', 'phuongthuctinhgia'],
  department: ['phongban', 'department_name'],
  serviceArea: ['khuvuc', 'service_zone', 'area'],
  estimatedCost: ['estimated_cost', 'chiphi', 'chiphiuoctinh', 'costestimate'],
  totalDistance: ['distance', 'total_distance', 'tongquangduong', 'khoangcach'],
  totalProducts: ['soluong', 'productcount', 'tongdonhang', 'total_product'],
  totalPackages: ['sokien', 'tongkien', 'packagecount', 'packages_total'],
  totalVolumeM3: ['tongkhoi', 'khoiluong', 'totalvolume', 'total_cbm'],
  status: ['transportstatus', 'trangthai', 'statuslabel', 'ttvanchuyen'],
  note: ['ghichu', 'ghichuvanchuyen'],
  totalOrderCount: ['ordercount', 'total_orders', 'tongsohoadon'],
};

const normalizeRecord = (record: Record<string, unknown>) => {
  return Object.entries(record).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (!key) return acc;
    acc[normalizeKey(key)] = value;
    return acc;
  }, {});
};

const getNormalizedValue = (record: Record<string, unknown>, field: string) => {
  const candidates = [field, ...(FIELD_ALIASES[field] || [])];
  let fallback: unknown = undefined;

  for (const candidate of candidates) {
    const normalizedKey = normalizeKey(candidate);
    if (Object.prototype.hasOwnProperty.call(record, normalizedKey)) {
      const value = record[normalizedKey];
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
      if (fallback === undefined) {
        fallback = value;
      }
    }
  }

  return fallback;
};

const toStringSafe = (value: unknown, fallback = ''): string => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value.trim() || fallback;
  if (typeof value === 'number' && isNaN(value)) return fallback;
  return String(value);
};

const toNumberSafe = (value: unknown): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    const cleaned = trimmed.replace(/\s+/g, '');
    const hasComma = cleaned.includes(',');
    const hasDot = cleaned.includes('.');
    let normalized = cleaned;

    if (hasComma && !hasDot) {
      normalized = cleaned.replace(/,/g, '.');
    } else {
      normalized = cleaned.replace(/,/g, '');
    }

    normalized = normalized.replace(/[^0-9.-]/g, '');
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const getStopDetails = (row: TransportRequest): StopDetail[] => {
  const stops: StopDetail[] = [];

  for (let i = 1; i <= 10; i++) {
    const address = row[`stop${i}Address` as keyof TransportRequest] as string;
    const mn = row[`stop${i}MN` as keyof TransportRequest] as string;
    const products = row[`stop${i}Products` as keyof TransportRequest] as string;
    const volume = row[`stop${i}VolumeM3` as keyof TransportRequest] as number;
    const packages = row[`stop${i}Packages` as keyof TransportRequest] as number;
    const orderCount = row[`stop${i}OrderCount` as keyof TransportRequest] as number;
    const transferIds = row[`stop${i}TransferIds` as keyof TransportRequest] as string;
    const distance = row[`distance${i}` as keyof TransportRequest] as number;

    if (address && address.trim() !== '') {
      stops.push({
        stopNumber: i,
        address,
        mn: mn || '—',
        products: products || '—',
        volume: volume || 0,
        packages: packages || 0,
        orderCount: orderCount || 0,
        transferIds: transferIds || '—',
        distance: distance || 0,
      });
    }
  }

  return stops;
};

const TransportRequestsSheet: React.FC = () => {
  const [transportRequests, setTransportRequests] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { generatePDF, isGenerating: isGeneratingPDF, error: pdfError } = useTransportRequestPDF();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    item: TransportRequest | null;
  }>({
    open: false,
    item: null,
  });

  const [view, setView] = useState<'table' | 'grid'>('table');

  // PascalCase aliases for eslint react/jsx-pascal-case
  const ViewIcon = ActionIcons.view;
  const PdfIcon = ActionIcons.pdf;
  const PrintIcon = ActionIcons.print;
  const GridIcon = ViewIcons.grid;
  const ListIcon = ViewIcons.list;
  const RefreshIcon = ActionIcons.refresh;

  const pagedData = useMemo(
    () => transportRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [transportRequests, page, rowsPerPage]
  );

  const fetchTransportRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        '/api/transport-requests?spreadsheetId=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As'
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const mappedData: TransportRequest[] = data.map(
        (item: Record<string, unknown>, index: number) => {
          const normalized = normalizeRecord(item);
          const rawRequestId = toStringSafe(getNormalizedValue(normalized, 'requestId'));
          const fallbackRequestCode = toStringSafe(getNormalizedValue(normalized, 'requestCode'));
          const fallbackTransferId = toStringSafe(getNormalizedValue(normalized, 'transferId'));
          const stableId =
            rawRequestId || fallbackRequestCode || fallbackTransferId || `request-${index}`;

          const result: TransportRequest = {
            requestId: stableId,
            requestCode: toStringSafe(getNormalizedValue(normalized, 'requestCode')),
            transferId: toStringSafe(getNormalizedValue(normalized, 'transferId')),
            createdAt: toStringSafe(getNormalizedValue(normalized, 'createdAt')),
            pickupAddress: toStringSafe(getNormalizedValue(normalized, 'pickupAddress')),
            carrierName: toStringSafe(getNormalizedValue(normalized, 'carrierName')),
            carrierId: toStringSafe(getNormalizedValue(normalized, 'carrierId')),
            carrierContact: toStringSafe(getNormalizedValue(normalized, 'carrierContact')),
            carrierPhone: toStringSafe(getNormalizedValue(normalized, 'carrierPhone')),
            carrierEmail: toStringSafe(getNormalizedValue(normalized, 'carrierEmail')),
            vehicleType: toStringSafe(getNormalizedValue(normalized, 'vehicleType')),
            pricingMethod: toStringSafe(getNormalizedValue(normalized, 'pricingMethod')),
            department: toStringSafe(getNormalizedValue(normalized, 'department')),
            serviceArea: toStringSafe(getNormalizedValue(normalized, 'serviceArea')),
            note: toStringSafe(getNormalizedValue(normalized, 'note')),
            totalProducts: toStringSafe(getNormalizedValue(normalized, 'totalProducts')),
            status: toStringSafe(getNormalizedValue(normalized, 'status'), 'pending') || 'pending',
            estimatedCost: toNumberSafe(getNormalizedValue(normalized, 'estimatedCost')),
            totalDistance: toNumberSafe(getNormalizedValue(normalized, 'totalDistance')),
            totalPackages: toNumberSafe(getNormalizedValue(normalized, 'totalPackages')),
            totalVolumeM3: toNumberSafe(getNormalizedValue(normalized, 'totalVolumeM3')),
            totalOrderCount: toNumberSafe(getNormalizedValue(normalized, 'totalOrderCount')),
          };

          const setField = (key: keyof TransportRequest, value: unknown) => {
            (result as Record<string, unknown>)[key as string] = value;
          };

          for (let i = 1; i <= 10; i++) {
            const stopIndex = `stop${i}` as const;
            setField(
              `${stopIndex}Address` as keyof TransportRequest,
              toStringSafe(getNormalizedValue(normalized, `${stopIndex}Address`))
            );
            setField(
              `${stopIndex}Products` as keyof TransportRequest,
              toStringSafe(getNormalizedValue(normalized, `${stopIndex}Products`))
            );
            setField(
              `${stopIndex}VolumeM3` as keyof TransportRequest,
              toNumberSafe(getNormalizedValue(normalized, `${stopIndex}VolumeM3`))
            );
            setField(
              `${stopIndex}Packages` as keyof TransportRequest,
              toNumberSafe(getNormalizedValue(normalized, `${stopIndex}Packages`))
            );
            setField(
              `${stopIndex}OrderCount` as keyof TransportRequest,
              toNumberSafe(getNormalizedValue(normalized, `${stopIndex}OrderCount`))
            );
            setField(
              `${stopIndex}TransferIds` as keyof TransportRequest,
              toStringSafe(getNormalizedValue(normalized, `${stopIndex}TransferIds`))
            );
            setField(
              `${stopIndex}MN` as keyof TransportRequest,
              toStringSafe(getNormalizedValue(normalized, `${stopIndex}MN`))
            );
            setField(
              `distance${i}` as keyof TransportRequest,
              toNumberSafe(getNormalizedValue(normalized, `distance${i}`))
            );
          }

          return result;
        }
      );

      // Debug: Kiểm tra dữ liệu MN được lấy từ sheet
      sheetLogger('Raw data from API', data[0]);
      sheetLogger('Mapped data (first item)', mappedData[0]);

      // Kiểm tra các cột MN
      if (mappedData.length > 0) {
        const firstItem = mappedData[0];
        sheetLogger('MN fields check');
        for (let i = 1; i <= 10; i++) {
          const mnKey = `stop${i}MN` as keyof TransportRequest;
          const mnValue = firstItem[mnKey];
          sheetLogger(`MN field ${mnKey}`, mnValue ?? 'null/undefined');
        }

        // Kiểm tra các cột OrderCount
        sheetLogger('OrderCount fields check');
        for (let i = 1; i <= 10; i++) {
          const orderCountKey = `stop${i}OrderCount` as keyof TransportRequest;
          const orderCountValue = firstItem[orderCountKey];
          sheetLogger(`OrderCount field ${orderCountKey}`, orderCountValue ?? 'null/undefined');
        }
      }

      setTransportRequests(mappedData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Lỗi tải dữ liệu: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportRequests();
  }, []);

  // Xử lý lỗi PDF
  useEffect(() => {
    if (pdfError) {
      setSnackbar({
        open: true,
        message: `Lỗi tạo PDF: ${pdfError}`,
        severity: 'error',
      });
    }
  }, [pdfError]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = pagedData.map((n) => n.requestId);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (requestId: string) => {
    const selectedIndex = selected.indexOf(requestId);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, requestId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (requestId: string) => selected.indexOf(requestId) !== -1;

  const gridItems: GridViewItem[] = useMemo(() => {
    return pagedData.map((row) => ({
      id: row.requestId,
      title: row.requestId || '—',
      subtitle: formatDate(row.createdAt),
      status: {
        active: row.status === 'in_transit',
        label: getStatusLabel(row.status || 'pending'),
        color: row.status === 'in_transit' ? 'success' : 'default',
      },
      details: [
        {
          label: 'Điểm nguồn',
          value: row.pickupAddress || '—',
        },
        {
          label: 'Nhà VC',
          value: row.carrierName || '—',
        },
        {
          label: 'Loại xe',
          value: row.vehicleType || '—',
        },
        {
          label: 'Khoảng cách',
          value: `${formatNumber(row.totalDistance)} km`,
        },
        {
          label: 'Sản phẩm',
          value: row.totalProducts || '—',
        },
        {
          label: 'Kiện',
          value: formatNumber(row.totalPackages),
        },
        {
          label: 'Khối',
          value: `${formatNumber(row.totalVolumeM3)} m³`,
        },
        {
          label: 'Ước tính',
          value: `${formatNumber(row.estimatedCost)} VND`,
        },
      ],
      sections: [
        {
          title: 'Thông tin vận chuyển',
          items: [
            {
              label: 'Phòng ban',
              value: row.department || '—',
            },
            {
              label: 'Khu vực',
              value: row.serviceArea || '—',
            },
            {
              label: 'Phương thức tính',
              value: row.pricingMethod || '—',
            },
            {
              label: 'Ghi chú',
              value: row.note || '—',
            },
          ],
        },
        {
          title: 'Chi tiết đơn hàng',
          items: [
            {
              label: 'Mã chuyển kho',
              value: row.transferId || '—',
            },
            {
              label: 'Mã yêu cầu',
              value: row.requestCode || '—',
            },
            {
              label: 'Trạng thái',
              value: getStatusLabel(row.status || 'pending'),
            },
          ],
        },
        ...getStopDetails(row).map((stop) => ({
          title: `Điểm dừng ${stop.stopNumber}`,
          items: [
            {
              label: 'Địa chỉ',
              value: stop.address,
            },
            {
              label: 'Sản phẩm',
              value: stop.products,
            },
            {
              label: 'Khối lượng',
              value: `${formatNumber(stop.volume)} m³`,
            },
            {
              label: 'Kiện hàng',
              value: formatNumber(stop.packages),
            },
            {
              label: 'Số đơn hàng',
              value: formatNumber(stop.orderCount),
            },
            {
              label: 'Mã chuyển kho',
              value: stop.transferIds,
            },
            {
              label: 'Khoảng cách',
              value: `${formatNumber(stop.distance)} km`,
            },
          ],
        })),
      ],
      metadata: {
        createdAt: row.createdAt,
        updatedAt: row.createdAt,
      },
      actions: [
        {
          label: 'Xem chi tiết',
          icon: <ViewIcon />,
          onClick: (item) => {
            const selectedItem = transportRequests.find((req) => req.requestId === item.id);
            if (selectedItem) {
              setDetailDialog({
                open: true,
                item: selectedItem,
              });
            }
          },
          color: 'primary' as const,
          variant: 'contained' as const,
        },
        {
          label: isGeneratingPDF ? 'Đang tạo PDF...' : 'Xuất PDF',
          icon: isGeneratingPDF ? <CircularProgress size={16} /> : <PdfIcon />,
          onClick: () => generatePDF(row),
          color: 'secondary' as const,
          variant: 'outlined' as const,
        },
      ],
    }));
  }, [pagedData, generatePDF, isGeneratingPDF, transportRequests, ViewIcon, PdfIcon]);

  return (
    <Box>
      <Toolbar sx={{ px: 0, mb: 2 }}>
        <Typography variant="h4" sx={{ flex: 1 }}>
          Vận chuyển ({transportRequests.length})
          {selected.length > 0 && ` - Đã chọn ${selected.length}`}
        </Typography>
        <Stack direction="row" spacing={1}>
          <ActionButton
            variant="secondary"
            onClick={() => setView(view === 'table' ? 'grid' : 'table')}
            startIcon={view === 'table' ? <GridIcon /> : <ListIcon />}
          >
            {view === 'table' ? 'Chế độ Grid' : 'Chế độ Bảng'}
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={fetchTransportRequests}
            startIcon={loading ? <CircularProgress size={16} /> : <RefreshIcon />}
            disabled={loading}
          >
            Làm mới
          </ActionButton>
        </Stack>
      </Toolbar>

      {view === 'table' ? (
        <Paper sx={{ overflow: 'hidden', bgcolor: 'background.paper' }}>
          <TableContainer
            sx={{
              maxHeight: 600,
              bgcolor: 'background.paper',
              overflow: 'auto',
            }}
          >
            <Table
              size="medium"
              stickyHeader
              sx={{
                tableLayout: 'auto',
                bgcolor: 'background.paper',
                '& .MuiTableHead-root th': {
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  color: 'text.secondary',
                  backgroundColor: 'grey.50',
                  px: 0.5,
                  py: 0.75,
                },
                '& .MuiTableBody-root td': {
                  fontSize: '0.78rem',
                  whiteSpace: 'normal',
                  overflow: 'visible',
                  textOverflow: 'clip',
                  px: 0.5,
                  py: 0.75,
                },
                '& .MuiTableBody-root .MuiChip-root': {
                  fontSize: '0.72rem',
                  height: 22,
                },
                '& .MuiTableCell-root': {
                  minWidth: 'fit-content',
                },
                // Styling cho TableRow để có khoảng cách đẹp
                '& .MuiTableRow-root': {
                  '&:hover': {
                    bgcolor: 'grey.50',
                    '& .MuiTableCell-root': {
                      borderBottom: '1px solid',
                      borderColor: 'grey.300',
                    },
                  },
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                  },
                },
                // Override CSS cho cột TT Vận chuyển để hiển thị đẹp như trong TransferList
                '& .MuiTableBody-root td:last-child .MuiChip-root': {
                  width: 'auto',
                  minWidth: 'fit-content',
                  height: '24px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderRadius: '12px',
                  borderWidth: '1px',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out',
                  },
                },
                '& .MuiTableBody-root td:last-child .MuiChip-label': {
                  overflow: 'visible',
                  textOverflow: 'clip',
                  whiteSpace: 'normal',
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  lineHeight: 1.2,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selected.length > 0 && selected.length < pagedData.length}
                      checked={pagedData.length > 0 && selected.length === pagedData.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                  {/* Ẩn cột Request ID và Transfer ID theo yêu cầu */}
                  {/* <TableCell>Request ID</TableCell> */}
                  <TableCell>Mã số chuyến</TableCell>
                  {/* <TableCell>Transfer ID</TableCell> */}
                  <TableCell>Ngày tạo</TableCell>
                  <TableCell>Nhà VC</TableCell>
                  <TableCell>Loại xe</TableCell>
                  <TableCell align="right">Chi phí</TableCell>
                  <TableCell align="right">Khoảng cách</TableCell>
                  <TableCell align="right">SL</TableCell>
                  <TableCell align="right">Kiện</TableCell>
                  <TableCell align="right">Khối (m³)</TableCell>
                  <TableCell>Phòng ban</TableCell>
                  <TableCell>Khu vực</TableCell>
                  <TableCell>Phương thức</TableCell>
                  <TableCell>TT Vận chuyển</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedData.map((row) => {
                  const isItemSelected = isSelected(row.requestId);
                  return (
                    <TableRow
                      hover
                      key={row.requestId}
                      selected={isItemSelected}
                      onClick={() => handleClick(row.requestId)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={(event) => {
                            event.stopPropagation();
                            handleClick(row.requestId);
                          }}
                        />
                      </TableCell>
                      {/* <TableCell>{row.requestId}</TableCell> */}
                      <TableCell>{row.requestId || '-'}</TableCell>
                      {/* <TableCell>{row.transferId || '-'}</TableCell> */}
                      <TableCell>{row.createdAt || '-'}</TableCell>
                      <TableCell>{row.carrierName || '-'}</TableCell>
                      <TableCell>{row.vehicleType || '-'}</TableCell>
                      <TableCell align="right">{formatNumber(row.estimatedCost || 0)}</TableCell>
                      <TableCell align="right">{formatNumber(row.totalDistance || 0)}</TableCell>
                      <TableCell align="right">{row.totalProducts || '-'}</TableCell>
                      <TableCell align="right">{formatNumber(row.totalPackages)}</TableCell>
                      <TableCell align="right">{formatNumber(row.totalVolumeM3)}</TableCell>
                      <TableCell>{row.department || '-'}</TableCell>
                      <TableCell>{row.serviceArea || '-'}</TableCell>
                      <TableCell>{row.pricingMethod || '-'}</TableCell>
                      <TableCell>
                        <StatusChip
                          status={row.status || 'pending'}
                          label={getStatusLabel(row.status || 'pending')}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {pagedData.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={13} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={transportRequests.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50]}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
          />
        </Paper>
      ) : (
        <Box>
          <GridView
            items={gridItems}
            onItemClick={(item) => handleClick(item.id)}
            gridSpacing={2}
            cardMinHeight={280}
            maxItemsPerRow={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }}
            showExpandableDetails={true}
          />
          <Box mt={2}>
            <TablePagination
              component="div"
              count={transportRequests.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50]}
              labelRowsPerPage="Số hàng mỗi trang:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
            />
          </Box>
        </Box>
      )}

      {/* Dialog Chi tiết chuyến vận chuyển */}
      <Dialog
        open={detailDialog.open}
        onClose={() => setDetailDialog({ open: false, item: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Chi tiết chuyến vận chuyển - {detailDialog.item?.requestId}
            </Typography>
            <Stack direction="row" spacing={1}>
              <ActionButton
                variant="secondary"
                size="small"
                startIcon={<PrintIcon />}
                onClick={() => {
                  const ids: string[] = [];
                  if (detailDialog.item) {
                    for (let i = 1; i <= 10; i++) {
                      const key = `stop${i}TransferIds` as keyof TransportRequest;
                      const raw = detailDialog.item[key] as unknown as string;
                      ids.push(...parseTransferIds(raw));
                    }
                  }
                  const url = buildSerialPrintUrl(ids);
                  window.open(url, '_blank');
                }}
              >
                In Seri
              </ActionButton>
              <ActionButton
                variant="primary"
                size="small"
                startIcon={<PrintIcon />}
                onClick={() => {
                  const ids: string[] = [];
                  if (detailDialog.item) {
                    for (let i = 1; i <= 10; i++) {
                      const key = `stop${i}TransferIds` as keyof TransportRequest;
                      const raw = detailDialog.item[key] as unknown as string;
                      ids.push(...parseTransferIds(raw));
                    }
                  }
                  const url = buildPickingPrintUrl(ids);
                  window.open(url, '_blank');
                }}
              >
                In Phiếu CK
              </ActionButton>
            </Stack>
          </Box>
        </DialogTitle>
        <DialogContent>
          {detailDialog.item && (
            <Box sx={{ mt: 2 }}>
              {/* Thông tin cơ bản */}
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Thông tin cơ bản
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Mã chuyến vận chuyển"
                    secondary={detailDialog.item.requestId}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Ngày tạo"
                    secondary={formatDate(detailDialog.item.createdAt)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Trạng thái"
                    secondary={getStatusLabel(detailDialog.item.status || 'pending')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Nhà vận chuyển"
                    secondary={detailDialog.item.carrierName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Loại xe" secondary={detailDialog.item.vehicleType} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Điểm nguồn" secondary={detailDialog.item.pickupAddress} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Mã chuyển kho"
                    secondary={
                      getStopDetails(detailDialog.item)
                        .map((s) => s.transferIds)
                        .filter((x) => x && x.trim().length > 0)
                        .join(', ') || '—'
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Khoảng cách (tổng)"
                    secondary={`${formatNumber(detailDialog.item.totalDistance)} km`}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Thông tin chi tiết */}
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Thông tin chi tiết
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Tổng khoảng cách"
                    secondary={`${formatNumber(detailDialog.item.totalDistance)} km`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Tổng sản phẩm"
                    secondary={detailDialog.item.totalProducts}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Tổng kiện hàng"
                    secondary={formatNumber(detailDialog.item.totalPackages)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Tổng khối lượng"
                    secondary={`${formatNumber(detailDialog.item.totalVolumeM3)} m³`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Chi phí ước tính"
                    secondary={`${formatNumber(detailDialog.item.estimatedCost)} VND`}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Thông tin các điểm dừng */}
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Thông tin các điểm dừng
              </Typography>
              {detailDialog.item &&
                getStopDetails(detailDialog.item).map((stop, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Điểm dừng {stop.stopNumber}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <ActionButton
                        variant="secondary"
                        size="small"
                        startIcon={<PrintIcon />}
                        onClick={() => {
                          const ids = parseTransferIds(stop.transferIds);
                          const url = buildSerialPrintUrl(ids);
                          window.open(url, '_blank');
                        }}
                      >
                        In Seri
                      </ActionButton>
                      <ActionButton
                        variant="primary"
                        size="small"
                        startIcon={<PrintIcon />}
                        onClick={() => {
                          const ids = parseTransferIds(stop.transferIds);
                          const url = buildPickingPrintUrl(ids);
                          window.open(url, '_blank');
                        }}
                      >
                        In Phiếu CK
                      </ActionButton>
                    </Stack>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Địa chỉ" secondary={stop.address} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Sản phẩm" secondary={stop.products} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Khối lượng"
                          secondary={`${formatNumber(stop.volume)} m³`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Kiện hàng" secondary={formatNumber(stop.packages)} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Số đơn hàng"
                          secondary={formatNumber(stop.orderCount)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Mã chuyển kho" secondary={stop.transferIds} />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Khoảng cách"
                          secondary={`${formatNumber(stop.distance)} km`}
                        />
                      </ListItem>
                    </List>
                    {detailDialog.item && index < getStopDetails(detailDialog.item).length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <ActionButton
            onClick={() => setDetailDialog({ open: false, item: null })}
            variant="secondary"
          >
            Đóng
          </ActionButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TransportRequestsSheet;
