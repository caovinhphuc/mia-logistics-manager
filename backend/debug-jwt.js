/**
 * Debug JWT Token Generation and Validation
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

console.log('🔍 JWT Debug Information:');
console.log('========================');
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', JWT_SECRET.length);
console.log('JWT_SECRET (first 10 chars):', JWT_SECRET.substring(0, 10) + '...');

// Test user data
const testUser = {
  userId: '1',
  email: 'admin@mia.vn',
  role: 'admin',
};

console.log('\n🧪 Testing JWT Token Generation:');
console.log('================================');

try {
  // Generate token
  const token = jwt.sign(testUser, JWT_SECRET, {
    expiresIn: '7d',
  });

  console.log('✅ Token generated successfully');
  console.log('Token length:', token.length);
  console.log('Token (first 50 chars):', token.substring(0, 50) + '...');

  // Verify token
  console.log('\n🔍 Testing JWT Token Verification:');
  console.log('==================================');

  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token verified successfully');
  console.log('Decoded payload:', decoded);

  // Test with wrong secret
  console.log('\n❌ Testing with wrong secret:');
  console.log('=============================');

  try {
    const wrongDecoded = jwt.verify(token, 'wrong-secret');
    console.log('⚠️ This should not happen - token verified with wrong secret!');
  } catch (wrongError) {
    console.log('✅ Correctly rejected token with wrong secret:', wrongError.message);
  }

  // Test expired token
  console.log('\n⏰ Testing expired token:');
  console.log('========================');

  const expiredToken = jwt.sign(testUser, JWT_SECRET, {
    expiresIn: '-1d', // Already expired
  });

  try {
    const expiredDecoded = jwt.verify(expiredToken, JWT_SECRET);
    console.log('⚠️ This should not happen - expired token accepted!');
  } catch (expiredError) {
    console.log('✅ Correctly rejected expired token:', expiredError.message);
  }
} catch (error) {
  console.error('❌ JWT Error:', error.message);
}

console.log('\n🌐 Testing Real Login Flow:');
console.log('===========================');

// Simulate real login
async function testRealLogin() {
  const fetch = (await import('node-fetch')).default;

  try {
    console.log('📡 Testing login endpoint...');

    const loginResponse = await fetch('http://localhost:5001/api/auth-sheets/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@mia.vn',
        password: 'admin123',
      }),
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful');
      console.log('Token received:', !!loginData.token);

      if (loginData.token) {
        console.log('Token length:', loginData.token.length);

        // Test the token with transfers endpoint
        console.log('\n📡 Testing transfers endpoint with token...');

        const transfersResponse = await fetch('http://localhost:5001/api/transfers', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${loginData.token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Transfers response status:', transfersResponse.status);

        if (transfersResponse.ok) {
          console.log('✅ Transfers request successful');
        } else {
          const errorText = await transfersResponse.text();
          console.log('❌ Transfers request failed:', errorText);
        }
      }
    } else {
      console.log('❌ Login failed:', loginResponse.status);
      const errorText = await loginResponse.text();
      console.log('Error:', errorText);
    }
  } catch (fetchError) {
    console.log('❌ Network error:', fetchError.message);
  }
}

// Run real login test
testRealLogin();
