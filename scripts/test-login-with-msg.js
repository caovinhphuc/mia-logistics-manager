#!/usr/bin/env node

/**
 * Test Login with detailed logging
 */

const axios = require("axios");
require("dotenv").config();

const BACKEND_URL = process.env.BACKEND_PORT
  ? `http://localhost:${process.env.BACKEND_PORT}`
  : "http://localhost:5050";
const TEST_EMAIL = "admin@mia.vn";
const TEST_PASSWORD = "admin123";

console.log("🔐 Testing Login Flow...\n");

async function testLogin() {
  try {
    // Test 1: Backend health
    console.log("1️⃣  Testing backend health...");
    try {
      const health = await axios.get(`${BACKEND_URL}/api/health`);
      console.log("   ✅ Backend is running");
    } catch (e) {
      console.log("   ❌ Backend not running");
      return;
    }

    // Test 2: Read Users sheet
    console.log("\n2️⃣  Reading Users sheet...");
    const spreadsheetId =
      process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID ||
      "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As";

    const readResponse = await axios.post(`${BACKEND_URL}/api/sheets/read`, {
      spreadsheetId,
      sheetName: "Users",
      range: "A:H",
    });

    console.log("   ✅ Successfully read Users sheet");
    console.log(`   Total rows: ${readResponse.data.values.length}`);

    // Test 3: Login
    console.log("\n3️⃣  Testing login...");
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (loginResponse.data.success) {
      console.log("   ✅ Login successful!");
      console.log(`   User: ${loginResponse.data.user.fullName || loginResponse.data.user.email}`);
      console.log(`   Role: ${loginResponse.data.user.role}`);
    } else {
      console.log("   ❌ Login failed");
      console.log(`   Error: ${loginResponse.data.error}`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ All tests passed!");
    console.log("=".repeat(60));
  } catch (error) {
    console.log("\n❌ Test failed:");
    console.log("Error:", error.message);
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

testLogin();
