#!/bin/bash

# Test startup script - chỉ test, không start
set -e

# Read env values safely (do not source .env because it may contain JSON values)
read_env_value() {
    local key="$1"
    local file="$2"
    if [ -f "$file" ]; then
        grep -E "^${key}=" "$file" | tail -n 1 | cut -d'=' -f2- | tr -d '"'
    fi
}

BACKEND_PORT="${BACKEND_PORT:-}"
if [ -z "$BACKEND_PORT" ]; then
    BACKEND_PORT="$(read_env_value BACKEND_PORT backend/.env)"
fi
if [ -z "$BACKEND_PORT" ]; then
    BACKEND_PORT="$(read_env_value BACKEND_PORT .env)"
fi
if [ -z "$BACKEND_PORT" ]; then
    BACKEND_PORT="${PORT:-5050}"
fi

BACKEND_URL="http://localhost:${BACKEND_PORT}"

echo "🔍 Testing Backend Connection..."
echo "🌐 Backend URL: ${BACKEND_URL}"

# Check if backend is running
if ! curl -s "${BACKEND_URL}/api/health" >/dev/null 2>&1; then
        echo "❌ Backend is not running on port ${BACKEND_PORT}"
        echo "Please start backend first: cd backend && npm start"
    exit 1
fi

echo "✅ Backend is running"

# Test all services
echo ""
echo "🔍 Testing Services..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Google Sheets
echo -n "Google Sheets: "
SHEETS=$(curl -s "${BACKEND_URL}/api/_debug/state" 2>&1)
if echo "$SHEETS" | grep -q '"activeSpreadsheetId"'; then
    COUNT=$(echo "$SHEETS" | grep -o '"sheetTitles"' | wc -l)
    if [ "$COUNT" -ge 1 ]; then
      echo "✅ Connected"
    else
      echo "✅ Connected (spreadsheet resolved)"
    fi
elif echo "$SHEETS" | grep -q 'Missing required parameters: spreadsheetId'; then
    echo "⚠️ Chưa cấu hình GOOGLE_SHEETS_SPREADSHEET_ID"
else
    echo "❌ Failed"
fi

# Notification status (Telegram/Email)
NOTIFY_STATUS=$(curl -s "${BACKEND_URL}/api/notifications/status" 2>&1)

# Telegram
echo -n "Telegram: "
if echo "$NOTIFY_STATUS" | grep -q '"telegram":{"isInitialized":true'; then
    echo "✅ Connected"
elif echo "$NOTIFY_STATUS" | grep -q '"telegram":{"isInitialized":false'; then
    echo "⚠️ Not configured/invalid token"
else
    echo "❌ Failed"
fi

# Email
echo -n "Email: "
if echo "$NOTIFY_STATUS" | grep -q '"email":{"isInitialized":true'; then
    if echo "$NOTIFY_STATUS" | grep -q '"sendgridEnabled":true\|"nodemailerEnabled":true'; then
      echo "✅ Connected"
    else
      echo "⚠️ Initialized nhưng chưa bật SMTP/SendGrid"
    fi
elif echo "$NOTIFY_STATUS" | grep -q '"email":{"isInitialized":false'; then
    echo "⚠️ Not configured"
else
    echo "❌ Failed"
fi

echo ""
echo "📝 Summary ready to send to Telegram"

