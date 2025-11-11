// server/update-env.js
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");

// Read current .env file
let envContent = "";
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, "utf8");
}

const sectionsToAdd = [];

if (!envContent.includes("GOOGLE_SERVICE_ACCOUNT_EMAIL")) {
  sectionsToAdd.push(`# Google Sheets Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_HERE\\n-----END PRIVATE KEY-----\\n"
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id-here`);
}

if (!envContent.includes("TELEGRAM_BOT_TOKEN")) {
  sectionsToAdd.push(`# Telegram Notifications
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id`);
}

if (
  !envContent.includes("APPS_SCRIPT_DISTANCE_ID") &&
  !envContent.includes("APPS_SCRIPT_DISTANCE_URL")
) {
  sectionsToAdd.push(`# Google Apps Script Distance API
APPS_SCRIPT_DISTANCE_ID=your-apps-script-id
# Optional: override the derived URL
APPS_SCRIPT_DISTANCE_URL=https://script.google.com/macros/s/YOUR_APPS_SCRIPT_ID/exec`);
}

if (sectionsToAdd.length > 0) {
  const updatedContent = `${envContent.trim()}\n\n${sectionsToAdd.join("\n\n")}\n`;

  try {
    fs.writeFileSync(envPath, updatedContent);
    console.log("✅ Updated backend .env with missing sections:");
    sectionsToAdd.forEach((section) => {
      const title = section.split("\n")[0].replace(/^#\s?/, "");
      console.log(`   • ${title}`);
    });
    envContent = updatedContent;
  } catch (error) {
    console.error("❌ Error updating .env:", error.message);
  }
} else {
  console.log("✅ Backend .env already contains required sections.");
}

console.log("\n📋 Current .env configuration preview:");
console.log("=".repeat(50));
console.log(envContent);
console.log("=".repeat(50));
