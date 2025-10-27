const bcrypt = require('bcryptjs');

const mockUsers = [
  { email: 'admin@mialogistics.com', password: 'admin123' },
  { email: 'manager@mialogistics.com', password: 'manager123' },
  { email: 'operator@mialogistics.com', password: 'operator123' },
  { email: 'driver@mialogistics.com', password: 'driver123' },
];

async function hashPasswords() {
  console.log('🔐 Hashing passwords...\n');

  for (const user of mockUsers) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Hashed: ${hashedPassword}\n`);
    } catch (error) {
      console.error(`Error hashing password for ${user.email}:`, error);
    }
  }

  console.log('✅ Done!');
}

hashPasswords();
