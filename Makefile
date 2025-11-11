# Makefile for MIA Logistics Manager
# Convenience commands for common tasks

.PHONY: help install start stop clean build test deploy backup

# Default target
help:
	@echo "MIA Logistics Manager - Available Commands"
	@echo "=========================================="
	@echo ""
	@echo "Development:"
	@echo "  make install          - Install all dependencies"
	@echo "  make start            - Start development servers"
	@echo "  make stop             - Stop all services"
	@echo "  make clean            - Clean build artifacts and dependencies"
	@echo ""
	@echo "Build & Test:"
	@echo "  make build            - Build production bundle"
	@echo "  make test             - Run tests"
	@echo "  make lint             - Run linter"
	@echo "  make format           - Format code"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy           - Deploy to production"
	@echo "  make deploy-staging   - Deploy to staging"
	@echo ""
	@echo "Database:"
	@echo "  make backup           - Backup Google Sheets data"
	@echo "  make restore          - Restore from backup"
	@echo "  make verify           - Verify data integrity"
	@echo ""
	@echo "Maintenance:"
	@echo "  make health           - Check service health"
	@echo "  make logs             - View application logs"
	@echo "  make security         - Run security audit"
	@echo ""

# Installation
install:
	@echo "📦 Installing dependencies..."
	npm install
	cd backend && npm install
	@echo "✅ Installation complete!"

install-backend:
	@echo "📦 Installing backend dependencies..."
	cd backend && npm install
	@echo "✅ Backend dependencies installed!"

install-frontend:
	@echo "📦 Installing frontend dependencies..."
	npm install
	@echo "✅ Frontend dependencies installed!"

# Development
start:
	@echo "🚀 Starting development servers..."
	./start-project.sh

start-simple:
	@echo "🚀 Starting with simple script..."
	./start.sh

start-frontend:
	@echo "🚀 Starting frontend only..."
	npm start

start-backend:
	@echo "🚀 Starting backend only..."
	cd backend && npm start

stop:
	@echo "🛑 Stopping services..."
	@pkill -f "react-scripts" || true
	@pkill -f "node.*server.cjs" || true
	@echo "✅ Services stopped!"

# Build
build:
	@echo "🏗️  Building production bundle..."
	npm run build
	@echo "✅ Build complete!"

build-analyze:
	@echo "🏗️  Building and analyzing bundle..."
	npm run build
	npm run analyze
	@echo "✅ Build analysis complete!"

# Testing
test:
	@echo "🧪 Running tests..."
	npm test

test-coverage:
	@echo "🧪 Running tests with coverage..."
	npm run test:coverage

test-watch:
	@echo "🧪 Running tests in watch mode..."
	npm run test:watch

# Code Quality
lint:
	@echo "🔍 Running linter..."
	npm run lint

lint-fix:
	@echo "🔧 Fixing lint issues..."
	npm run lint:fix

format:
	@echo "✨ Formatting code..."
	npm run format

format-check:
	@echo "🔍 Checking code format..."
	npm run format:check

# Deployment
deploy:
	@echo "🚀 Deploying to production..."
	npm run deploy

deploy-staging:
	@echo "🚀 Deploying to staging..."
	@echo "Not configured yet"

# Database Operations
backup:
	@echo "💾 Backing up Google Sheets..."
	npm run backup:sheets

restore:
	@echo "📥 Restoring from backup..."
	@read -p "Enter backup file path: " file; \
	npm run restore:sheets -- --file $$file

verify:
	@echo "🔍 Verifying data integrity..."
	npm run verify:migration

backup-full:
	@echo "💾 Creating full backup..."
	./scripts/backup-before-migration.sh

# Maintenance
health:
	@echo "🏥 Checking service health..."
	curl -s http://localhost:5050/api/health | jq . || echo "Backend not running"

health-all:
	@echo "🏥 Checking all services..."
	@echo "Frontend (port 3000):"
	@curl -s http://localhost:3000 > /dev/null && echo "✅ Running" || echo "❌ Not running"
	@echo ""
	@echo "Backend (port 5050):"
	@curl -s http://localhost:5050/api/health | jq . || echo "❌ Not running"

logs:
	@echo "📋 Viewing logs..."
	@echo "Backend startup log:"
	@tail -n 50 logs/backend-startup.log 2>/dev/null || echo "No log file found"

logs-live:
	@echo "📋 Following logs (Ctrl+C to stop)..."
	tail -f logs/backend-startup.log logs/backend.log

security:
	@echo "🔒 Running security audit..."
	npm audit
	@echo ""
	@echo "🔧 Attempting to fix vulnerabilities..."
	npm audit fix

deps-check:
	@echo "📦 Checking dependencies..."
	npm run deps:check

deps-update:
	@echo "📦 Updating dependencies..."
	npm run deps:update

# Cleanup
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf build/
	rm -rf node_modules/.cache/
	@echo "✅ Cleanup complete!"

clean-all:
	@echo "🧹 Cleaning everything..."
	rm -rf build/
	rm -rf node_modules/
	rm -rf backend/node_modules/
	rm -rf coverage/
	rm -rf .cache/
	@echo "✅ Deep cleanup complete!"

# Docker (for future use)
docker-build:
	@echo "🐳 Building Docker image..."
	docker build -t mia-logistics-manager .

docker-run:
	@echo "🐳 Running Docker container..."
	docker run -p 3000:3000 -p 5050:5050 mia-logistics-manager

# Git shortcuts
git-status:
	@git status

git-push:
	@git push origin $(shell git branch --show-current)

git-pull:
	@git pull origin $(shell git branch --show-current)

# Quick commands
dev: start
prod: build deploy
check: lint test security

