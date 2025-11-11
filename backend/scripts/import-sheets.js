#!/usr/bin/env node

/**
 * Import Sheets from Backup Script
 *
 * Script để import (restore) dữ liệu từ JSON backup file vào Google Sheets
 *
 * Usage:
 *   node backend/scripts/import-sheets.js --file backup/sheets-backup.json
 *   node backend/scripts/import-sheets.js --file backup/sheets-backup.json --sheet Carriers
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

const BACKUP_FILE = fileArg !== -1 ? args[fileArg + 1] : null;
const TARGET_SHEET = sheetArg !== -1 ? args[sheetArg + 1] : null;

if (!BACKUP_FILE) {
  console.error('❌ Error: --file argument is required');
  console.log('\nUsage:');
  console.log('  node backend/scripts/import-sheets.js --file backup/sheets-backup.json');
  console.log(
    '  node backend/scripts/import-sheets.js --file backup/sheets-backup.json --sheet Carriers'
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
 * Read backup file
 */
async function readBackupFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('❌ Error reading backup file:', error.message);
    throw error;
  }
}

/**
 * Import data to a single sheet
 */
async function importSheet(sheets, sheetData) {
  const { name, headers, data } = sheetData;

  try {
    console.log(`📤 Importing sheet: ${name}...`);

    if (!data || data.length === 0) {
      console.log(`⚠️  Sheet "${name}" has no data to import`);
      return { name, success: false, reason: 'No data' };
    }

    // Convert objects back to rows
    const rows = [headers, ...data.map((obj) => headers.map((header) => obj[header] || ''))];

    // Clear existing data
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: name,
    });

    // Import new data
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: name,
      valueInputOption: 'RAW',
      requestBody: {
        values: rows,
      },
    });

    console.log(`✅ Imported ${data.length} rows to "${name}"`);

    return {
      name,
      success: true,
      rowCount: data.length,
      importedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`❌ Error importing sheet "${name}":`, error.message);
    return {
      name,
      success: false,
      error: error.message,
    };
  }
}

/**
 * Main import function
 */
async function importSheets() {
  console.log('🚀 Starting Google Sheets import...\n');
  console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);
  console.log(`📄 Backup file: ${BACKUP_FILE}`);
  if (TARGET_SHEET) {
    console.log(`🎯 Target sheet: ${TARGET_SHEET}`);
  }
  console.log('');

  try {
    // Initialize API
    const sheets = await initSheetsAPI();
    console.log('✅ Google Sheets API initialized\n');

    // Read backup file
    console.log('📖 Reading backup file...');
    const backupData = await readBackupFile(BACKUP_FILE);
    console.log(`✅ Backup file loaded (${backupData.sheets.length} sheets)\n`);

    // Filter sheets if target specified
    const sheetsToImport = TARGET_SHEET
      ? backupData.sheets.filter((s) => s.name === TARGET_SHEET)
      : backupData.sheets;

    if (sheetsToImport.length === 0) {
      if (TARGET_SHEET) {
        console.error(`❌ Sheet "${TARGET_SHEET}" not found in backup file`);
      } else {
        console.error('❌ No sheets found in backup file');
      }
      process.exit(1);
    }

    console.log(`📋 Importing ${sheetsToImport.length} sheet(s):\n`);
    sheetsToImport.forEach((sheet, index) => {
      console.log(`   ${index + 1}. ${sheet.name} (${sheet.rowCount} rows)`);
    });
    console.log('');

    // Confirm import (in production, you might want to add a prompt here)
    console.log('⚠️  WARNING: This will overwrite existing data in the specified sheets!');
    console.log('⏳ Starting import in 3 seconds...\n');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Import each sheet
    const results = [];
    for (const sheetData of sheetsToImport) {
      const result = await importSheet(sheets, sheetData);
      results.push(result);

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('\n✅ Import completed!\n');
    console.log('📊 Summary:');
    console.log(`   Total sheets: ${results.length}`);
    console.log(`   Successful: ${results.filter((r) => r.success).length}`);
    console.log(`   Failed: ${results.filter((r) => !r.success).length}`);
    console.log(`   Total rows: ${results.reduce((sum, r) => sum + (r.rowCount || 0), 0)}\n`);

    if (results.some((r) => !r.success)) {
      console.log('⚠️  Failed imports:');
      results
        .filter((r) => !r.success)
        .forEach((r) => {
          console.log(`   - ${r.name}: ${r.reason || r.error}`);
        });
      console.log('');
    }

    return results;
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Run import if called directly
if (require.main === module) {
  importSheets()
    .then(() => {
      console.log('✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { importSheets, importSheet };
