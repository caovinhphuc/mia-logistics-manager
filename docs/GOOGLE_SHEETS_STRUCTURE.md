# Google Sheets Structure - Mia Logistics Manager

## Sheet: Users

Tạo một sheet có tên **"Users"** trong Google Spreadsheet với cấu trúc như sau:

### Cột (Columns)

| Cột | Tên | Kiểu dữ liệu | Bắt buộc | Mô tả |
|-----|-----|-------------|----------|-------|
| A | id | Text | Có | ID duy nhất của user (user_001, user_002, ...) |
| B | email | Email | Có | Email đăng nhập (duy nhất) |
| C | password | Text | Có | Mật khẩu (plain text - sẽ được mã hóa sau) |
| D | name | Text | Có | Tên đầy đủ của người dùng |
| E | role | Text | Có | Vai trò: admin, manager, operator, driver |
| F | department | Text | Không | Phòng ban |
| G | phone | Text | Không | Số điện thoại |
| H | status | Text | Có | Trạng thái: active, inactive, suspended |
| I | created_date | Date | Không | Ngày tạo tài khoản |
| J | last_login | DateTime | Không | Lần đăng nhập cuối |
| K | picture | URL | Không | Ảnh đại diện |

### Header Row (Dòng 1)

```
id | email | password | name | role | department | phone | status | created_date | last_login | picture
```

### Dữ liệu mẫu (Từ dòng 2 trở đi)

```
user_001 | admin@mialogistics.com | admin123 | Admin User | admin | IT | 0901234567 | active | 2024-01-01 | 2024-01-15 10:30 |
user_002 | manager@mialogistics.com | manager123 | Manager User | manager | Operations | 0901234568 | active | 2024-01-01 | 2024-01-14 09:15 |
user_003 | operator@mialogistics.com | operator123 | Operator User | operator | Warehouse | 0901234569 | active | 2024-01-01 | 2024-01-13 14:20 |
user_004 | driver@mialogistics.com | driver123 | Driver User | driver | Transport | 0901234570 | active | 2024-01-01 | 2024-01-12 08:45 |
```

## Quyền truy cập

1. **Spreadsheet Settings**:
   - Chia sẻ với service account email từ Google Cloud Console
   - Quyền: Editor hoặc Viewer (tùy theo nhu cầu)

2. **Security**:
   - Chỉ chia sẻ với service account, không public
   - Mật khẩu lưu dạng plain text (sẽ nâng cấp mã hóa sau)

## Roles và Permissions

### admin

- Toàn quyền truy cập hệ thống
- Quản lý users, settings
- Xem tất cả reports

### manager

- Quản lý operations
- Xem reports của department
- Quản lý staff trong department

### operator

- Thực hiện các tác vụ hàng ngày
- Nhập liệu, cập nhật trạng thái
- Xem reports liên quan

### driver

- Xem và cập nhật trạng thái vận chuyển
- Check-in/out tại điểm giao hàng
- Xem lịch trình của mình

## Validation Rules

1. **Email**: Phải là format email hợp lệ và duy nhất
2. **Role**: Chỉ nhận các giá trị: admin, manager, operator, driver
3. **Status**: Chỉ nhận các giá trị: active, inactive, suspended
4. **Password**: Tối thiểu 6 ký tự
5. **ID**: Duy nhất và theo format user_XXX

## Migration từ Mock Data

Sau khi thiết lập Google Sheets thành công:

1. Import dữ liệu demo hiện tại vào Google Sheets
2. Test authentication với Google Sheets
3. Disable mock data trong `googleAuthService.js`
4. Enable production mode với Google Sheets authentication

## Troubleshooting

### Lỗi thường gặp

1. **403 Forbidden**: Service account chưa được chia sẻ quyền truy cập spreadsheet
2. **404 Not Found**: SPREADSHEET_ID hoặc sheet name không đúng
3. **Invalid credentials**: Service account key file không đúng hoặc chưa được enable APIs

### Debug commands

- Sử dụng button "Test Google Sheets Connection" trong login page (development mode)
- Check console logs để xem chi tiết lỗi
- Verify spreadsheet ID và sheet name trong service

## Next Steps

1. [ ] Tạo Google Spreadsheet với cấu trúc như trên
2. [ ] Chia sẻ quyền với service account
3. [ ] Cấu hình SPREADSHEET_ID trong environment variables
4. [ ] Test connection với debug button
5. [ ] Import demo users vào Google Sheets
6. [ ] Disable mock authentication
7. [ ] Test production authentication flow
