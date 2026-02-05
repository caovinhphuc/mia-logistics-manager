// Hướng dẫn cập nhật Google Sheet thủ công
console.log('📝 HƯỚNG DẪN CẬP NHẬT GOOGLE SHEET THỦ CÔNG');
console.log('=' .repeat(60));

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

console.log('🎯 MỤC TIÊU:');
console.log('   Cập nhật Google Sheet để tương thích với Frontend');
console.log('   - Giữ nguyên dữ liệu cũ (cột A-M)');
console.log('   - Thêm các cột mới (cột N-S)');
console.log('   - Cập nhật headers và dữ liệu');
console.log('');

console.log('📋 BƯỚC 1: MỞ GOOGLE SHEET');
console.log(`   🔗 Link: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`);
console.log('   📝 Tìm sheet "${SHEET_NAME}" (hoặc tạo mới nếu chưa có)');
console.log('');

console.log('📋 BƯỚC 2: CẬP NHẬT HEADERS (HÀNG 1)');
console.log('   🎯 Mục tiêu: Thay thế toàn bộ hàng 1 bằng headers mới');
console.log('   📋 Copy và paste headers sau vào hàng 1:');
console.log('');
console.log('   📋 HEADERS MỚI:');
console.log('   ' + COMPLETE_HEADERS.join('\t'));
console.log('');

console.log('📋 BƯỚC 3: CẬP NHẬT DỮ LIỆU HIỆN CÓ');
console.log('   🎯 Mục tiêu: Thêm dữ liệu mới cho các cột N-S');
console.log('   📊 Dữ liệu mẫu cho các cột mới:');
Object.entries(NEW_DATA_SAMPLE).forEach(([key, value]) => {
  console.log(`      ${key}: ${value}`);
});
console.log('');

console.log('📋 BƯỚC 4: CẬP NHẬT TỪNG HÀNG DỮ LIỆU');
console.log('   🎯 Mục tiêu: Mở rộng mỗi hàng dữ liệu với các cột mới');
console.log('');

// Dữ liệu hiện có (ví dụ)
const EXISTING_DATA = [
  {
    id: 3,
    code: 'MIA 1',
    avatar: '🏪',
    category: 'Cửa hàng',
    subcategory: 'Showroom',
    address: '185H Cống Quỳnh',
    status: 'active',
    ward: 'Phường Nguyễn Cư Trinh',
    district: 'Quận 1',
    province: 'Thành phố Hồ Chí Minh',
    note: 'Showroom trưng bày sản phẩm',
    createdAt: '2025-08-20T10:58:21.429Z',
    updatedAt: '2025-08-20T11:46:39.289Z'
  },
  {
    id: 4,
    code: 'MIA 2',
    avatar: '🏪',
    category: 'Cửa hàng',
    subcategory: 'Showroom',
    address: '287A Nguyễn Văn Trỗi',
    status: 'inactive',
    ward: 'Phường 10',
    district: 'Quận Phú Nhuận',
    province: 'Thành phố Hồ Chí Minh',
    note: 'Showroom trưng bày sản phẩm',
    createdAt: '2025-08-20T10:58:21.429Z',
    updatedAt: '2025-08-20T11:46:41.729Z'
  }
];

console.log('   📊 VÍ DỤ CẬP NHẬT HÀNG 2:');
const row2Data = [
  EXISTING_DATA[0].id,
  EXISTING_DATA[0].code,
  EXISTING_DATA[0].avatar,
  EXISTING_DATA[0].category,
  EXISTING_DATA[0].subcategory,
  EXISTING_DATA[0].address,
  EXISTING_DATA[0].status,
  EXISTING_DATA[0].ward,
  EXISTING_DATA[0].district,
  EXISTING_DATA[0].province,
  EXISTING_DATA[0].note,
  EXISTING_DATA[0].createdAt,
  EXISTING_DATA[0].updatedAt,
  NEW_DATA_SAMPLE.latitude,
  NEW_DATA_SAMPLE.longitude,
  NEW_DATA_SAMPLE.phone,
  NEW_DATA_SAMPLE.contactPerson,
  NEW_DATA_SAMPLE.capacity,
  NEW_DATA_SAMPLE.operatingHours
];
console.log('   ' + row2Data.join('\t'));
console.log('');

console.log('   📊 VÍ DỤ CẬP NHẬT HÀNG 3:');
const row3Data = [
  EXISTING_DATA[1].id,
  EXISTING_DATA[1].code,
  EXISTING_DATA[1].avatar,
  EXISTING_DATA[1].category,
  EXISTING_DATA[1].subcategory,
  EXISTING_DATA[1].address,
  EXISTING_DATA[1].status,
  EXISTING_DATA[1].ward,
  EXISTING_DATA[1].district,
  EXISTING_DATA[1].province,
  EXISTING_DATA[1].note,
  EXISTING_DATA[1].createdAt,
  EXISTING_DATA[1].updatedAt,
  NEW_DATA_SAMPLE.latitude,
  NEW_DATA_SAMPLE.longitude,
  NEW_DATA_SAMPLE.phone,
  NEW_DATA_SAMPLE.contactPerson,
  NEW_DATA_SAMPLE.capacity,
  NEW_DATA_SAMPLE.operatingHours
];
console.log('   ' + row3Data.join('\t'));
console.log('');

console.log('📋 BƯỚC 5: KIỂM TRA KẾT QUẢ');
console.log('   ✅ Headers: 19 cột (A-S)');
console.log('   ✅ Dữ liệu: Mỗi hàng có đủ 19 cột');
console.log('   ✅ Mapping: Frontend sẽ đọc được dữ liệu');
console.log('');

console.log('🔧 FRONTEND MAPPING:');
console.log('   Frontend đã được cập nhật để mapping:');
console.log('   - id → locationId');
console.log('   - code → name');
console.log('   - category → type (với logic mapping)');
console.log('   - address + ward + district + province → address (đầy đủ)');
console.log('   - latitude → latitude (mới)');
console.log('   - longitude → longitude (mới)');
console.log('   - phone → phone (mới)');
console.log('   - contactPerson → contactPerson (mới)');
console.log('   - capacity → capacity (mới)');
console.log('   - operatingHours → operatingHours (mới)');
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
