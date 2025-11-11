# 🔌 PORTS CONFIGURATION - MIA LOGISTICS MANAGER

## Cấu Hình Ports Cho MIA Logistics Manager

### 📊 Port Assignment

| Service | Port | URL | Status | Config File |
|---------|------|-----|--------|-------------|
| **Frontend (React)** | `3000` | <http://localhost:3000> | ✅ Active | ports.config.sh |
| **Backend API** | `5050` | <http://localhost:5050> | ✅ Active | ports.config.sh |
| **AI Service (Python)** | `8000` | <http://localhost:8000> | 🔄 Optional | ports.config.sh |
| **Google Sheets** | `5050` | (Same as Backend) | ✅ Integrated | - |

---

## 🚀 Quick Start

### 1. Start Frontend (Port 3000)

```bash
npm start
# hoặc
npm run dev:frontend
```

**URL:** <http://localhost:3000>

### 2. Start Backend (Port 5050)

```bash
cd backend
npm start
# hoặc
node index.js
```

**URL:** <http://localhost:5050>
**Health Check:** <http://localhost:5050/health>
**API Base:** <http://localhost:5050/api>

### 3. Start AI Service (Port 8000) - Optional

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main_simple:app --host 0.0.0.0 --port 8000 --reload
```

**URL:** <http://localhost:8000>
**Health Check:** <http://localhost:8000/health>

### 4. Start All Services (Recommended)

```bash
# Từ root directory
./start-project.sh
# Hoặc
./start.sh
```

Sẽ start đồng thời:

- Frontend: `:3000`
- Backend: `:5050`
- AI Service: `:8000` (if available)

---

## 🏥 Health Check Endpoints

### Backend Health Check

```bash
GET http://localhost:5050/health
```

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2025-01-30T10:00:00.000Z",
  "service": "MIA Logistics Manager API",
  "version": "2.1.0"
}
```

### API Routes Check

```bash
GET http://localhost:5050/api/health
```

### Google Sheets Connection

```bash
GET http://localhost:5050/api/sheets/info
```

### AI Service Health Check (Optional)

```bash
GET http://localhost:8000/health
```

**Response:**

```json
{
  "status": "OK",
  "service": "MIA Logistics AI Service",
  "version": "1.0.0",
  "timestamp": "2025-01-30T10:00:00.000Z"
}
```

---

## 📡 Available API Endpoints

### Core Endpoints

Base URL: `http://localhost:5050/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/carriers` | Lấy danh sách nhà vận chuyển |
| POST | `/carriers` | Tạo carrier mới |
| GET | `/transfers` | Lấy danh sách chuyển kho |
| POST | `/transfers` | Tạo transfer mới |
| GET | `/locations` | Lấy danh sách locations |
| GET | `/transport-requests` | Lấy danh sách yêu cầu vận chuyển |
| GET | `/settings/volume-rules` | Lấy quy tắc khối lượng |
| GET | `/sheets/info` | Thông tin Google Sheets |
| GET | `/telegram/test` | Test Telegram connection |

### AI Service Endpoints (Optional)

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/ml/predict-delivery-time` | Dự đoán thời gian giao hàng |
| POST | `/api/ml/estimate-cost` | Ước tính chi phí vận chuyển |
| POST | `/api/ml/forecast-demand` | Dự báo nhu cầu |
| POST | `/api/ml/optimize-route` | Tối ưu hóa tuyến đường |

---

## 🔧 Environment Variables

### Frontend (.env)

```env
# Backend API
REACT_APP_API_URL=http://localhost:5050
REACT_APP_BACKEND_URL=http://localhost:5050

# AI Service (Optional)
REACT_APP_AI_SERVICE_URL=http://localhost:8000

# Google Sheets
REACT_APP_GOOGLE_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As

# Google Drive
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE

# Google Apps Script
REACT_APP_GOOGLE_APPS_SCRIPT_ID=1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv

# Telegram
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token
REACT_APP_TELEGRAM_CHAT_ID=your_chat_id
```

### Backend (backend/.env)

```env
PORT=5050
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Google Sheets
GOOGLE_SHEETS_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
GOOGLE_APPLICATION_CREDENTIALS=./sinuous-aviary-474820-e3-c442968a0e87.json

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### AI Service (ai-service/.env) - Optional

```env
AI_SERVICE_PORT=8000
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
3. **AI Service** - Port 8000 (if running)

**Auto-refresh:** Kiểm tra mỗi 10 giây

---

## 🐛 Troubleshooting

### Port Already in Use

#### Frontend (Port 3000)

```bash
# Tìm process
lsof -i :3000

