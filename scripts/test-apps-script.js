/**
 * Test Google Apps Script - Distance Calculator
 */

const APPS_SCRIPT_URL =
  process.env.APPS_SCRIPT_DISTANCE_URL ||
  process.env.GOOGLE_APPS_SCRIPT_URL ||
  process.env.REACT_APP_APPS_SCRIPT_WEB_APP_URL ||
  'https://script.google.com/macros/s/AKfycbwnELl-07wk1FN-BvHEAm8tahEkwQSrqDDP5yBdziF3wo--Etr-PVK6PeiXIm1MzbWlwA/exec';

function extractSyntaxError(text) {
  const match = text.match(/(SyntaxError:[\s\S]+?)(?=<|$)/i);
  return match?.[1]?.trim() || null;
}

function safeJsonParse(text) {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, data: null };
  }
}

async function testDistanceAPI() {
  let hasSyntaxError = false;
  let hasHtmlResponse = false;
  let hasApiError = false;

  console.log('🧪 Testing Google Apps Script - Distance Calculator\n');
  console.log(`URL: ${APPS_SCRIPT_URL}\n`);

  // Test 1: Simple GET request
  console.log('1️⃣ Test 1: Simple GET request');
  try {
    const response1 = await fetch(APPS_SCRIPT_URL);
    const text1 = await response1.text();

    const syntaxError = extractSyntaxError(text1);
    if (syntaxError) {
      hasSyntaxError = true;
      console.log('❌ Apps Script has syntax error');
      console.log('Error:', syntaxError);
    } else if (text1.includes('<!DOCTYPE') || text1.includes('<html')) {
      hasHtmlResponse = true;
      console.log('❌ Response is HTML (not JSON)');
      console.log('Reason: Apps Script đang trả trang lỗi thay vì JSON');
    } else if (text1.includes('Error 400')) {
      console.log('⚠️  Error 400 - Bad Request');
    } else {
      console.log('✅ Response received');
      console.log('Preview:', text1.substring(0, 200));
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }

  console.log('\n2️⃣ Test 2: GET with query parameters');
  try {
    const params = new URLSearchParams({
      origin: 'Hà Nội, Việt Nam',
      destination: 'TP. Hồ Chí Minh, Việt Nam',
      action: 'getDistance',
    });

    const response2 = await fetch(`${APPS_SCRIPT_URL}?${params}`);
    const text2 = await response2.text();
    const parsed2 = safeJsonParse(text2);

    if (!parsed2.ok) {
      hasHtmlResponse = true;
      console.log('❌ Request failed: Response is not valid JSON');
      console.log('Preview:', text2.substring(0, 120));
      console.log('Reason: Nếu thấy <!DOCTYPE thì Apps Script đang lỗi runtime/syntax');
    } else {
      const data2 = parsed2.data;

      if (data2.error) {
        hasApiError = true;
        console.log('❌ Error:', data2.error);
      } else {
        console.log('✅ Success!');
        console.log('Distance:', data2);
      }
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }

  console.log('\n3️⃣ Test 3: POST request');
  try {
    const response3 = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: 'calculateDistance',
        origin: 'Hà Nội',
        destination: 'TP.HCM',
      }),
    });

    const text3 = await response3.text();
    const parsed3 = safeJsonParse(text3);

    if (!parsed3.ok) {
      hasHtmlResponse = true;
      console.log('❌ Request failed: Response is not valid JSON');
      console.log('Preview:', text3.substring(0, 120));
      console.log('Reason: Nếu thấy <!DOCTYPE thì Apps Script đang lỗi runtime/syntax');
    } else {
      const data3 = parsed3.data;

      if (data3.error) {
        hasApiError = true;
        console.log('❌ Error:', data3.error);
      } else {
        console.log('✅ Success!');
        console.log('Response:', JSON.stringify(data3, null, 2));
      }
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }

  console.log('\n📊 SUMMARY:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (hasSyntaxError) {
    console.log('Status: Apps Script has SYNTAX ERROR');
    console.log('Issue: Có lỗi cú pháp trong Apps Script (thường do khai báo trùng)');
    console.log('Fix: Mở Apps Script Editor để sửa lỗi rồi deploy lại');
  } else if (hasHtmlResponse) {
    console.log('Status: Apps Script is returning HTML error page');
    console.log('Issue: Runtime/deployment lỗi hoặc endpoint chưa public đúng');
    console.log('Fix: Kiểm tra Deploy > Web app access và log thực thi');
  } else if (hasApiError) {
    console.log('Status: Apps Script reachable but API returned error');
    console.log('Issue: Logic/parameters chưa đúng');
    console.log('Fix: Kiểm tra doGet/doPost và tên trường payload');
  } else {
    console.log('Status: ✅ Apps Script is working');
  }
  console.log(
    'URL: https://script.google.com/u/0/home/projects/1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv/edit'
  );
}

// Run test
testDistanceAPI();
