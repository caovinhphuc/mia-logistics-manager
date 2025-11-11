# 🔍 PHÂN TÍCH BACKEND INDEX.JS - MIA LOGISTICS MANAGER

---

## 📋 **TỔNG QUAN FILE**

**File:** `/backend/index.js` (4,204 dòng)
**Vai trò:** Backend API Server - Core xử lý mapping với Google Sheets Database
**Port:** 5050 (default)
**Framework:** Express.js + Google APIs

---

## 🏗️ **KIẾN TRÚC & DEPENDENCIES**

### **Core Dependencies:**

```javascript
- bcryptjs         // Mã hóa password
- cors             // Cross-Origin Resource Sharing
- dotenv           // Environment variables
- express          // Web framework
- googleapis       // Google APIs client
- node-fetch       // HTTP client
- multer           // File upload handling
```

### **Notification Services:**

```javascript
- emailService.js           // Email SMTP
- notificationManager.js    // Notification orchestration
- realtimeService.js        // Real-time updates
- telegramService.js        // Telegram Bot integration
```

---

## 📊 **GOOGLE SHEETS MAPPING**

### **Authentication & Authorization Tables:**

```javascript
// Users Management
USERS_SHEET = "Users"
USERS_HEADERS = [
  "id", "email", "passwordHash", "fullName",
  "roleId", "status", "createdAt", "updatedAt"
]

// Roles & Permissions
ROLES_SHEET = "Roles"
ROLES_HEADERS = ["id", "name", "description"]

ROLE_PERMS_SHEET = "RolePermissions"
ROLE_PERMS_HEADERS = ["roleId", "resource", "action"]

// Employees
EMPLOYEES_SHEET = "Employees"
EMPLOYEES_HEADERS = [
  "id", "code", "fullName", "email", "phone",
  "department", "position", "status", "createdAt", "updatedAt"
]

// System Logs
LOGS_SHEET = "Logs"
LOGS_HEADERS = [
  "id", "timestamp", "userId", "email", "action",
  "resource", "details", "ip", "userAgent"
]
```

### **Business Data Tables:**

```javascript
// Orders Management
ORDERS_HEADERS = [
  "orderId", "customerName", "customerEmail", "customerPhone",
  "pickupAddress", "deliveryAddress", "pickupCoordinates", "deliveryCoordinates",
  "carrierId", "carrierName", "totalWeight", "totalVolume", "packageCount",
  "serviceLevel", "estimatedCost", "actualCost", "distance", "estimatedDuration",
  "status", "notes", "createdAt", "updatedAt",
  "scheduledPickup", "scheduledDelivery", "actualPickup", "actualDelivery"
]

// Carriers Management
CARRIERS_HEADERS = [
  "carrierId", "name", "avatarUrl", "contactPerson", "email", "phone", "address",
  "serviceAreas", "pricingMethod", "baseRate", "perKmRate", "perM3Rate", "perTripRate",
  "stopFee", "fuelSurcharge", "remoteAreaFee", "insuranceRate",
  "vehicleTypes", "maxWeight", "maxVolume", "operatingHours",
  "rating", "isActive", "createdAt", "updatedAt"
]

// Transfers (Warehouse Transfer Slips)
TRANSFERS_SHEET = "Transfers"
TRANSFERS_HEADERS = [
  "transfer_id", "orderCode", "hasVali", "date", "source", "dest",
  "quantity", "state", "transportStatus", "note",
  "pkgS", "pkgM", "pkgL", "pkgBagSmall", "pkgBagMedium", "pkgBagLarge", "pkgOther",
  "totalPackages", "volS", "volM", "volL", "volBagSmall", "volBagMedium", "volBagLarge",
  "volOther", "totalVolume", "dest_id", "source_id", "employee",
  "address", "ward", "district", "province"
]

// Volume Rules (Settings)
VOLUME_SHEET = "VolumeRules"
VOLUME_HEADERS = ["id", "name", "unitVolume", "description", "createdAt", "updatedAt"]
```

---

## 🔐 **AUTHENTICATION & AUTHORIZATION SYSTEM**

### **Login Flow:**

```javascript
POST /api/auth/login
├── Validate email & password
├── Get user from Google Sheets "Users"
├── Compare bcrypt password hash
├── Check user status (active/inactive)
├── Load role permissions from "RolePermissions"
├── Log successful login to "Logs"
└── Return user data + permissions
```

### **Auto Admin Seeding:**

```javascript
seedAuthSheetsIfEmpty()
├── Check if Users sheet is empty
├── Create default "admin" role with full permissions
├── Create admin user (admin@mia.vn / admin@123)
├── Grant all resource permissions to admin role
└── ensureAdminFullPermissions() - Always maintain admin access
```

