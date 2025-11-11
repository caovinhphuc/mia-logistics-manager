#!/usr/bin/env node

/**
 * Script test cuối cùng cho Google Sheets integration
 */

console.log('🧪 Test cuối cùng cho Google Sheets integration...');

// Kiểm tra environment variables
console.log('\n📋 Kiểm tra Environment Variables:');
console.log('REACT_APP_GOOGLE_API_KEY:', process.env.REACT_APP_GOOGLE_API_KEY ? '✅ Có' : '❌ Không có');
console.log('REACT_APP_GOOGLE_CLIENT_ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID ? '✅ Có' : '❌ Không có');
console.log('REACT_APP_GOOGLE_SPREADSHEET_ID:', process.env.REACT_APP_GOOGLE_SPREADSHEET_ID ? '✅ Có' : '❌ Không có');

// Kiểm tra file .env
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  console.log('✅ File .env tồn tại');

  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('\n📄 Nội dung file .env:');
  console.log(envContent);
} else {
  console.log('❌ File .env không tồn tại');
}

// Kiểm tra Google Sheets ID
const spreadsheetId = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
console.log('\n📊 Google Sheets ID:', spreadsheetId);

// Kiểm tra các sheet cần thiết
const requiredSheets = ['Users', 'Roles', 'RolePermissions', 'Employees'];
console.log('\n📋 Các sheet cần thiết:');
requiredSheets.forEach(sheet => {
  console.log(`- ${sheet}`);
});

console.log('\n🔧 Hướng dẫn khắc phục:');
console.log('1. Đảm bảo Google API Key được cấu hình đúng');
console.log('2. Đảm bảo Google Sheets có quyền truy cập public hoặc được share với service account');
console.log('3. Đảm bảo các sheet Users, Roles, RolePermissions, Employees tồn tại');
console.log('4. Đảm bảo Google API được load trong HTML');

console.log('\n📝 Cách thêm Google API vào HTML:');
console.log(`
<!-- Thêm vào public/index.html -->
<script src="https://apis.google.com/js/api.js"></script>
<script>
  // Khởi tạo Google API
  gapi.load('client', async () => {
    await gapi.client.init({
      apiKey: 'YOUR_API_KEY',
      discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
    });
    console.log('Google API đã sẵn sàng');
  });
</script>
`);

console.log('\n✅ Script hoàn thành');
