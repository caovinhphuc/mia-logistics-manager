#!/usr/bin/env node

/**
 * Script to check Google Spreadsheet structure using Google Sheets API directly
 */

require('dotenv').config();

// Configuration
const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

console.log('🔍 Checking Google Spreadsheet Structure via API');
console.log('================================================');
console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`API Key: ${GOOGLE_API_KEY ? GOOGLE_API_KEY.substring(0, 20) + '...' : 'Not provided'}`);
console.log('');

async function checkSpreadsheetStructure() {
    try {
        // Check if API key is available
        if (!GOOGLE_API_KEY) {
            console.error('❌ No API key provided. Please set REACT_APP_GOOGLE_API_KEY in .env file');
            return;
        }

        // Get spreadsheet metadata
        console.log('📋 Getting spreadsheet metadata...');
        const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${GOOGLE_API_KEY}`;
        
        const metadataResponse = await fetch(metadataUrl);
        if (!metadataResponse.ok) {
            throw new Error(`Failed to get spreadsheet metadata: ${metadataResponse.status} ${metadataResponse.statusText}`);
        }
        
        const metadata = await metadataResponse.json();
        
        console.log(`✅ Connected to spreadsheet: "${metadata.properties.title}"`);
        console.log(`📊 Total sheets: ${metadata.sheets.length}`);
        console.log('');

        // List all sheets with details
        console.log('📋 SHEET STRUCTURE ANALYSIS:');
        console.log('=============================');
        
        for (let i = 0; i < metadata.sheets.length; i++) {
            const sheet = metadata.sheets[i];
            const properties = sheet.properties;
            
            console.log(`\n${i + 1}. Sheet: "${properties.title}"`);
            console.log(`   - Index: ${properties.index}`);
            console.log(`   - Rows: ${properties.gridProperties.rowCount}`);
            console.log(`   - Columns: ${properties.gridProperties.columnCount}`);
            console.log(`   - Sheet ID: ${properties.sheetId}`);
            
            // Get headers and sample data
            try {
                const range = `${properties.title}!A1:Z3`;
                const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;
                
                const dataResponse = await fetch(dataUrl);
                if (dataResponse.ok) {
                    const data = await dataResponse.json();
                    const values = data.values || [];
                    
                    if (values.length > 0) {
                        console.log(`   - Headers: [${values[0].join(', ')}]`);
                        
                        if (values.length > 1) {
                            console.log(`   - Sample data:`);
                            for (let j = 1; j < Math.min(values.length, 3); j++) {
                                console.log(`     Row ${j}: [${values[j].join(', ')}]`);
                            }
                        }
                    } else {
                        console.log(`   - Headers: No data found`);
                    }
                } else {
                    console.log(`   - Data: Error reading - ${dataResponse.status}`);
                }
            } catch (error) {
                console.log(`   - Data: Error reading - ${error.message}`);
            }
        }

        // Check frontend mapping
        console.log('\n🔗 FRONTEND MAPPING ANALYSIS:');
        console.log('==============================');
        
        // Check what sheets frontend expects
        const expectedSheets = [
            'Users',
            'Carriers', 
            'Shipments',
            'Locations',
            'VolumeRules',
            'Settings'
        ];
        
        const existingSheets = metadata.sheets.map(sheet => sheet.properties.title);
        
        console.log('Expected sheets by frontend:');
        expectedSheets.forEach(sheetName => {
            const exists = existingSheets.includes(sheetName);
            const status = exists ? '✅' : '❌';
            console.log(`   ${status} ${sheetName}`);
        });
        
        console.log('\nMissing sheets:');
        const missingSheets = expectedSheets.filter(sheetName => !existingSheets.includes(sheetName));
        if (missingSheets.length > 0) {
            missingSheets.forEach(sheetName => {
                console.log(`   ❌ ${sheetName}`);
            });
        } else {
            console.log('   ✅ All expected sheets exist');
        }
        
        console.log('\nExtra sheets (not expected by frontend):');
        const extraSheets = existingSheets.filter(sheetName => !expectedSheets.includes(sheetName));
        if (extraSheets.length > 0) {
            extraSheets.forEach(sheetName => {
                console.log(`   ℹ️  ${sheetName}`);
            });
        } else {
            console.log('   ✅ No extra sheets found');
        }

        // Check Users sheet specifically
        console.log('\n👥 USERS SHEET DETAILED ANALYSIS:');
        console.log('==================================');
        
        const usersSheet = metadata.sheets.find(sheet => sheet.properties.title === 'Users');
        if (usersSheet) {
            console.log('✅ Users sheet found');
            console.log(`   - Rows: ${usersSheet.properties.gridProperties.rowCount}`);
            console.log(`   - Columns: ${usersSheet.properties.gridProperties.columnCount}`);
            
            // Get all users data
            try {
                const range = `Users!A1:Z1000`;
                const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_API_KEY}`;
                
                const dataResponse = await fetch(dataUrl);
                if (dataResponse.ok) {
                    const data = await dataResponse.json();
                    const values = data.values || [];
                    
                    if (values.length > 0) {
                        console.log(`   - Total users: ${values.length - 1}`); // Exclude header
                        
                        if (values.length > 1) {
                            console.log('\n   📋 Users data:');
                            for (let i = 1; i < values.length; i++) {
                                const userData = values[i];
                                const email = userData[1] || 'N/A';
                                const role = userData[3] || 'N/A';
                                const status = userData[4] || 'N/A';
                                console.log(`     ${i}. ${email} (${role}) - ${status}`);
                            }
                        }
                    } else {
                        console.log(`   - No users data found`);
                    }
                } else {
                    console.log(`   ❌ Error reading users data: ${dataResponse.status}`);
                }
            } catch (error) {
                console.log(`   ❌ Error reading users data: ${error.message}`);
            }
        } else {
            console.log('❌ Users sheet NOT found');
            console.log('   This explains why login is failing - no user data available');
        }

        // Summary
        console.log('\n📊 SUMMARY:');
        console.log('===========');
        console.log(`Spreadsheet ID: ${SPREADSHEET_ID}`);
        console.log(`Spreadsheet Title: "${metadata.properties.title}"`);
        console.log(`Total Sheets: ${metadata.sheets.length}`);
        console.log(`Expected Sheets: ${expectedSheets.length}`);
        console.log(`Missing Sheets: ${missingSheets.length}`);
        console.log(`Users Sheet Status: ${usersSheet ? '✅ Found' : '❌ Missing'}`);
        
        if (!usersSheet) {
            console.log('\n🚨 CRITICAL ISSUE: Users sheet is missing!');
            console.log('   This is why login fails - no user data available');
            console.log('   Solution: Create Users sheet with user data');
        }

    } catch (error) {
        console.error('❌ Error checking spreadsheet structure:', error.message);
        
        if (error.message.includes('not found')) {
            console.log('\n💡 Troubleshooting:');
            console.log('1. Verify the spreadsheet ID is correct');
            console.log('2. Make sure the spreadsheet exists and is accessible');
            console.log('3. Check if the spreadsheet is publicly accessible');
        }
        
        if (error.message.includes('API key')) {
            console.log('\n💡 Troubleshooting:');
            console.log('1. Make sure REACT_APP_GOOGLE_API_KEY is set in .env file');
            console.log('2. Ensure the API key has access to Google Sheets API');
        }
        
        process.exit(1);
    }
}

// Run the script
checkSpreadsheetStructure();
