# Chi tiết Tính năng - MIA Logistics Manager

Tài liệu này mô tả chi tiết các tính năng chính của hệ thống.

---

## 🚛 Quản lý Vận chuyển

### Chờ Chuyển Giao - Pending Delivery

**Route**: `/transport/pending-delivery`

Tính năng quản lý hàng hóa chờ chuyển giao với khả năng tạo yêu cầu vận chuyển hàng loạt.

#### Filter Logic

Hiển thị các phiếu có:

- `transportStatus === "Chờ chuyển giao"` **HOẶC**
- `state === "Xuất chuyển kho"`

#### Multi-Select Functionality

- **Checkbox Selection**: Chọn từ 1-10 phiếu để tạo yêu cầu vận chuyển
- **Validation**: Không cho phép chọn quá 10 phiếu trong 1 lần
- **Visual Feedback**: Highlight các phiếu đã chọn

#### Tính năng "Đặt xe mới"

##### 1. Dialog Form

Khi click nút "Đặt xe mới", hiển thị dialog với:

**Thông tin cơ bản:**

- **Nhà vận chuyển**: Dropdown chọn carrier
- **Loại xe**: Dropdown chọn loại phương tiện
- **Ghi chú**: Text area cho thông tin bổ sung

**Thông tin tự động:**

- **Request ID**: Auto-generate unique ID
- **Điểm lấy hàng**: Lấy từ phiếu đầu tiên được chọn
- **Tổng số kiện**: Tính tổng từ tất cả phiếu
- **Tổng khối**: Tính tổng volume từ tất cả phiếu
- **Tổng sản phẩm**: Đếm tổng số items

**Danh sách điểm giao hàng:**

- Hiển thị table với các cột:
  - Stop # (stop1, stop2, ..., stop10)
  - Mã phiếu
  - Địa chỉ giao hàng
  - Số kiện
  - Khối (m³)
  - Sản phẩm

##### 2. Business Logic Flow

```javascript
// Step 1: Generate Request ID
const requestId = generateRequestId(); // Format: REQ-YYYYMMDD-XXXXX

// Step 2: Prepare Transport Request Data
const transportRequest = {
  requestId: requestId,
  carrier: selectedCarrier,
  vehicleType: selectedVehicleType,
  pickupLocation: transfers[0].fromLocation,
  totalPackages: sum(transfers.map((t) => t.packages)),
  totalVolume: sum(transfers.map((t) => t.volume)),
  totalProducts: sum(transfers.map((t) => t.products)),
  stop1: transfers[0].toLocation,
  stop2: transfers[1]?.toLocation,
  // ... up to stop10
  status: 'Pending',
  createdAt: new Date(),
};

// Step 3: Create Transport Request
await createTransportRequest(transportRequest);

// Step 4: Update All Transfer Status
for (const transfer of selectedTransfers) {
  await updateTransferStatus(transfer.id, {
    transportStatus: 'Đang chuyển giao',
    transportRequestId: requestId,
    updatedAt: new Date(),
  });
}

// Step 5: Refresh UI
fetchPendingTransfers();
showSuccessMessage(`Đã tạo yêu cầu vận chuyển ${requestId}`);
```

##### 3. Validation Rules

- **Minimum**: Phải chọn ít nhất 1 phiếu
- **Maximum**: Không được chọn quá 10 phiếu
- **Carrier Required**: Phải chọn nhà vận chuyển
- **Vehicle Type Required**: Phải chọn loại xe
- **Duplicate Check**: Không được chọn phiếu đã có transport request

##### 4. Success Flow

1. ✅ Tạo transport request thành công
2. ✅ Update status tất cả phiếu → "Đang chuyển giao"
3. ✅ Remove các phiếu đã chọn khỏi danh sách "Chờ chuyển giao"
4. ✅ Show success notification
5. ✅ Close dialog
6. ✅ Refresh data

##### 5. Error Handling

- **API Error**: Show error message, không update UI
- **Network Error**: Retry mechanism hoặc manual retry
- **Validation Error**: Highlight fields lỗi, show error message
- **Concurrent Update**: Check version/timestamp để tránh conflict

---

## 🚛 Transport Requests Sheet

### Yêu cầu Vận chuyển

**Route**: `/transport/requests`

#### Grid View Features

- **Dual View**: Table view + Grid view (cards)
- **Filters**: Filter by status, date range, carrier
- **Search**: Search by request ID, carrier, location
- **Sort**: Sort by date, status, carrier

#### Fields

1. **Request ID**: Mã yêu cầu duy nhất
2. **Carrier**: Nhà vận chuyển
3. **Vehicle Type**: Loại xe
4. **Pickup Location**: Điểm lấy hàng
5. **Stops**: Danh sách điểm giao (stop1-stop10)
6. **Total Packages**: Tổng số kiện
7. **Total Volume**: Tổng khối (m³)
8. **Status**: Trạng thái (Pending, In Transit, Completed, Cancelled)
9. **Created At**: Ngày tạo
10. **Notes**: Ghi chú

#### Status Flow

```
Pending → In Transit → Completed
         ↓
      Cancelled
```

