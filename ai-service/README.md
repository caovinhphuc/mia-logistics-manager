# 🤖 MIA Logistics Manager - AI Service

AI Service cho dự đoán và phân tích logistics trong hệ thống MIA Logistics Manager.

## 📋 Tổng quan

Service này cung cấp các tính năng AI/ML cho logistics:

- ⏱️ **Dự đoán thời gian giao hàng** - Dựa trên khoảng cách, loại xe, giao thông
- 💰 **Ước tính chi phí vận chuyển** - Tính toán chi phí dựa trên khoảng cách, khối, trọng lượng
- 📊 **Dự báo nhu cầu** - Dự báo nhu cầu vận chuyển tại các địa điểm
- 🗺️ **Tối ưu hóa tuyến đường** - Tìm tuyến đường tối ưu cho nhiều điểm đến

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Trên Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Chạy service

```bash
# Development mode với auto-reload
uvicorn main_simple:app --host 0.0.0.0 --port 8000 --reload

# Hoặc production mode
python main_simple.py
```

Service sẽ chạy tại: `http://localhost:8000`

## 📡 API Endpoints

### Health Check

```bash
GET /health
```

Response:

```json
{
  "status": "OK",
  "service": "MIA Logistics AI Service",
  "version": "1.0.0",
  "timestamp": "2025-01-30T10:00:00"
}
```

### Dự đoán thời gian giao hàng

```bash
POST /api/ml/predict-delivery-time
```

Request:

```json
{
  "distance_km": 150,
  "vehicle_type": "truck",
  "traffic_condition": "normal",
  "weather": "clear"
}
```

Response:

```json
{
  "predicted_hours": 3,
  "predicted_minutes": 45,
  "confidence": 0.75,
  "factors": {
    "distance_km": 150,
    "vehicle_type": "truck",
    "base_speed_kmh": 50,
    "adjusted_speed_kmh": 38.46
  }
}
```

### Ước tính chi phí

```bash
POST /api/ml/estimate-cost
```

Request:

```json
{
  "distance_km": 200,
  "volume_m3": 5,
  "weight_kg": 1000,
  "carrier_type": "standard",
  "remote_area": false
}
```

Response:

```json
{
  "estimated_cost_vnd": 1150000,
  "breakdown": {
    "distance_cost": 1000000,
    "volume_cost": 250000,
    "weight_cost": 1000000,
    "remote_surcharge": 0,
    "subtotal": 2250000
  },
  "confidence": 0.80
}
```

### Dự báo nhu cầu

```bash
POST /api/ml/forecast-demand
```

Request:

```json
{
  "location": "Hà Nội",
  "date": "2025-02-01",
  "historical_data": null
}
```

Response:

```json
{
  "forecasted_demand": 65,
  "trend": "increasing",
  "confidence": 0.70,
  "factors": {
    "location": "Hà Nội",
    "day_of_week": 4,
    "base_demand": 50,
    "multiplier": 1.3
  }
}
```

### Tối ưu hóa tuyến đường

```bash
POST /api/ml/optimize-route
```

Request:

```json
[
  {"lat": 21.0285, "lng": 105.8542, "name": "Điểm A"},
  {"lat": 21.0245, "lng": 105.8412, "name": "Điểm B"},
  {"lat": 21.0345, "lng": 105.8512, "name": "Điểm C"}
]
```

Response:

```json
{
  "optimized_route": [
    {"lat": 21.0285, "lng": 105.8542, "name": "Điểm A"},
    {"lat": 21.0245, "lng": 105.8412, "name": "Điểm B"},
    {"lat": 21.0345, "lng": 105.8512, "name": "Điểm C"}
  ],
  "total_distance_km": 12.5,
  "estimated_time_hours": 0.25,
  "savings_percentage": 15.2
}
```

## 🧪 Testing

### Test với curl

```bash
# Health check
curl http://localhost:8000/health

# Predict delivery time
curl -X POST http://localhost:8000/api/ml/predict-delivery-time \
  -H "Content-Type: application/json" \
  -d '{
    "distance_km": 150,
    "vehicle_type": "truck",
    "traffic_condition": "normal",
    "weather": "clear"
  }'
```

## 📁 Cấu trúc thư mục

```
ai-service/
├── main_simple.py           # FastAPI application
├── requirements.txt        # Python dependencies
├── models/
│   ├── __init__.py
│   ├── logistics_predictor.py  # Logistics prediction model
│   └── your_domain_predictor.py  # Template (deprecated)
└── README.md              # Documentation
```

## ⚙️ Configuration

Service sử dụng environment variables từ `.env`:

```env
AI_SERVICE_PORT=8000
```

## 🔧 Development

### Thêm model mới

1. Tạo file model trong `models/`
2. Import trong `main_simple.py`
3. Thêm endpoint tương ứng

### Cải thiện predictions

Hiện tại model sử dụng heuristic-based predictions. Để cải thiện:

1. Thu thập dữ liệu lịch sử
2. Train ML model (scikit-learn, TensorFlow, etc.)
3. Update `LogisticsPredictor` class

## 📝 Notes

- Service hiện tại sử dụng rule-based predictions
- Để production-ready, cần train ML models với dữ liệu thực tế
- Route optimization sử dụng nearest neighbor algorithm (simplified)
- Có thể tích hợp với Google Maps API để cải thiện accuracy

## 🚀 Deployment

Service có thể deploy riêng hoặc cùng với backend:

```bash
# Using start script
./start_ai_platform.sh

# Or manually
cd ai-service
python main_simple.py
```

---

**Made with ❤️ for MIA Logistics Manager**
