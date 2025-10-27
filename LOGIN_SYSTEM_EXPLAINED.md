# 🔐 Hệ Thống Đăng Nhập - MIA Logistics Manager

**Date**: 27 October 2024

---

## 📋 Tổng Quan

Hiện tại hệ thống đang sử dụng **Mock Data** (dữ liệu giả lập) để đăng nhập. Chưa kết nối với Google Sheets để xác thực người dùng thật.

---

## 🔍 Nơi Xử Lý Đăng Nhập

### File: `src/services/googleAuthService.js`

```javascript
async login(email, password) {
  // Mock users for testing
  const mockUsers = {
    "admin@mialogistics.com": {
      id: "user_001",
      email: "admin@mialogistics.com",
      password: "admin123",
      name: "Admin User",
      role: "admin",
      department: "IT",
      phone: "0901234567",
      status: "active",
    },
    // ... more users
  };

  // Check if user exists
  const user = mockUsers[email];
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check password
  if (user.password !== password) {
    throw new Error("Invalid email or password");
  }

  // Return user
  return user;
}
```

---

## 👥 Tài Khoản Test Hiện Tại

### 1. Admin
- **Email**: `admin@mialogistics.com`
- **Password**: `admin123`
- **Role**: admin
- **Quyền**: Full access

### 2. Manager
- **Email**: `manager@mialogistics.com`
- **Password**: `manager123`
- **Role**: manager
- **Quyền**: Quản lý operations

### 3. Operator
- **Email**: `operator@mialogistics.com`
- **Password**: `operator123`
- **Role**: operator
- **Quyền**: Xử lý vận chuyển

### 4. Driver
- **Email**: `driver@mialogistics.com`
- **Password**: `driver123`
- **Role**: driver
- **Quyền**: Tài xế

---

## 🔄 Luồng Đăng Nhập

```
User → Login Form
      ↓
Email + Password
      ↓
googleAuthService.login()
      ↓
Check Mock Users
      ↓
Valid? → Create Session → Redirect to Dashboard
Invalid? → Show Error
```

---

## 📊 Database Configuration

### Google Sheets ID
```
SPREADSHEET_ID: 18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
```

### Sheets Structure
- **Carriers** - Nhà vận chuyển
- **Transports** - Đơn vận chuyển
- **Warehouse** - Kho hàng
- **Staff** - Nhân viên
- **Partners** - Đối tác
- **Settings** - Cài đặt

---

## 🚀 Tích Hợp Google Sheets

### Cần Làm:
1. Tạo sheet "Users" trong Google Sheets
2. Thêm các trường:
   - Email
   - Password (hash)
   - Name
   - Role
   - Department
   - Phone
   - Status
3. Update `googleAuthService.login()` để:
   - Đọc từ Google Sheets
   - Hash password
   - So sánh với dữ liệu thật

---

## 📝 Cấu Hình Hiện Tại

### Mock Data (Current)
```javascript
FEATURES: {
  GOOGLE_SHEETS: true,
  MOCK_DATA: false, // Nhưng vẫn dùng mock users
}
```

### Real Data (Future)
```javascript
FEATURES: {
  GOOGLE_SHEETS: true,
  MOCK_DATA: false,
  // Use real Google Sheets data
}
```

---

## ✅ Ưu Điểm Mock Data

1. ✅ Test nhanh
2. ✅ Không cần internet
3. ✅ Dễ debug
4. ✅ Stable

---

## ⚠️ Hạn Chế

1. ❌ Chưa an toàn (password plain text)
2. ❌ Không thể thêm user mới từ UI
3. ❌ Chưa kết nối database thật
4. ❌ Không có password reset

---

## 🎯 Kế Hoạch Cải Thiện

### Phase 1: Hash Passwords
- Sử dụng bcrypt để hash passwords
- Lưu hash vào mock data

### Phase 2: Google Sheets Integration
- Tạo sheet Users
- Đọc users từ Google Sheets
- Hash comparison

### Phase 3: User Management
- CRUD users
- Password reset
- Email verification

---

**Status**: Đang dùng Mock Data để test 🧪
