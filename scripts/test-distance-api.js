/**
 * Test Distance Calculator API
 */

const NEW_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbysU9ncMhDg_1CATGPIdewwLqUq2AM6I1RUlsl6nMR9nHDYL_BFFbKMtlIxdg_LU5VJRQ/exec";

async function testDistanceAPI() {
  console.log("🧪 Testing Distance Calculator API\n");
  console.log(`URL: ${NEW_APPS_SCRIPT_URL}\n`);

  // Test 1: No parameters
  console.log("1️⃣ Test: No parameters");
  try {
    const response = await fetch(NEW_APPS_SCRIPT_URL);
    const data = await response.json();
    console.log("✅ Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  // Test 2: With parameters as GET
  console.log("\n2️⃣ Test: GET with origin & destination");
  try {
    const url = new URL(NEW_APPS_SCRIPT_URL);
    url.searchParams.set("origin", "Hà Nội, Việt Nam");
    url.searchParams.set("destination", "TP. Hồ Chí Minh, Việt Nam");

    console.log("Request URL:", url.toString());

    const response = await fetch(url.toString());
    const data = await response.json();
    console.log("✅ Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  // Test 3: POST request
  console.log("\n3️⃣ Test: POST with JSON body");
  try {
    const response = await fetch(NEW_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: "Hà Nội",
        destination: "TP.HCM",
      }),
    });

    const data = await response.json();
    console.log("✅ Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  // Test 4: POST with FormData
  console.log("\n4️⃣ Test: POST with FormData");
  try {
    const formData = new URLSearchParams();
    formData.append("origin", "Hà Nội, Việt Nam");
    formData.append("destination", "Đà Nẵng, Việt Nam");

    const response = await fetch(NEW_APPS_SCRIPT_URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("✅ Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  console.log("\n📊 SUMMARY:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

// Run test
testDistanceAPI();
