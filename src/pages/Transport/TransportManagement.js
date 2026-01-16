import { Add, Assessment, Delete, Edit, LocalShipping } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import ReportsCenter from '../../components/reports/ReportsCenter';

const TransportManagement = () => {
  const [transports] = useState([]);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

  const handleOpenReports = () => {
    setReportDialogOpen(true);
  };

  const handleCloseReports = () => {
    setReportDialogOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý vận chuyển
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Assessment />} onClick={handleOpenReports}>
            Báo cáo
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            Thêm đơn vận chuyển
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <LocalShipping sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6">Đang giao</Typography>
            <Typography variant="h4" color="primary">
              0
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <LocalShipping sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h6">Chờ xử lý</Typography>
            <Typography variant="h4" color="warning.main">
              0
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <LocalShipping sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h6">Hoàn thành</Typography>
            <Typography variant="h4" color="success.main">
              0
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <LocalShipping sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h6">Hủy</Typography>
            <Typography variant="h4" color="error.main">
              0
            </Typography>
          </Paper>
        </Grid>

        {/* Transport Table */}
        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã đơn</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Điểm đi</TableCell>
                    <TableCell>Điểm đến</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        <Typography color="textSecondary">Chưa có đơn vận chuyển nào</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transports.map((transport) => (
                      <TableRow key={transport.id}>
                        <TableCell>{transport.code}</TableCell>
                        <TableCell>{transport.customer}</TableCell>
                        <TableCell>{transport.origin}</TableCell>
                        <TableCell>{transport.destination}</TableCell>
                        <TableCell>
                          <Chip
                            label={transport.status}
                            color={
                              transport.status === 'Hoàn thành'
                                ? 'success'
                                : transport.status === 'Đang giao'
                                  ? 'primary'
                                  : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>{transport.createdDate}</TableCell>
                        <TableCell>
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog Báo cáo */}
      <Dialog
        open={reportDialogOpen}
        onClose={handleCloseReports}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Assessment sx={{ mr: 1 }} />
            Báo cáo vận chuyển
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <ReportsCenter />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReports}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TransportManagement;
