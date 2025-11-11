# 🔌 PORTS CONFIGURATION

## Cấu Hình Ports Cho MIA Logistics Manager

### 📊 Port Assignment

| Service | Port | URL | Status |
|---------|------|-----|--------|
| **Frontend (React)** | `3000` | <http://localhost:3000> | ✅ Active |
| **Backend API** | `5050` | <http://localhost:5050> | ✅ Active |
| **AI Service (Python)** | `8000` | <http://localhost:8000> | 🔄 Optional |
| **Google Sheets Backend** | `5050` | (Same as Backend) | ✅ Integrated |

---

## 🚀 Quick Start

### 1. Start Frontend (Port 3000)

```bash
npm start
# hoặc
npm run dev
```

**URL:** <http://localhost:3000>

### 2. Start Backend (Port 5050)

```bash
cd backend
node server.cjs
# hoặc
npm start  # runs node server.cjs
```

**URL:** <http://localhost:5050>
**Health Check:** <http://localhost:5050/health>
**API Status:** <http://localhost:5050/api/status>

### 3. Start All Services (Recommended)

```bash
# Từ root directory
npm run dev
```

Sẽ start đồng thời:

- Frontend: :3000
- Backend: :5050
- AI Service: :8000 (if available)

---

## 🏥 Health Check Endpoints

### Backend Health Check

```bash
GET http://localhost:5050/health
```

**Response:**

```json
{
  "status": "healthy",
  "service": "Backend API",
  "port": 5050,
  "timestamp": "2024-10-14T...",
  "uptime": 123.45,
  "environment": "development",
  "connections": {
    "googleSheets": true,
    "database": true
  }
}
```

### API Status Check

```bash
GET http://localhost:5050/api/status
```

**Response:**

```json
{
  "success": true,
  "message": "Backend API is running",
  "version": "3.0.0",
  "timestamp": "2024-10-14T...",
  "services": {
    "googleSheets": {
      "status": "connected",
      "message": "Google Sheets API ready"
    },
    "backend": {
      "status": "running",
      "port": 5050
    }
  }
}
```

---

## 📡 Available API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/status` | API status |
| GET | `/api/sheets/test` | Google Sheets test |

### Custom Metrics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/custom/logistics-overview` | Tổng quan vận chuyển |
| GET | `/api/custom/shipment-metrics` | Metrics vận chuyển |
| GET | `/api/custom/carrier-performance` | Hiệu suất nhà vận chuyển |
| GET | `/api/custom/revenue-metrics` | Doanh thu |
| GET | `/api/custom/route-optimization` | Tối ưu lộ trình |
| POST | `/api/custom/predict-demand` | Dự đoán nhu cầu (AI) |

---

## 🔧 Environment Variables

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5050
REACT_APP_AI_SERVICE_URL=http://localhost:8000
```

### Backend (backend/.env)

```env
PORT=5050
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Google Sheets
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_CREDENTIALS=./service-account-key.json
```

---

## 📊 Connection Status Indicator

Ứng dụng hiển thị **real-time connection status** ở header:

### Status Colors

- 🟢 **Green** = Connected (Pulsing animation)
- 🔴 **Red** = Disconnected

### Monitored Services

1. **Backend API** - Port 5050
2. **Google Sheets** - Integration status

**Auto-refresh:** Kiểm tra mỗi 10 giây

---

## 🐛 Troubleshooting

### Port Already in Use

#### Frontend (Port 3000)

```bash
# Tìm process
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Backend (Port 5050)

```bash
# Tìm process
lsof -i :5050

# Kill process
kill -9 <PID>
```

### Backend Not Connecting

1. **Check backend đang chạy:**

   ```bash
   curl http://localhost:5050/health
   ```

2. **Check logs:**

   ```bash
   cd backend
   npm start
   # Xem console output
   ```

3. **Check environment variables:**

   ```bash
   echo $REACT_APP_API_URL
   ```

### Connection Status Always Red

1. **Backend phải chạy trước**
2. **Check CORS settings** trong backend/server.js
3. **Check firewall** không block ports
4. **Verify API_URL** trong .env

---

## 🚢 Production Ports

### Vercel/Netlify

- Frontend: Auto-assigned
- Backend API: Environment variable
- Connection: HTTPS

### Docker

```yaml
services:
  frontend:
    ports:
      - "8080:80"
  backend:
    ports:
      - "5050:5050"
```

---

## 📝 Testing Connections

### Test Script

```bash
#!/bin/bash

echo "Testing Backend..."
curl http://localhost:5050/health

echo "\nTesting Frontend..."
curl http://localhost:3000

echo "\nTesting API Endpoint..."
curl http://localhost:5050/api/custom/logistics-overview
```

Save as `test-connections.sh` và run:

```bash
chmod +x test-connections.sh
./test-connections.sh
```

---

## 🎯 Quick Reference

```bash
# Start Frontend
npm start                    # Port 3000

# Start Backend
cd backend && npm start      # Port 5050

# Start All (Concurrently)
npm run dev                  # All services

# Health Checks
curl localhost:5050/health   # Backend
curl localhost:3000          # Frontend

# Stop All
Ctrl + C                     # In terminal
```

---

**📞 Support:** Nếu gặp vấn đề với ports/connections, check console logs hoặc xem Connection Status indicator trong app header.
