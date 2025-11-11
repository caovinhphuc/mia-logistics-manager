#!/usr/bin/env node

/**
 * Script fix dữ liệu user trong Google Sheets
 */

console.log('🔧 Fix dữ liệu user trong Google Sheets...');

console.log('\n❌ Vấn đề hiện tại:');
console.log('- User data từ Google Sheets: isActive: false');
console.log('- User email: admin@mia.vn (không phải admin@mia-logistics.com)');
console.log('- Các trường khác: passwordHash: "", fullName: "", username: ""');

console.log('\n🔍 Nguyên nhân:');
console.log('1. Dữ liệu trong Google Sheets không đúng format');
console.log('2. Headers không khớp với expected format');
console.log('3. Dữ liệu bị thiếu hoặc không đúng');

console.log('\n✅ Giải pháp:');
console.log('1. Cập nhật dữ liệu trong Google Sheets');
console.log('2. Đảm bảo headers đúng format');
console.log('3. Đảm bảo dữ liệu đầy đủ và đúng');

console.log('\n📊 Cấu trúc dữ liệu mong đợi trong Google Sheets:');
console.log('Headers: id, username, email, password_hash, full_name, phone, avatar_url, is_active, last_login, created_at, updated_at');
console.log('is_active: "true" hoặc "false" (string)');

console.log('\n🔧 Cách fix:');
console.log('1. Mở Google Sheets: https://docs.google.com/spreadsheets/d/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As');
console.log('2. Kiểm tra sheet "Users"');
console.log('3. Đảm bảo có headers đúng format');
console.log('4. Cập nhật dữ liệu user test');

console.log('\n📝 Dữ liệu user test cần có:');
console.log('id: u-admin');
console.log('username: admin');
console.log('email: admin@mia-logistics.com');
console.log('password_hash: $2b$10$admin123456789abcdefghijklmnopqrstuvwxyz');
console.log('full_name: Administrator');
console.log('phone: 0123456789');
console.log('avatar_url: ');
console.log('is_active: true');
console.log('last_login: ');
console.log('created_at: 2025-10-22T20:33:30.201Z');
console.log('updated_at: 2025-10-22T20:33:30.201Z');

console.log('\n🔧 Cách test:');
console.log('1. Cập nhật dữ liệu trong Google Sheets');
console.log('2. Mở browser: http://localhost:3000/login');
console.log('3. Thử đăng nhập với email: admin@mia-logistics.com, password: admin123');
console.log('4. Kiểm tra console để xem debug info');

console.log('\n✅ Script hoàn thành');
