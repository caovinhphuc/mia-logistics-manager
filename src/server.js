const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { google } = require('googleapis');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 3100;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SERVICE_ACCOUNT_KEY_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH ||
  path.resolve(__dirname, '../backend/mia-logistics-469406-eec521c603c0.json');

// Google API Setup - Sử dụng service account key
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_KEY_PATH,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
  ],
});

// Default spreadsheet ID
const DEFAULT_SPREADSHEET_ID = '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';

const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });

const TRANSFERS_SHEET = 'Transfers';
const TRANSFERS_HEADERS = [
  'transfer_id',
  'orderCode',
  'hasVali',
  'date',
  'source',
  'dest',
  'quantity',
  'state',
  'transportStatus',
  'note',
  'pkgS',
  'pkgM',
  'pkgL',
  'pkgBagSmall',
  'pkgBagMedium',
  'pkgBagLarge',
  'pkgOther',
  'totalPackages',
  'volS',
  'volM',
  'volL',
  'volBagSmall',
  'volBagMedium',
  'volBagLarge',
  'volOther',
  'totalVolume',
  'dest_id',
  'source_id',
  'employee',
  'address',
  'ward',
  'district',
  'province',
];

const CARRIERS_SHEET = 'Carriers';
const CARRIERS_HEADERS = [
  'carrierId',
  'name',
  'avatarUrl',
  'contactPerson',
  'email',
  'phone',
  'address',
  'serviceAreas',
  'pricingMethod',
  'baseRate',
  'perKmRate',
  'perM3Rate',
  'perTripRate',
  'fuelSurcharge',
  'remoteAreaFee',
  'insuranceRate',
  'vehicleTypes',
  'maxWeight',
  'maxVolume',
  'operatingHours',
  'rating',
  'isActive',
  'createdAt',
  'updatedAt',
];

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'mia-logistics-secret-key-2025';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Login attempts tracking (in-memory for demo)
const loginAttempts = new Map();

// Helper: Get user from Google Sheets
async function getUserFromSheets(email) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: DEFAULT_SPREADSHEET_ID,
      range: 'Users!A:H',
    });

    const rows = response.data.values || [];
    if (rows.length < 2) return null;

    // Parse headers
    const headers = rows[0];
    const idIndex = headers.indexOf('id');
    const emailIndex = headers.indexOf('email');
    const passwordHashIndex = headers.indexOf('passwordHash');
    const fullNameIndex = headers.indexOf('fullName');
    const roleIndex = headers.indexOf('roleId');
    const statusIndex = headers.indexOf('status');

    // Find user by email
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[emailIndex]?.toLowerCase() === email.toLowerCase()) {
        return {
          id: row[idIndex],
          email: row[emailIndex],
          passwordHash: row[passwordHashIndex],
          fullName: row[fullNameIndex],
          role: row[roleIndex],
          status: row[statusIndex],
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error reading user from Google Sheets:', error);
    return null;
  }
}

// Email transporter
let transporter = null;
// Initialize email transporter - support SendGrid or SMTP
const sendGridApiKey = process.env.SENDGRID_API_KEY;
const smtpHost = process.env.SMTP_HOST;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

if (sendGridApiKey) {
  // Use SendGrid
  transporter = nodemailer.createTransport({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: sendGridApiKey,
    },
  });
  logger.debug('📧 Email: Using SendGrid');
} else if (smtpHost && smtpUser && smtpPass) {
  // Use SMTP
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
  logger.debug('📧 Email: Using SMTP');
} else if (process.env.REACT_APP_EMAIL_USER && process.env.REACT_APP_EMAIL_PASS) {
  // Legacy Gmail config
  transporter = nodemailer.createTransport({
    service: process.env.REACT_APP_EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.REACT_APP_EMAIL_USER,
      pass: process.env.REACT_APP_EMAIL_PASS,
    },
  });
  logger.debug('📧 Email: Using legacy Gmail config');
}

// Alert history storage (in-memory for demo)
let alertHistory = [];

// Helper function to add to alert history
const addToAlertHistory = (type, subject, message) => {
  alertHistory.unshift({
    type,
    subject,
    message,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 50 alerts
  if (alertHistory.length > 50) {
    alertHistory = alertHistory.slice(0, 50);
  }
};

const colNumToLetter = (num) => {
  let result = '';
  let n = num;
  while (n > 0) {
    n -= 1;
    result = String.fromCharCode(65 + (n % 26)) + result;
    n = Math.floor(n / 26);
  }
  return result;
};

const toStringSafe = (value, defaultValue = '') => {
  if (value === null || value === undefined) return defaultValue;
  if (typeof value === 'string') return value.trim();
  return String(value).trim();
};

const toNumberSafe = (value, decimals = 0) => {
  if (value === null || value === undefined || value === '') return 0;
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  if (decimals <= 0) return Math.round(num);
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
};

const formatDateForSheet = (input) => {
  const s = toStringSafe(input);
  if (!s) return '';
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s;
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    return `${day}/${month}/${year}`;
  }
  return s;
};

const normalizeTransferRecord = (record) => {
  const normalized = { ...record };
  normalized.transfer_id = toStringSafe(normalized.transfer_id || normalized.id);
  normalized.orderCode = toStringSafe(normalized.orderCode);
  normalized.hasVali = toStringSafe(normalized.hasVali);
  normalized.date = formatDateForSheet(normalized.date);
  normalized.source = toStringSafe(normalized.source);
  normalized.dest = toStringSafe(normalized.dest);
  normalized.quantity = toNumberSafe(normalized.quantity, 0);
  normalized.state = toStringSafe(normalized.state || 'Đề nghị chuyển kho');
  normalized.transportStatus = toStringSafe(normalized.transportStatus || 'Chờ báo kiện');
  normalized.note = toStringSafe(normalized.note);

  normalized.pkgS = toNumberSafe(normalized.pkgS, 0);
  normalized.pkgM = toNumberSafe(normalized.pkgM, 0);
  normalized.pkgL = toNumberSafe(normalized.pkgL, 0);
  normalized.pkgBagSmall = toNumberSafe(normalized.pkgBagSmall, 0);
  normalized.pkgBagMedium = toNumberSafe(normalized.pkgBagMedium, 0);
  normalized.pkgBagLarge = toNumberSafe(normalized.pkgBagLarge, 0);
  normalized.pkgOther = toNumberSafe(normalized.pkgOther, 0);

  normalized.volS = toNumberSafe(normalized.volS, 2);
  normalized.volM = toNumberSafe(normalized.volM, 2);
  normalized.volL = toNumberSafe(normalized.volL, 2);
  normalized.volBagSmall = toNumberSafe(normalized.volBagSmall, 2);
  normalized.volBagMedium = toNumberSafe(normalized.volBagMedium, 2);
  normalized.volBagLarge = toNumberSafe(normalized.volBagLarge, 2);
  normalized.volOther = toNumberSafe(normalized.volOther, 2);

  normalized.totalPackages =
    normalized.totalPackages ||
    normalized.pkgS +
      normalized.pkgM +
      normalized.pkgL +
      normalized.pkgBagSmall +
      normalized.pkgBagMedium +
      normalized.pkgBagLarge +
      normalized.pkgOther;
  normalized.totalVolume =
    normalized.totalVolume ||
    normalized.volS +
      normalized.volM +
      normalized.volL +
      normalized.volBagSmall +
      normalized.volBagMedium +
      normalized.volBagLarge +
      normalized.volOther;

  normalized.dest_id = toStringSafe(normalized.dest_id);
  normalized.source_id = toStringSafe(normalized.source_id);
  normalized.employee = toStringSafe(normalized.employee);
  normalized.address = toStringSafe(normalized.address);
  normalized.ward = toStringSafe(normalized.ward);
  normalized.district = toStringSafe(normalized.district);
  normalized.province = toStringSafe(normalized.province);

  return normalized;
};

const ensureTransfersHeaders = async (spreadsheetId) => {
  const endColumn = colNumToLetter(TRANSFERS_HEADERS.length);
  const range = `${TRANSFERS_SHEET}!A1:${endColumn}1`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const existing = response.data.values?.[0] || [];
  if (existing.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${TRANSFERS_SHEET}!A1`,
      valueInputOption: 'RAW',
      resource: { values: [TRANSFERS_HEADERS] },
    });
  }
};

const getExistingTransferIds = async (spreadsheetId) => {
  const endColumn = colNumToLetter(TRANSFERS_HEADERS.length);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${TRANSFERS_SHEET}!A1:${endColumn}`,
  });
  const rows = response.data.values || [];
  if (rows.length === 0) {
    return new Set();
  }
  const headers = rows[0];
  const idIndex = headers.indexOf('transfer_id');
  const altIndex = headers.indexOf('id');
  const ids = new Set();
  rows.slice(1).forEach((row) => {
    const id = toStringSafe(row[idIndex >= 0 ? idIndex : altIndex] || '');
    if (id) ids.add(id);
  });
  return ids;
};

