// Script kiểm tra Google API credentials
const fs = require('fs');
const path = require('path');

console.log('🔍 KIỂM TRA GOOGLE API CREDENTIALS');
console.log('=' .repeat(50));

const credentialsPath = path.join(__dirname, 'credentials.json');

console.log('📁 Đường dẫn file credentials:');
console.log(`   ${credentialsPath}`);
console.log('');

// Kiểm tra file có tồn tại không
if (fs.existsSync(credentialsPath)) {
  console.log('✅ File credentials.json đã tồn tại!');
  console.log('');

  try {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

    console.log('📊 THÔNG TIN CREDENTIALS:');
    console.log(`   Type: ${credentials.type}`);
    console.log(`   Project ID: ${credentials.project_id}`);
    console.log(`   Client Email: ${credentials.client_email}`);
    console.log(`   Client ID: ${credentials.client_id}`);
    console.log(`   Private Key ID: ${credentials.private_key_id}`);
    console.log(`   Auth URI: ${credentials.auth_uri}`);
    console.log(`   Token URI: ${credentials.token_uri}`);
    console.log('');

    // Kiểm tra các trường bắt buộc
    const requiredFields = ['type', 'project_id', 'private_key', 'client_email', 'client_id'];
    const missingFields = requiredFields.filter(field => !credentials[field]);

    if (missingFields.length === 0) {
      console.log('✅ Tất cả trường bắt buộc đã có!');
      console.log('');

      console.log('🚀 CÓ THỂ CHẠY SCRIPT CẬP NHẬT:');
      console.log('   node scripts/updateSheetWithAPI.js');
      console.log('');

    } else {
      console.log('❌ Thiếu các trường bắt buộc:');
      missingFields.forEach(field => {
        console.log(`   - ${field}`);
      });
      console.log('');
      console.log('💡 Cần cập nhật file credentials.json');
    }

  } catch (error) {
    console.log('❌ File credentials.json không hợp lệ!');
    console.log(`   Lỗi: ${error.message}`);
    console.log('');
    console.log('💡 Cần tạo lại file credentials.json');
  }

} else {
  console.log('❌ File credentials.json chưa tồn tại!');
  console.log('');

  console.log('📋 HƯỚNG DẪN TẠO CREDENTIALS:');
  console.log('');

  console.log('🔧 BƯỚC 1: TẠO SERVICE ACCOUNT');
  console.log('   1. Truy cập Google Cloud Console:');
  console.log('      https://console.cloud.google.com/');
  console.log('   2. Tạo project mới hoặc chọn project hiện có');
  console.log('   3. Bật Google Sheets API');
  console.log('   4. Tạo Service Account');
  console.log('   5. Tải xuống JSON key file');
  console.log('');

  console.log('🔧 BƯỚC 2: CẤU HÌNH FILE');
  console.log('   1. Đặt file JSON key vào thư mục scripts/');
  console.log('   2. Đổi tên file thành "credentials.json"');
  console.log('   3. Cấu trúc file cần có:');
  console.log('      {');
  console.log('        "type": "service_account",');
  console.log('        "project_id": "your-project-id",');
  console.log('        "private_key_id": "...",');
  console.log('        "private_key": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n",');
  console.log('        "client_email": "...",');
  console.log('        "client_id": "...",');
  console.log('        "auth_uri": "https://accounts.google.com/o/oauth2/auth",');
  console.log('        "token_uri": "https://oauth2.googleapis.com/token"');
  console.log('      }');
  console.log('');

  console.log('🔧 BƯỚC 3: SHARE GOOGLE SHEET');
  console.log('   1. Mở Google Sheet:');
  console.log('      https://docs.google.com/spreadsheets/d/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As');
  console.log('   2. Click "Share" (Chia sẻ)');
  console.log('   3. Thêm email service account:');
  console.log('      [SERVICE_ACCOUNT_EMAIL]@[PROJECT_ID].iam.gserviceaccount.com');
  console.log('   4. Cấp quyền "Editor"');
  console.log('   5. Click "Send"');
  console.log('');

  console.log('🔧 BƯỚC 4: CÀI ĐẶT DEPENDENCIES');
  console.log('   npm install googleapis');
  console.log('');

  console.log('🔧 BƯỚC 5: CHẠY SCRIPT CẬP NHẬT');
  console.log('   node scripts/updateSheetWithAPI.js');
  console.log('');
}

console.log('⚠️  LƯU Ý QUAN TRỌNG:');
console.log('   1. KHÔNG commit file credentials.json vào git');
console.log('   2. Thêm credentials.json vào .gitignore');
console.log('   3. Đảm bảo Google Sheet được share với service account');
console.log('   4. Kiểm tra quyền truy cập Google Sheets API');
console.log('');

console.log('📞 SUPPORT:');
console.log('   - Google Cloud Console: https://console.cloud.google.com/');
console.log('   - Google Sheets API: https://developers.google.com/sheets/api');
console.log('   - Service Account: https://cloud.google.com/iam/docs/service-accounts');
console.log('');

console.log('=' .repeat(50));
console.log('✅ Kiểm tra credentials hoàn thành!');
