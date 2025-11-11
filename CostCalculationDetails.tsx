import React from "react";
import { Box, Typography, Paper, Divider, Chip } from "@mui/material";
import { useTransportCostCalculation } from "../hooks/useTransportCostCalculation";

interface CostCalculationDetailsProps {
  formData: {
    pricingMethod: "perKm" | "perTrip" | "perM3";
    baseRate: number;
    pricePerKm: number;
    pricePerTrip: number;
    pricePerM3: number;
    stopFee: number;
    fuelSurcharge: number;
    tollFee: number;
    insuranceFee: number;
    totalDistance: number;
    totalStops: number;
    totalVolume: number;
  };
}

export const CostCalculationDetails: React.FC<CostCalculationDetailsProps> = ({ formData }) => {
  const { calculateCost, getFormulaDescription } = useTransportCostCalculation();

  console.log("🔍 CostCalculationDetails - formData:", formData);
  console.log("🔍 CostCalculationDetails - pricePerKm:", formData.pricePerKm);
  console.log("🔍 CostCalculationDetails - totalDistance:", formData.totalDistance);

  const costBreakdown = calculateCost(formData);
  const formulaDescription = getFormulaDescription(formData.pricingMethod);

  console.log("🔍 CostCalculationDetails - costBreakdown:", costBreakdown);

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2 }}>
        📊 Chi tiết tính toán chi phí
      </Typography>

      {/* Mô tả công thức */}
      <Box mb={2}>
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
          Công thức tính:
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
          {formulaDescription}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Chi tiết từng khoản */}
      <Box mb={2}>
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
          Chi tiết từng khoản:
        </Typography>

        {costBreakdown.baseCost > 0 && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2">Base rate:</Typography>
            <Chip
              label={`${costBreakdown.baseCost.toLocaleString("vi-VN")} VND`}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )}

        {costBreakdown.distanceCost > 0 && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2">
              {formData.pricingMethod === "perKm"
                ? `Chi phí km (${formData.totalDistance.toLocaleString("vi-VN", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}km):`
                : formData.pricingMethod === "perM3"
                  ? `Chi phí khối (${formData.totalVolume.toLocaleString("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}m³):`
                  : "Chi phí chuyến:"}
            </Typography>
            <Chip
              label={`${costBreakdown.distanceCost.toLocaleString("vi-VN")} VND`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Box>
        )}

        {costBreakdown.stopCost > 0 && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2">Chi phí điểm dừng:</Typography>
            <Chip
              label={`${costBreakdown.stopCost.toLocaleString("vi-VN")} VND`}
              size="small"
              color="info"
              variant="outlined"
            />
          </Box>
        )}

        {costBreakdown.surchargeCost > 0 && (
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2">Phụ phí:</Typography>
            <Chip
              label={`${costBreakdown.surchargeCost.toLocaleString("vi-VN")} VND`}
              size="small"
              color="warning"
              variant="outlined"
            />
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Tổng chi phí */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight={600} color="primary">
          Tổng chi phí:
        </Typography>
        <Chip
          label={`${costBreakdown.totalCost.toLocaleString("vi-VN")} VND`}
          size="medium"
          color="success"
        />
      </Box>

      {/* Công thức chi tiết */}
      <Box mt={2} p={1.5} bgcolor="grey.50" borderRadius={1}>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
          {costBreakdown.formula}
        </Typography>
      </Box>
    </Paper>
  );
};
