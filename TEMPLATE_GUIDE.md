# 🎯 **REACT OAS INTEGRATION - TEMPLATE GUIDE**

## **How to Use This Project as Your Analytics Platform Template**

---

## 🚀 **QUICK START - CLONE & CUSTOMIZE**

### **1. Clone the Template**

```bash
# Clone this repository
git clone https://github.com/your-username/react-oas-integration-project.git
cd react-oas-integration-project

# Rename for your project
mv react-oas-integration-project your-analytics-platform
cd your-analytics-platform

# Initialize new git repository
rm -rf .git
git init
git add .
git commit -m "Initial commit: Analytics platform template"
```

### **2. Quick Setup (5 minutes)**

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..
c && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cd ..

# Start platform
./start_ai_platform.sh

# Verify: http://localhost:8080
```

---

## 🎨 **CUSTOMIZATION ROADMAP**

### **Phase 1: Branding (30 mins)**

#### **Update Project Identity**

```json
// package.json
{
  "name": "your-company-analytics",
  "description": "Analytics Platform for Your Company",
  "version": "1.0.0",
  "author": "Your Company"
}
```

#### **Brand Configuration**

```javascript
// src/config/brand.js (CREATE THIS FILE)
export const BRAND_CONFIG = {
  companyName: "Your Company Name",
  productName: "Your Analytics Platform",
  logo: "/assets/your-logo.png",
  favicon: "/favicon-your-brand.ico",
  colors: {
    primary: "#your-primary-color",
    secondary: "#your-secondary-color",
    accent: "#your-accent-color",
  },
  contact: {
    email: "support@yourcompany.com",
    website: "https://yourcompany.com",
  },
};
```

#### **Update App Header**

```jsx
// src/App.jsx - Line ~15
import { BRAND_CONFIG } from "./config/brand";

// Replace title
document.title = BRAND_CONFIG.productName;

// Update navigation
<AppBar>
  <Toolbar>
    <img src={BRAND_CONFIG.logo} alt="Logo" height="40" />
    <Typography variant="h6">{BRAND_CONFIG.productName}</Typography>
  </Toolbar>
</AppBar>;
```

### **Phase 2: Data Integration (1-2 hours)**

#### **Connect Your Database**

```javascript
// backend/src/config/database.js (CREATE THIS FILE)
const DATABASE_CONFIG = {
  // Replace with your database
  mongodb: {
    url: process.env.MONGODB_URL || "mongodb://localhost:27017/your-analytics",
  },
  mysql: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "your-user",
    password: process.env.DB_PASSWORD || "your-password",
    database: process.env.DB_NAME || "your-analytics",
  },
  postgresql: {
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://user:password@localhost:5432/your-analytics",
  },
};
```

#### **Replace Mock Data Sources**

```javascript
// backend/server.js - Replace lines ~50-80
// Current: Mock data generation
const mockMetrics = () => ({
  responseTime: Math.random() * 200 + 50,
  activeUsers: Math.floor(Math.random() * 1000) + 100,
  // ...
});

// Replace with: Real data queries
const getRealMetrics = async () => {
  const metrics = await db
    .collection("metrics")
    .findOne({}, { sort: { timestamp: -1 } });
  return {
    responseTime: metrics.avg_response_time,
    activeUsers: metrics.current_active_users,
    cpuUsage: metrics.server_cpu_percent,
    memoryUsage: metrics.server_memory_percent,
    errorRate: metrics.error_rate_percent,
  };
};
```

#### **Custom API Endpoints**

```javascript
// backend/src/routes/custom-metrics.js (CREATE THIS FILE)
const express = require("express");
const router = express.Router();

// Your specific business metrics
router.get("/sales-metrics", async (req, res) => {
  const salesData = await getSalesMetrics(); // Your implementation
  res.json(salesData);
});

router.get("/user-analytics", async (req, res) => {
  const userData = await getUserAnalytics(); // Your implementation
  res.json(userData);
});

router.get("/performance-kpis", async (req, res) => {
  const kpis = await getPerformanceKPIs(); // Your implementation
  res.json(kpis);
});

