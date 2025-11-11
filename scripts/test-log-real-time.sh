#!/bin/bash

# Test log hoạt động real-time

echo "🧪 Testing Real-time Logging"
echo ""

# Test 1: Backend log
echo "1️⃣ Starting backend và ghi log..."
node backend/server.cjs > logs/backend-test.log 2>&1 &
BACKEND_PID=$!
sleep 3

if [ -f "logs/backend-test.log" ]; then
    echo "✅ Log file created"
    echo "Content:"
    head -5 logs/backend-test.log
    echo ""
else
    echo "❌ Log file not created"
fi

# Test 2: Append log
echo "2️⃣ Appending to log..."
echo "$(date): Test entry" >> logs/backend-test.log
echo "✅ Appended entry"
echo "Last line:"
tail -1 logs/backend-test.log
echo ""

# Test 3: Check logs directory
echo "3️⃣ Checking logs directory..."
ls -lh logs/*.log | awk '{print $9, "-", $5}'
echo ""

# Cleanup
kill $BACKEND_PID 2>/dev/null || true
echo "✅ Test completed"

