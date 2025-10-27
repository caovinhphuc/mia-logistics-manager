# 🔧 Google Cloud Platform Setup Instructions

## ✅ Đã hoàn thành

1. ✅ gcloud CLI đã được cài đặt (version 544.0.0)
2. ✅ PATH đã được cấu hình

---

## 📋 Bước 1: Đăng nhập vào Google Cloud

Chạy lệnh sau trong terminal:

```bash
export PATH=/opt/homebrew/share/google-cloud-sdk/bin:"$PATH"
gcloud auth login
```

Điều này sẽ:
- Mở trình duyệt
- Yêu cầu đăng nhập tài khoản Google
- Yêu cầu cấp quyền cho Google Cloud CLI

---

## 📋 Bước 2: Tạo Google Cloud Project

Sau khi đăng nhập thành công, chạy:

```bash
# Tạo project mới
gcloud projects create mia-logistics-prod --name="MIA Logistics Production"

# Set project làm default
gcloud config set project mia-logistics-prod
```

**Lưu ý**: Nếu tên project đã tồn tại, hãy chọn tên khác.

---

## 📋 Bước 3: Enable Billing

1. Truy cập: https://console.cloud.google.com/billing
2. Click "Link a billing account"
3. Chọn billing account của bạn
4. Link với project `mia-logistics-prod`

**QUAN TRỌNG**: Cần có billing account để sử dụng các API.

---

## 📋 Bước 4: Enable APIs

Chạy các lệnh sau để enable tất cả APIs cần thiết:

```bash
export PATH=/opt/homebrew/share/google-cloud-sdk/bin:"$PATH"

# Enable APIs
gcloud services enable sheets.googleapis.com
gcloud services enable drive.googleapis.com
gcloud services enable script.googleapis.com
gcloud services enable maps-backend.googleapis.com
gcloud services enable places-backend.googleapis.com
gcloud services enable directions-backend.googleapis.com
gcloud services enable distance-matrix-backend.googleapis.com
gcloud services enable geocoding-backend.googleapis.com
gcloud services enable geolocation.googleapis.com

# Verify APIs are enabled
gcloud services list --enabled
```

---

## 📋 Bước 5: Tạo Service Account

```bash
# Create service account
gcloud iam service-accounts create mia-logistics-service \
  --display-name="MIA Logistics Service Account" \
  --description="Service account for MIA Logistics Manager"

# Get service account email
SA_EMAIL=$(gcloud iam service-accounts list \
  --filter="displayName:MIA Logistics Service Account" \
  --format="value(email)")

echo "Service Account Email: $SA_EMAIL"

# Grant roles
gcloud projects add-iam-policy-binding mia-logistics-prod \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/sheets.editor"

gcloud projects add-iam-policy-binding mia-logistics-prod \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/drive.file"

gcloud projects add-iam-policy-binding mia-logistics-prod \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/script.developer"

# Create và download key
mkdir -p credentials
gcloud iam service-accounts keys create credentials/service-account-key.json \
  --iam-account=$SA_EMAIL

echo "✅ Service account key saved to: credentials/service-account-key.json"
```

---

## 📋 Bước 6: Setup OAuth 2.0 (Console UI)

Không thể làm qua CLI, cần làm qua Console:

1. Truy cập: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Nếu chưa có OAuth consent screen, tạo:
   - User Type: External (hoặc Internal nếu dùng Workspace)
   - App name: MIA Logistics Manager
   - Support email: your-email@example.com
4. Back lại Credentials, click "Create Credentials" > "OAuth 2.0 Client ID"
5. Application type: **Web application**
6. Name: MIA Logistics OAuth Client
7. Authorized origins:
   - `http://localhost:3000`
   - `https://yourdomain.com` (production)
8. Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `https://yourdomain.com/auth/google/callback`
9. Click "Create"
10. **Lưu lại Client ID và Client Secret**

---

## 📋 Bước 7: Tạo API Key cho Maps

### Option 1: Qua Console UI (Easier)

1. Truy cập: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" > "API Key"
3. Copy API key
4. Click "Restrict Key"
5. Application restrictions: HTTP referrers
   - Add: `http://localhost:3000/*`
   - Add: `https://yourdomain.com/*`
6. API restrictions:
   - Select: Maps JavaScript API, Places API, Directions API, etc.
7. Save

### Option 2: Qua CLI

```bash
# Create API key
gcloud alpha services api-keys create \
  --display-name="MIA Logistics Maps API Key"

# Get the key
API_KEY=$(gcloud alpha services api-keys list \
  --filter="displayName:MIA Logistics Maps API Key" \
  --format="value(name)")

# Restrict key
gcloud alpha services api-keys update $API_KEY \
  --api-target=maps-backend.googleapis.com \
  --api-target=places-backend.googleapis.com \
  --api-target=directions-backend.googleapis.com
```

---

## 📋 Bước 8: Tạo Google Sheets Database

1. Truy cập: https://sheets.google.com
2. Tạo spreadsheet mới: "MIA Logistics Database"
3. Copy Spreadsheet ID từ URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```
4. Share với Service Account:
   - Click "Share" button
   - Add email từ Step 5 (SA_EMAIL)
   - Set permission: "Editor"
   - Click "Share"

---

## 📋 Bước 9: Tạo Google Drive Folders

1. Truy cập: https://drive.google.com
2. Tạo folder: "MIA Logistics Files"
3. Create subfolders:
   - Transport Documents
   - Warehouse Images
   - Staff Documents
   - Partner Contracts
   - System Backups
4. Share main folder với Service Account (từ Step 5)
5. Copy Folder ID từ URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID
   ```

---

## 📋 Bước 10: Update Environment Variables

Tạo hoặc update file `.env`:

```bash
# Copy template
cp .env.example .env

# Edit file với thông tin từ các bước trên
nano .env
```

Fill in:

```bash
# Google Cloud
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_from_step_6
REACT_APP_GOOGLE_API_KEY=your_api_key_from_step_7

# Google Sheets
REACT_APP_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_from_step_8

# Google Drive
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=your_folder_id_from_step_9

# Service Account
GOOGLE_SERVICE_ACCOUNT_KEY=./credentials/service-account-key.json
```

---

## ✅ Checklist

- [ ] Bước 1: Đăng nhập gcloud
- [ ] Bước 2: Tạo project
- [ ] Bước 3: Enable billing
- [ ] Bước 4: Enable APIs
- [ ] Bước 5: Tạo Service Account
- [ ] Bước 6: Setup OAuth 2.0
- [ ] Bước 7: Tạo API Key
- [ ] Bước 8: Tạo Google Sheets
- [ ] Bước 9: Tạo Google Drive folders
- [ ] Bước 10: Update .env file

---

## 🎉 Hoàn thành!

Sau khi hoàn thành tất cả các bước, build lại project:

```bash
npm run build
```

Và deploy theo hướng dẫn trong `DEPLOYMENT_SUMMARY.md`.

---

## 📞 Help

Nếu gặp vấn đề:
1. Check logs: `gcloud logs read`
2. Verify APIs: `gcloud services list`
3. Test authentication: `gcloud auth list`
4. Review docs: `docs/GOOGLE_CLOUD_SETUP.md`
