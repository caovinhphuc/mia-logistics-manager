#!/usr/bin/env node
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

// Load environment variables nếu có
try {
  require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
} catch (error) {
  // Không có file .env cũng không sao
}

const USERS_SHEET = "Users";
const EXPECTED_HEADERS = [
  "id",
  "email",
  "passwordHash",
  "fullName",
  "roleId",
  "status",
  "createdAt",
  "updatedAt",
];

const spreadsheetId =
  process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As";

const keyFile =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.resolve(__dirname, "../backend/mia-logistics-469406-eec521c603c0.json");

if (!fs.existsSync(keyFile)) {
  console.error("❌ Không tìm thấy file key service account:", keyFile);
  process.exit(1);
}

async function main() {
  try {
    console.log("🔐 Đang dùng service account:", keyFile);
    console.log("🧾 Spreadsheet ID:", spreadsheetId);

    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Đọc header + dữ liệu
    const range = `${USERS_SHEET}!A1:H1000`;
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = resp.data.values || [];
    if (rows.length === 0) {
      console.log("⚠️ Sheet Users trống hoặc không có dữ liệu.");
      return;
    }

    const headers = rows[0];
    console.log("📋 Header hiện tại:", headers.join(", "));

    const missingHeaders = EXPECTED_HEADERS.filter((h) => !headers.includes(h));
    if (missingHeaders.length > 0) {
      console.log("⚠️ Thiếu các cột:", missingHeaders.join(", "));
    }

    const records = rows.slice(1).map((row, rowIndex) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = row[index] ?? "";
      });
      return { row: rowIndex + 2, record };
    });

    if (records.length === 0) {
      console.log("⚠️ Không có bản ghi nào ngoài header.");
      return;
    }

    console.log("\n👥 Danh sách người dùng (ẩn passwordHash):");
    records.forEach(({ row, record }) => {
      const { passwordHash, ...safeRecord } = record;
      console.log(`- Row ${row}:`, safeRecord);
    });
  } catch (error) {
    console.error("❌ Lỗi khi đọc sheet Users:", error.message);
    if (error.response) {
      console.error("ℹ️  Chi tiết:", error.response.data);
    }
    process.exit(1);
  }
}

main();
