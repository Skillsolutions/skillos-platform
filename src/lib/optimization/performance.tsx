"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { performanceMonitor } from '@/lib/monitoring/performance-monitor';
import { logger } from '@/lib/monitoring/logger';

/**
 * Performance optimization utilities for SkillOS platform
 * 
 * This module provides components and hooks for optimizing performance
 * when dealing with large datasets and complex UI rendering.
 */

/**
 * Interface for virtualized list item
 */
export interface VirtualizedItem {
  id: string | number;
  height?: number;
}

/**
 * Props for VirtualizedList component
 */
interface VirtualizedListProps<T extends VirtualizedItem> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  overscan?: number;
  className?: string;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  scrollingDelay?: number;
  stabilizationDelay?: number; // Delay before applying scroll position corrections
  useWindowScroll?: boolean; // Whether to use window scroll instead of container scroll
}

/**
 * VirtualizedList Component
 * 
 * A component that efficiently renders large lists by only rendering
 * items that are visible in the viewport. Includes scroll stabilization
 * to prevent visual jumps during rapid scrolling.
 */
export function VirtualizedList<T extends VirtualizedItem>({
  items,
  renderItem,
  itemHeight = 50,
  overscan = 5,
  className = '',
  onEndReached,
  endReachedThreshold = 300,
  scrollingDelay = 100,
  stabilizationDelay = 50,
  useWindowScroll = false
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [totalHeight, setTotalHeight] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stabilizationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTopRef = useRef<number>(0);
  const scrollVelocityRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(Date.now());
  const itemPositionCache = useRef<Map<number, number>>(new Map());
  const itemHeightCache = useRef<Map<string | number, number>>(new Map());
  
  // Calculate variable item heights and total height
  const calculateHeights = useCallback(() => {
    let calculatedHeight = 0;
    const newPositionCache = new Map<number, number>();
    
    // Reset position cache
    itemPositionCache.current = newPositionCache;
    
    // Calculate positions based on variable heights or default height
    items.forEach((item, index) => {
      // Store the start position of this item
      newPositionCache.set(index, calculatedHeight);
      
      // Get item height from cache or use default/provided height
      const height = item.height || 
                    itemHeightCache.current.get(item.id) || 
                    itemHeight;
      
      // Update height cache
      if (item.height) {
        itemHeightCache.current.set(item.id, item.height);
      }
      
      // Add to total height
      calculatedHeight += height;
    });
    
    setTotalHeight(calculatedHeight);
  }, [items, itemHeight]);
  
  // Calculate item positions and total height
  useEffect(() => {
    calculateHeights();
  }, [calculateHeights]);
  
  // Get scroll position (either from container or window)
  const getScrollPosition = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        clientHeight: window.innerHeight
      };
    } else if (containerRef.current) {
      return {
        scrollTop: containerRef.current.scrollTop,
        clientHeight: containerRef.current.clientHeight
      };
    }
    return { scrollTop: 0, clientHeight: 0 };
  }, [useWindowScroll]);
  
  // Get item at position
  const getItemAtPosition = useCallback((position: number): number => {
    // Binary search for the item at this position
    let low = 0;
    let high = items.length - 1;
    let mid = 0;
    
    while (low <= high) {
      mid = Math.floor((low + high) / 2);
      
      const itemPos = itemPositionCache.current.get(mid) || mid * itemHeight;
      const nextItemPos = itemPositionCache.current.get(mid + 1) || (mid + 1) * itemHeight;
      
      if (position >= itemPos && position < nextItemPos) {
        return mid;
      } else if (position < itemPos) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    
    return Math.max(0, Math.min(items.length - 1, Math.floor(position / itemHeight)));
  }, [items.length, itemHeight]);
  
  // Calculate visible range based on scroll position with improved accuracy
  const calculateVisibleRange = useCallback(() => {
    const { scrollTop, clientHeight } = getScrollPosition();
    
    // Calculate scroll velocity
    const now = Date.now();
    const timeDelta = now - lastScrollTimeRef.current;
    const scrollDelta = Math.abs(scrollTop - lastScrollTopRef.current);
    
    if (timeDelta > 0) {
      scrollVelocityRef.current = scrollDelta / timeDelta;
    }
    
    lastScrollTopRef.current = scrollTop;
    lastScrollTimeRef.current = now;
    
    // Adjust overscan based on scroll velocity
    const dynamicOverscan = Math.min(20, Math.max(overscan, Math.ceil(scrollVelocityRef.current * 10)));
    
    // Find visible items using position cache for more accurate calculations
    const startItem = getItemAtPosition(scrollTop);
    const endItem = getItemAtPosition(scrollTop + clientHeight);
    
    // Apply overscan with bounds checking
    const start = Math.max(0, startItem - dynamicOverscan);
    const end = Math.min(items.length, endItem + 1 + dynamicOverscan);
    
    // Only update visible range if it has changed
    if (visibleRange.start !== start || visibleRange.end !== end) {
      setVisibleRange({ start, end });
    }
    
    // Check if end is reached
    if (
      onEndReached &&
      scrollTop + clientHeight + endReachedThreshold >= totalHeight
    ) {
      onEndReached();
    }
  }, [getScrollPosition, getItemAtPosition, items.length, overscan, onEndReached, endReachedThreshold, totalHeight, visibleRange]);
  
  // Get transform position for visible items container
  const getTransformPosition = useCallback(() => {
    const position = itemPositionCache.current.get(visibleRange.start) || visibleRange.start * itemHeight;
    return position;
  }, [visibleRange.start, itemHeight]);
  
  // Handle scroll events with debouncing and stabilization
  const handleScroll = useCallback(() => {
    if (!isScrolling) {
      setIsScrolling(true);
      performanceMonitor.startMeasure('virtualized_list_scroll');
    }
    
    // Clear any pending stabilization
    if (stabilizationTimeoutRef.current) {
      clearTimeout(stabilizationTimeoutRef.current);
    }
    
    // Calculate visible range immediately for responsiveness
    calculateVisibleRange();
    
    // Schedule stabilization after rapid scrolling
    stabilizationTimeoutRef.current = setTimeout(() => {
      // Recalculate visible range for accuracy after scrolling stops
      calculateVisibleRange();
      
      // Apply scroll correction if needed
      const { scrollTop } = getScrollPosition();
      const currentItem = getItemAtPosition(scrollTop);
      const idealPosition = itemPositionCache.current.get(currentItem) || currentItem * itemHeight;
      
      // Only correct if the difference is small enough to avoid disrupting user
      const scrollDifference = Math.abs(scrollTop - idealPosition);
      if (scrollDifference > 0 && scrollDifference < itemHeight / 2) {
        // Smooth scroll to the ideal position
        if (useWindowScroll) {
          window.scrollTo({
            top: idealPosition,
            behavior: 'smooth'
          });
        } else if (containerRef.current) {
          containerRef.current.scrollTo({
            top: idealPosition,
            behavior: 'smooth'
          });
        }
      }
    }, stabilizationDelay);
    
    // Reset scrolling state after delay
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      performanceMonitor.endMeasure('virtualized_list_scroll');
    }, scrollingDelay);
  }, [calculateVisibleRange, getItemAtPosition, getScrollPosition, isScrolling, itemHeight, scrollingDelay, stabilizationDelay, useWindowScroll]);
  
  // Set up scroll event listener
  useEffect(() => {
    const scrollTarget = useWindowScroll ? window : containerRef.current;
    
    if (scrollTarget) {
      scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
      calculateVisibleRange();
    }
    
    return () => {
      if (scrollTarget) {
        scrollTarget.removeEventListener('scroll', handleScroll);
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (stabilizationTimeoutRef.current) {
        clearTimeout(stabilizationTimeoutRef.current);
      }
    };
  }, [handleScroll, calculateVisibleRange, useWindowScroll]);
  
  // Recalculate on resize
  useEffect(() => {
    const handleResize = () => {
      calculateVisibleRange();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [calculateVisibleRange]);
  
  // Memoize visible items to prevent unnecessary re-renders
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange.start, visibleRange.end]);
  
  // Get transform position
  const transformPosition = getTransformPosition();
  
  // Render the virtualized list
  return (
    <div
      ref={containerRef}
      className={`overflow-auto relative ${className}`}
      style={{ 
        willChange: 'transform',
        height: useWindowScroll ? '100%' : undefined,
        overflowY: useWindowScroll ? 'visible' : 'auto'
      }}
    >
      <div 
        style={{ 
          height: `${totalHeight}px`, 
          position: 'relative',
          pointerEvents: isScrolling ? 'none' : 'auto' // Prevent interaction during scroll for better performance
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            transform: `translateY(${transformPosition}px)`,
            transition: isScrolling ? 'none' : 'transform 0.1s ease-out' // Smooth transition when not scrolling
          }}
        >
          {visibleItems.map((item, index) => {
            const actualIndex = visibleRange.start + index;
            const itemHeightValue = item.height || 
                                   itemHeightCache.current.get(item.id) || 
                                   itemHeight;
            
            return (
              <div
                key={item.id}
                style={{ 
                  height: `${itemHeightValue}px`,
                  contain: 'content' // Improve rendering performance
                }}
                data-index={actualIndex}
                onLoad={() => {
                  // Recalculate heights if an item's content changes its size
                  const element = document.querySelector(`[data-index="${actualIndex}"]`);
                  if (element) {
                    const actualHeight = element.getBoundingClientRect().height;
                    if (actualHeight !== itemHeightValue && actualHeight > 0) {
                      itemHeightCache.current.set(item.id, actualHeight);
                      calculateHeights();
                    }
                  }
                }}
              >
                {renderItem(item, actualIndex)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Props for LazyImage component
 */
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  threshold?: number;
}

/**
 * LazyImage Component
 * 
 * A component that lazily loads images when they enter the viewport.
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23cccccc"/%3E%3C/svg%3E',
  threshold = 0.1,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = src;
            observer.unobserve(img);
            
            performanceMonitor.startMeasure(`lazy_image_load_${src}`);
          }
        });
      },
      { threshold }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, threshold]);
  
  const handleLoad = () => {
    setLoaded(true);
    performanceMonitor.endMeasure(`lazy_image_load_${src}`);
  };
  
  const handleError = () => {
    setError(true);
    setLoaded(true);
    logger.warn(`Failed to load image: ${src}`);
    performanceMonitor.endMeasure(`lazy_image_load_${src}`);
  };
  
  return (
    <img
      ref={imgRef}
      src={placeholder}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${rest.className || ''}`}
      {...rest}
    />
  );
};

/**
 * Props for CodeSplitComponent
 */
interface CodeSplitComponentProps {
  load: () => Promise<{ default: React.ComponentType<any> }>;
  props?: Record<string, any>;
  fallback?: React.ReactNode;
}

/**
 * CodeSplitComponent
 * 
 * A component that dynamically loads other components to reduce initial bundle size.
 */
export const CodeSplitComponent: React.FC<CodeSplitComponentProps> = ({
  load,
  props = {},
  fallback = <div className="p-4 text-center">Loading...</div>
}) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    performanceMonitor.startMeasure('code_split_load');
    
    load()
      .then((module) => {
        if (mounted) {
          setComponent(() => module.default);
          performanceMonitor.endMeasure('code_split_load');
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          logger.error('Failed to load code-split component', err);
          performanceMonitor.endMeasure('code_split_load');
        }
      });
    
    return () => {
      mounted = false;
    };
  }, [load]);
  
  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load component: {error.message}
      </div>
    );
  }
  
  if (!Component) {
    return <>{fallback}</>;
  }
  
  return <Component {...props} />;
};

/**
 * Props for DataCache
 */
interface DataCacheOptions {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
}

/**
 * DataCache
 * 
 * A utility for caching data to improve performance.
 */
export class DataCache<T = any> {
  private cache: Map<string, { data: T; timestamp: number }>;
  private maxSize: number;
  private ttl: number;
  
  constructor(options: DataCacheOptions = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 100;
    this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes default
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
      return undefined;
    }
    
    return item.data;
  }
  
  /**
   * Set data in cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  set(key: string, data: T): void {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }   
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
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
  }
  
  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
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
}

/**
 * Create a global data cache instance
 */
export const globalDataCache = new DataCache();

/**
 * Hook for using data cache
 * @param key - Cache key
 * @param fetchData - Function to fetch data if not in cache
 * @param options - Cache options
 * @returns Object with data, loading state, error, and refetch function
 */
export function useDataCache<T>(
  key: string,
  fetchData: () => Promise<T>,
  options: { ttl?: number; skipCache?: boolean } = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<T>;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
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
      performanceMonitor.endMeasure(`data_fetch_${key}`);
      
      // Cache the result
      if (options.ttl) {
        globalDataCache.set(key, freshData);
      } else {
        globalDataCache.set(key, freshData);
      }
      
      setData(freshData);
      return freshData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logger.error(`Failed to fetch data for key: ${key}`, error);
      performanceMonitor.endMeasure(`data_fetch_${key}`);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [key, fetchData, options.skipCache, options.ttl]);
  
  // Load data on mount or when dependencies change
  useEffect(() => {
    load(false).catch(() => {}); // Errors are handled in the load function
  }, [load]);
  
  return {
    data,
    loading,
    error,
    refetch: () => load(true)
  };
}

export default {
  VirtualizedList,
  LazyImage,
  CodeSplitComponent,
  DataCache,
  globalDataCache,
  useDataCache
};
