/**
 * Script kiểm tra Google Sheets tabs qua Google Apps Script
 */

require("dotenv").config();

const SPREADSHEET_ID = "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As";

async function checkSheetsViaAppsScript() {
  try {
    console.log("🔍 Đang kết nối Google Sheets qua Apps Script...\n");
    console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}\n`);

    // Fetch spreadsheet info
    const url = `https://script.google.com/macros/s/AKfycbyx3zYVQVhGxXKqJz3ZKFVlJhRtQj6UXy8Wm4WQ/exec?action=getSheets&spreadsheetId=${SPREADSHEET_ID}`;

    console.log("📡 Đang gọi API...");
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    console.log("✅ Kết nối thành công!\n");

    if (data.sheets && data.sheets.length > 0) {
      console.log("📑 Danh sách các Sheets (Tabs):");
      console.log("━".repeat(80));

      data.sheets.forEach((sheet, index) => {
        console.log(`\n${index + 1}. 📄 Sheet #${index + 1}`);
        console.log(`   - Name: ${sheet.title}`);
        console.log(`   - Sheet ID: ${sheet.sheetId}`);
        console.log(`   - Rows: ${sheet.gridProperties?.rowCount || "N/A"}`);
        console.log(`   - Columns: ${sheet.gridProperties?.columnCount || "N/A"}`);
        console.log(`   - Hidden: ${sheet.properties?.hidden ? "Yes" : "No"}`);
      });

      console.log("\n━".repeat(80));
      console.log(`\n📊 Tổng cộng: ${data.sheets.length} sheet(s)`);
    } else {
      console.log("❌ Không có sheets nào trong spreadsheet này!");
    }
  } catch (error) {
    console.error("\n❌ Lỗi:", error.message);
    console.error("\n💡 Thử method khác...");

    // Fallback: Try direct Google Sheets API URL
    try {
      console.log("\n🔄 Thử direct access...");
      const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`;

      if (!process.env.REACT_APP_GOOGLE_SHEETS_API_KEY) {
        throw new Error("Không có Google API Key trong .env");
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      console.log("✅ Kết nối thành công qua API Key!\n");

      if (data.sheets && data.sheets.length > 0) {
        console.log("📑 Danh sách các Sheets (Tabs):");
        console.log("━".repeat(80));

        data.sheets.forEach((sheet, index) => {
          const props = sheet.properties;
          console.log(`\n${index + 1}. 📄 Sheet #${index + 1}`);
          console.log(`   - Name: ${props.title}`);
          console.log(`   - Sheet ID: ${props.sheetId}`);
          console.log(`   - Type: ${props.sheetType}`);
          console.log(`   - Rows: ${props.gridProperties?.rowCount || "N/A"}`);
          console.log(`   - Columns: ${props.gridProperties?.columnCount || "N/A"}`);
          console.log(`   - Hidden: ${props.hidden ? "Yes" : "No"}`);

          if (props.tabColor) {
            console.log(
              `   - Tab Color: RGB(${props.tabColor.red}, ${props.tabColor.green}, ${props.tabColor.blue})`
            );
          }
        });

        console.log("\n━".repeat(80));
        console.log(`\n📊 Tổng cộng: ${data.sheets.length} sheet(s)`);
        console.log(`\n📝 Spreadsheet Title: ${data.properties.title}`);
      }
    } catch (fallbackError) {
      console.error("\n❌ Fallback cũng lỗi:", fallbackError.message);
      console.error("\n💡 Gợi ý:");
      console.error("   1. Kiểm tra Google API Key trong .env (REACT_APP_GOOGLE_SHEETS_API_KEY)");
      console.error("   2. Kiểm tra spreadsheet có share cho public hoặc API key");
      console.error("   3. Kiểm tra internet connection");
      process.exit(1);
    }
  }
}

// Run the check
checkSheetsViaAppsScript();
