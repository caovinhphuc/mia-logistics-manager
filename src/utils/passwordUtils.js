// Simple password hashing utility for browser
// Note: This is NOT as secure as bcrypt but works in browser
// For production, passwords should be hashed on the server

export const hashPassword = async (password) => {
  // Convert password to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // Hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
};

export const verifyPassword = async (password, hashedPassword) => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hashedPassword;
};
