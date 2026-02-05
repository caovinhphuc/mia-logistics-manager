#!/usr/bin/env node

/**
 * Script to create Users sheet using Google Service Account
 */

const { GoogleSpreadsheet } = require('google-spreadsheet');
const ServiceAccount = require('../server/service_account.json');
require('dotenv').config();

// Configuration
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';

console.log('🚀 Creating Users Sheet using Service Account');
console.log('==============================================');
console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`Service Account: ${ServiceAccount.client_email}`);
console.log('');

async function createUsersSheet() {
    try {
        // Initialize the document
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

        // Use service account for authentication
        await doc.useServiceAccountAuth({
            client_email: ServiceAccount.client_email,
            private_key: ServiceAccount.private_key,
        });

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
                },
                {
                    id: 'u-warehouse1',
                    email: 'warehouse1@mia.vn',
                    name: 'Warehouse Staff 1',
                    role: 'warehouse_staff',
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

        // Check other expected sheets
        console.log('\n🔍 Checking other expected sheets...');
        const expectedSheets = ['Carriers', 'Shipments', 'Locations', 'VolumeRules', 'Settings'];

        expectedSheets.forEach(sheetName => {
            const sheet = doc.sheetsByTitle[sheetName];
            const status = sheet ? '✅' : '❌';
            console.log(`   ${status} ${sheetName}`);
        });

    } catch (error) {
        console.error('❌ Error creating Users sheet:', error.message);

        if (error.message.includes('not found')) {
            console.log('\n💡 Troubleshooting:');
            console.log('1. Verify the spreadsheet ID is correct');
            console.log('2. Make sure the service account has access to the spreadsheet');
            console.log('3. Check if the spreadsheet exists and is accessible');
        }

        if (error.message.includes('permission')) {
            console.log('\n💡 Troubleshooting:');
            console.log('1. Make sure the service account has edit permission on the spreadsheet');
            console.log('2. Share the spreadsheet with the service account email:');
            console.log(`   ${ServiceAccount.client_email}`);
        }

        process.exit(1);
    }
}

// Run the script
createUsersSheet();
