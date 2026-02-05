'use strict';

// Node script: Initialize Google Sheet: InboundInternational with headers
// Usage: node scripts/initInboundInternational.cjs

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Inline constants to avoid requiring a build step
const SHEET_TITLE = 'InboundInternational';
const INBOUND_INTERNATIONAL_HEADERS = [
  'id',
  'date',
  'pi',
  'supplier',
  'origin',
  'destination',
  'product',
  'category',
  'quantity',
  'container',
  'status',
  'carrier',
  'purpose',
  'receiveTime',
  'poNumbers',
  'packagingJson',
  'timelineJson',
  'documentStatusJson',
  'notes',
  'createdAt',
  'updatedAt',
];

async function main() {
  // Fallback: read credentials from src/config/service-account-key.json if env not set
  const fs = require('fs');
  const path = require('path');

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

  const spreadsheetId =
    process.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID ||
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!email || !key || !spreadsheetId) {
    console.error('Missing credentials for Google Sheets.');
    process.exit(1);
  }

  const serviceAccountAuth = new JWT({
    email,
    key: key.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ],
  });

  const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
  await doc.loadInfo();

  let sheet = doc.sheetsByTitle[SHEET_TITLE];
  if (!sheet) {
    sheet = await doc.addSheet({
      title: SHEET_TITLE,
      headerValues: INBOUND_INTERNATIONAL_HEADERS,
    });
    console.log('✅ Created sheet InboundInternational with headers');
  } else {
    console.log(
      'ℹ️ Sheet InboundInternational already exists. Ensuring headers...'
    );
    await sheet.setHeaderRow(INBOUND_INTERNATIONAL_HEADERS);
    console.log('✅ Headers ensured');
  }
}

main().catch((err) => {
  console.error('❌ Failed to initialize InboundInternational sheet:', err);
  process.exit(1);
});
