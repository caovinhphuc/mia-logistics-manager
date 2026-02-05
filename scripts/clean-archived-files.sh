#!/bin/bash

###############################################################################
# Clean Archived Files Script
#
# Script để XÓA các files đã được archive
# ⚠️ CẢNH BÁO: Script này sẽ XÓA files! Chỉ chạy sau khi đã archive
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${RED}⚠️  WARNING: This script will DELETE files!${NC}\n"
echo -e "${YELLOW}Make sure you have run ./scripts/archive-old-files.sh first!${NC}\n"

# Confirmation
read -p "Are you sure you want to delete archived files? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo -e "\n${YELLOW}Cancelled. No files deleted.${NC}"
  exit 0
fi

echo -e "\n${BLUE}🗑️  Cleaning Archived Files...${NC}\n"

DELETED_COUNT=0

# Function to delete file
delete_file() {
  local file=$1

  if [ -f "$file" ]; then
    echo -e "${RED}🗑️  Deleting: $file${NC}"
    rm "$file"
    DELETED_COUNT=$((DELETED_COUNT + 1))
  fi
}

echo -e "${BLUE}1. Deleting Old README Files...${NC}"
delete_file "README-OLD.md"
delete_file "README-NEW.md"
delete_file "README copy.md"

echo -e "\n${BLUE}2. Deleting Backup Files...${NC}"
delete_file "index-backup.js"
delete_file "backend/index-backup.js"
delete_file "package copy.json"

echo -e "\n${BLUE}3. Deleting Analysis Reports...${NC}"
delete_file "AUTHENTICATION_AUDIT.md"
delete_file "AUTHENTICATION_STATUS.md"
delete_file "BACKEND_INDEX_ANALYSIS.md"
delete_file "DATA_FLOW_ANALYSIS.md"
delete_file "FEATURES_STATUS.md"
delete_file "FINAL_AUTH_STATUS.md"
delete_file "FRONTEND_APP_ANALYSIS.md"
delete_file "MIA_LOGISTICS_MANAGER_ANALYSIS.md"
delete_file "NAVIGATION_UPDATE.md"
delete_file "RBAC_AUDIT.md"
delete_file "RBAC_USAGE.md"
delete_file "SESSION_MANAGEMENT.md"
delete_file "SIDEBAR_AUDIT.md"
delete_file "VOLUME_CALCULATIONS_ANALYSIS.md"
delete_file "VOLUME_MAPPING_FIX_GUIDE.md"

echo -e "\n${BLUE}4. Deleting Old Setup/Config Files...${NC}"
delete_file "CONFIG_STANDARDIZATION.md"
delete_file "PORTS_CONFIG.md"
delete_file "PORTS_STANDARDIZATION.md"
delete_file "DEMO_PRESENTATION_READY.md"
delete_file "INSTALLATION_SUCCESS_REPORT.md"
delete_file "PROJECT_PROGRESS.md"

echo -e "\n${BLUE}5. Deleting Old Setup Guides...${NC}"
delete_file "GITHUB_SETUP_INSTRUCTIONS.md"
delete_file "GITHUB_SETUP.md"
delete_file "GOOGLE_SHEETS_SETUP.md"
delete_file "QUICK_SETUP_GOOGLE_APPS_SCRIPT.md"
delete_file "QUICK_SETUP.md"
delete_file "QUICK_START.md"
delete_file "TELEGRAM_CHECKLIST.md"
delete_file "TELEGRAM_INTEGRATION_COMPLETE.md"
delete_file "TELEGRAM_SETUP.md"
delete_file "TELEGRAM_TEST_RESULTS.md"
delete_file "TEMPLATE_GUIDE.md"
delete_file "backend/TEMPLATE_GUIDE.md"

echo -e "\n${BLUE}6. Deleting Obsolete Scripts...${NC}"
delete_file "ports.config.sh"
delete_file "ports.config copy.sh"
delete_file "scripts-quickstart.md"
delete_file "scripts-readme.md"

echo -e "\n${BLUE}7. Cleaning Old Backup Directories...${NC}"
if [ -d "backup_layout_20251028_213652" ]; then
  echo -e "${RED}🗑️  Deleting: backup_layout_20251028_213652/${NC}"
  rm -rf "backup_layout_20251028_213652"
  DELETED_COUNT=$((DELETED_COUNT + 1))
fi

if [ -d "BACKUP-FILE-OLD" ]; then
  echo -e "${RED}🗑️  Deleting: BACKUP-FILE-OLD/${NC}"
  rm -rf "BACKUP-FILE-OLD"
  DELETED_COUNT=$((DELETED_COUNT + 1))
fi

echo -e "\n${GREEN}✅ Cleanup Complete!${NC}\n"
echo -e "🗑️  Files/Folders Deleted: ${YELLOW}$DELETED_COUNT${NC}\n"

echo -e "${BLUE}📊 Project should be cleaner now!${NC}"
echo -e "${GREEN}Archived files are safely stored in archive/ directory${NC}\n"

exit 0

