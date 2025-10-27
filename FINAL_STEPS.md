# 🎯 Final Steps - Quick Guide

## ⚡ Cách nhanh nhất để hoàn thành

### Option 1: Sử dụng Setup Script (Recommended)

```bash
cd /Users/phuccao/Desktop/mia-logistics-manager

# Make script executable
chmod +x setup-env.sh

# Run setup script
./setup-env.sh
```

Script sẽ hỏi bạn từng thông tin cần thiết từ Google Cloud Console.

---

### Option 2: Tạo .env file thủ công

1. Tạo file `.env` trong project root

2. Copy nội dung sau và điền thông tin:

```bash
# Google Cloud Configuration
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
REACT_APP_GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
REACT_APP_GOOGLE_API_KEY=YOUR_API_KEY

# Google Sheets Configuration
REACT_APP_GOOGLE_SPREADSHEET_ID=YOUR_SPREADSHEET_ID

# Google Drive Configuration
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=YOUR_FOLDER_ID

# Service Account
GOOGLE_SERVICE_ACCOUNT_KEY=./credentials/service-account-key.json

# Environment
NODE_ENV=development

# API Configuration
REACT_APP_API_URL=http://localhost:3000
```

---

## 📋 Lấy thông tin từ Google Cloud Console

### Step 6: OAuth Client ID & Secret

1. **Console**: https://console.cloud.google.com/apis/credentials?project=mia-logistics-469406

2. Click **+ CREATE CREDENTIALS** > **OAuth 2.0 Client ID**

3. Chọn **Web application**

4. Điền thông tin:
   - Name: MIA Logistics OAuth Client
   - Authorized origins: `http://localhost:3000`
   - Redirect URIs: `http://localhost:3000/auth/google/callback`

5. Click **CREATE**

6. **Copy**: Client ID và Client Secret

---

### Step 7: API Key

1. **Console**: https://console.cloud.google.com/apis/credentials?project=mia-logistics-469406

2. Click **+ CREATE CREDENTIALS** > **API Key**

3. **Copy** API Key

4. Click **RESTRICT KEY**

5. Select APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Distance Matrix API
   - Geocoding API

6. **Save**

---

### Step 8: Google Sheets Spreadsheet ID

1. Tạo spreadsheet: https://sheets.google.com

2. Tên: **MIA Logistics Database**

3. Copy ID từ URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
                                                       ^^^^^^^^^^^
                                                        Copy this
   ```

4. Share với: `mia-logistics-service@mia-logistics-469406.iam.gserviceaccount.com`
   - Permission: Editor

---

### Step 9: Google Drive Folder ID

1. Tạo folder: https://drive.google.com

2. Tên: **MIA Logistics Files**

3. Copy ID từ URL:
   ```
   https://drive.google.com/drive/folders/FOLDER_ID
                                             ^^^^^^^^^
                                             Copy this
   ```

4. Share với: `mia-logistics-service@mia-logistics-469406.iam.gserviceaccount.com`
   - Permission: Editor

---

## ✅ Sau khi có đầy đủ thông tin

### 1. Chạy setup script hoặc tạo .env thủ công

```bash
cd /Users/phuccao/Desktop/mia-logistics-manager
./setup-env.sh
```

### 2. Verify .env file

```bash
cat .env
```

### 3. Test locally

```bash
npm start
```

Visit: http://localhost:3000

### 4. Build for production

```bash
npm run build
```

### 5. Deploy

Xem `DEPLOYMENT_SUMMARY.md` cho các options deployment.

---

## 🆘 Troubleshooting

### Lỗi authentication

- Check OAuth Client ID và Secret trong .env
- Verify redirect URIs trong OAuth config

### Lỗi API

- Check API Key đã restrict đúng chưa
- Verify APIs đã enable

### Lỗi permission

- Check Service Account đã được share
- Verify permissions cho Sheets và Drive

---

## 📞 Quick Links

- **Google Cloud Console**: https://console.cloud.google.com/?project=mia-logistics-469406
- **Credentials**: https://console.cloud.google.com/apis/credentials?project=mia-logistics-469406
- **Sheets**: https://sheets.google.com
- **Drive**: https://drive.google.com

---

**Happy coding! 🚀**
