// Script debug frontend issues
const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG FRONTEND ISSUES');
console.log('=' .repeat(60));

console.log('📋 KIỂM TRA CẤU TRÚC FILES:');
console.log('');

// Check if all required files exist
const requiredFiles = [
  'src/App.js',
  'src/index.js',
  'src/components/auth/Login.jsx',
  'src/contexts/GoogleSheetsAuthContext.js',
  'src/services/user/userService.js',
  'src/services/user/roleService.js',
  'src/services/user/permissionService.js',
  'src/services/user/authService.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

console.log('');

if (!allFilesExist) {
  console.log('❌ MỘT SỐ FILES BỊ THIẾU!');
  console.log('   Vui lòng kiểm tra lại cấu trúc files');
  process.exit(1);
}

console.log('✅ TẤT CẢ FILES ĐÃ SẴN SÀNG!');
console.log('');

console.log('📋 KIỂM TRA IMPORTS:');
console.log('');

// Check App.js imports
const appJsPath = path.join(__dirname, '..', 'src', 'App.js');
if (fs.existsSync(appJsPath)) {
  const appJsContent = fs.readFileSync(appJsPath, 'utf8');

  if (appJsContent.includes('useGoogleSheetsAuth')) {
    console.log('✅ App.js có import useGoogleSheetsAuth');
  } else {
    console.log('❌ App.js thiếu import useGoogleSheetsAuth');
  }

  if (appJsContent.includes('Login')) {
    console.log('✅ App.js có import Login');
  } else {
    console.log('❌ App.js thiếu import Login');
  }

  if (appJsContent.includes('/login')) {
    console.log('✅ App.js có route /login');
  } else {
    console.log('❌ App.js thiếu route /login');
  }
} else {
  console.log('❌ App.js không tồn tại');
}

console.log('');

// Check index.js imports
const indexJsPath = path.join(__dirname, '..', 'src', 'index.js');
if (fs.existsSync(indexJsPath)) {
  const indexJsContent = fs.readFileSync(indexJsPath, 'utf8');

  if (indexJsContent.includes('GoogleSheetsAuthProvider')) {
    console.log('✅ index.js có import GoogleSheetsAuthProvider');
  } else {
    console.log('❌ index.js thiếu import GoogleSheetsAuthProvider');
  }

  if (indexJsContent.includes('<GoogleSheetsAuthProvider>')) {
    console.log('✅ index.js có wrap GoogleSheetsAuthProvider');
  } else {
    console.log('❌ index.js thiếu wrap GoogleSheetsAuthProvider');
  }
} else {
  console.log('❌ index.js không tồn tại');
}

console.log('');

console.log('📋 KIỂM TRA GOOGLE SHEETS INTEGRATION:');
console.log('');

// Check .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file tồn tại');
  const envContent = fs.readFileSync(envPath, 'utf8');

  if (envContent.includes('REACT_APP_GOOGLE_SPREADSHEET_ID')) {
    console.log('✅ .env có REACT_APP_GOOGLE_SPREADSHEET_ID');
  } else {
    console.log('❌ .env thiếu REACT_APP_GOOGLE_SPREADSHEET_ID');
  }

  if (envContent.includes('REACT_APP_GOOGLE_API_KEY')) {
    console.log('✅ .env có REACT_APP_GOOGLE_API_KEY');
  } else {
    console.log('❌ .env thiếu REACT_APP_GOOGLE_API_KEY');
  }
} else {
  console.log('❌ .env file không tồn tại');
}

console.log('');

console.log('📋 HƯỚNG DẪN DEBUG:');
console.log('');

console.log('1️⃣ KIỂM TRA BROWSER CONSOLE:');
console.log('   • Mở Developer Tools (F12)');
console.log('   • Kiểm tra Console tab cho errors');
console.log('   • Kiểm tra Network tab cho failed requests');
console.log('');

console.log('2️⃣ KIỂM TRA GOOGLE SHEETS:');
console.log('   • Đảm bảo có 4 sheets: Users, Roles, RolePermissions, Employees');
console.log('   • Kiểm tra data trong từng sheet');
console.log('   • Kiểm tra Google API credentials');
console.log('');

console.log('3️⃣ KIỂM TRA AUTHENTICATION:');
console.log('   • Truy cập: http://localhost:3000/login');
console.log('   • Test với credentials:');
console.log('     - admin / admin123');
console.log('     - manager1 / manager123');
console.log('     - employee1 / employee123');
console.log('');

console.log('4️⃣ TROUBLESHOOTING:');
console.log('   • Restart frontend: Ctrl+C, sau đó npm start');
console.log('   • Clear browser cache');
console.log('   • Kiểm tra network connectivity');
console.log('   • Kiểm tra Google API quotas');
console.log('');

console.log('🔧 COMMANDS ĐỂ DEBUG:');
console.log('');

console.log('• Kill process trên port 3000:');
console.log('  lsof -ti:3000 | xargs kill -9');
console.log('');

console.log('• Restart frontend:');
console.log('  npm start');
console.log('');

console.log('• Check port usage:');
console.log('  lsof -i:3000');
console.log('');

console.log('• Check Google Sheets API:');
console.log('  curl "https://sheets.googleapis.com/v4/spreadsheets/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As/values/Users?key=YOUR_API_KEY"');
console.log('');

console.log('⚠️  LƯU Ý:');
console.log('');

console.log('🔒 BẢO MẬT:');
console.log('   • Đảm bảo Google API credentials đúng');
console.log('   • Kiểm tra Google Sheets permissions');
console.log('   • Verify API quotas và limits');
console.log('');

console.log('🔧 TROUBLESHOOTING:');
console.log('   • Check browser console cho errors');
console.log('   • Verify network connectivity');
console.log('   • Test Google Sheets API trực tiếp');
console.log('   • Kiểm tra CORS settings');
console.log('');

console.log('=' .repeat(60));
console.log('✅ Script debug frontend hoàn thành!');
console.log('🎯 Kiểm tra browser console và network tab!');
