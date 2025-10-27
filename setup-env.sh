#!/bin/bash

# MIA Logistics Manager - Environment Setup Script

echo "🚀 MIA Logistics Manager - Environment Setup"
echo "=============================================="
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists"
    read -p "Do you want to backup and create new? (y/n): " backup_choice
    if [ "$backup_choice" = "y" ]; then
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        echo "✅ Backup created"
    fi
fi

echo ""
echo "Please provide the following information from Google Cloud Console:"
echo ""

# Get OAuth Client ID
read -p "OAuth Client ID: " CLIENT_ID
while [ -z "$CLIENT_ID" ]; do
    echo "❌ Client ID cannot be empty"
    read -p "OAuth Client ID: " CLIENT_ID
done

# Get OAuth Client Secret
read -p "OAuth Client Secret: " CLIENT_SECRET
while [ -z "$CLIENT_SECRET" ]; do
    echo "❌ Client Secret cannot be empty"
    read -p "OAuth Client Secret: " CLIENT_SECRET
done

# Get API Key
read -p "API Key: " API_KEY
while [ -z "$API_KEY" ]; do
    echo "❌ API Key cannot be empty"
    read -p "API Key: " API_KEY
done

# Get Spreadsheet ID
read -p "Google Sheets Spreadsheet ID: " SPREADSHEET_ID
while [ -z "$SPREADSHEET_ID" ]; do
    echo "❌ Spreadsheet ID cannot be empty"
    read -p "Google Sheets Spreadsheet ID: " SPREADSHEET_ID
done

# Get Drive Folder ID
read -p "Google Drive Folder ID: " DRIVE_FOLDER_ID
while [ -z "$DRIVE_FOLDER_ID" ]; do
    echo "❌ Drive Folder ID cannot be empty"
    read -p "Google Drive Folder ID: " DRIVE_FOLDER_ID
done

# Create .env file
cat > .env << EOF
# Google Cloud Configuration
REACT_APP_GOOGLE_CLIENT_ID=$CLIENT_ID
REACT_APP_GOOGLE_CLIENT_SECRET=$CLIENT_SECRET
REACT_APP_GOOGLE_API_KEY=$API_KEY

# Google Sheets Configuration
REACT_APP_GOOGLE_SPREADSHEET_ID=$SPREADSHEET_ID

# Google Drive Configuration
REACT_APP_GOOGLE_DRIVE_FOLDER_ID=$DRIVE_FOLDER_ID

# Service Account
GOOGLE_SERVICE_ACCOUNT_KEY=./credentials/service-account-key.json

# Environment
NODE_ENV=development

# API Configuration
REACT_APP_API_URL=http://localhost:3000
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "📋 Summary:"
echo "  - OAuth Client ID: ${CLIENT_ID:0:20}..."
echo "  - API Key: ${API_KEY:0:20}..."
echo "  - Spreadsheet ID: $SPREADSHEET_ID"
echo "  - Drive Folder ID: $DRIVE_FOLDER_ID"
echo ""
echo "🚀 Next steps:"
echo "  1. Review .env file: cat .env"
echo "  2. Test locally: npm start"
echo "  3. Build for production: npm run build"
echo ""
