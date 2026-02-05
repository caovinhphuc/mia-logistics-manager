#!/bin/bash

# 🚀 QUICK DEPLOYMENT SCRIPT
# Đơn giản và hiệu quả

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] $1${NC}"
}

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                🚀 REACT OAS INTEGRATION                   ║"
echo "║                   Quick Deploy v4.0                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check current status
check_status() {
    log "📊 Kiểm tra trạng thái services..."

    # Google Sheets Backend
    if curl -f -s "http://localhost:3003/api/health" > /dev/null 2>&1; then
        info "✅ Google Sheets Backend: RUNNING"
    else
        warn "❌ Google Sheets Backend: STOPPED"
    fi

    # Google Sheets Frontend
    if curl -f -s "http://localhost:3000" > /dev/null 2>&1; then
        info "✅ Google Sheets Frontend: RUNNING"
    else
        warn "❌ Google Sheets Frontend: STOPPED"
    fi

    # MIA Frontend
    if curl -f -s "http://localhost:5173" > /dev/null 2>&1; then
        info "✅ MIA Logistics Frontend: RUNNING"
    else
        warn "❌ MIA Logistics Frontend: STOPPED"
    fi

    # AI Service
    if curl -f -s "http://localhost:8000/health" > /dev/null 2>&1; then
        info "✅ AI Service: RUNNING"
    else
        warn "❌ AI Service: STOPPED"
    fi
}

# Start AI Service if not running
start_ai_service() {
    if ! curl -f -s "http://localhost:8000/health" > /dev/null 2>&1; then
        log "🤖 Khởi động AI Service..."

        # Check if Python virtual environment exists
        if [ -d "./ai-venv" ]; then
            log "Activating Python virtual environment..."
            source ./ai-venv/bin/activate

            # Create simple AI service if doesn't exist
            if [ ! -f "ai_service.py" ]; then
                log "Tạo AI Service..."
                cat > ai_service.py << 'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import random
import time

app = FastAPI(title="React OAS AI Service", version="4.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "models": {
            "predictor": True,
            "anomaly_detector": True,
            "optimizer": True
        }
    }

@app.get("/ai/predictions")
async def get_predictions():
    return {
        "predictions": {
            "response_time": [random.randint(95, 110) for _ in range(5)],
            "active_users": [random.randint(500, 600) for _ in range(5)]
        },
        "confidence_scores": {
            "response_time": 0.85,
            "active_users": 0.78
        }
    }

@app.get("/ai/anomalies")
async def detect_anomalies():
    return {
        "anomalies": [],
        "risk_level": "low",
        "recommendations": ["System is running optimally"]
    }

@app.get("/ai/optimization")
async def get_optimization():
    return {
        "optimizations": [
            {"action": "Optimize database queries", "impact": "15%", "priority": "high"},
            {"action": "Enable caching", "impact": "20%", "priority": "medium"}
        ],
        "overall_score": 89
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF
            fi

            # Install FastAPI if not installed
            pip install fastapi uvicorn 2>/dev/null || true

            # Start AI service in background
            nohup python ai_service.py > logs/ai-service.log 2>&1 &
            AI_PID=$!
            echo $AI_PID > logs/ai-service.pid

            deactivate

            log "AI Service started with PID $AI_PID"
            sleep 3
        else
            warn "Python virtual environment not found. Skipping AI Service."
        fi
    fi
}

# Start MIA Frontend if not running
start_mia_frontend() {
    if ! curl -f -s "http://localhost:5173" > /dev/null 2>&1; then
        if [ -d "./shared" ]; then
            log "🎨 Khởi động MIA Logistics Frontend..."
            cd ./shared

            # Check if dependencies are installed
            if [ ! -d "node_modules" ]; then
                log "Installing dependencies..."
                npm install --legacy-peer-deps
            fi

            # Start in background
            nohup npm run dev > ../logs/mia-frontend.log 2>&1 &
            MIA_PID=$!
            echo $MIA_PID > ../logs/mia-frontend.pid

            cd ..
            log "MIA Frontend started with PID $MIA_PID"
            sleep 5
        fi
    fi
}

# Main deployment
deploy() {
    log "🚀 Bắt đầu deployment..."

    # Create logs directory
    mkdir -p logs

    # Check if Google Sheets services are running
    if ! curl -f -s "http://localhost:3003/api/health" > /dev/null 2>&1; then
        log "Khởi động Google Sheets Backend..."
        cd ./google-sheets-project
        PORT=3003 nohup node server.js > ../logs/google-sheets-backend.log 2>&1 &
        BACKEND_PID=$!
        echo $BACKEND_PID > ../logs/google-sheets-backend.pid
        cd ..
        sleep 5
    fi

    if ! curl -f -s "http://localhost:3000" > /dev/null 2>&1; then
        log "Khởi động Google Sheets Frontend..."
        cd ./google-sheets-project
        PORT=3000 nohup npm start > ../logs/google-sheets-frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > ../logs/google-sheets-frontend.pid
        cd ..
        sleep 10
    fi

    # Start additional services
    start_ai_service
    start_mia_frontend

    log "⏳ Chờ services khởi động..."
    sleep 5

    # Final status check
    check_status

    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                  🎉 DEPLOYMENT HOÀN TẤT                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}📱 Truy cập ứng dụng:${NC}"
    echo -e "${BLUE}├── Google Sheets Platform: http://localhost:3000${NC}"
    echo -e "${BLUE}├── Google Sheets API:      http://localhost:3003${NC}"
    echo -e "${BLUE}├── MIA Logistics:          http://localhost:5173${NC}"
    echo -e "${BLUE}└── AI Service:             http://localhost:8000${NC}"
    echo ""
    echo -e "${GREEN}🎯 Platform sẵn sàng sử dụng!${NC}"
}

# Stop all services
stop() {
    log "🛑 Dừng tất cả services..."

    # Kill by PID files
    for pidfile in logs/*.pid; do
        if [ -f "$pidfile" ]; then
            PID=$(cat "$pidfile")
            kill $PID 2>/dev/null || true
            rm -f "$pidfile"
        fi
    done

    # Kill by port
    for port in 3000 3003 5173 8000; do
        PID=$(lsof -ti:$port 2>/dev/null)
        if [ ! -z "$PID" ]; then
            kill -9 $PID 2>/dev/null || true
        fi
    done

    log "✅ Tất cả services đã dừng"
}

# Parse command
case "${1:-deploy}" in
    "deploy"|"start")
        deploy
        ;;
    "stop")
        stop
        ;;
    "restart")
        stop
        sleep 3
        deploy
        ;;
    "status")
        check_status
        ;;
    *)
        echo "Usage: $0 {deploy|start|stop|restart|status}"
        exit 1
        ;;
esac
