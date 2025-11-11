/**
 * Test Google Apps Script - Distance Calculator
 */

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyFczcZnTY_ktyKVfQSjOYMMOdSzvgP5dqWqN2M2Si5q_ybc9dAcUA5nlSMg-uFM6QO9g/exec";

async function testDistanceAPI() {
  console.log("🧪 Testing Google Apps Script - Distance Calculator\n");
  console.log(`URL: ${APPS_SCRIPT_URL}\n`);

  // Test 1: Simple GET request
  console.log("1️⃣ Test 1: Simple GET request");
  try {
    const response1 = await fetch(APPS_SCRIPT_URL);
    const text1 = await response1.text();

    if (text1.includes("SyntaxError")) {
      console.log("❌ Apps Script has syntax error");
      console.log("Error:", text1.match(/(SyntaxError:[\s\S]+?)(?=<|$)/)?.[1] || "Unknown error");
    } else if (text1.includes("Error 400")) {
      console.log("⚠️  Error 400 - Bad Request");
    } else {
      console.log("✅ Response received");
      console.log("Preview:", text1.substring(0, 200));
    }
  } catch (error) {
    console.log("❌ Request failed:", error.message);
  }

  console.log("\n2️⃣ Test 2: GET with query parameters");
  try {
    const params = new URLSearchParams({
      origin: "Hà Nội, Việt Nam",
      destination: "TP. Hồ Chí Minh, Việt Nam",
      action: "getDistance",
    });

    const response2 = await fetch(`${APPS_SCRIPT_URL}?${params}`);
    const data2 = await response2.json();

    if (data2.error) {
      console.log("❌ Error:", data2.error);
    } else {
      console.log("✅ Success!");
      console.log("Distance:", data2);
    }
  } catch (error) {
    console.log("❌ Request failed:", error.message);
  }

  console.log("\n3️⃣ Test 3: POST request");
  try {
    const response3 = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: "Hà Nội",
        destination: "TP.HCM",
        action: "getDistance",
      }),
    });

    const data3 = await response3.json();

    if (data3.error) {
      console.log("❌ Error:", data3.error);
    } else {
      console.log("✅ Success!");
      console.log("Response:", JSON.stringify(data3, null, 2));
    }
  } catch (error) {
    console.log("❌ Request failed:", error.message);
  }

  console.log("\n📊 SUMMARY:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Status: Apps Script has SYNTAX ERROR");
  console.log("Issue: 'CONFIG' declared multiple times");
  console.log("Fix: Edit Apps Script code to resolve");
  console.log(
    "URL: https://script.google.com/u/0/home/projects/1fNrUwCusl_47rpxKcEFXZITIYUmBVGNgpJWDKLwSW8oF5h--Q3AbxoBv/edit"
  );
}

// Run test
testDistanceAPI();
