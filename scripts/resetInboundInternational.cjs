'use strict';

// Reset headers for InboundInternational sheet and optionally clear all data rows
// Usage:
//  VITE_GOOGLE_SHEETS_SPREADSHEET_ID=YOUR_ID node scripts/resetInboundInternational.cjs
// Optional: CLEAR_ALL=true to remove all rows except header

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

const SHEET_TITLE = 'InboundInternational';

const HEADERS = [
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
  'packagingTypes',
  'packagingQuantities',
  'packagingDescriptions',
  'timeline_cargoReady_est',
  'timeline_cargoReady_act',
  'timeline_cargoReady_status',
  'timeline_etd_est',
  'timeline_etd_act',
  'timeline_etd_status',
  'timeline_eta_est',
  'timeline_eta_act',
  'timeline_eta_status',
  'timeline_depart_est',
  'timeline_depart_act',
  'timeline_depart_status',
  'timeline_arrivalPort_est',
  'timeline_arrivalPort_act',
  'timeline_arrivalPort_status',
  'timeline_receive_est',
  'timeline_receive_act',
  'timeline_receive_status',
  'doc_checkBill_est',
  'doc_checkBill_act',
  'doc_checkBill_status',
  'doc_checkCO_est',
  'doc_checkCO_act',
  'doc_checkCO_status',
  'doc_sendDocs_est',
  'doc_sendDocs_act',
  'doc_sendDocs_status',
  'doc_customs_est',
  'doc_customs_act',
  'doc_customs_status',
  'doc_tax_est',
  'doc_tax_act',
  'doc_tax_status',
  'notes',
  'createdAt',
  'updatedAt',
];

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
  let sheet = doc.sheetsByTitle[SHEET_TITLE];
  if (!sheet) {
    sheet = await doc.addSheet({ title: SHEET_TITLE, headerValues: HEADERS });
    console.log('✅ Created sheet with new headers');
  } else {
    // Ensure sheet has enough columns before setting headers
    const neededCols = HEADERS.length;
    // Resize up or down to match exactly the required number of columns
    if (sheet.columnCount !== neededCols) {
      await sheet.resize({
        rowCount: sheet.rowCount || 1000,
        columnCount: neededCols,
      });
    }
    await sheet.setHeaderRow(HEADERS);
    console.log('✅ Headers reset');
  }

  if (String(process.env.CLEAR_ALL || '').toLowerCase() === 'true') {
    // Delete all rows after header
    const rows = await sheet.getRows();
    for (const r of rows) {
      await r.delete();
    }
    console.log('🧹 Cleared all rows');
  }

  console.log('🎯 Done.');
}

main().catch((e) => {
  console.error('❌ Reset failed:', e);
  process.exit(1);
});
