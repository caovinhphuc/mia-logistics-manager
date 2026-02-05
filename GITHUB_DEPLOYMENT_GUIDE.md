# 🚀 GitHub & Deployment Guide

Quick guide để commit lên GitHub và deploy production.

---

## 📊 Current Status

✅ **Code**: Committed locally (335 files)  
✅ **Archive**: 38 old files backed up  
⚠️ **GitHub**: Remote URL needs update  
⏳ **Deploy**: Ready after GitHub setup

---

## 🔧 Step 1: Setup GitHub Repository

### Create New Repository

1. **Truy cập**: https://github.com/new

2. **Repository Info**:

   ```
   Name: mia-logistics-manager
   Description: MIA Logistics Manager - Hệ thống quản lý logistics chuyên nghiệp v2.1.1
   Visibility: Private (recommended) or Public
   Initialize: ❌ Don't add README (we have it)
   ```

3. **Create Repository**

### Update Remote URL

```bash
# Remove old remote
git remote remove origin

# Add new remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/mia-logistics-manager.git

# Verify
git remote -v
```

### Push to GitHub

```bash
# Push all code
git push -u origin main

# Or if branch is master:
git push -u origin master
```

---

## 🚀 Step 2: Deploy to Production

### Option A: Vercel (Recommended)

**Quick Deploy:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Configure Vercel:**

- Framework Preset: Create React App
- Root Directory: ./
- Build Command: `npm run build`
- Output Directory: `build`

**Environment Variables** (add in Vercel dashboard):

```
REACT_APP_GOOGLE_SPREADSHEET_ID=your_value
REACT_APP_TELEGRAM_BOT_TOKEN=your_value
REACT_APP_TELEGRAM_CHAT_ID=your_value
```

### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Option C: Docker (Self-Hosted)

```bash
# Build and start
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Option D: GitHub Pages

```bash
# Add homepage to package.json
# "homepage": "https://YOUR_USERNAME.github.io/mia-logistics-manager"

# Install gh-pages
npm install -g gh-pages

# Deploy
npm run deploy:github
```

---

## 🔐 Important: Environment Variables

### For Local (.env)

```bash
REACT_APP_GOOGLE_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As
REACT_APP_TELEGRAM_BOT_TOKEN=your_token
REACT_APP_TELEGRAM_CHAT_ID=your_chat_id
BACKEND_PORT=5050
FRONTEND_PORT=3000
```

### For Production (Platform Dashboard)

**Vercel/Netlify:**

- Add via web dashboard
- Or use CLI: `vercel env add`

**Docker:**

- Use `.env.production` file
- Or pass via docker-compose environment

---

## ✅ Post-Deployment Checklist

### Verify Deployment

```bash
# Check health
curl https://your-domain.com/api/health

# Check frontend
open https://your-domain.com

# Monitor
./scripts/health-monitor.sh --url https://your-domain.com
```

### Update Documentation

```bash
# Update README với production URLs
# Update docs/API.md với production endpoint
```

### Announce

```bash
# Send Telegram notification
curl -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
  -d "chat_id=$CHAT_ID" \
  -d "text=🎉 MIA Logistics v2.1.1 deployed! https://your-domain.com"
```

---

## 🔄 CI/CD Automatic Deployment

Sau khi push lên GitHub, CI/CD sẽ tự động:

1. ✅ Run tests
2. ✅ Build project
3. ✅ Security scan
4. ✅ Deploy to staging (develop branch)
5. ✅ Deploy to production (main branch)

**Setup**:

- Add secrets in GitHub Settings → Secrets
- Configure Vercel/Netlify integration

---

## 🎯 Quick Commands Summary

```bash
# GitHub Setup
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/mia-logistics-manager.git
git push -u origin main

# Vercel Deploy
vercel login
vercel --prod

# Netlify Deploy
netlify login
netlify deploy --prod --dir=build

# Docker Deploy
docker-compose up -d

# Health Check
curl https://your-domain.com/api/health
```

---

## 📞 Need Help?

- **GitHub Issues**: Repository setup problems
- **Deployment Docs**: [FINAL_DEPLOYMENT_CHECKLIST.md](FINAL_DEPLOYMENT_CHECKLIST.md)
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com

---

**Status**: ✅ Ready to Deploy  
**Commit**: ✅ Completed (335 files)  
**Next**: Setup GitHub remote → Push → Deploy

_Last Updated: November 12, 2025_
