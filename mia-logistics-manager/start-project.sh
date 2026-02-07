#!/bin/bash

# MIA Logistics Manager - Start Project Script
# Khởi động dự án từ thư mục gốc

echo "🚀 MIA LOGISTICS MANAGER - KHỞI ĐỘNG DỰ ÁN"
echo "=========================================="

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Kiểm tra package.json
if [ ! -f "package.json" ]; then
    print_error "Vui lòng chạy script này từ thư mục gốc của dự án (mia-logistics-manager)"
    exit 1
fi

print_info "Đang kiểm tra và dọn dẹp các process cũ..."

# Kill tất cả Node.js processes
killall -9 node 2>/dev/null || true
sleep 1

# Giải phóng các port
print_info "Đang giải phóng các port cần thiết..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

sleep 2

print_status "Đã dọn dẹp xong!"

# Kiểm tra node_modules
if [ ! -d "node_modules" ]; then
    print_warning "node_modules không tồn tại. Đang cài đặt dependencies..."
    npm install --legacy-peer-deps
fi

# Khởi động dự án
print_info "Đang khởi động development server..."
print_status "Frontend sẽ chạy tại: http://localhost:3000"
echo ""

npm start
