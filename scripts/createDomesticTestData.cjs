#!/usr/bin/env node

/**
 * Script tạo test data cho DOMESTIC với packaging columns đúng
 * Đảm bảo column alignment trong Google Sheets
 */

const API_BASE_URL = 'http://localhost:5050';

// Sample data for domestic (Vietnam sources)
const SUPPLIERS = ['Công ty ABC Việt Nam', 'Nhà máy XYZ Đồng Nai', 'Xưởng DEF Bình Dương', 'Factory GHI Hà Nội', 'Supplier JKL TP.HCM'];
const DESTINATIONS = [
  'Kho trung tâm - I62-5, Đường CN1, P.Phước Bình, Q.9, TP.HCM',
  'Kho Hà Nội - 18 Xốm Nùi Tiến Hưng, Cầu Giấy, Hà Nội', 
  'Kho Đà Nẵng - 123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
  'Kho Cần Thơ - 456 Đường 3/2, Ninh Kiều, Cần Thơ'
];
const PRODUCTS = ['Balo xuất khẩu', 'Vali domestic', 'Túi xách nội địa', 'Giày dép Việt Nam', 'Quà lưu niệm'];
const CATEGORIES = ['Vali', 'Balo', 'Quà tặng', 'Phụ kiện', 'Nguyên vật liệu', 'Thùng giấy', 'Văn phòng phẩm'];
const STATUSES = ['pending', 'confirmed', 'in-transit', 'arrived', 'completed'];
const PURPOSES = ['online', 'offline'];
const PACKAGING_TYPES = ['1PCS/SET', '2PCS/SET', '3PCS/SET', '4PCS/SET', '5PCS/SET'];

// Helper functions
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: Random date in dd/MM/yyyy format
const randomDate = (daysFromNow) => {
  const now = new Date();
  const randomDays = randomBetween(-15, daysFromNow);
  const date = new Date(now);
  date.setDate(date.getDate() + randomDays);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Helper: Create packaging array (domestic có packaging)
const createPackagingFlat = () => {
  const numPackages = randomBetween(1, 3); // Domestic ít packaging hơn
  const types = [];
  const quantities = [];
  const descriptions = [];
  
  for (let i = 0; i < numPackages; i++) {
    types.push(randomItem(PACKAGING_TYPES));
    quantities.push(randomBetween(100, 800).toString());
    descriptions.push(`Domestic package ${i + 1}`);
  }
  
  return {
    packagingTypes: types.join(';'),
    packagingQuantities: quantities.join(';'), 
    packagingDescriptions: descriptions.join(';')
  };
};

// Generate domestic item với CORRECT FLAT STRUCTURE
const generateDomesticItem = (index) => {
  const packaging = createPackagingFlat();
  const quantities = packaging.packagingQuantities.split(';').map(q => parseInt(q));
  const totalQuantity = quantities.reduce((sum, q) => sum + q, 0);

  // DOMESTIC ITEM - match INBOUND_DOMESTIC_HEADERS exactly
  const item = {
    // Core fields (match header order exactly)
    id: `DOM_TEST_${Date.now()}_${index}`,
    date: randomDate(0),
    supplier: randomItem(SUPPLIERS),
    origin: '', // Domestic = empty origin
    destination: randomItem(DESTINATIONS),
    product: randomItem(PRODUCTS),
    quantity: totalQuantity,
    status: randomItem(STATUSES),
    category: randomItem(CATEGORIES),
    carrier: '', // Domestic thường không cần carrier
    purpose: randomItem(PURPOSES),
    receiveTime: `${randomBetween(8, 17).toString().padStart(2, '0')}:${randomBetween(0, 59).toString().padStart(2, '0')}:00`,
    estimatedArrival: randomDate(10),
    actualArrival: Math.random() > 0.7 ? randomDate(15) : '', // 30% có actual
    notes: `Domestic note ${index} - test data`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Packaging fields (appended at end)
    ...packaging
  };

  return item;
};

// Main function
async function createDomesticTestData() {
  console.log('🏠 Tạo test data DOMESTIC với packaging...');
  
  try {
    const items = [];
    for (let i = 1; i <= 15; i++) {
      const item = generateDomesticItem(i);
      items.push(item);
      console.log(`✅ Generated domestic item ${i}: ${item.product} - ${item.category}`);
    }

    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/inbounddomestic`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item),
        });

        if (response.ok) {
          const result = await response.json();
          successCount++;
          console.log(`✅ Added ${result.id}: ${result.category} - ${result.packagingTypes || 'No packaging'}`);
        } else {
          errorCount++;
          const errorText = await response.text();
          console.log(`❌ Failed ${item.id}: ${response.status} - ${errorText.substring(0, 100)}`);
        }
      } catch (error) {
        errorCount++;
        console.log(`❌ Error ${item.id}:`, error.message);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n📊 Kết quả DOMESTIC:');
    console.log(`✅ Thành công: ${successCount} items`);
    console.log(`❌ Lỗi: ${errorCount} items`);
    console.log(`🏠 Tổng Quốc nội: ${items.length} items (có packaging)`);

    // Show packaging summary
    const packagingTypes = items.flatMap(item => 
      item.packagingTypes ? item.packagingTypes.split(';') : []
    );
    const uniqueTypes = [...new Set(packagingTypes)];
    console.log(`📦 Packaging types: ${uniqueTypes.join(', ')}`);

  } catch (error) {
    console.error('🚨 Error:', error);
  }
}

// Execute
if (require.main === module) {
  createDomesticTestData().then(() => {
    console.log('🎉 Hoàn thành DOMESTIC test data!');
    console.log('🔄 Reload trang để xem Card 1 packaging breakdown từ domestic items');
    process.exit(0);
  }).catch(error => {
    console.error('🚨 Script failed:', error);
    process.exit(1);
  });
}

module.exports = { createDomesticTestData };
