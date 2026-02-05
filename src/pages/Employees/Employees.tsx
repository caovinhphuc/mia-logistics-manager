import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import GridView from '../../components/shared/GridView';
import { employeesService } from '../../services/googleSheets/employeesService';

interface Employee {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [formData, setFormData] = useState({
    code: '',
    fullName: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    status: 'active',
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeesService.getEmployees();
      setEmployees(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await employeesService.updateEmployee(editing.id, formData);
      } else {
        await employeesService.createEmployee(formData);
      }
      setOpen(false);
      setEditing(null);
      setFormData({
        code: '',
        fullName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        status: 'active',
      });
      loadEmployees();
    } catch (err: any) {
      setError(err.message || 'Không thể lưu nhân viên');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return;
    try {
      await employeesService.deleteEmployee(id);
      loadEmployees();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa nhân viên');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditing(employee);
    setFormData({
      code: employee.code || '',
      fullName: employee.fullName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department || '',
      position: employee.position || '',
      status: employee.status || 'active',
    });
    setOpen(true);
  };

  const gridItems = employees.map((emp) => ({
    id: emp.id,
    title: emp.fullName || 'Chưa có tên',
    subtitle: emp.position || emp.department || 'Chưa có thông tin',
    avatar: emp.fullName ? emp.fullName[0].toUpperCase() : 'E',
    status: emp.status === 'active' ? 'Hoạt động' : 'Tạm dừng',
    description:
      `${emp.code ? `Mã: ${emp.code}` : ''} ${emp.email ? ` | Email: ${emp.email}` : ''}`.trim(),
  }));

  const tableColumns: DataTableColumn<Employee>[] = [
    {
      id: 'code',
      label: 'MÃ NV',
      width: 120,
    },
    {
      id: 'fullName',
      label: 'HỌ TÊN',
      width: 200,
    },
    {
      id: 'email',
      label: 'EMAIL',
      width: 200,
    },
    {
      id: 'phone',
      label: 'ĐIỆN THOẠI',
      width: 150,
    },
    {
      id: 'department',
      label: 'PHÒNG BAN',
      width: 150,
    },
    {
      id: 'position',
      label: 'CHỨC VỤ',
      width: 150,
    },
    {
      id: 'status',
      label: 'TRẠNG THÁI',
      width: 120,
      render: (emp) => (
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            display: 'inline-block',
            bgcolor: emp.status === 'active' ? 'success.light' : 'grey.300',
            color: emp.status === 'active' ? 'success.dark' : 'grey.700',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {emp.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
        </Box>
      ),
    },
    {
      id: 'actions',
      label: 'THAO TÁC',
      width: 150,
      render: (emp) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" onClick={() => handleEdit(emp)} color="primary">
            <Edit />
          </IconButton>
          <IconButton size="small" onClick={() => handleDelete(emp.id)} color="error">
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading && employees.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý Nhân sự
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('grid')}
            size="small"
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'table' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('table')}
            size="small"
          >
            Table
          </Button>
          <Button variant="contained" onClick={() => setOpen(true)}>
            + Thêm nhân viên
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {viewMode === 'grid' ? (
        <GridView
          items={gridItems}
          onEdit={(item) => {
            const emp = employees.find((e) => e.id === item.id);
            if (emp) handleEdit(emp);
          }}
          onDelete={(item) => {
            const emp = employees.find((e) => e.id === item.id);
            if (emp) handleDelete(emp.id);
          }}
        />
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {tableColumns.map((col) => (
                    <TableCell key={col.id}>
                      <strong>{col.label}</strong>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.id}>
                    {tableColumns.map((col) => (
                      <TableCell key={col.id}>
                        {col.render ? col.render(emp) : emp[col.id as keyof Employee]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
          setFormData({
            code: '',
            fullName: '',
            email: '',
            phone: '',
            department: '',
            position: '',
            status: 'active',
          });
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editing ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Mã nhân viên"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              fullWidth
            />
            <TextField
              label="Họ tên"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Điện thoại"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phòng ban"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              fullWidth
            />
            <TextField
              label="Chức vụ"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              fullWidth
            />
            <TextField
              label="Trạng thái"
              select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              fullWidth
              SelectProps={{
                native: true,
                inputProps: {
                  'aria-label': 'Trạng thái nhân viên',
                },
              }}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setEditing(null);
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editing ? 'Cập nhật' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees;
