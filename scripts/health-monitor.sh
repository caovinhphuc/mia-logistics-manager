#!/bin/bash

###############################################################################
# Health Monitoring Script
#
# Monitor health của tất cả services
# Usage: ./scripts/health-monitor.sh [--interval 30]
###############################################################################

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default interval (seconds)
INTERVAL=30

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --interval)
      INTERVAL="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if service is running
check_service() {
  local name=$1
  local url=$2

  if curl -s "$url" > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} $name"
    return 0
  else
    echo -e "${RED}❌${NC} $name"
    return 1
  fi
}

# Check service with JSON response
check_service_json() {
  local name=$1
  local url=$2

  response=$(curl -s "$url" 2>/dev/null)

  if [ $? -eq 0 ] && [ -n "$response" ]; then
    echo -e "${GREEN}✅${NC} $name"
    if command -v jq &> /dev/null; then
      echo "$response" | jq . 2>/dev/null | head -5
    fi
    return 0
  else
    echo -e "${RED}❌${NC} $name - Not responding"
    return 1
  fi
}

# Monitor loop
echo -e "${BLUE}🏥 Health Monitor Started${NC}"
echo -e "Checking every ${INTERVAL} seconds. Press Ctrl+C to stop.\n"

while true; do
  clear
  echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
  echo -e "${BLUE}    MIA LOGISTICS HEALTH MONITOR${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
  echo -e "$(date '+%Y-%m-%d %H:%M:%S')\n"

  # Check Frontend
  echo -e "${YELLOW}Frontend (Port 3000):${NC}"
  check_service "React App" "http://localhost:3000"
  echo ""

  # Check Backend
  echo -e "${YELLOW}Backend API (Port 5050):${NC}"
  check_service_json "Health Endpoint" "http://localhost:5050/api/health"
  echo ""

  # Check Google Sheets Connection
  echo -e "${YELLOW}Google Sheets Integration:${NC}"
  check_service_json "Sheets Auth Status" "http://localhost:5050/api/google-sheets-auth/status"
  echo ""

  # Check AI Service (Optional)
  echo -e "${YELLOW}AI Service (Port 8000) - Optional:${NC}"
  check_service "AI Service" "http://localhost:8000" || echo -e "${YELLOW}⚠️${NC}  Not running (optional)"
  echo ""

  # System Info
  echo -e "${YELLOW}System Info:${NC}"
  echo -e "CPU: $(top -l 1 | grep "CPU usage" | awk '{print $3}' || echo "N/A")"
  echo -e "Memory: $(top -l 1 | grep "PhysMem" | awk '{print $2}' || echo "N/A")"
  echo ""

  # Process Info
  echo -e "${YELLOW}Running Processes:${NC}"
  if pgrep -f "react-scripts" > /dev/null; then
    echo -e "${GREEN}✅${NC} Frontend process running"
  else
    echo -e "${RED}❌${NC} Frontend process not found"
  fi

  if pgrep -f "node.*server.cjs" > /dev/null; then
    echo -e "${GREEN}✅${NC} Backend process running"
  else
    echo -e "${RED}❌${NC} Backend process not found"
  fi

  echo -e "\n${BLUE}Next check in ${INTERVAL}s...${NC}"
  sleep "$INTERVAL"
done

