# 🚀 DEPLOYMENT GUIDE - MIA LOGISTICS MANAGER

> **Deployment Overview:**
>
> - **Frontend**: Deploy to Vercel/Netlify (Port 3000)
> - **Backend**: Deploy to Railway/Heroku/Render/VPS (Port 5050)
> - **AI Service**: Optional - Deploy to Railway/VPS (Port 8000)
>
> **Repository**: `mia-logistics-manager`

## Deployment Options

### 1. 🌐 Deploy Frontend to Netlify (Current Setup)

#### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Follow the prompts:
# Set up and deploy: Y
# Link to existing project: N (for first deployment)
# Project name: mia-logistics-manager
# Directory: ./
# Settings override: N
#
# Environment Variables (set in Vercel dashboard):
# - REACT_APP_API_URL=https://your-backend-url.com
# - REACT_APP_BACKEND_URL=https://your-backend-url.com
# - REACT_APP_GOOGLE_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
# - REACT_APP_GOOGLE_DRIVE_FOLDER_ID=1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE
```

#### Netlify Deployment

```bash
# Build the project
npm run build

# Deploy build folder to Netlify:
# 1. Go to https://netlify.com
# 2. Drag and drop the 'build' folder
# 3. Or connect your GitHub repository
```

### 2. ☁️ Deploy Backend to Railway/Render

#### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Render Deployment

1. Push code to GitHub
2. Go to <https://render.com>
3. Create new Web Service
4. Connect your GitHub repository
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js` hoặc `npm start`
   - **Environment**: Node.js 18+
   - **Port**: 5050
   - **Environment Variables**: Add all from `backend/.env`

### 3. 🐳 Docker Deployment

#### Dockerfile for Frontend

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Dockerfile for Backend

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy backend files
COPY . .

# Copy service account JSON (if needed)
COPY sinuous-aviary-474820-e3-c442968a0e87.json ./

EXPOSE 5050

# Start backend server
CMD ["node", "index.js"]
```

**Note**: Backend main file is `backend/index.js`, not `server.js`

#### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - '3000:3000'
    environment:
      - REACT_APP_API_URL=http://backend:5050
      - REACT_APP_BACKEND_URL=http://backend:5050
      - REACT_APP_GOOGLE_SPREADSHEET_ID=${GOOGLE_SPREADSHEET_ID}
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - '5050:5050'
    environment:
      - PORT=5050
      - NODE_ENV=production
      - GOOGLE_SHEETS_SPREADSHEET_ID=${GOOGLE_SHEETS_SPREADSHEET_ID}
      - GOOGLE_APPLICATION_CREDENTIALS=./sinuous-aviary-474820-e3-c442968a0e87.json
    volumes:
      - ./backend/sinous-aviary-474820-e3-c442968a0e87.json:/app/sinous-aviary-474820-e3-c442968a0e87.json

  ai-service:
    build:
      context: ./ai-service
      dockerfile: Dockerfile
    ports:
      - '8000:8000'
    profiles:
      - ai  # Optional service
```

### 4. 🖥️ Deploy Backend to Render (Current Setup)

#### Render Deployment Steps

