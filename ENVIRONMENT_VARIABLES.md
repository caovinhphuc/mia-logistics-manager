# Environment Variables Configuration Guide

## Required Environment Variables

This document outlines all required and optional environment variables for the MIA Logistics Manager application.

## Production Deployment Checklist

Before deploying to production, ensure ALL placeholder values are replaced with actual credentials.

### ⚠️ CRITICAL - Google Services Configuration

```bash
# Google Client ID (OAuth 2.0)
REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com

# Google API Key
REACT_APP_GOOGLE_API_KEY=your-actual-api-key

# Google Spreadsheet ID
REACT_APP_GOOGLE_SPREADSHEET_ID=your-actual-spreadsheet-id

# Google Drive Folder ID (Optional)
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=your-drive-folder-id

# Google Apps Script Web App URL (Optional)
REACT_APP_APPS_SCRIPT_WEB_APP_URL=https://script.google.com/macros/s/your-deployment-id/exec
```

### Email Service Configuration (Choose One)

#### Option 1: SendGrid (Recommended for Production)

```bash
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=MIA Logistics
```

#### Option 2: SMTP (Gmail, etc.)

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

### Telegram Notifications (Optional)

```bash
REACT_APP_TELEGRAM_BOT_TOKEN=your-bot-token
REACT_APP_TELEGRAM_CHAT_ID=your-chat-id
```

### Application Configuration

```bash
# Backend API URL
REACT_APP_API_URL=http://localhost:3100/api
# For production: https://your-backend-domain.com/api

# Frontend Port
FRONTEND_PORT=3000

# Backend Port
BACKEND_PORT=3100

# Environment
NODE_ENV=production
```

### Security Configuration

```bash
# Session Secret (Generate a random 32+ character string)
SESSION_SECRET=your-random-secret-key-here

# JWT Secret (Generate a random 32+ character string)
JWT_SECRET=your-jwt-secret-key-here

# CORS Origin (Your frontend URL)
CORS_ORIGIN=https://your-frontend-domain.com
```

### Analytics & Monitoring (Optional)

```bash
# Sentry (Error Tracking)
REACT_APP_SENTRY_DSN=your-sentry-dsn

# Google Analytics
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

## How to Set Up Environment Variables

### Development

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Edit `.env` and replace all placeholder values with your actual credentials

3. Never commit `.env` to version control

### Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable listed above
4. Set environment to "Production"
5. Redeploy your application

### Production (Netlify)

1. Go to Site settings > Build & deploy > Environment
2. Add each variable listed above
3. Redeploy your application

### Production (Self-Hosted)

1. Create `.env.production` file on your server
2. Add all required environment variables
3. Use a process manager like PM2 to load the environment:

```bash
pm2 start npm --name "mia-logistics" -- start
```

## Security Best Practices

### ✅ DO:

- Use strong, randomly generated secrets for SESSION_SECRET and JWT_SECRET
- Use app-specific passwords for Gmail (not your main password)
- Store credentials in environment variables, never in code
- Use different credentials for development and production
- Regularly rotate API keys and secrets
- Use HTTPS in production
- Restrict API keys to specific domains/IPs when possible

### ❌ DON'T:

- Commit `.env` files to Git
- Use default/placeholder values in production
- Share credentials in plain text
- Reuse the same secrets across multiple projects
- Expose API keys in client-side code (except REACT*APP*\* variables)

## Generating Secure Secrets

Generate secure random strings for secrets:

```bash
# On macOS/Linux:
openssl rand -base64 32

# Or use Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Google Services Setup

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google Sheets API
   - Google Drive API
   - Google Apps Script API

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Application type: "Web application"
4. Add authorized origins:
   - `http://localhost:3000` (development)
   - `https://your-production-domain.com` (production)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://your-production-domain.com` (production)
6. Copy the Client ID to `REACT_APP_GOOGLE_CLIENT_ID`

### 3. Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API key"
3. Restrict the key to Google Sheets API and Google Drive API
4. Add domain restrictions for production
5. Copy the API key to `REACT_APP_GOOGLE_API_KEY`

### 4. Create/Configure Google Sheet

1. Create a new Google Sheet or use existing one
2. Share it with your Google account (used for OAuth)
3. Copy the Spreadsheet ID from the URL:
   `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
4. Add to `REACT_APP_GOOGLE_SPREADSHEET_ID`

## Testing Configuration

After setting up environment variables, test the configuration:

```bash
# Test email service
npm run test:email

# Test Telegram notifications
npm run test:telegram

# Test Google Sheets connection
npm run test:connections

# Run full health check
npm run health:check
```

## Troubleshooting

### "Invalid credentials" or "Unauthorized" errors

- Verify all API keys and secrets are correct
- Check that OAuth redirect URIs match your domain
- Ensure APIs are enabled in Google Cloud Console

### Email not sending

- Verify SMTP credentials
- For Gmail, ensure "Less secure app access" is enabled or use app-specific password
- Check firewall/network settings

### Google Sheets errors

- Verify Spreadsheet ID is correct
- Ensure sheet is shared with the correct Google account
- Check API quotas in Google Cloud Console

## Support

For additional help:

- Check [QUICK_START.md](./QUICK_START.md) for setup instructions
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guides
- See [README.md](./README.md) for general documentation

## Security Contact

If you discover a security vulnerability, please email: security@mia-logistics.com
