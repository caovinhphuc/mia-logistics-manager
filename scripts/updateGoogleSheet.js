// Script cập nhật Google Sheet - THÊM cột mới vào cuối sheet
console.log('🔄 CẬP NHẬT GOOGLE SHEET - THÊM CỘT MỚI');
console.log('=' .repeat(60));

// Cấu hình
const SPREADSHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SHEET_NAME = 'Locations';

// Headers hiện có (GIỮ NGUYÊN)
const EXISTING_HEADERS = [
  'id',
  'code',
  'avatar',
  'category',
  'subcategory',
  'address',
  'status',
  'ward',
  'district',
  'province',
  'note',
  'createdAt',
  'updatedAt'
];

// Các cột mới cần THÊM (vào cuối)
const NEW_HEADERS = [
  'latitude',
  'longitude',
  'phone',
  'contactPerson',
  'capacity',
  'operatingHours'
];

// Headers hoàn chỉnh (cũ + mới)
const COMPLETE_HEADERS = [...EXISTING_HEADERS, ...NEW_HEADERS];

console.log('📊 CẤU TRÚC HIỆN TẠI (GIỮ NGUYÊN):');
EXISTING_HEADERS.forEach((header, index) => {
  const column = String.fromCharCode(65 + index);
  console.log(`   ${column}: ${header}`);
});
console.log('');

console.log('➕ CÁC CỘT MỚI (THÊM VÀO CUỐI):');
NEW_HEADERS.forEach((header, index) => {
  const column = String.fromCharCode(65 + EXISTING_HEADERS.length + index);
  console.log(`   ${column}: ${header}`);
});
console.log('');

console.log('📋 HEADERS HOÀN CHỈNH (CŨ + MỚI):');
COMPLETE_HEADERS.forEach((header, index) => {
  const column = String.fromCharCode(65 + index);
  console.log(`   ${column}: ${header}`);
});
console.log('');

console.log('📝 HƯỚNG DẪN CẬP NHẬT GOOGLE SHEET:');
console.log('   1. Mở Google Sheet:');
console.log(`      https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
console.log('');
console.log('   2. Tìm sheet "${SHEET_NAME}" (hoặc tạo mới nếu chưa có)');
console.log('');
console.log('   3. Cập nhật HÀNG 1 (HEADERS):');
console.log('      - Giữ nguyên các cột A-M hiện có');
console.log('      - Thêm các cột mới từ cột N trở đi');
console.log('');
console.log('   📋 COPY HEADERS MỚI VÀO HÀNG 1:');
console.log('   ' + COMPLETE_HEADERS.join('\t'));
console.log('');

console.log('   4. Cập nhật dữ liệu hiện có:');
console.log('      - Giữ nguyên dữ liệu cũ (cột A-M)');
console.log('      - Thêm dữ liệu mới cho các cột N-S');
console.log('');

// Dữ liệu mẫu cho các cột mới
const SAMPLE_NEW_DATA = {
  latitude: '10.7769',
  longitude: '106.7009',
  phone: '028-1234-5678',
  contactPerson: 'Nguyễn Văn A',
  capacity: '5000',
  operatingHours: '8:00 - 22:00'
};

console.log('   📊 DỮ LIỆU MẪU CHO CÁC CỘT MỚI:');
Object.entries(SAMPLE_NEW_DATA).forEach(([key, value]) => {
  console.log(`      ${key}: ${value}`);
});
console.log('');

console.log('   5. Cập nhật từng hàng dữ liệu:');
console.log('      Hàng 2: [dữ liệu cũ] + [dữ liệu mới]');
console.log('      Hàng 3: [dữ liệu cũ] + [dữ liệu mới]');
console.log('      ...');
console.log('');

console.log('🎯 VÍ DỤ CẬP NHẬT HÀNG 2:');
console.log('   Dữ liệu cũ (A-M): 3	MIA 1	🏪	Cửa hàng	Showroom	185H Cống Quỳnh	active	Phường Nguyễn Cư Trinh	Quận 1	Thành phố Hồ Chí Minh	Showroom trưng bày sản phẩm	2025-08-20T10:58:21.429Z	2025-08-20T11:46:39.289Z');
console.log('   Dữ liệu mới (N-S): 10.7769	106.7009	028-1234-5678	Nguyễn Văn A	5000	8:00 - 22:00');
console.log('   Kết quả: 3	MIA 1	🏪	Cửa hàng	Showroom	185H Cống Quỳnh	active	Phường Nguyễn Cư Trinh	Quận 1	Thành phố Hồ Chí Minh	Showroom trưng bày sản phẩm	2025-08-20T10:58:21.429Z	2025-08-20T11:46:39.289Z	10.7769	106.7009	028-1234-5678	Nguyễn Văn A	5000	8:00 - 22:00');
console.log('');

console.log('✅ LỢI ÍCH CỦA CÁCH NÀY:');
console.log('   ✅ Giữ nguyên dữ liệu cũ');
console.log('   ✅ Không mất thông tin hiện có');
console.log('   ✅ Thêm tính năng mới');
console.log('   ✅ Backward compatible');
console.log('   ✅ Frontend đã sẵn sàng mapping');
console.log('');

console.log('🔧 FRONTEND MAPPING:');
console.log('   Frontend đã được cập nhật để:');
console.log('   - Đọc tất cả headers (cũ + mới)');
console.log('   - Mapping dữ liệu cũ với logic mới');
console.log('   - Sử dụng dữ liệu mới nếu có');
console.log('   - Fallback về giá trị mặc định nếu thiếu');
console.log('');

console.log('⚠️  LƯU Ý QUAN TRỌNG:');
console.log('   1. KHÔNG xóa hoặc thay đổi dữ liệu cũ');
console.log('   2. CHỈ thêm các cột mới vào cuối');
console.log('   3. Đảm bảo headers chính xác (case-sensitive)');
console.log('   4. Kiểm tra Google Sheet permissions');
console.log('');

console.log('🚀 SAU KHI CẬP NHẬT:');
console.log('   1. Chạy Frontend: npm start');
console.log('   2. Truy cập trang Maps');
console.log('   3. Chọn tab "Quản lý địa điểm"');
console.log('   4. Kiểm tra dữ liệu hiển thị đúng');
console.log('   5. Kiểm tra bản đồ hiển thị markers');
console.log('');

console.log('📊 KIỂM TRA MAPPING:');
console.log('   - Dữ liệu cũ: Hiển thị bình thường');
console.log('   - Dữ liệu mới: Hiển thị nếu có, mặc định nếu thiếu');
console.log('   - Address: Kết hợp từ các trường riêng lẻ');
console.log('   - Category: Mapping sang type phù hợp');
console.log('');

console.log('=' .repeat(60));
console.log('✅ Script cập nhật hoàn thành!');
console.log('🎯 Bây giờ bạn có thể cập nhật Google Sheet một cách an toàn!');
