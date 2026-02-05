'use strict';

// Thêm một bản ghi mẫu đầy đủ cột vào sheet InboundInternational
// Usage:
//  VITE_GOOGLE_SHEETS_SPREADSHEET_ID=YOUR_ID node scripts/addInboundInternationalSample.cjs

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

const SHEET_TITLE = 'InboundInternational';

async function getAuth() {
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
  return { auth, spreadsheetId };
}

function today(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

async function main() {
  const { auth, spreadsheetId } = await getAuth();
  const doc = new GoogleSpreadsheet(spreadsheetId, auth);
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle[SHEET_TITLE];
  if (!sheet) {
    console.error('Sheet not found:', SHEET_TITLE);
    process.exit(1);
  }
  await sheet.loadHeaderRow();

  const nowIso = new Date().toISOString();

  const row = {
    id: `INB-${Date.now()}`,
    date: today(0),
    pi: 'PI-TEST-001',
    supplier: 'NCC A',
    origin: 'CN',
    destination:
      'Kho trung tâm - lô2-5, Đường CN1, Phường Tây Thạnh, Quận Tân Phú, Thành phố Hồ Chí Minh',
    product: 'Vali 24 inch',
    category: 'Vali',
    quantity: 300,
    container: 1,
    status: 'confirmed',
    carrier: 'DHL',
    purpose: 'online',
    receiveTime: '14:30',
    poNumbers: 'PO-2025-001;PO-2025-002',
    // Packaging flattened
    packagingTypes: '2PCS/SET;3PCS/SET',
    packagingQuantities: '100;50',
    packagingDescriptions: 'Carton loại A;Carton loại B',
    // Timeline flattened
    timeline_cargoReady_est: today(-7),
    timeline_cargoReady_act: today(-6),
    timeline_cargoReady_status: 'completed',
    timeline_etd_est: today(-5),
    timeline_etd_act: today(-5),
    timeline_etd_status: 'completed',
    timeline_eta_est: today(2),
    timeline_eta_act: '',
    timeline_eta_status: 'pending',
    timeline_depart_est: today(-4),
    timeline_depart_act: today(-4),
    timeline_depart_status: 'completed',
    timeline_arrivalPort_est: today(1),
    timeline_arrivalPort_act: '',
    timeline_arrivalPort_status: 'pending',
    timeline_receive_est: today(3),
    timeline_receive_act: '',
    timeline_receive_status: 'pending',
    // Document status flattened
    doc_checkBill_est: today(0),
    doc_checkBill_act: '',
    doc_checkBill_status: 'confirmed',
    doc_checkCO_est: today(1),
    doc_checkCO_act: '',
    doc_checkCO_status: 'pending',
    doc_sendDocs_est: today(1),
    doc_sendDocs_act: '',
    doc_sendDocs_status: 'pending',
    doc_customs_est: today(2),
    doc_customs_act: '',
    doc_customs_status: 'pending',
    doc_tax_est: today(3),
    doc_tax_act: '',
    doc_tax_status: 'pending',
    notes: 'Bản ghi kiểm thử đầy đủ cột',
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  await sheet.addRow(row, { raw: true });
  console.log('✅ Added sample inbound record with all columns.');
}

main().catch((e) => {
  console.error('❌ Failed to add sample:', e);
  process.exit(1);
});
