#!/usr/bin/env node

/**
 * Export All Google Sheets Script
 *
 * Script để export tất cả sheets từ Google Spreadsheet thành JSON files
 * Dùng cho backup purposes
 *
 * Usage:
 *   node backend/scripts/export-all-sheets.js
 *   node backend/scripts/export-all-sheets.js --output ./backup/sheets-backup.json
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
const outputArg = args.findIndex((arg) => arg === '--output');
const OUTPUT_DIR =
  outputArg !== -1 && args[outputArg + 1]
    ? path.dirname(args[outputArg + 1])
    : path.join(process.cwd(), 'backup');
const OUTPUT_FILE =
  outputArg !== -1 && args[outputArg + 1]
    ? path.basename(args[outputArg + 1])
    : `sheets-export-${new Date().toISOString().split('T')[0]}.json`;

/**
 * Initialize Google Sheets API
 */
async function initSheetsAPI() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
  } catch (error) {
    console.error('❌ Error initializing Google Sheets API:', error.message);
    throw error;
  }
}

/**
 * Get all sheet names from spreadsheet
 */
async function getSheetNames(sheets) {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    return response.data.sheets.map((sheet) => sheet.properties.title);
  } catch (error) {
    console.error('❌ Error getting sheet names:', error.message);
    throw error;
  }
}

/**
 * Export data from a single sheet
 */
async function exportSheet(sheets, sheetName) {
  try {
    console.log(`📥 Exporting sheet: ${sheetName}...`);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      console.log(`⚠️  Sheet "${sheetName}" is empty`);
      return { name: sheetName, data: [], rowCount: 0 };
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Convert to array of objects
    const data = dataRows.map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    console.log(`✅ Exported ${data.length} rows from "${sheetName}"`);

    return {
      name: sheetName,
      headers,
      data,
      rowCount: data.length,
      exportedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`❌ Error exporting sheet "${sheetName}":`, error.message);
    return {
      name: sheetName,
      error: error.message,
      data: [],
      rowCount: 0,
    };
  }
}

/**
 * Main export function
 */
async function exportAllSheets() {
  console.log('🚀 Starting Google Sheets export...\n');
  console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`📄 Output file: ${OUTPUT_FILE}\n`);

  try {
    // Initialize API
    const sheets = await initSheetsAPI();
    console.log('✅ Google Sheets API initialized\n');

    // Get all sheet names
    const sheetNames = await getSheetNames(sheets);
    console.log(`📋 Found ${sheetNames.length} sheets:\n`);
    sheetNames.forEach((name, index) => {
      console.log(`   ${index + 1}. ${name}`);
    });
    console.log('');

    // Export each sheet
    const exports = [];
    for (const sheetName of sheetNames) {
      const exportData = await exportSheet(sheets, sheetName);
      exports.push(exportData);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Create output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Save to file
    const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
    const exportResult = {
      spreadsheetId: SPREADSHEET_ID,
      exportedAt: new Date().toISOString(),
      totalSheets: sheetNames.length,
      sheets: exports,
      summary: {
        totalRows: exports.reduce((sum, sheet) => sum + sheet.rowCount, 0),
        successfulSheets: exports.filter((sheet) => !sheet.error).length,
        failedSheets: exports.filter((sheet) => sheet.error).length,
      },
    };

    await fs.writeFile(outputPath, JSON.stringify(exportResult, null, 2), 'utf8');

    console.log('\n✅ Export completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Total sheets: ${exportResult.totalSheets}`);
    console.log(`   Successful: ${exportResult.summary.successfulSheets}`);
    console.log(`   Failed: ${exportResult.summary.failedSheets}`);
    console.log(`   Total rows: ${exportResult.summary.totalRows}`);
    console.log(`\n💾 Exported to: ${outputPath}`);
    console.log(`📦 File size: ${(await fs.stat(outputPath)).size} bytes\n`);

    return exportResult;
  } catch (error) {
    console.error('\n❌ Export failed:', error.message);
    process.exit(1);
  }
}

// Run export if called directly
if (require.main === module) {
  exportAllSheets()
    .then(() => {
      console.log('✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { exportAllSheets, exportSheet };
