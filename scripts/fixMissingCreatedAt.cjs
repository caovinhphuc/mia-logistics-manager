const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SPREADSHEET_ID = process.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;
const SERVICE_ACCOUNT_PATH = path.join(
  __dirname,
  '..',
  'src',
  'config',
  'service-account-key.json'
);

if (!SPREADSHEET_ID) {
  console.error('❌ Missing VITE_GOOGLE_SHEETS_SPREADSHEET_ID');
  process.exit(1);
}

if (!require('fs').existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('❌ Service account key not found:', SERVICE_ACCOUNT_PATH);
  process.exit(1);
}

// Helper function to get Vietnam time string
function getVietnamTimeString() {
  const now = new Date();
  const vietnamTime = new Date(now.getTime() + 7 * 60 * 60 * 1000); // UTC+7
  return vietnamTime.toISOString().replace('T', ' ').substring(0, 19);
}

async function fixMissingCreatedAt() {
  try {
    console.log('🔧 Fixing missing createdAt in InboundInternational sheet...');

    const serviceAccount = require(SERVICE_ACCOUNT_PATH);
    const auth = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth);
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['InboundInternational'];
    if (!sheet) {
      console.error('❌ InboundInternational sheet not found');
      return;
    }

    await sheet.loadHeaderRow();
    const rows = await sheet.getRows();

    console.log(`📊 Found ${rows.length} rows to check`);

    let updatedCount = 0;

    for (const row of rows) {
      let needsUpdate = false;

      // Check if createdAt is missing or empty
      if (
        !row.createdAt ||
        row.createdAt === '' ||
        row.createdAt === 'Chưa có'
      ) {
        // Set createdAt to current Vietnam time
        row.createdAt = getVietnamTimeString();
        needsUpdate = true;
        console.log(
          `  📅 Fixed createdAt for ID: ${row.id} → ${row.createdAt}`
        );
      }

      // Also ensure updatedAt is set
      if (
        !row.updatedAt ||
        row.updatedAt === '' ||
        row.updatedAt === 'Chưa có'
      ) {
        row.updatedAt = getVietnamTimeString();
        needsUpdate = true;
        console.log(
          `  📅 Fixed updatedAt for ID: ${row.id} → ${row.updatedAt}`
        );
      }

      if (needsUpdate) {
        await row.save();
        updatedCount++;
      }
    }

    console.log(`✅ Fixed createdAt/updatedAt for ${updatedCount} rows`);
  } catch (error) {
    console.error('❌ Error fixing missing createdAt:', error);
  }
}

fixMissingCreatedAt();