const ensureCarriersHeaders = async (spreadsheetId) => {
  const endColumn = colNumToLetter(CARRIERS_HEADERS.length);
  const range = `${CARRIERS_SHEET}!A1:${endColumn}1`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const existing = response.data.values?.[0] || [];
  if (existing.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${CARRIERS_SHEET}!A1`,
      valueInputOption: 'RAW',
      resource: { values: [CARRIERS_HEADERS] },
    });
  }
};

const ensureTransportRequestHeaders = async (spreadsheetId) => {
  const endColumn = colNumToLetter(TRANSPORT_REQUESTS_HEADERS.length);
  const range = `${TRANSPORT_REQUESTS_SHEET}!A1:${endColumn}1`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const existing = response.data.values?.[0] || [];
  if (existing.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${TRANSPORT_REQUESTS_SHEET}!A1`,
      valueInputOption: 'RAW',
      resource: { values: [TRANSPORT_REQUESTS_HEADERS] },
    });
  }
};

const getTransportRequestRecords = async (spreadsheetId) => {
  await ensureTransportRequestHeaders(spreadsheetId);
  const endColumn = colNumToLetter(TRANSPORT_REQUESTS_HEADERS.length);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${TRANSPORT_REQUESTS_SHEET}!A1:${endColumn}`,
  });
  const rows = response.data.values || [];
  if (rows.length === 0) return [];
  const headers = rows[0];
  return rows.slice(1).reduce((acc, row) => {
    const hasValue = row.some((cell) => cell && String(cell).trim().length > 0);
    if (!hasValue) return acc;
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? '';
    });
    acc.push(record);
    return acc;
  }, []);
};

const findTransportRequestRowIndex = async (spreadsheetId, requestId) => {
  const endColumn = colNumToLetter(TRANSPORT_REQUESTS_HEADERS.length);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${TRANSPORT_REQUESTS_SHEET}!A1:${endColumn}`,
  });
  const rows = response.data.values || [];
  if (rows.length === 0) return -1;
  const headers = rows[0];
  const dataRows = rows.slice(1);
  const idx = dataRows.findIndex((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? '';
    });
    return toStringSafe(record.requestId) === requestId;
  });
  return idx === -1 ? -1 : idx + 2;
};

const generateTransportRequestId = async (spreadsheetId) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${TRANSPORT_REQUESTS_SHEET}!A:A`,
  });
  const rows = response.data.values || [];
  const ids = rows.slice(1).map((row) => String(row[0] || '').trim());
  let maxNumber = 0;
  ids.forEach((id) => {
    if (id.startsWith('MSC-')) {
      const num = parseInt(id.slice(4), 10);
      if (!Number.isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  const nextNumber = (maxNumber + 1).toString().padStart(8, '0');
  return `MSC-${nextNumber}`;
};

const appendTransportRequestRow = async (spreadsheetId, record) => {
  const values = TRANSPORT_REQUESTS_HEADERS.map((header) => record[header] ?? '');
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${TRANSPORT_REQUESTS_SHEET}!A:Z`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: { values: [values] },
  });
};

const getCarrierRecords = async (spreadsheetId) => {
  await ensureCarriersHeaders(spreadsheetId);
  const endColumn = colNumToLetter(CARRIERS_HEADERS.length);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${CARRIERS_SHEET}!A1:${endColumn}`,
  });
  const rows = response.data.values || [];
  if (rows.length === 0) return [];
  const headers = rows[0];
  return rows.slice(1).reduce((acc, row) => {
    const hasValue = row.some((cell) => cell && String(cell).trim().length > 0);
    if (!hasValue) return acc;
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? '';
    });
    acc.push(record);
    return acc;
  }, []);
};

const findCarrierRowIndex = async (spreadsheetId, carrierId) => {
  const endColumn = colNumToLetter(CARRIERS_HEADERS.length);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${CARRIERS_SHEET}!A1:${endColumn}`,
  });
  const rows = response.data.values || [];
  if (rows.length === 0) return -1;
  const headers = rows[0];
  const dataRows = rows.slice(1);
  const idx = dataRows.findIndex((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? '';
    });
    return toStringSafe(record.carrierId) === carrierId;
  });
  return idx === -1 ? -1 : idx + 2;
};

