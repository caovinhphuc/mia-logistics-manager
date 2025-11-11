import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Polyfills for Node.js modules in browser
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      buffer: "buffer",
      process: "process/browser",
      util: "util",
      path: "path-browserify",
      os: "os-browserify/browser",
      url: "url",
      querystring: "querystring-es3",
      http: "stream-http",
      https: "https-browserify",
    },
  },
  define: {
    "process.env": {
      // Google Sheets Configuration
      REACT_APP_GOOGLE_SPREADSHEET_ID: JSON.stringify(
        process.env.REACT_APP_GOOGLE_SPREADSHEET_ID ||
          "18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As"
      ),

      // Service Accounts
      GOOGLE_SERVICE_ACCOUNT_MIA_VN: JSON.stringify(
        process.env.GOOGLE_SERVICE_ACCOUNT_MIA_VN ||
          "mia-vn-google-integration@sinuous-aviary-474820-e3.iam.gserviceaccount.com"
      ),
      GOOGLE_SERVICE_ACCOUNT_NUQ74: JSON.stringify(
        process.env.GOOGLE_SERVICE_ACCOUNT_NUQ74 || "nuq74@[PROJECT_ID].iam.gserviceaccount.com"
      ),

      // Service Account Key Paths
      GOOGLE_SERVICE_ACCOUNT_KEY_PATH_MIA_VN: JSON.stringify(
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH_MIA_VN ||
          "./backend/sinuous-aviary-474820-e3-c442968a0e87.json"
      ),
      GOOGLE_SERVICE_ACCOUNT_KEY_PATH_NUQ74: JSON.stringify(
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH_NUQ74 ||
          "./backend/nuq74-service-account-key.json"
      ),

      // Google Drive
      REACT_APP_GOOGLE_DRIVE_FOLDER_ID: JSON.stringify(
        process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_ID || "1_Zy9Q31vPEHOSIT077kMolek3F3-yxZE"
      ),

      // Google Apps Script
      REACT_APP_APPS_SCRIPT_WEB_APP_URL: JSON.stringify(
        process.env.REACT_APP_APPS_SCRIPT_WEB_APP_URL
      ),

      // Telegram
      REACT_APP_TELEGRAM_BOT_TOKEN: JSON.stringify(process.env.REACT_APP_TELEGRAM_BOT_TOKEN),
      REACT_APP_TELEGRAM_CHAT_ID: JSON.stringify(process.env.REACT_APP_TELEGRAM_CHAT_ID),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
});
