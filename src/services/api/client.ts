import axios, { AxiosInstance } from 'axios';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, config?: any): Promise<T> {
    return this.client.get(url, config).then((res) => res.data);
  }

  post<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.post(url, data, config).then((res) => res.data);
  }

  put<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.put(url, data, config).then((res) => res.data);
  }

  delete<T>(url: string, config?: any): Promise<T> {
    return this.client.delete(url, config).then((res) => res.data);
  }
}

export const apiClient = new APIClient();
