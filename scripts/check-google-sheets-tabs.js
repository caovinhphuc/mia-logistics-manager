/**
 * Script kiểm tra các tabs trong Google Sheets hiện tại
 */

const { google } = require("googleapis");
require("dotenv").config();

const SPREADSHEET_ID = "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As";

async function checkSheets() {
  try {
    console.log("🔍 Đang kết nối Google Sheets...\n");
    console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}\n`);

    // Setup authentication - sử dụng service account file
    const auth = new google.auth.GoogleAuth({
      keyFile: "./server/service-account-key.json",
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets.readonly",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Get spreadsheet info
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const spreadsheet = response.data;

    console.log("✅ Kết nối thành công!\n");
    console.log("📋 Thông tin Spreadsheet:");
    console.log(`   - Title: ${spreadsheet.properties.title}`);
    console.log(`   - Locale: ${spreadsheet.properties.locale}`);
    console.log(`   - Time Zone: ${spreadsheet.properties.timeZone}\n`);

    console.log("📑 Danh sách các Sheets (Tabs):");
    console.log("━".repeat(80));

    if (!spreadsheet.sheets || spreadsheet.sheets.length === 0) {
      console.log("❌ Không có sheets nào trong spreadsheet này!");
      return;
    }

    spreadsheet.sheets.forEach((sheet, index) => {
      const props = sheet.properties;
      console.log(`\n${index + 1}. 📄 Sheet #${index + 1}`);
      console.log(`   - Name: ${props.title}`);
      console.log(`   - Sheet ID: ${props.sheetId}`);
      console.log(`   - Type: ${props.sheetType}`);
      console.log(`   - Rows: ${props.gridProperties.rowCount}`);
      console.log(`   - Columns: ${props.gridProperties.columnCount}`);
      console.log(`   - Hidden: ${props.hidden ? "Yes" : "No"}`);
      console.log(`   - Right to Left: ${props.rightToLeft ? "Yes" : "No"}`);

      if (props.bandProperties) {
        console.log(
          `   - Banding: Yes (${props.bandProperties.columnProperties?.length || 0} column bands)`
        );
      }

      if (props.tabColor) {
        console.log(
          `   - Tab Color: RGB(${props.tabColor.red}, ${props.tabColor.green}, ${props.tabColor.blue})`
        );
      }
    });

    console.log("\n━".repeat(80));
    console.log(`\n📊 Tổng cộng: ${spreadsheet.sheets.length} sheet(s)`);

    // Test read first row of each sheet
    console.log("\n🔍 Kiểm tra dữ liệu mẫu (10 dòng đầu của mỗi sheet):\n");

    for (const sheet of spreadsheet.sheets) {
      const sheetName = sheet.properties.title;
      console.log(`📄 ${sheetName}:`);

      try {
        const dataResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1:Z10`,
        });

        const values = dataResponse.data.values || [];

        if (values.length === 0) {
          console.log("   ⚠️  Sheet trống (không có dữ liệu)\n");
          continue;
        }

        console.log(`   - Số hàng có dữ liệu: ${values.length}`);

        // Show headers if available
        if (values.length > 0 && values[0]) {
          console.log(`   - Headers (${values[0].length} cột):`, values[0].slice(0, 5).join(", "));
          if (values[0].length > 5) {
            console.log(`     ... +${values[0].length - 5} cột nữa`);
          }
        }

        // Show sample data
        if (values.length > 1) {
          console.log(`   - Sample data (hàng 2):`, values[1].slice(0, 3).join(" | "));
        }

        console.log("");
      } catch (error) {
        console.log(`   ❌ Lỗi khi đọc dữ liệu: ${error.message}\n`);
      }
    }
  } catch (error) {
    console.error("\n❌ Lỗi:", error.message);
    console.error("\n💡 Gợi ý:");
    console.error("   1. Kiểm tra file .env có đầy đủ thông tin Google Service Account");
    console.error("   2. Kiểm tra spreadsheet ID có đúng không");
    console.error("   3. Kiểm tra service account có quyền truy cập spreadsheet");

    if (error.code === "ENOTFOUND") {
      console.error("\n   ⚠️  Không thể kết nối internet hoặc Google API");
    }

    process.exit(1);
  }
}

// Run the check
checkSheets();
