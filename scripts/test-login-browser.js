// Test script for browser console
// Copy and paste this into browser console to test login

console.log('🧪 Testing Login from Browser Console');
console.log('=====================================');

// Test function
async function testLogin() {
    try {
        console.log('🔐 Testing login with admin@mia.vn');

        // Import userService dynamically
        const { userService } = await import('/src/services/user/userService.js');

        // Find user
        const user = await userService.getUserByEmail('admin@mia.vn');

        if (user) {
            console.log('✅ User found:', user);
            console.log('🎉 Login would succeed!');
            return user;
        } else {
            console.log('❌ User not found');
            return null;
        }

    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// Test Google Sheets connection
async function testGoogleSheets() {
    try {
        console.log('📊 Testing Google Sheets connection...');

        // Import googleSheetsService
        const { googleSheetsService } = await import('/src/services/google/googleSheetsService.js');

        // Connect to spreadsheet
        const result = await googleSheetsService.connect('18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As');

        if (result) {
            console.log('✅ Google Sheets connected successfully');

            // Get Users sheet data
            const usersData = await googleSheetsService.getValues('Users');
            console.log('📋 Users data:', usersData);

            return usersData;
        } else {
            console.log('❌ Google Sheets connection failed');
            return null;
        }

    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// Run tests
console.log('Running tests...');
testLogin().then(result => {
    if (result) {
        console.log('✅ Login test passed');
    } else {
        console.log('❌ Login test failed');
    }
});

testGoogleSheets().then(result => {
    if (result) {
        console.log('✅ Google Sheets test passed');
    } else {
        console.log('❌ Google Sheets test failed');
    }
});
