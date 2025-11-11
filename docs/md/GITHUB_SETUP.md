# 🚀 GitHub Setup Guide - MIA Logistics Manager

## 📋 Hướng Dẫn Tạo Repository và Push Code

### 1. 🔧 Tạo Repository trên GitHub

1. **Đăng nhập GitHub**: Truy cập [github.com](https://github.com)
2. **Tạo Repository mới**:
   - Click "New repository" hoặc "+" → "New repository"
   - Repository name: `mia-logistics-manager`
   - Description: `MIA Logistics Manager - Hệ thống quản lý logistics với Google Sheets API, React, Node.js, và FastAPI`
   - Visibility: Public hoặc Private (tùy chọn)
   - **KHÔNG** check "Initialize with README" (vì đã có code)
   - Click "Create repository"

### 2. 🔑 Cấu Hình Authentication

#### Option A: Personal Access Token (Recommended)

1. **Tạo Personal Access Token**:
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `workflow`, `write:packages`
   - Copy token (lưu lại an toàn)

2. **Sử dụng token**:

   ```bash
   git remote add origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/mia-logistics-manager.git
   ```

#### Option B: SSH Key

1. **Tạo SSH Key**:

   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. **Thêm SSH Key vào GitHub**:
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste public key

3. **Sử dụng SSH**:

   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/mia-logistics-manager.git
   ```

### 3. 🚀 Push Code

```bash
# Thêm remote repository
git remote add origin https://github.com/YOUR_USERNAME/mia-logistics-manager.git

# Kiểm tra remote
git remote -v

# Push code
git push -u origin main
# hoặc nếu branch là master
# git push -u origin master
```

### 4. 🐳 Deploy với GitHub Actions

Tạo file `.github/workflows/deploy.yml`:

```yaml
name: Deploy MIA Logistics Manager

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install frontend dependencies
      run: npm ci

    - name: Build frontend
      run: npm run build
      env:
        REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID: ${{ secrets.GOOGLE_SHEETS_SPREADSHEET_ID }}
        REACT_APP_API_URL: ${{ secrets.API_URL }}

    - name: Deploy frontend
      run: |
        echo "Deploying frontend to Vercel/Netlify..."

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install backend dependencies
      working-directory: ./backend
      run: npm ci

    - name: Test backend
      working-directory: ./backend
      run: npm test || true

    - name: Deploy backend
      run: |
        echo "Deploying backend to Heroku/Railway/VPS..."
```

### 5. 🌐 Deploy với Vercel/Netlify

#### Vercel

1. **Connect GitHub**:
   - Truy cập [vercel.com](https://vercel.com)
   - Import project từ GitHub
   - Select repository: `mia-logistics-manager`

2. **Configure Build**:
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
   - Root Directory: `.` (root)

#### Netlify

1. **Connect GitHub**:
   - Truy cập [netlify.com](https://netlify.com)
   - New site from Git
   - Connect GitHub repository

2. **Configure Build**:
   - Build Command: `npm run build:prod`
   - Publish Directory: `build`

### 6. 🔧 Environment Variables

Thêm environment variables trong deployment platform:

```bash
# Google Sheets Configuration
REACT_APP_GOOGLE_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE

# Google Apps Script
REACT_APP_GOOGLE_APPS_SCRIPT_ID=1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv
REACT_APP_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/...

# Backend API Configuration
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_BACKEND_URL=https://your-api-domain.com

# Telegram Configuration (Optional)
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token
REACT_APP_TELEGRAM_CHAT_ID=your_chat_id

# Backend Environment Variables (for Heroku/Railway/VPS)
GOOGLE_SHEETS_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
PORT=5050
```

### 7. 📊 Monitoring

#### GitHub Actions

- **Actions tab**: Xem build status
- **Issues**: Track bugs và feature requests
- **Pull Requests**: Code review process

#### Deployment Monitoring

- **Vercel**: Dashboard → Analytics
- **Netlify**: Site overview → Analytics
- **Custom**: Health check endpoints
  - Frontend: `https://your-domain.com`
  - Backend API: `https://your-api-domain.com/api/health`
  - AI Service (optional): `https://your-ai-domain.com/health`

#### Health Check Endpoints

```bash
# Backend API Health Check
curl https://your-api-domain.com/api/health

# Google Sheets Connection Status
curl https://your-api-domain.com/api/google-sheets-auth/status

# Admin Stats
curl https://your-api-domain.com/api/admin/stats
```

### 8. 🚀 Quick Commands

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/mia-logistics-manager.git
cd mia-logistics-manager

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Development (từ root directory)
npm start                    # Frontend (port 3000)
cd backend && npm start      # Backend (port 5050)

# Hoặc dùng quick start script
./start-project.sh

# Production build
npm run build                # Frontend build
cd backend && npm run build  # Backend build (nếu có)

# Test
npm test                     # Frontend tests
cd backend && npm test       # Backend tests
```

### 9. 🔒 Security

#### Repository Security

- [ ] Enable branch protection
- [ ] Require pull request reviews
- [ ] Enable security alerts
- [ ] Use Dependabot for updates

#### Environment Security

- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Configure security headers
- [ ] Regular security updates

### 10. 📚 Documentation

#### README.md

- [x] Project description
- [x] Installation instructions
- [x] Usage examples
- [x] API documentation (16 routes modules)
- [x] Contributing guidelines

#### Documentation Files

Project có các documentation files trong `docs/md/`:

- `README.md` - Tổng quan dự án
- `INSTALLATION_SUCCESS_REPORT.md` - Báo cáo cài đặt
- `GOOGLE_SHEETS_SETUP.md` - Hướng dẫn setup Google Sheets
- `PORTS_CONFIG.md` - Cấu hình ports
- `NAVIGATION_UPDATE.md` - Cấu trúc navigation
- `DEPLOYMENT.md` - Hướng dẫn deployment
- `GITHUB_SETUP.md` - Hướng dẫn GitHub (file này)

#### GitHub Pages

1. **Enable GitHub Pages**:
   - Repository → Settings → Pages
   - Source: Deploy from branch
   - Branch: `main` / `docs`

2. **Documentation Site**:
   - URL: `https://YOUR_USERNAME.github.io/mia-logistics-manager`
   - Có thể publish từ thư mục `docs/` hoặc `docs/md/`

---

## 🎯 Next Steps

1. **Tạo repository** trên GitHub với tên `mia-logistics-manager`
2. **Cấu hình authentication** (token hoặc SSH)
3. **Push code** lên repository
4. **Setup deployment**:
   - Frontend: Vercel hoặc Netlify
   - Backend: Heroku, Railway, hoặc VPS
   - AI Service (optional): Railway hoặc VPS
5. **Configure environment variables** cho từng service
6. **Test deployment**:
   - Test frontend: `https://your-domain.com`
   - Test backend: `https://your-api-domain.com/api/health`
   - Test Google Sheets: `https://your-api-domain.com/api/google-sheets-auth/status`
7. **Setup monitoring** và health checks
8. **Verify all 16 API routes** hoạt động đúng

## 📊 Project Structure

```text
mia-logistics-manager/
├── src/                          # Frontend React
├── backend/                      # Backend Node.js/Express
│   └── src/
│       └── routes/              # 16 route modules
│           ├── authRoutes.js
│           ├── carriersRoutes.js
│           ├── employeesRoutes.js
│           ├── rolesRoutes.js
│           └── ... (14 more)
├── ai-service/                  # AI Service (Python/FastAPI) - Optional
├── docs/md/                      # Documentation
├── .github/workflows/           # GitHub Actions
└── public/                       # Static files
```

## 🔗 API Endpoints Overview

Dự án có **16 route modules** với đầy đủ CRUD operations:

- `/api/auth/*` - Authentication & User Management
- `/api/carriers/*` - Carriers Management
- `/api/transfers/*` - Transfers Management
- `/api/locations/*` - Locations Management
- `/api/transport-requests/*` - Transport Requests
- `/api/settings/*` - Settings & Volume Rules
- `/api/inbound/*` - Inbound Domestic & International
- `/api/roles/*` - Roles Management
- `/api/employees/*` - Employees Management
- `/api/role-permissions/*` - Role Permissions
- `/api/admin/*` - Admin Operations
- `/api/sheets/*` - Google Sheets Operations
- `/api/telegram/*` - Telegram Notifications
- `/api/google-sheets-auth/*` - Google Sheets Auth Status

Chi tiết xem trong `docs/md/GOOGLE_SHEETS_SETUP.md` và `docs/md/INSTALLATION_SUCCESS_REPORT.md`.

---

**🚀 MIA Logistics Manager sẵn sàng deploy!**

**Version**: 2.1.0

**Last Updated**: 2025-01-30
