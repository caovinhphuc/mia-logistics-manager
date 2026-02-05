// Script cập nhật Google Sheet hiện có với các cột mới
console.log('🔄 CẬP NHẬT GOOGLE SHEET HIỆN CÓ');
console.log('=' .repeat(50));

// Dữ liệu hiện có
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

// Các cột cần thêm
const NEW_COLUMNS = [
  { name: 'latitude', description: 'Vĩ độ', example: '10.7769' },
  { name: 'longitude', description: 'Kinh độ', example: '106.7009' },
  { name: 'phone', description: 'Số điện thoại', example: '028-1234-5678' },
  { name: 'contactPerson', description: 'Người liên hệ', example: 'Nguyễn Văn A' },
  { name: 'capacity', description: 'Dung tích (m³)', example: '5000' },
  { name: 'operatingHours', description: 'Giờ hoạt động', example: '8:00 - 22:00' }
];

console.log('📊 CẤU TRÚC HIỆN TẠI:');
const currentHeaders = Object.keys(EXISTING_DATA[0]);
currentHeaders.forEach((header, index) => {
  const column = String.fromCharCode(65 + index);
  console.log(`   ${column}: ${header}`);
});
console.log('');

console.log('➕ CÁC CỘT CẦN THÊM:');
NEW_COLUMNS.forEach((column, index) => {
  const columnLetter = String.fromCharCode(65 + currentHeaders.length + index);
  console.log(`   ${columnLetter}: ${column.name} - ${column.description}`);
  console.log(`      Ví dụ: ${column.example}`);
});
console.log('');

console.log('📝 HƯỚNG DẪN CẬP NHẬT GOOGLE SHEET:');
console.log('   1. Mở Google Sheet: https://docs.google.com/spreadsheets/d/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As');
console.log('   2. Thêm các cột mới vào cuối sheet:');
console.log('');

// Tạo headers mới
const newHeaders = [...currentHeaders, ...NEW_COLUMNS.map(col => col.name)];
console.log('   📋 HEADERS MỚI (COPY VÀO HÀNG 1):');
console.log('   ' + newHeaders.join('\t'));
console.log('');

console.log('   3. Cập nhật dữ liệu hiện có với các cột mới:');
console.log('   📊 DỮ LIỆU CẬP NHẬT:');

// Tạo dữ liệu mẫu cho các cột mới
const sampleData = {
  latitude: '10.7769',
  longitude: '106.7009',
  phone: '028-1234-5678',
  contactPerson: 'Nguyễn Văn A',
  capacity: '5000',
  operatingHours: '8:00 - 22:00'
};

EXISTING_DATA.forEach((row, index) => {
  const updatedRow = {
    ...row,
    ...sampleData
  };

  const rowData = newHeaders.map(header => updatedRow[header] || '');
  console.log(`   Hàng ${index + 2}: ${rowData.join('\t')}`);
});
console.log('');

console.log('🎯 MAPPING FRONTEND:');
console.log('   Frontend đã được cập nhật để mapping với cấu trúc mới:');
console.log('   - id → locationId');
console.log('   - code → name');
console.log('   - category → type (với mapping logic)');
console.log('   - address + ward + district + province → address (đầy đủ)');
console.log('   - status → status');
console.log('   - createdAt → createdAt');
console.log('   - updatedAt → updatedAt');
console.log('   - latitude → latitude (mới)');
console.log('   - longitude → longitude (mới)');
console.log('   - phone → phone (mới)');
console.log('   - contactPerson → contactPerson (mới)');
console.log('   - capacity → capacity (mới)');
console.log('   - operatingHours → operatingHours (mới)');
console.log('');

console.log('🔧 CATEGORY MAPPING:');
const categoryMapping = {
  'Cửa hàng': 'warehouse',
  'Kho hàng': 'warehouse',
  'Nhà vận chuyển': 'carrier',
  'Điểm giao hàng': 'delivery_point',
  'Điểm lấy hàng': 'pickup_point',
  'Showroom': 'warehouse',
  'Văn phòng': 'warehouse',
  'Trung tâm phân phối': 'warehouse'
};

Object.entries(categoryMapping).forEach(([sheetCategory, frontendType]) => {
  console.log(`   "${sheetCategory}" → "${frontendType}"`);
});
console.log('');

console.log('✅ KIỂM TRA SAU KHI CẬP NHẬT:');
console.log('   1. Chạy Frontend: npm start');
console.log('   2. Truy cập trang Maps');
console.log('   3. Chọn tab "Quản lý địa điểm"');
console.log('   4. Kiểm tra dữ liệu hiển thị đúng');
console.log('   5. Kiểm tra bản đồ hiển thị markers');
console.log('');

console.log('⚠️  LƯU Ý:');
console.log('   1. Đảm bảo Google Sheet được share public');
console.log('   2. Kiểm tra Google API credentials');
console.log('   3. Xem console browser để debug');
console.log('   4. Nếu có lỗi mapping, kiểm tra headers chính xác');
console.log('');

console.log('=' .repeat(50));
console.log('✅ Script cập nhật hoàn thành!');
console.log('🚀 Bây giờ bạn có thể cập nhật Google Sheet với cấu trúc mới!');
