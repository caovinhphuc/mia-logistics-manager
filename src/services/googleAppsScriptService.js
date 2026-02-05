import { googleAuthService } from './googleAuthService';
import { logService } from './logService';

const appsLogger = {
  debug: (message, data) => logService.debug('GoogleAppsScriptService', message, data),
  info: (message, data) => logService.info('GoogleAppsScriptService', message, data),
  warn: (message, data) => logService.warn('GoogleAppsScriptService', message, data),
  error: (message, error, data) =>
    logService.error('GoogleAppsScriptService', message, {
      ...data,
      error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
    }),
};

class GoogleAppsScriptService {
  constructor() {
    this.isConnected = false;
    this.scriptId = null;
    this.apiUrl = 'https://script.googleapis.com/v1';
    this.webAppUrl = null;
    this.availableFunctions = [];
  }

  async initialize() {
    try {
      appsLogger.debug('Initializing Google Apps Script Service');
      // Service will be connected when script ID is provided
    } catch (error) {
      appsLogger.error('Google Apps Script initialization failed', error);
      throw error;
    }
  }

  async connect(scriptId, webAppUrl = null) {
    try {
      this.scriptId = scriptId;
      this.webAppUrl = webAppUrl || process.env.REACT_APP_APPS_SCRIPT_WEB_APP_URL;

      // Test connection by getting script info
      const scriptInfo = await this.getScriptInfo();

      this.isConnected = true;
      appsLogger.info('Connected to Apps Script', {
        scriptTitle: scriptInfo.title,
        scriptId,
      });

      return scriptInfo;
    } catch (error) {
      appsLogger.error('Failed to connect to Google Apps Script', error, { scriptId });
      throw error;
    }
  }

  async disconnect() {
    this.isConnected = false;
    this.scriptId = null;
    this.webAppUrl = null;
    this.availableFunctions = [];
  }

