# 📊 PHÂN TÍCH LUỒNG DỮ LIỆU & GIAO DIỆN - MIA LOGISTICS MANAGER

---

## 🎯 TỔNG QUAN HỆ THỐNG

### **Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│                    Port: 3000                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Layout Component (Sidebar + Header + Content)      │   │
│  │  - ConnectionStatus Monitor                         │   │
│  │  - Navigation Menu (14 main items)                  │   │
│  │  - Real-time Status Indicators                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API (Express)                      │
│                    Port: 5050                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Endpoints (7 routes)                           │   │
│  │  - Health Check                                     │   │
│  │  - Logistics Overview                               │   │
│  │  - Shipment Metrics                                 │   │
│  │  - Carrier Performance                              │   │
│  │  - Revenue Metrics                                  │   │
│  │  - Route Optimization                               │   │
│  │  - AI Demand Prediction                             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ Google Sheets API
┌─────────────────────────────────────────────────────────────┐
│               GOOGLE SHEETS (Database)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Sheets:                                            │   │
│  │  - Đơn hàng (Orders)                                │   │
│  │  - Vận chuyển (Shipments)                           │   │
│  │  - Nhà vận chuyển (Carriers)                        │   │
│  │  - Nhân viên (Employees)                            │   │
│  │  - Inbound Quốc tế                                  │   │
│  │  - Inbound Nội địa                                  │   │
│  │  - Cài đặt (Settings)                               │   │
│  │  - Users & Permissions                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌊 LUỒNG DỮ LIỆU CHI TIẾT

### **1. User → Frontend (Port 3000)**

```
User opens: http://localhost:3000
    ↓
index.tsx (Entry Point)
    ↓
RouterProvider (from router.tsx)
    ↓
Layout Component (Sidebar + Header + Content)
    ↓
Outlet (React Router) renders child routes
```

### **2. Frontend → Backend (Port 5050)**

```
Component (e.g., AIDashboard)
    ↓
fetch(`http://localhost:5050/api/custom/logistics-overview`)
    ↓
Backend Express Server
    ↓
Route Handler (/api/custom/logistics-overview)
    ↓
Google Sheets API Service (if configured)
    ↓
Return JSON Response
    ↓
Component updates state
    ↓
UI re-renders
```

### **3. ConnectionStatus Monitoring**

```
ConnectionStatus Component
    ↓
setInterval (every 10s)
    ↓
fetch(`http://localhost:5050/health`)
    ↓
Backend responds with health data
    ↓
Update status indicators:
    - Backend: 🟢/🔴
    - Google Sheets: 🟢/🔴
    ↓
Display in Header
```

---

## 🖥️ GIAO DIỆN HIỂN THỊ

### **Layout Structure:**

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR (260px)                │  MAIN CONTENT AREA        │
│  ┌──────────────────┐           │  ┌─────────────────────┐  │
│  │ 🚚 MIA Logistics │           │  │ TOP HEADER          │  │
│  │ Manager v3.0     │           │  │ ┌─────────────────┐ │  │
│  │ [◀]             │           │  │ │ Page Title      │ │  │
│  └──────────────────┘           │  │ │ Date            │ │  │
│  ┌──────────────────┐           │  │ │                 │ │  │
│  │ 🏠 Trang chủ     │           │  │ │ [Connection]    │ │  │
│  │ 📦 Vận chuyển ▼  │           │  │ │ [Status]        │ │  │
│  │   • YC vận chuyển│           │  │ └─────────────────┘ │  │
│  │   • Chờ chuyển   │           │  ├─────────────────────┤  │
│  │   • Đơn VC       │           │  │                     │  │
│  │   • Tính khối    │           │  │  PAGE CONTENT       │  │
│  │ 📥 Inbound ▼     │           │  │  (Outlet)           │  │
│  │   • Quốc tế      │           │  │                     │  │
│  │   • Nội địa      │           │  │  - Dashboard        │  │
│  │   • Lịch trình   │           │  │  - AI Analytics     │  │
│  │   • Báo cáo      │           │  │  - Forms            │  │
│  │ 📋 Đơn hàng      │           │  │  - Tables           │  │
│  │ 🚛 Nhà VC        │           │  │  - Charts           │  │
│  │ 📍 Địa điểm      │           │  │                     │  │
│  │ 🗺️ Theo dõi      │           │  ├─────────────────────┤  │
│  │ 📊 Kho hàng      │           │  │ FOOTER              │  │
│  │ 🔄 Chuyển kho    │           │  │ © 2024 MIA          │  │
│  │ 👥 Nhân viên     │           │  └─────────────────────┘  │
│  │ ⚙️ Cài đặt ▼     │           │                           │
│  │ 📚 Hướng dẫn     │           │                           │
│  │ 📝 Nhật ký       │           │                           │
│  │ 🔐 Quản trị      │           │                           │
│  └──────────────────┘           │                           │
└─────────────────────────────────────────────────────────────┘
```

