#!/usr/bin/env node

/**
 * Script fix vấn đề user isActive
 */

console.log('🔧 Fix vấn đề user isActive...');

console.log('\n❌ Vấn đề hiện tại:');
console.log('- Hệ thống đã kết nối thành công với Google Sheets');
console.log('- Lấy được 3 người dùng từ Google Sheets');
console.log('- Nhưng có lỗi "Tài khoản đã bị vô hiệu hóa"');

console.log('\n🔍 Nguyên nhân:');
console.log('1. Dữ liệu trong Google Sheets không đúng format');
console.log('2. Trường is_active không được xử lý đúng');
console.log('3. User không tồn tại hoặc bị vô hiệu hóa');

console.log('\n✅ Giải pháp:');
console.log('1. Kiểm tra dữ liệu trong Google Sheets');
console.log('2. Đảm bảo có header: is_active');
console.log('3. Đảm bảo dữ liệu có is_active = "true" cho user test');
console.log('4. Kiểm tra password_hash có đúng không');

console.log('\n📊 Cấu trúc dữ liệu mong đợi trong Google Sheets:');
console.log('Headers: id, username, email, password_hash, full_name, phone, avatar_url, is_active, last_login, created_at, updated_at');
console.log('is_active: "true" hoặc "false" (string)');

console.log('\n🔧 Cách kiểm tra:');
console.log('1. Mở Google Sheets: https://docs.google.com/spreadsheets/d/18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As');
console.log('2. Kiểm tra sheet "Users"');
console.log('3. Đảm bảo có header: is_active');
console.log('4. Đảm bảo dữ liệu có is_active = "true" cho user test');

console.log('\n📝 Cách test:');
console.log('1. Mở browser: http://localhost:3000/login');
console.log('2. Thử đăng nhập với email: admin@mia-logistics.com, password: admin123');
console.log('3. Kiểm tra console để xem debug info');
console.log('4. Kiểm tra dữ liệu user được load như thế nào');

console.log('\n🔧 Cách fix:');
console.log('1. Đảm bảo dữ liệu trong Google Sheets đúng format');
console.log('2. Đảm bảo is_active = "true" cho user test');
console.log('3. Kiểm tra password_hash có đúng không');

console.log('\n✅ Script hoàn thành');
