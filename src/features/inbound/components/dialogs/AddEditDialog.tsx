import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
// Date pickers for calendar popup
import {
  InboundItem,
  FormFields,
  PackagingItem,
  TimelineItem,
  DocumentStatusItem,
} from '../../types/inbound';
import { getCategoryIcon } from '../../utils/statusUtils';
import { formatDateForInput } from '../../utils/dateUtils';
import {
  getLatestTimelineDescription,
  getLatestDocumentStatusDescription,
  getCurrentUser,
} from '../../utils/descriptionUtils';

// Helper: Parse Vietnamese date format dd/MM/yyyy correctly
const parseVietnamDate = (dateString: string | undefined): Date | null => {
  if (!dateString || !dateString.includes('/')) {
    return dateString ? new Date(dateString) : null;
  }

  const [day, month, year] = dateString.split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return null;
  }

  return new Date(year, month - 1, day); // month is 0-indexed
};

// Helper: Format date display
const formatDateDisplay = (dateString: string | undefined): string => {
  if (!dateString) return 'Chưa có';

  const d = parseVietnamDate(dateString);
  return d && !isNaN(d.getTime()) ? d.toLocaleDateString('vi-VN') : 'Chưa có';
};

interface AddEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  editingItem: InboundItem | null;
  addFromCalendar: Date | null;
  formFields: FormFields;
  onFieldChange: (field: keyof FormFields, value: unknown) => void;
  packagingItems: PackagingItem[];
  timelineItems: TimelineItem[];
  documentStatusItems: DocumentStatusItem[];
  onAddPackagingItem: () => void;
  onDeletePackagingItem: (index: number) => void;
  onAddTimelineItem: () => void;
  onUpdateTimelineItem: (index: number, item: TimelineItem) => void;
  onDeleteTimelineItem: (index: number) => void;
  onAddDocumentStatusItem: () => void;
  onUpdateDocumentStatusItem: (index: number, item: DocumentStatusItem) => void;
  onDeleteDocumentStatusItem: (index: number) => void;
  newPackagingItem: PackagingItem;
  newTimelineItem: TimelineItem;
  newDocumentStatusItem: DocumentStatusItem;
  onNewPackagingItemChange: (
    field: keyof PackagingItem,
    value: unknown
  ) => void;
  onNewTimelineItemChange: (field: keyof TimelineItem, value: unknown) => void;
  onNewDocumentStatusItemChange: (
    field: keyof DocumentStatusItem,
    value: unknown
  ) => void;
  productCategories: string[];
  destinations: string[];
}

