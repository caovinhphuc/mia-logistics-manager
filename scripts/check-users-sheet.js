// Script to check Users sheet in Google Sheets
// Note: This requires Google API to be initialized in the browser

const GOOGLE_SHEETS_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const GOOGLE_SHEETS_LINK = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/edit`;

console.log('🔍 Checking Users Sheet in Google Sheets...\n');
console.log(`📊 Spreadsheet Link: ${GOOGLE_SHEETS_LINK}\n`);

console.log('ℹ️  To check if Users sheet exists:');
console.log('1. Open the Google Sheets link above');
console.log('2. Look for a sheet named "Users" in the bottom tabs');
console.log('3. If it exists, check if it has data\n');

console.log('📝 Expected Users Sheet Structure:');
console.log('Column A: Email');
console.log('Column B: Password');
console.log('Column C: Id');
console.log('Column D: Name');
console.log('Column E: Role');
console.log('Column F: Department');
console.log('Column G: Phone');
console.log('Column H: Status');
console.log('Column I: Picture\n');

console.log('🔐 To test with a user:');
console.log('1. Create or open "Users" sheet');
console.log('2. Add test user with hashed password');
console.log('3. Example row:');
console.log('   Email: test@example.com');
console.log('   Password: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9 (admin123)');
console.log('   Id: user_test');
console.log('   Name: Test User');
console.log('   Role: admin');
console.log('   Department: IT');
console.log('   Phone: 0901234567');
console.log('   Status: active');
console.log('   Picture: (leave empty)\n');

console.log('✅ Current Status:');
console.log('- Using mock users by default');
console.log('- Will automatically try Google Sheets if available');
console.log('- Falls back to mock users if sheet is empty or missing\n');

console.log('🚀 To enable Google Sheets authentication:');
console.log('1. Create "Users" sheet with proper structure');
console.log('2. Add at least 1 user with hashed password');
console.log('3. System will automatically use Sheets if available\n');

// Show sample hashed passwords
console.log('📋 Sample Hashed Passwords (SHA-256):');
console.log('admin123: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');
console.log('manager123: 866485796cfa8d7c0cf7111640205b83076433547577511d81f8030ae99ecea5');
console.log('operator123: ec6e1c25258002eb1c67d15c7f45da7945fa4c58778fd7d88faa5e53e3b4698d');
console.log('driver123: 494d022492052a06f8f81949639a1d148c1051fa3d4e4688fbd96efe649cd382\n');

console.log('✅ Check complete!');