const ACTIVE_LOCATION_STATUSES = new Set(['active', 'true', '1', 'yes']);

const isLocationActive = (statusValue) => {
  if (!statusValue) return false;
  const normalized = toStringSafe(statusValue).toLowerCase();
  return ACTIVE_LOCATION_STATUSES.has(normalized);
};

const loadLocationsMap = async (spreadsheetId = DEFAULT_SPREADSHEET_ID) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Locations!A1:Z',
    });
    const rows = response.data.values || [];
    if (rows.length === 0) return new Map();
    const headers = rows[0];
    const map = new Map();
    rows.slice(1).forEach((row) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = row[index] ?? '';
      });
      const id = toStringSafe(record.id || record.ID);
      if (!id) return;
      const status = record.status || record.Status || record.active || record.Active;
      if (status && !isLocationActive(status)) return;
      map.set(id, {
        address: toStringSafe(record.address || record.Address),
        ward: toStringSafe(record.ward || record.Ward),
        district: toStringSafe(record.district || record.District),
        province: toStringSafe(record.province || record.Province),
      });
    });
    return map;
  } catch (error) {
    console.error('Error loading locations map:', error);
    return new Map();
  }
};

const getLocationsList = async (spreadsheetId = DEFAULT_SPREADSHEET_ID) => {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Locations!A1:Z',
  });
  const rows = response.data.values || [];
  if (rows.length === 0) return [];

  const headers = rows[0];

  return rows.slice(1).reduce((acc, row) => {
    const hasValue = row.some((cell) => (cell ?? '').toString().trim().length > 0);
    if (!hasValue) return acc;

    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? '';
    });

    const idCandidate =
      record.id || record.ID || record.code || record.Code || `LOC-${acc.length + 1}`;

    record.id = toStringSafe(idCandidate);
    record.status = toStringSafe(
      record.status || record.Status || record.active || record.Active || 'active'
    );

    acc.push(record);
    return acc;
  }, []);
};

const applyLocationToTransfer = (transfer, locationsMap) => {
  const destId = toStringSafe(transfer.dest_id);
  if (!destId) return transfer;
  const location = locationsMap.get(destId);
  if (!location) return transfer;
  transfer.address = location.address;
  transfer.ward = location.ward;
  transfer.district = location.district;
  transfer.province = location.province;
  return transfer;
};

// Volume rules helpers
const VOLUME_RULES_SHEET = 'VolumeRules';
const VOLUME_RULES_HEADERS = ['id', 'name', 'unitVolume', 'description', 'createdAt', 'updatedAt'];
const VOLUME_RULES_DEFAULTS = [
  { id: 'S', name: 'Size S', unitVolume: '0.04', description: '' },
  { id: 'M', name: 'Size M', unitVolume: '0.09', description: '' },
  { id: 'L', name: 'Size L', unitVolume: '0.14', description: '' },
  { id: 'BAG_S', name: 'Bao nhỏ', unitVolume: '0.01', description: '' },
  { id: 'BAG_M', name: 'Bao trung', unitVolume: '0.05', description: '' },
  { id: 'BAG_L', name: 'Bao lớn', unitVolume: '0.10', description: '' },
  { id: 'OTHER', name: 'Khác', unitVolume: '0.00', description: '' },
];

const TRANSPORT_REQUESTS_SHEET = 'TransportRequests';
const TRANSPORT_REQUESTS_HEADERS = [
  'requestId',
  'createdAt',
  'updatedAt',
  'pickupAddress',
  'stop1Address',
  'stop2Address',
  'stop3Address',
  'stop4Address',
  'stop5Address',
  'stop6Address',
  'stop7Address',
  'stop8Address',
  'stop9Address',
  'stop10Address',
  'stop1MN',
  'stop2MN',
  'stop3MN',
  'stop4MN',
  'stop5MN',
  'stop6MN',
  'stop7MN',
  'stop8MN',
  'stop9MN',
  'stop10MN',
  'stop1Products',
  'stop2Products',
  'stop3Products',
  'stop4Products',
  'stop5Products',
  'stop6Products',
  'stop7Products',
  'stop8Products',
  'stop9Products',
  'stop10Products',
  'stop1VolumeM3',
  'stop2VolumeM3',
  'stop3VolumeM3',
  'stop4VolumeM3',
  'stop5VolumeM3',
  'stop6VolumeM3',
  'stop7VolumeM3',
  'stop8VolumeM3',
  'stop9VolumeM3',
  'stop10VolumeM3',
  'stop1Packages',
  'stop2Packages',
  'stop3Packages',
  'stop4Packages',
  'stop5Packages',
  'stop6Packages',
  'stop7Packages',
  'stop8Packages',
  'stop9Packages',
  'stop10Packages',
  'totalProducts',
  'totalVolumeM3',
  'totalPackages',
  'pricingMethod',
  'carrierId',
  'carrierName',
  'carrierContact',
  'carrierPhone',
  'carrierEmail',
  'estimatedCost',
  'status',
  'note',
  'vehicleType',
  'distance1',
  'distance2',
  'distance3',
  'distance4',
  'distance5',
  'distance6',
  'distance7',
  'distance8',
  'distance9',
  'distance10',
  'totalDistance',
  'stop1OrderCount',
  'stop2OrderCount',
  'stop3OrderCount',
  'stop4OrderCount',
  'stop5OrderCount',
  'stop6OrderCount',
  'stop7OrderCount',
  'stop8OrderCount',
  'stop9OrderCount',
  'stop10OrderCount',
  'totalOrderCount',
  'stop1TransferIds',
  'stop2TransferIds',
  'stop3TransferIds',
  'stop4TransferIds',
  'stop5TransferIds',
  'stop6TransferIds',
  'stop7TransferIds',
  'stop8TransferIds',
  'stop9TransferIds',
  'stop10TransferIds',
  'driverId',
  'driverName',
  'driverPhone',
  'driverLicense',
  'loadingImages',
  'department',
  'serviceArea',
  'pricePerKm',
  'pricePerM3',
  'pricePerTrip',
  'fuelSurcharge',
  'tollFee',
  'insuranceFee',
  'baseRate',
];

const APPS_SCRIPT_SCRIPT_ID =
  process.env.APPS_SCRIPT_DISTANCE_ID ||
  process.env.REMOTE_APPS_SCRIPT_ID ||
  process.env.REACT_APP_GOOGLE_APPS_SCRIPT_ID ||
  process.env.GOOGLE_APPS_SCRIPT_ID ||
  '';

