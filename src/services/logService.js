/* eslint-disable no-console */
import { googleSheetsService } from './googleSheetsService';

class LogService {
  constructor() {
    this.logLevel = process.env.REACT_APP_LOG_LEVEL || 'info';
    this.logToConsole = process.env.REACT_APP_LOG_TO_CONSOLE === 'true';
    this.logToGoogleSheets = process.env.REACT_APP_LOG_TO_GOOGLE_SHEETS === 'true';
    this.localLogKey = 'mia-logs';
    this.maxLocalLogs = 1000;

    // Log levels
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
  }

  log(category, message, data = {}, level = 'info') {
    try {
      // Check if we should log this level
      if (this.levels[level] > this.levels[this.logLevel]) {
        return;
      }

      const logEntry = {
        id: this.generateLogId(),
        timestamp: new Date().toISOString(),
        level: level.toUpperCase(),
        category: category.toUpperCase(),
        message,
        data: JSON.stringify(data),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.getCurrentUserId(),
        sessionId: this.getCurrentSessionId(),
      };

      // Log to console if enabled
      if (this.logToConsole) {
        this.logToConsoleOutput(logEntry);
      }

      // Store locally
      this.storeLogLocally(logEntry);

      // Send to Google Sheets if enabled
      if (this.logToGoogleSheets) {
        this.logToGoogleSheetsAsync(logEntry);
      }

      return logEntry;
    } catch (error) {
      console.error('Logging failed:', error);
    }
  }

  error(category, message, data = {}) {
    return this.log(category, message, data, 'error');
  }

  warn(category, message, data = {}) {
    return this.log(category, message, data, 'warn');
  }

  info(category, message, data = {}) {
    return this.log(category, message, data, 'info');
  }

  debug(category, message, data = {}) {
    return this.log(category, message, data, 'debug');
  }

  logToConsoleOutput(logEntry) {
    const { level, category, message, data } = logEntry;
    const timestamp = new Date(logEntry.timestamp).toLocaleTimeString();

    const consoleMessage = `[${timestamp}] ${level} [${category}] ${message}`;

    switch (level) {
      case 'ERROR':
        console.error(consoleMessage, data ? JSON.parse(data) : '');
        break;
      case 'WARN':
        console.warn(consoleMessage, data ? JSON.parse(data) : '');
        break;
      case 'DEBUG':
        console.debug(consoleMessage, data ? JSON.parse(data) : '');
        break;
      default:
        logger.debug(consoleMessage, data ? JSON.parse(data) : '');
    }
  }

  storeLogLocally(logEntry) {
    try {
      const logs = this.getLocalLogs();
      logs.push(logEntry);

      // Keep only the most recent logs
      const recentLogs = logs.slice(-this.maxLocalLogs);

      localStorage.setItem(this.localLogKey, JSON.stringify(recentLogs));
    } catch (error) {
      console.error('Failed to store log locally:', error);
    }
  }

  getLocalLogs() {
    try {
      const logs = localStorage.getItem(this.localLogKey);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Failed to get local logs:', error);
      return [];
    }
  }

  clearLocalLogs() {
    localStorage.removeItem(this.localLogKey);
  }

  async logToGoogleSheetsAsync(logEntry) {
    try {
      // Don't wait for this to complete to avoid blocking
      setTimeout(async () => {
        try {
          await this.logToGoogleSheets(logEntry);
        } catch (error) {
          console.error('Failed to log to Google Sheets:', error);
        }
      }, 100);
    } catch (error) {
      console.error('Failed to queue Google Sheets log:', error);
    }
  }

  async logToGoogleSheets(logEntry) {
    try {
      if (!googleSheetsService.isConnected) {
        return;
      }

      const rowData = [
        logEntry.timestamp,
        logEntry.level,
        logEntry.category,
        logEntry.message,
        logEntry.data,
        logEntry.userId || '',
        logEntry.sessionId || '',
        logEntry.url,
        logEntry.userAgent,
      ];

      await googleSheetsService.appendValues('System_Logs', [rowData]);
    } catch (error) {
      console.error('Failed to log to Google Sheets:', error);
      // Don't throw here to avoid recursive logging
    }
  }

