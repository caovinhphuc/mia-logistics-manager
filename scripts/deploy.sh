#!/bin/bash

# 🚀 MIA Logistics Manager - Deploy Script
# Automates the deployment process to Vercel

echo "🚀 Starting deployment for MIA Logistics Manager..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Clean build cache
echo -e "${YELLOW}📦 Cleaning build cache...${NC}"
rm -rf build
rm -rf node_modules/.cache
rm -rf .eslintcache

# Step 2: Install dependencies
echo -e "${YELLOW}📥 Installing dependencies...${NC}"
npm install

# Step 3: Build production version
echo -e "${YELLOW}🔨 Building production version...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed! Please check errors above.${NC}"
    exit 1
fi

# Step 4: Deploy to Vercel
echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${BLUE}🌐 Your app is now live at: https://mia-logistics-manager-h9iqhui97-git-react.vercel.app${NC}"
else
    echo -e "${RED}❌ Deployment failed! Please check errors above.${NC}"
    exit 1
fi

# Step 5: Show deployment info
echo -e "${GREEN}"
echo "🎉 Deployment Complete!"
echo "================================"
echo "📱 Production URL: https://mia-logistics-manager-h9iqhui97-git-react.vercel.app"
echo "🔍 Vercel Dashboard: https://vercel.com/git-react/mia-logistics-manager"
echo "📊 Analytics: Available in Vercel dashboard"
echo "🔧 Settings: https://vercel.com/git-react/mia-logistics-manager/settings"
echo "================================"
echo -e "${NC}"

# Step 6: Test accounts info
echo -e "${BLUE}"
echo "🔐 Test Accounts:"
echo "├─ Admin: admin@mialogistics.com / admin123"
echo "├─ Manager: manager@mialogistics.com / manager123"
echo "├─ Operator: operator@mialogistics.com / operator123"
echo "└─ Driver: driver@mialogistics.com / driver123"
echo -e "${NC}"

echo -e "${GREEN}🚀 Deployment script completed successfully!${NC}"