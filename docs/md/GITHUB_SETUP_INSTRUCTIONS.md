# 🚀 GitHub Setup Instructions - MIA Logistics Manager

## Bước 1: Tạo GitHub Repository

1. Truy cập <https://github.com/new>
2. Tạo repository mới với thông tin:
   - **Repository name**: `mia-logistics-manager`
   - **Description**: `MIA Logistics Manager - Hệ thống quản lý logistics với Google Sheets API, React, Node.js, và FastAPI`
   - **Visibility**: Public hoặc Private (tuỳ chọn)
   - ⚠️ **KHÔNG** check "Initialize this repository with README"

## Bước 2: Kết nối Local Repository

Sau khi tạo GitHub repo, chạy các lệnh sau trong terminal:

```bash
# Kiểm tra git status
git status

# Thêm remote origin (thay YOUR_USERNAME bằng GitHub username của bạn)
git remote add origin https://github.com/YOUR_USERNAME/mia-logistics-manager.git

# Hoặc nếu đã có remote, update:
git remote set-url origin https://github.com/YOUR_USERNAME/mia-logistics-manager.git

# Kiểm tra remote
git remote -v

# Add và commit nếu chưa có
git add .
git commit -m "Initial commit: MIA Logistics Manager"

# Push code lên GitHub
git push -u origin main
# hoặc nếu branch là master
# git push -u origin master
```

## Bước 3: Deploy Frontend lên Vercel

### Option A: Deploy từ GitHub (Recommended)

1. Truy cập <https://vercel.com>
2. Click "New Project"
3. Import từ GitHub repo `mia-logistics-manager`
4. Vercel sẽ tự động detect React app
5. **Configure Build Settings**:
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Root Directory: `.` (root)
6. Click "Deploy"

### Option B: Deploy từ CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set production deployment
vercel --prod
```

## Bước 3b: Deploy Backend

Backend cần deploy riêng trên Heroku, Railway, hoặc VPS:

### Heroku

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create mia-logistics-backend

# Set environment variables
heroku config:set GOOGLE_SHEETS_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
heroku config:set PORT=5050

# Deploy
git push heroku main
```

### Railway

1. Truy cập <https://railway.app>
2. New Project → Deploy from GitHub repo
3. Select `mia-logistics-manager`
4. Set root directory: `backend`
5. Configure environment variables

### VPS (Ubuntu/Debian)

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Clone repository
git clone https://github.com/YOUR_USERNAME/mia-logistics-manager.git
cd mia-logistics-manager/backend

# Install dependencies
npm install

# Setup PM2 hoặc systemd
npm install -g pm2
pm2 start index.js --name mia-backend
pm2 save
pm2 startup
```

## Bước 4: Configure Environment Variables

### Frontend (Vercel/Netlify)

Trong Vercel/Netlify dashboard, thêm các Environment Variables:

```bash
# Google Sheets Configuration
REACT_APP_GOOGLE_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE

# Google Apps Script
REACT_APP_GOOGLE_APPS_SCRIPT_ID=1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv
REACT_APP_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/...

# Backend API URL
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_BACKEND_URL=https://your-backend-domain.com

# Telegram (Optional)
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token
REACT_APP_TELEGRAM_CHAT_ID=your_chat_id
```

### Backend (Heroku/Railway/VPS)

```bash
# Google Sheets
GOOGLE_SHEETS_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json

# Backend Port
PORT=5050

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

**Lưu ý**: Service account JSON file cần được upload hoặc configure riêng trên deployment platform.

## 🎯 Next Steps After Deployment

1. **Test Production Build**:
   - Frontend: Verify tất cả pages load đúng
   - Backend: Test API endpoints `/api/health`
   - Google Sheets: Test `/api/google-sheets-auth/status`

2. **Verify API Routes**: Test các routes chính:

   ```bash
   curl https://your-backend-domain.com/api/health
   curl https://your-backend-domain.com/api/carriers
   curl https://your-backend-domain.com/api/auth/login
   ```

3. **Monitor Performance**: Check Lighthouse scores cho frontend

4. **Setup Analytics**: Add Google Analytics nếu cần

5. **Custom Domain**: Add custom domain nếu desired

6. **Health Checks**: Setup monitoring cho backend API

## 📋 Deployment Checklist

### 1. Repository Setup

- [ ] Code committed to GitHub
- [ ] Repository `mia-logistics-manager` created
- [ ] Remote origin configured
- [ ] Code pushed to main branch

### 2. Frontend Deployment

- [ ] Deployed to Vercel/Netlify
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Frontend accessible tại production URL

### 3. Backend Deployment

- [ ] Backend deployed (Heroku/Railway/VPS)
- [ ] Environment variables configured
- [ ] Service account JSON file configured
- [ ] Backend accessible tại production URL
- [ ] Health check endpoint working: `/api/health`

### 4. Testing & Verification

- [ ] Frontend pages load correctly
- [ ] Backend API responses correctly
- [ ] Google Sheets connection working
- [ ] Authentication endpoints working
- [ ] All 16 API routes tested

### 5. Documentation

- [ ] README.md updated
- [ ] API documentation available
- [ ] Deployment guide complete

---
**Current Status**: ✅ Ready for GitHub repository creation

**Version**: 2.1.0

**Routes Status**: ✅ 16/16 routes đã được triển khai đầy đủ
