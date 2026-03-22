#!/usr/bin/env node

/**
 * Simple Login Test Script
 * Test đăng nhập đơn giản
 */

const axios = require('axios');

console.log('🧪 Simple Login Test');
console.log('===================');
console.log('');

async function testLogin() {
  try {
    // Test 1: Backend health
    console.log('1️⃣ Testing backend health...');
    await axios.get('http://localhost:5050/health');
    console.log('✅ Backend is healthy');
    console.log('');

    // Test 2: Frontend status
    console.log('2️⃣ Testing frontend status...');
    const frontendResponse = await axios.get('http://localhost:3000');
    console.log('✅ Frontend is running (status:', frontendResponse.status + ')');
    console.log('');

    console.log('🎉 All services are running!');
    console.log('');
    console.log('🌐 Frontend: http://localhost:3000');
    console.log('🔧 Backend: http://localhost:5050');
    console.log('');
    console.log('📝 To test login:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Try to login with: admin@mia.vn');
    console.log('3. Check browser console for any errors');
    console.log(
      '4. If you see "Sheet Users not found", that means the system is working but needs the Users sheet in Google Spreadsheet'
    );
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
  }
}

// Run tests
testLogin();
