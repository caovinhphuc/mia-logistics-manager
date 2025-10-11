#!/bin/bash
echo "🚀 Khởi động MIA Logistics Manager..."
killall node &>/dev/null
export NODE_ENV=development
# default ports (can be overridden by environment)
export BACKEND_PORT=${BACKEND_PORT:-5050}
export FRONTEND_PORT=${FRONTEND_PORT:-3000}

[ ! -f .env ] && cp .env.example .env
npm install
cd server && npm install
cd ..
echo "🔑 Kiểm tra service-account-key.json..."
if [ ! -f server/service-account-key.json ]; then
  echo "❌ Thiếu file service-account-key.json trong /server"
  exit 1
fi
echo "✅ Khởi động Backend (port ${BACKEND_PORT})"
cd server && BACKEND_PORT=${BACKEND_PORT} npm start &
cd ..
echo "✅ Khởi động Frontend (port ${FRONTEND_PORT})"
FRONTEND_PORT=${FRONTEND_PORT} npm run dev &
echo "🌐 Truy cập: http://localhost:${FRONTEND_PORT}"
echo "📊 Backend API: http://localhost:${BACKEND_PORT}"
