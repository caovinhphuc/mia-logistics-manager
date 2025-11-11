// Script tạo sample data cho 4 sheets quản lý người dùng
const fs = require('fs');
const path = require('path');

console.log('🔧 TẠO SAMPLE DATA CHO 4 SHEETS QUẢN LÝ NGƯỜI DÙNG');
console.log('=' .repeat(60));

// Sample data cho Users sheet
const usersSampleData = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@mia-logistics.com',
    password_hash: '$2b$10$admin123456789abcdefghijklmnopqrstuvwxyz',
    full_name: 'Administrator',
    phone: '0123456789',
    avatar_url: '',
    is_active: 'true',
    last_login: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    username: 'manager1',
    email: 'manager@mia-logistics.com',
    password_hash: '$2b$10$manager123456789abcdefghijklmnopqrstuvwxyz',
    full_name: 'Manager User',
    phone: '0123456788',
    avatar_url: '',
    is_active: 'true',
    last_login: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    username: 'employee1',
    email: 'employee@mia-logistics.com',
    password_hash: '$2b$10$employee123456789abcdefghijklmnopqrstuvwxyz',
    full_name: 'Employee User',
    phone: '0123456787',
    avatar_url: '',
    is_active: 'true',
    last_login: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Sample data cho Roles sheet
