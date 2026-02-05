// Script test cuối cùng toàn bộ hệ thống
const fs = require('fs');
const path = require('path');

console.log('🎯 TEST CUỐI CÙNG TOÀN BỘ HỆ THỐNG');
console.log('=' .repeat(50));

// Kiểm tra file .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ File .env đã tồn tại');
} else {
  console.log('❌ File .env chưa tồn tại');
}

console.log('');

// Kiểm tra credentials
const credentialsPath = path.join(__dirname, 'credentials.json');
if (fs.existsSync(credentialsPath)) {
  console.log('✅ File credentials.json đã tồn tại');
} else {
  console.log('❌ File credentials.json chưa tồn tại');
}

console.log('');

// Kiểm tra services
const servicesPath = path.join(__dirname, '..', 'src', 'services', 'map');
const services = [
  'locationsService.js',
  'apiLocationsService.js',
  'mockLocationsService.js',
  'proxyLocationsService.js'
];

services.forEach(service => {
  const servicePath = path.join(servicesPath, service);
  if (fs.existsSync(servicePath)) {
    console.log(`✅ ${service} đã tồn tại`);
  } else {
    console.log(`❌ ${service} chưa tồn tại`);
  }
});

console.log('');

// Kiểm tra components
const componentsPath = path.join(__dirname, '..', 'src', 'components', 'map');
const components = [
  'InteractiveMap.jsx',
  'LocationManager.jsx'
];

components.forEach(component => {
  const componentPath = path.join(componentsPath, component);
  if (fs.existsSync(componentPath)) {
    console.log(`✅ ${component} đã tồn tại`);
  } else {
    console.log(`❌ ${component} chưa tồn tại`);
  }
});

console.log('');

// Kiểm tra pages
const pagesPath = path.join(__dirname, '..', 'src', 'pages');
const pages = [
  'Maps.jsx'
];

pages.forEach(page => {
  const pagePath = path.join(pagesPath, page);
  if (fs.existsSync(pagePath)) {
    console.log(`✅ ${page} đã tồn tại`);
  } else {
    console.log(`❌ ${page} chưa tồn tại`);
  }
});

console.log('');

// Kiểm tra package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('📦 DEPENDENCIES:');

  const requiredDeps = [
    'react',
    'react-dom',
    'react-router-dom',
    '@mui/material',
    'leaflet',
    'react-leaflet'
  ];

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`   ❌ ${dep}: CHƯA CÀI ĐẶT`);
    }
  });
}

console.log('');

// Kiểm tra Google Sheets service
console.log('🔍 KIỂM TRA GOOGLE SHEETS SERVICE:');
const locationsServicePath = path.join(__dirname, '..', 'src', 'services', 'map', 'proxyLocationsService.js');
if (fs.existsSync(locationsServicePath)) {
  const serviceContent = fs.readFileSync(locationsServicePath, 'utf8');

  // Kiểm tra các method quan trọng
  const methods = [
    'getLocations',
    'initialize',
    'addLocation',
    'updateLocation',
    'deleteLocation',
    'getLocationStats'
  ];

  methods.forEach(method => {
    if (serviceContent.includes(method)) {
      console.log(`   ✅ Method ${method} đã có`);
    } else {
      console.log(`   ❌ Method ${method} chưa có`);
    }
  });
}

console.log('');

// Kiểm tra InteractiveMap component
console.log('🗺️ KIỂM TRA INTERACTIVE MAP:');
const interactiveMapPath = path.join(__dirname, '..', 'src', 'components', 'map', 'InteractiveMap.jsx');
if (fs.existsSync(interactiveMapPath)) {
  const mapContent = fs.readFileSync(interactiveMapPath, 'utf8');

  // Kiểm tra các import quan trọng
  const imports = [
    'react-leaflet',
    'leaflet',
    'proxyLocationsService'
  ];

  imports.forEach(imp => {
    if (mapContent.includes(imp)) {
      console.log(`   ✅ Import ${imp} đã có`);
    } else {
      console.log(`   ❌ Import ${imp} chưa có`);
    }
  });
}

console.log('');

// Kiểm tra LocationManager component
console.log('📄 KIỂM TRA LOCATION MANAGER:');
const locationManagerPath = path.join(__dirname, '..', 'src', 'components', 'map', 'LocationManager.jsx');
if (fs.existsSync(locationManagerPath)) {
  const managerContent = fs.readFileSync(locationManagerPath, 'utf8');

  // Kiểm tra các import quan trọng
  const managerImports = [
    'proxyLocationsService'
  ];

  managerImports.forEach(imp => {
    if (managerContent.includes(imp)) {
      console.log(`   ✅ Import ${imp} đã có`);
    } else {
      console.log(`   ❌ Import ${imp} chưa có`);
    }
  });
}

console.log('');

// Kiểm tra Maps page
console.log('📄 KIỂM TRA MAPS PAGE:');
const mapsPagePath = path.join(__dirname, '..', 'src', 'pages', 'Maps.jsx');
if (fs.existsSync(mapsPagePath)) {
  const mapsContent = fs.readFileSync(mapsPagePath, 'utf8');

  // Kiểm tra các import quan trọng
  const mapsImports = [
    'InteractiveMap',
    'LocationManager'
  ];

  mapsImports.forEach(imp => {
    if (mapsContent.includes(imp)) {
      console.log(`   ✅ Import ${imp} đã có`);
    } else {
      console.log(`   ❌ Import ${imp} chưa có`);
    }
  });
}

console.log('');

console.log('🚀 HƯỚNG DẪN TEST FRONTEND:');
console.log('   1. Mở browser: http://localhost:3000');
console.log('   2. Mở Developer Tools (F12)');
console.log('   3. Xem tab Console để tìm lỗi');
console.log('   4. Xem tab Network để kiểm tra API calls');
console.log('   5. Truy cập trang Maps');
console.log('   6. Kiểm tra tab "Quản lý địa điểm"');
console.log('   7. Kiểm tra tab "Bản đồ tương tác"');
console.log('');

console.log('⚠️  CÁC LỖI THƯỜNG GẶP:');
console.log('   1. CORS error: Cần cấu hình Google OAuth');
console.log('   2. 403 Forbidden: Cần share Google Sheet');
console.log('   3. 404 Not Found: Kiểm tra Spreadsheet ID');
console.log('   4. Import error: Kiểm tra đường dẫn file');
console.log('   5. Component error: Kiểm tra syntax JSX');
console.log('');

console.log('📞 SUPPORT:');
console.log('   - Console browser: F12 > Console');
console.log('   - Network tab: F12 > Network');
console.log('   - React DevTools: Cài đặt extension');
console.log('   - Google Sheets API: https://developers.google.com/sheets/api');
console.log('');

console.log('🎯 KẾT QUẢ MONG ĐỢI:');
console.log('   - Bản đồ hiển thị markers với tọa độ thực');
console.log('   - Danh sách địa điểm với thông tin đầy đủ');
console.log('   - Có thể thêm/sửa/xóa địa điểm');
console.log('   - Tương tác với markers trên bản đồ');
console.log('');

console.log('=' .repeat(50));
console.log('✅ Test cuối cùng hoàn thành!');
console.log('🎯 Bây giờ hãy kiểm tra Frontend trong browser!');
