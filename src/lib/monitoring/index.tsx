/**
 * Monitoring and logging service for SkillOS platform
 * 
 * Provides comprehensive logging, performance monitoring, and error alerting
 */

import { createContext, useContext, ReactNode, useState, useEffect, ComponentType } from 'react';

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Log entry interface
interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  url?: string;
}

// Performance metric interface
interface PerformanceMetric {
  name: string;
  startTime: number;
  duration: number;
  context?: Record<string, any>;
}

// Error alert interface
interface ErrorAlert {
  timestamp: Date;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  url?: string;
}

// Monitoring context interface
interface MonitoringContextType {
  // Logging methods
  log: (level: LogLevel, message: string, context?: Record<string, any>) => void;
  debug: (message: string, context?: Record<string, any>) => void;
  info: (message: string, context?: Record<string, any>) => void;
  warn: (message: string, context?: Record<string, any>) => void;
  error: (message: string, error?: Error, context?: Record<string, any>) => void;
  critical: (message: string, error?: Error, context?: Record<string, any>) => void;
  
  // Performance monitoring methods
  startPerformanceMetric: (name: string, context?: Record<string, any>) => void;
  endPerformanceMetric: (name: string) => void;
  
  // Error alerting methods
  setAlertThreshold: (level: LogLevel) => void;
  
  // Configuration methods
  setLogLevel: (level: LogLevel) => void;
  enableConsoleLogging: (enabled: boolean) => void;
  enableRemoteLogging: (enabled: boolean) => void;
  
  // State
  logs: LogEntry[];
  performanceMetrics: PerformanceMetric[];
  alerts: ErrorAlert[];
}

// Create context
const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

// Provider props interface
interface MonitoringProviderProps {
  children: ReactNode;
  initialLogLevel?: LogLevel;
  enableConsole?: boolean;
  enableRemote?: boolean;
  remoteEndpoint?: string;
}

// Remote logging function
const sendToRemoteLogging = async (entry: LogEntry, endpoint?: string) => {
  if (!endpoint) return;
  
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });
  } catch (error) {
    console.error('Failed to send log to remote endpoint:', error);
  }
};

