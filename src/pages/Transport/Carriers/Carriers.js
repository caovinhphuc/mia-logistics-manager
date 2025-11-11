import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddIcon from "@mui/icons-material/Add";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Carriers = () => {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"

  // Fetch carriers từ Google Sheets API
  useEffect(() => {
    const fetchCarriers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/carriers");
        if (!response.ok) {
          throw new Error("Không thể tải danh sách nhà vận chuyển");
        }
        const data = await response.json();
        setCarriers(data || []);
      } catch (err) {
        console.error("Error fetching carriers:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchCarriers();
  }, []);

  const getStatusText = (status) => {
    if (typeof status === "boolean") {
      return status ? "Hoạt động" : "Tạm dừng";
    }
    if (typeof status === "string") {
      return status === "active" || status === "TRUE" || status === "true"
        ? "Hoạt động"
        : "Tạm dừng";
    }
    // Kiểm tra isActive field
    return status ? "Hoạt động" : "Tạm dừng";
  };

  const getStatusColor = (status) => {
    if (typeof status === "boolean") {
      return status ? "success" : "default";
    }
    if (typeof status === "string") {
      return status === "active" || status === "TRUE" || status === "true" ? "success" : "default";
    }
    return status ? "success" : "default";
  };

  // Tính toán stats từ data thực
  const activeCarriersCount = carriers.filter((c) => {
    const isActive =
      c.isActive !== undefined
        ? c.isActive
        : c.status === "active" || c.status === "TRUE" || c.status === "true";
    return isActive;
  }).length;

  const avgRating =
    carriers.length > 0
      ? (carriers.reduce((sum, c) => sum + (Number(c.rating) || 0), 0) / carriers.length).toFixed(1)
      : "0";

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <LocalShippingIcon sx={{ fontSize: 32, color: "#1976d2", mr: 1 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#333" }}>
            Nhà vận chuyển
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          {/* Toggle View Mode */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => {
              if (newMode !== null) setViewMode(newMode);
            }}
            aria-label="chế độ xem"
            size="small"
          >
            <ToggleButton value="grid" aria-label="xem dạng lưới">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="table" aria-label="xem dạng bảng">
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ px: 3, py: 1.5 }}>
            Thêm nhà vận chuyển
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", boxShadow: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
              {carriers.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng nhà vận chuyển
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", boxShadow: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
              {activeCarriersCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đang hoạt động
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", boxShadow: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#ed6c02" }}>
              {avgRating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đánh giá trung bình
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", boxShadow: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#9c27b0" }}>
              156
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chuyến hàng tháng này
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Carriers List */}
      {carriers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Chưa có nhà vận chuyển nào
          </Typography>
        </Paper>
      ) : viewMode === "grid" ? (
        <Grid container spacing={3}>
          {carriers.map((carrier) => {
            const carrierId = carrier.carrierId || carrier.id || Math.random().toString();
            const carrierName = carrier.name || "Chưa có tên";
            const isActive =
              carrier.isActive !== undefined
                ? carrier.isActive
                : carrier.status === "active" ||
                  carrier.status === "TRUE" ||
                  carrier.status === "true";
            const avatarUrl = carrier.avatarUrl;
            const avatarEmoji = carrier.avatar || "🚛";
            const phone = carrier.phone || "Chưa có";
            const email = carrier.email || "Chưa có";
            const address = carrier.address || "Chưa có địa chỉ";
            const serviceAreas = carrier.serviceAreas || "Chưa có khu vực";
            const vehicleTypes = carrier.vehicleTypes || "Chưa có thông tin";
            const rating = Number(carrier.rating) || 0;

            return (
              <Grid item xs={12} md={6} lg={4} key={carrierId}>
                <Card sx={{ height: "100%", boxShadow: 2, "&:hover": { boxShadow: 4 } }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {avatarUrl && avatarUrl.startsWith("http") ? (
                        <Avatar
                          src={avatarUrl}
                          alt={carrierName}
                          sx={{
                            width: 56,
                            height: 56,
                            mr: 2,
                            bgcolor: isActive ? "primary.main" : "grey.400",
                            fontSize: "1.5rem",
                            "& img": {
                              objectFit: "cover",
                            },
                          }}
                          imgProps={{
                            onError: (e) => {
                              // Khi image load fail, Avatar sẽ tự động hiển thị children (chữ cái đầu)
                              e.target.style.display = "none";
                            },
                          }}
                        >
                          {carrierName[0]?.toUpperCase() || "C"}
                        </Avatar>
                      ) : (
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            mr: 2,
                            bgcolor: isActive ? "primary.main" : "grey.400",
                            fontSize: "1.8rem",
                          }}
                        >
                          {avatarEmoji}
                        </Avatar>
                      )}
                      <Box flex={1}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                          {carrierName}
                        </Typography>
                        <Chip
                          label={getStatusText(isActive)}
                          color={getStatusColor(isActive)}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Box mb={2}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <PhoneIcon sx={{ fontSize: 16, color: "#666", mr: 1 }} />
                        <Typography variant="body2">{phone}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <EmailIcon sx={{ fontSize: 16, color: "#666", mr: 1 }} />
                        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                          {email}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="flex-start" mb={1}>
                        <LocationOnIcon sx={{ fontSize: 16, color: "#666", mr: 1, mt: 0.2 }} />
                        <Typography variant="body2">{address}</Typography>
                      </Box>
                    </Box>

                    <Box mb={2}>
                      <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                        Khu vực phục vụ:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {serviceAreas}
                      </Typography>
                    </Box>

                    <Box mb={2}>
                      <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                        Loại xe:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {vehicleTypes}
                      </Typography>
                    </Box>

                    {carrier.contactPerson && (
                      <Box mb={2}>
                        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                          Người liên hệ:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {carrier.contactPerson}
                        </Typography>
                      </Box>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          Đánh giá:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold", color: "#f57c00" }}>
                          ⭐ {rating > 0 ? rating.toFixed(1) : "Chưa có"}
                        </Typography>
                      </Box>
                      <Button size="small" variant="outlined">
                        Chi tiết
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        /* Table View */
        <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Tên nhà vận chuyển
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Người liên hệ
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Số điện thoại
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Khu vực phục vụ
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Trạng thái
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Đánh giá
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Hành động
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carriers.map((carrier) => {
                const carrierId = carrier.carrierId || carrier.id || Math.random().toString();
                const carrierName = carrier.name || "Chưa có tên";
                const isActive =
                  carrier.isActive !== undefined
                    ? carrier.isActive
                    : carrier.status === "active" ||
                      carrier.status === "TRUE" ||
                      carrier.status === "true";
                const avatarUrl = carrier.avatarUrl;
                const phone = carrier.phone || "Chưa có";
                const email = carrier.email || "Chưa có";
                const serviceAreas = carrier.serviceAreas || "Chưa có khu vực";
                const rating = Number(carrier.rating) || 0;
                const contactPerson = carrier.contactPerson || "Chưa có";

                return (
                  <TableRow key={carrierId} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        {avatarUrl ? (
                          <Avatar
                            src={avatarUrl}
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: isActive ? "primary.main" : "grey.400",
                            }}
                          >
                            {carrierName[0]?.toUpperCase() || "C"}
                          </Avatar>
                        ) : (
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: isActive ? "primary.main" : "grey.400",
                              fontSize: "1.2rem",
                            }}
                          >
                            {carrierName[0]?.toUpperCase() || "🚛"}
                          </Avatar>
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {carrierName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{contactPerson}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <PhoneIcon sx={{ fontSize: 16, color: "#666" }} />
                        <Typography variant="body2">{phone}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <EmailIcon sx={{ fontSize: 16, color: "#666" }} />
                        <Typography variant="body2" sx={{ wordBreak: "break-word", maxWidth: 250 }}>
                          {email}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {serviceAreas}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(isActive)}
                        color={getStatusColor(isActive)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "bold", color: "#f57c00" }}>
                        {rating > 0 ? `⭐ ${rating.toFixed(1)}` : "Chưa có"}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <Tooltip title="Sửa">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              // TODO: Implement edit functionality
                              // eslint-disable-next-line no-console
                              console.log("Edit carrier:", carrierId);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              if (window.confirm(`Xóa nhà vận chuyển ${carrierName}?`)) {
                                // TODO: Implement delete functionality
                                // eslint-disable-next-line no-console
                                console.log("Delete carrier:", carrierId);
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Carriers;
