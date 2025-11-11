#!/usr/bin/env node

/**
 * Verify Migration Script
 *
 * Script để verify data integrity sau khi migration
 * Kiểm tra:
 * - Row count
 * - Column structure
 * - Data types
 * - Required fields
 *
 * Usage:
 *   node backend/scripts/verify-migration.js --sheet Carriers
 *   node backend/scripts/verify-migration.js --all
 */

const { google } = require('googleapis');
const path = require('path');

// Configuration
const SPREADSHEET_ID =
  process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '../sinuous-aviary-474820-e3-c442968a0e87.json');

// Parse command line arguments
const args = process.argv.slice(2);
const sheetArg = args.findIndex((arg) => arg === '--sheet');
const allArg = args.includes('--all');

const TARGET_SHEET = sheetArg !== -1 ? args[sheetArg + 1] : null;

if (!TARGET_SHEET && !allArg) {
  console.error('❌ Error: --sheet or --all argument is required');
  console.log('\nUsage:');
  console.log('  node backend/scripts/verify-migration.js --sheet Carriers');
  console.log('  node backend/scripts/verify-migration.js --all');
  process.exit(1);
}

// Schema definitions for validation
const SCHEMAS = {
  Carriers: {
    required: ['id', 'name'],
    types: {
      id: 'string',
      name: 'string',
      email: 'email',
      phone: 'phone',
    },
  },
  Locations: {
    required: ['id', 'name', 'address'],
    types: {
      id: 'string',
      name: 'string',
      address: 'string',
    },
  },
  Transfers: {
    required: ['id', 'fromLocation', 'toLocation', 'date'],
    types: {
      id: 'string',
      date: 'date',
      volume: 'number',
    },
  },
  Users: {
    required: ['id', 'email', 'role'],
    types: {
      id: 'string',
      email: 'email',
      role: 'string',
    },
  },
};

/**
 * Initialize Google Sheets API
 */
async function initSheetsAPI() {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
  } catch (error) {
    console.error('❌ Error initializing Google Sheets API:', error.message);
    throw error;
  }
}

/**
 * Get all sheet names
 */
async function getSheetNames(sheets) {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    return response.data.sheets.map((sheet) => sheet.properties.title);
  } catch (error) {
    console.error('❌ Error getting sheet names:', error.message);
    throw error;
  }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone format
 */
function isValidPhone(phone) {
  return /^[\d\s\-\+\(\)]+$/.test(phone);
}

/**
 * Validate date format
 */
function isValidDate(date) {
  return !isNaN(Date.parse(date));
}

/**
 * Validate data type
 */
function validateType(value, type) {
  if (!value) return true; // Empty values are ok unless required

  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return !isNaN(parseFloat(value));
    case 'email':
      return isValidEmail(value);
    case 'phone':
      return isValidPhone(value);
    case 'date':
      return isValidDate(value);
    default:
      return true;
  }
}

/**
 * Verify a single sheet
 */
