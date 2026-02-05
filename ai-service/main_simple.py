# ai-service/main_simple.py
# MIA Logistics Manager - AI Service API
# FastAPI service cho dự đoán và phân tích logistics

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

# Import logistics models
try:
    from models.logistics_predictor import LogisticsPredictor
except ImportError:
    # Fallback nếu chưa có model
    class LogisticsPredictor:
        def predict_delivery_time(self, **kwargs):
            return {"hours": 2, "minutes": 30, "confidence": 0.5, "factors": {}}
        def estimate_shipping_cost(self, **kwargs):
            return {"total_cost": 100000, "breakdown": {}, "confidence": 0.5}
        def forecast_demand(self, **kwargs):
            return {"demand": 10, "trend": "stable", "confidence": 0.5, "factors": {}}
        def optimize_route(self, **kwargs):
            return {"route": [], "total_distance": 0, "estimated_time": 0, "savings": 0}

# Initialize FastAPI app
app = FastAPI(
    title="MIA Logistics Manager AI Service",
    description="AI Service cho dự đoán và phân tích logistics",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên giới hạn domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor
logistics_predictor = LogisticsPredictor()

# Request/Response Models
class DeliveryTimeRequest(BaseModel):
    distance_km: float
    vehicle_type: str  # "truck", "van", "motorcycle"
    traffic_condition: Optional[str] = "normal"  # "low", "normal", "high"
    weather: Optional[str] = "clear"  # "clear", "rain", "fog"

class CostEstimateRequest(BaseModel):
    distance_km: float
    volume_m3: float
    weight_kg: float
    carrier_type: str  # "standard", "express", "premium"
    remote_area: Optional[bool] = False

class DemandForecastRequest(BaseModel):
    location: str
    date: str  # YYYY-MM-DD
    historical_data: Optional[List[dict]] = None

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "OK",
        "service": "MIA Logistics AI Service",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint với thông tin service"""
    return {
        "service": "MIA Logistics Manager AI Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "predict_delivery_time": "/api/ml/predict-delivery-time",
            "estimate_cost": "/api/ml/estimate-cost",
            "forecast_demand": "/api/ml/forecast-demand",
            "optimize_route": "/api/ml/optimize-route"
        }
    }

# Predict delivery time
@app.post("/api/ml/predict-delivery-time")
async def predict_delivery_time(request: DeliveryTimeRequest):
    """
    Dự đoán thời gian giao hàng dựa trên khoảng cách và điều kiện vận chuyển

    Args:
        request: DeliveryTimeRequest với thông tin khoảng cách, loại xe, giao thông

    Returns:
        Dự đoán thời gian giao hàng (giờ) và độ tin cậy
    """
    try:
        prediction = logistics_predictor.predict_delivery_time(
            distance_km=request.distance_km,
            vehicle_type=request.vehicle_type,
            traffic_condition=request.traffic_condition,
            weather=request.weather
        )
        return {
            "predicted_hours": prediction["hours"],
            "predicted_minutes": prediction["minutes"],
            "confidence": prediction["confidence"],
            "factors": prediction.get("factors", {})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Estimate shipping cost
@app.post("/api/ml/estimate-cost")
async def estimate_cost(request: CostEstimateRequest):
    """
    Ước tính chi phí vận chuyển dựa trên khoảng cách, khối lượng và loại dịch vụ

    Args:
        request: CostEstimateRequest với thông tin khoảng cách, khối, trọng lượng

    Returns:
        Ước tính chi phí (VND) và breakdown
    """
    try:
        estimate = logistics_predictor.estimate_shipping_cost(
            distance_km=request.distance_km,
            volume_m3=request.volume_m3,
            weight_kg=request.weight_kg,
            carrier_type=request.carrier_type,
            remote_area=request.remote_area
        )
        return {
            "estimated_cost_vnd": estimate["total_cost"],
            "breakdown": estimate["breakdown"],
            "confidence": estimate["confidence"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Demand forecasting
@app.post("/api/ml/forecast-demand")
async def forecast_demand(request: DemandForecastRequest):
    """
    Dự báo nhu cầu vận chuyển tại một địa điểm cụ thể

    Args:
        request: DemandForecastRequest với địa điểm và ngày

    Returns:
        Dự báo nhu cầu và xu hướng
    """
    try:
        forecast = logistics_predictor.forecast_demand(
            location=request.location,
            date=request.date,
            historical_data=request.historical_data
        )
        return {
            "forecasted_demand": forecast["demand"],
            "trend": forecast["trend"],
            "confidence": forecast["confidence"],
            "factors": forecast.get("factors", {})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route optimization (placeholder)
@app.post("/api/ml/optimize-route")
async def optimize_route(waypoints: List[dict]):
    """
    Tối ưu hóa tuyến đường cho nhiều điểm đến

    Args:
        waypoints: Danh sách các điểm cần giao hàng

    Returns:
        Tuyến đường tối ưu
    """
    try:
        optimized = logistics_predictor.optimize_route(waypoints)
        return {
            "optimized_route": optimized["route"],
            "total_distance_km": optimized["total_distance"],
            "estimated_time_hours": optimized["estimated_time"],
            "savings_percentage": optimized.get("savings", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run server
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")

