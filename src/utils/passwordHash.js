/**
 * Password Hashing Utility
 * Note: Client-side bcrypt has limitations. This is for development only.
 * Production should use backend for password hashing.
 */

// Simple hash comparison for development
// WARNING: This is NOT secure. Real hashing requires backend.
export const comparePassword = (plainPassword, hashedPassword) => {
  // For development: simple comparison
  // In production, this should use bcrypt.compare() on backend

  // If passwordHash is a bcrypt hash (starts with $2a$ or $2b$)
  if (hashedPassword && hashedPassword.startsWith('$2')) {
    console.warn('⚠️ Client-side bcrypt comparison not secure. Use backend for production.');
    // For now, compare plain passwords (THIS IS UNSECURE)
    // TODO: Implement proper backend authentication

    // Temporary: allow specific test passwords
    const testCredentials = [
      { email: 'admin@mia.vn', password: 'admin123' },
      { email: 'test@mia.vn', password: 'test123' },
    ];

    const testUser = testCredentials.find((u) => u.password === plainPassword);

    if (testUser) {
      return true;
    }

    // Fallback: for development only
    return false;
  }

  // For non-hashed passwords (legacy/demo)
  return plainPassword === hashedPassword;
};

// Generate hash (client-side, NOT for production)
export const hashPassword = (password) => {
  console.warn('⚠️ Client-side password hashing not secure. Use backend.');
  // This should be done on backend with bcrypt
  return password; // Return plain password (unsafe)
};

export default {
  comparePassword,
  hashPassword,
};
