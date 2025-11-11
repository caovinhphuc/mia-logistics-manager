# 🔧 Google Sheets Setup Guide - MIA Logistics Manager

## 📋 Tổng Quan

MIA Logistics Manager sử dụng Google Sheets làm database chính, với 25 sheets được kết nối và quản lý thông qua Google Sheets API.

### ✅ Trạng Thái Hiện Tại

- **Spreadsheet ID**: `18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`
- **Tên Spreadsheet**: `mia-logistics-final`
- **Tổng số Sheets**: 25 tabs
- **Service Account**: `mia-vn-google-integration@sinuous-aviary-474820-e3.iam.gserviceaccount.com`
- **Status**: ✅ Connected và hoạt động

---

## 📋 Bước 1: Tạo Google Service Account

### 1.1. Tạo Google Cloud Project

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Ghi nhớ **Project ID** (ví dụ: `sinuous-aviary-474820-e3`)

### 1.2. Enable Google Sheets API

1. Vào **APIs & Services** > **Library**
2. Tìm và enable các APIs sau:
   - ✅ **Google Sheets API**
   - ✅ **Google Drive API**
   - ✅ **Google Apps Script API**
   - ✅ **Google Maps JavaScript API** (cho tính năng maps)

### 1.3. Tạo Service Account

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Điền thông tin:
   - **Name**: `mia-logistics-service` (hoặc tên khác)
   - **Description**: `Service account for MIA Logistics Manager`
4. Click **Create and Continue**
5. Skip **Grant access** (click **Done**)

### 1.4. Tạo Key cho Service Account

1. Click vào service account vừa tạo
2. Vào **Keys** tab
3. Click **Add Key** > **Create new key**
4. Chọn **JSON** format
5. Download file JSON (ví dụ: `sinuous-aviary-474820-e3-c442968a0e87.json`)

### 1.5. Đặt File JSON trong Project

1. Copy file JSON vào thư mục `backend/`
2. Đảm bảo tên file khớp với cấu hình trong `.env`

---

## 📋 Bước 2: Tạo Google Spreadsheet

### 2.1. Tạo Spreadsheet mới (Nếu chưa có)

