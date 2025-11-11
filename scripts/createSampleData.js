// Script tạo dữ liệu mẫu cho Google Sheet Locations
// Chạy: node scripts/createSampleData.js

console.log('🚀 TẠO DỮ LIỆU MẪU CHO GOOGLE SHEET');
console.log('=' .repeat(50));

// Cấu hình
const SPREADSHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SHEET_NAME = 'Locations';

// Headers cho Google Sheet
const HEADERS = [
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

// Dữ liệu mẫu
const SAMPLE_DATA = [
  {
    locationId: 'warehouse_hanoi_001',
    name: 'Kho Hà Nội - Cầu Giấy',
    type: 'warehouse',
    address: '123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội',
    latitude: 21.0285,
    longitude: 105.8542,
    phone: '024-1234-5678',
    contactPerson: 'Nguyễn Văn A',
    capacity: 5000,
    operatingHours: '7:00 - 22:00',
    status: 'active'
  },
  {
    locationId: 'warehouse_hcm_001',
    name: 'Kho TP.HCM - Quận 7',
    type: 'warehouse',
    address: '456 Đường Nguyễn Thị Thập, Quận 7, TP.HCM',
    latitude: 10.8231,
    longitude: 106.6297,
    phone: '028-8765-4321',
    contactPerson: 'Trần Thị B',
    capacity: 8000,
    operatingHours: '6:00 - 23:00',
    status: 'active'
  },
  {
    locationId: 'warehouse_danang_001',
    name: 'Kho Đà Nẵng - Hải Châu',
    type: 'warehouse',
    address: '789 Đường Lê Duẩn, Quận Hải Châu, Đà Nẵng',
    latitude: 16.0544,
    longitude: 108.2022,
    phone: '0236-5555-6666',
    contactPerson: 'Lê Văn C',
    capacity: 3000,
    operatingHours: '7:30 - 21:30',
    status: 'active'
  },
  {
    locationId: 'carrier_express_001',
    name: 'Công ty Vận chuyển Express',
    type: 'carrier',
    address: '321 Đường Láng, Quận Đống Đa, Hà Nội',
    latitude: 21.0123,
    longitude: 105.8234,
    phone: '024-1111-2222',
    contactPerson: 'Phạm Văn D',
    capacity: 0,
    operatingHours: '24/7',
    status: 'active'
  },
  {
    locationId: 'carrier_fast_001',
    name: 'Dịch vụ Vận chuyển Nhanh',
    type: 'carrier',
    address: '654 Đường Võ Văn Tần, Quận 3, TP.HCM',
    latitude: 10.7769,
    longitude: 106.7009,
    phone: '028-3333-4444',
    contactPerson: 'Hoàng Thị E',
    capacity: 0,
    operatingHours: '6:00 - 22:00',
    status: 'active'
  },
  {
    locationId: 'delivery_hanoi_001',
    name: 'Điểm giao hàng Hà Nội - Ba Đình',
    type: 'delivery_point',
    address: '987 Đường Điện Biên Phủ, Quận Ba Đình, Hà Nội',
    latitude: 21.0333,
    longitude: 105.8333,
    phone: '024-5555-6666',
    contactPerson: 'Vũ Văn F',
    capacity: 0,
    operatingHours: '8:00 - 20:00',
    status: 'active'
  },
  {
    locationId: 'delivery_hcm_001',
    name: 'Điểm giao hàng TP.HCM - Quận 1',
    type: 'delivery_point',
    address: '147 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    latitude: 10.7769,
    longitude: 106.7009,
    phone: '028-7777-8888',
    contactPerson: 'Đặng Thị G',
    capacity: 0,
    operatingHours: '7:00 - 21:00',
    status: 'active'
  },
  {
    locationId: 'delivery_danang_001',
    name: 'Điểm giao hàng Đà Nẵng - Thanh Khê',
    type: 'delivery_point',
    address: '258 Đường Lê Duẩn, Quận Thanh Khê, Đà Nẵng',
    latitude: 16.0680,
    longitude: 108.2020,
    phone: '0236-9999-0000',
    contactPerson: 'Bùi Văn H',
    capacity: 0,
    operatingHours: '8:30 - 19:30',
    status: 'active'
  },
  {
    locationId: 'pickup_hanoi_001',
    name: 'Điểm lấy hàng Hà Nội - Hoàn Kiếm',
    type: 'pickup_point',
    address: '369 Đường Hàng Bồ, Quận Hoàn Kiếm, Hà Nội',
    latitude: 21.0285,
    longitude: 105.8542,
    phone: '024-1111-3333',
    contactPerson: 'Ngô Thị I',
    capacity: 0,
    operatingHours: '7:00 - 19:00',
    status: 'active'
  },
  {
    locationId: 'pickup_hcm_001',
    name: 'Điểm lấy hàng TP.HCM - Quận 10',
    type: 'pickup_point',
    address: '741 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
    latitude: 10.7769,
    longitude: 106.7009,
    phone: '028-2222-4444',
    contactPerson: 'Lý Văn K',
    capacity: 0,
    operatingHours: '6:30 - 20:30',
    status: 'active'
  }
];

// Thêm timestamps
const now = new Date().toISOString();
const dataWithTimestamps = SAMPLE_DATA.map(location => ({
  ...location,
  createdAt: now,
  updatedAt: now
}));

console.log('📊 THÔNG TIN DỮ LIỆU:');
console.log(`   Spreadsheet ID: ${SPREADSHEET_ID}`);
console.log(`   Sheet Name: ${SHEET_NAME}`);
console.log(`   Số lượng địa điểm: ${dataWithTimestamps.length}`);
console.log('');

console.log('📋 HEADERS CHO GOOGLE SHEET:');
console.log('   ' + HEADERS.join('\t'));
console.log('');

console.log('📊 DỮ LIỆU MẪU:');
dataWithTimestamps.forEach((location, index) => {
  console.log(`   ${index + 1}. ${location.name} (${location.type})`);
  console.log(`      📍 ${location.address}`);
  console.log(`      📞 ${location.phone} - ${location.contactPerson}`);
  console.log(`      ⏰ ${location.operatingHours}`);
  console.log('');
});

console.log('📝 HƯỚNG DẪN TẠO GOOGLE SHEET:');
console.log('   1. Mở Google Sheets: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID);
console.log('   2. Tạo sheet mới tên "Locations"');
console.log('   3. Copy headers sau vào hàng 1:');
console.log('');
console.log('   📋 HEADERS (COPY VÀO HÀNG 1):');
console.log('   ' + HEADERS.join('\t'));
console.log('');

console.log('   4. Copy dữ liệu mẫu từ hàng 2:');
console.log('   📊 DỮ LIỆU MẪU (COPY TỪ HÀNG 2):');
dataWithTimestamps.forEach((location, index) => {
  const row = [
    location.locationId,
    location.name,
    location.type,
    location.address,
    location.latitude,
    location.longitude,
    location.phone,
    location.contactPerson,
    location.capacity,
    location.operatingHours,
    location.status,
    location.createdAt,
    location.updatedAt
  ];
  console.log('   ' + row.join('\t'));
});
console.log('');

console.log('🔍 KIỂM TRA MAPPING:');
console.log('   Sau khi tạo Google Sheet:');
console.log('   1. Chạy Frontend: npm start');
console.log('   2. Truy cập trang Maps');
console.log('   3. Chọn tab "Quản lý địa điểm"');
console.log('   4. Kiểm tra dữ liệu hiển thị');
console.log('');

console.log('⚠️  LƯU Ý:');
console.log('   1. Đảm bảo Google Sheet được share public');
console.log('   2. Kiểm tra Google API credentials');
console.log('   3. Xem console browser để debug');
console.log('');

console.log('📊 THỐNG KÊ DỮ LIỆU:');
const stats = dataWithTimestamps.reduce((acc, location) => {
  acc[location.type] = (acc[location.type] || 0) + 1;
  return acc;
}, {});

Object.entries(stats).forEach(([type, count]) => {
  const typeNames = {
    warehouse: 'Kho hàng',
    carrier: 'Nhà vận chuyển',
    delivery_point: 'Điểm giao hàng',
    pickup_point: 'Điểm lấy hàng'
  };
  console.log(`   ${typeNames[type]}: ${count} địa điểm`);
});
console.log('');

console.log('=' .repeat(50));
console.log('✅ Script tạo dữ liệu mẫu hoàn thành!');
console.log('🚀 Bây giờ bạn có thể tạo Google Sheet với dữ liệu trên!');
