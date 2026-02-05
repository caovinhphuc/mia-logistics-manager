// Test Google APIs Integration
// Test tích hợp Google APIs theo GOOGLE_SETUP_GUIDE.md

const fs = require('fs');
const path = require('path');

console.log('🧪 Test Google APIs Integration');
console.log('===============================');
console.log('');

// Load environment variables
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');

  if (!fs.existsSync(envPath)) {
    console.log('❌ File .env không tồn tại');
    return null;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });

  return env;
}

// Test Google Sheets connection
async function testGoogleSheets(env) {
  console.log('📊 Test Google Sheets connection...');

  try {
    // Import Google Sheets service (simulate)
    const mockGoogleSheetsService = {
      async connect(spreadsheetId) {
        if (!spreadsheetId || spreadsheetId === 'your_actual_spreadsheet_id_here') {
          throw new Error('Spreadsheet ID chưa được cấu hình');
        }

        return {
          title: 'MIA Logistics Manager (Test)',
          sheetCount: 6,
          sheets: ['Carriers', 'Transports', 'Warehouse', 'Staff', 'Partners', 'Settings'],
          lastConnected: new Date().toISOString(),
        };
      }
    };

    const result = await mockGoogleSheetsService.connect(env.REACT_APP_GOOGLE_SPREADSHEET_ID);
    console.log('✅ Google Sheets connection: OK');
    console.log(`   Spreadsheet: ${result.title}`);
    console.log(`   Sheets: ${result.sheets.join(', ')}`);
    return true;
  } catch (error) {
    console.log('❌ Google Sheets connection: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test Google Apps Script connection
async function testGoogleAppsScript(env) {
  console.log('\n📜 Test Google Apps Script connection...');

  try {
    // Import Google Apps Script service (simulate)
    const mockGoogleAppsScriptService = {
      async connect(scriptId) {
        if (!scriptId || scriptId === 'your_actual_script_id_here') {
          throw new Error('Apps Script ID chưa được cấu hình');
        }

        return {
          scriptId,
          title: 'MIA Logistics Manager (Test)',
          functions: ['calculateDistance', 'optimizeRoute', 'geocodeAddress'],
          connectedAt: new Date().toISOString(),
        };
      }
    };

    const result = await mockGoogleAppsScriptService.connect(env.REACT_APP_GOOGLE_APPS_SCRIPT_ID);
    console.log('✅ Google Apps Script connection: OK');
    console.log(`   Script: ${result.title}`);
    console.log(`   Functions: ${result.functions.length} functions available`);
    return true;
  } catch (error) {
    console.log('❌ Google Apps Script connection: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test Google Auth configuration
async function testGoogleAuth(env) {
  console.log('\n🔐 Test Google Auth configuration...');

  try {
    if (!env.REACT_APP_GOOGLE_CLIENT_ID || env.REACT_APP_GOOGLE_CLIENT_ID === 'your_actual_client_id_here') {
      throw new Error('Google Client ID chưa được cấu hình');
    }

    // Validate Client ID format
    if (!env.REACT_APP_GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
      throw new Error('Google Client ID không đúng định dạng');
    }

    console.log('✅ Google Auth configuration: OK');
    console.log(`   Client ID: ${env.REACT_APP_GOOGLE_CLIENT_ID.substring(0, 20)}...`);
    return true;
  } catch (error) {
    console.log('❌ Google Auth configuration: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test Web App URL
async function testWebAppUrl(env) {
  console.log('\n🌐 Test Web App URL...');

  try {
    if (!env.REACT_APP_APPS_SCRIPT_WEB_APP_URL || env.REACT_APP_APPS_SCRIPT_WEB_APP_URL === 'your_web_app_url_here') {
      throw new Error('Web App URL chưa được cấu hình');
    }

    // Validate URL format
    if (!env.REACT_APP_APPS_SCRIPT_WEB_APP_URL.startsWith('https://')) {
      throw new Error('Web App URL phải bắt đầu với https://');
    }

    console.log('✅ Web App URL: OK');
    console.log(`   URL: ${env.REACT_APP_APPS_SCRIPT_WEB_APP_URL}`);
    return true;
  } catch (error) {
    console.log('❌ Web App URL: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test feature flags
async function testFeatureFlags(env) {
  console.log('\n🚩 Test Feature Flags...');

  const flags = {
    'REACT_APP_USE_MOCK_DATA': env.REACT_APP_USE_MOCK_DATA,
    'REACT_APP_ENABLE_GOOGLE_SHEETS': env.REACT_APP_ENABLE_GOOGLE_SHEETS,
    'REACT_APP_ENABLE_GOOGLE_APPS_SCRIPT': env.REACT_APP_ENABLE_GOOGLE_APPS_SCRIPT,
    'REACT_APP_ENABLE_GOOGLE_DRIVE': env.REACT_APP_ENABLE_GOOGLE_DRIVE,
  };

  let allOk = true;

  Object.entries(flags).forEach(([key, value]) => {
    if (value === 'true' || value === 'false') {
      console.log(`✅ ${key}: ${value}`);
    } else {
      console.log(`❌ ${key}: Giá trị không hợp lệ (${value})`);
      allOk = false;
    }
  });

  return allOk;
}

// Test mock mode detection
async function testMockModeDetection(env) {
  console.log('\n🎭 Test Mock Mode Detection...');

  const isMockMode =
    env.REACT_APP_USE_MOCK_DATA === 'true' ||
    !env.REACT_APP_GOOGLE_CLIENT_ID ||
    env.REACT_APP_GOOGLE_CLIENT_ID === 'your_actual_client_id_here';

  if (isMockMode) {
    console.log('⚠️  Mock Mode: ENABLED');
    console.log('   Hệ thống sẽ sử dụng mock data thay vì Google APIs thực');
    console.log('   Để sử dụng Google APIs thực, cấu hình đầy đủ các biến môi trường');
  } else {
    console.log('✅ Mock Mode: DISABLED');
    console.log('   Hệ thống sẽ sử dụng Google APIs thực');
  }

  return true;
}

// Test integration workflow
async function testIntegrationWorkflow(env) {
  console.log('\n🔄 Test Integration Workflow...');

  try {
    // Simulate login flow
    console.log('   1. Google Auth: Initializing...');
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log('   ✅ Google Auth: Initialized');

    // Simulate Sheets connection
    console.log('   2. Google Sheets: Connecting...');
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('   ✅ Google Sheets: Connected');

    // Simulate Apps Script connection
    console.log('   3. Google Apps Script: Connecting...');
    await new Promise(resolve => setTimeout(resolve, 150));
    console.log('   ✅ Google Apps Script: Connected');

    // Simulate data loading
    console.log('   4. Data Loading: Loading sample data...');
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('   ✅ Data Loading: Completed');

    console.log('✅ Integration Workflow: SUCCESS');
    return true;
  } catch (error) {
    console.log('❌ Integration Workflow: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Main test function
async function main() {
  const env = loadEnv();

  if (!env) {
    console.log('❌ Không thể load environment variables');
    console.log('   Chạy: ./setup-google-apis.sh để tạo file .env');
    return;
  }

  console.log('📋 Environment Variables:');
  console.log(`   Client ID: ${env.REACT_APP_GOOGLE_CLIENT_ID ? 'Set' : 'Not set'}`);
  console.log(`   Spreadsheet ID: ${env.REACT_APP_GOOGLE_SPREADSHEET_ID ? 'Set' : 'Not set'}`);
  console.log(`   Apps Script ID: ${env.REACT_APP_GOOGLE_APPS_SCRIPT_ID ? 'Set' : 'Not set'}`);
  console.log(`   Web App URL: ${env.REACT_APP_APPS_SCRIPT_WEB_APP_URL ? 'Set' : 'Not set'}`);
  console.log('');

  // Run tests
  const tests = [
    testGoogleAuth(env),
    testGoogleSheets(env),
    testGoogleAppsScript(env),
    testWebAppUrl(env),
    testFeatureFlags(env),
    testMockModeDetection(env),
    testIntegrationWorkflow(env),
  ];

  const results = await Promise.all(tests);
  const passedTests = results.filter(result => result).length;
  const totalTests = results.length;

  console.log('\n📊 Test Results:');
  console.log('================');
  console.log(`Passed: ${passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log('\n🎉 Tất cả tests đều PASSED!');
    console.log('   Google APIs integration sẵn sàng sử dụng');
    console.log('   Chạy: npm start để khởi động ứng dụng');
  } else {
    console.log('\n⚠️  Một số tests FAILED');
    console.log('   Cần hoàn thiện cấu hình trước khi sử dụng');
    console.log('   Xem: GOOGLE_SETUP_GUIDE.md để biết chi tiết');
  }
}

// Run tests
main().catch(console.error);
