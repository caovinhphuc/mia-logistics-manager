// Script kiểm tra cấu trúc Google Sheet Locations
const { google } = require('googleapis');

// Cấu hình Google Sheets API
const SPREADSHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SHEET_NAME = 'Locations';

// Headers mong đợi từ Frontend
const EXPECTED_HEADERS = [
  'locationId',
  'name',
  'type',
  'address',
  'latitude',
  'longitude',
  'phone',
  'contactPerson',
  'capacity',
  'operatingHours',
  'status',
  'createdAt',
  'updatedAt'
];

// Mapping giữa Frontend và Google Sheets
const FRONTEND_MAPPING = {
  locationId: 'A',
  name: 'B',
  type: 'C',
  address: 'D',
  latitude: 'E',
  longitude: 'F',
  phone: 'G',
  contactPerson: 'H',
  capacity: 'I',
  operatingHours: 'J',
  status: 'K',
  createdAt: 'L',
  updatedAt: 'M'
};

async function checkSheetStructure() {
  try {
    console.log('🔍 Kiểm tra cấu trúc Google Sheet...');
    console.log(`📊 Sheet ID: ${SPREADSHEET_ID}`);
    console.log(`📋 Sheet Name: ${SHEET_NAME}`);
    console.log('');

    // Lấy thông tin spreadsheet
    const sheets = google.sheets({ version: 'v4' });

    // Kiểm tra xem sheet có tồn tại không
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });

    console.log('✅ Kết nối Google Sheets thành công!');
    console.log(`📄 Spreadsheet Title: ${spreadsheet.data.properties.title}`);
    console.log('');

    // Kiểm tra sheet Locations
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
    console.log(`📊 Sheet Properties:`);
    console.log(`   - Title: ${locationsSheet.properties.title}`);
    console.log(`   - Sheet ID: ${locationsSheet.properties.sheetId}`);
    console.log(`   - Rows: ${locationsSheet.properties.gridProperties.rowCount}`);
    console.log(`   - Columns: ${locationsSheet.properties.gridProperties.columnCount}`);
    console.log('');

    // Lấy dữ liệu từ sheet
    const values = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:Z1` // Chỉ lấy hàng đầu tiên (headers)
    });

    if (!values.data.values || values.data.values.length === 0) {
      console.log('❌ Sheet "Locations" trống!');
      console.log('💡 Cần tạo headers và dữ liệu mẫu.');
      return;
    }

    const actualHeaders = values.data.values[0];
    console.log('📋 Headers hiện tại trong Google Sheet:');
    actualHeaders.forEach((header, index) => {
      const column = String.fromCharCode(65 + index); // A, B, C, ...
      console.log(`   ${column}: ${header || '(trống)'}`);
    });
    console.log('');

    // So sánh với headers mong đợi
    console.log('🔍 So sánh với Frontend mapping:');
    console.log('');

    const comparison = EXPECTED_HEADERS.map((expectedHeader, index) => {
      const actualHeader = actualHeaders[index];
      const column = String.fromCharCode(65 + index);
      const isMatch = actualHeader === expectedHeader;

      console.log(`${isMatch ? '✅' : '❌'} ${column}: "${actualHeader || '(trống)'}" ${isMatch ? '=' : '≠'} "${expectedHeader}"`);

      return {
        column,
        expected: expectedHeader,
        actual: actualHeader,
        match: isMatch
      };
    });

    console.log('');

    // Thống kê
    const matches = comparison.filter(c => c.match).length;
    const total = comparison.length;
    const percentage = Math.round((matches / total) * 100);

    console.log('📊 Thống kê mapping:');
    console.log(`   ✅ Khớp: ${matches}/${total} (${percentage}%)`);
    console.log(`   ❌ Không khớp: ${total - matches}/${total} (${100 - percentage}%)`);
    console.log('');

    if (matches === total) {
      console.log('🎉 Tất cả headers đã mapping chính xác với Frontend!');
    } else {
      console.log('⚠️  Có headers không khớp với Frontend:');
      comparison.filter(c => !c.match).forEach(c => {
        console.log(`   - Cột ${c.column}: Cần "${c.expected}" nhưng có "${c.actual}"`);
      });
      console.log('');
      console.log('💡 Đề xuất sửa lỗi:');
      console.log('   1. Cập nhật headers trong Google Sheet');
      console.log('   2. Hoặc cập nhật Frontend mapping');
    }

    // Kiểm tra dữ liệu mẫu
    if (values.data.values.length > 1) {
      console.log('');
      console.log('📊 Dữ liệu mẫu (hàng 2):');
      const sampleRow = values.data.values[1];
      sampleRow.forEach((value, index) => {
        const column = String.fromCharCode(65 + index);
        const header = actualHeaders[index];
        console.log(`   ${column} (${header}): ${value || '(trống)'}`);
      });
    }

  } catch (error) {
    console.error('❌ Lỗi kiểm tra Google Sheet:', error.message);

    if (error.message.includes('404')) {
      console.log('💡 Có thể sheet không tồn tại hoặc không có quyền truy cập');
    } else if (error.message.includes('403')) {
      console.log('💡 Cần cấu hình Google API credentials');
    } else {
      console.log('💡 Kiểm tra kết nối internet và Google API');
    }
  }
}

// Chạy kiểm tra
if (require.main === module) {
  checkSheetStructure();
}

module.exports = {
  checkSheetStructure,
  EXPECTED_HEADERS,
  FRONTEND_MAPPING
};
