import {
  Add,
  Assessment, AttachMoney, LocalShipping, TrendingUp
} from '@mui/icons-material';
import {
  Box,
  Button, Card,
  CardContent, Chip, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Typography
} from '@mui/material';
import { useState } from 'react';

const ReportsAnalytics = () => {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('revenue');

  // Sample data
  const stats = {
    totalRevenue: 0,
    totalOrders: 0,
    completedDeliveries: 0,
    pendingOrders: 0
  };

  const recentReports = [];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Báo cáo & Phân tích
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
        >
          Tạo báo cáo
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Filter Controls */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Thời gian</InputLabel>
                  <Select
                    value={dateRange}
                    label="Thời gian"
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <MenuItem value="week">7 ngày qua</MenuItem>
                    <MenuItem value="month">30 ngày qua</MenuItem>
                    <MenuItem value="quarter">3 tháng qua</MenuItem>
                    <MenuItem value="year">12 tháng qua</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Loại báo cáo</InputLabel>
                  <Select
                    value={reportType}
                    label="Loại báo cáo"
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value="revenue">Doanh thu</MenuItem>
                    <MenuItem value="orders">Đơn hàng</MenuItem>
                    <MenuItem value="customers">Khách hàng</MenuItem>
                    <MenuItem value="inventory">Tồn kho</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Key Statistics */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">Tổng doanh thu</Typography>
              <Typography variant="h4" color="primary">
                {stats.totalRevenue.toLocaleString('vi-VN')}₫
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6">Tổng đơn hàng</Typography>
              <Typography variant="h4" color="info.main">
                {stats.totalOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalShipping sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6">Giao thành công</Typography>
              <Typography variant="h4" color="success.main">
                {stats.completedDeliveries}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6">Đang xử lý</Typography>
              <Typography variant="h4" color="warning.main">
                {stats.pendingOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Biểu đồ thống kê
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="textSecondary">
                Biểu đồ sẽ được hiển thị tại đây
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Recent Reports */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Báo cáo gần đây
            </Typography>
            {recentReports.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="textSecondary">
                  Chưa có báo cáo nào
                </Typography>
              </Box>
            ) : (
              <Box>
                {recentReports.map((report) => (
                  <Box key={report.id} sx={{ mb: 2, p: 1, border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                    <Typography variant="subtitle2">{report.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {report.createdDate}
                    </Typography>
                    <Chip
                      label={report.status}
                      size="small"
                      color={report.status === 'Hoàn thành' ? 'success' : 'primary'}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Data Table */}
        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ngày</TableCell>
                    <TableCell>Doanh thu</TableCell>
                    <TableCell>Số đơn</TableCell>
                    <TableCell>Tỷ lệ hoàn thành</TableCell>
                    <TableCell>Khách hàng mới</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">
                        Chưa có dữ liệu thống kê
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReportsAnalytics;
