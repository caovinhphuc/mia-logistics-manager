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
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

interface Role {
  id: string;
  name: string;
  description: string;
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3100/api/roles');
      if (!response.ok) throw new Error('Không thể tải danh sách vai trò');
      const data = await response.json();
      setRoles(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách vai trò');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editing
        ? `http://localhost:3100/api/roles/${editing.id}`
        : 'http://localhost:3100/api/roles';
      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Không thể lưu vai trò');

      setOpen(false);
      setEditing(null);
      setFormData({ name: '', description: '' });
      loadRoles();
    } catch (err: any) {
      setError(err.message || 'Không thể lưu vai trò');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vai trò này?')) return;
    try {
      const response = await fetch(`http://localhost:3100/api/roles/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Không thể xóa vai trò');
      loadRoles();
    } catch (err: any) {
      setError(err.message || 'Không thể xóa vai trò');
    }
  };

  const handleEdit = (role: Role) => {
    setEditing(role);
    setFormData({
      name: role.name || '',
      description: role.description || '',
    });
    setOpen(true);
  };

  if (loading && roles.length === 0) {
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
          Quản lý Vai trò
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Thêm vai trò
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
                <strong>Mã</strong>
              </TableCell>
              <TableCell>
                <strong>Tên vai trò</strong>
              </TableCell>
              <TableCell>
                <strong>Mô tả</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Thao tác</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>
                  <strong>{role.name}</strong>
                </TableCell>
                <TableCell>{role.description || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEdit(role)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(role.id)} color="error">
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
          setFormData({ name: '', description: '' });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editing ? 'Sửa vai trò' : 'Thêm vai trò mới'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              label="Tên vai trò"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
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

export default Roles;
