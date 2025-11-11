#!/usr/bin/env node

/**
 * Script tạo 10-20 lịch nhập đầy đủ các trường để test UI
 * Sử dụng backend API để đảm bảo data consistency
 */

const https = require('https');
const http = require('http');

const API_BASE_URL = 'http://localhost:5050';

// Sample data templates
const SUPPLIERS = [
  'Công ty ABC',
  'Nhà máy XYZ',
  'Xưởng DEF',
  'Factory GHI',
  'Supplier JKL',
];
const ORIGINS = ['Trung Quốc', 'Việt Nam', 'Thái Lan', 'Malaysia', 'Indonesia'];
const DESTINATIONS = [
  'Kho trung tâm - I62-5, Đường CN1, P.Phước Bình, Q.9, TP.HCM',
  'Kho Hà Nội - 18 Xốm Nùi Tiến Hưng, Cầu Giấy, Hà Nội',
  'Kho Đà Nẵng - 123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
  'Kho Cần Thơ - 456 Đường 3/2, Ninh Kiều, Cần Thơ',
];
const PRODUCTS = [
  'Larita ROTA MG0324',
  'Samsung Galaxy Tab',
  'Apple iPad Pro',
  'Nike Air Max',
  'Adidas Ultra Boost',
];
const CATEGORIES = [
  'Vali',
  'Balo',
  'Quà tặng',
  'Phụ kiện',
  'Phụ kiện sửa chữa',
  'Nguyên vật liệu',
  'Thùng giấy',
  'Văn phòng phẩm',
];
const CARRIERS = ['DHL', 'FedEx', 'UPS', 'TNT Express', 'Giao Hàng Nhanh'];
const STATUSES = ['pending', 'confirmed', 'in-transit', 'arrived', 'completed'];
const PURPOSES = ['online', 'offline'];

// Document types để tạo đầy đủ 5 loại
const DOCUMENT_TYPES = [
  'Check bill',
  'Check CO',
  'Tờ gửi chứng từ đi',
  'Lên Tờ Khai Hải Quan',
  'Đóng thuế',
];

// Timeline types
const TIMELINE_TYPES = [
  'Ngày tạo phiếu',
  'Cargo Ready',
  'ETD',
  'ETA',
  'Ngày hàng đi',
  'Ngày hàng về cảng',
  'Ngày nhận hàng',
];

const PACKAGING_TYPES = [
  '1PCS/SET',
  '2PCS/SET',
  '3PCS/SET',
  '4PCS/SET',
  '5PCS/SET',
];

