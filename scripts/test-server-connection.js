/**
 * Test connection với server.js và Google Sheets
 */

async function testConnection() {
  const serverUrl = "http://localhost:5050";

  console.log("🔍 Testing connection to server...\n");
  console.log(`Server URL: ${serverUrl}\n`);

  // Test 1: Health check
  try {
    console.log("1️⃣ Testing /api/health...");
    const healthResponse = await fetch(`${serverUrl}/api/health`);
    const healthData = await healthResponse.json();

    if (healthResponse.ok) {
      console.log("✅ Health check passed!");
      console.log("   Status:", healthData.status);
      console.log("   Version:", healthData.version);
      console.log("   Services:", JSON.stringify(healthData.services, null, 2));
    } else {
      console.log("❌ Health check failed:", healthData);
    }
  } catch (error) {
    console.log("❌ Cannot connect to server:", error.message);
    console.log("\n💡 Gợi ý:");
    console.log("   1. Start server: node src/server.js");
    console.log("   2. Or: cd src && node server.js");
    console.log("   3. Check port 5050 is not in use");
    process.exit(1);
  }

  // Test 2: Google Sheets info
  try {
    console.log("\n2️⃣ Testing /api/sheets/info...");
    const infoResponse = await fetch(`${serverUrl}/api/sheets/info`);
    const infoData = await infoResponse.json();

    if (infoResponse.ok) {
      console.log("✅ Google Sheets info retrieved!");
      console.log("\n📊 Spreadsheet Info:");
      console.log("   Title:", infoData.spreadsheet.title);
      console.log("   Spreadsheet ID:", infoData.spreadsheet.spreadsheetId);
      console.log("   Time Zone:", infoData.spreadsheet.timeZone);

      console.log("\n📑 Sheets (Tabs):");
      console.log("━".repeat(80));

      infoData.spreadsheet.sheets.forEach((sheet, index) => {
        console.log(`\n${index + 1}. 📄 ${sheet.title}`);
        console.log(`   - Sheet ID: ${sheet.sheetId}`);
        console.log(`   - Rows: ${sheet.rowCount.toLocaleString()}`);
        console.log(`   - Columns: ${sheet.columnCount}`);
        console.log(`   - Hidden: ${sheet.hidden ? "Yes" : "No"}`);
      });

      console.log("\n━".repeat(80));
      console.log(`\n📊 Tổng cộng: ${infoData.spreadsheet.sheets.length} sheet(s)`);
    } else {
      console.log("❌ Failed to get sheets info:", infoData);
    }
  } catch (error) {
    console.log("❌ Error getting sheets info:", error.message);
  }

  console.log("\n✅ Test completed!");
}

// Run test
testConnection();
