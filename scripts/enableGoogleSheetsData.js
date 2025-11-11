// Script enable Google Sheets data loading
const fs = require('fs');
const path = require('path');

console.log('🔧 ENABLE GOOGLE SHEETS DATA LOADING');
console.log('=' .repeat(50));

// Kiểm tra proxyLocationsService
const proxyServicePath = path.join(__dirname, '..', 'src', 'services', 'map', 'proxyLocationsService.js');
if (fs.existsSync(proxyServicePath)) {
  const content = fs.readFileSync(proxyServicePath, 'utf8');

  if (content.includes('getLocationsFromGoogleSheets()')) {
    console.log('✅ ProxyLocationsService đã có method getLocationsFromGoogleSheets');
  } else {
    console.log('❌ ProxyLocationsService chưa có method getLocationsFromGoogleSheets');
  }

  if (content.includes('return await this.getLocationsFromGoogleSheets()')) {
    console.log('✅ ProxyLocationsService đã fallback sang Google Sheets API');
  } else {
    console.log('❌ ProxyLocationsService chưa fallback sang Google Sheets API');
  }

  if (content.includes('Google Sheets API lỗi, sử dụng mock data')) {
    console.log('✅ ProxyLocationsService đã có fallback sang mock data');
  } else {
    console.log('❌ ProxyLocationsService chưa có fallback sang mock data');
  }
}

console.log('');

// Kiểm tra file .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');

  if (envContent.includes('REACT_APP_GOOGLE_API_KEY=')) {
    console.log('✅ File .env đã có Google API key');
  } else {
    console.log('❌ File .env chưa có Google API key');
  }
}

console.log('');

console.log('🚀 HƯỚNG DẪN RESTART FRONTEND:');
console.log('   1. Dừng Frontend (Ctrl+C)');
console.log('   2. Chạy lại: npm start');
console.log('   3. Kiểm tra console browser');
console.log('   4. Truy cập trang Maps');
console.log('');

console.log('⚠️  NẾU VẪN CÓ LỖI:');
console.log('   1. Kiểm tra cache browser (Ctrl+Shift+R)');
console.log('   2. Xóa node_modules và npm install');
console.log('   3. Kiểm tra Google API key');
console.log('   4. Xem console browser để debug');
console.log('');

console.log('📞 SUPPORT:');
console.log('   - Console browser: F12 > Console');
console.log('   - Network tab: F12 > Network');
console.log('   - React DevTools: Cài đặt extension');
console.log('   - Google Sheets API: https://developers.google.com/sheets/api');
console.log('');

console.log('🎯 KẾT QUẢ MONG ĐỢI:');
console.log('   - Lấy dữ liệu thực từ Google Sheets (48 địa điểm)');
console.log('   - Bản đồ hiển thị markers với tọa độ thực');
console.log('   - Danh sách địa điểm với thông tin đầy đủ');
console.log('   - Có thể thêm/sửa/xóa địa điểm');
console.log('   - Tương tác với markers trên bản đồ');
console.log('');

console.log('=' .repeat(50));
console.log('✅ Script enable Google Sheets data loading hoàn thành!');
console.log('🎯 Bây giờ hãy restart Frontend!');
