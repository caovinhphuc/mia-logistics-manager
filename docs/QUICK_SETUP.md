
# MIA Logistics Manager - Quick Setup Commands

## 1. Giải nén và cài đặt
unzip mia-logistics-manager.zip
cd mia-logistics-manager


## 2. Development setup
./setup-dev.sh
# Hoặc thủ công:
npm install
cp .env.example .env
# Edit .env with your Google Cloud credentials

## 3. Chạy development
npm start
# Hoặc:
./scripts/start.sh

## 4. Build production
npm run build
# Hoặc:
./scripts/build.sh

## 5. Deploy
./scripts/deploy.sh

## 6. Upload lên GitHub
git init
git add .
git commit -m "Initial commit: MIA Logistics Manager v1.0.0"
git branch -M main
git remote add origin https://github.com/your-username/mia-logistics-manager.git
git push -u origin main

## Demo accounts:
# admin@mialogistics.com / admin123
# manager@mialogistics.com / manager123
# operator@mialogistics.com / operator123
# driver@mialogistics.com / driver123
# warehouse@mialogistics.com / warehouse123
