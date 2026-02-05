// Script cập nhật Google Sheet ngay lập tức
const { google } = require('googleapis');

// Cấu hình
const SPREADSHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SHEET_NAME = 'Locations';

// Headers hoàn chỉnh
const COMPLETE_HEADERS = [
  'id', 'code', 'avatar', 'category', 'subcategory', 'address', 'status',
  'ward', 'district', 'province', 'note', 'createdAt', 'updatedAt',
  'latitude', 'longitude', 'phone', 'contactPerson', 'capacity', 'operatingHours'
];

// Dữ liệu mẫu cho các cột mới
const NEW_DATA_SAMPLE = {
  latitude: '10.7769',
  longitude: '106.7009',
  phone: '028-1234-5678',
  contactPerson: 'Nguyễn Văn A',
  capacity: '5000',
  operatingHours: '8:00 - 22:00'
};

async function updateSheetNow() {
  try {
    console.log('🚀 BẮT ĐẦU CẬP NHẬT GOOGLE SHEET...');
    console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);
    console.log(`📋 Sheet Name: ${SHEET_NAME}`);
    console.log('');

    // Khởi tạo Google Sheets API với service account
    const auth = new google.auth.GoogleAuth({
      keyFile: './credentials.json', // Cần tạo file credentials
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 1. Kiểm tra sheet có tồn tại không
    console.log('🔍 Kiểm tra sheet hiện có...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });

    const existingSheet = spreadsheet.data.sheets.find(
      sheet => sheet.properties.title === SHEET_NAME
    );

    if (!existingSheet) {
      console.log('❌ Sheet "Locations" không tồn tại!');
      console.log('📋 Các sheet có sẵn:');
      spreadsheet.data.sheets.forEach(sheet => {
        console.log(`   - ${sheet.properties.title}`);
      });
      return;
    }

    console.log('✅ Sheet "Locations" đã tồn tại!');
    console.log('');

    // 2. Lấy dữ liệu hiện có
    console.log('📥 Lấy dữ liệu hiện có...');
    const currentData = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:Z100`
    });

    if (!currentData.data.values || currentData.data.values.length === 0) {
      console.log('❌ Sheet trống! Cần thêm dữ liệu trước.');
      return;
    }

    const currentHeaders = currentData.data.values[0];
    const currentRows = currentData.data.values.slice(1);

    console.log(`📊 Dữ liệu hiện có: ${currentRows.length} hàng`);
    console.log(`📋 Headers hiện tại: ${currentHeaders.length} cột`);
    console.log('');

    // 3. Cập nhật headers
    console.log('📝 Cập nhật headers...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:S1`,
      valueInputOption: 'RAW',
      resource: {
        values: [COMPLETE_HEADERS]
      }
    });
    console.log('✅ Headers đã được cập nhật!');
    console.log('');

    // 4. Cập nhật dữ liệu hiện có với các cột mới
    console.log('📊 Cập nhật dữ liệu hiện có...');
    const updatedRows = currentRows.map(row => {
      // Giữ nguyên dữ liệu cũ
      const existingData = [...row];

      // Thêm dữ liệu mới cho các cột mới
      const newData = [
        NEW_DATA_SAMPLE.latitude,
        NEW_DATA_SAMPLE.longitude,
        NEW_DATA_SAMPLE.phone,
        NEW_DATA_SAMPLE.contactPerson,
        NEW_DATA_SAMPLE.capacity,
        NEW_DATA_SAMPLE.operatingHours
      ];

      return [...existingData, ...newData];
    });

    // Cập nhật từng hàng
    for (let i = 0; i < updatedRows.length; i++) {
      const rowIndex = i + 2; // +2 vì bắt đầu từ hàng 2
      const range = `${SHEET_NAME}!A${rowIndex}:S${rowIndex}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: 'RAW',
        resource: {
          values: [updatedRows[i]]
        }
      });

      console.log(`   ✅ Hàng ${rowIndex} đã được cập nhật`);
    }

    console.log('');
    console.log('🎉 CẬP NHẬT HOÀN THÀNH!');
    console.log('');

    // 5. Kiểm tra kết quả
    console.log('🔍 Kiểm tra kết quả...');
    const finalData = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:S${updatedRows.length + 1}`
    });

    console.log('📊 Dữ liệu sau khi cập nhật:');
    console.log(`   - Headers: ${finalData.data.values[0].length} cột`);
    console.log(`   - Rows: ${finalData.data.values.length - 1} hàng dữ liệu`);
    console.log('');

    console.log('📋 Headers cuối cùng:');
    finalData.data.values[0].forEach((header, index) => {
      const column = String.fromCharCode(65 + index);
      console.log(`   ${column}: ${header}`);
    });
    console.log('');

    console.log('✅ GOOGLE SHEET ĐÃ ĐƯỢC CẬP NHẬT THÀNH CÔNG!');
    console.log('');
    console.log('🚀 BƯỚC TIẾP THEO:');
    console.log('   1. Chạy Frontend: npm start');
    console.log('   2. Truy cập trang Maps');
    console.log('   3. Chọn tab "Quản lý địa điểm"');
    console.log('   4. Kiểm tra dữ liệu hiển thị đúng');
    console.log('   5. Kiểm tra bản đồ hiển thị markers');

  } catch (error) {
    console.error('❌ Lỗi cập nhật Google Sheet:', error.message);

    if (error.message.includes('403')) {
      console.log('💡 Cần cấu hình Google API credentials');
      console.log('   - Tạo service account key');
      console.log('   - Share Google Sheet với service account email');
    } else if (error.message.includes('404')) {
      console.log('💡 Không tìm thấy Google Sheet');
      console.log('   - Kiểm tra Spreadsheet ID');
      console.log('   - Kiểm tra quyền truy cập');
    } else {
      console.log('💡 Lỗi khác:', error.message);
    }

    console.log('');
    console.log('📝 HƯỚNG DẪN THỦ CÔNG:');
    console.log('   1. Mở Google Sheet:');
    console.log(`      https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
    console.log('   2. Cập nhật headers (hàng 1):');
    console.log('      ' + COMPLETE_HEADERS.join('\t'));
    console.log('   3. Thêm dữ liệu mới cho các cột N-S');
  }
}

// Chạy cập nhật
if (require.main === module) {
  updateSheetNow();
}

module.exports = { updateSheetNow };
