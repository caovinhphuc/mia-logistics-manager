#!/usr/bin/env node

/**
 * Script to create Users sheet using Google Sheets API
 * Falls back to local file if API is unavailable
 */

require('dotenv').config();

// Configuration
const SPREADSHEET_ID =
  process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const BACKEND_API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3100';

console.log('🚀 Creating Users Sheet via Backend API');
console.log('===============================================');
console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`Backend API: ${BACKEND_API_URL}`);
console.log('');

async function createUsersSheet() {
  try {
    // Note: APPS_SCRIPT_WEB_APP_URL is optional, we'll use Backend API as fallback

    // Prepare data for Users sheet
    const usersData = [
      ['id', 'email', 'name', 'role', 'status', 'created_at'],
      ['u-admin', 'admin@mia.vn', 'Admin User', 'admin', 'active', '2024-01-01'],
      ['u-manager1', 'manager1@mia.vn', 'Manager 1', 'manager', 'active', '2024-01-01'],
      ['u-operator1', 'operator1@mia.vn', 'Operator 1', 'warehouse_staff', 'active', '2024-01-01'],
      ['u-driver1', 'driver1@mia.vn', 'Driver 1', 'driver', 'active', '2024-01-01'],
      [
        'u-warehouse1',
        'warehouse1@mia.vn',
        'Warehouse Staff 1',
        'warehouse_staff',
        'active',
        '2024-01-01',
      ],
    ];

    console.log('📋 Preparing Users sheet data...');
    console.log(`   - Headers: ${usersData[0].join(', ')}`);
    console.log(`   - Users: ${usersData.length - 1} users`);

    // Create Users sheet via Backend API
    console.log('\n🔧 Creating Users sheet via Backend API...');

    const response = await fetch(`${BACKEND_API_URL}/api/sheets/create-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        spreadsheetId: SPREADSHEET_ID,
        sheetName: 'Users',
        headers: usersData[0],
        data: usersData.slice(1),
      }),
    }).catch((err) => {
      console.log('⚠️  Backend API not available, creating local mock setup...');
      return null;
    });

    if (response && response.ok) {
      const result = await response.json();
      if (result.success) {
        console.log('✅ Users sheet created successfully via Backend API!');
        console.log(`   - Sheet name: ${result.sheetName}`);
        console.log(`   - Rows added: ${result.rowsAdded}`);
        console.log(`   - Columns: ${result.columns}`);
      } else {
        throw new Error(result.error || 'Failed to create Users sheet');
      }
    } else if (!response) {
      // Fallback: Create a local mock setup
      createLocalMockSetup(usersData);
    } else {
      throw new Error(`Failed to create sheet: ${response.status} ${response.statusText}`);
    }
    console.log('\n✅ Users sheet setup completed!');
    console.log('\nYou can now login with:');
    console.log('   Email: admin@mia.vn');
    console.log('   Role: admin');
    console.log('\nOther demo accounts:');
    console.log('   Email: manager1@mia.vn (role: manager)');
    console.log('   Email: operator1@mia.vn (role: warehouse_staff)');
    console.log('   Email: driver1@mia.vn (role: driver)');
  } catch (error) {
    console.error('❌ Error creating Users sheet:', error.message);

    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure the backend API is running (npm run dev:backend)');
    console.log('2. Check if REACT_APP_API_BASE_URL is set correctly in .env');
    console.log('3. Verify Google Sheets credentials are configured');
    console.log('');
    console.log(
      'Alternative: You can manually create the Users sheet in your spreadsheet with the structure above.'
    );

    process.exit(1);
  }
}

/**
 * Fallback: Create a local mock setup
 */
function createLocalMockSetup(usersData) {
  const fs = require('fs');
  const path = require('path');

  const mockDataDir = path.join(__dirname, '..', 'src', 'mocks');
  if (!fs.existsSync(mockDataDir)) {
    fs.mkdirSync(mockDataDir, { recursive: true });
  }

  const mockDataFile = path.join(mockDataDir, 'users.json');
  const usersWithoutHeaders = usersData.slice(1).map((row) => ({
    id: row[0],
    email: row[1],
    name: row[2],
    role: row[3],
    status: row[4],
    created_at: row[5],
  }));

  fs.writeFileSync(mockDataFile, JSON.stringify(usersWithoutHeaders, null, 2));
  console.log(`   ✅ Created mock users file: ${mockDataFile}`);
  console.log(`   ✅ ${usersWithoutHeaders.length} user records created`);
}

// Run the script
createUsersSheet();
