#!/bin/bash

# MIA Logistics Manager - Simple Startup Script
# For Create React App only

echo "🚀 Starting MIA Logistics Manager..."
echo "==================================="

# Kill existing processes
echo "🧹 Cleaning up old processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 2

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the app
echo "🎨 Starting development server..."
echo ""
echo "✅ Application will be available at: http://localhost:3000"
echo "⏳ Please wait for compilation to complete (30-60 seconds)"
echo ""
echo "Press Ctrl+C to stop"
echo ""

PORT=3000 npm start
