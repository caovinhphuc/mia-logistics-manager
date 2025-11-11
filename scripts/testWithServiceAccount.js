// Script test với Service Account
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

console.log('🧪 TEST VỚI SERVICE ACCOUNT');
console.log('=' .repeat(50));

const SPREADSHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';

async function testWithServiceAccount() {
  try {
    console.log('📊 THÔNG TIN TEST:');
    console.log(`   Spreadsheet ID: ${SPREADSHEET_ID}`);
    console.log('');

    // Load credentials
    const credentialsPath = path.join(__dirname, 'credentials.json');
    if (!fs.existsSync(credentialsPath)) {
      console.log('❌ File credentials.json không tồn tại!');
      return;
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    console.log(`📧 Service Account: ${credentials.client_email}`);
    console.log('');

    // Khởi tạo Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Test 1: Lấy thông tin spreadsheet
    console.log('🔍 TEST 1: Lấy thông tin spreadsheet...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });

    console.log(`✅ Spreadsheet: ${spreadsheet.data.properties.title}`);
    console.log(`📊 Số sheet: ${spreadsheet.data.sheets.length}`);
    console.log('');

    // Test 2: Lấy dữ liệu từ sheet Locations
    console.log('🔍 TEST 2: Lấy dữ liệu từ sheet Locations...');
    const data = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Locations!A1:S100'
    });

    const values = data.data.values || [];
    console.log(`✅ Đã lấy được dữ liệu: ${values.length} hàng`);

    if (values.length > 0) {
      const headers = values[0];
      console.log(`📋 Headers: ${headers.length} cột`);
      console.log('📋 Headers chi tiết:');
      headers.forEach((header, index) => {
        const column = String.fromCharCode(65 + index);
        console.log(`   ${column}: ${header}`);
      });
      console.log('');

      // Kiểm tra dữ liệu mẫu
      if (values.length > 1) {
        console.log('📊 DỮ LIỆU MẪU (3 hàng đầu):');
        values.slice(1, 4).forEach((row, index) => {
          console.log(`   Hàng ${index + 2}: ${row.slice(0, 5).join(' | ')}...`);
        });
      }

      // Kiểm tra tọa độ
      const latIndex = headers.indexOf('latitude');
      const lngIndex = headers.indexOf('longitude');

      if (latIndex !== -1 && lngIndex !== -1) {
        const validCoords = values.slice(1).filter(row =>
          row[latIndex] && row[lngIndex] &&
          !isNaN(parseFloat(row[latIndex])) &&
          !isNaN(parseFloat(row[lngIndex]))
        );

        console.log(`🗺️ Có ${validCoords.length} địa điểm có tọa độ hợp lệ`);

        if (validCoords.length > 0) {
          console.log('📍 Tọa độ mẫu:');
          validCoords.slice(0, 3).forEach((row, index) => {
            const nameIndex = headers.indexOf('code');
            console.log(`   ${row[nameIndex]}: ${row[latIndex]}, ${row[lngIndex]}`);
          });
        }
      }
    }
    console.log('');

    console.log('✅ SERVICE ACCOUNT HOẠT ĐỘNG BÌNH THƯỜNG!');
    console.log('');
    console.log('🚀 BƯỚC TIẾP THEO:');
    console.log('   1. Sử dụng Service Account cho Frontend');
    console.log('   2. Tạo API proxy endpoint');
    console.log('   3. Restart Frontend: npm start');
    console.log('   4. Kiểm tra console browser');
    console.log('');
    console.log('🎯 KẾT QUẢ MONG ĐỢI:');
    console.log('   - Bản đồ hiển thị markers với tọa độ thực');
    console.log('   - Danh sách địa điểm với thông tin đầy đủ');
    console.log('   - Có thể thêm/sửa/xóa địa điểm');
    console.log('   - Tương tác với markers trên bản đồ');

  } catch (error) {
    console.error('❌ Lỗi test Service Account:', error.message);
    console.log('');
    console.log('💡 CÁC LỖI THƯỜNG GẶP:');
    console.log('   1. Service account không có quyền truy cập');
    console.log('   2. Google Sheet chưa được share với service account');
    console.log('   3. Google Sheets API chưa được bật');
    console.log('   4. Credentials không hợp lệ');
    console.log('');
    console.log('📞 SUPPORT:');
    console.log('   - Google Cloud Console: https://console.cloud.google.com/');
    console.log('   - Google Sheets API: https://developers.google.com/sheets/api');
    console.log('   - Service Account: https://cloud.google.com/iam/docs/service-accounts');
  }
}

// Chạy test
if (require.main === module) {
  testWithServiceAccount();
}

module.exports = { testWithServiceAccount };