### **Header với Connection Status:**

```
┌─────────────────────────────────────────────────────────────┐
│  Quản lý vận chuyển                   [🟢 Backend: :5050]  │
│  14/10/2024                           [🟢 Google Sheets]   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 ROUTES & PAGES

### **Main Routes (14 chức năng):**

| Route | Component | Chức năng | Google Sheet |
|-------|-----------|-----------|--------------|
| `/` | Dashboard | Trang chủ, tổng quan | Multiple |
| `/shipments` | TransportRequestsSheet | Yêu cầu vận chuyển | Vận chuyển |
| `/shipments/pending-transfer` | PendingTransfer | Chờ chuyển kho | Transfers |
| `/shipments/transport-requests` | TransportRequests | Đơn vận chuyển | Transport |
| `/shipments/volume-calculator` | VolumeCalculator | Tính khối lượng | Volume Rules |
| `/inbound/international` | InboundInternational | Inbound quốc tế | Inbound Intl |
| `/inbound/domestic` | InboundDomestic | Inbound nội địa | Inbound Domestic |
| `/inbound/schedule` | InboundSchedule | Lịch trình inbound | Schedule |
| `/inbound/reports` | InboundReports | Báo cáo inbound | Reports |
| `/orders` | OrdersList | Quản lý đơn hàng | Orders |
| `/carriers` | CarriersList | Nhà vận chuyển | Carriers |
| `/locations` | LocationsList | Địa điểm | Locations |
| `/tracking` | TrackingDashboard | Theo dõi GPS | Tracking |
| `/inventory` | InventoryManager | Kho hàng | Inventory |
| `/transfers` | TransferList | Chuyển kho | Transfers |
| `/employees` | Employees | Nhân viên | Employees |
| `/settings` | Settings | Cài đặt | Settings |
| `/settings/roles` | AuthorizationRoles | Phân quyền | Roles |
| `/settings/permissions` | AuthorizationPermissions | Quyền hạn | Permissions |
| `/settings/users` | AuthorizationUsers | Users | Users |
| `/docs/authorization` | AuthorizationGuide | Hướng dẫn | - |
| `/logs` | Logs | Nhật ký | Logs |
| `/admin` | AdminPage | Quản trị | Admin |

---

## 🔄 LUỒNG DỮ LIỆU CỤ THỂ

### **Example: Logistics Overview**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                              │
├─────────────────────────────────────────────────────────────┤
│ User opens: http://localhost:3000/                         │
│ hoặc clicks "Dashboard" trong menu                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. FRONTEND ROUTING                                         │
├─────────────────────────────────────────────────────────────┤
│ router.tsx → path: "/" → element: <Dashboard />            │
│ Layout wraps Dashboard component                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. COMPONENT MOUNT                                          │
├─────────────────────────────────────────────────────────────┤
│ Dashboard.tsx useEffect() triggers                          │
│ fetchData() function called                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. API CALL                                                 │
├─────────────────────────────────────────────────────────────┤
│ fetch('http://localhost:5050/api/custom/logistics-overview')│
│ Method: GET                                                 │
│ Headers: Content-Type: application/json                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. BACKEND PROCESSING                                       │
├─────────────────────────────────────────────────────────────┤
│ server.js receives request                                  │
│ Route: /api/custom/logistics-overview                      │
│ Handler generates/fetches data                              │
│ (Currently: Mock data, Future: Google Sheets)              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. DATA RESPONSE                                            │
├─────────────────────────────────────────────────────────────┤
│ JSON Response:                                              │
│ {                                                           │
│   "success": true,                                          │
│   "data": {                                                 │
│     "totalShipments": 750,                                  │
│     "activeRoutes": 35,                                     │
│     "totalRevenue": "850000",                               │
│     "deliveryRate": "94.5",                                 │
│     "avgDeliveryTime": "36.2",                              │
│     "customerSatisfaction": "91.3"                          │
│   },                                                        │
│   "timestamp": "2024-10-14T..."                             │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. STATE UPDATE                                             │
├─────────────────────────────────────────────────────────────┤
│ Component setState(data)                                    │
│ React re-renders with new data                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. UI RENDER                                                │
├─────────────────────────────────────────────────────────────┤
│ Display cards with:                                         │
│ - 750 vận chuyển                                            │
│ - 35 tuyến hoạt động                                        │
│ - 850,000 VND doanh thu                                     │
│ - 94.5% tỷ lệ giao hàng                                     │
│ - Charts, graphs, tables                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 GIAO DIỆN HIỆN TẠI

### **Entry Point: `src/index.tsx`**

```typescript
✅ CORRECT (Sau khi fix):
import { RouterProvider } from "react-router-dom";
import { router } from "./config/router";

