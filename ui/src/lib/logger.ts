/**
 * Professional Logging Service for Ads Pro Platform
 * Provides structured logging with levels, contexts, and environments
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export interface LogContext {
  component?: string;
  userId?: string;
  sessionId?: string;
  campaignId?: string;
  adAccountId?: string;
  action?: string;
  timestamp?: string;
  environment?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context: LogContext;
  error?: Error;
  stack?: string;
  timestamp: string;
  environment: string;
}

class Logger {
  private minLevel: LogLevel;
  private context: LogContext;
  private isProduction: boolean;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  constructor() {
    this.isProduction = import.meta.env.PROD || false;
    this.minLevel = this.isProduction ? LogLevel.WARN : LogLevel.DEBUG;
    this.context = {
      environment: import.meta.env.MODE || 'development',
      sessionId: this.generateSessionId()
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatMessage(level: LogLevel, message: string, context: LogContext): string {
    const levelName = LogLevel[level];
    const timestamp = new Date().toISOString();
    const component = context.component ? `[${context.component}]` : '';
    const action = context.action ? `(${context.action})` : '';
    
    return `${timestamp} ${levelName} ${component}${action} ${message}`;
  }

  private createLogEntry(level: LogLevel, message: string, context: LogContext, error?: Error): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      context: { ...this.context, ...context },
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE || 'development'
    };

    if (error) {
      entry.error = error;
      entry.stack = error.stack;
    }

    return entry;
  }

  private storeLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Keep only recent logs in memory
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // In production, send to monitoring service
    if (this.isProduction && entry.level >= LogLevel.ERROR) {
      this.sendToMonitoring(entry);
    }
  }

  private sendToConsole(entry: LogEntry): void {
    const formattedMessage = this.formatMessage(entry.level, entry.message, entry.context);
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, entry.context);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, entry.context);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, entry.context);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(formattedMessage, entry.context, entry.error);
        break;
    }
  }

  private async sendToMonitoring(entry: LogEntry): Promise<void> {
    try {
      // Send to monitoring service (Sentry, LogRocket, etc.)
      // For now, just console.error in production
      if (this.isProduction) {
        console.error('PRODUCTION ERROR:', entry);
      }
    } catch (error) {
      console.error('Failed to send log to monitoring:', error);
    }
  }

  // Public logging methods
  debug(message: string, context: LogContext = {}): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.storeLog(entry);
    this.sendToConsole(entry);
  }

  info(message: string, context: LogContext = {}): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.storeLog(entry);
    this.sendToConsole(entry);
  }

  warn(message: string, context: LogContext = {}): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    this.storeLog(entry);
    this.sendToConsole(entry);
  }

  error(message: string, error?: Error, context: LogContext = {}): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.storeLog(entry);
    this.sendToConsole(entry);
  }

  critical(message: string, error?: Error, context: LogContext = {}): void {
    const entry = this.createLogEntry(LogLevel.CRITICAL, message, context, error);
    this.storeLog(entry);
    this.sendToConsole(entry);
  }

  // Component-specific logger
  withContext(context: LogContext): ComponentLogger {
    return new ComponentLogger(this, context);
  }

  // Utility methods
  setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Performance logging
  startTimer(label: string, context: LogContext = {}): () => void {
    const start = performance.now();
    this.debug(`Timer started: ${label}`, context);
    
    return () => {
      const duration = performance.now() - start;
      this.info(`Timer completed: ${label} (${duration.toFixed(2)}ms)`, {
        ...context,
        duration,
        action: 'performance_timer'
      });
    };
  }

  // API logging helpers
  logApiRequest(url: string, method: string, context: LogContext = {}): void {
    this.info(`API Request: ${method} ${url}`, {
      ...context,
      action: 'api_request',
      url,
      method
    });
  }

  logApiResponse(url: string, status: number, duration: number, context: LogContext = {}): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `API Response: ${status} ${url} (${duration}ms)`;
    
    if (level === LogLevel.ERROR) {
      this.error(message, undefined, { ...context, action: 'api_response', url, status, duration });
    } else {
      this.info(message, { ...context, action: 'api_response', url, status, duration });
    }
  }

  // User action logging
  logUserAction(action: string, context: LogContext = {}): void {
    this.info(`User Action: ${action}`, {
      ...context,
      action: 'user_interaction'
    });
  }

  // Campaign logging
  logCampaignEvent(event: string, campaignId: string, context: LogContext = {}): void {
    this.info(`Campaign Event: ${event}`, {
      ...context,
      campaignId,
      action: 'campaign_event'
    });
  }
}

// Component-specific logger for better organization
class ComponentLogger {
  constructor(private logger: Logger, private componentContext: LogContext) {}

  debug(message: string, context: LogContext = {}): void {
    this.logger.debug(message, { ...this.componentContext, ...context });
  }

  info(message: string, context: LogContext = {}): void {
    this.logger.info(message, { ...this.componentContext, ...context });
  }

  warn(message: string, context: LogContext = {}): void {
    this.logger.warn(message, { ...this.componentContext, ...context });
  }

  error(message: string, error?: Error, context: LogContext = {}): void {
    this.logger.error(message, error, { ...this.componentContext, ...context });
  }

  critical(message: string, error?: Error, context: LogContext = {}): void {
    this.logger.critical(message, error, { ...this.componentContext, ...context });
  }

  startTimer(label: string, context: LogContext = {}): () => void {
    return this.logger.startTimer(label, { ...this.componentContext, ...context });
  }

  logApiRequest(url: string, method: string, context: LogContext = {}): void {
    this.logger.logApiRequest(url, method, { ...this.componentContext, ...context });
  }

  logApiResponse(url: string, status: number, duration: number, context: LogContext = {}): void {
    this.logger.logApiResponse(url, status, duration, { ...this.componentContext, ...context });
  }

  logUserAction(action: string, context: LogContext = {}): void {
    this.logger.logUserAction(action, { ...this.componentContext, ...context });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions for quick usage
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: LogContext) => logger.error(message, error, context),
  critical: (message: string, error?: Error, context?: LogContext) => logger.critical(message, error, context),
  withContext: (context: LogContext) => logger.withContext(context),
  startTimer: (label: string, context?: LogContext) => logger.startTimer(label, context),
  userAction: (action: string, context?: LogContext) => logger.logUserAction(action, context),
  apiRequest: (url: string, method: string, context?: LogContext) => logger.logApiRequest(url, method, context),
  apiResponse: (url: string, status: number, duration: number, context?: LogContext) => logger.logApiResponse(url, status, duration, context),
  campaignEvent: (event: string, campaignId: string, context?: LogContext) => logger.logCampaignEvent(event, campaignId, context)
};

export default logger;