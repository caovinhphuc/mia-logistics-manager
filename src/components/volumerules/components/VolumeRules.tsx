import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface VolumeRule {
  id: string;
  name: string;
  description: string;
  formula: string;
  unit: string; // m³
  isActive: boolean;
  createdAt: string;
}

const VolumeRules: React.FC = () => {
  const [rules, setRules] = useState<VolumeRule[]>([
    {
      id: '1',
      name: 'Quy tắc chuẩn',
      description: 'Tính khối lượng theo công thức cơ bản',
      formula: 'Volume = Length × Width × Height',
      unit: 'm³',
      isActive: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Quy tắc thùng carton',
      description: 'Tính khối cho thùng carton có chiều cao cố định',
      formula: 'Volume = Length × Width × 0.5',
      unit: 'm³',
      isActive: true,
      createdAt: '2024-01-15',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<VolumeRule | null>(null);
  const [formData, setFormData] = useState<Partial<VolumeRule>>({
    name: '',
    description: '',
    formula: '',
    unit: 'm³',
  });

  const handleAdd = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      formula: '',
      unit: 'm³',
    });
    setOpenDialog(true);
  };

  const handleEdit = (rule: VolumeRule) => {
    setEditingRule(rule);
    setFormData(rule);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (editingRule) {
      // Update existing rule
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? ({ ...formData, id: r.id, createdAt: r.createdAt } as VolumeRule)
            : r
        )
      );
    } else {
      // Add new rule
      const newRule: VolumeRule = {
        ...(formData as VolumeRule),
        id: Date.now().toString(),
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setRules((prev) => [...prev, newRule]);
    }
    setOpenDialog(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quy tắc này?')) {
      setRules((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const toggleActive = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
          Quy tắc tính khối (m³)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ borderRadius: 2 }}
        >
          Thêm quy tắc mới
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Quản lý các quy tắc tính khối lượng thể tích (m³) cho hàng hóa. Mỗi quy tắc có công thức
        tính khác nhau tùy theo loại hàng.
      </Alert>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Tên quy tắc</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Mô tả</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Công thức</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">
                Đơn vị
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">
                Trạng thái
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">
                Ngày tạo
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }} align="center">
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có quy tắc nào. Nhấn "Thêm quy tắc mới" để tạo.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => (
                <TableRow key={rule.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{rule.name}</TableCell>
                  <TableCell>{rule.description}</TableCell>
                  <TableCell>
                    <Box
                      component="code"
                      sx={{
                        color: 'primary.main',
                        fontSize: '0.9em',
                        fontFamily: 'monospace',
                      }}
                    >
                      {rule.formula}
                    </Box>
                  </TableCell>
                  <TableCell align="center">{rule.unit}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={rule.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      color={rule.isActive ? 'success' : 'default'}
                      size="small"
                      onClick={() => toggleActive(rule.id)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell align="center">{rule.createdAt}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(rule)}
                      title="Sửa"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(rule.id)}
                      title="Xóa"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRule ? 'Sửa quy tắc tính khối' : 'Thêm quy tắc tính khối mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên quy tắc"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Công thức tính"
                value={formData.formula}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                placeholder="Ví dụ: Volume = Length × Width × Height"
                required
                helperText="Nhập công thức tính khối lượng. Sử dụng các biến: Length, Width, Height, Volume"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Đơn vị"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<CancelIcon />} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            startIcon={<SaveIcon />}
            variant="contained"
            disabled={!formData.name || !formData.formula}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Info Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Tổng số quy tắc
              </Typography>
              <Typography variant="h3">{rules.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="success.main">
                Đang hoạt động
              </Typography>
              <Typography variant="h3">{rules.filter((r) => r.isActive).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error.main">
                Tạm dừng
              </Typography>
              <Typography variant="h3">{rules.filter((r) => !r.isActive).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VolumeRules;
