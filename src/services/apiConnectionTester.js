/**
 * API Connection Tester - Mock implementation
 * For use in Settings components
 */

import { googleApiLoader } from './googleApiLoader';
import { googleSheetsService } from './googleSheetsService';
import { googleDriveService } from './googleDriveService';
import { telegramBotService } from './telegramBotService';
import { emailService } from './emailService';

export const apiConnectionTester = {
  testAllConnections: async () => {
    const results = {};

    // Test Google API Loader
    try {
      const googleApiResult = (await googleApiLoader.testConnection?.()) || { success: false };
      results.googleApiLoader = googleApiResult;
    } catch (error) {
      results.googleApiLoader = { success: false, error: error.message };
    }

    // Test Google Sheets
    try {
      const sheetsResult = (await googleSheetsService.testConnection?.()) || { success: false };
      results.googleSheets = sheetsResult;
    } catch (error) {
      results.googleSheets = { success: false, error: error.message };
    }

    // Test Google Drive
    try {
      const driveResult = (await googleDriveService.testConnection?.()) || { success: false };
      results.googleDrive = driveResult;
    } catch (error) {
      results.googleDrive = { success: false, error: error.message };
    }

    // Test Telegram
    try {
      const telegramResult = await telegramBotService.testConnection();
      results.telegram = telegramResult;
    } catch (error) {
      results.telegram = { success: false, error: error.message };
    }

    // Test Email
    try {
      const emailResult = await emailService.testConnection();
      results.email = emailResult;
    } catch (error) {
      results.email = { success: false, error: error.message };
    }

    return results;
  },
};

export default apiConnectionTester;
