// Script tạo dữ liệu mẫu cho địa điểm logistics
// Chạy script này để tạo dữ liệu mẫu trong Google Sheet

const sampleLocations = [
  // Kho hàng
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

  // Nhà vận chuyển
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

  // Điểm giao hàng
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

  // Điểm lấy hàng
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

// Function để tạo dữ liệu mẫu
function createSampleData() {
  console.log('Tạo dữ liệu mẫu cho địa điểm logistics...');

  // Headers cho Google Sheet
  const headers = [
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

  // Tạo dữ liệu với timestamps
  const dataWithTimestamps = sampleLocations.map(location => ({
    ...location,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  // Convert to array format for Google Sheets
  const sheetData = [
    headers,
    ...dataWithTimestamps.map(location => [
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
    ])
  ];

  console.log('Dữ liệu mẫu đã được tạo:');
  console.log('Headers:', headers);
  console.log('Số lượng địa điểm:', dataWithTimestamps.length);
  console.log('Các loại địa điểm:');

  const typeStats = dataWithTimestamps.reduce((acc, location) => {
    acc[location.type] = (acc[location.type] || 0) + 1;
    return acc;
  }, {});

  console.log(typeStats);

  return {
    headers,
    data: dataWithTimestamps,
    sheetData
  };
}

// Export cho sử dụng
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    sampleLocations,
    createSampleData
  };
}

// Chạy script nếu được gọi trực tiếp
if (typeof window === 'undefined') {
  const result = createSampleData();
  console.log('\n=== HƯỚNG DẪN SỬ DỤNG ===');
  console.log('1. Mở Google Sheet với ID: 18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As');
  console.log('2. Tạo sheet mới tên "Locations"');
  console.log('3. Copy dữ liệu từ result.sheetData vào sheet');
  console.log('4. Hoặc sử dụng Google Sheets API để import tự động');
  console.log('\nDữ liệu đã sẵn sàng để import!');
}
