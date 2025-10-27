#!/bin/bash

# Update .env file with current credentials

cd /Users/phuccao/Desktop/mia-logistics-manager

# Check if .env exists
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Backup created"
fi

# Create/update .env file
cat > .env << 'EOF'
# MIA Logistics Manager Environment Variables

# Google Sheets Configuration
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k
SHEET_ID=1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k
ACTIVE_SPREADSHEET_ID=1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k

# Google Drive Configuration
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=1Cui_Q093hMzmDaAte7PdB_gPB42u2ijq

# Service Account
GOOGLE_SERVICE_ACCOUNT_KEY=./credentials/service-account-key.json
SERVICE_ACCOUNT_PATH=./credentials/service-account-key.json

# OAuth 2.0 (Add from Console UI)
# REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
# REACT_APP_GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE

# API Key (Add from Console UI)
# REACT_APP_GOOGLE_API_KEY=YOUR_API_KEY_HERE

# Environment
NODE_ENV=development
PORT=5050
REACT_APP_API_URL=http://localhost:3000
EOF

echo ""
echo "✅ .env file updated!"
echo ""
echo "📋 Current configuration:"
echo "  - Spreadsheet ID: 1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k"
echo "  - Drive Folder ID: 1Cui_Q093hMzmDaAte7PdB_gPB42u2ijq"
echo "  - Service Account: credentials/service-account-key.json"
echo ""
echo "⚠️  Still need to add:"
echo "  - OAuth Client ID & Secret (Console UI)"
echo "  - API Key (Console UI)"
echo ""
echo "Next steps:"
echo "  1. Uncomment and fill OAuth credentials in .env"
echo "  2. Uncomment and fill API Key in .env"
echo "  3. Run: npm start"
echo ""
