class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = { level, timestamp, message, data };
    this.logs.push(logEntry);
    
    // In a real app, this would send to a logging service
    console.log(`[${level}] ${timestamp}: ${message}`, data);
  }

  info(message, data = {}) {
    this.log('INFO', message, data);
  }

  warn(message, data = {}) {
    this.log('WARN', message, data);
  }

  error(message, data = {}) {
    this.log('ERROR', message, data);
  }

  getLogs() {
    return this.logs;
  }
}

const logger = new Logger();
export default logger;