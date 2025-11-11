#!/bin/bash
# Quick script to comment out console.log (not delete, for easy rollback)
find src -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/build/*" \
  ! -path "*/__tests__/*" \
  ! -name "*.test.*" \
  ! -name "logger.js" \
  ! -name "logService.js" \
  ! -name "consoleConfig.js" \
  -exec sed -i '' 's/^\(\s*\)console\.log(/\1\/\/ console.log(/g' {} +

echo "✅ Commented out console.log statements"