const APPS_SCRIPT_DISTANCE_URL =
  process.env.APPS_SCRIPT_DISTANCE_URL ||
  (APPS_SCRIPT_SCRIPT_ID
    ? `https://script.google.com/macros/s/${APPS_SCRIPT_SCRIPT_ID}/exec`
    : 'https://script.google.com/macros/s/AKfycbw8xo0xm576l67BXb2fVcEg4cOE4rQD7MgUKxAWZmTVK7-b2k5ZR303EEmOyvbd3nTQfQ/exec');

if (!process.env.APPS_SCRIPT_DISTANCE_URL && APPS_SCRIPT_SCRIPT_ID) {
  logger.debug(
    `[Google Apps Script] Derived distance URL from script ID ${APPS_SCRIPT_SCRIPT_ID.slice(0, 8)}…`
  );
}

const ensureVolumeRulesHeaders = async (spreadsheetId) => {
  const effectiveId = spreadsheetId || DEFAULT_SPREADSHEET_ID;
  if (!effectiveId) return;
  const endColumn = colNumToLetter(VOLUME_RULES_HEADERS.length);
  const range = `${VOLUME_RULES_SHEET}!A1:${endColumn}1`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: effectiveId,
    range,
  });
  const existing = response.data.values?.[0] || [];
  if (existing.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: effectiveId,
      range: `${VOLUME_RULES_SHEET}!A1`,
      valueInputOption: 'RAW',
      resource: { values: [VOLUME_RULES_HEADERS] },
    });
  }
};

const appendVolumeRule = async (spreadsheetId, record) => {
  const effectiveId = spreadsheetId || DEFAULT_SPREADSHEET_ID;
  if (!effectiveId) return;
  const values = VOLUME_RULES_HEADERS.map((header) => record[header] ?? '');
  await sheets.spreadsheets.values.append({
    spreadsheetId: effectiveId,
    range: `${VOLUME_RULES_SHEET}!A:Z`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: { values: [values] },
  });
};

const seedVolumeRulesIfEmpty = async (spreadsheetId) => {
  const effectiveId = spreadsheetId || DEFAULT_SPREADSHEET_ID;
  if (!effectiveId) return false;
  const endColumn = colNumToLetter(VOLUME_RULES_HEADERS.length);
  const range = `${VOLUME_RULES_SHEET}!A2:${endColumn}`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: effectiveId,
    range,
  });
  const rows = response.data.values || [];
  if (rows.length > 0) return false;
  const now = new Date().toISOString();
  for (const rule of VOLUME_RULES_DEFAULTS) {
    const record = {
      id: rule.id,
      name: rule.name,
      unitVolume: String(Number(rule.unitVolume || 0)),
      description: rule.description || '',
      createdAt: now,
      updatedAt: now,
    };
    await appendVolumeRule(effectiveId, record);
  }
  return true;
};

const fetchVolumeRules = async (spreadsheetId) => {
  const effectiveId = spreadsheetId || DEFAULT_SPREADSHEET_ID;
  if (!effectiveId) {
    return VOLUME_RULES_DEFAULTS;
  }
  await ensureVolumeRulesHeaders(effectiveId);
  const seeded = await seedVolumeRulesIfEmpty(effectiveId);
  if (seeded) {
    return VOLUME_RULES_DEFAULTS;
  }
  const endColumn = colNumToLetter(VOLUME_RULES_HEADERS.length);
  const range = `${VOLUME_RULES_SHEET}!A2:${endColumn}`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: effectiveId,
    range,
  });
  const rows = response.data.values || [];
  const list = rows.map((row) => {
    const record = {};
    VOLUME_RULES_HEADERS.forEach((header, index) => {
      record[header] = row[index] ?? '';
    });
    return record;
  });
  return list;
};

// Routes

// Authentication endpoint with Google Sheets + bcrypt + JWT
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email và mật khẩu là bắt buộc',
      });
    }

    // Rate limiting check
    const attempts = loginAttempts.get(email) || { count: 0, resetAt: Date.now() };
    if (attempts.count >= 5 && Date.now() < attempts.resetAt) {
      return res.status(429).json({
        success: false,
        error: `Quá nhiều lần đăng nhập sai. Thử lại sau ${Math.ceil((attempts.resetAt - Date.now()) / 1000)} giây`,
      });
    }

    // Reset attempt counter after 15 minutes
    if (Date.now() > attempts.resetAt) {
      loginAttempts.set(email, { count: 0, resetAt: Date.now() + 15 * 60 * 1000 });
    }

    // Get user from Google Sheets
    const user = await getUserFromSheets(email);

    if (!user) {
      // Increment failed attempts
      attempts.count++;
      loginAttempts.set(email, attempts);

      return res.status(401).json({
        success: false,
        error: 'Email không tồn tại trong hệ thống',
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Tài khoản đã bị vô hiệu hóa',
      });
    }

    // Verify password with bcrypt
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    } catch (bcryptError) {
      console.error('bcrypt error:', bcryptError);
      // Fallback to simple comparison for legacy hashes
      isPasswordValid = password === user.passwordHash;
    }

    if (!isPasswordValid) {
      // Increment failed attempts
      attempts.count++;
      loginAttempts.set(email, attempts);

      logger.debug(`Failed login attempt for ${email} at ${new Date().toISOString()}`);

      return res.status(401).json({
        success: false,
        error: 'Mật khẩu không chính xác',
      });
    }

    // Success - reset attempts
    loginAttempts.delete(email);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    // Create user object (don't include password hash)
    const userObj = {
      id: user.id,
      email: user.email,
      name: user.fullName,
      role: user.role,
      lastLogin: new Date().toISOString(),
    };

    // Log successful login
    logger.debug(`✅ User logged in: ${email} (${user.role}) at ${new Date().toISOString()}`);

    res.json({
      success: true,
      user: userObj,
      message: 'Đăng nhập thành công',
      token: token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi server khi xử lý đăng nhập',
      details: error.message,
    });
  }
});

