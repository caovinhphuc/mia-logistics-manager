#!/bin/bash

# Test startup script - chỉ test, không start
set -e

export $(cat .env | grep -v '^#' | xargs)

BACKEND_URL="http://localhost:5050"

echo "🔍 Testing Backend Connection..."

# Check if backend is running
if ! curl -s "${BACKEND_URL}/api/health" >/dev/null 2>&1; then
    echo "❌ Backend is not running on port 5050"
    echo "Please start backend first: node src/server.js"
    exit 1
fi

echo "✅ Backend is running"

# Test all services
echo ""
echo "🔍 Testing Services..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Google Sheets
echo -n "Google Sheets: "
SHEETS=$(curl -s "${BACKEND_URL}/api/sheets/info")
if echo "$SHEETS" | grep -q '"success":true'; then
    COUNT=$(echo "$SHEETS" | grep -o '"title"' | wc -l)
    echo "✅ Connected (${COUNT} sheets)"
else
    echo "❌ Failed"
fi

# Telegram
echo -n "Telegram: "
TELEGRAM=$(curl -s -X POST "${BACKEND_URL}/api/alerts/test-telegram" \
    -H "Content-Type: application/json" \
    -d '{"message":"🧪 System check"}' 2>&1)
if echo "$TELEGRAM" | grep -q '"success":true'; then
    echo "✅ Connected"
else
    echo "❌ Failed"
fi

# Email
echo -n "Email: "
EMAIL=$(curl -s -X POST "${BACKEND_URL}/api/alerts/test-email" \
    -H "Content-Type: application/json" 2>&1)
if echo "$EMAIL" | grep -q '"success":true'; then
    echo "✅ Connected"
else
    ERROR=$(echo "$EMAIL" | grep -o '"details":"[^"]*' | cut -d'"' -f4 || echo "Failed")
    echo "❌ $ERROR"
fi

echo ""
echo "📝 Summary ready to send to Telegram"