1. Vào [Google Sheets](https://sheets.google.com/)
2. Tạo spreadsheet mới
3. Đặt tên: `MIA Logistics Manager` hoặc `mia-logistics-final`
4. Copy **Spreadsheet ID** từ URL:

   ```text
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

### 2.2. Share với Service Account

1. Click **Share** button ở góc trên bên phải
2. Thêm email service account: `your-service-account@your-project.iam.gserviceaccount.com`
   - Ví dụ: `mia-vn-google-integration@sinuous-aviary-474820-e3.iam.gserviceaccount.com`
3. Chọn permission: **Editor**
4. **Bỏ tick** "Notify people" (không cần gửi email)
5. Click **Share**

### 2.3. Tạo 25 Sheets Cần Thiết

Tạo các sheets sau trong spreadsheet:

1. **HOME** - Trang chủ
2. **Orders** - Đơn hàng
3. **Carriers** - Nhà vận chuyển
4. **Locations** - Vị trí kho
5. **Transfers** - Chuyển kho
6. **Settings** - Cài đặt
7. **Inventory** - Tồn kho
8. **Reports** - Báo cáo
9. **Sales** - Bán hàng
10. **VolumeRules** - Quy tắc khối lượng
11. **InboundInternational** - Nhập hàng quốc tế
12. **InboundDomestic** - Nhập hàng quốc nội
13. **TransportRequests** - Yêu cầu vận chuyển
14. **Users** - Người dùng
15. **Roles** - Vai trò
16. **RolePermissions** - Phân quyền
17. **Employees** - Nhân viên
18. **Logs** - Nhật ký
19. **TransportProposals** - Đề xuất vận chuyển
20. **Dashboard** - Dashboard
21. **VerificationTokens** - Mã xác thực
22. **MIA_Logistics_Data** - Dữ liệu chính
23. **Dashboard_Summary** - Tóm tắt dashboard
24. **System_Logs** - Log hệ thống
25. **Trips** - Chuyến đi

**Lưu ý**: Tên sheets phải chính xác (case-sensitive)

---

## 📋 Bước 3: Cấu hình Environment Variables

### 3.1. Backend Environment (backend/.env)

```bash
# Google Sheets Configuration
GOOGLE_SHEETS_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
GOOGLE_APPLICATION_CREDENTIALS=./sinuous-aviary-474820-e3-c442968a0e87.json

# Hoặc sử dụng path tuyệt đối
# GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json

# Backend Port
PORT=5050
```

### 3.2. Frontend Environment (.env)

```bash
# Google Sheets Configuration
REACT_APP_GOOGLE_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As

# Google Drive Configuration
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE

# Google Apps Script Configuration
REACT_APP_GOOGLE_APPS_SCRIPT_ID=1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv
REACT_APP_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/AKfycbysU9ncMhDg_1CATGPIdewwLqUq2AM6I1RUlsl6nMR9nHDYL_BFFbKMtlIxdg_LU5VJRQ/exec

# Backend API URL
REACT_APP_API_URL=http://localhost:5050
REACT_APP_BACKEND_URL=http://localhost:5050
```

### 3.3. Service Account JSON File

Đảm bảo file JSON service account có cấu trúc:

```json
{
  "type": "service_account",
  "project_id": "sinuous-aviary-474820-e3",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "mia-vn-google-integration@sinuous-aviary-474820-e3.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

---

## 📋 Bước 4: Test Connection

### 4.1. Test Google Sheets Connection

```bash
# Test từ backend
cd backend
curl http://localhost:5050/api/sheets/info

# Hoặc test với spreadsheet ID cụ thể
curl http://localhost:5050/api/sheets/info/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
```

**Expected Response:**

```json
{
  "success": true,
  "spreadsheetId": "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As",
  "title": "mia-logistics-final",
  "sheets": [
    { "title": "HOME", "sheetId": 0 },
    { "title": "Orders", "sheetId": 1 },
    // ... 25 sheets
  ]
}
```

### 4.2. Test Read Data

```bash
# Test đọc dữ liệu từ sheet
curl -X POST http://localhost:5050/api/sheets/read \
  -H "Content-Type: application/json" \
  -d '{
    "spreadsheetId": "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As",
    "sheetName": "Carriers",
    "range": "A1:Z100"
  }'
```

### 4.3. Test Write Data

```bash
# Test ghi dữ liệu vào sheet
curl -X POST http://localhost:5050/api/sheets/write \
  -H "Content-Type: application/json" \
  -d '{
    "spreadsheetId": "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As",
    "sheetName": "Carriers",
    "range": "A1",
    "values": [["carrierId", "name", "contactPerson"]]
  }'
```

---

## 📋 Bước 5: Khởi động dự án

### 5.1. Khởi động Backend

```bash
cd backend
npm install
npm start
# Hoặc
node index.js
```

Backend sẽ chạy trên: `http://localhost:5050`

### 5.2. Khởi động Frontend

```bash
# Từ root directory
npm install
npm start
```

Frontend sẽ chạy trên: `http://localhost:3000`

### 5.3. Quick Start (Recommended)

```bash
# Từ root directory
./start-project.sh
```

Script này sẽ:

- Khởi động backend (port 5050)
- Khởi động frontend (port 3000)
- Gửi Telegram notification khi startup
- Hiển thị status của services

---

## 📊 API Endpoints - Mapping với Google Sheets

### Base URLs

```text
http://localhost:5050/api/sheets              # Generic Google Sheets operations
http://localhost:5050/api/carriers            # Carriers management
http://localhost:5050/api/transfers           # Transfers management
http://localhost:5050/api/locations           # Locations management
http://localhost:5050/api/transport-requests  # Transport requests
http://localhost:5050/api/settings            # Settings & volume rules
http://localhost:5050/api/inbound             # Inbound management
http://localhost:5050/api/auth                # Authentication
http://localhost:5050/api/roles               # Roles management
http://localhost:5050/api/employees           # Employees management
http://localhost:5050/api/role-permissions    # Role permissions
http://localhost:5050/api/admin               # Admin operations
http://localhost:5050/api/google-sheets-auth  # Google Sheets auth status
```

### Generic Google Sheets Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/sheets/info/:spreadsheetId?` | Lấy thông tin spreadsheet |
| POST | `/api/sheets/read` | Đọc dữ liệu từ sheet |
| POST | `/api/sheets/write` | Ghi dữ liệu vào sheet |
| POST | `/api/sheets/append` | Thêm dữ liệu vào cuối sheet |

### Carriers Endpoints

| Method | Endpoint | Sheet | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/carriers` | Carriers | Lấy danh sách carriers |
| POST | `/api/carriers` | Carriers | Tạo carrier mới |
| PUT | `/api/carriers/:id` | Carriers | Cập nhật carrier |
| DELETE | `/api/carriers/:id` | Carriers | Xóa carrier |

### Transfers Endpoints

| Method | Endpoint | Sheet | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/transfers` | Transfers | Lấy danh sách transfers |
| POST | `/api/transfers` | Transfers | Tạo transfer mới |
| PUT | `/api/transfers/:id` | Transfers | Cập nhật transfer |
| DELETE | `/api/transfers/:id` | Transfers | Xóa transfer |

### Locations Endpoints

| Method | Endpoint | Sheet | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/locations` | Locations | Lấy danh sách locations |
| POST | `/api/locations` | Locations | Tạo location mới |
| PUT | `/api/locations/:id` | Locations | Cập nhật location |
| DELETE | `/api/locations/:id` | Locations | Xóa location |

### Transport Requests Endpoints

| Method | Endpoint | Sheet | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/transport-requests` | TransportRequests | Lấy danh sách requests |
| GET | `/api/transport-requests/:requestId` | TransportRequests | Lấy chi tiết request |
| GET | `/api/transport-requests/headers` | TransportRequests | Lấy headers của sheet |
| POST | `/api/transport-requests` | TransportRequests | Tạo request mới |
| POST | `/api/transport-requests/generate-id` | TransportRequests | Generate request ID |
| PUT | `/api/transport-requests/:requestId` | TransportRequests | Cập nhật request |
| DELETE | `/api/transport-requests/:requestId` | TransportRequests | Xóa request |

### Settings Endpoints

| Method | Endpoint | Sheet | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/settings/volume-rules` | VolumeRules | Lấy quy tắc khối lượng |
| POST | `/api/settings/volume-rules` | VolumeRules | Tạo/quản lý quy tắc |

### Inbound Endpoints

| Method | Endpoint | Sheet | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/inbound/domestic` | InboundDomestic | Lấy danh sách nhập hàng quốc nội |
| GET | `/api/inbound/domestic/:id` | InboundDomestic | Lấy chi tiết record |
| POST | `/api/inbound/domestic` | InboundDomestic | Tạo record mới |
| PUT | `/api/inbound/domestic/:id` | InboundDomestic | Cập nhật record |
| DELETE | `/api/inbound/domestic/:id` | InboundDomestic | Xóa/cancel record |
| GET | `/api/inbound/international` | InboundInternational | Lấy danh sách nhập hàng quốc tế |
| GET | `/api/inbound/international/:id` | InboundInternational | Lấy chi tiết record |
| POST | `/api/inbound/international` | InboundInternational | Tạo record mới |
| PUT | `/api/inbound/international/:id` | InboundInternational | Cập nhật record |
| DELETE | `/api/inbound/international/:id` | InboundInternational | Xóa/cancel record |

### Authentication Endpoints

| Method | Endpoint | Sheet | Mô tả |
|--------|----------|-------|-------|
| POST | `/api/auth/login` | Users | Đăng nhập người dùng |
| POST | `/api/auth/register` | Users | Đăng ký người dùng mới |
| POST | `/api/auth/logout` | - | Đăng xuất |
| GET | `/api/auth/me` | Users | Lấy thông tin người dùng hiện tại |
| PUT | `/api/auth/change-password` | Users | Đổi mật khẩu |
| GET | `/api/auth/users` | Users | Lấy danh sách tất cả users (Admin) |
| GET | `/api/auth/users/:id` | Users | Lấy chi tiết user theo ID |
| PUT | `/api/auth/users/:id` | Users | Cập nhật user (Admin) |
| POST | `/api/auth/init` | Multiple | Khởi tạo auth sheets (tạo headers) |

### Roles Endpoints

| Method | Endpoint | Sheet | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/roles` | Roles | Lấy danh sách tất cả roles |
| GET | `/api/roles/:id` | Roles | Lấy chi tiết role theo ID |
| POST | `/api/roles` | Roles | Tạo role mới |
| PUT | `/api/roles/:id` | Roles | Cập nhật role |
| DELETE | `/api/roles/:id` | Roles | Xóa role |

### Employees Endpoints

| Method | Endpoint | Sheet | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/employees` | Employees | Lấy danh sách tất cả employees |
| GET | `/api/employees/:id` | Employees | Lấy chi tiết employee theo ID |
| POST | `/api/employees` | Employees | Tạo employee mới |
| PUT | `/api/employees/:id` | Employees | Cập nhật employee |
| DELETE | `/api/employees/:id` | Employees | Deactivate employee (soft delete) |

### Role Permissions Endpoints

| Method | Endpoint | Sheet | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/role-permissions` | RolePermissions | Lấy danh sách tất cả permissions |
| GET | `/api/role-permissions/role/:roleId` | RolePermissions | Lấy permissions cho một role |
| GET | `/api/role-permissions/:roleId/:resource/:action` | RolePermissions | Kiểm tra permission cụ thể |
| POST | `/api/role-permissions` | RolePermissions | Tạo permission mới |
| DELETE | `/api/role-permissions/:roleId/:resource/:action` | RolePermissions | Xóa permission |

### Admin Endpoints

| Method | Endpoint | Sheet | Mô tả |
|--------|----------|-------|-------|
| GET | `/api/admin/stats` | Multiple | Lấy thống kê từ tất cả sheets |
| GET | `/api/admin/sheets` | - | Lấy thông tin tất cả sheets trong spreadsheet |

### Google Sheets Auth Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/google-sheets-auth/status` | Kiểm tra trạng thái kết nối Google Sheets |

### Example Usage

#### Get Spreadsheet Info

```bash
curl http://localhost:5050/api/sheets/info
# hoặc với ID cụ thể
curl http://localhost:5050/api/sheets/info/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
```

#### Read Data from Sheet

```javascript
// Generic read
const response = await fetch('http://localhost:5050/api/sheets/read', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    spreadsheetId: '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As',
    sheetName: 'Carriers',
    range: 'A1:Z100'
  })
});

// Hoặc dùng API routes cụ thể
const carriers = await fetch('http://localhost:5050/api/carriers').then(r => r.json());
```

#### Write Data to Sheet

```javascript
// Generic write
const response = await fetch('http://localhost:5050/api/sheets/write', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    spreadsheetId: '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As',
    sheetName: 'Carriers',
    range: 'A1',
    values: [
      ['carrierId', 'name', 'contactPerson', 'email'],
      ['C001', 'Carrier 1', 'John Doe', 'john@example.com']
    ]
  })
});

// Hoặc dùng API routes cụ thể
const newCarrier = await fetch('http://localhost:5050/api/carriers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    carrierId: 'CAR_001',
    name: 'Công ty Vận tải ABC',
    contactPerson: 'Nguyễn Văn A',
    email: 'contact@abc.com',
    phone: '0901234567',
    pricingMethod: 'PER_KM',
    baseRate: '50000',
    perKmRate: '15000',
    isActive: 'TRUE'
  })
}).then(r => r.json());
```

#### Append Data to Sheet

```javascript
const response = await fetch('http://localhost:5050/api/sheets/append', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    spreadsheetId: '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As',
    sheetName: 'Carriers',
    range: 'A:Z',
    values: [
      ['CAR_002', 'Carrier 2', 'Jane Doe', 'jane@example.com']
    ]
  })
});
```

---

## 🔧 Troubleshooting

### Lỗi: "Missing Google Sheets credentials"

**Giải pháp:**

1. Kiểm tra file `.env` trong `backend/` có đầy đủ:

   ```bash
   GOOGLE_SHEETS_SPREADSHEET_ID=...
   GOOGLE_APPLICATION_CREDENTIALS=...
   ```

2. Đảm bảo file JSON service account tồn tại tại path đã cấu hình

3. Kiểm tra quyền truy cập file:

   ```bash
   ls -la backend/sinuous-aviary-474820-e3-c442968a0e87.json
   ```

### Lỗi: "Permission denied" hoặc "403 Forbidden"

**Giải pháp:**

1. Kiểm tra service account đã được share với spreadsheet:
   - Vào Google Sheets
   - Click **Share**
   - Kiểm tra email service account có trong danh sách
   - Permission phải là **Editor**

2. Kiểm tra email service account đúng:

   ```bash
   # Xem trong file JSON
   cat backend/your-service-account.json | grep client_email
   ```

3. Share lại spreadsheet với service account email

### Lỗi: "Spreadsheet not found" hoặc "404 Not Found"

**Giải pháp:**

1. Kiểm tra `GOOGLE_SHEETS_SPREADSHEET_ID` đúng:

   ```bash
   echo $GOOGLE_SHEETS_SPREADSHEET_ID
   ```

2. Đảm bảo spreadsheet ID từ URL:

   ```text
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

3. Kiểm tra spreadsheet tồn tại và accessible:

   ```bash
   curl http://localhost:5050/api/sheets/info/SPREADSHEET_ID
   ```

### Lỗi: "API not enabled"

**Giải pháp:**

1. Kiểm tra Google Sheets API đã được enable:
   - Vào [Google Cloud Console](https://console.cloud.google.com/)
   - **APIs & Services** > **Library**
   - Tìm "Google Sheets API"
   - Phải có status "Enabled"

2. Enable các APIs cần thiết:
   - Google Sheets API
   - Google Drive API
   - Google Apps Script API

### Lỗi: "Invalid credentials" hoặc "401 Unauthorized"

**Giải pháp:**

1. Kiểm tra file JSON service account hợp lệ:

   ```bash
   cat backend/your-service-account.json | jq .
   ```

2. Đảm bảo JSON file có đầy đủ fields:
   - `type`: "service_account"
   - `project_id`
   - `private_key`
   - `client_email`

3. Regenerate service account key nếu cần

### Lỗi: "Sheet not found"

**Giải pháp:**

1. Kiểm tra tên sheet chính xác (case-sensitive):
   - "Carriers" ≠ "carriers" ≠ "CARRIERS"

2. Kiểm tra sheet tồn tại trong spreadsheet:

   ```bash
   curl http://localhost:5050/api/sheets/info
   # Xem danh sách sheets trong response
   ```

3. Tạo sheet nếu chưa có

---

## 📊 Google Sheets Structure - Chi Tiết Headers

### 1. Carriers Sheet

**Sheet Name:** `Carriers`

**Headers (24 columns):**

```text
carrierId | name | avatarUrl | contactPerson | email | phone | address |
serviceAreas | pricingMethod | baseRate | perKmRate | perM3Rate |
perTripRate | fuelSurcharge | remoteAreaFee | insuranceRate |
vehicleTypes | maxWeight | maxVolume | operatingHours | isActive |
rating | createdAt | updatedAt
```

**API Routes:**

- `GET /api/carriers` - Lấy danh sách carriers
- `POST /api/carriers` - Tạo carrier mới
- `PUT /api/carriers/:id` - Cập nhật carrier
- `DELETE /api/carriers/:id` - Xóa carrier

**Example Data:**

```javascript
{
  carrierId: "CAR_001",
  name: "Công ty Vận tải ABC",
  contactPerson: "Nguyễn Văn A",
  email: "contact@abc-transport.com",
  phone: "0901234567",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  serviceAreas: "TP.HCM, Bình Dương, Đồng Nai",
  pricingMethod: "PER_KM",
  baseRate: "50000",
  perKmRate: "15000",
  perM3Rate: "0",
  isActive: "TRUE",
  rating: "4.5"
}
```

### 2. Transfers Sheet

**Sheet Name:** `Transfers`

**Headers (30+ columns):**

```text
transfer_id | orderCode | hasVali | date | source | dest | quantity |
state | transportStatus | note | pkgS | pkgM | pkgL | pkgBagSmall |
pkgBagMedium | pkgBagLarge | pkgOther | totalPackages | volS | volM |
volL | volBagSmall | volBagMedium | volBagLarge | volOther |
totalVolume | dest_id | source_id | employee | address | ward |
district | province | createdAt | updatedAt
```

**API Routes:**

- `GET /api/transfers` - Lấy danh sách transfers
- `POST /api/transfers` - Tạo transfer mới
- `PUT /api/transfers/:id` - Cập nhật transfer
- `DELETE /api/transfers/:id` - Xóa transfer

### 3. Locations Sheet

**Sheet Name:** `Locations`

**Headers (13 columns):**

```text
id | code | avatar | category | subcategory | address | status |
ward | district | province | note | createdAt | updatedAt
```

**API Routes:**

- `GET /api/locations` - Lấy danh sách locations
- `POST /api/locations` - Tạo location mới
- `PUT /api/locations/:id` - Cập nhật location
- `DELETE /api/locations/:id` - Xóa location

### 4. TransportRequests Sheet

**Sheet Name:** `TransportRequests`

**Headers (92+ columns):**

**Thông tin cơ bản:**

```text
requestId | createdAt | pickupAddress | status | note
```

**Điểm dừng (10 stops):**

```text
stop1Address | stop2Address | ... | stop10Address
stop1Products | stop2Products | ... | stop10Products
stop1VolumeM3 | stop2VolumeM3 | ... | stop10VolumeM3
stop1Packages | stop2Packages | ... | stop10Packages
stop1OrderCount | stop2OrderCount | ... | stop10OrderCount
```

**Tổng hợp:**

```text
totalProducts | totalVolumeM3 | totalPackages | totalOrderCount | totalDistance
```

**Thông tin vận chuyển:**

```text
pricingMethod | carrierId | carrierName | carrierContact | carrierPhone | carrierEmail
vehicleType | driverId | driverName | driverPhone | driverLicense
loadingImages | department | serviceArea
```

**Định giá:**

```text
pricePerKm | pricePerM3 | pricePerTrip | stopFee | fuelSurcharge |
tollFee | insuranceFee | baseRate | estimatedCost
```

**Khoảng cách (10 stops):**

```text
distance1 | distance2 | ... | distance10
```

**API Routes:**

- `GET /api/transport-requests` - Lấy danh sách requests
- `GET /api/transport-requests/:requestId` - Lấy chi tiết request
- `POST /api/transport-requests` - Tạo request mới
- `PUT /api/transport-requests/:requestId` - Cập nhật request
- `DELETE /api/transport-requests/:requestId` - Xóa request
- `POST /api/transport-requests/generate-id` - Generate request ID

### 5. VolumeRules Sheet

**Sheet Name:** `VolumeRules`

**Headers (6 columns):**

```text
id | name | unitVolume | description | createdAt | updatedAt
```

**Default Values (Auto-seeded nếu sheet trống):**

| id | name | unitVolume | description |
|----|------|------------|-------------|
| S | Size S | 0.04 | |
| M | Size M | 0.09 | |
| L | Size L | 0.14 | |
| BAG_S | Bao nhỏ | 0.01 | |
| BAG_M | Bao trung | 0.05 | |
| BAG_L | Bao lớn | 0.10 | |
| OTHER | Khác | 0.00 | |

**API Routes:**

- `GET /api/settings/volume-rules` - Lấy quy tắc khối lượng
- `POST /api/settings/volume-rules` - Tạo/quản lý quy tắc

### 6. Users Sheet

**Sheet Name:** `Users`

**Headers (8 columns):**

```text
id | email | passwordHash | fullName | roleId | status | createdAt | updatedAt
```

**API Routes:**

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/change-password` - Đổi mật khẩu

**Role Mapping:**

- **1** = Admin (toàn quyền)
- **2** = Manager (quản lý vận hành)
- **3** = Operator (điều hành hàng ngày)
- **4** = Driver (tài xế)
- **5** = Warehouse Staff (nhân viên kho)

**Example Data:**

```javascript
{
  id: "USER_001",
  email: "admin@mia.vn",
  passwordHash: "sha256_hash_of_password",
  fullName: "Administrator",
  roleId: "1",
  status: "TRUE",
  createdAt: "2025-01-30 10:00:00",
  updatedAt: "2025-01-30 10:00:00"
}
```

**Note:** Password được hash bằng SHA-256 trước khi lưu vào Google Sheets.

### 7. InboundInternational Sheet

**Sheet Name:** `InboundInternational`

**Headers (70+ columns):**

```text
id | date | pi | supplier | origin | destination | product | category |
quantity | container | status | carrier | purpose | receiveTime | poNumbers |
packagingTypes | packagingQuantities | packagingDescriptions |
timeline_cargoReady_est | timeline_cargoReady_act | timeline_cargoReady_status |
timeline_etd_est | timeline_etd_act | timeline_etd_status |
timeline_eta_est | timeline_eta_act | timeline_eta_status |
timeline_depart_est | timeline_depart_act | timeline_depart_status |
timeline_arrivalPort_est | timeline_arrivalPort_act | timeline_arrivalPort_status |
timeline_receive_est | timeline_receive_act | timeline_receive_status |
doc_checkBill_est | doc_checkBill_act | doc_checkBill_status |
doc_checkCO_est | doc_checkCO_act | doc_checkCO_status |
doc_sendDocs_est | doc_sendDocs_act | doc_sendDocs_status |
doc_customs_est | doc_customs_act | doc_customs_status |
doc_tax_est | doc_tax_act | doc_tax_status |
notes | createdAt | updatedAt
```

**API Routes:**

- `GET /api/inbound/international` - Lấy danh sách nhập hàng quốc tế
- `POST /api/inbound/international` - Tạo record mới

### 8. InboundDomestic Sheet

**Sheet Name:** `InboundDomestic`

**Headers:** Tương tự InboundInternational nhưng cho hàng nội địa

**API Routes:**

- `GET /api/inbound/domestic` - Lấy danh sách nhập hàng quốc nội
- `POST /api/inbound/domestic` - Tạo record mới

### 9. Roles Sheet

**Sheet Name:** `Roles`

**Headers (3 columns):**

```text
id | name | description
```

### 10. RolePermissions Sheet

**Sheet Name:** `RolePermissions`

**Headers (3 columns):**

```text
roleId | resource | action
```

### 11. Employees Sheet

**Sheet Name:** `Employees`

**Headers (12 columns):**

```text
id | code | fullName | email | phone | department | position |
status | createdAt | updatedAt
```

### 12. Logs Sheet

**Sheet Name:** `Logs`

**Headers:**

```text
id | timestamp | userId | email | action | resource | details | createdAt
```

### Các Sheets Khác

- **Orders** - Đơn hàng
- **Settings** - Cài đặt hệ thống
- **Inventory** - Tồn kho
- **Reports** - Báo cáo
- **Sales** - Bán hàng
- **TransportProposals** - Đề xuất vận chuyển
- **Dashboard** - Dashboard data
- **VerificationTokens** - Mã xác thực
- **MIA_Logistics_Data** - Dữ liệu chính
- **Dashboard_Summary** - Tóm tắt dashboard
- **System_Logs** - Log hệ thống
- **Trips** - Chuyến đi
- **HOME** - Trang chủ (metadata)

---

## 🎯 Best Practices

### 1. Backup Dữ Liệu

- Google Sheets tự động backup
- Có thể export data định kỳ
- Sử dụng Google Drive để lưu trữ backup files

### 2. Security

- Không commit file JSON service account vào git
- Thêm file vào `.gitignore`:

  ```gitignore
  *.json
  !package*.json
  service-account*.json
  sinuous-aviary-*.json
  ```

### 3. Performance

- Limit số lượng rows đọc/ghi mỗi lần
- Sử dụng batch operations khi có thể
- Cache dữ liệu thường dùng

### 4. Error Handling

- Luôn check response status
- Handle rate limiting (Google API có giới hạn)
- Retry logic cho failed requests

---

## 📝 Notes Quan Trọng

1. **Service Account File**: File JSON chứa private key, không được commit vào git

2. **Spreadsheet Sharing**: Service account phải có quyền **Editor** để ghi dữ liệu

3. **Sheet Names**: Tên sheets phải chính xác, case-sensitive

4. **Rate Limits**: Google Sheets API có rate limits:
   - 60 requests/minute/user
   - 300 requests/minute/project

5. **Costs**: Google Sheets API miễn phí cho personal use, có thể có costs cho enterprise

---

## 🔨 Scripts để Initialize Sheets

### Tự động tạo Headers

Các routes API tự động tạo headers nếu sheet chưa có headers. Ví dụ:

- Khi gọi `POST /api/carriers`, system sẽ tự động `ensureHeaders()` cho Carriers sheet
- Khi gọi `GET /api/settings/volume-rules`, system sẽ auto-seed default values nếu sheet trống

### Manual Setup Script (Optional)

Nếu muốn setup thủ công, có thể sử dụng script:

```javascript
// scripts/setup-sheets-headers.js
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
  keyFile: './backend/sinuous-aviary-474820-e3-c442968a0e87.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';

async function setupHeaders() {
  // Carriers
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Carriers!A1',
    valueInputOption: 'RAW',
    resource: {
      values: [[
        'carrierId', 'name', 'avatarUrl', 'contactPerson', 'email', 'phone',
        'address', 'serviceAreas', 'pricingMethod', 'baseRate', 'perKmRate',
        'perM3Rate', 'perTripRate', 'fuelSurcharge', 'remoteAreaFee',
        'insuranceRate', 'vehicleTypes', 'maxWeight', 'maxVolume',
        'operatingHours', 'isActive', 'rating', 'createdAt', 'updatedAt'
      ]]
    }
  });

  console.log('✅ Headers đã được tạo');
}

setupHeaders();
```

---

## 📝 Cấu Trúc Dữ Liệu Chi Tiết

### Carriers Sheet - Data Types

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| carrierId | String | Unique ID | "CAR_001" |
| name | String | Tên công ty | "Công ty Vận tải ABC" |
| pricingMethod | String | PER_KM, PER_M3, PER_TRIP | "PER_KM" |
| baseRate | Number (String) | Phí cơ bản (VND) | "50000" |
| perKmRate | Number (String) | Phí/km (VND) | "15000" |
| perM3Rate | Number (String) | Phí/m³ (VND) | "50000" |
| isActive | String | TRUE/FALSE | "TRUE" |
| rating | Number (String) | Đánh giá (1-5) | "4.5" |

### Transfers Sheet - Package Types

| Column | Description |
|--------|-------------|
| pkgS, pkgM, pkgL | Số kiện Size S/M/L |
| pkgBagSmall, pkgBagMedium, pkgBagLarge | Số bao nhỏ/trung/lớn |
| pkgOther | Số kiện khác |
| totalPackages | Tổng số kiện |

### Volume Calculation

Volume được tính từ package counts × unitVolume từ VolumeRules:

```javascript
totalVolume = (pkgS * 0.04) + (pkgM * 0.09) + (pkgL * 0.14) +
              (pkgBagSmall * 0.01) + (pkgBagMedium * 0.05) + (pkgBagLarge * 0.10)
```

---

## ✅ Verification Checklist

Sau khi setup, verify:

- [ ] Service account JSON file tồn tại trong `backend/`
- [ ] Environment variables đã được cấu hình trong `backend/.env`
- [ ] Spreadsheet đã được share với service account (Editor permission)
- [ ] Tất cả 25 sheets đã được tạo với tên chính xác
- [ ] Backend có thể kết nối: `curl http://localhost:5050/api/sheets/info`
- [ ] Carriers API hoạt động: `curl http://localhost:5050/api/carriers`
- [ ] Transfers API hoạt động: `curl http://localhost:5050/api/transfers`
- [ ] Locations API hoạt động: `curl http://localhost:5050/api/locations`
- [ ] Volume Rules có default values: `curl http://localhost:5050/api/settings/volume-rules`
- [ ] Frontend có thể đọc/ghi dữ liệu qua API
- [ ] Test accounts có thể đăng nhập (nếu có Users sheet)

---

## 🔄 Auto-Headers Feature

Hệ thống tự động đảm bảo headers tồn tại khi:

1. **First API Call**: Khi gọi API lần đầu cho một sheet, system sẽ tự động kiểm tra và tạo headers nếu chưa có
2. **Helper Function**: Sử dụng `ensureHeaders()` trong `googleSheetsHelpers.js`
3. **Auto-Seeding**: Một số sheets như VolumeRules sẽ tự động seed default values nếu trống

**Lưu ý**: Headers phải match chính xác với constants trong routes (case-sensitive)

## 🔍 Debugging & Monitoring

### Check Sheet Headers

```bash
# Check headers của Carriers sheet
curl -X POST http://localhost:5050/api/sheets/read \
  -H "Content-Type: application/json" \
  -d '{
    "spreadsheetId": "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As",
    "sheetName": "Carriers",
    "range": "A1:Z1"
  }'
```

### Monitor API Calls

Backend logs sẽ hiển thị:

- Google Sheets API calls
- Headers creation
- Data read/write operations
- Errors với details

### Check Sheet Status

```bash
# Xem tất cả sheets trong spreadsheet
curl http://localhost:5050/api/sheets/info | jq '.spreadsheet.sheets'
```

## 🎉 Hoàn tất

Sau khi setup xong, bạn có thể:

- ✅ Đọc/ghi dữ liệu từ Google Sheets qua API routes
- ✅ Quản lý carriers, transfers, locations trực tiếp trên Google Sheets
- ✅ Auto-initialization: Headers tự động được tạo khi cần
- ✅ Backup tự động bởi Google
- ✅ Collaboration real-time (nếu share với team)
- ✅ Access từ bất kỳ đâu (qua Google Sheets web/mobile apps)
- ✅ Version history: Google Sheets tự động lưu lịch sử thay đổi

---

**Last Updated:** 2025-01-30

**Version:** 2.1.0

**Spreadsheet ID:** `18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`

---

Made with ❤️ for MIA Logistics Manager
