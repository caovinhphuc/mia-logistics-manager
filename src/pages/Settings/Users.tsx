import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

interface User {
  id: string;
  email: string;
  fullName: string;
  roleId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Role {
  id: string;
  name: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    roleId: '',
    status: 'active',
    password: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        fetch('http://localhost:3100/api/auth/users'),
        fetch('http://localhost:3100/api/roles'),
      ]);

      if (!usersRes.ok || !rolesRes.ok) throw new Error('Không thể tải dữ liệu');

      const [usersData, rolesData] = await Promise.all([usersRes.json(), rolesRes.json()]);

      setUsers(usersData);
      setRoles(rolesData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        // Update user
        const body: any = {
          fullName: formData.fullName,
          roleId: formData.roleId,
          status: formData.status,
        };

        const response = await fetch(`http://localhost:3100/api/auth/users/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Không thể cập nhật người dùng');
        }
      } else {
        // Register new user
        if (!formData.email || !formData.password) {
          setError('Email và mật khẩu là bắt buộc');
          return;
        }

        const body = {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          roleId: formData.roleId,
          status: formData.status,
        };

        const response = await fetch('http://localhost:3100/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Không thể tạo người dùng');
        }
      }

      setOpen(false);
      setEditing(null);
      setFormData({ email: '', fullName: '', roleId: '', status: 'active', password: '' });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Không thể lưu người dùng');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      const response = await fetch(`http://localhost:3100/api/auth/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'inactive' }),
      });
      if (!response.ok) throw new Error('Không thể xóa người dùng');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa người dùng');
    }
  };

  const handleEdit = (user: User) => {
    setEditing(user);
    setFormData({
      email: user.email || '',
      fullName: user.fullName || '',
      roleId: user.roleId || '',
      status: user.status || 'active',
      password: '',
    });
    setOpen(true);
  };

  const getRoleName = (roleId: string) => {
    return roles.find((r) => r.id === roleId)?.name || roleId;
  };

  if (loading && users.length === 0) {
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
          Quản lý Người dùng
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Thêm người dùng
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Họ tên</strong>
              </TableCell>
              <TableCell>
                <strong>Vai trò</strong>
              </TableCell>
              <TableCell>
                <strong>Trạng thái</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Thao tác</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <strong>{user.fullName}</strong>
                </TableCell>
                <TableCell>{getRoleName(user.roleId)}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'inline-block',
                      bgcolor: user.status === 'active' ? 'success.light' : 'grey.300',
                      color: user.status === 'active' ? 'success.dark' : 'grey.700',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {user.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEdit(user)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(user.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
          setFormData({ email: '', fullName: '', roleId: '', status: 'active', password: '' });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editing ? 'Sửa người dùng' : 'Thêm người dùng mới'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              required
              disabled={!!editing}
            />
            {!editing && (
              <TextField
                label="Mật khẩu"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                fullWidth
                required
              />
            )}
            <TextField
              label="Họ tên"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                label="Vai trò"
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Trạng thái"
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Tạm dừng</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setEditing(null);
              setFormData({ email: '', fullName: '', roleId: '', status: 'active', password: '' });
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

export default Users;