### **Role-Based Access Control:**

```javascript
Resources: [
  "orders", "carriers", "locations", "transfers",
  "transportRequests", "shipments", "settings", "employees",
  "inbound-international", "inbound-domestic", "inbound-schedule"
]

Actions: ["view", "create", "update", "delete"]

// Admin role gets ALL permissions automatically
```

---

## 📡 **REST API ENDPOINTS**

### **🔑 Authentication APIs:**

```javascript
POST   /api/auth/login           // User login
POST   /api/auth/logout          // User logout (logging)
POST   /api/auth/init            // Initialize auth sheets
GET    /api/auth/roles           // Get all roles
POST   /api/auth/roles           // Create/update role
GET    /api/auth/role-permissions // Get role permissions
POST   /api/auth/role-permissions // Set role permissions
GET    /api/auth/users           // Get all users
POST   /api/auth/users           // Create user
PUT    /api/auth/users/:id       // Update user
```

### **📝 System Logging:**

```javascript
POST   /api/logs/init            // Initialize logs sheet
POST   /api/logs                 // Create log entry
GET    /api/logs                 // Query logs (with filters)
GET    /api/logs/export          // Export logs to CSV
```

### **👥 Employee Management:**

```javascript
GET    /api/employees            // List employees
POST   /api/employees            // Create employee
PUT    /api/employees/:id        // Update employee
DELETE /api/employees/:id        // Delete employee
POST   /api/employees/init       // Initialize employees sheet
```

### **📦 Orders Management:**

```javascript
GET    /api/orders               // List orders
POST   /api/orders               // Create order
PUT    /api/orders/:orderId      // Update order
DELETE /api/orders/:orderId      // Delete order
```

### **🚛 Carriers Management:**

```javascript
GET    /api/carriers             // List carriers (with memory fallback)
POST   /api/carriers             // Create carrier
PUT    /api/carriers/:carrierId  // Update carrier
DELETE /api/carriers/:carrierId  // Delete carrier
```

### **📥 Inbound Management:**

```javascript
// International Inbound
GET    /api/inboundinternational      // List international inbound
POST   /api/inboundinternational      // Create international record
PUT    /api/inboundinternational/:id  // Update international record
DELETE /api/inboundinternational/:id  // Delete international record

// Domestic Inbound
GET    /api/inbounddomestic           // List domestic inbound
POST   /api/inbounddomestic           // Create domestic record
PUT    /api/inbounddomestic/:id       // Update domestic record
DELETE /api/inbounddomestic/:id       // Delete domestic record
```

### **🔄 Transfers Management:**

```javascript
GET    /api/transfers                    // List transfers (with pagination)
POST   /api/transfers/import            // Import transfer data
GET    /api/transfers/export            // Export transfers to Excel
PUT    /api/transfers/:id               // Update transfer
DELETE /api/transfers/:id               // Delete transfer
DELETE /api/transfers/clear             // Clear all transfers
```

### **🚚 Transport Requests:**

```javascript
GET    /api/transport-requests/headers      // Get sheet headers
GET    /api/transport-requests             // List transport requests
POST   /api/transport-requests/generate-id // Generate new request ID
PUT    /api/transport-requests/:requestId  // Update transport request
DELETE /api/transport-requests/:requestId  // Delete transport request
DELETE /api/transport-requests/duplicate-columns // Clean duplicate headers
POST   /api/transport-requests/repair-headers    // Repair corrupted headers
```

### **⚙️ Settings & Configuration:**

```javascript
GET    /api/settings/volume-rules       // Get volume calculation rules
POST   /api/settings/volume-rules       // Update volume rules
```

### **🛠️ Debug & Monitoring:**

```javascript
GET    /api/_debug/file-info           // Service account file status
GET    /api/_debug/state               // System state & memory data
GET    /api/health                     // Health check endpoint
```

---

## 🛡️ **DATA SECURITY & VALIDATION**

### **Vietnam Timezone Handling:**

```javascript
function getVietnamTime() {
  return new Date(new Date().toLocaleString("en-US", {
    timeZone: "Asia/Ho_Chi_Minh"
  }));
}

function getVietnamTimeString() {
  // Returns: "YYYY-MM-DD HH:mm:ss" in Vietnam timezone
}
```

### **Rate Limiting & Retry Logic:**

```javascript
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  // Exponential backoff for Google Sheets API rate limits
  // Handles 429 errors gracefully
}
```

### **Data Normalization:**

