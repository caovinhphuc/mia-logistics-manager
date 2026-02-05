# 🚀 DEPLOYMENT GUIDE - MIA LOGISTICS MANAGER

## 📋 Mục Lục

- [Cài Đặt Ban Đầu](#cài-đặt-ban-đầu)
- [Development](#development)
- [Production Build](#production-build)
- [Deployment Options](#deployment-options)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Cài Đặt Ban Đầu

### Yêu Cầu Hệ Thống

- Node.js >= 16.x
- npm >= 8.x
- Git

### Bước 1: Clone Repository

```bash
git clone https://github.com/caovinhphuc/react-oas-integration-project.git
cd react-oas-integration-project
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

Cập nhật các biến môi trường trong `.env`:

```env
# Frontend
REACT_APP_API_URL=http://localhost:5050
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Google Sheets
REACT_APP_SPREADSHEET_ID=your_spreadsheet_id
GOOGLE_SHEETS_CREDENTIALS=your_credentials_json

# Features
REACT_APP_ENABLE_AI=true
REACT_APP_ENABLE_TRACKING=true
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

### Chạy với Backend (nếu có)

```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
cd backend
npm install
npm start
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
- Thêm tất cả biến từ `.env`

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
  "homepage": "https://caovinhphuc.github.io/react-oas-integration-project"
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
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
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
docker run -p 8080:80 mia-logistics-manager
```

#### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "8080:80"
    environment:
      - REACT_APP_API_URL=http://backend:5050

  backend:
    build: ./backend
    ports:
      - "5050:5050"
    environment:
      - NODE_ENV=production
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

- [ ] Test tất cả routes
- [ ] Test responsive trên mobile
- [ ] Check console errors
- [ ] Test API connections
- [ ] Verify analytics tracking
- [ ] Test form submissions
- [ ] Check loading times
- [ ] Verify SEO meta tags

---

## 🎯 Production URLs

- **Frontend:** <https://your-domain.com>
- **Backend API:** <https://api.your-domain.com>
- **Admin Panel:** <https://admin.your-domain.com>

---

## 💡 Tips

1. **Monitoring:** Setup monitoring với Google Analytics, Sentry
2. **CDN:** Sử dụng CDN cho static assets
3. **Caching:** Enable browser caching
4. **Compression:** Enable Gzip/Brotli compression
5. **SSL:** Sử dụng Let's Encrypt cho free SSL

---

## 📞 Support

Nếu gặp vấn đề trong deployment:

- GitHub Issues: <https://github.com/caovinhphuc/react-oas-integration-project/issues>
- Email: <support@mialogistics.vn>

---

**🎉 Chúc bạn deployment thành công!** 🚀
