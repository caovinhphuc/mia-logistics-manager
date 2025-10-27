# Setup Google Sheets Authentication - Mia Logistics Manager

## Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Enable các APIs cần thiết:
   - Google Sheets API
   - Google Drive API

## Bước 2: Tạo Service Account

1. Vào IAM & Admin > Service Accounts
2. Tạo Service Account mới:
   - Name: `mia-logistics-sheets-service`
   - Description: `Service account for Mia Logistics Google Sheets integration`
3. Download JSON key file
4. Rename thành `service-account-key.json`
5. Copy vào project root (cùng cấp với package.json)

## Bước 3: Tạo Google Spreadsheet

1. Tạo Google Spreadsheet mới
2. Copy Spreadsheet ID từ URL:

   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

3. Tạo sheet tên "Users" với cấu trúc:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| id | email | password | name | role | department | phone | status | created_date | last_login | picture |

## Bước 4: Chia sẻ Spreadsheet

1. Click "Share" trên Spreadsheet
2. Add email của service account (từ JSON key file)
3. Cấp quyền "Editor"
4. Bỏ tick "Notify people"

## Bước 5: Cấu hình Environment

1. Cập nhật file `.env`:

```bash
REACT_APP_GOOGLE_SPREADSHEET_ID=your_actual_spreadsheet_id_here
REACT_APP_GOOGLE_SHEETS_USERS_SHEET_NAME=Users
REACT_APP_ENABLE_MOCK_DATA=true
```

## Bước 6: Thêm dữ liệu demo

Thêm vào sheet "Users":

```
user_001 | admin@mialogistics.com | admin123 | Admin User | admin | IT | 0901234567 | active | 2024-01-01 | |
user_002 | manager@mialogistics.com | manager123 | Manager User | manager | Operations | 0901234568 | active | 2024-01-01 | |
user_003 | operator@mialogistics.com | operator123 | Operator User | operator | Warehouse | 0901234569 | active | 2024-01-01 | |
user_004 | driver@mialogistics.com | driver123 | Driver User | driver | Transport | 0901234570 | active | 2024-01-01 | |
```

## Bước 7: Test Connection

1. Start development server: `npm start`
2. Mở <http://localhost:3000>
3. Click button "Test Google Sheets Connection" (chỉ hiện ở development mode)
4. Check console logs để xem kết quả

## Bước 8: Production Mode

Sau khi test thành công:

1. Cập nhật `.env`:

```bash
REACT_APP_ENABLE_MOCK_DATA=false
```

2. Restart server và test đăng nhập với:
   - Email: <admin@mialogistics.com>
   - Password: admin123

## Troubleshooting

### Lỗi 403 Forbidden

- Service account chưa được share quyền truy cập spreadsheet
- Kiểm tra service account email trong JSON key file
- Ensure spreadsheet được share với service account

### Lỗi 404 Not Found

- SPREADSHEET_ID không đúng
- Sheet name "Users" không tồn tại
- Kiểm tra URL spreadsheet

### Lỗi ENOENT service-account-key.json

- File service account key chưa được download
- File không đặt đúng vị trí (phải ở project root)
- File name không đúng (phải là service-account-key.json)

### Lỗi API not enabled

- Google Sheets API chưa được enable
- Google Drive API chưa được enable
- Truy cập Google Cloud Console và enable APIs

## Commands Debug

```bash
# Check if service account file exists
ls -la service-account-key.json

# Check environment variables
npm run env

# Start with debug
REACT_APP_DEBUG=true npm start

# Check logs
npm start 2>&1 | grep -i "google\|sheets\|auth"
```

## Security Notes

1. **KHÔNG** commit service-account-key.json vào Git
2. Thêm vào .gitignore:

```
service-account-key.json
.env
```

3. Sử dụng environment variables cho production
4. Rotate service account keys định kỳ
5. Monitor API usage trong Google Cloud Console

## Migration Checklist

- [ ] Google Cloud Project created
- [ ] APIs enabled (Sheets, Drive)
- [ ] Service Account created
- [ ] JSON key downloaded và đặt đúng vị trí
- [ ] Spreadsheet created với cấu trúc đúng
- [ ] Spreadsheet shared với service account
- [ ] Environment variables configured
- [ ] Demo data added to Users sheet
- [ ] Connection test successful
- [ ] Authentication test successful
- [ ] Mock data disabled
- [ ] Production test completed
