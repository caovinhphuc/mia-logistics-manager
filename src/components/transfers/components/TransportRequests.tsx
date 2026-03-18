// @ts-nocheck
import {
  Delete,
  Edit,
  ViewList,
  GridView as GridViewIcon,
  AddCircle,
  Add as AddIcon,
  Sync,
  FilterList,
  Clear,
  LocalShipping,
  LocationOn,
  Schedule,
  Person,
  MoreVert,
  ArrowDropDown,
  Business,
  Public,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { StatusChip, Checkbox } from '../../../components/ui';
import Menu from '@mui/material/Menu';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getSession } from '../../../shared/utils/auth';
import { useTransportCostCalculation } from '../../../hooks/useTransportCostCalculation';
import { CostCalculationDetails } from '../../../components/CostCalculationDetails';
import { useDistanceCalculation } from '../../../hooks/useDistanceCalculation';
import { DistanceDisplay } from '../../../components/DistanceDisplay';
import AutocompleteAddress from '../../../shared/components/AutocompleteAddress';

interface Transfer {
  transfer_id: string;
  orderCode: string;
  hasVali: string;
  date: string;
  source: string;
  dest: string;
  quantity: string;
  state: string;
  transportStatus: string;
  note: string;
  pkgS: string;
  pkgM: string;
  pkgL: string;
  pkgBagSmall: string;
  pkgBagMedium: string;
  pkgBagLarge: string;
  pkgOther: string;
  totalPackages: string;
  totalVolume: string;
  employee: string;
  address: string;
  ward: string;
  district: string;
  province: string;
}

interface Location {
  id: string;
  code: string;
  avatar: string;
  category: string;
  subcategory: string;
  address: string;
  status: 'active' | 'inactive';
  ward: string;
  district: string;
  province: string;
  note: string;
}

interface Carrier {
  carrierId: string;
  name: string;
  avatarUrl: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  serviceAreas: string;
  pricingMethod: 'PER_KM' | 'PER_TRIP' | 'PER_M3';
  baseRate: string;
  perKmRate: string;
  perM3Rate: string;
  perTripRate: string;
  stopFee: string;
  fuelSurcharge: string;
  remoteAreaFee: string;
  insuranceRate: string;
  vehicleTypes: string;
  maxWeight: string;
  maxVolume: string;
  operatingHours: string;
  rating: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

interface TransportRequest {
  // Thông tin cơ bản (4 cột)
  requestId: string;
  createdAt: string;
  status: string;
  note: string;

  // Điểm lấy hàng (1 cột)
  pickupAddress: string;

  // Điểm dừng (10 cột)
  stop1Address: string;
  stop1MN?: string;
  stop2Address: string;
  stop2MN?: string;
  stop3Address: string;
  stop3MN?: string;
  stop4Address: string;
  stop4MN?: string;
  stop5Address: string;
  stop5MN?: string;
  stop6Address: string;
  stop6MN?: string;
  stop7Address: string;
  stop7MN?: string;
  stop8Address: string;
  stop8MN?: string;
  stop9Address: string;
  stop9MN?: string;
  stop10Address: string;
  stop10MN?: string;

  // Sản phẩm điểm dừng (10 cột)
  stop1Products: string;
  stop2Products: string;
  stop3Products: string;
  stop4Products: string;
  stop5Products: string;
  stop6Products: string;
  stop7Products: string;
  stop8Products: string;
  stop9Products: string;
  stop10Products: string;

  // Khối lượng điểm dừng (10 cột)
  stop1VolumeM3: number;
  stop2VolumeM3: number;
  stop3VolumeM3: number;
  stop4VolumeM3: number;
  stop5VolumeM3: number;
  stop6VolumeM3: number;
  stop7VolumeM3: number;
  stop8VolumeM3: number;
  stop9VolumeM3: number;
  stop10VolumeM3: number;

  // Số kiện điểm dừng (10 cột)
  stop1Packages: number;
  stop2Packages: number;
  stop3Packages: number;
  stop4Packages: number;
  stop5Packages: number;
  stop6Packages: number;
  stop7Packages: number;
  stop8Packages: number;
  stop9Packages: number;
  stop10Packages: number;

  // Tổng hợp (3 cột)
  totalProducts: string;
  totalVolumeM3: number;
  totalPackages: number;

  // Thông tin vận chuyển (8 cột)
  pricingMethod: string;
  carrierId: string;
  carrierName: string;
  carrierContact: string;
  carrierPhone: string;
  carrierEmail: string;
  estimatedCost: number;
  vehicleType: string;

  // Quãng đường (11 cột)
  distance1: number;
  distance2: number;
  distance3: number;
  distance4: number;
  distance5: number;
  distance6: number;
  distance7: number;
  distance8: number;
  distance9: number;
  distance10: number;
  totalDistance: number;

  // Số phiếu đơn hàng (11 cột)
  stop1OrderCount: number;
  stop2OrderCount: number;
  stop3OrderCount: number;
  stop4OrderCount: number;
  stop5OrderCount: number;
  stop6OrderCount: number;
  stop7OrderCount: number;
  stop8OrderCount: number;
  stop9OrderCount: number;
  stop10OrderCount: number;
  totalOrderCount: number;

  // Thông tin Tài xế (4 cột)
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverLicense: string;

  // Hình ảnh và Phòng ban (2 cột)
  loadingImages: string;
  department: string;

  // Định giá và Phí phụ (9 cột)
  serviceArea: string;
  pricePerKm: number;
  pricePerM3: number;
  pricePerTrip: number;
  stopFee: number;
  fuelSurcharge: number;
  tollFee: number;
  insuranceFee: number;
  baseRate: number;

  // Legacy fields (giữ lại để tương thích)
  id?: string;
  requestCode?: string;
  transferId?: string;
  customerName?: string;
  customerPhone?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  deliveryAddress?: string;
  requestDate?: string;
  pickupDate?: string;
  deliveryDate?: string;
  cargoType?: string;
  weight?: number;
  volume?: number;
  actualCost?: number;
  packageDetails?: {
    pkgS: number;
    pkgM: number;
    pkgL: number;
    pkgBagSmall: number;
    pkgBagMedium: number;
    pkgBagLarge: number;
    pkgOther: number;
  };
}

interface DeliveryPoint {
  address: string;
  transfers: TransportRequest[];
  totalPackages: number;
  totalVolume: number;
  totalProducts: number; // Số lượng sản phẩm tại điểm dừng này
  transferCount: number; // Số phiếu đơn hàng tại điểm dừng này
}

type FormPricingMethod = 'perKm' | 'perTrip' | 'perM3';

const FORM_TO_SHEET_PRICING_METHOD: Record<FormPricingMethod, string> = {
  perKm: 'PER_KM',
  perTrip: 'PER_TRIP',
  perM3: 'PER_M3',
};

const SHEET_TO_FORM_PRICING_METHOD: Record<string, FormPricingMethod> = {
  PER_KM: 'perKm',
  PER_TRIP: 'perTrip',
  PER_M3: 'perM3',
};

interface NewTransportForm {
  pickupLocation: string;
  selectedTransfers: Set<string>;
  status: string;
  note: string;
  originId: string;
  destinationIds: string[];
  carrierName: string;
  carrierId: string;
  pricingMethod: FormPricingMethod;
  vehicleType: string;
  estimatedCost: number;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverLicense: string;
  loadingImages: string;
  department: string;
  serviceArea: string;
  pricePerKm: number;
  pricePerM3: number;
  pricePerTrip: number;
  stopFee: number;
  fuelSurcharge: number;
  tollFee: number;
  insuranceFee: number;
  baseRate: number;
}

const TransportRequests: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [loading, setLoading] = useState(false);
  const [transportRequests, setTransportRequests] = useState<TransportRequest[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TransportRequest | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowMenuAnchor, setRowMenuAnchor] = useState<null | HTMLElement>(null);
  const [rowMenuRequest, setRowMenuRequest] = useState<TransportRequest | null>(null);

