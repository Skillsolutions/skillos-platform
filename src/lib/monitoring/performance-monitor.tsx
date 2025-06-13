"use client";

import React, { useState, useEffect } from 'react';
import { logger } from './logger';
import { errorTracker } from './error-tracker';

/**
 * Performance monitoring utilities for SkillOS platform
 * 
 * This module provides performance tracking, monitoring, and reporting functionality
 * to improve application performance and user experience.
 */

// Performance metric types
export enum MetricType {
  PAGE_LOAD = 'page_load',
  COMPONENT_RENDER = 'component_render',
  API_CALL = 'api_call',
  RESOURCE_LOAD = 'resource_load',
  USER_INTERACTION = 'user_interaction',
  CUSTOM = 'custom'
}

// Performance metric interface
export interface PerformanceMetric {
  type: MetricType;
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Performance monitoring configuration
export interface PerformanceMonitorConfig {
  applicationName: string;
  environment: 'development' | 'staging' | 'production';
  sampleRate: number; // 0-1, percentage of metrics to collect
  trackPageLoads: boolean;
  trackApiCalls: boolean;
  trackResourceLoads: boolean;
  trackLongTasks: boolean;
  trackMemoryUsage: boolean;
  remoteEndpoint?: string;
  metricBufferSize?: number;
  reportingInterval?: number; // in milliseconds
}

// Default configuration
const defaultConfig: PerformanceMonitorConfig = {
  applicationName: 'SkillOS',
  environment: 'development',
  sampleRate: 1.0, // 100% in development
  trackPageLoads: true,
  trackApiCalls: true,
  trackResourceLoads: true,
  trackLongTasks: true,
  trackMemoryUsage: true,
  metricBufferSize: 50,
  reportingInterval: 30000 // 30 seconds
};

/**
 * Performance monitor class for tracking application performance
 */
export class PerformanceMonitor {
  private config: PerformanceMonitorConfig;
  private metrics: PerformanceMetric[] = [];
  private reportingTimer: NodeJS.Timeout | null = null;
  private originalFetch: typeof fetch;
  private marks: Record<string, number> = {};
  
  constructor(config: Partial<PerformanceMonitorConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.originalFetch = typeof fetch !== 'undefined' ? fetch : (() => Promise.resolve()) as any;
    
    // Initialize only in browser environment
    if (typeof window !== 'undefined') {
      // Set up performance observers
      this.setupPerformanceObservers();
      
      // Start reporting timer
      this.startReportingTimer();
      
      // Track initial page load
      if (this.config.trackPageLoads) {
        this.trackPageLoad();
      }
      
      // Intercept fetch calls
      if (this.config.trackApiCalls) {
        this.interceptFetch();
      }
    }
  }
  
  /**
   * Set up performance observers
   */
  private setupPerformanceObservers(): void {
    if (!window.PerformanceObserver) {
      return;
    }
    
    // Track resource loads
    if (this.config.trackResourceLoads) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            // Skip tracking of monitoring endpoints
            if (this.config.remoteEndpoint && entry.name.includes(this.config.remoteEndpoint)) {
              return;
            }
            
            this.trackResourceLoad(entry as PerformanceResourceTiming);
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (error) {
        logger.warn('Failed to set up resource performance observer', { error });
      }
    }
    