async function verifySheet(sheets, sheetName) {
  console.log(`\n🔍 Verifying sheet: ${sheetName}`);
  console.log('='.repeat(60));

  try {
    // Get sheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      console.log('⚠️  Sheet is empty');
      return {
        sheet: sheetName,
        valid: true,
        warnings: ['Sheet is empty'],
        errors: [],
      };
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    console.log(`\n📊 Basic Stats:`);
    console.log(`   Columns: ${headers.length}`);
    console.log(`   Rows: ${dataRows.length}`);
    console.log(`   Headers: ${headers.join(', ')}`);

    // Get schema if exists
    const schema = SCHEMAS[sheetName];
    const warnings = [];
    const errors = [];

    if (!schema) {
      warnings.push('No validation schema defined for this sheet');
      console.log(`\n⚠️  ${warnings[0]}`);
    } else {
      console.log('\n✅ Validation Schema Found');

      // Check required fields
      console.log(`\n🔍 Checking Required Fields:`);
      schema.required.forEach((field) => {
        if (!headers.includes(field)) {
          errors.push(`Missing required column: ${field}`);
          console.log(`   ❌ Missing: ${field}`);
        } else {
          console.log(`   ✅ Found: ${field}`);
        }
      });

      // Validate data types
      console.log(`\n🔍 Validating Data Types:`);
      let typeErrors = 0;
      dataRows.forEach((row, rowIndex) => {
        headers.forEach((header, colIndex) => {
          const value = row[colIndex];
          const expectedType = schema.types?.[header];

          if (expectedType && value) {
            if (!validateType(value, expectedType)) {
              typeErrors++;
              if (typeErrors <= 5) {
                // Show first 5 errors only
                errors.push(
                  `Row ${rowIndex + 2}, Column "${header}": Invalid ${expectedType} format ("${value}")`
                );
              }
            }
          }
        });
      });

      if (typeErrors === 0) {
        console.log('   ✅ All data types valid');
      } else {
        console.log(`   ❌ Found ${typeErrors} type validation errors`);
        if (typeErrors > 5) {
          console.log(`   (Showing first 5 errors only)`);
        }
      }

      // Check for duplicate IDs
      if (headers.includes('id')) {
        console.log(`\n🔍 Checking for Duplicate IDs:`);
        const idColumn = headers.indexOf('id');
        const ids = dataRows.map((row) => row[idColumn]).filter((id) => id);
        const uniqueIds = new Set(ids);

        if (ids.length !== uniqueIds.size) {
          const duplicateCount = ids.length - uniqueIds.size;
          errors.push(`Found ${duplicateCount} duplicate ID(s)`);
          console.log(`   ❌ Found ${duplicateCount} duplicate(s)`);
        } else {
          console.log('   ✅ All IDs unique');
        }
      }

      // Check for empty required fields
      if (schema.required.length > 0) {
        console.log(`\n🔍 Checking Required Field Values:`);
        let emptyRequiredCount = 0;

        dataRows.forEach((row, rowIndex) => {
          schema.required.forEach((field) => {
            const colIndex = headers.indexOf(field);
            if (colIndex !== -1 && !row[colIndex]) {
              emptyRequiredCount++;
              if (emptyRequiredCount <= 5) {
                warnings.push(`Row ${rowIndex + 2}: Required field "${field}" is empty`);
              }
            }
          });
        });

        if (emptyRequiredCount === 0) {
          console.log('   ✅ All required fields have values');
        } else {
          console.log(`   ⚠️  Found ${emptyRequiredCount} empty required field(s)`);
          if (emptyRequiredCount > 5) {
            console.log(`   (Showing first 5 warnings only)`);
          }
        }
      }
    }

    // Print summary
    console.log(`\n📋 Verification Summary:`);
    console.log(`   Errors: ${errors.length}`);
    console.log(`   Warnings: ${warnings.length}`);

    if (errors.length > 0) {
      console.log(`\n❌ Errors:`);
      errors.slice(0, 10).forEach((error) => console.log(`   - ${error}`));
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more`);
      }
    }

    if (warnings.length > 0) {
      console.log(`\n⚠️  Warnings:`);
      warnings.slice(0, 10).forEach((warning) => console.log(`   - ${warning}`));
      if (warnings.length > 10) {
        console.log(`   ... and ${warnings.length - 10} more`);
      }
    }

    const isValid = errors.length === 0;
    console.log(`\n${isValid ? '✅' : '❌'} Sheet validation: ${isValid ? 'PASSED' : 'FAILED'}`);

    return {
      sheet: sheetName,
      valid: isValid,
      rowCount: dataRows.length,
      columnCount: headers.length,
      warnings,
      errors,
    };
  } catch (error) {
    console.error(`❌ Error verifying sheet:`, error.message);
    return {
      sheet: sheetName,
      valid: false,
      errors: [error.message],
    };
  }
}

/**
 * Main verification function
 */
async function verifyMigration() {
  console.log('🚀 Starting Migration Verification...\n');
  console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}\n`);

  try {
    // Initialize API
    const sheets = await initSheetsAPI();
    console.log('✅ Google Sheets API initialized');

    // Get sheets to verify
    let sheetsToVerify;
    if (allArg) {
      const allSheets = await getSheetNames(sheets);
      sheetsToVerify = allSheets.filter((name) => SCHEMAS[name]); // Only sheets with schemas
      console.log(`\n📋 Verifying ${sheetsToVerify.length} sheets with defined schemas`);
    } else {
      sheetsToVerify = [TARGET_SHEET];
      console.log(`\n🎯 Verifying single sheet: ${TARGET_SHEET}`);
    }

    // Verify each sheet
    const results = [];
    for (const sheetName of sheetsToVerify) {
      const result = await verifySheet(sheets, sheetName);
      results.push(result);
    }

    // Overall summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 OVERALL VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`\nTotal sheets verified: ${results.length}`);
    console.log(`Passed: ${results.filter((r) => r.valid).length}`);
    console.log(`Failed: ${results.filter((r) => !r.valid).length}`);
    console.log(`Total rows: ${results.reduce((sum, r) => sum + (r.rowCount || 0), 0)}`);
    console.log(`Total errors: ${results.reduce((sum, r) => sum + r.errors.length, 0)}`);
    console.log(`Total warnings: ${results.reduce((sum, r) => sum + r.warnings.length, 0)}`);

    if (results.every((r) => r.valid)) {
      console.log('\n✅ All sheets passed validation!');
    } else {
      console.log('\n❌ Some sheets failed validation. Please review errors above.');
    }

    return results;
  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  }
}

// Run verification if called directly
if (require.main === module) {
  verifyMigration()
    .then((results) => {
      const allValid = results.every((r) => r.valid);
      process.exit(allValid ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { verifyMigration, verifySheet };