  async getScriptInfo() {
    try {
      const headers = await googleAuthService.getAuthHeaders();

      const response = await fetch(`${this.apiUrl}/projects/${this.scriptId}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to get script info: ${response.statusText}`);
      }

      const info = await response.json();
      appsLogger.debug('Retrieved script info', { scriptId: this.scriptId });
      return info;
    } catch (error) {
      appsLogger.error('Failed to get script info', error, { scriptId: this.scriptId });
      throw error;
    }
  }

  async runFunction(functionName, parameters = []) {
    try {
      if (!this.isConnected) {
        throw new Error('Not connected to Apps Script');
      }

      const headers = await googleAuthService.getAuthHeaders();

      const requestBody = {
        function: functionName,
        parameters,
        devMode: process.env.NODE_ENV === 'development',
      };

      const response = await fetch(`${this.apiUrl}/scripts/${this.scriptId}:run`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Function execution failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(`Script error: ${result.error.details[0].errorMessage}`);
      }

      appsLogger.info('Apps Script function executed', { functionName });

      return result.response?.result;
    } catch (error) {
      appsLogger.error(`Failed to run function ${functionName}`, error);
      throw error;
    }
  }

  async runWebAppFunction(functionName, parameters = {}) {
    try {
      if (!this.webAppUrl) {
        throw new Error('Web App URL not configured');
      }

      const url = new URL(this.webAppUrl);
      url.searchParams.append('function', functionName);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameters),
      });

      // Đọc response text một lần để có thể kiểm tra HTML hoặc parse JSON
      const responseText = await response.text();

      // Kiểm tra xem response có phải HTML không (thường là trang đăng nhập hoặc lỗi)
      const trimmedText = responseText.trim();
      if (
        trimmedText.startsWith('<!DOCTYPE') ||
        trimmedText.startsWith('<html') ||
        trimmedText.startsWith('<HTML')
      ) {
        throw new Error(
          'HTML_RESPONSE: Google Apps Script trả về HTML thay vì JSON. Có thể Web App cần được cấu hình lại quyền truy cập (Execute as: Me, Who has access: Anyone).'
        );
      }

      // Thử parse JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Failed to parse JSON response: ${parseError.message}. Response preview: ${responseText.substring(0, 200)}`
        );
      }

      // Kiểm tra HTTP status
      if (!response.ok) {
        throw new Error(
          `Web App request failed (${response.status}): ${response.statusText}. Response: ${JSON.stringify(result)}`
        );
      }

      // Kiểm tra xem response có lỗi không
      if (result.error) {
        throw new Error(
          `Google Apps Script error: ${result.error.message || JSON.stringify(result.error)}`
        );
      }

      appsLogger.info('Web app function executed', { functionName });
      return result;
    } catch (error) {
      appsLogger.error(`Failed to run web app function ${functionName}`, error);

      // Cải thiện error message cho các lỗi phổ biến
      if (error.message.includes('HTML_RESPONSE') || error.message.includes('HTML')) {
        throw new Error(
          '❌ Google Apps Script trả về HTML thay vì JSON.\n' +
            'Vui lòng kiểm tra:\n' +
            "1. Web App đã được deploy với quyền 'Execute as: Me'\n" +
            "2. 'Who has access' được set là 'Anyone' hoặc 'Anyone with Google account'\n" +
            '3. URL Web App đúng và có thể truy cập được'
        );
      }

      throw error;
    }
  }

  async getFunctions() {
    try {
      if (!this.isConnected) {
        throw new Error('Not connected to Apps Script');
      }

      // Return predefined functions for MIA Logistics
      this.availableFunctions = [
        'calculateDistance',
        'optimizeRoute',
        'geocodeAddress',
        'reverseGeocode',
        'getTrafficInfo',
        'calculateDeliveryTime',
        'validateAddress',
        'getDirections',
        'calculateFuelCost',
        'optimizeMultipleRoutes',
      ];

      appsLogger.debug('Retrieved Apps Script functions list', {
        count: this.availableFunctions.length,
      });
      return this.availableFunctions;
    } catch (error) {
      appsLogger.error('Failed to get functions', error);
      throw error;
    }
  }

  // MIA Logistics specific functions
  async calculateDistance(origin, destination, options = {}) {
    try {
      const parameters = {
        origin,
        destination,
        mode: options.mode || 'DRIVING',
        units: options.units || 'METRIC',
        avoidHighways: options.avoidHighways || false,
        avoidTolls: options.avoidTolls || false,
      };

      if (this.webAppUrl) {
        return await this.runWebAppFunction('calculateDistance', parameters);
      } else {
        return await this.runFunction('calculateDistance', [parameters]);
      }
    } catch (error) {
      appsLogger.error('Distance calculation failed', error);
      throw error;
    }
  }

  async optimizeRoute(waypoints, options = {}) {
    try {
      const parameters = {
        waypoints,
        optimize: true,
        mode: options.mode || 'DRIVING',
        avoidHighways: options.avoidHighways || false,
        avoidTolls: options.avoidTolls || false,
      };

      if (this.webAppUrl) {
        return await this.runWebAppFunction('optimizeRoute', parameters);
      } else {
        return await this.runFunction('optimizeRoute', [parameters]);
      }
    } catch (error) {
      appsLogger.error('Route optimization failed', error);
      throw error;
    }
  }

  async geocodeAddress(address) {
    try {
      const parameters = { address };

      if (this.webAppUrl) {
        return await this.runWebAppFunction('geocodeAddress', parameters);
      } else {
        return await this.runFunction('geocodeAddress', [address]);
      }
    } catch (error) {
      appsLogger.error('Geocoding failed', error);
      throw error;
    }
  }

  async reverseGeocode(lat, lng) {
    try {
      const parameters = { lat, lng };

      if (this.webAppUrl) {
        return await this.runWebAppFunction('reverseGeocode', parameters);
      } else {
        return await this.runFunction('reverseGeocode', [lat, lng]);
      }
    } catch (error) {
      appsLogger.error('Reverse geocoding failed', error);
      throw error;
    }
  }

  async getTrafficInfo(origin, destination) {
    try {
      const parameters = { origin, destination };

      if (this.webAppUrl) {
        return await this.runWebAppFunction('getTrafficInfo', parameters);
      } else {
        return await this.runFunction('getTrafficInfo', [origin, destination]);
      }
    } catch (error) {
      appsLogger.error('Traffic info request failed', error);
      throw error;
    }
  }

  async calculateDeliveryTime(origin, destination, options = {}) {
    try {
      const parameters = {
        origin,
        destination,
        departureTime: options.departureTime || new Date().toISOString(),
        mode: options.mode || 'DRIVING',
        trafficModel: options.trafficModel || 'BEST_GUESS',
      };

      if (this.webAppUrl) {
        return await this.runWebAppFunction('calculateDeliveryTime', parameters);
      } else {
        return await this.runFunction('calculateDeliveryTime', [parameters]);
      }
    } catch (error) {
      appsLogger.error('Delivery time calculation failed', error);
      throw error;
    }
  }

  async validateAddress(address) {
    try {
      const parameters = { address };

      if (this.webAppUrl) {
        return await this.runWebAppFunction('validateAddress', parameters);
      } else {
        return await this.runFunction('validateAddress', [address]);
      }
    } catch (error) {
      appsLogger.error('Address validation failed', error);
      throw error;
    }
  }

  async getDirections(origin, destination, waypoints = []) {
    try {
      const parameters = {
        origin,
        destination,
        waypoints,
        mode: 'DRIVING',
        units: 'METRIC',
      };

      if (this.webAppUrl) {
        return await this.runWebAppFunction('getDirections', parameters);
      } else {
        return await this.runFunction('getDirections', [parameters]);
      }
    } catch (error) {
      appsLogger.error('Directions request failed', error);
      throw error;
    }
  }

  async calculateFuelCost(distance, fuelPrice, consumption = 8) {
    try {
      const parameters = {
        distance,
        fuelPrice,
        consumption, // liters per 100km
      };

      if (this.webAppUrl) {
        return await this.runWebAppFunction('calculateFuelCost', parameters);
      } else {
        return await this.runFunction('calculateFuelCost', [distance, fuelPrice, consumption]);
      }
    } catch (error) {
      appsLogger.error('Fuel cost calculation failed', error);
      throw error;
    }
  }

  async optimizeMultipleRoutes(routes, options = {}) {
    try {
      const parameters = {
        routes,
        optimize: true,
        maxRoutes: options.maxRoutes || 10,
        timeWindows: options.timeWindows || [],
      };

      if (this.webAppUrl) {
        return await this.runWebAppFunction('optimizeMultipleRoutes', parameters);
      } else {
        return await this.runFunction('optimizeMultipleRoutes', [parameters]);
      }
    } catch (error) {
      appsLogger.error('Multiple routes optimization failed', error);
      throw error;
    }
  }

  // Utility methods
  async testConnection() {
    try {
      // Nếu có Web App URL, test bằng cách gọi một function đơn giản
      if (this.webAppUrl) {
        try {
          // Test với calculateDistance - một function phổ biến
          const testResult = await this.calculateDistance('Ho Chi Minh City', 'Hanoi');

          if (testResult && (testResult.distance || testResult.error === undefined)) {
            return { success: true, method: 'webApp', result: testResult };
          } else {
            return {
              success: false,
              method: 'webApp',
              error: 'Invalid response format',
            };
          }
        } catch (error) {
          return {
            success: false,
            method: 'webApp',
            error: error.message,
          };
        }
      } else if (this.isConnected && this.scriptId) {
        // Test bằng API nếu không có Web App URL
        const result = await this.runFunction('testFunction', []);
        return { success: true, method: 'api', result };
      } else {
        return {
          success: false,
          error: 'Not connected to Apps Script. Please connect first.',
        };
      }
    } catch (error) {
      appsLogger.error('Apps Script connection test failed', error);
      return { success: false, error: error.message };
    }
  }

  async deployWebApp() {
    try {
      const headers = await googleAuthService.getAuthHeaders();

      const deploymentConfig = {
        versionNumber: 'HEAD',
        manifestFileName: 'appsscript',
        description: 'MIA Logistics Manager Web App',
      };

      const response = await fetch(`${this.apiUrl}/projects/${this.scriptId}/deployments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(deploymentConfig),
      });

      if (!response.ok) {
        throw new Error(`Deployment failed: ${response.statusText}`);
      }

      const payload = await response.json();
      appsLogger.info('Web app deployment created', { scriptId: this.scriptId });
      return payload;
    } catch (error) {
      appsLogger.error('Web app deployment failed', error);
      throw error;
    }
  }
}

export const googleAppsScriptService = new GoogleAppsScriptService();
