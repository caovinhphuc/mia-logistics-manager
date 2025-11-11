'use strict';

// Delete legacy JSON columns from InboundInternational: packagingJson, timelineJson, documentStatusJson
// Usage:
//  VITE_GOOGLE_SHEETS_SPREADSHEET_ID=YOUR_ID node scripts/deleteInboundJsonColumns.cjs

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

const SHEET_TITLE = 'InboundInternational';
const TARGET_HEADERS = ['packagingJson', 'timelineJson', 'documentStatusJson'];

async function main() {
  const spreadsheetId =
    process.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID ||
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  let email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let key = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !key) {
    const p = path.resolve(__dirname, '../src/config/service-account-key.json');
    if (fs.existsSync(p)) {
      const json = JSON.parse(fs.readFileSync(p, 'utf8'));
      email = email || json.client_email;
      key = key || json.private_key;
    }
  }
  if (!spreadsheetId || !email || !key) {
    console.error('Missing credentials or spreadsheet id');
    process.exit(1);
  }

  const auth = new JWT({
    email,
    key: key.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ],
  });

  const doc = new GoogleSpreadsheet(spreadsheetId, auth);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[SHEET_TITLE];
  if (!sheet) {
    console.error('Sheet not found:', SHEET_TITLE);
    process.exit(1);
  }
  await sheet.loadHeaderRow();
  const headers = sheet.headerValues || [];

  // Collect indices (0-based) of columns to delete
  const toDelete = [];
  TARGET_HEADERS.forEach((h) => {
    const idx = headers.indexOf(h);
    if (idx !== -1) toDelete.push(idx);
  });

  if (toDelete.length === 0) {
    console.log('ℹ️ No legacy JSON columns found. Nothing to delete.');
    return;
  }

  // Sort descending to avoid shifting indices
  toDelete.sort((a, b) => b - a);

  for (const idx of toDelete) {
    // google-spreadsheet deleteColumns uses 1-based index for start? The lib uses 1-based column index.
    await sheet.deleteColumns(idx + 1, 1);
    console.log(`🗑️ Deleted column at index ${idx} (${headers[idx]})`);
  }

  console.log('✅ Done deleting legacy JSON columns');
}

main().catch((e) => {
  console.error('❌ Delete columns failed:', e);
  process.exit(1);
});
