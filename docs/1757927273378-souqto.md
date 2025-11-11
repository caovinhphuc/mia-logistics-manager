# 🔧 Google Sheets Setup Guide

## 📋 Bước 1: Tạo Google Service Account

### 1.1. Tạo Google Cloud Project

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Ghi nhớ **Project ID**

### 1.2. Enable Google Sheets API

1. Vào **APIs & Services** > **Library**
2. Tìm "Google Sheets API"
3. Click **Enable**

### 1.3. Tạo Service Account

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Điền thông tin:
   - **Name**: `mia-logistics-service`
   - **Description**: `Service account for MIA Logistics Manager`
4. Click **Create and Continue**
5. Skip **Grant access** (click **Done**)

### 1.4. Tạo Key cho Service Account

1. Vào **Credentials** tab
2. Tìm service account vừa tạo
3. Click vào service account
4. Vào **Keys** tab
5. Click **Add Key** > **Create new key**
6. Chọn **JSON** format
7. Download file JSON

## 📋 Bước 2: Tạo Google Spreadsheet

### 2.1. Tạo Spreadsheet mới

1. Vào [Google Sheets](https://sheets.google.com/)
2. Tạo spreadsheet mới
3. Đặt tên: `MIA Logistics Manager`
4. Copy **Spreadsheet ID** từ URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

### 2.2. Share với Service Account

1. Click **Share** button
2. Thêm email service account: `your-service-account@your-project.iam.gserviceaccount.com`
3. Chọn permission: **Editor**
4. Click **Send**

## 📋 Bước 3: Cấu hình Environment Variables

### 3.1. Cập nhật file `.env`

```bash
# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here
```

### 3.2. Lấy thông tin từ JSON file

Từ file JSON đã download:

- **GOOGLE_SERVICE_ACCOUNT_EMAIL**: `client_email`
- **GOOGLE_PRIVATE_KEY**: `private_key` (giữ nguyên format)
- **GOOGLE_SPREADSHEET_ID**: ID từ URL spreadsheet

## 📋 Bước 4: Test Connection

### 4.1. Test Google Sheets

```bash
cd server
node test-google-sheets.js
```

### 4.2. Test Password Update

```bash
node src/utils/updatePasswords.js
```

## 📋 Bước 5: Khởi động dự án

### 5.1. Khởi động với Google Sheets

```bash
cd ..
./start-google-sheets.sh
```

### 5.2. Test đăng nhập

- Vào `http://localhost:3000/login`
- Sử dụng test accounts:
  - `admin@mia-logistics.com` / `Test123`
  - `manager@mia-logistics.com` / `Test123`
  - `driver@mia-logistics.com` / `Test123`
  - `customer@mia-logistics.com` / `Test123`

## 🔧 Troubleshooting

### Lỗi: "Missing Google Sheets credentials"

- Kiểm tra file `.env` có đầy đủ 3 biến môi trường
- Đảm bảo format đúng (đặc biệt là `GOOGLE_PRIVATE_KEY`)

### Lỗi: "Permission denied"

- Kiểm tra service account đã được share với spreadsheet
- Đảm bảo permission là **Editor**

### Lỗi: "Spreadsheet not found"

- Kiểm tra `GOOGLE_SPREADSHEET_ID` đúng
- Đảm bảo spreadsheet tồn tại và accessible

### Lỗi: "API not enabled"

- Kiểm tra Google Sheets API đã được enable
- Đảm bảo billing account được setup (nếu cần)

## 📊 Google Sheets Structure

### Users Sheet

```
id | email | passwordHash | fullName | roleId | status | createdAt | updatedAt
```

### Role Mapping

- **1** = Admin (full permissions)
- **2** = Manager (read/write orders, carriers)
- **3** = Driver (read/write orders)
- **4** = Customer (read orders)
- **5** = Guest (no permissions)

## 🎉 Hoàn tất!

Sau khi setup xong, bạn có thể:

- ✅ Đăng nhập với Google Sheets
- ✅ Quản lý users trực tiếp trên Google Sheets
- ✅ Backup tự động bởi Google
- ✅ Collaboration real-time
