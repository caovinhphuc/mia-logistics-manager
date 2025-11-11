#!/usr/bin/env node

/**
 * Test script để verify authentication và authorization
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

console.log('🧪 Starting Authentication & Authorization Tests...\n');

async function testHealth() {
  console.log('1. Testing health endpoint...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
}

async function testUnauthenticatedAccess() {
  console.log('\n2. Testing unauthenticated access...');
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/me`);
    console.log('❌ Should have been denied but got:', response.data);
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly denied access:', error.response.data.message);
      return true;
    } else {
      console.log('❌ Unexpected error:', error.message);
      return false;
    }
  }
}

async function testInvalidToken() {
  console.log('\n3. Testing invalid token...');
  try {
    const response = await axios.get(`${BASE_URL}/api/auth-sheets/me`, {
      headers: {
        Authorization: 'Bearer invalid-token-here',
      },
    });
    console.log('❌ Should have been denied but got:', response.data);
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly rejected invalid token:', error.response.data.message);
      return true;
    } else {
      console.log('❌ Unexpected error:', error.message);
      return false;
    }
  }
}

async function testLoginWithoutCredentials() {
  console.log('\n4. Testing login without credentials...');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth-sheets/login`, {});
    console.log('❌ Should have been denied but got:', response.data);
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly rejected empty credentials:', error.response.data.message);
      return true;
    } else {
      console.log('❌ Unexpected error:', error.message);
      return false;
    }
  }
}

async function testLoginWithInvalidCredentials() {
  console.log('\n5. Testing login with invalid credentials...');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth-sheets/login`, {
      email: 'nonexistent@test.com',
      password: 'wrongpassword',
    });
    console.log('❌ Should have been denied but got:', response.data);
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly rejected invalid credentials:', error.response.data.message);
      return true;
    } else {
      console.log('❌ Unexpected error:', error.message);
      return false;
    }
  }
}

async function testMiddlewareErrorHandling() {
  console.log('\n6. Testing middleware error handling...');
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/permissions`, {
      headers: {
        Authorization: 'Bearer malformed.jwt.token',
      },
    });
    console.log('❌ Should have been denied but got:', response.data);
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Correctly handled malformed token:', error.response.data.message);
      return true;
    } else {
      console.log('❌ Unexpected error:', error.message);
      return false;
    }
  }
}

async function runTests() {
  const tests = [
    testHealth,
    testUnauthenticatedAccess,
    testInvalidToken,
    testLoginWithoutCredentials,
    testLoginWithInvalidCredentials,
    testMiddlewareErrorHandling,
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All authentication and authorization tests passed!');
    console.log('✅ Middleware is working correctly');
    console.log('✅ Security is properly implemented');
    console.log('✅ Error handling is functioning');
  } else {
    console.log('\n⚠️ Some tests failed. Please review the implementation.');
  }
}

// Run tests
runTests().catch(console.error);
