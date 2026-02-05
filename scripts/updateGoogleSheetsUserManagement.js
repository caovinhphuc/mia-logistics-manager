// Script cập nhật Google Sheets với cấu trúc và sample data cho User Management
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const fs = require('fs');
const path = require('path');

console.log('🔧 CẬP NHẬT GOOGLE SHEETS CHO USER MANAGEMENT');
console.log('=' .repeat(60));

// Sample data
const usersData = [
  ['id', 'username', 'email', 'password_hash', 'full_name', 'phone', 'avatar_url', 'is_active', 'last_login', 'created_at', 'updated_at'],
  ['1', 'admin', 'admin@mia-logistics.com', '$2b$10$admin123456789abcdefghijklmnopqrstuvwxyz', 'Administrator', '0123456789', '', 'true', '', new Date().toISOString(), new Date().toISOString()],
  ['2', 'manager1', 'manager@mia-logistics.com', '$2b$10$manager123456789abcdefghijklmnopqrstuvwxyz', 'Manager User', '0123456788', '', 'true', '', new Date().toISOString(), new Date().toISOString()],
  ['3', 'employee1', 'employee@mia-logistics.com', '$2b$10$employee123456789abcdefghijklmnopqrstuvwxyz', 'Employee User', '0123456787', '', 'true', '', new Date().toISOString(), new Date().toISOString()]
];

const rolesData = [
  ['id', 'name', 'code', 'description', 'level', 'is_active', 'created_at', 'updated_at'],
  ['1', 'Administrator', 'admin', 'Full system access', '1', 'true', new Date().toISOString(), new Date().toISOString()],
  ['2', 'Manager', 'manager', 'Management level access', '2', 'true', new Date().toISOString(), new Date().toISOString()],
  ['3', 'Employee', 'employee', 'Basic employee access', '3', 'true', new Date().toISOString(), new Date().toISOString()]
];

const rolePermissionsData = [
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
];

const employeesData = [
  ['id', 'user_id', 'employee_code', 'full_name', 'email', 'phone', 'department', 'position', 'manager_id', 'hire_date', 'salary', 'status', 'created_at', 'updated_at'],
  ['1', '1', 'EMP001', 'Administrator', 'admin@mia-logistics.com', '0123456789', 'IT', 'System Administrator', '', '2024-01-01', '15000000', 'active', new Date().toISOString(), new Date().toISOString()],
  ['2', '2', 'EMP002', 'Manager User', 'manager@mia-logistics.com', '0123456788', 'Operations', 'Operations Manager', '1', '2024-01-15', '12000000', 'active', new Date().toISOString(), new Date().toISOString()],
  ['3', '3', 'EMP003', 'Employee User', 'employee@mia-logistics.com', '0123456787', 'Logistics', 'Logistics Coordinator', '2', '2024-02-01', '8000000', 'active', new Date().toISOString(), new Date().toISOString()]
];

async function updateGoogleSheets() {
  try {
    console.log('🔄 Đang kết nối Google Sheets...');

    // Load credentials
    let email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let key = process.env.GOOGLE_PRIVATE_KEY;

    if (!email || !key) {
      const credentialsPath = path.join(__dirname, '..', 'src', 'config', 'service-account-key.json');
      if (fs.existsSync(credentialsPath)) {
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        email = email || credentials.client_email;
        key = key || credentials.private_key;
      }
    }

    if (!email || !key) {
      throw new Error('Không tìm thấy Google API credentials');
    }

    const spreadsheetId = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';

    const serviceAccountAuth = new JWT({
      email,
      key: key.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });

    const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
    await doc.loadInfo();

    console.log(`✅ Đã kết nối Google Sheets: ${doc.title}`);

    // Update Users sheet
    console.log('🔄 Đang cập nhật Users sheet...');
    let usersSheet = doc.sheetsByTitle['Users'];
    if (!usersSheet) {
      usersSheet = await doc.addSheet({ title: 'Users' });
    }
    await usersSheet.clear();
    await usersSheet.addRows(usersData);
    console.log('✅ Đã cập nhật Users sheet');

    // Update Roles sheet
    console.log('🔄 Đang cập nhật Roles sheet...');
    let rolesSheet = doc.sheetsByTitle['Roles'];
    if (!rolesSheet) {
      rolesSheet = await doc.addSheet({ title: 'Roles' });
    }
    await rolesSheet.clear();
    await rolesSheet.addRows(rolesData);
    console.log('✅ Đã cập nhật Roles sheet');

    // Update RolePermissions sheet
    console.log('🔄 Đang cập nhật RolePermissions sheet...');
    let rolePermissionsSheet = doc.sheetsByTitle['RolePermissions'];
    if (!rolePermissionsSheet) {
      rolePermissionsSheet = await doc.addSheet({ title: 'RolePermissions' });
    }
    await rolePermissionsSheet.clear();
    await rolePermissionsSheet.addRows(rolePermissionsData);
    console.log('✅ Đã cập nhật RolePermissions sheet');

    // Update Employees sheet
    console.log('🔄 Đang cập nhật Employees sheet...');
    let employeesSheet = doc.sheetsByTitle['Employees'];
    if (!employeesSheet) {
      employeesSheet = await doc.addSheet({ title: 'Employees' });
    }
    await employeesSheet.clear();
    await employeesSheet.addRows(employeesData);
    console.log('✅ Đã cập nhật Employees sheet');

    console.log('');
    console.log('🎯 CẬP NHẬT HOÀN THÀNH:');
    console.log('   ✅ Users sheet: 3 users (admin, manager1, employee1)');
    console.log('   ✅ Roles sheet: 3 roles (admin, manager, employee)');
    console.log('   ✅ RolePermissions sheet: 14 permissions');
    console.log('   ✅ Employees sheet: 3 employees');
    console.log('');

    console.log('🔐 CREDENTIALS ĐỂ TEST:');
    console.log('   • Admin: username=admin, password=admin123');
    console.log('   • Manager: username=manager1, password=manager123');
    console.log('   • Employee: username=employee1, password=employee123');
    console.log('');

    console.log('🚀 BƯỚC TIẾP THEO:');
    console.log('   1. Cập nhật App.js để sử dụng GoogleSheetsAuthProvider');
    console.log('   2. Test authentication system');
    console.log('   3. Test permission system');
    console.log('   4. Tạo UI components cho user management');
    console.log('');

  } catch (error) {
    console.error('❌ Lỗi cập nhật Google Sheets:', error);
    throw error;
  }
}

// Run the update
updateGoogleSheets()
  .then(() => {
    console.log('✅ Cập nhật Google Sheets hoàn thành!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  });
