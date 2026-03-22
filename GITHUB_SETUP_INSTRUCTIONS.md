# 🚀 GitHub Setup Instructions

## Bước 1: Tạo GitHub Repository

1. Truy cập <https://github.com/new>
2. Tạo repository mới với thông tin:
   - **Repository name**: `mia-vn-google-integration`
   - **Description**: `MIA.vn Google Integration Platform - React automation system`
   - **Visibility**: Public hoặc Private (tuỳ chọn)
   - ⚠️ **KHÔNG** check "Initialize this repository with README"

## Bước 2: Kết nối Local Repository

Sau khi tạo GitHub repo, chạy các lệnh sau trong terminal:

```bash
# Thêm remote origin (thay YOUR_USERNAME bằng GitHub username của bạn)
git remote add origin https://github.com/caovinhphuc/mia-vn-google-integration.git

# Push code lên GitHub
git push -u origin main
```

## Bước 3: Deploy lên Vercel

### Option A: Deploy từ GitHub (Recommended)

1. Truy cập <https://vercel.com>
2. Click "New Project"
3. Import từ GitHub repo vừa tạo
4. Vercel sẽ tự động detect React app
5. Click "Deploy"

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

## Bước 4: Configure Environment Variables

Trong Vercel dashboard, thêm các Environment Variables:

```
REACT_APP_GOOGLE_API_KEY=your_api_key
REACT_APP_GOOGLE_CLIENT_ID=your_client_id
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=your_folder_id
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token
```

## 🎯 Next Steps After Deployment

1. **Test Production Build**: Verify all features work
2. **Monitor Performance**: Check Lighthouse scores
3. **Setup Analytics**: Add Google Analytics if needed
4. **Custom Domain**: Add custom domain if desired

## 📋 Deployment Checklist

- ✅ Code committed to GitHub
- ⏳ Repository created and connected
- ⏳ Deployed to Vercel
- ⏳ Environment variables configured
- ⏳ Production testing completed

---
**Current Status**: Ready for GitHub repository creation
