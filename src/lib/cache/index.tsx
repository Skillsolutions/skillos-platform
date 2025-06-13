"use client";

import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { performanceMonitor, MetricType } from '@/lib/monitoring/performance-monitor';
import { logger } from '@/lib/monitoring/logger';

/**
 * Enhanced data caching system with automatic invalidation
 * for the SkillOS platform.
 */

// Event types for cache invalidation
export enum CacheEventType {
  SET = 'set',
  DELETE = 'delete',
  CLEAR = 'clear',
  INVALIDATE = 'invalidate'
}

// Cache event interface
export interface CacheEvent {
  type: CacheEventType;
  key?: string;
  pattern?: string;
  timestamp: number;
}

// Cache invalidation options
export interface CacheInvalidationOptions {
  // Dependencies that will trigger invalidation when they change
  dependencies?: string[];
  // Patterns to match for invalidation (supports glob-like patterns)
  patterns?: string[];
  // Whether to auto-refresh data when invalidated
  autoRefresh?: boolean;
  // Custom invalidation function
  invalidationFn?: (key: string, event: CacheEvent) => boolean;
}

// Cache options
export interface CacheOptions {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
  invalidation?: CacheInvalidationOptions;
}

// Cache context type
interface CacheContextType {
  subscribe: (listener: (event: CacheEvent) => void) => () => void;
  publish: (event: CacheEvent) => void;
  getLastEvent: (key?: string) => CacheEvent | undefined;
}

// Create cache event context
const CacheEventContext = createContext<CacheContextType | undefined>(undefined);

/**
 * Cache Event Provider
 * 
 * Provides a pub/sub system for cache events to enable automatic invalidation
 */
export const CacheEventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const listeners = useRef<Set<(event: CacheEvent) => void>>(new Set());
  const lastEvents = useRef<Map<string, CacheEvent>>(new Map());
  const lastGlobalEvent = useRef<CacheEvent | undefined>(undefined);
  
  // Subscribe to cache events
  const subscribe = useCallback((listener: (event: CacheEvent) => void) => {
    listeners.current.add(listener);
    
    // Return unsubscribe function
    return () => {
      listeners.current.delete(listener);
    };
  }, []);
  
  // Publish cache event
  const publish = useCallback((event: CacheEvent) => {
    // Store last event
    if (event.key) {
      lastEvents.current.set(event.key, event);
    }
    
    // Store last global event
    lastGlobalEvent.current = event;
    
    // Notify all listeners
    listeners.current.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        // Fix: Type guard the error before passing to logger
        logger.error('Error in cache event listener', error instanceof Error ? error : new Error(String(error)));
      }
    });
  }, []);
  
  // Get last event for a key
  const getLastEvent = useCallback((key?: string) => {
    if (key) {
      return lastEvents.current.get(key);
    }
    return lastGlobalEvent.current;
  }, []);
  
  const value = {
    subscribe,
    publish,
    getLastEvent
  };
  
  return (
    <CacheEventContext.Provider value={value}>
      {children}
    </CacheEventContext.Provider>
  );
};

/**
 * Use cache events hook
 */
export const useCacheEvents = () => {
  const context = useContext(CacheEventContext);
  
  if (!context) {
    throw new Error('useCacheEvents must be used within a CacheEventProvider');
  }
  
  return context;
};

/**
 * Check if a key matches a pattern
 * Supports simple glob-like patterns with * wildcard
 */
const keyMatchesPattern = (key: string, pattern: string): boolean => {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*');
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(key);
};

/**
 * Enhanced DataCache with automatic invalidation
 * 
 * A utility for caching data with support for automatic invalidation
 * based on dependencies, patterns, or custom functions.
 */
export class DataCache<T = any> {
  private cache: Map<string, { data: T; timestamp: number; dependencies?: string[]; patterns?: string[] }>;
  private maxSize: number;
  private ttl: number;
  private cacheEvents?: CacheContextType;
  private unsubscribe?: () => void;
  
  constructor(options: CacheOptions = {}, cacheEvents?: CacheContextType) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.cacheEvents = cacheEvents;
    
