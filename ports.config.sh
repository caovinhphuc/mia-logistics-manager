#!/bin/bash

# ============================================================================
# PORTS CONFIGURATION - MIA LOGISTICS MANAGER
# ============================================================================
# File này chứa cấu hình ports chung cho tất cả scripts
# Source file này trong các scripts khác: source ./ports.config.sh

# Service Ports
export FRONTEND_PORT=3000
export BACKEND_PORT=5050
export AI_SERVICE_PORT=8000
export GOOGLE_SHEETS_PORT=5050  # Same as BACKEND_PORT

# URLs
export FRONTEND_URL="http://localhost:${FRONTEND_PORT}"
export BACKEND_URL="http://localhost:${BACKEND_PORT}"
export AI_SERVICE_URL="http://localhost:${AI_SERVICE_PORT}"

# Service Names (for display)
export FRONTEND_NAME="Frontend (React)"
export BACKEND_NAME="Backend API"
export AI_SERVICE_NAME="AI Service (Python)"

# Colors for terminal output
export COLOR_GREEN='\033[0;32m'
export COLOR_BLUE='\033[0;34m'
export COLOR_YELLOW='\033[1;33m'
export COLOR_RED='\033[0;31m'
export COLOR_CYAN='\033[0;36m'
export COLOR_NC='\033[0m'  # No Color

# Display current configuration
show_ports_config() {
    echo ""
    echo -e "${COLOR_CYAN}╔═══════════════════════════════════════════════════════════╗${COLOR_NC}"
    echo -e "${COLOR_CYAN}║            PORTS CONFIGURATION                            ║${COLOR_NC}"
    echo -e "${COLOR_CYAN}╠═══════════════════════════════════════════════════════════╣${COLOR_NC}"
    echo -e "${COLOR_CYAN}║${COLOR_NC}  ${FRONTEND_NAME}:        Port ${FRONTEND_PORT}                ${COLOR_CYAN}║${COLOR_NC}"
    echo -e "${COLOR_CYAN}║${COLOR_NC}     → ${FRONTEND_URL}                      ${COLOR_CYAN}║${COLOR_NC}"
    echo -e "${COLOR_CYAN}║${COLOR_NC}                                                           ${COLOR_CYAN}║${COLOR_NC}"
    echo -e "${COLOR_CYAN}║${COLOR_NC}  ${BACKEND_NAME}:             Port ${BACKEND_PORT}                ${COLOR_CYAN}║${COLOR_NC}"
    echo -e "${COLOR_CYAN}║${COLOR_NC}     → ${BACKEND_URL}                      ${COLOR_CYAN}║${COLOR_NC}"
    echo -e "${COLOR_CYAN}║${COLOR_NC}                                                           ${COLOR_CYAN}║${COLOR_NC}"
    echo -e "${COLOR_CYAN}║${COLOR_NC}  ${AI_SERVICE_NAME}:  Port ${AI_SERVICE_PORT}                ${COLOR_CYAN}║${COLOR_NC}"
    echo -e "${COLOR_CYAN}║${COLOR_NC}     → ${AI_SERVICE_URL}                      ${COLOR_CYAN}║${COLOR_NC}"
    echo -e "${COLOR_CYAN}╚═══════════════════════════════════════════════════════════╝${COLOR_NC}"
    echo ""
}

# Function to kill process on specific port
kill_port() {
    local port=$1
    local service_name=$2
    local pid=$(lsof -ti:$port 2>/dev/null)

    if [ ! -z "$pid" ]; then
        echo -e "${COLOR_YELLOW}⚠️  Killing ${service_name} on port ${port} (PID: ${pid})${COLOR_NC}"
        kill -9 $pid 2>/dev/null
        sleep 1
        echo -e "${COLOR_GREEN}✅ Port ${port} freed${COLOR_NC}"
    else
        echo -e "${COLOR_BLUE}ℹ️  Port ${port} is already free${COLOR_NC}"
    fi
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -i:$port > /dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to wait for service to start
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_wait=30
    local count=0

    echo -e "${COLOR_BLUE}⏳ Waiting for ${service_name} to start on port ${port}...${COLOR_NC}"

    while [ $count -lt $max_wait ]; do
        if check_port $port; then
            echo -e "${COLOR_GREEN}✅ ${service_name} is running on port ${port}${COLOR_NC}"
            return 0
        fi
        sleep 1
        count=$((count + 1))
        echo -n "."
    done

    echo ""
    echo -e "${COLOR_RED}❌ ${service_name} failed to start on port ${port} after ${max_wait}s${COLOR_NC}"
    return 1
}

# Export functions for use in other scripts
export -f kill_port
export -f check_port
export -f wait_for_service
export -f show_ports_config

