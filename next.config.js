/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // Google Sheets Configuration
    NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID:
      process.env.REACT_APP_GOOGLE_SPREADSHEET_ID || "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As",

    // Service Accounts
    GOOGLE_SERVICE_ACCOUNT_MIA_VN:
      process.env.GOOGLE_SERVICE_ACCOUNT_MIA_VN ||
      "mia-vn-google-integration@sinuous-aviary-474820-e3.iam.gserviceaccount.com",
    GOOGLE_SERVICE_ACCOUNT_NUQ74:
      process.env.GOOGLE_SERVICE_ACCOUNT_NUQ74 || "nuq74@[PROJECT_ID].iam.gserviceaccount.com",

    // Service Account Key Paths
    GOOGLE_SERVICE_ACCOUNT_KEY_PATH_MIA_VN:
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH_MIA_VN ||
      "./backend/sinuous-aviary-474820-e3-c442968a0e87.json",
    GOOGLE_SERVICE_ACCOUNT_KEY_PATH_NUQ74:
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH_NUQ74 ||
      "./backend/nuq74-service-account-key.json",

    // Google Drive
    NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_ID:
      process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID || "1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE",

    // Google Apps Script
    NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_WEB_APP_URL: process.env.REACT_APP_APPS_SCRIPT_WEB_APP_URL,

    // Telegram
    TELEGRAM_BOT_TOKEN: process.env.REACT_APP_TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.REACT_APP_TELEGRAM_CHAT_ID,
  },
  webpack: (config, { isServer }) => {
    // Webpack configuration for Next.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        process: require.resolve("process/browser"),
      };
    }
    return config;
  },
};

module.exports = nextConfig;
