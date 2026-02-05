import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import {
  Assessment as ReportIcon,
  FileDownload as DownloadIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { getInboundScheduleItems } from '../../services/googleSheets/inboundScheduleService';
import { getInboundDomesticItems } from '../../services/googleSheets/inboundDomesticService';
import { InboundItem } from './types/inbound';
import { AdvancedDataTable, StatCard } from '../../shared/components/ui';
import type { AdvancedTableColumn } from '../../shared/components/ui/AdvancedDataTable';

const InboundReports: React.FC = () => {
  // States
  const [inboundItems, setInboundItems] = useState<InboundItem[]>([]);
  const [domesticItems, setDomesticItems] = useState<InboundItem[]>([]);
  const [reportType, setReportType] = useState<string>('summary');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [internationalData, domesticData] = await Promise.all([
          getInboundScheduleItems(),
          getInboundDomesticItems(),
        ]);
        setInboundItems(internationalData);
        // Convert domestic items to InboundItem format
        const convertedDomesticData = domesticData.map((item) => ({
          ...item,
          type: 'domestic' as const,
          poNumbers: [],
          timeline: [],
          documentStatus: [],
          estimatedArrival: item.estimatedArrival || '',
          actualArrival: item.actualArrival || '',
          pi: item.pi || '',
        })) as InboundItem[];
        setDomesticItems(convertedDomesticData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Combined data
  const allItems = [...inboundItems, ...domesticItems];

  // Table columns configuration
  const columns: AdvancedTableColumn<InboundItem>[] = [
    {
      id: 'date',
      label: 'Ngày',
      format: 'date',
      minWidth: 100,
      sortable: true,
    },
    {
      id: 'supplier',
      label: 'Nhà cung cấp',
      minWidth: 150,
      sortable: true,
      searchable: true,
    },
    {
      id: 'type',
      label: 'Loại',
      minWidth: 80,
      align: 'center',
      sortable: true,
      render: (value) => (
        <Chip
          label={value === 'international' ? 'QT' : 'QN'}
          size="small"
          color={value === 'international' ? 'primary' : 'secondary'}
          variant="outlined"
          sx={{
            fontWeight: 600,
            fontSize: '0.7rem',
            textTransform: 'uppercase',
          }}
        />
      ),
    },
    {
      id: 'product',
      label: 'Sản phẩm',
      minWidth: 180,
      sortable: true,
      searchable: true,
    },
    {
      id: 'category',
      label: 'Phân loại',
      minWidth: 120,
      sortable: true,
      render: (value) => (value ? String(value) : 'Chưa phân loại'),
    },
    {
      id: 'quantity',
      label: 'Số lượng',
      format: 'number',
      minWidth: 100,
      align: 'right',
      sortable: true,
    },
    {
      id: 'container',
      label: 'Container',
      format: 'number',
      minWidth: 80,
      align: 'center',
      sortable: true,
    },
    {
      id: 'status',
      label: 'Trạng thái',
      format: 'status',
      minWidth: 120,
      align: 'center',
      sortable: true,
      render: (value) => {
        const statusMap: Record<
          string,
          {
            label: string;
            color: 'success' | 'warning' | 'error' | 'info' | 'default';
          }
        > = {
          completed: { label: 'Hoàn thành', color: 'success' },
          'in-transit': { label: 'Đang vận chuyển', color: 'info' },
          pending: { label: 'Chờ xử lý', color: 'warning' },
          confirmed: { label: 'Đã xác nhận', color: 'info' },
          arrived: { label: 'Đã đến', color: 'success' },
        };
        const status = statusMap[String(value)] || {
          label: 'Chưa xác định',
          color: 'default',
        };
        return (
          <Chip
            label={status.label}
            color={status.color}
            size="small"
            sx={{
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              letterSpacing: '0.5px',
            }}
          />
        );
      },
    },
    {
      id: 'destination',
      label: 'Kho nhận',
      minWidth: 120,
      sortable: true,
      render: (value) => {
        if (!value) return 'Chưa có';
        const warehouseName = String(value).split(' - ')[0];
        return warehouseName;
      },
    },
  ];

  // Filter data
  const filteredData = allItems.filter((item) => {
    // Filter by type
    if (selectedType !== 'all' && item.type !== selectedType) return false;

    // Filter by date range
    if (dateFrom && dateTo) {
      const parseDate = (dateStr: string): Date => {
        if (dateStr.includes('/')) {
          const [day, month, year] = dateStr.split('/');
          return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        return new Date(dateStr);
      };

      const itemDate = parseDate(item.date);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);

      if (itemDate < fromDate || itemDate > toDate) return false;
    }

    return true;
  });

  // Statistics
  const stats = {
    totalItems: filteredData.length,
    international: filteredData.filter((item) => item.type === 'international').length,
    domestic: filteredData.filter((item) => item.type === 'domestic').length,
    totalQuantity: filteredData.reduce((sum, item) => sum + (item.quantity || 0), 0),
    totalContainers: filteredData.reduce(
      (sum, item) => sum + (parseInt(item.container?.toString() || '0') || 0),
      0
    ),
    completedItems: filteredData.filter((item) => item.status === 'completed').length,
    pendingItems: filteredData.filter((item) => item.status === 'pending').length,
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ReportIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Báo cáo nhập hàng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Phân tích và thống kê chi tiết
          </Typography>
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          🔍 Bộ lọc báo cáo
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Loại báo cáo</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Loại báo cáo"
            >
              <MenuItem value="summary">📊 Tổng quan</MenuItem>
              <MenuItem value="timeline">⏰ Timeline</MenuItem>
              <MenuItem value="documents">📋 Chứng từ</MenuItem>
              <MenuItem value="performance">📈 Hiệu suất</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Loại hàng</InputLabel>
            <Select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              label="Loại hàng"
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="international">🌍 Quốc tế</MenuItem>
              <MenuItem value="domestic">🏠 Quốc nội</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Từ ngày"
            type="date"
            size="small"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
          />

          <TextField
            label="Đến ngày"
            type="date"
            size="small"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
          />

          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setReportType('summary');
              setSelectedType('all');
              setDateFrom('');
              setDateTo('');
            }}
          >
            Đặt lại
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Làm mới
          </Button>
        </Box>
      </Paper>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <StatCard
            title="Tổng lô hàng"
            value={stats.totalItems}
            icon={<TrendingUpIcon />}
            color="primary"
            change={{
              value: `🌍 ${stats.international} | 🏠 ${stats.domestic}`,
              positive: true,
            }}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <StatCard
            title="Tổng sản phẩm"
            value={stats.totalQuantity.toLocaleString()}
            icon={<PieChartIcon />}
            color="success"
            change={{ value: '+12% so với tháng trước', positive: true }}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <StatCard
            title="Containers"
            value={stats.totalContainers}
            icon={<BarChartIcon />}
            color="info"
            change={{ value: '+5% so với tháng trước', positive: true }}
          />
        </Grid>

        <Grid item xs={6} md={3}>
          <StatCard
            title="Tỷ lệ hoàn thành"
            value={`${((stats.completedItems / (stats.totalItems || 1)) * 100).toFixed(1)}%`}
            icon={<TimelineIcon />}
            color="warning"
            change={{
              value: `${stats.completedItems}/${stats.totalItems} lô hàng`,
              positive: true,
            }}
          />
        </Grid>
      </Grid>

      {/* Report Content */}
      <Paper sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📊{' '}
            {(() => {
              switch (reportType) {
                case 'summary':
                  return 'Báo cáo tổng quan';
                case 'timeline':
                  return 'Báo cáo timeline';
                case 'documents':
                  return 'Báo cáo chứng từ';
                case 'performance':
                  return 'Báo cáo hiệu suất';
                default:
                  return 'Báo cáo';
              }
            })()}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Report Table */}
        <AdvancedDataTable
          columns={columns}
          data={filteredData}
          title=""
          subtitle=""
          searchable={false}
          pagination={false}
          showRowNumbers={false}
          alternateRowColors={true}
          hoverEffects={true}
          emptyMessage="Không có dữ liệu báo cáo"
          actions={
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" size="small" startIcon={<PrintIcon />}>
                In báo cáo
              </Button>
              <Button variant="contained" size="small" startIcon={<DownloadIcon />}>
                Xuất Excel
              </Button>
            </Stack>
          }
        />
      </Paper>

      {/* Active Filters */}
      {(selectedType !== 'all' || dateFrom || dateTo) && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            🏷️ Bộ lọc đang áp dụng:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {selectedType !== 'all' && (
              <Chip
                label={`${selectedType === 'international' ? '🌍 Quốc tế' : '🏠 Quốc nội'}`}
                size="small"
                color="primary"
                variant="outlined"
                onDelete={() => setSelectedType('all')}
              />
            )}
            {dateFrom && dateTo && (
              <Chip
                label={`📅 ${dateFrom} → ${dateTo}`}
                size="small"
                color="info"
                variant="outlined"
                onDelete={() => {
                  setDateFrom('');
                  setDateTo('');
                }}
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InboundReports;
