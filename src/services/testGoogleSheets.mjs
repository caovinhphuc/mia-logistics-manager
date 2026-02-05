// Test script for Google Sheets integration
// Run this after completing service account and spreadsheet setup

import GoogleSheetsService from './googleSheets.js';

async function testGoogleSheetsIntegration() {
  console.log('🧪 Starting Google Sheets Integration Test...\n');

  try {
    // Test 1: Connection Test
    console.log('📡 Test 1: Testing connection...');
    const connectionResult = await GoogleSheetsService.testConnection();

    if (!connectionResult) {
      throw new Error('Connection test failed');
    }
    console.log('✅ Connection test passed\n');

    // Test 2: Read LocationsSheet
    console.log('📋 Test 2: Reading LocationsSheet...');
    const locations = await GoogleSheetsService.getLocations();
    console.log(`✅ Found ${locations.length} locations`);
    console.log('Sample data:', locations.slice(0, 2));
    console.log('');

    // Test 3: Add Sample Location
    console.log('📝 Test 3: Adding sample location...');
    const sampleLocation = {
      ID: 'LOC001',
      Name: 'Test Warehouse',
      Address: '123 Test Street, Ho Chi Minh City',
      Type: 'Warehouse',
      Status: 'Active',
      CreatedAt: new Date().toISOString(),
    };

    await GoogleSheetsService.addLocation(sampleLocation);
    console.log('✅ Sample location added successfully\n');

    // Test 4: Read Updated Data
    console.log('📊 Test 4: Verifying updated data...');
    const updatedLocations = await GoogleSheetsService.getLocations();
    console.log(`✅ Updated count: ${updatedLocations.length} locations`);
    console.log('Latest entry:', updatedLocations[updatedLocations.length - 1]);
    console.log('');

    // Test 5: Other Sheets
    console.log('👥 Test 5: Testing other sheets...');
    const employees = await GoogleSheetsService.getEmployees();
    const carriers = await GoogleSheetsService.getCarriers();
    const transportRequests = await GoogleSheetsService.getTransportRequests();

    console.log(`✅ Employees: ${employees.length} records`);
    console.log(`✅ Carriers: ${carriers.length} records`);
    console.log(`✅ Transport Requests: ${transportRequests.length} records`);

    console.log('\n🎉 All tests passed! Google Sheets integration is working correctly.');
    return true;
  } catch (error) {
    console.error('\n❌ Integration test failed:', error);
    console.error('\n🔧 Troubleshooting tips:');
    console.error('1. Verify service-account-key.json is in /server/ directory');
    console.error('2. Check REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID in .env');
    console.error('3. Ensure spreadsheet is shared with service account email');
    console.error('4. Verify all required APIs are enabled in Google Cloud Console');
    return false;
  }
}

// Export for use in development
export default testGoogleSheetsIntegration;

// Run test if this file is executed directly
if (import.meta.main) {
  testGoogleSheetsIntegration()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}
