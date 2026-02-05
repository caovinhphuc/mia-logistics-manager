#!/bin/bash

# Simple startup script với Telegram notification
set -e

# Load env
export $(cat .env | grep -v '^#' | xargs)

BACKEND_URL="http://localhost:5050"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Starting MIA Logistics Manager..."

# Kill existing processes
pkill -f "node src/server.js" 2>/dev/null || true
lsof -ti:5050 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Start backend
echo "📦 Starting backend..."
node src/server.js &
sleep 4

# Test and notify
MESSAGE="🚀 <b>MIA LOGISTICS STARTUP</b>\n\n"

# Test Sheets
SHEETS=$(curl -s "${BACKEND_URL}/api/sheets/info")
if echo "$SHEETS" | grep -q '"success":true'; then
    COUNT=$(echo "$SHEETS" | grep -o '"title"' | wc -l)
    MESSAGE+="✅ Sheets: ${COUNT} tabs\n"
else
    MESSAGE+="❌ Sheets: Failed\n"
fi

# Test Telegram
TELEGRAM=$(curl -s -X POST "${BACKEND_URL}/api/alerts/test-telegram" \
    -H "Content-Type: application/json" \
    -d '{"message":"Test"}' 2>&1)
if echo "$TELEGRAM" | grep -q '"success":true'; then
    MESSAGE+="✅ Telegram: OK\n"
else
    MESSAGE+="❌ Telegram: Failed\n"
fi

# Test Email
EMAIL=$(curl -s -X POST "${BACKEND_URL}/api/alerts/test-email" \
    -H "Content-Type: application/json" 2>&1)
if echo "$EMAIL" | grep -q '"success":true'; then
    MESSAGE+="✅ Email: OK\n"
else
    MESSAGE+="❌ Email: Failed\n"
fi

MESSAGE+="\n<i>Started: $(date)</i>"

# Send notification
curl -s -X POST "${BACKEND_URL}/api/alerts/telegram" \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"${MESSAGE}\"}" >/dev/null 2>&1

echo "${GREEN}✅ Backend ready at ${BACKEND_URL}${NC}"
echo "${YELLOW}⏹️  Press Ctrl+C to stop${NC}"
echo ""

# Start frontend
npm start
