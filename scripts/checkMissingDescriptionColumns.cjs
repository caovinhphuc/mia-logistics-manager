// Script để kiểm tra và thêm missing description columns vào Google Sheet InboundInternational
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load service account credentials
const serviceAccountPath = path.join(
  __dirname,
  '..',
  'src',
  'config',
  'service-account-key.json'
);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Load environment variables from server/.env
require('dotenv').config({
  path: path.join(__dirname, '..', 'server', '.env'),
});
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_NAME = 'InboundInternational';

// Required description columns
const REQUIRED_DESCRIPTION_COLUMNS = [
  'timeline_created_description',
  'timeline_cargoReady_description',
  'timeline_etd_description',
  'timeline_eta_description',
  'timeline_depart_description',
  'timeline_arrivalPort_description',
  'timeline_receive_description',
  'doc_checkBill_description',
  'doc_checkCO_description',
  'doc_sendDocs_description',
  'doc_customs_description',
  'doc_tax_description',
];

async function checkAndAddMissingColumns() {
  try {
    console.log('🔍 Kiểm tra Google Sheet columns...');

    // Get current headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!1:1`,
    });

    const currentHeaders = response.data.values?.[0] || [];
    console.log(`📊 Current headers count: ${currentHeaders.length}`);
    console.log('📋 Current headers:', currentHeaders.slice(0, 10), '...'); // Show first 10

    // Find missing columns
    const missingColumns = REQUIRED_DESCRIPTION_COLUMNS.filter(
      (col) => !currentHeaders.includes(col)
    );

    if (missingColumns.length === 0) {
      console.log('✅ Tất cả description columns đã có!');
      return;
    }

    console.log(
      `❌ Missing ${missingColumns.length} description columns:`,
      missingColumns
    );

    // Add missing columns to the end
    const newHeaders = [...currentHeaders, ...missingColumns];

    console.log(`➕ Adding ${missingColumns.length} columns...`);

    // Update headers row
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!1:1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [newHeaders],
      },
    });

    console.log(
      `✅ Successfully added ${missingColumns.length} description columns!`
    );
    console.log(`📊 New headers count: ${newHeaders.length}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run script
checkAndAddMissingColumns();
