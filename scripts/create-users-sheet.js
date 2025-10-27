// Script to create Users sheet in Google Sheets
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Configuration
const SPREADSHEET_ID = '1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k';
const SERVICE_ACCOUNT_KEY_PATH = path.join(__dirname, '../credentials/mia-logistics-469406-71065c75ba6a.json');

async function createUsersSheet() {
  try {
    console.log('🚀 Starting Users Sheet creation...\n');

    // Load service account credentials
    if (!fs.existsSync(SERVICE_ACCOUNT_KEY_PATH)) {
      throw new Error(`Service account key not found at: ${SERVICE_ACCOUNT_KEY_PATH}`);
    }

    const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_KEY_PATH, 'utf8'));
    console.log('✅ Loaded service account credentials');

    // Authenticate
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Check if Users sheet exists
    console.log('📋 Checking existing sheets...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const existingSheets = spreadsheet.data.sheets.map(s => s.properties.title);
    console.log('Existing sheets:', existingSheets);

    // Create Users sheet if not exists
    if (!existingSheets.includes('Users')) {
      console.log('📝 Creating Users sheet...');
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        resource: {
          requests: [{
            addSheet: {
              properties: {
                title: 'Users',
                gridProperties: {
                  rowCount: 1000,
                  columnCount: 20,
                },
              },
            },
          }],
        },
      });
      console.log('✅ Users sheet created');
    } else {
      console.log('⚠️  Users sheet already exists');
    }

    // Prepare data
    const headers = [
      'Email', 'Password', 'Id', 'Name', 'Role', 'Department', 'Phone', 'Status', 'Picture'
    ];

    const users = [
      ['admin@mialogistics.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'user_001', 'Admin User', 'admin', 'IT', '0901234567', 'active', ''],
      ['manager@mialogistics.com', '866485796cfa8d7c0cf7111640205b83076433547577511d81f8030ae99ecea5', 'user_002', 'Manager User', 'manager', 'Operations', '0901234568', 'active', ''],
      ['operator@mialogistics.com', 'ec6e1c25258002eb1c67d15c7f45da7945fa4c58778fd7d88faa5e53e3b4698d', 'user_003', 'Operator User', 'operator', 'Warehouse', '0901234569', 'active', ''],
      ['driver@mialogistics.com', '494d022492052a06f8f81949639a1d148c1051fa3d4e4688fbd96efe649cd382', 'user_004', 'Driver User', 'driver', 'Transport', '0901234570', 'active', ''],
    ];

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A:Z',
    });

    // Add headers and data
    console.log('📊 Adding headers and user data...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A1',
      valueInputOption: 'RAW',
      resource: {
        values: [headers, ...users],
      },
    });

    console.log('✅ Users data added successfully');
    console.log(`\n📊 Total users: ${users.length}`);
    console.log('✅ Users sheet created and populated!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
createUsersSheet();
