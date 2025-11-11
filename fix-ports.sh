#!/bin/bash

# ============================================================================
# FIX PORTS IN ALL SCRIPTS
# Script này tự động cập nhật ports trong tất cả .sh files
# ============================================================================

echo "🔧 Fixing ports in all shell scripts..."

# Define correct ports
FRONTEND_PORT=3000
BACKEND_PORT=3001
AI_PORT=8000

# Files to update
SCRIPTS=(
    "start_ai_platform.sh"
    "start_dev_servers.sh"
    "quick_deploy.sh"
    "production_deploy.sh"
    "run_projects.sh"
    "start_data_flow.sh"
)

# Function to replace ports
fix_file() {
    local file=$1

    if [ ! -f "$file" ]; then
        echo "⚠️  Skipping $file (not found)"
        return
    fi

    echo "📝 Updating $file..."

    # Backup original
    cp "$file" "$file.backup"

    # Replace hardcoded ports with variables
    # Port 8080 → ${FRONTEND_PORT} hoặc 3000
    sed -i '' "s/:8080/:${FRONTEND_PORT}/g" "$file"
    sed -i '' "s/port 8080/port ${FRONTEND_PORT}/g" "$file"
    sed -i '' "s/Port 8080/Port ${FRONTEND_PORT}/g" "$file"
    sed -i '' "s/-l 8080/-l ${FRONTEND_PORT}/g" "$file"

    # Ensure other ports are consistent
    # Port 3001 should stay as BACKEND_PORT
    # Port 8000 should stay as AI_SERVICE_PORT

    echo "✅ Updated $file"
}

# Update each script
for script in "${SCRIPTS[@]}"; do
    fix_file "$script"
done

echo ""
echo "✅ All scripts updated!"
echo ""
echo "📋 Summary:"
echo "  Frontend Port: ${FRONTEND_PORT}"
echo "  Backend Port:  ${BACKEND_PORT}"
echo "  AI Port:       ${AI_PORT}"
echo ""
echo "🔄 Backups created with .backup extension"
echo "💡 To revert: mv file.backup file"

