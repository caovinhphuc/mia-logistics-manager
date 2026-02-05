// src/services/googleSheets/baseService.ts
import axios from 'axios';

const API_BASE_URL =
  (process.env.REACT_APP_API_URL as string) ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3100' : '');

function toResourcePath(sheetName: string): string {
  // Map sheet titles to REST resource names
  const normalized = sheetName.trim().toLowerCase();
  switch (normalized) {
    case 'orders':
      return 'orders';
    case 'carriers':
      return 'carriers';
    default:
      return normalized;
  }
}

export class BaseGoogleSheetsService {
  async addRecord<T extends Record<string, unknown>>(sheetName: string, data: T): Promise<T> {
    const resource = toResourcePath(sheetName);
    const response = await axios.post(`${API_BASE_URL}/api/${resource}`, data);
    return response.data as T;
  }

  async getRecords<T>(sheetName: string, limit?: number): Promise<T[]> {
    const resource = toResourcePath(sheetName);
    const response = await axios.get(`${API_BASE_URL}/api/${resource}`, {
      params: { limit },
    });
    return response.data as T[];
  }

  async updateRecord<T extends Record<string, unknown>>(
    sheetName: string,
    id: string,
    _idField: string,
    updates: Partial<T>
  ): Promise<T> {
    const resource = toResourcePath(sheetName);
    const response = await axios.put(`${API_BASE_URL}/api/${resource}/${id}`, updates);
    return response.data as T;
  }

  async deleteRecord(sheetName: string, id: string, _idField: string): Promise<boolean> {
    const resource = toResourcePath(sheetName);
    await axios.delete(`${API_BASE_URL}/api/${resource}/${id}`);
    return true;
  }
}
