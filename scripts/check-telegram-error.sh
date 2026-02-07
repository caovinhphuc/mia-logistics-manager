#!/bin/bash
# Chẩn đoán lỗi Telegram - gọi API và in response chi tiết

BACKEND_URL="${BACKEND_URL:-http://localhost:5050}"

echo "🔍 Kiểm tra Telegram qua Backend ($BACKEND_URL)"
echo "=============================================="
echo ""
echo "1. Env status (/api/telegram/env):"
curl -s "${BACKEND_URL}/api/telegram/env" | head -5
echo ""
echo ""
echo "2. Test send (/api/telegram/test) - full response:"
curl -s "${BACKEND_URL}/api/telegram/test"
echo ""
