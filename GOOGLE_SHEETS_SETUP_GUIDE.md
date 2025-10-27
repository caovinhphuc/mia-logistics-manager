# 📊 Google Sheets Setup Guide - MIA Logistics Manager

## 🎯 Mục đích
Tạo cấu trúc Google Sheets để lưu trữ dữ liệu Users cho hệ thống authentication.

---

## 📋 Sheet: Users - Cấu trúc chi tiết

### Headers (Dòng 1)

```
id | email | password | name | role | department | phone | status | created_date | last_login | picture
```

### Cột (Columns)

| Cột | Tên | Kiểu dữ liệu | Bắt buộc | Mô tả |
|-----|-----|-------------|----------|-------|
| A | id | Text | Có | ID duy nhất (user_001, user_002, ...) |
| B | email | Email | Có | Email đăng nhập (duy nhất) |
| C | password | Text | Có | Mật khẩu (plain text) |
| D | name | Text | Có | Tên đầy đủ |
| E | role | Text | Có | Vai trò: admin, manager, operator, driver |
| F | department | Text | Không | Phòng ban |
| G | phone | Text | Không | Số điện thoại |
| H | status | Text | Có | Trạng thái: active, inactive, suspended |
| I | created_date | Date | Không | Ngày tạo tài khoản |
| J | last_login | DateTime | Không | Lần đăng nhập cuối |
| K | picture | URL | Không | Ảnh đại diện |

---

## 🔧 Bước 1: Tạo Google Spreadsheet

### URL Google Sheets hiện tại
https://docs.google.com/spreadsheets/d/1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k

### Thực hiện:
1. Mở Google Sheets
2. Tạo sheet mới với tên **"Users"**
3. Nhập headers vào dòng 1 (A1-K1)
4. Format headers: Bold, Background color

---

## 👥 Bước 2: Thêm dữ liệu mẫu

### Users mẫu (Dòng 2-5)

#### User 1 - Admin
```
user_001 | admin@mialogistics.com | admin123 | Admin User | admin | IT | 0901234567 | active | 2024-01-01 | 2024-01-15 10:30 |
```

#### User 2 - Manager
```
user_002 | manager@mialogistics.com | manager123 | Manager User | manager | Operations | 0901234568 | active | 2024-01-01 | 2024-01-14 09:15 |
```

#### User 3 - Operator
```
user_003 | operator@mialogistics.com | operator123 | Operator User | operator | Warehouse | 0901234569 | active | 2024-01-01 | 2024-01-13 14:20 |
```

#### User 4 - Driver
```
user_004 | driver@mialogistics.com | driver123 | Driver User | driver | Transport | 0901234570 | active | 2024-01-01 | 2024-01-12 08:45 |
```

---

## 🔐 Bước 3: Share với Service Account

### Service Account Email
```
mia-logistics-service@mia-logistics-469406.iam.gserviceaccount.com
```

### Thực hiện:
1. Click **"Share"** button trên Google Sheets
2. Paste service account email
3. Chọn quyền: **"Editor"**
4. Click **"Send"**

---

## ✅ Bước 4: Verify Setup

### Checklist
- [ ] Sheet "Users" đã được tạo
- [ ] Headers đã được nhập đúng (A1-K1)
- [ ] Dữ liệu mẫu đã được thêm
- [ ] Service Account đã được share với quyền Editor
- [ ] Spreadsheet ID đã được cấu hình trong `.env`

---

## 🔑 Roles và Permissions

### Admin
- Toàn quyền truy cập
- Quản lý users và settings
- Xem tất cả reports

### Manager
- Quản lý operations
- Xem reports của department
- Quản lý staff

### Operator
- Thực hiện các tác vụ hàng ngày
- Nhập liệu, cập nhật trạng thái
- Xem reports

### Driver
- Xem và cập nhật trạng thái vận chuyển
- Check-in/out
- Xem lịch trình

---

## 📝 Validation Rules

1. **Email**: Format hợp lệ, duy nhất
2. **Role**: admin, manager, operator, driver
3. **Status**: active, inactive, suspended
4. **Password**: Tối thiểu 6 ký tự
5. **ID**: Duy nhất, format user_XXX

---

## 🎯 Testing

### Test trong Development Mode
```bash
npm start
# Mở http://localhost:3000
# Click "Test Google Sheets Connection"
```

### Test với Production
```bash
npm run build
npx serve -s build -p 8080
# Mở http://localhost:8080
# Thử login với các users mẫu
```

---

## 🚨 Troubleshooting

### Lỗi 403 Forbidden
- **Nguyên nhân**: Service account chưa được share
- **Giải pháp**: Share Google Sheets với service account email

### Lỗi 404 Not Found
- **Nguyên nhân**: Spreadsheet ID hoặc sheet name sai
- **Giải pháp**: Kiểm tra SPREADSHEET_ID trong `.env`

### Invalid Credentials
- **Nguyên nhân**: Service account key sai
- **Giải pháp**: Kiểm tra file `credentials/service-account-key.json`

---

## 📊 Cấu trúc Google Sheets

```
Sheet Name: Users
Spreadsheet ID: 1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k

Row 1 (Headers):
[A1:K1] id | email | password | name | role | department | phone | status | created_date | last_login | picture

Row 2-5 (Data):
User samples as above
```

---

## 🎉 Hoàn thành!

Sau khi hoàn thành tất cả các bước:
- ✅ Google Sheets structure sẵn sàng
- ✅ Dữ liệu mẫu đã được thêm
- ✅ Service Account có quyền truy cập
- ✅ Application có thể authenticate với Google Sheets

**Next**: Test application với `npm start` 🚀
