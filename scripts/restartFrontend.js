// Script restart Frontend và kiểm tra
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 RESTART FRONTEND VÀ KIỂM TRA');
console.log('=' .repeat(50));

// Kiểm tra file .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ File .env đã tồn tại');
} else {
  console.log('❌ File .env chưa tồn tại');
}

console.log('');

// Kiểm tra package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ File package.json đã tồn tại');
} else {
  console.log('❌ File package.json chưa tồn tại');
}

console.log('');

// Kiểm tra node_modules
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ Thư mục node_modules đã tồn tại');
} else {
  console.log('❌ Thư mục node_modules chưa tồn tại');
  console.log('💡 Cần chạy: npm install');
}

console.log('');

// Kiểm tra port 3000
console.log('🔍 KIỂM TRA PORT 3000:');
const { exec } = require('child_process');

exec('lsof -ti:3000', (error, stdout, stderr) => {
  if (stdout) {
    console.log('⚠️  Port 3000 đang được sử dụng');
    console.log(`   PID: ${stdout.trim()}`);
    console.log('💡 Cần kill process trước khi restart');
    console.log('');

    // Kill process trên port 3000
    exec('kill -9 $(lsof -ti:3000)', (killError, killStdout, killStderr) => {
      if (killError) {
        console.log('❌ Không thể kill process:', killError.message);
      } else {
        console.log('✅ Đã kill process trên port 3000');
      }

      // Restart Frontend
      startFrontend();
    });
  } else {
    console.log('✅ Port 3000 đang trống');
    console.log('');

    // Restart Frontend
    startFrontend();
  }
});

function startFrontend() {
  console.log('🚀 KHỞI ĐỘNG FRONTEND...');
  console.log('');

  const frontend = spawn('npm', ['start'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true
  });

  frontend.on('error', (error) => {
    console.log('❌ Lỗi khởi động Frontend:', error.message);
  });

  frontend.on('close', (code) => {
    console.log(`Frontend đã thoát với code: ${code}`);
  });

  // Hiển thị hướng dẫn
  setTimeout(() => {
    console.log('');
    console.log('🎯 HƯỚNG DẪN KIỂM TRA:');
    console.log('   1. Mở browser: http://localhost:3000');
    console.log('   2. Mở Developer Tools (F12)');
    console.log('   3. Xem tab Console để tìm lỗi');
    console.log('   4. Xem tab Network để kiểm tra API calls');
    console.log('   5. Truy cập trang Maps');
    console.log('   6. Kiểm tra tab "Quản lý địa điểm"');
    console.log('   7. Kiểm tra tab "Bản đồ tương tác"');
    console.log('');
    console.log('⚠️  NẾU CÓ LỖI:');
    console.log('   1. CORS error: Cần cấu hình Google OAuth');
    console.log('   2. 403 Forbidden: Cần share Google Sheet');
    console.log('   3. 404 Not Found: Kiểm tra Spreadsheet ID');
    console.log('   4. Import error: Kiểm tra đường dẫn file');
    console.log('   5. Component error: Kiểm tra syntax JSX');
    console.log('');
    console.log('📞 SUPPORT:');
    console.log('   - Console browser: F12 > Console');
    console.log('   - Network tab: F12 > Network');
    console.log('   - React DevTools: Cài đặt extension');
    console.log('   - Google Sheets API: https://developers.google.com/sheets/api');
  }, 5000);
}

console.log('=' .repeat(50));
console.log('✅ Script restart Frontend hoàn thành!');
