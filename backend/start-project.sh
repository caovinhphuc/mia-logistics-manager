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
if [ ! -d "backend/node_modules" ]; then
    print_warning "backend/node_modules not found. Installing backend dependencies..."
    (cd backend && npm install)
fi

# Start backend
print_section "📦 Starting Backend Server..."

print_info "Checking if backend is already running..."
if lsof -Pi :${BACKEND_PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port ${BACKEND_PORT} is already in use. Killing existing process..."
    lsof -ti:${BACKEND_PORT} | xargs kill -9 2>/dev/null || true
    sleep 2
fi

print_info "Starting backend on port ${BACKEND_PORT} (backend/index.js)..."
node backend/index.js > logs/backend-startup.log 2>&1 &
BACKEND_PID=$!
print_info "Waiting for backend health..."
RETRIES=20
until curl -sf "${BACKEND_URL}/health" >/dev/null 2>&1; do
    sleep 1
    RETRIES=$((RETRIES-1))
    if [ $RETRIES -le 0 ]; then
        print_error "Backend failed to respond at ${BACKEND_URL}/health"
        [ -f logs/backend-startup.log ] && tail -n 100 logs/backend-startup.log || true
        exit 1
    fi
done
print_success "Backend is healthy at ${BACKEND_URL} (PID: $BACKEND_PID)"

RESULTS=("✅ Backend healthy")

# Start frontend
print_section "🎨 Starting Frontend..."

print_info "Checking if frontend is already running..."
if lsof -Pi :${FRONTEND_PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
    print_warning "Port ${FRONTEND_PORT} is already in use. Killing existing process..."
    lsof -ti:${FRONTEND_PORT} | xargs kill -9 2>/dev/null || true
    sleep 2
fi

print_info "Starting frontend on port ${FRONTEND_PORT}..."
npm start > logs/frontend-startup.log 2>&1 &
FRONTEND_PID=$!

print_success "Frontend starting... (PID: $FRONTEND_PID)"
print_info "This may take a few moments..."

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨  STARTUP COMPLETED${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}📊 Service Status:${NC}"
for result in "${RESULTS[@]}"; do
    echo "   $result"
done

echo ""
echo -e "${GREEN}🌐 Access URLs:${NC}"
echo -e "   Backend:  ${BLUE}${BACKEND_URL}${NC}"
echo -e "   Frontend: ${BLUE}${FRONTEND_URL}${NC}"

echo ""
echo -e "${GREEN}🆔 Process IDs:${NC}"
echo "   Backend:  $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"

echo ""
echo -e "${YELLOW}📝 Logs:${NC}"
echo "   Backend:  logs/backend-startup.log"
echo "   Frontend: logs/frontend-startup.log"

echo ""
echo -e "${YELLOW}⏹️  Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
