'use strict';

// Set spreadsheet timezone/locale to Vietnam and format date/time columns for InboundInternational
// Also convert string dates (YYYY-MM-DD) to actual Date values, and HH:mm to Time values
// Usage:
//  VITE_GOOGLE_SHEETS_SPREADSHEET_ID=YOUR_ID node scripts/formatInboundDates.cjs

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

const SHEET_TITLE = 'InboundInternational';

const DATE_COLUMNS = new Set([
  'date',
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
  'createdAt',
  'updatedAt',
]);
const TIME_COLUMNS = new Set(['receiveTime']);

// Convert Date to Google Sheets serial number (days since 1899-12-30)
function dateToSerial(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return null;
  // Google Sheets epoch: 1899-12-30
  const epoch = new Date(1899, 11, 30);
  const diffMs = date.getTime() - epoch.getTime();
  return diffMs / (1000 * 60 * 60 * 24);
}

// Convert time string to Google Sheets time serial (fraction of day)
function timeToSerial(s) {
  if (!s || typeof s !== 'string') return null;
  const m = s.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh > 23 || mm > 59) return null;
  return (hh * 60 + mm) / (24 * 60); // fraction of day
}

function parseDateStr(s) {
  if (!s || typeof s !== 'string') return null;
  // Accept YYYY-MM-DD or DD/MM/YYYY
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  const vi = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  if (iso.test(s)) {
    const [y, m, d] = s.split('-').map(Number);
    return dateToSerial(new Date(Date.UTC(y, m - 1, d, 0, 0, 0)));
  }
  const mvi = s.match(vi);
  if (mvi) {
    const d = Number(mvi[1]);
    const m = Number(mvi[2]);
    const y = Number(mvi[3]);
    return dateToSerial(new Date(Date.UTC(y, m - 1, d, 0, 0, 0)));
  }
  const dt = new Date(s);
  return isNaN(dt.getTime()) ? null : dateToSerial(dt);
}

function parseTimeStr(s) {
  return timeToSerial(s);
}

async function main() {
  const spreadsheetId =
    process.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID ||
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  let email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let key = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !key) {
    const p = path.resolve(__dirname, '../src/config/service-account-key.json');
    if (fs.existsSync(p)) {
      const json = JSON.parse(fs.readFileSync(p, 'utf8'));
      email = email || json.client_email;
      key = key || json.private_key;
    }
  }
  if (!spreadsheetId || !email || !key) {
    console.error('Missing credentials or spreadsheet id');
    process.exit(1);
  }

  const auth = new JWT({
    email,
    key: key.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive.file',
    ],
  });

  const doc = new GoogleSpreadsheet(spreadsheetId, auth);
  await doc.loadInfo();
  // Ensure VN locale/timezone
  await doc.updateProperties({
    locale: 'vi_VN',
    timeZone: 'Asia/Ho_Chi_Minh',
  });

  const sheet = doc.sheetsByTitle[SHEET_TITLE];
  if (!sheet) {
    console.error('Sheet not found:', SHEET_TITLE);
    process.exit(1);
  }
  await sheet.loadHeaderRow();
  const headers = sheet.headerValues || [];
  const colIndexByName = Object.fromEntries(headers.map((h, i) => [h, i]));

  // Process in smaller batches to avoid timeout
  const BATCH_SIZE = 50;
  const lastCol = headers.length;
  const lastRow = Math.max(2, sheet.rowCount);

  console.log(`Processing ${lastRow - 1} rows in batches of ${BATCH_SIZE}...`);

  for (let startRow = 1; startRow < lastRow; startRow += BATCH_SIZE) {
    const endRow = Math.min(startRow + BATCH_SIZE, lastRow);
    console.log(`Processing rows ${startRow}-${endRow - 1}...`);

    await sheet.loadCells({
      startRowIndex: startRow,
      endRowIndex: endRow,
      startColumnIndex: 0,
      endColumnIndex: lastCol,
    });

    let hasChanges = false;
    // Apply number formats for current batch
    for (const h of headers) {
      const cIdx = colIndexByName[h];
      if (cIdx == null) continue;

      for (let r = startRow; r < endRow; r++) {
        const cell = sheet.getCell(r, cIdx);
        if (DATE_COLUMNS.has(h)) {
          if (typeof cell.value === 'string' && cell.value.trim()) {
            const d = parseDateStr(cell.value);
            if (d !== null) {
              cell.value = d;
              hasChanges = true;
            }
          }
          cell.numberFormat = { type: 'DATE', pattern: 'dd/MM/yyyy' };
        } else if (TIME_COLUMNS.has(h)) {
          if (typeof cell.value === 'string' && cell.value.trim()) {
            const t = parseTimeStr(cell.value);
            if (t !== null) {
              cell.value = t;
              hasChanges = true;
            }
          }
          cell.numberFormat = { type: 'TIME', pattern: 'HH:mm' };
        } else if (h === 'createdAt' || h === 'updatedAt') {
          if (typeof cell.value === 'string' && cell.value.trim()) {
            const d = new Date(cell.value);
            if (!isNaN(d.getTime())) {
              cell.value = dateToSerial(d);
              hasChanges = true;
            }
          }
          cell.numberFormat = {
            type: 'DATE_TIME',
            pattern: 'dd/MM/yyyy HH:mm',
          };
        }
      }
    }

    if (hasChanges) {
      await sheet.saveUpdatedCells();
    }
  }
  console.log(
    '✅ Timezone/locale set to vi_VN, date/time columns formatted and normalized.'
  );
}

main().catch((e) => {
  console.error('❌ Formatting failed:', e);
  process.exit(1);
});
