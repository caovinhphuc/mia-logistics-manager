# MIA Logistics Manager - Deployment Guide

## 🚀 Production Deployment Guide

### Prerequisites

- Node.js 16+ và npm 8+
- Google Cloud Platform account
- Domain name (tùy chọn)
- SSL certificate (khuyến nghị)

## 📋 Pre-deployment Checklist

### 1. Environment Configuration

```bash
# Kiểm tra file .env có đầy đủ thông tin
✓ REACT_APP_GOOGLE_CLIENT_ID
✓ REACT_APP_GOOGLE_CLIENT_SECRET
✓ REACT_APP_GOOGLE_SPREADSHEET_ID
✓ REACT_APP_GOOGLE_DRIVE_FOLDER_ID
✓ REACT_APP_GOOGLE_APPS_SCRIPT_ID
✓ REACT_APP_GOOGLE_MAPS_API_KEY
```

### 2. Google Services Setup

```bash
# Kiểm tra Google Cloud Console
✓ APIs enabled (Sheets, Drive, Maps, Apps Script)
✓ OAuth credentials configured
✓ Domain whitelist updated
✓ API quotas sufficient

# Kiểm tra Google Sheets
✓ Spreadsheet created với đúng structure
✓ Service account có quyền truy cập
✓ Data validation rules applied

# Kiểm tra Google Drive
✓ Folder structure created
✓ Permissions configured
✓ Backup strategy in place

# Kiểm tra Apps Script
✓ Web app deployed
✓ Permissions granted
✓ Functions tested
```

### 3. Security Review

```bash
✓ Environment variables secured
✓ API keys restricted by domain
✓ HTTPS enforced
✓ CORS properly configured
✓ Input validation implemented
```

## 🌐 Deployment Options

### Option 1: Static Hosting (Recommended)

#### A. Netlify Deployment

```bash
# 1. Build the application
npm run build

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Login to Netlify
netlify login

# 4. Deploy
netlify deploy --prod --dir=build

# 5. Configure environment variables in Netlify dashboard
```

**Netlify Configuration (_netlify.toml):**

```toml
[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "16"
  NPM_VERSION = "8"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### B. Vercel Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel --prod

# 4. Configure environment variables in Vercel dashboard
```

**Vercel Configuration (vercel.json):**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### C. Firebase Hosting

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize project
firebase init hosting

# 4. Build and deploy
npm run build
firebase deploy
```

**Firebase Configuration (firebase.json):**

```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000"
          }
        ]
      },
      {
        "source": "index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

### Option 2: VPS/Dedicated Server

#### A. nginx + PM2 Setup

```bash
# 1. Setup nginx
sudo apt update
sudo apt install nginx

# 2. Configure nginx
sudo nano /etc/nginx/sites-available/mia-logistics

# nginx configuration
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/mia-logistics/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}

# 3. Enable site
sudo ln -s /etc/nginx/sites-available/mia-logistics /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 4. Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

#### B. Apache Setup

```bash
# 1. Install Apache
sudo apt update
sudo apt install apache2

# 2. Configure virtual host
sudo nano /etc/apache2/sites-available/mia-logistics.conf

# Apache configuration
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    DocumentRoot /var/www/mia-logistics/build

    <Directory /var/www/mia-logistics/build>
        Options -Indexes
        AllowOverride All
        Require all granted
    </Directory>

    # Handle React Router
    FallbackResource /index.html

    # Security headers
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options nosniff

    ErrorLog ${APACHE_LOG_DIR}/mia-logistics_error.log
    CustomLog ${APACHE_LOG_DIR}/mia-logistics_access.log combined
</VirtualHost>

# 3. Enable site and modules
sudo a2enmod rewrite headers
sudo a2ensite mia-logistics.conf
sudo systemctl reload apache2

# 4. Setup SSL
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com
```

### Option 3: Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  mia-logistics:
    build: .
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Optional: Add monitoring
  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 30
```

#### Deploy with Docker

```bash
# 1. Build and run
docker-compose up -d

# 2. Check status
docker-compose ps

# 3. View logs
docker-compose logs -f mia-logistics

# 4. Update deployment
docker-compose pull
docker-compose up -d
```

## 🔧 Performance Optimization

### 1. Build Optimization

```bash
# Enable production optimizations
export NODE_ENV=production
export GENERATE_SOURCEMAP=false
export INLINE_RUNTIME_CHUNK=false

# Build with analysis
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### 2. CDN Setup

```javascript
// Configure CDN in build process
const CDN_URL = 'https://cdn.yourdomain.com';

// Update asset URLs
const assetManifest = require('./build/asset-manifest.json');
// Process and update URLs
```

### 3. Caching Strategy

```nginx
# nginx caching configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 0;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

## 📊 Monitoring & Analytics

### 1. Google Analytics

```javascript
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Error Monitoring (Sentry)

```bash
npm install @sentry/react

# Configure in src/index.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### 3. Performance Monitoring

```javascript
// Add to src/utils/performance.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send metrics to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🔒 Security Hardening

### 1. Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' *.googleapis.com *.google.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com fonts.googleapis.com;
  font-src 'self' fonts.gstatic.com;
  img-src 'self' data: *.googleapis.com *.google.com;
  connect-src 'self' *.googleapis.com *.google.com;
">
```

### 2. Environment Security

```bash
# Secure environment variables
chmod 600 .env
chown root:root .env

# Use secrets management for sensitive data
# AWS Secrets Manager, Azure Key Vault, etc.
```

### 3. API Security

```javascript
// Implement rate limiting
// Add API key restrictions
// Use CORS properly
// Validate all inputs
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test -- --coverage --watchAll=false

    - name: Build
      run: npm run build
      env:
        REACT_APP_GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
        REACT_APP_GOOGLE_SPREADSHEET_ID: ${{ secrets.GOOGLE_SPREADSHEET_ID }}

    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📈 Scaling Considerations

### 1. Database Scaling

- Implement Redis caching
- Use database connection pooling
- Consider read replicas

### 2. Application Scaling

- Implement horizontal scaling
- Use load balancers
- Container orchestration (Kubernetes)

### 3. CDN and Caching

- Implement global CDN
- Edge computing
- Browser caching optimization

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version
   - Clear node_modules and reinstall
   - Check environment variables

2. **Google API Errors**
   - Verify API keys and quotas
   - Check CORS settings
   - Validate permissions

3. **Performance Issues**
   - Analyze bundle size
   - Implement code splitting
   - Optimize images and assets

### Support Contacts

- **Technical Support**: <support@mialogistics.com>
- **Emergency Hotline**: +84-123-456-789
- **Documentation**: <https://docs.mialogistics.com>
