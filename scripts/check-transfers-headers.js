#!/usr/bin/env node

/**
 * Kiểm tra header của sheet "Transfers" có đúng chuẩn tiếng Anh hay không.
 *
 * Chạy bằng:
 *   node scripts/check-transfers-headers.js
 *
 * Có thể override bằng biến môi trường:
 *   TRANSFERS_SPREADSHEET_ID : Spreadsheet ID (mặc định dùng cùng ID với backend)
 *   TRANSFERS_SHEET_NAME     : Tên sheet (mặc định "Transfers")
 *   GOOGLE_APPLICATION_CREDENTIALS : đường dẫn file service account (nếu khác backend)
 */

const path = require("path");
const { google } = require("googleapis");

const DEFAULT_SPREADSHEET_ID =
  process.env.TRANSFERS_SPREADSHEET_ID || "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As";
const DEFAULT_SHEET_NAME = process.env.TRANSFERS_SHEET_NAME || "Transfers";

const EXPECTED_HEADERS = [
  "transfer_id",
  "orderCode",
  "hasVali",
  "date",
  "source",
  "dest",
  "quantity",
  "state",
  "transportStatus",
  "note",
  "pkgS",
  "pkgM",
  "pkgL",
  "pkgBagSmall",
  "pkgBagMedium",
  "pkgBagLarge",
  "pkgOther",
  "totalPackages",
  "volS",
  "volM",
  "volL",
  "volBagSmall",
  "volBagMedium",
  "volBagLarge",
  "volOther",
  "totalVolume",
  "dest_id",
  "source_id",
  "employee",
  "address",
  "ward",
  "district",
  "province",
];

async function getSheetsClient() {
  const keyFile =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(__dirname, "../backend/sinuous-aviary-474820-e3-c442968a0e87.json");

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  });

  return google.sheets({ version: "v4", auth });
}

function columnNumberToLetter(num) {
  let result = "";
  let n = num;
  while (n > 0) {
    n -= 1;
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26);
  }
  return result || "A";
}

async function fetchHeaders(spreadsheetId, sheetName) {
  const sheets = await getSheetsClient();
  const endColumn = columnNumberToLetter(EXPECTED_HEADERS.length);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:${endColumn}1`,
  });

  return response.data.values?.[0] || [];
}

function compareHeaders(actualHeaders) {
  const missing = EXPECTED_HEADERS.filter((header) => !actualHeaders.includes(header));
  const unexpected = actualHeaders.filter((header) => !EXPECTED_HEADERS.includes(header));

  const mismatchedOrder = [];
  const maxLength = Math.max(EXPECTED_HEADERS.length, actualHeaders.length);
  for (let index = 0; index < maxLength; index += 1) {
    const expected = EXPECTED_HEADERS[index] ?? "(none)";
    const actual = actualHeaders[index] ?? "(none)";
    if (expected !== actual) {
      mismatchedOrder.push({ position: index + 1, expected, actual });
    }
  }

  return { missing, unexpected, mismatchedOrder };
}

async function main() {
  const spreadsheetId = DEFAULT_SPREADSHEET_ID;
  const sheetName = DEFAULT_SHEET_NAME;

  console.log("🔍 Kiểm tra header sheet Transfers");
  console.log("   Spreadsheet ID :", spreadsheetId);
  console.log("   Sheet name     :", sheetName);

  try {
    const headers = await fetchHeaders(spreadsheetId, sheetName);
    if (headers.length === 0) {
      console.log("⚠️  Sheet chưa có dữ liệu header (A1 trống).");
      return;
    }

    console.log(`📄 Header hiện tại (${headers.length} cột):`);
    console.log(headers.join(", "));

    const { missing, unexpected, mismatchedOrder } = compareHeaders(headers);

    if (missing.length === 0 && unexpected.length === 0 && mismatchedOrder.length === 0) {
      console.log("✅ Header khớp hoàn toàn với chuẩn tiếng Anh.");
      return;
    }

    if (missing.length > 0) {
      console.log("\n❌ Thiếu các cột:");
      missing.forEach((header) => console.log(`  - ${header}`));
    }

    if (unexpected.length > 0) {
      console.log("\n⚠️  Cột không nằm trong chuẩn (nên kiểm tra lại):");
      unexpected.forEach((header) => console.log(`  - ${header}`));
    }

    if (mismatchedOrder.length > 0) {
      console.log("\nℹ️  Thứ tự cột chưa đúng, chi tiết:");
      mismatchedOrder.forEach(({ position, expected, actual }) => {
        console.log(`  - Vị trí ${position}: expected "${expected}" nhưng hiện tại "${actual}"`);
      });
    }
  } catch (error) {
    console.error("❌ Lỗi khi kiểm tra header:", error.message || error);
    process.exitCode = 1;
  }
}

main();
