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

async function fixDateFormats() {
  try {
    console.log('🔧 Fixing date formats in InboundInternational sheet...');

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

    console.log(`📊 Found ${rows.length} rows to process`);

    let updatedCount = 0;

    for (const row of rows) {
      let needsUpdate = false;

      // Fix main date field
      if (row.date) {
        const originalDate = row.date;
        let fixedDate = originalDate;

        // Convert various formats to YYYY-MM-DD
        if (typeof originalDate === 'number') {
          // Google Sheets serial number
          const date = new Date((originalDate - 25569) * 86400 * 1000);
          fixedDate = date.toISOString().split('T')[0];
        } else if (typeof originalDate === 'string') {
          if (originalDate.includes('/')) {
            // DD/MM/YYYY format
            const parts = originalDate.split('/');
            if (parts.length === 3) {
              fixedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          } else if (!/^\d{4}-\d{2}-\d{2}$/.test(originalDate)) {
            // Try to parse as date
            const date = new Date(originalDate);
            if (!isNaN(date.getTime())) {
              fixedDate = date.toISOString().split('T')[0];
            }
          }
        }

        if (fixedDate !== originalDate) {
          row.date = fixedDate;
          needsUpdate = true;
          console.log(`  📅 Fixed date: ${originalDate} → ${fixedDate}`);
        }
      }

      // Fix timeline date fields
      const timelineFields = [
        'timeline_cargoReady_est',
        'timeline_cargoReady_act',
        'timeline_etd_est',
        'timeline_etd_act',
        'timeline_eta_est',
        'timeline_eta_act',
        'timeline_depart_est',
        'timeline_depart_act',
        'timeline_arrivalPort_est',
        'timeline_arrivalPort_act',
        'timeline_receive_est',
        'timeline_receive_act',
      ];

      for (const field of timelineFields) {
        if (row[field]) {
          const originalDate = row[field];
          let fixedDate = originalDate;

          if (typeof originalDate === 'number') {
            const date = new Date((originalDate - 25569) * 86400 * 1000);
            fixedDate = date.toISOString().split('T')[0];
          } else if (
            typeof originalDate === 'string' &&
            originalDate.includes('/')
          ) {
            const parts = originalDate.split('/');
            if (parts.length === 3) {
              fixedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          }

          if (fixedDate !== originalDate) {
            row[field] = fixedDate;
            needsUpdate = true;
          }
        }
      }

      // Fix document status date fields
      const docFields = [
        'doc_checkBill_est',
        'doc_checkBill_act',
        'doc_checkCO_est',
        'doc_checkCO_act',
        'doc_sendDocs_est',
        'doc_sendDocs_act',
        'doc_customs_est',
        'doc_customs_act',
        'doc_tax_est',
        'doc_tax_act',
      ];

      for (const field of docFields) {
        if (row[field]) {
          const originalDate = row[field];
          let fixedDate = originalDate;

          if (typeof originalDate === 'number') {
            const date = new Date((originalDate - 25569) * 86400 * 1000);
            fixedDate = date.toISOString().split('T')[0];
          } else if (
            typeof originalDate === 'string' &&
            originalDate.includes('/')
          ) {
            const parts = originalDate.split('/');
            if (parts.length === 3) {
              fixedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          }

          if (fixedDate !== originalDate) {
            row[field] = fixedDate;
            needsUpdate = true;
          }
        }
      }

      if (needsUpdate) {
        await row.save();
        updatedCount++;
      }
    }

    console.log(`✅ Fixed date formats for ${updatedCount} rows`);
  } catch (error) {
    console.error('❌ Error fixing date formats:', error);
  }
}

fixDateFormats();
