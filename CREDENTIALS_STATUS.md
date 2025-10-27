# 🔑 MIA Logistics Manager - Credentials Status

**Last Updated**: 27 October 2024

---

## ✅ Đã có

### Google Sheets
- **Spreadsheet ID**: `1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k`
- **URL**: https://docs.google.com/spreadsheets/d/1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k
- **Status**: ✅ Created

### Google Drive
- **Folder ID**: `1Cui_Q093hMzmDaAte7PdB_gPB42u2ijq`
- **URL**: https://drive.google.com/drive/folders/1Cui_Q093hMzmDaAte7PdB_gPB42u2ijq
- **Status**: ✅ Created

### Service Account
- **Email**: `mia-logistics-service@mia-logistics-469406.iam.gserviceaccount.com`
- **Key**: `credentials/service-account-key.json`
- **Status**: ✅ Downloaded

---

## ⏳ Cần có (Console UI)

### OAuth 2.0 Credentials
- [ ] Client ID: `______________________`
- [ ] Client Secret: `______________________`

**Console**: https://console.cloud.google.com/apis/credentials?project=mia-logistics-469406

### API Key
- [ ] Maps API Key: `______________________`

**Console**: https://console.cloud.google.com/apis/credentials?project=mia-logistics-469406

---

## 📋 Update .env File

Sau khi có OAuth Client ID, Secret, và API Key, update file `.env`:

```bash
# Google Sheets Configuration
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k
SHEET_ID=1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k
ACTIVE_SPREADSHEET_ID=1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k

# Google Drive Configuration
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=1Cui_Q093hMzmDaAte7PdB_gPB42u2ijq

# Service Account
GOOGLE_SERVICE_ACCOUNT_KEY=./credentials/service-account-key.json
SERVICE_ACCOUNT_PATH=./credentials/service-account-key.json

# OAuth (need to add)
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
REACT_APP_GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET

# API Key (need to add)
REACT_APP_GOOGLE_API_KEY=YOUR_API_KEY

# Environment
NODE_ENV=development
PORT=5050
REACT_APP_API_URL=http://localhost:3000
```

---

## ✅ Next Steps

1. **Share Spreadsheet** với Service Account
   - Email: `mia-logistics-service@mia-logistics-469406.iam.gserviceaccount.com`
   - Permission: Editor

2. **Share Drive Folder** với Service Account
   - Same email as above
   - Permission: Editor

3. **Create OAuth credentials** (Console UI)
   - Follow: `FINAL_STEPS.md` Step 6

4. **Create API Key** (Console UI)
   - Follow: `FINAL_STEPS.md` Step 7

5. **Update .env file** với all credentials

6. **Test**: `npm start`

---

## 🔗 Quick Links

- **Spreadsheet**: https://docs.google.com/spreadsheets/d/1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k
- **Drive Folder**: https://drive.google.com/drive/folders/1Cui_Q093hMzmDaAte7PdB_gPB42u2ijq
- **Console**: https://console.cloud.google.com/?project=mia-logistics-469406
