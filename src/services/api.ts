import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch(url, data, config);
    return response.data;
  }

  // Authentication endpoints
  async login(credentials: { email: string; password: string }) {
    return this.post<{ token: string; user: any }>('/auth/login', credentials);
  }

  async logout() {
    return this.post('/auth/logout');
  }

  // Locations endpoints
  async getLocations(spreadsheetId?: string) {
    const params = spreadsheetId ? { spreadsheetId } : {};
    return this.get<any[]>('/locations', { params });
  }

  async createLocation(location: any, spreadsheetId?: string) {
    const params = spreadsheetId ? { spreadsheetId } : {};
    return this.post('/locations', location, { params });
  }

  async updateLocation(id: string, location: any, spreadsheetId?: string) {
    const params = spreadsheetId ? { spreadsheetId } : {};
    return this.put(`/locations/${id}`, location, { params });
  }

  async deleteLocation(id: string, spreadsheetId?: string) {
    const params = spreadsheetId ? { spreadsheetId } : {};
    return this.delete(`/locations/${id}`, { params });
  }

  // Carriers endpoints
  async getCarriers() {
    return this.get<any[]>('/carriers');
  }

  async createCarrier(carrier: any) {
    return this.post('/carriers', carrier);
  }

  async updateCarrier(id: string, carrier: any) {
    return this.put(`/carriers/${id}`, carrier);
  }

  async deleteCarrier(id: string) {
    return this.delete(`/carriers/${id}`);
  }

  // Shipments endpoints
  async getShipments() {
    return this.get<any[]>('/shipments');
  }

  async createShipment(shipment: any) {
    return this.post('/shipments', shipment);
  }

  async updateShipment(id: string, shipment: any) {
    return this.put(`/shipments/${id}`, shipment);
  }

  async deleteShipment(id: string) {
    return this.delete(`/shipments/${id}`);
  }

  // Maps endpoints
  async getDistance(origin: string, destination: string) {
    return this.get<{ distance: number }>('/maps/distance', {
      params: { origin, destination },
    });
  }

  async geocodeAddress(address: string) {
    return this.get<{ lat: number; lng: number }>('/maps/geocode', {
      params: { address },
    });
  }
}

// Create and export singleton instance
export const apiService = new ApiService();
export default apiService;
