import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import {
  PackagingItem,
  TimelineItem,
  DocumentStatusItem,
} from '../../types/inbound';

interface EditItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  type: 'packaging' | 'timeline' | 'documentStatus';
  item: PackagingItem | TimelineItem | DocumentStatusItem | null;
  description: string;
  onDescriptionChange: (description: string) => void;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({
  open,
  onClose,
  onSave,
  type,
  item,
  description,
  onDescriptionChange,
}) => {
  const getTypeLabel = () => {
    switch (type) {
      case 'packaging':
        return 'Quy cách đóng gói';
      case 'timeline':
        return 'Timeline Vận Chuyển';
      case 'documentStatus':
        return 'Trạng thái chứng từ';
      default:
        return '';
    }
  };

  const getItemName = () => {
    if (!item) return 'N/A';

    if ('name' in item) {
      return item.name;
    } else if ('type' in item) {
      return item.type;
    }

    return 'N/A';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sửa mô tả - {getTypeLabel()}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Item hiện tại:</strong> {getItemName()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Mô tả cũ:</strong> {item?.description || 'Chưa có'}
          </Typography>

          <TextField
            fullWidth
            label="Mô tả mới (bắt buộc)"
            multiline
            rows={3}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Nhập mô tả mới cho item này..."
            required
            sx={{ mt: 2 }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: 'block' }}
          >
            * Mô tả mới sẽ thay thế mô tả cũ và không thể sửa lại
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={!description.trim()}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditItemDialog;
