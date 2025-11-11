#!/bin/bash

# =============================================================================
# 🚀 REACT OAS INTEGRATION PROJECT LAUNCHER
# =============================================================================
# Script chuyên nghiệp để khởi động các dự án theo thứ tự logic
# Tác giả: AI Assistant
# Phiên bản: 1.0.0
# =============================================================================

# Màu sắc cho terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Biến toàn cục
MAIN_PROJECT_DIR="main-project"
GOOGLE_SHEETS_DIR="google-sheets-project"
SHARED_SERVICES_DIR="shared-services"
LOG_DIR="logs"

# PID files để quản lý processes
MAIN_BACKEND_PID=""
MAIN_AI_PID=""
MAIN_FRONTEND_PID=""
GOOGLE_BACKEND_PID=""
GOOGLE_FRONTEND_PID=""

# =============================================================================
# 🎨 FUNCTIONS - UI & DISPLAY
# =============================================================================

print_header() {
    clear
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                    🚀 REACT OAS INTEGRATION PROJECT LAUNCHER                ║"
    echo "║                              Phiên bản 1.0.0                                ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_menu() {
    echo -e "${WHITE}📋 MENU CHÍNH:${NC}"
    echo -e "${GREEN}  1.${NC} 🎯 Khởi động dự án chính (AI-Powered Analytics)"
    echo -e "${GREEN}  2.${NC} 📊 Khởi động dự án Google Sheets"
    echo -e "${GREEN}  3.${NC} 🔥 Khởi động tất cả dự án (Full Stack)"
    echo -e "${GREEN}  4.${NC} 🔧 Khởi động riêng Backend (Main Project)"
    echo -e "${GREEN}  5.${NC} 🤖 Khởi động riêng AI Service"
    echo -e "${GREEN}  6.${NC} 🎨 Khởi động riêng Frontend (Main Project)"
    echo -e "${GREEN}  7.${NC} 📊 Khởi động riêng Google Sheets Backend"
    echo -e "${GREEN}  8.${NC} 📋 Khởi động riêng Google Sheets Frontend"
    echo -e "${GREEN}  9.${NC} 🔧 Kiểm tra trạng thái dịch vụ"
    echo -e "${GREEN} 10.${NC} 🛑 Dừng tất cả dịch vụ"
    echo -e "${GREEN} 11.${NC} 📊 Xem logs"
    echo -e "${GREEN} 12.${NC} 🧪 Test kết nối"
    echo -e "${GREEN} 13.${NC} 📋 Thông tin dự án"
    echo -e "${GREEN} 14.${NC} 🚪 Thoát"
    echo ""
}

