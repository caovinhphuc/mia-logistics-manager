import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ViewList as ListIcon,
  ViewModule as ModuleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { Carrier } from '../../../services/googleSheets/carriersService';
import { useCarriers, useDeleteCarrier } from '../hooks/useCarriers';
import CreateCarrierDialog from './CreateCarrierDialog';

type ViewMode = 'table' | 'grid';

const formatCurrency = (value?: string | number | null) => {
  if (!value) {
    return 'Chưa có';
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric) || numeric <= 0) {
    return 'Chưa có';
  }

  return numeric.toLocaleString('vi-VN');
};

const CarriersList: React.FC = () => {
  const { data, isLoading, error, refetch } = useCarriers();
  const deleteCarrier = useDeleteCarrier();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const carriers = useMemo(() => data ?? [], [data]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (carrier: Carrier) => {
    if (!carrier?.carrierId) {
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn xoá nhà vận chuyển "${carrier.name || carrier.carrierId}"?`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(carrier.carrierId);
    try {
      await deleteCarrier.mutateAsync(carrier.carrierId);
      await refetch();
    } finally {
      setDeletingId(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingCarrier(null);
  };

  const handleDialogSuccess = async () => {
    handleDialogClose();
    await refetch();
  };

  const gridItems = useMemo(() => {
    return carriers.map((carrier) => ({
      id: carrier.carrierId,
      title: carrier.name || 'Chưa có tên',
      subtitle: carrier.serviceAreas || 'Chưa có khu vực',
      contactPerson: carrier.contactPerson,
      phone: carrier.phone,
      pricingMethod: carrier.pricingMethod,
      baseRate: carrier.baseRate,
      perKmRate: carrier.perKmRate,
      perM3Rate: carrier.perM3Rate,
    }));
  }, [carriers]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 2,
        }}
      >
        <Typography color="error" variant="h6">
          Không thể tải danh sách nhà vận chuyển
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <CreateCarrierDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        carrier={editingCarrier ?? undefined}
        onSuccess={handleDialogSuccess}
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Nhà vận chuyển
          </Typography>
          <Typography color="text.secondary">
            Tổng cộng: <strong>{carriers.length}</strong> nhà vận chuyển
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<ModuleIcon fontSize="small" />}
            onClick={() => setViewMode('grid')}
          >
            Lưới
          </Button>
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<ListIcon fontSize="small" />}
            onClick={() => setViewMode('table')}
          >
            Bảng
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingCarrier(null);
              setDialogOpen(true);
            }}
          >
            Thêm mới
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            Làm mới
          </Button>
        </Stack>
      </Stack>

      {carriers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Chưa có nhà vận chuyển nào trong hệ thống.</Typography>
        </Paper>
      ) : viewMode === 'table' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Liên hệ</TableCell>
                <TableCell>Điện thoại</TableCell>
                <TableCell>Phương thức</TableCell>
                <TableCell align="right">Phí cơ bản</TableCell>
                <TableCell align="right">Phí/km</TableCell>
                <TableCell align="right">Phí/m³</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carriers.map((carrier) => (
                <TableRow key={carrier.carrierId} hover>
                  <TableCell>
                    <Typography fontFamily="monospace" fontWeight={700}>
                      {carrier.carrierId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600}>{carrier.name || 'Chưa có tên'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {carrier.serviceAreas || 'Chưa có khu vực'}
                    </Typography>
                  </TableCell>
                  <TableCell>{carrier.contactPerson || 'Chưa có'}</TableCell>
                  <TableCell>
                    <Typography fontFamily="monospace" color="primary">
                      {carrier.phone || 'Chưa có'}
                    </Typography>
                  </TableCell>
                  <TableCell>{carrier.pricingMethod || 'Chưa có'}</TableCell>
                  <TableCell align="right">{formatCurrency(carrier.baseRate)}</TableCell>
                  <TableCell align="right">{formatCurrency(carrier.perKmRate)}</TableCell>
                  <TableCell align="right">{formatCurrency(carrier.perM3Rate)}</TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: carrier.isActive ? 'success.light' : 'grey.200',
                        color: carrier.isActive ? 'success.dark' : 'text.secondary',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {carrier.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingCarrier(carrier);
                          setDialogOpen(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(carrier)}
                        disabled={deletingId === carrier.carrierId || deleteCarrier.isPending}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={2}>
          {gridItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
              <Paper
                sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.subtitle}
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight={600}>Người liên hệ</Typography>
                  <Typography color="text.secondary">{item.contactPerson || 'Chưa có'}</Typography>
                </Box>
                <Box>
                  <Typography fontWeight={600}>Điện thoại</Typography>
                  <Typography fontFamily="monospace" color="primary">
                    {item.phone || 'Chưa có'}
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight={600}>Phương thức</Typography>
                  <Typography color="text.secondary">{item.pricingMethod || 'Chưa có'}</Typography>
                </Box>
                <Box>
                  <Typography fontWeight={600}>Định giá</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cơ bản: {formatCurrency(item.baseRate)} VNĐ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    /km: {formatCurrency(item.perKmRate)} VNĐ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    /m³: {formatCurrency(item.perM3Rate)} VNĐ
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} justifyContent="flex-end" mt="auto">
                  <Button
                    size="small"
                    startIcon={<EditIcon fontSize="small" />}
                    onClick={() => {
                      const carrier = carriers.find((c) => c.carrierId === item.id) || null;
                      setEditingCarrier(carrier);
                      setDialogOpen(true);
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon fontSize="small" />}
                    onClick={() => {
                      const carrier = carriers.find((c) => c.carrierId === item.id);
                      if (carrier) {
                        handleDelete(carrier);
                      }
                    }}
                    disabled={deletingId === item.id || deleteCarrier.isPending}
                  >
                    Xoá
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CarriersList;