// Helper: Random item from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper: Random number between min and max
const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: Random date within range
const randomDate = (daysFromNow) => {
  const now = new Date();
  const randomDays = randomBetween(-30, daysFromNow);
  const date = new Date(now);
  date.setDate(date.getDate() + randomDays);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Helper: Create timeline with all 7 types
const createTimeline = () => {
  return TIMELINE_TYPES.map((name) => {
    const estimated = randomDate(30);
    const actual = Math.random() > 0.3 ? randomDate(35) : ''; // 70% có actual date
    const status = actual
      ? Math.random() > 0.8
        ? 'completed'
        : randomItem(['pending', 'in-progress'])
      : 'pending';

    return {
      name,
      estimatedDate: name === 'Ngày tạo phiếu' ? '' : estimated,
      date: actual,
      status,
      description: `Mô tả ${name} - ${Math.random().toString(36).substr(2, 5)}`,
    };
  });
};

// Helper: Create document status with all 5 types
const createDocumentStatus = () => {
  return DOCUMENT_TYPES.map((name) => {
    const estimated = randomDate(25);
    const actual = Math.random() > 0.6 ? randomDate(30) : ''; // 40% có actual date
    const status = actual
      ? Math.random() > 0.6
        ? 'completed'
        : randomItem(['pending', 'in-progress'])
      : 'pending';

    return {
      name,
      estimatedDate: estimated, // Đảm bảo tất cả đều có estimated date
      date: actual,
      status,
      description: `Mô tả ${name} - ${Math.random().toString(36).substr(2, 5)}`,
    };
  });
};

// Helper: Create packaging array
const createPackaging = () => {
  const numPackages = randomBetween(2, 5);
  return Array.from({ length: numPackages }, (_, i) => ({
    id: `pack_${Date.now()}_${i}`,
    type: randomItem(PACKAGING_TYPES),
    quantity: randomBetween(100, 2000),
    description: `Packaging ${i + 1}`,
  }));
};

// Generate test inbound item
const generateInboundItem = (index) => {
  const isInternational = Math.random() > 0.4; // 60% international, 40% domestic
  const packaging = createPackaging();
  const totalQuantity = packaging.reduce((sum, pkg) => sum + pkg.quantity, 0);

  const item = {
    id: `TEST_${Date.now()}_${index}`,
    date: randomDate(0),
    supplier: randomItem(SUPPLIERS),
    origin: isInternational
      ? randomItem(ORIGINS.filter((o) => o !== 'Việt Nam'))
      : '',
    destination: randomItem(DESTINATIONS),
    product: randomItem(PRODUCTS),
    category: randomItem(CATEGORIES),
    quantity: totalQuantity,
    status: randomItem(STATUSES),
    carrier: randomItem(CARRIERS),
    pi: isInternational ? `PI${randomBetween(1000, 9999)}` : '',
    container: randomBetween(1, 10),
    purpose: randomItem(PURPOSES),
    receiveTime: `${randomBetween(8, 17)}:${randomBetween(0, 59).toString().padStart(2, '0')}`,
    estimatedArrival: randomDate(10),
    actualArrival: Math.random() > 0.5 ? randomDate(15) : '',
    notes: `Test note for item ${index}`,
    type: isInternational ? 'international' : 'domestic',
    packaging,
    timeline: createTimeline(),
    documentStatus: isInternational ? createDocumentStatus() : [], // Domestic không có document status
    poNumbers: isInternational
      ? [`PO${randomBetween(1000, 9999)}`, `PO${randomBetween(1000, 9999)}`]
      : [],
  };

  return item;
};

// Main function
async function createTestData() {
  console.log('🚀 Bắt đầu tạo test data...');

  try {
    // Tạo 20 items test
    const items = [];
    for (let i = 1; i <= 20; i++) {
      const item = generateInboundItem(i);
      items.push(item);
      console.log(`✅ Generated item ${i}: ${item.product} (${item.type})`);
    }

    // Add to backend API
    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
      try {
        const endpoint =
          item.type === 'international'
            ? '/api/inboundinternational'
            : '/api/inbounddomestic';

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          successCount++;
          console.log(`✅ Added ${item.id} (${item.type})`);
        } else {
          errorCount++;
          console.log(`❌ Failed to add ${item.id}: ${response.statusText}`);
        }
      } catch (error) {
        errorCount++;
        console.log(`❌ Error adding ${item.id}:`, error.message);
      }
    }

    console.log('\n📊 Kết quả:');
    console.log(`✅ Thành công: ${successCount} items`);
    console.log(`❌ Lỗi: ${errorCount} items`);
    console.log(`📦 Tổng: ${items.length} items`);

    // Summary by type
    const internationalCount = items.filter(
      (i) => i.type === 'international'
    ).length;
    const domesticCount = items.filter((i) => i.type === 'domestic').length;
    console.log(`🌍 Quốc tế: ${internationalCount} items`);
    console.log(`🏠 Quốc nội: ${domesticCount} items`);
  } catch (error) {
    console.error('🚨 Error creating test data:', error);
  }
}

// Execute if run directly
if (require.main === module) {
  createTestData()
    .then(() => {
      console.log('🎉 Hoàn thành tạo test data!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('🚨 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createTestData };
