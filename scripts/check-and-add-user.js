#!/usr/bin/env node

/**
 * Script to check Google Sheets Users data and add new user
 * Using Google Sheets API with service account
 */

const { google } = require('googleapis');
const ServiceAccount = require('../server/service_account.json');
require('dotenv').config();

// Configuration
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SHEET_NAME = 'Users';

console.log('🔍 Checking Google Sheets Users Data');
console.log('====================================');
console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`Sheet Name: ${SHEET_NAME}`);
console.log(`Service Account: ${ServiceAccount.client_email}`);
console.log('');

async function checkAndAddUser() {
    try {
        // Initialize Google Sheets API with service account
        const auth = new google.auth.GoogleAuth({
            credentials: ServiceAccount,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 1. Check current sheet structure and data
        console.log('📋 STEP 1: Checking current sheet structure...');
        
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

        // Display headers
        const headers = values[0];
        console.log(`✅ Found ${values.length} rows in Users sheet`);
        console.log(`📋 Headers: [${headers.join(', ')}]`);
        console.log('');

        // Display current data
        console.log('📊 Current Users Data:');
        console.log('=====================');
        values.forEach((row, index) => {
            if (index === 0) {
                console.log(`Row ${index + 1} (Headers): [${row.join(', ')}]`);
            } else {
                console.log(`Row ${index + 1}: [${row.join(', ')}]`);
            }
        });
        console.log('');

        // 2. Add new user data
        console.log('📝 STEP 2: Adding new user data...');
        
        // New user data matching the current structure
        const newUserData = [
            'u-test001',                    // id
            'test@mia.vn',                  // email
            '$2a$10$testpasswordhash',      // passwordHash
            'Test User',                    // fullName
            'test-role',                    // roleId
            'active',                       // status
            new Date().toISOString(),       // createdAt
            new Date().toISOString()        // updatedAt
        ];

        // Append new user to the sheet
        const appendResponse = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A:H`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: [newUserData]
            }
        });

        console.log('✅ New user added successfully!');
        console.log(`📊 Added data: [${newUserData.join(', ')}]`);
        console.log('');

        // 3. Verify the addition
        console.log('🧪 STEP 3: Verifying the addition...');
        
        const verifyResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
        });

        const newValues = verifyResponse.data.values || [];
        console.log(`✅ Verification: Now have ${newValues.length} rows in Users sheet`);
        
        // Display the last few rows
        console.log('📋 Last 3 rows:');
        const lastRows = newValues.slice(-3);
        lastRows.forEach((row, index) => {
            const rowNumber = newValues.length - lastRows.length + index + 1;
            console.log(`Row ${rowNumber}: [${row.join(', ')}]`);
        });

        console.log('');
        console.log('🎉 Script completed successfully!');
        console.log('');
        console.log('📋 Summary:');
        console.log(`- Total rows: ${newValues.length}`);
        console.log(`- Headers: [${headers.join(', ')}]`);
        console.log(`- New user: test@mia.vn`);
        console.log('');

    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.message.includes('not found')) {
            console.log('\n💡 Troubleshooting:');
            console.log('1. Verify the spreadsheet ID is correct');
            console.log('2. Make sure the "Users" sheet exists');
            console.log('3. Check if the service account has access to the spreadsheet');
        }
        
        if (error.message.includes('permission')) {
            console.log('\n💡 Troubleshooting:');
            console.log('1. Make sure the service account has edit permission');
            console.log('2. Share the spreadsheet with the service account email:');
            console.log(`   ${ServiceAccount.client_email}`);
        }
        
        process.exit(1);
    }
}

// Run the script
checkAndAddUser();
