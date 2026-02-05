// Script sửa lỗi LocationsService
const fs = require('fs');
const path = require('path');

console.log('🔧 SỬA LỖI LOCATIONSSERVICE');
console.log('=' .repeat(50));

// Kiểm tra LocationManager
const locationManagerPath = path.join(__dirname, '..', 'src', 'components', 'map', 'LocationManager.jsx');
if (fs.existsSync(locationManagerPath)) {
  const content = fs.readFileSync(locationManagerPath, 'utf8');

  if (content.includes('new LocationsService()')) {
    console.log('❌ LocationManager vẫn có tham chiếu đến LocationsService');
  } else {
    console.log('✅ LocationManager đã được sửa');
  }

  if (content.includes('proxyLocationsService')) {
    console.log('✅ LocationManager đã sử dụng proxyLocationsService');
  } else {
    console.log('❌ LocationManager chưa sử dụng proxyLocationsService');
  }
}

console.log('');

// Kiểm tra InteractiveMap
const interactiveMapPath = path.join(__dirname, '..', 'src', 'components', 'map', 'InteractiveMap.jsx');
if (fs.existsSync(interactiveMapPath)) {
  const content = fs.readFileSync(interactiveMapPath, 'utf8');

  if (content.includes('new LocationsService()')) {
    console.log('❌ InteractiveMap vẫn có tham chiếu đến LocationsService');
  } else {
    console.log('✅ InteractiveMap đã được sửa');
  }

  if (content.includes('proxyLocationsService')) {
    console.log('✅ InteractiveMap đã sử dụng proxyLocationsService');
  } else {
    console.log('❌ InteractiveMap chưa sử dụng proxyLocationsService');
  }
}

console.log('');

// Kiểm tra tất cả files có tham chiếu đến LocationsService
console.log('🔍 KIỂM TRA TẤT CẢ FILES:');
const searchPaths = [
  'src/components/map/',
  'src/pages/',
  'src/services/map/'
];

searchPaths.forEach(searchPath => {
  const fullPath = path.join(__dirname, '..', searchPath);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath);
    files.forEach(file => {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        const filePath = path.join(fullPath, file);
        const content = fs.readFileSync(filePath, 'utf8');

        if (content.includes('new LocationsService()')) {
          console.log(`❌ ${searchPath}${file} vẫn có tham chiếu đến LocationsService`);
        }
      }
    });
  }
});

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
console.log('   3. Kiểm tra import statements');
console.log('   4. Xem console browser để debug');
console.log('');

console.log('📞 SUPPORT:');
console.log('   - Console browser: F12 > Console');
console.log('   - Network tab: F12 > Network');
console.log('   - React DevTools: Cài đặt extension');
console.log('   - Google Sheets API: https://developers.google.com/sheets/api');
console.log('');

console.log('=' .repeat(50));
console.log('✅ Script sửa lỗi hoàn thành!');
console.log('🎯 Bây giờ hãy restart Frontend!');
