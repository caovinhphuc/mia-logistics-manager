#!/usr/bin/env node

/**
 * Script kiểm tra Google API và khởi tạo kết nối
 */

console.log('🔍 Kiểm tra Google API...');

// Kiểm tra Google API có được load không
function checkGoogleAPI() {
  console.log('📋 Kiểm tra Google API:');

  if (typeof window !== 'undefined') {
    console.log('✅ Window object có sẵn');

    if (window.gapi) {
      console.log('✅ window.gapi có sẵn');

      if (window.gapi.client) {
        console.log('✅ window.gapi.client có sẵn');

        if (window.gapi.client.sheets) {
          console.log('✅ window.gapi.client.sheets có sẵn');
          return true;
        } else {
          console.log('❌ window.gapi.client.sheets không có sẵn');
          return false;
        }
      } else {
        console.log('❌ window.gapi.client không có sẵn');
        return false;
      }
    } else {
      console.log('❌ window.gapi không có sẵn');
      return false;
    }
  } else {
    console.log('❌ Window object không có sẵn (Node.js environment)');
    return false;
  }
}

// Kiểm tra Google API
const isGoogleAPIAvailable = checkGoogleAPI();

if (isGoogleAPIAvailable) {
  console.log('✅ Google API đã sẵn sàng');
} else {
  console.log('❌ Google API chưa sẵn sàng');
  console.log('💡 Cần khởi tạo Google API trước khi sử dụng');
}

console.log('\n📋 Hướng dẫn khởi tạo Google API:');
console.log('1. Đảm bảo Google API script được load trong HTML');
console.log('2. Khởi tạo Google API client');
console.log('3. Authenticate với Google');
console.log('4. Sau đó mới sử dụng Google Sheets API');

console.log('\n🔧 Cách khởi tạo Google API:');
console.log(`
// 1. Load Google API script
<script src="https://apis.google.com/js/api.js"></script>

// 2. Khởi tạo Google API
gapi.load('client', async () => {
  await gapi.client.init({
    apiKey: 'YOUR_API_KEY',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
  });

  // 3. Authenticate
  await gapi.auth2.getAuthInstance().signIn();

  // 4. Bây giờ có thể sử dụng Google Sheets API
});
`);

console.log('\n✅ Script hoàn thành');
