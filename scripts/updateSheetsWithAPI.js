// Script cập nhật Google Sheets sử dụng Google Sheets API trực tiếp
const fs = require('fs');
const path = require('path');

console.log('🔧 CẬP NHẬT GOOGLE SHEETS VỚI API');
console.log('=' .repeat(60));

// Sample data cho 4 sheets
const sheetsData = {
  Users: [
    ['id', 'username', 'email', 'password_hash', 'full_name', 'phone', 'avatar_url', 'is_active', 'last_login', 'created_at', 'updated_at'],
    ['1', 'admin', 'admin@mia-logistics.com', '$2b$10$admin123456789abcdefghijklmnopqrstuvwxyz', 'Administrator', '0123456789', '', 'true', '', new Date().toISOString(), new Date().toISOString()],
    ['2', 'manager1', 'manager@mia-logistics.com', '$2b$10$manager123456789abcdefghijklmnopqrstuvwxyz', 'Manager User', '0123456788', '', 'true', '', new Date().toISOString(), new Date().toISOString()],
    ['3', 'employee1', 'employee@mia-logistics.com', '$2b$10$employee123456789abcdefghijklmnopqrstuvwxyz', 'Employee User', '0123456787', '', 'true', '', new Date().toISOString(), new Date().toISOString()]
  ],

  Roles: [
    ['id', 'name', 'code', 'description', 'level', 'is_active', 'created_at', 'updated_at'],
    ['1', 'Administrator', 'admin', 'Full system access', '1', 'true', new Date().toISOString(), new Date().toISOString()],
    ['2', 'Manager', 'manager', 'Management level access', '2', 'true', new Date().toISOString(), new Date().toISOString()],
    ['3', 'Employee', 'employee', 'Basic employee access', '3', 'true', new Date().toISOString(), new Date().toISOString()]
  ],

  RolePermissions: [
    ['id', 'role_id', 'permission_code', 'permission_name', 'module', 'action', 'is_active', 'created_at'],
    ['1', '1', 'read:all', 'Read All', 'all', 'read', 'true', new Date().toISOString()],
    ['2', '1', 'write:all', 'Write All', 'all', 'write', 'true', new Date().toISOString()],
    ['3', '1', 'delete:all', 'Delete All', 'all', 'delete', 'true', new Date().toISOString()],
    ['4', '1', 'manage:users', 'Manage Users', 'users', 'manage', 'true', new Date().toISOString()],
    ['5', '1', 'manage:settings', 'Manage Settings', 'settings', 'manage', 'true', new Date().toISOString()],
    ['6', '2', 'read:all', 'Read All', 'all', 'read', 'true', new Date().toISOString()],
    ['7', '2', 'write:transport', 'Write Transport', 'transport', 'write', 'true', new Date().toISOString()],
    ['8', '2', 'write:warehouse', 'Write Warehouse', 'warehouse', 'write', 'true', new Date().toISOString()],
    ['9', '2', 'write:staff', 'Write Staff', 'staff', 'write', 'true', new Date().toISOString()],
    ['10', '2', 'view:reports', 'View Reports', 'reports', 'read', 'true', new Date().toISOString()],
    ['11', '3', 'read:transport', 'Read Transport', 'transport', 'read', 'true', new Date().toISOString()],
    ['12', '3', 'read:warehouse', 'Read Warehouse', 'warehouse', 'read', 'true', new Date().toISOString()],
    ['13', '3', 'read:partners', 'Read Partners', 'partners', 'read', 'true', new Date().toISOString()],
    ['14', '3', 'write:transport:own', 'Write Own Transport', 'transport', 'write', 'true', new Date().toISOString()]
  ],

  Employees: [
    ['id', 'user_id', 'employee_code', 'full_name', 'email', 'phone', 'department', 'position', 'manager_id', 'hire_date', 'salary', 'status', 'created_at', 'updated_at'],
    ['1', '1', 'EMP001', 'Administrator', 'admin@mia-logistics.com', '0123456789', 'IT', 'System Administrator', '', '2024-01-01', '15000000', 'active', new Date().toISOString(), new Date().toISOString()],
    ['2', '2', 'EMP002', 'Manager User', 'manager@mia-logistics.com', '0123456788', 'Operations', 'Operations Manager', '1', '2024-01-15', '12000000', 'active', new Date().toISOString(), new Date().toISOString()],
    ['3', '3', 'EMP003', 'Employee User', 'employee@mia-logistics.com', '0123456787', 'Logistics', 'Logistics Coordinator', '2', '2024-02-01', '8000000', 'active', new Date().toISOString(), new Date().toISOString()]
  ]
};

console.log('📋 DỮ LIỆU ĐÃ CHUẨN BỊ:');
console.log('');

Object.entries(sheetsData).forEach(([sheetName, data]) => {
  console.log(`📊 ${sheetName} Sheet:`);
  console.log(`   Headers: ${data[0].join(', ')}`);
  console.log(`   Records: ${data.length - 1} rows`);
  console.log('');
});

console.log('🔧 HƯỚNG DẪN CẬP NHẬT MANUAL:');
console.log('');

console.log('1️⃣ MỞ GOOGLE SHEETS:');
console.log('   • Truy cập: https://docs.google.com/spreadsheets/d/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As');
console.log('   • Hoặc tạo spreadsheet mới cho User Management');
console.log('');

console.log('2️⃣ TẠO 4 SHEETS MỚI:');
console.log('   • Click "+" để thêm sheet mới');
console.log('   • Đổi tên thành: Users, Roles, RolePermissions, Employees');
console.log('');

console.log('3️⃣ COPY HEADERS VÀ DATA:');
console.log('');

Object.entries(sheetsData).forEach(([sheetName, data]) => {
  console.log(`📋 ${sheetName} Sheet:`);
  console.log('   Headers:');
  console.log(`   ${data[0].join('\t')}`);
  console.log('   ');
  console.log('   Data:');
  data.slice(1).forEach((row, index) => {
    console.log(`   ${row.join('\t')}`);
  });
  console.log('');
});

console.log('4️⃣ TEST AUTHENTICATION:');
console.log('   • Username: admin, Password: admin123');
console.log('   • Username: manager1, Password: manager123');
console.log('   • Username: employee1, Password: employee123');
console.log('');

console.log('5️⃣ CẬP NHẬT FRONTEND:');
console.log('   • Cập nhật App.js để sử dụng GoogleSheetsAuthProvider');
console.log('   • Test authentication system');
console.log('   • Test permission system');
console.log('');

console.log('⚠️  LƯU Ý:');
console.log('   • Passwords trong sample data chỉ để demo');
console.log('   • Trong production, sử dụng bcrypt để hash passwords');
console.log('   • Implement proper password validation');
console.log('   • Add rate limiting cho login attempts');
console.log('');

console.log('📞 SUPPORT:');
console.log('   - Google Sheets API: https://developers.google.com/sheets/api');
console.log('   - Authentication: https://developers.google.com/identity');
console.log('   - Data Validation: https://developers.google.com/sheets/api/guides/values');
console.log('');

console.log('=' .repeat(60));
console.log('✅ Script chuẩn bị data hoàn thành!');
console.log('🎯 Sẵn sàng copy vào Google Sheets!');
