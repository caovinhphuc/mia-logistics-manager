import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
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
  IconButton,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { PendingActions as PendingIcon } from "@mui/icons-material";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PrintIcon from "@mui/icons-material/Print";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PackageIcon from "@mui/icons-material/Inventory2";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

interface Transfer {
  transfer_id: string;
  orderCode: string;
  hasVali: string;
  date: string;
  source: string;
  dest: string;
  quantity: string | number;
  state: string;
  transportStatus: string;
  note: string;
  totalPackages: string | number;
  totalVolume: string | number;
  pkgS?: number;
  pkgM?: number;
  pkgL?: number;
  pkgBagSmall?: number;
  pkgBagMedium?: number;
  pkgBagLarge?: number;
  pkgOther?: number;
  employee?: string;
  address?: string;
  ward?: string;
  district?: string;
  province?: string;
}

const PendingDelivery: React.FC = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filteredTransfers, setFilteredTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Action menu state
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);

  // Multi-select state
  const [selected, setSelected] = useState<string[]>([]);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });

  // Đặt xe mới dialog state
  const [orderVehicleDialogOpen, setOrderVehicleDialogOpen] = useState(false);
  const [carriers, setCarriers] = useState<
    Array<{ name: string; id?: string; contactPerson?: string; phone?: string }>
  >([]);
  const [selectedTransfersForOrder, setSelectedTransfersForOrder] = useState<Transfer[]>([]);
  const [orderVehicleForm, setOrderVehicleForm] = useState({
    carrierName: "",
    carrierId: "",
    vehicleType: "",
    note: "",
    pickupAddress: "",
    totalPackages: 0,
    totalVolume: 0,
    totalProducts: 0,
  });
  const [orderVehicleLoading, setOrderVehicleLoading] = useState(false);

  // Fetch transfers từ Google Sheets API
  const fetchTransfers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/transfers");
      if (!response.ok) {
        throw new Error("Không thể tải danh sách phiếu chuyển kho");
      }
      const data = await response.json();
      setTransfers(data || []);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("Error fetching transfers:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
    fetchCarriers();
  }, []);

  // Fetch carriers for order vehicle form
  const fetchCarriers = async () => {
    try {
      const response = await fetch("/api/carriers");
      if (response.ok) {
        const data = await response.json();
        setCarriers(data || []);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error fetching carriers:", err);
    }
  };

  // Filter transfers - chỉ hiển thị "Chờ chuyển giao"
  useEffect(() => {
    const filtered = transfers.filter((transfer) => {
      const stateStatus = (transfer.state || "").trim();
      const transportStatus = (transfer.transportStatus || "").trim();

      // Logic: "Chờ chuyển giao" nếu:
      // - transportStatus = "Chờ chuyển giao" HOẶC
      // - state = "Xuất chuyển kho" (theo logic từ TransferList.tsx)
      return transportStatus === "Chờ chuyển giao" || stateStatus === "Xuất chuyển kho";
    });
    setFilteredTransfers(filtered);
  }, [transfers]);

  const getStateColor = (state: string) => {
    if (!state) return "default";
    const stateLower = state.toLowerCase();
    if (
      stateLower.includes("hoàn thành") ||
      stateLower.includes("đã") ||
      stateLower.includes("complete")
    ) {
      return "success";
    }
    if (
      stateLower.includes("đang") ||
      stateLower.includes("pending") ||
      stateLower.includes("chờ")
    ) {
      return "warning";
    }
    if (stateLower.includes("hủy") || stateLower.includes("cancel")) {
      return "error";
    }
    return "info";
  };

  // Action menu handlers
  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, transfer: Transfer) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedTransfer(transfer);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedTransfer(null);
  };

  // Action handlers
  const handlePrintPicking = (transfer: Transfer) => {
    const url = `https://one.tga.com.vn/so/ckprint/picking?id=${transfer.transfer_id}`;
    window.open(url, "_blank");
    handleActionMenuClose();
  };

  const handlePrintGoods = (transfer: Transfer) => {
    const url = `https://one.tga.com.vn/so/ckprint/goods?id=${transfer.transfer_id}`;
    window.open(url, "_blank");
    handleActionMenuClose();
  };

  const handleExportTransfer = (transfer: Transfer) => {
    const url = `https://one.tga.com.vn/picking/goodsdeliverynote/inventorytransfer/detail/${transfer.transfer_id}`;
    window.open(url, "_blank");
    handleActionMenuClose();
  };

  // Đặt xe mới handler - xử lý nhiều phiếu
  const handleOrderVehicle = (transfers?: Transfer[]) => {
    // Debug: Log để kiểm tra
    // eslint-disable-next-line no-console
    console.log("🔍 handleOrderVehicle called:", {
      selected,
      selectedLength: selected.length,
      transfers,
      filteredTransfersLength: filteredTransfers.length,
    });

    // Sử dụng transfers được truyền vào hoặc lấy từ selected
    let transfersToOrder: Transfer[] = [];

    if (transfers && transfers.length > 0) {
      // Nếu có transfers được truyền vào, dùng trực tiếp
      transfersToOrder = transfers;
      // eslint-disable-next-line no-console
      console.log("✅ Using provided transfers:", transfersToOrder.length);
    } else {
      // Lấy từ selected[]
      // eslint-disable-next-line no-console
      console.log("📋 Filtering from selected:", {
        selected,
        filteredTransfersCount: filteredTransfers.length,
      });

      transfersToOrder = filteredTransfers.filter((t) => {
        const transferId = t.transfer_id || t.id || "";
        const isInSelected = selected.includes(transferId);
        // eslint-disable-next-line no-console
        if (transferId && selected.length > 0) {
          console.log(
            `  Checking ${t.orderCode || "N/A"}: transfer_id="${transferId}", in selected=${isInSelected}`
          );
        }
        return isInSelected;
      });

      // eslint-disable-next-line no-console
      console.log("📦 Filtered transfersToOrder:", {
        count: transfersToOrder.length,
        orderCodes: transfersToOrder.map((t) => t.orderCode || "N/A"),
      });
    }

    // eslint-disable-next-line no-console
    console.log(
      "📦 Final transfersToOrder:",
      transfersToOrder.length,
      transfersToOrder.map((t) => t.orderCode || "N/A")
    );

    if (transfersToOrder.length === 0) {
      // eslint-disable-next-line no-console
      console.warn("⚠️ transfersToOrder.length === 0 - Dialog sẽ KHÔNG mở", {
        selected,
        selectedLength: selected.length,
        filteredTransfersLength: filteredTransfers.length,
        transfersToOrderLength: transfersToOrder.length,
        selectedIds: selected,
        filteredTransferIds: filteredTransfers.map((t) => t.transfer_id || t.id || "NO_ID"),
      });
      setSnackbar({
        open: true,
        message: `Vui lòng chọn ít nhất một phiếu để đặt xe (Đã chọn: ${selected.length} ID trong selected[])`,
        severity: "warning",
      });
      return; // ⚠️ RETURN SỚM - Dialog không mở
    }

    // eslint-disable-next-line no-console
    console.log("✅ transfersToOrder.length > 0, tiếp tục mở dialog...");

    // Lấy pickup address từ phiếu đầu tiên (thường các phiếu cùng kho nguồn)
    const pickupAddress = transfersToOrder[0]?.source || "";

    // Tính tổng số kiện, khối, sản phẩm từ tất cả phiếu
    const totalPackages = transfersToOrder.reduce(
      (sum, t) => sum + (Number(t.totalPackages) || 0),
      0
    );
    const totalVolume = transfersToOrder.reduce((sum, t) => sum + (Number(t.totalVolume) || 0), 0);
    const totalProducts = transfersToOrder.reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);

    // Tạo note với danh sách mã đơn
    const orderCodes = transfersToOrder
      .map((t) => t.orderCode)
      .filter(Boolean)
      .join(", ");
    const note =
      transfersToOrder.length === 1
        ? `Đặt xe cho phiếu: ${orderCodes}`
        : `Đặt xe cho ${transfersToOrder.length} phiếu: ${orderCodes}`;

    // Set form
    setOrderVehicleForm({
      carrierName: "",
      carrierId: "",
      vehicleType: "",
      note,
      pickupAddress,
      totalPackages,
      totalVolume,
      totalProducts,
    });

    // Store selected transfers
    setSelectedTransfersForOrder(transfersToOrder);

    // eslint-disable-next-line no-console
    console.log("✅ Setting dialog open:", {
      transfersToOrderLength: transfersToOrder.length,
      orderCodes: transfersToOrder.map((t) => t.orderCode || "N/A"),
      beforeSetOpen: orderVehicleDialogOpen,
    });

    // Set dialog open
    setOrderVehicleDialogOpen(true);
    handleActionMenuClose();

    // eslint-disable-next-line no-console
    console.log("✅ setOrderVehicleDialogOpen(true) đã được gọi");

    // Force check after state update (React batching)
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log("🔍 After state update - orderVehicleDialogOpen should be true");
    }, 0);
  };

  // Submit đặt xe mới
  const handleSubmitOrderVehicle = async () => {
    if (!orderVehicleForm.carrierName || !orderVehicleForm.vehicleType) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn nhà vận chuyển và loại xe",
        severity: "error",
      });
      return;
    }

    if (selectedTransfersForOrder.length === 0) {
      setSnackbar({
        open: true,
        message: "Không tìm thấy phiếu chuyển kho nào",
        severity: "error",
      });
      return;
    }

    setOrderVehicleLoading(true);
    try {
      const SHEET_ID = "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As";

      // Bước 1: Generate request ID
      const generateResponse = await fetch(
        `/api/transport-requests/generate-id?spreadsheetId=${encodeURIComponent(SHEET_ID)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!generateResponse.ok) {
        throw new Error("Không thể tạo mã yêu cầu vận chuyển");
      }

      const { requestId, rowIndex } = await generateResponse.json();

      if (!requestId || rowIndex === undefined) {
        throw new Error("Không nhận được mã yêu cầu hợp lệ");
      }

      // Bước 2: Tạo transport request với dữ liệu từ nhiều phiếu
      const now = new Date();
      const createdAt = `${now.getDate().toString().padStart(2, "0")}/${(now.getMonth() + 1).toString().padStart(2, "0")}/${now.getFullYear()}`;

      // Xử lý nhiều điểm dừng từ các phiếu đã chọn (tối đa 10 điểm)
      const stops = selectedTransfersForOrder.slice(0, 10).map((transfer) => {
        const deliveryAddress =
          `${transfer.address || ""} ${transfer.ward || ""} ${transfer.district || ""} ${transfer.province || ""}`.trim() ||
          transfer.dest ||
          "";
        const packages = Number(transfer.totalPackages) || 0;
        const volume = Number(transfer.totalVolume) || 0;
        const products = `${transfer.orderCode} - ${packages} kiện`;

        return {
          address: deliveryAddress,
          products,
          volume,
          packages,
        };
      });

      // Tạo transport request object với các stops
      const transportRequest: Record<string, any> = {
        requestId,
        createdAt,
        status: "Chờ xác nhận",
        note: orderVehicleForm.note || "",
        pickupAddress: orderVehicleForm.pickupAddress,
        totalProducts: orderVehicleForm.totalProducts.toString(),
        totalVolumeM3: orderVehicleForm.totalVolume,
        totalPackages: orderVehicleForm.totalPackages,
        pricingMethod: "perTrip",
        carrierId: orderVehicleForm.carrierId || "",
        carrierName: orderVehicleForm.carrierName,
        carrierContact: "",
        carrierPhone: "",
        carrierEmail: "",
        vehicleType: orderVehicleForm.vehicleType,
        driverId: "",
        driverName: "",
        driverPhone: "",
        driverLicense: "",
        loadingImages: "",
        department: "",
        serviceArea: "",
        pricePerKm: 0,
        pricePerM3: 0,
        pricePerTrip: 0,
        stopFee: 0,
        fuelSurcharge: 0,
        tollFee: 0,
        insuranceFee: 0,
        baseRate: 0,
        estimatedCost: 0,
        distance1: 0,
        distance2: 0,
        distance3: 0,
        distance4: 0,
        distance5: 0,
        distance6: 0,
        distance7: 0,
        distance8: 0,
        distance9: 0,
        distance10: 0,
        totalDistance: 0,
      };

      // Điền thông tin cho các stops (1-10)
      for (let i = 1; i <= 10; i++) {
        const stopIndex = i - 1;
        const stop = stops[stopIndex] || { address: "", products: "", volume: 0, packages: 0 };
        transportRequest[`stop${i}Address`] = stop.address;
        transportRequest[`stop${i}Products`] = stop.products;
        transportRequest[`stop${i}VolumeM3`] = stop.volume;
        transportRequest[`stop${i}Packages`] = stop.packages;
      }

      // Bước 3: Update vào sheet
      const updateResponse = await fetch(
        `/api/transport-requests/${requestId}?spreadsheetId=${encodeURIComponent(SHEET_ID)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transportRequest),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Không thể lưu yêu cầu vận chuyển");
      }

      // Bước 4: Update transportStatus của tất cả các transfer thành "Đang chuyển giao"
      const updatePromises = selectedTransfersForOrder.map((transfer) =>
        fetch(
          `/api/transfers/${encodeURIComponent(transfer.transfer_id)}?spreadsheetId=${encodeURIComponent(SHEET_ID)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...transfer,
              transportStatus: "Đang chuyển giao",
            }),
          }
        )
      );

      const updateResults = await Promise.allSettled(updatePromises);
      const failedUpdates = updateResults.filter((r) => r.status === "rejected").length;
      if (failedUpdates > 0) {
        // eslint-disable-next-line no-console
        console.warn(`Không thể cập nhật trạng thái cho ${failedUpdates} phiếu`);
      }

      // Success
      setSnackbar({
        open: true,
        message: `✅ Đã đặt xe thành công cho ${selectedTransfersForOrder.length} phiếu! Mã yêu cầu: ${requestId}`,
        severity: "success",
      });

      // Clear selection
      setSelected([]);

      // Reload transfers để cập nhật UI
      await fetchTransfers();

      // Close dialog
      setOrderVehicleDialogOpen(false);
      setOrderVehicleForm({
        carrierName: "",
        carrierId: "",
        vehicleType: "",
        note: "",
        pickupAddress: "",
        totalPackages: 0,
        totalVolume: 0,
        totalProducts: 0,
      });
      setSelectedTransfersForOrder([]);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("Error creating transport request:", err);
      setSnackbar({
        open: true,
        message: `❌ Lỗi đặt xe: ${err?.message || "Không thể đặt xe. Vui lòng thử lại."}`,
        severity: "error",
      });
    } finally {
      setOrderVehicleLoading(false);
    }
  };

  // Multi-select handlers
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = filteredTransfers.map(
        (t) => t.transfer_id || t.id || `temp_${Math.random().toString(36).substr(2, 9)}`
      );
      // eslint-disable-next-line no-console
      console.log("✅ Select All:", allIds);
      setSelected(allIds);
    } else {
      // eslint-disable-next-line no-console
      console.log("❌ Deselect All");
      setSelected([]);
    }
  };

  const handleSelectOne = (transferId: string) => {
    // eslint-disable-next-line no-console
    console.log("📝 handleSelectOne called:", { transferId, currentSelected: selected });
    setSelected((prev) => {
      const newSelected = prev.includes(transferId)
        ? prev.filter((id) => id !== transferId)
        : [...prev, transferId];
      // eslint-disable-next-line no-console
      console.log("📝 New selected:", newSelected);
      return newSelected;
    });
  };

  const isSelected = (transferId: string) => selected.includes(transferId);
  const isAllSelected =
    filteredTransfers.length > 0 && selected.length === filteredTransfers.length;
  const isIndeterminate = selected.length > 0 && selected.length < filteredTransfers.length;

  // Bulk actions
  const handlePrintMultipleTransfers = () => {
    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất một phiếu để in");
      return;
    }
    const selectedTransfers = filteredTransfers.filter((transfer) =>
      selected.includes(transfer.transfer_id || "")
    );
    const transferIds = selectedTransfers
      .map((transfer) => transfer.transfer_id)
      .filter((id) => id)
      .join(",");
    if (transferIds) {
      const url = `https://one.tga.com.vn/so/ckprint/goods?id=${transferIds}`;
      window.open(url, "_blank");
    }
  };

  const handlePrintMultiplePicking = () => {
    if (selected.length === 0) {
      alert("Vui lòng chọn ít nhất một phiếu để in");
      return;
    }
    const selectedTransfers = filteredTransfers.filter((transfer) =>
      selected.includes(transfer.transfer_id || "")
    );
    const transferIds = selectedTransfers
      .map((transfer) => transfer.transfer_id)
      .filter((id) => id)
      .join(",");
    if (transferIds) {
      const url = `https://one.tga.com.vn/so/ckprint/picking?id=${transferIds}`;
      window.open(url, "_blank");
    }
  };

  // Tính toán metrics
  const totalPending = filteredTransfers.length;

  // Tính số điểm giao hàng unique (dựa trên địa chỉ đầy đủ)
  const uniqueDeliveryPoints = new Set<string>();
  filteredTransfers.forEach((transfer) => {
    const deliveryAddress =
      `${transfer.address || ""} ${transfer.ward || ""} ${transfer.district || ""} ${transfer.province || ""}`.trim();
    if (deliveryAddress) {
      uniqueDeliveryPoints.add(deliveryAddress);
    }
  });
  const deliveryPointsCount = uniqueDeliveryPoints.size;

  // Tính tổng số kiện
  const totalPackages = filteredTransfers.reduce((sum, t) => {
    const packages =
      (Number(t.pkgS) || 0) +
      (Number(t.pkgM) || 0) +
      (Number(t.pkgL) || 0) +
      (Number(t.pkgBagSmall) || 0) +
      (Number(t.pkgBagMedium) || 0) +
      (Number(t.pkgBagLarge) || 0) +
      (Number(t.pkgOther) || 0);
    return sum + packages;
  }, 0);

  // Tính tổng khối (m³)
  const totalVolume = filteredTransfers.reduce((sum, t) => {
    const volume =
      Number(t.totalVolume) ||
      0 ||
      (Number(t.volS) || 0) +
        (Number(t.volM) || 0) +
        (Number(t.volL) || 0) +
        (Number(t.volBagSmall) || 0) +
        (Number(t.volBagMedium) || 0) +
        (Number(t.volBagLarge) || 0) +
        (Number(t.volOther) || 0);
    return sum + volume;
  }, 0);

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
          <PendingIcon sx={{ fontSize: 32, color: "#ed6c02", mr: 1 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#333" }}>
            Chờ chuyển giao
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
          {/* Nút Đặt xe mới - luôn hiển thị ở toolbar */}
          <Tooltip
            title={
              selected.length > 0
                ? `Đặt xe cho ${selected.length} phiếu đã chọn`
                : "Chọn phiếu để đặt xe"
            }
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<DirectionsCarIcon />}
              onClick={() => {
                // eslint-disable-next-line no-console
                console.log("🔘 Nút 'Đặt xe mới' clicked:", {
                  selected,
                  selectedLength: selected.length,
                });
                handleOrderVehicle();
              }}
              disabled={selected.length === 0}
              sx={{
                px: 3,
                opacity: selected.length === 0 ? 0.6 : 1,
                cursor: selected.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Đặt xe mới {selected.length > 0 && `(${selected.length})`}
            </Button>
          </Tooltip>
          {/* Bulk actions */}
          {selected.length > 0 && (
            <>
              <Tooltip title="In phiếu (nhiều phiếu)">
                <IconButton onClick={handlePrintMultipleTransfers} color="primary">
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="In soạn hàng (nhiều phiếu)">
                <IconButton onClick={handlePrintMultiplePicking} color="success">
                  <AssignmentIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" color="text.secondary">
                {selected.length} đã chọn
              </Typography>
            </>
          )}
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", boxShadow: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#ed6c02" }}>
              {totalPending}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng phiếu chờ chuyển giao
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", boxShadow: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
              <LocationOnIcon sx={{ fontSize: 24, color: "#1976d2" }} />
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                {deliveryPointsCount}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Điểm giao hàng
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", boxShadow: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
              <PackageIcon sx={{ fontSize: 24, color: "#9c27b0" }} />
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#9c27b0" }}>
                {totalPackages}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Tổng số kiện
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", boxShadow: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#2e7d32" }}>
              {totalVolume.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng khối (m³)
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Transfers List */}
      {filteredTransfers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Không có phiếu nào đang chờ chuyển giao
          </Typography>
        </Paper>
      ) : viewMode === "grid" ? (
        <Grid container spacing={3}>
          {filteredTransfers.map((transfer) => {
            // Lấy transfer_id, ưu tiên transfer_id, sau đó id, sau đó tạo ID mới
            const transferId =
              transfer.transfer_id ||
              transfer.id ||
              `temp_${Math.random().toString(36).substr(2, 9)}`;
            const orderCode = transfer.orderCode || "Chưa có mã";
            const source = transfer.source || "Chưa có kho nguồn";
            const dest = transfer.dest || "Chưa có kho đích";
            const quantity = transfer.quantity || 0;
            const totalPackagesItem = Number(transfer.totalPackages) || 0;
            const totalVolumeItem = Number(transfer.totalVolume) || 0;
            const state = transfer.state || "Chưa có trạng thái";
            const date = transfer.date || "Chưa có ngày";
            const note = transfer.note || "";
            const address =
              `${transfer.address || ""} ${transfer.ward || ""} ${transfer.district || ""} ${transfer.province || ""}`.trim() ||
              "Chưa có địa chỉ";

            return (
              <Grid item xs={12} md={6} lg={4} key={transferId}>
                <Card
                  sx={{
                    height: "100%",
                    boxShadow: 2,
                    "&:hover": { boxShadow: 4 },
                    border: isSelected(transferId) ? "2px solid #1976d2" : "none",
                  }}
                >
                  <CardContent>
                    {/* Checkbox for selection */}
                    <Box display="flex" justifyContent="flex-end" mb={1}>
                      <Checkbox
                        checked={isSelected(transferId)}
                        onChange={() => {
                          // eslint-disable-next-line no-console
                          console.log("🔘 Grid Checkbox clicked:", {
                            transferId,
                            orderCode: transfer.orderCode,
                            transfer_id: transfer.transfer_id,
                          });
                          handleSelectOne(transferId);
                        }}
                        size="small"
                        sx={{ p: 0 }}
                      />
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Box flex={1}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                          {orderCode}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transferId}
                        </Typography>
                      </Box>
                      <Chip label={state} color={getStateColor(state)} size="small" />
                    </Box>

                    <Box mb={2}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <InventoryIcon sx={{ fontSize: 16, color: "#666", mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1 }}>
                          Từ:
                        </Typography>
                        <Typography variant="body2">{source}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocalShippingIcon sx={{ fontSize: 16, color: "#666", mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1 }}>
                          Đến:
                        </Typography>
                        <Typography variant="body2">{dest}</Typography>
                      </Box>
                      <Box display="flex" alignItems="flex-start" mb={1}>
                        <LocationOnIcon sx={{ fontSize: 16, color: "#666", mr: 1, mt: 0.5 }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                            Địa chỉ giao:
                          </Typography>
                          <Typography variant="body2">{address}</Typography>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1 }}>
                          Ngày:
                        </Typography>
                        <Typography variant="body2">{date}</Typography>
                      </Box>
                    </Box>

                    <Box mb={2} sx={{ backgroundColor: "#f5f5f5", p: 1.5, borderRadius: 1 }}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2">Số lượng SP:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {quantity}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2">Tổng kiện:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {totalPackagesItem}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Tổng khối (m³):</Typography>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {totalVolumeItem.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    {note && (
                      <Box mb={2}>
                        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                          Ghi chú:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {note}
                        </Typography>
                      </Box>
                    )}

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Tooltip title="Thao tác">
                        <IconButton size="small" onClick={(e) => handleActionMenuOpen(e, transfer)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
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
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Mã đơn
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Kho nguồn
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Kho đích
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Địa chỉ giao
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Số lượng SP
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Tổng kiện
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Khối (m³)
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Trạng thái
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Ngày
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
              {filteredTransfers.map((transfer) => {
                // Lấy transfer_id, ưu tiên transfer_id, sau đó id, sau đó tạo ID mới
                const transferId =
                  transfer.transfer_id ||
                  transfer.id ||
                  `temp_${Math.random().toString(36).substr(2, 9)}`;
                const orderCode = transfer.orderCode || "Chưa có mã";
                const source = transfer.source || "Chưa có";
                const dest = transfer.dest || "Chưa có";
                const quantity = transfer.quantity || 0;
                const totalPackagesItem = Number(transfer.totalPackages) || 0;
                const totalVolumeItem = Number(transfer.totalVolume) || 0;
                const state = transfer.state || "Chưa có";
                const date = transfer.date || "Chưa có";
                const address =
                  `${transfer.address || ""} ${transfer.ward || ""} ${transfer.district || ""} ${transfer.province || ""}`.trim() ||
                  "Chưa có";

                return (
                  <TableRow key={transferId} hover selected={isSelected(transferId)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(transferId)}
                        onChange={() => {
                          // eslint-disable-next-line no-console
                          console.log("🔘 Table Checkbox clicked:", {
                            transferId,
                            orderCode: transfer.orderCode,
                            transfer_id: transfer.transfer_id,
                          });
                          handleSelectOne(transferId);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {orderCode}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {transferId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <InventoryIcon sx={{ fontSize: 16, color: "#666" }} />
                        <Typography variant="body2">{source}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <LocalShippingIcon sx={{ fontSize: 16, color: "#666" }} />
                        <Typography variant="body2">{dest}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <LocationOnIcon sx={{ fontSize: 16, color: "#666" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 250,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {address}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{quantity}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {totalPackagesItem}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {totalVolumeItem.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={state} color={getStateColor(state)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{date}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Thao tác">
                        <IconButton size="small" onClick={(e) => handleActionMenuOpen(e, transfer)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Action Menu Popover */}
      <Popover
        open={Boolean(actionMenuAnchor)}
        anchorEl={actionMenuAnchor}
        onClose={handleActionMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List dense sx={{ minWidth: 200 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => selectedTransfer && handlePrintPicking(selectedTransfer)}
            >
              <ListItemIcon>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="In soạn hàng" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => selectedTransfer && handlePrintGoods(selectedTransfer)}>
              <ListItemIcon>
                <PrintIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="In phiếu" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => selectedTransfer && handleExportTransfer(selectedTransfer)}
            >
              <ListItemIcon>
                <PictureAsPdfIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Xuất PDF" />
            </ListItemButton>
          </ListItem>
        </List>
      </Popover>

      {/* Dialog Đặt xe mới */}
      {/* Debug: orderVehicleDialogOpen = {String(orderVehicleDialogOpen)} */}
      <Dialog
        open={orderVehicleDialogOpen}
        onClose={() => {
          if (!orderVehicleLoading) {
            setOrderVehicleDialogOpen(false);
            setOrderVehicleForm({
              carrierName: "",
              carrierId: "",
              vehicleType: "",
              note: "",
              pickupAddress: "",
              totalPackages: 0,
              totalVolume: 0,
              totalProducts: 0,
            });
            setSelectedTransfersForOrder([]);
          }
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <DirectionsCarIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6">Đặt xe mới</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              {/* Thông tin phiếu */}
              {selectedTransfersForOrder.length > 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                      Thông tin đặt xe:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Số phiếu:</strong> {selectedTransfersForOrder.length} phiếu
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Điểm lấy hàng:</strong> {orderVehicleForm.pickupAddress}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Số điểm giao:</strong>{" "}
                      {Math.min(selectedTransfersForOrder.length, 10)} điểm
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tổng số kiện:</strong> {orderVehicleForm.totalPackages} |{" "}
                      <strong>Tổng khối:</strong> {orderVehicleForm.totalVolume.toFixed(2)} m³ |{" "}
                      <strong>Tổng SP:</strong> {orderVehicleForm.totalProducts}
                    </Typography>
                    {selectedTransfersForOrder.length > 10 && (
                      <Typography
                        variant="caption"
                        color="warning.main"
                        sx={{ mt: 1, display: "block" }}
                      >
                        ⚠️ Chỉ có thể đặt xe cho tối đa 10 phiếu trong 1 yêu cầu. Đã chọn{" "}
                        {selectedTransfersForOrder.length} phiếu.
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              )}

              {/* Nhà vận chuyển */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Nhà vận chuyển *</InputLabel>
                  <Select
                    value={orderVehicleForm.carrierName}
                    onChange={(e) => {
                      const carrier = carriers.find((c) => c.name === e.target.value);
                      setOrderVehicleForm({
                        ...orderVehicleForm,
                        carrierName: e.target.value,
                        carrierId: carrier?.id || "",
                      });
                    }}
                    label="Nhà vận chuyển *"
                  >
                    {carriers.map((carrier) => (
                      <MenuItem key={carrier.id || carrier.name} value={carrier.name}>
                        {carrier.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Loại xe */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Loại xe *</InputLabel>
                  <Select
                    value={orderVehicleForm.vehicleType}
                    onChange={(e) =>
                      setOrderVehicleForm({ ...orderVehicleForm, vehicleType: e.target.value })
                    }
                    label="Loại xe *"
                  >
                    <MenuItem value="truck">Xe tải</MenuItem>
                    <MenuItem value="van">Xe van</MenuItem>
                    <MenuItem value="pickup">Xe pickup</MenuItem>
                    <MenuItem value="container">Container</MenuItem>
                    <MenuItem value="motorcycle">Xe máy</MenuItem>
                    <MenuItem value="other">Khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Địa điểm lấy hàng */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa điểm lấy hàng"
                  value={orderVehicleForm.pickupAddress}
                  onChange={(e) =>
                    setOrderVehicleForm({ ...orderVehicleForm, pickupAddress: e.target.value })
                  }
                  InputProps={{ readOnly: true }}
                  sx={{ "& .MuiInputBase-input": { bgcolor: "#f5f5f5" } }}
                  helperText="Tự động lấy từ kho nguồn của phiếu đầu tiên"
                />
              </Grid>

              {/* Danh sách điểm giao hàng */}
              {selectedTransfersForOrder.length > 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: "#fafafa", maxHeight: 200, overflow: "auto" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
                      Danh sách điểm giao hàng ({selectedTransfersForOrder.length} điểm):
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      {selectedTransfersForOrder.slice(0, 10).map((transfer, index) => {
                        const deliveryAddress =
                          `${transfer.address || ""} ${transfer.ward || ""} ${transfer.district || ""} ${transfer.province || ""}`.trim() ||
                          transfer.dest ||
                          "Chưa có địa chỉ";
                        return (
                          <Box component="li" key={transfer.transfer_id} sx={{ mb: 0.5 }}>
                            <Typography variant="body2">
                              <strong>{index + 1}.</strong> {transfer.orderCode} - {deliveryAddress}{" "}
                              ({transfer.totalPackages || 0} kiện)
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                    {selectedTransfersForOrder.length > 10 && (
                      <Typography variant="caption" color="warning.main">
                        ⚠️ Chỉ hiển thị 10 điểm đầu tiên
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              )}

              {/* Ghi chú */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  value={orderVehicleForm.note}
                  onChange={(e) =>
                    setOrderVehicleForm({ ...orderVehicleForm, note: e.target.value })
                  }
                  multiline
                  rows={3}
                  placeholder="Nhập ghi chú cho yêu cầu đặt xe..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOrderVehicleDialogOpen(false);
              setOrderVehicleForm({
                carrierName: "",
                carrierId: "",
                vehicleType: "",
                note: "",
                pickupAddress: "",
                totalPackages: 0,
                totalVolume: 0,
                totalProducts: 0,
              });
              setSelectedTransfersForOrder([]);
            }}
            disabled={orderVehicleLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmitOrderVehicle}
            variant="contained"
            disabled={
              orderVehicleLoading || !orderVehicleForm.carrierName || !orderVehicleForm.vehicleType
            }
            startIcon={<DirectionsCarIcon />}
          >
            {orderVehicleLoading ? "Đang xử lý..." : "Đặt xe"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PendingDelivery;