1. **Connect GitHub Repository**

   - Go to [render.com](https://render.com)
   - Login with GitHub
   - "New +" → "Web Service"
   - Connect your GitHub repository (`mia-logistics-manager`)

2. **Configure Service**

   ```text
   Name: mia-logistics-backend
   Environment: Node
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: node index.js
   Instance Type: Free (or Paid for better performance)
   ```

3. **Environment Variables**
   Add all variables from `backend/.env`:

   ```text
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

   # Node Environment
   NODE_ENV=production
   ```

4. **Deploy & Test**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Test backend health: `https://your-app.onrender.com/api/health`
   - Test Google Sheets: `https://your-app.onrender.com/api/google-sheets-auth/status`
   - Test carriers: `https://your-app.onrender.com/api/carriers`

### 5. 📱 Environment Variables Setup

#### Frontend Environment Variables (Vercel/Netlify)

```bash
# Google Sheets Configuration
REACT_APP_GOOGLE_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE

# Google Apps Script
REACT_APP_GOOGLE_APPS_SCRIPT_ID=1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv
REACT_APP_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/...

# Backend API URL
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_BACKEND_URL=https://your-backend-url.com

# Telegram (Optional)
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token
REACT_APP_TELEGRAM_CHAT_ID=your_chat_id

# Frontend Port
FRONTEND_PORT=3000
```

#### Backend Environment Variables (Railway/Heroku/Render/VPS)

```bash
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

# Node Environment
NODE_ENV=production
```

### 5. 🔒 Security Considerations

#### For Production

1. **Never commit .env files**
2. **Use environment-specific configurations**
3. **Enable CORS only for your domain**
4. **Use HTTPS in production**
5. **Implement rate limiting**
6. **Add authentication for sensitive endpoints**

#### Backend Security Updates

```javascript
// Add to backend/index.js for production
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

app.use(helmet())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Production CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
```

**Note**: Backend main file is `backend/index.js` (not `server.js`)

### 6. 📊 Monitoring & Analytics

#### Backend Health Check (already implemented)

The backend already has health check endpoint:

```bash
# Health check
curl https://your-backend-url.com/api/health

# Google Sheets status
curl https://your-backend-url.com/api/google-sheets-auth/status

# Admin stats
curl https://your-backend-url.com/api/admin/stats
```

**Health Check Response:**

```json
{
  "status": "OK",
  "timestamp": "2025-01-30T...",
  "service": "MIA Logistics Manager API",
  "version": "2.1.0"
}
```

**Note**: Health check is already implemented in `backend/src/routes/router.js`

### 7. 🔄 CI/CD Pipeline

#### GitHub Actions (.github/workflows/deploy.yml)

```yaml
name: Deploy MIA Logistics Manager

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install backend dependencies
        run: |
          cd backend
          npm install
      - name: Deploy to Railway
        uses: badsyntax/github-action-railway@v1
        with:
          command: 'up'
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          working-directory: backend
```

### 8. 🚀 Quick Deploy Commands

```bash
# Option 1: Use existing scripts
./start-project.sh              # Development (with Telegram)
./start.sh                      # Simple start

# Option 2: Manual deployment steps:

# Frontend
npm run build                    # Build frontend
vercel --prod                    # Deploy frontend to Vercel
# OR
netlify deploy --prod            # Deploy frontend to Netlify

# Backend
cd backend
npm install                      # Install dependencies
railway up                       # Deploy to Railway
# OR
heroku git:remote -a mia-logistics-backend
git push heroku main             # Deploy to Heroku
# OR deploy via Render.com dashboard
```

### 9. 📱 Domain Configuration

#### Custom Domain Setup

1. **Vercel**: Go to project settings → Domains
2. **Netlify**: Go to site settings → Domain management
3. **Railway**: Go to project → Settings → Domains

#### DNS Records

```text
Type: CNAME
Name: www
Value: your-app.vercel.app

Type: A
Name: @
Value: [Vercel/Netlify IP]
```

### 10. 🔧 Troubleshooting

#### Common Issues

1. **CORS Error**: Update backend CORS settings
2. **Environment Variables**: Check all vars are set correctly
3. **Google API Errors**: Verify service account permissions
4. **Build Failures**: Check Node.js version compatibility

#### Debug Commands

```bash
# Check environment variables
printenv | grep REACT_APP          # Frontend
printenv | grep GOOGLE_SHEETS      # Backend

# Test backend health
curl https://your-backend-url.com/api/health

# Test Google Sheets connection
curl https://your-backend-url.com/api/google-sheets-auth/status

# Test API endpoints
curl https://your-backend-url.com/api/carriers
curl https://your-backend-url.com/api/admin/stats

# Check build
npm run build 2>&1 | tee build.log

# Check backend locally
cd backend
npm start
curl http://localhost:5050/api/health
```

---

## 📊 Deployment Checklist

### Frontend Deployment

- [ ] Build successful: `npm run build`
- [ ] Deployed to Vercel/Netlify
- [ ] Environment variables configured
- [ ] Frontend accessible at production URL
- [ ] All pages load correctly

### Backend Deployment

- [ ] Backend deployed (Railway/Heroku/Render/VPS)
- [ ] Environment variables configured (including service account JSON)
- [ ] Backend accessible at production URL
- [ ] Health check working: `/api/health`
- [ ] Google Sheets connection working: `/api/google-sheets-auth/status`
- [ ] All 16 API route modules tested

### Testing

- [ ] Test health check endpoint
- [ ] Test Google Sheets authentication
- [ ] Test CRUD operations (carriers, transfers, locations)
- [ ] Test authentication endpoints
- [ ] Test RBAC system (roles, employees, permissions)
- [ ] Test admin endpoints

---

## 🎯 API Endpoints After Deployment

Sau khi deploy, tất cả endpoints sẽ accessible tại:

```text
https://your-backend-url.com/api/health
https://your-backend-url.com/api/carriers
https://your-backend-url.com/api/transfers
https://your-backend-url.com/api/locations
https://your-backend-url.com/api/transport-requests
https://your-backend-url.com/api/settings/volume-rules
https://your-backend-url.com/api/inbound/domestic
https://your-backend-url.com/api/inbound/international
https://your-backend-url.com/api/auth/login
https://your-backend-url.com/api/auth/users
https://your-backend-url.com/api/roles
https://your-backend-url.com/api/employees
https://your-backend-url.com/api/role-permissions
https://your-backend-url.com/api/admin/stats
https://your-backend-url.com/api/admin/sheets
https://your-backend-url.com/api/google-sheets-auth/status
```

**Total:** 50+ API endpoints từ 16 route modules

---

🎉 **MIA Logistics Manager is now ready for production deployment!** 🚀

**Version**: 2.1.0

**Backend Routes**: 16/16 modules (100% complete)

**Last Updated**: 2025-01-30
