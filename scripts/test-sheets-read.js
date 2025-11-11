#!/usr/bin/env node

const axios = require("axios");
require("dotenv").config();

const BACKEND_URL = process.env.BACKEND_PORT
  ? `http://localhost:${process.env.BACKEND_PORT}`
  : "http://localhost:5050";
const SPREADSHEET_ID =
  process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID ||
  "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As";

console.log("🔍 Testing /api/sheets/read endpoint...\n");
console.log("Backend URL:", BACKEND_URL);
console.log("Spreadsheet ID:", SPREADSHEET_ID);
console.log("");

async function testRead() {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/sheets/read`,
      {
        spreadsheetId: SPREADSHEET_ID,
        sheetName: "Users",
        range: "A:H",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("✅ Success!");
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("❌ Error!");
    console.log("Status:", error.response?.status);
    console.log("Error:", error.response?.data || error.message);
    console.log("");
    if (error.response?.data) {
      console.log("Response data:");
      console.log(JSON.stringify(error.response.data, null, 2));
    }
  }
}

testRead();
