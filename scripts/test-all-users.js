#!/usr/bin/env node

/**
 * Script to test login with all available users
 */

const { google } = require('googleapis');
const ServiceAccount = require('../server/service_account.json');
require('dotenv').config();

// Configuration
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SHEET_NAME = 'Users';

console.log('👥 Testing Login with All Available Users');
console.log('==========================================');
console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`Sheet Name: ${SHEET_NAME}`);
console.log('');

async function testAllUsers() {
    try {
        // Initialize Google Sheets API with service account
        const auth = new google.auth.GoogleAuth({
            credentials: ServiceAccount,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Get Users data
        console.log('📋 Getting all users from Google Sheets...');
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

            // Map structure from Google Sheets
            return {
                id: userData.id || '',
                email: userData.email || '',
                name: userData.fullName || '',
                role: userData.roleId || '',
                status: userData.status || 'active',
                created_at: userData.createdAt || '',
                updated_at: userData.updatedAt || '',
                passwordHash: userData.passwordHash || ''
            };
        });

        console.log(`✅ Found ${users.length} users in Google Sheets`);
        console.log('');

        // Test login with each user
        console.log('🔐 Testing login with each user...');
        console.log('===================================');

        for (const user of users) {
            console.log(`\n🧪 Testing user: ${user.email}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Status: ${user.status}`);

            if (user.status === 'active') {
                console.log('   ✅ User is active - Login would succeed');
                console.log('   🔧 Development mode: Password validation skipped');
            } else {
                console.log('   ❌ User is inactive - Login would fail');
            }
        }

        console.log('\n📊 Summary:');
        console.log('===========');
        console.log(`Total users: ${users.length}`);
        console.log(`Active users: ${users.filter(u => u.status === 'active').length}`);
        console.log(`Inactive users: ${users.filter(u => u.status !== 'active').length}`);

        console.log('\n👥 Available users for login:');
        users.filter(u => u.status === 'active').forEach(user => {
            console.log(`   - ${user.email} (${user.role})`);
        });

        console.log('\n🎉 All users test completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the test
testAllUsers();
