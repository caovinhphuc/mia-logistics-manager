#!/bin/bash

###############################################################################
# Pre-Deployment Checklist Script
#
# Kiểm tra tất cả requirements trước khi deploy
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Pre-Deployment Checklist${NC}\n"

ERRORS=0
WARNINGS=0

# Function to check requirement
check() {
  local name=$1
  local command=$2

  echo -n "Checking $name... "

  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
    return 0
  else
    echo -e "${RED}❌${NC}"
    ERRORS=$((ERRORS + 1))
    return 1
  fi
}

# Function to check with warning
check_warn() {
  local name=$1
  local command=$2

  echo -n "Checking $name... "

  if eval "$command" > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC}"
    return 0
  else
    echo -e "${YELLOW}⚠️${NC}"
    WARNINGS=$((WARNINGS + 1))
    return 1
  fi
}

echo -e "${BLUE}1. Environment Checks${NC}"
check "Node.js installation" "node --version"
check "npm installation" "npm --version"
check ".env file exists" "test -f .env"
check_warn "Backend .env exists" "test -f backend/.env"

echo -e "\n${BLUE}2. Dependencies${NC}"
check "node_modules installed" "test -d node_modules"
# Chỉ bắt buộc backend/node_modules khi backend có package.json riêng
if [ -f backend/package.json ]; then
  check "Backend dependencies" "test -d backend/node_modules"
fi

echo -e "\n${BLUE}3. Build & Tests${NC}"
# Build không set CI để cảnh báo ESLint không chặn (vẫn báo qua lint check)
check "Build successful" "CI= npm run build"
check_warn "Tests passing" "CI=true npm test -- --watchAll=false --passWithNoTests"
check_warn "Linter passing" "npm run lint"

echo -e "\n${BLUE}4. Configuration${NC}"
# Service account: file cố định HOẶC đường dẫn từ .env GOOGLE_APPLICATION_CREDENTIALS
check_warn "Service account exists" "test -f backend/sinuous-aviary-474820-e3-c442968a0e87.json || { CRED=\$(grep -E '^GOOGLE_APPLICATION_CREDENTIALS=' .env 2>/dev/null | cut -d= -f2- | sed 's/^[\" ]*//;s/[\" ]*$//'); [ -n \"\$CRED\" ] && test -f \"\$CRED\"; }"
check ".gitignore configured" "test -f .gitignore"

echo -e "\n${BLUE}5. Security${NC}"
check ".env not in git" "! git ls-files --error-unmatch .env 2>/dev/null"
# Cảnh báo nếu còn console.log trong app code (bỏ qua logger, test, debug, backup)
check_warn "No console.log in source" "! grep -rq 'console\\.log' src/ --include='*.js' --include='*.jsx' --include='*.ts' --include='*.tsx' --exclude-dir=__tests__ --exclude-dir=debug --exclude='*backup*' --exclude='logger.js' --exclude='consoleConfig.js' --exclude='suppressWarnings.js' --exclude='logService.js' 2>/dev/null"

echo -e "\n${BLUE}6. Documentation${NC}"
check "README exists" "test -f README.md"
check_warn "API docs exist" "test -f docs/API.md"
check_warn "CHANGELOG exists" "test -f CHANGELOG.md"

echo -e "\n${BLUE}7. Docker (Optional)${NC}"
check_warn "Dockerfile exists" "test -f Dockerfile"
check_warn "docker-compose exists" "test -f docker-compose.yml"

# Summary
echo -e "\n${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}           SUMMARY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}\n"

if [ $ERRORS -eq 0 ]; then
  if [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready to deploy.${NC}"
    exit 0
  else
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found, but safe to deploy.${NC}"
    exit 0
  fi
else
  echo -e "${RED}❌ $ERRORS error(s) found! Fix before deploying.${NC}"
  echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found.${NC}"
  exit 1
fi