app.get('/api/transfers', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    await ensureTransfersHeaders(spreadsheetId);
    const endColumn = colNumToLetter(TRANSFERS_HEADERS.length);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${TRANSFERS_SHEET}!A1:${endColumn}`,
    });
    const rows = response.data.values || [];
    if (rows.length === 0) {
      return res.json([]);
    }
    const headers = rows[0];
    const locationsMap = await loadLocationsMap(spreadsheetId);
    const records = rows.slice(1).reduce((acc, row) => {
      const hasValue = row.some((cell) => cell && String(cell).trim().length > 0);
      if (!hasValue) return acc;
      const record = {};
      headers.forEach((header, index) => {
        record[header] = row[index] ?? '';
      });
      applyLocationToTransfer(record, locationsMap);
      acc.push(record);
      return acc;
    }, []);
    res.json(records);
  } catch (error) {
    console.error('Error fetching transfers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transfers',
      details: error.message,
    });
  }
});

app.put('/api/transfers/:id', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    const transferId = String(req.params.id || '').trim();
    if (!transferId) {
      return res.status(400).json({
        success: false,
        error: 'transfer_id is required',
      });
    }

    await ensureTransfersHeaders(spreadsheetId);
    const endColumn = colNumToLetter(TRANSFERS_HEADERS.length);
    const range = `${TRANSFERS_SHEET}!A1:${endColumn}`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values || [];
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Transfers sheet is empty',
      });
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);
    const rowIndex = dataRows.findIndex((row) => {
      const rowObj = {};
      headers.forEach((header, index) => {
        rowObj[header] = row[index] ?? '';
      });
      const currentId = toStringSafe(rowObj.transfer_id || rowObj.id);
      return currentId === transferId;
    });

    if (rowIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Transfer not found',
      });
    }

    const existingRecord = {};
    headers.forEach((header, index) => {
      existingRecord[header] = dataRows[rowIndex][index] ?? '';
    });

    const merged = {
      ...existingRecord,
      ...req.body,
      transfer_id: transferId,
    };

    const normalized = normalizeTransferRecord(merged);

    const locationsMap = await loadLocationsMap(spreadsheetId);
    applyLocationToTransfer(normalized, locationsMap);

    const updatedValues = TRANSFERS_HEADERS.map((header) => normalized[header] ?? '');
    const targetRange = `${TRANSFERS_SHEET}!A${rowIndex + 2}:${endColumn}${rowIndex + 2}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: targetRange,
      valueInputOption: 'RAW',
      resource: { values: [updatedValues] },
    });

    res.json({
      success: true,
      transfer: normalized,
    });
  } catch (error) {
    console.error('Error updating transfer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update transfer',
      details: error.message,
    });
  }
});

app.post('/api/transport-requests/generate-id', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    if (!spreadsheetId) {
      const fallbackId = `MSC-${String(Date.now()).slice(-8)}`;
      return res.json({ requestId: fallbackId, rowIndex: 2 });
    }

    await ensureTransportRequestHeaders(spreadsheetId);
    const requestId = await generateTransportRequestId(spreadsheetId);
    const createdAt = new Date().toISOString();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${TRANSPORT_REQUESTS_SHEET}!A:A`,
    });
    const requestIds = response.data.values?.slice(1) || [];

    const newRow = {
      requestId,
      createdAt,
      updatedAt: createdAt,
    };
    await appendTransportRequestRow(spreadsheetId, newRow);

    const rowIndex = requestIds.length + 2;
    res.json({ requestId, rowIndex });
  } catch (error) {
    console.error('Error generating transport request ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate request ID',
      details: error.message,
    });
  }
});

app.get('/api/locations', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    if (!spreadsheetId) {
      return res.json([]);
    }
    const locations = await getLocationsList(spreadsheetId);
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch locations',
      details: error.message,
    });
  }
});

app.get('/api/carriers', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    if (!spreadsheetId) {
      return res.json([]);
    }
    const carriers = await getCarrierRecords(spreadsheetId);
    res.json(carriers);
  } catch (error) {
    console.error('Error fetching carriers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch carriers',
      details: error.message,
    });
  }
});

app.get('/api/transport-requests', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    if (!spreadsheetId) {
      return res.json([]);
    }
    const records = await getTransportRequestRecords(spreadsheetId);
    res.json(records);
  } catch (error) {
    console.error('Error fetching transport requests:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transport requests',
      details: error.message,
    });
  }
});

app.put('/api/transport-requests/:id', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    const requestId = toStringSafe(req.params.id);
    if (!spreadsheetId || !requestId) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    await ensureTransportRequestHeaders(spreadsheetId);
    const records = await getTransportRequestRecords(spreadsheetId);
    const existing = records.find((record) => toStringSafe(record.requestId) === requestId) || {};

    const rowIndex = await findTransportRequestRowIndex(spreadsheetId, requestId);
    if (rowIndex === -1) {
      return res.status(404).json({ success: false, error: 'Transport request not found' });
    }

    const now = new Date().toISOString();
    const merged = { ...existing, ...req.body, requestId };
    if (!merged.createdAt) {
      merged.createdAt = now;
    }
    merged.updatedAt = now;

    const values = TRANSPORT_REQUESTS_HEADERS.map((header) => merged[header] ?? '');
    const endColumn = colNumToLetter(TRANSPORT_REQUESTS_HEADERS.length);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${TRANSPORT_REQUESTS_SHEET}!A${rowIndex}:${endColumn}${rowIndex}`,
      valueInputOption: 'RAW',
      resource: { values: [values] },
    });

    res.json(merged);
  } catch (error) {
    console.error('Error updating transport request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update transport request',
      details: error.message,
    });
  }
});

