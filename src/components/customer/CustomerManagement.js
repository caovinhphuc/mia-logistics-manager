import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  Person,
  Phone,
  Email,
  Business
} from '@mui/icons-material';

const CustomerManagement = () => {
  const [customers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý khách hàng
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
        >
          Thêm khách hàng
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Customer Statistics */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Person sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6">Tổng khách hàng</Typography>
            <Typography variant="h4" color="primary">{customers.length}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Business sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h6">Khách doanh nghiệp</Typography>
            <Typography variant="h4" color="info.main">
              {customers.filter(c => c.type === 'business').length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Person sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h6">Khách cá nhân</Typography>
            <Typography variant="h4" color="success.main">
              {customers.filter(c => c.type === 'individual').length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Phone sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h6">Khách VIP</Typography>
            <Typography variant="h4" color="warning.main">
              {customers.filter(c => c.isVip).length}
            </Typography>
          </Paper>
        </Grid>

        {/* Search and Filter */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Grid>

        {/* Customer Table */}
        <Grid item xs={12}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã KH</TableCell>
                    <TableCell>Tên khách hàng</TableCell>
                    <TableCell>Loại KH</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Địa chỉ</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        <Typography color="textSecondary">
                          Chưa có khách hàng nào
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers
                      .filter(customer =>
                        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        customer.phone.includes(searchTerm) ||
                        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>{customer.code}</TableCell>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={customer.type === 'business' ? 'Doanh nghiệp' : 'Cá nhân'}
                              color={customer.type === 'business' ? 'primary' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{customer.phone}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.address}</TableCell>
                          <TableCell>
                            <Chip
                              label={customer.isVip ? 'VIP' : 'Thường'}
                              color={customer.isVip ? 'warning' : 'default'}
                              size="small"
                            />
                          </TableCell>
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
    </Container>
  );
};

export default CustomerManagement;