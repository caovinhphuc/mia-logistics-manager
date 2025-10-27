# 🚀 MIA Logistics Manager - Deployment Checklist

## Tổng quan

File này liệt kê tất cả các bước cần thiết để triển khai MIA Logistics Manager lên môi trường production.

**Thời gian ước tính**: 2-4 giờ
**Yêu cầu**: Google Cloud Platform account có billing enabled

---

## 📋 Pre-Deployment (Trước khi triển khai)

### 1. Google Cloud Platform Setup

- [ ] **Tạo Google Cloud Project**
  ```bash
  gcloud projects create mia-logistics-prod --name="MIA Logistics Production"
  gcloud config set project mia-logistics-prod
  ```

- [ ] **Enable Billing**
  - Truy cập: https://console.cloud.google.com/billing
  - Link billing account với project

- [ ] **Install gcloud CLI** (nếu chưa có)
  ```bash
  # macOS
  brew install google-cloud-sdk

  # Login
  gcloud auth login
  gcloud auth application-default login
  ```

### 2. Enable Required APIs

```bash
# Chạy tất cả lệnh sau:
gcloud services enable sheets.googleapis.com
gcloud services enable drive.googleapis.com
gcloud services enable script.googleapis.com
gcloud services enable maps-backend.googleapis.com
gcloud services enable places-backend.googleapis.com
gcloud services enable directions-backend.googleapis.com
gcloud services enable distance-matrix-backend.googleapis.com
gcloud services enable geocoding-backend.googleapis.com
gcloud services enable geolocation.googleapis.com
```

- [ ] Sheets API enabled
- [ ] Drive API enabled
- [ ] Apps Script API enabled
- [ ] Maps JavaScript API enabled
- [ ] Places API enabled
- [ ] Directions API enabled
- [ ] Distance Matrix API enabled
- [ ] Geocoding API enabled
- [ ] Geolocation API enabled

### 3. Service Account

- [ ] **Tạo Service Account**
  ```bash
  gcloud iam service-accounts create mia-logistics-service \
    --display-name="MIA Logistics Service Account"
  ```

- [ ] **Lấy Service Account Email**
  ```bash
  SA_EMAIL=$(gcloud iam service-accounts list \
    --filter="displayName:MIA Logistics Service Account" \
    --format="value(email)")
  echo $SA_EMAIL
  ```

- [ ] **Grant Roles**
  ```bash
  gcloud projects add-iam-policy-binding mia-logistics-prod \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/sheets.editor"

  gcloud projects add-iam-policy-binding mia-logistics-prod \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/drive.file"

  gcloud projects add-iam-policy-binding mia-logistics-prod \
    --member="serviceAccount:$SA_EMAIL" \
    --role="roles/script.developer"
  ```

- [ ] **Download Key**
  ```bash
  mkdir -p credentials
  gcloud iam service-accounts keys create credentials/service-account-key.json \
    --iam-account=$SA_EMAIL
  ```

### 4. OAuth 2.0 Setup

- [ ] **Tạo OAuth 2.0 Client ID** (qua Console UI)
  - Truy cập: https://console.cloud.google.com/apis/credentials
  - Create Credentials > OAuth 2.0 Client ID
  - Type: Web application
  - Authorized origins:
    - `http://localhost:3000` (dev)
    - `https://yourdomain.com` (prod)
  - Redirect URIs:
    - `http://localhost:3000/auth/google/callback`
    - `https://yourdomain.com/auth/google/callback`

- [ ] **Lưu Client ID và Client Secret**

### 5. API Key Configuration

- [ ] **Tạo API Key cho Maps**
  ```bash
  gcloud alpha services api-keys create \
    --display-name="MIA Logistics Maps API Key"
  ```

- [ ] **Get API Key**
  ```bash
  API_KEY=$(gcloud alpha services api-keys list \
    --filter="displayName:MIA Logistics Maps API Key" \
    --format="value(name)")
  ```

- [ ] **Restrict API Key**
  ```bash
  gcloud alpha services api-keys update $API_KEY \
    --api-target=maps-backend.googleapis.com \
    --api-target=places-backend.googleapis.com \
    --api-target=directions-backend.googleapis.com \
    --allowed-referrers="https://yourdomain.com/*"
  ```

- [ ] **Lưu API Key để sử dụng**

---

## 📊 Google Sheets Setup

### 1. Create Spreadsheet

- [ ] **Tạo Spreadsheet mới**: "MIA Logistics Database"
- [ ] **Copy Spreadsheet ID từ URL**

### 2. Create Sheets

- [ ] **Transport_Requests** (54 columns)
- [ ] **Warehouse_Inventory** (67 columns)
- [ ] **Staff_Management** (48 columns)
- [ ] **Partners_Data** (92 columns)
- [ ] **System_Logs** (9 columns)

### 3. Setup Headers

- [ ] Input headers cho tất cả sheets
- [ ] Format headers (bold, background color)
- [ ] Freeze header row

### 4. Data Validation

- [ ] Setup data validation cho Status columns
- [ ] Setup dropdown lists
- [ ] Setup date formats

### 5. Conditional Formatting

- [ ] Color code status columns
- [ ] Highlight important fields

### 6. Share with Service Account

- [ ] Click Share button trên Spreadsheet
- [ ] Add Service Account email (từ bước 3)
- [ ] Grant "Editor" permission

