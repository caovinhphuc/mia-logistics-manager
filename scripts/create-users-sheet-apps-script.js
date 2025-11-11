#!/usr/bin/env node

/**
 * Script to create Users sheet using Google Apps Script API
 */

require('dotenv').config();

// Configuration
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const APPS_SCRIPT_WEB_APP_URL = process.env.REACT_APP_APPS_SCRIPT_WEB_APP_URL;

console.log('🚀 Creating Users Sheet via Google Apps Script');
console.log('===============================================');
console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`Apps Script URL: ${APPS_SCRIPT_WEB_APP_URL}`);
console.log('');

async function createUsersSheet() {
    try {
        if (!APPS_SCRIPT_WEB_APP_URL) {
            console.error('❌ No Apps Script Web App URL provided. Please set REACT_APP_APPS_SCRIPT_WEB_APP_URL in .env file');
            return;
        }

        // Prepare data for Users sheet
        const usersData = [
            ['id', 'email', 'name', 'role', 'status', 'created_at'],
            ['u-admin', 'admin@mia.vn', 'Admin User', 'admin', 'active', '2024-01-01'],
            ['u-manager1', 'manager1@mia.vn', 'Manager 1', 'manager', 'active', '2024-01-01'],
            ['u-operator1', 'operator1@mia.vn', 'Operator 1', 'warehouse_staff', 'active', '2024-01-01'],
            ['u-driver1', 'driver1@mia.vn', 'Driver 1', 'driver', 'active', '2024-01-01'],
            ['u-warehouse1', 'warehouse1@mia.vn', 'Warehouse Staff 1', 'warehouse_staff', 'active', '2024-01-01']
        ];

        console.log('📋 Preparing Users sheet data...');
        console.log(`   - Headers: ${usersData[0].join(', ')}`);
        console.log(`   - Users: ${usersData.length - 1} users`);

        // Create Users sheet via Apps Script
        console.log('\n🔧 Creating Users sheet via Apps Script...');

        const createSheetData = {
            spreadsheetId: SPREADSHEET_ID,
            sheetName: 'Users',
            data: usersData
        };

        const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'createSheet',
                ...createSheetData
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create sheet: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
            console.log('✅ Users sheet created successfully!');
            console.log(`   - Sheet name: ${result.sheetName}`);
            console.log(`   - Rows added: ${result.rowsAdded}`);
            console.log(`   - Columns: ${result.columns}`);
        } else {
            console.log('❌ Failed to create Users sheet:', result.error);
            return;
        }

        // Verify the sheet was created
        console.log('\n🧪 Verifying Users sheet...');

        const verifyResponse = await fetch(APPS_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'getSheetData',
                spreadsheetId: SPREADSHEET_ID,
                sheetName: 'Users'
            })
        });

        if (verifyResponse.ok) {
            const verifyResult = await verifyResponse.json();
            if (verifyResult.success && verifyResult.data) {
                console.log('✅ Users sheet verification successful!');
                console.log(`   - Total rows: ${verifyResult.data.length}`);
                console.log('   - Sample data:');
                verifyResult.data.slice(0, 3).forEach((row, index) => {
                    console.log(`     Row ${index + 1}: [${row.join(', ')}]`);
                });
            } else {
                console.log('⚠️ Users sheet created but verification failed');
            }
        } else {
            console.log('⚠️ Users sheet created but verification failed');
        }

        console.log('\n🎉 Users sheet setup completed!');
        console.log('\nYou can now login with:');
        console.log('   Email: admin@mia.vn');
        console.log('   Password: admin123');
        console.log('   (Note: Password validation is mocked in development)');

    } catch (error) {
        console.error('❌ Error creating Users sheet:', error.message);

        if (error.message.includes('fetch')) {
            console.log('\n💡 Troubleshooting:');
            console.log('1. Make sure REACT_APP_APPS_SCRIPT_WEB_APP_URL is set in .env file');
            console.log('2. Ensure the Apps Script web app is deployed and accessible');
            console.log('3. Check if the Apps Script has permission to access the spreadsheet');
        }

        process.exit(1);
    }
}

// Run the script
createUsersSheet();
