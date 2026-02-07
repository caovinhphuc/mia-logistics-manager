# 🚀 DEPLOYMENT GUIDE - MIA LOGISTICS MANAGER

## 📋 Mục Lục

- [Cài Đặt Ban Đầu](#-cài-đặt-ban-đầu)
- [Development](#-development)
- [Production Build](#-production-build)
- [Deployment Options](#-deployment-options)
- [Troubleshooting](#-troubleshooting)

---

## 🔧 Cài Đặt Ban Đầu

### Yêu Cầu Hệ Thống

- Node.js >= 16.x
- npm >= 8.x
- Git

### Bước 1: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/mia-logistics-manager.git
cd mia-logistics-manager
```

### Bước 2: Cài Đặt Dependencies

```bash
npm install
```

### Bước 3: Cấu Hình Environment Variables

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong `.env` (root) và `backend/.env`:

**Root `.env` (Frontend):**

```env
# Google Sheets Configuration
REACT_APP_GOOGLE_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE

# Google Apps Script
REACT_APP_GOOGLE_APPS_SCRIPT_ID=1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv
REACT_APP_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/...

# Backend API URL
REACT_APP_API_URL=http://localhost:5050
REACT_APP_BACKEND_URL=http://localhost:5050

# Telegram (Optional)
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token
REACT_APP_TELEGRAM_CHAT_ID=your_chat_id

# Frontend Port
FRONTEND_PORT=3000
```

**Backend `backend/.env`:**

```env
# Google Sheets
GOOGLE_SHEETS_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
GOOGLE_APPLICATION_CREDENTIALS=./sinuous-aviary-474820-e3-c442968a0e87.json

# Backend Port
PORT=5050

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Email (Optional)
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=kho.1@mia.vn
```

---

## 💻 Development

### Chạy Development Server

```bash
npm start
# hoặc
npm run dev
```

App sẽ chạy tại: `http://localhost:3000`

### Chạy với Backend

```bash
# Option 1: Quick Start (Recommended - có Telegram notifications)
./start-project.sh

# Option 2: Simple Start
./start.sh

# Option 3: Manual Start

# Terminal 1 - Frontend
npm start
# Frontend sẽ chạy tại: http://localhost:3000

# Terminal 2 - Backend
cd backend
npm install
npm start
# Backend sẽ chạy tại: http://localhost:5050

# Terminal 3 - AI Service (Optional)
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main_simple:app --host 0.0.0.0 --port 8000 --reload
# AI Service sẽ chạy tại: http://localhost:8000
```

### Verify Services Running

```bash
# Frontend
curl http://localhost:3000

# Backend Health Check
curl http://localhost:5050/api/health

# Google Sheets Status
curl http://localhost:5050/api/google-sheets-auth/status

# AI Service Health (if running)
curl http://localhost:8000/health
```

---

## 📦 Production Build

### Build Production

```bash
npm run build
```

Output sẽ nằm trong thư mục `build/`

### Test Production Build Locally

```bash
npm run serve
```

### Build với Optimization

```bash
npm run build:prod
```

---

## 🌐 Deployment Options

### 1. Vercel (Khuyến nghị - Nhanh nhất)

#### Bước 1: Install Vercel CLI

```bash
npm install -g vercel
```

#### Bước 2: Deploy

```bash
vercel
```

#### Bước 3: Deploy Production

```bash
vercel --prod
```

**Environment Variables trên Vercel:**

- Vào Project Settings → Environment Variables
- Thêm tất cả biến từ `.env` (root):
  - `REACT_APP_GOOGLE_SPREADSHEET_ID`
  - `REACT_APP_GOOGLE_DRIVE_FOLDER_ID`
  - `REACT_APP_API_URL` (trỏ đến backend production URL)
  - `REACT_APP_BACKEND_URL`
  - `REACT_APP_TELEGRAM_BOT_TOKEN` (optional)
  - `REACT_APP_TELEGRAM_CHAT_ID` (optional)

**Custom Domain:**

- Vào Project Settings → Domains
- Thêm domain của bạn

---

### 2. Netlify

#### Option A: Deploy qua Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy

# Deploy production
netlify deploy --prod
```

#### Option B: Deploy qua Git (Recommended)

1. Push code lên GitHub
2. Vào [netlify.com](https://netlify.com)
3. New site from Git → Chọn repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Thêm Environment Variables trong Site Settings

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. GitHub Pages

#### Bước 1: Thêm homepage vào package.json

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/mia-logistics-manager"
}
```

#### Bước 2: Install gh-pages

```bash
npm install --save-dev gh-pages
```

#### Bước 3: Thêm scripts vào package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### Bước 4: Deploy

```bash
npm run deploy
```

---

### 4. Docker

#### Dockerfile

```dockerfile
# Multi-stage build cho MIA Logistics Manager
# Stage 1: Build Frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Backend
FROM node:18-alpine as backend-builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
COPY backend/sinuous-aviary-474820-e3-c442968a0e87.json ./

# Stage 3: Final image
FROM node:18-alpine
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/build ./build

# Copy backend
COPY --from=backend-builder /app ./backend

# Install serve for frontend
RUN npm install -g serve

# Install dependencies
RUN apk add --no-cache curl

EXPOSE 3000 5050

# Start both frontend and backend
CMD ["sh", "-c", "cd backend && node index.js & cd .. && serve -s build -l 3000"]
```

#### nginx.conf

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

#### Build & Run

```bash
# Build image
docker build -t mia-logistics-manager .

# Run container
docker run -p 3000:3000 -p 5050:5050 \
  -e REACT_APP_API_URL=http://localhost:5050 \
  -e GOOGLE_SHEETS_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As \
  mia-logistics-manager
```

#### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:5050
      - REACT_APP_BACKEND_URL=http://backend:5050
      - REACT_APP_GOOGLE_SPREADSHEET_ID=${GOOGLE_SPREADSHEET_ID}
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5050:5050"
    environment:
      - NODE_ENV=production
      - PORT=5050
      - GOOGLE_SHEETS_SPREADSHEET_ID=${GOOGLE_SHEETS_SPREADSHEET_ID}
      - GOOGLE_APPLICATION_CREDENTIALS=./sinuous-aviary-474820-e3-c442968a0e87.json
    volumes:
      - ./backend/sinous-aviary-474820-e3-c442968a0e87.json:/app/sinous-aviary-474820-e3-c442968a0e87.json

  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"
    environment:
      - AI_SERVICE_PORT=8000
    profiles:
      - ai  # Optional service, chỉ start khi cần
```

---

### 5. AWS S3 + CloudFront

#### Bước 1: Build project

```bash
npm run build
```

#### Bước 2: Tạo S3 Bucket

```bash
aws s3 mb s3://mia-logistics-manager
```

#### Bước 3: Upload files

```bash
aws s3 sync build/ s3://mia-logistics-manager --acl public-read
```

#### Bước 4: Configure S3 Static Website

- Enable Static Website Hosting
- Index document: `index.html`
- Error document: `index.html`

#### Bước 5: Setup CloudFront (Optional)

- Tạo CloudFront distribution
- Origin: S3 bucket
- Enable HTTPS

---

## 🔍 Troubleshooting

### Lỗi "Module not found"

```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### Lỗi Build

```bash
# Clear cache
rm -rf node_modules/.cache
npm run build
```

### Lỗi Port đã được sử dụng

```bash
# Tìm process đang dùng port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Lỗi Memory Heap

```bash
# Tăng memory cho Node.js
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## 📊 Performance Optimization

### 1. Code Splitting

Đã enabled trong React Router

### 2. Image Optimization

```bash
# Install imagemin
npm install imagemin imagemin-mozjpeg imagemin-pngquant

# Optimize images
npx imagemin src/assets/images/* --out-dir=build/images
```

### 3. Bundle Analysis

```bash
npm run analyze
```

### 4. Lighthouse Score

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

---

## 🔒 Security Checklist

- [ ] Environment variables không được commit
- [ ] API keys được lưu trong env variables
- [ ] HTTPS enabled cho production
- [ ] CORS configured properly
- [ ] Dependencies được update thường xuyên
- [ ] Security headers được set

---

## 📝 Post-Deployment Checklist

### Frontend

- [ ] Test tất cả routes (23+ frontend routes)
- [ ] Test responsive trên mobile
- [ ] Check console errors
- [ ] Test API connections
- [ ] Verify analytics tracking
- [ ] Test form submissions
- [ ] Check loading times
- [ ] Verify SEO meta tags

### Backend

- [ ] Test health check: `GET /api/health`
- [ ] Test Google Sheets connection: `GET /api/google-sheets-auth/status`
- [ ] Test authentication: `POST /api/auth/login`
- [ ] Test all 16 API route modules:
  - [ ] `/api/carriers` - CRUD operations
  - [ ] `/api/transfers` - CRUD operations
  - [ ] `/api/locations` - CRUD operations
  - [ ] `/api/transport-requests` - CRUD operations
  - [ ] `/api/settings/volume-rules` - GET/POST
  - [ ] `/api/inbound/domestic` - CRUD operations
  - [ ] `/api/inbound/international` - CRUD operations
  - [ ] `/api/auth/*` - 9 authentication endpoints
  - [ ] `/api/roles` - CRUD operations
  - [ ] `/api/employees` - CRUD operations
  - [ ] `/api/role-permissions` - GET/POST/DELETE
  - [ ] `/api/admin/stats` - Statistics
  - [ ] `/api/admin/sheets` - Sheets info
  - [ ] `/api/sheets/*` - Google Sheets operations
  - [ ] `/api/telegram/*` - Telegram notifications
- [ ] Verify Google Sheets integration working
- [ ] Test RBAC system
- [ ] Check backend logs for errors

---

## 🎯 Production URLs

- **Frontend:** <https://your-domain.com>
- **Backend API:** <https://api.your-domain.com> hoặc <https://your-backend-domain.com>
- **Backend Health Check:** <https://api.your-domain.com/api/health>
- **AI Service (Optional):** <https://ai.your-domain.com>

## 🔗 API Endpoints in Production

Sau khi deploy, tất cả endpoints sẽ accessible tại:

```text
https://api.your-domain.com/api/health
https://api.your-domain.com/api/carriers
https://api.your-domain.com/api/transfers
https://api.your-domain.com/api/locations
https://api.your-domain.com/api/transport-requests
https://api.your-domain.com/api/settings/volume-rules
https://api.your-domain.com/api/inbound/domestic
https://api.your-domain.com/api/inbound/international
https://api.your-domain.com/api/auth/login
https://api.your-domain.com/api/auth/users
https://api.your-domain.com/api/roles
https://api.your-domain.com/api/employees
https://api.your-domain.com/api/role-permissions
https://api.your-domain.com/api/admin/stats
https://api.your-domain.com/api/admin/sheets
https://api.your-domain.com/api/google-sheets-auth/status
```

**Total:** 50+ API endpoints từ 16 route modules

---

## 💡 Tips

1. **Monitoring:** Setup monitoring với Google Analytics, Sentry
2. **CDN:** Sử dụng CDN cho static assets
3. **Caching:** Enable browser caching
4. **Compression:** Enable Gzip/Brotli compression
5. **SSL:** Sử dụng Let's Encrypt cho free SSL

---

## 🚀 Deployment Scripts

Project có sẵn các scripts để deploy:

```bash
# Quick start (development)
./start-project.sh

# Simple start
./start.sh

# Production build
npm run build

# Production serve
npm run serve
```

## 📊 Deployment Architecture

```text
┌─────────────────┐
│   Frontend      │
│   (Vercel)      │
│   Port: 3000    │
└────────┬────────┘
         │ API Calls
         │
┌────────▼────────┐
│   Backend       │
│   (Railway)     │
│   Port: 5050    │
└────────┬────────┘
         │
         ├──► Google Sheets API
         ├──► Telegram Bot API
         └──► AI Service (Optional)
              Port: 8000
```

## 📞 Support

Nếu gặp vấn đề trong deployment:

- **GitHub Issues**: <https://github.com/YOUR_USERNAME/mia-logistics-manager/issues>
- **Email**: <support@mia.vn>
- **Documentation**: Xem các files trong `docs/md/`

---

## ✅ Deployment Status

- **Frontend**: ✅ Ready for Vercel/Netlify
- **Backend**: ✅ Ready for Heroku/Railway/VPS
- **AI Service**: ⚠️ Optional - chỉ deploy nếu cần
- **Database**: ✅ Google Sheets (25 sheets connected)
- **API Routes**: ✅ 16/16 routes đã triển khai đầy đủ (100%)

---

**🎉 Chúc bạn deployment thành công!** 🚀

**Version**: 2.1.0

**Last Updated**: 2025-01-30