// Provider component
export const MonitoringProvider = ({
  children,
  initialLogLevel = LogLevel.INFO,
  enableConsole = true,
  enableRemote = false,
  remoteEndpoint,
}: MonitoringProviderProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [alerts, setAlerts] = useState<ErrorAlert[]>([]);
  const [logLevel, setLogLevel] = useState<LogLevel>(initialLogLevel);
  const [alertThreshold, setAlertThreshold] = useState<LogLevel>(LogLevel.ERROR);
  const [consoleLogging, setConsoleLogging] = useState<boolean>(enableConsole);
  const [remoteLogging, setRemoteLogging] = useState<boolean>(enableRemote);
  
  // Performance metrics tracking
  const [activeMetrics, setActiveMetrics] = useState<Record<string, number>>({});
  
  // Get user and session info
  const getUserInfo = () => {
    const userId = localStorage.getItem('userId') || undefined;
    const sessionId = sessionStorage.getItem('sessionId') || undefined;
    const url = typeof window !== 'undefined' ? window.location.href : undefined;
    
    return { userId, sessionId, url };
  };
  
  // Log method
  const log = (level: LogLevel, message: string, context?: Record<string, any>) => {
    // Check if we should log this level
    const logLevels = Object.values(LogLevel);
    const currentLevelIndex = logLevels.indexOf(logLevel);
    const messageLevelIndex = logLevels.indexOf(level);
    
    if (messageLevelIndex < currentLevelIndex) {
      return;
    }
    
    const { userId, sessionId, url } = getUserInfo();
    
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      userId,
      sessionId,
      url,
    };
    
    // Add to logs state
    setLogs((prevLogs) => [...prevLogs, entry]);
    
    // Console logging if enabled
    if (consoleLogging) {
      const consoleMethod = {
        [LogLevel.DEBUG]: console.debug,
        [LogLevel.INFO]: console.info,
        [LogLevel.WARN]: console.warn,
        [LogLevel.ERROR]: console.error,
        [LogLevel.CRITICAL]: console.error,
      }[level];
      
      consoleMethod(`[${level.toUpperCase()}] ${message}`, context);
    }
    
    // Remote logging if enabled
    if (remoteLogging) {
      sendToRemoteLogging(entry, remoteEndpoint);
    }
    
    // Check if we should create an alert
    const alertLevels = Object.values(LogLevel);
    const alertThresholdIndex = alertLevels.indexOf(alertThreshold);
    
    if (messageLevelIndex >= alertThresholdIndex) {
      const alert: ErrorAlert = {
        timestamp: new Date(),
        message,
        context,
        userId,
        sessionId,
        url,
      };
      
      setAlerts((prevAlerts) => [...prevAlerts, alert]);
    }
  };
  
  // Convenience logging methods
  const debug = (message: string, context?: Record<string, any>) => log(LogLevel.DEBUG, message, context);
  const info = (message: string, context?: Record<string, any>) => log(LogLevel.INFO, message, context);
  const warn = (message: string, context?: Record<string, any>) => log(LogLevel.WARN, message, context);
  const error = (message: string, error?: Error, context?: Record<string, any>) => {
    const errorContext = {
      ...context,
      ...(error && { stack: error.stack, name: error.name }),
    };
    log(LogLevel.ERROR, message, errorContext);
  };
  const critical = (message: string, error?: Error, context?: Record<string, any>) => {
    const errorContext = {
      ...context,
      ...(error && { stack: error.stack, name: error.name }),
    };
    log(LogLevel.CRITICAL, message, errorContext);
  };
  
  // Performance monitoring methods
  const startPerformanceMetric = (name: string, context?: Record<string, any>) => {
    const startTime = performance.now();
    setActiveMetrics((prev) => ({ ...prev, [name]: startTime }));
    debug(`Started performance metric: ${name}`, context);
  };
  
  const endPerformanceMetric = (name: string) => {
    const endTime = performance.now();
    const startTime = activeMetrics[name];
    
    if (!startTime) {
      warn(`Attempted to end performance metric that wasn't started: ${name}`);
      return;
    }
    
    const duration = endTime - startTime;
    
    const metric: PerformanceMetric = {
      name,
      startTime,
      duration,
    };
    
    setPerformanceMetrics((prev) => [...prev, metric]);
    setActiveMetrics((prev) => {
      const newActiveMetrics = { ...prev };
      delete newActiveMetrics[name];
      return newActiveMetrics;
    });
    
    debug(`Ended performance metric: ${name} (${duration.toFixed(2)}ms)`);
  };
  
  // Configuration methods
  const enableConsoleLogging = (enabled: boolean) => setConsoleLogging(enabled);
  const enableRemoteLogging = (enabled: boolean) => setRemoteLogging(enabled);
  
  // Global error handling
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleGlobalError = (event: ErrorEvent) => {
      critical('Unhandled error', new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
      
      // Don't prevent default error handling
      return false;
    };
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      critical('Unhandled promise rejection', new Error(String(event.reason)), {
        reason: event.reason,
      });
      
      // Don't prevent default error handling
      return false;
    };
    
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  // Performance monitoring for page loads
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Wait for page to fully load
    const handleLoad = () => {
      if (performance && performance.getEntriesByType) {
        // Get navigation timing
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming;
          
          const pageLoadMetric: PerformanceMetric = {
            name: 'page-load',
            startTime: 0,
            duration: navigationEntry.loadEventEnd,
            context: {
              domContentLoaded: navigationEntry.domContentLoadedEventEnd,
              firstPaint: navigationEntry.responseEnd,
              url: window.location.href,
            },
          };
          
          setPerformanceMetrics((prev) => [...prev, pageLoadMetric]);
          info(`Page loaded in ${pageLoadMetric.duration.toFixed(2)}ms`);
        }
      }
    };
    
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);
  
  const value = {
    log,
    debug,
    info,
    warn,
    error,
    critical,
    startPerformanceMetric,
    endPerformanceMetric,
    setAlertThreshold,
    setLogLevel,
    enableConsoleLogging,
    enableRemoteLogging,
    logs,
    performanceMetrics,
    alerts,
  };
  
  return (
    <MonitoringContext.Provider value={value}>
      {children}
    </MonitoringContext.Provider>
  );
};

// Hook for using the monitoring context
export const useMonitoring = () => {
  const context = useContext(MonitoringContext);
  
  if (context === undefined) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  
  return context;
};

// Higher-order component for monitoring component performance
// Fix: Properly constrain generic type T to be compatible with React component props
export function withPerformanceMonitoring<P extends object>(
  Component: ComponentType<P>,
  name?: string
) {
  const displayName = name || Component.displayName || Component.name || 'Component';
  
  // Fix: Use React.FC with explicit props type to ensure type compatibility
  const WithPerformanceMonitoring = (props: P) => {
    const { startPerformanceMetric, endPerformanceMetric } = useMonitoring();
    
    useEffect(() => {
      const metricName = `component-render-${displayName}`;
      startPerformanceMetric(metricName);
      
      return () => {
        endPerformanceMetric(metricName);
      };
    }, []);
    
    // Fix: Cast props to any to satisfy TypeScript when spreading onto Component
    return <Component {...(props as any)} />;
  };
  
  WithPerformanceMonitoring.displayName = `WithPerformanceMonitoring(${displayName})`;
  
  return WithPerformanceMonitoring;
}

// Performance monitoring hook for custom operations
export const usePerformanceMonitoring = (operationName: string) => {
  const { startPerformanceMetric, endPerformanceMetric } = useMonitoring();
  
  const trackOperation = (callback: () => any, context?: Record<string, any>) => {
    startPerformanceMetric(operationName, context);
    const result = callback();
    endPerformanceMetric(operationName);
    return result;
  };
  
  const trackAsyncOperation = async (callback: () => Promise<any>, context?: Record<string, any>) => {
    startPerformanceMetric(operationName, context);
    try {
      const result = await callback();
      endPerformanceMetric(operationName);
      return result;
    } catch (error) {
      endPerformanceMetric(operationName);
      throw error;
    }
  };
  
  return { trackOperation, trackAsyncOperation };
};