---

## 📥 Nhập hàng (Inbound)

### Nhập hàng Quốc tế

**Route**: `/inbound/international`

#### Features

- **70+ columns**: Full data cho customs, shipping, inventory
- **Calendar View**: Xem lịch nhập hàng theo ngày/tuần/tháng
- **Filters**: Filter by date, supplier, status
- **Export**: Export to Excel/CSV
- **Import**: Import từ Excel template

#### Key Fields

1. **Shipment Info**: Mã lô, số container, bill of lading
2. **Supplier Info**: Nhà cung cấp, quốc gia
3. **Product Details**: Tên SP, mã HS code, số lượng
4. **Customs**: Tờ khai hải quan, thuế, phí
5. **Shipping**: Ngày gửi, ngày dự kiến, ngày thực tế
6. **Warehouse**: Kho nhận, vị trí lưu

### Nhập hàng Quốc nội

**Route**: `/inbound/domestic`

#### Features

- **Simplified Fields**: Ít cột hơn, focus vào logistics
- **Quick Entry**: Form nhập nhanh
- **Batch Import**: Import nhiều phiếu cùng lúc

---

## 👥 Quản lý Nhân viên

### Employees Management

**Route**: `/employees`

#### Dual View

1. **Table View**: Danh sách dạng bảng với sort, filter
2. **Grid View**: Cards view với avatar, info summary

#### Features

- **CRUD Operations**: Create, Read, Update, Delete
- **Search**: Tìm kiếm theo tên, email, phone
- **Filter**: Filter theo role, department, status
- **Sort**: Sắp xếp theo nhiều tiêu chí
- **Pagination**: 50 items/page

#### Fields

1. **Personal Info**: Họ tên, email, phone, address
2. **Employment**: Chức vụ, phòng ban, ngày vào
3. **Account**: User ID, role, permissions
4. **Status**: Active, Inactive, On Leave

---

## 🔐 Phân quyền (RBAC)

### Roles

**Route**: `/settings/roles`

#### Default Roles

1. **Admin**: Full access
2. **Manager**: Management functions
3. **Operator**: Daily operations
4. **Driver**: Delivery functions
5. **Warehouse Staff**: Warehouse operations

### Permissions

**Route**: `/settings/permissions`

#### Permission Format

```
resource:action
```

#### Examples

- `transport:view` - Xem vận chuyển
- `transport:create` - Tạo mới vận chuyển
- `transport:edit` - Chỉnh sửa vận chuyển
- `transport:delete` - Xóa vận chuyển
- `warehouse:view` - Xem kho
- `reports:view` - Xem báo cáo
- `settings:manage` - Quản lý cài đặt

### Users

**Route**: `/settings/users`

#### User Management

- **Create User**: Tạo tài khoản mới
- **Assign Role**: Gán vai trò
- **Set Permissions**: Set quyền custom (optional)
- **Activate/Deactivate**: Enable/disable account
- **Reset Password**: Reset mật khẩu

---

## 🗺️ Tính toán Khoảng cách

### Google Apps Script Integration

#### Flow

1. User nhập origin và destination
2. Frontend call backend API
3. Backend call Google Apps Script
4. Script call Google Maps Distance Matrix API
5. Return distance, duration, method

#### Address Processing

**Xử lý địa chỉ dài:**

```javascript
// Input
"lô2-5, Đường CN1, Phường Tây Thạnh, Quận Tân Phú, Thành phố Hồ Chí Minh"

// Processing
- Rút gọn: "Thành phố Hồ Chí Minh" → "HCM"
- Loại bỏ ký tự đặc biệt
- Giữ thông tin quan trọng: Quận, Phường, số nhà

// Output
"L2-5 Đ CN1 P Tây Thạnh Q Tân Phú HCM"
```

#### Methods

1. **Google Maps Services**: Primary method (API)
2. **Haversine Formula**: Fallback method (as-the-crow-flies)

---

## 📊 Volume Calculator

### Tính toán Khối

**Route**: `/transport/volume-calculator`

#### Rules

Configure rules trong `/settings/volume-rules`:

```javascript
{
  id: 'rule-1',
  name: 'Standard Box',
  formula: 'length * width * height / 1000000', // Convert to m³
  minVolume: 0,
  maxVolume: 10,
  isDefault: true
}
```

#### Usage

```javascript
const volume = calculateVolume({
  length: 100, // cm
  width: 50, // cm
  height: 30, // cm
  rule: 'standard',
});

// Result: 0.15 m³
```

---

## 📱 Session Management

### Smart Session

#### Features

1. **Auto Timeout**: 30 minutes inactivity
2. **Warning**: 5 minutes before timeout
3. **Smart Extension**: Extend if < 20 minutes left
4. **Activity Monitor**: Reset timer on user activity
5. **Auto Redirect**: Return to original location after re-login

#### Flow

```
Login → Active (30min) → Warning (5min before) →
  ↓                           ↓
Extend                    Logout/Re-login
  ↓                           ↓
Continue                  Redirect to original location
```

---

**Last Updated**: November 12, 2025
**Version**: 2.1.1
