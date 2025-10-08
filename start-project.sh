#!/bin/bash
echo "🚀 Khởi động MIA Logistics Manager..."
killall node &>/dev/null
export NODE_ENV=development
[ ! -f .env ] && cp .env.example .env
npm install
cd server && npm install
cd ..
echo "🔑 Kiểm tra service-account-key.json..."
if [ ! -f server/service-account-key.json ]; then
  echo "❌ Thiếu file service-account-key.json trong /server"
  exit 1
fi
echo "✅ Khởi động Backend (port 5050)"
cd server && npm start &
cd ..
echo "✅ Khởi động Frontend (port 3001)"
npm run dev &
echo "🌐 Truy cập: http://localhost:3001"
echo "📊 Backend API: http://localhost:5050"
