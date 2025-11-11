#!/usr/bin/env node

/**
 * Import CSV to Google Sheets Script
 *
 * Script để import CSV file vào Google Sheets
 * Useful cho migration từ Excel/CSV sang Google Sheets
 *
 * Usage:
 *   node backend/scripts/import-csv-to-sheets.js --file data/carriers.csv --sheet Carriers
 *   node backend/scripts/import-csv-to-sheets.js --file data/carriers.csv --sheet Carriers --append
 */

const { google } = require('googleapis');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const SPREADSHEET_ID =
  process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../sinuous-aviary-474820-e3-c442968a0e87.json');

// Parse command line arguments
const args = process.argv.slice(2);
const fileArg = args.findIndex((arg) => arg === '--file');
const sheetArg = args.findIndex((arg) => arg === '--sheet');
const appendMode = args.includes('--append');

const CSV_FILE = fileArg !== -1 ? args[fileArg + 1] : null;
const SHEET_NAME = sheetArg !== -1 ? args[sheetArg + 1] : null;

if (!CSV_FILE || !SHEET_NAME) {
  console.error('❌ Error: --file and --sheet arguments are required');
  console.log('\nUsage:');
  console.log(
    '  node backend/scripts/import-csv-to-sheets.js --file data/carriers.csv --sheet Carriers'
  );
  console.log(
    '  node backend/scripts/import-csv-to-sheets.js --file data/carriers.csv --sheet Carriers --append'
  );
  process.exit(1);
}

/**
 * Initialize Google Sheets API
 */
async function initSheetsAPI() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
  } catch (error) {
    console.error('❌ Error initializing Google Sheets API:', error.message);
    throw error;
  }
}

/**
 * Parse CSV file
 */
async function parseCSV(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n').filter((line) => line.trim());

    // Simple CSV parser (doesn't handle quoted commas)
    const rows = lines.map((line) => {
      return line.split(',').map((cell) => cell.trim());
    });

    return rows;
  } catch (error) {
    console.error('❌ Error parsing CSV file:', error.message);
    throw error;
  }
}

/**
 * Import CSV data to sheet
 */
async function importCSVToSheet(sheets, sheetName, csvData, append = false) {
  try {
    console.log(`📤 Importing to sheet: ${sheetName}...`);
    console.log(`📊 Rows to import: ${csvData.length}`);
    console.log(`🔧 Mode: ${append ? 'APPEND' : 'REPLACE'}`);

    if (!append) {
      // Clear existing data
      console.log('🗑️  Clearing existing data...');
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: sheetName,
      });
    }

    // Import new data
    const range = append ? `${sheetName}!A:Z` : sheetName;
    const valueInputOption = 'RAW';

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption,
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: csvData,
      },
    });

    console.log(`✅ Successfully imported ${csvData.length} rows to "${sheetName}"`);

    return {
      success: true,
      rowCount: csvData.length,
      sheetName,
    };
  } catch (error) {
    console.error(`❌ Error importing to sheet:`, error.message);
    throw error;
  }
}

/**
 * Main import function
 */
async function importCSV() {
  console.log('🚀 Starting CSV to Google Sheets import...\n');
  console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);
  console.log(`📄 CSV File: ${CSV_FILE}`);
  console.log(`📋 Target Sheet: ${SHEET_NAME}`);
  console.log(`🔧 Append Mode: ${appendMode ? 'Yes' : 'No'}\n`);

  try {
    // Initialize API
    const sheets = await initSheetsAPI();
    console.log('✅ Google Sheets API initialized\n');

    // Parse CSV
    console.log('📖 Reading CSV file...');
    const csvData = await parseCSV(CSV_FILE);
    console.log(`✅ Parsed ${csvData.length} rows\n`);

    if (csvData.length === 0) {
      console.log('⚠️  CSV file is empty. Nothing to import.');
      return;
    }

    // Preview first few rows
    console.log('👀 Preview (first 3 rows):');
    csvData.slice(0, 3).forEach((row, index) => {
      console.log(
        `   ${index + 1}. ${row.slice(0, 5).join(' | ')}${row.length > 5 ? ' | ...' : ''}`
      );
    });
    console.log('');

    // Confirm import
    if (!appendMode) {
      console.log('⚠️  WARNING: This will replace existing data in the sheet!');
      console.log('⏳ Starting import in 2 seconds...\n');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // Import
    const result = await importCSVToSheet(sheets, SHEET_NAME, csvData, appendMode);

    console.log('\n✅ Import completed!\n');
    console.log('📊 Summary:');
    console.log(`   Sheet: ${result.sheetName}`);
    console.log(`   Rows imported: ${result.rowCount}`);
    console.log(`   Mode: ${appendMode ? 'APPEND' : 'REPLACE'}\n`);

    return result;
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run import if called directly
if (require.main === module) {
  importCSV()
    .then(() => {
      console.log('✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { importCSV, parseCSV, importCSVToSheet };