    // Subscribe to cache events if available
    if (this.cacheEvents) {
      this.unsubscribe = this.cacheEvents.subscribe(this.handleCacheEvent);
    }
  }
  
  /**
   * Handle cache events for automatic invalidation
   */
  private handleCacheEvent = (event: CacheEvent) => {
    switch (event.type) {
      case CacheEventType.SET:
        // When a key is set, invalidate any cache entries that depend on it
        if (event.key) {
          this.invalidateDependencies(event.key, event);
        }
        break;
        
      case CacheEventType.DELETE:
        // When a key is deleted, invalidate any cache entries that depend on it
        if (event.key) {
          this.invalidateDependencies(event.key, event);
        }
        break;
        
      case CacheEventType.INVALIDATE:
        // Explicit invalidation
        if (event.key) {
          this.cache.delete(event.key);
        } else if (event.pattern) {
          // Invalidate by pattern
          this.cache.forEach((_, key) => {
            if (event.pattern && keyMatchesPattern(key, event.pattern)) {
              this.cache.delete(key);
            }
          });
        }
        break;
        
      case CacheEventType.CLEAR:
        // Clear all cache
        this.cache.clear();
        break;
    }
  };
  
  /**
   * Invalidate cache entries that depend on the given key
   */
  private invalidateDependencies(key: string, event: CacheEvent) {
    this.cache.forEach((item, cacheKey) => {
      // Check if this cache entry depends on the changed key
      if (item.dependencies && item.dependencies.includes(key)) {
        this.cache.delete(cacheKey);
        logger.debug(`Cache invalidated due to dependency change: ${cacheKey}`);
      }
      
      // Check if this cache entry matches any patterns
      if (item.patterns) {
        for (const pattern of item.patterns) {
          if (keyMatchesPattern(key, pattern)) {
            this.cache.delete(cacheKey);
            logger.debug(`Cache invalidated due to pattern match: ${cacheKey}`);
            break;
          }
        }
      }
    });
  }
  
  /**
   * Get data from cache
   * @param key - Cache key
   * @returns Cached data or undefined if not found or expired
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) {
      return undefined;
    }
    
    // Check if item is expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      
      // Publish cache event
      if (this.cacheEvents) {
        this.cacheEvents.publish({
          type: CacheEventType.DELETE,
          key,
          timestamp: Date.now()
        });
      }
      
      return undefined;
    }
    
    return item.data;
  }
  
  /**
   * Set data in cache with optional invalidation options
   * @param key - Cache key
   * @param data - Data to cache
   * @param invalidationOptions - Options for automatic invalidation
   */
  set(key: string, data: T, invalidationOptions?: CacheInvalidationOptions): void {
    // Evict oldest item if cache is full
    if (this.cache.size >= this.maxSize) {
      const iterator = this.cache.keys();
      const next = iterator.next();
      
      // Fix: Check if there's a value before trying to delete it
      if (!next.done && next.value) {
        const oldestKey = next.value;
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      dependencies: invalidationOptions?.dependencies,
      patterns: invalidationOptions?.patterns
    });
    
    // Publish cache event
    if (this.cacheEvents) {
      this.cacheEvents.publish({
        type: CacheEventType.SET,
        key,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Check if key exists in cache and is not expired
   * @param key - Cache key
   * @returns Boolean indicating if key exists
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }
    
    // Check if item is expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      
      // Publish cache event
      if (this.cacheEvents) {
        this.cacheEvents.publish({
          type: CacheEventType.DELETE,
          key,
          timestamp: Date.now()
        });
      }
      
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete item from cache
   * @param key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
    
    // Publish cache event
    if (this.cacheEvents) {
      this.cacheEvents.publish({
        type: CacheEventType.DELETE,
        key,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    
    // Publish cache event
    if (this.cacheEvents) {
      this.cacheEvents.publish({
        type: CacheEventType.CLEAR,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Explicitly invalidate cache entries
   * @param options - Invalidation options
   */
  invalidate(options: { key?: string; pattern?: string }): void {
    if (options.key) {
      this.cache.delete(options.key);
    } else if (options.pattern) {
      this.cache.forEach((_, key) => {
        if (options.pattern && keyMatchesPattern(key, options.pattern)) {
          this.cache.delete(key);
        }
      });
    }
    
    // Publish cache event
    if (this.cacheEvents) {
      this.cacheEvents.publish({
        type: CacheEventType.INVALIDATE,
        key: options.key,
        pattern: options.pattern,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Get all valid (non-expired) keys in cache
   * @returns Array of cache keys
   */
  keys(): string[] {
    const validKeys: string[] = [];
    
    this.cache.forEach((item, key) => {
      if (Date.now() - item.timestamp <= this.ttl) {
        validKeys.push(key);
      } else {
        this.cache.delete(key);
        
        // Publish cache event
        if (this.cacheEvents) {
          this.cacheEvents.publish({
            type: CacheEventType.DELETE,
            key,
            timestamp: Date.now()
          });
        }
      }
    });
    
    return validKeys;
  }
  
  /**
   * Get cache size
   * @returns Number of items in cache
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

/**
 * Create a global cache events instance
 */
let globalCacheEvents: CacheContextType | undefined;

/**
 * Get or initialize global cache events
 */
export const getGlobalCacheEvents = (): CacheContextType => {
  if (typeof window !== 'undefined' && !globalCacheEvents) {
    // Create listeners set
    const listeners = new Set<(event: CacheEvent) => void>();
    const lastEvents = new Map<string, CacheEvent>();
    let lastGlobalEvent: CacheEvent | undefined;
    
    globalCacheEvents = {
      subscribe: (listener) => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
      publish: (event) => {
        if (event.key) {
          lastEvents.set(event.key, event);
        }
        lastGlobalEvent = event;
        listeners.forEach(listener => {
          try {
            listener(event);
          } catch (error) {
            // Fix: Type guard the error before passing to logger
            logger.error('Error in cache event listener', error instanceof Error ? error : new Error(String(error)));
          }
        });
      },
      getLastEvent: (key) => {
        if (key) {
          return lastEvents.get(key);
        }
        return lastGlobalEvent;
      }
    };
  }
  
  return globalCacheEvents as CacheContextType;
};

/**
 * Create a global data cache instance with automatic invalidation
 */
export const globalDataCache = new DataCache({}, typeof window !== 'undefined' ? getGlobalCacheEvents() : undefined);

/**
 * Hook for using data cache with automatic invalidation
 * @param key - Cache key
 * @param fetchData - Function to fetch data if not in cache
 * @param options - Cache options
 * @returns Object with data, loading state, error, and refetch function
 */
export function useDataCache<T>(
  key: string,
  fetchData: () => Promise<T>,
  options: {
    ttl?: number;
    skipCache?: boolean;
    invalidation?: CacheInvalidationOptions;
  } = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<T>;
  invalidate: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const cacheEvents = useCacheEvents();
  const invalidationOptionsRef = useRef(options.invalidation);
  
  // Update ref when options change
  useEffect(() => {
    invalidationOptionsRef.current = options.invalidation;
  }, [options.invalidation]);
  
  // Handle cache invalidation events
  useEffect(() => {
    if (!invalidationOptionsRef.current) return;
    
    const handleCacheEvent = (event: CacheEvent) => {
      const opts = invalidationOptionsRef.current;
      if (!opts) return;
      
      let shouldInvalidate = false;
      
      // Check dependencies
      if (event.key && opts.dependencies && opts.dependencies.includes(event.key)) {
        shouldInvalidate = true;
      }
      
      // Check patterns
      if (event.key && opts.patterns) {
        for (const pattern of opts.patterns) {
          if (keyMatchesPattern(event.key, pattern)) {
            shouldInvalidate = true;
            break;
          }
        }
      }
      
      // Check custom invalidation function
      if (opts.invalidationFn && event.key) {
        shouldInvalidate = shouldInvalidate || opts.invalidationFn(key, event);
      }
      
      // If should invalidate and auto-refresh is enabled, refetch data
      if (shouldInvalidate) {
        logger.debug(`Cache invalidated for key: ${key}`);
        
        if (opts.autoRefresh) {
          load(true).catch((err) => {
            // Fix: Type guard the error before logging
            logger.error('Error refetching data after invalidation', 
              err instanceof Error ? err : new Error(String(err)));
          });
        } else {
          // Just invalidate without refetching
          globalDataCache.delete(key);
        }
      }
    };
    
    // Subscribe to cache events
    const unsubscribe = cacheEvents.subscribe(handleCacheEvent);
    
    return () => {
      unsubscribe();
    };
  }, [key, cacheEvents]);
  
  const load = useCallback(async (skipCache = options.skipCache) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check cache first if not skipping
      if (!skipCache && globalDataCache.has(key)) {
        const cachedData = globalDataCache.get(key) as T;
        setData(cachedData);
        setLoading(false);
        return cachedData;
      }
      
      // Fetch fresh data
      performanceMonitor.startMeasure(`data_fetch_${key}`);
      const freshData = await fetchData();
      // Fix: Pass MetricType as second parameter and metadata as third parameter
      performanceMonitor.endMeasure(`data_fetch_${key}`, MetricType.API_CALL, { success: true });
      
      // Cache the result with invalidation options
      globalDataCache.set(key, freshData, options.invalidation);
      
      setData(freshData);
      return freshData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logger.error(`Failed to fetch data for key: ${key}`, error);
      // Fix: Pass MetricType as second parameter and metadata as third parameter
      performanceMonitor.endMeasure(`data_fetch_${key}`, MetricType.API_CALL, { success: false, error: error.message });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetchData, options.skipCache, options.invalidation]);
  
  // Invalidate cache entry
  const invalidate = useCallback(() => {
    globalDataCache.delete(key);
    
    // Publish invalidation event
    cacheEvents.publish({
      type: CacheEventType.INVALIDATE,
      key,
      timestamp: Date.now()
    });
  }, [key, cacheEvents]);
  
  // Load data on mount
  useEffect(() => {
    load().catch((err) => {
      // Fix: Type guard the error before logging
      logger.error('Error loading data on mount', 
        err instanceof Error ? err : new Error(String(err)));
    });
    
    return () => {
      // Nothing to clean up here
    };
  }, [load]);
  
  return {
    data,
    loading,
    error,
    refetch: () => load(true),
    invalidate
  };
}

export default {
  CacheEventProvider,
  useCacheEvents,
  DataCache,
  globalDataCache,
  useDataCache,
  getGlobalCacheEvents
};
