"use client";

import React, { useState, useEffect } from 'react';
import { logger, LogLevel } from './logger';

/**
 * Error monitoring and tracking utilities for SkillOS platform
 * 
 * This module provides error tracking, monitoring, and reporting functionality
 * to improve application stability and debugging capabilities.
 */

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error context interface
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  metadata?: Record<string, any>;
}

// Error tracking configuration
export interface ErrorTrackerConfig {
  applicationName: string;
  environment: 'development' | 'staging' | 'production';
  captureUnhandledErrors: boolean;
  captureUnhandledRejections: boolean;
  captureConsoleErrors: boolean;
  ignorePatterns?: RegExp[];
  maxErrorsPerMinute?: number;
  remoteEndpoint?: string;
}

// Default configuration
const defaultConfig: ErrorTrackerConfig = {
  applicationName: 'SkillOS',
  environment: 'development',
  captureUnhandledErrors: true,
  captureUnhandledRejections: true,
  captureConsoleErrors: true,
  maxErrorsPerMinute: 10
};

/**
 * Error tracker class for handling application errors
 */
export class ErrorTracker {
  private config: ErrorTrackerConfig;
  private errorCount: number = 0;
  private lastResetTime: number = Date.now();
  private originalConsoleError: typeof console.error;
  // Fix: Initialize properties or use definite assignment assertion
  private originalWindowOnError: typeof window.onerror | undefined;
  private originalWindowOnUnhandledRejection: typeof window.onunhandledrejection | undefined;
  
  constructor(config: Partial<ErrorTrackerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.originalConsoleError = console.error;
    
    // Initialize only in browser environment
    if (typeof window !== 'undefined') {
      this.originalWindowOnError = window.onerror;
      this.originalWindowOnUnhandledRejection = window.onunhandledrejection;
      
      // Set up global error handlers
      this.setupGlobalHandlers();
    }
  }
  
