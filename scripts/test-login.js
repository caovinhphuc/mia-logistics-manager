#!/usr/bin/env node

/**
 * Test Login Script
 * Test authentication với Google Sheets Users
 */

const axios = require("axios");
require("dotenv").config();

const BACKEND_URL = process.env.BACKEND_PORT ? `http://localhost:${process.env.BACKEND_PORT}` : "http://localhost:5050";
const TEST_EMAIL = "admin@mia.vn";
const TEST_PASSWORD = "admin123";

console.log("🔐 Testing Authentication...\n");

async function testLogin() {
  console.log("=".repeat(60));
  console.log("TEST: Authentication với Google Sheets");
  console.log("=".repeat(60));
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Email: ${TEST_EMAIL}`);
  console.log(`Password: ${TEST_PASSWORD}\n`);

  try {
    // Step 1: Test Backend Connection
    console.log("📡 Step 1: Testing backend connection...");
    try {
      const healthCheck = await axios.get(`${BACKEND_URL}/api/sheets/info`, { timeout: 5000 });
      console.log("✅ Backend is running");
      console.log(`   Status: ${healthCheck.status}`);
      if (healthCheck.data) {
        console.log(`   Spreadsheet: ${healthCheck.data.title || "N/A"}`);
      }
    } catch (error) {
      console.log("❌ Backend is not running");
      console.log(`   Error: ${error.message}`);
      console.log("\n⚠️  Please start backend first:");
      console.log("   node src/server.js");
      return;
    }
    console.log("");

    // Step 2: Read Users from Google Sheets
    console.log("📊 Step 2: Reading Users from Google Sheets...");
    try {
      const spreadsheetId = process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID || "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As";
      
      const response = await axios.post(`${BACKEND_URL}/api/sheets/read`, {
        spreadsheetId,
        sheetName: "Users",
        range: "A:H",
      });

      console.log("✅ Successfully read Users sheet");
      
      if (response.data.values && response.data.values.length > 0) {
        const headers = response.data.values[0];
        console.log(`   Headers: ${headers.join(", ")}`);
        console.log(`   Total users: ${response.data.values.length - 1}`);
        
        // Find user
        const userRowIndex = response.data.values.findIndex(
          (row, index) => index > 0 && row[headers.indexOf("email")] === TEST_EMAIL
        );
        
        if (userRowIndex > 0) {
          const userRow = response.data.values[userRowIndex];
          console.log(`\n✅ Found user: ${userRow[headers.indexOf("email")]}`);
          console.log(`   ID: ${userRow[headers.indexOf("id")]}`);
          console.log(`   Full Name: ${userRow[headers.indexOf("fullName")]}`);
          console.log(`   Role: ${userRow[headers.indexOf("roleId")]}`);
          console.log(`   Status: ${userRow[headers.indexOf("status")]}`);
          
          const passwordHash = userRow[headers.indexOf("passwordHash")];
          if (passwordHash) {
            console.log(`   Password Hash: ${passwordHash.substring(0, 30)}...`);
          }
        } else {
          console.log(`\n❌ User ${TEST_EMAIL} not found in sheet`);
        }
      } else {
        console.log("⚠️  No data found in Users sheet");
      }
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        if (error.response) {
          console.log(`   Status: ${error.response.status}`);
          console.log(`   Details:`, error.response.data);
        }
      }
      console.log("");

    // Step 3: Test Login Flow
    console.log("🔑 Step 3: Testing login flow...");
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

      if (loginResponse.data.success) {
        console.log("✅ Login successful!");
        console.log(`   User: ${loginResponse.data.user.name}`);
        console.log(`   Role: ${loginResponse.data.user.role}`);
        console.log(`   Email: ${loginResponse.data.user.email}`);
      } else {
        console.log("❌ Login failed");
        console.log(`   Error: ${loginResponse.data.error}`);
      }
    } catch (error) {
      console.log(`❌ Login error: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Details:`, error.response.data);
      }
    }
    console.log("");

    console.log("=".repeat(60));
    console.log("✅ Test completed!");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
}

// Run test
testLogin();
