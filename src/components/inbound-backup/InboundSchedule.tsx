import InboundDetailCard from './components/InboundDetailCard';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Popover,
  MenuItem,
  SpeedDial,
  SpeedDialAction,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Flight as FlightIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  Public as InternationalIcon,
  BusinessCenter as DomesticIcon,
  Inventory2 as InventoryIcon,
  Timeline as TimelineIcon,
  Description as DocumentIcon,
  Category as ProductIcon,
} from '@mui/icons-material';

// Import shared components
import { TableView } from './components/table';
import { CalendarView } from './components/calendar';
import { AddEditDialog } from './components/dialogs';
import { InboundItem } from './types/inbound';
// Use function-based service API and correct relative path to src/services
import {
  getInboundScheduleItems,
  addInboundScheduleItem,
  updateInboundScheduleItem,
  deleteInboundScheduleItem,
} from '../../services/googleSheets/inboundScheduleService';
import {
  addTimelineDescription,
  addDocumentStatusDescription,
  getCurrentUser,
} from './utils/descriptionUtils';
import { useFormFields, useItemManagement, useDialogs, useCalendar } from './hooks';
// Removed MUI X Date Pickers to avoid extra dependency

const InboundSchedule: React.FC = () => {
  const [editingItem, setEditingItem] = useState<InboundItem | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar');

  // Use extracted hooks
  const { formFields, setField, resetForm } = useFormFields();
  const {
    packagingItems,
    timelineItems,
    documentStatusItems,
    newPackagingItem,
    newTimelineItem,
    newDocumentStatusItem,
    addPackagingItem,
    deletePackagingItem,
    addTimelineItem,
    updateTimelineItemFull,
    deleteTimelineItem,
    addDocumentStatusItem,
    updateDocumentStatusItemFull,
    deleteDocumentStatusItem,
    setNewPackagingItemField,
    setNewTimelineItemField,
    setNewDocumentStatusItemField,
    addTimelineItemWith,
    loadItemData,
    resetAllItems,
  } = useItemManagement();
  const { openDialog, openAddDialog, closeDialog: originalCloseDialog } = useDialogs();

  // Wrapper to reset all items when closing dialog
  const closeDialog = () => {
    resetAllItems(); // Clear arrays cache
    resetForm(); // Clear form fields cache
    originalCloseDialog();
  };
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    setSelectedDateItems,
    handlePrevMonth,
    handleNextMonth,
  } = useCalendar();
  const [activeTab, setActiveTab] = useState<'all' | 'international' | 'domestic'>('all');

  // Filter states
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [quickDateFilter, setQuickDateFilter] = useState<string>('all');
  const [customDateFrom, setCustomDateFrom] = useState<string>('');
  const [customDateTo, setCustomDateTo] = useState<string>('');

  // Action menu state
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [dayMenuAnchor, setDayMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedItemForAction, setSelectedItemForAction] = useState<InboundItem | null>(null);

  // Data state
  const [inboundItems, setInboundItems] = useState<InboundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getInboundScheduleItems();

      setInboundItems(items);
    } catch (err) {
      setError('Không thể tải dữ liệu');
      // console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleActionMenuAction = async (action: string, item: InboundItem) => {
    try {
      switch (action) {
        case 'edit':
          setEditingItem(item);
          // Load item data into form - this should preserve existing data
          loadItemData(item);
          openAddDialog();
          break;
        case 'delete':
          if (window.confirm('Bạn có chắc chắn muốn xóa item này?')) {
            if (item.type === 'international') {
              await deleteInboundScheduleItem(item.id);
              await reloadData();
            } else {
              // Domestic items - gọi deleteInboundDomesticItem
              const { deleteInboundDomesticItem } =
                await import('../../services/googleSheets/inboundDomesticService');
              await deleteInboundDomesticItem(item.id);
              await reloadData();
            }
          }
          break;
        case 'add-calendar':
          // Handle add to calendar
          // console.log("Add to calendar:", item);
          break;
      }
    } catch (error) {
      // console.error("Error handling action:", error);
    } finally {
      setActionMenuAnchor(null);
      setSelectedItemForAction(null);
    }
  };

  const filteredItems = inboundItems.filter((item) => {
    // Filter by tab
    if (activeTab !== 'all' && item.type !== activeTab) return false;

    // Filter by destination
    if (selectedDestination !== 'all' && item.destination !== selectedDestination) return false;

    // Filter by status
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;

    // Filter by date (quick filter)
    if (quickDateFilter !== 'all') {
      const dateRange = getDateRange(quickDateFilter);
      if (!isDateInRange(item.date, dateRange)) return false;
    }

    // Filter by custom date range
    if (customDateFrom && customDateTo) {
      const fromDate = new Date(customDateFrom);
      const toDate = new Date(customDateTo);

      const parseDate = (dateStr: string): Date => {
        if (dateStr.includes('/')) {
          const [day, month, year] = dateStr.split('/');
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        return new Date(dateStr);
      };

      const itemDateParsed = parseDate(item.date);
      if (itemDateParsed < fromDate || itemDateParsed > toDate) return false;
    }

    return true;
  });

  // Get unique destinations for filter
  const destinations = [...new Set(inboundItems.map((item) => item.destination).filter(Boolean))];

  // Helper: Auto-detect type dựa vào origin
  const detectItemType = (origin: string): 'international' | 'domestic' => {
    return origin && origin.trim() ? 'international' : 'domestic';
  };

  const handleAddInternational = () => {
    setEditingItem(null);
    resetAllItems();
    resetForm();
    // Pre-fill để auto-detect thành international (origin không trống)
    setField('origin', 'NINGBO'); // Default international origin
    openAddDialog();
  };

  const handleAddDomestic = () => {
    setEditingItem(null);
    resetAllItems();
    resetForm();
    // Pre-fill để auto-detect thành domestic (origin trống)
    setField('origin', ''); // Empty origin = domestic
    openAddDialog();
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        // Update existing item: merge form fields and current lists
        const poNumbers = (formFields.poNumbersInput || '')
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);

        // giữ sẵn giá trị ngày đã chọn nếu cần fallback khác
        // const yyyyMmDd = selectedDate
        //   ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
        //       selectedDate.getDate()
        //     ).padStart(2, '0')}`
        //   : new Date().toISOString().split('T')[0];

        // enforce schedule date and required timeline milestone
        const est =
          formFields.estimatedArrival ||
          (selectedDate
            ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
                selectedDate.getDate()
              ).padStart(2, '0')}`
            : '');
        const act = formFields.actualArrival || '';

        // Note: timelineItems from hook already contains the updated timeline data

        const updated: InboundItem = {
          ...editingItem,
          // date là ngày tạo lịch (không phụ thuộc receive)
          date: formFields.date || new Date().toLocaleDateString('vi-VN'),
          supplier: formFields.supplier,
          origin: formFields.origin,
          destination: formFields.destination,
          type: detectItemType(formFields.origin), // Auto-update type theo origin
          product: formFields.product,
          quantity: formFields.quantity,
          status: formFields.status as InboundItem['status'],
          estimatedArrival: est,
          actualArrival: act,
          carrier: formFields.carrier,
          pi: formFields.pi,
          container: formFields.container,
          category: formFields.category,
          purpose: formFields.purpose,
          receiveTime: formFields.receiveTime,
          notes: formFields.notes,
          poNumbers,
          packaging: packagingItems,
          timeline: timelineItems.map((item) => {
            // Nếu có description mới, thêm vào history
            if (item.description && item.description.trim()) {
              return addTimelineDescription(item, item.description, getCurrentUser());
            }
            return item;
          }),
          documentStatus: documentStatusItems.map((item) => {
            // Nếu có description mới, thêm vào history
            if (item.description && item.description.trim()) {
              return addDocumentStatusDescription(item, item.description, getCurrentUser());
            }
            return item;
          }),
        } as InboundItem;

        // Handle update theo type
        if (updated.type === 'international') {
          await updateInboundScheduleItem(updated);
          await reloadData();
          // Reset data sau khi update thành công để chuẩn bị cho lần thêm tiếp theo
          resetAllItems();
          resetForm();
        } else {
          // Domestic items - gọi updateInboundDomesticItem
          // console.log("Updating domestic item:", updated);
          const { updateInboundDomesticItem } =
            await import('../../services/googleSheets/inboundDomesticService');
          await updateInboundDomesticItem(updated.id, {
            date: updated.date,
            supplier: updated.supplier,
            origin: updated.origin,
            destination: updated.destination,
            product: updated.product,
            quantity: updated.quantity,
            status: updated.status,
            category: updated.category,
            carrier: updated.carrier,
            purpose: updated.purpose,
            receiveTime: updated.receiveTime,
            estimatedArrival: updated.estimatedArrival,
            actualArrival: updated.actualArrival || '',
            notes: updated.notes,
          });
          await reloadData();
          resetAllItems();
          resetForm();
        }
      } else {
        // Add new item → persist to Google Sheets via service
        const poNumbers = (formFields.poNumbersInput || '')
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);

        // removed yyyyMmDd; not needed for created date logic

        // date = ngày tạo lịch (thời điểm thao tác), độc lập với ngày nhập hàng
        const createdDate = new Date();
        const createdIso = createdDate.toLocaleDateString('vi-VN');

        const est =
          formFields.estimatedArrival ||
          (selectedDate ? selectedDate.toLocaleDateString('vi-VN') : '');
        const act = formFields.actualArrival || '';
        // scheduleDate chỉ dùng để đảm bảo milestone receive, không dùng set cột date
        // removed unused scheduleDate; only used within timeline ensure below

        // ensure Ngày nhập hàng milestone exists and filled
        const ensuredTimeline = (() => {
          const cloned = [...timelineItems];
          const idx = cloned.findIndex((t) => t.name === 'Ngày nhập hàng');
          if (idx >= 0) {
            cloned[idx] = {
              ...cloned[idx],
              estimatedDate: cloned[idx].estimatedDate || est,
              date: cloned[idx].date || act,
              status: cloned[idx].status || 'pending',
            } as (typeof cloned)[number];
          } else {
            cloned.push({
              id: `timeline_${Date.now()}`,
              name: 'Ngày nhập hàng',
              estimatedDate: est,
              date: act,
              status: 'pending',
              description: '',
            });
          }
          return cloned;
        })();

        const payload: InboundItem = {
          id: `INB-${Date.now()}`,
          date: createdIso,
          supplier: formFields.supplier,
          origin: formFields.origin,
          destination: formFields.destination,
          product: formFields.product,
          quantity: formFields.quantity,
          status: formFields.status as InboundItem['status'],
          estimatedArrival: est,
          actualArrival: act,
          type: detectItemType(formFields.origin), // Auto-detect dựa vào origin
          carrier: formFields.carrier,
          pi: formFields.pi,
          container: formFields.container,
          category: formFields.category,
          purpose: formFields.purpose,
          receiveTime: formFields.receiveTime,
          notes: formFields.notes,
          poNumbers,
          packagingItems, // placeholder to avoid TS error (reassigned below)
          timeline: ensuredTimeline.map((item) => {
            // Nếu có description mới, thêm vào history
            if (item.description && item.description.trim()) {
              return addTimelineDescription(item, item.description, getCurrentUser());
            }
            return item;
          }),
          documentStatus: documentStatusItems.map((item) => {
            // Nếu có description mới, thêm vào history
            if (item.description && item.description.trim()) {
              return addDocumentStatusDescription(item, item.description, getCurrentUser());
            }
            return item;
          }),
          packaging: packagingItems,
        } as unknown as InboundItem;

        // Handle add theo type
        if (payload.type === 'international') {
          await addInboundScheduleItem(payload);
          await reloadData();
          // Reset data sau khi save thành công để chuẩn bị cho lần thêm tiếp theo
          resetAllItems();
          resetForm();
        } else {
          // Domestic items - gọi addInboundDomesticItem
          // console.log("Adding domestic item:", payload);
          const { addInboundDomesticItem } =
            await import('../../services/googleSheets/inboundDomesticService');
          await addInboundDomesticItem({
            date: payload.date,
            supplier: payload.supplier,
            origin: payload.origin,
            destination: payload.destination,
            product: payload.product,
            quantity: payload.quantity,
            status: payload.status,
            category: payload.category,
            carrier: payload.carrier,
            purpose: payload.purpose,
            receiveTime: payload.receiveTime,
            estimatedArrival: payload.estimatedArrival,
            actualArrival: payload.actualArrival || '',
            notes: payload.notes,
          });
          await reloadData();
          resetAllItems();
          resetForm();
        }
      }
    } catch (error) {
      // console.error("Error saving item:", error);
    }
    closeDialog();
  };

  // Helper: Tính tổng số lượng thực tế từ packaging
  const getTotalQuantity = () => {
    return filteredItems.reduce((sum, item) => {
      // Tính từ packaging array nếu có (chính xác hơn)
      if (item.packaging && item.packaging.length > 0) {
        const packagingTotal = item.packaging.reduce((packSum, pack) => {
          const qty = parseInt(pack.quantity.toString()) || 0;
          return packSum + qty;
        }, 0);
        return sum + packagingTotal;
      }

      // Fallback về quantity field (ensure integer)
      const qty = parseInt(item.quantity?.toString() || '0') || 0;
      return sum + qty;
    }, 0);
  };

  // Helper: Thống kê Document Status
  const getDocumentStatusBreakdown = () => {
    const statusMap: Record<string, number> = {};

    filteredItems.forEach((item) => {
      if (item.documentStatus && item.documentStatus.length > 0) {
        item.documentStatus.forEach((doc) => {
          const status = doc.status || 'pending';
          statusMap[status] = (statusMap[status] || 0) + 1;
        });
      }
    });

    return Object.entries(statusMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);
  };

  // Helper: Breakdown delay theo từng loại chứng từ
  const getDocumentDelayBreakdownByType = () => {
    const docTypeMap: Record<string, Record<string, number>> = {};

    filteredItems.forEach((item) => {
      if (item.documentStatus && item.documentStatus.length > 0) {
        item.documentStatus.forEach((doc) => {
          const docName = doc.name || 'Không xác định';

          // Initialize document type if not exists
          if (!docTypeMap[docName]) {
            docTypeMap[docName] = {
              'Đúng hạn': 0,
              'Trước hạn': 0,
              'Trễ hạn': 0,
              'Chưa xác định': 0,
            };
          }

          // Calculate delay status
          if (!doc.estimatedDate || !doc.date) {
            docTypeMap[docName]['Chưa xác định'] += 1;
            return;
          }

          // Parse dates
          const parseDate = (dateStr: string): Date => {
            if (dateStr.includes('/')) {
              const [day, month, year] = dateStr.split('/');
              return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            }
            return new Date(dateStr);
          };

          const estimated = parseDate(doc.estimatedDate);
          const actual = parseDate(doc.date);

          if (estimated.getTime() === actual.getTime()) {
            docTypeMap[docName]['Đúng hạn'] += 1;
          } else if (actual < estimated) {
            docTypeMap[docName]['Trước hạn'] += 1;
          } else if (actual > estimated) {
            docTypeMap[docName]['Trễ hạn'] += 1;
          } else {
            docTypeMap[docName]['Chưa xác định'] += 1;
          }
        });
      }
    });

    // Convert to entries and sort by total count
    return Object.entries(docTypeMap)
      .map(([docName, delays]) => ({
        docName,
        delays,
        totalCount: Object.values(delays).reduce((sum, count) => sum + count, 0),
      }))
      .sort((a, b) => b.totalCount - a.totalCount)
      .slice(0, 5); // All 5 document types
  };

  // Helper: Timeline Delay Breakdown by Type
  const getTimelineDelayBreakdownByType = () => {
    const timelineTypeMap: Record<string, Record<string, number>> = {};

    filteredItems.forEach((item) => {
      if (item.timeline && item.timeline.length > 0) {
        item.timeline.forEach((timeline) => {
          const timelineName = timeline.name || 'Không xác định';

          // Initialize timeline type if not exists
          if (!timelineTypeMap[timelineName]) {
            timelineTypeMap[timelineName] = {
              'Đúng hạn': 0,
              'Trước hạn': 0,
              'Trễ hạn': 0,
              'Chưa xác định': 0,
            };
          }

          // Calculate delay status
          if (!timeline.estimatedDate || !timeline.date) {
            timelineTypeMap[timelineName]['Chưa xác định'] += 1;
            return;
          }

          // Parse dates
          const parseDate = (dateStr: string): Date => {
            if (dateStr.includes('/')) {
              const [day, month, year] = dateStr.split('/');
              return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            }
            return new Date(dateStr);
          };

          const estimated = parseDate(timeline.estimatedDate);
          const actual = parseDate(timeline.date);

          if (estimated.getTime() === actual.getTime()) {
            timelineTypeMap[timelineName]['Đúng hạn'] += 1;
          } else if (actual.getTime() < estimated.getTime()) {
            timelineTypeMap[timelineName]['Trước hạn'] += 1;
          } else {
            timelineTypeMap[timelineName]['Trễ hạn'] += 1;
          }
        });
      }
    });

    // Thứ tự cố định cho 6 mốc thời gian (bỏ "Ngày tạo phiếu")
    const timelineOrder = [
      'Cargo Ready',
      'ETD',
      'ETA',
      'Ngày hàng đi',
      'Ngày hàng về cảng',
      'Ngày nhận hàng',
    ];

    // Convert to entries và sắp xếp theo thứ tự cố định
    return timelineOrder
      .map((timelineName) => ({
        timelineName,
        delays: timelineTypeMap[timelineName] || {
          'Đúng hạn': 0,
          'Trước hạn': 0,
          'Trễ hạn': 0,
          'Chưa xác định': 0,
        },
        totalCount: timelineTypeMap[timelineName]
          ? Object.values(timelineTypeMap[timelineName]).reduce((sum, count) => sum + count, 0)
          : 0,
      }))
      .filter((item) => item.totalCount > 0); // Chỉ hiển thị những mốc có dữ liệu
  };

  // Helper: Đếm số nhà cung cấp unique
  const getUniqueSuppliers = () => {
    const supplierSet = new Set();
    filteredItems.forEach((item) => {
      if (item.supplier) {
        supplierSet.add(item.supplier);
      }
    });
    return supplierSet.size;
  };

  // Helper: Date filtering functions
  const getDateRange = (filterType: string): { start: Date; end: Date } | null => {
    const today = new Date();
    const startOfDay = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    switch (filterType) {
      case 'today':
        return { start: startOfDay(today), end: endOfDay(today) };

      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
      }

      case 'thisWeek': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return { start: startOfDay(startOfWeek), end: endOfDay(today) };
      }

      case 'lastWeek': {
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        return {
          start: startOfDay(startOfLastWeek),
          end: endOfDay(endOfLastWeek),
        };
      }

      case 'thisMonth': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start: startOfMonth, end: endOfDay(today) };
      }

      case 'lastMonth': {
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return { start: startOfLastMonth, end: endOfDay(endOfLastMonth) };
      }

      case 'thisYear': {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        return { start: startOfYear, end: endOfDay(today) };
      }

      case 'lastYear': {
        const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
        return { start: startOfLastYear, end: endOfDay(endOfLastYear) };
      }

      default:
        return null;
    }
  };

  const isDateInRange = (
    itemDate: string,
    dateRange: { start: Date; end: Date } | null
  ): boolean => {
    if (!dateRange || !itemDate) return true;

    // Parse item date
    const parseDate = (dateStr: string): Date => {
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      return new Date(dateStr);
    };

    const itemDateParsed = parseDate(itemDate);
    return itemDateParsed >= dateRange.start && itemDateParsed <= dateRange.end;
  };

  // Helper: Đếm online/offline với tổng sản phẩm
  const getOnlineOfflineCount = () => {
    const onlineItems = filteredItems.filter((item) => item.purpose === 'online');
    const offlineItems = filteredItems.filter((item) => item.purpose === 'offline');

    const onlineCount = onlineItems.length;
    const offlineCount = offlineItems.length;

    const onlineQuantity = onlineItems.reduce((sum, item) => {
      // Tính từ packaging array nếu có (giống getTotalQuantity)
      if (item.packaging && item.packaging.length > 0) {
        const packagingTotal = item.packaging.reduce((packSum, pack) => {
          const qty = parseInt(pack.quantity.toString()) || 0;
          return packSum + qty;
        }, 0);
        return sum + packagingTotal;
      }
      // Fallback to item quantity nếu không có packaging
      return sum + (parseInt(item.quantity?.toString() || '0') || 0);
    }, 0);

    const offlineQuantity = offlineItems.reduce((sum, item) => {
      // Tính từ packaging array nếu có (giống getTotalQuantity)
      if (item.packaging && item.packaging.length > 0) {
        const packagingTotal = item.packaging.reduce((packSum, pack) => {
          const qty = parseInt(pack.quantity.toString()) || 0;
          return packSum + qty;
        }, 0);
        return sum + packagingTotal;
      }
      // Fallback to item quantity nếu không có packaging
      return sum + (parseInt(item.quantity?.toString() || '0') || 0);
    }, 0);

    return {
      online: onlineCount,
      offline: offlineCount,
      onlineQuantity,
      offlineQuantity,
    };
  };

  // Helper: Breakdown quy cách đóng gói (packaging types)
  const getPackagingBreakdown = () => {
    const packagingMap: Record<string, number> = {};

    filteredItems.forEach((item) => {
      if (item.packaging && item.packaging.length > 0) {
        item.packaging.forEach((pack) => {
          const packType = pack.type || 'N/A';
          const quantity = parseInt(pack.quantity.toString()) || 0;
          packagingMap[packType] = (packagingMap[packType] || 0) + quantity;
        });
      }
    });

    // Sắp xếp theo số lượng giảm dần
    return Object.entries(packagingMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // All 5 packaging types
  };

  // Helper: Tính tổng số SET từ packaging
  const getTotalSets = () => {
    return filteredItems.reduce((sum, item) => {
      if (item.packaging && item.packaging.length > 0) {
        const packagingTotal = item.packaging.reduce((packSum, pack) => {
          const quantity = parseInt(pack.quantity.toString()) || 0;
          return packSum + quantity;
        }, 0);
        return sum + packagingTotal;
      }
      return sum;
    }, 0);
  };

  // Helper: Breakdown sản phẩm theo phân loại chuẩn từ hệ thống
  const getProductBreakdown = () => {
    const categoryMap: Record<string, number> = {};

    filteredItems.forEach((item) => {
      // Ưu tiên category trước, không dùng product name cụ thể
      const category = item.category || 'Khác';

      // Tính tổng quantity của item này
      if (item.packaging && item.packaging.length > 0) {
        const totalPackagingQty = item.packaging.reduce((sum, pack) => {
          return sum + (parseInt(pack.quantity.toString()) || 0);
        }, 0);
        categoryMap[category] = (categoryMap[category] || 0) + totalPackagingQty;
      } else {
        const qty = parseInt(item.quantity?.toString() || '0') || 0;
        categoryMap[category] = (categoryMap[category] || 0) + qty;
      }
    });

    // Sắp xếp theo số lượng giảm dần
    return Object.entries(categoryMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4); // Top 4 phân loại
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
        <Typography variant="h4" component="h1" gutterBottom>
          Lịch nhập hàng Tổng hợp
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<ScheduleIcon />} onClick={reloadData}>
            Làm mới
          </Button>
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

      {/* Tabs - Centered */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="inbound tabs"
            centered
          >
            <Tab
              label={`Tất cả (${inboundItems.length})`}
              value="all"
              icon={<TrendingUpIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Quốc tế (${inboundItems.filter((item) => item.type === 'international').length})`}
              value="international"
              icon={<FlightIcon />}
              iconPosition="start"
            />
            <Tab
              label={`Quốc nội (${inboundItems.filter((item) => item.type === 'domestic').length})`}
              value="domestic"
              icon={<HomeIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Box>

      {/* Bộ lọc */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            alignSelf: 'center',
            minWidth: 60,
          }}
        >
          🔍 Lọc:
        </Typography>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Kho nhận</InputLabel>
          <Select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            label="Kho nhận"
          >
            <MenuItem value="all">Tất cả kho</MenuItem>
            {destinations.map((dest) => (
              <MenuItem key={dest} value={dest}>
                {dest.length > 50 ? dest.substring(0, 50) + '...' : dest}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            label="Trạng thái"
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="pending">🟡 Chờ xử lý</MenuItem>
            <MenuItem value="confirmed">🟣 Đã xác nhận</MenuItem>
            <MenuItem value="in-transit">🔵 Đang vận chuyển</MenuItem>
            <MenuItem value="arrived">🟢 Đã đến</MenuItem>
            <MenuItem value="completed">🟢 Hoàn thành</MenuItem>
            <MenuItem value="cancelled">🔴 Đã hủy</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Lọc nhanh</InputLabel>
          <Select
            value={quickDateFilter}
            onChange={(e) => {
              setQuickDateFilter(e.target.value);
              // Reset custom date khi chọn quick filter
              if (e.target.value !== 'all') {
                setCustomDateFrom('');
                setCustomDateTo('');
              }
            }}
            label="Lọc nhanh"
          >
            <MenuItem value="all">Tất cả thời gian</MenuItem>
            <MenuItem value="today">Hôm nay</MenuItem>
            <MenuItem value="yesterday">Hôm qua</MenuItem>
            <MenuItem value="thisWeek">Tuần này</MenuItem>
            <MenuItem value="lastWeek">Tuần trước</MenuItem>
            <MenuItem value="thisMonth">Tháng này</MenuItem>
            <MenuItem value="lastMonth">Tháng trước</MenuItem>
            <MenuItem value="thisYear">Năm này</MenuItem>
            <MenuItem value="lastYear">Năm trước</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Từ ngày"
          type="date"
          size="small"
          value={customDateFrom}
          onChange={(e) => {
            setCustomDateFrom(e.target.value);
            // Reset quick filter khi chọn custom date
            if (e.target.value) {
              setQuickDateFilter('all');
            }
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ minWidth: 140 }}
        />

        <TextField
          label="Đến ngày"
          type="date"
          size="small"
          value={customDateTo}
          onChange={(e) => {
            setCustomDateTo(e.target.value);
            // Reset quick filter khi chọn custom date
            if (e.target.value) {
              setQuickDateFilter('all');
            }
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ minWidth: 140 }}
        />

        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            setSelectedDestination('all');
            setSelectedStatus('all');
            setQuickDateFilter('all');
            setCustomDateFrom('');
            setCustomDateTo('');
          }}
          sx={{ minWidth: 100 }}
        >
          Đặt lại
        </Button>

        {/* Filter indicators */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {selectedDestination !== 'all' && (
            <Chip
              label={`📍 ${selectedDestination.substring(0, 30)}${selectedDestination.length > 30 ? '...' : ''}`}
              size="small"
              color="primary"
              variant="outlined"
              onDelete={() => setSelectedDestination('all')}
              sx={{ fontSize: '0.7rem' }}
            />
          )}
          {selectedStatus !== 'all' && (
            <Chip
              label={`🔄 ${selectedStatus}`}
              size="small"
              color="secondary"
              variant="outlined"
              onDelete={() => setSelectedStatus('all')}
              sx={{ fontSize: '0.7rem' }}
            />
          )}
          {quickDateFilter !== 'all' && (
            <Chip
              label={`📅 ${(() => {
                switch (quickDateFilter) {
                  case 'today':
                    return 'Hôm nay';
                  case 'yesterday':
                    return 'Hôm qua';
                  case 'thisWeek':
                    return 'Tuần này';
                  case 'lastWeek':
                    return 'Tuần trước';
                  case 'thisMonth':
                    return 'Tháng này';
                  case 'lastMonth':
                    return 'Tháng trước';
                  case 'thisYear':
                    return 'Năm này';
                  case 'lastYear':
                    return 'Năm trước';
                  default:
                    return quickDateFilter;
                }
              })()}`}
              size="small"
              color="info"
              variant="outlined"
              onDelete={() => setQuickDateFilter('all')}
              sx={{ fontSize: '0.7rem' }}
            />
          )}
          {customDateFrom && customDateTo && (
            <Chip
              label={`📅 ${customDateFrom} → ${customDateTo}`}
              size="small"
              color="info"
              variant="outlined"
              onDelete={() => {
                setCustomDateFrom('');
                setCustomDateTo('');
              }}
              sx={{ fontSize: '0.7rem' }}
            />
          )}
          {(selectedDestination !== 'all' ||
            selectedStatus !== 'all' ||
            quickDateFilter !== 'all' ||
            (customDateFrom && customDateTo)) && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Lọc: {filteredItems.length}/{inboundItems.length} items
            </Typography>
          )}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3, minHeight: 200 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ position: 'relative', overflow: 'visible', height: '100%' }}>
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 180,
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <InventoryIcon sx={{ fontSize: 42, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 700,
                      fontSize: '1.8rem',
                    }}
                  >
                    {filteredItems.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    Tổng lô hàng
                  </Typography>
                </Box>
              </Box>

              {/* Breakdown International vs Domestic + Logistics */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  minHeight: 100,
                }}
              >
                {/* Type breakdown */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`🌍 ${inboundItems.filter((item) => item.type === 'international').length} Quốc tế`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      height: 20,
                      '& .MuiChip-label': { px: 0.75, fontSize: '0.6rem' },
                    }}
                  />
                  <Chip
                    label={`🏠 ${inboundItems.filter((item) => item.type === 'domestic').length} Quốc nội`}
                    size="small"
                    color="secondary"
                    variant="outlined"
                    sx={{
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      height: 20,
                      '& .MuiChip-label': { px: 0.75, fontSize: '0.6rem' },
                    }}
                  />
                </Box>

                {/* Logistics summary */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    py: 0.5,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {/* Standardized metrics for all tabs */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.55rem',
                      fontWeight: 500,
                      textAlign: 'center',
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    🚢{' '}
                    {filteredItems.reduce(
                      (sum, item) => sum + (parseInt(item.container?.toString() || '0') || 0),
                      0
                    )}{' '}
                    Containers
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.55rem',
                      fontWeight: 500,
                      textAlign: 'center',
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    📦 {getTotalSets().toLocaleString()} SET
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.55rem',
                      fontWeight: 500,
                      textAlign: 'center',
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    🏢 {getUniqueSuppliers()} NCC
                  </Typography>
                </Box>

                {/* Packaging Details */}
                {getPackagingBreakdown().length > 0 ? (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: 'primary.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'primary.200',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      minHeight: 60,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      📋 Quy cách đóng gói:
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.3,
                        mt: 0.5,
                      }}
                    >
                      {getPackagingBreakdown()
                        .slice(0, 5)
                        .map(([packType, quantity]) => (
                          <Box
                            key={packType}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.55rem',
                                color: 'text.secondary',
                                fontWeight: 500,
                              }}
                            >
                              📦 {packType}:
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.55rem',
                                fontWeight: 700,
                                color: 'primary.main',
                              }}
                            >
                              {quantity.toLocaleString()} SET
                            </Typography>
                          </Box>
                        ))}

                      {getPackagingBreakdown().length > 5 && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.55rem',
                            color: 'text.secondary',
                            textAlign: 'center',
                            mt: 0.5,
                          }}
                        >
                          +{getPackagingBreakdown().length - 5} loại khác
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      minHeight: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.6rem',
                        fontStyle: 'italic',
                        textAlign: 'center',
                      }}
                    >
                      Chưa có thông tin quy cách đóng gói
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 180,
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ fontSize: 42, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      color: 'info.main',
                      fontWeight: 700,
                      fontSize: '1.8rem',
                    }}
                  >
                    {filteredItems.reduce((sum, item) => sum + (item.timeline?.length || 0), 0)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    Timeline vận chuyển
                  </Typography>
                </Box>
              </Box>

              {/* Clean Timeline Analytics */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  minHeight: 100,
                }}
              >
                {(() => {
                  const timelineDelayBreakdown = getTimelineDelayBreakdownByType();

                  return timelineDelayBreakdown.length === 0 ? (
                    <Box sx={{ flexGrow: 1, py: 1, minHeight: 100 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: '0.7rem',
                          textAlign: 'center',
                          fontStyle: 'italic',
                          display: 'block',
                          mb: 2,
                        }}
                      >
                        {activeTab === 'domestic'
                          ? 'Quốc nội có timeline đơn giản'
                          : 'Chưa có timeline'}
                      </Typography>

                      {/* Placeholder content để giữ kích thước card */}
                      {activeTab === 'domestic' && (
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontSize: '0.65rem',
                              display: 'block',
                              mb: 0.5,
                            }}
                          >
                            📦 Cargo Ready: Hàng sẵn sàng
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              fontSize: '0.65rem',
                              display: 'block',
                              mb: 0.5,
                            }}
                          >
                            🚚 Vận chuyển nội địa đơn giản
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.65rem', display: 'block' }}
                          >
                            ✅ Nhận hàng tại kho đích
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <>
                      {/* Overall Summary */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: 0.3,
                          py: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: '0.55rem', textAlign: 'center' }}
                        >
                          ✅{' '}
                          {timelineDelayBreakdown.reduce(
                            (sum, t) => sum + (t.delays['Đúng hạn'] || 0),
                            0
                          )}{' '}
                          Hoàn thành
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: '0.55rem', textAlign: 'center' }}
                        >
                          🔄{' '}
                          {timelineDelayBreakdown.reduce(
                            (sum, t) => sum + (t.delays['Trước hạn'] || 0),
                            0
                          )}{' '}
                          Đang xử lý
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: '0.55rem', textAlign: 'center' }}
                        >
                          ⏳{' '}
                          {timelineDelayBreakdown.reduce(
                            (sum, t) => sum + (t.delays['Chưa xác định'] || 0),
                            0
                          )}{' '}
                          Đang chờ
                        </Typography>
                      </Box>

                      {/* Simple Table-style Breakdown */}
                      {timelineDelayBreakdown.length > 0 && (
                        <Box
                          sx={{
                            mt: 0.5,
                            p: 1,
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            minHeight: 60,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '0.6rem',
                              fontWeight: 600,
                              color: 'text.primary',
                              mb: 0.3,
                              display: 'block',
                            }}
                          >
                            📊 Tiến độ timeline
                          </Typography>

                          {/* Clean Grid Layout */}
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 0.3,
                            }}
                          >
                            {timelineDelayBreakdown.map(({ timelineName, delays }) => (
                              <Box
                                key={timelineName}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  py: 0.1,
                                  px: 0.3,
                                  borderRadius: 0.5,
                                  bgcolor: 'white',
                                  border: '1px solid #e0e0e0',
                                  minHeight: '18px',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.6rem',
                                    fontWeight: 500,
                                    color: 'text.secondary',
                                    flex: 1,
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {(() => {
                                    // Hiển thị đúng 6 mốc thời gian theo thứ tự
                                    switch (timelineName) {
                                      case 'Cargo Ready':
                                        return 'Cargo Ready';
                                      case 'ETD':
                                        return 'ETD';
                                      case 'ETA':
                                        return 'ETA';
                                      case 'Ngày hàng đi':
                                        return 'Ngày hàng đi';
                                      case 'Ngày hàng về cảng':
                                        return 'Ngày hàng về cảng';
                                      case 'Ngày nhận hàng':
                                        return 'Ngày nhận hàng';
                                      default:
                                        return timelineName.length > 12
                                          ? timelineName.substring(0, 12) + '...'
                                          : timelineName;
                                    }
                                  })()}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 0.3 }}>
                                  {['Đúng hạn', 'Trước hạn', 'Trễ hạn', 'Chưa xác định'].map(
                                    (delayType) => {
                                      const count = delays[delayType] || 0;
                                      if (count === 0) return null;

                                      return (
                                        <Tooltip
                                          key={delayType}
                                          title={(() => {
                                            switch (delayType) {
                                              case 'Đúng hạn':
                                                return 'Hoàn thành đúng ngày dự kiến';
                                              case 'Trước hạn':
                                                return 'Hoàn thành sớm hơn dự kiến';
                                              case 'Trễ hạn':
                                                return 'Hoàn thành trễ hơn dự kiến';
                                              case 'Chưa xác định':
                                                return 'Thiếu thông tin ngày dự kiến hoặc thực tế';
                                              default:
                                                return delayType;
                                            }
                                          })()}
                                          placement="top"
                                          arrow
                                        >
                                          <Box
                                            sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: 0.1,
                                              px: 0.3,
                                              py: 0.1,
                                              bgcolor: (() => {
                                                switch (delayType) {
                                                  case 'Đúng hạn':
                                                    return 'success.100';
                                                  case 'Trước hạn':
                                                    return 'info.100';
                                                  case 'Trễ hạn':
                                                    return 'error.100';
                                                  case 'Chưa xác định':
                                                    return 'warning.100';
                                                  default:
                                                    return 'grey.200';
                                                }
                                              })(),
                                              borderRadius: 0.5,
                                              cursor: 'help',
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: '0.6rem',
                                                textAlign: 'center',
                                              }}
                                            >
                                              {(() => {
                                                switch (delayType) {
                                                  case 'Đúng hạn':
                                                    return '✅';
                                                  case 'Trước hạn':
                                                    return '⚡';
                                                  case 'Trễ hạn':
                                                    return '🚨';
                                                  case 'Chưa xác định':
                                                    return '❓';
                                                  default:
                                                    return '?';
                                                }
                                              })()}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: '0.55rem',
                                                fontWeight: 700,
                                                color: 'text.primary',
                                              }}
                                            >
                                              {count}
                                            </Typography>
                                          </Box>
                                        </Tooltip>
                                      );
                                    }
                                  )}
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </>
                  );
                })()}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 180,
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DocumentIcon sx={{ fontSize: 42, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      color: 'success.main',
                      fontWeight: 700,
                      fontSize: '1.8rem',
                    }}
                  >
                    {filteredItems.reduce(
                      (sum, item) => sum + (item.documentStatus?.length || 0),
                      0
                    )}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    Chứng từ
                  </Typography>
                </Box>
              </Box>

              {/* Clean Document Analytics */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  minHeight: 100,
                }}
              >
                {getDocumentStatusBreakdown().length === 0 ? (
                  <Box sx={{ flexGrow: 1, py: 1, minHeight: 100 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.7rem',
                        textAlign: 'center',
                        fontStyle: 'italic',
                        display: 'block',
                        mb: 2,
                      }}
                    >
                      {activeTab === 'domestic'
                        ? 'Quốc nội không cần chứng từ'
                        : 'Chưa có chứng từ'}
                    </Typography>

                    {/* Placeholder content để giữ kích thước card */}
                    {activeTab === 'domestic' && (
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: '0.65rem',
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          📋 Lô hàng quốc nội được xử lý đơn giản hơn
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: '0.65rem',
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          🚚 Không yêu cầu chứng từ hải quan
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: '0.65rem', display: 'block' }}
                        >
                          ✅ Quy trình nhanh chóng và thuận tiện
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <>
                    {/* Overall Summary */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 0.5,
                        py: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.55rem', textAlign: 'center' }}
                      >
                        ✅{' '}
                        {getDocumentStatusBreakdown().find(
                          ([status]) => status === 'completed'
                        )?.[1] || 0}{' '}
                        Hoàn thành
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.55rem', textAlign: 'center' }}
                      >
                        🔄{' '}
                        {getDocumentStatusBreakdown().find(
                          ([status]) => status === 'in_progress'
                        )?.[1] || 0}{' '}
                        Đang xử lý
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.55rem', textAlign: 'center' }}
                      >
                        ⏳{' '}
                        {getDocumentStatusBreakdown().find(
                          ([status]) => status === 'pending'
                        )?.[1] || 0}{' '}
                        Đang chờ
                      </Typography>
                    </Box>

                    {/* Simple Table-style Breakdown */}
                    {getDocumentDelayBreakdownByType().length > 0 && (
                      <Box
                        sx={{
                          mt: 0.5,
                          p: 1,
                          bgcolor: 'grey.50',
                          borderRadius: 1,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          minHeight: 60,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.6rem',
                            fontWeight: 600,
                            color: 'text.primary',
                            mb: 0.3,
                            display: 'block',
                          }}
                        >
                          📊 Tiến độ chứng từ
                        </Typography>

                        {/* Clean Grid Layout */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.3,
                          }}
                        >
                          {getDocumentDelayBreakdownByType()
                            .slice(0, 5)
                            .map(({ docName, delays }) => (
                              <Box
                                key={docName}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  py: 0.1,
                                  px: 0.3,
                                  borderRadius: 0.5,
                                  bgcolor: 'white',
                                  border: '1px solid #e0e0e0',
                                  minHeight: '18px',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.6rem',
                                    fontWeight: 500,
                                    color: 'text.secondary',
                                    flex: 1,
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {(() => {
                                    // Viết tắt document names cho gọn
                                    switch (docName) {
                                      case 'TQ Gửi chứng từ đi':
                                        return 'Gửi chứng từ';
                                      case 'Lên tờ khai hải quan':
                                        return 'Tờ khai HQ';
                                      case 'Đóng thuế':
                                        return 'Đóng thuế';
                                      case 'Check bill':
                                        return 'Check bill';
                                      case 'Check CO':
                                        return 'Check CO';
                                      default:
                                        return docName.length > 12
                                          ? docName.substring(0, 12) + '...'
                                          : docName;
                                    }
                                  })()}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 0.3 }}>
                                  {['Đúng hạn', 'Trước hạn', 'Trễ hạn', 'Chưa xác định'].map(
                                    (delayType) => {
                                      const count = delays[delayType] || 0;
                                      if (count === 0) return null;

                                      return (
                                        <Tooltip
                                          key={delayType}
                                          title={(() => {
                                            switch (delayType) {
                                              case 'Đúng hạn':
                                                return 'Hoàn thành đúng ngày dự kiến';
                                              case 'Trước hạn':
                                                return 'Hoàn thành sớm hơn dự kiến';
                                              case 'Trễ hạn':
                                                return 'Hoàn thành trễ hơn dự kiến';
                                              default:
                                                return 'Thiếu thông tin ngày dự kiến hoặc thực tế';
                                            }
                                          })()}
                                          placement="top"
                                          arrow
                                        >
                                          <Box
                                            sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: 0.1,
                                              px: 0.3,
                                              py: 0.1,
                                              bgcolor: (() => {
                                                switch (delayType) {
                                                  case 'Đúng hạn':
                                                    return 'success.100';
                                                  case 'Trước hạn':
                                                    return 'info.100';
                                                  case 'Trễ hạn':
                                                    return 'error.100';
                                                  default:
                                                    return 'grey.200';
                                                }
                                              })(),
                                              borderRadius: 0.5,
                                              cursor: 'help',
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: '0.6rem',
                                                textAlign: 'center',
                                              }}
                                            >
                                              {(() => {
                                                switch (delayType) {
                                                  case 'Đúng hạn':
                                                    return '✅';
                                                  case 'Trước hạn':
                                                    return '⚡';
                                                  case 'Trễ hạn':
                                                    return '🚨';
                                                  default:
                                                    return '❓';
                                                }
                                              })()}
                                            </Typography>
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontSize: '0.55rem',
                                                fontWeight: 700,
                                                color: 'text.primary',
                                              }}
                                            >
                                              {count}
                                            </Typography>
                                          </Box>
                                        </Tooltip>
                                      );
                                    }
                                  )}
                                </Box>
                              </Box>
                            ))}
                        </Box>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 180,
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ProductIcon sx={{ fontSize: 42, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      color: 'warning.main',
                      fontWeight: 700,
                      fontSize: '1.8rem',
                    }}
                  >
                    {getTotalQuantity().toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    Tổng sản phẩm
                  </Typography>
                </Box>
              </Box>

              {/* Online/Offline Summary */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  py: 0.5,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {(() => {
                  const { online, offline, onlineQuantity, offlineQuantity } =
                    getOnlineOfflineCount();

                  // Debug: Log để kiểm tra dữ liệu
                  // console.log(
                  //   "Purpose values:",
                  //   filteredItems.map((item) => ({
                  //     id: item.id,
                  //     purpose: item.purpose,
                  //   }))
                  // );
                  // console.log("Online/Offline counts:", {
                  //   online,
                  //   offline,
                  //   onlineQuantity,
                  //   offlineQuantity,
                  // });

                  return (
                    <>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: '0.55rem',
                          fontWeight: 500,
                          textAlign: 'center',
                          flex: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        🌐 {online} Online ({onlineQuantity.toLocaleString()})
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: '0.55rem',
                          fontWeight: 500,
                          textAlign: 'center',
                          flex: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        📱 {offline} Offline ({offlineQuantity.toLocaleString()})
                      </Typography>
                    </>
                  );
                })()}
              </Box>

              {/* Product Categories Breakdown */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  minHeight: 100,
                }}
              >
                {getProductBreakdown().length === 0 ? (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.7rem',
                      textAlign: 'center',
                      fontStyle: 'italic',
                      py: 1,
                    }}
                  >
                    Chưa có dữ liệu sản phẩm
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 1,
                      justifyContent: 'center',
                    }}
                  >
                    {getProductBreakdown().map(([category, quantity]) => (
                      <Box
                        key={category}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 1,
                          bgcolor: 'warning.50',
                          borderRadius: 1,
                          minWidth: 60,
                          border: '1px solid',
                          borderColor: 'warning.200',
                        }}
                      >
                        <Typography sx={{ fontSize: '1.2rem', mb: 0.5 }}>
                          {(() => {
                            // Map theo phân loại chuẩn từ hệ thống
                            switch (category) {
                              case 'Balo':
                                return '🎒';
                              case 'Vali':
                                return '🧳';
                              case 'Quà tặng':
                                return '🎁';
                              case 'Phụ kiện':
                                return '🔧';
                              case 'Phụ kiện sửa chữa':
                                return '⚙️';
                              case 'Nguyên vật liệu':
                                return '🧱';
                              case 'Thùng giấy':
                                return '📦';
                              case 'Văn phòng phẩm':
                                return '📝';
                              default:
                                return '📋'; // Default cho categories khác
                            }
                          })()}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            color: 'warning.main',
                            textAlign: 'center',
                            lineHeight: 1,
                          }}
                        >
                          {quantity.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            fontSize: '0.6rem',
                            textAlign: 'center',
                            mt: 0.3,
                            lineHeight: 1,
                          }}
                        >
                          {category}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 5 - Warehouse Breakdown */}
        <Grid item xs={12}>
          <Card sx={{ height: '100%' }}>
            <CardContent
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 180,
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationIcon sx={{ fontSize: 42, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      color: 'info.main',
                      fontWeight: 700,
                      fontSize: '1.8rem',
                    }}
                  >
                    {destinations.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 600, fontSize: '0.8rem' }}
                  >
                    Kho nhận hàng
                  </Typography>
                </Box>
              </Box>

              {/* Summary Metrics */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.5,
                  py: 0.5,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.55rem',
                    fontWeight: 500,
                    textAlign: 'center',
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  🚚 {filteredItems.length} Lô giao
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.55rem',
                    fontWeight: 500,
                    textAlign: 'center',
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  📦 {getTotalSets().toLocaleString()} SET
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.55rem',
                    fontWeight: 500,
                    textAlign: 'center',
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  🚢{' '}
                  {filteredItems.reduce(
                    (sum, item) => sum + (parseInt(item.container?.toString() || '0') || 0),
                    0
                  )}{' '}
                  Containers
                </Typography>
              </Box>

              {/* Warehouse Details */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  minHeight: 100,
                }}
              >
                {destinations.length > 0 ? (
                  <Box
                    sx={{
                      mt: 0.5,
                      p: 1,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      minHeight: 60,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0.3,
                        display: 'block',
                      }}
                    >
                      📊 Top kho nhận hàng
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.3,
                      }}
                    >
                      {destinations.slice(0, 3).map((dest) => {
                        const count = filteredItems.filter(
                          (item) => item.destination === dest
                        ).length;
                        const percentage =
                          filteredItems.length > 0
                            ? ((count / filteredItems.length) * 100).toFixed(1)
                            : 0;

                        return (
                          <Box
                            key={dest}
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              py: 0.1,
                              px: 0.3,
                              borderRadius: 0.5,
                              bgcolor: 'white',
                              border: '1px solid #e0e0e0',
                              minHeight: '18px',
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.6rem',
                                fontWeight: 500,
                                color: 'text.secondary',
                                flex: 1,
                                lineHeight: 1.2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              📍 {dest.length > 25 ? dest.substring(0, 25) + '...' : dest}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 0.3,
                                alignItems: 'center',
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontSize: '0.55rem',
                                  color: 'text.secondary',
                                  fontWeight: 500,
                                }}
                              >
                                {percentage}%
                              </Typography>
                              <Chip
                                label={count}
                                size="small"
                                color="info"
                                variant="filled"
                                sx={{
                                  fontSize: '0.55rem',
                                  height: 16,
                                  minWidth: 30,
                                  '& .MuiChip-label': {
                                    px: 0.4,
                                    fontWeight: 700,
                                  },
                                }}
                              />
                            </Box>
                          </Box>
                        );
                      })}

                      {destinations.length > 3 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            textAlign: 'center',
                            mt: 0.5,
                            fontSize: '0.55rem',
                            fontStyle: 'italic',
                          }}
                        >
                          +{destinations.length - 3} kho khác
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      minHeight: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: '0.6rem',
                        fontStyle: 'italic',
                        textAlign: 'center',
                      }}
                    >
                      Chưa có thông tin kho nhận hàng
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Content */}
      {loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Đang tải dữ liệu...
          </Typography>
        </Paper>
      ) : error ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Vui lòng kiểm tra kết nối và thử lại
          </Typography>
        </Paper>
      ) : viewMode === 'table' ? (
        <TableView
          items={filteredItems}
          onAction={handleActionMenuAction}
          showAddCalendar={false}
        />
      ) : (
        <CalendarView
          items={filteredItems}
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateClick={(date: Date) => {
            const itemsForDate = filteredItems.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate.toDateString() === date.toDateString();
            });
            setSelectedDate(date);
            setSelectedDateItems(itemsForDate);
          }}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onCalendarMenuOpen={(event, date) => {
            // Find items for this date
            const dateItems = filteredItems.filter((item) => {
              const itemDate = new Date(item.date);
              return itemDate.toDateString() === date.toDateString();
            });

            // Always allow add-from-day action (no items required)
            setSelectedDate(date);
            setSelectedDateItems(dateItems);
            setSelectedItemForAction(null);
            setDayMenuAnchor(event.currentTarget);
          }}
          onItemMenuOpen={(event, item) => {
            setSelectedItemForAction(item);
            setActionMenuAnchor(event.currentTarget);
          }}
        />
      )}

      {viewMode === 'calendar' && selectedDate && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Chi tiết ngày {selectedDate.toLocaleDateString('vi-VN')}
          </Typography>
          <Grid container spacing={1}>
            {filteredItems
              .filter((item) => {
                // Sử dụng logic giống CalendarView để hiển thị đúng ngày
                const receiveDate = item.actualArrival || item.estimatedArrival || item.date;

                let parsedDate: Date;
                if (receiveDate.includes('/')) {
                  // Handle dd/MM/yyyy format
                  const [day, month, year] = receiveDate.split('/');
                  parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                } else {
                  // Handle yyyy-MM-dd format
                  parsedDate = new Date(receiveDate);
                }

                return parsedDate.toDateString() === selectedDate.toDateString();
              })
              .map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
                  <Card>
                    <CardContent>
                      <InboundDetailCard item={item} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Paper>
      )}

      {/* Speed Dial - Thêm lịch với dropdown */}
      <SpeedDial
        ariaLabel="SpeedDial thêm lịch"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<AddIcon />}
        direction="up"
      >
        <SpeedDialAction
          icon={<InternationalIcon />}
          tooltipTitle="Thêm lịch Quốc tế"
          onClick={handleAddInternational}
        />
        <SpeedDialAction
          icon={<DomesticIcon />}
          tooltipTitle="Thêm lịch Quốc nội"
          onClick={handleAddDomestic}
        />
      </SpeedDial>

      {/* Add/Edit Dialog */}
      <AddEditDialog
        open={openDialog}
        onClose={closeDialog}
        editingItem={editingItem}
        onSave={handleSave}
        addFromCalendar={selectedDate}
        formFields={formFields}
        onFieldChange={setField}
        packagingItems={packagingItems}
        timelineItems={timelineItems}
        documentStatusItems={documentStatusItems}
        onAddPackagingItem={addPackagingItem}
        onDeletePackagingItem={deletePackagingItem}
        onAddTimelineItem={addTimelineItem}
        onUpdateTimelineItem={updateTimelineItemFull}
        onDeleteTimelineItem={deleteTimelineItem}
        onAddDocumentStatusItem={addDocumentStatusItem}
        onUpdateDocumentStatusItem={updateDocumentStatusItemFull}
        onDeleteDocumentStatusItem={deleteDocumentStatusItem}
        newPackagingItem={newPackagingItem}
        newTimelineItem={newTimelineItem}
        newDocumentStatusItem={newDocumentStatusItem}
        onNewPackagingItemChange={setNewPackagingItemField}
        onNewTimelineItemChange={setNewTimelineItemField}
        onNewDocumentStatusItemChange={setNewDocumentStatusItemField}
        productCategories={[
          'Vali',
          'Balo',
          'Quà tặng',
          'Phụ kiện',
          'Phụ kiện sửa chữa',
          'Nguyên vật liệu',
          'Thùng giấy',
          'Văn phòng phẩm',
          'Thiết bị văn phòng',
        ]}
        destinations={[
          'Kho trung tâm - lô2-5, Đường CN1, Phường Tây Thạnh, Quận Tân Phú, Thành phố Hồ Chí Minh',
          'Kho Hà Nội - 18 Xóm Núi Tiên Hùng, Nguyên Khê, Đông Anh, Hà Nội',
        ]}
      />

      {/* Action Menu Popover */}
      <Popover
        open={Boolean(actionMenuAnchor)}
        anchorEl={actionMenuAnchor}
        onClose={() => setActionMenuAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 1 }}>
          <MenuItem
            onClick={() => handleActionMenuAction('edit', selectedItemForAction!)}
            sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' } }}
          >
            <EditIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Sửa
          </MenuItem>
          <MenuItem
            onClick={() => handleActionMenuAction('delete', selectedItemForAction!)}
            sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' } }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Xóa
          </MenuItem>
        </Box>
      </Popover>

      {/* Day Menu Popover */}
      <Popover
        open={Boolean(dayMenuAnchor)}
        anchorEl={dayMenuAnchor}
        onClose={() => setDayMenuAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 1 }}>
          <MenuItem
            onClick={() => {
              // Seed default timeline item: Ngày nhập hàng = selectedDate
              if (selectedDate) {
                const d = new Date(selectedDate);
                // format dd/MM/yyyy for display and storage
                const iso = d.toLocaleDateString('vi-VN');
                addTimelineItemWith({
                  name: 'Ngày nhập hàng',
                  estimatedDate: iso,
                  status: 'pending',
                });
              }

              // Reset trước khi set field mới
              setEditingItem(null);
              resetAllItems(); // Reset arrays cho thêm mới từ calendar
              resetForm(); // Reset form fields cho thêm mới từ calendar

              // Sau reset, set lại date và timeline cho calendar context
              if (selectedDate) {
                const d = new Date(selectedDate);
                const iso = d.toLocaleDateString('vi-VN');

                // Set form fields
                setField('date', iso as unknown as string);
                setField('estimatedArrival', iso as unknown as string);

                // Seed default timeline item: Ngày nhận hàng = selectedDate (sau reset)
                addTimelineItemWith({
                  name: 'Ngày nhận hàng',
                  estimatedDate: iso,
                  status: 'pending',
                });
              }

              openAddDialog();
              setDayMenuAnchor(null);
            }}
            sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' } }}
          >
            <CalendarIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Thêm lịch
          </MenuItem>
        </Box>
      </Popover>
    </Box>
  );
};

export default InboundSchedule;
