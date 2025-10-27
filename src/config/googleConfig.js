// Google Configuration for Services
const googleConfig = {
  api_base_url: process.env.REACT_APP_API_URL || "http://localhost:3001",

  // Email Configuration
  email: {
    to: process.env.REACT_APP_ALERT_EMAIL || "admin@example.com",
  },

  // Alert Thresholds
  alert_threshold_high: 100,
  alert_threshold_low: 10,

  // Telegram Configuration (optional)
  telegram: {
    bot_token: process.env.REACT_APP_TELEGRAM_BOT_TOKEN || "",
    chat_id: process.env.REACT_APP_TELEGRAM_CHAT_ID || "",
  },

  // Google API Configuration
  google: {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || "",
    spreadsheetId:
      process.env.REACT_APP_GOOGLE_SPREADSHEET_ID ||
      "1rbTRtQk8uWRPKBbZYfvUvn0brMGkLGmBILrUhZryi0k",
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  },
};

export default googleConfig;
