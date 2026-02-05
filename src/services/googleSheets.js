// Google Sheets API service for MIA Logistics Manager
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import { logService } from './logService';

const serverSheetsLogger = {
  debug: (message, data) => logService.debug('GoogleSheetsService(Node)', message, data),
  info: (message, data) => logService.info('GoogleSheetsService(Node)', message, data),
  warn: (message, data) => logService.warn('GoogleSheetsService(Node)', message, data),
  error: (message, error, data) =>
    logService.error('GoogleSheetsService(Node)', message, {
      ...data,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    }),
};

class GoogleSheetsService {
  constructor() {
    this.auth = null;
    this.sheets = null;
    this.spreadsheetId =
      process.env.REACT_APP_GOOGLE_SHEETS_SPREADSHEET_ID ||
      '18B1PIhCDmBWyHZytvOcfj_1QbYBwczLf1x1Qbu0E5As';
    // Don't auto-initialize to avoid errors on frontend
    // this.initialize();
  }

  async initialize() {
    try {
      // Initialize Google Auth with service account
      this.auth = new GoogleAuth({
        keyFile: './server/sinuous-aviary-474820-e3-c442968a0e87.json',
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive',
        ],
      });

      // Create authorized Sheets API client
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });

      serverSheetsLogger.info('Google Sheets service initialized successfully');
    } catch (error) {
      serverSheetsLogger.error('Failed to initialize Google Sheets service', error);
      throw error;
    }
  }

  // Generic method to read data from a sheet
  async readSheet(sheetName, range = 'A:Z') {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!${range}`,
      });

      const values = response.data.values || [];
      serverSheetsLogger.debug('Read sheet data', { sheetName, range, rows: values.length });
      return values;
    } catch (error) {
      serverSheetsLogger.error(`Error reading sheet ${sheetName}`, error, { range });
      throw error;
    }
  }

  // Generic method to write data to a sheet
  async writeSheet(sheetName, range, values) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!${range}`,
        valueInputOption: 'RAW',
        resource: {
          values: values,
        },
      });

      serverSheetsLogger.info('Sheet updated', {
        sheetName,
        range,
        updatedCells: response.data?.updatedCells,
      });
      return response.data;
    } catch (error) {
      serverSheetsLogger.error(`Error writing to sheet ${sheetName}`, error, { range });
      throw error;
    }
  }

  // Method to append data to a sheet
  async appendToSheet(sheetName, values) {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'RAW',
        resource: {
          values: values,
        },
      });

      serverSheetsLogger.info('Appended to sheet', {
        sheetName,
        updatedRows: response.data?.updates?.updatedRows,
      });
      return response.data;
    } catch (error) {
      serverSheetsLogger.error(`Error appending to sheet ${sheetName}`, error);
      throw error;
    }
  }

  // Locations-specific methods
  async getLocations() {
    try {
      const data = await this.readSheet('LocationsSheet');

      // Transform raw data to objects (assuming first row is headers)
      if (data.length === 0) return [];

      const headers = data[0];
      const locations = data.slice(1).map((row) => {
        const location = {};
        headers.forEach((header, index) => {
          location[header] = row[index] || '';
        });
        return location;
      });

      return locations;
    } catch (error) {
      serverSheetsLogger.error('Error getting locations', error);
      return [];
    }
  }

  async addLocation(locationData) {
    try {
      // Get current headers to maintain consistency
      const existingData = await this.readSheet('LocationsSheet', 'A1:Z1');
      const headers = existingData[0] || ['ID', 'Name', 'Address', 'Type', 'Status', 'CreatedAt'];

      // Transform object to array based on headers
      const rowData = headers.map((header) => locationData[header] || '');

      return await this.appendToSheet('LocationsSheet', [rowData]);
    } catch (error) {
      serverSheetsLogger.error('Error adding location', error);
      throw error;
    }
  }

  // Employees-specific methods
  async getEmployees() {
    try {
      const data = await this.readSheet('EmployeesSheet');

      if (data.length === 0) return [];

      const headers = data[0];
      const employees = data.slice(1).map((row) => {
        const employee = {};
        headers.forEach((header, index) => {
          employee[header] = row[index] || '';
        });
        return employee;
      });

      return employees;
    } catch (error) {
      serverSheetsLogger.error('Error getting employees', error);
      return [];
    }
  }

  // Carriers-specific methods
  async getCarriers() {
    try {
      const data = await this.readSheet('CarriersSheet');

      if (data.length === 0) return [];

      const headers = data[0];
      const carriers = data.slice(1).map((row) => {
        const carrier = {};
        headers.forEach((header, index) => {
          carrier[header] = row[index] || '';
        });
        return carrier;
      });

      return carriers;
    } catch (error) {
      serverSheetsLogger.error('Error getting carriers', error);
      return [];
    }
  }

  // Transport Requests methods
  async getTransportRequests() {
    try {
      const data = await this.readSheet('TransportRequestsSheet');

      if (data.length === 0) return [];

      const headers = data[0];
      const requests = data.slice(1).map((row) => {
        const request = {};
        headers.forEach((header, index) => {
          request[header] = row[index] || '';
        });
        return request;
      });

      return requests;
    } catch (error) {
      serverSheetsLogger.error('Error getting transport requests', error);
      return [];
    }
  }

  // Test connection method
  async testConnection() {
    try {
      if (!this.sheets) {
        await this.initialize();
      }

      // Try to get spreadsheet metadata
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      serverSheetsLogger.info('Google Sheets connection test successful', {
        title: response.data.properties.title,
        sheets: response.data.sheets.map((sheet) => sheet.properties.title),
      });

      return true;
    } catch (error) {
      serverSheetsLogger.error('Google Sheets connection test failed', error);
      return false;
    }
  }
}

// Export singleton instance
const serverSheetsServiceInstance = new GoogleSheetsService();
export default serverSheetsServiceInstance;