---

## 🗂️ Google Drive Setup

### 1. Create Folder Structure

- [ ] **Main folder**: "MIA Logistics Files"
- [ ] Subfolders:
  - [ ] Transport Documents
  - [ ] Warehouse Images
  - [ ] Staff Documents
  - [ ] Partner Contracts
  - [ ] System Backups
  - [ ] Invoice Templates
  - [ ] Reports Archive
  - [ ] Vehicle Documents
  - [ ] Insurance Papers
  - [ ] Compliance Records

### 2. Share Folders

- [ ] Share main folder với Service Account
- [ ] Grant "Editor" permission
- [ ] Copy Folder ID

---

## 📱 Google Apps Script

### 1. Create Apps Script Project

- [ ] Truy cập: https://script.google.com
- [ ] Tạo project mới: "MIA Logistics Scripts"
- [ ] Copy code từ `google-apps-script/Code.gs`

### 2. Deploy Web App

- [ ] Click Deploy > New Deployment
- [ ] Type: Web App
- [ ] Execute as: Me
- [ ] Access: Anyone (hoặc specific users)
- [ ] Copy Web App URL

### 3. Setup Triggers

- [ ] Daily backup trigger (2 AM)
- [ ] Hourly data sync trigger

---

## 🔧 Environment Configuration

### 1. Create .env File

- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all variables:

```bash
# Google Cloud
REACT_APP_GOOGLE_CLIENT_ID=your_client_id
REACT_APP_GOOGLE_API_KEY=your_api_key

# Google Sheets
REACT_APP_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id

# Google Drive
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# Apps Script
REACT_APP_GOOGLE_APPS_SCRIPT_ID=your_script_id
REACT_APP_GOOGLE_APPS_SCRIPT_URL=your_web_app_url

# Service Account
GOOGLE_SERVICE_ACCOUNT_KEY=./credentials/service-account-key.json

# API Base URL
REACT_APP_API_URL=https://yourdomain.com/api
```

### 2. Update Configuration Files

- [ ] Update `src/config/google.js` with real IDs
- [ ] Update `config/google.js` if exists
- [ ] Update `google-apps-script/Code.gs` with spreadsheet ID

---

## 🚀 Build and Deploy

### 1. Local Build Test

- [ ] Test local build
  ```bash
  npm run build
  ```

- [ ] Check build output
  ```bash
  ls -la build/
  ```

- [ ] Test production build locally
  ```bash
  serve -s build -l 3000
  ```

### 2. Deployment Options

**Option A: Firebase Hosting**
- [ ] Install Firebase CLI
  ```bash
  npm install -g firebase-tools
  ```
- [ ] Login to Firebase
  ```bash
  firebase login
  ```
- [ ] Initialize Firebase
  ```bash
  firebase init
  ```
- [ ] Deploy
  ```bash
  npm run build
  firebase deploy
  ```

**Option B: Netlify**
- [ ] Install Netlify CLI
  ```bash
  npm install -g netlify-cli
  ```
- [ ] Login
  ```bash
  netlify login
  ```
- [ ] Deploy
  ```bash
  npm run build
  netlify deploy --prod
  ```

**Option C: Manual Upload**
- [ ] Create build
  ```bash
  npm run build
  ```
- [ ] Create archive
  ```bash
  tar -czf mia-logistics-build.tar.gz build/
  ```
- [ ] Upload to server
- [ ] Extract and configure web server

---

## ✅ Post-Deployment (Sau khi triển khai)

### 1. Testing

- [ ] Test homepage loads
- [ ] Test Google authentication
- [ ] Test Google Sheets integration
- [ ] Test Google Drive upload
- [ ] Test Maps functionality
- [ ] Test all CRUD operations

### 2. Monitoring

- [ ] Setup Cloud Monitoring
- [ ] Create alert policies
- [ ] Setup email notifications
- [ ] Monitor API quota usage

### 3. Security

- [ ] Enable HTTPS
- [ ] Setup CORS properly
- [ ] Review API key restrictions
- [ ] Audit service account permissions

### 4. Backup

- [ ] Setup automatic backups
- [ ] Test backup restoration
- [ ] Document backup procedures

---

## 🔍 Troubleshooting Checklist

If deployment fails, check:

- [ ] Billing enabled on GCP project
- [ ] All APIs enabled
- [ ] Service account has correct permissions
- [ ] OAuth redirect URIs correct
- [ ] API key restrictions not blocking
- [ ] CORS configured correctly
- [ ] Environment variables set correctly
- [ ] Service account key file exists
- [ ] Google Sheets shared with service account
- [ ] Google Drive folder shared with service account

---

## 📞 Support

Nếu gặp vấn đề:

1. Check logs trong Google Cloud Console
2. Review `docs/GOOGLE_CLOUD_SETUP.md`
3. Review troubleshooting section trong tài liệu
4. Contact support: support@mialogistics.com

---

## ✅ Deployment Sign-off

- [ ] Tất cả bước trên đã hoàn thành
- [ ] Production environment tested
- [ ] Monitoring setup complete
- [ ] Team trained on new deployment
- [ ] Documentation updated
- [ ] Backup procedures tested

**Deployed by**: ___________________
**Date**: ___________________
**Version**: 1.0.0
