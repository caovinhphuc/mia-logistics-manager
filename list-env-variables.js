#!/usr/bin/env node

/**
 * Script để liệt kê tất cả Environment Variables cần cấu hình
 * Sử dụng: node scripts/list-env-variables.js
 */

const fs = require('fs');
const path = require('path');
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  header: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.blue}${msg}${colors.reset}`),
  item: (name, desc, required = false) => {
    const req = required
      ? `${colors.red}[BẮT BUỘC]${colors.reset}`
      : `${colors.yellow}[TÙY CHỌN]${colors.reset}`;
    console.log(`  ${req} ${colors.green}${name}${colors.reset}`);
    if (desc) console.log(`    ${desc}`);
  },
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
};

function readEnvExample() {
  const envPath = path.join(__dirname, '..', 'env.example');
  if (!fs.existsSync(envPath)) {
    log.info('File env.example không tồn tại');
    return null;
  }
  return fs.readFileSync(envPath, 'utf-8');
}

function parseEnvFile(content) {
  const variables = [];
  const lines = content.split('\n');
  let currentSection = 'General';

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip comments và empty lines
    if (!trimmed || trimmed.startsWith('#')) {
      if (trimmed.startsWith('#') && trimmed.length > 1) {
        currentSection = trimmed.replace(/^#+\s*/, '');
      }
      continue;
    }

    // Parse variable
    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) {
      const [, name, value] = match;
      const isRequired = !value.includes('your_') && !value.includes('optional');
      variables.push({
        name,
        value: value.replace(/^["']|["']$/g, ''),
        section: currentSection,
        required: isRequired && !value.includes('optional'),
      });
    }
  }

  return variables;
}

function categorizeVariables(variables) {
  const categories = {
    'Google Services': [],
    Telegram: [],
    Email: [],
    Other: [],
  };

  variables.forEach((v) => {
    const name = v.name.toUpperCase();
    if (name.includes('GOOGLE')) {
      categories['Google Services'].push(v);
    } else if (name.includes('TELEGRAM')) {
      categories['Telegram'].push(v);
    } else if (name.includes('EMAIL') || name.includes('SMTP') || name.includes('SENDGRID')) {
      categories['Email'].push(v);
    } else {
      categories['Other'].push(v);
    }
  });

  return categories;
}

function displayVariables() {
  log.header('📋 DANH SÁCH ENVIRONMENT VARIABLES CẦN CẤU HÌNH');
  console.log('='.repeat(60));

  const content = readEnvExample();
  if (!content) {
    log.info('Không thể đọc file env.example');
    return;
  }

  const variables = parseEnvFile(content);
  const categories = categorizeVariables(variables);

  // Required variables
  log.section('\n🔴 BẮT BUỘC - Các biến quan trọng nhất:');
  const required = variables.filter(
    (v) => v.required || v.name.includes('GOOGLE_SERVICE') || v.name.includes('PRIVATE_KEY')
  );
  required.forEach((v) => {
    log.item(v.name, `Giá trị mẫu: ${v.value.substring(0, 50)}...`, true);
  });

  // Google Services
  if (categories['Google Services'].length > 0) {
    log.section('\n📊 Google Services:');
    categories['Google Services'].forEach((v) => {
      log.item(v.name, v.required ? 'Bắt buộc cho Google integration' : 'Tùy chọn');
    });
  }

  // Telegram
  if (categories['Telegram'].length > 0) {
    log.section('\n💬 Telegram Bot:');
    categories['Telegram'].forEach((v) => {
      log.item(v.name, v.required ? 'Bắt buộc cho Telegram bot' : 'Tùy chọn');
    });
  }

  // Email
  if (categories['Email'].length > 0) {
    log.section('\n📧 Email Services:');
    categories['Email'].forEach((v) => {
      log.item(v.name, v.required ? 'Bắt buộc cho email service' : 'Tùy chọn');
    });
  }

  // Other
  if (categories['Other'].length > 0) {
    log.section('\n🔧 Other Services:');
    categories['Other'].forEach((v) => {
      log.item(v.name, 'Tùy chọn');
    });
  }

  // Instructions
  log.section('\n📝 HƯỚNG DẪN CẤU HÌNH:');
  console.log(`
  1. Truy cập: https://github.com/LauCaKeo/mia-vn-google-integration-v1.0/settings/secrets/actions
  2. Click "New repository secret"
  3. Thêm từng biến với Name và Secret value
  4. Xem chi tiết: docs/GITHUB_ENV_VARIABLES_GUIDE.md
  `);

  log.success(`Tổng cộng: ${variables.length} biến môi trường`);
  log.info(`Có ${required.length} biến bắt buộc`);
}

// Run
displayVariables();
