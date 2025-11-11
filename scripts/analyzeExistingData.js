// Script phân tích dữ liệu hiện có trong Google Sheet
console.log('🔍 PHÂN TÍCH DỮ LIỆU HIỆN CÓ TRONG GOOGLE SHEET');
console.log('=' .repeat(60));

// Dữ liệu hiện có từ Google Sheet
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

console.log('📊 CẤU TRÚC DỮ LIỆU HIỆN CÓ:');
console.log('   Cột | Field        | Mô tả                    | Ví dụ');
console.log('   ----|--------------|--------------------------|------------------');
const headers = Object.keys(EXISTING_DATA[0]);
headers.forEach((header, index) => {
  const column = String.fromCharCode(65 + index);
  const example = EXISTING_DATA[0][header];
  console.log(`   ${column.padEnd(4)} | ${header.padEnd(12)} | ${getFieldDescription(header).padEnd(24)} | ${example}`);
});
console.log('');

console.log('🔄 MAPPING VỚI FRONTEND:');
console.log('   Frontend Field    | Google Sheet Field | Mapping Logic');
console.log('   ------------------|-------------------|------------------');
const mapping = getMappingLogic();
Object.entries(mapping).forEach(([frontendField, sheetField]) => {
  console.log(`   ${frontendField.padEnd(18)} | ${sheetField.padEnd(17)} | ${getMappingDescription(frontendField, sheetField)}`);
});
console.log('');

console.log('📝 CẬP NHẬT FRONTEND MAPPING:');
console.log('   Cần cập nhật LocationsService để mapping với cấu trúc mới:');
console.log('');

console.log('🔧 CODE CẬP NHẬT:');
console.log('```javascript');
console.log('// Cập nhật mapping trong LocationsService');
console.log('const locationData = {};');
console.log('headers.forEach((header, colIndex) => {');
console.log('  locationData[header] = row[colIndex] || "";');
console.log('});');
console.log('');
console.log('return new Location({');
console.log('  locationId: locationData.id || `location_${index + 1}`,');
console.log('  name: locationData.code || "",');
console.log('  type: mapCategoryToType(locationData.category),');
console.log('  address: buildFullAddress(locationData),');
console.log('  latitude: 0, // Cần thêm từ dữ liệu khác');
console.log('  longitude: 0, // Cần thêm từ dữ liệu khác');
console.log('  phone: "", // Cần thêm cột phone');
console.log('  contactPerson: "", // Cần thêm cột contactPerson');
console.log('  capacity: 0, // Cần thêm cột capacity');
console.log('  operatingHours: "", // Cần thêm cột operatingHours');
console.log('  status: locationData.status || "active",');
console.log('  createdAt: locationData.createdAt || new Date().toISOString(),');
console.log('  updatedAt: locationData.updatedAt || new Date().toISOString()');
console.log('});');
console.log('```');
console.log('');

console.log('➕ CẦN THÊM CÁC CỘT:');
const missingFields = getMissingFields();
missingFields.forEach(field => {
  console.log(`   - ${field.name}: ${field.description}`);
});
console.log('');

console.log('🎯 ĐỀ XUẤT CẤU TRÚC MỚI:');
console.log('   Giữ nguyên các cột hiện có + thêm các cột mới:');
const newStructure = [...headers, ...missingFields.map(f => f.name)];
newStructure.forEach((field, index) => {
  const column = String.fromCharCode(65 + index);
  console.log(`   ${column}: ${field}`);
});
console.log('');

console.log('=' .repeat(60));
console.log('✅ Phân tích hoàn thành!');

// Helper functions
function getFieldDescription(field) {
  const descriptions = {
    id: 'ID địa điểm',
    code: 'Mã địa điểm',
    avatar: 'Icon',
    category: 'Danh mục',
    subcategory: 'Danh mục con',
    address: 'Địa chỉ',
    status: 'Trạng thái',
    ward: 'Phường/Xã',
    district: 'Quận/Huyện',
    province: 'Tỉnh/Thành phố',
    note: 'Ghi chú',
    createdAt: 'Ngày tạo',
    updatedAt: 'Ngày cập nhật'
  };
  return descriptions[field] || 'Không xác định';
}

function getMappingLogic() {
  return {
    locationId: 'id',
    name: 'code',
    type: 'category',
    address: 'address + ward + district + province',
    latitude: 'latitude (cần thêm)',
    longitude: 'longitude (cần thêm)',
    phone: 'phone (cần thêm)',
    contactPerson: 'contactPerson (cần thêm)',
    capacity: 'capacity (cần thêm)',
    operatingHours: 'operatingHours (cần thêm)',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };
}

function getMappingDescription(frontendField, sheetField) {
  if (sheetField.includes('cần thêm')) {
    return 'Cần thêm cột mới';
  } else if (sheetField.includes('+')) {
    return 'Kết hợp nhiều cột';
  } else {
    return 'Mapping trực tiếp';
  }
}

function getMissingFields() {
  return [
    { name: 'latitude', description: 'Vĩ độ (số thập phân)' },
    { name: 'longitude', description: 'Kinh độ (số thập phân)' },
    { name: 'phone', description: 'Số điện thoại' },
    { name: 'contactPerson', description: 'Người liên hệ' },
    { name: 'capacity', description: 'Dung tích (m³)' },
    { name: 'operatingHours', description: 'Giờ hoạt động' }
  ];
}
