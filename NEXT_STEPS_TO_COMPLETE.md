# 🎯 Final Steps to Complete Setup

**Status**: 90% Complete
**Remaining**: OAuth & API Key (5-10 minutes)

---

## ✅ Đã hoàn thành

### Infrastructure (100%)
- ✅ gcloud CLI installed
- ✅ Google Cloud authenticated
- ✅ 9 APIs enabled
- ✅ Service Account created

### Resources (100%)
- ✅ Google Sheets created
  - ID: `1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k`
  - URL: https://docs.google.com/spreadsheets/d/1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k

- ✅ Drive Folder created
  - ID: `1Cui_Q093hMzmDaAte7PdB_gPB42u2ijq`
  - URL: https://drive.google.com/drive/folders/1Cui_Q093hMzmDaAte7PdB_gPB42u2ijq

### Configuration (70%)
- ✅ .env file updated with current credentials
- ✅ Service Account key downloaded
- ⏳ OAuth credentials (need from Console UI)
- ⏳ API Key (need from Console UI)

---

## ⏳ Còn lại (5-10 phút)

### 1. Share với Service Account (1 phút)

**Google Sheets:**
1. Open: https://docs.google.com/spreadsheets/d/1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k
2. Click **Share** (top right)
3. Add: `mia-logistics-service@mia-logistics-469406.iam.gserviceaccount.com`
4. Permission: **Editor**
5. Click **Share**

**Google Drive:**
1. Open: https://drive.google.com/drive/folders/1Cui_Q093hMzmDaAte7PdB_gPB42u2ijq
2. Click **Share** (top right)
3. Add: `mia-logistics-service@mia-logistics-469406.iam.gserviceaccount.com`
4. Permission: **Editor**
5. Click **Share**

---

### 2. Create OAuth 2.0 (2-3 phút)

1. Go to: https://console.cloud.google.com/apis/credentials?project=mia-logistics-469406

2. Click **+ CREATE CREDENTIALS** > **OAuth 2.0 Client ID**

3. If first time, setup OAuth consent screen:
   - App name: MIA Logistics Manager
   - Support email: kho.1@mia.vn
   - Save and Continue

4. **Application type**: Web application

5. **Name**: MIA Logistics OAuth Client

6. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```

7. **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/google/callback
   ```

8. Click **CREATE**

9. **Copy**:
   - Client ID: `__________________`
   - Client Secret: `__________________`

---

### 3. Create API Key (2-3 phút)

1. Same Console: https://console.cloud.google.com/apis/credentials?project=mia-logistics-469406

2. Click **+ CREATE CREDENTIALS** > **API Key**

3. **Copy API key** immediately

4. Click **RESTRICT KEY**

5. **API restrictions**: Select only:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Distance Matrix API
   - Geocoding API

6. **Save**

7. **Copy API Key**: `__________________`

---

### 4. Update .env File (1 phút)

Open `.env` file and uncomment/fill in:

```bash
# OAuth 2.0
REACT_APP_GOOGLE_CLIENT_ID=<paste_client_id_here>
REACT_APP_GOOGLE_CLIENT_SECRET=<paste_client_secret_here>

# API Key
REACT_APP_GOOGLE_API_KEY=<paste_api_key_here>
```

Or run the update script again:
```bash
nano .env
```

---

### 5. Test (1 phút)

```bash
npm start
```

Visit: http://localhost:3000

---

## 🎉 Done!

After completing the above steps, you'll have:

✅ Fully configured application
✅ Google Sheets connected
✅ Google Drive connected
✅ OAuth authentication working
✅ Maps API working
✅ Ready for production deployment

---

## 📞 Quick Reference

**Service Account Email**:
`mia-logistics-service@mia-logistics-469406.iam.gserviceaccount.com`

**Spreadsheet**: https://docs.google.com/spreadsheets/d/1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k
**Drive Folder**: https://drive.google.com/drive/folders/1Cui_Q093hMzmDaAte7PdB_gPB42u2ijq
**Console**: https://console.cloud.google.com/?project=mia-logistics-469406

---

**Almost there! Just 2 more credentials to get! 🚀**
