// API related types
export interface ApiConfig {
  baseURL: string
  timeout: number
  headers?: Record<string, string>
}

export interface ApiError {
  code: string
  message: string
  details?: unknown
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RequestConfig {
  method: HttpMethod
  url: string
  data?: unknown
  params?: Record<string, string | number>
  headers?: Record<string, string>
}