    // Track long tasks
    if (this.config.trackLongTasks && 'PerformanceLongTaskTiming' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.addMetric({
              type: MetricType.CUSTOM,
              name: 'long_task',
              duration: entry.duration,
              timestamp: performance.now(),
              metadata: {
                startTime: entry.startTime,
                attribution: (entry as any).attribution
              }
            });
          });
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        logger.warn('Failed to set up long task performance observer', { error });
      }
    }
  }
  
  /**
   * Track initial page load performance
   */
  private trackPageLoad(): void {
    // Wait for load event to ensure all metrics are available
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (window.performance && window.performance.timing) {
          const timing = window.performance.timing;
          
          // Calculate key metrics
          const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
          const tcpTime = timing.connectEnd - timing.connectStart;
          const requestTime = timing.responseStart - timing.requestStart;
          const responseTime = timing.responseEnd - timing.responseStart;
          const domProcessingTime = timing.domComplete - timing.domLoading;
          const loadTime = timing.loadEventEnd - timing.navigationStart;
          const timeToFirstByte = timing.responseStart - timing.navigationStart;
          const timeToInteractive = timing.domInteractive - timing.navigationStart;
          
          this.addMetric({
            type: MetricType.PAGE_LOAD,
            name: window.location.pathname,
            duration: loadTime,
            timestamp: performance.now(),
            metadata: {
              dnsTime,
              tcpTime,
              requestTime,
              responseTime,
              domProcessingTime,
              timeToFirstByte,
              timeToInteractive,
              url: window.location.href
            }
          });
        }
      }, 0);
    });
  }
  
  /**
   * Track resource load performance
   * @param entry - Performance resource timing entry
   */
  private trackResourceLoad(entry: PerformanceResourceTiming): void {
    // Skip tracking of monitoring endpoints
    if (this.config.remoteEndpoint && entry.name.includes(this.config.remoteEndpoint)) {
      return;
    }
    
    // Skip if not sampled
    if (!this.shouldSample()) {
      return;
    }
    
    // Extract resource type from name
    let resourceType = 'other';
    if (entry.name.match(/\.(js|mjs)(\?|$)/)) resourceType = 'script';
    else if (entry.name.match(/\.(css)(\?|$)/)) resourceType = 'style';
    else if (entry.name.match(/\.(jpe?g|png|gif|webp|svg|ico)(\?|$)/)) resourceType = 'image';
    else if (entry.name.match(/\.(woff2?|ttf|otf|eot)(\?|$)/)) resourceType = 'font';
    
    this.addMetric({
      type: MetricType.RESOURCE_LOAD,
      name: entry.name,
      duration: entry.duration,
      timestamp: performance.now(),
      metadata: {
        resourceType,
        initiatorType: entry.initiatorType,
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
        decodedBodySize: entry.decodedBodySize
      }
    });
  }
  
  /**
   * Intercept fetch calls to track API performance
   */
  private interceptFetch(): void {
    if (typeof window !== 'undefined') {
      (window as any).fetch = async (input: RequestInfo, init?: RequestInit) => {
        // Skip tracking of monitoring endpoints
        const url = typeof input === 'string' ? input : input.url;
        if (this.config.remoteEndpoint && url.includes(this.config.remoteEndpoint)) {
          return this.originalFetch(input, init);
        }
        
        const startTime = performance.now();
        
        try {
          const response = await this.originalFetch(input, init);
          
          // Track API call performance
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          // Skip if not sampled
          if (this.shouldSample()) {
            this.addMetric({
              type: MetricType.API_CALL,
              name: url,
              duration,
              timestamp: startTime,
              metadata: {
                method: init?.method || 'GET',
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
              }
            });
          }
          
          return response;
        } catch (error) {
          // Track failed API call
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          // Skip if not sampled
          if (this.shouldSample()) {
            this.addMetric({
              type: MetricType.API_CALL,
              name: url,
              duration,
              timestamp: startTime,
              metadata: {
                method: init?.method || 'GET',
                error: error instanceof Error ? error.message : String(error),
                failed: true
              }
            });
          }
          
          throw error;
        }
      };
    }
  }
  
  /**
   * Start a performance measurement
   * @param name - Measurement name
   */
  public startMeasure(name: string): void {
    this.marks[name] = performance.now();
  }
  
  /**
   * End a performance measurement and record metric
   * @param name - Measurement name
   * @param type - Metric type
   * @param metadata - Additional metadata
   */
  public endMeasure(name: string, type: MetricType = MetricType.CUSTOM, metadata?: Record<string, any>): void {
    if (this.marks[name]) {
      const startTime = this.marks[name];
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.addMetric({
        type,
        name,
        duration,
        timestamp: startTime,
        metadata
      });
      
      delete this.marks[name];
    }
  }
  
  /**
   * Track a user interaction
   * @param name - Interaction name
   * @param duration - Interaction duration
   * @param metadata - Additional metadata
   */
  public trackInteraction(name: string, duration: number, metadata?: Record<string, any>): void {
    this.addMetric({
      type: MetricType.USER_INTERACTION,
      name,
      duration,
      timestamp: performance.now(),
      metadata
    });
  }
  
  /**
   * Add a performance metric
   * @param metric - Performance metric
   */
  private addMetric(metric: PerformanceMetric): void {
    // Skip if not sampled
    if (!this.shouldSample()) {
      return;
    }
    
    this.metrics.push(metric);
    
    // Report if buffer is full
    if (this.metrics.length >= (this.config.metricBufferSize || 50)) {
      this.reportMetrics();
    }
  }
  
  /**
   * Check if metric should be sampled based on sample rate
   * @returns Boolean indicating if metric should be sampled
   */
  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate;
  }
  
  /**
   * Start reporting timer for periodic metric reporting
   */
  private startReportingTimer(): void {
    if (this.reportingTimer) {
      clearInterval(this.reportingTimer);
    }
    
    this.reportingTimer = setInterval(() => {
      if (this.metrics.length > 0) {
        this.reportMetrics();
      }
      
      // Track memory usage if enabled
      if (this.config.trackMemoryUsage && (performance as any).memory) {
        this.trackMemoryUsage();
      }
    }, this.config.reportingInterval || 30000);
  }
  
  /**
   * Track memory usage
   */
  private trackMemoryUsage(): void {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      
      this.addMetric({
        type: MetricType.CUSTOM,
        name: 'memory_usage',
        duration: 0,
        timestamp: performance.now(),
        metadata: {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        }
      });
    }
  }
  
  /**
   * Report collected metrics to remote endpoint
   */
  private reportMetrics(): void {
    if (this.metrics.length === 0) {
      return;
    }
    
    const metrics = [...this.metrics];
    this.metrics = [];
    
    // Log metrics locally
    logger.debug(`Reporting ${metrics.length} performance metrics`, { metricCount: metrics.length });
    
    // Send metrics to remote endpoint if configured
    if (this.config.remoteEndpoint) {
      // Prepare payload
      const payload = {
        application: this.config.applicationName,
        environment: this.config.environment,
        timestamp: new Date().toISOString(),
        metrics,
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      // Send to remote endpoint
      fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        // Use keepalive to ensure metrics are sent even if page is unloading
        keepalive: true
      }).catch(error => {
        // Log error but don't re-queue metrics
        logger.warn('Failed to report performance metrics', { error });
      });
    }
  }
  
  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.reportingTimer) {
      clearInterval(this.reportingTimer);
      this.reportingTimer = null;
    }
    
    // Report any remaining metrics
    this.reportMetrics();
    
    // Restore original fetch
    if (typeof window !== 'undefined') {
      (window as any).fetch = this.originalFetch;
    }
  }
}

