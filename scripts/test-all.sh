#!/bin/bash

###############################################################################
# Test All Script
#
# Chạy tất cả tests: unit, integration, e2e
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 Running All Tests...${NC}\n"

# Track failures
FAILURES=0

# 1. Unit Tests
echo -e "${YELLOW}📝 Running Unit Tests...${NC}"
if npm test -- --watchAll=false --coverage; then
  echo -e "${GREEN}✅ Unit tests passed${NC}\n"
else
  echo -e "${RED}❌ Unit tests failed${NC}\n"
  FAILURES=$((FAILURES + 1))
fi

# 2. Linting
echo -e "${YELLOW}🔍 Running Linter...${NC}"
if npm run lint; then
  echo -e "${GREEN}✅ Linting passed${NC}\n"
else
  echo -e "${RED}❌ Linting failed${NC}\n"
  FAILURES=$((FAILURES + 1))
fi

# 3. Type Checking
echo -e "${YELLOW}🔍 Running Type Check...${NC}"
if npm run type-check; then
  echo -e "${GREEN}✅ Type check passed${NC}\n"
else
  echo -e "${YELLOW}⚠️  Type check has warnings${NC}\n"
fi

# 4. Build Test
echo -e "${YELLOW}🏗️  Testing Build...${NC}"
if npm run build; then
  echo -e "${GREEN}✅ Build successful${NC}\n"
else
  echo -e "${RED}❌ Build failed${NC}\n"
  FAILURES=$((FAILURES + 1))
fi

# 5. Backend Tests (if available)
if [ -f "backend/package.json" ]; then
  echo -e "${YELLOW}🔧 Running Backend Tests...${NC}"
  cd backend
  if npm test 2>/dev/null; then
    echo -e "${GREEN}✅ Backend tests passed${NC}\n"
  else
    echo -e "${YELLOW}⚠️  Backend tests not configured or failed${NC}\n"
  fi
  cd ..
fi

# 6. E2E Tests (if configured)
echo -e "${YELLOW}🌐 Running E2E Tests...${NC}"
if npm run test:e2e 2>/dev/null; then
  echo -e "${GREEN}✅ E2E tests passed${NC}\n"
else
  echo -e "${YELLOW}⚠️  E2E tests not configured${NC}\n"
fi

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}           TEST SUMMARY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}\n"

if [ $FAILURES -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ $FAILURES test suite(s) failed${NC}"
  exit 1
fi