module.exports = router;
```

### **Phase 3: AI Model Customization (2-4 hours)**

#### **Replace Generic Models with Domain-Specific**

```python
# ai-service/models/your_domain_predictor.py (CREATE THIS FILE)
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

class YourDomainPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False

    def train_on_your_data(self, historical_data):
        """Train model with your company's historical data"""
        # Example for e-commerce
        features = ['hour_of_day', 'day_of_week', 'month', 'promotion_active',
                   'weather_score', 'competitor_activity']
        target = 'sales_volume'  # or 'user_count', 'response_time', etc.

        X = historical_data[features]
        y = historical_data[target]

        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True

    def predict_your_metrics(self, current_features):
        """Generate predictions specific to your business"""
        if not self.is_trained:
            # Fallback to basic prediction
            return self._fallback_prediction()

        features_scaled = self.scaler.transform([current_features])
        prediction = self.model.predict(features_scaled)[0]

        return {
            'predicted_value': float(prediction),
            'confidence': self._calculate_confidence(current_features),
            'business_insight': self._generate_business_insight(prediction)
        }

    def _generate_business_insight(self, prediction):
        """Domain-specific insights"""
        # Customize based on your business
        if prediction > self.historical_average * 1.2:
            return "📈 Expecting higher than average performance"
        elif prediction < self.historical_average * 0.8:
            return "📉 May need attention - below average expected"
        else:
            return "📊 Normal performance range expected"
```

#### **Update AI Service Main**

```python
# ai-service/main_simple.py - Add your custom endpoints
from models.your_domain_predictor import YourDomainPredictor

app = FastAPI(title="Your Company AI Analytics API")

# Initialize your custom model
your_predictor = YourDomainPredictor()

@app.post("/api/ml/predict-sales")
async def predict_sales(request: SalesRequest):
    """Your business-specific predictions"""
    predictions = your_predictor.predict_your_metrics(request.dict())
    return predictions

@app.post("/api/ml/business-insights")
async def get_business_insights(request: BusinessDataRequest):
    """Your domain-specific insights"""
    insights = analyze_your_business_data(request.dict())
    return insights
```

### **Phase 4: UI Customization (1-2 hours)**

#### **Custom Dashboard Widgets**

```jsx
// src/components/custom/YourMetricsWidget.jsx (CREATE THIS FILE)
import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Line } from "react-chartjs-2";

