/**
 * Logger utility for SkillOS platform
 * 
 * This module provides standardized logging functionality with different
 * severity levels, context tracking, and integration with monitoring services.
 */

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  tags?: string[];
  userId?: string;
  sessionId?: string;
  error?: Error;
}

// Logger configuration
export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  applicationName: string;
  environment: 'development' | 'staging' | 'production';
  batchSize?: number;
  flushInterval?: number; // in milliseconds
}

// Default configuration
const defaultConfig: LoggerConfig = {
  minLevel: LogLevel.INFO,
  enableConsole: true,
  enableRemote: false,
  applicationName: 'SkillOS',
  environment: 'development',
  batchSize: 10,
  flushInterval: 5000
};

/**
 * Logger class for handling application logs
 */
export class Logger {
  private config: LoggerConfig;
  private logQueue: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private context: Record<string, any> = {};
  
  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    
    // Start flush timer if remote logging is enabled
    if (this.config.enableRemote) {
      this.startFlushTimer();
    }
  }
  
  /**
   * Set global context for all subsequent log entries
   * @param context - Context object to merge with existing context
   */
  public setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
  }
  
  /**
   * Clear global context
   */
  public clearContext(): void {
    this.context = {};
  }
  
  /**
   * Log a debug message
   * @param message - Log message
   * @param context - Additional context
   * @param tags - Tags for categorizing logs
   */
  public debug(message: string, context?: Record<string, any>, tags?: string[]): void {
    this.log(LogLevel.DEBUG, message, context, tags);
  }
  
  /**
   * Log an info message
   * @param message - Log message
   * @param context - Additional context
   * @param tags - Tags for categorizing logs
   */
  public info(message: string, context?: Record<string, any>, tags?: string[]): void {
    this.log(LogLevel.INFO, message, context, tags);
  }
  
  /**
   * Log a warning message
   * @param message - Log message
   * @param context - Additional context
   * @param tags - Tags for categorizing logs
   */
  public warn(message: string, context?: Record<string, any>, tags?: string[]): void {
    this.log(LogLevel.WARN, message, context, tags);
  }
  
  /**
   * Log an error message
   * @param message - Log message
   * @param error - Error object
   * @param context - Additional context
   * @param tags - Tags for categorizing logs
   */
  public error(message: string, error?: Error, context?: Record<string, any>, tags?: string[]): void {
    this.log(LogLevel.ERROR, message, { ...context, error }, tags, error);
  }
  
  /**
   * Log a fatal error message
   * @param message - Log message
   * @param error - Error object
   * @param context - Additional context
   * @param tags - Tags for categorizing logs
   */
  public fatal(message: string, error?: Error, context?: Record<string, any>, tags?: string[]): void {
    this.log(LogLevel.FATAL, message, { ...context, error }, tags, error);
  }
  
  /**
   * Log a message with specified level
   * @param level - Log level
   * @param message - Log message
   * @param context - Additional context
   * @param tags - Tags for categorizing logs
   * @param error - Error object
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>, tags?: string[], error?: Error): void {
    // Skip if below minimum log level
    if (this.shouldSkip(level)) {
      return;
    }
    
    // Create log entry
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: { ...this.context, ...context },
      tags,
      error
    };
    
    // Add user and session IDs if available
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('userId');
      const sessionId = localStorage.getItem('sessionId');
      
      if (userId) entry.userId = userId;
      if (sessionId) entry.sessionId = sessionId;
    }
    
    // Log to console if enabled
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }
    
    // Queue for remote logging if enabled
    if (this.config.enableRemote) {
      this.queueForRemoteLogging(entry);
    }
  }
  
  /**
   * Check if log should be skipped based on level
   * @param level - Log level to check
   * @returns Boolean indicating if log should be skipped
   */
  private shouldSkip(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR, LogLevel.FATAL];
    const minLevelIndex = levels.indexOf(this.config.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex < minLevelIndex;
  }
  
  /**
   * Log entry to console
   * @param entry - Log entry to log
   */
  private logToConsole(entry: LogEntry): void {
    const { level, message, context, error } = entry;
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, context || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, message, context || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, context || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, error || '', context || '');
        break;
      case LogLevel.FATAL:
        console.error(prefix, message, error || '', context || '');
        break;
    }
  }
  
  /**
   * Queue log entry for remote logging
   * @param entry - Log entry to queue
   */
  private queueForRemoteLogging(entry: LogEntry): void {
    this.logQueue.push(entry);
    
    // Flush if queue exceeds batch size
    if (this.logQueue.length >= (this.config.batchSize || 10)) {
      this.flush();
    }
  }
  
  /**
   * Start flush timer for periodic remote logging
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    
    this.flushTimer = setInterval(() => {
      if (this.logQueue.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval || 5000);
  }
  
  /**
   * Flush log queue to remote endpoint
   */
  public flush(): void {
    if (!this.config.enableRemote || this.logQueue.length === 0) {
      return;
    }
    
    const logs = [...this.logQueue];
    this.logQueue = [];
    
    // Prepare payload
    const payload = {
      application: this.config.applicationName,
      environment: this.config.environment,
      logs
    };
    
    // Send logs to remote endpoint
    if (this.config.remoteEndpoint) {
      fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        // Use keepalive to ensure logs are sent even if page is unloading
        keepalive: true
      }).catch(error => {
        // Log to console if remote logging fails
        console.error('[Logger] Failed to send logs to remote endpoint:', error);
        
        // Re-queue logs if remote logging fails
        this.logQueue = [...logs, ...this.logQueue];
      });
    } else {
      // Mock remote logging for development
      console.log('[Logger] Remote logging payload:', payload);
    }
  }
  
  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    // Flush any remaining logs
    this.flush();
  }
}

// Create default logger instance
export const logger = new Logger();

// Export default logger
export default logger;
