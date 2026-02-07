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
	@echo "Optimization: ⭐ NEW"
	@echo "  make analyze          - Analyze bundle size"
	@echo "  make optimize         - Run optimization checks"
	@echo "  make cleanup-deps     - Remove unused dependencies"
	@echo "  make fix-security     - Fix security vulnerabilities"
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

# Installation (--legacy-peer-deps tránh conflict MUI peer deps)
install:
	@echo "📦 Installing dependencies..."
	npm install --legacy-peer-deps
	@echo "✅ Installation complete!"

install-frontend:
	@echo "📦 Installing frontend dependencies..."
	npm install --legacy-peer-deps
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
	curl -s http://localhost:3100/api/health | jq . || echo "Backend not running"

health-all:
	@echo "🏥 Checking all services..."
	@echo "Frontend (port 3000):"
	@curl -s http://localhost:3000 > /dev/null && echo "✅ Running" || echo "❌ Not running"
	@echo ""
	@echo "Backend (port 3100):"
	@curl -s http://localhost:3100/api/health | jq . || echo "❌ Not running"

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

# Optimization Commands ⭐ NEW
analyze:
	@echo "🔍 Analyzing bundle size..."
	@echo "Building production bundle..."
	npm run build
	@echo "Analyzing with webpack-bundle-analyzer..."
	@command -v npx webpack-bundle-analyzer >/dev/null 2>&1 || npm install -D webpack-bundle-analyzer
	npx webpack-bundle-analyzer build/static/js/*.js --mode static --report build/bundle-report.html
	@echo "✅ Bundle analysis complete! Open build/bundle-report.html"

optimize:
	@echo "⚡ Running optimization checks..."
	@echo "1. Checking for unused dependencies..."
	npm run deps:check || true
	@echo ""
	@echo "2. Running security audit..."
	npm audit || true
	@echo ""
	@echo "3. Checking bundle size..."
	@test -d build && du -sh build/ || echo "Run 'make build' first"
	@echo ""
	@echo "4. Running linter..."
	npm run lint || true
	@echo ""
	@echo "✅ Optimization checks complete!"
	@echo "📄 See ANALYSIS_REPORT.md and OPTIMIZATION_PLAN.md for details"

cleanup-deps:
	@echo "🧹 Cleaning up unused dependencies..."
	@echo "This will uninstall: @craco/craco ajv exceljs html2canvas js-cookie lodash numeral jspdf"
	@read -p "Continue? [y/N] " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		npm uninstall @craco/craco ajv exceljs html2canvas js-cookie lodash numeral jspdf; \
		echo "✅ Cleanup complete!"; \
	else \
		echo "Cancelled."; \
	fi

fix-security:
	@echo "🔒 Fixing security vulnerabilities..."
	@echo "Running npm audit fix..."
	npm audit fix
	@echo ""
	@echo "Checking remaining issues..."
	npm audit
	@echo ""
	@echo "📄 For detailed security info, see ANALYSIS_REPORT.md"

install-missing:
	@echo "📦 Installing safe backend dependencies (excluding mjml)..."
	@echo "⚠️  Note: mjml excluded due to unfixable vulnerabilities"
	npm install handlebars @sendgrid/mail socket.io node-fetch --legacy-peer-deps
	@echo ""
	@echo "⚠️  For Telegram: npm install node-telegram-bot-api@0.67.0 --legacy-peer-deps"
	@echo "📄 See SECURITY_CRITICAL_DEPENDENCIES.md for details"
	@echo "✅ Safe dependencies installed!"

quick-wins:
	@echo "⚡ Applying quick optimization wins..."
	@echo ""
	@echo "Step 1: Installing safe dependencies..."
	@$(MAKE) install-missing
	@echo ""
	@echo "Step 2: Fixing security issues..."
	npm audit fix --legacy-peer-deps || true
	@echo ""
	@echo "✅ Quick wins complete! Check npm audit for remaining issues"
	@echo "📄 Next: See SECURITY_CRITICAL_DEPENDENCIES.md for MJML refactor plan"

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
	docker run -p 3000:3000 -p 3100:3100 mia-logistics-manager

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

