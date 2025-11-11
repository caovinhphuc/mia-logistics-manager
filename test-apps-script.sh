#!/bin/bash

# Test Google Apps Script Distance Calculator
set -e

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

SCRIPT_URL="${REACT_APP_APPS_SCRIPT_WEB_APP_URL:-}"

if [ -z "$SCRIPT_URL" ]; then
  echo "❌ REACT_APP_APPS_SCRIPT_WEB_APP_URL is not set."
  echo "   Please add it to your .env file before running this test."
  exit 1
fi

format_json() {
  if command -v jq >/dev/null 2>&1; then
    echo "$1" | jq . || echo "$1"
  else
    echo "$1"
  fi
}

build_query() {
  node - <<'NODE'
const querystring = require("querystring");
const qs = querystring.stringify({
  function: "calculateDistance",
  origin: "Ho Chi Minh City",
  destination: "Hanoi"
});
process.stdout.write(qs);
NODE
}

echo "🧪 Testing Google Apps Script Distance Calculator..."
echo "   URL: ${SCRIPT_URL}"
echo ""

# Test 1: Địa chỉ thực tế (tiếng Việt)
echo "📊 Test 1: Tuyến HCM (Tân Phú) ➜ HCM (Quận 7)"
ORIGIN_VN="lô2-5, Đường CN1, Phường Tây Thạnh, Quận Tân Phú, TP. Hồ Chí Minh"
DEST_VN="605 Nguyễn Thị Thập, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh"
RESPONSE=$(curl -s -L --get \
  --data-urlencode "function=calculateDistance" \
  --data-urlencode "origin=${ORIGIN_VN}" \
  --data-urlencode "destination=${DEST_VN}" \
  "${SCRIPT_URL}" || echo "curl failed")
format_json "$RESPONSE"
echo ""

# Test 2: Basic calculation (tham khảo)
echo "📊 Test 2: HCM ➜ Hanoi (tham khảo)"
QUERY=$(build_query)
RESPONSE=$(curl -s -L "${SCRIPT_URL}?${QUERY}" || echo "curl failed")
format_json "$RESPONSE"
echo ""

# Test 3: Missing parameters
echo "📊 Test 3: Missing parameters (should error)"
RESPONSE=$(curl -s -L "${SCRIPT_URL}" || echo "curl failed")
format_json "$RESPONSE"
echo ""

echo "✅ Testing complete!"
echo ""
echo "📝 Current configuration:"
echo "REACT_APP_APPS_SCRIPT_WEB_APP_URL=${SCRIPT_URL}"

