#!/usr/bin/env node

/**
 * Script tạo lịch nhập với FLAT COLUMNS đúng Google Sheets format
 * Fix issue: phải flatten document status thành columns riêng biệt
 */

const API_BASE_URL = 'http://localhost:5050';

// Sample data  
const SUPPLIERS = ['Công ty ABC', 'Nhà máy XYZ', 'Xưởng DEF', 'Factory GHI', 'Supplier JKL'];
const ORIGINS = ['Trung Quốc', 'Việt Nam', 'Thái Lan', 'Malaysia', 'Indonesia'];  
const DESTINATIONS = [
  'Kho trung tâm - I62-5, Đường CN1, P.Phước Bình, Q.9, TP.HCM',
  'Kho Hà Nội - 18 Xốm Nùi Tiến Hưng, Cầu Giấy, Hà Nội', 
  'Kho Đà Nẵng - 123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
  'Kho Cần Thơ - 456 Đường 3/2, Ninh Kiều, Cần Thơ'
];
const PRODUCTS = ['Larita ROTA MG0324', 'Samsung Galaxy Tab', 'Apple iPad Pro', 'Nike Air Max', 'Adidas Ultra Boost'];
const CATEGORIES = ['Vali', 'Balo', 'Quà tặng', 'Phụ kiện', 'Phụ kiện sửa chữa', 'Nguyên vật liệu', 'Thùng giấy', 'Văn phòng phẩm'];
const CARRIERS = ['DHL', 'FedEx', 'UPS', 'TNT Express', 'Giao Hàng Nhanh'];
const STATUSES = ['pending', 'confirmed', 'in-transit', 'arrived', 'completed'];
const PURPOSES = ['online', 'offline'];
const PACKAGING_TYPES = ['1PCS/SET', '2PCS/SET', '3PCS/SET', '4PCS/SET', '5PCS/SET'];

// Helper functions
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: Random date in dd/MM/yyyy format
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

// Helper: Create flattened packaging fields
const createPackagingFields = () => {
  const numPackages = randomBetween(2, 4);
  const types = [];
  const quantities = [];
  const descriptions = [];
  
  for (let i = 0; i < numPackages; i++) {
    types.push(randomItem(PACKAGING_TYPES));
    quantities.push(randomBetween(200, 1500).toString());
    descriptions.push(`Package ${i + 1} desc`);
  }
  
  return {
    packagingTypes: types.join(';'),
    packagingQuantities: quantities.join(';'), 
    packagingDescriptions: descriptions.join(';')
  };
};

// Helper: Create flattened timeline fields  
const createTimelineFields = () => {
  const fields = {};
  
  // Timeline types với prefix chính xác
  const timelineTypes = [
    'cargoReady', 'etd', 'eta', 'depart', 'arrivalPort', 'receive'
  ];
  
  fields['timeline_created_description'] = `Created desc - ${Math.random().toString(36).substr(2, 5)}`;
  
  timelineTypes.forEach(prefix => {
    const estimated = randomDate(30);
    const actual = Math.random() > 0.6 ? randomDate(35) : ''; // 40% có actual
    const status = actual ? (Math.random() > 0.5 ? 'completed' : randomItem(['pending', 'in-progress'])) : 'pending';
    
    fields[`timeline_${prefix}_est`] = estimated;
    fields[`timeline_${prefix}_act`] = actual;
    fields[`timeline_${prefix}_status`] = status;
    fields[`timeline_${prefix}_description`] = `Timeline ${prefix} desc - ${Math.random().toString(36).substr(2, 5)}`;
  });
  
  return fields;
};

