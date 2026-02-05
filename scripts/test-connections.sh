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
test_connection "http://localhost:3000" "Frontend (React)" "200"
echo ""

# Test Backend (Port 5050)
echo -e "${BLUE}Backend Services${NC}"
echo "----------------"
test_connection "http://localhost:5050" "Backend API" "200"
test_api_endpoint "http://localhost:5050/health" "Health Check"
test_api_endpoint "http://localhost:5050/api/inboundinternational" "Inbound International"
test_api_endpoint "http://localhost:5050/api/inbounddomestic" "Inbound Domestic"
echo ""

# (Bỏ qua Custom API Endpoints vì chưa triển khai)

# Test AI Service (Port 8000) - Optional
echo -e "${BLUE}AI Services (Optional)${NC}"
echo "----------------------"
if test_connection "http://localhost:8000" "AI Service" "200"; then
    test_api_endpoint "http://localhost:8000/health" "AI Health Check"
else
    echo -e "${YELLOW}⚠️  AI Service not running (optional)${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}Connection Summary${NC}"
echo "=================="

# Count successful connections
frontend_status=$(curl -s -f "http://localhost:3000" > /dev/null 2>&1 && echo "✅" || echo "❌")
backend_status=$(curl -s -f "http://localhost:5050/health" > /dev/null 2>&1 && echo "✅" || echo "❌")
ai_status=$(curl -s -f "http://localhost:8000" > /dev/null 2>&1 && echo "✅" || echo "❌")

echo "Frontend (3000): $frontend_status"
echo "Backend (5050):  $backend_status"
echo "AI Service (8000): $ai_status"
echo ""

# Final status
if [ "$frontend_status" = "✅" ] && [ "$backend_status" = "✅" ]; then
    echo -e "${GREEN}🎉 All core services are running!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some services are not running. Check the logs above.${NC}"
    exit 1
fi
