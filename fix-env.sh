#!/bin/bash

echo "🔧 Fixing .env file..."

# Fix REACT_APP_API_BASE_URL
sed -i.bak "s|REACT_APP_API_BASE_URL=http://localhost:\${BACKEND_PORT}|REACT_APP_API_BASE_URL=http://localhost:3100|g" .env

echo "✅ Fixed REACT_APP_API_BASE_URL"
echo ""
echo "📝 Please restart the frontend to apply changes:"
echo "   - Stop the current frontend (Ctrl+C)"
echo "   - Run: npm start"
echo ""
echo "🎯 Or use the start script:"
echo "   ./start.sh"
