#!/usr/bin/env node

/**
 * Script to test login directly with Google Sheets data
 */

const { google } = require('googleapis');
const ServiceAccount = require('../server/service_account.json');
require('dotenv').config();

// Configuration
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SHEET_NAME = 'Users';

console.log('🧪 Testing Login with Google Sheets Data');
console.log('=========================================');
console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`Sheet Name: ${SHEET_NAME}`);
console.log('');

async function testLogin() {
    try {
        // Initialize Google Sheets API with service account
        const auth = new google.auth.GoogleAuth({
            credentials: ServiceAccount,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Get Users data
        console.log('📋 Getting Users data from Google Sheets...');
        const range = `${SHEET_NAME}!A1:Z1000`;
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
        });

        const values = response.data.values || [];

        if (values.length === 0) {
            console.log('❌ No data found in Users sheet');
            return;
        }

        // Parse data
        const headers = values[0];
        const users = values.slice(1).map(row => {
            const userData = {};
            headers.forEach((header, index) => {
                userData[header] = row[index] || '';
            });
            return userData;
        });

        console.log(`✅ Found ${users.length} users in Google Sheets`);
        console.log('');

        // Test login with admin@mia.vn
        const testEmail = 'admin@mia.vn';
        console.log(`🔍 Testing login with email: ${testEmail}`);

        const user = users.find(u => u.email === testEmail);

        if (!user) {
            console.log('❌ User not found');
            console.log('Available users:');
            users.forEach(u => console.log(`  - ${u.email}`));
            return;
        }

        console.log('✅ User found!');
        console.log('📊 User data:');
        console.log(`  - ID: ${user.id}`);
        console.log(`  - Email: ${user.email}`);
        console.log(`  - Full Name: ${user.fullName}`);
        console.log(`  - Role: ${user.roleId}`);
        console.log(`  - Status: ${user.status}`);
        console.log(`  - Created: ${user.createdAt}`);
        console.log('');

        // Simulate login process
        console.log('🔧 Simulating login process...');

        if (user.status !== 'active') {
            console.log('❌ User is not active');
            return;
        }

        console.log('✅ User is active');
        console.log('🔧 Development mode: Password validation skipped');
        console.log('✅ Login successful!');

        // Map user data to frontend format
        const mappedUser = {
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.roleId,
            status: user.status,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
            passwordHash: user.passwordHash
        };

        console.log('');
        console.log('📋 Mapped user data for frontend:');
        console.log(JSON.stringify(mappedUser, null, 2));

        console.log('');
        console.log('🎉 Login test completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);

        if (error.message.includes('not found')) {
            console.log('\n💡 Troubleshooting:');
            console.log('1. Verify the spreadsheet ID is correct');
            console.log('2. Make sure the "Users" sheet exists');
            console.log('3. Check if the service account has access to the spreadsheet');
        }

        process.exit(1);
    }
}

// Run the test
testLogin();
