// Quick Google Sheets connectivity test
// Usage: node scripts/test-google-sheets.js [spreadsheetId]

const path = require("path");
const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");
require("dotenv").config();

async function main() {
  const spreadsheetId =
    process.argv[2] ||
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID ||
    process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID ||
    "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As";

  const keyFile =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(__dirname, "../server/sinuous-aviary-474820-e3-c442968a0e87.json");

  const auth = new GoogleAuth({
    keyFile,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });

  console.log("🔌 Testing Google Sheets connection...");
  console.log("📄 Spreadsheet ID:", spreadsheetId);
  console.log("🔑 Service Account Key:", keyFile);

  // 1) Get spreadsheet info (titles)
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const titles = (meta.data.sheets || [])
    .map((s) => (s.properties ? s.properties.title : null))
    .filter(Boolean);
  console.log("✅ Connected. Sheets:", titles.join(", "));

  // 2) Try reading InboundInternational and InboundDomestic
  const tryRead = async (title) => {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${title}!A:BB`,
      });
      const values = res.data.values || [];
      console.log(
        `📗 ${title}: rows=${values.length} (headers: ${values[0] ? values[0].length : 0} cols)`
      );
    } catch (e) {
      console.log(`⚠️  ${title}: ${e.message}`);
    }
  };

  await tryRead("InboundInternational");
  await tryRead("InboundDomestic");

  console.log("🎉 Done.");
}

main().catch((err) => {
  console.error("❌ Google Sheets test failed:", err.message);
  process.exit(1);
});