  generateLogId() {
    return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  getCurrentUserId() {
    try {
      const session = JSON.parse(localStorage.getItem('mia-session') || '{}');
      return session.user?.id || null;
    } catch {
      return null;
    }
  }

  getCurrentSessionId() {
    try {
      return sessionStorage.getItem('mia-session-id') || null;
    } catch {
      return null;
    }
  }

  // Log analysis utilities
  getLogsByCategory(category, hours = 24) {
    const logs = this.getLocalLogs();
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

    return logs.filter(
      (log) => log.category === category.toUpperCase() && new Date(log.timestamp) > cutoff
    );
  }

  getLogsByLevel(level, hours = 24) {
    const logs = this.getLocalLogs();
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);

    return logs.filter(
      (log) => log.level === level.toUpperCase() && new Date(log.timestamp) > cutoff
    );
  }

  getErrorLogs(hours = 24) {
    return this.getLogsByLevel('error', hours);
  }

  getLogStats(hours = 24) {
    const logs = this.getLocalLogs();
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentLogs = logs.filter((log) => new Date(log.timestamp) > cutoff);

    const stats = {
      total: recentLogs.length,
      byLevel: {},
      byCategory: {},
      errors: 0,
      warnings: 0,
    };

    recentLogs.forEach((log) => {
      // Count by level
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;

      // Count by category
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;

      // Count errors and warnings
      if (log.level === 'ERROR') stats.errors++;
      if (log.level === 'WARN') stats.warnings++;
    });

    return stats;
  }

  // Specific logging methods for MIA Logistics
  logUserAction(action, details = {}) {
    this.info('USER_ACTION', `User performed: ${action}`, details);
  }

  logTransportEvent(event, transportId, details = {}) {
    this.info('TRANSPORT', `Transport ${transportId}: ${event}`, details);
  }

  logWarehouseEvent(event, itemCode, details = {}) {
    this.info('WAREHOUSE', `Warehouse item ${itemCode}: ${event}`, details);
  }

  logSystemEvent(event, details = {}) {
    this.info('SYSTEM', event, details);
  }

  logSecurityEvent(event, details = {}) {
    this.warn('SECURITY', event, details);
  }

  logGoogleApiEvent(service, action, details = {}) {
    this.info('GOOGLE_API', `${service}: ${action}`, details);
  }

  logError(category, error, context = {}) {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context,
    };

    this.error(category, `Error occurred: ${error.message}`, errorDetails);
  }

  // Export logs
  exportLogs(format = 'json', hours = 24) {
    const logs = this.getLocalLogs();
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentLogs = logs.filter((log) => new Date(log.timestamp) > cutoff);

    if (format === 'csv') {
      return this.exportLogsAsCSV(recentLogs);
    }

    return JSON.stringify(recentLogs, null, 2);
  }

  exportLogsAsCSV(logs) {
    const headers = [
      'Timestamp',
      'Level',
      'Category',
      'Message',
      'Data',
      'User ID',
      'Session ID',
      'URL',
    ];
    const csvRows = [headers.join(',')];

    logs.forEach((log) => {
      const row = [
        log.timestamp,
        log.level,
        log.category,
        `"${log.message.replace(/"/g, '""')}"`,
        `"${log.data.replace(/"/g, '""')}"`,
        log.userId || '',
        log.sessionId || '',
        `"${log.url.replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\\n');
  }

  // Real-time logging for development
  startRealTimeLogging() {
    if (process.env.NODE_ENV === 'development') {
      // Override console methods to capture all logs
      const originalConsole = { ...console };

      logger.debug = (...args) => {
        this.debug('CONSOLE', args.join(' '));
        originalConsole.log(...args);
      };

      console.error = (...args) => {
        this.error('CONSOLE', args.join(' '));
        originalConsole.error(...args);
      };

      console.warn = (...args) => {
        this.warn('CONSOLE', args.join(' '));
        originalConsole.warn(...args);
      };
    }
  }
}

export const logService = new LogService();