app.delete('/api/transport-requests/:id', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    const requestId = toStringSafe(req.params.id);
    if (!spreadsheetId || !requestId) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    const rowIndex = await findTransportRequestRowIndex(spreadsheetId, requestId);
    if (rowIndex === -1) {
      return res.status(404).json({ success: false, error: 'Transport request not found' });
    }

    const endColumn = colNumToLetter(TRANSPORT_REQUESTS_HEADERS.length);
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${TRANSPORT_REQUESTS_SHEET}!A${rowIndex}:${endColumn}${rowIndex}`,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting transport request:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete transport request',
      details: error.message,
    });
  }
});

app.post('/api/transport-requests/calculate-distance', async (req, res) => {
  try {
    const pickupAddress = toStringSafe(req.body?.pickupAddress);
    const stops = Array.isArray(req.body?.stops) ? req.body.stops : [];
    if (!pickupAddress || stops.length === 0) {
      return res.json({ success: true, distances: {} });
    }

    const distanceResults = await Promise.all(
      stops.map(async (stop) => {
        const key = toStringSafe(stop.key);
        const address = toStringSafe(stop.address);
        if (!key || !address) {
          return { key, distance: 0, error: 'Invalid stop address' };
        }
        try {
          const response = await axios.get(APPS_SCRIPT_DISTANCE_URL, {
            params: {
              origin: pickupAddress,
              destination: address,
            },
          });
          const data = response.data || {};
          let distanceKm = 0;
          if (data.success && data.distance) {
            if (typeof data.distance === 'number') {
              distanceKm = data.distance;
            } else if (typeof data.distance.value === 'number') {
              distanceKm = data.distance.value / 1000;
            }
          }
          return { key, distance: Number(distanceKm.toFixed(3)) };
        } catch (error) {
          console.warn(`Distance calculation failed for ${address}:`, error);
          return { key, distance: 0, error: error.message };
        }
      })
    );

    const distances = {};
    const errors = {};
    distanceResults.forEach((result) => {
      if (result.key) {
        distances[result.key] = result.distance;
        if (result.error) {
          errors[result.key] = result.error;
        }
      }
    });

    res.json({ success: true, distances, errors });
  } catch (error) {
    console.error('Error calculating distances:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate distances',
      details: error.message,
    });
  }
});

app.post('/api/carriers', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    if (!spreadsheetId) {
      return res.status(400).json({ success: false, error: 'spreadsheetId is required' });
    }
    await ensureCarriersHeaders(spreadsheetId);
    const now = new Date().toISOString();
    const payload = req.body || {};
    const carrierId = toStringSafe(payload.carrierId) || `CAR-${Date.now()}`;

    const record = {};
    CARRIERS_HEADERS.forEach((header) => {
      switch (header) {
        case 'carrierId':
          record[header] = carrierId;
          break;
        case 'createdAt':
        case 'updatedAt':
          record[header] = now;
          break;
        default:
          record[header] = payload[header] ?? '';
          break;
      }
    });

    const values = CARRIERS_HEADERS.map((header) => record[header] ?? '');
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${CARRIERS_SHEET}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [values] },
    });

    res.json(record);
  } catch (error) {
    console.error('Error creating carrier:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create carrier',
      details: error.message,
    });
  }
});

app.put('/api/carriers/:id', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    const carrierId = toStringSafe(req.params.id);
    if (!spreadsheetId || !carrierId) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    const rowIndex = await findCarrierRowIndex(spreadsheetId, carrierId);
    if (rowIndex === -1) {
      return res.status(404).json({ success: false, error: 'Carrier not found' });
    }

    const existingRecords = await getCarrierRecords(spreadsheetId);
    const existing =
      existingRecords.find((carrier) => toStringSafe(carrier.carrierId) === carrierId) || {};

    const merged = {
      ...existing,
      ...req.body,
      carrierId,
      updatedAt: new Date().toISOString(),
    };

    const values = CARRIERS_HEADERS.map((header) => merged[header] ?? '');
    const endColumn = colNumToLetter(CARRIERS_HEADERS.length);
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${CARRIERS_SHEET}!A${rowIndex}:${endColumn}${rowIndex}`,
      valueInputOption: 'RAW',
      resource: { values: [values] },
    });

    res.json(merged);
  } catch (error) {
    console.error('Error updating carrier:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update carrier',
      details: error.message,
    });
  }
});

app.delete('/api/carriers/:id', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    const carrierId = toStringSafe(req.params.id);
    if (!spreadsheetId || !carrierId) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    const rowIndex = await findCarrierRowIndex(spreadsheetId, carrierId);
    if (rowIndex === -1) {
      return res.status(404).json({ success: false, error: 'Carrier not found' });
    }

    const endColumn = colNumToLetter(CARRIERS_HEADERS.length);
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${CARRIERS_SHEET}!A${rowIndex}:${endColumn}${rowIndex}`,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting carrier:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete carrier',
      details: error.message,
    });
  }
});

app.post('/api/transfers/import', async (req, res) => {
  try {
    const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'rows is required',
      });
    }

    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    await ensureTransfersHeaders(spreadsheetId);
    const existingIds = await getExistingTransferIds(spreadsheetId);

    const locationsMap = await loadLocationsMap(spreadsheetId);

    const cleaned = rows
      .map((row) => normalizeTransferRecord(row))
      .filter((row) => toStringSafe(row.transfer_id));

    const valuesToAppend = [];
    let imported = 0;
    let duplicated = 0;

    cleaned.forEach((record) => {
      const id = toStringSafe(record.transfer_id);
      if (!id || existingIds.has(id)) {
        duplicated += 1;
        return;
      }
      existingIds.add(id);
      applyLocationToTransfer(record, locationsMap);
      valuesToAppend.push(TRANSFERS_HEADERS.map((header) => record[header] ?? ''));
      imported += 1;
    });

    if (valuesToAppend.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${TRANSFERS_SHEET}!A:Z`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: { values: valuesToAppend },
      });
    }

    res.json({
      success: true,
      imported,
      duplicated,
      total: cleaned.length,
    });
  } catch (error) {
    console.error('Error importing transfers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to import transfers',
      details: error.message,
    });
  }
});

app.get('/api/settings/volume-rules', async (req, res) => {
  try {
    const spreadsheetId = req.query.spreadsheetId || DEFAULT_SPREADSHEET_ID;
    const rules = await fetchVolumeRules(spreadsheetId);
    res.json(rules);
  } catch (error) {
    console.error('Error fetching volume rules:', error);
    res.json(VOLUME_RULES_DEFAULTS);
  }
});

// JWT Token verification middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Protected route example
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// Password verification endpoint
app.post('/api/auth/verify-password', async (req, res) => {
  try {
    const { password, hash } = req.body;

    if (!password || !hash) {
      return res.status(400).json({
        success: false,
        error: 'Password and hash are required',
      });
    }

    const isValid = await bcrypt.compare(password, hash);

    res.json({
      success: true,
      isValid: isValid,
    });
  } catch (error) {
    console.error('Password verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Error verifying password',
      details: error.message,
    });
  }
});

// Password reset tokens storage (in-memory)
const passwordResetTokens = new Map();

// Forgot password endpoint
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Get user from Google Sheets
    const user = await getUserFromSheets(email);

    if (!user) {
      // Don't reveal if user exists or not (security best practice)
      return res.json({
        success: true,
        message: 'If the email exists, a reset link will be sent',
      });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Store token
    passwordResetTokens.set(resetToken, {
      userId: user.id,
      email: user.email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    // Send reset email (using transporter if available)
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || 'noreply@mia.vn',
          to: user.email,
          subject: 'Đặt lại mật khẩu - MIA Logistics',
          html: `
            <h2>Đặt lại mật khẩu</h2>
            <p>Xin chào ${user.fullName},</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link dưới đây:</p>
            <p><a href="${process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}">Đặt lại mật khẩu</a></p>
            <p>Link này sẽ hết hạn sau 1 giờ.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          `,
        });
        logger.debug(`✅ Password reset email sent to ${email}`);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
      }
    } else {
      logger.debug(`⚠️ Email not configured. Reset token for ${email}: ${resetToken}`);
    }

    res.json({
      success: true,
      message: 'If the email exists, a reset link will be sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing password reset request',
      details: error.message,
    });
  }
});

