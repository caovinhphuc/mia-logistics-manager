import { CONSTANTS } from "../utils/constants";
import { googleApiLoader } from "./googleApiLoader";

class GoogleSheetsService {
  constructor() {
    this.isConnected = false;
    this.spreadsheetId = null;
    this.apiUrl = "https://sheets.googleapis.com/v4/spreadsheets";
  }

  async initialize() {
    try {
      console.log("🔄 Initializing Google Sheets Service");
      await googleApiLoader.initializeClient();
      console.log("✅ Google Sheets Service initialized");
    } catch (error) {
      console.error("❌ Google Sheets initialization failed:", error);
      throw error;
    }
  }

  async connect(spreadsheetId) {
    try {
      this.spreadsheetId = spreadsheetId || CONSTANTS.GOOGLE.SPREADSHEET_ID;

      if (!this.spreadsheetId) {
        throw new Error("Spreadsheet ID not provided");
      }

      // Test connection by getting spreadsheet metadata
      const response = await window.gapi.client.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });

      this.isConnected = true;
      const spreadsheet = response.result;

      console.log(
        `✅ Connected to spreadsheet: ${spreadsheet.properties.title}`,
      );

      return {
        title: spreadsheet.properties.title,
        sheetCount: spreadsheet.sheets.length,
        sheets: spreadsheet.sheets.map((sheet) => sheet.properties.title),
      };
    } catch (error) {
      console.error("Failed to connect to Google Sheets:", error);
      throw error;
    }
  }

  async disconnect() {
    this.isConnected = false;
    this.spreadsheetId = null;
    console.log("✅ Disconnected from Google Sheets");
  }

  async getValues(sheetName, range = null) {
    try {
      if (!this.isConnected) {
        throw new Error("Not connected to Google Sheets");
      }

      const fullRange = range ? `${sheetName}!${range}` : `${sheetName}!A:Z`;

      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: fullRange,
      });

      return response.result.values || [];
    } catch (error) {
      console.error(`❌ Failed to get values from ${sheetName}:`, error);
      throw error;
    }
  }

  async updateValues(sheetName, range, values) {
    try {
      if (!this.isConnected) {
        throw new Error("Not connected to Google Sheets");
      }

      const fullRange = `${sheetName}!${range}`;

      const response =
        await window.gapi.client.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: fullRange,
          valueInputOption: "RAW",
          resource: {
            values: values,
          },
        });

      console.log(
        `✅ Updated ${response.result.updatedCells} cells in ${sheetName}`,
      );
      return response.result;
    } catch (error) {
      console.error(`❌ Failed to update values in ${sheetName}:`, error);
      throw error;
    }
  }

  async appendValues(sheetName, values) {
    try {
      if (!this.isConnected) {
        throw new Error("Not connected to Google Sheets");
      }

      const fullRange = `${sheetName}!A:Z`;

      const response =
        await window.gapi.client.sheets.spreadsheets.values.append({
          spreadsheetId: this.spreadsheetId,
          range: fullRange,
          valueInputOption: "RAW",
          resource: {
            values: values,
          },
        });

      console.log(
        `✅ Added ${response.result.updates.updatedRows} rows to ${sheetName}`,
      );
      return response.result;
    } catch (error) {
      console.error(`Failed to append values to ${sheetName}:`, error);
      throw error;
    }
  }

  async getHeaders(sheetName) {
    try {
      if (!this.isConnected) {
        throw new Error("Not connected to Google Sheets");
      }

      // Get first row as headers
      const values = await this.getValues(sheetName, "A1:Z1");
      return values[0] || [];
    } catch (error) {
      console.error(`Failed to get headers from ${sheetName}:`, error);
      throw error;
    }
  }

  async createSheet(title, headers = []) {
    try {
      if (!this.isConnected) {
        throw new Error("Not connected to spreadsheet");
      }

      const sheet = await this.doc.addSheet({ title, headerValues: headers });
      this.sheets[title] = sheet;

      return sheet;
    } catch (error) {
      console.error(`Failed to create sheet ${title}:`, error);
      throw error;
    }
  }

  async deleteSheet(sheetName) {
    try {
      if (!this.isConnected || !this.sheets[sheetName]) {
        throw new Error(`Sheet "${sheetName}" not found or not connected`);
      }

      await this.sheets[sheetName].delete();
      delete this.sheets[sheetName];

      return { success: true };
    } catch (error) {
      console.error(`Failed to delete sheet ${sheetName}:`, error);
      throw error;
    }
  }

  async syncData() {
    try {
      if (!this.isConnected) {
        throw new Error("Not connected to spreadsheet");
      }

      // Reload document info to get latest changes
      await this.doc.loadInfo();

      // Update sheet references
      this.sheets = {};
      this.doc.sheetsByIndex.forEach((sheet) => {
        this.sheets[sheet.title] = sheet;
      });

      return { success: true, lastSync: new Date().toISOString() };
    } catch (error) {
      console.error("Failed to sync data:", error);
      throw error;
    }
  }

  // Helper methods
  parseRange(range) {
    // Parse A1 notation like "A1:C10"
    const [start, end] = range.split(":");
    const startCol = this.columnToIndex(start.replace(/\\d+/, ""));
    const startRow = parseInt(start.replace(/[A-Z]+/, "")) - 1;
    const endCol = this.columnToIndex(end.replace(/\\d+/, ""));
    const endRow = parseInt(end.replace(/[A-Z]+/, "")) - 1;

    return { startRow, startCol, endRow, endCol };
  }

  columnToIndex(column) {
    let result = 0;
    for (let i = 0; i < column.length; i++) {
      result = result * 26 + (column.charCodeAt(i) - "A".charCodeAt(0) + 1);
    }
    return result - 1;
  }

  parseCellRange(sheet, range) {
    const { startRow, startCol, endRow, endCol } = this.parseRange(range);
    const result = [];

    for (let row = startRow; row <= endRow; row++) {
      const rowData = [];
      for (let col = startCol; col <= endCol; col++) {
        const cell = sheet.getCell(row, col);
        rowData.push(cell.value);
      }
      result.push(rowData);
    }

    return result;
  }

  // Predefined sheet operations for MIA Logistics
  async getTransportRequests() {
    return await this.getValues("Transport_Requests");
  }

  async addTransportRequest(requestData) {
    return await this.appendValues("Transport_Requests", [requestData]);
  }

  async updateTransportRequest(requestId, updates) {
    // Implementation for updating specific transport request
    // This would require finding the row by ID first
  }

  async getWarehouseInventory() {
    return await this.getValues("Warehouse_Inventory");
  }

  async updateInventory(itemCode, quantity) {
    // Implementation for updating inventory quantities
  }

  async getStaffList() {
    return await this.getValues("Staff_Management");
  }

  async getPartnersList() {
    return await this.getValues("Partners_Data");
  }
}

export const googleSheetsService = new GoogleSheetsService();
