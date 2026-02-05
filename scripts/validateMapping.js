// Script kiểm tra mapping giữa Frontend và Google Sheets
// Chạy: node scripts/validateMapping.js

console.log('🔍 KIỂM TRA MAPPING FRONTEND ↔ GOOGLE SHEETS');
console.log('=' .repeat(50));

// Cấu hình
const SPREADSHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SHEET_NAME = 'Locations';

// Headers mong đợi từ Frontend (theo thứ tự)
const EXPECTED_HEADERS = [
  'locationId',    // A
  'name',          // B
  'type',          // C
  'address',       // D
  'latitude',      // E
  'longitude',     // F
  'phone',         // G
  'contactPerson', // H
  'capacity',      // I
  'operatingHours', // J
  'status',        // K
  'createdAt',     // L
  'updatedAt'      // M
];

// Mapping Frontend → Google Sheets
const FRONTEND_TO_SHEET = {
  locationId: { column: 'A', description: 'ID địa điểm' },
  name: { column: 'B', description: 'Tên địa điểm' },
  type: { column: 'C', description: 'Loại địa điểm' },
  address: { column: 'D', description: 'Địa chỉ' },
  latitude: { column: 'E', description: 'Vĩ độ' },
  longitude: { column: 'F', description: 'Kinh độ' },
  phone: { column: 'G', description: 'Số điện thoại' },
  contactPerson: { column: 'H', description: 'Người liên hệ' },
  capacity: { column: 'I', description: 'Dung tích (m³)' },
  operatingHours: { column: 'J', description: 'Giờ hoạt động' },
  status: { column: 'K', description: 'Trạng thái' },
  createdAt: { column: 'L', description: 'Ngày tạo' },
  updatedAt: { column: 'M', description: 'Ngày cập nhật' }
};

console.log('📊 THÔNG TIN CẤU HÌNH:');
console.log(`   Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`   Sheet Name: ${SHEET_NAME}`);
console.log('');

console.log('📋 CẤU TRÚC HEADERS MONG ĐỢI:');
console.log('   Cột | Header           | Mô tả');
console.log('   ----|------------------|------------------');
EXPECTED_HEADERS.forEach((header, index) => {
  const column = String.fromCharCode(65 + index);
  const mapping = FRONTEND_TO_SHEET[header];
  console.log(`   ${column.padEnd(4)} | ${header.padEnd(16)} | ${mapping.description}`);
});
console.log('');

console.log('🔧 FRONTEND MAPPING LOGIC:');
console.log('   Frontend sử dụng dynamic mapping:');
console.log('   ```javascript');
console.log('   const headers = values[0]; // Lấy headers từ Google Sheets');
console.log('   headers.forEach((header, colIndex) => {');
console.log('     locationData[header] = row[colIndex] || "";');
console.log('   });');
console.log('   ```');
console.log('');

console.log('✅ YÊU CẦU GOOGLE SHEET:');
console.log('   1. Sheet tên "Locations" phải tồn tại');
console.log('   2. Hàng đầu tiên (A1:M1) phải chứa headers chính xác');
console.log('   3. Headers phải khớp với EXPECTED_HEADERS');
console.log('   4. Dữ liệu bắt đầu từ hàng 2 (A2:M2, A3:M3, ...)');
console.log('');

console.log('📝 HƯỚNG DẪN TẠO GOOGLE SHEET:');
console.log('   1. Mở Google Sheets: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID);
console.log('   2. Tạo sheet mới tên "Locations"');
console.log('   3. Copy headers sau vào hàng 1:');
console.log('');

// Tạo bảng headers cho copy
const headersRow = EXPECTED_HEADERS.join('\t');
console.log('   📋 COPY HEADERS NÀY VÀO HÀNG 1:');
console.log('   ' + headersRow);
console.log('');

console.log('   4. Thêm dữ liệu mẫu từ hàng 2:');
console.log('   📊 DỮ LIỆU MẪU:');
console.log('   locationId\tname\ttype\taddress\tlatitude\tlongitude\tphone\tcontactPerson\tcapacity\toperatingHours\tstatus\tcreatedAt\tupdatedAt');
console.log('   warehouse_hanoi_001\tKho Hà Nội\twarehouse\t123 Đường Cầu Giấy\t21.0285\t105.8542\t024-1234-5678\tNguyễn Văn A\t5000\t7:00-22:00\tactive\t2024-01-01T00:00:00.000Z\t2024-01-01T00:00:00.000Z');
console.log('');

console.log('🔍 KIỂM TRA MAPPING:');
console.log('   Frontend sẽ tự động map dữ liệu dựa trên headers:');
console.log('   - Nếu header khớp → mapping thành công');
console.log('   - Nếu header không khớp → giá trị mặc định');
console.log('');

console.log('⚠️  LƯU Ý QUAN TRỌNG:');
console.log('   1. Headers phải CHÍNH XÁC (case-sensitive)');
console.log('   2. Thứ tự columns có thể thay đổi');
console.log('   3. Frontend sử dụng dynamic mapping nên linh hoạt');
console.log('   4. Nếu thiếu header → sử dụng giá trị mặc định');
console.log('');

console.log('🚀 TESTING:');
console.log('   1. Tạo Google Sheet với headers trên');
console.log('   2. Thêm dữ liệu mẫu');
console.log('   3. Chạy Frontend và kiểm tra trang Maps');
console.log('   4. Xem console để debug mapping');
console.log('');

console.log('📞 SUPPORT:');
console.log('   - Kiểm tra console browser để debug');
console.log('   - Xem network tab để kiểm tra API calls');
console.log('   - Kiểm tra Google Sheets permissions');
console.log('');

console.log('=' .repeat(50));
console.log('✅ Script validation hoàn thành!');
