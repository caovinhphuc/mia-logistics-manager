import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

// Import service
import {
  getInboundScheduleItems,
  deleteInboundScheduleItem,
} from "../../services/googleSheets/inboundScheduleService";

// Logging service (avoids console.* to satisfy eslint no-console)
// Use relative import to avoid alias resolution issues during webpack build
import { logService } from "../../services/logService";

// Import types
import type { InboundScheduleItem } from "./types/inbound";

const InboundSchedule: React.FC = () => {
  const [items, setItems] = useState<InboundScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data from Google Sheets
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      logService.info("INBOUND_SCHEDULE", "Loading data from Google Sheets...");
      const data = await getInboundScheduleItems();
      logService.debug("INBOUND_SCHEDULE", "Loaded items", { count: data.length });
      setItems(data);
    } catch (err: any) {
      logService.logError("INBOUND_SCHEDULE", err, { action: "loadData" });
      setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Status helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-transit":
        return "info";
      case "arrived":
        return "success";
      case "confirmed":
        return "primary";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "Chờ xử lý",
      confirmed: "Đã xác nhận",
      "in-transit": "Đang vận chuyển",
      arrived: "Đã đến",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  const getPurposeLabel = (purpose: string) => {
    return purpose === "online" ? "Online" : "Offline";
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;

    try {
      await deleteInboundScheduleItem(id);
      await loadData();
    } catch (err: any) {
      logService.logError("INBOUND_SCHEDULE", err, { action: "delete", id });
      setError(err.message || "Không thể xóa dữ liệu.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Lịch trình nhập hàng
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={loadData}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => alert("Chức năng đang phát triển")}
          >
            Thêm lịch nhập
          </Button>
        </Stack>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {items.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tổng số lịch nhập
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {items.filter((i) => i.status === "in-transit").length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Đang vận chuyển
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {items.filter((i) => i.status === "completed").length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hoàn thành
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {items.reduce((sum, i) => sum + i.quantity, 0)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tổng số lượng
          </Typography>
        </Paper>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Ngày</strong>
              </TableCell>
              <TableCell>
                <strong>PI</strong>
              </TableCell>
              <TableCell>
                <strong>Nhà cung cấp</strong>
              </TableCell>
              <TableCell>
                <strong>Nơi xuất phát</strong>
              </TableCell>
              <TableCell>
                <strong>Nơi đến</strong>
              </TableCell>
              <TableCell>
                <strong>Sản phẩm</strong>
              </TableCell>
              <TableCell>
                <strong>Số lượng</strong>
              </TableCell>
              <TableCell>
                <strong>Container</strong>
              </TableCell>
              <TableCell>
                <strong>Trạng thái</strong>
              </TableCell>
              <TableCell>
                <strong>Nhà V/C</strong>
              </TableCell>
              <TableCell>
                <strong>Mục đích</strong>
              </TableCell>
              <TableCell>
                <strong>Giờ nhận</strong>
              </TableCell>
              <TableCell>
                <strong>Thao tác</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={14} align="center">
                  <Typography color="text.secondary">Chưa có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.pi}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{item.origin}</TableCell>
                  <TableCell>{item.destination}</TableCell>
                  <TableCell>{item.product}</TableCell>
                  <TableCell>{item.quantity.toLocaleString("vi-VN")}</TableCell>
                  <TableCell>{item.container}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(item.status)}
                      color={getStatusColor(item.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{item.carrier}</TableCell>
                  <TableCell>{getPurposeLabel(item.purpose)}</TableCell>
                  <TableCell>{item.receiveTime}</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => alert("Edit: " + item.id)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Debug Info */}
      {process.env.NODE_ENV === "development" && (
        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
          <Typography variant="caption" fontWeight={600}>
            🔍 Debug Info:
          </Typography>
          <Typography variant="caption" display="block">
            Total items: {items.length}
          </Typography>
          <Typography variant="caption" display="block">
            Loading: {loading ? "Yes" : "No"}
          </Typography>
          {error && (
            <Typography variant="caption" display="block" color="error">
              Error: {error}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default InboundSchedule;
