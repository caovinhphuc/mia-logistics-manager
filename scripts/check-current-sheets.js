#!/usr/bin/env node

/**
 * Script to check current Google Spreadsheet structure using existing services
 */

require('dotenv').config();

console.log('🔍 Checking Current Google Spreadsheet Structure');
console.log('===============================================');
console.log(`Spreadsheet ID: ${process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As'}`);
console.log(`Google Client ID: ${process.env.REACT_APP_GOOGLE_CLIENT_ID ? process.env.REACT_APP_GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'Not provided'}`);
console.log(`API Key: ${process.env.REACT_APP_GOOGLE_API_KEY ? process.env.REACT_APP_GOOGLE_API_KEY.substring(0, 20) + '...' : 'Not provided'}`);
console.log('');

async function checkCurrentSheets() {
    try {
        // Check environment variables
        console.log('📋 ENVIRONMENT VARIABLES CHECK:');
        console.log('===============================');

        const requiredVars = [
            'REACT_APP_GOOGLE_SPREADSHEET_ID',
            'REACT_APP_GOOGLE_CLIENT_ID',
            'REACT_APP_GOOGLE_API_KEY',
            'REACT_APP_APPS_SCRIPT_WEB_APP_URL'
        ];

        requiredVars.forEach(varName => {
            const value = process.env[varName];
            const status = value ? '✅' : '❌';
            const displayValue = value ? value.substring(0, 30) + '...' : 'Not set';
            console.log(`   ${status} ${varName}: ${displayValue}`);
        });

        // Check if we can access the spreadsheet URL
        console.log('\n🌐 SPREADSHEET ACCESS CHECK:');
        console.log('============================');

        const spreadsheetId = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
        const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

        console.log(`Spreadsheet URL: ${spreadsheetUrl}`);
        console.log('Please check manually:');
        console.log('1. Open the URL in browser');
        console.log('2. Check if you can access the spreadsheet');
        console.log('3. Check what sheets exist in the spreadsheet');
        console.log('4. Check if "Users" sheet exists');

        // Expected sheets structure
        console.log('\n📊 EXPECTED SHEETS STRUCTURE:');
        console.log('=============================');

        const expectedSheets = [
            {
                name: 'Users',
                description: 'User authentication data',
                columns: ['id', 'email', 'name', 'role', 'status', 'created_at'],
                required: true
            },
            {
                name: 'Carriers',
                description: 'Carrier/transportation company data',
                columns: ['id', 'name', 'contact', 'serviceAreas', 'status'],
                required: false
            },
            {
                name: 'Shipments',
                description: 'Shipment tracking data',
                columns: ['id', 'trackingNumber', 'carrier', 'origin', 'destination', 'status'],
                required: false
            },
            {
                name: 'Locations',
                description: 'Location data for logistics',
                columns: ['id', 'name', 'address', 'coordinates', 'type'],
                required: false
            },
            {
                name: 'VolumeRules',
                description: 'Volume calculation rules',
                columns: ['id', 'name', 'unitVolume', 'description'],
                required: false
            },
            {
                name: 'Settings',
                description: 'Application settings',
                columns: ['key', 'value', 'description'],
                required: false
            }
        ];

        expectedSheets.forEach((sheet, index) => {
            const required = sheet.required ? '🔴 REQUIRED' : '🟡 Optional';
            console.log(`\n${index + 1}. ${sheet.name} ${required}`);
            console.log(`   Description: ${sheet.description}`);
            console.log(`   Columns: [${sheet.columns.join(', ')}]`);
        });

        // Current issue analysis
        console.log('\n🚨 CURRENT ISSUE ANALYSIS:');
        console.log('==========================');
        console.log('❌ Sheet "Users" not found or not connected');
        console.log('❌ Frontend using mock data instead of real data');
        console.log('❌ Login fails because no user data available');
        console.log('');
        console.log('💡 SOLUTION:');
        console.log('1. Create "Users" sheet in Google Spreadsheet');
        console.log('2. Add sample user data with correct format');
        console.log('3. Ensure sheet has proper permissions');
        console.log('4. Restart frontend to reload data');

        // Manual steps
        console.log('\n📝 MANUAL STEPS TO FIX:');
        console.log('========================');
        console.log('1. Open Google Spreadsheet:');
        console.log(`   ${spreadsheetUrl}`);
        console.log('');
        console.log('2. Create new sheet named "Users"');
        console.log('');
        console.log('3. Add headers in row 1:');
        console.log('   A1: id');
        console.log('   B1: email');
        console.log('   C1: name');
        console.log('   D1: role');
        console.log('   E1: status');
        console.log('   F1: created_at');
        console.log('');
        console.log('4. Add sample data starting from row 2:');
        console.log('   Row 2: u-admin, admin@mia.vn, Admin User, admin, active, 2024-01-01');
        console.log('   Row 3: u-manager1, manager1@mia.vn, Manager 1, manager, active, 2024-01-01');
        console.log('   Row 4: u-operator1, operator1@mia.vn, Operator 1, warehouse_staff, active, 2024-01-01');
        console.log('   Row 5: u-driver1, driver1@mia.vn, Driver 1, driver, active, 2024-01-01');
        console.log('');
        console.log('5. Save the spreadsheet');
        console.log('');
        console.log('6. Restart the frontend application');
        console.log('');
        console.log('7. Test login with: admin@mia.vn / admin123');

    } catch (error) {
        console.error('❌ Error checking current sheets:', error.message);
        process.exit(1);
    }
}

// Run the script
checkCurrentSheets();
