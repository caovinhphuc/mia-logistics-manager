#!/bin/bash

###############################################################################
# Backup Before Migration Script
#
# Script để tự động backup trước khi migration
# Bao gồm:
# - Google Sheets data
# - Environment variables
# - Service account credentials
# - Current codebase
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="backup/migration-$(date +%Y%m%d-%H%M%S)"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${BLUE}🔄 Starting Pre-Migration Backup...${NC}\n"

# Create backup directory
echo -e "${YELLOW}📁 Creating backup directory...${NC}"
mkdir -p "$BACKUP_DIR"
echo -e "${GREEN}✅ Created: $BACKUP_DIR${NC}\n"

# 1. Backup Google Sheets
echo -e "${YELLOW}📊 Backing up Google Sheets data...${NC}"
if [ -f "backend/scripts/export-all-sheets.js" ]; then
    node backend/scripts/export-all-sheets.js \
        --output "$BACKUP_DIR/sheets-backup.json" \
        2>&1 | tee "$BACKUP_DIR/sheets-backup.log"
    echo -e "${GREEN}✅ Google Sheets backed up${NC}\n"
else
    echo -e "${RED}⚠️  Export script not found, skipping Sheets backup${NC}\n"
fi

# 2. Backup environment variables
echo -e "${YELLOW}🔐 Backing up environment variables...${NC}"
if [ -f ".env" ]; then
    cp .env "$BACKUP_DIR/env.backup"
    echo -e "${GREEN}✅ .env backed up${NC}\n"
else
    echo -e "${RED}⚠️  .env not found${NC}\n"
fi

# 3. Backup service account credentials
echo -e "${YELLOW}🔑 Backing up service account credentials...${NC}"
if [ -f "backend/sinuous-aviary-474820-e3-c442968a0e87.json" ]; then
    cp backend/sinuous-aviary-474820-e3-c442968a0e87.json \
        "$BACKUP_DIR/service-account.json"
    echo -e "${GREEN}✅ Service account backed up${NC}\n"
else
    echo -e "${RED}⚠️  Service account file not found${NC}\n"
fi

# 4. Backup package.json files
echo -e "${YELLOW}📦 Backing up package.json files...${NC}"
cp package.json "$BACKUP_DIR/package.json" 2>/dev/null || true
cp backend/package.json "$BACKUP_DIR/backend-package.json" 2>/dev/null || true
echo -e "${GREEN}✅ Package files backed up${NC}\n"

# 5. Create git snapshot (if in git repo)
echo -e "${YELLOW}🔀 Creating git snapshot...${NC}"
if git rev-parse --git-dir > /dev/null 2>&1; then
    CURRENT_BRANCH=$(git branch --show-current)
    CURRENT_COMMIT=$(git rev-parse HEAD)

    echo "Branch: $CURRENT_BRANCH" > "$BACKUP_DIR/git-info.txt"
    echo "Commit: $CURRENT_COMMIT" >> "$BACKUP_DIR/git-info.txt"
    echo "Date: $(date)" >> "$BACKUP_DIR/git-info.txt"

    git diff > "$BACKUP_DIR/git-uncommitted-changes.diff" 2>/dev/null || true
    git log -1 > "$BACKUP_DIR/git-last-commit.txt"

    echo -e "${GREEN}✅ Git snapshot created${NC}\n"
else
    echo -e "${YELLOW}⚠️  Not a git repository, skipping git snapshot${NC}\n"
fi

# 6. Create backup manifest
echo -e "${YELLOW}📝 Creating backup manifest...${NC}"
cat > "$BACKUP_DIR/MANIFEST.md" << EOF
# Migration Backup Manifest

**Created**: $(date)
**Backup Directory**: $BACKUP_DIR
**Project Root**: $PROJECT_ROOT

## Contents

### 1. Google Sheets Data
- \`sheets-backup.json\` - All sheets exported as JSON
- \`sheets-backup.log\` - Export log

### 2. Configuration
- \`env.backup\` - Environment variables
- \`service-account.json\` - Service account credentials

### 3. Package Files
- \`package.json\` - Frontend dependencies
- \`backend-package.json\` - Backend dependencies

### 4. Git Information
- \`git-info.txt\` - Current branch and commit
- \`git-uncommitted-changes.diff\` - Uncommitted changes
- \`git-last-commit.txt\` - Last commit details

## Restoration Instructions

### Restore Google Sheets
\`\`\`bash
node backend/scripts/import-sheets.js --file $BACKUP_DIR/sheets-backup.json
\`\`\`

### Restore Environment Variables
\`\`\`bash
cp $BACKUP_DIR/env.backup .env
\`\`\`

### Restore Service Account
\`\`\`bash
cp $BACKUP_DIR/service-account.json backend/sinuous-aviary-474820-e3-c442968a0e87.json
\`\`\`

### Restore Dependencies
\`\`\`bash
cp $BACKUP_DIR/package.json package.json
cp $BACKUP_DIR/backend-package.json backend/package.json
npm install
cd backend && npm install
\`\`\`

## Verification

After restoration, verify:
- [ ] Backend starts successfully
- [ ] Frontend compiles without errors
- [ ] Google Sheets connection working
- [ ] All data accessible
- [ ] Tests passing

## Notes

- This backup was created automatically before migration
- Keep this backup for at least 30 days
- Store sensitive files (service account, .env) securely
- Test restoration process before actual migration

EOF

echo -e "${GREEN}✅ Manifest created${NC}\n"

# 7. Calculate backup size
echo -e "${YELLOW}📊 Calculating backup size...${NC}"
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
FILE_COUNT=$(find "$BACKUP_DIR" -type f | wc -l)

# 8. Create summary
echo -e "\n${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}           BACKUP SUMMARY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}\n"

echo -e "${GREEN}✅ Backup completed successfully!${NC}\n"
echo -e "📁 Location: ${YELLOW}$BACKUP_DIR${NC}"
echo -e "💾 Size: ${YELLOW}$BACKUP_SIZE${NC}"
echo -e "📄 Files: ${YELLOW}$FILE_COUNT${NC}\n"

echo -e "${BLUE}Backed up items:${NC}"
echo -e "  ✓ Google Sheets data"
echo -e "  ✓ Environment variables"
echo -e "  ✓ Service account credentials"
echo -e "  ✓ Package configurations"
echo -e "  ✓ Git snapshot"
echo -e "  ✓ Backup manifest\n"

echo -e "${YELLOW}⚠️  Important:${NC}"
echo -e "  - Review backup contents before proceeding with migration"
echo -e "  - Test restoration process if needed"
echo -e "  - Keep this backup secure\n"

echo -e "${GREEN}You can now proceed with your migration!${NC}"
echo -e "${BLUE}To restore: See $BACKUP_DIR/MANIFEST.md${NC}\n"

exit 0

