// Script cập nhật Google Sheet thông qua URL
console.log('🚀 CẬP NHẬT GOOGLE SHEET THÔNG QUA URL');
console.log('=' .repeat(60));

const SPREADSHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';

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

console.log('📊 THÔNG TIN CẬP NHẬT:');
console.log(`   Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`   Sheet Name: Locations`);
console.log('');

console.log('🔗 LINK GOOGLE SHEET:');
console.log(`   https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
console.log('');

console.log('📋 BƯỚC 1: MỞ GOOGLE SHEET');
console.log('   1. Click vào link trên');
console.log('   2. Tìm sheet "Locations" (hoặc tạo mới nếu chưa có)');
console.log('   3. Đảm bảo bạn có quyền chỉnh sửa');
console.log('');

console.log('📋 BƯỚC 2: CẬP NHẬT HEADERS (HÀNG 1)');
console.log('   1. Chọn toàn bộ hàng 1');
console.log('   2. Xóa nội dung cũ');
console.log('   3. Copy và paste headers mới:');
console.log('');
console.log('   📋 HEADERS MỚI:');
console.log('   ' + COMPLETE_HEADERS.join('\t'));
console.log('');

console.log('📋 BƯỚC 3: CẬP NHẬT DỮ LIỆU HIỆN CÓ');
console.log('   Dữ liệu mẫu cho các cột mới:');
Object.entries(NEW_DATA_SAMPLE).forEach(([key, value]) => {
  console.log(`      ${key}: ${value}`);
});
console.log('');

console.log('📋 BƯỚC 4: CẬP NHẬT TỪNG HÀNG');
console.log('   Hàng 2 (MIA 1):');
console.log('   3	MIA 1	🏪	Cửa hàng	Showroom	185H Cống Quỳnh	active	Phường Nguyễn Cư Trinh	Quận 1	Thành phố Hồ Chí Minh	Showroom trưng bày sản phẩm	2025-08-20T10:58:21.429Z	2025-08-20T11:46:39.289Z	10.7769	106.7009	028-1234-5678	Nguyễn Văn A	5000	8:00 - 22:00');
console.log('');

console.log('   Hàng 3 (MIA 2):');
console.log('   4	MIA 2	🏪	Cửa hàng	Showroom	287A Nguyễn Văn Trỗi	inactive	Phường 10	Quận Phú Nhuận	Thành phố Hồ Chí Minh	Showroom trưng bày sản phẩm	2025-08-20T10:58:21.429Z	2025-08-20T11:46:41.729Z	10.7769	106.7009	028-1234-5678	Nguyễn Văn A	5000	8:00 - 22:00');
console.log('');

console.log('✅ KIỂM TRA KẾT QUẢ:');
console.log('   - Headers: 19 cột (A-S)');
console.log('   - Dữ liệu: Mỗi hàng có đủ 19 cột');
console.log('   - Mapping: Frontend sẽ đọc được dữ liệu');
console.log('');

console.log('🚀 SAU KHI CẬP NHẬT:');
console.log('   1. Chạy Frontend: npm start');
console.log('   2. Truy cập trang Maps');
console.log('   3. Chọn tab "Quản lý địa điểm"');
console.log('   4. Kiểm tra dữ liệu hiển thị đúng');
console.log('   5. Kiểm tra bản đồ hiển thị markers');
console.log('');

console.log('⚠️  LƯU Ý QUAN TRỌNG:');
console.log('   1. KHÔNG xóa dữ liệu cũ');
console.log('   2. CHỈ thêm các cột mới');
console.log('   3. Đảm bảo headers chính xác');
console.log('   4. Kiểm tra Google Sheet permissions');
console.log('');

console.log('📞 SUPPORT:');
console.log('   - Nếu có lỗi, kiểm tra console browser');
console.log('   - Xem network tab để debug API calls');
console.log('   - Kiểm tra Google Sheets permissions');
console.log('');

console.log('=' .repeat(60));
console.log('✅ Hướng dẫn cập nhật hoàn thành!');
console.log('🎯 Bây giờ bạn có thể cập nhật Google Sheet theo hướng dẫn trên!');
