import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
// import { SHEETS_CONFIG } from '../../../config/sheetsConfig';

// Temporary config until sheetsConfig is created
const SHEETS_CONFIG = {
  SPREADSHEET_ID: '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As',
  RANGE: 'Sheet1!A:Z',
};

interface Location {
  id: string;
  code: string;
  avatar: string;
  category: string;
  subcategory: string;
  address: string;
  status: 'active' | 'inactive';
  ward: string;
  district: string;
  province: string;
  note: string;
}

interface CreateLocationDialogProps {
  open: boolean;
  onClose: () => void;
  editing: Location | null;
  onSuccess: () => void;
}

const SHEET_ID = SHEETS_CONFIG.SPREADSHEET_ID;

const AVATAR_OPTIONS = [
  { value: '🏢', label: '🏢 Tòa nhà' },
  { value: '🏪', label: '🏪 Cửa hàng' },
  { value: '🏭', label: '🏭 Nhà máy' },
  { value: '🏠', label: '🏠 Nhà ở' },
  { value: '🏢', label: '🏢 Văn phòng' },
  { value: '🏬', label: '🏬 Trung tâm thương mại' },
  { value: '🏗️', label: '🏗️ Công trường' },
  { value: '🚚', label: '🚚 Kho vận' },
];

const CATEGORY_OPTIONS = [
  'Kho hàng',
  'Cửa hàng',
  'Nhà máy',
  'Văn phòng',
  'Trung tâm thương mại',
  'Công trường',
  'Kho vận',
  'Khác',
];

const PROVINCE_OPTIONS = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Khác'];

const CreateLocationDialog: React.FC<CreateLocationDialogProps> = ({
  open,
  onClose,
  editing,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Partial<Location>>({
    code: '',
    avatar: '🏢',
    category: '',
    subcategory: '',
    address: '',
    status: 'active',
    ward: '',
    district: '',
    province: 'TP. Hồ Chí Minh',
    note: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setFormData(editing);
    } else {
      setFormData({
        code: '',
        avatar: '🏢',
        category: '',
        subcategory: '',
        address: '',
        status: 'active',
        ward: '',
        district: '',
        province: 'TP. Hồ Chí Minh',
        note: '',
      });
    }
  }, [editing, open]);

  const handleSubmit = async () => {
    if (!formData.code?.trim()) {
      alert('Vui lòng nhập mã địa điểm');
      return;
    }

    setLoading(true);
    try {
      const url = editing
        ? `/api/locations/${editing.id}?spreadsheetId=${encodeURIComponent(SHEET_ID)}`
        : `/api/locations?spreadsheetId=${encodeURIComponent(SHEET_ID)}`;

      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.error || 'Không thể lưu địa điểm'}`);
      }
    } catch (error) {
      console.error('Lỗi lưu địa điểm:', error);
      alert('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Location, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editing ? 'Sửa địa điểm' : 'Thêm địa điểm mới'}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mã địa điểm *"
                value={formData.code || ''}
                onChange={(e) => handleChange('code', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Avatar</InputLabel>
                <Select
                  value={formData.avatar || '🏢'}
                  onChange={(e) => handleChange('avatar', e.target.value)}
                  label="Avatar"
                >
                  {AVATAR_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={formData.category || ''}
                  onChange={(e) => handleChange('category', e.target.value)}
                  label="Danh mục"
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hạng mục"
                value={formData.subcategory || ''}
                onChange={(e) => handleChange('subcategory', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Phường/Xã"
                value={formData.ward || ''}
                onChange={(e) => handleChange('ward', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quận/Huyện"
                value={formData.district || ''}
                onChange={(e) => handleChange('district', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Tỉnh/Thành phố</InputLabel>
                <Select
                  value={formData.province || 'TP. Hồ Chí Minh'}
                  onChange={(e) => handleChange('province', e.target.value)}
                  label="Tỉnh/Thành phố"
                >
                  {PROVINCE_OPTIONS.map((province) => (
                    <MenuItem key={province} value={province}>
                      {province}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status || 'active'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                value={formData.note || ''}
                onChange={(e) => handleChange('note', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.code?.trim()}
        >
          {loading ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLocationDialog;
