import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  TextField,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PhoneIphone as MobileIcon,
  Tablet as TabletIcon,
  Computer as DesktopIcon,
  Visibility as VisibleIcon,
  VisibilityOff as HiddenIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';

export interface LayoutConfigManagerProps {
  open: boolean;
  onClose: () => void;
}

type ViewMode = 'mobile' | 'tablet' | 'desktop';

const PAGES = [
  { id: 'overview', label: 'Tổng quan', path: '/' },
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'orders', label: 'Đơn hàng', path: '/orders' },
  { id: 'warehouse', label: 'Kho vận', path: '/warehouse' },
  { id: 'reports', label: 'Báo cáo', path: '/reports' },
  { id: 'settings', label: 'Cài đặt', path: '/settings' },
];

const MOCK_WIDGETS = [
  { id: 'stats', label: 'Thống kê nhanh', visible: true },
  { id: 'chart', label: 'Biểu đồ', visible: true },
  { id: 'recent', label: 'Hoạt động gần đây', visible: false },
];

const LayoutConfigManager: React.FC<LayoutConfigManagerProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [selectedPageId, setSelectedPageId] = useState<string>(PAGES[0].id);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [searchPage, setSearchPage] = useState('');
  const [widgets, setWidgets] = useState(MOCK_WIDGETS);

  const filteredPages = PAGES.filter((p) =>
    p.label.toLowerCase().includes(searchPage.trim().toLowerCase())
  );

  const toggleWidget = (id: string) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)));
  };

  const handleResetPage = () => {
    setWidgets((prev) => prev.map((w) => ({ ...w, visible: true })));
  };

  const visibleCount = widgets.filter((w) => w.visible).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { minHeight: '70vh' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DashboardIcon color="primary" />
        Cấu hình Layout
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Sidebar trái: chọn trang */}
          <Box sx={{ width: { md: 220 }, flexShrink: 0 }}>
            <Typography variant="overline" color="text.secondary" sx={{ px: 1 }}>
              Chọn trang
            </Typography>
            <TextField
              size="small"
              placeholder="Tìm trang..."
              value={searchPage}
              onChange={(e) => setSearchPage(e.target.value)}
              fullWidth
              sx={{ mt: 0.5, mb: 1 }}
            />
            <List dense>
              {filteredPages.map((page) => (
                <ListItemButton
                  key={page.id}
                  selected={selectedPageId === page.id}
                  onClick={() => setSelectedPageId(page.id)}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemText primary={page.label} />
                </ListItemButton>
              ))}
            </List>
            <Button size="small" startIcon={<ResetIcon />} onClick={handleResetPage} sx={{ mt: 1 }}>
              Đặt lại trang này
            </Button>
          </Box>

          {/* Nội dung chính */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Chế độ hiển thị */}
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Chế độ hiển thị
            </Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, v) => v != null && setViewMode(v)}
              size="small"
              sx={{ mb: 2 }}
            >
              <ToggleButton value="mobile">
                <MobileIcon sx={{ mr: 0.5 }} /> Mobile
              </ToggleButton>
              <ToggleButton value="tablet">
                <TabletIcon sx={{ mr: 0.5 }} /> Tablet
              </ToggleButton>
              <ToggleButton value="desktop">
                <DesktopIcon sx={{ mr: 0.5 }} /> Desktop
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Quản lý widget */}
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Quản lý widget hiện tại
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {widgets.map((w) => (
                <Chip
                  key={w.id}
                  label={w.label}
                  icon={w.visible ? <VisibleIcon /> : <HiddenIcon />}
                  color={w.visible ? 'success' : 'default'}
                  variant={w.visible ? 'filled' : 'outlined'}
                  onClick={() => toggleWidget(w.id)}
                  sx={{ mb: 0.5 }}
                />
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Đang hiển thị {visibleCount}/{widgets.length} widget. Click chip để ẩn/hiện.
            </Typography>

            {/* Xem trước bố cục */}
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Xem trước bố cục
            </Typography>
            <Card variant="outlined" sx={{ bgcolor: 'action.hover' }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns:
                      viewMode === 'mobile'
                        ? '1fr'
                        : viewMode === 'tablet'
                          ? '1fr 1fr'
                          : '1fr 1fr 1fr 1fr',
                    gap: 1,
                    minHeight: 120,
                  }}
                >
                  {widgets
                    .filter((w) => w.visible)
                    .map((w) => (
                      <Box
                        key={w.id}
                        sx={{
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          p: 1,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Typography variant="caption">{w.label}</Typography>
                      </Box>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LayoutConfigManager;
