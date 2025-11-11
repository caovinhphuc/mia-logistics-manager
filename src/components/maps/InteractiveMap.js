import { MyLocation, Refresh } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Chip, Grid, Paper, Typography } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { proxyLocationsService } from "../../services/proxyLocationsService";

// Custom icons cho các loại địa điểm
const createCustomIcon = (color, icon) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      ">
        ${icon}
      </div>
    `,
    className: "custom-icon",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

const InteractiveMap = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [activeFilters, setActiveFilters] = useState([
    "warehouse",
    "carrier",
    "delivery_point",
    "pickup_point",
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([16.0, 108.0]); // Trung tâm Việt Nam
  const [zoom, setZoom] = useState(6);

  // Sử dụng proxyLocationsService đã import

  // Icons cho các loại địa điểm
  const locationIcons = {
    warehouse: createCustomIcon("#2196f3", "🏢"),
    carrier: createCustomIcon("#4caf50", "🚛"),
    delivery_point: createCustomIcon("#ff9800", "📦"),
    pickup_point: createCustomIcon("#9c27b0", "📍"),
  };

  // Labels cho các loại địa điểm
  const locationLabels = {
    warehouse: "Kho hàng",
    carrier: "Nhà vận chuyển",
    delivery_point: "Điểm giao hàng",
    pickup_point: "Điểm lấy hàng",
  };

  // Load dữ liệu địa điểm
  useEffect(() => {
    loadLocations();
  }, []);

  // Filter locations khi activeFilters thay đổi
  useEffect(() => {
    const filtered = locations.filter((location) => activeFilters.includes(location.type));
    setFilteredLocations(filtered);
  }, [locations, activeFilters]);

  const loadLocations = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await proxyLocationsService.getLocations();
      setLocations(data);

      // Tính toán center và zoom dựa trên dữ liệu
      if (data.length > 0) {
        const bounds = data.reduce(
          (acc, location) => {
            if (location.latitude && location.longitude) {
              acc.lat.push(location.latitude);
              acc.lng.push(location.longitude);
            }
            return acc;
          },
          { lat: [], lng: [] }
        );

        if (bounds.lat.length > 0) {
          const centerLat = bounds.lat.reduce((a, b) => a + b, 0) / bounds.lat.length;
          const centerLng = bounds.lng.reduce((a, b) => a + b, 0) / bounds.lng.length;
          setMapCenter([centerLat, centerLng]);
        }
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu địa điểm:", err);
      setError("Không thể tải dữ liệu địa điểm");
    } finally {
      setLoading(false);
    }
  };

  // Toggle filter
  const toggleFilter = (type) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((f) => f !== type) : [...prev, type]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setActiveFilters(["warehouse", "carrier", "delivery_point", "pickup_point"]);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(12);
        },
        (error) => {
          console.error("Lỗi lấy vị trí hiện tại:", error);
        }
      );
    }
  };

  // Render popup content
  const renderPopupContent = (location) => (
    <Box sx={{ minWidth: 250, p: 1 }}>
      <Typography variant="h6" gutterBottom>
        {location.name}
      </Typography>
      <Chip label={locationLabels[location.type]} size="small" color="primary" sx={{ mb: 1 }} />
      <Typography variant="body2" color="text.secondary" gutterBottom>
        📍 {location.address}
      </Typography>
      {location.phone && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          📞 {location.phone}
        </Typography>
      )}
      {location.contactPerson && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          👤 {location.contactPerson}
        </Typography>
      )}
      {location.capacity > 0 && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          📦 Dung tích: {location.capacity} m³
        </Typography>
      )}
      {location.operatingHours && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          ⏰ {location.operatingHours}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary">
        🟢 {location.status === "active" ? "Hoạt động" : "Tạm dừng"}
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "500px",
        }}
      >
        <Typography>Đang tải dữ liệu địa điểm...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "500px",
          gap: 2,
        }}
      >
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={loadLocations}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", height: "500px", width: "100%" }}>
      {/* Map Controls */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Paper sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Bộ lọc địa điểm
          </Typography>
          <ButtonGroup orientation="vertical" size="small">
            {Object.entries(locationLabels).map(([type, label]) => (
              <Button
                key={type}
                variant={activeFilters.includes(type) ? "contained" : "outlined"}
                startIcon={<span>{locationIcons[type].options.html.match(/>(.*?)</)?.[1]}</span>}
                onClick={() => toggleFilter(type)}
                sx={{
                  justifyContent: "flex-start",
                  fontSize: "0.75rem",
                  minWidth: "120px",
                }}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
          <Button size="small" onClick={resetFilters} startIcon={<Refresh />}>
            Reset
          </Button>
        </Paper>

        <Button
          variant="contained"
          startIcon={<MyLocation />}
          onClick={getCurrentLocation}
          sx={{ alignSelf: "flex-end" }}
        >
          Vị trí tôi
        </Button>
      </Box>

      {/* Statistics Panel */}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          zIndex: 1000,
        }}
      >
        <Paper sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="h6" gutterBottom>
            Thống kê địa điểm
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Tổng số
              </Typography>
              <Typography variant="h6">{locations.length}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Đang hiển thị
              </Typography>
              <Typography variant="h6">{filteredLocations.length}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render markers cho các địa điểm đã lọc */}
        {filteredLocations.map((location) => {
          if (!location.latitude || !location.longitude) return null;

          return (
            <Marker
              key={location.locationId}
              position={[location.latitude, location.longitude]}
              icon={locationIcons[location.type]}
              eventHandlers={{
                click: () => console.log("Location clicked:", location),
              }}
            >
              <Popup>{renderPopupContent(location)}</Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default InteractiveMap;
