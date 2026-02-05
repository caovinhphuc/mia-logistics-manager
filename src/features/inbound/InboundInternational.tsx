import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Menu,
  Tooltip,
  Autocomplete,
  Snackbar,
} from '@mui/material';
import {
  InboundInternationalService,
  InboundInternationalRecord,
} from '../../../services/googleSheets/inboundInternationalService';
// Removed unused import: InboundScheduleService
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flight as FlightIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  MoreVert as MoreVertIcon,
  CalendarMonth as CalendarIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Luggage as LuggageIcon,
  Backpack as BackpackIcon,
  CardGiftcard as GiftIcon,
  TravelExplore as TravelExploreIcon,
  Handyman as HandymanIcon,
  Inventory as InventoryIcon,
  Inventory2 as Inventory2Icon,
  Description as DescriptionIcon,
  BusinessCenter as BusinessCenterIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { vi } from 'date-fns/locale';

interface PackagingItem {
  id: string;
  type: string; // "2PCS/SET", "3PCS/SET", "1PCS/SET"
  quantity: number; // Số lượng SET
  description?: string; // Mô tả thêm
}

interface TimelineItem {
  id: string;
  name: string; // Tên mốc thời gian
  date: string; // Ngày thực tế
  estimatedDate?: string; // Ngày dự kiến (nếu có)
  status: 'completed' | 'pending' | 'in-progress' | 'confirmed'; // Trạng thái
  description?: string; // Mô tả thêm
}

interface DocumentStatusItem {
  id: string;
  name: string; // Tên trạng thái chứng từ
  date: string; // Ngày thực tế
  estimatedDate?: string; // Ngày dự kiến (nếu có)
  status: 'completed' | 'pending' | 'in-progress' | 'confirmed'; // Trạng thái
  description?: string; // Mô tả thêm
}

interface InboundItem {
  id: string;
  date: string;
  supplier: string;
  origin: string;
  destination: string;
  product: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'waiting-notification' | 'notified' | 'received';
  estimatedArrival: string;
  actualArrival?: string;
  notes?: string;
  // Các trường mới
  pi: string; // Mã lô hàng
  container: number; // Số lượng container
  category: string; // Phân loại hàng hóa
  poNumbers: string[]; // Danh sách phiếu PO (có thể nhiều PO cho 1 lô hàng)
  carrier: string; // Nhà vận chuyển
  packaging: PackagingItem[]; // Danh sách quy cách đóng gói
  purpose: 'online' | 'offline'; // Mục đích (Online, Offline)
  receiveTime: string; // Thời gian nhận
  timeline: TimelineItem[]; // Timeline các mốc thời gian
  documentStatus: DocumentStatusItem[]; // Trạng thái chứng từ
  createdAt?: string; // Thời gian tạo
  updatedAt?: string; // Thời gian cập nhật
}

