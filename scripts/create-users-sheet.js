#!/usr/bin/env node

/**
 * Script to create Users sheet in Google Spreadsheet
 * This script will check if Users sheet exists and create it with sample data if not
 */

const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

// Configuration
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

console.log('🚀 Creating Users Sheet in Google Spreadsheet');
console.log('==============================================');
console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`API Key: ${GOOGLE_API_KEY ? GOOGLE_API_KEY.substring(0, 20) + '...' : 'Not provided'}`);
console.log('');

async function createUsersSheet() {
    try {
        // Initialize the document
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

        // Use API key for authentication (for public sheets)
        if (GOOGLE_API_KEY) {
            // For google-spreadsheet library, we need to use raw access token
            doc.useRawAccessToken(GOOGLE_API_KEY);
        } else {
            console.error('❌ No API key provided. Please set REACT_APP_GOOGLE_API_KEY in .env file');
            return;
        }

        // Load document info
        console.log('📋 Loading spreadsheet info...');
        await doc.loadInfo();

        console.log(`✅ Connected to spreadsheet: "${doc.title}"`);
        console.log(`📊 Found ${doc.sheetCount} sheets:`);

        // List existing sheets
        doc.sheetsByIndex.forEach((sheet, index) => {
            console.log(`   ${index + 1}. "${sheet.title}" (${sheet.rowCount} rows, ${sheet.columnCount} columns)`);
        });

        // Check if Users sheet exists
        let usersSheet = doc.sheetsByTitle['Users'];

        if (usersSheet) {
            console.log(`\n✅ Users sheet already exists with ${usersSheet.rowCount} rows`);

            // Check if it has data
            if (usersSheet.rowCount > 1) {
                console.log('📊 Users sheet has data, checking first few rows...');
                const rows = await usersSheet.getRows({ limit: 5 });
                console.log('Sample data:');
                rows.forEach((row, index) => {
                    console.log(`   Row ${index + 1}: ${JSON.stringify(row._rawData)}`);
                });
            } else {
                console.log('⚠️ Users sheet exists but is empty');
            }
        } else {
            console.log('\n❌ Users sheet not found, creating it...');

            // Create Users sheet
            usersSheet = await doc.addSheet({
                title: 'Users',
                headerValues: ['id', 'email', 'name', 'role', 'status', 'created_at']
            });

            console.log('✅ Users sheet created successfully');

            // Add sample data
            const sampleUsers = [
                {
                    id: 'u-admin',
                    email: 'admin@mia.vn',
                    name: 'Admin User',
                    role: 'admin',
                    status: 'active',
                    created_at: new Date().toISOString().split('T')[0]
                },
                {
                    id: 'u-manager1',
                    email: 'manager1@mia.vn',
                    name: 'Manager 1',
                    role: 'manager',
                    status: 'active',
                    created_at: new Date().toISOString().split('T')[0]
                },
                {
                    id: 'u-operator1',
                    email: 'operator1@mia.vn',
                    name: 'Operator 1',
                    role: 'warehouse_staff',
                    status: 'active',
                    created_at: new Date().toISOString().split('T')[0]
                },
                {
                    id: 'u-driver1',
                    email: 'driver1@mia.vn',
                    name: 'Driver 1',
                    role: 'driver',
                    status: 'active',
                    created_at: new Date().toISOString().split('T')[0]
                }
            ];

            console.log('📝 Adding sample users...');
            for (const user of sampleUsers) {
                await usersSheet.addRow(user);
                console.log(`   ✅ Added user: ${user.email} (${user.role})`);
            }

            console.log(`✅ Added ${sampleUsers.length} sample users`);
        }

        // Test reading the Users sheet
        console.log('\n🧪 Testing Users sheet access...');
        const rows = await usersSheet.getRows();
        console.log(`✅ Successfully read ${rows.length} users from Google Sheets`);

        // Display users
        console.log('\n📋 Current users in sheet:');
        rows.forEach((row, index) => {
            console.log(`   ${index + 1}. ${row.email} (${row.role}) - ${row.status}`);
        });

        console.log('\n🎉 Users sheet setup completed successfully!');
        console.log('\nYou can now login with:');
        console.log('   Email: admin@mia.vn');
        console.log('   Password: admin123');
        console.log('   (Note: Password validation is mocked in development)');

    } catch (error) {
        console.error('❌ Error creating Users sheet:', error.message);

        if (error.message.includes('API key')) {
            console.log('\n💡 Troubleshooting:');
            console.log('1. Make sure REACT_APP_GOOGLE_API_KEY is set in .env file');
            console.log('2. Ensure the API key has access to Google Sheets API');
            console.log('3. Check if the spreadsheet is publicly accessible or shared with the service account');
        }

        if (error.message.includes('not found')) {
            console.log('\n💡 Troubleshooting:');
            console.log('1. Verify the spreadsheet ID is correct');
            console.log('2. Make sure the spreadsheet exists and is accessible');
        }

        process.exit(1);
    }
}

// Run the script
createUsersSheet();
