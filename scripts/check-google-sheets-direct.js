#!/usr/bin/env node

/**
 * Script để kiểm tra Google Sheets bằng Google Sheets API trực tiếp
 */

const { google } = require('googleapis');
const path = require('path');

// Load environment variables
require('dotenv').config();

const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../server/service_account.json');

async function checkGoogleSheets() {
  try {
    console.log('🔍 Kiểm tra Google Sheets bằng Google Sheets API...');
    console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);

    // Load service account
    const serviceAccount = require(SERVICE_ACCOUNT_PATH);
    console.log(`🔑 Service Account: ${serviceAccount.client_email}`);

    // Create JWT auth client
    const auth = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    // Create Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth });

    // Get spreadsheet metadata
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    console.log(`📋 Spreadsheet Title: ${spreadsheet.data.properties.title}`);
    console.log(`📄 Total Sheets: ${spreadsheet.data.sheets.length}`);

    // List all sheets
    console.log('\n📋 Danh sách các sheets:');
    spreadsheet.data.sheets.forEach((sheet, index) => {
      console.log(`  ${index + 1}. ${sheet.properties.title} (${sheet.properties.gridProperties.rowCount} rows, ${sheet.properties.gridProperties.columnCount} columns)`);
    });

    // Check Users sheet specifically
    const usersSheet = spreadsheet.data.sheets.find(sheet => sheet.properties.title === 'Users');
    if (usersSheet) {
      console.log('\n👥 Users Sheet found!');

      // Get data from Users sheet
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Users!A1:Z10', // Get first 10 rows
      });

      const values = response.data.values;
      if (values && values.length > 0) {
        console.log('\n📋 Headers:', values[0]);

        console.log('\n📊 Sample Data (first 3 rows):');
        for (let i = 1; i < Math.min(4, values.length); i++) {
          console.log(`\nRow ${i}:`);
          values[0].forEach((header, colIndex) => {
            console.log(`  ${header}: ${values[i][colIndex] || ''}`);
          });
        }

        console.log(`\n📈 Total rows in Users sheet: ${values.length}`);
      } else {
        console.log('\n❌ No data found in Users sheet');
      }
    } else {
      console.log('\n❌ Users sheet not found!');
      console.log('Available sheets:', spreadsheet.data.sheets.map(s => s.properties.title));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);

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
checkGoogleSheets();
