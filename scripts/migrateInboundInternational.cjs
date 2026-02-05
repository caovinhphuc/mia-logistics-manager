'use strict';

// Migrate JSON columns to flattened column set for InboundInternational
// Usage:
//   VITE_GOOGLE_SHEETS_SPREADSHEET_ID=YOUR_ID node scripts/migrateInboundInternational.cjs

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

const SHEET_TITLE = 'InboundInternational';

const HEADERS = [
  'id',
  'date',
  'pi',
  'supplier',
  'origin',
  'destination',
  'product',
  'category',
  'quantity',
  'container',
  'status',
  'carrier',
  'purpose',
  'receiveTime',
  'poNumbers',
  'packagingTypes',
  'packagingQuantities',
  'packagingDescriptions',
  'timeline_cargoReady_est',
  'timeline_cargoReady_act',
  'timeline_cargoReady_status',
  'timeline_etd_est',
  'timeline_etd_act',
  'timeline_etd_status',
  'timeline_eta_est',
  'timeline_eta_act',
  'timeline_eta_status',
  'timeline_depart_est',
  'timeline_depart_act',
  'timeline_depart_status',
  'timeline_arrivalPort_est',
  'timeline_arrivalPort_act',
  'timeline_arrivalPort_status',
  'timeline_receive_est',
  'timeline_receive_act',
  'timeline_receive_status',
  'doc_checkBill_est',
  'doc_checkBill_act',
  'doc_checkBill_status',
  'doc_checkCO_est',
  'doc_checkCO_act',
  'doc_checkCO_status',
  'doc_sendDocs_est',
  'doc_sendDocs_act',
  'doc_sendDocs_status',
  'doc_customs_est',
  'doc_customs_act',
  'doc_customs_status',
  'doc_tax_est',
  'doc_tax_act',
  'doc_tax_status',
  'notes',
  'createdAt',
  'updatedAt',
];

function toArray(val) {
  if (!val) return [];
  try {
    const arr = JSON.parse(val);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function mapFromJson(row) {
  const packaging = toArray(row.packagingJson);
  const timeline = toArray(row.timelineJson);
  const docs = toArray(row.documentStatusJson);

  const findTL = (name) => timeline.find((t) => t.name === name) || {};
  const findDS = (name) => docs.find((d) => d.name === name) || {};

  return {
    packagingTypes: packaging.map((p) => p.type || '').join(';'),
    packagingQuantities: packaging
      .map((p) => String(p.quantity || 0))
      .join(';'),
    packagingDescriptions: packaging.map((p) => p.description || '').join(';'),

    timeline_cargoReady_est: findTL('Cargo Ready').estimatedDate || '',
    timeline_cargoReady_act: findTL('Cargo Ready').date || '',
    timeline_cargoReady_status: findTL('Cargo Ready').status || '',

    timeline_etd_est: findTL('ETD').estimatedDate || '',
    timeline_etd_act: findTL('ETD').date || '',
    timeline_etd_status: findTL('ETD').status || '',

    timeline_eta_est: findTL('ETA').estimatedDate || '',
    timeline_eta_act: findTL('ETA').date || '',
    timeline_eta_status: findTL('ETA').status || '',

    timeline_depart_est: findTL('Ngày hàng đi').estimatedDate || '',
    timeline_depart_act: findTL('Ngày hàng đi').date || '',
    timeline_depart_status: findTL('Ngày hàng đi').status || '',

    timeline_arrivalPort_est: findTL('Ngày hàng về cảng').estimatedDate || '',
    timeline_arrivalPort_act: findTL('Ngày hàng về cảng').date || '',
    timeline_arrivalPort_status: findTL('Ngày hàng về cảng').status || '',

    timeline_receive_est: findTL('Ngày nhận hàng').estimatedDate || '',
    timeline_receive_act: findTL('Ngày nhận hàng').date || '',
    timeline_receive_status: findTL('Ngày nhận hàng').status || '',

    doc_checkBill_est: findDS('Check bill').estimatedDate || '',
    doc_checkBill_act: findDS('Check bill').date || '',
    doc_checkBill_status: findDS('Check bill').status || '',

    doc_checkCO_est: findDS('Check CO').estimatedDate || '',
    doc_checkCO_act: findDS('Check CO').date || '',
    doc_checkCO_status: findDS('Check CO').status || '',

    doc_sendDocs_est: findDS('TQ gửi chứng từ đi').estimatedDate || '',
    doc_sendDocs_act: findDS('TQ gửi chứng từ đi').date || '',
    doc_sendDocs_status: findDS('TQ gửi chứng từ đi').status || '',

    doc_customs_est: findDS('Lên Tờ Khai Hải Quan').estimatedDate || '',
    doc_customs_act: findDS('Lên Tờ Khai Hải Quan').date || '',
    doc_customs_status: findDS('Lên Tờ Khai Hải Quan').status || '',

    doc_tax_est: findDS('Đóng thuế').estimatedDate || '',
    doc_tax_act: findDS('Đóng thuế').date || '',
    doc_tax_status: findDS('Đóng thuế').status || '',
  };
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
  const sheet = doc.sheetsByTitle[SHEET_TITLE];
  if (!sheet) {
    console.error('Sheet InboundInternational not found');
    process.exit(1);
  }
  await sheet.loadHeaderRow();
  const rows = await sheet.getRows();

  let updated = 0;
  for (const r of rows) {
    // If already flattened, skip (heuristic: has packagingTypes or timeline_* filled)
    if (
      r.get('packagingTypes') ||
      r.get('timeline_etd_est') ||
      r.get('doc_checkBill_est')
    )
      continue;

    const mapped = mapFromJson({
      packagingJson: r.get('packagingJson'),
      timelineJson: r.get('timelineJson'),
      documentStatusJson: r.get('documentStatusJson'),
    });

    Object.entries(mapped).forEach(([k, v]) => {
      if (HEADERS.includes(k)) r.set(k, v);
    });
    r.set('updatedAt', new Date().toISOString());
    await r.save();
    updated += 1;
  }

  console.log(`✅ Migration completed. Updated rows: ${updated}`);
}

main().catch((e) => {
  console.error('❌ Migration failed:', e);
  process.exit(1);
});
