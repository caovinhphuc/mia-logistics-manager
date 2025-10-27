// Log Service for tracking activities
class LogService {
  constructor() {
    this.logs = [];
  }

  async log(level, message, data = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    this.logs.push(logEntry);
    console.log(`[${level}]`, message, data);

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }

    return logEntry;
  }

  async info(message, data) {
    return this.log("INFO", message, data);
  }

  async error(message, data) {
    return this.log("ERROR", message, data);
  }

  async warn(message, data) {
    return this.log("WARN", message, data);
  }

  async debug(message, data) {
    return this.log("DEBUG", message, data);
  }

  getLogs(limit = 100) {
    return this.logs.slice(-limit);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logService = new LogService();
