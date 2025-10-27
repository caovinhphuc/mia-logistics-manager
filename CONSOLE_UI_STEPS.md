# 🔧 Google Cloud Console UI - Steps 6-10

**Project**: mia-logistics-469406
**Project URL**: https://console.cloud.google.com/?project=mia-logistics-469406

---

## Step 6: OAuth 2.0 Configuration

### 6.1 Tạo OAuth Consent Screen

1. Truy cập: https://console.cloud.google.com/apis/credentials/consent?project=mia-logistics-469406

2. Chọn **External** (hoặc Internal nếu dùng Google Workspace)

3. Fill in:
   - **App name**: MIA Logistics Manager
   - **User support email**: kho.1@mia.vn
   - **Developer contact email**: kho.1@mia.vn

4. Click **Save and Continue**

5. **Scopes**: Skip for now, click **Save and Continue**

6. **Test users**: Add test users if needed, click **Save and Continue**

7. **Summary**: Review and click **Back to Dashboard**

### 6.2 Tạo OAuth 2.0 Client ID

1. Truy cập: https://console.cloud.google.com/apis/credentials?project=mia-logistics-469406

2. Click **+ CREATE CREDENTIALS** > **OAuth 2.0 Client ID**

3. **Application type**: Web application

4. **Name**: MIA Logistics OAuth Client

5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```

6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/google/callback
   ```

7. Click **CREATE**

8. **QUAN TRỌNG**: Copy và lưu:
   - Client ID: `______________________`
   - Client Secret: `______________________`

---

## Step 7: API Key for Maps

### 7.1 Tạo API Key

1. Truy cập: https://console.cloud.google.com/apis/credentials?project=mia-logistics-469406

2. Click **+ CREATE CREDENTIALS** > **API Key**

3. Copy API Key ngay

4. Click **RESTRICT KEY** để cấu hình

5. **Application restrictions**: HTTP referrers (web sites)
   ```
   http://localhost:3000/*
   https://*.yourdomain.com/*
   ```

6. **API restrictions**: Restrict key
   - Select APIs:
     - Maps JavaScript API
     - Places API
     - Directions API
     - Distance Matrix API
     - Geocoding API

7. Click **SAVE**

8. **QUAN TRỌNG**: Copy và lưu API Key: `______________________`

---

## Step 8: Google Sheets Setup

### 8.1 Tạo Spreadsheet

1. Truy cập: https://sheets.google.com

2. Click **Blank** để tạo spreadsheet mới

3. Đổi tên: Click "Untitled spreadsheet" > **MIA Logistics Database**

4. **Copy Spreadsheet ID** từ URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
   ```

5. Lưu Spreadsheet ID: `______________________`

### 8.2 Tạo Sheets

Tạo các sheets sau bằng cách click **+** ở bottom:
- Transport_Requests
- Warehouse_Inventory
- Staff_Management
- Partners_Data
- System_Logs

### 8.3 Share với Service Account

1. Click **Share** button (top right)

2. Add email: `mia-logistics-service@mia-logistics-469406.iam.gserviceaccount.com`

3. Set permission: **Editor**

4. Click **Share**

---

## Step 9: Google Drive Setup

### 9.1 Tạo Folder Structure

1. Truy cập: https://drive.google.com

2. Click **New** > **Folder**

3. Name: **MIA Logistics Files**

4. **Copy Folder ID** từ URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID
   ```

5. Lưu Folder ID: `______________________`

### 9.2 Tạo Subfolders

Trong folder "MIA Logistics Files", tạo:
- Transport Documents
- Warehouse Images
- Staff Documents
- Partner Contracts
- System Backups
- Invoice Templates
- Reports Archive
- Vehicle Documents
- Insurance Papers
- Compliance Records

### 9.3 Share với Service Account

1. Right-click "MIA Logistics Files" folder

2. Click **Share**

3. Add email: `mia-logistics-service@mia-logistics-469406.iam.gserviceaccount.com`

4. Set permission: **Editor**

5. Click **Share**

---

## Step 10: Environment Variables

### 10.1 Tạo .env File

1. Navigate to project directory:
   ```bash
   cd /Users/phuccao/Desktop/mia-logistics-manager
   ```

2. Create `.env` file:
   ```bash
   nano .env
   ```

3. Add following content (replace with your values):

```bash
# Google Cloud Configuration
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_FROM_STEP_6
REACT_APP_GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_FROM_STEP_6
REACT_APP_GOOGLE_API_KEY=YOUR_API_KEY_FROM_STEP_7

# Google Sheets Configuration
REACT_APP_GOOGLE_SPREADSHEET_ID=YOUR_SPREADSHEET_ID_FROM_STEP_8

# Google Drive Configuration
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=YOUR_FOLDER_ID_FROM_STEP_9

# Service Account
GOOGLE_SERVICE_ACCOUNT_KEY=./credentials/service-account-key.json

# Environment
NODE_ENV=production

# API Configuration
REACT_APP_API_URL=http://localhost:3000
```

4. Save and exit (Ctrl+X, Y, Enter)

5. Verify file exists:
   ```bash
   cat .env
   ```

---

## ✅ Verification

Sau khi hoàn thành tất cả steps, verify:

```bash
# Check .env file
cat .env

# Check service account key
ls -la credentials/service-account-key.json

# Check build
npm run build
```

---

## 🎉 Complete!

Sau khi hoàn thành Steps 6-10, project đã ready để:

1. **Test locally**:
   ```bash
   npm start
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

3. **Deploy** (theo `DEPLOYMENT_SUMMARY.md`)

---

## 📝 Checklist

- [ ] Step 6: OAuth 2.0 Client ID created
- [ ] Step 6: Client ID and Secret saved
- [ ] Step 7: API Key created and restricted
- [ ] Step 7: API Key saved
- [ ] Step 8: Google Sheets created
- [ ] Step 8: Spreadsheet ID saved
- [ ] Step 8: Shared with Service Account
- [ ] Step 9: Drive folders created
- [ ] Step 9: Folder ID saved
- [ ] Step 9: Shared with Service Account
- [ ] Step 10: .env file created
- [ ] Step 10: All credentials added to .env
- [ ] Verification completed

---

**Next**: Build and deploy ứng dụng!
