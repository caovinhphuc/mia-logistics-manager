// Hash passwords using SHA-256 for browser compatibility
const crypto = require('crypto');

const mockUsers = [
  { email: 'admin@mialogistics.com', password: 'admin123' },
  { email: 'manager@mialogistics.com', password: 'manager123' },
  { email: 'operator@mialogistics.com', password: 'operator123' },
  { email: 'driver@mialogistics.com', password: 'driver123' },
];

function hashPassword(password) {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return hash;
}

function hashPasswords() {
  console.log('🔐 Hashing passwords with SHA-256...\n');

  for (const user of mockUsers) {
    const hashedPassword = hashPassword(user.password);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
    console.log(`Hashed (SHA-256): ${hashedPassword}\n`);
  }

  console.log('✅ Done!');
}

hashPasswords();