# Kill process
lsof -ti:3000 | xargs kill -9
```

#### Backend (Port 5050)

```bash
# Tìm process
lsof -i :5050

# Kill process
lsof -ti:5050 | xargs kill -9
```

#### AI Service (Port 8000)

```bash
# Tìm process
lsof -i :8000

# Kill process
lsof -ti:8000 | xargs kill -9
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
   # Xem console output hoặc
   tail -f logs/backend-startup.log
   ```

3. **Check environment variables:**

   ```bash
   echo $PORT
   ```

4. **Check Google Service Account:**

   ```bash
   ls -la backend/sinuous-aviary-474820-e3-c442968a0e87.json
   ```

### Connection Status Always Red

1. **Backend phải chạy trước** - Port 5050
2. **Check CORS settings** trong backend/index.js
3. **Check firewall** không block ports
4. **Verify API_URL** trong .env
5. **Check proxy** trong package.json: `"proxy": "http://localhost:5050"`

### Google Sheets Connection Issues

1. **Check service account file exists**
2. **Verify spreadsheet ID** trong .env
3. **Test connection:**

   ```bash
   curl http://localhost:5050/api/sheets/info
   ```

### Telegram Notifications Not Working

1. **Check bot token** trong .env
2. **Check chat ID** trong .env
3. **Test connection:**

   ```bash
   curl http://localhost:5050/api/telegram/test
   ```

---

## 🚢 Production Ports

### Vercel/Netlify

- Frontend: Auto-assigned
- Backend API: Environment variable (PORT=5050)
- Connection: HTTPS

### Docker

```yaml
services:
  frontend:
    ports:
      - "3000:3000"
  backend:
    ports:
      - "5050:5050"
  ai-service:
    ports:
      - "8000:8000"
```

### Environment Variables (Production)

```env
PORT=5050
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
```

---

## 📝 Testing Connections

### Test Script

Tạo file `test-connections.sh`:

```bash
#!/bin/bash

echo "🔍 Testing MIA Logistics Manager Connections..."
echo ""

echo "1. Testing Backend..."
curl -s http://localhost:5050/health | jq . || echo "❌ Backend not running"

echo ""
echo "2. Testing Frontend..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200" && echo "✅ Frontend OK" || echo "❌ Frontend not running"

echo ""
echo "3. Testing Google Sheets..."
curl -s http://localhost:5050/api/sheets/info | jq . || echo "❌ Sheets connection failed"

echo ""
echo "4. Testing AI Service (Optional)..."
curl -s http://localhost:8000/health | jq . || echo "⚠️  AI Service not running (optional)"

echo ""
echo "✅ Connection test complete!"
```

Save và run:

```bash
chmod +x test-connections.sh
./test-connections.sh
```

### Manual Testing

```bash
# Backend Health
curl http://localhost:5050/health

# Google Sheets Info
curl http://localhost:5050/api/sheets/info

# Telegram Test
curl http://localhost:5050/api/telegram/test

# AI Service (if running)
curl http://localhost:8000/health
```

---

## 🎯 Quick Reference

```bash
# Start Frontend
npm start                    # Port 3000

# Start Backend
cd backend && npm start      # Port 5050

# Start AI Service (Optional)
cd ai-service && uvicorn main_simple:app --host 0.0.0.0 --port 8000

# Start All (Recommended)
./start-project.sh           # All services with notifications

# Health Checks
curl localhost:5050/health   # Backend
curl localhost:3000          # Frontend
curl localhost:8000/health   # AI Service (optional)

# Kill All Ports
lsof -ti:3000,5050,8000 | xargs kill -9

# View Logs
tail -f logs/backend-startup.log
tail -f logs/frontend-startup.log
tail -f logs/ai-service.log
```

---

## 📊 Port Usage Summary

| Port | Service | Required | Default Status |
|------|---------|----------|----------------|
| 3000 | Frontend (React) | ✅ Yes | Always Running |
| 5050 | Backend API | ✅ Yes | Always Running |
| 8000 | AI Service | ⚠️ Optional | Only when using AI features |

---

## 📞 Support

Nếu gặp vấn đề với ports/connections:

1. **Check console logs** trong terminal
2. **Xem Connection Status indicator** trong app header
3. **Kiểm tra logs** trong thư mục `logs/`
4. **Test connections** với script `test-connections.sh`
5. **Verify environment variables** trong `.env` files

**Tài liệu liên quan:**

- [PORTS_STANDARDIZATION.md](./PORTS_STANDARDIZATION.md) - Chi tiết về standardization
- [README.md](./README.md) - Tổng quan dự án
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Hướng dẫn deployment

---

**Last Updated:** 2025-01-30
**Version:** 2.1.0