  const handleOpenRowMenu = (e: React.MouseEvent<HTMLElement>, request: TransportRequest) => {
    setRowMenuAnchor(e.currentTarget);
    setRowMenuRequest(request);
  };
  const handleCloseRowMenu = () => {
    setRowMenuAnchor(null);
    setRowMenuRequest(null);
  };
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    vehicleType: '',
    customerName: '',
  });

  // Request ID management states
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [, setCurrentRowIndex] = useState<number | null>(null);
  const [generatingId, setGeneratingId] = useState(false);
  const [closingDialog, setClosingDialog] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // New transport request dropdown states
  const [newTransportMenuAnchor, setNewTransportMenuAnchor] = useState<null | HTMLElement>(null);
  const [newTransportDialogOpen, setNewTransportDialogOpen] = useState(false);
  const [newTransportType, setNewTransportType] = useState<'system' | 'external' | null>(null);

  const [creatingTransportRequest, setCreatingTransportRequest] = useState(false);

  // States for controlling dropdown open/close
  const [destinationSelectOpen, setDestinationSelectOpen] = useState(false);

  // States for package reporting
  const [volumeRules, setVolumeRules] = useState<
    Array<{ id: string; name: string; unitVolume: number }>
  >([]);
  const [packageCounts, setPackageCounts] = useState<Record<string, number>>({});

  // States for new transport request fields
  const [transportStatus, setTransportStatus] = useState('Chờ xác nhận');
  const [shippingStatus, setShippingStatus] = useState('Đã báo kiện');
  const [department, setDepartment] = useState('');
  const [requestDate, setRequestDate] = useState(() => {
    const now = new Date();
    return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  });
  const [hasLuggage, setHasLuggage] = useState('Không vali');
  const [createdBy, setCreatedBy] = useState('');
  const [productQuantity, setProductQuantity] = useState(0);
  const [isProductQuantityManuallySet, setIsProductQuantityManuallySet] = useState(false);

  // States for external destinations (1 destination)
  const [externalDestinations, setExternalDestinations] = useState<
    Array<{
      id: number;
      address: string;
      customerName: string;
      customerPhone: string;
      productName: string;
      productQuantity: number;
      productWeight: number;
      productVolume: number;
      notes: string;
    }>
  >(() =>
    Array.from({ length: 1 }, (_, i) => ({
      id: i + 1,
      address: '',
      customerName: '',
      customerPhone: '',
      productName: '',
      productQuantity: 0,
      productWeight: 0,
      productVolume: 0,
      notes: '',
    }))
  );

  // Danh sách phòng ban
  const departments = [
    { id: 'store', name: 'Cửa hàng', icon: '🏪' },
    { id: 'operations', name: 'Vận hành', icon: '⚙️' },
    { id: 'b2b', name: 'B2B', icon: '🏢' },
    { id: 'warranty', name: 'Bảo hành', icon: '🔧' },
    { id: 'marketing', name: 'Marketing', icon: '📢' },
    { id: 'logistics', name: 'Kho vận', icon: '📦' },
    { id: 'hr', name: 'Nhân sự', icon: '👥' },
    { id: 'it', name: 'IT', icon: '💻' },
    { id: 'merchandise', name: 'Ngành hàng', icon: '📋' },
    { id: 'livestream', name: 'Livestream', icon: '📺' },
    { id: 'bod', name: 'BOD', icon: '👑' },
    { id: 'other', name: 'Khác', icon: '🔄' },
  ];

  // State cho snackbar thông báo
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // New transport request form state
  const [newTransportForm, setNewTransportForm] = useState<NewTransportForm>({
    // Thông tin cơ bản

    pickupLocation: '',
    selectedTransfers: new Set<string>(),
    status: 'in_transit',
    note: '',

    // New transport request fields
    originId: '',
    destinationIds: [],

    // Thông tin vận chuyển
    carrierName: '',
    carrierId: '',
    pricingMethod: 'perKm',
    vehicleType: '',
    estimatedCost: 0,

    // Thông tin tài xế
    driverId: '',
    driverName: '',
    driverPhone: '',
    driverLicense: '',

    // Hình ảnh và phòng ban
    loadingImages: '',
    department: '',

    // Định giá và phí phụ
    serviceArea: '',
    pricePerKm: 0,
    pricePerM3: 0,
    pricePerTrip: 0,
    stopFee: 0,
    fuelSurcharge: 0,
    tollFee: 0,
    insuranceFee: 0,
    baseRate: 0,
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    pickupLocation?: string;
    selectedTransfers?: string;
    carrierName?: string;
    pricingMethod?: string;
    driverName?: string;
    driverPhone?: string;
    department?: string;
    serviceArea?: string;
    vehicleType?: string;
    vehiclePlate?: string;
  }>({});

  // State cho dialog thêm điểm nguồn
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
  const [addLocationType, setAddLocationType] = useState<'system' | 'temporary' | null>(null);
  const [savingLocation, setSavingLocation] = useState(false);

  // Constants cho form thêm điểm nguồn hệ thống
  const AVATAR_OPTIONS = [
    { value: '🏢', label: '🏢 Tòa nhà' },
    { value: '🏪', label: '🏪 Cửa hàng' },
    { value: '🏭', label: '🏭 Nhà máy' },
    { value: '🏠', label: '🏠 Nhà ở' },
    { value: '🏢', label: '🏢 Văn phòng' },
    { value: '🏬', label: '🏬 Trung tâm thương mại' },
    { value: '🏗️', label: '🏗️ Công trường' },
    { value: '🚚', label: '🚚 Kho vận' },
  ];

  const CATEGORY_OPTIONS = [
    'Kho hàng',
    'Cửa hàng',
    'Nhà máy',
    'Văn phòng',
    'Trung tâm thương mại',
    'Công trường',
    'Kho vận',
    'Khác',
  ];

  const PROVINCE_OPTIONS = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Khác'];

  // State cho form thêm điểm nguồn hệ thống
  const [newSystemLocation, setNewSystemLocation] = useState({
    code: '',
    avatar: '🏢',
    category: 'Cửa hàng',
    subcategory: '',
    address: '',
    ward: '',
    district: '',
    province: 'TP. Hồ Chí Minh',
    note: '',
  });

  // State cho form thêm điểm nguồn tạm
  const [newTemporaryLocation, setNewTemporaryLocation] = useState({
    address: '',
    ward: '',
    district: '',
    province: '',
  });

  // State cho việc quản lý điểm dừng
  const [stopPoints, setStopPoints] = useState<{
    [key: string]: {
      address: string;
      transfers: string[];
      totalPackages: number;
      totalVolume: number;
    };
  }>({});

  // State cho các điểm dừng được chọn (quản lý nhiều điểm dừng)
  const [selectedStopPoints, setSelectedStopPoints] = useState<Set<string>>(new Set());

  // State cho phiếu được chọn trong điểm dừng (giữ lại để tương thích)
  const [, setSelectedTransferInStop] = useState<string | null>(null);

  // State cho khoảng cách

  // State cho thông báo pricing
  const [pricingNotification, setPricingNotification] = useState<{
    show: boolean;
    message: string;
    type: 'info' | 'success' | 'warning';
  }>({
    show: false,
    message: '',
    type: 'info',
  });

  // Sử dụng custom hook cho việc tính khoảng cách
  const {
    distances: stopPointDistances,
    isCalculating: isCalculatingStopDistances,
    error: distanceError,
    calculateStopDistances,
    getDistancePayload,
  } = useDistanceCalculation();

  // State cho tab management
  const [activeTab, setActiveTab] = useState(0);

  // Utility functions
  const getVietnamTime = (): Date => {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  };

  // Validation functions
  const validateVietnamesePhone = (phone: string): boolean => {
    // Format: 0xx-xxx-xxxx hoặc 0xxxxxxxxx
    const phoneRegex = /^0[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ''));
  };

  const validateVehiclePlate = (plate: string): boolean => {
    // Format: 51A-12345 hoặc 51A12345 (biển số Việt Nam)
    const plateRegex = /^[0-9]{2}[A-Z][0-9]{4,5}$/;
    return plateRegex.test(plate.replace(/[-\s]/g, '').toUpperCase());
  };

  // Helper function to format numbers with thousand separators
  const formatNumber = (value: number | string): string => {
    const numValue = typeof value === 'string' ? Number(value) || 0 : value;

    // Ensure consistent formatting for Vietnamese locale
    // Vietnamese uses dots as thousand separators and commas as decimal separators
    return numValue.toLocaleString('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Helper function to format decimal numbers with Vietnamese locale
  const formatDecimal = (value: number | string, decimals: number = 1): string => {
    const numValue = typeof value === 'string' ? Number(value) || 0 : value;

    // Format with Vietnamese locale (dots for thousands, commas for decimals)
    return numValue.toLocaleString('vi-VN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Helper function to parse formatted number back to number
  const parseFormattedNumber = (value: string): number => {
    // Remove all non-digit characters except decimal point, comma, and minus sign
    const cleanedValue = value.replace(/[^\d.,-]/g, '');

    // If empty, return 0
    if (!cleanedValue || cleanedValue === '-') {
      return 0;
    }

    // For Vietnamese locale, we expect dots as thousand separators and commas as decimal separators
    // But to be safe, let's handle both cases

    // First, check if there are multiple separators (likely thousand separators)
    const commaCount = (cleanedValue.match(/,/g) || []).length;
    const dotCount = (cleanedValue.match(/\./g) || []).length;

    if (commaCount > 1 || dotCount > 1) {
      // Multiple separators - treat as thousand separators
      // Remove all separators and parse as whole number
      const normalizedValue = cleanedValue.replace(/[.,]/g, '');
      return Number(normalizedValue) || 0;
    }

    // Single separator case
    if (cleanedValue.includes(',') && cleanedValue.includes('.')) {
      // Both separators present - determine which is decimal
      const lastComma = cleanedValue.lastIndexOf(',');
      const lastDot = cleanedValue.lastIndexOf('.');

      if (lastComma > lastDot) {
        // Comma is decimal separator
        const normalizedValue = cleanedValue.replace(/\./g, '').replace(',', '.');
        return Number(normalizedValue) || 0;
      } else {
        // Dot is decimal separator
        const normalizedValue = cleanedValue.replace(/,/g, '');
        return Number(normalizedValue) || 0;
      }
    } else if (cleanedValue.includes(',')) {
      // Only comma - check if it's decimal or thousand separator
      const parts = cleanedValue.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        // Likely decimal separator
        const normalizedValue = cleanedValue.replace(',', '.');
        return Number(normalizedValue) || 0;
      } else {
        // Likely thousand separator
        const normalizedValue = cleanedValue.replace(/,/g, '');
        return Number(normalizedValue) || 0;
      }
    } else if (cleanedValue.includes('.')) {
      // Only dot - check if it's decimal or thousand separator
      const parts = cleanedValue.split('.');
      if (parts.length === 2 && parts[1].length <= 2) {
        // Likely decimal separator
        return Number(cleanedValue) || 0;
      } else {
        // Likely thousand separator
        const normalizedValue = cleanedValue.replace(/\./g, '');
        return Number(normalizedValue) || 0;
      }
    }

    return Number(cleanedValue) || 0;
  };

  const validateRealTime = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'driverPhone':
        if (!value.trim()) return 'Số điện thoại tài xế là bắt buộc';
        if (!validateVietnamesePhone(value))
          return 'Số điện thoại không đúng định dạng Việt Nam (VD: 0901234567)';
        return undefined;
      case 'vehiclePlate':
        if (value.trim() && !validateVehiclePlate(value)) {
          return 'Biển số xe không đúng định dạng (VD: 51A12345)';
        }
        return undefined;
      case 'driverName':
        if (!value.trim()) return 'Tên tài xế là bắt buộc';
        if (value.trim().length < 2) return 'Tên tài xế phải có ít nhất 2 ký tự';
        return undefined;
      case 'department':
        if (!value.trim()) return 'Phòng ban là bắt buộc';
        return undefined;
      case 'serviceArea':
        if (!value.trim()) return 'Khu vực phục vụ là bắt buộc';
        return undefined;
      case 'pricingMethod':
        if (!value.trim()) return 'Phương thức tính tiền là bắt buộc';
        return undefined;
      case 'vehicleType':
        if (shouldShowVehicleType(newTransportForm.pricingMethod) && !value.trim()) {
          return 'Loại xe là bắt buộc cho phương thức tính giá này';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  // Tự động xóa điểm dừng khi không còn phiếu nào
  useEffect(() => {
    const newSelectedStopPoints = new Set<string>();

    // Kiểm tra từng điểm dừng đã chọn
    selectedStopPoints.forEach((stopKey) => {
      const stopPoint = stopPoints[stopKey];
      if (!stopPoint) return;

      // Kiểm tra xem điểm dừng này còn phiếu nào được chọn không
      const hasSelectedTransfers = stopPoint.transfers.some((transferId) =>
        newTransportForm.selectedTransfers.has(transferId)
      );

      // Chỉ giữ lại điểm dừng có phiếu được chọn
      if (hasSelectedTransfers) {
        newSelectedStopPoints.add(stopKey);
      }
    });

    // Cập nhật danh sách điểm dừng đã chọn
    if (newSelectedStopPoints.size !== selectedStopPoints.size) {
      setSelectedStopPoints(newSelectedStopPoints);
    }
  }, [newTransportForm.selectedTransfers, stopPoints, selectedStopPoints]);

  // Tự động tính khoảng cách khi điểm dừng thay đổi
  useEffect(() => {
    if (selectedStopPoints.size > 0 && newTransportForm.pickupLocation) {
      calculateStopPointDistances();
    }
  }, [selectedStopPoints, newTransportForm.pickupLocation]);

  // Xử lý click vào mã phiếu
  const handleTransferClick = (transferId: string, address: string) => {
    const transfer = transportRequests.find((t) => t.id === transferId);
    if (!transfer) return;

    // Tìm điểm dừng có cùng địa chỉ
    const existingStop = Object.entries(stopPoints).find(([_, stop]) => stop.address === address);

    if (existingStop) {
      // Thêm điểm dừng vào danh sách đã chọn nếu chưa có
      setSelectedStopPoints((prev) => new Set([...prev, existingStop[0]]));
      setSelectedTransferInStop(transferId);
    } else {
      // Kiểm tra giới hạn số điểm dừng (tối đa 10 điểm)
      const currentStopCount = Object.keys(stopPoints).length;
      if (currentStopCount >= 10) {
        setSnackbar({
          open: true,
          message: '⚠️ Đã đạt tối đa 10 điểm dừng. Không thể thêm điểm dừng mới!',
          severity: 'warning',
        });
        return;
      }

      // Tạo điểm dừng mới nếu chưa có
      const newStopKey = `stop${currentStopCount + 1}`;

      // Tìm tất cả phiếu có cùng địa chỉ
      const allTransfersForAddress = transportRequests.filter((t) => t.deliveryAddress === address);

      console.log('🔍 DEBUG - Creating stopPoint:', {
        newStopKey,
        address,
        allTransfersForAddress: allTransfersForAddress.map((t) => ({
          id: t.id,
          transferId: t.transferId,
          requestCode: t.requestCode,
          deliveryAddress: t.deliveryAddress,
        })),
      });

      setStopPoints((prev) => ({
        ...prev,
        [newStopKey]: {
          address: address,
          transfers: allTransfersForAddress.map((t) => t.transferId || t.id),
          totalPackages: allTransfersForAddress.reduce((sum, t) => sum + t.totalPackages, 0),
          totalVolume: allTransfersForAddress.reduce((sum, t) => sum + t.volume || 0, 0),
        },
      }));
      // Thêm điểm dừng mới vào danh sách đã chọn
      setSelectedStopPoints((prev) => new Set([...prev, newStopKey]));
      setSelectedTransferInStop(transferId);
    }
  };

  // Lấy thông tin chi tiết của carrier đã chọn
  const getSelectedCarrierInfo = () => {
    if (!newTransportForm.carrierName || !newTransportForm.pricingMethod) {
      return null;
    }

    // Map form format to sheet format for comparison
    const pricingMethodMap: { [key: string]: string } = {
      perKm: 'PER_KM',
      perM3: 'PER_M3',
      perTrip: 'PER_TRIP',
    };

    const sheetPricingMethod =
      pricingMethodMap[newTransportForm.pricingMethod] || newTransportForm.pricingMethod;

    return groupedCarriers[newTransportForm.carrierName]?.find(
      (c) =>
        c.pricingMethod === sheetPricingMethod &&
        (!newTransportForm.vehicleType ||
          c.vehicleTypes
            ?.split(',')
            .map((v) => v.trim())
            .includes(newTransportForm.vehicleType))
    );
  };

  // Hook tính toán chi phí vận chuyển
  const { calculateCost } = useTransportCostCalculation();

  // Tính chi phí ước tính dựa trên dữ liệu sheet
  const calculateEstimatedCost = useCallback(() => {
    console.log('🔍 calculateEstimatedCost called');
    const carrier = getSelectedCarrierInfo();
    console.log('🔍 carrier:', carrier);
    if (!carrier) {
      console.log('❌ No carrier found, returning 0');
      return 0;
    }

    // Tính tổng khối lượng từ các phiếu đã chọn
    const selectedTransfers = transportRequests.filter(
      (t) => t.id && newTransportForm.selectedTransfers.has(t.id)
    );
    const totalVolume = selectedTransfers.reduce((sum, t) => sum + (t.volume || 0 || 0), 0);

    // Tổng điểm dừng thực tế (KHÔNG tính điểm nguồn)
    const totalStops = selectedStopPoints.size;

    // Sử dụng pricing method từ form (đã là form format)
    const hookPricingMethod = newTransportForm.pricingMethod || 'perKm';

    // Tính tổng khoảng cách từ stopPointDistances
    const totalDistance = Object.values(stopPointDistances).reduce(
      (sum, distance) => sum + distance,
      0
    );

    console.log('🔍 DEBUG - Cost calculation inputs:');
    console.log('  - totalDistance from stopPointDistances:', totalDistance);
    console.log('  - stopPointDistances:', stopPointDistances);
    console.log('  - totalStops:', totalStops);
    console.log('  - totalVolume:', totalVolume);
    console.log('  - pricingMethod:', hookPricingMethod);
    console.log('  - baseRate:', newTransportForm.baseRate);
    console.log('  - pricePerKm:', newTransportForm.pricePerKm);

    // Sử dụng hook để tính toán
    const costBreakdown = calculateCost({
      pricingMethod: hookPricingMethod,
      baseRate: newTransportForm.baseRate || 0,
      pricePerKm: newTransportForm.pricePerKm || 0,
      pricePerTrip: newTransportForm.pricePerTrip || 0,
      pricePerM3: newTransportForm.pricePerM3 || 0,
      stopFee: newTransportForm.stopFee || 0,
      fuelSurcharge: newTransportForm.fuelSurcharge || 0,
      tollFee: newTransportForm.tollFee || 0,
      insuranceFee: newTransportForm.insuranceFee || 0,
      totalDistance: totalDistance,
      totalStops: totalStops,
      totalVolume: totalVolume,
    });

    return Math.round(costBreakdown.totalCost);
  }, [
    newTransportForm.baseRate,
    newTransportForm.pricePerKm,
    newTransportForm.pricePerTrip,
    newTransportForm.pricePerM3,
    newTransportForm.pricingMethod,
    newTransportForm.serviceArea,
    newTransportForm.vehicleType,
    newTransportForm.stopFee,
    newTransportForm.fuelSurcharge,
    newTransportForm.tollFee,
    newTransportForm.insuranceFee,
    selectedStopPoints.size,
    transportRequests,
    newTransportForm.selectedTransfers,
    stopPointDistances,
    getSelectedCarrierInfo,
  ]);

  // Generate new request ID
  const generateNewRequestId = async (): Promise<{
    requestId: string;
    rowIndex: number;
  }> => {
    try {
      const response = await fetch('/api/transport-requests/generate-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        requestId: data.requestId,
        rowIndex: data.rowIndex,
      };
    } catch (error) {
      console.error('Error generating request ID:', error);
      throw error;
    }
  };

  // Handle create new transport request
  const handleCreateNewRequest = async () => {
    try {
      setGeneratingId(true);

      // Generate new request ID
      const { requestId, rowIndex } = await generateNewRequestId();

      // Save to state
      setCurrentRequestId(requestId);
      setCurrentRowIndex(rowIndex);

      // Reset form to initial state
      setNewTransportForm({
        // Thông tin cơ bản
        pickupLocation: '',
        selectedTransfers: new Set<string>(),
        status: 'in_transit',
        note: '',

        // New transport request fields
        originId: '',
        destinationIds: [],

        // Thông tin vận chuyển
        carrierName: '',
        carrierId: '',
        pricingMethod: 'perKm',
        vehicleType: '',
        estimatedCost: 0,

        // Thông tin tài xế
        driverId: '',
        driverName: '',
        driverPhone: '',
        driverLicense: '',

        // Hình ảnh và phòng ban
        loadingImages: '',
        department: '',

        // Định giá và phí phụ
        serviceArea: '',
        pricePerKm: 0,
        pricePerM3: 0,
        pricePerTrip: 0,
        stopFee: 0,
        fuelSurcharge: 0,
        tollFee: 0,
        insuranceFee: 0,
        baseRate: 0,
      });

      // Open dialog
      setEditing(null); // Make sure we're in create mode
      setOpen(true);
    } catch (error) {
      console.error('Failed to create new request:', error);
      alert('Không thể tạo yêu cầu mới. Vui lòng thử lại.');
    } finally {
      setGeneratingId(false);
    }
  };

  // Delete transport request
  const deleteTransportRequest = async (requestId: string): Promise<void> => {
    try {
      // Set timeout for the request (10 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `/api/transport-requests/${requestId}?spreadsheetId=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`,
        {
          method: 'DELETE',
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`⚠️ DELETE API failed: ${response.status}`, errorData);

        // If it's a quota error, we'll just log it and continue
        // The user said they can still load data despite quota errors
        if (response.status === 429 || errorData.error?.includes('Quota exceeded')) {
          console.log(`💡 Quota limit reached, but continuing (user confirmed data still loads)`);
          return; // Silently continue
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`✅ Đã xóa transport request: ${requestId}`);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn(`⏰ DELETE request timeout for ${requestId}`);
        // For timeout, we'll continue since the request might still be processing
        return;
      }

      console.error('Error deleting transport request:', error);

      // For range parsing errors (Google Sheets API issues), continue silently
      if (error.message.includes('Unable to parse range')) {
        console.log(`💡 Sheet API issue, but continuing (likely quota/range issue)`);
        return;
      }

      throw error;
    }
  };

  // Handle close dialog
  const handleCloseDialog = (shouldDelete: boolean = true) => {
    setClosingDialog(true);

    // Store requestId for deletion after dialog closes
    const requestToDelete = currentRequestId;
    const isNewRequest = !editing;

    // Reset request ID states immediately
    setCurrentRequestId(null);
    setCurrentRowIndex(null);

    // Reset form state
    setNewTransportForm({
      // Thông tin cơ bản
      pickupLocation: '',
      selectedTransfers: new Set<string>(),
      status: 'in_transit',
      note: '',

      // New transport request fields
      originId: '',
      destinationIds: [],

      // Thông tin vận chuyển
      carrierName: '',
      carrierId: '',
      pricingMethod: 'perKm',
      vehicleType: '',
      estimatedCost: 0,

      // Thông tin tài xế
      driverId: '',
      driverName: '',
      driverPhone: '',
      driverLicense: '',

      // Hình ảnh và phòng ban
      loadingImages: '',
      department: '',

      // Định giá và phí phụ
      serviceArea: '',
      pricePerKm: 0,
      pricePerM3: 0,
      pricePerTrip: 0,
      stopFee: 0,
      fuelSurcharge: 0,
      tollFee: 0,
      insuranceFee: 0,
      baseRate: 0,
    });

    // Reset editing state
    setEditing(null);

    // Reset selected stop point
    setSelectedStopPoints(new Set());
    setSelectedTransferInStop(null);

    // Close dialog first
    setOpen(false);
    setClosingDialog(false);

    // Then delete the request in background (if it's a new request)
    if (shouldDelete && requestToDelete && isNewRequest) {
      console.log(`🗑️ Sẽ xóa request ${requestToDelete} sau khi dialog đóng`);

      // Use setTimeout to ensure dialog is fully closed first
      setTimeout(async () => {
        try {
          console.log(`🗑️ Bắt đầu xóa request: ${requestToDelete}`);
          await deleteTransportRequest(requestToDelete);
          console.log(`✅ Đã xóa thành công request ${requestToDelete}`);
        } catch (error) {
          console.error('❌ Lỗi khi xóa request:', error);
          console.log('💡 Có thể cần xóa thủ công trên sheet nếu cần');
        }
      }, 500); // Wait 500ms for dialog to fully close
    } else {
      console.log('ℹ️ Không có request nào cần xóa', {
        requestToDelete,
        isNewRequest,
      });
    }
  };

  // Fetch transfers from API
  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        '/api/transfers?spreadsheetId=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As'
      );
      if (response.ok) {
        const data = await response.json();
        // Filter only transfers with transportStatus "Chờ chuyển giao"
        const pendingTransfers = data.filter(
          (transfer: Transfer) => transfer.transportStatus === 'Chờ chuyển giao'
        );

        // Convert transfers to transport requests format
        const convertedRequests = pendingTransfers.map((transfer: Transfer) => ({
          id: transfer.transfer_id,
          requestCode: transfer.orderCode,
          transferId: transfer.transfer_id,
          customerName: transfer.employee || 'Không xác định',
          customerPhone: '',
          pickupLocation: transfer.source,
          deliveryLocation: transfer.dest,
          pickupAddress: 'Kho trung tâm', // Default pickup address
          deliveryAddress: transfer.address
            ? `${transfer.address}, ${transfer.ward}, ${transfer.district}, ${transfer.province}`
            : transfer.dest,
          requestDate: transfer.date,
          pickupDate: transfer.date,
          deliveryDate: transfer.date,
          vehicleType: 'truck' as const, // Default vehicle type
          cargoType: transfer.hasVali || 'Hàng hóa',
          weight: 0, // Calculate based on volume if needed
          volume: parseFloat(transfer.totalVolume) || 0,
          status: transfer.transportStatus,
          carrierId: '',
          carrierName: '',
          driverName: '',
          driverPhone: '',
          estimatedCost: 0,
          actualCost: 0,
          note: transfer.note || '',
          totalPackages: parseInt(transfer.totalPackages) || 0,
          totalProducts: transfer.quantity || 'N/A',
          packageDetails: {
            pkgS: parseInt(transfer.pkgS) || 0,
            pkgM: parseInt(transfer.pkgM) || 0,
            pkgL: parseInt(transfer.pkgL) || 0,
            pkgBagSmall: parseInt(transfer.pkgBagSmall) || 0,
            pkgBagMedium: parseInt(transfer.pkgBagMedium) || 0,
            pkgBagLarge: parseInt(transfer.pkgBagLarge) || 0,
            pkgOther: parseInt(transfer.pkgOther) || 0,
          },
        }));
        setTransportRequests(convertedRequests);
      }
    } catch (error) {
      console.error('Error fetching transfers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations
  const fetchLocations = async () => {
    try {
      console.log('🔄 Fetching locations for distance calculation...');
      const response = await fetch('/api/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
        console.log(`✅ Locations loaded: ${data.length} locations`);
      } else {
        console.error('❌ Failed to fetch locations:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching locations:', error);
    }
  };

  // Auto-calculate distances when stop points change (logic cũ)
  useEffect(() => {
    if (selectedStopPoints.size > 0 && newTransportForm.pickupLocation) {
      calculateStopPointDistances();
    }
  }, [selectedStopPoints, newTransportForm.pickupLocation]);

  // Filter active locations only
  const activeLocations = useMemo(() => {
    const filtered = locations.filter((location) => location.status === 'active');
    console.log(`📍 Locations: ${locations.length} total, ${filtered.length} active`);
    return filtered;
  }, [locations]);

  // Sort locations by priority (Kho trung tâm first, then by usage frequency)
  const sortedActiveLocations = useMemo(() => {
    const sorted = [...activeLocations].sort((a, b) => {
      // Priority 1: Kho trung tâm (KTT) lên đầu - tỷ lệ sử dụng cao nhất
      const aIsCentral = a.code.includes('KTT');
      const bIsCentral = b.code.includes('KTT');

      if (aIsCentral && !bIsCentral) return -1;
      if (!aIsCentral && bIsCentral) return 1;

      // Priority 2: Cửa hàng - tỷ lệ sử dụng cao
      const aIsStore = a.category === 'Cửa hàng';
      const bIsStore = b.category === 'Cửa hàng';

      if (aIsStore && !bIsStore) return -1;
      if (!aIsStore && bIsStore) return 1;

      // Priority 3: Kho hàng hệ thống - tỷ lệ sử dụng thấp
      const aIsWarehouse = a.category === 'Kho hàng hệ thống';
      const bIsWarehouse = b.category === 'Kho hàng hệ thống';

      if (aIsWarehouse && !bIsWarehouse) return -1;
      if (!aIsWarehouse && bIsWarehouse) return 1;

      // Priority 4: Hội chợ - tỷ lệ sử dụng thấp nhất
      const aIsFair = a.category === 'Hội chợ';
      const bIsFair = b.category === 'Hội chợ';

      if (aIsFair && !bIsFair) return -1;
      if (!aIsFair && bIsFair) return 1;

      // Priority 5: Alphabetical by code
      return a.code.localeCompare(b.code);
    });

    console.log(
      `📊 Sorted locations by priority:`,
      sorted.map((l) => `${l.code} (${l.category})`)
    );
    return sorted;
  }, [activeLocations]);

  // Group locations by category (using sorted locations)
  const groupedLocations = useMemo(() => {
    const groups: Record<string, Location[]> = {};

    sortedActiveLocations.forEach((location) => {
      const category = location.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(location);
    });

    console.log(`📂 Grouped locations:`, Object.keys(groups));
    return groups;
  }, [sortedActiveLocations]);

  // Auto-select pickup location based on selected transfers
  const autoSelectPickupLocation = useCallback(() => {
    if (newTransportForm.selectedTransfers.size === 0) {
      // If no transfers selected, set default to first sorted location (Kho trung tâm priority)
      if (!newTransportForm.pickupLocation && sortedActiveLocations.length > 0) {
        const defaultLocation = sortedActiveLocations[0];
        console.log(
          `🎯 Setting default pickup location: ${defaultLocation.code} (${defaultLocation.category})`
        );
        setNewTransportForm((prev) => ({
          ...prev,
          pickupLocation: defaultLocation.id,
        }));
      }
      return;
    }

    // Get all selected transfers
    const selectedTransferIds = Array.from(newTransportForm.selectedTransfers);
    const selectedTransfers = transportRequests.filter((t) => selectedTransferIds.includes(t.id));

    if (selectedTransfers.length === 0) {
      return;
    }

    // Find the most common pickup location among selected transfers
    const pickupCounts: Record<string, number> = {};
    selectedTransfers.forEach((transfer) => {
      const pickupLocation = transfer.pickupLocation;
      if (pickupLocation) {
        pickupCounts[pickupLocation] = (pickupCounts[pickupLocation] || 0) + 1;
      }
    });

    // Find the location with highest count
    const mostCommonPickup = Object.entries(pickupCounts).sort(([, a], [, b]) => b - a)[0]?.[0];

    // Only auto-select if the pickup location exists in our locations list
    if (
      mostCommonPickup &&
      mostCommonPickup !== newTransportForm.pickupLocation &&
      locations.some((loc) => loc.id === mostCommonPickup)
    ) {
      console.log(
        `🎯 Auto-selecting pickup location: ${mostCommonPickup} (${pickupCounts[mostCommonPickup]} transfers)`
      );
      setNewTransportForm((prev) => ({
        ...prev,
        pickupLocation: mostCommonPickup,
      }));
    }
  }, [
    newTransportForm.selectedTransfers,
    transportRequests,
    newTransportForm.pickupLocation,
    sortedActiveLocations,
  ]);

  // Auto-select pickup location when selected transfers change
  useEffect(() => {
    autoSelectPickupLocation();
  }, [autoSelectPickupLocation]);

  // Auto-calculate total distance when pickup location and stop points are selected
  // Distance calculation is now handled by useDistanceCalculation hook

  // Filter transfers based on selected pickup location
  const filteredTransfers = useMemo(() => {
    if (!newTransportForm.pickupLocation) {
      return transportRequests;
    }

    const filtered = transportRequests.filter(
      (transfer) => transfer.pickupLocation === newTransportForm.pickupLocation
    );

    console.log(
      `🔍 Filtered transfers for location ${newTransportForm.pickupLocation}: ${filtered.length}/${transportRequests.length}`
    );
    return filtered;
  }, [transportRequests, newTransportForm.pickupLocation]);

  // Clear selected transfers when pickup location changes
  const handlePickupLocationChange = useCallback(
    (locationId: string) => {
      setNewTransportForm((prev) => {
        const newForm = {
          ...prev,
          pickupLocation: locationId,
        };

        // Clear selected transfers if location changed
        if (prev.pickupLocation !== locationId) {
          console.log(
            `🔄 Location changed from ${prev.pickupLocation} to ${locationId}, clearing selected transfers`
          );
          newForm.selectedTransfers = new Set<string>();

          // Also clear selected stop points when location changes
          setSelectedStopPoints(new Set());
          setSelectedTransferInStop(null);
        }

        return newForm;
      });

      // Clear validation error
      if (validationErrors.pickupLocation) {
        setValidationErrors((prev) => ({ ...prev, pickupLocation: undefined }));
      }
    },
    [validationErrors.pickupLocation]
  );

  // Functions xử lý thêm điểm nguồn
  const handleAddLocationTypeSelect = (type: 'system' | 'temporary') => {
    setAddLocationType(type);
  };

  const handleSaveSystemLocation = async () => {
    if (!newSystemLocation.code?.trim()) {
      alert('Vui lòng nhập mã địa điểm');
      return;
    }

    setSavingLocation(true);
    try {
      const SHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
      const url = `/api/locations?spreadsheetId=${encodeURIComponent(SHEET_ID)}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newSystemLocation.code,
          avatar: '🏢',
          category: newSystemLocation.category,
          subcategory: newSystemLocation.subcategory,
          address: newSystemLocation.address,
          status: 'active',
          ward: newSystemLocation.ward,
          district: newSystemLocation.district,
          province: newSystemLocation.province,
          note: newSystemLocation.note,
        }),
      });

      if (response.ok) {
        // Refresh locations data
        fetchLocations();

        // Set as selected location (will be updated after fetchLocations)
        setTimeout(() => {
          const newLocation = locations.find((loc) => loc.code === newSystemLocation.code);
          if (newLocation) {
            setNewTransportForm((prev) => ({
              ...prev,
              pickupLocation: newLocation.id,
            }));
          }
        }, 500);

        // Close dialog
        setShowAddLocationDialog(false);
        setAddLocationType(null);

        alert('✅ Đã thêm điểm nguồn mới vào hệ thống');
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.error || 'Không thể lưu địa điểm'}`);
      }
    } catch (error) {
      console.error('❌ Error saving system location:', error);
      alert('❌ Lỗi kết nối server');
    } finally {
      setSavingLocation(false);
    }
  };

  const handleSaveTemporaryLocation = () => {
    try {
      // Create temporary location object
      const tempLocation: Location = {
        id: `temp-${getVietnamTime().getTime()}`,
        code: `TEMP-${getVietnamTime().getTime()}`,
        avatar: '',
        category: 'Điểm tạm',
        subcategory: '',
        address: newTemporaryLocation.address,
        status: 'active',
        ward: newTemporaryLocation.ward,
        district: newTemporaryLocation.district,
        province: newTemporaryLocation.province,
        note: 'Điểm nguồn tạm thời cho chuyến này',
      };

      // Add to local state temporarily (not saved to sheet)
      setLocations((prev) => [...prev, tempLocation]);

      // Set as selected location
      setNewTransportForm((prev) => ({
        ...prev,
        pickupLocation: tempLocation.id,
      }));

      // Close dialog
      setShowAddLocationDialog(false);
      setAddLocationType(null);

      alert('✅ Đã thêm điểm nguồn tạm thời');
    } catch (error) {
      console.error('❌ Error creating temporary location:', error);
      alert('❌ Lỗi khi tạo điểm nguồn tạm. Vui lòng thử lại.');
    }
  };

  const handleCloseAddLocationDialog = () => {
    setShowAddLocationDialog(false);
    setAddLocationType(null);
    setNewSystemLocation({
      code: '',
      avatar: '🏢',
      category: 'Cửa hàng',
      subcategory: '',
      address: '',
      ward: '',
      district: '',
      province: 'TP. Hồ Chí Minh',
      note: '',
    });
    setNewTemporaryLocation({
      address: '',
      ward: '',
      district: '',
      province: '',
    });
  };

  // Fetch carriers
  const fetchCarriers = async () => {
    try {
      console.log('🔄 Frontend: Fetching carriers...');
      const response = await fetch(
        '/api/carriers?spreadsheetId=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As'
      );

      console.log('📊 Frontend: Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📋 Frontend: Raw carriers data:', data.length, 'carriers');
        console.log('📋 Frontend: Sample carrier:', data[0]);

        // Handle different isActive formats
        const activeCarriers = data.filter((carrier: Carrier) => {
          const isActive = carrier.isActive;
          const isActiveString = String(isActive).toUpperCase();

          // If isActive is a timestamp (contains 'T' or is a date), consider it as active
          if (
            isActiveString.includes('T') ||
            isActiveString.includes('-') ||
            isActiveString.includes(':')
          ) {
            return true;
          }

          return isActiveString === 'TRUE' || isActiveString === '1';
        });

        console.log('✅ Frontend: Active carriers:', activeCarriers.length, 'carriers');
        console.log('📋 Frontend: Active carriers sample:', activeCarriers.slice(0, 2));

        setCarriers(activeCarriers);
      } else {
        const errorText = await response.text();
        console.error('❌ Frontend: API error:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Frontend: Network error fetching carriers:', error);
    }
  };

  useEffect(() => {
    fetchTransfers();
    fetchLocations();
    fetchCarriers();
  }, []);

  // Load user info for createdBy field
  useEffect(() => {
    const session = getSession();
    if (session?.user?.fullName) {
      setCreatedBy(session.user.fullName);
    }
  }, []);

  // Auto-update productQuantity when total packages change (only if not manually set)
  useEffect(() => {
    if (!isProductQuantityManuallySet) {
      const totalPackages = Object.values(packageCounts).reduce(
        (sum, count) => sum + (count || 0),
        0
      );
      setProductQuantity(totalPackages);
    }
  }, [packageCounts, isProductQuantityManuallySet]);

  // Pagination handlers
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelectedItems(new Set());
  };

  // Reset selection khi thay đổi bộ lọc hoặc số dòng/trang
  useEffect(() => {
    setPage(0);
    setSelectedItems(new Set());
  }, [filters, rowsPerPage]);

  // Filter data
  const filteredRequests = transportRequests.filter((request) => {
    const matchesSearch =
      (request.requestCode || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (request.customerName || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (request.pickupLocation || '').toLowerCase().includes(filters.search.toLowerCase()) ||
      (request.deliveryLocation || '').toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || getStatusLabel(request.status) === filters.status;
    const matchesVehicleType = !filters.vehicleType || request.vehicleType === filters.vehicleType;
    const matchesCustomerName =
      !filters.customerName ||
      (request.customerName || '').toLowerCase().includes(filters.customerName.toLowerCase());

    return matchesSearch && matchesStatus && matchesVehicleType && matchesCustomerName;
  });

  // Get paginated data
  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle checkbox selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(paginatedRequests.map((item) => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  // Group transfers by delivery address
  const getDeliveryPoints = (): DeliveryPoint[] => {
    const deliveryMap = new Map<string, DeliveryPoint>();

    // Use filteredTransfers instead of transportRequests
    const transfersToShow = filteredTransfers.length > 0 ? filteredTransfers : transportRequests;

    transfersToShow.forEach((request) => {
      const address = request.deliveryAddress || 'Địa chỉ không xác định';
      if (!deliveryMap.has(address)) {
        deliveryMap.set(address, {
          address,
          transfers: [],
          totalPackages: 0,
          totalVolume: 0,
          totalProducts: 0,
          transferCount: 0,
        });
      }

      const point = deliveryMap.get(address)!;
      point.transfers.push(request);
      point.totalPackages += request.totalPackages || 0;
      point.totalVolume += request.volume || 0;
      // Tính tổng số sản phẩm từ trường quantity
      const productCount = parseInt(request.totalProducts) || 0;
      point.totalProducts += productCount;
      point.transferCount += 1;
    });

    return Array.from(deliveryMap.values());
  };

  // Helper function to format delivery address with destination info
  const formatDeliveryAddress = (address: string, deliveryLocation: string) => {
    return deliveryLocation;
  };

  // Function tính khoảng cách cho từng điểm dừng (sử dụng custom hook)
  const calculateStopPointDistances = async () => {
    if (!newTransportForm.pickupLocation || selectedStopPoints.size === 0) {
      return;
    }

    console.log('🔍 Calculating distances...');

    // Đảm bảo locations đã được load
    if (!locations || locations.length === 0) {
      console.log('🔄 Locations chưa được load, đang fetch...');
      await fetchLocations();
      return; // Sẽ được gọi lại sau khi locations được load
    }

    console.log('🔍 Calculating distances with locations:', locations.length);

    const result = await calculateStopDistances(
      newTransportForm.pickupLocation,
      selectedStopPoints,
      stopPoints,
      locations
    );

    if (result.error) {
      console.error('❌ Error calculating distances:', result.error);
      setSnackbar({
        open: true,
        message: `Lỗi tính khoảng cách: ${result.error}`,
        severity: 'error',
      });
    } else {
      console.log('✅ Distances calculated successfully:', result.distances);
    }
  };

  // Test Google Apps Script connectivity
  const testGoogleAppsScript = async () => {
    console.log('🧪 Testing Google Apps Script connectivity...');
    setSnackbar({
      open: true,
      message: '🔄 Đang kiểm tra kết nối Google Apps Script...',
      severity: 'info',
    });

    try {
      const { DistanceService } = await import('../../../services/distanceService');
      const isConnected = await DistanceService.testConnectivity();

      if (isConnected) {
        setSnackbar({
          open: true,
          message: '✅ Google Apps Script hoạt động bình thường!',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: '❌ Google Apps Script không thể kết nối. Vui lòng kiểm tra cấu hình.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('❌ Test failed:', error);
      setSnackbar({
        open: true,
        message: `❌ Lỗi kiểm tra: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    }
  };

  const handleDelete = async (request: TransportRequest) => {
    setDeletingId(request.id || '');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTransportRequests((prev) => prev.filter((r) => r.id !== (request.id || '')));
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTransfers();
    } finally {
      setRefreshing(false);
    }
  };

  // New transport request handlers
  const handleNewTransportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNewTransportMenuAnchor(event.currentTarget);
  };

  const handleNewTransportMenuClose = () => {
    setNewTransportMenuAnchor(null);
  };

  const handleNewTransportTypeSelect = (type: 'system' | 'external') => {
    setNewTransportType(type);
    setNewTransportDialogOpen(true);
    handleNewTransportMenuClose();

    // Load volume rules for "Từ hệ thống"
    if (type === 'system') {
      loadVolumeRules();
    }
  };

  const handleNewTransportDialogClose = () => {
    setNewTransportDialogOpen(false);
    setNewTransportType(null);
    setDestinationSelectOpen(false);
    setNewTransportForm((prev) => ({
      ...prev,
      originId: '',
      destinationIds: [],
      note: '',
    }));
    // Reset package counts
    setPackageCounts({});
    // Reset new fields
    setTransportStatus('Chờ xác nhận');
    setShippingStatus('Đã báo kiện');
    setDepartment('');
    setRequestDate(() => {
      const now = new Date();
      return `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    });
    setHasLuggage('Không vali');
    setProductQuantity(0);
    setIsProductQuantityManuallySet(false);
    // Reset external destinations
    setExternalDestinations(() =>
      Array.from({ length: 1 }, (_, i) => ({
        id: i + 1,
        address: '',
        customerName: '',
        customerPhone: '',
        productName: '',
        productQuantity: 0,
        productWeight: 0,
        productVolume: 0,
        notes: '',
      }))
    );
  };

  // Kiểm tra địa điểm có trong hệ thống không
  const isLocationInSystem = (locationId: string) => {
    return locations.some((location) => location.id === locationId);
  };

  // Kiểm tra loại đề nghị có hợp lệ không
  const validateTransportType = () => {
    if (!newTransportType) return false;

    const originInSystem = isLocationInSystem(newTransportForm.originId);
    const allDestinationsInSystem = newTransportForm.destinationIds.every((id) =>
      isLocationInSystem(id)
    );

    if (newTransportType === 'system') {
      // Từ hệ thống: điểm đi và tất cả điểm đến phải trong Locations
      return (
        originInSystem && allDestinationsInSystem && newTransportForm.destinationIds.length > 0
      );
    } else {
      // Ngoài hệ thống: ít nhất 1 điểm không trong Locations
      return !originInSystem || !allDestinationsInSystem;
    }
  };

  // Load volume rules for package reporting
  const loadVolumeRules = async () => {
    try {
      const response = await fetch('/api/settings/volume-rules');
      if (response.ok) {
        const data = await response.json();
        const mapped = data.map((r: any) => ({
          id: String(r.id || ''),
          name: String(r.name || ''),
          unitVolume: parseFloat(r.unitVolume) || 0,
        }));
        setVolumeRules(mapped);
        console.log('Loaded volume rules:', mapped);
      } else {
        console.error('Failed to load volume rules:', response.status);
      }
    } catch (error) {
      console.error('Error loading volume rules:', error);
    }
  };

  // Tạo đề nghị vận chuyển
  const handleCreateTransportProposal = async () => {
    // Validation chung
    if (!department) {
      setSnackbar({
        open: true,
        message: 'Vui lòng chọn phòng ban sử dụng',
        severity: 'error',
      });
      return;
    }

    // Validation cho số lượng sản phẩm (chỉ cho "Từ hệ thống")
    if (newTransportType === 'system') {
      const totalPackages = Object.values(packageCounts).reduce(
        (sum, count) => sum + (count || 0),
        0
      );
      if (productQuantity < totalPackages) {
        setSnackbar({
          open: true,
          message: `Số lượng sản phẩm (${productQuantity}) phải lớn hơn hoặc bằng tổng số kiện (${totalPackages})`,
          severity: 'error',
        });
        return;
      }
    }

    // Validation cho "Từ hệ thống"
    if (newTransportType === 'system') {
      if (!newTransportForm.originId || newTransportForm.destinationIds.length === 0) {
        setSnackbar({
          open: true,
          message: 'Vui lòng chọn đầy đủ điểm đi và điểm đến',
          severity: 'error',
        });
        return;
      }

      if (newTransportForm.originId === newTransportForm.destinationIds[0]) {
        setSnackbar({
          open: true,
          message: 'Điểm đi và điểm đến không được trùng nhau',
          severity: 'error',
        });
        return;
      }
    }

    // Validation cho "Ngoài hệ thống"
    if (newTransportType === 'external') {
      const filledDestinations = externalDestinations.filter((dest) => dest.address.trim() !== '');
      if (filledDestinations.length === 0) {
        setSnackbar({
          open: true,
          message: 'Vui lòng nhập địa chỉ điểm đến',
          severity: 'error',
        });
        return;
      }
    }

    if (!validateTransportType()) {
      setSnackbar({
        open: true,
        message:
          newTransportType === 'system'
            ? 'Tất cả địa điểm phải nằm trong hệ thống (Locations sheet)'
            : 'Ít nhất 1 địa điểm phải nằm ngoài hệ thống',
        severity: 'warning',
      });
      return;
    }

    setCreatingTransportRequest(true);
    try {
      const response = await fetch('/api/transport-proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newTransportType,
          originId: newTransportForm.originId,
          destinationIds: newTransportForm.destinationIds,
          note: newTransportForm.note,
          // New fields
          transportStatus,
          shippingStatus,
          department,
          requestDate,
          hasLuggage,
          createdBy,
          productQuantity,
          // Package information for "Từ hệ thống"
          ...(newTransportType === 'system' && {
            packages: packageCounts,
            totalPackages: Object.values(packageCounts).reduce(
              (sum, count) => sum + (count || 0),
              0
            ),
            totalVolume: volumeRules.reduce((sum, rule) => {
              const count = packageCounts[rule.id] || 0;
              return sum + count * rule.unitVolume;
            }, 0),
          }),
          // External destinations for "Ngoài hệ thống"
          ...(newTransportType === 'external' && {
            externalDestinations: externalDestinations.filter((dest) => dest.address.trim() !== ''),
          }),
        }),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Đề nghị vận chuyển đã được tạo thành công!',
          severity: 'success',
        });
        handleNewTransportDialogClose();
      } else {
        throw new Error('Failed to create transport proposal');
      }
    } catch (error) {
      console.error('Error creating transport proposal:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tạo đề nghị vận chuyển. Vui lòng thử lại.',
        severity: 'error',
      });
    } finally {
      setCreatingTransportRequest(false);
    }
  };

  function getStatusLabel(status: string): string {
    switch ((status || '').toLowerCase()) {
      // === TRẠNG THÁI PHIẾU (4 loại) ===
      case 'đề nghị chuyển kho':
      case 'xuất chuyển kho':
      case 'nhập chuyển kho':
      case 'đã hủy':
        return status;

      // === TRẠNG THÁI VẬN CHUYỂN (9 loại) ===
      case 'pending':
      case 'chờ xử lý':
        return 'Chờ chuyển giao';
      case 'chờ báo kiện':
        return 'Chờ báo kiện';
      case 'chờ chuyển giao':
        return 'Chờ chuyển giao';
      case 'in_transit':
      case 'đang thực hiện':
      case 'đang chuyển giao':
      case 'đang vận chuyển':
        return 'Đang chuyển giao';
      case 'delivered':
      case 'đã giao hàng':
      case 'đã chuyển giao':
        return 'Đã giao hàng';
      case 'confirmed':
      case 'đã xác nhận':
        return 'Đã xác nhận';
      case 'chờ xác nhận':
        return 'Chờ xác nhận';
      case 'completed':
      case 'hoàn thành':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';

      default:
        return status;
    }
  }

  const getPricingMethodLabel = (method: string) => {
    switch (method) {
      case 'PER_KM':
        return 'Theo km';
      case 'PER_TRIP':
        return 'Theo chuyến';
      case 'PER_M3':
        return 'Theo khối';
      default:
        return method;
    }
  };

  const shouldShowVehicleType = (pricingMethod: string) => {
    return pricingMethod !== 'PER_M3'; // Không hiển thị loại xe nếu tính theo khối
  };

  // Nhóm carriers theo tên
  const groupedCarriers = useMemo(() => {
    console.log('🔄 Frontend: Grouping carriers, total carriers:', carriers.length);
    const groups: { [key: string]: Carrier[] } = {};
    carriers.forEach((carrier) => {
      if (!groups[carrier.name]) {
        groups[carrier.name] = [];
      }
      groups[carrier.name].push(carrier);
    });
    console.log('✅ Frontend: Grouped carriers:', Object.keys(groups));
    return groups;
  }, [carriers]);

  const safeParseNumber = (value: unknown): number => {
    if (value === null || value === undefined) {
      return 0;
    }
    const stringValue = String(value).trim();
    if (!stringValue) {
      return 0;
    }

    const cleanedValue = stringValue.replace(/[^\d.,-]/g, '');
    if (!cleanedValue) {
      return 0;
    }

    if (cleanedValue.includes(',') && cleanedValue.includes('.')) {
      const normalized = cleanedValue.replace(/,/g, '').replace(/\.(?=.*\.)/g, '');
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    if (cleanedValue.includes(',')) {
      const parts = cleanedValue.split(',');
      if (parts.length === 2 && parts[1].length <= 2) {
        const parsed = Number(cleanedValue.replace(',', '.'));
        return Number.isFinite(parsed) ? parsed : 0;
      }
      const parsed = Number(cleanedValue.replace(/,/g, ''));
      return Number.isFinite(parsed) ? parsed : 0;
    }

    const parsed = Number(cleanedValue);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  type CarrierPricingFields = Pick<
    NewTransportForm,
    | 'carrierId'
    | 'pricingMethod'
    | 'pricePerKm'
    | 'pricePerTrip'
    | 'pricePerM3'
    | 'baseRate'
    | 'stopFee'
    | 'fuelSurcharge'
    | 'tollFee'
    | 'insuranceFee'
  >;

  const emptyCarrierPricing: CarrierPricingFields = useMemo(
    () => ({
      carrierId: '',
      pricingMethod: 'perKm',
      pricePerKm: 0,
      pricePerTrip: 0,
      pricePerM3: 0,
      baseRate: 0,
      stopFee: 0,
      fuelSurcharge: 0,
      tollFee: 0,
      insuranceFee: 0,
    }),
    []
  );

  const carrierPricingDraft = useMemo<CarrierPricingFields>(() => {
    if (!newTransportForm.carrierName) {
      return emptyCarrierPricing;
    }

    const variants = groupedCarriers[newTransportForm.carrierName];
    if (!variants || variants.length === 0) {
      return emptyCarrierPricing;
    }

    const desiredSheetMethod =
      FORM_TO_SHEET_PRICING_METHOD[newTransportForm.pricingMethod] ?? 'PER_KM';

    let bestCarrier = variants[0];
    let bestScore = -Infinity;

    variants.forEach((variant) => {
      let score = 0;

      if (!desiredSheetMethod || variant.pricingMethod === desiredSheetMethod) {
        score += desiredSheetMethod ? 5 : 1;
      }

      if (newTransportForm.vehicleType) {
        const vehicleTypes = variant.vehicleTypes
          ?.split(',')
          .map((v) => v.trim())
          .filter(Boolean);
        if (vehicleTypes?.includes(newTransportForm.vehicleType)) {
          score += 2;
        }
      }

      if (newTransportForm.serviceArea) {
        const serviceAreas = variant.serviceAreas
          ?.split(',')
          .map((v) => v.trim())
          .filter(Boolean);
        if (serviceAreas?.includes(newTransportForm.serviceArea)) {
          score += 1;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestCarrier = variant;
      }
    });

    const hasDesiredMethod =
      !!desiredSheetMethod &&
      variants.some((variant) => variant.pricingMethod === desiredSheetMethod);

    const resolvedFormMethod: FormPricingMethod = hasDesiredMethod
      ? newTransportForm.pricingMethod
      : (SHEET_TO_FORM_PRICING_METHOD[bestCarrier.pricingMethod] ?? 'perKm');

    return {
      carrierId: bestCarrier.carrierId || '',
      pricingMethod: resolvedFormMethod,
      pricePerKm: safeParseNumber(bestCarrier.perKmRate),
      pricePerTrip: safeParseNumber(bestCarrier.perTripRate),
      pricePerM3: safeParseNumber(bestCarrier.perM3Rate),
      baseRate: safeParseNumber(bestCarrier.baseRate),
      stopFee: safeParseNumber(bestCarrier.stopFee),
      fuelSurcharge: safeParseNumber(bestCarrier.fuelSurcharge),
      tollFee: safeParseNumber(bestCarrier.remoteAreaFee),
      insuranceFee: safeParseNumber(bestCarrier.insuranceRate),
    };
  }, [
    emptyCarrierPricing,
    groupedCarriers,
    newTransportForm.carrierName,
    newTransportForm.pricingMethod,
    newTransportForm.vehicleType,
    newTransportForm.serviceArea,
  ]);

  const PRICING_FIELD_KEYS: Array<keyof CarrierPricingFields> = useMemo(
    () => [
      'carrierId',
      'pricingMethod',
      'pricePerKm',
      'pricePerTrip',
      'pricePerM3',
      'baseRate',
      'stopFee',
      'fuelSurcharge',
      'tollFee',
      'insuranceFee',
    ],
    []
  );

  useEffect(() => {
    setNewTransportForm((prev) => {
      let shouldUpdate = false;
      const next: NewTransportForm = { ...prev };

      PRICING_FIELD_KEYS.forEach((field) => {
        const fieldKey = field as keyof NewTransportForm;
        const draftValue = carrierPricingDraft[field];
        if (next[fieldKey] !== draftValue) {
          shouldUpdate = true;
          next[fieldKey] = draftValue as never;
        }
      });

      return shouldUpdate ? next : prev;
    });
  }, [PRICING_FIELD_KEYS, carrierPricingDraft]);

  // Lấy danh sách phương thức tính tiền của nhà vận chuyển đã chọn
  const getPricingMethodsForCarrier = (carrierName: string) => {
    console.log('🔍 Debug getPricingMethodsForCarrier:', carrierName);
    console.log('🔍 Debug groupedCarriers:', groupedCarriers);

    if (!groupedCarriers[carrierName]) {
      console.log('❌ No carriers found for:', carrierName);
      return [];
    }

    const methods = [...new Set(groupedCarriers[carrierName].map((c) => c.pricingMethod))];
    console.log('✅ Available pricing methods for', carrierName, ':', methods);
    return methods;
  };

  // Lấy danh sách loại xe từ carriers theo phương thức tính tiền
  const getVehicleTypesForPricingMethod = (carrierName: string, pricingMethod: string) => {
    if (!groupedCarriers[carrierName]) return [];

    // Map form format to sheet format for comparison
    const pricingMethodMap: { [key: string]: string } = {
      perKm: 'PER_KM',
      perM3: 'PER_M3',
      perTrip: 'PER_TRIP',
    };

    const sheetPricingMethod = pricingMethodMap[pricingMethod] || pricingMethod;

    const carriersWithMethod = groupedCarriers[carrierName].filter(
      (c) => c.pricingMethod === sheetPricingMethod
    );

    console.log(
      '🔍 Frontend: Getting vehicle types for',
      carrierName,
      pricingMethod,
      '(sheet format:',
      sheetPricingMethod,
      ')'
    );
    console.log('📋 Frontend: Carriers with method:', carriersWithMethod.length);

    const vehicleTypes = carriersWithMethod
      .map((c) => c.vehicleTypes)
      .filter((type) => {
        // Filter out empty, null, undefined, "0", "null", "undefined"
        if (!type || type === '0' || type === 'null' || type === 'undefined') {
          return false;
        }
        return true;
      })
      .filter((type, index, arr) => arr.indexOf(type) === index); // Loại bỏ trùng lặp

    console.log('✅ Frontend: Extracted vehicle types:', vehicleTypes);

    return vehicleTypes;
  };

  // Lấy danh sách khu vực phục vụ từ carriers theo nhà vận chuyển và phương thức tính tiền
  const getServiceAreasForCarrierAndMethod = (carrierName: string, pricingMethod: string) => {
    if (!carrierName || !pricingMethod) return [];

    // Map form format to sheet format for comparison
    const pricingMethodMap: { [key: string]: string } = {
      perKm: 'PER_KM',
      perM3: 'PER_M3',
      perTrip: 'PER_TRIP',
    };

    const sheetPricingMethod = pricingMethodMap[pricingMethod] || pricingMethod;

    // Lọc carriers theo điều kiện
    const filteredCarriers = carriers.filter((carrier) => {
      const isActive = carrier.isActive;
      const isActiveString = String(isActive).toUpperCase();

      // If isActive is a timestamp (contains 'T' or is a date), consider it as active
      const isActiveCarrier =
        isActiveString.includes('T') ||
        isActiveString.includes('-') ||
        isActiveString.includes(':') ||
        isActiveString === 'TRUE' ||
        isActiveString === '1';

      return (
        carrier.name === carrierName &&
        carrier.pricingMethod === sheetPricingMethod &&
        isActiveCarrier
      ); // Chỉ lấy những carrier đang hoạt động
    });

    // Lấy danh sách service areas và loại bỏ trùng lặp
    const serviceAreas = filteredCarriers
      .map((c) => c.serviceAreas)
      .filter(Boolean) // Loại bỏ các giá trị rỗng
      .filter((area, index, arr) => arr.indexOf(area) === index); // Loại bỏ trùng lặp

    return serviceAreas;
  };

  // Validate trước khi submit: trả về { ok, messages }
  const validateTransportSubmission = (): {
    ok: boolean;
    messages: string[];
  } => {
    const messages: string[] = [];

    const hasPickup = !!newTransportForm.pickupLocation;
    if (!hasPickup) messages.push('Thiếu: Điểm nguồn');

    const hasCarrier = !!newTransportForm.carrierName;
    if (!hasCarrier) messages.push('Thiếu: Nhà vận chuyển');

    const hasMethod = !!newTransportForm.pricingMethod;
    if (!hasMethod) messages.push('Thiếu: Phương thức tính tiền');

    const hasVehicle = !!newTransportForm.vehicleType;
    if (!hasVehicle) messages.push('Thiếu: Loại xe');

    const hasServiceArea = !!newTransportForm.serviceArea;
    if (!hasServiceArea) messages.push('Thiếu: Khu vực phục vụ');

    const hasDepartment = !!newTransportForm.department;
    if (!hasDepartment) messages.push('Thiếu: Phòng ban phục vụ');

    const stopCount = selectedStopPoints ? selectedStopPoints.size : 0;
    if (!(stopCount > 0)) messages.push('Điểm dừng phải > 0');

    const selected = transportRequests.filter((t) => newTransportForm.selectedTransfers.has(t.id));
    const transferCount = newTransportForm.selectedTransfers.size || 0;
    if (!(transferCount > 0)) messages.push('Số phiếu điểm dừng phải > 0');

    const totalPackagesSelected = selected.reduce((sum, t) => sum + (t.totalPackages || 0), 0);
    if (!(totalPackagesSelected > 0)) messages.push('Số kiện phải > 0');

    const totalVolumeSelected = selected.reduce((sum, t) => sum + (t.volume || 0 || 0), 0);
    if (!(totalVolumeSelected > 0)) messages.push('Số khối (m³) phải > 0');

    const distanceOk =
      newTransportForm.pricingMethod === 'perKm'
        ? Object.values(stopPointDistances).reduce((sum, distance) => sum + distance, 0) > 0
        : true;
    if (!distanceOk) messages.push('Chiều dài quãng đường (km) phải > 0');

    return { ok: messages.length === 0, messages };
  };

  // Submit new transport request to sheet
  const handleSubmitNewRequest = async (): Promise<void> => {
    if (!currentRequestId) {
      setSnackbar({
        open: true,
        message: 'Chưa có mã yêu cầu. Hãy bấm "Đặt xe mới" trước.',
        severity: 'warning',
      });
      return;
    }

    // Kiểm tra số điểm dừng (ít nhất 1, tối đa 10)
    const stopCount = selectedStopPoints.size;
    if (stopCount === 0) {
      setSnackbar({
        open: true,
        message: '⚠️ Vui lòng chọn ít nhất 1 điểm dừng để tạo đề nghị vận chuyển!',
        severity: 'warning',
      });
      return;
    }

    if (stopCount > 10) {
      setSnackbar({
        open: true,
        message: '⚠️ Số điểm dừng vượt quá giới hạn (tối đa 10 điểm). Vui lòng giảm số điểm dừng!',
        severity: 'warning',
      });
      return;
    }

    const v = validateTransportSubmission();
    if (!v.ok) {
      setSnackbar({
        open: true,
        message: `Thiếu thông tin: ${v.messages.join(' • ')}`,
        severity: 'warning',
      });
      return;
    }

    setSubmittingRequest(true);

    // Hiển thị thông báo đang xử lý
    setSnackbar({
      open: true,
      message: '🔄 Đang xử lý yêu cầu vận chuyển...',
      severity: 'info',
    });

    // Đảm bảo khoảng cách đã được tính xong (chỉ nếu chưa tính)
    if (
      selectedStopPoints.size > 0 &&
      newTransportForm.pickupLocation &&
      Object.keys(stopPointDistances).length === 0
    ) {
      console.log('🔄 Đang tính khoảng cách...');
      await calculateStopPointDistances();
    }

    try {
      // Tính tổng số kiện và tổng khối từ các phiếu đã chọn
      const selected = transportRequests.filter((t) =>
        newTransportForm.selectedTransfers.has(t.id)
      );
      const totalPackages = selected.reduce((sum, t) => sum + t.totalPackages, 0);
      const totalVolume = selected.reduce((sum, t) => sum + t.volume || 0, 0);

      // Lấy địa chỉ điểm nguồn nếu có
      const pickup = locations.find((loc) => loc.id === newTransportForm.pickupLocation);
      const pickupAddress = pickup ? `${pickup.code} - ${pickup.address}` : '';

      // Lấy địa chỉ, mã nguồn (MN), số kiện, khối lượng, khoảng cách, số phiếu, sản phẩm và transfer_ids các điểm dừng từ stopPoints
      const stopAddresses: Record<string, string> = {};
      const stopMNs: Record<string, string> = {};
      const stopPackages: Record<string, number> = {};
      const stopVolumes: Record<string, number> = {};
      const stopDistances: Record<string, number> = {};
      const stopOrderCounts: Record<string, number> = {};
      const stopProducts: Record<string, string> = {};
      const stopTransferIds: Record<string, string> = {};
      console.log('🔍 DEBUG - stopPoints:', stopPoints);
      console.log('🔍 DEBUG - selectedStopPoints:', Array.from(selectedStopPoints));

      Array.from(selectedStopPoints).forEach((stopKey, index) => {
        const stopPoint = stopPoints[stopKey];
        console.log(`🔍 DEBUG - Processing stop ${index + 1}:`, {
          stopKey,
          stopPoint,
          stopPointExists: !!stopPoint,
        });

        if (stopPoint) {
          stopAddresses[`stop${index + 1}Address`] = stopPoint.address;

          // Lấy mã nguồn (MN) từ tiêu đề điểm dừng
          // Ví dụ: "MIA23/MIA Đà Nẵng - 447 Lê Duẩn" => lấy "MIA23"
          let mnCode = '';
          if (stopPoint.address) {
            // Tìm mã MN trong địa chỉ (thường có format: MIA23/... hoặc MIA23 - ...)
            const mnMatch = stopPoint.address.match(/^([A-Z]+\d+)/);
            if (mnMatch) {
              mnCode = mnMatch[1];
              console.log(`🔍 DEBUG - Found MN code: ${mnCode} from address: ${stopPoint.address}`);
            } else {
              // Fallback: tìm trong locations nếu không tìm thấy trong địa chỉ
              const matchingLocation = locations.find(
                (loc) =>
                  loc.address === stopPoint.address ||
                  (stopPoint.address && loc.address && stopPoint.address.includes(loc.address)) ||
                  (stopPoint.address && loc.address && loc.address.includes(stopPoint.address))
              );
              mnCode = matchingLocation?.code || '';
              console.log(`🔍 DEBUG - Fallback MN from locations: ${mnCode}`);
            }
          }
          stopMNs[`stop${index + 1}MN`] = mnCode;

          // Tính số kiện cho điểm dừng này
          // Lọc phiếu đã chọn cho điểm dừng này
          console.log(`🔍 DEBUG - Filtering transfers for stop ${index + 1}:`, {
            stopKey,
            stopPointTransfers: stopPoint.transfers,
            selectedTransfers: Array.from(newTransportForm.selectedTransfers),
            transportRequestsIds: transportRequests.map((t) => t.id),
          });

          const selectedTransfersForStop = transportRequests.filter((t) => {
            const transferId = t.transferId || t.id;
            const isSelected = newTransportForm.selectedTransfers.has(t.id);
            const isInStopPoint = stopPoint.transfers.includes(transferId);
            console.log(`🔍 DEBUG - Transfer ${t.id} (transferId: ${transferId}):`, {
              isSelected,
              isInStopPoint,
              stopPointTransfers: stopPoint.transfers,
              finalResult: isSelected && isInStopPoint,
            });
            return isSelected && isInStopPoint;
          });

          console.log(`🔍 DEBUG - Stop ${index + 1} selectedTransfersForStop:`, {
            stopKey,
            stopPointAddress: stopPoint.address,
            selectedTransfersCount: selectedTransfersForStop.length,
            selectedTransfers: selectedTransfersForStop.map((t) => ({
              id: t.id,
              transferId: t.transferId,
              requestCode: t.requestCode,
            })),
          });
          const packagesForStop = selectedTransfersForStop.reduce(
            (sum, t) => sum + t.totalPackages,
            0
          );
          stopPackages[`stop${index + 1}Packages`] = packagesForStop;

          // Tính khối lượng cho điểm dừng này
          const volumeForStop = selectedTransfersForStop.reduce((sum, t) => sum + t.volume || 0, 0);
          stopVolumes[`stop${index + 1}VolumeM3`] = Number(volumeForStop.toFixed(2));

          // Lấy khoảng cách cho điểm dừng này (sử dụng hook)
          const distanceForStop = stopPointDistances[stopKey] || 0;
          stopDistances[`distance${index + 1}`] = Number(distanceForStop.toFixed(2));

          console.log(
            `🔍 DEBUG - Mapping distance: stopKey=${stopKey}, index=${index}, distance=${distanceForStop}`
          );

          // Tính số phiếu đơn hàng cho điểm dừng này
          const orderCountForStop = selectedTransfersForStop.length;
          stopOrderCounts[`stop${index + 1}OrderCount`] = orderCountForStop;

          // Tính tổng số sản phẩm cho điểm dừng này
          const productsForStop = selectedTransfersForStop.reduce((sum, t) => {
            const productCount = parseInt(t.totalProducts) || 0;
            return sum + productCount;
          }, 0);
          stopProducts[`stop${index + 1}Products`] = productsForStop.toString();

          // Tạo danh sách transfer_ids cho điểm dừng này
          const transferIdsForStop = selectedTransfersForStop
            .map((t) => {
              console.log(`🔍 DEBUG - Transfer mapping:`, {
                id: t.id,
                transferId: t.transferId,
                requestCode: t.requestCode,
                finalValue: t.transferId || t.id,
              });
              return t.transferId || t.id;
            })
            .join(', ');
          stopTransferIds[`stop${index + 1}TransferIds`] = transferIdsForStop;

          console.log(`🔍 DEBUG - Stop ${index + 1} transfer IDs: ${transferIdsForStop}`);
        }
      });

      // Debug: Log dữ liệu khoảng cách, số phiếu, sản phẩm và mã nguồn
      console.log('🔍 DEBUG - stopDistances:', stopDistances);
      console.log('🔍 DEBUG - stopOrderCounts:', stopOrderCounts);
      console.log('🔍 DEBUG - stopProducts:', stopProducts);
      console.log('🔍 DEBUG - stopTransferIds:', stopTransferIds);
      console.log('🔍 DEBUG - stopMNs:', stopMNs);
      console.log(
        '🔍 DEBUG - MN Mapping Summary:',
        Object.entries(stopMNs).map(([key, value]) => `${key}: ${value}`)
      );
      console.log('🔍 DEBUG - selectedStopPoints:', Array.from(selectedStopPoints));

      // Sử dụng hook để lấy payload khoảng cách
      const distancePayload = getDistancePayload(selectedStopPoints, stopPointDistances);
      console.log('🔍 DEBUG - Distance payload from hook:', distancePayload);

      // Tính tổng khoảng cách
      const totalDistance = Object.values(stopDistances).reduce(
        (sum, distance) => sum + distance,
        0
      );

      // Tính tổng số phiếu đơn hàng
      const totalOrderCount = Object.values(stopOrderCounts).reduce((sum, count) => sum + count, 0);

      // Tính tổng số sản phẩm
      const totalProducts = Object.values(stopProducts).reduce((sum, products) => {
        const productCount = parseInt(products) || 0;
        return sum + productCount;
      }, 0);

      console.log('🔍 DEBUG - totalDistance:', totalDistance);
      console.log('🔍 DEBUG - totalOrderCount:', totalOrderCount);
      console.log('🔍 DEBUG - totalProducts:', totalProducts);

      const payload: Record<string, unknown> = {
        requestId: currentRequestId,
        pickupAddress,
        // Thêm địa chỉ các điểm dừng
        ...stopAddresses,
        // Thêm mã nguồn (MN) các điểm dừng
        ...stopMNs,
        // Thêm số kiện các điểm dừng
        ...stopPackages,
        // Thêm khối lượng các điểm dừng
        ...stopVolumes,
        // Thêm khoảng cách các điểm dừng (sử dụng hook)
        ...distancePayload,
        // Thêm số phiếu đơn hàng các điểm dừng
        ...stopOrderCounts,
        // Thêm tổng số phiếu đơn hàng
        totalOrderCount,
        // Thêm sản phẩm các điểm dừng
        ...stopProducts,
        // Thêm tổng số sản phẩm
        totalProducts: totalProducts.toString(),
        // Thêm transfer_ids các điểm dừng
        ...stopTransferIds,
        pricingMethod: newTransportForm.pricingMethod || '',
        carrierName: newTransportForm.carrierName || '',
        carrierId: newTransportForm.carrierId || '',
        vehicleType: newTransportForm.vehicleType || '',
        department: newTransportForm.department || '',
        serviceArea: newTransportForm.serviceArea || '',
        pricePerKm: newTransportForm.pricePerKm || 0,
        pricePerM3: newTransportForm.pricePerM3 || 0,
        pricePerTrip: newTransportForm.pricePerTrip || 0,
        stopFee: newTransportForm.stopFee || 0,
        fuelSurcharge: newTransportForm.fuelSurcharge || 0,
        tollFee: newTransportForm.tollFee || 0,
        insuranceFee: newTransportForm.insuranceFee || 0,
        baseRate: newTransportForm.baseRate || 0,
        estimatedCost: newTransportForm.estimatedCost || 0,
        totalPackages,
        totalVolumeM3: Number(totalVolume.toFixed(2)),
        status: 'in_transit',
        note: newTransportForm.note || '',
      };

      // Debug: Log payload cuối cùng (chỉ trong development)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 DEBUG - Final payload:', payload);
        console.log('🔍 DEBUG - Distance fields in payload:', {
          distance1: payload.distance1,
          distance2: payload.distance2,
          distance3: payload.distance3,
          distance4: payload.distance4,
          distance5: payload.distance5,
          totalDistance: payload.totalDistance,
        });
        console.log('🔍 DEBUG - OrderCount fields in payload:', {
          stop1OrderCount: payload.stop1OrderCount,
          stop2OrderCount: payload.stop2OrderCount,
          stop3OrderCount: payload.stop3OrderCount,
          stop4OrderCount: payload.stop4OrderCount,
          stop5OrderCount: payload.stop5OrderCount,
          totalOrderCount: payload.totalOrderCount,
        });
        console.log('🔍 DEBUG - TransferIds fields in payload:', {
          stop1TransferIds: payload.stop1TransferIds,
          stop2TransferIds: payload.stop2TransferIds,
          stop3TransferIds: payload.stop3TransferIds,
          stop4TransferIds: payload.stop4TransferIds,
          stop5TransferIds: payload.stop5TransferIds,
        });
        console.log('🔍 DEBUG - Products fields in payload:', {
          stop1Products: payload.stop1Products,
          stop2Products: payload.stop2Products,
          stop3Products: payload.stop3Products,
          stop4Products: payload.stop4Products,
          stop5Products: payload.stop5Products,
          totalProducts: payload.totalProducts,
        });
      }

      // Tính chi phí ước tính ngay trước khi ghi sheet để đảm bảo không bị 0
      const estimatedCostComputed = calculateEstimatedCost();
      payload.estimatedCost = estimatedCostComputed;

      const res = await fetch(
        `/api/transport-requests/${currentRequestId}?spreadsheetId=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      let errorMsg = '';
      if (!res.ok) {
        try {
          const data = await res.json();
          errorMsg = data?.error || '';
        } catch {
          // ignore
        }
        throw new Error(`Save failed: ${res.status} ${errorMsg}`);
      }

      // Tính lại chi phí ước tính trước khi hiển thị
      const estimatedCost = estimatedCostComputed;

      // Cập nhật trạng thái các phiếu đã chọn sang "Đang chuyển giao" (không chặn UI)
      try {
        const transferIdsToUpdate = Array.from(newTransportForm.selectedTransfers);
        const updatePromises = transferIdsToUpdate.map((tid) =>
          fetch(
            `/api/transfers/${encodeURIComponent(tid)}?spreadsheetId=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ transportStatus: 'Đang chuyển giao' }),
            }
          )
            .then(() => ({ id: tid, ok: true }))
            .catch((e) => ({ id: tid, ok: false, error: String(e) }))
        );
        Promise.allSettled(updatePromises).then((results) => {
          if (process.env.NODE_ENV === 'development') {
            console.log('🔄 Update transfers status results:', results);
          }
          // Làm mới danh sách nguồn để phản ánh trạng thái mới
          fetchTransfers().catch(() => undefined);
        });
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Không thể cập nhật trạng thái transfers:', e);
        }
      }

      // Hiệu ứng thành công với thông tin chi tiết đầy đủ
      const successMessage = `✅ Tạo yêu cầu vận chuyển thành công!

📊 Thông tin tóm tắt:
• Điểm dừng: ${selectedStopPoints.size} điểm
• Tổng kiện: ${totalPackages} kiện
• Tổng sản phẩm: ${totalProducts} sản phẩm
• Tổng khối: ${formatDecimal(totalVolume, 2)} m³
• Tổng khoảng cách: ${formatDecimal(totalDistance, 1)} km
• Tổng phiếu: ${totalOrderCount} phiếu

🚚 Nhà vận chuyển: ${newTransportForm.carrierName || 'Chưa chọn'}
🚛 Loại xe: ${newTransportForm.vehicleType || 'Chưa chọn'}
🌍 Khu vực phục vụ: ${newTransportForm.serviceArea || 'Chưa chọn'}
🏢 Phòng ban: ${newTransportForm.department || 'Chưa chọn'}
💰 Chi phí ước tính: ${formatNumber(estimatedCost)} VND

📋 Chi tiết điểm dừng:
${Array.from(selectedStopPoints)
  .map((stopKey, _index) => {
    const stopPoint = stopPoints[stopKey];
    const distance = stopPointDistances[stopKey] || 0;
    const selectedTransfersForStop = transportRequests.filter(
      (t) => newTransportForm.selectedTransfers.has(t.id) && stopPoint?.transfers.includes(t.id)
    );
    const packagesForStop = selectedTransfersForStop.reduce((sum, t) => sum + t.totalPackages, 0);
    const volumeForStop = selectedTransfersForStop.reduce((sum, t) => sum + t.volume || 0, 0);
    const productsForStop = selectedTransfersForStop.reduce(
      (sum, t) => sum + (parseInt(t.totalProducts) || 0),
      0
    );
    return `• ${stopPoint?.address || 'Không xác định'} (${formatDecimal(distance, 1)} km, ${packagesForStop} kiện, ${productsForStop} sản phẩm, ${formatDecimal(volumeForStop, 2)} m³)`;
  })
  .join('\n')}`;

      setSnackbar({
        open: true,
        message: successMessage,
        severity: 'success',
      });

      // Gửi thông báo Telegram (non-blocking)
      try {
        fetch('/api/notifications/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: successMessage }),
        }).catch(() => {});
      } catch {}

      // Đóng dialog và reset trạng thái (KHÔNG xóa dòng vừa lưu)
      handleCloseDialog(false);
      setCurrentRequestId(null);

      // Reload danh sách (không cần await để không block UI)
      fetchTransfers().catch(console.error);
    } catch (e) {
      console.error('Submit transport request error:', e);
      setSnackbar({
        open: true,
        message: `❌ Lưu thất bại: ${e instanceof Error ? e.message : 'Thử lại sau'}`,
        severity: 'error',
      });
    } finally {
      setSubmittingRequest(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Đặt xe vận chuyển ({transportRequests.length})
          {selectedItems.size > 0 && `- Đã chọn ${selectedItems.size}`}
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            startIcon={refreshing ? <CircularProgress size={16} /> : <Sync />}
          >
            Làm mới
          </Button>
          <Button onClick={() => setShowFilters(!showFilters)} startIcon={<FilterList />}>
            Bộ lọc
          </Button>
          <Button
            onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            startIcon={viewMode === 'table' ? <GridViewIcon /> : <ViewList />}
          >
            {viewMode === 'table' ? 'Grid' : 'Bảng'}
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateNewRequest}
            disabled={generatingId}
            startIcon={generatingId ? <CircularProgress size={16} /> : <AddCircle />}
          >
            {generatingId ? 'Đang tạo...' : 'Đặt xe mới'}
          </Button>

          <Button
            variant="outlined"
            onClick={handleNewTransportMenuOpen}
            endIcon={<ArrowDropDown />}
            sx={{ ml: 1 }}
          >
            Thêm mới
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Collapse in={showFilters}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Bộ lọc</Typography>
            <Button
              onClick={() =>
                setFilters({
                  search: '',
                  status: '',
                  vehicleType: '',
                  customerName: '',
                })
              }
              startIcon={<Clear />}
            >
              Xóa bộ lọc
            </Button>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Tìm kiếm"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Mã yêu cầu, khách hàng, địa điểm..."
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Chờ chuyển giao">Chờ chuyển giao</MenuItem>
                  <MenuItem value="Đang chuyển giao">Đang chuyển giao</MenuItem>
                  <MenuItem value="Đã chuyển giao">Đã chuyển giao</MenuItem>
                  <MenuItem value="Chờ xác nhận">Chờ xác nhận</MenuItem>
                  <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
                  <MenuItem value="Đang vận chuyển">Đang vận chuyển</MenuItem>
                  <MenuItem value="Đã giao hàng">Đã giao hàng</MenuItem>
                  <MenuItem value="Đã hủy">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Loại xe</InputLabel>
                <Select
                  value={filters.vehicleType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      vehicleType: e.target.value,
                    }))
                  }
                  label="Loại xe"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="truck">Xe tải</MenuItem>
                  <MenuItem value="van">Xe van</MenuItem>
                  <MenuItem value="pickup">Xe pickup</MenuItem>
                  <MenuItem value="container">Container</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Khách hàng"
                value={filters.customerName}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    customerName: e.target.value,
                  }))
                }
                placeholder="Tên khách hàng..."
              />
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* New Transport Request Dropdown Menu */}
      <Menu
        anchorEl={newTransportMenuAnchor}
        open={Boolean(newTransportMenuAnchor)}
        onClose={handleNewTransportMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleNewTransportTypeSelect('system')}>
          <Business sx={{ mr: 1 }} />
          Từ hệ thống
        </MenuItem>
        <MenuItem onClick={() => handleNewTransportTypeSelect('external')}>
          <Public sx={{ mr: 1 }} />
          Ngoài hệ thống
        </MenuItem>
      </Menu>

      {/* Table View */}
      {viewMode === 'table' && (
        <TableContainer
          component={Paper}
          sx={{
            mt: 1.5,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            overflowX: 'auto',
          }}
        >
          <Table
            sx={{
              width: '100%',
              tableLayout: 'auto',
              '& .MuiTableRow-root:nth-of-type(even)': {
                backgroundColor: '#f8f9fa',
              },
              '& .MuiTableRow-root:hover': {
                backgroundColor: '#e3f2fd',
                transition: 'background-color 0.2s ease',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              },
              '& .MuiTableCell-root': {
                borderBottom: '1px solid #e0e0e0',
                padding: '6px 4px',
                fontSize: '0.65rem',
                transition: 'all 0.2s ease',
              },
              '& .address-cell': {
                whiteSpace: 'normal',
                textOverflow: 'unset',
                overflow: 'visible',
                lineHeight: 1.2,
              },
              '& .MuiTableHead .MuiTableRow-root': {
                backgroundColor: 'grey.50',
              },
              '& .MuiTableHead .MuiTableCell-root': {
                backgroundColor: 'grey.50',
                fontWeight: 600,
                fontSize: '0.6rem',
                color: 'grey.700',
                borderBottom: '2px solid',
                borderBottomColor: 'primary.main',
                padding: '6px 4px',
                textTransform: 'uppercase',
                letterSpacing: '0.2px',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ width: '40px' }}>
                  <Checkbox
                    indeterminate={
                      selectedItems.size > 0 && selectedItems.size < paginatedRequests.length
                    }
                    checked={
                      selectedItems.size === paginatedRequests.length &&
                      paginatedRequests.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
                <TableCell sx={{ width: '140px' }}>Mã yêu cầu</TableCell>
                <TableCell sx={{ display: 'none' }}>Nhân viên</TableCell>
                <TableCell sx={{ width: '180px' }}>Điểm đi</TableCell>
                <TableCell sx={{ width: '220px' }}>Điểm đến</TableCell>
                <TableCell sx={{ width: '80px' }}>Ngày</TableCell>
                <TableCell sx={{ width: '100px' }}>Kiện</TableCell>
                <TableCell sx={{ width: '80px' }}>SL</TableCell>
                <TableCell sx={{ width: '90px' }}>Khối (m³)</TableCell>
                <TableCell sx={{ width: '120px' }}>TT Vận chuyển</TableCell>
                <TableCell sx={{ width: '80px' }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell padding="checkbox" sx={{ width: '40px' }}>
                    <Checkbox
                      checked={selectedItems.has(request.id)}
                      onChange={(e) => handleSelectItem(request.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell sx={{ width: '140px' }}>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.65rem', fontWeight: 600 }}>
                      {request.requestCode}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.55rem' }}
                    >
                      ID: {request.transferId || request.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: 'none' }}>
                    <Box>
                      <Typography variant="body2">{request.customerName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.customerPhone || 'Chưa có số điện thoại'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '180px' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                        {request.pickupLocation}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.55rem' }}
                      >
                        {request.pickupAddress}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell className="address-cell" sx={{ width: '220px' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                        {request.deliveryLocation}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.55rem' }}
                      >
                        {request.deliveryAddress}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: '80px' }}>
                    <Typography sx={{ fontSize: '0.65rem' }}>{request.requestDate}</Typography>
                  </TableCell>
                  <TableCell sx={{ width: '100px' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                      {request.totalPackages} kiện
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.55rem' }}
                    >
                      S: {request.packageDetails?.pkgS || 0} | M:{' '}
                      {request.packageDetails?.pkgM || 0} | L: {request.packageDetails?.pkgL || 0}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: '80px' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                      {request.totalProducts || 'N/A'}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: '0.55rem' }}
                    >
                      Sản phẩm
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: '90px' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                      {request.volume || (0)?.toFixed(2) || '0.00'} m³
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ width: '120px' }} align="center">
                    <Typography
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        color: 'primary.main',
                        backgroundColor: 'primary.50',
                        border: '1px solid',
                        borderColor: 'primary.main',
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
                      {(() => {
                        console.log(
                          '🔍 Debug - request.status:',
                          request.status,
                          'getStatusLabel result:',
                          getStatusLabel(request.status)
                        );
                        return getStatusLabel(request.status);
                      })()}
                    </Typography>
                  </TableCell>

                  <TableCell align="right" sx={{ width: '80px' }}>
                    <IconButton onClick={(e) => handleOpenRowMenu(e, request)} size="small">
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Menu anchorEl={rowMenuAnchor} open={Boolean(rowMenuAnchor)} onClose={handleCloseRowMenu}>
            <MenuItem
              onClick={() => {
                if (rowMenuRequest) {
                  setEditing(rowMenuRequest);
                  setOpen(true);
                }
                handleCloseRowMenu();
              }}
            >
              <Edit fontSize="small" style={{ marginRight: 8 }} /> Sửa
            </MenuItem>
            <MenuItem
              onClick={() => {
                if (rowMenuRequest) handleDelete(rowMenuRequest);
                handleCloseRowMenu();
              }}
            >
              <Delete fontSize="small" style={{ marginRight: 8 }} /> Xóa
            </MenuItem>
          </Menu>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredRequests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
            }
          />
        </TableContainer>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <Grid container spacing={2}>
          {paginatedRequests.map((request) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={request.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{request.requestCode}</Typography>
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" color="primary">
                      {request.customerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {request.customerPhone || 'Chưa có số điện thoại'}
                    </Typography>
                  </Box>

                  <Box mb={2}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">Điểm đi: {request.pickupLocation}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <LocalShipping fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">Điểm đến: {request.deliveryLocation}</Typography>
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Schedule fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">Ngày yêu cầu: {request.requestDate}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <StatusChip
                        label={getStatusLabel(request.status)}
                        status={request.status}
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          minWidth: '80px',
                          bgcolor: 'white',
                        }}
                      />
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Person fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">Số kiện: {request.totalPackages} kiện</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      S: {request.packageDetails?.pkgS || 0} | M:{' '}
                      {request.packageDetails?.pkgM || 0} | L: {request.packageDetails?.pkgL || 0}
                    </Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="primary">
                      {request.volume || (0)?.toFixed(2) || '0.00'} m³
                    </Typography>
                    <Box display="flex" gap={0.5}>
                      <IconButton
                        onClick={() => {
                          setEditing(request);
                          setOpen(true);
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(request)}
                        disabled={deletingId === request.id}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={open && (!!currentRequestId || !!editing)}
        onClose={closingDialog ? undefined : () => handleCloseDialog(true)}
        maxWidth="lg"
        fullWidth
        disableEscapeKeyDown={closingDialog}
      >
        <DialogTitle>
          {editing
            ? 'Chỉnh sửa yêu cầu vận chuyển'
            : currentRequestId
              ? `Đặt xe vận chuyển mới - ${currentRequestId}`
              : 'Đặt xe vận chuyển mới'}
        </DialogTitle>
        <DialogContent>
          {editing ? (
            <Typography color="text.secondary">Chỉnh sửa thông tin yêu cầu vận chuyển</Typography>
          ) : (
            <Box>
              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={(event, newValue) => setActiveTab(newValue)}
                  aria-label="Transport request tabs"
                >
                  <Tab
                    label="🚛 Đặt xe vận chuyển mới"
                    id="transport-tab-0"
                    aria-controls="transport-tabpanel-0"
                  />
                  <Tab
                    label="📦 Điểm giao hàng"
                    id="transport-tab-1"
                    aria-controls="transport-tabpanel-1"
                  />
                </Tabs>
              </Box>

              {/* Tab Panel 0: Đặt xe vận chuyển mới */}
              <div
                role="tabpanel"
                hidden={activeTab !== 0}
                id="transport-tabpanel-0"
                aria-labelledby="transport-tab-0"
              >
                {activeTab === 0 && (
                  <Grid container spacing={2}>
                    {/* Pickup Location */}
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} mb={1} color="primary">
                          Điểm nguồn
                        </Typography>
                        <Box display="flex" gap={1} alignItems="flex-end">
                          <FormControl fullWidth error={!!validationErrors.pickupLocation}>
                            <InputLabel>
                              Chọn điểm nguồn
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  ml: 1,
                                  color: 'white',
                                  fontWeight: 600,
                                  backgroundColor: 'info.main',
                                  px: 1.5,
                                  py: 0.3,
                                  borderRadius: 1.5,
                                  fontSize: '0.75rem',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                }}
                              >
                                {Object.values(groupedLocations).reduce(
                                  (total, locations) => total + locations.length,
                                  0
                                )}{' '}
                                lựa chọn
                              </Typography>
                            </InputLabel>
                            <Select
                              value={newTransportForm.pickupLocation}
                              onChange={(e) => {
                                handlePickupLocationChange(e.target.value);
                              }}
                              label="Chọn điểm nguồn"
                            >
                              {Object.entries(groupedLocations)
                                .map(([category, locations]) => [
                                  <ListSubheader
                                    key={`header-${category}`}
                                    sx={{
                                      fontWeight: 'bold',
                                      color: 'primary.main',
                                    }}
                                  >
                                    {category}
                                  </ListSubheader>,
                                  ...locations.map((location) => (
                                    <MenuItem key={location.id} value={location.id} sx={{ pl: 3 }}>
                                      {location.code} - {location.address}
                                    </MenuItem>
                                  )),
                                ])
                                .flat()}
                            </Select>
                            {validationErrors.pickupLocation && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, display: 'block' }}
                              >
                                {validationErrors.pickupLocation}
                              </Typography>
                            )}
                          </FormControl>

                          {/* Add New Location Button */}
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setShowAddLocationDialog(true);
                              setAddLocationType(null);
                            }}
                            sx={{
                              border: '1px solid',
                              borderColor: 'primary.main',
                              borderRadius: '8px',
                              width: '40px',
                              height: '40px',
                              '&:hover': {
                                backgroundColor: 'primary.main',
                                color: 'white',
                                transform: 'scale(1.05)',
                              },
                              transition: 'all 0.2s ease-in-out',
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Carrier Selection */}
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} mb={1} color="primary">
                          Nhà vận chuyển
                        </Typography>
                        <FormControl fullWidth>
                          <InputLabel>
                            Chọn nhà vận chuyển
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{
                                ml: 1,
                                color: 'white',
                                fontWeight: 600,
                                backgroundColor: 'warning.main',
                                px: 1.5,
                                py: 0.3,
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                              }}
                            >
                              {Object.keys(groupedCarriers).length} lựa chọn
                            </Typography>
                          </InputLabel>
                          <Select
                            value={newTransportForm.carrierName}
                            onChange={(e) => {
                              const carrierName = e.target.value;

                              if (!carrierName) {
                                setNewTransportForm((prev) => ({
                                  ...prev,
                                  carrierName: '',
                                  pricingMethod: 'perKm',
                                  serviceArea: '',
                                  vehicleType: '',
                                }));
                                return;
                              }

                              const variants = groupedCarriers[carrierName] ?? [];
                              if (variants.length === 0) {
                                setSnackbar({
                                  open: true,
                                  message:
                                    'Không tìm thấy cấu hình dịch vụ cho nhà vận chuyển này. Vui lòng kiểm tra lại dữ liệu Carriers.',
                                  severity: 'warning',
                                });
                                return;
                              }

                              const availableMethods = variants
                                .map((variant) => variant.pricingMethod)
                                .filter((method): method is string => Boolean(method));

                              if (availableMethods.length === 0) {
                                setSnackbar({
                                  open: true,
                                  message:
                                    'Nhà vận chuyển chưa cấu hình phương thức tính tiền. Vui lòng cập nhật trong Google Sheets.',
                                  severity: 'warning',
                                });
                                return;
                              }

                              const firstSheetMethod = availableMethods[0] ?? 'PER_KM';
                              const firstFormMethod =
                                SHEET_TO_FORM_PRICING_METHOD[firstSheetMethod] ?? 'perKm';

                              setNewTransportForm((prev) => ({
                                ...prev,
                                carrierName,
                                pricingMethod: firstFormMethod,
                                serviceArea: '',
                                vehicleType: '',
                              }));
                            }}
                            label="Chọn nhà vận chuyển"
                          >
                            {Object.keys(groupedCarriers).map((carrierName) => (
                              <MenuItem key={carrierName} value={carrierName}>
                                {carrierName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>

                    {/* Pricing Method Selection */}
                    {newTransportForm.carrierName && (
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!validationErrors.pricingMethod}>
                          <InputLabel>
                            Phương thức tính tiền
                            {newTransportForm.carrierName && (
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  ml: 1,
                                  color: 'white',
                                  fontWeight: 600,
                                  backgroundColor: 'secondary.main',
                                  px: 1.5,
                                  py: 0.3,
                                  borderRadius: 1.5,
                                  fontSize: '0.75rem',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                }}
                              >
                                {getPricingMethodsForCarrier(newTransportForm.carrierName).length}{' '}
                                lựa chọn
                              </Typography>
                            )}
                          </InputLabel>
                          <Select
                            value={
                              FORM_TO_SHEET_PRICING_METHOD[newTransportForm.pricingMethod] ?? ''
                            }
                            onChange={(e) => {
                              const sheetPricingMethod = e.target.value as string;
                              const formPricingMethod: FormPricingMethod =
                                SHEET_TO_FORM_PRICING_METHOD[sheetPricingMethod] ?? 'perKm';

                              setNewTransportForm((prev) => ({
                                ...prev,
                                pricingMethod: formPricingMethod,
                                vehicleType: '',
                                serviceArea: '',
                              }));

                              const error = validateRealTime('pricingMethod', formPricingMethod);
                              setValidationErrors((prev) => ({
                                ...prev,
                                pricingMethod: error,
                              }));
                            }}
                            label="Phương thức tính tiền"
                          >
                            {getPricingMethodsForCarrier(newTransportForm.carrierName).map(
                              (method) => (
                                <MenuItem key={method} value={method}>
                                  {getPricingMethodLabel(method)}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                    )}

                    {/* Vehicle Type - Only show if not pricing by volume */}
                    {newTransportForm.pricingMethod &&
                      shouldShowVehicleType(newTransportForm.pricingMethod) && (
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth error={!!validationErrors.vehicleType}>
                            <InputLabel>
                              Loại xe
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  ml: 1,
                                  color: 'white',
                                  fontWeight: 600,
                                  backgroundColor: 'error.main',
                                  px: 1.5,
                                  py: 0.3,
                                  borderRadius: 1.5,
                                  fontSize: '0.75rem',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                }}
                              >
                                {
                                  getVehicleTypesForPricingMethod(
                                    newTransportForm.carrierName,
                                    newTransportForm.pricingMethod
                                  ).length
                                }{' '}
                                lựa chọn
                              </Typography>
                            </InputLabel>
                            <Select
                              value={newTransportForm.vehicleType}
                              onChange={(e) => {
                                const vehicleType = e.target.value;
                                setNewTransportForm((prev) => ({
                                  ...prev,
                                  vehicleType,
                                }));

                                // Real-time validation
                                const error = validateRealTime('vehicleType', vehicleType);
                                setValidationErrors((prev) => ({
                                  ...prev,
                                  vehicleType: error,
                                }));
                              }}
                              label="Loại xe"
                            >
                              {getVehicleTypesForPricingMethod(
                                newTransportForm.carrierName,
                                newTransportForm.pricingMethod
                              ).map((vehicleType) => (
                                <MenuItem key={vehicleType} value={vehicleType}>
                                  {vehicleType}
                                </MenuItem>
                              ))}
                            </Select>
                            {validationErrors.vehicleType && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, display: 'block' }}
                              >
                                {validationErrors.vehicleType}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                      )}

                    {/* Service Area - Moved from Pricing section */}
                    {newTransportForm.carrierName && newTransportForm.pricingMethod && (
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth error={!!validationErrors.serviceArea}>
                          <InputLabel>
                            Khu vực phục vụ
                            {newTransportForm.carrierName && newTransportForm.pricingMethod && (
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{
                                  ml: 1,
                                  color: 'white',
                                  fontWeight: 600,
                                  backgroundColor: 'success.main',
                                  px: 1.5,
                                  py: 0.3,
                                  borderRadius: 1.5,
                                  fontSize: '0.75rem',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                }}
                              >
                                {
                                  getServiceAreasForCarrierAndMethod(
                                    newTransportForm.carrierName,
                                    newTransportForm.pricingMethod
                                  ).length
                                }{' '}
                                lựa chọn
                              </Typography>
                            )}
                          </InputLabel>
                          <Select
                            value={newTransportForm.serviceArea}
                            onChange={(e) => {
                              const serviceArea = e.target.value;
                              setNewTransportForm((prev) => ({
                                ...prev,
                                serviceArea,
                              }));

                              // Clear validation error when user selects
                              if (validationErrors.serviceArea) {
                                setValidationErrors((prev) => ({
                                  ...prev,
                                  serviceArea: undefined,
                                }));
                              }
                            }}
                            label="Khu vực phục vụ"
                            disabled={
                              !newTransportForm.carrierName || !newTransportForm.pricingMethod
                            }
                          >
                            {getServiceAreasForCarrierAndMethod(
                              newTransportForm.carrierName,
                              newTransportForm.pricingMethod
                            ).map((serviceArea) => (
                              <MenuItem key={serviceArea} value={serviceArea}>
                                {serviceArea}
                              </MenuItem>
                            ))}
                          </Select>
                          {validationErrors.serviceArea && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 0.5, display: 'block' }}
                            >
                              {validationErrors.serviceArea}
                            </Typography>
                          )}
                        </FormControl>
                      </Grid>
                    )}

                    {/* Estimated Cost */}
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Chi phí ước tính"
                        value={formatNumber(calculateEstimatedCost())}
                        InputProps={{
                          readOnly: true,
                          endAdornment: <Typography variant="caption">₫</Typography>,
                        }}
                      />
                    </Grid>

                    {/* Carrier Info */}
                    {getSelectedCarrierInfo() && (
                      <Grid item xs={12}>
                        <Alert severity="info">
                          <Typography variant="body2">
                            <strong>Thông tin nhà vận chuyển:</strong>
                            <br />
                            Liên hệ: {getSelectedCarrierInfo()?.contactPerson} -{' '}
                            {getSelectedCarrierInfo()?.phone}
                            <br />
                            Email: {getSelectedCarrierInfo()?.email}
                            <br />
                            Địa chỉ: {getSelectedCarrierInfo()?.address}
                          </Typography>
                        </Alert>
                      </Grid>
                    )}

                    {/* Note */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Ghi chú"
                        value={newTransportForm.note}
                        onChange={(e) =>
                          setNewTransportForm((prev) => ({
                            ...prev,
                            note: e.target.value,
                          }))
                        }
                      />
                    </Grid>

                    {/* Thông tin Tài xế */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        mb={2}
                        color="primary"
                        sx={{
                          borderBottom: '2px solid',
                          borderColor: 'primary.main',
                          pb: 1,
                        }}
                      >
                        👨‍💼 Thông tin Tài xế
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Mã tài xế"
                            value={newTransportForm.driverId}
                            onChange={(e) => {
                              setNewTransportForm((prev) => ({
                                ...prev,
                                driverId: e.target.value,
                              }));
                            }}
                            placeholder="VD: TX001"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Tên tài xế"
                            required
                            error={!!validationErrors.driverName}
                            value={newTransportForm.driverName}
                            onChange={(e) => {
                              setNewTransportForm((prev) => ({
                                ...prev,
                                driverName: e.target.value,
                              }));
                            }}
                            placeholder="Họ và tên tài xế"
                          />
                          {validationErrors.driverName && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 0.5, display: 'block' }}
                            >
                              {validationErrors.driverName}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Số điện thoại tài xế"
                            required
                            error={!!validationErrors.driverPhone}
                            value={newTransportForm.driverPhone}
                            onChange={(e) => {
                              const value = e.target.value;
                              setNewTransportForm((prev) => ({
                                ...prev,
                                driverPhone: value,
                              }));

                              // Real-time validation
                              const error = validateRealTime('driverPhone', value);
                              setValidationErrors((prev) => ({
                                ...prev,
                                driverPhone: error,
                              }));
                            }}
                            placeholder="0123456789"
                          />
                          {validationErrors.driverPhone && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 0.5, display: 'block' }}
                            >
                              {validationErrors.driverPhone}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Số bằng lái"
                            value={newTransportForm.driverLicense}
                            onChange={(e) => {
                              setNewTransportForm((prev) => ({
                                ...prev,
                                driverLicense: e.target.value,
                              }));
                            }}
                            placeholder="B2, C, D..."
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Hình ảnh và Phòng ban */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        mb={2}
                        color="primary"
                        sx={{
                          borderBottom: '2px solid',
                          borderColor: 'primary.main',
                          pb: 1,
                        }}
                      >
                        📸 Hình ảnh và Phòng ban
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Hình ảnh được chụp sau khi lên hàng"
                            multiline
                            rows={3}
                            value={newTransportForm.loadingImages}
                            onChange={(e) => {
                              setNewTransportForm((prev) => ({
                                ...prev,
                                loadingImages: e.target.value,
                              }));
                            }}
                            placeholder="Mô tả hoặc link hình ảnh chụp sau khi lên hàng"
                            helperText="Có thể nhập link ảnh hoặc mô tả chi tiết"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth required error={!!validationErrors.department}>
                            <InputLabel>Phòng ban sử dụng</InputLabel>
                            <Select
                              value={newTransportForm.department}
                              onChange={(e) => {
                                const value = e.target.value;
                                setNewTransportForm((prev) => ({
                                  ...prev,
                                  department: value,
                                }));

                                // Real-time validation
                                const error = validateRealTime('department', value);
                                setValidationErrors((prev) => ({
                                  ...prev,
                                  department: error,
                                }));
                              }}
                              label="Phòng ban sử dụng"
                            >
                              <MenuItem value="Cửa hàng">🏪 Cửa hàng</MenuItem>
                              <MenuItem value="Vận hành">⚙️ Vận hành</MenuItem>
                              <MenuItem value="B2B">🏢 B2B</MenuItem>
                              <MenuItem value="Bảo hành">🔧 Bảo hành</MenuItem>
                              <MenuItem value="Marketing">📢 Marketing</MenuItem>
                              <MenuItem value="Kho vận">📦 Kho vận</MenuItem>
                              <MenuItem value="Nhân sự">👥 Nhân sự</MenuItem>
                              <MenuItem value="IT">💻 IT</MenuItem>
                              <MenuItem value="Ngành hàng">📋 Ngành hàng</MenuItem>
                              <MenuItem value="Livestream">📺 Livestream</MenuItem>
                              <MenuItem value="BOD">👑 BOD</MenuItem>
                              <MenuItem value="Khác">🔄 Khác</MenuItem>
                            </Select>
                          </FormControl>
                          {validationErrors.department && (
                            <Typography
                              variant="caption"
                              color="error"
                              sx={{ mt: 0.5, display: 'block' }}
                            >
                              {validationErrors.department}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Định giá và Phí phụ */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        mb={2}
                        color="primary"
                        sx={{
                          borderBottom: '2px solid',
                          borderColor: 'primary.main',
                          pb: 1,
                        }}
                      >
                        💰 Định giá và Phí phụ
                      </Typography>

                      {/* Pricing notification */}
                      {pricingNotification.show && (
                        <Alert
                          severity={pricingNotification.type}
                          sx={{ mb: 2 }}
                          onClose={() =>
                            setPricingNotification((prev) => ({
                              ...prev,
                              show: false,
                            }))
                          }
                        >
                          {pricingNotification.message}
                        </Alert>
                      )}

                      {/* Helper text and manual update button */}
                      <Box
                        sx={{
                          mb: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: 'italic' }}
                        >
                          💡 Thông số định giá sẽ được tự động cập nhật khi bạn chọn Nhà vận chuyển,
                          Phương thức tính tiền và Loại xe. Khu vực phục vụ sẽ hiển thị các lựa chọn
                          phù hợp từ dropdown.
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        {/* Giá/km - chỉ hiển thị khi phương thức là 'perKm' */}
                        {newTransportForm.pricingMethod === 'perKm' && (
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Giá/km (VNĐ)"
                              value={formatNumber(newTransportForm.pricePerKm)}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                console.log('🔍 Debug pricePerKm - Input:', inputValue);

                                // Allow empty input for better UX
                                if (inputValue === '' || inputValue === '₫') {
                                  setNewTransportForm((prev) => ({
                                    ...prev,
                                    pricePerKm: 0,
                                  }));
                                  return;
                                }

                                const parsedValue = parseFormattedNumber(inputValue);
                                console.log('🔍 Debug pricePerKm - Parsed:', parsedValue);

                                setNewTransportForm((prev) => ({
                                  ...prev,
                                  pricePerKm: parsedValue,
                                }));
                              }}
                              placeholder="0"
                              InputProps={{
                                startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                              }}
                            />
                          </Grid>
                        )}

                        {/* Giá/khối - chỉ hiển thị khi phương thức là 'perM3' */}
                        {newTransportForm.pricingMethod === 'perM3' && (
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Giá/khối (VNĐ/m³)"
                              value={formatNumber(newTransportForm.pricePerM3)}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                console.log('🔍 Debug pricePerM3 - Input:', inputValue);

                                // Allow empty input for better UX
                                if (inputValue === '' || inputValue === '₫') {
                                  setNewTransportForm((prev) => ({
                                    ...prev,
                                    pricePerM3: 0,
                                  }));
                                  return;
                                }

                                const parsedValue = parseFormattedNumber(inputValue);
                                console.log('🔍 Debug pricePerM3 - Parsed:', parsedValue);

                                setNewTransportForm((prev) => ({
                                  ...prev,
                                  pricePerM3: parsedValue,
                                }));
                              }}
                              placeholder="0"
                              InputProps={{
                                startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                              }}
                            />
                          </Grid>
                        )}

                        {/* Giá/chuyến - chỉ hiển thị khi phương thức là 'perTrip' */}
                        {newTransportForm.pricingMethod === 'perTrip' && (
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Giá/chuyến (VNĐ)"
                              value={formatNumber(newTransportForm.pricePerTrip)}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                // Allow empty input for better UX
                                if (inputValue === '' || inputValue === '₫') {
                                  setNewTransportForm((prev) => ({
                                    ...prev,
                                    pricePerTrip: 0,
                                  }));
                                  return;
                                }

                                const parsedValue = parseFormattedNumber(inputValue);
                                setNewTransportForm((prev) => ({
                                  ...prev,
                                  pricePerTrip: parsedValue,
                                }));
                              }}
                              placeholder="0"
                              InputProps={{
                                startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                              }}
                            />
                          </Grid>
                        )}
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Chi phí điểm dừng (VNĐ/điểm)"
                            value={formatNumber(newTransportForm.stopFee)}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Allow empty input for better UX
                              if (inputValue === '' || inputValue === '₫') {
                                setNewTransportForm((prev) => ({
                                  ...prev,
                                  stopFee: 0,
                                }));
                                return;
                              }

                              const parsedValue = parseFormattedNumber(inputValue);
                              setNewTransportForm((prev) => ({
                                ...prev,
                                stopFee: parsedValue,
                              }));
                            }}
                            placeholder="0"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                            }}
                          />
                        </Grid>
                        {newTransportForm.fuelSurcharge > 0 && (
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Phí phụ xăng (VNĐ)"
                              value={formatNumber(newTransportForm.fuelSurcharge)}
                              InputProps={{
                                readOnly: true,
                                startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                              }}
                            />
                          </Grid>
                        )}
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Phí cầu đường (VNĐ)"
                            value={formatNumber(newTransportForm.tollFee)}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Allow empty input for better UX
                              if (inputValue === '' || inputValue === '₫') {
                                setNewTransportForm((prev) => ({
                                  ...prev,
                                  tollFee: 0,
                                }));
                                return;
                              }

                              const parsedValue = parseFormattedNumber(inputValue);
                              setNewTransportForm((prev) => ({
                                ...prev,
                                tollFee: parsedValue,
                              }));
                            }}
                            placeholder="0"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Phí bảo hiểm (VNĐ)"
                            value={formatNumber(newTransportForm.insuranceFee)}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Allow empty input for better UX
                              if (inputValue === '' || inputValue === '₫') {
                                setNewTransportForm((prev) => ({
                                  ...prev,
                                  insuranceFee: 0,
                                }));
                                return;
                              }

                              const parsedValue = parseFormattedNumber(inputValue);
                              setNewTransportForm((prev) => ({
                                ...prev,
                                insuranceFee: parsedValue,
                              }));
                            }}
                            placeholder="0"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Base rate (VNĐ)"
                            value={formatNumber(newTransportForm.baseRate)}
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              // Allow empty input for better UX
                              if (inputValue === '' || inputValue === '₫') {
                                setNewTransportForm((prev) => ({
                                  ...prev,
                                  baseRate: 0,
                                }));
                                return;
                              }

                              const parsedValue = parseFormattedNumber(inputValue);
                              setNewTransportForm((prev) => ({
                                ...prev,
                                baseRate: parsedValue,
                              }));
                            }}
                            placeholder="0"
                            InputProps={{
                              startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </div>

              {/* Tab Panel 1: Điểm giao hàng */}
              <div
                role="tabpanel"
                hidden={activeTab !== 1}
                id="transport-tabpanel-1"
                aria-labelledby="transport-tab-1"
              >
                {activeTab === 1 && (
                  <Grid container spacing={2}>
                    {/* Danh sách điểm giao hàng */}
                    <Grid item xs={12} md={7}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          maxHeight: '400px',
                          overflow: 'auto',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                          📦 Danh sách điểm giao hàng
                          {newTransportForm.pickupLocation && filteredTransfers.length === 0 && (
                            <Typography
                              variant="caption"
                              color="warning.main"
                              display="block"
                              mt={1}
                            >
                              ⚠️ Không có phiếu nào cho điểm nguồn đã chọn
                            </Typography>
                          )}
                        </Typography>

                        {!newTransportForm.pickupLocation ? (
                          <Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              Vui lòng chọn điểm nguồn trước khi chọn điểm giao hàng
                            </Typography>
                          </Box>
                        ) : getDeliveryPoints().length === 0 ? (
                          <Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              Không có phiếu nào cho điểm nguồn đã chọn
                            </Typography>
                          </Box>
                        ) : (
                          <List>
                            {getDeliveryPoints().map((point, index) => (
                              <React.Fragment key={index}>
                                <ListItem>
                                  <ListItemText
                                    primary={
                                      <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                      >
                                        <Box>
                                          <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            color="primary"
                                            sx={{ fontSize: '0.85rem' }}
                                          >
                                            {formatDeliveryAddress(
                                              point.address,
                                              point.transfers[0]?.deliveryLocation || ''
                                            )}
                                          </Typography>
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                              display: 'block',
                                              mt: 0.5,
                                              fontSize: '0.75rem',
                                            }}
                                          >
                                            {point.address}
                                          </Typography>
                                        </Box>
                                        <Box
                                          display="flex"
                                          gap={1}
                                          sx={{
                                            flexWrap: 'nowrap',
                                            minWidth: 'fit-content',
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              alignItems: 'center',
                                              minWidth: '60px',
                                              px: 1,
                                              py: 0.5,
                                              backgroundColor: 'primary.50',
                                              border: '1px solid',
                                              borderColor: 'primary.main',
                                              borderRadius: 1,
                                              textAlign: 'center',
                                            }}
                                          >
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: '0.6rem',
                                                fontWeight: 600,
                                                color: 'primary.main',
                                                lineHeight: 1,
                                              }}
                                            >
                                              {point.transferCount}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: '0.5rem',
                                                color: 'primary.main',
                                                lineHeight: 1,
                                              }}
                                            >
                                              phiếu
                                            </Typography>
                                          </Box>

                                          <Box
                                            sx={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              alignItems: 'center',
                                              minWidth: '60px',
                                              px: 1,
                                              py: 0.5,
                                              backgroundColor: 'secondary.50',
                                              border: '1px solid',
                                              borderColor: 'secondary.main',
                                              borderRadius: 1,
                                              textAlign: 'center',
                                            }}
                                          >
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: '0.6rem',
                                                fontWeight: 600,
                                                color: 'secondary.main',
                                                lineHeight: 1,
                                              }}
                                            >
                                              {point.totalPackages}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: '0.5rem',
                                                color: 'secondary.main',
                                                lineHeight: 1,
                                              }}
                                            >
                                              kiện
                                            </Typography>
                                          </Box>

                                          <Box
                                            sx={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              alignItems: 'center',
                                              minWidth: '70px',
                                              px: 1,
                                              py: 0.5,
                                              backgroundColor: 'success.50',
                                              border: '1px solid',
                                              borderColor: 'success.main',
                                              borderRadius: 1,
                                              textAlign: 'center',
                                            }}
                                          >
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: '0.6rem',
                                                fontWeight: 600,
                                                color: 'success.main',
                                                lineHeight: 1,
                                              }}
                                            >
                                              {point.totalProducts}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: '0.5rem',
                                                color: 'success.main',
                                                lineHeight: 1,
                                              }}
                                            >
                                              sản phẩm
                                            </Typography>
                                          </Box>

                                          <Box
                                            sx={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              alignItems: 'center',
                                              minWidth: '60px',
                                              px: 1,
                                              py: 0.5,
                                              backgroundColor: 'info.50',
                                              border: '1px solid',
                                              borderColor: 'info.main',
                                              borderRadius: 1,
                                              textAlign: 'center',
                                            }}
                                          >
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: '0.6rem',
                                                fontWeight: 600,
                                                color: 'info.main',
                                                lineHeight: 1,
                                              }}
                                            >
                                              {formatDecimal(point.totalVolume, 2)}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: '0.5rem',
                                                color: 'info.main',
                                                lineHeight: 1,
                                              }}
                                            >
                                              m³
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </Box>
                                    }
                                    secondary={
                                      <Box display="flex" flexWrap="wrap" gap={1}>
                                        {point.transfers.map((t) => {
                                          const isSelected = newTransportForm.selectedTransfers.has(
                                            t.id
                                          );
                                          return (
                                            <Box key={t.id} sx={{ mb: 0.5 }}>
                                              <StatusChip
                                                label={t.requestCode}
                                                status="active"
                                                variant={isSelected ? 'filled' : 'outlined'}
                                                disabled={
                                                  !isSelected &&
                                                  Object.keys(stopPoints).length >= 10
                                                }
                                                onClick={() => {
                                                  // Kiểm tra giới hạn điểm dừng trước khi thêm
                                                  if (
                                                    !isSelected &&
                                                    Object.keys(stopPoints).length >= 10
                                                  ) {
                                                    setSnackbar({
                                                      open: true,
                                                      message:
                                                        '⚠️ Đã đạt tối đa 10 điểm dừng. Không thể thêm điểm dừng mới!',
                                                      severity: 'warning',
                                                    });
                                                    return;
                                                  }

                                                  const newSelected = new Set(
                                                    newTransportForm.selectedTransfers
                                                  );
                                                  if (isSelected) {
                                                    newSelected.delete(t.id);
                                                  } else {
                                                    newSelected.add(t.id);
                                                  }
                                                  setNewTransportForm((prev) => ({
                                                    ...prev,
                                                    selectedTransfers: newSelected,
                                                  }));

                                                  // Khi chọn 1 phiếu ở trái, cập nhật điểm dừng hiển thị bên phải
                                                  handleTransferClick(t.id, point.address);
                                                }}
                                                sx={{ cursor: 'pointer' }}
                                              />
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                  display: 'block',
                                                  ml: 1,
                                                  fontSize: '0.7rem',
                                                  fontStyle: 'italic',
                                                }}
                                              >
                                                ID: {t.transferId || t.id}
                                              </Typography>
                                            </Box>
                                          );
                                        })}
                                      </Box>
                                    }
                                  />
                                </ListItem>
                                {index < getDeliveryPoints().length - 1 && <Divider />}
                              </React.Fragment>
                            ))}
                          </List>
                        )}
                      </Paper>
                    </Grid>

                    {/* Thông tin tổng hợp */}
                    <Grid item xs={12} md={5}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          height: '400px',
                          overflow: 'auto',
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                          📊 Thông tin tổng hợp
                        </Typography>

                        {newTransportForm.pickupLocation && (
                          <Box mb={2}>
                            <Typography variant="subtitle2" fontWeight={600} color="primary">
                              🚛 Điểm nguồn đã chọn:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {(() => {
                                const selectedLocation = locations.find(
                                  (loc) => loc.id === newTransportForm.pickupLocation
                                );
                                return selectedLocation
                                  ? `${selectedLocation.code} - ${selectedLocation.address}`
                                  : 'Không tìm thấy thông tin';
                              })()}
                            </Typography>
                          </Box>
                        )}

                        {newTransportForm.carrierName && (
                          <Box mb={2}>
                            <Typography variant="subtitle2" fontWeight={600} color="primary">
                              🚚 Nhà vận chuyển:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {newTransportForm.carrierName}
                              {newTransportForm.pricingMethod && (
                                <span>
                                  {' '}
                                  - {getPricingMethodLabel(newTransportForm.pricingMethod)}
                                </span>
                              )}
                            </Typography>
                          </Box>
                        )}

                        {newTransportForm.vehicleType && (
                          <Box mb={2}>
                            <Typography variant="subtitle2" fontWeight={600} color="primary">
                              🚛 Loại xe:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {newTransportForm.vehicleType}
                            </Typography>
                          </Box>
                        )}

                        {newTransportForm.serviceArea && (
                          <Box mb={2}>
                            <Typography variant="subtitle2" fontWeight={600} color="primary">
                              🌍 Khu vực phục vụ:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {newTransportForm.serviceArea}
                            </Typography>
                          </Box>
                        )}

                        {newTransportForm.department && (
                          <Box mb={2}>
                            <Typography variant="subtitle2" fontWeight={600} color="primary">
                              🏢 Phòng ban sử dụng:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {newTransportForm.department}
                            </Typography>
                          </Box>
                        )}

                        {/* Định giá */}
                        {(newTransportForm.pricePerKm > 0 ||
                          newTransportForm.pricePerTrip > 0 ||
                          newTransportForm.pricePerM3 > 0 ||
                          newTransportForm.stopFee > 0 ||
                          newTransportForm.baseRate > 0) && (
                          <Box mb={2}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              color="primary"
                              sx={{
                                borderBottom: '2px solid',
                                borderColor: 'primary.main',
                                pb: 1,
                                mb: 2,
                              }}
                            >
                              💰 Định giá
                            </Typography>
                          </Box>
                        )}

                        {newTransportForm.pricePerKm !== undefined &&
                          newTransportForm.pricePerKm !== null &&
                          newTransportForm.pricePerKm > 0 && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" fontWeight={600} color="primary">
                                🛣️ Giá/km:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {newTransportForm.pricePerKm.toLocaleString('vi-VN')} VND
                              </Typography>
                            </Box>
                          )}

                        {newTransportForm.pricePerTrip !== undefined &&
                          newTransportForm.pricePerTrip !== null &&
                          newTransportForm.pricePerTrip > 0 && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" fontWeight={600} color="primary">
                                🚛 Giá/chuyến:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {newTransportForm.pricePerTrip.toLocaleString('vi-VN')} VND
                              </Typography>
                            </Box>
                          )}

                        {newTransportForm.pricePerM3 !== undefined &&
                          newTransportForm.pricePerM3 !== null &&
                          newTransportForm.pricePerM3 > 0 && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" fontWeight={600} color="primary">
                                📦 Giá/khối:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {newTransportForm.pricePerM3.toLocaleString('vi-VN')} VND/m³
                              </Typography>
                            </Box>
                          )}

                        {newTransportForm.stopFee !== undefined &&
                          newTransportForm.stopFee !== null &&
                          newTransportForm.stopFee > 0 && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" fontWeight={600} color="primary">
                                🛑 Chi phí điểm dừng:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {newTransportForm.stopFee.toLocaleString('vi-VN')} VND/điểm
                              </Typography>
                            </Box>
                          )}

                        {newTransportForm.baseRate !== undefined &&
                          newTransportForm.baseRate !== null &&
                          newTransportForm.baseRate > 0 && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" fontWeight={600} color="primary">
                                💰 Base rate:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {newTransportForm.baseRate.toLocaleString('vi-VN')} VND
                              </Typography>
                            </Box>
                          )}

                        {/* Phụ phí */}
                        {(newTransportForm.fuelSurcharge > 0 ||
                          newTransportForm.tollFee > 0 ||
                          newTransportForm.insuranceFee > 0) && (
                          <Box mb={2}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              color="primary"
                              sx={{
                                borderBottom: '2px solid',
                                borderColor: 'primary.main',
                                pb: 1,
                                mb: 2,
                              }}
                            >
                              📋 Phụ phí
                            </Typography>
                          </Box>
                        )}

                        {newTransportForm.fuelSurcharge !== undefined &&
                          newTransportForm.fuelSurcharge !== null &&
                          newTransportForm.fuelSurcharge > 0 && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" fontWeight={600} color="primary">
                                ⛽ Phí phụ xăng:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {newTransportForm.fuelSurcharge.toLocaleString('vi-VN')} VND
                              </Typography>
                            </Box>
                          )}

                        {newTransportForm.tollFee !== undefined &&
                          newTransportForm.tollFee !== null &&
                          newTransportForm.tollFee > 0 && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" fontWeight={600} color="primary">
                                🛣️ Phí cầu đường:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {newTransportForm.tollFee.toLocaleString('vi-VN')} VND
                              </Typography>
                            </Box>
                          )}

                        {newTransportForm.insuranceFee !== undefined &&
                          newTransportForm.insuranceFee !== null &&
                          newTransportForm.insuranceFee > 0 && (
                            <Box mb={2}>
                              <Typography variant="subtitle2" fontWeight={600} color="primary">
                                🛡️ Phí bảo hiểm:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {newTransportForm.insuranceFee.toLocaleString('vi-VN')} VND
                              </Typography>
                            </Box>
                          )}

                        {/* Divider sau nhóm Định giá và Phụ phí */}
                        {(newTransportForm.pricePerKm > 0 ||
                          newTransportForm.pricePerTrip > 0 ||
                          newTransportForm.pricePerM3 > 0 ||
                          newTransportForm.stopFee > 0 ||
                          newTransportForm.baseRate > 0 ||
                          newTransportForm.fuelSurcharge > 0 ||
                          newTransportForm.tollFee > 0 ||
                          newTransportForm.insuranceFee > 0) && <Divider sx={{ my: 2 }} />}

                        {/* Chi phí vận chuyển */}
                        {newTransportForm.selectedTransfers.size > 0 && (
                          <Box mb={2}>
                            <Typography variant="subtitle2" fontWeight={600} color="primary">
                              💰 Chi phí vận chuyển:
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              color="white"
                              sx={{
                                p: 1.5,
                                bgcolor: 'primary.main',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'primary.dark',
                                textAlign: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              }}
                            >
                              {formatNumber(calculateEstimatedCost())} VND
                            </Typography>
                          </Box>
                        )}

                        {/* Chi tiết tính toán chi phí */}
                        {newTransportForm.selectedTransfers.size > 0 &&
                          newTransportForm.carrierName &&
                          newTransportForm.pricingMethod && (
                            <Box mb={2}>
                              <CostCalculationDetails
                                formData={{
                                  pricingMethod: newTransportForm.pricingMethod || 'perKm',
                                  baseRate: newTransportForm.baseRate || 0,
                                  pricePerKm: newTransportForm.pricePerKm || 0,
                                  pricePerTrip: newTransportForm.pricePerTrip || 0,
                                  pricePerM3: newTransportForm.pricePerM3 || 0,
                                  stopFee: newTransportForm.stopFee || 0,
                                  fuelSurcharge: newTransportForm.fuelSurcharge || 0,
                                  tollFee: newTransportForm.tollFee || 0,
                                  insuranceFee: newTransportForm.insuranceFee || 0,
                                  totalDistance: Object.values(stopPointDistances).reduce(
                                    (sum, distance) => sum + distance,
                                    0
                                  ),
                                  totalStops: selectedStopPoints.size, // KHÔNG tính điểm nguồn
                                  totalVolume: transportRequests
                                    .filter(
                                      (t) => t.id && newTransportForm.selectedTransfers.has(t.id)
                                    )
                                    .reduce((sum, t) => sum + (t.volume || 0 || 0), 0),
                                }}
                              />
                            </Box>
                          )}

                        {/* Total Summary */}
                        {newTransportForm.selectedTransfers.size > 0 && (
                          <Box mb={2}>
                            <Typography variant="subtitle2" fontWeight={600} color="primary">
                              📊 Tổng hợp:
                            </Typography>
                            <Box
                              display="flex"
                              gap={1}
                              flexWrap="nowrap"
                              sx={{
                                p: 1.5,
                                bgcolor: 'grey.50',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'grey.200',
                                minWidth: 'fit-content',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  minWidth: '60px',
                                  px: 1,
                                  py: 0.5,
                                  backgroundColor: 'primary.50',
                                  border: '1px solid',
                                  borderColor: 'primary.main',
                                  borderRadius: 1,
                                  textAlign: 'center',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.6rem',
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    lineHeight: 1,
                                  }}
                                >
                                  {formatNumber(newTransportForm.selectedTransfers.size)}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.5rem',
                                    color: 'primary.main',
                                    lineHeight: 1,
                                  }}
                                >
                                  phiếu
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  minWidth: '60px',
                                  px: 1,
                                  py: 0.5,
                                  backgroundColor: 'secondary.50',
                                  border: '1px solid',
                                  borderColor: 'secondary.main',
                                  borderRadius: 1,
                                  textAlign: 'center',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.6rem',
                                    fontWeight: 600,
                                    color: 'secondary.main',
                                    lineHeight: 1,
                                  }}
                                >
                                  {formatNumber(
                                    transportRequests
                                      .filter(
                                        (t) => t.id && newTransportForm.selectedTransfers.has(t.id)
                                      )
                                      .reduce((sum, t) => sum + (t.totalPackages || 0), 0)
                                  )}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.5rem',
                                    color: 'secondary.main',
                                    lineHeight: 1,
                                  }}
                                >
                                  kiện
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  minWidth: '70px',
                                  px: 1,
                                  py: 0.5,
                                  backgroundColor: 'success.50',
                                  border: '1px solid',
                                  borderColor: 'success.main',
                                  borderRadius: 1,
                                  textAlign: 'center',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.6rem',
                                    fontWeight: 600,
                                    color: 'success.main',
                                    lineHeight: 1,
                                  }}
                                >
                                  {formatNumber(
                                    transportRequests
                                      .filter(
                                        (t) => t.id && newTransportForm.selectedTransfers.has(t.id)
                                      )
                                      .reduce((sum, t) => {
                                        const productCount = parseInt(t.totalProducts) || 0;
                                        return sum + productCount;
                                      }, 0)
                                  )}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.5rem',
                                    color: 'success.main',
                                    lineHeight: 1,
                                  }}
                                >
                                  sản phẩm
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  minWidth: '60px',
                                  px: 1,
                                  py: 0.5,
                                  backgroundColor: 'info.50',
                                  border: '1px solid',
                                  borderColor: 'info.main',
                                  borderRadius: 1,
                                  textAlign: 'center',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.6rem',
                                    fontWeight: 600,
                                    color: 'info.main',
                                    lineHeight: 1,
                                  }}
                                >
                                  {formatDecimal(
                                    transportRequests
                                      .filter(
                                        (t) => t.id && newTransportForm.selectedTransfers.has(t.id)
                                      )
                                      .reduce((sum, t) => sum + (t.volume || 0 || 0), 0),
                                    2
                                  )}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.5rem',
                                    color: 'info.main',
                                    lineHeight: 1,
                                  }}
                                >
                                  m³
                                </Typography>
                              </Box>
                              {(() => {
                                const totalDistance = Object.values(stopPointDistances).reduce(
                                  (sum, distance) => sum + distance,
                                  0
                                );
                                return totalDistance > 0 ? (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      minWidth: '60px',
                                      px: 1,
                                      py: 0.5,
                                      backgroundColor: 'success.50',
                                      border: '1px solid',
                                      borderColor: 'success.main',
                                      borderRadius: 1,
                                      textAlign: 'center',
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: '0.6rem',
                                        fontWeight: 600,
                                        color: 'success.main',
                                        lineHeight: 1,
                                      }}
                                    >
                                      {formatDecimal(totalDistance, 1)}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: '0.5rem',
                                        color: 'success.main',
                                        lineHeight: 1,
                                      }}
                                    >
                                      km
                                    </Typography>
                                  </Box>
                                ) : null;
                              })()}
                              {selectedStopPoints.size > 0 && (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    minWidth: '70px',
                                    px: 1,
                                    py: 0.5,
                                    backgroundColor:
                                      selectedStopPoints.size > 10 ? 'error.50' : 'warning.50',
                                    border: '1px solid',
                                    borderColor:
                                      selectedStopPoints.size > 10 ? 'error.main' : 'warning.main',
                                    borderRadius: 1,
                                    textAlign: 'center',
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: '0.6rem',
                                      fontWeight: 600,
                                      color:
                                        selectedStopPoints.size > 10
                                          ? 'error.main'
                                          : 'warning.main',
                                      lineHeight: 1,
                                    }}
                                  >
                                    {formatNumber(selectedStopPoints.size)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontSize: '0.5rem',
                                      color:
                                        selectedStopPoints.size > 10
                                          ? 'error.main'
                                          : 'warning.main',
                                      lineHeight: 1,
                                    }}
                                  >
                                    điểm dừng
                                  </Typography>
                                </Box>
                              )}
                              {selectedStopPoints.size > 10 && (
                                <Typography
                                  variant="caption"
                                  color="error"
                                  sx={{
                                    display: 'block',
                                    mt: 0.5,
                                    fontWeight: 'bold',
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  ⚠️ Vượt quá giới hạn 10 điểm dừng!
                                </Typography>
                              )}
                            </Box>

                            {/* Danh sách Transfer IDs */}
                            <Box mt={1}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block', mb: 0.5 }}
                              >
                                📋 Danh sách Transfer IDs:
                              </Typography>
                              <Box
                                display="flex"
                                gap={0.5}
                                flexWrap="wrap"
                                sx={{
                                  p: 1,
                                  bgcolor: 'grey.100',
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'grey.300',
                                }}
                              >
                                {transportRequests
                                  .filter(
                                    (t) => t.id && newTransportForm.selectedTransfers.has(t.id)
                                  )
                                  .map((t) => (
                                    <StatusChip
                                      key={t.id}
                                      label={t.transferId || t.id}
                                      status="active"
                                      sx={{
                                        fontSize: '0.65rem',
                                        height: '20px',
                                        '& .MuiChip-label': {
                                          px: 0.5,
                                        },
                                      }}
                                    />
                                  ))}
                              </Box>
                            </Box>
                          </Box>
                        )}

                        {/* Stop Point Distances */}
                        <DistanceDisplay
                          distances={stopPointDistances}
                          selectedStopPoints={selectedStopPoints}
                          stopPoints={stopPoints}
                          locations={locations}
                          pickupLocation={newTransportForm.pickupLocation}
                          isCalculating={isCalculatingStopDistances}
                          error={distanceError}
                          formatDecimal={formatDecimal}
                          onRecalculate={calculateStopPointDistances}
                          onTestConnectivity={testGoogleAppsScript}
                        />

                        {/* Selected Stop Points Summary */}
                        {Array.from(selectedStopPoints).map((stopKey, index) => {
                          const stopPoint = stopPoints[stopKey];
                          if (!stopPoint) return null;

                          // Lọc phiếu đã chọn cho điểm dừng này
                          const selectedTransfersForStop = transportRequests.filter(
                            (t) =>
                              newTransportForm.selectedTransfers.has(t.id) &&
                              stopPoint.transfers.includes(t.id)
                          );

                          return (
                            <Box key={stopKey} mb={2}>
                              <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <LocationOn
                                  fontSize="small"
                                  color="secondary"
                                  sx={{ fontSize: '1rem' }}
                                />
                                <Typography variant="body2" fontWeight={600} color="secondary">
                                  Điểm dừng {index + 1}:
                                </Typography>
                              </Box>
                              <Box mb={1}>
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  color="primary"
                                  sx={{ fontSize: '0.85rem' }}
                                >
                                  {formatDeliveryAddress(
                                    stopPoint.address,
                                    transportRequests.find(
                                      (t) =>
                                        newTransportForm.selectedTransfers.has(t.id) &&
                                        stopPoint.transfers.includes(t.id)
                                    )?.deliveryLocation || ''
                                  )}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: 'block',
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  {stopPoint.address}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="body2" fontWeight={500} mb={1}>
                                  Mã số phiếu đã chọn:
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                                  {selectedTransfersForStop.map((transfer) => (
                                    <StatusChip
                                      key={transfer.id}
                                      label={transfer.requestCode}
                                      status="active"
                                      variant="filled"
                                      onClick={() => {
                                        const newSelected = new Set(
                                          newTransportForm.selectedTransfers
                                        );
                                        newSelected.delete(transfer.id);
                                        setNewTransportForm((prev) => ({
                                          ...prev,
                                          selectedTransfers: newSelected,
                                        }));
                                      }}
                                      sx={{ cursor: 'pointer' }}
                                    />
                                  ))}
                                </Box>
                                <Box
                                  display="flex"
                                  gap={1}
                                  flexWrap="nowrap"
                                  sx={{
                                    p: 1.5,
                                    bgcolor: 'grey.50',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'grey.200',
                                    minWidth: 'fit-content',
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      minWidth: '60px',
                                      px: 1,
                                      py: 0.5,
                                      backgroundColor: 'primary.50',
                                      border: '1px solid',
                                      borderColor: 'primary.main',
                                      borderRadius: 1,
                                      textAlign: 'center',
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: '0.6rem',
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        lineHeight: 1,
                                      }}
                                    >
                                      {selectedTransfersForStop.length}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: '0.5rem',
                                        color: 'primary.main',
                                        lineHeight: 1,
                                      }}
                                    >
                                      phiếu
                                    </Typography>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      minWidth: '60px',
                                      px: 1,
                                      py: 0.5,
                                      backgroundColor: 'secondary.50',
                                      border: '1px solid',
                                      borderColor: 'secondary.main',
                                      borderRadius: 1,
                                      textAlign: 'center',
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: '0.6rem',
                                        fontWeight: 600,
                                        color: 'secondary.main',
                                        lineHeight: 1,
                                      }}
                                    >
                                      {selectedTransfersForStop.reduce(
                                        (sum, t) => sum + t.totalPackages,
                                        0
                                      )}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: '0.5rem',
                                        color: 'secondary.main',
                                        lineHeight: 1,
                                      }}
                                    >
                                      kiện
                                    </Typography>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      minWidth: '60px',
                                      px: 1,
                                      py: 0.5,
                                      backgroundColor: 'info.50',
                                      border: '1px solid',
                                      borderColor: 'info.main',
                                      borderRadius: 1,
                                      textAlign: 'center',
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: '0.6rem',
                                        fontWeight: 600,
                                        color: 'info.main',
                                        lineHeight: 1,
                                      }}
                                    >
                                      {selectedTransfersForStop
                                        .reduce((sum, t) => sum + t.volume || 0, 0)
                                        .toFixed(2)}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        fontSize: '0.5rem',
                                        color: 'info.main',
                                        lineHeight: 1,
                                      }}
                                    >
                                      m³
                                    </Typography>
                                  </Box>

                                  {stopPointDistances[stopKey] &&
                                    stopPointDistances[stopKey] > 0 && (
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          minWidth: '60px',
                                          px: 1,
                                          py: 0.5,
                                          backgroundColor: 'success.50',
                                          border: '1px solid',
                                          borderColor: 'success.main',
                                          borderRadius: 1,
                                          textAlign: 'center',
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontSize: '0.6rem',
                                            fontWeight: 600,
                                            color: 'success.main',
                                            lineHeight: 1,
                                          }}
                                        >
                                          {formatDecimal(stopPointDistances[stopKey], 1)}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontSize: '0.5rem',
                                            color: 'success.main',
                                            lineHeight: 1,
                                          }}
                                        >
                                          km
                                        </Typography>
                                      </Box>
                                    )}
                                </Box>
                              </Box>
                            </Box>
                          );
                        })}

                        {/* No Selection Message */}
                        {newTransportForm.selectedTransfers.size === 0 && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              Vui lòng chọn ít nhất một điểm giao hàng
                            </Typography>
                            {!newTransportForm.pickupLocation && (
                              <Typography variant="body2" color="warning.main">
                                ⚠️ Vui lòng chọn điểm nguồn trước khi chọn điểm giao hàng
                              </Typography>
                            )}
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                )}
              </div>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog(true)} disabled={closingDialog}>
            {closingDialog ? 'Đang xóa...' : 'Hủy'}
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitNewRequest}
            disabled={!currentRequestId || submittingRequest}
            startIcon={submittingRequest ? <CircularProgress size={16} /> : null}
            sx={{
              minWidth: '200px',
              position: 'relative',
              overflow: 'hidden',
              '&:disabled': {
                backgroundColor: 'primary.main',
                color: 'white',
              },
            }}
          >
            {submittingRequest
              ? 'Đang tạo yêu cầu...'
              : editing
                ? 'Cập nhật'
                : 'Tạo yêu cầu vận chuyển'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm điểm nguồn */}
      <Dialog
        open={showAddLocationDialog}
        onClose={handleCloseAddLocationDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Thêm điểm nguồn mới</Typography>
            <IconButton onClick={handleCloseAddLocationDialog}>
              <Delete />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {!addLocationType ? (
            // Step 1: Chọn loại điểm nguồn
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Chọn loại điểm nguồn bạn muốn thêm:
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    onClick={() => handleAddLocationTypeSelect('system')}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        🏢 Điểm nguồn hệ thống
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Thêm vào danh sách địa điểm chính thức của hệ thống. Sẽ được lưu vĩnh viễn
                        và có thể sử dụng cho các chuyến khác.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: '2px solid',
                      borderColor: 'secondary.main',
                      '&:hover': {
                        backgroundColor: 'secondary.light',
                        color: 'white',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                    onClick={() => handleAddLocationTypeSelect('temporary')}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        🚚 Điểm nguồn tạm thời
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Chỉ sử dụng cho chuyến này. Không lưu vào hệ thống chính.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          ) : addLocationType === 'system' ? (
            // Step 2: Form thêm điểm nguồn hệ thống
            <Box>
              <Typography variant="h6" gutterBottom>
                Thêm điểm nguồn hệ thống mới
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mã địa điểm *"
                    value={newSystemLocation.code}
                    onChange={(e) =>
                      setNewSystemLocation((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Avatar</InputLabel>
                    <Select
                      value={newSystemLocation.avatar}
                      onChange={(e) =>
                        setNewSystemLocation((prev) => ({
                          ...prev,
                          avatar: e.target.value,
                        }))
                      }
                      label="Avatar"
                    >
                      {AVATAR_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                      value={newSystemLocation.category}
                      onChange={(e) =>
                        setNewSystemLocation((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      label="Danh mục"
                    >
                      {CATEGORY_OPTIONS.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Hạng mục"
                    value={newSystemLocation.subcategory}
                    onChange={(e) =>
                      setNewSystemLocation((prev) => ({
                        ...prev,
                        subcategory: e.target.value,
                      }))
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    value={newSystemLocation.address}
                    onChange={(e) =>
                      setNewSystemLocation((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Phường/Xã"
                    value={newSystemLocation.ward}
                    onChange={(e) =>
                      setNewSystemLocation((prev) => ({
                        ...prev,
                        ward: e.target.value,
                      }))
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Quận/Huyện"
                    value={newSystemLocation.district}
                    onChange={(e) =>
                      setNewSystemLocation((prev) => ({
                        ...prev,
                        district: e.target.value,
                      }))
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Tỉnh/Thành phố</InputLabel>
                    <Select
                      value={newSystemLocation.province}
                      onChange={(e) =>
                        setNewSystemLocation((prev) => ({
                          ...prev,
                          province: e.target.value,
                        }))
                      }
                      label="Tỉnh/Thành phố"
                    >
                      {PROVINCE_OPTIONS.map((province) => (
                        <MenuItem key={province} value={province}>
                          {province}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ghi chú"
                    value={newSystemLocation.note}
                    onChange={(e) =>
                      setNewSystemLocation((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : (
            // Step 3: Form thêm điểm nguồn tạm
            <Box>
              <Typography variant="h6" gutterBottom>
                Thêm điểm nguồn tạm thời
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    value={newTemporaryLocation.address}
                    onChange={(e) =>
                      setNewTemporaryLocation((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Phường/Xã"
                    value={newTemporaryLocation.ward}
                    onChange={(e) =>
                      setNewTemporaryLocation((prev) => ({
                        ...prev,
                        ward: e.target.value,
                      }))
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Quận/Huyện"
                    value={newTemporaryLocation.district}
                    onChange={(e) =>
                      setNewTemporaryLocation((prev) => ({
                        ...prev,
                        district: e.target.value,
                      }))
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Tỉnh/Thành phố"
                    value={newTemporaryLocation.province}
                    onChange={(e) =>
                      setNewTemporaryLocation((prev) => ({
                        ...prev,
                        province: e.target.value,
                      }))
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseAddLocationDialog}>Hủy</Button>

          {addLocationType && (
            <Button
              variant="contained"
              onClick={
                addLocationType === 'system'
                  ? handleSaveSystemLocation
                  : handleSaveTemporaryLocation
              }
              disabled={savingLocation}
              startIcon={savingLocation ? <CircularProgress size={16} /> : null}
            >
              {savingLocation ? 'Đang lưu...' : 'Lưu'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            maxWidth: '600px',
            '& .MuiAlert-message': {
              whiteSpace: 'pre-line',
              fontSize: '0.8rem',
              lineHeight: 1.3,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* New Transport Request Dialog */}
      <Dialog
        open={newTransportDialogOpen}
        onClose={handleNewTransportDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {newTransportType === 'system' ? (
              <Business color="primary" />
            ) : (
              <Public color="secondary" />
            )}
            <Typography variant="h6">
              Tạo đề nghị vận chuyển -{' '}
              {newTransportType === 'system' ? 'Từ hệ thống' : 'Ngoài hệ thống'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              {newTransportType === 'system'
                ? 'Từ hệ thống: Chọn 1 điểm đi và 1 điểm đến (không trùng nhau, phải có trong Locations sheet)'
                : 'Ngoài hệ thống: Có thể chọn nhiều điểm đến, ít nhất 1 điểm không nằm trong địa điểm lưu'}
            </Alert>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Mã đề nghị"
                  value=""
                  disabled
                  helperText="Mã sẽ được tự động tạo"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Có vali</InputLabel>
                  <Select
                    value={hasLuggage}
                    onChange={(e) => setHasLuggage(e.target.value)}
                    label="Có vali"
                  >
                    <MenuItem value="Có vali">Có vali</MenuItem>
                    <MenuItem value="Không vali">Không vali</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Các trường mới */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Trạng thái"
                  value={transportStatus}
                  disabled
                  helperText="Trạng thái mặc định khi tạo"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Trạng thái vận chuyển"
                  value={shippingStatus}
                  disabled
                  helperText="Trạng thái vận chuyển mặc định"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Phòng ban sử dụng *</InputLabel>
                  <Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    label="Phòng ban sử dụng *"
                    required
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.name}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <span>{dept.icon}</span>
                          <span>{dept.name}</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Người tạo phiếu"
                  value={createdBy}
                  disabled
                  helperText="Tự động lấy từ thông tin đăng nhập"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày đề nghị"
                  value={requestDate}
                  disabled
                  helperText="Ngày hiện tại"
                />
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {/* Select điểm đi */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Điểm đi</InputLabel>
                      <Select
                        value={newTransportForm.originId}
                        label="Điểm đi"
                        onChange={(e) => {
                          const selectedValue = e.target.value as string;

                          // Kiểm tra không được trùng với điểm đến (chỉ cho "Từ hệ thống")
                          if (
                            newTransportType === 'system' &&
                            selectedValue &&
                            newTransportForm.destinationIds.includes(selectedValue)
                          ) {
                            setSnackbar({
                              open: true,
                              message: 'Điểm đi không được trùng với điểm đến',
                              severity: 'error',
                            });
                            return;
                          }

                          setNewTransportForm((prev) => ({
                            ...prev,
                            originId: selectedValue,
                          }));
                        }}
                        onClose={() => {
                          // Xử lý khi click outside để đóng dropdown
                          console.log('Điểm đi dropdown đã đóng');
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 300,
                              overflow: 'auto',
                            },
                          },
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                          transformOrigin: {
                            vertical: 'top',
                            horizontal: 'left',
                          },
                          // Tự động đóng khi click outside
                          disableAutoFocusItem: true,
                          // Cải thiện UX khi click outside
                          variant: 'menu',
                        }}
                      >
                        {locations.map((location) => (
                          <MenuItem key={location.id} value={location.id}>
                            <Box display="flex" alignItems="center" gap={1}>
                              {isLocationInSystem(location.id) ? (
                                <Business color="primary" fontSize="small" />
                              ) : (
                                <Public color="secondary" fontSize="small" />
                              )}
                              {location.code} - {location.address}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Hiển thị địa chỉ điểm đi bên phải */}
                  <Grid item xs={12} md={6}>
                    {newTransportForm.originId &&
                      (() => {
                        const selectedOrigin = locations.find(
                          (loc) => loc.id === newTransportForm.originId
                        );
                        return selectedOrigin ? (
                          <Box
                            sx={{
                              p: 1,
                              backgroundColor: 'primary.50',
                              borderRadius: 1,
                              border: '2px solid',
                              borderColor: 'primary.main',
                              height: '56px', // Match Select height exactly
                              display: 'flex',
                              alignItems: 'center',
                              overflow: 'hidden',
                              boxShadow: '0 0 0 1px rgba(25, 118, 210, 0.2)',
                            }}
                          >
                            <LocationOn
                              color="primary"
                              fontSize="small"
                              sx={{ mr: 1, flexShrink: 0 }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.primary',
                                lineHeight: 1.2,
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                wordBreak: 'break-word',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                flex: 1,
                              }}
                            >
                              {selectedOrigin.address}
                              {selectedOrigin.ward && `, ${selectedOrigin.ward}`}
                              {selectedOrigin.district && `, ${selectedOrigin.district}`}
                              {selectedOrigin.province && `, ${selectedOrigin.province}`}
                            </Typography>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              height: '56px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'text.disabled',
                              fontSize: '0.875rem',
                            }}
                          >
                            Chọn điểm đi để xem địa chỉ
                          </Box>
                        );
                      })()}
                  </Grid>
                </Grid>
              </Grid>

              {/* Chỉ hiển thị trường "Điểm đến" khi đã chọn điểm đi */}
              {newTransportForm.originId && (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {/* Select điểm đến */}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Điểm đến</InputLabel>
                        <Select
                          value={
                            newTransportType === 'system'
                              ? newTransportForm.destinationIds[0] || ''
                              : newTransportForm.destinationIds
                          }
                          label="Điểm đến"
                          multiple={newTransportType === 'external'}
                          open={destinationSelectOpen}
                          onOpen={() => setDestinationSelectOpen(true)}
                          onClose={() => setDestinationSelectOpen(false)}
                          onChange={(e) => {
                            if (newTransportType === 'system') {
                              // Từ hệ thống: chỉ cho phép 1 điểm đến
                              const selectedValue = e.target.value as string;

                              // Kiểm tra không được trùng với điểm đi
                              if (selectedValue && selectedValue === newTransportForm.originId) {
                                setSnackbar({
                                  open: true,
                                  message: 'Điểm đến không được trùng với điểm đi',
                                  severity: 'error',
                                });
                                return;
                              }

                              setNewTransportForm((prev) => ({
                                ...prev,
                                destinationIds: selectedValue ? [selectedValue] : [],
                              }));
                            } else {
                              // Ngoài hệ thống: cho phép multiple
                              const newValue = Array.isArray(e.target.value) ? e.target.value : [];
                              setNewTransportForm((prev) => ({
                                ...prev,
                                destinationIds: newValue,
                              }));
                            }

                            // Đóng dropdown sau khi chọn
                            setTimeout(() => {
                              setDestinationSelectOpen(false);
                            }, 150);
                          }}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300,
                                overflow: 'auto',
                              },
                            },
                            anchorOrigin: {
                              vertical: 'bottom',
                              horizontal: 'left',
                            },
                            transformOrigin: {
                              vertical: 'top',
                              horizontal: 'left',
                            },
                            // Tự động đóng khi click outside
                            disableAutoFocusItem: true,
                            // Cải thiện UX khi click outside
                            variant: 'menu',
                          }}
                        >
                          {locations.map((location) => (
                            <MenuItem key={location.id} value={location.id}>
                              <Box display="flex" alignItems="center" gap={1}>
                                {isLocationInSystem(location.id) ? (
                                  <Business color="primary" fontSize="small" />
                                ) : (
                                  <Public color="secondary" fontSize="small" />
                                )}
                                {location.code} - {location.address}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Hiển thị địa chỉ điểm đến bên phải (chỉ cho "Từ hệ thống") */}
                    <Grid item xs={12} md={6}>
                      {newTransportType === 'system' &&
                        newTransportForm.destinationIds.length > 0 &&
                        (() => {
                          const selectedDestination = locations.find(
                            (loc) => loc.id === newTransportForm.destinationIds[0]
                          );
                          return selectedDestination ? (
                            <Box
                              sx={{
                                p: 1,
                                backgroundColor: 'success.50',
                                borderRadius: 1,
                                border: '2px solid',
                                borderColor: 'success.main',
                                height: '56px', // Match Select height exactly
                                display: 'flex',
                                alignItems: 'center',
                                overflow: 'hidden',
                                boxShadow: '0 0 0 1px rgba(46, 125, 50, 0.2)',
                              }}
                            >
                              <LocationOn
                                color="success"
                                fontSize="small"
                                sx={{ mr: 1, flexShrink: 0 }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'text.primary',
                                  lineHeight: 1.2,
                                  fontSize: '0.7rem',
                                  fontWeight: 500,
                                  wordBreak: 'break-word',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  flex: 1,
                                }}
                              >
                                {selectedDestination.address}
                                {selectedDestination.ward && `, ${selectedDestination.ward}`}
                                {selectedDestination.district &&
                                  `, ${selectedDestination.district}`}
                                {selectedDestination.province &&
                                  `, ${selectedDestination.province}`}
                              </Typography>
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                height: '56px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'text.disabled',
                                fontSize: '0.875rem',
                              }}
                            >
                              Chọn điểm đến để xem địa chỉ
                            </Box>
                          );
                        })()}
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* Hiển thị các điểm đến đã chọn với khả năng xóa (chỉ cho "Ngoài hệ thống") */}
              {newTransportType === 'external' && newTransportForm.destinationIds.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Điểm đến đã chọn ({newTransportForm.destinationIds.length}
                      ):
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {newTransportForm.destinationIds.map((destinationId) => {
                        const location = locations.find((loc) => loc.id === destinationId);
                        if (!location) return null;

                        return (
                          <Box
                            key={destinationId}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1,
                              border: '1px solid',
                              borderColor: 'primary.main',
                              borderRadius: 1,
                              backgroundColor: 'primary.50',
                              minWidth: '200px',
                            }}
                          >
                            <Box display="flex" alignItems="center" gap={0.5}>
                              {isLocationInSystem(location.id) ? (
                                <Business color="primary" fontSize="small" />
                              ) : (
                                <Public color="secondary" fontSize="small" />
                              )}
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {location.code}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'text.secondary',
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {location.address}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setNewTransportForm((prev) => ({
                                  ...prev,
                                  destinationIds: prev.destinationIds.filter(
                                    (id) => id !== destinationId
                                  ),
                                }));
                              }}
                              sx={{
                                color: 'error.main',
                                '&:hover': { backgroundColor: 'error.50' },
                              }}
                            >
                              <Clear fontSize="small" />
                            </IconButton>
                          </Box>
                        );
                      })}
                    </Box>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<Clear />}
                        onClick={() => {
                          setNewTransportForm((prev) => ({
                            ...prev,
                            destinationIds: [],
                          }));
                        }}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Xóa tất cả
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setDestinationSelectOpen(true)}
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Thêm điểm đến
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  multiline
                  rows={3}
                  value={newTransportForm.note}
                  onChange={(e) =>
                    setNewTransportForm((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  placeholder="Nhập ghi chú cho đề nghị vận chuyển..."
                />
              </Grid>
            </Grid>

            {/* Phần báo kiện - chỉ hiển thị cho "Từ hệ thống" */}
            {newTransportType === 'system' && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  📦 Báo kiện
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Nhập số lượng kiện cho từng loại để tính toán khối lượng vận chuyển
                  {volumeRules.length === 0 && (
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1, color: 'warning.main' }}
                    >
                      ⚠️ Đang sử dụng dữ liệu mẫu (Volume rules chưa load được)
                    </Typography>
                  )}
                </Alert>

                <Grid container spacing={2}>
                  {(volumeRules.length > 0
                    ? volumeRules
                    : [
                        { id: 'S', name: 'Size S', unitVolume: 0.04 },
                        { id: 'M', name: 'Size M', unitVolume: 0.09 },
                        { id: 'L', name: 'Size L', unitVolume: 0.14 },
                        { id: 'BAG_S', name: 'Bag S', unitVolume: 0.01 },
                        { id: 'BAG_M', name: 'Bag M', unitVolume: 0.02 },
                        { id: 'BAG_L', name: 'Bag L', unitVolume: 0.03 },
                      ]
                  ).map((rule) => (
                    <Grid key={rule.id} item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label={`${rule.name} (${Number(rule.unitVolume || 0).toLocaleString(
                          'vi-VN',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )} m³/kiện)`}
                        value={packageCounts[rule.id] || 0}
                        onChange={(e) =>
                          setPackageCounts((prev) => ({
                            ...prev,
                            [rule.id]: Number(e.target.value) || 0,
                          }))
                        }
                        inputProps={{ min: 0 }}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Tổng kết kiện và khối lượng */}
                {(() => {
                  const totalPackages = Object.values(packageCounts).reduce(
                    (sum, count) => sum + (count || 0),
                    0
                  );
                  const rulesToUse =
                    volumeRules.length > 0
                      ? volumeRules
                      : [
                          { id: 'S', name: 'Size S', unitVolume: 0.04 },
                          { id: 'M', name: 'Size M', unitVolume: 0.09 },
                          { id: 'L', name: 'Size L', unitVolume: 0.14 },
                          { id: 'BAG_S', name: 'Bag S', unitVolume: 0.01 },
                          { id: 'BAG_M', name: 'Bag M', unitVolume: 0.02 },
                          { id: 'BAG_L', name: 'Bag L', unitVolume: 0.03 },
                        ];
                  const totalVolume = rulesToUse.reduce((sum, rule) => {
                    const count = packageCounts[rule.id] || 0;
                    return sum + count * rule.unitVolume;
                  }, 0);

                  return totalPackages > 0 ? (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: 'primary.50',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" color="primary.main">
                        📊 Tổng kết: {totalPackages} kiện •{' '}
                        {Number(totalVolume).toLocaleString('vi-VN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{' '}
                        m³
                      </Typography>
                    </Box>
                  ) : null;
                })()}
              </Box>
            )}

            {/* Phần báo số lượng sản phẩm - chỉ hiển thị cho "Từ hệ thống" */}
            {newTransportType === 'system' && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  📦 Báo số lượng sản phẩm
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Nhập tổng số lượng sản phẩm (phải lớn hơn hoặc bằng tổng số kiện)
                </Alert>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số lượng sản phẩm *"
                      type="number"
                      value={productQuantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        const totalPackages = Object.values(packageCounts).reduce(
                          (sum, count) => sum + (count || 0),
                          0
                        );

                        // Chỉ cho phép thay đổi nếu giá trị >= tổng số kiện
                        if (value >= totalPackages) {
                          setProductQuantity(value);
                          setIsProductQuantityManuallySet(true);
                        } else if (value === totalPackages) {
                          // Nếu user nhập đúng bằng tổng số kiện, coi như auto
                          setProductQuantity(value);
                          setIsProductQuantityManuallySet(false);
                        }
                        // Nếu value < totalPackages, không thay đổi gì
                      }}
                      inputProps={{ min: 0 }}
                      helperText={(() => {
                        const totalPackages = Object.values(packageCounts).reduce(
                          (sum, count) => sum + (count || 0),
                          0
                        );
                        if (isProductQuantityManuallySet) {
                          return `✅ Đã chỉnh sửa thủ công (Tổng số kiện: ${totalPackages})`;
                        }
                        return `🔄 Tự động theo tổng số kiện: ${totalPackages}`;
                      })()}
                      error={false}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* External Destinations Section - Only for "Ngoài hệ thống" */}
            {newTransportType === 'external' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  📍 Thông tin điểm đến ngoài hệ thống
                </Typography>

                <Grid container spacing={3}>
                  {/* Left Column - Form Input */}
                  <Grid item xs={12} md={7}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        maxHeight: '400px',
                        overflow: 'auto',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                        📦 Danh sách điểm giao hàng
                      </Typography>

                      {/* Quick Actions */}
                      <Box
                        sx={{
                          mb: 2,
                          display: 'flex',
                          gap: 1,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const newDestinations = externalDestinations.map((dest) => ({
                              ...dest,
                              address: '',
                              customerName: '',
                              customerPhone: '',
                              productName: '',
                              productQuantity: 0,
                              productWeight: 0,
                              productVolume: 0,
                              notes: '',
                            }));
                            setExternalDestinations(newDestinations);
                          }}
                          startIcon={<Clear />}
                        >
                          Xóa
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            const newDestinations = externalDestinations.map((dest, index) => ({
                              ...dest,
                              address: `Địa chỉ mẫu ${index + 1}`,
                              customerName: `Khách hàng ${index + 1}`,
                              customerPhone: '0123456789',
                              productName: `Sản phẩm ${index + 1}`,
                              productQuantity: 1,
                              productWeight: 1,
                              productVolume: 0.1,
                              notes: `Ghi chú cho điểm ${index + 1}`,
                            }));
                            setExternalDestinations(newDestinations);
                          }}
                          startIcon={<AddIcon />}
                        >
                          Điền mẫu
                        </Button>
                      </Box>

                      {/* Form Fields */}
                      <List>
                        {externalDestinations.map((destination, index) => (
                          <React.Fragment key={destination.id}>
                            <ListItem>
                              <ListItemText
                                primary={
                                  <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="primary"
                                        sx={{ fontSize: '0.85rem' }}
                                      >
                                        {destination.address || 'Chưa nhập địa chỉ'}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{
                                          display: 'block',
                                          mt: 0.5,
                                          fontSize: '0.75rem',
                                        }}
                                      >
                                        {destination.customerName || 'Chưa nhập tên khách hàng'}
                                      </Typography>
                                    </Box>
                                    <Box
                                      display="flex"
                                      gap={1}
                                      sx={{
                                        flexWrap: 'nowrap',
                                        minWidth: 'fit-content',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          minWidth: '60px',
                                          px: 1,
                                          py: 0.5,
                                          backgroundColor: 'primary.50',
                                          border: '1px solid',
                                          borderColor: 'primary.main',
                                          borderRadius: 1,
                                          textAlign: 'center',
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            lineHeight: 1,
                                          }}
                                        >
                                          {destination.productQuantity || 0}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontSize: '0.6rem',
                                            color: 'primary.main',
                                            lineHeight: 1,
                                          }}
                                        >
                                          sản phẩm
                                        </Typography>
                                      </Box>

                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          minWidth: '60px',
                                          px: 1,
                                          py: 0.5,
                                          backgroundColor: 'secondary.50',
                                          border: '1px solid',
                                          borderColor: 'secondary.main',
                                          borderRadius: 1,
                                          textAlign: 'center',
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            color: 'secondary.main',
                                            lineHeight: 1,
                                          }}
                                        >
                                          {destination.productWeight || 0}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontSize: '0.6rem',
                                            color: 'secondary.main',
                                            lineHeight: 1,
                                          }}
                                        >
                                          kg
                                        </Typography>
                                      </Box>

                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          minWidth: '70px',
                                          px: 1,
                                          py: 0.5,
                                          backgroundColor: 'success.50',
                                          border: '1px solid',
                                          borderColor: 'success.main',
                                          borderRadius: 1,
                                          textAlign: 'center',
                                        }}
                                      >
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            color: 'success.main',
                                            lineHeight: 1,
                                          }}
                                        >
                                          {destination.productVolume
                                            ? destination.productVolume.toFixed(2)
                                            : '0,00'}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          sx={{
                                            fontSize: '0.6rem',
                                            color: 'success.main',
                                            lineHeight: 1,
                                          }}
                                        >
                                          m³
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                }
                                secondary={
                                  <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                                    <Grid container spacing={1}>
                                      <Grid item xs={12} sm={6}>
                                        <TextField
                                          fullWidth
                                          label="Tên khách hàng"
                                          value={destination.customerName}
                                          onChange={(e) => {
                                            const newDestinations = [...externalDestinations];
                                            newDestinations[index].customerName = e.target.value;
                                            setExternalDestinations(newDestinations);
                                          }}
                                          placeholder="Tên người nhận"
                                          size="small"
                                          sx={{
                                            '& .MuiInputBase-input': {
                                              fontSize: '0.875rem',
                                            },
                                            '& .MuiInputLabel-root': {
                                              fontSize: '0.875rem',
                                            },
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <TextField
                                          fullWidth
                                          label="Số điện thoại"
                                          value={destination.customerPhone}
                                          onChange={(e) => {
                                            const newDestinations = [...externalDestinations];
                                            newDestinations[index].customerPhone = e.target.value;
                                            setExternalDestinations(newDestinations);
                                          }}
                                          placeholder="SĐT liên lạc"
                                          size="small"
                                          sx={{
                                            '& .MuiInputBase-input': {
                                              fontSize: '0.875rem',
                                            },
                                            '& .MuiInputLabel-root': {
                                              fontSize: '0.875rem',
                                            },
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12}>
                                        <AutocompleteAddress
                                          fullWidth
                                          label="Địa chỉ giao hàng *"
                                          value={destination.address}
                                          onChange={(address) => {
                                            const newDestinations = [...externalDestinations];
                                            newDestinations[index].address = address;
                                            setExternalDestinations(newDestinations);
                                          }}
                                          placeholder="Nhập địa chỉ giao hàng (có gợi ý từ Google Maps)"
                                          required
                                          size="small"
                                          sx={{
                                            '& .MuiInputBase-input': {
                                              fontSize: '0.875rem',
                                            },
                                            '& .MuiInputLabel-root': {
                                              fontSize: '0.875rem',
                                            },
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <TextField
                                          fullWidth
                                          label="Tên hàng hóa"
                                          value={destination.productName}
                                          onChange={(e) => {
                                            const newDestinations = [...externalDestinations];
                                            newDestinations[index].productName = e.target.value;
                                            setExternalDestinations(newDestinations);
                                          }}
                                          placeholder="Tên sản phẩm"
                                          size="small"
                                          sx={{
                                            '& .MuiInputBase-input': {
                                              fontSize: '0.875rem',
                                            },
                                            '& .MuiInputLabel-root': {
                                              fontSize: '0.875rem',
                                            },
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <TextField
                                          fullWidth
                                          label="Số lượng"
                                          type="number"
                                          value={destination.productQuantity}
                                          onChange={(e) => {
                                            const newDestinations = [...externalDestinations];
                                            newDestinations[index].productQuantity =
                                              Number(e.target.value) || 0;
                                            setExternalDestinations(newDestinations);
                                          }}
                                          placeholder="0"
                                          size="small"
                                          sx={{
                                            '& .MuiInputBase-input': {
                                              fontSize: '0.875rem',
                                            },
                                            '& .MuiInputLabel-root': {
                                              fontSize: '0.875rem',
                                            },
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <TextField
                                          fullWidth
                                          label="Trọng lượng (kg)"
                                          type="number"
                                          value={destination.productWeight}
                                          onChange={(e) => {
                                            const newDestinations = [...externalDestinations];
                                            newDestinations[index].productWeight =
                                              Number(e.target.value) || 0;
                                            setExternalDestinations(newDestinations);
                                          }}
                                          placeholder="0"
                                          size="small"
                                          sx={{
                                            '& .MuiInputBase-input': {
                                              fontSize: '0.875rem',
                                            },
                                            '& .MuiInputLabel-root': {
                                              fontSize: '0.875rem',
                                            },
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <TextField
                                          fullWidth
                                          label="Thể tích (m³)"
                                          type="number"
                                          value={destination.productVolume}
                                          onChange={(e) => {
                                            const newDestinations = [...externalDestinations];
                                            newDestinations[index].productVolume =
                                              Number(e.target.value) || 0;
                                            setExternalDestinations(newDestinations);
                                          }}
                                          placeholder="0"
                                          size="small"
                                          sx={{
                                            '& .MuiInputBase-input': {
                                              fontSize: '0.875rem',
                                            },
                                            '& .MuiInputLabel-root': {
                                              fontSize: '0.875rem',
                                            },
                                          }}
                                        />
                                      </Grid>
                                      <Grid item xs={12}>
                                        <TextField
                                          fullWidth
                                          label="Ghi chú"
                                          multiline
                                          rows={1}
                                          value={destination.notes}
                                          onChange={(e) => {
                                            const newDestinations = [...externalDestinations];
                                            newDestinations[index].notes = e.target.value;
                                            setExternalDestinations(newDestinations);
                                          }}
                                          placeholder="Ghi chú thêm về điểm giao hàng này"
                                          size="small"
                                          sx={{
                                            '& .MuiInputBase-input': {
                                              fontSize: '0.875rem',
                                            },
                                            '& .MuiInputLabel-root': {
                                              fontSize: '0.875rem',
                                            },
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Box>
                                }
                              />
                            </ListItem>
                          </React.Fragment>
                        ))}
                      </List>
                    </Paper>
                  </Grid>

                  {/* Right Column - Summary */}
                  <Grid item xs={12} md={5}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        height: '400px',
                        overflow: 'auto',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="h6" fontWeight={600} mb={2} color="primary">
                        📊 Thông tin tổng hợp
                      </Typography>

                      {externalDestinations.filter((dest) => dest.address.trim() !== '').length ===
                      0 ? (
                        <Box>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            Vui lòng chọn ít nhất một điểm giao hàng
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          {externalDestinations
                            .filter((dest) => dest.address.trim() !== '')

                            .map((destination, _index) => (
                              <Box key={destination.id} mb={2}>
                                <Typography variant="subtitle2" fontWeight={600} color="primary">
                                  📍 Điểm đến đã chọn:
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {destination.address}
                                </Typography>

                                {destination.customerName && (
                                  <Box mt={1}>
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={600}
                                      color="primary"
                                    >
                                      👤 Khách hàng:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {destination.customerName}
                                      {destination.customerPhone && (
                                        <span> - {destination.customerPhone}</span>
                                      )}
                                    </Typography>
                                  </Box>
                                )}

                                {destination.productName && (
                                  <Box mt={1}>
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={600}
                                      color="primary"
                                    >
                                      📦 Hàng hóa:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {destination.productName}
                                      {destination.productQuantity > 0 && (
                                        <span> - Số lượng: {destination.productQuantity}</span>
                                      )}
                                      {destination.productWeight > 0 && (
                                        <span> - Trọng lượng: {destination.productWeight} kg</span>
                                      )}
                                      {destination.productVolume > 0 && (
                                        <span>
                                          {' '}
                                          - Thể tích: {destination.productVolume.toFixed(2)} m³
                                        </span>
                                      )}
                                    </Typography>
                                  </Box>
                                )}

                                {destination.notes && (
                                  <Box mt={1}>
                                    <Typography
                                      variant="subtitle2"
                                      fontWeight={600}
                                      color="primary"
                                    >
                                      📝 Ghi chú:
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {destination.notes}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            ))}
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewTransportDialogClose}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleCreateTransportProposal}
            disabled={creatingTransportRequest}
          >
            {creatingTransportRequest ? 'Đang tạo...' : 'Tạo đề nghị'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransportRequests;