```javascript
function normalizeForSheet(record) {
  // Sanitizes inputs before Google Sheets insertion
  // Handles number formatting, date formatting, string cleaning
  // Prevents injection attacks & data corruption
}

function toNumberSafe(value, fractionDigits = 0) {
  // Safe number conversion with decimal handling
}

function formatDateForSheet(input) {
  // Converts dates to dd/MM/yyyy format for Vietnam locale
}
```

### **Log Trimming & Maintenance:**

```javascript
async function trimSheetToLastRows(sheets, sheetName, keepRows = 1000) {
  // Automatically maintains sheet size
  // Keeps only header + last N rows to prevent Google Sheets limits
}
```

---

## 🔄 **IN-MEMORY FALLBACK SYSTEM**

### **Purpose:**

```javascript
// Fallback data khi Google Sheets không khả dụng
const ordersMemory = [];
const carriersMemory = [ /* 4 carriers mẫu */ ];
```

### **Carriers Memory Data:**

```javascript
// 4 nhà vận chuyển mẫu với đầy đủ thông tin:
// - Giao Hàng Nhanh Express (PER_KM pricing)
// - Viettel Post (PER_M3 pricing)
// - Minh Trí (PER_M3 & PER_TRIP pricing methods)
// Mỗi carrier có: contact, pricing, service areas, vehicle types, etc.
```

---

## 📈 **PERFORMANCE & SCALABILITY**

### **Google Sheets Optimization:**

```javascript
// Batch operations để giảm API calls
// Caching headers để tránh repeated requests
// Efficient row indexing và searching
// Smart column mapping và validation
```

### **Memory Management:**

```javascript
// Controlled memory fallback data
// Automatic log rotation (1000 rows max)
// Efficient data structures for lookups
```

### **Error Handling:**

```javascript
// Comprehensive try-catch blocks
// Detailed error logging với Vietnam timestamps
// Graceful degradation when Google Sheets unavailable
// User-friendly error messages
```

---

## 🚀 **DEPLOYMENT & ENVIRONMENT**

### **Required Environment Variables:**

```bash
PORT=5050
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json
TELEGRAM_BOT_TOKEN=your_telegram_token
TELEGRAM_WEBHOOK_URL=your_webhook_url
```

### **Service Dependencies:**

```javascript
// Google Service Account với permissions:
// - https://www.googleapis.com/auth/spreadsheets
// - https://www.googleapis.com/auth/drive.readonly

// External integrations:
// - SMTP Email Service
// - Telegram Bot API
// - Real-time WebSocket connections
```

---

## 🎯 **KEY FEATURES IMPLEMENTED**

### **✅ Core Features:**

- **Complete RBAC System** - Users, Roles, Permissions
- **Google Sheets as Database** - Full CRUD operations
- **Vietnamese Localization** - Timezone, date formats, messages
- **Comprehensive Logging** - All user actions tracked
- **Auto-seeding** - Default admin setup
- **Memory Fallback** - Works without Google Sheets
- **File Upload/Export** - Excel imports/exports
- **Rate Limiting Protection** - Handles Google API limits

### **✅ Business Logic:**

- **Multi-modal Transport** - Different pricing methods
- **Volume Calculations** - Package size standardization
- **Transfer Management** - Warehouse operations
- **Inbound Processing** - Domestic & International
- **Carrier Management** - Service providers
- **Order Lifecycle** - End-to-end tracking

### **✅ Technical Excellence:**

- **Data Validation** - Input sanitization & normalization
- **Error Recovery** - Graceful failure handling
- **Performance Optimization** - Efficient Google Sheets usage
- **Security** - bcrypt passwords, input validation
- **Monitoring** - Health checks & debug endpoints
- **Maintenance** - Auto-cleanup routines

---

## 🔮 **ARCHITECTURAL STRENGTHS**

1. **Hybrid Architecture** - Google Sheets + Memory fallback
2. **Zero Database Setup** - Uses Google Sheets as DB
3. **Vietnamese Business Logic** - Localized for Vietnam market
4. **Enterprise Security** - Complete auth & authorization
5. **Scalable Design** - Modular service architecture
6. **Real-world Ready** - Production-grade error handling

---

**📊 Total Lines:** 4,204
**📡 API Endpoints:** 40+
**🗃️ Google Sheets:** 8 main sheets
**🔐 Security Features:** RBAC + Logging + Validation
**🌏 Localization:** Vietnamese timezone & formats
**🚀 Deployment Ready:** Docker + PM2 compatible

Đây là một backend rất hoàn chỉnh và production-ready cho hệ thống logistics tại Việt Nam! 🇻🇳