// Uses router.tsx (Full MIA System)
<RouterProvider router={router} />
```

### **Main Router: `src/config/router.tsx`**

```typescript
Defines 20+ routes:
- / → Dashboard (with Layout)
- /shipments/* → Transport features
- /inbound/* → Inbound features
- /orders → Orders management
- /carriers → Carriers management
- /settings/* → Settings & Authorization
- /admin → Admin panel
```

### **Layout: `src/shared/components/layout/Layout.tsx`**

```typescript
Structure:
┌─ Sidebar (260px)
│  ├─ Logo + Toggle
│  ├─ Navigation Menu
│  └─ 14 Main Items + Submenus
│
├─ Main Area
│  ├─ Top Header
│  │  ├─ Page Title
│  │  ├─ Current Date
│  │  └─ ConnectionStatus ⭐
│  │
│  ├─ Content Area
│  │  └─ <Outlet /> (child routes)
│  │
│  └─ Footer
```

---

## 📊 DATA SOURCES

### **Current State:**

| Feature | Data Source | Status |
|---------|-------------|--------|
| **Logistics Overview** | Mock Data → Backend | ⚠️ Temp |
| **Shipment Metrics** | Mock Data → Backend | ⚠️ Temp |
| **Carrier Performance** | Mock Data → Backend | ⚠️ Temp |
| **Revenue** | Mock Data → Backend | ⚠️ Temp |
| **AI Prediction** | Mock Algorithm → Backend | ⚠️ Temp |
| **Real MIA Features** | Google Sheets API | ✅ Ready |

### **Google Sheets Integration Ready:**

**Services in `src/services/googleSheets/`:**

- ✅ `authService.ts` - Authentication
- ✅ `baseService.ts` - Base CRUD operations
- ✅ `carriersService.ts` - Carriers data
- ✅ `employeesService.ts` - Employees data
- ✅ `inboundDomesticService.ts` - Inbound domestic
- ✅ `inboundInternationalService.ts` - Inbound international
- ✅ `inboundScheduleService.ts` - Schedules
- ✅ `ordersService.ts` - Orders
- ✅ `usersService.ts` - Users & permissions

---

## 🔌 PORTS & ENDPOINTS

### **Port Assignment:**

```
Frontend:     :3000  ← React app (MAIN)
Backend:      :5050  ← Express API
AI Service:   :8000  ← Python FastAPI (optional)
```

### **Backend API Endpoints:**

#### **Health & Status:**

```
GET /health
    → Service health check

GET /api/status
    → API status & versions

GET /api/sheets/test
    → Google Sheets connection test
```

#### **Custom Metrics:**

```
GET /api/custom/logistics-overview
    → Total shipments, revenue, rates

GET /api/custom/shipment-metrics
    → On-time, delayed, in-transit, delivered

GET /api/custom/carrier-performance
    → Carrier ratings, delivery rates

GET /api/custom/revenue-metrics
    → Daily, weekly, monthly revenue

GET /api/custom/route-optimization
    → Optimized routes, savings, fuel

POST /api/custom/predict-demand
    → AI demand prediction
    Body: { timeFrame, region, season }
```

---

## 🎯 COMPONENTS HIERARCHY

### **Top Level:**

```
index.tsx
└── RouterProvider (router.tsx)
    └── Layout.tsx
        ├── Sidebar
        │   ├── Logo
        │   ├── Navigation Menu (14 items)
        │   └── Collapse Toggle
        │
        ├── Header
        │   ├── Page Title
        │   ├── Date Display
        │   └── ConnectionStatus ⭐
        │       ├── Backend Indicator (🟢:5050)
        │       └── Google Sheets Indicator (🟢)
        │
        ├── Main Content (Outlet)
        │   ├── Dashboard
        │   ├── ShipmentsPages
        │   ├── InboundPages
        │   ├── OrdersPage
        │   ├── CarriersPage
        │   └── ... other features
        │
        └── Footer
```

---

## 📱 RESPONSIVE BEHAVIOR

### **Desktop (> 1024px):**

- Sidebar: 260px (expanded)
- Content: Fluid (max 1400px)
- ConnectionStatus: Full text

### **Tablet (768px - 1024px):**

- Sidebar: 60px (collapsed icons only)
- Content: Full width
- ConnectionStatus: Icons only

### **Mobile (< 768px):**

- Sidebar: Overlay (toggle)
- Content: 100% width
- ConnectionStatus: Compact

---

## 🔍 CONNECTION STATUS MONITOR

### **Component: `ConnectionStatus.jsx`**

**Logic Flow:**

```
Component Mount
    ↓
setInterval (10s)
    ↓
fetchConnectionStatus()
    ↓
    ├─ Check Backend (fetch /health)
    │  ├─ Success → 🟢 Backend: Kết nối :5050
    │  └─ Error → 🔴 Backend: Mất kết nối
    │
    └─ Check Google Sheets (from /health response)
       ├─ Connected → 🟢 Google Sheets: Kết nối
       └─ Error → 🔴 Google Sheets: Mất kết nối
```

**Display States:**

```
✅ Both Connected:
[🟢 Backend: Kết nối :5050] [🟢 Google Sheets: Kết nối]

⚠️ Backend Down:
[🔴 Backend: Mất kết nối] [🔴 Google Sheets: Mất kết nối]

⚠️ Sheets Down Only:
[🟢 Backend: Kết nối :5050] [🔴 Google Sheets: Mất kết nối]
```

---

## 📦 FEATURES & DATA MAPPING

### **1. Dashboard (Trang chủ)**

```
Path: /
Component: Dashboard.tsx
Data từ:
  - Logistics Overview API
  - Shipment Metrics API
  - Recent activity logs
Display:
  - Summary cards (4-6 metrics)
  - Charts (shipments over time)
  - Quick actions
  - Recent updates
```

### **2. AI Analytics**

```
Path: /ai-analytics (nếu thêm route)
Component: AIDashboard.jsx
Data từ:
  - POST /api/custom/predict-demand
  - GET /api/custom/route-optimization
Display:
  - Demand prediction cards
  - Route optimization metrics
  - AI recommendations
  - Coming soon features
```

### **3. Shipments Features**

```
Paths: /shipments/*
Components:
  - TransportRequestsSheet
  - PendingTransfer
  - TransportRequests
  - VolumeCalculator
Data từ Google Sheets:
  - Sheet: "Vận chuyển"
  - Sheet: "Volume Rules"
  - Sheet: "Transfers"
```

### **4. Inbound Features**

```
Paths: /inbound/*
Components:
  - InboundInternational
  - InboundDomestic
  - InboundSchedule
  - InboundReports
Data từ Google Sheets:
  - Sheet: "Inbound International"
  - Sheet: "Inbound Domestic"
  - Sheet: "Schedule"
```

---

## 🚀 STARTUP FLOW

### **When Running `./start.sh`:**

```
Step 1: Load ports.config.sh
    └─ Set FRONTEND_PORT=3000, BACKEND_PORT=5050

Step 2: Kill old processes
    ├─ Kill port 3000
    ├─ Kill port 5050
    └─ Kill port 8080

Step 3: Check dependencies
    ├─ Install frontend (if needed)
    └─ Install backend (if needed)

Step 4: Start Backend (5050)
    ├─ cd backend && npm start
    ├─ Runs in background
    └─ Logs to logs/backend.log

Step 5: Wait for Backend
    └─ Check localhost:5050/health

Step 6: Start Frontend (3000)
    ├─ npm start
    ├─ React dev server starts
    └─ Opens browser → localhost:3000

Step 7: Frontend Loads
    ├─ index.tsx mounts
    ├─ RouterProvider with router.tsx
    ├─ Layout renders
    ├─ Dashboard loads (default route /)
    └─ ConnectionStatus starts monitoring
```

---

## 📈 DATA UPDATE CYCLE

### **Real-time Updates:**

```
Component Mount
    ↓
Initial Fetch
    ↓
Display Data
    ↓
setInterval (varies by component)
    ├─ ConnectionStatus: 10s
    ├─ AIDashboard: 60s
    ├─ LogisticsWidget: 30s
    └─ Dashboard: On demand
    ↓
Re-fetch Data
    ↓
Update State
    ↓
Re-render UI
    ↓
(Loop continues)
```

---

## 🎨 CURRENT UI vs PREVIOUS

### **PREVIOUS (OAS Demo - Port 8080):**

```
❌ Build cũ từ Vite
❌ Assets không tồn tại
❌ White screen
❌ Port 8080 (sai)
```

### **CURRENT (MIA Logistics - Port 3000):**

```
✅ React Scripts build
✅ Full MIA features
✅ Layout with Sidebar + Header
✅ ConnectionStatus monitoring
✅ 20+ routes functional
✅ Port 3000 (đúng)
✅ Google Sheets ready
```

---

## 🔧 NEXT: KẾT NỐI GOOGLE SHEETS THẬT

### **Cần làm:**

1. **Setup Service Account:**

   ```bash
   # Xem GOOGLE_SHEETS_SETUP.md
   - Tạo service account
   - Download credentials
   - Share sheets với service account email
   ```

2. **Update Backend:**

   ```javascript
   // backend/server.js
   const { google } = require('googleapis');

   // Replace mock data với:
   const sheets = google.sheets({ version: 'v4', auth });
   const response = await sheets.spreadsheets.values.get({
     spreadsheetId: SHEET_ID,
     range: 'Vận chuyển!A:Z'
   });
   ```

3. **Test Connection:**

   ```bash
   curl http://localhost:5050/api/sheets/test
   ```

---

## 📊 THỐNG KÊ DỰ ÁN

### **Files Count:**

```
Total Files:     ~800+
React Components: 128+
Services:        50+
API Endpoints:   7 (custom) + existing
Routes:          23+
Documentation:   12 guides
```

### **Features:**

```
✅ Dashboard - Tổng quan
✅ Shipments - 4 sub-features
✅ Inbound - 4 sub-features
✅ Orders - CRUD
✅ Carriers - Management
✅ Locations - Management
✅ Tracking - GPS
✅ Inventory - Stock management
✅ Transfers - Warehouse transfers
✅ Employees - HR management
✅ Settings - Authorization (4 sub-pages)
✅ Docs - Guides
✅ Logs - System logs
✅ Admin - Admin panel
```

---

## 🎊 SUMMARY

### **Hiện Tại Frontend Đang Hiển Thị:**

✅ **Full MIA Logistics Manager System**

- Layout với Sidebar professional
- 14 menu items chính
- 20+ routes functional
- ConnectionStatus real-time
- Google Sheets services ready
- Backend API integrated
- Port 3000 (standardized)

### **Không Còn:**

❌ Trang demo "củi bắp" (App.jsx đơn giản)
❌ Port 8080 (Vite cũ)
❌ White screen errors

---

**🎉 Frontend giờ hiển thị CHÍNH XÁC hệ thống MIA Logistics Manager đầy đủ!** ✅
