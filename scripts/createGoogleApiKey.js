// Script tạo Google API key thực
const fs = require('fs');
const path = require('path');

console.log('🔑 TẠO GOOGLE API KEY THỰC');
console.log('=' .repeat(50));

console.log('📋 HƯỚNG DẪN TẠO GOOGLE API KEY:');
console.log('');
console.log('🔧 BƯỚC 1: TRUY CẬP GOOGLE CLOUD CONSOLE');
console.log('   1. Mở browser và truy cập: https://console.cloud.google.com/');
console.log('   2. Đăng nhập bằng tài khoản Google');
console.log('   3. Chọn project: react-integration-469009');
console.log('');

console.log('🔧 BƯỚC 2: BẬT GOOGLE SHEETS API');
console.log('   1. Vào "APIs & Services" > "Library"');
console.log('   2. Tìm kiếm "Google Sheets API"');
console.log('   3. Click "Enable" để bật API');
console.log('');

console.log('🔧 BƯỚC 3: TẠO API KEY');
console.log('   1. Vào "APIs & Services" > "Credentials"');
console.log('   2. Click "Create Credentials" > "API Key"');
console.log('   3. Copy API key được tạo');
console.log('');

console.log('🔧 BƯỚC 4: CẤU HÌNH API KEY');
console.log('   1. Click vào API key vừa tạo');
console.log('   2. Đặt tên: "MIA Logistics API Key"');
console.log('   3. Restrict API key (tùy chọn):');
console.log('      - Application restrictions: HTTP referrers');
console.log('      - Website restrictions: http://localhost:3000/*');
console.log('      - API restrictions: Google Sheets API');
console.log('');

console.log('🔧 BƯỚC 5: CẬP NHẬT FILE .ENV');
console.log('   1. Mở file .env trong thư mục gốc');
console.log('   2. Thay thế dòng:');
console.log('      REACT_APP_GOOGLE_API_KEY=your-actual-api-key');
console.log('   3. Lưu file');
console.log('');

console.log('🔧 BƯỚC 6: RESTART FRONTEND');
console.log('   1. Dừng Frontend (Ctrl+C)');
console.log('   2. Chạy lại: npm start');
console.log('   3. Kiểm tra console browser');
console.log('');

console.log('⚠️  LƯU Ý QUAN TRỌNG:');
console.log('   1. KHÔNG chia sẻ API key công khai');
console.log('   2. Thêm .env vào .gitignore');
console.log('   3. Sử dụng environment variables trong production');
console.log('   4. Monitor API usage trong Google Cloud Console');
console.log('');

console.log('📞 SUPPORT:');
console.log('   - Google Cloud Console: https://console.cloud.google.com/');
console.log('   - Google Sheets API: https://developers.google.com/sheets/api');
console.log('   - API Key Best Practices: https://cloud.google.com/docs/authentication/api-keys');
console.log('');

console.log('🎯 SAU KHI TẠO API KEY:');
console.log('   1. Copy API key từ Google Cloud Console');
console.log('   2. Chạy script cập nhật: node scripts/updateEnvWithRealApiKey.js');
console.log('   3. Restart Frontend');
console.log('   4. Kiểm tra trang Maps');
console.log('');

console.log('=' .repeat(50));
console.log('✅ Hướng dẫn tạo Google API key hoàn thành!');
console.log('🎯 Bây giờ hãy tạo API key thực và cập nhật file .env!');
