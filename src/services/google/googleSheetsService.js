// Google Sheets Service - API wrapper for Google Sheets operations
import { logService } from '../logService';

class GoogleSheetsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    this.spreadsheetId = process.env.REACT_APP_GOOGLE_SPREADSHEET_ID;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  /**
   * Read data from a sheet
   */
  async readSheet(sheetName, range = 'A:Z') {
    try {
      logService.debug('GoogleSheetsService', 'Reading sheet', { sheetName, range });

      const url = `${this.baseUrl}/${this.spreadsheetId}/values/${sheetName}!${range}?key=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to read sheet: ${response.statusText}`);
      }

      const data = await response.json();
      return data.values || [];
    } catch (error) {
      logService.error('GoogleSheetsService', 'Failed to read sheet', { error, sheetName });
      throw error;
    }
  }

  /**
   * Append data to a sheet (requires backend support)
   */
  async appendSheet(sheetName, values) {
    try {
      logService.debug('GoogleSheetsService', 'Appending to sheet', { sheetName });

      // This would require backend implementation with OAuth
      // For now, return a placeholder
      logService.warn('GoogleSheetsService', 'Append operation requires backend support');
      return { success: false, message: 'Append requires backend support' };
    } catch (error) {
      logService.error('GoogleSheetsService', 'Failed to append to sheet', { error });
      throw error;
    }
  }

  /**
   * Update sheet data (requires backend support)
   */
  async updateSheet(sheetName, range, values) {
    try {
      logService.debug('GoogleSheetsService', 'Updating sheet', { sheetName, range });

      // This would require backend implementation with OAuth
      logService.warn('GoogleSheetsService', 'Update operation requires backend support');
      return { success: false, message: 'Update requires backend support' };
    } catch (error) {
      logService.error('GoogleSheetsService', 'Failed to update sheet', { error });
      throw error;
    }
  }

  /**
   * Get spreadsheet metadata
   */
  async getSpreadsheetMetadata() {
    try {
      logService.debug('GoogleSheetsService', 'Fetching spreadsheet metadata');

      const url = `${this.baseUrl}/${this.spreadsheetId}?key=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to get metadata: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logService.error('GoogleSheetsService', 'Failed to get metadata', { error });
      throw error;
    }
  }

  /**
   * Get list of sheets
   */
  async getSheets() {
    try {
      logService.debug('GoogleSheetsService', 'Fetching sheets list');

      const metadata = await this.getSpreadsheetMetadata();
      return (
        metadata.sheets?.map((sheet) => ({
          id: sheet.properties.sheetId,
          title: sheet.properties.title,
          index: sheet.properties.index,
          sheetType: sheet.properties.sheetType,
        })) || []
      );
    } catch (error) {
      logService.error('GoogleSheetsService', 'Failed to get sheets list', { error });
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
