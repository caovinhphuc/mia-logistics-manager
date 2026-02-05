// Script cập nhật .env với Google API key
const fs = require('fs');
const path = require('path');

console.log('🔧 CẬP NHẬT .ENV VỚI GOOGLE API KEY');
console.log('=' .repeat(50));

const envPath = path.join(__dirname, '..', '.env');

// Nội dung .env mới với API key
const envContent = `# Google Sheets Configuration
REACT_APP_GOOGLE_SPREADSHEET_ID=18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As

# Google API Configuration
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# Google Apps Script Configuration
REACT_APP_GOOGLE_APPS_SCRIPT_ID=your-apps-script-id

# Feature Flags
REACT_APP_ENABLE_GOOGLE_SHEETS=true
REACT_APP_ENABLE_GOOGLE_DRIVE=true
REACT_APP_ENABLE_GOOGLE_APPS_SCRIPT=true
REACT_APP_USE_MOCK_DATA=false

# Environment
NODE_ENV=development

# Google Sheets API Key (for direct API access)
REACT_APP_GOOGLE_API_KEY=AIzaSyBvOkBwvOkBwvOkBwvOkBwvOkBwvOkBwvOk

# Google OAuth Configuration
REACT_APP_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Google Sheets Service Account (for server-side operations)
REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL=react-integration-service@react-integration-469009.iam.gserviceaccount.com

# Debug Configuration
REACT_APP_DEBUG_GOOGLE_SHEETS=true
REACT_APP_DEBUG_GOOGLE_DRIVE=true
REACT_APP_DEBUG_GOOGLE_APPS_SCRIPT=true`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ File .env đã được cập nhật với Google API key!');
  console.log(`📁 Đường dẫn: ${envPath}`);
  console.log('');

  console.log('📋 NỘI DUNG FILE .ENV MỚI:');
  console.log(envContent);
  console.log('');

  console.log('⚠️  LƯU Ý QUAN TRỌNG:');
  console.log('   1. API key hiện tại là MẪU - cần thay thế bằng API key thực');
  console.log('   2. Tạo API key tại: https://console.cloud.google.com/');
  console.log('   3. Bật Google Sheets API');
  console.log('   4. Tạo API key và thay thế trong file .env');
  console.log('');

  console.log('🚀 BƯỚC TIẾP THEO:');
  console.log('   1. Tạo Google API key thực');
  console.log('   2. Cập nhật REACT_APP_GOOGLE_API_KEY trong .env');
  console.log('   3. Restart Frontend: npm start');
  console.log('   4. Kiểm tra console browser');
  console.log('   5. Truy cập trang Maps');
  console.log('');

  console.log('📞 HƯỚNG DẪN TẠO API KEY:');
  console.log('   1. Truy cập: https://console.cloud.google.com/');
  console.log('   2. Chọn project: react-integration-469009');
  console.log('   3. Vào "APIs & Services" > "Credentials"');
  console.log('   4. Click "Create Credentials" > "API Key"');
  console.log('   5. Copy API key và thay thế trong file .env');
  console.log('   6. Restrict API key (tùy chọn)');
  console.log('');

} catch (error) {
  console.log('❌ Lỗi cập nhật file .env:', error.message);
  console.log('');
  console.log('💡 HƯỚNG DẪN THỦ CÔNG:');
  console.log('   1. Mở file .env');
  console.log('   2. Thêm dòng: REACT_APP_GOOGLE_API_KEY=your-actual-api-key');
  console.log('   3. Restart Frontend');
}

console.log('=' .repeat(50));
console.log('✅ Hoàn thành cập nhật .env!');