print_status() {
    echo -e "${BLUE}📊 TRẠNG THÁI DỊCH VỤ:${NC}"
    echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"

    # Kiểm tra Main Project
    if [ -f "$LOG_DIR/main-backend.pid" ] && kill -0 $(cat "$LOG_DIR/main-backend.pid") 2>/dev/null; then
        echo -e "${CYAN}│${NC} 🎯 Main Backend    ${GREEN}✅ RUNNING${NC} (Port 3001)                    ${CYAN}│${NC}"
    else
        echo -e "${CYAN}│${NC} 🎯 Main Backend    ${RED}❌ STOPPED${NC} (Port 3001)                    ${CYAN}│${NC}"
    fi

    if [ -f "$LOG_DIR/main-ai.pid" ] && kill -0 $(cat "$LOG_DIR/main-ai.pid") 2>/dev/null; then
        echo -e "${CYAN}│${NC} 🤖 AI Service      ${GREEN}✅ RUNNING${NC} (Port 8000)                    ${CYAN}│${NC}"
    else
        echo -e "${CYAN}│${NC} 🤖 AI Service      ${RED}❌ STOPPED${NC} (Port 8000)                    ${CYAN}│${NC}"
    fi

    if [ -f "$LOG_DIR/main-frontend.pid" ] && kill -0 $(cat "$LOG_DIR/main-frontend.pid") 2>/dev/null; then
        echo -e "${CYAN}│${NC} 🎨 Main Frontend  ${GREEN}✅ RUNNING${NC} (Port 3000)                    ${CYAN}│${NC}"
    else
        echo -e "${CYAN}│${NC} 🎨 Main Frontend  ${RED}❌ STOPPED${NC} (Port 3000)                    ${CYAN}│${NC}"
    fi

    # Kiểm tra Google Sheets Project
    if [ -f "$LOG_DIR/google-backend.pid" ] && kill -0 $(cat "$LOG_DIR/google-backend.pid") 2>/dev/null; then
        echo -e "${CYAN}│${NC} 📊 Google Backend ${GREEN}✅ RUNNING${NC} (Port 3003)                    ${CYAN}│${NC}"
    else
        echo -e "${CYAN}│${NC} 📊 Google Backend ${RED}❌ STOPPED${NC} (Port 3003)                    ${CYAN}│${NC}"
    fi

    if [ -f "$LOG_DIR/google-frontend.pid" ] && kill -0 $(cat "$LOG_DIR/google-frontend.pid") 2>/dev/null; then
        echo -e "${CYAN}│${NC} 📋 Google Frontend${GREEN}✅ RUNNING${NC} (Port 3002)                    ${CYAN}│${NC}"
    else
        echo -e "${CYAN}│${NC} 📋 Google Frontend${RED}❌ STOPPED${NC} (Port 3002)                    ${CYAN}│${NC}"
    fi

    echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
    echo ""
}

print_urls() {
    echo -e "${PURPLE}🌐 TRUY CẬP ỨNG DỤNG:${NC}"
    echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC} 🎯 Main Project:     ${BLUE}http://localhost:3000${NC}                    ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC} 📊 Google Sheets:    ${BLUE}http://localhost:3002${NC}                    ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC} 🔧 Main API:         ${BLUE}http://localhost:3001${NC}                    ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC} 🤖 AI Service:       ${BLUE}http://localhost:8000${NC}                    ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC} 📋 Google API:       ${BLUE}http://localhost:3003${NC}                    ${CYAN}│${NC}"
    echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
    echo ""
}

# =============================================================================
# 🔧 FUNCTIONS - SYSTEM UTILITIES
# =============================================================================

check_dependencies() {
    echo -e "${YELLOW}🔍 Kiểm tra dependencies...${NC}"

    # Kiểm tra Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js chưa được cài đặt!${NC}"
        return 1
    fi

    # Kiểm tra Python3
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}❌ Python3 chưa được cài đặt!${NC}"
        return 1
    fi

    # Kiểm tra npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm chưa được cài đặt!${NC}"
        return 1
    fi

    echo -e "${GREEN}✅ Tất cả dependencies đã sẵn sàng!${NC}"
    return 0
}

