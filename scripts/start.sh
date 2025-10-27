#!/bin/bash

# ============================================================================
# MIA LOGISTICS MANAGER - QUICK START SCRIPT
# ============================================================================

# Load ports configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/ports.config.sh"

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║     🚀 MIA LOGISTICS MANAGER - QUICK START               ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Show current ports configuration
show_ports_config

# Clean up old processes
echo -e "${COLOR_BLUE}🧹 Cleaning up old processes...${COLOR_NC}"
kill_port ${FRONTEND_PORT} "Frontend"
kill_port ${BACKEND_PORT} "Backend"
kill_port 8080 "Old Vite Process"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${COLOR_YELLOW}📦 Installing frontend dependencies...${COLOR_NC}"
    npm install --legacy-peer-deps
fi

# Check if backend node_modules exists
if [ ! -d "backend/node_modules" ]; then
    echo -e "${COLOR_YELLOW}📦 Installing backend dependencies...${COLOR_NC}"
    cd backend
    npm install
    cd ..
fi

echo ""
echo -e "${COLOR_GREEN}✅ Setup complete!${COLOR_NC}"
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  Starting Services:                                       ║"
echo "║  🌐 ${FRONTEND_NAME}:  ${FRONTEND_URL}                    ║"
echo "║  🔧 ${BACKEND_NAME}:   ${BACKEND_URL}                     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Start Backend in background
echo -e "${COLOR_BLUE}🚀 Starting ${BACKEND_NAME} (Port ${BACKEND_PORT})...${COLOR_NC}"
cd backend
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
wait_for_service ${BACKEND_PORT} "${BACKEND_NAME}"
if [ $? -eq 0 ]; then
    echo -e "${COLOR_BLUE}   Health: ${BACKEND_URL}/health${COLOR_NC}"
else
    echo -e "${COLOR_RED}❌ Backend failed to start. Check logs/backend.log${COLOR_NC}"
fi

echo ""

# Start Frontend
echo -e "${COLOR_BLUE}🚀 Starting ${FRONTEND_NAME} (Port ${FRONTEND_PORT})...${COLOR_NC}"
echo -e "${COLOR_YELLOW}   Press Ctrl+C to stop both services${COLOR_NC}"
echo ""

# Start frontend (this will run in foreground)
npm start

# When frontend stops (Ctrl+C), kill backend too
echo ""
echo -e "${COLOR_YELLOW}🛑 Stopping services...${COLOR_NC}"
kill $BACKEND_PID 2>/dev/null
kill_port ${BACKEND_PORT} "Backend"

echo -e "${COLOR_GREEN}✅ All services stopped.${COLOR_NC}"