// Helper: Create flattened document status fields
const createDocumentStatusFields = () => {
  const fields = {};
  
  // Document types với prefix chính xác
  const docTypes = [
    { name: 'Check bill', prefix: 'checkBill' },
    { name: 'Check CO', prefix: 'checkCO' }, 
    { name: 'Send docs', prefix: 'sendDocs' },
    { name: 'Customs', prefix: 'customs' },
    { name: 'Tax', prefix: 'tax' }
  ];
  
  docTypes.forEach(({ prefix }) => {
    const estimated = randomDate(25);
    const actual = Math.random() > 0.7 ? randomDate(30) : ''; // 30% có actual
    const status = actual ? (Math.random() > 0.4 ? 'completed' : randomItem(['pending', 'in-progress'])) : 'pending';
    
    fields[`doc_${prefix}_est`] = estimated;
    fields[`doc_${prefix}_act`] = actual;
    fields[`doc_${prefix}_status`] = status;
    fields[`doc_${prefix}_description`] = `Doc ${prefix} desc - ${Math.random().toString(36).substr(2, 5)}`;
  });
  
  return fields;
};

// Generate test inbound item với FLAT STRUCTURE
const generateInboundItem = (index) => {
  const isInternational = Math.random() > 0.3; // 70% international
  const packaging = createPackagingFields();
  const quantities = packaging.packagingQuantities.split(';').map(q => parseInt(q));
  const totalQuantity = quantities.reduce((sum, q) => sum + q, 0);

  const baseItem = {
    id: `TEST_FLAT_${Date.now()}_${index}`,
    date: randomDate(0),
    supplier: randomItem(SUPPLIERS),
    origin: isInternational ? randomItem(ORIGINS.filter(o => o !== 'Việt Nam')) : '',
    destination: randomItem(DESTINATIONS),
    product: randomItem(PRODUCTS),
    category: randomItem(CATEGORIES),
    quantity: totalQuantity,
    status: randomItem(STATUSES),
    carrier: randomItem(CARRIERS),
    pi: isInternational ? `PI${randomBetween(1000, 9999)}` : '',
    container: randomBetween(1, 8),
    purpose: randomItem(PURPOSES),
    receiveTime: `${randomBetween(8, 17).toString().padStart(2, '0')}:${randomBetween(0, 59).toString().padStart(2, '0')}:00`,
    poNumbers: isInternational ? `PO${randomBetween(1000, 9999)};PO${randomBetween(1000, 9999)}` : '',
    notes: `Test note ${index}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Flatten packaging
    ...packaging,
    // Flatten timeline
    ...createTimelineFields(),
    // Flatten document status (chỉ cho international)
    ...(isInternational ? createDocumentStatusFields() : {})
  };

  return baseItem;
};

// Main function
async function createTestData() {
  console.log('🚀 Tạo test data với FLAT STRUCTURE...');
  
  try {
    const items = [];
    for (let i = 1; i <= 15; i++) {
      const item = generateInboundItem(i);
      items.push(item);
      console.log(`✅ Generated item ${i}: ${item.product} (${item.origin ? 'international' : 'domestic'})`);
    }

    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
      try {
        const isInternational = item.origin && item.origin.trim();
        const endpoint = isInternational ? '/api/inboundinternational' : '/api/inbounddomestic';
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          successCount++;
          console.log(`✅ Added ${item.id} (${isInternational ? 'international' : 'domestic'})`);
        } else {
          errorCount++;
          const errorText = await response.text();
          console.log(`❌ Failed ${item.id}: ${response.status} - ${errorText.substring(0, 100)}`);
        }
      } catch (error) {
        errorCount++;
        console.log(`❌ Error ${item.id}:`, error.message);
      }
    }

    console.log('\n📊 Kết quả:');
    console.log(`✅ Thành công: ${successCount} items`);
    console.log(`❌ Lỗi: ${errorCount} items`);
    
    const intCount = items.filter(i => i.origin && i.origin.trim()).length;
    const domCount = items.filter(i => !i.origin || !i.origin.trim()).length;
    console.log(`🌍 Quốc tế: ${intCount} items (có đầy đủ document status)`);
    console.log(`🏠 Quốc nội: ${domCount} items`);

  } catch (error) {
    console.error('🚨 Error:', error);
  }
}

// Execute
if (require.main === module) {
  createTestData().then(() => {
    console.log('🎉 Hoàn thành! Reload trang để xem 5 document types');
    process.exit(0);
  }).catch(error => {
    console.error('🚨 Script failed:', error);
    process.exit(1);
  });
}

module.exports = { createTestData };