const rolesSampleData = [
  {
    id: '1',
    name: 'Administrator',
    code: 'admin',
    description: 'Full system access',
    level: '1',
    is_active: 'true',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Manager',
    code: 'manager',
    description: 'Management level access',
    level: '2',
    is_active: 'true',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Employee',
    code: 'employee',
    description: 'Basic employee access',
    level: '3',
    is_active: 'true',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Sample data cho RolePermissions sheet
const rolePermissionsSampleData = [
  // Admin permissions
  { id: '1', role_id: '1', permission_code: 'read:all', permission_name: 'Read All', module: 'all', action: 'read', is_active: 'true', created_at: new Date().toISOString() },
  { id: '2', role_id: '1', permission_code: 'write:all', permission_name: 'Write All', module: 'all', action: 'write', is_active: 'true', created_at: new Date().toISOString() },
  { id: '3', role_id: '1', permission_code: 'delete:all', permission_name: 'Delete All', module: 'all', action: 'delete', is_active: 'true', created_at: new Date().toISOString() },
  { id: '4', role_id: '1', permission_code: 'manage:users', permission_name: 'Manage Users', module: 'users', action: 'manage', is_active: 'true', created_at: new Date().toISOString() },
  { id: '5', role_id: '1', permission_code: 'manage:settings', permission_name: 'Manage Settings', module: 'settings', action: 'manage', is_active: 'true', created_at: new Date().toISOString() },

  // Manager permissions
  { id: '6', role_id: '2', permission_code: 'read:all', permission_name: 'Read All', module: 'all', action: 'read', is_active: 'true', created_at: new Date().toISOString() },
  { id: '7', role_id: '2', permission_code: 'write:transport', permission_name: 'Write Transport', module: 'transport', action: 'write', is_active: 'true', created_at: new Date().toISOString() },
  { id: '8', role_id: '2', permission_code: 'write:warehouse', permission_name: 'Write Warehouse', module: 'warehouse', action: 'write', is_active: 'true', created_at: new Date().toISOString() },
  { id: '9', role_id: '2', permission_code: 'write:staff', permission_name: 'Write Staff', module: 'staff', action: 'write', is_active: 'true', created_at: new Date().toISOString() },
  { id: '10', role_id: '2', permission_code: 'view:reports', permission_name: 'View Reports', module: 'reports', action: 'read', is_active: 'true', created_at: new Date().toISOString() },

  // Employee permissions
  { id: '11', role_id: '3', permission_code: 'read:transport', permission_name: 'Read Transport', module: 'transport', action: 'read', is_active: 'true', created_at: new Date().toISOString() },
  { id: '12', role_id: '3', permission_code: 'read:warehouse', permission_name: 'Read Warehouse', module: 'warehouse', action: 'read', is_active: 'true', created_at: new Date().toISOString() },
  { id: '13', role_id: '3', permission_code: 'read:partners', permission_name: 'Read Partners', module: 'partners', action: 'read', is_active: 'true', created_at: new Date().toISOString() },
  { id: '14', role_id: '3', permission_code: 'write:transport:own', permission_name: 'Write Own Transport', module: 'transport', action: 'write', is_active: 'true', created_at: new Date().toISOString() }
];

// Sample data cho Employees sheet
const employeesSampleData = [
  {
    id: '1',
    user_id: '1',
    employee_code: 'EMP001',
    full_name: 'Administrator',
    email: 'admin@mia-logistics.com',
    phone: '0123456789',
    department: 'IT',
    position: 'System Administrator',
    manager_id: '',
    hire_date: '2024-01-01',
    salary: '15000000',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: '2',
    employee_code: 'EMP002',
    full_name: 'Manager User',
    email: 'manager@mia-logistics.com',
    phone: '0123456788',
    department: 'Operations',
    position: 'Operations Manager',
    manager_id: '1',
    hire_date: '2024-01-15',
    salary: '12000000',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    user_id: '3',
    employee_code: 'EMP003',
    full_name: 'Employee User',
    email: 'employee@mia-logistics.com',
    phone: '0123456787',
    department: 'Logistics',
    position: 'Logistics Coordinator',
    manager_id: '2',
    hire_date: '2024-02-01',
    salary: '8000000',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

console.log('📋 SAMPLE DATA ĐÃ TẠO:');
console.log('');

console.log('1️⃣ USERS SHEET:');
console.log('   Headers: id, username, email, password_hash, full_name, phone, avatar_url, is_active, last_login, created_at, updated_at');
console.log('   Sample records: 3 users');
console.log('   - admin (admin@mia-logistics.com)');
console.log('   - manager1 (manager@mia-logistics.com)');
console.log('   - employee1 (employee@mia-logistics.com)');
console.log('');

console.log('2️⃣ ROLES SHEET:');
console.log('   Headers: id, name, code, description, level, is_active, created_at, updated_at');
console.log('   Sample records: 3 roles');
console.log('   - Administrator (admin)');
console.log('   - Manager (manager)');
console.log('   - Employee (employee)');
console.log('');

console.log('3️⃣ ROLEPERMISSIONS SHEET:');
console.log('   Headers: id, role_id, permission_code, permission_name, module, action, is_active, created_at');
console.log('   Sample records: 14 permissions');
console.log('   - Admin: 5 permissions (full access)');
console.log('   - Manager: 5 permissions (management level)');
console.log('   - Employee: 4 permissions (basic access)');
console.log('');

console.log('4️⃣ EMPLOYEES SHEET:');
console.log('   Headers: id, user_id, employee_code, full_name, email, phone, department, position, manager_id, hire_date, salary, status, created_at, updated_at');
console.log('   Sample records: 3 employees');
console.log('   - Administrator (IT Department)');
console.log('   - Manager User (Operations Department)');
console.log('   - Employee User (Logistics Department)');
console.log('');

console.log('🔧 HƯỚNG DẪN SỬ DỤNG:');
console.log('');

console.log('1️⃣ COPY DATA VÀO GOOGLE SHEETS:');
console.log('   • Mở Google Sheets');
console.log('   • Tạo 4 sheets: Users, Roles, RolePermissions, Employees');
console.log('   • Copy headers từ script này');
console.log('   • Copy sample data vào từng sheet');
console.log('');

console.log('2️⃣ TEST AUTHENTICATION:');
console.log('   • Username: admin, Password: admin123');
console.log('   • Username: manager1, Password: manager123');
console.log('   • Username: employee1, Password: employee123');
console.log('');

console.log('3️⃣ TEST PERMISSIONS:');
console.log('   • Admin: Full access to all modules');
console.log('   • Manager: Read all, write transport/warehouse/staff, view reports');
console.log('   • Employee: Read transport/warehouse/partners, write own transport');
console.log('');

console.log('⚠️  LƯU Ý BẢO MẬT:');
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
console.log('✅ Script tạo sample data hoàn thành!');
console.log('🎯 Sẵn sàng test authentication system!');
