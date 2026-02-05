import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { Delete, Add } from '@mui/icons-material';

interface Permission {
  roleId: string;
  resource: string;
  action: string;
}

interface Role {
  id: string;
  name: string;
}

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    roleId: '',
    resource: '',
    action: '',
  });

  const resources = [
    'employees',
    'carriers',
    'transfers',
    'locations',
    'transport-requests',
    'settings',
  ];
  const actions = ['view', 'create', 'update', 'delete'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [permsRes, rolesRes] = await Promise.all([
        fetch('http://localhost:3100/api/role-permissions'),
        fetch('http://localhost:3100/api/roles'),
      ]);

      if (!permsRes.ok || !rolesRes.ok) throw new Error('Không thể tải dữ liệu');

      const [perms, rolesData] = await Promise.all([permsRes.json(), rolesRes.json()]);

      setPermissions(perms);
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
      const response = await fetch('http://localhost:3100/api/role-permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Không thể lưu quyền');

      setOpen(false);
      setFormData({ roleId: '', resource: '', action: '' });
      loadData();
    } catch (err: any) {
      setError(err.message || 'Không thể lưu quyền');
    }
  };

  const handleDelete = async (permission: Permission) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa quyền này?')) return;
    try {
      // Find permission ID by matching all fields
      const allPerms = await fetch('http://localhost:3100/api/role-permissions').then((r) =>
        r.json()
      );
      const perm = allPerms.find(
        (p: any) =>
          p.roleId === permission.roleId &&
          p.resource === permission.resource &&
          p.action === permission.action
      );

      if (perm && perm.id) {
        const response = await fetch(`http://localhost:3100/api/role-permissions/${perm.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Không thể xóa quyền');
        loadData();
      }
    } catch (err: any) {
      setError(err.message || 'Không thể xóa quyền');
    }
  };

  const getRoleName = (roleId: string) => {
    return roles.find((r) => r.id === roleId)?.name || roleId;
  };

  if (loading && permissions.length === 0) {
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
          Quản lý Quyền hạn
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Thêm quyền
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
                <strong>Vai trò</strong>
              </TableCell>
              <TableCell>
                <strong>Resource</strong>
              </TableCell>
              <TableCell>
                <strong>Action</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Thao tác</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((perm, index) => (
              <TableRow key={index}>
                <TableCell>
                  <strong>{getRoleName(perm.roleId)}</strong>
                </TableCell>
                <TableCell>{perm.resource}</TableCell>
                <TableCell>{perm.action}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleDelete(perm)} color="error">
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
          setFormData({ roleId: '', resource: '', action: '' });
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thêm quyền mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
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
              <InputLabel>Resource</InputLabel>
              <Select
                value={formData.resource}
                onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                label="Resource"
              >
                {resources.map((res) => (
                  <MenuItem key={res} value={res}>
                    {res}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Action</InputLabel>
              <Select
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                label="Action"
              >
                {actions.map((act) => (
                  <MenuItem key={act} value={act}>
                    {act}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setFormData({ roleId: '', resource: '', action: '' });
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Permissions;
