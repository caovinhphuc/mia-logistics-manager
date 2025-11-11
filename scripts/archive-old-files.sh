#!/bin/bash

###############################################################################
# Archive Old Files Script
#
# Script để archive các files cũ/không cần thiết vào thư mục archive
# Giữ project gọn gàng hơn
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
ARCHIVE_DIR="archive/session-$(date +%Y%m%d-%H%M%S)"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}📦 Archiving Old Files...${NC}\n"

# Create archive directory
mkdir -p "$ARCHIVE_DIR/documentation"
mkdir -p "$ARCHIVE_DIR/backup-files"
mkdir -p "$ARCHIVE_DIR/analysis-reports"
mkdir -p "$ARCHIVE_DIR/old-readmes"

# Track archived files
ARCHIVED_COUNT=0

# Function to archive file
archive_file() {
  local file=$1
  local target_dir=$2

  if [ -f "$file" ]; then
    echo -e "${YELLOW}📁 Archiving: $file${NC}"
    cp "$file" "$target_dir/"
    ARCHIVED_COUNT=$((ARCHIVED_COUNT + 1))
  fi
}

echo -e "${BLUE}1. Archiving Old README Files...${NC}"
archive_file "README-OLD.md" "$ARCHIVE_DIR/old-readmes"
archive_file "README-NEW.md" "$ARCHIVE_DIR/old-readmes"
archive_file "README copy.md" "$ARCHIVE_DIR/old-readmes"

echo -e "\n${BLUE}2. Archiving Backup Files...${NC}"
archive_file "index-backup.js" "$ARCHIVE_DIR/backup-files"
archive_file "backend/index-backup.js" "$ARCHIVE_DIR/backup-files"
archive_file "package copy.json" "$ARCHIVE_DIR/backup-files"

echo -e "\n${BLUE}3. Archiving Analysis Reports...${NC}"
archive_file "AUTHENTICATION_AUDIT.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "AUTHENTICATION_STATUS.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "BACKEND_INDEX_ANALYSIS.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "DATA_FLOW_ANALYSIS.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "FEATURES_STATUS.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "FINAL_AUTH_STATUS.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "FRONTEND_APP_ANALYSIS.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "MIA_LOGISTICS_MANAGER_ANALYSIS.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "NAVIGATION_UPDATE.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "RBAC_AUDIT.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "RBAC_USAGE.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "SESSION_MANAGEMENT.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "SIDEBAR_AUDIT.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "VOLUME_CALCULATIONS_ANALYSIS.md" "$ARCHIVE_DIR/analysis-reports"
archive_file "VOLUME_MAPPING_FIX_GUIDE.md" "$ARCHIVE_DIR/analysis-reports"

echo -e "\n${BLUE}4. Archiving Old Setup/Config Files...${NC}"
archive_file "CONFIG_STANDARDIZATION.md" "$ARCHIVE_DIR/documentation"
archive_file "PORTS_CONFIG.md" "$ARCHIVE_DIR/documentation"
archive_file "PORTS_STANDARDIZATION.md" "$ARCHIVE_DIR/documentation"
archive_file "DEMO_PRESENTATION_READY.md" "$ARCHIVE_DIR/documentation"
archive_file "INSTALLATION_SUCCESS_REPORT.md" "$ARCHIVE_DIR/documentation"
archive_file "PROJECT_PROGRESS.md" "$ARCHIVE_DIR/documentation"

echo -e "\n${BLUE}5. Archiving Old Setup Scripts...${NC}"
archive_file "GITHUB_SETUP_INSTRUCTIONS.md" "$ARCHIVE_DIR/documentation"
archive_file "GITHUB_SETUP.md" "$ARCHIVE_DIR/documentation"
archive_file "GOOGLE_SHEETS_SETUP.md" "$ARCHIVE_DIR/documentation"
archive_file "QUICK_SETUP_GOOGLE_APPS_SCRIPT.md" "$ARCHIVE_DIR/documentation"
archive_file "QUICK_SETUP.md" "$ARCHIVE_DIR/documentation"
archive_file "QUICK_START.md" "$ARCHIVE_DIR/documentation"
archive_file "TELEGRAM_CHECKLIST.md" "$ARCHIVE_DIR/documentation"
archive_file "TELEGRAM_INTEGRATION_COMPLETE.md" "$ARCHIVE_DIR/documentation"
archive_file "TELEGRAM_SETUP.md" "$ARCHIVE_DIR/documentation"
archive_file "TELEGRAM_TEST_RESULTS.md" "$ARCHIVE_DIR/documentation"
archive_file "TEMPLATE_GUIDE.md" "$ARCHIVE_DIR/documentation"
archive_file "backend/TEMPLATE_GUIDE.md" "$ARCHIVE_DIR/documentation"

# Create archive manifest
cat > "$ARCHIVE_DIR/MANIFEST.md" << EOF
# Archive Manifest

**Created**: $(date)
**Archive Directory**: $ARCHIVE_DIR
**Total Files Archived**: $ARCHIVED_COUNT

## Contents

### Old README Files
- README-OLD.md
- README-NEW.md
- README copy.md

### Backup Files
- index-backup.js
- package copy.json

### Analysis Reports
- Authentication audits
- RBAC audits
- Navigation updates
- Volume calculations
- Session management
- And more...

### Old Setup/Config Docs
- Config standardization
- Ports configuration
- Demo presentations
- Installation reports

### Old Setup Guides
- GitHub setup guides
- Google Sheets setup
- Telegram integration guides
- Quick start guides

## Why Archived?

These files were:
- Replaced by newer, better versions
- Analysis reports that served their purpose
- Backup files no longer needed
- Outdated setup guides

## Restoration

If you need any file:
\`\`\`bash
cp $ARCHIVE_DIR/path/to/file ./
\`\`\`

## Keep or Delete?

- **Keep**: If you might need reference later
- **Delete**: After 30 days if not needed

EOF

# Create ZIP archive
echo -e "\n${BLUE}6. Creating ZIP Archive...${NC}"
cd "$(dirname "$ARCHIVE_DIR")"
ARCHIVE_NAME="archived-files-$(date +%Y%m%d-%H%M%S).zip"
zip -r "$ARCHIVE_NAME" "$(basename "$ARCHIVE_DIR")" > /dev/null 2>&1

echo -e "\n${GREEN}✅ Archive Created!${NC}\n"
echo -e "📁 Archive Location: ${YELLOW}$(pwd)/$ARCHIVE_NAME${NC}"
echo -e "📦 Files Archived: ${YELLOW}$ARCHIVED_COUNT${NC}"
echo -e "💾 Archive Size: ${YELLOW}$(du -sh $(pwd)/$ARCHIVE_NAME | cut -f1)${NC}\n"

echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo -e "1. Files are COPIED to archive (originals still in place)"
echo -e "2. To actually remove from project, run: ${GREEN}./scripts/clean-archived-files.sh${NC}"
echo -e "3. Review archived files before deleting: ${GREEN}unzip -l $(pwd)/$ARCHIVE_NAME${NC}\n"

echo -e "${BLUE}Next Step:${NC}"
echo -e "Review the archive, then optionally run cleanup script to remove originals.\n"

exit 0

