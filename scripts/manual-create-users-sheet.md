# Hướng dẫn tạo sheet "Users" thủ công

## Vấn đề hiện tại
- Spreadsheet ID: `18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As`
- Google Sheets Service đã kết nối thành công
- **Sheet "Users" không tồn tại** trong spreadsheet thực tế
- Frontend sử dụng mock data thay vì dữ liệu thực từ Google Sheets

## Giải pháp

### Bước 1: Truy cập Google Spreadsheet
1. Mở trình duyệt và truy cập: `https://docs.google.com/spreadsheets/d/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As/edit`
2. Đăng nhập với tài khoản Google có quyền truy cập

### Bước 2: Tạo sheet "Users"
1. Trong Google Spreadsheet, click vào dấu "+" ở góc dưới bên trái để tạo sheet mới
2. Đặt tên sheet là "Users" (chính xác)
3. Click vào sheet "Users" để chọn nó

### Bước 3: Thêm dữ liệu mẫu
Thêm dữ liệu sau vào sheet "Users":

| A (id) | B (email) | C (name) | D (role) | E (status) | F (created_at) |
|--------|-----------|----------|----------|------------|----------------|
| u-admin | admin@mia.vn | Admin User | admin | active | 2024-01-01 |
| u-manager1 | manager1@mia.vn | Manager 1 | manager | active | 2024-01-01 |
| u-operator1 | operator1@mia.vn | Operator 1 | warehouse_staff | active | 2024-01-01 |
| u-driver1 | driver1@mia.vn | Driver 1 | driver | active | 2024-01-01 |
| u-warehouse1 | warehouse1@mia.vn | Warehouse Staff 1 | warehouse_staff | active | 2024-01-01 |

### Bước 4: Kiểm tra kết quả
1. Đảm bảo sheet "Users" có đúng 6 dòng (1 header + 5 users)
2. Đảm bảo tên cột chính xác: id, email, name, role, status, created_at
3. Lưu spreadsheet

### Bước 5: Test đăng nhập
1. Restart frontend application
2. Thử đăng nhập với: `admin@mia.vn` / `admin123`
3. Kiểm tra console logs để xem có còn warning "Sheet Users not found" không

## Cấu trúc sheet mong đợi

Frontend mong đợi các sheet sau:
- ✅ **Users** (đang thiếu - cần tạo)
- ❓ **Carriers**
- ❓ **Shipments**
- ❓ **Locations**
- ❓ **VolumeRules**
- ❓ **Settings**

## Lưu ý
- Tên sheet phải chính xác: "Users" (không phân biệt hoa thường)
- Dữ liệu phải có đúng format như trên
- Spreadsheet phải có quyền truy cập public hoặc shared với service account
