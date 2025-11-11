#!/usr/bin/env node

/**
 * Script để kiểm tra cấu trúc dữ liệu thực tế trong Google Sheets
 */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const path = require('path');

// Load environment variables
require('dotenv').config();

const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../server/service_account.json');

async function checkGoogleSheetsStructure() {
  try {
    console.log('🔍 Kiểm tra cấu trúc Google Sheets...');
    console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);
    console.log(`🔑 Service Account: ${SERVICE_ACCOUNT_PATH}`);

    // Load service account
    const serviceAccount = require(SERVICE_ACCOUNT_PATH);

    // Initialize Google Sheets
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth(serviceAccount);
    await doc.loadInfo();

    console.log(`📋 Spreadsheet Title: ${doc.title}`);
    console.log(`📄 Total Sheets: ${doc.sheetCount}`);

    // List all sheets
    console.log('\n📋 Danh sách các sheets:');
    doc.sheetsByIndex.forEach((sheet, index) => {
      console.log(`  ${index + 1}. ${sheet.title} (${sheet.rowCount} rows, ${sheet.columnCount} columns)`);
    });

    // Check Users sheet specifically
    const usersSheet = doc.sheetsByTitle['Users'];
    if (usersSheet) {
      console.log('\n👥 Users Sheet Structure:');

      // Get headers
      await usersSheet.loadHeaderRow();
      console.log('📋 Headers:', usersSheet.headerValues);

      // Get first few rows
      const rows = await usersSheet.getRows({ limit: 5 });
      console.log('\n📊 Sample Data (first 5 rows):');

      rows.forEach((row, index) => {
        console.log(`\nRow ${index + 1}:`);
        sheet.headerValues.forEach(header => {
          console.log(`  ${header}: ${row[header]}`);
        });
      });

      console.log(`\n📈 Total rows in Users sheet: ${usersSheet.rowCount}`);
    } else {
      console.log('\n❌ Users sheet not found!');
      console.log('Available sheets:', doc.sheetsByTitle);
    }

  } catch (error) {
    console.error('❌ Error checking Google Sheets structure:', error.message);

    if (error.message.includes('ENOENT')) {
      console.log('💡 Make sure service_account.json exists at:', SERVICE_ACCOUNT_PATH);
    }

    if (error.message.includes('403')) {
      console.log('💡 Check service account permissions in Google Cloud Console');
    }

    if (error.message.includes('404')) {
      console.log('💡 Check if spreadsheet ID is correct:', SPREADSHEET_ID);
    }
  }
}

// Run the check
checkGoogleSheetsStructure();