const AddEditDialog: React.FC<AddEditDialogProps> = ({
  open,
  onClose,
  onSave,
  editingItem,
  addFromCalendar,
  formFields,
  onFieldChange,
  packagingItems,
  timelineItems,
  documentStatusItems,
  onAddPackagingItem,
  onDeletePackagingItem,
  onAddTimelineItem,
  onUpdateTimelineItem,
  onDeleteTimelineItem,
  onAddDocumentStatusItem,
  onUpdateDocumentStatusItem,
  onDeleteDocumentStatusItem,
  newPackagingItem,
  newTimelineItem,
  newDocumentStatusItem,
  onNewPackagingItemChange,
  onNewTimelineItemChange,
  onNewDocumentStatusItemChange,
  productCategories,
  destinations,
}) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    'success' | 'info' | 'warning' | 'error'
  >('success');
  const [isSaving, setIsSaving] = React.useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Local edit states for inline editing in sections
  const [editingPackagingIndex, setEditingPackagingIndex] = React.useState<
    number | null
  >(null);
  const [editingTimelineIndex, setEditingTimelineIndex] = React.useState<
    number | null
  >(null);
  const [editingDocIndex, setEditingDocIndex] = React.useState<number | null>(
    null
  );

  // States for description dialog
  const [descriptionDialogOpen, setDescriptionDialogOpen] =
    React.useState(false);
  const [descriptionText, setDescriptionText] = React.useState('');
  const [descriptionTarget, setDescriptionTarget] = React.useState<{
    type: 'timeline' | 'document';
    index: number;
    name: string;
  } | null>(null);

  // Helper: Parse date từ cả format dd/MM/yyyy và yyyy-MM-dd
  const parseVietnamDate = (dateStr: string): Date => {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return new Date(dateStr);
  };

  // Reset editing states khi mở dialog
  React.useEffect(() => {
    if (open && !editingItem) {
      // Khi mở dialog cho thêm mới (không phải edit), reset tất cả editing states
      setEditingPackagingIndex(null);
      setEditingTimelineIndex(null);
      setEditingDocIndex(null);
      setDescriptionDialogOpen(false);
      setDescriptionText('');
      setDescriptionTarget(null);

      // Reset newItem fields to defaults
      onNewPackagingItemChange('type', '2PCS/SET');
      onNewPackagingItemChange('quantity', 0);
      onNewPackagingItemChange('description', '');

      onNewTimelineItemChange('name', '');
      onNewTimelineItemChange('estimatedDate', '');
      onNewTimelineItemChange('date', '');
      onNewTimelineItemChange('status', 'pending');
      onNewTimelineItemChange('description', '');

      onNewDocumentStatusItemChange('name', '');
      onNewDocumentStatusItemChange('estimatedDate', '');
      onNewDocumentStatusItemChange('date', '');
      onNewDocumentStatusItemChange('status', 'pending');
      onNewDocumentStatusItemChange('description', '');
    }
  }, [
    open,
    editingItem,
    onNewPackagingItemChange,
    onNewTimelineItemChange,
    onNewDocumentStatusItemChange,
  ]);

  // Auto-clear fields khi type thay đổi để tránh cache sai
  const [previousType, setPreviousType] = React.useState<
    'international' | 'domestic'
  >('international');

  React.useEffect(() => {
    const currentType =
      formFields.origin && formFields.origin.trim()
        ? 'international'
        : 'domestic';

    if (currentType !== previousType && !editingItem && open) {
      // Type đã thay đổi và không phải đang edit → clear fields không phù hợp
      if (currentType === 'domestic') {
        // Chuyển sang Quốc nội: Clear PI, carrier
        onFieldChange('pi', '');
        onFieldChange('carrier', '');

        // Clear tất cả document status
        for (let i = documentStatusItems.length - 1; i >= 0; i--) {
          onDeleteDocumentStatusItem(i);
        }

        // Chỉ giữ timeline "Ngày nhận hàng", xóa các timeline khác
        const nonReceiveIndices: number[] = [];
        timelineItems.forEach((item, index) => {
          if (
            item.name !== 'Ngày nhận hàng' &&
            item.name !== 'Ngày tạo phiếu'
          ) {
            nonReceiveIndices.push(index);
          }
        });

        // Xóa từ cuối để tránh index shift
        nonReceiveIndices.reverse().forEach((index) => {
          onDeleteTimelineItem(index);
        });
      }

      setPreviousType(currentType);
      setHasUnsavedChanges(true);
      openSnack(
        `Chuyển sang ${currentType === 'international' ? '🌍 Quốc tế' : '🏠 Quốc nội'}`,
        'info'
      );
    }
  }, [
    formFields.origin,
    previousType,
    editingItem,
    open,
    timelineItems,
    documentStatusItems,
    onFieldChange,
    onDeleteTimelineItem,
    onDeleteDocumentStatusItem,
  ]);

  const openSnack = (
    message: string,
    severity: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    setSnackbarMsg(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Helper: Mở dialog thêm mô tả
  const openDescriptionDialog = (
    type: 'timeline' | 'document',
    index: number,
    name: string
  ) => {
    setDescriptionTarget({ type, index, name });
    setDescriptionText('');
    setDescriptionDialogOpen(true);
  };

  // Helper: Lưu mô tả mới
  const saveDescription = () => {
    if (!descriptionTarget || !descriptionText.trim()) return;

    const { type, index } = descriptionTarget;

    if (type === 'timeline') {
      const currentItem = timelineItems[index];
      if (currentItem) {
        // Import getCurrentUser và addTimelineDescription từ utils
        const updatedItem = {
          ...currentItem,
          descriptions: [
            ...(currentItem.descriptions || []),
            {
              id: `desc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              content: descriptionText.trim(),
              author: getCurrentUser(),
              timestamp: new Date().toISOString(),
            },
          ],
        };
        onUpdateTimelineItem(index, updatedItem);
        setHasUnsavedChanges(true);
        openSnack(`Đã thêm mô tả cho ${descriptionTarget.name}`, 'success');
      }
    } else if (type === 'document') {
      const currentItem = documentStatusItems[index];
      if (currentItem) {
        const updatedItem = {
          ...currentItem,
          descriptions: [
            ...(currentItem.descriptions || []),
            {
              id: `desc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              content: descriptionText.trim(),
              author: getCurrentUser(),
              timestamp: new Date().toISOString(),
            },
          ],
        };
        onUpdateDocumentStatusItem(index, updatedItem);
        setHasUnsavedChanges(true);
        openSnack(`Đã thêm mô tả cho ${descriptionTarget.name}`, 'success');
      }
    }

    // Close dialog
    setDescriptionDialogOpen(false);
    setDescriptionText('');
    setDescriptionTarget(null);
  };

  const handleAddPackaging = () => {
    onAddPackagingItem();
    setHasUnsavedChanges(true);
    openSnack('Đã thêm quy cách đóng gói (chưa lưu)');
  };

  const handleAddTimeline = () => {
    onAddTimelineItem();
    setHasUnsavedChanges(true);
    openSnack('Đã thêm mốc thời gian (chưa lưu)');
  };

  const handleAddDocumentStatus = () => {
    onAddDocumentStatusItem();
    setHasUnsavedChanges(true);
    openSnack('Đã thêm trạng thái chứng từ (chưa lưu)');
  };

  const handleSaveClick = async () => {
    try {
      setIsSaving(true);
      openSnack(editingItem ? 'Đang cập nhật...' : 'Đang thêm mới...', 'info');
      await Promise.resolve(onSave({} as Record<string, unknown>));
      setHasUnsavedChanges(false);
      // Dialog thường sẽ đóng từ parent; nếu chưa đóng, báo thành công
      openSnack(editingItem ? 'Cập nhật thành công' : 'Thêm mới thành công');
    } finally {
      setIsSaving(false);
    }
  };
  const calculateTotalProducts = (items: PackagingItem[]): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Tính tổng PCS = SUM(quantity * PCS/SET)
  const calculateTotalPCS = (items: PackagingItem[]): number => {
    return items.reduce((sum, p) => {
      const match = /^(\d+)\s*PCS\s*\/\s*SET/i.exec(p.type || '');
      const pcsPerSet = match ? parseInt(match[1], 10) : 1;
      const qty = Number.isFinite(p.quantity) ? p.quantity : 0;
      return sum + pcsPerSet * qty;
    }, 0);
  };

  // Load editing item data into form fields
  React.useEffect(() => {
    if (editingItem && open) {
      // Load main form fields
      onFieldChange('id', editingItem.id);
      onFieldChange('date', editingItem.date);
      onFieldChange('supplier', editingItem.supplier);
      onFieldChange('origin', editingItem.origin);
      onFieldChange('destination', editingItem.destination);
      onFieldChange('product', editingItem.product);
      onFieldChange('quantity', editingItem.quantity);
      onFieldChange('status', editingItem.status);
      onFieldChange('estimatedArrival', editingItem.estimatedArrival);
      onFieldChange('actualArrival', editingItem.actualArrival);
      onFieldChange('carrier', editingItem.carrier);
      onFieldChange('pi', editingItem.pi);
      onFieldChange('container', editingItem.container);
      onFieldChange('category', editingItem.category);
      onFieldChange('purpose', editingItem.purpose);
      onFieldChange('receiveTime', editingItem.receiveTime);
      onFieldChange('notes', editingItem.notes);
      onFieldChange('poNumbersInput', editingItem.poNumbers?.join(', ') || '');
      setHasUnsavedChanges(false); // Reset when loading data
    }
  }, [editingItem, open, onFieldChange]);

  React.useEffect(() => {
    const totalPcs = calculateTotalPCS(packagingItems);
    if ((formFields.quantity as number) !== totalPcs) {
      onFieldChange('quantity', totalPcs);
    }
  }, [packagingItems, formFields.quantity, onFieldChange]);
  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          'Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn đóng? Thay đổi sẽ bị mất.'
        )
      ) {
        setHasUnsavedChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleFieldChange = (field: keyof FormFields, value: unknown) => {
    onFieldChange(field, value);
    if (editingItem) {
      setHasUnsavedChanges(true);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          borderBottom: '2px solid',
          borderColor: 'primary.main',
          pb: 2,
          bgcolor: 'primary.50',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: 'primary.main' }}
            >
              {editingItem ? '✏️ Sửa lịch nhập hàng' : '➕ Thêm lịch nhập hàng'}
            </Typography>
            {addFromCalendar && (
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.8rem' }}
              >
                📅 Ngày: {addFromCalendar.toLocaleDateString('vi-VN')}
              </Typography>
            )}
          </Box>

          {/* Type indicator */}
          {!editingItem &&
            (() => {
              const type =
                formFields.origin && formFields.origin.trim()
                  ? 'international'
                  : 'domestic';
              return (
                <Chip
                  label={
                    type === 'international' ? '🌍 Quốc tế' : '🏠 Quốc nội'
                  }
                  size="medium"
                  color={type === 'international' ? 'primary' : 'secondary'}
                  sx={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    px: 2,
                    '& .MuiChip-label': { px: 1.5 },
                  }}
                />
              );
            })()}
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* Alert messages đẹp */}
        {editingItem && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
              '& .MuiAlert-message': { fontSize: '0.85rem', fontWeight: 500 },
            }}
            icon="✏️"
          >
            Chỉnh sửa thông tin bên dưới và nhấn <strong>"Cập nhật"</strong> để
            lưu
          </Alert>
        )}

        {hasUnsavedChanges && (
          <Alert
            severity="warning"
            sx={{
              mb: 2,
              '& .MuiAlert-message': { fontSize: '0.85rem', fontWeight: 500 },
              bgcolor: 'warning.50',
              borderLeft: '4px solid',
              borderColor: 'warning.main',
            }}
          >
            ⚠️ <strong>Có thay đổi chưa lưu!</strong> Nhớ nhấn nút{' '}
            <strong>"Cập nhật"</strong> ở cuối để lưu vào hệ thống
          </Alert>
        )}

        <Grid
          container
          spacing={2}
          sx={{ mt: hasUnsavedChanges || editingItem ? 0 : 1 }}
        >
          {/* PI - Chỉ hiện cho Quốc tế */}
          {formFields.origin && formFields.origin.trim() && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mã PI (Lô hàng)"
                value={formFields.pi}
                onChange={(e) => handleFieldChange('pi', e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nhà cung cấp"
              value={formFields.supplier}
              onChange={(e) => handleFieldChange('supplier', e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sản phẩm"
              value={formFields.product}
              onChange={(e) => handleFieldChange('product', e.target.value)}
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              options={productCategories}
              value={formFields.category}
              onInputChange={(_, v) => handleFieldChange('category', v)}
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
                <TextField
                  {...params}
                  label="Phân loại hàng hóa"
                  variant="outlined"
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Xuất xứ"
              value={formFields.origin}
              onChange={(e) => onFieldChange('origin', e.target.value)}
              variant="outlined"
              helperText="💡 Để trống = Quốc nội, Có dữ liệu = Quốc tế"
              FormHelperTextProps={{
                sx: { fontSize: '0.7rem', color: 'info.main' },
              }}
            />
          </Grid>

          {/* Info message cho Quốc nội */}
          {!(formFields.origin && formFields.origin.trim()) && (
            <Grid item xs={12}>
              <Alert
                severity="success"
                sx={{
                  bgcolor: 'success.50',
                  borderLeft: '4px solid',
                  borderColor: 'success.main',
                  '& .MuiAlert-message': { fontSize: '0.8rem' },
                }}
              >
                <Typography
                  component="span"
                  sx={{ fontWeight: 600, fontSize: '0.85rem' }}
                >
                  🏠 Form đơn giản cho Quốc nội
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    mt: 0.5,
                    mb: 0,
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    pl: 2,
                  }}
                >
                  <li>Không cần Mã PI, Nhà vận chuyển</li>
                  <li>Chỉ cần Ngày nhận hàng (đơn giản)</li>
                  <li>Không có Trạng thái chứng từ phức tạp</li>
                </Box>
              </Alert>
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              options={destinations}
              value={formFields.destination}
              onInputChange={(_, v) => onFieldChange('destination', v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Đích đến"
                  variant="outlined"
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Số lượng"
              type="number"
              value={formFields.quantity}
              onChange={(e) =>
                onFieldChange('quantity', Number(e.target.value))
              }
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
              onChange={(e) =>
                onFieldChange('container', Number(e.target.value))
              }
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Mục đích</InputLabel>
              <Select
                value={formFields.purpose}
                onChange={(e) => onFieldChange('purpose', e.target.value)}
                label="Mục đích"
              >
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
              value={formFields.receiveTime}
              onChange={(e) => onFieldChange('receiveTime', e.target.value)}
              variant="outlined"
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phiếu PO (cách nhau bằng dấu phẩy)"
              value={formFields.poNumbersInput}
              onChange={(e) => onFieldChange('poNumbersInput', e.target.value)}
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
                onChange={(e) =>
                  onFieldChange(
                    'status',
                    e.target.value as InboundItem['status']
                  )
                }
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
          {/* Nhà vận chuyển - Chỉ hiện cho Quốc tế */}
          {formFields.origin && formFields.origin.trim() && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nhà vận chuyển"
                value={formFields.carrier}
                onChange={(e) => onFieldChange('carrier', e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
          )}

          {/* Packaging Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem' }}>
              📦 Quy cách đóng gói
            </Typography>

            {/* Packaging Items List */}
            {packagingItems.map((item, index) => (
              <Box
                key={item.id}
                sx={{
                  mb: 1,
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  backgroundColor: '#f5f5f5',
                }}
              >
                {editingPackagingIndex === index ? (
                  // Inline editing form
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Loại</InputLabel>
                      <Select
                        value={newPackagingItem.type}
                        onChange={(e) =>
                          onNewPackagingItemChange('type', e.target.value)
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
                      size="small"
                      label="Số lượng SET"
                      type="number"
                      value={newPackagingItem.quantity}
                      onChange={(e) =>
                        onNewPackagingItemChange(
                          'quantity',
                          Number(e.target.value)
                        )
                      }
                      sx={{ minWidth: 120 }}
                      inputProps={{ min: 0 }}
                    />
                    <TextField
                      size="small"
                      label="Mô tả"
                      value={newPackagingItem.description}
                      onChange={(e) =>
                        onNewPackagingItemChange('description', e.target.value)
                      }
                      sx={{ flex: 1 }}
                      placeholder="VD: Thùng carton, Pallet gỗ..."
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          onDeletePackagingItem(editingPackagingIndex);
                          handleAddPackaging();
                          setEditingPackagingIndex(null);
                          setHasUnsavedChanges(true);
                          openSnack('Đã cập nhật quy cách (chưa lưu)');
                        }}
                        disabled={
                          !newPackagingItem.type ||
                          newPackagingItem.quantity <= 0
                        }
                      >
                        Lưu
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setEditingPackagingIndex(null)}
                      >
                        Hủy
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  // Display mode
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ minWidth: '80px', fontWeight: 500 }}
                    >
                      {item.type}
                    </Typography>
                    <Typography variant="body2" sx={{ minWidth: '60px' }}>
                      {item.quantity} SET
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ flex: 1, color: 'text.secondary' }}
                    >
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Sửa">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditingPackagingIndex(index);
                            onNewPackagingItemChange('type', item.type);
                            onNewPackagingItemChange('quantity', item.quantity);
                            onNewPackagingItemChange(
                              'description',
                              item.description || ''
                            );
                          }}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          size="small"
                          onClick={() => onDeletePackagingItem(index)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                )}
              </Box>
            ))}

            {/* Add New Packaging Item - Ẩn khi đang edit */}
            {editingPackagingIndex === null && (
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
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Loại</InputLabel>
                  <Select
                    value={newPackagingItem.type}
                    onChange={(e) =>
                      onNewPackagingItemChange('type', e.target.value)
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
                  size="small"
                  label="Số lượng SET"
                  type="number"
                  value={newPackagingItem.quantity}
                  onChange={(e) =>
                    onNewPackagingItemChange('quantity', Number(e.target.value))
                  }
                  sx={{ minWidth: 120 }}
                  inputProps={{ min: 0 }}
                />
                <TextField
                  size="small"
                  label="Mô tả"
                  value={newPackagingItem.description}
                  onChange={(e) =>
                    onNewPackagingItemChange('description', e.target.value)
                  }
                  sx={{ flex: 1 }}
                  placeholder="VD: Thùng carton, Pallet gỗ..."
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    if (editingPackagingIndex !== null) {
                      // Replace by delete + add
                      onDeletePackagingItem(editingPackagingIndex);
                      handleAddPackaging();
                      setEditingPackagingIndex(null);
                      openSnack('Đã cập nhật quy cách');
                    } else {
                      handleAddPackaging();
                    }
                  }}
                  disabled={
                    !newPackagingItem.type || newPackagingItem.quantity <= 0
                  }
                  startIcon={<AddIcon />}
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    '&.Mui-disabled': {
                      bgcolor: 'primary.200',
                      color: 'white',
                      opacity: 0.7,
                    },
                  }}
                >
                  {editingPackagingIndex !== null ? 'Lưu' : 'Thêm'}
                </Button>
              </Box>
            )}

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
                  📦 Tổng số:{' '}
                  {calculateTotalPCS(packagingItems).toLocaleString()} PCS /{' '}
                  {calculateTotalProducts(packagingItems).toLocaleString()} SET
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mt: 0.5 }}
                >
                  Tự động tính từ các loại quy cách đóng gói
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Timeline Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem' }}>
              {formFields.origin && formFields.origin.trim()
                ? '🚚 Timeline Vận Chuyển'
                : '📅 Lịch Nhận Hàng'}
            </Typography>

            {/* Timeline Items List - Quốc tế: tất cả, Quốc nội: chỉ Ngày nhận hàng */}
            {timelineItems
              .filter((item) => {
                const isInternational =
                  formFields.origin && formFields.origin.trim();
                if (isInternational) {
                  return true; // Hiển thị tất cả timeline cho Quốc tế
                } else {
                  // Quốc nội: chỉ hiển thị "Ngày nhận hàng" và "Ngày tạo phiếu"
                  return (
                    item.name === 'Ngày nhận hàng' ||
                    item.name === 'Ngày tạo phiếu'
                  );
                }
              })
              .map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    mb: 1,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor:
                      item.status === 'completed'
                        ? '#e8f5e8'
                        : item.status === 'confirmed'
                          ? '#e3f2fd'
                          : '#f5f5f5',
                  }}
                >
                  {editingTimelineIndex === index ? (
                    // Inline editing form
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <FormControl sx={{ minWidth: '140px' }}>
                        <InputLabel>Mốc thời gian</InputLabel>
                        <Select
                          value={newTimelineItem.name}
                          onChange={(e) =>
                            onNewTimelineItemChange('name', e.target.value)
                          }
                          label="Mốc thời gian"
                        >
                          <MenuItem value="Ngày nhập hàng">
                            Ngày nhập hàng
                          </MenuItem>
                          <MenuItem value="Cargo Ready">Cargo Ready</MenuItem>
                          <MenuItem value="ETD">ETD</MenuItem>
                          <MenuItem value="ETA">ETA</MenuItem>
                          <MenuItem value="Ngày hàng đi">Ngày hàng đi</MenuItem>
                          <MenuItem value="Ngày hàng về cảng">
                            Ngày hàng về cảng
                          </MenuItem>
                          <MenuItem value="Ngày nhận hàng">
                            Ngày nhận hàng
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Ngày dự kiến"
                        type="date"
                        value={newTimelineItem.estimatedDate as string}
                        onChange={(e) => {
                          onNewTimelineItemChange(
                            'estimatedDate',
                            e.target.value
                          );
                          if (
                            newTimelineItem.name === 'Ngày nhập hàng' &&
                            e.target.value
                          ) {
                            onFieldChange('estimatedArrival', e.target.value);
                          }
                        }}
                        sx={{ minWidth: '140px' }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Ngày thực tế"
                        type="date"
                        value={newTimelineItem.date as string}
                        onChange={(e) => {
                          onNewTimelineItemChange('date', e.target.value);
                          if (
                            newTimelineItem.name === 'Ngày nhập hàng' &&
                            e.target.value
                          ) {
                            onFieldChange('actualArrival', e.target.value);
                            onFieldChange('date', e.target.value);
                          }
                        }}
                        sx={{ minWidth: '140px' }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <FormControl sx={{ minWidth: '120px' }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                          value={newTimelineItem.status}
                          onChange={(e) =>
                            onNewTimelineItemChange('status', e.target.value)
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
                          onNewTimelineItemChange('description', e.target.value)
                        }
                        sx={{ minWidth: '200px', flex: 1 }}
                        placeholder="Mô tả thêm..."
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            const updatedItem: TimelineItem = {
                              ...newTimelineItem,
                              id: timelineItems[editingTimelineIndex].id,
                            };
                            onUpdateTimelineItem(
                              editingTimelineIndex,
                              updatedItem
                            );
                            setEditingTimelineIndex(null);
                            setHasUnsavedChanges(true);
                            openSnack('Đã cập nhật mốc thời gian (chưa lưu)');
                          }}
                          disabled={
                            !newTimelineItem.name ||
                            !(
                              (newTimelineItem.estimatedDate as string) ||
                              (newTimelineItem.date as string)
                            )
                          }
                        >
                          Lưu
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setEditingTimelineIndex(null)}
                        >
                          Hủy
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    // Display mode
                    <Box>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={12} md={3}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600 }}
                            noWrap
                          >
                            {item.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <Box sx={{ display: 'flex', gap: 3 }}>
                            {/* Hide "Dự kiến" for "Ngày tạo phiếu" */}
                            {item.name !== 'Ngày tạo phiếu' && (
                              <Typography variant="body2" noWrap>
                                Dự kiến: {formatDateDisplay(item.estimatedDate)}
                              </Typography>
                            )}
                            <Typography variant="body2" noWrap>
                              {item.name === 'Ngày tạo phiếu'
                                ? 'Ngày: '
                                : 'Thực tế: '}
                              {formatDateDisplay(item.date)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Chip
                            label={
                              item.status === 'completed'
                                ? 'Hoàn thành'
                                : item.status === 'confirmed'
                                  ? 'Đã xác nhận'
                                  : 'Chờ xử lý'
                            }
                            color={
                              item.status === 'completed'
                                ? 'success'
                                : item.status === 'confirmed'
                                  ? 'primary'
                                  : 'default'
                            }
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Grid>
                        <Grid item xs={12} md={1.5}>
                          {/* Delay Status - Auto calculated */}
                          {item.estimatedDate &&
                            item.date &&
                            item.name !== 'Ngày tạo phiếu' && (
                              <Chip
                                label={(() => {
                                  // Calculate delay status
                                  if (!item.estimatedDate || !item.date)
                                    return '❓';

                                  // Parse dates
                                  const parseDate = (dateStr: string): Date => {
                                    if (dateStr.includes('/')) {
                                      const [day, month, year] =
                                        dateStr.split('/');
                                      return new Date(
                                        parseInt(year),
                                        parseInt(month) - 1,
                                        parseInt(day)
                                      );
                                    }
                                    return new Date(dateStr);
                                  };

                                  const estimated = parseDate(
                                    item.estimatedDate
                                  );
                                  const actual = parseDate(item.date);

                                  if (estimated.getTime() === actual.getTime())
                                    return '✅ Đúng hạn';
                                  if (actual < estimated) return '⚡ Trước hạn';
                                  if (actual > estimated) return '🚨 Trễ hạn';
                                  return '❓ Chưa xác định';
                                })()}
                                color={(() => {
                                  if (!item.estimatedDate || !item.date)
                                    return 'default';

                                  const parseDate = (dateStr: string): Date => {
                                    if (dateStr.includes('/')) {
                                      const [day, month, year] =
                                        dateStr.split('/');
                                      return new Date(
                                        parseInt(year),
                                        parseInt(month) - 1,
                                        parseInt(day)
                                      );
                                    }
                                    return new Date(dateStr);
                                  };

                                  const estimated = parseDate(
                                    item.estimatedDate
                                  );
                                  const actual = parseDate(item.date);

                                  if (estimated.getTime() === actual.getTime())
                                    return 'success';
                                  if (actual < estimated) return 'info';
                                  if (actual > estimated) return 'error';
                                  return 'default';
                                })()}
                                size="small"
                                sx={{ fontSize: '0.6rem', height: 20 }}
                              />
                            )}
                        </Grid>
                        <Grid item xs={12} md={1.5}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              gap: 0.5,
                            }}
                          >
                            {/* Show description button for all, edit/delete for non-created items */}
                            <Tooltip title="Thêm mô tả">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  openDescriptionDialog(
                                    'timeline',
                                    index,
                                    item.name
                                  )
                                }
                                color="info"
                              >
                                <CommentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {/* Hide edit/delete buttons for "Ngày tạo phiếu" */}
                            {item.name !== 'Ngày tạo phiếu' && (
                              <>
                                <Tooltip title="Sửa">
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setEditingTimelineIndex(index);
                                      onNewTimelineItemChange(
                                        'name',
                                        item.name
                                      );
                                      onNewTimelineItemChange(
                                        'estimatedDate',
                                        formatDateForInput(
                                          item.estimatedDate || ''
                                        )
                                      );
                                      onNewTimelineItemChange(
                                        'date',
                                        formatDateForInput(item.date || '')
                                      );
                                      onNewTimelineItemChange(
                                        'status',
                                        item.status
                                      );
                                      onNewTimelineItemChange(
                                        'description',
                                        item.description || ''
                                      );
                                    }}
                                    color="primary"
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa">
                                  <IconButton
                                    size="small"
                                    onClick={() => onDeleteTimelineItem(index)}
                                    color="error"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      {(item.description ||
                        (item.descriptions &&
                          item.descriptions.length > 0)) && (
                        <Box sx={{ mt: 1, ml: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.75rem',
                              fontStyle: 'italic',
                            }}
                          >
                            📝 {getLatestTimelineDescription(item)}
                          </Typography>
                          {item.descriptions &&
                            item.descriptions.length > 1 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'text.disabled',
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  Lịch sử mô tả (
                                  {(item.descriptions || []).length}
                                  ):
                                </Typography>
                                {(item.descriptions || []).map((desc, idx) => (
                                  <Typography
                                    key={desc.id}
                                    variant="caption"
                                    sx={{
                                      display: 'block',
                                      fontSize: '0.65rem',
                                      color: 'text.secondary',
                                      ml: 1,
                                      mt: 0.3,
                                      py: 0.3,
                                      px: 0.5,
                                      bgcolor:
                                        idx ===
                                        (item.descriptions || []).length - 1
                                          ? '#e8f5e8'
                                          : '#f5f5f5',
                                      borderRadius: 0.5,
                                      border: '1px solid',
                                      borderColor:
                                        idx ===
                                        (item.descriptions || []).length - 1
                                          ? '#4caf50'
                                          : '#e0e0e0',
                                    }}
                                  >
                                    <strong>{desc.author}</strong> (
                                    {new Date(
                                      desc.timestamp
                                    ).toLocaleDateString('vi-VN')}{' '}
                                    {new Date(
                                      desc.timestamp
                                    ).toLocaleTimeString('vi-VN', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                    ):
                                    <br />
                                    {desc.content}
                                  </Typography>
                                ))}
                              </Box>
                            )}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              ))}

            {/* Add New Timeline Item - Ẩn khi đang edit, chỉ hiện cho Quốc tế */}
            {editingTimelineIndex === null &&
              formFields.origin &&
              formFields.origin.trim() && (
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
                        onNewTimelineItemChange('name', e.target.value)
                      }
                      label="Mốc thời gian"
                    >
                      <MenuItem value="Ngày nhập hàng">Ngày nhập hàng</MenuItem>
                      <MenuItem value="Cargo Ready">Cargo Ready</MenuItem>
                      <MenuItem value="ETD">ETD</MenuItem>
                      <MenuItem value="ETA">ETA</MenuItem>
                      <MenuItem value="Ngày hàng đi">Ngày hàng đi</MenuItem>
                      <MenuItem value="Ngày hàng về cảng">
                        Ngày hàng về cảng
                      </MenuItem>
                      <MenuItem value="Ngày nhận hàng">Ngày nhận hàng</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Ngày dự kiến"
                    type="date"
                    value={newTimelineItem.estimatedDate as string}
                    onChange={(e) => {
                      onNewTimelineItemChange('estimatedDate', e.target.value);
                      if (
                        newTimelineItem.name === 'Ngày nhập hàng' &&
                        e.target.value
                      ) {
                        onFieldChange('estimatedArrival', e.target.value);
                      }
                    }}
                    sx={{ minWidth: '140px' }}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    label="Ngày thực tế"
                    type="date"
                    value={newTimelineItem.date as string}
                    onChange={(e) => {
                      onNewTimelineItemChange('date', e.target.value);
                      if (
                        newTimelineItem.name === 'Ngày nhập hàng' &&
                        e.target.value
                      ) {
                        onFieldChange('actualArrival', e.target.value);
                        onFieldChange('date', e.target.value);
                      }
                    }}
                    sx={{ minWidth: '140px' }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControl sx={{ minWidth: '120px' }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={newTimelineItem.status}
                      onChange={(e) =>
                        onNewTimelineItemChange('status', e.target.value)
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
                      onNewTimelineItemChange('description', e.target.value)
                    }
                    sx={{ minWidth: '200px', flex: 1 }}
                    placeholder="Mô tả thêm..."
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (editingTimelineIndex !== null) {
                        onDeleteTimelineItem(editingTimelineIndex);
                        handleAddTimeline();
                        setEditingTimelineIndex(null);
                        openSnack('Đã cập nhật mốc thời gian');
                      } else {
                        handleAddTimeline();
                      }
                    }}
                    startIcon={<AddIcon />}
                    disabled={
                      !newTimelineItem.name ||
                      !(
                        (newTimelineItem.estimatedDate as string) ||
                        (newTimelineItem.date as string)
                      )
                    }
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      '&.Mui-disabled': {
                        bgcolor: 'primary.200',
                        color: 'white',
                        opacity: 0.7,
                      },
                    }}
                  >
                    {editingTimelineIndex !== null ? 'Lưu' : 'Thêm'}
                  </Button>
                </Box>
              )}
          </Grid>

          {/* Add Timeline cho Quốc nội - Chỉ có thể thêm Ngày nhận hàng */}
          {editingTimelineIndex === null &&
            !(formFields.origin && formFields.origin.trim()) && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    mt: 1,
                    p: 2,
                    border: '2px dashed #4caf50',
                    borderRadius: 1,
                    backgroundColor: '#e8f5e8',
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.8rem',
                      color: 'success.main',
                      fontWeight: 600,
                    }}
                  >
                    🏠 Quốc nội - Chỉ cần ngày nhận hàng:
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      onNewTimelineItemChange('name', 'Ngày nhận hàng');
                      onNewTimelineItemChange('status', 'pending');
                      handleAddTimeline();
                    }}
                    startIcon={<AddIcon />}
                    disabled={timelineItems.some(
                      (t) => t.name === 'Ngày nhận hàng'
                    )}
                    size="small"
                    color="success"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      '&.Mui-disabled': {
                        bgcolor: 'success.200',
                        color: 'white',
                        opacity: 0.8,
                      },
                    }}
                  >
                    {timelineItems.some((t) => t.name === 'Ngày nhận hàng')
                      ? 'Đã có ngày nhận hàng'
                      : 'Thêm ngày nhận hàng'}
                  </Button>
                </Box>
              </Grid>
            )}

          {/* Document Status Section - Chỉ hiện cho Quốc tế */}
          {formFields.origin && formFields.origin.trim() && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontSize: '1rem' }}>
                📄 Trạng thái chứng từ
              </Typography>

              {/* Document Status Items List */}
              {documentStatusItems.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    mb: 1,
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  {editingDocIndex === index ? (
                    // Inline editing form
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <FormControl sx={{ minWidth: '140px' }}>
                        <InputLabel>Trạng thái chứng từ</InputLabel>
                        <Select
                          value={newDocumentStatusItem.name}
                          onChange={(e) =>
                            onNewDocumentStatusItemChange(
                              'name',
                              e.target.value
                            )
                          }
                          label="Trạng thái chứng từ"
                        >
                          <MenuItem value="Check bill">Check bill</MenuItem>
                          <MenuItem value="Check CO">Check CO</MenuItem>
                          <MenuItem value="TQ gửi chứng từ đi">
                            TQ gửi chứng từ đi
                          </MenuItem>
                          <MenuItem value="Lên Tờ Khai Hải Quan">
                            Lên Tờ Khai Hải Quan
                          </MenuItem>
                          <MenuItem value="Đóng thuế">Đóng thuế</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label="Ngày dự kiến"
                        type="date"
                        value={newDocumentStatusItem.estimatedDate as string}
                        onChange={(e) =>
                          onNewDocumentStatusItemChange(
                            'estimatedDate',
                            e.target.value
                          )
                        }
                        sx={{ minWidth: '140px' }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        label="Ngày thực tế"
                        type="date"
                        value={newDocumentStatusItem.date as string}
                        onChange={(e) =>
                          onNewDocumentStatusItemChange('date', e.target.value)
                        }
                        sx={{ minWidth: '140px' }}
                        InputLabelProps={{ shrink: true }}
                      />
                      <FormControl sx={{ minWidth: '120px' }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                          value={newDocumentStatusItem.status}
                          onChange={(e) =>
                            onNewDocumentStatusItemChange(
                              'status',
                              e.target.value
                            )
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
                          onNewDocumentStatusItemChange(
                            'description',
                            e.target.value
                          )
                        }
                        sx={{ minWidth: '200px', flex: 1 }}
                        placeholder="Mô tả thêm..."
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            onDeleteDocumentStatusItem(editingDocIndex);
                            handleAddDocumentStatus();
                            setEditingDocIndex(null);
                            setHasUnsavedChanges(true);
                            openSnack(
                              'Đã cập nhật trạng thái chứng từ (chưa lưu)'
                            );
                          }}
                          disabled={
                            !newDocumentStatusItem.name ||
                            !(
                              (newDocumentStatusItem.estimatedDate as string) ||
                              (newDocumentStatusItem.date as string)
                            )
                          }
                        >
                          Lưu
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setEditingDocIndex(null)}
                        >
                          Hủy
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    // Display mode
                    <Box>
                      <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={12} md={3}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600 }}
                            noWrap
                          >
                            {item.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <Box sx={{ display: 'flex', gap: 3 }}>
                            {/* Hide "Dự kiến" for "Ngày tạo phiếu" */}
                            {item.name !== 'Ngày tạo phiếu' && (
                              <Typography variant="body2" noWrap>
                                Dự kiến: {formatDateDisplay(item.estimatedDate)}
                              </Typography>
                            )}
                            <Typography variant="body2" noWrap>
                              {item.name === 'Ngày tạo phiếu'
                                ? 'Ngày: '
                                : 'Thực tế: '}
                              {formatDateDisplay(item.date)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <Chip
                            label={
                              item.status === 'completed'
                                ? 'Hoàn thành'
                                : item.status === 'confirmed'
                                  ? 'Đã xác nhận'
                                  : 'Chờ xử lý'
                            }
                            color={
                              item.status === 'completed'
                                ? 'success'
                                : item.status === 'confirmed'
                                  ? 'primary'
                                  : 'default'
                            }
                            size="small"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Grid>
                        <Grid item xs={12} md={1.5}>
                          {/* Delay Status for Document Status - Auto calculated */}
                          {item.estimatedDate && item.date && (
                            <Chip
                              label={(() => {
                                // Calculate delay status
                                if (!item.estimatedDate || !item.date)
                                  return '❓';

                                // Parse dates
                                const parseDate = (dateStr: string): Date => {
                                  if (dateStr.includes('/')) {
                                    const [day, month, year] =
                                      dateStr.split('/');
                                    return new Date(
                                      parseInt(year),
                                      parseInt(month) - 1,
                                      parseInt(day)
                                    );
                                  }
                                  return new Date(dateStr);
                                };

                                const estimated = parseDate(item.estimatedDate);
                                const actual = parseDate(item.date);

                                if (estimated.getTime() === actual.getTime())
                                  return '✅ Đúng hạn';
                                if (actual < estimated) return '⚡ Trước hạn';
                                if (actual > estimated) return '🚨 Trễ hạn';
                                return '❓ Chưa xác định';
                              })()}
                              color={(() => {
                                if (!item.estimatedDate || !item.date)
                                  return 'default';

                                const parseDate = (dateStr: string): Date => {
                                  if (dateStr.includes('/')) {
                                    const [day, month, year] =
                                      dateStr.split('/');
                                    return new Date(
                                      parseInt(year),
                                      parseInt(month) - 1,
                                      parseInt(day)
                                    );
                                  }
                                  return new Date(dateStr);
                                };

                                const estimated = parseDate(item.estimatedDate);
                                const actual = parseDate(item.date);

                                if (estimated.getTime() === actual.getTime())
                                  return 'success';
                                if (actual < estimated) return 'info';
                                if (actual > estimated) return 'error';
                                return 'default';
                              })()}
                              size="small"
                              sx={{ fontSize: '0.6rem', height: 20 }}
                            />
                          )}
                        </Grid>
                        <Grid item xs={12} md={1.5}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              gap: 0.5,
                            }}
                          >
                            <Tooltip title="Sửa">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setEditingDocIndex(index);
                                  onNewDocumentStatusItemChange(
                                    'name',
                                    item.name
                                  );
                                  onNewDocumentStatusItemChange(
                                    'estimatedDate',
                                    formatDateForInput(item.estimatedDate || '')
                                  );
                                  onNewDocumentStatusItemChange(
                                    'date',
                                    formatDateForInput(item.date || '')
                                  );
                                  onNewDocumentStatusItemChange(
                                    'status',
                                    item.status
                                  );
                                  onNewDocumentStatusItemChange(
                                    'description',
                                    item.description || ''
                                  );
                                }}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Thêm mô tả">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  openDescriptionDialog(
                                    'document',
                                    index,
                                    item.name
                                  )
                                }
                                color="info"
                              >
                                <CommentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  onDeleteDocumentStatusItem(index)
                                }
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Grid>
                      </Grid>
                      {(item.description ||
                        (item.descriptions &&
                          item.descriptions.length > 0)) && (
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
                          >
                            📝 {getLatestDocumentStatusDescription(item)}
                          </Typography>
                          {item.descriptions &&
                            item.descriptions.length > 1 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'text.disabled',
                                    fontSize: '0.7rem',
                                  }}
                                >
                                  Lịch sử mô tả (
                                  {(item.descriptions || []).length}
                                  ):
                                </Typography>
                                {(item.descriptions || []).map((desc, idx) => (
                                  <Typography
                                    key={desc.id}
                                    variant="caption"
                                    sx={{
                                      display: 'block',
                                      fontSize: '0.65rem',
                                      color: 'text.secondary',
                                      ml: 1,
                                      mt: 0.3,
                                      py: 0.3,
                                      px: 0.5,
                                      bgcolor:
                                        idx ===
                                        (item.descriptions || []).length - 1
                                          ? '#e8f5e8'
                                          : '#f5f5f5',
                                      borderRadius: 0.5,
                                      border: '1px solid',
                                      borderColor:
                                        idx ===
                                        (item.descriptions || []).length - 1
                                          ? '#4caf50'
                                          : '#e0e0e0',
                                    }}
                                  >
                                    <strong>{desc.author}</strong> (
                                    {new Date(
                                      desc.timestamp
                                    ).toLocaleDateString('vi-VN')}{' '}
                                    {new Date(
                                      desc.timestamp
                                    ).toLocaleTimeString('vi-VN', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                    ):
                                    <br />
                                    {desc.content}
                                  </Typography>
                                ))}
                              </Box>
                            )}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              ))}

              {/* Add New Document Status Item - Ẩn khi đang edit */}
              {editingDocIndex === null && (
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
                        onNewDocumentStatusItemChange('name', e.target.value)
                      }
                      label="Trạng thái chứng từ"
                    >
                      <MenuItem value="Check bill">Check bill</MenuItem>
                      <MenuItem value="Check CO">Check CO</MenuItem>
                      <MenuItem value="TQ gửi chứng từ đi">
                        TQ gửi chứng từ đi
                      </MenuItem>
                      <MenuItem value="Lên Tờ Khai Hải Quan">
                        Lên Tờ Khai Hải Quan
                      </MenuItem>
                      <MenuItem value="Đóng thuế">Đóng thuế</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Ngày dự kiến"
                    type="date"
                    value={newDocumentStatusItem.estimatedDate as string}
                    onChange={(e) =>
                      onNewDocumentStatusItemChange(
                        'estimatedDate',
                        e.target.value
                      )
                    }
                    sx={{ minWidth: '140px' }}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    label="Ngày thực tế"
                    type="date"
                    value={newDocumentStatusItem.date as string}
                    onChange={(e) =>
                      onNewDocumentStatusItemChange('date', e.target.value)
                    }
                    sx={{ minWidth: '140px' }}
                    InputLabelProps={{ shrink: true }}
                  />

                  <FormControl sx={{ minWidth: '120px' }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={newDocumentStatusItem.status}
                      onChange={(e) =>
                        onNewDocumentStatusItemChange('status', e.target.value)
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
                      onNewDocumentStatusItemChange(
                        'description',
                        e.target.value
                      )
                    }
                    sx={{ minWidth: '200px', flex: 1 }}
                    placeholder="Mô tả thêm..."
                  />

                  <Button
                    variant="contained"
                    onClick={() => {
                      if (editingDocIndex !== null) {
                        onDeleteDocumentStatusItem(editingDocIndex);
                        handleAddDocumentStatus();
                        setEditingDocIndex(null);
                        openSnack('Đã cập nhật trạng thái chứng từ');
                      } else {
                        handleAddDocumentStatus();
                      }
                    }}
                    startIcon={<AddIcon />}
                    disabled={
                      !newDocumentStatusItem.name ||
                      !(
                        (newDocumentStatusItem.estimatedDate as string) ||
                        (newDocumentStatusItem.date as string)
                      )
                    }
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      '&.Mui-disabled': {
                        bgcolor: 'primary.200',
                        color: 'white',
                        opacity: 0.7,
                      },
                    }}
                  >
                    {editingDocIndex !== null ? 'Lưu' : 'Thêm'}
                  </Button>
                </Box>
              )}
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ghi chú"
              value={formFields.notes}
              onChange={(e) => onFieldChange('notes', e.target.value)}
              variant="outlined"
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleSaveClick}
          variant="contained"
          color="primary"
          disabled={isSaving}
          startIcon={
            isSaving ? (
              <CircularProgress size={18} color="inherit" />
            ) : undefined
          }
        >
          {isSaving
            ? editingItem
              ? 'Đang cập nhật...'
              : 'Đang thêm...'
            : editingItem
              ? 'Cập nhật'
              : 'Thêm mới'}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>

      {/* Description Dialog */}
      <Dialog
        open={descriptionDialogOpen}
        onClose={() => setDescriptionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>💬 Thêm mô tả cho: {descriptionTarget?.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={4}
            label="Nội dung mô tả"
            placeholder="Nhập mô tả chi tiết..."
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
            sx={{ mt: 1 }}
            helperText={`Người thêm: ${getCurrentUser()} | Thời gian: ${new Date().toLocaleString('vi-VN')}`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDescriptionDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={saveDescription}
            variant="contained"
            disabled={!descriptionText.trim()}
            startIcon={<CommentIcon />}
          >
            Thêm mô tả
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default AddEditDialog;
