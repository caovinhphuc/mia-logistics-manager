// Script debug Google Sheets loading
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

console.log('🔍 DEBUG GOOGLE SHEETS LOADING');
console.log('=' .repeat(50));

const SPREADSHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SHEET_NAME = 'Locations';

async function debugGoogleSheets() {
  try {
    console.log('📊 THÔNG TIN CẤU HÌNH:');
    console.log(`   Spreadsheet ID: ${SPREADSHEET_ID}`);
    console.log(`   Sheet Name: ${SHEET_NAME}`);
    console.log('');

    // Kiểm tra file credentials
    const credentialsPath = path.join(__dirname, 'credentials.json');
    if (!fs.existsSync(credentialsPath)) {
      console.log('❌ File credentials.json không tồn tại!');
      console.log('💡 Cần tạo file credentials.json trước');
      return;
    }

    console.log('✅ File credentials.json đã tồn tại');

    // Load credentials
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    console.log(`📧 Service Account: ${credentials.client_email}`);
    console.log('');

    // Khởi tạo Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Kiểm tra spreadsheet
    console.log('🔍 Kiểm tra spreadsheet...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });

    console.log(`✅ Spreadsheet: ${spreadsheet.data.properties.title}`);
    console.log(`📊 Số sheet: ${spreadsheet.data.sheets.length}`);
    console.log('');

    // 2. Kiểm tra sheet Locations
    const locationsSheet = spreadsheet.data.sheets.find(
      sheet => sheet.properties.title === SHEET_NAME
    );

    if (!locationsSheet) {
      console.log('❌ Sheet "Locations" không tồn tại!');
      console.log('📋 Các sheet có sẵn:');
      spreadsheet.data.sheets.forEach(sheet => {
        console.log(`   - ${sheet.properties.title}`);
      });
      return;
    }

    console.log('✅ Sheet "Locations" đã tồn tại!');
    console.log(`📊 Số hàng: ${locationsSheet.properties.gridProperties.rowCount}`);
    console.log(`📊 Số cột: ${locationsSheet.properties.gridProperties.columnCount}`);
    console.log('');

    // 3. Lấy dữ liệu
    console.log('📥 Lấy dữ liệu từ Google Sheets...');
    const data = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:S100`
    });

    if (!data.data.values || data.data.values.length === 0) {
      console.log('❌ Không có dữ liệu trong sheet!');
      return;
    }

    const headers = data.data.values[0];
    const rows = data.data.values.slice(1);

    console.log(`✅ Đã lấy được dữ liệu!`);
    console.log(`📋 Headers: ${headers.length} cột`);
    console.log(`📊 Rows: ${rows.length} hàng`);
    console.log('');

    // 4. Hiển thị headers
    console.log('📋 HEADERS:');
    headers.forEach((header, index) => {
      const column = String.fromCharCode(65 + index);
      console.log(`   ${column}: ${header}`);
    });
    console.log('');

    // 5. Hiển thị một vài hàng dữ liệu
    console.log('📊 DỮ LIỆU MẪU (3 hàng đầu):');
    rows.slice(0, 3).forEach((row, index) => {
      console.log(`   Hàng ${index + 2}: ${row.slice(0, 5).join(' | ')}...`);
    });
    console.log('');

    // 6. Kiểm tra mapping
    console.log('🔍 KIỂM TRA MAPPING:');
    const requiredFields = ['id', 'code', 'category', 'latitude', 'longitude'];
    const missingFields = requiredFields.filter(field => !headers.includes(field));

    if (missingFields.length === 0) {
      console.log('✅ Tất cả trường bắt buộc đã có!');
    } else {
      console.log('❌ Thiếu các trường:');
      missingFields.forEach(field => {
        console.log(`   - ${field}`);
      });
    }
    console.log('');

    // 7. Kiểm tra dữ liệu có tọa độ không
    console.log('🗺️ KIỂM TRA TỌA ĐỘ:');
    const latIndex = headers.indexOf('latitude');
    const lngIndex = headers.indexOf('longitude');

    if (latIndex !== -1 && lngIndex !== -1) {
      const validCoords = rows.filter(row =>
        row[latIndex] && row[lngIndex] &&
        !isNaN(parseFloat(row[latIndex])) &&
        !isNaN(parseFloat(row[lngIndex]))
      );

      console.log(`✅ Có ${validCoords.length} địa điểm có tọa độ hợp lệ`);

      if (validCoords.length > 0) {
        console.log('📍 Tọa độ mẫu:');
        validCoords.slice(0, 3).forEach((row, index) => {
          console.log(`   ${row[1]}: ${row[latIndex]}, ${row[lngIndex]}`);
        });
      }
    } else {
      console.log('❌ Không tìm thấy cột latitude/longitude');
    }
    console.log('');

    console.log('✅ GOOGLE SHEETS HOẠT ĐỘNG BÌNH THƯỜNG!');
    console.log('');
    console.log('🚀 BƯỚC TIẾP THEO:');
    console.log('   1. Restart Frontend: npm start');
    console.log('   2. Truy cập trang Maps');
    console.log('   3. Kiểm tra console browser');
    console.log('   4. Xem network tab để debug API calls');

  } catch (error) {
    console.error('❌ Lỗi debug Google Sheets:', error.message);

    if (error.message.includes('403')) {
      console.log('💡 Lỗi quyền truy cập (403)');
      console.log('   - Kiểm tra Google Sheet permissions');
      console.log('   - Đảm bảo service account có quyền Editor');
    } else if (error.message.includes('404')) {
      console.log('💡 Không tìm thấy resource (404)');
      console.log('   - Kiểm tra Spreadsheet ID');
      console.log('   - Kiểm tra Sheet name');
    } else if (error.message.includes('401')) {
      console.log('💡 Lỗi xác thực (401)');
      console.log('   - Kiểm tra credentials.json');
      console.log('   - Kiểm tra service account permissions');
    } else {
      console.log('💡 Lỗi khác:', error.message);
    }

    console.log('');
    console.log('📞 SUPPORT:');
    console.log('   - Google Cloud Console: https://console.cloud.google.com/');
    console.log('   - Google Sheets API: https://developers.google.com/sheets/api');
    console.log('   - Service Account: https://cloud.google.com/iam/docs/service-accounts');
  }
}

// Chạy debug
if (require.main === module) {
  debugGoogleSheets();
}

module.exports = { debugGoogleSheets };
