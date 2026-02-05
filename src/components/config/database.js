/**
 * DATABASE CONFIGURATION
 * Cấu hình kết nối database cho MIA Logistics Manager
 */

// Hỗ trợ nhiều loại database
const DATABASE_CONFIG = {
  // MongoDB Configuration (Recommended)
  mongodb: {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/mia-logistics',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    },
    collections: {
      orders: 'orders',
      shipments: 'shipments',
      carriers: 'carriers',
      analytics: 'analytics',
      users: 'users',
      logs: 'logs',
    },
  },

  // Google Sheets Configuration (Current)
  googleSheets: {
    enabled: true,
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '',
    credentials: process.env.GOOGLE_SHEETS_CREDENTIALS || '',
    sheets: {
      orders: 'Đơn hàng',
      shipments: 'Vận chuyển',
      carriers: 'Nhà vận chuyển',
      employees: 'Nhân viên',
      settings: 'Cài đặt',
    },
  },

  // PostgreSQL Configuration (Alternative)
  postgresql: {
    connectionString:
      process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mia-logistics',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // max pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },

  // MySQL Configuration (Alternative)
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mia_logistics',
    connectionLimit: 10,
    charset: 'utf8mb4',
  },

  // Redis Configuration (For caching & real-time)
  redis: {
    enabled: process.env.REDIS_ENABLED === 'true',
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB || '0'),
    ttl: 3600, // Default TTL 1 hour
  },
};

// Xác định database đang sử dụng
const ACTIVE_DATABASE = process.env.DATABASE_TYPE || 'googleSheets';

// Export configuration
module.exports = {
  DATABASE_CONFIG,
  ACTIVE_DATABASE,

  // Helper functions
  getDatabaseConfig: (type = ACTIVE_DATABASE) => {
    return DATABASE_CONFIG[type] || DATABASE_CONFIG.googleSheets;
  },

  isMongoDBEnabled: () => ACTIVE_DATABASE === 'mongodb',
  isGoogleSheetsEnabled: () => ACTIVE_DATABASE === 'googleSheets',
  isPostgreSQLEnabled: () => ACTIVE_DATABASE === 'postgresql',
  isMySQLEnabled: () => ACTIVE_DATABASE === 'mysql',
  isRedisEnabled: () => DATABASE_CONFIG.redis.enabled,
};
