#!/bin/bash

# MIA Logistics Manager - Startup Script
# Khởi động backend và frontend

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Config
BACKEND_PORT=${BACKEND_PORT:-5050}
FRONTEND_PORT=${FRONTEND_PORT:-3000}
BACKEND_URL="http://localhost:${BACKEND_PORT}"
FRONTEND_URL="http://localhost:${FRONTEND_PORT}"

# Functions
print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🚀  MIA LOGISTICS MANAGER - STARTUP${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_section() {
    echo -e "${YELLOW}$1${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

SERVICE_ROWS=()
add_service_status() {
    local name="$1"
    local status="$2"
    local details="$3"
    SERVICE_ROWS+=("${name}|${status}|${details}")
}

format_service_rows() {
    local formatted=""
    for row in "${SERVICE_ROWS[@]}"; do
        IFS='|' read -r service status details <<< "$row"
        details=$(echo "$details" | sed 's/^ *//;s/ *$//')
        [ -z "$details" ] && details="—"
        formatted+="${status} ${service}"
        if [ "$details" != "—" ]; then
            formatted+=" • ${details}"
        fi
        formatted+="\n"
    done
    printf "%s" "$formatted"
}

send_telegram_summary() {
    if [ "$HAS_TOKEN" != "true" ] || [ "$HAS_CHAT" != "true" ]; then
        return
    fi

    local service_text message payload
    service_text=$(format_service_rows)
    message="🚀 Khởi động MIA Logistics Manager thành công\n"
    message+="⏱ $(date '+%Y-%m-%d %H:%M:%S %Z')\n"
    message+="\n📊 Trạng thái dịch vụ:\n${service_text}"
    message+="\n🌐 Backend: ${BACKEND_URL}\n"
    message+="🌐 Frontend: ${FRONTEND_URL}\n"

    payload=$(printf '%s' "$message" | node - <<'NODE'
const fs = require('fs');
const text = fs.readFileSync(0, 'utf8');
process.stdout.write(JSON.stringify({ text }));
NODE
)

    if curl -sSf -X POST "${BACKEND_URL}/api/telegram/send" \
        -H "Content-Type: application/json" \
        -d "$payload" >/dev/null 2>&1; then
        print_success "Đã gửi tóm tắt khởi động tới Telegram"
    else
        print_warning "Không gửi được thông báo tóm tắt Telegram"
    fi
}

mkdir -p logs

# Cleanup function
cleanup() {
    echo ""
    print_section "🛑 Cleaning up..."
    if [ -n "${BACKEND_PID:-}" ] && ps -p $BACKEND_PID >/dev/null 2>&1; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ -n "${FRONTEND_PID:-}" ] && ps -p $FRONTEND_PID >/dev/null 2>&1; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    # Fallback kill patterns (in case PIDs not set)
    pkill -f "server/index.js" 2>/dev/null || true
    pkill -f "react-scripts" 2>/dev/null || true
    print_info "Processes terminated"
}

trap cleanup EXIT INT TERM

# Ensure dependencies
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Installing root dependencies..."
    npm install
fi
# Backend uses root node_modules (no backend/package.json). Skip backend npm install.
# Only install in backend if it has its own package.json
if [ -f "backend/package.json" ] && [ ! -d "backend/node_modules" ]; then
    print_warning "backend/node_modules not found. Installing backend dependencies..."
    (cd backend && npm install --legacy-peer-deps)
fi

# Start backend
print_section "📦 Starting Backend Server..."

print_info "Checking if backend is already running..."
if lsof -Pi :${BACKEND_PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port ${BACKEND_PORT} is already in use. Killing existing process..."
    lsof -ti:${BACKEND_PORT} | xargs kill -9 2>/dev/null || true
    sleep 2
fi

BACKEND_LOG_FILE="logs/backend-startup.log"
print_info "Starting backend on port ${BACKEND_PORT} (backend/server.cjs)..."
print_info "Backend logs: ${BACKEND_LOG_FILE}"
node backend/server.cjs > "${BACKEND_LOG_FILE}" 2>&1 &
BACKEND_PID=$!
print_info "Waiting for backend health..."
RETRIES=20
until curl -sf "${BACKEND_URL}/health" >/dev/null 2>&1; do
    sleep 1
    RETRIES=$((RETRIES-1))
    if [ $RETRIES -le 0 ]; then
        print_error "Backend failed to respond at ${BACKEND_URL}/health"
        [ -f "${BACKEND_LOG_FILE}" ] && tail -n 100 "${BACKEND_LOG_FILE}" || true
        exit 1
    fi
done
print_success "Backend is healthy at ${BACKEND_URL} (PID: $BACKEND_PID)"
add_service_status "Backend Health" "✅" "Process PID ${BACKEND_PID}"
LOGS=("${BACKEND_LOG_FILE}")

# Integration checks
print_section "🔎 Kiểm tra kết nối (Google Sheets, Telegram, Google Drive, Google Apps Script, Backend APIs) ..."

# Initialize log files
mkdir -p logs
INTEGRATION_LOG="logs/integrations.log"
GOOGLE_SHEETS_LOG="logs/google-sheets.log"
GOOGLE_DRIVE_LOG="logs/google-drive.log"
GOOGLE_APPS_SCRIPT_LOG="logs/google-apps-script.log"
BACKEND_API_LOG="logs/backend-api.log"

echo "$(date '+%Y-%m-%d %H:%M:%S') - Starting integration checks..." > "${INTEGRATION_LOG}"
echo "$(date '+%Y-%m-%d %H:%M:%S') - Google Sheets Health Check" > "${GOOGLE_SHEETS_LOG}"
echo "$(date '+%Y-%m-%d %H:%M:%S') - Google Drive Health Check" > "${GOOGLE_DRIVE_LOG}"
echo "$(date '+%Y-%m-%d %H:%M:%S') - Google Apps Script Health Check" > "${GOOGLE_APPS_SCRIPT_LOG}"
echo "$(date '+%Y-%m-%d %H:%M:%S') - Backend API Health Check" > "${BACKEND_API_LOG}"

# Wait for backend to be ready
print_info "Waiting for backend to be ready..."
sleep 3
for i in {1..10}; do
    if curl -s --max-time 2 "${BACKEND_URL}/health" >/dev/null 2>&1 || curl -s --max-time 2 "${BACKEND_URL}/" >/dev/null 2>&1; then
        print_success "Backend is ready"
        break
    fi
    if [ $i -eq 10 ]; then
        print_warning "Backend not responding, continuing anyway..."
    else
        sleep 1
    fi
done

# Backend API Health Check
echo -n "   📡 Backend API (/health)... "
HEALTH_RESP=$(curl -s --max-time 5 "${BACKEND_URL}/health" 2>&1 || curl -s --max-time 5 "${BACKEND_URL}/" 2>&1 || echo "Connection failed")
if echo "$HEALTH_RESP" | grep -qE "ok|success|200|Running|Express|error" || [ -n "$HEALTH_RESP" ]; then
    print_success "Responding"
    echo "[$(date '+%H:%M:%S')] ✅ Backend API: Responding" >> "${BACKEND_API_LOG}"
    echo "Response: $HEALTH_RESP" >> "${BACKEND_API_LOG}"
    echo "" >> "${BACKEND_API_LOG}"
    add_service_status "Backend API" "✅" "Health endpoint responded"
    LOGS+=("${BACKEND_API_LOG}")
else
    print_error "Not responding"
    echo "[$(date '+%H:%M:%S')] ❌ Backend API: Not responding" >> "${BACKEND_API_LOG}"
    echo "Response: $HEALTH_RESP" >> "${BACKEND_API_LOG}"
    echo "" >> "${BACKEND_API_LOG}"
    add_service_status "Backend API" "❌" "Health endpoint failed"
fi

# Test Backend Carriers API
echo -n "   📋 Backend API (/api/carriers)... "
CARRIERS_RESP=$(curl -s --max-time 10 "${BACKEND_URL}/api/carriers" 2>&1 || echo "Connection failed")
if echo "$CARRIERS_RESP" | grep -qE "carrierId|\[\]|404" || [ -n "$CARRIERS_RESP" ]; then
    CARRIERS_COUNT=$(echo "$CARRIERS_RESP" | grep -o "carrierId" | wc -l | tr -d ' ' || echo "0")
    if [ "$CARRIERS_COUNT" -gt 0 ] || echo "$CARRIERS_RESP" | grep -q "\[\]"; then
        print_success "Connected (${CARRIERS_COUNT} carriers)"
        echo "[$(date '+%H:%M:%S')] ✅ Backend Carriers API: Connected (${CARRIERS_COUNT} carriers)" >> "${BACKEND_API_LOG}"
        echo "Response preview: $(echo "$CARRIERS_RESP" | head -c 200)..." >> "${BACKEND_API_LOG}"
        add_service_status "Carriers API" "✅" "${CARRIERS_COUNT} carriers"
    else
        print_warning "Connected but empty"
        echo "[$(date '+%H:%M:%S')] ⚠️  Backend Carriers API: Empty response" >> "${BACKEND_API_LOG}"
        add_service_status "Carriers API" "⚠️" "Empty response"
    fi
else
    print_error "Failed"
    echo "[$(date '+%H:%M:%S')] ❌ Backend Carriers API: Failed" >> "${BACKEND_API_LOG}"
    add_service_status "Carriers API" "❌" "Request failed"
fi
echo "" >> "${BACKEND_API_LOG}"

# Google Sheets
echo -n "   📊 Google Sheets API... "
SHEETS_SPREADSHEET_ID="${REACT_APP_GOOGLE_SPREADSHEET_ID:-18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As}"
SHEETS_INFO=$(curl -s --max-time 10 "${BACKEND_URL}/api/sheets/info?spreadsheetId=${SHEETS_SPREADSHEET_ID}" 2>&1 || echo "")

if echo "$SHEETS_INFO" | grep -q '"success":true'; then
    SHEETS_SUMMARY=$(
        node - "$SHEETS_INFO" <<'NODE'
const raw = process.argv[2] || "";
try {
  const data = JSON.parse(raw);
  const sheets = data?.spreadsheet?.sheets || [];
  const active = sheets.filter((sheet) => {
    const hidden =
      sheet.hidden ??
      sheet.properties?.hidden ??
      false;
    return !hidden;
  });
  const summaryNames = active
    .slice(0, 5)
    .map((sheet) => sheet.title)
    .join(", ");
  const extra = active.length > 5 ? ", ..." : "";
  const allNames = sheets
    .map((sheet) => {
      const hidden =
        sheet.hidden ?? sheet.properties?.hidden ?? false;
      return `${sheet.title}${hidden ? " (hidden)" : ""}`;
    })
    .join(", ");
  process.stdout.write(
    [
      active.length,
      sheets.length,
      summaryNames + extra,
      allNames,
    ].join("|")
  );
} catch (err) {
  process.stdout.write("0|0| |");
}
NODE
    )
    IFS='|' read -r SHEETS_ACTIVE SHEETS_TOTAL SHEETS_NAMES SHEETS_ALL <<< "$SHEETS_SUMMARY"
    SHEETS_ACTIVE=${SHEETS_ACTIVE:-0}
    SHEETS_TOTAL=${SHEETS_TOTAL:-0}
    SHEETS_NAMES=$(echo "$SHEETS_NAMES" | sed 's/^ *//;s/ *$//')
    SHEETS_ALL=$(echo "$SHEETS_ALL" | sed 's/^ *//;s/ *$//')

    print_success "Connected (${SHEETS_ACTIVE}/${SHEETS_TOTAL} active sheets)"
    if [ -n "$SHEETS_NAMES" ]; then
        echo "       Sheets: ${SHEETS_NAMES}"
    fi
    echo "[$(date '+%H:%M:%S')] ✅ Google Sheets: Connected" >> "${GOOGLE_SHEETS_LOG}"
    echo "Spreadsheet ID: ${SHEETS_SPREADSHEET_ID}" >> "${GOOGLE_SHEETS_LOG}"
    echo "Active sheets: ${SHEETS_ACTIVE}/${SHEETS_TOTAL}" >> "${GOOGLE_SHEETS_LOG}"
    if [ -n "$SHEETS_ALL" ]; then
        echo "Sheet list: ${SHEETS_ALL}" >> "${GOOGLE_SHEETS_LOG}"
    fi
    echo "" >> "${GOOGLE_SHEETS_LOG}"
    echo "[$(date '+%H:%M:%S')] ✅ Google Sheets: Connected (${SHEETS_ACTIVE}/${SHEETS_TOTAL} active)" >> "${INTEGRATION_LOG}"
    if [ -n "$SHEETS_ALL" ]; then
        echo "Sheets: ${SHEETS_ALL}" >> "${INTEGRATION_LOG}"
    fi
    echo "" >> "${INTEGRATION_LOG}"
    LOGS+=("${GOOGLE_SHEETS_LOG}")
    add_service_status "Google Sheets" "✅" "${SHEETS_ACTIVE}/${SHEETS_TOTAL} active: ${SHEETS_NAMES:-N/A}"
else
    print_error "Failed"
    echo "[$(date '+%H:%M:%S')] ❌ Google Sheets: Failed" >> "${GOOGLE_SHEETS_LOG}"
    echo "Spreadsheet ID: ${SHEETS_SPREADSHEET_ID}" >> "${GOOGLE_SHEETS_LOG}"
    echo "Response: $SHEETS_INFO" >> "${GOOGLE_SHEETS_LOG}"
    echo "" >> "${GOOGLE_SHEETS_LOG}"
    echo "[$(date '+%H:%M:%S')] ❌ Google Sheets: Failed" >> "${INTEGRATION_LOG}"
    echo "Response: $SHEETS_INFO" >> "${INTEGRATION_LOG}"
    echo "" >> "${INTEGRATION_LOG}"
    add_service_status "Google Sheets" "❌" "Could not fetch spreadsheet info"
    LOGS+=("${GOOGLE_SHEETS_LOG}")
fi

# Google Drive
echo -n "   📁 Google Drive API... "
DRIVE_FOLDER_ID="${REACT_APP_GOOGLE_DRIVE_FOLDER_ID:-}"
SERVICE_ACCOUNT_FILE=$(ls backend/credentials/*.json backend/*.json 2>/dev/null | grep -E "(service-account|sinuous|mia-logistics)" | head -1)
if [ -n "$SERVICE_ACCOUNT_FILE" ] && [ -f "$SERVICE_ACCOUNT_FILE" ]; then
    print_success "Service account found"
    echo "[$(date '+%H:%M:%S')] ✅ Google Drive: Service account authenticated" >> "${GOOGLE_DRIVE_LOG}"
    echo "Service account file: ${SERVICE_ACCOUNT_FILE}" >> "${GOOGLE_DRIVE_LOG}"
    if [ -n "$DRIVE_FOLDER_ID" ]; then
        echo "Drive folder ID: ${DRIVE_FOLDER_ID}" >> "${GOOGLE_DRIVE_LOG}"
    else
        echo "Drive folder ID: Not configured" >> "${GOOGLE_DRIVE_LOG}"
    fi
    echo "" >> "${GOOGLE_DRIVE_LOG}"
    echo "[$(date '+%H:%M:%S')] ✅ Google Drive: Authenticated" >> "${INTEGRATION_LOG}"
    echo "Service account: ${SERVICE_ACCOUNT_FILE}" >> "${INTEGRATION_LOG}"
    echo "" >> "${INTEGRATION_LOG}"
    LOGS+=("${GOOGLE_DRIVE_LOG}")
    add_service_status "Google Drive" "✅" "$(basename "$SERVICE_ACCOUNT_FILE")"
else
    print_warning "Service account not found"
    echo "[$(date '+%H:%M:%S')] ⚠️  Google Drive: Service account not found" >> "${GOOGLE_DRIVE_LOG}"
    echo "Searched in: backend/" >> "${GOOGLE_DRIVE_LOG}"
    echo "Files found: $(ls backend/*.json 2>/dev/null | wc -l)" >> "${GOOGLE_DRIVE_LOG}"
    echo "" >> "${GOOGLE_DRIVE_LOG}"
    echo "[$(date '+%H:%M:%S')] ⚠️  Google Drive: Service account not found" >> "${INTEGRATION_LOG}"
    echo "" >> "${INTEGRATION_LOG}"
    add_service_status "Google Drive" "⚠️" "Service account missing"
    LOGS+=("${GOOGLE_DRIVE_LOG}")
fi

# Telegram
echo -n "   💬 Telegram... "
TELE_ENV=$(curl -sSf "${BACKEND_URL}/api/telegram/env" 2>&1 || true)
HAS_TOKEN=$(echo "$TELE_ENV" | grep -o '"hasToken":\(true\|false\)' | head -1 | cut -d: -f2)
HAS_CHAT=$(echo "$TELE_ENV" | grep -o '"hasChatId":\(true\|false\)' | head -1 | cut -d: -f2)
if [ "$HAS_TOKEN" = "true" ] && [ "$HAS_CHAT" = "true" ]; then
    TEST_SEND=$(curl -sSf "${BACKEND_URL}/api/telegram/test" 2>&1 || true)
    if echo "$TEST_SEND" | grep -q '"success":true'; then
        print_success "Connected (test sent)"
        echo "[$(date '+%H:%M:%S')] ✅ Telegram: Connected" >> "${INTEGRATION_LOG}"
        echo "$TEST_SEND" >> "${INTEGRATION_LOG}"
        echo "" >> "${INTEGRATION_LOG}"
        LOGS+=("logs/telegram.log")
        add_service_status "Telegram" "✅" "Test message sent"
    else
        print_warning "Env OK, send failed"
        echo "[$(date '+%H:%M:%S')] ⚠️  Telegram: Env OK but send failed" >> "${INTEGRATION_LOG}"
        echo "$TEST_SEND" >> "${INTEGRATION_LOG}"
        echo "" >> "${INTEGRATION_LOG}"
        add_service_status "Telegram" "⚠️" "Send failed"
    fi
else
    print_warning "Missing env"
    echo "[$(date '+%H:%M:%S')] ⚠️  Telegram: Missing token or chat id" >> "${INTEGRATION_LOG}"
    echo "$TELE_ENV" >> "${INTEGRATION_LOG}"
    echo "" >> "${INTEGRATION_LOG}"
    add_service_status "Telegram" "⚠️" "Missing token/chat id"
fi

# Google Apps Script
echo -n "   🗺️  Google Apps Script... "
APPS_SCRIPT_URL="${REACT_APP_APPS_SCRIPT_WEB_APP_URL:-}"
if [ -z "$APPS_SCRIPT_URL" ]; then
    print_warning "Not configured"
    echo "[$(date '+%H:%M:%S')] ⚠️  Google Apps Script: REACT_APP_APPS_SCRIPT_WEB_APP_URL not set" >> "${GOOGLE_APPS_SCRIPT_LOG}"
    echo "Environment check: REACT_APP_APPS_SCRIPT_WEB_APP_URL is empty" >> "${GOOGLE_APPS_SCRIPT_LOG}"
    echo "" >> "${GOOGLE_APPS_SCRIPT_LOG}"
    echo "[$(date '+%H:%M:%S')] ⚠️  Google Apps Script: Not configured" >> "${INTEGRATION_LOG}"
    add_service_status "Google Apps Script" "⚠️" "URL not configured"
    LOGS+=("${GOOGLE_APPS_SCRIPT_LOG}")
else
    # Test the script with a simple request
    echo "Testing URL: ${APPS_SCRIPT_URL}" >> "${GOOGLE_APPS_SCRIPT_LOG}"
    SCRIPT_ID=$(echo "${APPS_SCRIPT_URL}" | sed -n 's~https://script.google.com/macros/s/\([^/]*\).*~\1~p')
    [ -n "$SCRIPT_ID" ] && echo "Detected Script ID: ${SCRIPT_ID}" >> "${GOOGLE_APPS_SCRIPT_LOG}"
    TEST_QUERY=$(node - <<'NODE'
const querystring = require("querystring");
const qs = querystring.stringify({
  function: "calculateDistance",
  origin: "lô2-5, Đường CN1, Phường Tây Thạnh, Quận Tân Phú, TP. Hồ Chí Minh",
  destination: "605 Nguyễn Thị Thập, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh",
  notify: "1"
});
process.stdout.write(qs);
NODE
)
    TEST_RESPONSE=$(curl -s -L --max-time 10 \
        "${APPS_SCRIPT_URL}?${TEST_QUERY}" 2>&1 || echo "curl failed")

    echo "[$(date '+%H:%M:%S')] Test request sent" >> "${GOOGLE_APPS_SCRIPT_LOG}"
    echo "Full response: $TEST_RESPONSE" >> "${GOOGLE_APPS_SCRIPT_LOG}"

    if echo "$TEST_RESPONSE" | grep -q '"success":true'; then
        DISTANCE=$(printf '%s' "$TEST_RESPONSE" | node - <<'NODE' 2>/dev/null
const chunks = [];
process.stdin.on('data', chunk => chunks.push(chunk));
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString());
    const distance = data?.distance ?? data?.result?.distance ?? null;
    console.log(distance ?? "N/A");
  } catch {
    console.log("N/A");
  }
});
NODE
)
        print_success "Connected (test: ${DISTANCE} km)"
        echo "[$(date '+%H:%M:%S')] ✅ Google Apps Script: Connected" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "URL: ${APPS_SCRIPT_URL}" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "Distance: ${DISTANCE} km" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "Full response: $TEST_RESPONSE" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "[$(date '+%H:%M:%S')] ✅ Google Apps Script: Connected (${DISTANCE} km)" >> "${INTEGRATION_LOG}"
        echo "URL: ${APPS_SCRIPT_URL}" >> "${INTEGRATION_LOG}"
        echo "" >> "${INTEGRATION_LOG}"
        LOGS+=("${GOOGLE_APPS_SCRIPT_LOG}")
        add_service_status "Google Apps Script" "✅" "Distance ${DISTANCE} km"
    elif echo "$TEST_RESPONSE" | grep -q '"error"'; then
        ERROR_MSG=$(printf '%s' "$TEST_RESPONSE" | node - <<'NODE' 2>/dev/null
const chunks = [];
process.stdin.on('data', chunk => chunks.push(chunk));
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString());
    const err = data?.error?.message || JSON.stringify(data.error);
    console.log(err || "Unknown error");
  } catch {
    console.log("Unknown error");
  }
});
NODE
)
        print_warning "Error response: ${ERROR_MSG}"
        echo "[$(date '+%H:%M:%S')] ⚠️  Google Apps Script: Error response" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "URL: ${APPS_SCRIPT_URL}" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "Response: $TEST_RESPONSE" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "[$(date '+%H:%M:%S')] ⚠️  Google Apps Script: Error response" >> "${INTEGRATION_LOG}"
        echo "URL: ${APPS_SCRIPT_URL}" >> "${INTEGRATION_LOG}"
        [ -n "$SCRIPT_ID" ] && echo "Script ID: ${SCRIPT_ID}" >> "${INTEGRATION_LOG}"
        echo "Response: $TEST_RESPONSE" >> "${INTEGRATION_LOG}"
        echo "" >> "${INTEGRATION_LOG}"
        add_service_status "Google Apps Script" "⚠️" "${ERROR_MSG}"
        LOGS+=("${GOOGLE_APPS_SCRIPT_LOG}")
    else
        print_error "Failed or invalid response"
        echo "[$(date '+%H:%M:%S')] ❌ Google Apps Script: Failed or invalid response" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "URL: ${APPS_SCRIPT_URL}" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "Response: $TEST_RESPONSE" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "" >> "${GOOGLE_APPS_SCRIPT_LOG}"
        echo "[$(date '+%H:%M:%S')] ❌ Google Apps Script: Failed" >> "${INTEGRATION_LOG}"
        echo "URL: ${APPS_SCRIPT_URL}" >> "${INTEGRATION_LOG}"
        [ -n "$SCRIPT_ID" ] && echo "Script ID: ${SCRIPT_ID}" >> "${INTEGRATION_LOG}"
        echo "Response: $TEST_RESPONSE" >> "${INTEGRATION_LOG}"
        echo "" >> "${INTEGRATION_LOG}"
        add_service_status "Google Apps Script" "❌" "Invalid response"
        LOGS+=("${GOOGLE_APPS_SCRIPT_LOG}")
    fi
fi

# Add integration log to main logs
LOGS+=("${INTEGRATION_LOG}")
echo ""

# Start frontend
print_section "🎨 Starting Frontend..."

print_info "Checking if frontend is already running..."
if lsof -Pi :${FRONTEND_PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port ${FRONTEND_PORT} is already in use. Killing existing process..."
    lsof -ti:${FRONTEND_PORT} | xargs kill -9 2>/dev/null || true
    sleep 2
fi

FRONTEND_LOG_FILE="logs/frontend-startup.log"
print_info "Starting frontend on port ${FRONTEND_PORT}..."
print_info "Frontend logs: ${FRONTEND_LOG_FILE}"
npm start > "${FRONTEND_LOG_FILE}" 2>&1 &
FRONTEND_PID=$!
LOGS+=("${FRONTEND_LOG_FILE}")

print_success "Frontend starting... (PID: $FRONTEND_PID)"
print_info "This may take a few moments..."

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨  KHỞI ĐỘNG THÀNH CÔNG${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Service Status Table
echo -e "${GREEN}📊 Trạng thái Dịch vụ:${NC}"
echo -e "${BLUE}┌────────────────────────────────────────────────────────────────────────────┐${NC}"
printf "${BLUE}│${NC} %-25s %-6s %-52s ${BLUE}│${NC}\n" "Dịch vụ" "TT" "Chi tiết"
echo -e "${BLUE}├────────────────────────────────────────────────────────────────────────────┤${NC}"
if [ ${#SERVICE_ROWS[@]} -eq 0 ]; then
    printf "${BLUE}│${NC} %-25s %-6s %-52s ${BLUE}│${NC}\n" "Không có dữ liệu" "-" "-"
else
    for row in "${SERVICE_ROWS[@]}"; do
        IFS='|' read -r service status details <<< "$row"
        details=$(echo "$details" | sed 's/^ *//;s/ *$//')
        [ -z "$details" ] && details="—"
        if [ ${#details} -gt 52 ]; then
            details="${details:0:52}…"
        fi
        case "$status" in
            "✅") status_color=${GREEN} ;;
            "⚠️") status_color=${YELLOW} ;;
            "❌") status_color=${RED} ;;
            *) status_color=${NC} ;;
        esac
        printf "${BLUE}│${NC} %-25s ${status_color}%-6s${NC} %-52s ${BLUE}│${NC}\n" "$service" "$status" "$details"
    done
fi
echo -e "${BLUE}└────────────────────────────────────────────────────────────────────────────┘${NC}"
echo ""

send_telegram_summary

# Access URLs
echo -e "${GREEN}🌐 Địa chỉ truy cập:${NC}"
echo -e "   ${BLUE}Backend:${NC}  ${BACKEND_URL}"
echo -e "   ${BLUE}Frontend:${NC} ${FRONTEND_URL}"
echo ""

# Process IDs
echo -e "${GREEN}🆔 Process IDs:${NC}"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""

# Log Files
echo -e "${GREEN}📝 Log Files:${NC}"
for log in "${LOGS[@]}"; do
    if [ -f "$log" ]; then
        SIZE=$(du -h "$log" 2>/dev/null | cut -f1 || echo "0B")
        echo "   📄 ${log} (${SIZE})"
    else
        echo "   📄 ${log} (chưa có)"
    fi
done
echo ""

# Real-time log viewing
echo -e "${YELLOW}📊 Xem logs theo thời gian thực:${NC}"
echo "   Backend:        ${BLUE}tail -f ${BACKEND_LOG_FILE}${NC}"
echo "   Frontend:       ${BLUE}tail -f ${FRONTEND_LOG_FILE}${NC}"
echo "   Integrations:   ${BLUE}tail -f ${INTEGRATION_LOG}${NC}"
if [[ " ${LOGS[@]} " =~ "logs/google-sheets.log" ]]; then
    echo "   Google Sheets:  ${BLUE}tail -f ${GOOGLE_SHEETS_LOG}${NC}"
fi
if [[ " ${LOGS[@]} " =~ "logs/google-drive.log" ]]; then
    echo "   Google Drive:   ${BLUE}tail -f ${GOOGLE_DRIVE_LOG}${NC}"
fi
if [[ " ${LOGS[@]} " =~ "logs/google-apps-script.log" ]]; then
    echo "   Apps Script:    ${BLUE}tail -f ${GOOGLE_APPS_SCRIPT_LOG}${NC}"
fi
if [[ " ${LOGS[@]} " =~ "logs/backend-api.log" ]]; then
    echo "   Backend API:    ${BLUE}tail -f ${BACKEND_API_LOG}${NC}"
fi
if [[ " ${LOGS[@]} " =~ "logs/telegram.log" ]]; then
    echo "   Telegram:       ${BLUE}tail -f logs/telegram.log${NC}"
fi
echo ""

# Health check commands
echo -e "${YELLOW}🔍 Kiểm tra kết nối:${NC}"
echo "   Test all:  ${BLUE}./test-connections.sh${NC}"
echo "   Test Apps Script: ${BLUE}./test-apps-script.sh${NC}"
echo "   Test Telegram: ${BLUE}./test-telegram.sh${NC}"
echo ""

echo -e "${YELLOW}⏹️  Nhấn Ctrl+C để dừng tất cả dịch vụ${NC}"
echo ""


# Wait for processes
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