const YourMetricsWidget = () => {
  const [salesData, setSalesData] = useState(null);
  const [userMetrics, setUserMetrics] = useState(null);

  useEffect(() => {
    // Fetch your specific metrics
    fetchYourMetrics();
  }, []);

  const fetchYourMetrics = async () => {
    try {
      const [sales, users] = await Promise.all([
        fetch("/api/custom/sales-metrics").then((r) => r.json()),
        fetch("/api/custom/user-analytics").then((r) => r.json()),
      ]);
      setSalesData(sales);
      setUserMetrics(users);
    } catch (error) {
      console.error("Error fetching custom metrics:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 2,
      }}
    >
      {/* Sales Performance Card */}
      <Card
        sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
            📊 Sales Performance
          </Typography>
          <Typography variant="h4" sx={{ color: "white" }}>
            ${salesData?.totalRevenue?.toLocaleString() || "Loading..."}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            {salesData?.growthRate > 0 ? "📈" : "📉"} {salesData?.growthRate}%
            vs last period
          </Typography>
        </CardContent>
      </Card>

      {/* Your Custom KPI Card */}
      <Card
        sx={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: "white", mb: 2 }}>
            🎯 Your Key Metric
          </Typography>
          <Typography variant="h4" sx={{ color: "white" }}>
            {userMetrics?.yourKPI || "Loading..."}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Target: {userMetrics?.target} | Status: {userMetrics?.status}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default YourMetricsWidget;
```

#### **Add to Main Dashboard**

```jsx
// src/components/dashboard/LiveDashboard.jsx - Add your widgets
import YourMetricsWidget from "../custom/YourMetricsWidget";

// Add in the render section after existing widgets
<YourMetricsWidget />;
```

---

## 🔄 **DEPLOYMENT & SHARING**

### **Method 1: GitHub Repository (Recommended)**

```bash
# Tạo repository mới trên GitHub trước, sau đó:
git remote add origin https://github.com/your-username/mia-logistics-manager.git
git branch -M main
git push -u origin main

# Người khác có thể clone:
git clone https://github.com/your-username/mia-logistics-manager.git
cd mia-logistics-manager
npm install
cd backend && npm install && cd ..
```

### **Method 2: Docker Distribution**

```dockerfile
# Dockerfile - Full stack container cho MIA Logistics Manager
FROM node:18-alpine as frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine as backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
COPY backend/sinuous-aviary-474820-e3-c442968a0e87.json ./

# Multi-stage final image
FROM node:18-alpine
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/build ./build

# Copy backend
COPY --from=backend /app ./backend

# Install dependencies
RUN apk add --no-cache curl

EXPOSE 3000 5050

# Start script
CMD ["sh", "-c", "cd backend && node index.js & cd .. && npm run serve"]
```

### **Method 3: Quick Deployment Script**

```bash
# Sử dụng script có sẵn trong project
./start-project.sh

# Hoặc deploy production
./production_deploy.sh
```

### **Method 4: Vercel/Netlify Deployment**

```bash
# Deploy Frontend lên Vercel
vercel --prod

# Deploy lên Netlify
netlify deploy --prod

# Backend cần deploy riêng (Railway, Heroku, hoặc VPS)
```

---

## 📋 **CUSTOMIZATION CHECKLIST - MIA LOGISTICS MANAGER**

### **✅ Phase 1: Cấu hình Google Workspace (Required)**

- [x] Google Sheets API - 25 tabs connected
- [x] Google Drive API - Folder configured
- [x] Google Apps Script - Distance calculator working
- [ ] Share Google Drive folder với service accounts
- [ ] Update spreadsheet IDs nếu cần
- [ ] Configure service account credentials

### **✅ Phase 2: Backend Routes (Required) - 100% Complete**

- [x] Carriers routes - `/api/carriers` ✅ Full CRUD
- [x] Transfers routes - `/api/transfers` ✅ Full CRUD
- [x] Locations routes - `/api/locations` ✅ Full CRUD
- [x] Transport Requests routes - `/api/transport-requests` ✅ Full CRUD
- [x] Settings routes - `/api/settings` ✅ Volume rules
- [x] **Telegram routes** - `/api/telegram` ✅ **100% Complete** (3 endpoints: `/env`, `/test`, `/send`)
- [x] Google Sheets routes - `/api/sheets` ✅ Info & operations
- [x] **Authentication routes** - `/api/auth` ✅ **Complete** (9 endpoints: login, register, users CRUD, etc.)
- [x] **Employees routes** - `/api/employees` ✅ **Complete** (Full CRUD)
- [x] **Roles & Permissions routes** - `/api/roles`, `/api/role-permissions` ✅ **Complete** (Full CRUD)
- [x] Admin routes - `/api/admin` ✅ Stats & sheets info
- [x] Inbound routes - `/api/inbound/domestic`, `/api/inbound/international` ✅ Full CRUD

**Total:** 16 route modules, 50+ API endpoints - ✅ **100% Complete**

### **✅ Phase 3: Frontend Features (Optional)**

- [x] Dashboard tổng quan
- [x] Quản lý vận chuyển
- [x] Quản lý nhà vận chuyển
- [x] Quản lý kho và chuyển kho
- [x] Nhập hàng (Domestic & International)
- [ ] Báo cáo và analytics
- [ ] Mobile app (optional)
- [ ] Real-time notifications UI

### **✅ Phase 4: Integrations (Required)**

- [x] **Telegram notifications** - ✅ 100% Complete
  - [x] Backend routes triển khai (`telegramRoutes.js`)
  - [x] 3 API endpoints hoạt động (`/env`, `/test`, `/send`)
  - [x] Bot đã cấu hình và kết nối (`@mia_logistics_manager_bot`)
  - [x] Environment variables đã set
  - [x] Testing đã hoàn tất (2025-10-31)
  - [x] Documentation đã cập nhật (4 MD files)
- [ ] Email notifications (SendGrid - cần update API key)
- [x] Google Maps integration
- [ ] SMS notifications (optional)
- [ ] Payment gateway (optional)

### **✅ Phase 5: Deployment (Required)**

- [ ] Configure environment variables trên production
- [ ] Set up Google Cloud credentials
- [ ] Configure domain and SSL
- [ ] Set up monitoring và logging
- [ ] Performance optimization
- [ ] Backup strategy cho Google Sheets data

---

## 🎯 **LOGISTICS-SPECIFIC METRICS & FEATURES**

### **Transport Management Metrics**

```javascript
// Metrics cho quản lý vận chuyển
const LOGISTICS_METRICS = {
  transport: {
    activeTrips: "Số chuyến đang vận chuyển",
    completedToday: "Số chuyến hoàn thành hôm nay",
    onTimeRate: "Tỷ lệ giao hàng đúng giờ %",
    averageDeliveryTime: "Thời gian giao hàng trung bình (giờ)",
  },
  carriers: {
    activeCarriers: "Số nhà vận chuyển hoạt động",
    totalVehicles: "Tổng số phương tiện",
    utilizationRate: "Tỷ lệ sử dụng phương tiện %",
    averageRating: "Đánh giá trung bình",
  },
  warehouse: {
    totalLocations: "Số kho/vị trí",
    inventoryValue: "Giá trị tồn kho",
    transferRequests: "Yêu cầu chuyển kho",
    stockAccuracy: "Độ chính xác tồn kho %",
  },
  inbound: {
    domesticToday: "Nhập hàng nội địa hôm nay",
    internationalToday: "Nhập hàng quốc tế hôm nay",
    pendingClearance: "Đang chờ thông quan",
    averageProcessingTime: "Thời gian xử lý trung bình",
  },
};
```

### **API Endpoints Structure**

```javascript
// Backend routes structure
const API_ROUTES = {
  carriers: "/api/carriers",
  transfers: "/api/transfers",
  locations: "/api/locations",
  transportRequests: "/api/transport-requests",
  inboundDomestic: "/api/inbound/domestic",
  inboundInternational: "/api/inbound/international",
  settings: "/api/settings",
  telegram: "/api/telegram",
  googleSheets: "/api/sheets",
  auth: "/api/auth",
  employees: "/api/employees",
  roles: "/api/roles",
};
```

### **Google Sheets Integration**

```javascript
// Sheets structure trong Google Spreadsheet
const SHEETS_CONFIG = {
  spreadsheetId: "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As",
  sheets: {
    orders: "Orders",
    carriers: "Carriers",
    locations: "Locations",
    transfers: "Transfers",
    volumeRules: "VolumeRules",
    inboundDomestic: "InboundDomestic",
    inboundInternational: "InboundInternational",
    transportRequests: "TransportRequests",
    employees: "Employees",
    roles: "Roles",
    rolePermissions: "RolePermissions",
    users: "Users",
    logs: "Logs",
  },
};
```

---

## 🚀 **QUICK DEPLOYMENT COMMANDS - MIA LOGISTICS**

### **Local Development**

```bash
# Quick start với tất cả services
git clone https://github.com/your-username/mia-logistics-manager.git
cd mia-logistics-manager
npm install
cd backend && npm install && cd ..

# Start project (recommended - có Telegram notifications)
./start-project.sh

# Hoặc start đơn giản
./start.sh

# Hoặc start từng service riêng
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
npm start
```

### **Production Deployment**

```bash
# Build production
npm run build

# Deploy Frontend (Vercel/Netlify)
vercel --prod
# hoặc
netlify deploy --prod

# Deploy Backend (Railway/Heroku/VPS)
# Railway: railway up
# Heroku: git push heroku main
# VPS: pm2 start ecosystem.config.js
```

### **Health Checks**

```bash
# Kiểm tra các services
curl http://localhost:3000              # Frontend
curl http://localhost:5050/api/health   # Backend API
curl http://localhost:5050/api/sheets/info  # Google Sheets connection

# Test Telegram (3 endpoints)
curl http://localhost:5050/api/telegram/env              # Check config
curl -X GET http://localhost:5050/api/telegram/test      # Send test message
curl -X POST http://localhost:5050/api/telegram/send \  # Send custom message
  -H "Content-Type: application/json" \
  -d '{"text":"🧪 Test notification"}'

# Test Google Sheets
curl http://localhost:5050/api/sheets/info
```

---

## 📞 **SUPPORT & DOCUMENTATION**

### **Tài Liệu Dự Án**

- `README.md` - Hướng dẫn tổng quan và cài đặt
- `TEMPLATE_GUIDE.md` - Hướng dẫn tùy chỉnh (file này)
- `DEPLOYMENT.md` - Hướng dẫn deployment chi tiết
- `GOOGLE_SHEETS_SETUP.md` - Cấu hình Google Sheets
- `QUICK_SETUP.md` - Hướng dẫn setup nhanh

### **Cấu Hình Hiện Tại**

| Service | Status | Details |
|---------|--------|---------|
| **Google Sheets** | ✅ Connected | 25 tabs accessible |
| **Google Drive** | ✅ Configured | Folder ID set |
| **Telegram Bot** | ✅ **100% Complete** | Bot `@mia_logistics_manager_bot` active, 3 endpoints working |
| **Google Apps Script** | ✅ Working | Distance calculator |
| **Email** | ⚠️ Configured | SendGrid API key cần update |

### **Telegram Integration Details**

- ✅ **Bot Name:** `mia-logistics-manager`
- ✅ **Bot Username:** `@mia_logistics_manager_bot`
- ✅ **Bot ID:** `8434038911`
- ✅ **Chat Group:** `MIA.vn-Logistics`
- ✅ **Chat ID:** `-4818209867`
- ✅ **API Endpoints:** 3/3 working (`/env`, `/test`, `/send`)
- ✅ **Documentation:** 4 MD files complete
- ✅ **Test Status:** All tests passed (2025-10-31)

### **Liên Hệ Hỗ Trợ**

- **Email**: <kho.1@mia.vn>
- **GitHub Issues**: <https://github.com/your-username/mia-logistics-manager/issues>
- **Telegram**: Bot notifications tự động

### **Services Status**

| Service | Status | Port | Note |
|---------|--------|------|------|
| Frontend | Running | 3000 | React App |
| Backend API | Running | 5050 | Express Server (16 route modules) |
| Google Sheets | Connected | - | 25 tabs accessible |
| **Telegram Bot** | ✅ **100% Complete** | - | Bot `@mia_logistics_manager_bot`, 3 API endpoints working |
| Google Drive | Configured | - | Cần share folder với service accounts |
| AI Service | Optional | 8000 | Python/FastAPI (nếu deploy) |

---

**🎉 MIA Logistics Manager - Hệ thống quản lý vận chuyển chuyên nghiệp!** 🚚✨

---

## ✅ **TELEGRAM INTEGRATION STATUS**

<div align="center">

### 🎉 **100% HOÀN THÀNH** ✅

| Component | Status | Details |
|-----------|--------|---------|
| **Backend Routes** | ✅ Complete | `telegramRoutes.js` - 3 endpoints |
| **API Endpoints** | ✅ Working | `/env`, `/test`, `/send` |
| **Bot Configuration** | ✅ Active | `@mia_logistics_manager_bot` |
| **Environment Config** | ✅ Set | Token & Chat ID configured |
| **Testing** | ✅ Complete | All tests passed (2025-10-31) |
| **Documentation** | ✅ Complete | 4 MD files updated |

**Test Date:** `2025-10-31`
**Integration Status:** ✅ **PRODUCTION READY**

---

</div>

_Template Guide v1.1 | MIA Logistics Manager v2.1.0 | Telegram Integration 100% Complete_