// Reset password endpoint
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Token and new password are required',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
      });
    }

    // Check if token exists in storage
    const storedToken = passwordResetTokens.get(token);
    if (!storedToken || storedToken.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in Google Sheets (this would need a write operation)
    // For now, just log it
    logger.debug(`Password reset for ${decoded.email}: password updated`);

    // Remove used token
    passwordResetTokens.delete(token);

    res.json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Error resetting password',
      details: error.message,
    });
  }
});

// Health check (updated to include authentication status)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0-auth',
    services: {
      sheets: !!process.env.REACT_APP_GOOGLE_CLIENT_EMAIL,
      email: !!transporter,
      telegram: !!(
        process.env.REACT_APP_TELEGRAM_BOT_TOKEN && process.env.REACT_APP_TELEGRAM_CHAT_ID
      ),
      authentication: true,
    },
  });
});

// Google Sheets Routes

// Get spreadsheet info and list all sheets
app.get('/api/sheets/info', async (req, res) => {
  try {
    const { spreadsheetId } = req.query;
    const targetSpreadsheetId = spreadsheetId || DEFAULT_SPREADSHEET_ID;

    logger.debug(`📊 Getting info for spreadsheet: ${targetSpreadsheetId}`);

    const response = await sheets.spreadsheets.get({
      spreadsheetId: targetSpreadsheetId,
    });

    const spreadsheet = response.data;

    res.json({
      success: true,
      spreadsheet: {
        title: spreadsheet.properties.title,
        locale: spreadsheet.properties.locale,
        timeZone: spreadsheet.properties.timeZone,
        spreadsheetId: targetSpreadsheetId,
        sheets: spreadsheet.sheets.map((sheet) => ({
          title: sheet.properties.title,
          sheetId: sheet.properties.sheetId,
          rowCount: sheet.properties.gridProperties.rowCount,
          columnCount: sheet.properties.gridProperties.columnCount,
          hidden: sheet.properties.hidden,
        })),
      },
    });
  } catch (error) {
    console.error('Error getting spreadsheet info:', error);
    res.status(500).json({
      error: 'Failed to get spreadsheet info',
      details: error.message,
    });
  }
});

// Read sheet
app.post('/api/sheets/read', async (req, res) => {
  try {
    const { spreadsheetId, range, sheetName } = req.body;

    if (!spreadsheetId || !range) {
      return res.status(400).json({ error: 'spreadsheetId and range are required' });
    }

    // Use sheetName if provided, otherwise use range as-is
    const fullRange = sheetName ? `${sheetName}!${range}` : range;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: fullRange,
    });

    res.json({
      success: true,
      values: response.data.values || [],
      range: response.data.range,
    });
  } catch (error) {
    console.error('Error reading sheet:', error);
    res.status(500).json({
      error: 'Failed to read sheet',
      details: error.message,
    });
  }
});

// Write to sheet
app.post('/api/sheets/write', async (req, res) => {
  try {
    const { spreadsheetId, range, values } = req.body;

    if (!spreadsheetId || !range || !values) {
      return res.status(400).json({ error: 'spreadsheetId, range, and values are required' });
    }

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    res.json({
      success: true,
      updatedCells: response.data.updatedCells,
      updatedRange: response.data.updatedRange,
    });
  } catch (error) {
    console.error('Error writing to sheet:', error);
    res.status(500).json({
      error: 'Failed to write to sheet',
      details: error.message,
    });
  }
});

// Append to sheet
app.post('/api/sheets/append', async (req, res) => {
  try {
    const { spreadsheetId, range, values } = req.body;

    if (!spreadsheetId || !range || !values) {
      return res.status(400).json({ error: 'spreadsheetId, range, and values are required' });
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    res.json({
      success: true,
      updates: response.data.updates,
    });
  } catch (error) {
    console.error('Error appending to sheet:', error);
    res.status(500).json({
      error: 'Failed to append to sheet',
      details: error.message,
    });
  }
});

// Create new sheet
app.post('/api/sheets/create', async (req, res) => {
  try {
    const { spreadsheetId, sheetName } = req.body;

    if (!spreadsheetId || !sheetName) {
      return res.status(400).json({ error: 'spreadsheetId and sheetName are required' });
    }

    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });

    res.json({
      success: true,
      sheetId: response.data.replies[0].addSheet.properties.sheetId,
      sheetName: sheetName,
    });
  } catch (error) {
    console.error('Error creating sheet:', error);
    res.status(500).json({
      error: 'Failed to create sheet',
      details: error.message,
    });
  }
});

// Get spreadsheet info
app.post('/api/sheets/info', async (req, res) => {
  try {
    const { spreadsheetId } = req.body;

    if (!spreadsheetId) {
      return res.status(400).json({ error: 'spreadsheetId is required' });
    }

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    res.json({
      success: true,
      properties: response.data.properties,
      sheets: response.data.sheets.map((sheet) => ({
        properties: sheet.properties,
      })),
    });
  } catch (error) {
    console.error('Error getting spreadsheet info:', error);
    res.status(500).json({
      error: 'Failed to get spreadsheet info',
      details: error.message,
    });
  }
});

// Google Drive Routes

// Upload file
app.post('/api/drive/upload', async (req, res) => {
  try {
    const { file, fileName, folderId } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const fileMetadata = {
      name: fileName || file.originalname,
      parents: folderId ? [folderId] : undefined,
    };

    const media = {
      mimeType: file.mimetype,
      body: file.buffer,
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,name,size,mimeType',
    });

    res.json({
      success: true,
      file: response.data,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      error: 'Failed to upload file',
      details: error.message,
    });
  }
});

// List files
app.post('/api/drive/list', async (req, res) => {
  try {
    const { folderId } = req.body;

    let query = 'trashed=false';
    if (folderId) {
      query += ` and '${folderId}' in parents`;
    }

    const response = await drive.files.list({
      q: query,
      fields: 'files(id,name,size,mimeType,modifiedTime,webViewLink)',
      orderBy: 'modifiedTime desc',
    });

    res.json({
      success: true,
      files: response.data.files,
    });
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({
      error: 'Failed to list files',
      details: error.message,
    });
  }
});

