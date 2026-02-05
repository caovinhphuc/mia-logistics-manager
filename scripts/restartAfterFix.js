// Script restart Frontend sau khi sửa lỗi
const { spawn } = require('child_process');
const { exec } = require('child_process');

console.log('🚀 RESTART FRONTEND SAU KHI SỬA LỖI');
console.log('=' .repeat(50));

console.log('🔍 KIỂM TRA PORT 3000:');
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
    cwd: process.cwd(),
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
    console.log('🎯 KẾT QUẢ MONG ĐỢI:');
    console.log('   - Bản đồ hiển thị markers với tọa độ thực');
    console.log('   - Danh sách địa điểm với thông tin đầy đủ');
    console.log('   - Có thể thêm/sửa/xóa địa điểm');
    console.log('   - Tương tác với markers trên bản đồ');
  }, 5000);
}

console.log('=' .repeat(50));
console.log('✅ Script restart Frontend hoàn thành!');
