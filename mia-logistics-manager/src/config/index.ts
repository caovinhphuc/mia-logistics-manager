// Application configuration
const getEnv = (key: string, defaultValue: string = ''): string => {
  if (typeof window !== 'undefined' && (window as any)[key]) {
    return (window as any)[key]
  }
  return defaultValue
}

export const config = {
  app: {
    name: 'MIA Logistics Manager',
    version: '0.1.0',
    description: 'Logistics Management System',
  },
  api: {
    baseURL: getEnv('REACT_APP_API_URL') || 'http://localhost:5000',
    timeout: 30000,
  },
  features: {
    enableAnalytics: getEnv('REACT_APP_ENABLE_ANALYTICS') === 'true',
    enableNotifications: getEnv('REACT_APP_ENABLE_NOTIFICATIONS') === 'true',
  },
} as const

export default config