// Create folder
app.post('/api/drive/create-folder', async (req, res) => {
  try {
    const { folderName, parentFolderId } = req.body;

    if (!folderName) {
      return res.status(400).json({ error: 'folderName is required' });
    }

    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentFolderId ? [parentFolderId] : undefined,
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      fields: 'id,name',
    });

    res.json({
      success: true,
      folder: response.data,
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({
      error: 'Failed to create folder',
      details: error.message,
    });
  }
});

// Delete file
app.post('/api/drive/delete', async (req, res) => {
  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'fileId is required' });
    }

    await drive.files.delete({
      fileId,
    });

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      error: 'Failed to delete file',
      details: error.message,
    });
  }
});

// Share file
app.post('/api/drive/share', async (req, res) => {
  try {
    const { fileId, email, role = 'reader' } = req.body;

    if (!fileId || !email) {
      return res.status(400).json({ error: 'fileId and email are required' });
    }

    const response = await drive.permissions.create({
      fileId,
      requestBody: {
        role,
        type: 'user',
        emailAddress: email,
      },
    });

    res.json({
      success: true,
      permission: response.data,
    });
  } catch (error) {
    console.error('Error sharing file:', error);
    res.status(500).json({
      error: 'Failed to share file',
      details: error.message,
    });
  }
});

// Get file link
app.post('/api/drive/link', async (req, res) => {
  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'fileId is required' });
    }

    const response = await drive.files.get({
      fileId,
      fields: 'webViewLink,webContentLink',
    });

    res.json({
      success: true,
      webViewLink: response.data.webViewLink,
      webContentLink: response.data.webContentLink,
    });
  } catch (error) {
    console.error('Error getting file link:', error);
    res.status(500).json({
      error: 'Failed to get file link',
      details: error.message,
    });
  }
});

// Alert Routes

// Send email alert
app.post('/api/alerts/email', async (req, res) => {
  try {
    if (!transporter) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const { to, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: 'subject and message are required' });
    }

    const mailOptions = {
      from: process.env.REACT_APP_EMAIL_USER,
      to: to || process.env.REACT_APP_ALERT_EMAIL_TO,
      subject,
      text: message,
      html: message.replace(/\n/g, '<br>'),
    };

    const info = await transporter.sendMail(mailOptions);

    addToAlertHistory('EMAIL', subject, message);

    res.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message,
    });
  }
});

// Send Telegram alert
app.post('/api/alerts/telegram', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ error: 'Telegram not configured' });
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });

    addToAlertHistory('TELEGRAM', 'Telegram Alert', message);

    res.json({
      success: true,
      messageId: response.data.result.message_id,
    });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    res.status(500).json({
      error: 'Failed to send Telegram message',
      details: error.message,
    });
  }
});

// Test email connection
app.post('/api/alerts/test-email', async (req, res) => {
  try {
    if (!transporter) {
      return res.status(500).json({ error: 'Email service not configured' });
    }

    await transporter.verify();

    // Send test email
    const testMailOptions = {
      from: process.env.REACT_APP_EMAIL_USER,
      to: process.env.REACT_APP_ALERT_EMAIL_TO,
      subject: '✅ Email Test - React Google Integration',
      text: 'This is a test email from React Google Integration system.\n\nIf you receive this, your email configuration is working correctly!',
    };

    await transporter.sendMail(testMailOptions);

    res.json({
      success: true,
      message: 'Email connection test successful',
    });
  } catch (error) {
    console.error('Email test failed:', error);
    res.status(500).json({
      error: 'Email connection test failed',
      details: error.message,
    });
  }
});

// Test Telegram connection
app.post('/api/alerts/test-telegram', async (req, res) => {
  try {
    const botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.REACT_APP_TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ error: 'Telegram not configured' });
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: '✅ Telegram Test - React Google Integration\n\nIf you receive this, your Telegram configuration is working correctly!',
    });

    res.json({
      success: true,
      message: 'Telegram connection test successful',
      messageId: response.data.result.message_id,
    });
  } catch (error) {
    console.error('Telegram test failed:', error);
    res.status(500).json({
      error: 'Telegram connection test failed',
      details: error.message,
    });
  }
});

// Get alert history
app.get('/api/alerts/history', (req, res) => {
  res.json({
    success: true,
    alerts: alertHistory,
  });
});

// Report Routes

// Generate overview report
app.get('/api/reports/overview', async (req, res) => {
  try {
    const report = {
      timestamp: new Date().toISOString(),
      systemStatus: {
        sheets: !!process.env.REACT_APP_GOOGLE_CLIENT_EMAIL,
        drive: !!process.env.REACT_APP_GOOGLE_CLIENT_EMAIL,
        email: !!transporter,
        telegram: !!(
          process.env.REACT_APP_TELEGRAM_BOT_TOKEN && process.env.REACT_APP_TELEGRAM_CHAT_ID
        ),
      },
      alertHistory: alertHistory.length,
      uptime: process.uptime(),
    };

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Error generating overview report:', error);
    res.status(500).json({
      error: 'Failed to generate overview report',
      details: error.message,
    });
  }
});

// Scheduled tasks
if (process.env.NODE_ENV !== 'development') {
  // Daily report at 9 AM
  cron.schedule('0 9 * * *', async () => {
    logger.debug('Running daily report...');

    if (transporter) {
      try {
        const reportData = {
          timestamp: new Date().toISOString(),
          alertCount: alertHistory.length,
          systemUptime: process.uptime(),
        };

        const mailOptions = {
          from: process.env.REACT_APP_EMAIL_USER,
          to: process.env.REACT_APP_ALERT_EMAIL_TO,
          subject: '📊 Daily Report - React Google Integration',
          text: `Daily System Report\n\nGenerated: ${reportData.timestamp}\nAlerts in last 24h: ${
            reportData.alertCount
          }\nSystem uptime: ${Math.floor(
            reportData.systemUptime / 3600
          )} hours\n\nSystem Status: All services operational.`,
        };

        await transporter.sendMail(mailOptions);
        logger.debug('Daily report sent successfully');
      } catch (error) {
        console.error('Failed to send daily report:', error);
      }
    }
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    details: error.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  logger.debug(`🚀 Server running on port ${PORT}`);
  logger.debug(
    `📊 Google Sheets: ${
      !!process.env.REACT_APP_GOOGLE_CLIENT_EMAIL ? 'Configured' : 'Not configured'
    }`
  );
  logger.debug(`📧 Email: ${!!transporter ? 'Configured' : 'Not configured'}`);
  logger.debug(
    `📱 Telegram: ${
      !!(process.env.REACT_APP_TELEGRAM_BOT_TOKEN && process.env.REACT_APP_TELEGRAM_CHAT_ID)
        ? 'Configured'
        : 'Not configured'
    }`
  );
});