  /**
   * Set up global error handlers
   */
  private setupGlobalHandlers(): void {
    if (this.config.captureUnhandledErrors) {
      window.onerror = (message, source, lineno, colno, error) => {
        this.trackError(error || new Error(message as string), {
          action: 'unhandled_error',
          metadata: { source, lineno, colno }
        });
        
        // Call original handler if exists
        if (this.originalWindowOnError) {
          // Fix: Use apply to maintain the correct 'this' context
          return this.originalWindowOnError.apply(window, [message, source, lineno, colno, error]);
        }
        
        return false;
      };
    }
    
    if (this.config.captureUnhandledRejections) {
      window.onunhandledrejection = (event) => {
        this.trackError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
          action: 'unhandled_rejection'
        });
        
        // Call original handler if exists
        if (this.originalWindowOnUnhandledRejection) {
          // Fix: Use apply to maintain the correct 'this' context
          return this.originalWindowOnUnhandledRejection.apply(window, [event]);
        }
      };
    }
    
    if (this.config.captureConsoleErrors) {
      console.error = (...args) => {
        // Check if first argument is an Error
        if (args[0] instanceof Error) {
          this.trackError(args[0], {
            action: 'console_error'
          });
        }
        
        // Call original console.error
        this.originalConsoleError.apply(console, args);
      };
    }
  }
  
  /**
   * Track an error with optional context
   * @param error - Error object
   * @param context - Error context
   * @param severity - Error severity
   */
  public trackError(error: Error, context: ErrorContext = {}, severity: ErrorSeverity = ErrorSeverity.MEDIUM): void {
    // Check if error should be ignored
    if (this.shouldIgnoreError(error)) {
      return;
    }
    
    // Check rate limiting
    if (this.isRateLimited()) {
      return;
    }
    
    // Increment error count
    this.errorCount++;
    
    // Enrich context with browser information
    const enrichedContext = this.enrichContext(context);
    
    // Map severity to log level
    const logLevel = this.mapSeverityToLogLevel(severity);
    
    // Fix: Use public methods instead of private log method
    switch (logLevel) {
      case LogLevel.DEBUG:
        logger.debug(error.message, enrichedContext, ['error_tracker']);
        break;
      case LogLevel.INFO:
        logger.info(error.message, enrichedContext, ['error_tracker']);
        break;
      case LogLevel.WARN:
        logger.warn(error.message, enrichedContext, ['error_tracker']);
        break;
      case LogLevel.ERROR:
        logger.error(error.message, error, enrichedContext, ['error_tracker']);
        break;
      case LogLevel.FATAL:
        logger.fatal(error.message, error, enrichedContext, ['error_tracker']);
        break;
    }
    
    // Send to remote endpoint if configured
    this.sendToRemoteEndpoint(error, enrichedContext, severity);
  }
  
  /**
   * Check if error should be ignored based on patterns
   * @param error - Error to check
   * @returns Boolean indicating if error should be ignored
   */
  private shouldIgnoreError(error: Error): boolean {
    if (!this.config.ignorePatterns || this.config.ignorePatterns.length === 0) {
      return false;
    }
    
    return this.config.ignorePatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.stack || '')
    );
  }
  
  /**
   * Check if error tracking is rate limited
   * @returns Boolean indicating if rate limited
   */
  private isRateLimited(): boolean {
    const now = Date.now();
    const timeWindow = 60 * 1000; // 1 minute
    
    // Reset counter if time window has passed
    if (now - this.lastResetTime > timeWindow) {
      this.errorCount = 0;
      this.lastResetTime = now;
      return false;
    }
    
    return this.errorCount >= (this.config.maxErrorsPerMinute || 10);
  }
  
  /**
   * Enrich error context with browser information
   * @param context - Original context
   * @returns Enriched context
   */
  private enrichContext(context: ErrorContext): ErrorContext {
    const enriched: ErrorContext = { ...context };
    
    if (typeof window !== 'undefined') {
      // Add URL if not provided
      if (!enriched.url) {
        enriched.url = window.location.href;
      }
      
      // Add user and session IDs if available
      if (!enriched.userId) {
        const userId = localStorage.getItem('userId');
        if (userId) enriched.userId = userId;
      }
      
      if (!enriched.sessionId) {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) enriched.sessionId = sessionId;
      }
      
      // Add browser information
      enriched.metadata = {
        ...enriched.metadata,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`
      };
    }
    
    return enriched;
  }
  
  /**
   * Map error severity to log level
   * @param severity - Error severity
   * @returns Corresponding log level
   */
  private mapSeverityToLogLevel(severity: ErrorSeverity): LogLevel {
    switch (severity) {
      case ErrorSeverity.LOW:
        return LogLevel.WARN;
      case ErrorSeverity.MEDIUM:
        return LogLevel.ERROR;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return LogLevel.FATAL;
      default:
        return LogLevel.ERROR;
    }
  }
  
  /**
   * Send error to remote endpoint
   * @param error - Error object
   * @param context - Error context
   * @param severity - Error severity
   */
  private sendToRemoteEndpoint(error: Error, context: ErrorContext, severity: ErrorSeverity): void {
    if (!this.config.remoteEndpoint) {
      return;
    }
    
    // Prepare payload
    const payload = {
      application: this.config.applicationName,
      environment: this.config.environment,
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        severity
      },
      context
    };
    
    // Send to remote endpoint
    fetch(this.config.remoteEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      // Use keepalive to ensure errors are sent even if page is unloading
      keepalive: true
    }).catch(err => {
      // Log to console if remote logging fails
      console.error('[ErrorTracker] Failed to send error to remote endpoint:', err);
    });
  }
  
  /**
   * Clean up resources and restore original handlers
   */
  public dispose(): void {
    if (typeof window !== 'undefined') {
      // Restore original handlers
      if (this.config.captureUnhandledErrors) {
        // Fix: Add null check before assigning to window.onerror
        window.onerror = this.originalWindowOnError || null;
      }
      
      if (this.config.captureUnhandledRejections) {
        // Fix: Add null check before assigning to window.onunhandledrejection
        window.onunhandledrejection = this.originalWindowOnUnhandledRejection || null;
      }
      
      if (this.config.captureConsoleErrors) {
        console.error = this.originalConsoleError;
      }
    }
  }
}

// Create default error tracker instance
export const errorTracker = new ErrorTracker();

/**
 * React hook for error tracking in components
 * @param componentName - Name of the component
 * @returns Error tracking functions
 */
export const useErrorTracking = (componentName: string) => {
  return {
    /**
     * Track an error in the component
     * @param error - Error object
     * @param action - Action being performed when error occurred
     * @param metadata - Additional metadata
     * @param severity - Error severity
     */
    trackError: (
      error: Error,
      action?: string,
      metadata?: Record<string, any>,
      severity: ErrorSeverity = ErrorSeverity.MEDIUM
    ) => {
      errorTracker.trackError(error, {
        component: componentName,
        action,
        metadata
      }, severity);
    },
    
    /**
     * Create an error boundary for the component
     * @param fallback - Fallback UI to render when error occurs
     * @returns Error boundary component
     */
    ErrorBoundary: ({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) => {
      const [hasError, setHasError] = useState(false);
      
      useEffect(() => {
        const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
          errorTracker.trackError(error, {
            component: componentName,
            action: 'render',
            metadata: { errorInfo }
          });
          setHasError(true);
        };
        
        window.addEventListener('error', (event) => {
          if (event.error) {
            handleError(event.error, { componentStack: '' });
          }
        });
        
        return () => {
          window.removeEventListener('error', () => {});
        };
      }, []);
      
      if (hasError) {
        return <>{fallback}</>;
      }
      
      return <>{children}</>;
    }
  };
};

export default {
  ErrorTracker,
  errorTracker,
  useErrorTracking,
  ErrorSeverity
};