check_ports() {
    echo -e "${YELLOW}🔍 Kiểm tra ports...${NC}"

    local ports=(3000 3001 3002 3003 8000)
    local occupied_ports=()

    for port in "${ports[@]}"; do
        if lsof -i :$port &> /dev/null; then
            occupied_ports+=($port)
        fi
    done

    if [ ${#occupied_ports[@]} -gt 0 ]; then
        echo -e "${RED}❌ Các ports sau đang được sử dụng: ${occupied_ports[*]}${NC}"
        echo -e "${YELLOW}💡 Sử dụng option 5 để dừng tất cả dịch vụ${NC}"
        return 1
    fi

    echo -e "${GREEN}✅ Tất cả ports đã sẵn sàng!${NC}"
    return 0
}

create_log_dir() {
    if [ ! -d "$LOG_DIR" ]; then
        mkdir -p "$LOG_DIR"
        echo -e "${GREEN}✅ Đã tạo thư mục logs${NC}"
    fi
}

# =============================================================================
# 🚀 FUNCTIONS - PROJECT LAUNCHERS
# =============================================================================

start_main_backend() {
    echo -e "${BLUE}🔧 Khởi động Main Backend...${NC}"
    cd "$MAIN_PROJECT_DIR/backend"

    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Không tìm thấy package.json trong backend${NC}"
        return 1
    fi

    npm install --silent
    nohup node src/server.js > "../../$LOG_DIR/main-backend.log" 2>&1 &
    echo $! > "../../$LOG_DIR/main-backend.pid"

    sleep 2
    if kill -0 $! 2>/dev/null; then
        echo -e "${GREEN}✅ Main Backend đã khởi động (PID: $!)${NC}"
    else
        echo -e "${RED}❌ Main Backend khởi động thất bại${NC}"
        return 1
    fi

    cd - > /dev/null
}

start_main_ai() {
    echo -e "${BLUE}🤖 Khởi động AI Service...${NC}"
    cd "$MAIN_PROJECT_DIR/ai-service"

    if [ ! -f "requirements.txt" ]; then
        echo -e "${RED}❌ Không tìm thấy requirements.txt trong ai-service${NC}"
        return 1
    fi

    pip install -r requirements.txt --quiet
    nohup python3 main.py > "../../$LOG_DIR/main-ai.log" 2>&1 &
    echo $! > "../../$LOG_DIR/main-ai.pid"

    sleep 3
    if kill -0 $! 2>/dev/null; then
        echo -e "${GREEN}✅ AI Service đã khởi động (PID: $!)${NC}"
    else
        echo -e "${RED}❌ AI Service khởi động thất bại${NC}"
        return 1
    fi

    cd - > /dev/null
}

start_main_frontend() {
    echo -e "${BLUE}🎨 Khởi động Main Frontend...${NC}"
    cd "$MAIN_PROJECT_DIR"

    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Không tìm thấy package.json trong main-project${NC}"
        return 1
    fi

    npm install --legacy-peer-deps --silent
    nohup npm start > "../$LOG_DIR/main-frontend.log" 2>&1 &
    echo $! > "../$LOG_DIR/main-frontend.pid"

    sleep 5
    if kill -0 $! 2>/dev/null; then
        echo -e "${GREEN}✅ Main Frontend đã khởi động (PID: $!)${NC}"
    else
        echo -e "${RED}❌ Main Frontend khởi động thất bại${NC}"
        return 1
    fi

    cd - > /dev/null
}

start_google_backend() {
    echo -e "${BLUE}📊 Khởi động Google Sheets Backend...${NC}"
    cd "$GOOGLE_SHEETS_DIR"

    if [ ! -f "server.js" ]; then
        echo -e "${RED}❌ Không tìm thấy server.js trong google-sheets-project${NC}"
        return 1
    fi

    npm install --legacy-peer-deps --silent
    nohup node server.js > "../$LOG_DIR/google-backend.log" 2>&1 &
    echo $! > "../$LOG_DIR/google-backend.pid"

    sleep 2
    if kill -0 $! 2>/dev/null; then
        echo -e "${GREEN}✅ Google Backend đã khởi động (PID: $!)${NC}"
    else
        echo -e "${RED}❌ Google Backend khởi động thất bại${NC}"
        return 1
    fi

    cd - > /dev/null
}

start_google_frontend() {
    echo -e "${BLUE}📋 Khởi động Google Sheets Frontend...${NC}"
    cd "$GOOGLE_SHEETS_DIR"

    if [ ! -f "package.json" ]; then
        echo -e "${RED}❌ Không tìm thấy package.json trong google-sheets-project${NC}"
        return 1
    fi

    PORT=3002 nohup npm start > "../$LOG_DIR/google-frontend.log" 2>&1 &
    echo $! > "../$LOG_DIR/google-frontend.pid"

    sleep 5
    if kill -0 $! 2>/dev/null; then
        echo -e "${GREEN}✅ Google Frontend đã khởi động (PID: $!)${NC}"
    else
        echo -e "${RED}❌ Google Frontend khởi động thất bại${NC}"
        return 1
    fi

    cd - > /dev/null
}

# =============================================================================
# 🎯 MAIN FUNCTIONS
# =============================================================================

launch_main_project() {
    echo -e "${PURPLE}🎯 KHỞI ĐỘNG DỰ ÁN CHÍNH (AI-Powered Analytics)${NC}"
    echo -e "${CYAN}======================================================${NC}"

    if ! check_dependencies || ! check_ports; then
        return 1
    fi

    create_log_dir

    echo -e "${YELLOW}📋 Thứ tự khởi động: Backend → AI Service → Frontend${NC}"
    echo ""

    # Khởi động theo thứ tự
    start_main_backend
    sleep 2
    start_main_ai
    sleep 2
    start_main_frontend

    echo ""
    echo -e "${GREEN}🎉 DỰ ÁN CHÍNH ĐÃ KHỞI ĐỘNG THÀNH CÔNG!${NC}"
    print_urls
}

launch_google_project() {
    echo -e "${PURPLE}📊 KHỞI ĐỘNG DỰ ÁN GOOGLE SHEETS${NC}"
    echo -e "${CYAN}====================================${NC}"

    if ! check_dependencies || ! check_ports; then
        return 1
    fi

    create_log_dir

    echo -e "${YELLOW}📋 Thứ tự khởi động: Backend → Frontend${NC}"
    echo ""

    # Khởi động theo thứ tự
    start_google_backend
    sleep 2
    start_google_frontend

    echo ""
    echo -e "${GREEN}🎉 DỰ ÁN GOOGLE SHEETS ĐÃ KHỞI ĐỘNG THÀNH CÔNG!${NC}"
    print_urls
}

launch_all_projects() {
    echo -e "${PURPLE}🔥 KHỞI ĐỘNG TẤT CẢ DỰ ÁN (Full Stack)${NC}"
    echo -e "${CYAN}========================================${NC}"

    if ! check_dependencies || ! check_ports; then
        return 1
    fi

    create_log_dir

    echo -e "${YELLOW}📋 Thứ tự khởi động: Main Backend → AI Service → Google Backend → Main Frontend → Google Frontend${NC}"
    echo ""

    # Khởi động theo thứ tự logic
    start_main_backend
    sleep 2
    start_main_ai
    sleep 2
    start_google_backend
    sleep 2
    start_main_frontend
    sleep 3
    start_google_frontend

    echo ""
    echo -e "${GREEN}🎉 TẤT CẢ DỰ ÁN ĐÃ KHỞI ĐỘNG THÀNH CÔNG!${NC}"
    print_urls
}

stop_all_services() {
    echo -e "${RED}🛑 DỪNG TẤT CẢ DỊCH VỤ${NC}"
    echo -e "${CYAN}======================${NC}"

    local pids=()

    # Thu thập tất cả PID files
    for pid_file in "$LOG_DIR"/*.pid; do
        if [ -f "$pid_file" ]; then
            local pid=$(cat "$pid_file")
            if kill -0 "$pid" 2>/dev/null; then
                pids+=("$pid")
            fi
            rm -f "$pid_file"
        fi
    done

    # Dừng tất cả processes
    if [ ${#pids[@]} -gt 0 ]; then
        echo -e "${YELLOW}📋 Đang dừng ${#pids[@]} dịch vụ...${NC}"
        for pid in "${pids[@]}"; do
            kill -TERM "$pid" 2>/dev/null
            sleep 1
            if kill -0 "$pid" 2>/dev/null; then
                kill -KILL "$pid" 2>/dev/null
            fi
        done
        echo -e "${GREEN}✅ Đã dừng tất cả dịch vụ${NC}"
    else
        echo -e "${YELLOW}⚠️  Không có dịch vụ nào đang chạy${NC}"
    fi

    # Dừng các processes có thể còn sót lại
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f "python.*main.py" 2>/dev/null
    pkill -f "npm start" 2>/dev/null

    echo -e "${GREEN}🎉 Hoàn thành dừng tất cả dịch vụ!${NC}"
}

show_logs() {
    echo -e "${PURPLE}📊 XEM LOGS${NC}"
    echo -e "${CYAN}===========${NC}"

    if [ ! -d "$LOG_DIR" ]; then
        echo -e "${YELLOW}⚠️  Thư mục logs chưa tồn tại${NC}"
        return
    fi

    echo -e "${WHITE}📋 Chọn log để xem:${NC}"
    echo -e "${GREEN}  1.${NC} Main Backend"
    echo -e "${GREEN}  2.${NC} AI Service"
    echo -e "${GREEN}  3.${NC} Main Frontend"
    echo -e "${GREEN}  4.${NC} Google Backend"
    echo -e "${GREEN}  5.${NC} Google Frontend"
    echo -e "${GREEN}  6.${NC} Tất cả logs"
    echo ""

    read -p "Nhập lựa chọn (1-6): " log_choice

    case $log_choice in
        1) tail -f "$LOG_DIR/main-backend.log" ;;
        2) tail -f "$LOG_DIR/main-ai.log" ;;
        3) tail -f "$LOG_DIR/main-frontend.log" ;;
        4) tail -f "$LOG_DIR/google-backend.log" ;;
        5) tail -f "$LOG_DIR/google-frontend.log" ;;
        6)
            echo -e "${YELLOW}📋 Tất cả logs (Ctrl+C để thoát):${NC}"
            tail -f "$LOG_DIR"/*.log
            ;;
        *) echo -e "${RED}❌ Lựa chọn không hợp lệ${NC}" ;;
    esac
}

test_connections() {
    echo -e "${PURPLE}🧪 TEST KẾT NỐI${NC}"
    echo -e "${CYAN}================${NC}"

    local services=(
        "Main Backend:http://localhost:3001/api/health"
        "AI Service:http://localhost:8000/health"
        "Google Backend:http://localhost:3003/api/health"
    )

    for service in "${services[@]}"; do
        local name=$(echo "$service" | cut -d: -f1)
        local url=$(echo "$service" | cut -d: -f2-)

        echo -n "🔍 Testing $name... "
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ OK${NC}"
        else
            echo -e "${RED}❌ FAILED${NC}"
        fi
    done

    echo ""
    echo -e "${YELLOW}💡 Frontend services cần kiểm tra thủ công trong browser${NC}"
}

show_project_info() {
    echo -e "${PURPLE}📋 THÔNG TIN DỰ ÁN${NC}"
    echo -e "${CYAN}===================${NC}"

    echo -e "${WHITE}🎯 DỰ ÁN CHÍNH (AI-Powered Analytics):${NC}"
    echo -e "   📁 Thư mục: $MAIN_PROJECT_DIR/"
    echo -e "   🎨 Frontend: React 18 + Material-UI (Port 3000)"
    echo -e "   🔧 Backend: Node.js + Express (Port 3001)"
    echo -e "   🤖 AI Service: Python + FastAPI (Port 8000)"
    echo -e "   📊 Features: Real-time Dashboard, AI Analytics, Google Sheets"
    echo ""

    echo -e "${WHITE}📊 DỰ ÁN GOOGLE SHEETS:${NC}"
    echo -e "   📁 Thư mục: $GOOGLE_SHEETS_DIR/"
    echo -e "   🎨 Frontend: React 18 + Material-UI (Port 3002)"
    echo -e "   🔧 Backend: Node.js + Express (Port 3003)"
    echo -e "   📊 Features: Google Sheets Integration, Authentication, Data Sync"
    echo ""

    echo -e "${WHITE}🔧 DỊCH VỤ CHUNG:${NC}"
    echo -e "   📁 Thư mục: $SHARED_SERVICES_DIR/"
    echo -e "   📊 Features: Google Apps Script, Common Services"
    echo ""

    print_urls
}

# =============================================================================
# 🎮 MAIN LOOP
# =============================================================================

main() {
    while true; do
        print_header
        print_status
        print_menu

        read -p "Nhập lựa chọn (1-14): " choice
        echo ""

        case $choice in
            1) launch_main_project ;;
            2) launch_google_project ;;
            3) launch_all_projects ;;
            4)
                echo -e "${BLUE}🔧 KHỞI ĐỘNG RIÊNG BACKEND (MAIN PROJECT)${NC}"
                echo -e "${CYAN}==========================================${NC}"
                if check_dependencies && check_ports; then
                    create_log_dir
                    start_main_backend
                    echo -e "${GREEN}✅ Backend đã khởi động!${NC}"
                    echo -e "${BLUE}🌐 API: http://localhost:3001${NC}"
                fi
                ;;
            5)
                echo -e "${BLUE}🤖 KHỞI ĐỘNG RIÊNG AI SERVICE${NC}"
                echo -e "${CYAN}==============================${NC}"
                if check_dependencies && check_ports; then
                    create_log_dir
                    start_main_ai
                    echo -e "${GREEN}✅ AI Service đã khởi động!${NC}"
                    echo -e "${BLUE}🌐 API: http://localhost:8000${NC}"
                fi
                ;;
            6)
                echo -e "${BLUE}🎨 KHỞI ĐỘNG RIÊNG FRONTEND (MAIN PROJECT)${NC}"
                echo -e "${CYAN}===========================================${NC}"
                if check_dependencies && check_ports; then
                    create_log_dir
                    start_main_frontend
                    echo -e "${GREEN}✅ Frontend đã khởi động!${NC}"
                    echo -e "${BLUE}🌐 App: http://localhost:3000${NC}"
                fi
                ;;
            7)
                echo -e "${BLUE}📊 KHỞI ĐỘNG RIÊNG GOOGLE SHEETS BACKEND${NC}"
                echo -e "${CYAN}=========================================${NC}"
                if check_dependencies && check_ports; then
                    create_log_dir
                    start_google_backend
                    echo -e "${GREEN}✅ Google Backend đã khởi động!${NC}"
                    echo -e "${BLUE}🌐 API: http://localhost:3003${NC}"
                fi
                ;;
            8)
                echo -e "${BLUE}📋 KHỞI ĐỘNG RIÊNG GOOGLE SHEETS FRONTEND${NC}"
                echo -e "${CYAN}==========================================${NC}"
                if check_dependencies && check_ports; then
                    create_log_dir
                    start_google_frontend
                    echo -e "${GREEN}✅ Google Frontend đã khởi động!${NC}"
                    echo -e "${BLUE}🌐 App: http://localhost:3002${NC}"
                fi
                ;;
            9) print_status ;;
            10) stop_all_services ;;
            11) show_logs ;;
            12) test_connections ;;
            13) show_project_info ;;
            14)
                echo -e "${YELLOW}🛑 Dừng tất cả dịch vụ trước khi thoát...${NC}"
                stop_all_services
                echo -e "${GREEN}👋 Cảm ơn bạn đã sử dụng!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Lựa chọn không hợp lệ. Vui lòng chọn 1-14.${NC}"
                ;;
        esac

        echo ""
        read -p "Nhấn Enter để tiếp tục..." dummy
    done
}

# =============================================================================
# 🚀 SCRIPT EXECUTION
# =============================================================================

# Kiểm tra nếu script được chạy trực tiếp
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Xử lý signal để cleanup khi thoát
    trap 'echo -e "\n${YELLOW}🛑 Đang dừng tất cả dịch vụ...${NC}"; stop_all_services; exit 0' INT TERM

    # Chạy main function
    main
fi
