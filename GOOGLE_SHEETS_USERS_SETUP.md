# 📊 Hướng Dẫn Tạo Users Sheet trong Google Sheets

**Date**: 27 October 2024

---

## 📋 Tổng Quan

Để sử dụng Google Sheets để quản lý users, bạn cần tạo một sheet mới tên "Users" trong Google Spreadsheet.

---

## 🔗 Google Sheets Link

**Spreadsheet ID**: `18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`
**Link**: https://docs.google.com/spreadsheets/d/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As/edit

---

## ✅ Các Bước Tạo Users Sheet

### Bước 1: Mở Google Sheets
1. Truy cập link ở trên
2. Đăng nhập vào Google account

### Bước 2: Tạo Sheet Mới
1. Click vào tab `+` ở dưới cùng
2. Đặt tên sheet: `Users`

### Bước 3: Thêm Headers
Thêm các cột sau vào dòng đầu tiên (A1, B1, C1, ...):

| Column | Header | Description | Example |
|--------|--------|-------------|---------|
| A | Email | Email đăng nhập | admin@mialogistics.com |
| B | Password | Password đã hash | $2b$10$... |
| C | Id | User ID | user_001 |
| D | Name | Tên đầy đủ | Admin User |
| E | Role | Vai trò | admin |
| F | Department | Phòng ban | IT |
| G | Phone | Số điện thoại | 0901234567 |
| H | Status | Trạng thái | active |
| I | Picture | Link ảnh | https://... |

### Bước 4: Hash Password

Chạy script để hash password:

```bash
node scripts/hash-passwords.js
```

Hoặc sử dụng bcrypt trực tiếp:

```javascript
const bcrypt = require('bcryptjs');
const password = "your-password";
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```

### Bước 5: Thêm Users
Thêm users vào các dòng tiếp theo. Ví dụ:

| Email | Password | Id | Name | Role | Department | Phone | Status |
|-------|----------|-----|------|------|------------|-------|--------|
| admin@mialogistics.com | $2b$10$... | user_001 | Admin User | admin | IT | 0901234567 | active |
| manager@mialogistics.com | $2b$10$... | user_002 | Manager User | manager | Operations | 0901234568 | active |

---

## 🔐 Test Accounts với Hash Passwords

### Admin
```
Email: admin@mialogistics.com
Password: admin123
Hashed: $2b$10$pg7ZLPEOJmZxCnS92B4gnO4BarpsekIDUV0SkLt7NEV3DY2F7fTzm
```

### Manager
```
Email: manager@mialogistics.com
Password: manager123
Hashed: $2b$10$skmNDaouI.zqPqBIfvt4rua9P9asq4tBiKxInbbpRKauwffH3RdQK
```

### Operator
```
Email: operator@mialogistics.com
Password: operator123
Hashed: $2b$10$leyTuCfnXjJXVybqekgL1.Fp6.mTtt7C.MJb/aIQuKM3JhGqyyUCG
```

### Driver
```
Email: driver@mialogistics.com
Password: driver123
Hashed: $2b$10$28NAa2W5keC0aqGJk3vyfuo4/uq9YQnBNHGZ77Bqj/sisNXXCfPJO
```

---

## 🚀 Kích Hoạt Google Sheets Authentication

### Cách 1: Sử dụng Environment Variable
Thêm vào file `.env`:
```
REACT_APP_USE_GOOGLE_SHEETS=true
```

### Cách 2: Sửa trong Code
Trong `src/services/googleAuthService.js`:
```javascript
this.useGoogleSheets = true; // Thay vì process.env.REACT_APP_USE_GOOGLE_SHEETS !== 'false'
```

---

## ⚠️ Lưu Ý

1. **Security**: Password phải được hash trước khi lưu vào Google Sheets
2. **Plain Text**: Nếu password chưa hash, hệ thống vẫn hoạt động (backward compatibility) nhưng không an toàn
3. **Fallback**: Nếu không có Google Sheets, hệ thống sẽ tự động dùng mock users
4. **Case Sensitive**: Email không phân biệt hoa thường

---

## 🧪 Test

1. Tạo Users sheet trong Google Sheets
2. Thêm 1-2 users với passwords đã hash
3. Set `REACT_APP_USE_GOOGLE_SHEETS=true` trong `.env`
4. Restart app và thử login
5. Check console để xem đang dùng Sheets hay Mock

---

## ✅ Checklist

- [ ] Tạo sheet "Users" trong Google Sheets
- [ ] Thêm headers vào row 1
- [ ] Hash passwords cho tất cả users
- [ ] Thêm users vào sheet
- [ ] Set `REACT_APP_USE_GOOGLE_SHEETS=true`
- [ ] Test login với users từ Sheets
- [ ] Verify fallback to mock users nếu Sheets fail

---

**Status**: Ready for Google Sheets Integration! 🚀