// Create default performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for performance monitoring in components
 * @param componentName - Name of the component
 * @returns Performance monitoring functions
 */
export const usePerformanceMonitoring = (componentName: string) => {
  useEffect(() => {
    // Track component render time
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      performanceMonitor.trackInteraction(`render_${componentName}`, duration, {
        component: componentName,
        type: 'render'
      });
    };
  }, [componentName]);
  
  return {
    /**
     * Start measuring a component operation
     * @param operationName - Name of the operation
     */
    startMeasure: (operationName: string) => {
      performanceMonitor.startMeasure(`${componentName}_${operationName}`);
    },
    
    /**
     * End measuring a component operation
     * @param operationName - Name of the operation
     * @param metadata - Additional metadata
     */
    endMeasure: (operationName: string, metadata?: Record<string, any>) => {
      performanceMonitor.endMeasure(`${componentName}_${operationName}`, MetricType.COMPONENT_RENDER, {
        ...metadata,
        component: componentName
      });
    },
    
    /**
     * Track a user interaction in the component
     * @param interactionName - Name of the interaction
     * @param duration - Duration of the interaction
     * @param metadata - Additional metadata
     */
    trackInteraction: (interactionName: string, duration: number, metadata?: Record<string, any>) => {
      performanceMonitor.trackInteraction(`${componentName}_${interactionName}`, duration, {
        ...metadata,
        component: componentName
      });
    }
  };
};

export default {
  PerformanceMonitor,
  performanceMonitor,
  usePerformanceMonitoring,
  MetricType
};