const InboundInternational: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InboundItem | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');

  // Action menu state
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedItemForAction, setSelectedItemForAction] = useState<InboundItem | null>(null);

  // Calendar view states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateItems, setSelectedDateItems] = useState<InboundItem[]>([]);
  const [addFromCalendar, setAddFromCalendar] = useState<Date | null>(null);

  // Calendar dropdown menu states
  const [calendarMenuAnchor, setCalendarMenuAnchor] = useState<null | HTMLElement>(null);
  const [calendarMenuDate, setCalendarMenuDate] = useState<Date | null>(null);

  // Card menu states
  const [cardMenuAnchor, setCardMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedCardItem, setSelectedCardItem] = useState<InboundItem | null>(null);

  // Edit item states
  const [editItemDialog, setEditItemDialog] = useState<{
    open: boolean;
    type: 'packaging' | 'timeline' | 'documentStatus';
    item: PackagingItem | TimelineItem | DocumentStatusItem | null;
    index: number;
  }>({
    open: false,
    type: 'packaging',
    item: null,
    index: -1,
  });
  const [editItemForm, setEditItemForm] = useState<{
    description: string;
  }>({
    description: '',
  });

  // Packaging form states
  const [packagingItems, setPackagingItems] = useState<PackagingItem[]>([]);
  const [newPackagingItem, setNewPackagingItem] = useState<PackagingItem>({
    id: '',
    type: '1PCS/SET',
    quantity: 0,
    description: '',
  });

  // Timeline form states
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [newTimelineItem, setNewTimelineItem] = useState<TimelineItem>({
    id: '',
    name: 'Ngày nhập hàng',
    date: '',
    estimatedDate: '',
    status: 'pending',
    description: '',
  });

  // Document status form states
  const [documentStatusItems, setDocumentStatusItems] = useState<DocumentStatusItem[]>([]);
  const [newDocumentStatusItem, setNewDocumentStatusItem] = useState<DocumentStatusItem>({
    id: '',
    name: 'Check bill',
    date: '',
    estimatedDate: '',
    status: 'pending',
    description: '',
  });

  // Product categories
  const [productCategories] = useState<string[]>([
    'Vali',
    'Balo',
    'Quà tặng',
    'Phụ kiện',
    'Phụ kiện sửa chữa',
    'Nguyên vật liệu',
    'Thùng giấy',
    'Văn phòng phẩm',
    'Thiết bị văn phòng',
  ]);

  // Destination options
  const [destinations] = useState<string[]>([
    'Kho trung tâm - lô2-5, Đường CN1, Phường Tây Thạnh, Quận Tân Phú, Thành phố Hồ Chí Minh',
    'Kho Hà Nội - 18 Xóm Núi Tiên Hùng, Nguyên Khê, Đông Anh, Hà Nội',
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    status: [] as string[],
    documentStatus: [] as string[],
    timelineStatus: [] as string[],
    carriers: [] as string[],
    destinations: [] as string[],
    products: [] as string[],
    categories: [] as string[],
  });

  // Controlled form fields for Add/Edit dialog
  const [formFields, setFormFields] = useState({
    pi: '',
    supplier: '',
    product: '',
    category: '',
    origin: '',
    destination: '',
    quantity: 0,
    container: 0,
    poNumbersInput: '',
    status: 'pending' as InboundItem['status'],
    carrier: '',
  });

  const setField = <K extends keyof typeof formFields>(key: K, value: (typeof formFields)[K]) => {
    setFormFields((prev) => ({ ...prev, [key]: value }));
  };

  // Filter UI states
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);

  // Async states & notifications
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Helper function to format timeline/document status display
  const formatTimelineDisplay = (
    name: string,
    timeline: TimelineItem[] | DocumentStatusItem[],
    type: 'timeline' | 'document'
  ) => {
    const item =
      type === 'timeline'
        ? timeline?.find((t) => t.name === name)
        : timeline?.find((d) => d.name === name);

    return {
      estimated: item?.estimatedDate || 'Chưa có',
      actual: item?.date || 'Chưa có',
      status: item?.status || 'Chưa có',
    };
  };

  // Category icons mapping
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Vali':
        return <LuggageIcon />;
      case 'Balo':
        return <BackpackIcon />;
      case 'Quà tặng':
        return <GiftIcon />;
      case 'Phụ kiện':
        return <TravelExploreIcon />;
      case 'Phụ kiện sửa chữa':
        return <HandymanIcon />;
      case 'Nguyên vật liệu':
        return <InventoryIcon />;
      case 'Thùng giấy':
        return <Inventory2Icon />;
      case 'Văn phòng phẩm':
        return <DescriptionIcon />;
      case 'Thiết bị văn phòng':
        return <BusinessCenterIcon />;
      default:
        return <InventoryIcon />;
    }
  };

  // Mock data
  const [inboundItems, setInboundItems] = useState<InboundItem[]>([]);

  // Mapping helpers
  const mapRecordToItem = (r: InboundInternationalRecord): InboundItem => {
    // Convert date to YYYY-MM-DD format
    let dateStr = r.date;
    if (typeof dateStr === 'number') {
      // Google Sheets serial number to date
      const date = new Date((dateStr - 25569) * 86400 * 1000);
      dateStr = date.toISOString().split('T')[0];
    } else if (dateStr && dateStr.includes('/')) {
      // Convert DD/MM/YYYY to YYYY-MM-DD
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    return {
      id: r.id,
      date: dateStr,
      supplier: r.supplier || '',
      origin: r.origin || '',
      destination: r.destination || '',
      product: r.product || '',
      quantity: Number(r.quantity || 0),
      status: r.status as InboundItem['status'],
      estimatedArrival: '',
      notes: r.notes || '',
      pi: r.pi || '',
      container: Number(r.container || 0),
      category: r.category || '',
      poNumbers: (r.poNumbers || '')
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean),
      carrier: r.carrier || '',
      // Packaging: use flattened columns only
      packaging:
        r.packagingTypes || r.packagingQuantities || r.packagingDescriptions
          ? (r.packagingTypes || '')
              .split(';')
              .map((t, idx) => ({
                id: `${r.id}-pkg-${idx}`,
                type: t.trim(),
                quantity: Number((r.packagingQuantities || '').split(';')[idx] || 0),
                description: ((r.packagingDescriptions || '').split(';')[idx] || '').trim(),
              }))
              .filter((p) => p.type)
          : [],
      purpose: (r.purpose as 'online' | 'offline') || 'online',
      receiveTime: r.receiveTime || '',
      // Timeline: flattened only
      timeline: [
        {
          id: `${r.id}-t0`,
          name: 'Ngày tạo phiếu',
          estimatedDate: '',
          date: r.date || '',
          status: 'completed',
          description: '',
        },
        {
          id: `${r.id}-t1`,
          name: 'Cargo Ready',
          estimatedDate: r.timeline_cargoReady_est || '',
          date: r.timeline_cargoReady_act || '',
          status:
            (r.timeline_cargoReady_status as
              | 'pending'
              | 'in-progress'
              | 'completed'
              | 'confirmed') || 'pending',
          description: '',
        },
        {
          id: `${r.id}-t2`,
          name: 'ETD',
          estimatedDate: r.timeline_etd_est || '',
          date: r.timeline_etd_act || '',
          status:
            (r.timeline_etd_status as 'pending' | 'in-progress' | 'completed' | 'confirmed') ||
            'pending',
          description: '',
        },
        {
          id: `${r.id}-t3`,
          name: 'ETA',
          estimatedDate: r.timeline_eta_est || '',
          date: r.timeline_eta_act || '',
          status:
            (r.timeline_eta_status as 'pending' | 'in-progress' | 'completed' | 'confirmed') ||
            'pending',
          description: '',
        },
        {
          id: `${r.id}-t4`,
          name: 'Ngày hàng đi',
          estimatedDate: r.timeline_depart_est || '',
          date: r.timeline_depart_act || '',
          status:
            (r.timeline_depart_status as 'pending' | 'in-progress' | 'completed' | 'confirmed') ||
            'pending',
          description: '',
        },
        {
          id: `${r.id}-t5`,
          name: 'Ngày hàng về cảng',
          estimatedDate: r.timeline_arrivalPort_est || '',
          date: r.timeline_arrivalPort_act || '',
          status:
            (r.timeline_arrivalPort_status as
              | 'pending'
              | 'in-progress'
              | 'completed'
              | 'confirmed') || 'pending',
          description: '',
        },
        {
          id: `${r.id}-t6`,
          name: 'Ngày nhận hàng',
          estimatedDate: r.timeline_receive_est || '',
          date: r.timeline_receive_act || '',
          status:
            (r.timeline_receive_status as 'pending' | 'in-progress' | 'completed' | 'confirmed') ||
            'pending',
          description: '',
        },
      ].filter((t) => t.estimatedDate || t.date) as InboundItem['timeline'],
      // Document statuses: flattened only
      documentStatus: [
        {
          id: `${r.id}-d0`,
          name: 'Check bill',
          estimatedDate: r.doc_checkBill_est || '',
          date: r.doc_checkBill_act || '',
          status: (r.doc_checkBill_status as 'pending' | 'in-progress' | 'completed') || 'pending',
          description: '',
        },
        {
          id: `${r.id}-d1`,
          name: 'Check CO',
          estimatedDate: r.doc_checkCO_est || '',
          date: r.doc_checkCO_act || '',
          status: (r.doc_checkCO_status as 'pending' | 'in-progress' | 'completed') || 'pending',
          description: '',
        },
        {
          id: `${r.id}-d2`,
          name: 'TQ gửi chứng từ đi',
          estimatedDate: r.doc_sendDocs_est || '',
          date: r.doc_sendDocs_act || '',
          status: (r.doc_sendDocs_status as 'pending' | 'in-progress' | 'completed') || 'pending',
          description: '',
        },
        {
          id: `${r.id}-d3`,
          name: 'Lên Tờ Khai Hải Quan',
          estimatedDate: r.doc_customs_est || '',
          date: r.doc_customs_act || '',
          status: (r.doc_customs_status as 'pending' | 'in-progress' | 'completed') || 'pending',
          description: '',
        },
        {
          id: `${r.id}-d4`,
          name: 'Đóng thuế',
          estimatedDate: r.doc_tax_est || '',
          date: r.doc_tax_act || '',
          status: (r.doc_tax_status as 'pending' | 'in-progress' | 'completed') || 'pending',
          description: '',
        },
      ].filter((d) => d.estimatedDate || d.date),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  };

  const mapItemToRecord = (
    it: InboundItem
  ): Omit<InboundInternationalRecord, 'id' | 'createdAt' | 'updatedAt'> => ({
    date: it.date, // Keep as YYYY-MM-DD format
    pi: it.pi,
    supplier: it.supplier,
    origin: it.origin,
    destination: it.destination,
    product: it.product,
    category: it.category,
    quantity: it.quantity,
    container: it.container,
    status: it.status,
    carrier: it.carrier,
    purpose: it.purpose,
    receiveTime: it.receiveTime,
    poNumbers: (it.poNumbers || []).join(';'),
    // Flattened packaging only
    packagingTypes: (it.packaging || []).map((p) => p.type).join(';'),
    packagingQuantities: (it.packaging || []).map((p) => String(p.quantity)).join(';'),
    packagingDescriptions: (it.packaging || []).map((p) => p.description || '').join(';'),
    // Flattened timeline only
    timeline_cargoReady_est:
      (it.timeline || []).find((t) => t.name === 'Cargo Ready')?.estimatedDate || '',
    timeline_cargoReady_act: (it.timeline || []).find((t) => t.name === 'Cargo Ready')?.date || '',
    timeline_cargoReady_status:
      (it.timeline || []).find((t) => t.name === 'Cargo Ready')?.status || 'pending',
    timeline_etd_est: (it.timeline || []).find((t) => t.name === 'ETD')?.estimatedDate || '',
    timeline_etd_act: (it.timeline || []).find((t) => t.name === 'ETD')?.date || '',
    timeline_etd_status: (it.timeline || []).find((t) => t.name === 'ETD')?.status || 'pending',
    timeline_eta_est: (it.timeline || []).find((t) => t.name === 'ETA')?.estimatedDate || '',
    timeline_eta_act: (it.timeline || []).find((t) => t.name === 'ETA')?.date || '',
    timeline_eta_status: (it.timeline || []).find((t) => t.name === 'ETA')?.status || 'pending',
    timeline_depart_est:
      (it.timeline || []).find((t) => t.name === 'Ngày hàng đi')?.estimatedDate || '',
    timeline_depart_act: (it.timeline || []).find((t) => t.name === 'Ngày hàng đi')?.date || '',
    timeline_depart_status:
      (it.timeline || []).find((t) => t.name === 'Ngày hàng đi')?.status || 'pending',
    timeline_arrivalPort_est:
      (it.timeline || []).find((t) => t.name === 'Ngày hàng về cảng')?.estimatedDate || '',
    timeline_arrivalPort_act:
      (it.timeline || []).find((t) => t.name === 'Ngày hàng về cảng')?.date || '',
    timeline_arrivalPort_status:
      (it.timeline || []).find((t) => t.name === 'Ngày hàng về cảng')?.status || 'pending',
    timeline_receive_est:
      (it.timeline || []).find((t) => t.name === 'Ngày nhận hàng')?.estimatedDate || '',
    timeline_receive_act: (it.timeline || []).find((t) => t.name === 'Ngày nhận hàng')?.date || '',
    timeline_receive_status:
      (it.timeline || []).find((t) => t.name === 'Ngày nhận hàng')?.status || 'pending',
    // Flattened docs only
    doc_checkBill_est:
      (it.documentStatus || []).find((d) => d.name === 'Check bill')?.estimatedDate || '',
    doc_checkBill_act: (it.documentStatus || []).find((d) => d.name === 'Check bill')?.date || '',
    doc_checkBill_status:
      (it.documentStatus || []).find((d) => d.name === 'Check bill')?.status || 'pending',
    doc_checkCO_est:
      (it.documentStatus || []).find((d) => d.name === 'Check CO')?.estimatedDate || '',
    doc_checkCO_act: (it.documentStatus || []).find((d) => d.name === 'Check CO')?.date || '',
    doc_checkCO_status:
      (it.documentStatus || []).find((d) => d.name === 'Check CO')?.status || 'pending',
    doc_sendDocs_est:
      (it.documentStatus || []).find((d) => d.name === 'TQ gửi chứng từ đi')?.estimatedDate || '',
    doc_sendDocs_act:
      (it.documentStatus || []).find((d) => d.name === 'TQ gửi chứng từ đi')?.date || '',
    doc_sendDocs_status:
      (it.documentStatus || []).find((d) => d.name === 'TQ gửi chứng từ đi')?.status || 'pending',
    doc_customs_est:
      (it.documentStatus || []).find((d) => d.name === 'Lên Tờ Khai Hải Quan')?.estimatedDate || '',
    doc_customs_act:
      (it.documentStatus || []).find((d) => d.name === 'Lên Tờ Khai Hải Quan')?.date || '',
    doc_customs_status:
      (it.documentStatus || []).find((d) => d.name === 'Lên Tờ Khai Hải Quan')?.status || 'pending',
    doc_tax_est: (it.documentStatus || []).find((d) => d.name === 'Đóng thuế')?.estimatedDate || '',
    doc_tax_act: (it.documentStatus || []).find((d) => d.name === 'Đóng thuế')?.date || '',
    doc_tax_status:
      (it.documentStatus || []).find((d) => d.name === 'Đóng thuế')?.status || 'pending',
    notes: it.notes || '',
  });

  const reload = useCallback(async () => {
    const svc = new InboundInternationalService();
    const rows = await svc.list();
    const mappedItems = rows.map(mapRecordToItem);
    setInboundItems(mappedItems);
  }, []);

  // Load from Google Sheets on mount
  useEffect(() => {
    reload().catch((err) => console.error('Load InboundInternational failed', err));
  }, [reload]);

  // Function to calculate total products from packaging items
  const calculateTotalProducts = (packagingItems: PackagingItem[]): number => {
    return packagingItems.reduce((total, item) => {
      const pcsPerSet = parseInt(item.type.split('PCS/SET')[0]);
      return total + item.quantity * pcsPerSet;
    }, 0);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'waiting-notification':
        return 'Chờ thông báo';
      case 'notified':
        return 'Đã thông báo';
      case 'received':
        return 'Đã nhận';
      default:
        return status;
    }
  };

  const getStatusColorForChip = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'waiting-notification':
        return 'secondary';
      case 'notified':
        return 'primary';
      case 'received':
        return 'success';
      default:
        return 'default';
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getItemsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return inboundItems.filter((item) => item.date === dateStr);
  };

  // Filter logic
  const getFilteredItems = () => {
    return inboundItems.filter((item) => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(item.status)) {
        return false;
      }

      // Document status filter
      if (filters.documentStatus.length > 0) {
        const hasMatchingDocStatus = item.documentStatus?.some((doc) =>
          filters.documentStatus.includes(doc.status)
        );
        if (!hasMatchingDocStatus) return false;
      }

      // Timeline status filter
      if (filters.timelineStatus.length > 0) {
        const hasMatchingTimelineStatus = item.timeline?.some((timeline) =>
          filters.timelineStatus.includes(timeline.status)
        );
        if (!hasMatchingTimelineStatus) return false;
      }

      // Carrier filter
      if (filters.carriers.length > 0 && !filters.carriers.includes(item.carrier)) {
        return false;
      }

      // Destination filter
      if (filters.destinations.length > 0 && !filters.destinations.includes(item.destination)) {
        return false;
      }

      // Product filter
      if (filters.products.length > 0 && !filters.products.includes(item.product)) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
        return false;
      }

      return true;
    });
  };

  const getFilteredItemsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return getFilteredItems().filter((item) => item.date === dateStr);
  };

  // Filter management functions
  const toggleFilter = (filterType: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      status: [],
      documentStatus: [],
      timelineStatus: [],
      carriers: [],
      destinations: [],
      products: [],
      categories: [],
    });
  };

  // Get unique values for filter options
  const getUniqueCarriers = (): string[] => {
    return [...new Set(inboundItems.map((item) => item.carrier).filter(Boolean))];
  };

  const getUniqueDestinations = (): string[] => {
    return [...new Set(inboundItems.map((item) => item.destination).filter(Boolean))];
  };

  const getUniqueProducts = (): string[] => {
    return [...new Set(inboundItems.map((item) => item.product).filter(Boolean))];
  };

  const getUniqueCategories = (): string[] => {
    return [...new Set(inboundItems.map((item) => item.category).filter(Boolean))];
  };

  const getUniqueDocumentStatuses = () => {
    const statuses = new Set<string>();
    inboundItems.forEach((item) => {
      item.documentStatus?.forEach((doc) => statuses.add(doc.status));
    });
    return Array.from(statuses);
  };

  const getUniqueTimelineStatuses = () => {
    const statuses = new Set<string>();
    inboundItems.forEach((item) => {
      item.timeline?.forEach((timeline) => statuses.add(timeline.status));
    });
    return Array.from(statuses);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

  // Get filter summary
  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.status.length > 0) activeFilters.push(`Trạng thái: ${filters.status.length}`);
    if (filters.documentStatus.length > 0)
      activeFilters.push(`Chứng từ: ${filters.documentStatus.length}`);
    if (filters.timelineStatus.length > 0)
      activeFilters.push(`Timeline: ${filters.timelineStatus.length}`);
    if (filters.carriers.length > 0) activeFilters.push(`Vận chuyển: ${filters.carriers.length}`);
    if (filters.destinations.length > 0)
      activeFilters.push(`Đích đến: ${filters.destinations.length}`);
    if (filters.products.length > 0) activeFilters.push(`Sản phẩm: ${filters.products.length}`);
    if (filters.categories.length > 0)
      activeFilters.push(`Phân loại: ${filters.categories.length}`);
    return activeFilters.join(', ');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <PendingIcon />;
      case 'in-transit':
        return <ShippingIcon />;
      case 'arrived':
        return <CheckCircleIcon />;
      case 'completed':
        return <CheckCircleIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ff9800'; // Orange
      case 'confirmed':
        return '#2196f3'; // Blue
      case 'waiting-notification':
        return '#9c27b0'; // Purple
      case 'notified':
        return '#3f51b5'; // Indigo
      case 'received':
        return '#4caf50'; // Green
      default:
        return '#757575'; // Default grey
    }
  };

  const handleDateClick = (date: Date) => {
    const items = getItemsForDate(date);
    setSelectedDate(date);
    setSelectedDateItems(items);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleAddFromCalendar = (date: Date) => {
    setAddFromCalendar(date);
    setEditingItem(null);

    // Tự động tạo timeline item với ngày nhập hàng
    const importDate = date.toISOString().split('T')[0];
    setTimelineItems([
      {
        id: Date.now().toString(),
        name: 'Ngày nhập hàng',
        date: importDate,
        estimatedDate: importDate,
        status: 'confirmed',
        description: 'Ngày nhập hàng dự kiến',
      },
    ]);

    // Tự động tạo document status item với Check bill
    setDocumentStatusItems([
      {
        id: Date.now().toString(),
        name: 'Check bill',
        date: '',
        estimatedDate: importDate,
        status: 'confirmed',
        description: 'Kiểm tra bill lading',
      },
    ]);

    setOpenDialog(true);
  };

  // Calendar dropdown menu handlers
  const handleCalendarMenuOpen = (event: React.MouseEvent<HTMLElement>, date: Date) => {
    event.stopPropagation();
    setCalendarMenuAnchor(event.currentTarget);
    setCalendarMenuDate(date);
  };

  const handleCalendarMenuClose = () => {
    setCalendarMenuAnchor(null);
    setCalendarMenuDate(null);
  };

  // Card menu handlers
  const handleCardMenuOpen = (event: React.MouseEvent<HTMLElement>, item: InboundItem) => {
    event.stopPropagation();
    setCardMenuAnchor(event.currentTarget);
    setSelectedCardItem(item);
  };

  const handleCardMenuClose = () => {
    setCardMenuAnchor(null);
    setSelectedCardItem(null);
  };

  const handleCardMenuAction = (action: 'edit' | 'delete') => {
    if (!selectedCardItem) return;

    if (action === 'edit') {
      handleEdit(selectedCardItem);
    } else if (action === 'delete') {
      handleDelete(selectedCardItem.id);
    }

    handleCardMenuClose();
  };

  // Edit item handlers
  const handleEditItem = (
    type: 'packaging' | 'timeline' | 'documentStatus',
    item: PackagingItem | TimelineItem | DocumentStatusItem,
    index: number
  ) => {
    setEditItemDialog({
      open: true,
      type,
      item,
      index,
    });
    setEditItemForm({
      description: '',
    });
  };

  const handleEditItemClose = () => {
    setEditItemDialog({
      open: false,
      type: 'packaging',
      item: null,
      index: -1,
    });
    setEditItemForm({
      description: '',
    });
  };

  const handleEditItemSave = () => {
    if (!editItemForm.description.trim()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng nhập mô tả khi sửa',
        severity: 'error',
      });
      return;
    }

    const { type, index } = editItemDialog;

    if (type === 'packaging') {
      const updatedItems = [...packagingItems];
      updatedItems[index] = {
        ...updatedItems[index],
        description: editItemForm.description,
      };
      setPackagingItems(updatedItems);
    } else if (type === 'timeline') {
      const updatedItems = [...timelineItems];
      updatedItems[index] = {
        ...updatedItems[index],
        description: editItemForm.description,
      };
      setTimelineItems(updatedItems);
    } else if (type === 'documentStatus') {
      const updatedItems = [...documentStatusItems];
      updatedItems[index] = {
        ...updatedItems[index],
        description: editItemForm.description,
      };
      setDocumentStatusItems(updatedItems);
    }

    setSnackbar({
      open: true,
      message: 'Cập nhật mô tả thành công',
      severity: 'success',
    });

    handleEditItemClose();
  };

  const handleCalendarMenuAction = (action: string) => {
    if (!calendarMenuDate) return;

    switch (action) {
      case 'add':
        handleAddFromCalendar(calendarMenuDate);
        break;
      case 'view':
        handleDateClick(calendarMenuDate);
        break;
    }
    handleCalendarMenuClose();
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setPackagingItems([]);
    setTimelineItems([]);
    setDocumentStatusItems([]);
    setFormFields({
      pi: '',
      supplier: '',
      product: '',
      category: '',
      origin: '',
      destination: '',
      quantity: 0,
      container: 0,
      poNumbersInput: '',
      status: 'pending',
      carrier: '',
    });
    setOpenDialog(true);
  };

  const handleEdit = (item: InboundItem) => {
    setEditingItem(item);
    setPackagingItems(item.packaging || []);
    setTimelineItems(item.timeline || []);
    setDocumentStatusItems(item.documentStatus || []);
    setFormFields({
      pi: item.pi || '',
      supplier: item.supplier || '',
      product: item.product || '',
      category: item.category || '',
      origin: item.origin || '',
      destination: item.destination || '',
      quantity: Number(item.quantity || 0),
      container: Number(item.container || 0),
      poNumbersInput: (item.poNumbers || []).join(', '),
      status: item.status,
      carrier: item.carrier || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    const svc = new InboundInternationalService();
    await svc.remove(id);
    await reload();
  };

  const handleSave = async (item: Partial<InboundItem>) => {
    const svc = new InboundInternationalService();
    try {
      setSaving(true);
      if (editingItem) {
        const updated: InboundItem = {
          ...editingItem,
          ...item,
          pi: formFields.pi,
          supplier: formFields.supplier,
          product: formFields.product,
          category: formFields.category,
          origin: formFields.origin,
          destination: formFields.destination,
          container: Number(formFields.container || 0),
          poNumbers: (formFields.poNumbersInput || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          status: formFields.status,
          carrier: formFields.carrier,
          quantity: calculateTotalProducts(packagingItems),
          packaging: packagingItems,
          timeline: timelineItems,
          documentStatus: documentStatusItems,
        } as InboundItem;
        await svc.update(editingItem.id, mapItemToRecord(updated));
      } else {
        const newItem: InboundItem = {
          id: Date.now().toString(),
          date: addFromCalendar
            ? addFromCalendar.toLocaleDateString('vi-VN')
            : new Date().toLocaleDateString('vi-VN'),
          supplier: formFields.supplier,
          origin: formFields.origin,
          destination: formFields.destination,
          product: formFields.product,
          quantity: calculateTotalProducts(packagingItems),
          status: formFields.status,
          estimatedArrival: '',
          notes: '',
          pi: formFields.pi,
          container: Number(formFields.container || 0),
          category: formFields.category,
          poNumbers: (formFields.poNumbersInput || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          carrier: formFields.carrier,
          packaging: packagingItems,
          purpose: 'online',
          receiveTime: '',
          timeline: timelineItems,
          documentStatus: documentStatusItems,
          ...item,
        } as InboundItem;
        await svc.add(mapItemToRecord(newItem));
      }
      setOpenDialog(false);
      setAddFromCalendar(null);
      setSnackbar({
        open: true,
        message: editingItem ? 'Cập nhật thành công' : 'Thêm lịch thành công',
        severity: 'success',
      });
      await reload();
    } catch (err) {
      console.error('Save inbound failed', err);
      setSnackbar({
        open: true,
        message: 'Có lỗi khi lưu. Vui lòng thử lại',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Packaging form handlers
  const handleAddPackagingItem = () => {
    if (newPackagingItem.type && newPackagingItem.quantity > 0) {
      const item: PackagingItem = {
        ...newPackagingItem,
        id: Date.now().toString(),
      };
      setPackagingItems((prev) => [...prev, item]);
      setNewPackagingItem({
        id: '',
        type: '1PCS/SET',
        quantity: 0,
        description: '',
      });
    }
  };

  const handleRemovePackagingItem = (id: string) => {
    setPackagingItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Timeline form handlers
  const handleAddTimelineItem = () => {
    if (newTimelineItem.name && newTimelineItem.date) {
      const item: TimelineItem = {
        ...newTimelineItem,
        id: Date.now().toString(),
      };
      setTimelineItems((prev) => [...prev, item]);
      setNewTimelineItem({
        id: '',
        name: 'Ngày nhập hàng',
        date: '',
        estimatedDate: '',
        status: 'confirmed',
        description: '',
      });
    }
  };

  const handleRemoveTimelineItem = (id: string) => {
    setTimelineItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Document status form handlers
  const handleAddDocumentStatusItem = () => {
    if (newDocumentStatusItem.name && newDocumentStatusItem.date) {
      const item: DocumentStatusItem = {
        ...newDocumentStatusItem,
        id: Date.now().toString(),
      };
      setDocumentStatusItems((prev) => [...prev, item]);
      setNewDocumentStatusItem({
        id: '',
        name: 'Check bill',
        date: '',
        estimatedDate: '',
        status: 'confirmed',
        description: '',
      });
    }
  };

  const handleRemoveDocumentStatusItem = (id: string) => {
    setDocumentStatusItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Action menu handlers
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, item: InboundItem) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedItemForAction(item);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedItemForAction(null);
  };

  const handleActionMenuAction = (action: string) => {
    if (!selectedItemForAction) return;

    switch (action) {
      case 'edit':
        handleEdit(selectedItemForAction);
        break;
      case 'delete':
        handleDelete(selectedItemForAction.id);
        break;
    }
    handleActionMenuClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FlightIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Lịch nhập hàng Quốc tế
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('calendar')}
            startIcon={<ScheduleIcon />}
          >
            Lịch
          </Button>
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('table')}
          >
            Bảng
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ScheduleIcon color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {inboundItems.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tổng lô hàng
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FlightIcon color="info" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {inboundItems.filter((item) => item.status === 'confirmed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đã xác nhận
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationIcon color="success" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {inboundItems.filter((item) => item.status === 'received').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đã nhận
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <BusinessIcon color="warning" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {inboundItems.filter((item) => item.status === 'pending').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chờ xác nhận
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Content */}
      {viewMode === 'table' ? (
        <Paper sx={{ p: 2, overflow: 'hidden', maxWidth: '100%' }}>
          <TableContainer
            sx={{
              width: '100%',
              overflowX: 'auto',
              overflowY: 'hidden',
              maxWidth: '100%',
              minWidth: 0,
              display: 'block',
              position: 'relative',
              zIndex: 1,
              backgroundColor: 'transparent',
              boxSizing: 'border-box',
              margin: 0,
              padding: 0,
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              borderRadius: 0,
              isolation: 'isolate',
              contain: 'layout',
              willChange: 'scroll-position',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: '1000px',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0,0,0,0.2) transparent',
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(0,0,0,0.3)',
              },
              '&::-webkit-scrollbar-corner': {
                background: 'transparent',
              },
            }}
          >
            <Table
              size="small"
              sx={{
                tableLayout: 'auto',
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                display: 'table',
                position: 'relative',
                zIndex: 1,
                backgroundColor: 'transparent',
                boxSizing: 'border-box',
                margin: 0,
                padding: 0,
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                borderRadius: 0,
                isolation: 'isolate',
                contain: 'layout',
                willChange: 'scroll-position',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0,0,0,0.2) transparent',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: 'rgba(0,0,0,0.3)',
                },
                '&::-webkit-scrollbar-corner': {
                  background: 'transparent',
                },
                '& th, & td': {
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                },
                '& .address-cell': {
                  whiteSpace: 'normal',
                  textOverflow: 'unset',
                  overflow: 'visible',
                  lineHeight: 1.2,
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Mã PI</TableCell>
                  <TableCell>Nhà cung cấp</TableCell>
                  {/* Ẩn cột Xuất xứ */}
                  <TableCell>Kho nhận</TableCell>
                  <TableCell>Mã Sản phẩm</TableCell>
                  <TableCell>Phân loại</TableCell>
                  <TableCell>SL</TableCell>
                  <TableCell>Cont</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  {/* Ẩn cột ETA */}
                  <TableCell>NVC</TableCell>
                  <TableCell>Quy cách</TableCell>
                  <TableCell>Mục đích</TableCell>
                  {/* Ẩn cột Thời gian nhận */}
                  <TableCell sx={{ textAlign: 'center' }}>
                    {/* tiêu đề tác vụ để trống */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inboundItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      {(() => {
                        const d = new Date(item.date);
                        return isNaN(d.getTime()) ? 'Chưa có' : d.toLocaleDateString('vi-VN');
                      })()}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          color: 'primary.main',
                        }}
                      >
                        {item.pi}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={item.supplier}>
                        <Typography noWrap sx={{ fontSize: '0.65rem' }}>
                          {item.supplier}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    {/* Ẩn cell Xuất xứ */}
                    <TableCell className="address-cell">
                      <Box>
                        <Typography variant="body2" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                          {item.destination?.split(' - ')[0] || item.destination}
                        </Typography>
                        {item.destination?.includes(' - ') && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.55rem' }}
                          >
                            {item.destination.split(' - ').slice(1).join(' - ')}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={item.product}>
                        <Typography noWrap sx={{ fontSize: '0.65rem' }}>
                          {item.product}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          fontSize: '0.65rem',
                          fontWeight: 500,
                          color: 'info.main',
                          backgroundColor: 'info.50',
                          border: '1px solid',
                          borderColor: 'info.main',
                          borderRadius: 1,
                          px: 0.5,
                          py: 0.25,
                          textAlign: 'center',
                          minWidth: 'fit-content',
                          maxWidth: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '0.6rem',
                          }}
                        >
                          {getCategoryIcon(item.category)}
                        </Box>
                        <Typography
                          sx={{
                            fontSize: '0.65rem',
                            fontWeight: 500,
                            color: 'info.main',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.category}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{item.quantity.toLocaleString()}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {item.container} cont
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const status = getStatusLabel(item.status);
                        const colorKey = getStatusColorForChip(item.status);

                        // Xác định màu sắc dựa trên trạng thái
                        let color = 'primary.main';
                        let bgColor = 'primary.50';
                        let borderColor = 'primary.main';

                        if (colorKey === 'warning') {
                          color = 'warning.main';
                          bgColor = 'warning.50';
                          borderColor = 'warning.main';
                        } else if (colorKey === 'success') {
                          color = 'success.main';
                          bgColor = 'success.50';
                          borderColor = 'success.main';
                        } else if (colorKey === 'error') {
                          color = 'error.main';
                          bgColor = 'error.50';
                          borderColor = 'error.main';
                        } else if (colorKey === 'info') {
                          color = 'info.main';
                          bgColor = 'info.50';
                          borderColor = 'info.main';
                        }

                        return (
                          <Typography
                            sx={{
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              color: color,
                              backgroundColor: bgColor,
                              border: '1px solid',
                              borderColor: borderColor,
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
                      })()}
                    </TableCell>
                    {/* Ẩn cell ETA */}
                    <TableCell>
                      <Tooltip title={item.carrier}>
                        <Typography noWrap sx={{ fontSize: '0.65rem' }}>
                          {item.carrier}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.25,
                        }}
                      >
                        {item.packaging.map((pkg) => (
                          <Tooltip key={pkg.id} title={`${pkg.type}: ${pkg.quantity} SET`}>
                            <Typography
                              variant="caption"
                              noWrap
                              sx={{
                                fontSize: '0.65rem',
                                fontWeight: 500,
                              }}
                            >
                              {pkg.type}: {pkg.quantity} SET
                            </Typography>
                          </Tooltip>
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const isOnline = item.purpose === 'online';
                        const color = isOnline ? 'success.main' : 'warning.main';
                        const bgColor = isOnline ? 'success.50' : 'warning.50';
                        const borderColor = isOnline ? 'success.main' : 'warning.main';

                        return (
                          <Typography
                            sx={{
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              color: color,
                              backgroundColor: bgColor,
                              border: '1px solid',
                              borderColor: borderColor,
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
                            {isOnline ? 'Online' : 'Offline'}
                          </Typography>
                        );
                      })()}
                    </TableCell>
                    {/* Ẩn cell Thời gian nhận */}
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title="Thao tác">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionMenuOpen(e, item)}
                          sx={{
                            color: 'primary.main',
                            '&:hover': {
                              backgroundColor: 'primary.50',
                            },
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          {/* Compact Filter Section */}
          <Box sx={{ mb: 2 }}>
            {/* Filter Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                bgcolor: 'grey.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200',
                cursor: 'pointer',
              }}
              onClick={() => setFilterExpanded(!filterExpanded)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  🔍 Bộ lọc
                </Typography>
                {getActiveFilterCount() > 0 && (
                  <Chip
                    label={getActiveFilterCount()}
                    size="small"
                    color="primary"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                )}
                {getActiveFilterCount() > 0 && (
                  <Typography
                    variant="caption"
                    sx={{ fontSize: '0.7rem', color: 'text.secondary' }}
                  >
                    {getFilterSummary()}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getActiveFilterCount() > 0 && (
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllFilters();
                    }}
                    sx={{ fontSize: '0.7rem', minWidth: 'auto', px: 1 }}
                  >
                    Xóa tất cả
                  </Button>
                )}
                <IconButton size="small">
                  {filterExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </Box>

            {/* Expanded Filter Content */}
            {filterExpanded && (
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  bgcolor: 'grey.25',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.100',
                }}
              >
                <Grid container spacing={2}>
                  {/* Status Filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor: activeFilterSection === 'status' ? 'primary.main' : 'grey.200',
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: activeFilterSection === 'status' ? 'primary.50' : 'white',
                      }}
                      onClick={() =>
                        setActiveFilterSection(activeFilterSection === 'status' ? null : 'status')
                      }
                    >
                      <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 1 }}>
                        Trạng thái {filters.status.length > 0 && `(${filters.status.length})`}
                      </Typography>
                      {activeFilterSection === 'status' && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {[
                            'pending',
                            'confirmed',
                            'waiting-notification',
                            'notified',
                            'received',
                          ].map((status) => (
                            <Chip
                              key={status}
                              label={getStatusLabel(status)}
                              size="small"
                              clickable
                              color={filters.status.includes(status) ? 'primary' : 'default'}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFilter('status', status);
                              }}
                              sx={{ fontSize: '0.65rem', height: 24 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Document Status Filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor:
                          activeFilterSection === 'documentStatus' ? 'primary.main' : 'grey.200',
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: activeFilterSection === 'documentStatus' ? 'primary.50' : 'white',
                      }}
                      onClick={() =>
                        setActiveFilterSection(
                          activeFilterSection === 'documentStatus' ? null : 'documentStatus'
                        )
                      }
                    >
                      <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 1 }}>
                        Chứng từ{' '}
                        {filters.documentStatus.length > 0 && `(${filters.documentStatus.length})`}
                      </Typography>
                      {activeFilterSection === 'documentStatus' && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {getUniqueDocumentStatuses().map((status) => (
                            <Chip
                              key={status}
                              label={
                                status === 'completed'
                                  ? 'Hoàn thành'
                                  : status === 'pending'
                                    ? 'Chờ xử lý'
                                    : status === 'in-progress'
                                      ? 'Đang xử lý'
                                      : 'Đã xác nhận'
                              }
                              size="small"
                              clickable
                              color={
                                filters.documentStatus.includes(status) ? 'primary' : 'default'
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFilter('documentStatus', status);
                              }}
                              sx={{ fontSize: '0.65rem', height: 24 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Timeline Status Filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor:
                          activeFilterSection === 'timelineStatus' ? 'primary.main' : 'grey.200',
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: activeFilterSection === 'timelineStatus' ? 'primary.50' : 'white',
                      }}
                      onClick={() =>
                        setActiveFilterSection(
                          activeFilterSection === 'timelineStatus' ? null : 'timelineStatus'
                        )
                      }
                    >
                      <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 1 }}>
                        Timeline{' '}
                        {filters.timelineStatus.length > 0 && `(${filters.timelineStatus.length})`}
                      </Typography>
                      {activeFilterSection === 'timelineStatus' && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {getUniqueTimelineStatuses().map((status) => (
                            <Chip
                              key={status}
                              label={
                                status === 'completed'
                                  ? 'Hoàn thành'
                                  : status === 'pending'
                                    ? 'Chờ xử lý'
                                    : status === 'in-progress'
                                      ? 'Đang xử lý'
                                      : 'Đã xác nhận'
                              }
                              size="small"
                              clickable
                              color={
                                filters.timelineStatus.includes(status) ? 'primary' : 'default'
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFilter('timelineStatus', status);
                              }}
                              sx={{ fontSize: '0.65rem', height: 24 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Carrier Filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor:
                          activeFilterSection === 'carriers' ? 'primary.main' : 'grey.200',
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: activeFilterSection === 'carriers' ? 'primary.50' : 'white',
                      }}
                      onClick={() =>
                        setActiveFilterSection(
                          activeFilterSection === 'carriers' ? null : 'carriers'
                        )
                      }
                    >
                      <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 1 }}>
                        Vận chuyển {filters.carriers.length > 0 && `(${filters.carriers.length})`}
                      </Typography>
                      {activeFilterSection === 'carriers' && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {getUniqueCarriers().map((carrier) => (
                            <Chip
                              key={carrier}
                              label={carrier}
                              size="small"
                              clickable
                              color={filters.carriers.includes(carrier) ? 'primary' : 'default'}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFilter('carriers', carrier);
                              }}
                              sx={{ fontSize: '0.65rem', height: 24 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Destination Filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor:
                          activeFilterSection === 'destinations' ? 'primary.main' : 'grey.200',
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: activeFilterSection === 'destinations' ? 'primary.50' : 'white',
                      }}
                      onClick={() =>
                        setActiveFilterSection(
                          activeFilterSection === 'destinations' ? null : 'destinations'
                        )
                      }
                    >
                      <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 1 }}>
                        Đích đến{' '}
                        {filters.destinations.length > 0 && `(${filters.destinations.length})`}
                      </Typography>
                      {activeFilterSection === 'destinations' && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {getUniqueDestinations().map((destination) => (
                            <Chip
                              key={destination}
                              label={destination}
                              size="small"
                              clickable
                              color={
                                filters.destinations.includes(destination) ? 'primary' : 'default'
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFilter('destinations', destination);
                              }}
                              sx={{ fontSize: '0.65rem', height: 24 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Product Filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor:
                          activeFilterSection === 'products' ? 'primary.main' : 'grey.200',
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: activeFilterSection === 'products' ? 'primary.50' : 'white',
                      }}
                      onClick={() =>
                        setActiveFilterSection(
                          activeFilterSection === 'products' ? null : 'products'
                        )
                      }
                    >
                      <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 1 }}>
                        Sản phẩm {filters.products.length > 0 && `(${filters.products.length})`}
                      </Typography>
                      {activeFilterSection === 'products' && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {getUniqueProducts().map((product) => (
                            <Chip
                              key={product}
                              label={product}
                              size="small"
                              clickable
                              color={filters.products.includes(product) ? 'primary' : 'default'}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFilter('products', product);
                              }}
                              sx={{ fontSize: '0.65rem', height: 24 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  {/* Category Filter */}
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor:
                          activeFilterSection === 'categories' ? 'primary.main' : 'grey.200',
                        borderRadius: 1,
                        cursor: 'pointer',
                        bgcolor: activeFilterSection === 'categories' ? 'primary.50' : 'white',
                      }}
                      onClick={() =>
                        setActiveFilterSection(
                          activeFilterSection === 'categories' ? null : 'categories'
                        )
                      }
                    >
                      <Typography variant="subtitle2" sx={{ fontSize: '0.8rem', mb: 1 }}>
                        Phân loại{' '}
                        {filters.categories.length > 0 && `(${filters.categories.length})`}
                      </Typography>
                      {activeFilterSection === 'categories' && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {getUniqueCategories().map((category) => (
                            <Chip
                              key={category}
                              label={category}
                              size="small"
                              clickable
                              color={filters.categories.includes(category) ? 'primary' : 'default'}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFilter('categories', category);
                              }}
                              sx={{ fontSize: '0.65rem', height: 24 }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>

          {/* Calendar Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon color="primary" />
              Lịch nhập hàng -{' '}
              {currentDate.toLocaleDateString('vi-VN', {
                month: 'long',
                year: 'numeric',
              })}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handlePrevMonth} size="small">
                <ArrowBackIcon />
              </IconButton>
              <IconButton onClick={handleNextMonth} size="small">
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </Box>
          {/* Calendar Grid */}
          <Box sx={{ mb: 3 }}>
            {/* Day headers */}
            <Grid container spacing={0}>
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                <Grid item xs={12 / 7} key={day}>
                  <Box
                    sx={{
                      p: 1,
                      textAlign: 'center',
                      fontWeight: 'bold',
                      bgcolor: 'grey.100',
                      color: 'grey.700',
                      borderRight: '1px solid',
                      borderColor: 'grey.300',
                    }}
                  >
                    <Typography variant="caption">{day}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Calendar days */}
            <Grid container spacing={0}>
              {(() => {
                const daysInMonth = getDaysInMonth(currentDate);
                const firstDay = getFirstDayOfMonth(currentDate);
                const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;
                const days = [];

                // Calculate max items per row to determine row height
                const maxItemsPerRow = [];
                for (let row = 0; row < Math.ceil(totalCells / 7); row++) {
                  let maxItemsInRow = 0;
                  for (let col = 0; col < 7; col++) {
                    const cellIndex = row * 7 + col;
                    const dayNumber = cellIndex - firstDay + 1;
                    const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                    if (isValidDay) {
                      const cellDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        dayNumber
                      );
                      const dayItems = getFilteredItemsForDate(cellDate);
                      maxItemsInRow = Math.max(maxItemsInRow, dayItems.length);
                    }
                  }
                  maxItemsPerRow.push(maxItemsInRow);
                }

                for (let i = 0; i < totalCells; i++) {
                  const dayNumber = i - firstDay + 1;
                  const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
                  const cellDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    dayNumber
                  );
                  const dayItems = isValidDay ? getFilteredItemsForDate(cellDate) : [];
                  const hasItems = dayItems.length > 0;
                  const isToday =
                    isValidDay && cellDate.toDateString() === new Date().toDateString();
                  const isSelected =
                    selectedDate &&
                    isValidDay &&
                    cellDate.toDateString() === selectedDate.toDateString();

                  // Calculate row height based on max items in this row
                  const rowIndex = Math.floor(i / 7);
                  const maxItemsInRow = maxItemsPerRow[rowIndex] || 0;
                  const baseHeight = 80; // Base height for no items
                  const itemHeight = 20; // Height per item
                  const rowHeight = baseHeight + maxItemsInRow * itemHeight;

                  days.push(
                    <Grid item xs={12 / 7} key={i}>
                      <Tooltip
                        title={
                          isValidDay
                            ? hasItems
                              ? `Click để xem chi tiết (${dayItems.length} lô hàng)`
                              : 'Click icon 3 chấm để thao tác'
                            : ''
                        }
                        placement="top"
                      >
                        <Box
                          onClick={() => {
                            if (isValidDay && hasItems) {
                              handleDateClick(cellDate);
                            }
                          }}
                          sx={{
                            height: rowHeight,
                            p: 1,
                            border: '1px solid',
                            borderColor: 'grey.300',
                            cursor: isValidDay ? 'pointer' : 'default',
                            bgcolor: isSelected ? 'primary.50' : isToday ? 'warning.50' : 'white',
                            '&:hover': isValidDay
                              ? {
                                  bgcolor: 'grey.50',
                                }
                              : {},
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {isValidDay && (
                            <>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: isToday ? 'bold' : 'normal',
                                  color: isToday ? 'warning.main' : 'text.primary',
                                }}
                              >
                                {dayNumber}
                              </Typography>
                              {hasItems && (
                                <Box
                                  sx={{
                                    mt: 0.3,
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start',
                                  }}
                                >
                                  {dayItems.slice(0, 2).map((item, idx) => (
                                    <Box
                                      key={idx}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.2,
                                        mb: 0.15,
                                        p: 0.2,
                                        bgcolor: 'rgba(255,255,255,0.9)',
                                        borderRadius: 0.5,
                                        border: '1px solid rgba(0,0,0,0.1)',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          width: 4,
                                          height: 4,
                                          borderRadius: '50%',
                                          bgcolor: getStatusColor(item.status),
                                          flexShrink: 0,
                                        }}
                                      />
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontSize: '0.5rem',
                                          fontWeight: 'bold',
                                          color: 'text.secondary',
                                          flexShrink: 0,
                                        }}
                                      >
                                        {item.quantity}
                                      </Typography>
                                      <Box
                                        sx={{
                                          fontSize: '0.4rem',
                                          display: 'flex',
                                          alignItems: 'center',
                                          flexShrink: 0,
                                        }}
                                      >
                                        {getCategoryIcon(item.category)}
                                      </Box>
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontSize: '0.45rem',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          flex: 1,
                                          minWidth: 0,
                                        }}
                                      >
                                        {item.supplier}
                                      </Typography>
                                    </Box>
                                  ))}
                                  {dayItems.length > 2 && (
                                    <Box
                                      sx={{
                                        p: 0.2,
                                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                                        borderRadius: 0.5,
                                        textAlign: 'center',
                                        border: '1px solid rgba(25, 118, 210, 0.2)',
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          fontSize: '0.45rem',
                                          color: 'primary.main',
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        +{dayItems.length - 2} khác
                                      </Typography>
                                    </Box>
                                  )}
                                </Box>
                              )}
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: 4,
                                  right: 4,
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  bgcolor: 'grey.100',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    bgcolor: 'grey.200',
                                  },
                                }}
                                onClick={(e) => handleCalendarMenuOpen(e, cellDate)}
                              >
                                <MoreVertIcon
                                  sx={{
                                    fontSize: '0.8rem',
                                    color: 'grey.600',
                                  }}
                                />
                              </Box>
                            </>
                          )}
                        </Box>
                      </Tooltip>
                    </Grid>
                  );
                }
                return days;
              })()}
            </Grid>
          </Box>
          {/* Selected Date Details */}
          {selectedDate && selectedDateItems.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Chi tiết ngày {selectedDate.toLocaleDateString('vi-VN')} ({selectedDateItems.length}{' '}
                lô hàng)
              </Typography>

              <Grid container spacing={2}>
                {selectedDateItems.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: 'grey.300',
                        '&:hover': {
                          elevation: 4,
                          transform: 'translateY(-2px)',
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            {getStatusIcon(item.status)}
                            <Typography variant="subtitle2" component="div" fontWeight="bold">
                              {item.supplier}
                            </Typography>
                          </Box>
                          <Chip
                            label={getStatusLabel(item.status)}
                            color={
                              getStatusColorForChip(item.status) as
                                | 'default'
                                | 'primary'
                                | 'secondary'
                                | 'success'
                                | 'info'
                                | 'warning'
                                | 'error'
                            }
                            size="small"
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="primary.main"
                          fontWeight="bold"
                          gutterBottom
                        >
                          {item.pi}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem' }}
                        >
                          <strong>Từ:</strong> {item.origin}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem' }}
                        >
                          <strong>Sản phẩm:</strong> {item.product}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem' }}
                        >
                          <strong>Số lượng:</strong> {item.quantity.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem' }}
                        >
                          <strong>Container:</strong> {item.container} cont
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem' }}
                        >
                          <strong>Nhà vận chuyển:</strong> {item.carrier}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem' }}
                        >
                          <strong>Quy cách đóng gói:</strong>
                        </Typography>
                        {item.packaging.map((pkg) => (
                          <Typography
                            key={pkg.id}
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.75rem', ml: 2 }}
                          >
                            • {pkg.type}: {pkg.quantity} SET
                            {pkg.description && ` (${pkg.description})`}
                          </Typography>
                        ))}
                        <Typography
                          variant="body2"
                          color="primary.main"
                          sx={{ fontSize: '0.8rem', fontWeight: 600, mt: 1 }}
                        >
                          <strong>📦 Tổng sản phẩm:</strong>{' '}
                          {calculateTotalProducts(item.packaging).toLocaleString()} PCS
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem' }}
                        >
                          <strong>Mục đích:</strong>{' '}
                          {item.purpose === 'online' ? 'Online' : 'Offline'}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem' }}
                        >
                          <strong>Thời gian nhận:</strong> {item.receiveTime || 'Chưa có'}
                        </Typography>

                        {/* Phân loại hàng hóa */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem' }}
                        >
                          <strong>Phân loại:</strong> {item.category || 'Chưa có'}
                        </Typography>

                        {/* Đích đến */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem' }}
                        >
                          <strong>Đích đến:</strong> {item.destination || 'Chưa có'}
                        </Typography>

                        {/* Phiếu PO */}
                        {item.poNumbers && item.poNumbers.length > 0 && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: '0.8rem' }}
                          >
                            <strong>Phiếu PO:</strong> {item.poNumbers.join(', ')}
                          </Typography>
                        )}

                        {/* Timeline Vận Chuyển */}
                        {item.timeline && item.timeline.length > 0 && (
                          <>
                            <Typography
                              variant="body2"
                              color="primary.main"
                              sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                mt: 1,
                              }}
                            >
                              <strong>📅 Timeline Vận Chuyển:</strong>
                            </Typography>
                            {item.timeline.map((timeline) => (
                              <Typography
                                key={timeline.id}
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem', ml: 2 }}
                              >
                                • {timeline.name}:
                                {timeline.estimatedDate && ` Dự kiến: ${timeline.estimatedDate}`}
                                {timeline.date && ` | Thực tế: ${timeline.date}`}
                                {timeline.status && ` (${getStatusLabel(timeline.status)})`}
                              </Typography>
                            ))}
                          </>
                        )}

                        {/* Trạng thái chứng từ */}
                        {item.documentStatus && item.documentStatus.length > 0 && (
                          <>
                            <Typography
                              variant="body2"
                              color="primary.main"
                              sx={{
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                mt: 1,
                              }}
                            >
                              <strong>📋 Trạng thái chứng từ:</strong>
                            </Typography>
                            {item.documentStatus.map((doc) => (
                              <Typography
                                key={doc.id}
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem', ml: 2 }}
                              >
                                • {doc.name}:{doc.estimatedDate && ` Dự kiến: ${doc.estimatedDate}`}
                                {doc.date && ` | Thực tế: ${doc.date}`}
                                {doc.status && ` (${getStatusLabel(doc.status)})`}
                              </Typography>
                            ))}
                          </>
                        )}

                        {/* Ghi chú */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.8rem', mt: 1 }}
                        >
                          <strong>Ghi chú:</strong> {item.notes || 'Chưa có'}
                        </Typography>

                        {/* Thông tin chi tiết từ flattened columns */}
                        <Box
                          sx={{
                            mt: 2,
                            p: 1,
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              mb: showTechnicalDetails ? 1 : 0,
                            }}
                            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                          >
                            <Typography
                              variant="body2"
                              color="primary.main"
                              sx={{ fontSize: '0.8rem', fontWeight: 600 }}
                            >
                              <strong>🔍 Chi tiết kỹ thuật:</strong>
                            </Typography>
                            <Typography
                              variant="body2"
                              color="primary.main"
                              sx={{ fontSize: '0.7rem' }}
                            >
                              {showTechnicalDetails ? 'Thu gọn ▲' : 'Xem thêm ▼'}
                            </Typography>
                          </Box>

                          {showTechnicalDetails && (
                            <Box>
                              {/* Packaging Flattened */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>Loại quy cách đóng gói:</strong>{' '}
                                {item.packaging?.map((p) => p.type).join(', ') || 'Chưa có'}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>Số lượng đóng gói:</strong>{' '}
                                {item.packaging?.map((p) => p.quantity).join(', ') || 'Chưa có'}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>Mô tả đóng gói:</strong>{' '}
                                {item.packaging
                                  ?.map((p) => p.description)
                                  .filter(Boolean)
                                  .join(', ') || 'Chưa có'}
                              </Typography>

                              {/* Timeline Flattened - Cargo Ready */}
                              {(() => {
                                const cargo = formatTimelineDisplay(
                                  'Cargo Ready',
                                  item.timeline || [],
                                  'timeline'
                                );
                                return (
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: '0.75rem', mt: 0.5 }}
                                  >
                                    <strong>Cargo Ready:</strong> Dự kiến: {cargo.estimated} | Thực
                                    tế: {cargo.actual} | Trạng thái: {cargo.status}
                                  </Typography>
                                );
                              })()}

                              {/* Timeline Flattened - ETD */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>ETD:</strong> Dự kiến:{' '}
                                {item.timeline?.find((t) => t.name === 'ETD')?.estimatedDate ||
                                  'Chưa có'}{' '}
                                | Thực tế:{' '}
                                {item.timeline?.find((t) => t.name === 'ETD')?.date || 'Chưa có'} |
                                Trạng thái:{' '}
                                {item.timeline?.find((t) => t.name === 'ETD')?.status || 'Chưa có'}
                              </Typography>

                              {/* Timeline Flattened - ETA */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>ETA:</strong> Dự kiến:{' '}
                                {item.timeline?.find((t) => t.name === 'ETA')?.estimatedDate ||
                                  'Chưa có'}{' '}
                                | Thực tế:{' '}
                                {item.timeline?.find((t) => t.name === 'ETA')?.date || 'Chưa có'} |
                                Trạng thái:{' '}
                                {item.timeline?.find((t) => t.name === 'ETA')?.status || 'Chưa có'}
                              </Typography>

                              {/* Timeline Flattened - Depart */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>Ngày hàng đi:</strong> Dự kiến:{' '}
                                {item.timeline?.find((t) => t.name === 'Ngày hàng đi')
                                  ?.estimatedDate || 'Chưa có'}{' '}
                                | Thực tế:{' '}
                                {item.timeline?.find((t) => t.name === 'Ngày hàng đi')?.date ||
                                  'Chưa có'}{' '}
                                | Trạng thái:{' '}
                                {item.timeline?.find((t) => t.name === 'Ngày hàng đi')?.status ||
                                  'Chưa có'}
                              </Typography>

                              {/* Timeline Flattened - Arrival Port */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>Ngày hàng về cảng:</strong> Dự kiến:{' '}
                                {item.timeline?.find((t) => t.name === 'Ngày hàng về cảng')
                                  ?.estimatedDate || 'Chưa có'}{' '}
                                | Thực tế:{' '}
                                {item.timeline?.find((t) => t.name === 'Ngày hàng về cảng')?.date ||
                                  'Chưa có'}{' '}
                                | Trạng thái:{' '}
                                {item.timeline?.find((t) => t.name === 'Ngày hàng về cảng')
                                  ?.status || 'Chưa có'}
                              </Typography>

                              {/* Timeline Flattened - Receive */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>Ngày nhận hàng:</strong> Dự kiến:{' '}
                                {item.timeline?.find((t) => t.name === 'Ngày nhận hàng')
                                  ?.estimatedDate || 'Chưa có'}{' '}
                                | Thực tế:{' '}
                                {item.timeline?.find((t) => t.name === 'Ngày nhận hàng')?.date ||
                                  'Chưa có'}{' '}
                                | Trạng thái:{' '}
                                {item.timeline?.find((t) => t.name === 'Ngày nhận hàng')?.status ||
                                  'Chưa có'}
                              </Typography>

                              {/* Document Status Flattened - Check Bill */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem', mt: 0.5 }}
                              >
                                <strong>Check Bill:</strong> Dự kiến:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Check bill')
                                  ?.estimatedDate || 'Chưa có'}{' '}
                                | Thực tế:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Check bill')?.date ||
                                  'Chưa có'}{' '}
                                | Trạng thái:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Check bill')
                                  ?.status || 'Chưa có'}
                              </Typography>

                              {/* Document Status Flattened - Check CO */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>Check CO:</strong> Dự kiến:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Check CO')
                                  ?.estimatedDate || 'Chưa có'}{' '}
                                | Thực tế:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Check CO')?.date ||
                                  'Chưa có'}{' '}
                                | Trạng thái:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Check CO')?.status ||
                                  'Chưa có'}
                              </Typography>

                              {/* Document Status Flattened - Send Docs */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>TQ gửi chứng từ đi:</strong> Dự kiến:{' '}
                                {item.documentStatus?.find((d) => d.name === 'TQ gửi chứng từ đi')
                                  ?.estimatedDate || 'Chưa có'}{' '}
                                | Thực tế:{' '}
                                {item.documentStatus?.find((d) => d.name === 'TQ gửi chứng từ đi')
                                  ?.date || 'Chưa có'}{' '}
                                | Trạng thái:{' '}
                                {item.documentStatus?.find((d) => d.name === 'TQ gửi chứng từ đi')
                                  ?.status || 'Chưa có'}
                              </Typography>

                              {/* Document Status Flattened - Customs */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>Lên Tờ Khai Hải Quan:</strong> Dự kiến:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Lên Tờ Khai Hải Quan')
                                  ?.estimatedDate || 'Chưa có'}{' '}
                                | Thực tế:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Lên Tờ Khai Hải Quan')
                                  ?.date || 'Chưa có'}{' '}
                                | Trạng thái:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Lên Tờ Khai Hải Quan')
                                  ?.status || 'Chưa có'}
                              </Typography>

                              {/* Document Status Flattened - Tax */}
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                              >
                                <strong>Đóng thuế:</strong> Dự kiến:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Đóng thuế')
                                  ?.estimatedDate || 'Chưa có'}{' '}
                                | Thực tế:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Đóng thuế')?.date ||
                                  'Chưa có'}{' '}
                                | Trạng thái:{' '}
                                {item.documentStatus?.find((d) => d.name === 'Đóng thuế')?.status ||
                                  'Chưa có'}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Thông tin hệ thống */}
                        <Box
                          sx={{
                            mt: 1,
                            pt: 1,
                            borderTop: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.disabled"
                            sx={{ fontSize: '0.7rem' }}
                          >
                            <strong>ID:</strong> {item.id}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.disabled"
                            sx={{ fontSize: '0.7rem' }}
                          >
                            <strong>Tạo lúc:</strong> {item.createdAt || 'Chưa có'}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.disabled"
                            sx={{ fontSize: '0.7rem' }}
                          >
                            <strong>Cập nhật:</strong> {item.updatedAt || 'Chưa có'}
                          </Typography>
                        </Box>

                        {/* Card action menu */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                            pt: 2,
                            borderTop: '1px solid',
                            borderColor: 'grey.200',
                          }}
                        >
                          <Tooltip title="Thao tác">
                            <IconButton
                              size="small"
                              onClick={(e) => handleCardMenuOpen(e, item)}
                              sx={{
                                color: 'grey.600',
                                '&:hover': {
                                  backgroundColor: 'primary.50',
                                  color: 'primary.main',
                                },
                              }}
                            >
                              <MoreVertIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {selectedDate && selectedDateItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Không có lô hàng nào trong ngày {selectedDate.toLocaleDateString('vi-VN')}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddNew}
      >
        <AddIcon />
      </Fab>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem
            ? 'Sửa lịch nhập hàng'
            : addFromCalendar
              ? `Thêm lịch nhập hàng - ${addFromCalendar.toLocaleDateString('vi-VN')}`
              : 'Thêm lịch nhập hàng mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mã PI (Lô hàng)"
                value={formFields.pi}
                onChange={(e) => setField('pi', e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nhà cung cấp"
                value={formFields.supplier}
                onChange={(e) => setField('supplier', e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sản phẩm"
                value={formFields.product}
                onChange={(e) => setField('product', e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                freeSolo
                options={productCategories}
                value={formFields.category}
                onInputChange={(_, v) => setField('category', v)}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    {getCategoryIcon(option)}
                    {option}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Phân loại hàng hóa" variant="outlined" required />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Xuất xứ"
                value={formFields.origin}
                onChange={(e) => setField('origin', e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                freeSolo
                options={destinations}
                value={formFields.destination}
                onInputChange={(_, v) => setField('destination', v)}
                renderInput={(params) => (
                  <TextField {...params} label="Đích đến" variant="outlined" required />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số lượng"
                type="number"
                value={formFields.quantity}
                onChange={(e) => setField('quantity', Number(e.target.value))}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Số lượng Container"
                type="number"
                value={formFields.container}
                onChange={(e) => setField('container', Number(e.target.value))}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phiếu PO (cách nhau bằng dấu phẩy)"
                value={formFields.poNumbersInput}
                onChange={(e) => setField('poNumbersInput', e.target.value)}
                variant="outlined"
                placeholder="PO-2024-001, PO-2024-002"
                helperText="Nhập nhiều PO cách nhau bằng dấu phẩy"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formFields.status}
                  onChange={(e) => setField('status', e.target.value as InboundItem['status'])}
                  label="Trạng thái"
                >
                  <MenuItem value="pending">Chờ xác nhận</MenuItem>
                  <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                  <MenuItem value="waiting-notification">Chờ thông báo</MenuItem>
                  <MenuItem value="notified">Đã thông báo</MenuItem>
                  <MenuItem value="received">Đã nhận</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nhà vận chuyển"
                value={formFields.carrier}
                onChange={(e) => setField('carrier', e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem' }}>
                📦 Quy cách đóng gói
              </Typography>

              {/* Packaging Items List */}
              {packagingItems.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 1,
                    p: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <Typography variant="body2" sx={{ minWidth: '80px', fontWeight: 500 }}>
                    {item.type}
                  </Typography>
                  <Typography variant="body2" sx={{ minWidth: '60px' }}>
                    {item.quantity} SET
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary' }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Sửa mô tả">
                      <IconButton
                        size="small"
                        onClick={() => handleEditItem('packaging', item, index)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => handleRemovePackagingItem(item.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}

              {/* Add New Packaging Item */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  mt: 2,
                  p: 2,
                  border: '2px dashed #ccc',
                  borderRadius: 1,
                  backgroundColor: '#fafafa',
                }}
              >
                <FormControl sx={{ minWidth: '120px' }}>
                  <InputLabel>Loại</InputLabel>
                  <Select
                    value={newPackagingItem.type}
                    onChange={(e) =>
                      setNewPackagingItem((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    label="Loại"
                  >
                    <MenuItem value="1PCS/SET">1PCS/SET</MenuItem>
                    <MenuItem value="2PCS/SET">2PCS/SET</MenuItem>
                    <MenuItem value="3PCS/SET">3PCS/SET</MenuItem>
                    <MenuItem value="4PCS/SET">4PCS/SET</MenuItem>
                    <MenuItem value="5PCS/SET">5PCS/SET</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Số lượng SET"
                  type="number"
                  value={newPackagingItem.quantity}
                  onChange={(e) =>
                    setNewPackagingItem((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 0,
                    }))
                  }
                  sx={{ minWidth: '120px' }}
                  inputProps={{ min: 0 }}
                />

                <TextField
                  label="Mô tả"
                  value={newPackagingItem.description}
                  onChange={(e) =>
                    setNewPackagingItem((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  sx={{ flex: 1 }}
                  placeholder="VD: Thùng carton, Pallet gỗ..."
                />

                <Button
                  variant="contained"
                  onClick={handleAddPackagingItem}
                  disabled={!newPackagingItem.type || newPackagingItem.quantity <= 0}
                  startIcon={<AddIcon />}
                >
                  Thêm
                </Button>
              </Box>

              {/* Total Products Display */}
              {packagingItems.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    backgroundColor: '#e3f2fd',
                    borderRadius: 1,
                    border: '1px solid #2196f3',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    📦 Tổng số sản phẩm: {calculateTotalProducts(packagingItems).toLocaleString()}{' '}
                    PCS
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mt: 0.5,
                    }}
                  >
                    Tự động tính từ các loại quy cách đóng gói
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Mục đích</InputLabel>
                <Select defaultValue={editingItem?.purpose || 'online'} label="Mục đích">
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="offline">Offline</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Thời gian nhận"
                type="time"
                defaultValue={editingItem?.receiveTime || ''}
                variant="outlined"
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem' }}>
                📅 Timeline Vận Chuyển
              </Typography>

              {/* Timeline Items List */}
              {timelineItems.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 1,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor:
                      item.status === 'completed'
                        ? '#e8f5e8'
                        : item.status === 'delayed'
                          ? '#ffeaa7'
                          : '#f5f5f5',
                  }}
                >
                  <Box sx={{ minWidth: '120px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Chip
                      label={
                        item.status === 'completed'
                          ? 'Hoàn thành'
                          : item.status === 'delayed'
                            ? 'Trễ'
                            : 'Chờ xử lý'
                      }
                      color={
                        item.status === 'completed'
                          ? 'success'
                          : item.status === 'delayed'
                            ? 'warning'
                            : 'default'
                      }
                      size="small"
                      sx={{ fontSize: '0.7rem', mt: 0.5 }}
                    />
                  </Box>

                  <Box sx={{ minWidth: '100px' }}>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: 'text.secondary' }}
                    >
                      Dự kiến:
                    </Typography>
                    <Typography variant="body2">
                      {item.estimatedDate
                        ? (() => {
                            const d = new Date(item.estimatedDate);
                            return isNaN(d.getTime()) ? 'Chưa có' : d.toLocaleDateString('vi-VN');
                          })()
                        : 'Chưa có'}
                    </Typography>
                  </Box>

                  <Box sx={{ minWidth: '100px' }}>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: 'text.secondary' }}
                    >
                      Thực tế:
                    </Typography>
                    <Typography variant="body2">
                      {item.date
                        ? (() => {
                            const d = new Date(item.date);
                            return isNaN(d.getTime()) ? 'Chưa có' : d.toLocaleDateString('vi-VN');
                          })()
                        : 'Chưa có'}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary' }}>
                    {item.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Sửa mô tả">
                      <IconButton
                        size="small"
                        onClick={() => handleEditItem('timeline', item, index)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveTimelineItem(item.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}

              {/* Add New Timeline Item */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  mt: 2,
                  p: 2,
                  border: '2px dashed #ccc',
                  borderRadius: 1,
                  backgroundColor: '#fafafa',
                  flexWrap: 'wrap',
                }}
              >
                <FormControl sx={{ minWidth: '140px' }}>
                  <InputLabel>Mốc thời gian</InputLabel>
                  <Select
                    value={newTimelineItem.name}
                    onChange={(e) =>
                      setNewTimelineItem((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    label="Mốc thời gian"
                  >
                    <MenuItem value="Ngày nhập hàng">Ngày nhập hàng</MenuItem>
                    <MenuItem value="Cargo Ready">Cargo Ready</MenuItem>
                    <MenuItem value="ETD">ETD</MenuItem>
                    <MenuItem value="ETA">ETA</MenuItem>
                    <MenuItem value="Ngày hàng đi">Ngày hàng đi</MenuItem>
                    <MenuItem value="Ngày hàng về cảng">Ngày hàng về cảng</MenuItem>
                    <MenuItem value="Ngày nhận hàng">Ngày nhận hàng</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Ngày dự kiến"
                  type="date"
                  value={newTimelineItem.estimatedDate}
                  onChange={(e) =>
                    setNewTimelineItem((prev) => ({
                      ...prev,
                      estimatedDate: e.target.value,
                    }))
                  }
                  sx={{ minWidth: '140px' }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Ngày thực tế"
                  type="date"
                  value={newTimelineItem.date}
                  onChange={(e) =>
                    setNewTimelineItem((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  sx={{ minWidth: '140px' }}
                  InputLabelProps={{ shrink: true }}
                />

                <FormControl sx={{ minWidth: '120px' }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={newTimelineItem.status}
                    onChange={(e) =>
                      setNewTimelineItem((prev) => ({
                        ...prev,
                        status: e.target.value as 'completed' | 'pending',
                      }))
                    }
                    label="Trạng thái"
                  >
                    <MenuItem value="pending">Chờ xử lý</MenuItem>
                    <MenuItem value="completed">Hoàn thành</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Mô tả"
                  value={newTimelineItem.description}
                  onChange={(e) =>
                    setNewTimelineItem((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  sx={{ minWidth: '200px', flex: 1 }}
                  placeholder="Mô tả thêm..."
                />

                <Button
                  variant="contained"
                  onClick={handleAddTimelineItem}
                  disabled={!newTimelineItem.name || !newTimelineItem.date}
                  startIcon={<AddIcon />}
                >
                  Thêm
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem' }}>
                📄 Trạng thái chứng từ
              </Typography>

              {/* Document Status Items List */}
              {documentStatusItems.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 1,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor:
                      item.status === 'completed'
                        ? '#e8f5e8'
                        : item.status === 'delayed'
                          ? '#ffeaa7'
                          : item.status === 'in-progress'
                            ? '#e3f2fd'
                            : '#f5f5f5',
                  }}
                >
                  <Box sx={{ minWidth: '120px' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Chip
                      label={
                        item.status === 'completed'
                          ? 'Hoàn thành'
                          : item.status === 'delayed'
                            ? 'Trễ'
                            : item.status === 'in-progress'
                              ? 'Đang xử lý'
                              : 'Chờ xử lý'
                      }
                      color={
                        item.status === 'completed'
                          ? 'success'
                          : item.status === 'delayed'
                            ? 'warning'
                            : item.status === 'in-progress'
                              ? 'info'
                              : 'default'
                      }
                      size="small"
                      sx={{ fontSize: '0.7rem', mt: 0.5 }}
                    />
                  </Box>

                  <Box sx={{ minWidth: '100px' }}>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: 'text.secondary' }}
                    >
                      Dự kiến:
                    </Typography>
                    <Typography variant="body2">
                      {item.estimatedDate
                        ? (() => {
                            const d = new Date(item.estimatedDate);
                            return isNaN(d.getTime()) ? 'Chưa có' : d.toLocaleDateString('vi-VN');
                          })()
                        : 'Chưa có'}
                    </Typography>
                  </Box>

                  <Box sx={{ minWidth: '100px' }}>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: 'text.secondary' }}
                    >
                      Thực tế:
                    </Typography>
                    <Typography variant="body2">
                      {item.date
                        ? (() => {
                            const d = new Date(item.date);
                            return isNaN(d.getTime()) ? 'Chưa có' : d.toLocaleDateString('vi-VN');
                          })()
                        : 'Chưa có'}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ flex: 1, color: 'text.secondary' }}>
                    {item.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Sửa mô tả">
                      <IconButton
                        size="small"
                        onClick={() => handleEditItem('documentStatus', item, index)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveDocumentStatusItem(item.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}

              {/* Add New Document Status Item */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  mt: 2,
                  p: 2,
                  border: '2px dashed #ccc',
                  borderRadius: 1,
                  backgroundColor: '#fafafa',
                  flexWrap: 'wrap',
                }}
              >
                <FormControl sx={{ minWidth: '140px' }}>
                  <InputLabel>Trạng thái chứng từ</InputLabel>
                  <Select
                    value={newDocumentStatusItem.name}
                    onChange={(e) =>
                      setNewDocumentStatusItem((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    label="Trạng thái chứng từ"
                  >
                    <MenuItem value="Check bill">Check bill</MenuItem>
                    <MenuItem value="Check CO">Check CO</MenuItem>
                    <MenuItem value="TQ gửi chứng từ đi">TQ gửi chứng từ đi</MenuItem>
                    <MenuItem value="Lên Tờ Khai Hải Quan">Lên Tờ Khai Hải Quan</MenuItem>
                    <MenuItem value="Đóng thuế">Đóng thuế</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Ngày dự kiến"
                  type="date"
                  value={newDocumentStatusItem.estimatedDate}
                  onChange={(e) =>
                    setNewDocumentStatusItem((prev) => ({
                      ...prev,
                      estimatedDate: e.target.value,
                    }))
                  }
                  sx={{ minWidth: '140px' }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Ngày thực tế"
                  type="date"
                  value={newDocumentStatusItem.date}
                  onChange={(e) =>
                    setNewDocumentStatusItem((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  sx={{ minWidth: '140px' }}
                  InputLabelProps={{ shrink: true }}
                />

                <FormControl sx={{ minWidth: '120px' }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={newDocumentStatusItem.status}
                    onChange={(e) =>
                      setNewDocumentStatusItem((prev) => ({
                        ...prev,
                        status: e.target.value as 'completed' | 'pending' | 'in-progress',
                      }))
                    }
                    label="Trạng thái"
                  >
                    <MenuItem value="pending">Chờ xử lý</MenuItem>
                    <MenuItem value="in-progress">Đang xử lý</MenuItem>
                    <MenuItem value="completed">Hoàn thành</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Mô tả"
                  value={newDocumentStatusItem.description}
                  onChange={(e) =>
                    setNewDocumentStatusItem((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  sx={{ minWidth: '200px', flex: 1 }}
                  placeholder="Mô tả thêm..."
                />

                <Button
                  variant="contained"
                  onClick={handleAddDocumentStatusItem}
                  disabled={!newDocumentStatusItem.name || !newDocumentStatusItem.date}
                  startIcon={<AddIcon />}
                >
                  Thêm
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                multiline
                rows={3}
                value={editingItem?.notes || ''}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={() => handleSave({})} variant="contained" disabled={saving}>
            {editingItem ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
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
      >
        <MenuItem
          onClick={() => handleActionMenuAction('edit')}
          sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
        >
          <EditIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Sửa
        </MenuItem>
        <MenuItem
          onClick={() => handleActionMenuAction('delete')}
          sx={{
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            color: 'error.main',
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Xóa
        </MenuItem>
      </Menu>

      {/* Calendar Dropdown Menu */}
      <Menu
        open={Boolean(calendarMenuAnchor)}
        anchorEl={calendarMenuAnchor}
        onClose={handleCalendarMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => handleCalendarMenuAction('add')}
          sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
        >
          <AddIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Thêm lịch
        </MenuItem>
        {calendarMenuDate && getItemsForDate(calendarMenuDate).length > 0 && (
          <>
            <MenuItem
              onClick={() => handleCalendarMenuAction('view')}
              sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
            >
              <ScheduleIcon sx={{ mr: 1, fontSize: '1rem' }} />
              Xem chi tiết
            </MenuItem>
          </>
        )}
      </Menu>

      {/* Card Menu */}
      <Menu
        anchorEl={cardMenuAnchor}
        open={Boolean(cardMenuAnchor)}
        onClose={handleCardMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => handleCardMenuAction('edit')}
          sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
        >
          <EditIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Sửa lịch
        </MenuItem>
        <MenuItem
          onClick={() => handleCardMenuAction('delete')}
          sx={{
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            color: 'error.main',
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Xóa lịch
        </MenuItem>
      </Menu>

      {/* Edit Item Dialog */}
      <Dialog open={editItemDialog.open} onClose={handleEditItemClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Sửa mô tả -{' '}
          {editItemDialog.type === 'packaging'
            ? 'Quy cách đóng gói'
            : editItemDialog.type === 'timeline'
              ? 'Timeline Vận Chuyển'
              : 'Trạng thái chứng từ'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Item hiện tại:</strong>{' '}
              {editItemDialog.item && 'name' in editItemDialog.item
                ? editItemDialog.item.name
                : editItemDialog.item && 'type' in editItemDialog.item
                  ? editItemDialog.item.type
                  : 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Mô tả cũ:</strong> {editItemDialog.item?.description || 'Chưa có'}
            </Typography>

            <TextField
              fullWidth
              label="Mô tả mới (bắt buộc)"
              multiline
              rows={3}
              value={editItemForm.description}
              onChange={(e) =>
                setEditItemForm({
                  ...editItemForm,
                  description: e.target.value,
                })
              }
              placeholder="Nhập mô tả mới cho item này..."
              required
              sx={{ mt: 2 }}
            />

            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              * Mô tả mới sẽ thay thế mô tả cũ và không thể sửa lại
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditItemClose}>Hủy</Button>
          <Button
            onClick={handleEditItemSave}
            variant="contained"
            disabled={!editItemForm.description.trim()}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default InboundInternational;
