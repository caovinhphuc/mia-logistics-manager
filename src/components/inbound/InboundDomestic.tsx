import React, { useState, useEffect } from 'react';
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
  Popover,
  Tooltip,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  LocalShipping as TruckIcon,
  MoreVert as MoreVertIcon,
  Luggage as LuggageIcon,
  Backpack as BackpackIcon,
  CardGiftcard as GiftIcon,
  TravelExplore as TravelExploreIcon,
  Handyman as HandymanIcon,
  Inventory as InventoryIcon,
  Inventory2 as Inventory2Icon,
  Description as DescriptionIcon,
  BusinessCenter as BusinessCenterIcon,
  CalendarMonth as CalendarIcon,
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from '@mui/icons-material';
// Import service functions
import {
  getInboundDomesticItems,
  addInboundDomesticItem,
  updateInboundDomesticItem,
  deleteInboundDomesticItem,
} from '../../services/googleSheets/inboundDomesticService';

// Removed MUI X Date Pickers to avoid extra dependency

interface InboundDomesticItem {
  id: string;
  date: string;
  supplier: string; // Nhà cung cấp
  origin: string; // Xuất xứ (có thể ẩn)
  destination: string; // Kho nhận
  product: string; // Mã Sản phẩm
  quantity: number; // Số lượng
  status: 'pending' | 'in-transit' | 'arrived' | 'completed';
  category: string; // Phân loại hàng hóa
  carrier: string; // Nhà vận chuyển
  purpose: 'online' | 'offline'; // Mục đích
  receiveTime: string; // Thời gian nhận
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

const InboundDomestic: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<InboundDomesticItem | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('table');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Calendar view states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateItems, setSelectedDateItems] = useState<InboundDomesticItem[]>([]);
  const [addFromCalendar, setAddFromCalendar] = useState<Date | null>(null);

  // Calendar dropdown menu states
  const [calendarMenuAnchor, setCalendarMenuAnchor] = useState<null | HTMLElement>(null);
  const [calendarMenuDate, setCalendarMenuDate] = useState<Date | null>(null);

  // Action menu state
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedItemForAction, setSelectedItemForAction] = useState<InboundDomesticItem | null>(
    null
  );

  // Data state
  const [inboundItems, setInboundItems] = useState<InboundDomesticItem[]>([]);

  // Load data from Google Sheets
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getInboundDomesticItems();
        setInboundItems(data);
      } catch (err) {
        console.error('Error loading inbound domestic items:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper functions
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'in-transit':
        return 'Đang vận chuyển';
      case 'arrived':
        return 'Đã đến';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const getStatusColorForChip = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-transit':
        return 'info';
      case 'arrived':
        return 'success';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

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
      case 'Thực phẩm':
        return <InventoryIcon />;
      case 'Xây dựng':
        return <HandymanIcon />;
      default:
        return <InventoryIcon />;
    }
  };

  // CRUD Operations
  const handleAddItem = async (
    item: Omit<InboundDomesticItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      setLoading(true);
      await addInboundDomesticItem(item);
      // Reload data
      const data = await getInboundDomesticItems();
      setInboundItems(data);
      setOpenDialog(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Không thể thêm mục. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async (id: string, updates: Partial<InboundDomesticItem>) => {
    try {
      setLoading(true);
      await updateInboundDomesticItem(id, updates);
      // Reload data
      const data = await getInboundDomesticItems();
      setInboundItems(data);
      setOpenDialog(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Không thể cập nhật mục. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      setLoading(true);
      await deleteInboundDomesticItem(id);
      // Reload data
      const data = await getInboundDomesticItems();
      setInboundItems(data);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Không thể xóa mục. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInboundDomesticItems();
      setInboundItems(data);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Không thể làm mới dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search logic
  const filteredItems = inboundItems.filter((item) => {
    const matchesSearch =
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.carrier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(inboundItems.map((item) => item.category))).filter(Boolean);

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getItemsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredItems.filter((item) => item.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedDateItems(getItemsForDate(date));
  };

  const handleAddFromCalendar = (date: Date) => {
    setAddFromCalendar(date);
    setEditingItem(null);
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
    setOpenDialog(true);
  };

  const handleEdit = (item: InboundDomesticItem) => {
    setEditingItem(item);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      await handleDeleteItem(id);
    }
  };

  const handleSave = async (item: Partial<InboundDomesticItem>) => {
    if (editingItem) {
      await handleUpdateItem(editingItem.id, item);
    } else {
      const newItem = {
        date: addFromCalendar
          ? addFromCalendar.toLocaleDateString('vi-VN')
          : new Date().toLocaleDateString('vi-VN'),
        supplier: '',
        origin: '',
        destination: '',
        product: '',
        quantity: 0,
        status: 'pending' as const,
        category: '',
        carrier: '',
        purpose: 'offline' as const,
        receiveTime: '',
        notes: '',
        ...item,
      };
      await handleAddItem(newItem);
    }
    setAddFromCalendar(null);
  };
  // Action menu handlers
  const handleActionMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    item: InboundDomesticItem
  ) => {
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
      case 'add_calendar':
        // Set the item's receive time as the selected date for calendar
        setAddFromCalendar(new Date(selectedItemForAction.receiveTime));
        setOpenDialog(true);
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
          <HomeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Lịch nhập hàng Quốc nội
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleRefresh}
            disabled={loading}
            startIcon={loading ? <ScheduleIcon /> : <ScheduleIcon />}
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
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
      {/* Error Message */}
      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        </Box>
      )}
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
                <TruckIcon color="info" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {inboundItems.filter((item) => item.status === 'in-transit').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đang vận chuyển
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
                    {inboundItems.filter((item) => item.status === 'arrived').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đã đến
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
                    Chờ xử lý
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
            placeholder="Nhà cung cấp, sản phẩm, kho nhận..."
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={statusFilter}
              label="Trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ xử lý</MenuItem>
              <MenuItem value="in-transit">Đang vận chuyển</MenuItem>
              <MenuItem value="arrived">Đã đến</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Phân loại</InputLabel>
            <Select
              value={categoryFilter}
              label="Phân loại"
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('all');
            }}
            size="small"
          >
            Xóa bộ lọc
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            Hiển thị {filteredItems.length} / {inboundItems.length} mục
          </Typography>
        </Box>
      </Paper>
      {/* Content */}
      {viewMode === 'table' ? (
        <Paper sx={{ p: 2 }}>
          <TableContainer>
            <Table
              size="small"
              sx={{
                tableLayout: 'auto',
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
                  <TableCell>Nhà cung cấp</TableCell>
                  <TableCell>Kho nhận</TableCell>
                  <TableCell>Mã Sản phẩm</TableCell>
                  <TableCell>Phân loại</TableCell>
                  <TableCell>SL</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>NVC</TableCell>
                  <TableCell>Mục đích</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {/* tiêu đề tác vụ để trống */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      {(() => {
                        const d = new Date(item.date);
                        return isNaN(d.getTime()) ? 'Chưa có' : d.toLocaleDateString('vi-VN');
                      })()}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={item.supplier}>
                        <Typography noWrap sx={{ fontSize: '0.65rem' }}>
                          {item.supplier}
                        </Typography>
                      </Tooltip>
                    </TableCell>
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
                    <TableCell>
                      <Tooltip title={item.carrier}>
                        <Typography noWrap sx={{ fontSize: '0.65rem' }}>
                          {item.carrier}
                        </Typography>
                      </Tooltip>
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
        /* Calendar View */
        <Box>
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
                      backgroundColor: 'grey.100',
                      border: '1px solid',
                      borderColor: 'grey.300',
                    }}
                  >
                    {day}
                  </Box>
                </Grid>
              ))}
            </Grid>

            {/* Calendar days */}
            <Grid container spacing={0}>
              {(() => {
                const daysInMonth = getDaysInMonth(currentDate);
                const firstDay = getFirstDayOfMonth(currentDate);
                const days = [];

                // Empty cells for days before the first day of the month
                for (let i = 0; i < firstDay; i++) {
                  days.push(
                    <Grid item xs={12 / 7} key={`empty-${i}`}>
                      <Box
                        sx={{
                          minHeight: 120,
                          border: '1px solid',
                          borderColor: 'grey.300',
                          backgroundColor: 'grey.50',
                        }}
                      />
                    </Grid>
                  );
                }

                // Days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                  const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const itemsForDate = getItemsForDate(cellDate);
                  const isToday = cellDate.toDateString() === new Date().toDateString();
                  const isSelected =
                    selectedDate && cellDate.toDateString() === selectedDate.toDateString();

                  days.push(
                    <Grid item xs={12 / 7} key={day}>
                      <Box
                        sx={{
                          minHeight: 120,
                          border: '1px solid',
                          borderColor: 'grey.300',
                          backgroundColor: isToday
                            ? 'primary.50'
                            : isSelected
                              ? 'secondary.50'
                              : 'white',
                          p: 1,
                          position: 'relative',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: isToday
                              ? 'primary.100'
                              : isSelected
                                ? 'secondary.100'
                                : 'grey.50',
                          },
                        }}
                        onClick={() => handleDateClick(cellDate)}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isToday ? 'bold' : 'normal',
                            color: isToday ? 'primary.main' : 'text.primary',
                            mb: 1,
                          }}
                        >
                          {day}
                        </Typography>

                        {/* Items for this date */}
                        {itemsForDate.slice(0, 3).map((item) => (
                          <Box
                            key={item.id}
                            sx={{
                              backgroundColor:
                                getStatusColorForChip(item.status) === 'success'
                                  ? 'success.100'
                                  : getStatusColorForChip(item.status) === 'warning'
                                    ? 'warning.100'
                                    : getStatusColorForChip(item.status) === 'info'
                                      ? 'info.100'
                                      : 'grey.100',
                              color:
                                getStatusColorForChip(item.status) === 'success'
                                  ? 'success.800'
                                  : getStatusColorForChip(item.status) === 'warning'
                                    ? 'warning.800'
                                    : getStatusColorForChip(item.status) === 'info'
                                      ? 'info.800'
                                      : 'grey.800',
                              p: 0.5,
                              mb: 0.5,
                              borderRadius: 0.5,
                              fontSize: '0.7rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.supplier}
                          </Box>
                        ))}

                        {itemsForDate.length > 3 && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.6rem',
                            }}
                          >
                            +{itemsForDate.length - 3} khác
                          </Typography>
                        )}

                        {/* Menu button */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            '&:hover': {
                              opacity: 1,
                            },
                          }}
                          onClick={(e) => handleCalendarMenuOpen(e, cellDate)}
                        >
                          <IconButton
                            size="small"
                            sx={{
                              width: 20,
                              height: 20,
                              '&:hover': {
                                bgcolor: 'grey.200',
                              },
                            }}
                          >
                            <MoreVertIcon
                              sx={{
                                fontSize: '0.8rem',
                                color: 'grey.600',
                              }}
                            />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  );
                }

                return days;
              })()}
            </Grid>
          </Box>

          {/* Selected Date Items */}
          {selectedDate && selectedDateItems.length > 0 && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Lịch nhập hàng - {selectedDate.toLocaleDateString('vi-VN')}
              </Typography>
              <Grid container spacing={2}>
                {selectedDateItems.map((item) => (
                  <Grid item xs={12} md={6} lg={4} key={item.id}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1,
                          }}
                        >
                          <Typography variant="h6" component="div">
                            {item.supplier}
                          </Typography>
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
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Sản phẩm:</strong> {item.product}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Số lượng:</strong> {item.quantity.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Từ:</strong> {item.origin}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Đến:</strong> {item.destination}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Thời gian nhận:</strong>{' '}
                          {(() => {
                            const d = new Date(item.receiveTime);
                            return isNaN(d.getTime()) ? 'Chưa có' : d.toLocaleDateString('vi-VN');
                          })()}
                        </Typography>
                        {item.notes && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Ghi chú:</strong> {item.notes}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <IconButton size="small" onClick={() => handleEdit(item)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(item.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Box>
      )}

      {/* Calendar Menu */}
      <Popover
        open={Boolean(calendarMenuAnchor)}
        anchorEl={calendarMenuAnchor}
        onClose={handleCalendarMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List>
          <ListItemButton onClick={() => handleCalendarMenuAction('add')}>
            <ListItemText primary="Thêm lịch nhập hàng" />
          </ListItemButton>
          <ListItemButton onClick={() => handleCalendarMenuAction('view')}>
            <ListItemText primary="Xem chi tiết" />
          </ListItemButton>
        </List>
      </Popover>
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
            {!addFromCalendar && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mã ID"
                  defaultValue={editingItem?.id || ''}
                  variant="outlined"
                  required
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nhà cung cấp"
                defaultValue={editingItem?.supplier || ''}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sản phẩm"
                defaultValue={editingItem?.product || ''}
                variant="outlined"
                required
              />
            </Grid>
            {addFromCalendar && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày nhận hàng"
                  type="date"
                  defaultValue={addFromCalendar.toLocaleDateString('vi-VN')}
                  variant="outlined"
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={() => handleSave({})} variant="contained">
            {editingItem ? 'Cập nhật' : 'Thêm mới'}
          </Button>
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
      >
        <Box sx={{ p: 1 }}>
          <MenuItem
            onClick={() => handleActionMenuAction('edit')}
            sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' } }}
          >
            <EditIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Sửa
          </MenuItem>
          <MenuItem
            onClick={() => handleActionMenuAction('add_calendar')}
            sx={{ fontSize: { xs: '0.6rem', sm: '0.65rem' } }}
          >
            <ScheduleIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Thêm lịch
          </MenuItem>
          <MenuItem
            onClick={() => handleActionMenuAction('delete')}
            sx={{
              fontSize: { xs: '0.6rem', sm: '0.65rem' },
              color: 'error.main',
            }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: '1rem' }} />
            Xóa
          </MenuItem>
        </Box>
      </Popover>
    </Box>
  );
};

export default InboundDomestic;
