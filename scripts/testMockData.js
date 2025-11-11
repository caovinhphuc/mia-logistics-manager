#!/usr/bin/env node

/**
 * Script test với mock data
 */

console.log('🧪 Test với mock data...');

// Mock data để test
const mockUserData = {
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
};

console.log('\n📊 Mock user data:');
console.log(JSON.stringify(mockUserData, null, 2));

// Test User constructor
class User {
  constructor(data = {}) {
    this.id = data.id || '';
    this.username = data.username || '';
    this.email = data.email || '';
    this.passwordHash = data.password_hash || '';
    this.fullName = data.full_name || '';
    this.phone = data.phone || '';
    this.avatarUrl = data.avatar_url || '';
    this.isActive = data.is_active === 'true' || false;
    this.lastLogin = data.last_login || null;
    this.createdAt = data.created_at || new Date().toISOString();
    this.updatedAt = data.updated_at || new Date().toISOString();
  }
}

const user = new User(mockUserData);

console.log('\n📊 User object:');
console.log('id:', user.id);
console.log('email:', user.email);
console.log('isActive:', user.isActive);
console.log('isActive type:', typeof user.isActive);

// Test login logic
const testLogin = (email, password) => {
  console.log('\n🔍 Test login logic:');
  console.log('Email:', email);
  console.log('Password:', password);

  if (!user) {
    console.log('❌ Không tìm thấy người dùng');
    return false;
  }

  if (!user.isActive) {
    console.log('❌ Tài khoản đã bị vô hiệu hóa');
    console.log('isActive value:', user.isActive);
    console.log('isActive type:', typeof user.isActive);
    return false;
  }

  console.log('✅ User is active');
  return true;
};

// Test với mock data
testLogin('admin@mia-logistics.com', 'admin123');

console.log('\n🔧 Cách fix:');
console.log('1. Đảm bảo dữ liệu trong Google Sheets có is_active = "true"');
console.log('2. Kiểm tra cách dữ liệu được map từ Google Sheets');
console.log('3. Đảm bảo User constructor xử lý is_active đúng cách');

console.log('\n✅ Script hoàn thành');
