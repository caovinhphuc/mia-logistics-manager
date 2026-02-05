#!/bin/bash

# Test Connections Script
# Tests all service connections for MIA Logistics Manager

echo "🔌 MIA Logistics Manager - Connection Test"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Summary helpers
SUMMARY_LABELS=()
SUMMARY_STATUS=()
SUMMARY_NOTES=()

add_summary() {
    local label=$1
    local status=$2
    local note=${3:-""}
    SUMMARY_LABELS+=("$label")
    SUMMARY_STATUS+=("$status")
    SUMMARY_NOTES+=("$note")
}

print_summary_table() {
    local max_label=0
    for label in "${SUMMARY_LABELS[@]}"; do
        if [ ${#label} -gt $max_label ]; then
            max_label=${#label}
        fi
    done
    local label_width=$((max_label > 20 ? max_label : 20))

    printf "%-${label_width}s | %-4s | %s\n" "Service" "Stat" "Notes"
    printf "%-${label_width}s-+-%-4s-+-%s\n" "$(printf '%0.s-' $(seq 1 $label_width))" "----" "------------------------------"

    for i in "${!SUMMARY_LABELS[@]}"; do
        local label=${SUMMARY_LABELS[$i]}
        local status=${SUMMARY_STATUS[$i]}
        local note=${SUMMARY_NOTES[$i]}
        printf "%-${label_width}s | %-4s | %s\n" "$label" "$status" "$note"
    done
}

# Function to test connection
test_connection() {
    local url=$1
    local service_name=$2
    local expected_status=$3

    echo -n "Testing $service_name... "

    if curl -s -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Connected${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed${NC}"
        return 1
    fi
}

# Function to test API endpoint
test_api_endpoint() {
    local url=$1
    local service_name=$2

    echo -n "Testing $service_name API... "

    response=$(curl -s -w "%{http_code}" "$url" -o /dev/null)

    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ OK (200)${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed ($response)${NC}"
        return 1
    fi
}

# Test Frontend (Port 3000)
echo -e "${BLUE}Frontend Services${NC}"
echo "----------------"
if test_connection "http://localhost:3000" "Frontend (React)" "200"; then
    add_summary "Frontend (3000)" "✅" "Reachable"
else
    add_summary "Frontend (3000)" "❌" "Unavailable"
fi
echo ""

# Test Backend (Port 5050)
echo -e "${BLUE}Backend Services${NC}"
echo "----------------"
if test_connection "http://localhost:5050" "Backend API" "200"; then
    add_summary "Backend (5050)" "✅" "Reachable"
else
    add_summary "Backend (5050)" "❌" "Unavailable"
fi
if test_api_endpoint "http://localhost:5050/health" "Health Check"; then
    add_summary "Health API" "✅" "200 OK"
else
    add_summary "Health API" "❌" "Non-200"
fi
if test_api_endpoint "http://localhost:5050/api/inboundinternational" "Inbound International"; then
    add_summary "Inbound International" "✅" "200 OK"
else
    add_summary "Inbound International" "❌" "Non-200"
fi
if test_api_endpoint "http://localhost:5050/api/inbounddomestic" "Inbound Domestic"; then
    add_summary "Inbound Domestic" "✅" "200 OK"
else
    add_summary "Inbound Domestic" "❌" "Non-200"
fi
echo ""

# Test Integrations
echo -e "${BLUE}Integration Services${NC}"
echo "----------------------"

# Google Sheets
echo -n "Testing Google Sheets... "
SHEETS_RESP=$(curl -s -f "http://localhost:5050/api/sheets/info" 2>&1 || true)
if echo "$SHEETS_RESP" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Connected${NC}"
    add_summary "Google Sheets" "✅" "success:true"
else
    echo -e "${RED}❌ Failed${NC}"
    add_summary "Google Sheets" "❌" "No success flag"
fi

# Telegram
echo -n "Testing Telegram... "
TELE_ENV=$(curl -s -f "http://localhost:5050/api/telegram/env" 2>&1 || true)
if echo "$TELE_ENV" | grep -q '"hasToken":true'; then
    echo -e "${GREEN}✅ Configured${NC}"
    add_summary "Telegram" "✅" "Token present"
else
    echo -e "${YELLOW}⚠️  Not configured${NC}"
    add_summary "Telegram" "⚠️" "Missing token"
fi

# Google Apps Script
echo -n "Testing Google Apps Script... "
if [ -n "${REACT_APP_APPS_SCRIPT_WEB_APP_URL:-}" ]; then
    APPS_SCRIPT_RESP=$(curl -s -L --max-time 5 --get \
        --data-urlencode "origin=Ho Chi Minh City" \
        --data-urlencode "destination=Hanoi" \
        "${REACT_APP_APPS_SCRIPT_WEB_APP_URL}" 2>&1 || true)
    if echo "$APPS_SCRIPT_RESP" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Connected${NC}"
        add_summary "Apps Script" "✅" "success:true"
    else
        echo -e "${RED}❌ Failed${NC}"
        add_summary "Apps Script" "❌" "Response error"
    fi
else
    echo -e "${YELLOW}⚠️  Not configured${NC}"
    add_summary "Apps Script" "⚠️" "URL missing"
fi
echo ""

# (Bỏ qua Custom API Endpoints vì chưa triển khai)

# Test AI Service (Port 8000) - Optional
echo -e "${BLUE}AI Services (Optional)${NC}"
echo "----------------------"
if test_connection "http://localhost:8000" "AI Service" "200"; then
    add_summary "AI Service (8000)" "✅" "Reachable"
    if test_api_endpoint "http://localhost:8000/health" "AI Health Check"; then
        add_summary "AI Health API" "✅" "200 OK"
    else
        add_summary "AI Health API" "❌" "Non-200"
    fi
else
    echo -e "${YELLOW}⚠️  AI Service not running (optional)${NC}"
    add_summary "AI Service (8000)" "⚠️" "Optional service down"
fi
echo ""

# Summary
echo -e "${BLUE}Connection Summary${NC}"
echo "=================="
print_summary_table

# Final status
CORE_OK=true
for i in "${!SUMMARY_LABELS[@]}"; do
    label=${SUMMARY_LABELS[$i]}
    status=${SUMMARY_STATUS[$i]}
    if [[ "$label" == "Frontend (3000)" || "$label" == "Backend (5050)" ]]; then
        if [ "$status" != "✅" ]; then
            CORE_OK=false
        fi
    fi
done

if [ "$CORE_OK" = true ]; then
    echo -e "${GREEN}🎉 All core services are running!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some core services are not running. Check the summary above.${NC}"
    exit 1
fi
