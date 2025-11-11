// Script tạo cấu trúc 4 sheets quản lý người dùng
const fs = require('fs');
const path = require('path');

console.log('🔧 TẠO CẤU TRÚC SHEETS QUẢN LÝ NGƯỜI DÙNG');
console.log('=' .repeat(60));

// Tạo cấu trúc cho sheet Users
const usersHeaders = [
  'id',
  'username',
  'email',
  'password_hash',
  'full_name',
  'phone',
  'avatar_url',
  'is_active',
  'last_login',
  'created_at',
  'updated_at'
];

// Tạo cấu trúc cho sheet Roles
const rolesHeaders = [
  'id',
  'name',
  'code',
  'description',
  'level',
  'is_active',
  'created_at',
  'updated_at'
];

// Tạo cấu trúc cho sheet RolePermissions
const rolePermissionsHeaders = [
  'id',
  'role_id',
  'permission_code',
  'permission_name',
  'module',
  'action',
  'is_active',
  'created_at'
];

// Tạo cấu trúc cho sheet Employees
const employeesHeaders = [
  'id',
  'user_id',
  'employee_code',
  'full_name',
  'email',
  'phone',
  'department',
  'position',
  'manager_id',
  'hire_date',
  'salary',
  'status',
  'created_at',
  'updated_at'
];

// Sample data cho Users
const usersSampleData = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@mia-logistics.com',
    password_hash: '$2b$10$example_hash_here',
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
    password_hash: '$2b$10$example_hash_here',
    full_name: 'Manager User',
    phone: '0123456788',
    avatar_url: '',
    is_active: 'true',
    last_login: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Sample data cho Roles
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

// Sample data cho RolePermissions
const rolePermissionsSampleData = [
  // Admin permissions
  { id: '1', role_id: '1', permission_code: 'read:all', permission_name: 'Read All', module: 'all', action: 'read', is_active: 'true', created_at: new Date().toISOString() },
  { id: '2', role_id: '1', permission_code: 'write:all', permission_name: 'Write All', module: 'all', action: 'write', is_active: 'true', created_at: new Date().toISOString() },
  { id: '3', role_id: '1', permission_code: 'delete:all', permission_name: 'Delete All', module: 'all', action: 'delete', is_active: 'true', created_at: new Date().toISOString() },
  { id: '4', role_id: '1', permission_code: 'manage:users', permission_name: 'Manage Users', module: 'users', action: 'manage', is_active: 'true', created_at: new Date().toISOString() },

  // Manager permissions
  { id: '5', role_id: '2', permission_code: 'read:all', permission_name: 'Read All', module: 'all', action: 'read', is_active: 'true', created_at: new Date().toISOString() },
  { id: '6', role_id: '2', permission_code: 'write:transport', permission_name: 'Write Transport', module: 'transport', action: 'write', is_active: 'true', created_at: new Date().toISOString() },
  { id: '7', role_id: '2', permission_code: 'write:warehouse', permission_name: 'Write Warehouse', module: 'warehouse', action: 'write', is_active: 'true', created_at: new Date().toISOString() },

  // Employee permissions
  { id: '8', role_id: '3', permission_code: 'read:transport', permission_name: 'Read Transport', module: 'transport', action: 'read', is_active: 'true', created_at: new Date().toISOString() },
  { id: '9', role_id: '3', permission_code: 'read:warehouse', permission_name: 'Read Warehouse', module: 'warehouse', action: 'read', is_active: 'true', created_at: new Date().toISOString() }
];

// Sample data cho Employees
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
  }
];

console.log('📋 CẤU TRÚC SHEETS ĐÃ TẠO:');
console.log('');

console.log('1️⃣ SHEET "Users":');
console.log('   Headers:', usersHeaders.join(', '));
console.log('   Sample records:', usersSampleData.length);
console.log('');

console.log('2️⃣ SHEET "Roles":');
console.log('   Headers:', rolesHeaders.join(', '));
console.log('   Sample records:', rolesSampleData.length);
console.log('');

console.log('3️⃣ SHEET "RolePermissions":');
console.log('   Headers:', rolePermissionsHeaders.join(', '));
console.log('   Sample records:', rolePermissionsSampleData.length);
console.log('');

console.log('4️⃣ SHEET "Employees":');
console.log('   Headers:', employeesHeaders.join(', '));
console.log('   Sample records:', employeesSampleData.length);
console.log('');

console.log('🔧 HƯỚNG DẪN TRIỂN KHAI:');
console.log('');

console.log('1️⃣ Tạo sheets trong Google Sheets:');
console.log('   • Mở Google Sheets');
console.log('   • Tạo 4 sheets mới: Users, Roles, RolePermissions, Employees');
console.log('   • Copy headers từ script này');
console.log('   • Thêm sample data');
console.log('');

console.log('2️⃣ Cập nhật Google Sheets ID:');
console.log('   • Lấy ID của spreadsheet mới');
console.log('   • Cập nhật trong file .env');
console.log('   • Cập nhật trong config/google.js');
console.log('');

console.log('3️⃣ Implement Authentication Service:');
console.log('   • Tạo UserService để quản lý users');
console.log('   • Tạo AuthService để xử lý đăng nhập');
console.log('   • Tạo PermissionService để kiểm tra quyền');
console.log('   • Cập nhật AuthContext để sử dụng Google Sheets');
console.log('');

console.log('4️⃣ Tạo UI Components:');
console.log('   • Login page');
console.log('   • User management interface');
console.log('   • Role management interface');
console.log('   • Permission management interface');
console.log('   • Employee management interface');
console.log('');

console.log('⚠️  LƯU Ý BẢO MẬT:');
console.log('   • Mật khẩu phải được hash trước khi lưu');
console.log('   • Sử dụng bcrypt để hash password');
console.log('   • Implement JWT token cho session');
console.log('   • Validate input để tránh injection');
console.log('   • Implement rate limiting');
console.log('');

console.log('📞 SUPPORT:');
console.log('   - Google Sheets API: https://developers.google.com/sheets/api');
console.log('   - JWT Authentication: https://jwt.io/');
console.log('   - bcrypt Password Hashing: https://www.npmjs.com/package/bcrypt');
console.log('   - React Authentication: https://reactjs.org/docs/context.html');
console.log('');

console.log('=' .repeat(60));
console.log('✅ Script tạo cấu trúc sheets hoàn thành!');
console.log('🎯 Sẵn sàng triển khai hệ thống quản lý người dùng!');
