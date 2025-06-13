"use client";

import { useState, useEffect } from 'react';
import { logger } from '@/lib/monitoring/logger';
import { errorTracker, ErrorSeverity } from '@/lib/monitoring/error-tracker';

/**
 * Security utilities for SkillOS platform
 * 
 * This module provides security features including rate limiting,
 * input sanitization, and protection against common web vulnerabilities.
 */

// Rate limit configuration
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix: string;
}

// Default rate limit configurations
export const defaultRateLimits = {
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'ratelimit_api'
  },
  auth: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'ratelimit_auth'
  },
  form: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: 'ratelimit_form'
  }
};

/**
 * Rate limiter class for limiting request frequency
 */
export class RateLimiter {
  private storage: Map<string, { count: number; resetTime: number }>;
  private config: RateLimitConfig;
  
  constructor(config: RateLimitConfig) {
    this.storage = new Map();
    this.config = config;
  }
  
  /**
   * Check if a key is rate limited
   * @param key - Identifier for the rate limit (e.g., user ID, IP address)
   * @returns Object with limited status and remaining requests
   */
  check(key: string): { limited: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const fullKey = `${this.config.keyPrefix}_${key}`;
    
    // Get or create entry
    let entry = this.storage.get(fullKey);
    
    if (!entry || now > entry.resetTime) {
      // Create new entry if none exists or window has expired
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs
      };
      this.storage.set(fullKey, entry);
    }
    
    // Increment count
    entry.count++;
    
    // Check if limit exceeded
    const limited = entry.count > this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - entry.count);
    
    if (limited) {
      logger.warn(`Rate limit exceeded for ${fullKey}`, {
        key: fullKey,
        count: entry.count,
        limit: this.config.maxRequests,
        windowMs: this.config.windowMs
      });
    }
    
    return {
      limited,
      remaining,
      resetTime: entry.resetTime
    };
  }
  
  /**
   * Reset rate limit for a key
   * @param key - Identifier to reset
   */
  reset(key: string): void {
    const fullKey = `${this.config.keyPrefix}_${key}`;
    this.storage.delete(fullKey);
  }
  
  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetTime) {
        this.storage.delete(key);
      }
    }
  }
}

// Create global rate limiters
export const apiRateLimiter = new RateLimiter(defaultRateLimits.api);
export const authRateLimiter = new RateLimiter(defaultRateLimits.auth);
export const formRateLimiter = new RateLimiter(defaultRateLimits.form);

// Set up periodic cleanup
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiRateLimiter.cleanup();
    authRateLimiter.cleanup();
    formRateLimiter.cleanup();
  }, 60 * 1000); // Clean up every minute
}

/**
 * Hook for using rate limiting in components
 * @param key - Identifier for the rate limit
 * @param config - Rate limit configuration
 * @returns Object with check function and reset function
 */
export function useRateLimit(key: string, config: RateLimitConfig = defaultRateLimits.api) {
  const rateLimiter = new RateLimiter(config);
  
  return {
    check: () => rateLimiter.check(key),
    reset: () => rateLimiter.reset(key)
  };
}

/**
 * Input sanitization utilities
 */
export const sanitize = {
  /**
   * Sanitize HTML string to prevent XSS
   * @param html - HTML string to sanitize
   * @returns Sanitized HTML string
   */
  html: (html: string): string => {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },
  
  /**
   * Sanitize user input for use in SQL queries
   * @param input - User input to sanitize
   * @returns Sanitized input
   */
  sql: (input: string): string => {
    // Basic SQL injection prevention
    return input
      .replace(/'/g, "''")
      .replace(/\\/g, '\\\\')
      .replace(/\0/g, '\\0')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\x1a/g, '\\Z');
  },
  
  /**
   * Sanitize user input for use in file paths
   * @param input - User input to sanitize
   * @returns Sanitized input
   */
  filePath: (input: string): string => {
    // Remove path traversal sequences and invalid characters
    return input
      .replace(/\.\.\//g, '')
      .replace(/\.\.\\/g, '')
      .replace(/[\/\\:*?"<>|]/g, '_');
  },
  
  /**
   * Sanitize user input for use in JavaScript
   * @param input - User input to sanitize
   * @returns Sanitized input
   */
  javascript: (input: string): string => {
    // Escape special characters in JavaScript
    return input
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }
};

/**
 * Content Security Policy (CSP) utilities
 */
export const csp = {
  /**
   * Generate CSP header value
   * @returns CSP header value
   */
  generateHeader: (): string => {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https://images.unsplash.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.udemy.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
  },
  
  /**
   * Report CSP violation
   * @param violation - CSP violation event
   */
  reportViolation: (violation: SecurityPolicyViolationEvent): void => {
    logger.warn('CSP violation', {
      documentURI: violation.documentURI,
      violatedDirective: violation.violatedDirective,
      blockedURI: violation.blockedURI,
      effectiveDirective: violation.effectiveDirective,
      originalPolicy: violation.originalPolicy
    });
    
    errorTracker.trackError(
      new Error(`CSP violation: ${violation.violatedDirective}`),
      {
        action: 'csp_violation',
        metadata: {
          documentURI: violation.documentURI,
          violatedDirective: violation.violatedDirective,
          blockedURI: violation.blockedURI
        }
      },
      ErrorSeverity.MEDIUM
    );
  }
};

/**
 * Hook for setting up CSP violation reporting
 */
export function useCspReporting(): void {
  useEffect(() => {
    const handleViolation = (e: SecurityPolicyViolationEvent) => {
      csp.reportViolation(e);
    };
    
    document.addEventListener('securitypolicyviolation', handleViolation);
    
    return () => {
      document.removeEventListener('securitypolicyviolation', handleViolation);
    };
  }, []);
}

/**
 * CSRF protection utilities
 */
export const csrf = {
  /**
   * Generate CSRF token
   * @returns CSRF token
   */
  generateToken: (): string => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
  
  /**
   * Store CSRF token in localStorage
   * @param token - CSRF token
   */
  storeToken: (token: string): void => {
    localStorage.setItem('csrf_token', token);
  },
  
  /**
   * Get stored CSRF token
   * @returns Stored CSRF token or null if not found
   */
  getToken: (): string | null => {
    return localStorage.getItem('csrf_token');
  },
  
  /**
   * Add CSRF token to request headers
   * @param headers - Request headers
   * @returns Headers with CSRF token
   */
  addTokenToHeaders: (headers: HeadersInit = {}): HeadersInit => {
    const token = csrf.getToken();
    
    if (token) {
      return {
        ...headers,
        'X-CSRF-Token': token
      };
    }
    
    return headers;
  }
};

/**
 * Hook for CSRF protection
 * @returns CSRF token and headers
 */
export function useCsrf() {
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    // Get existing token or generate new one
    let csrfToken = csrf.getToken();
    
    if (!csrfToken) {
      csrfToken = csrf.generateToken();
      csrf.storeToken(csrfToken);
    }
    
    setToken(csrfToken);
  }, []);
  
  return {
    token,
    headers: csrf.addTokenToHeaders()
  };
}

/**
 * Password strength checker
 * @param password - Password to check
 * @returns Object with score and feedback
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string;
} {
  let score = 0;
  const feedback: string[] = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters long.');
  } else {
    score += Math.min(2, Math.floor(password.length / 8));
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters.');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters.');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Add numbers.');
  
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('Add special characters.');
  
  // Variety check
  const uniqueChars = new Set(password.split('')).size;
  score += Math.min(2, Math.floor(uniqueChars / 5));
  
  // Common patterns check
  const commonPatterns = [
    /12345/, /qwerty/, /password/, /admin/, /welcome/,
    /abc123/, /123abc/, /letmein/, /monkey/, /login/
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password.toLowerCase()))) {
    score -= 2;
    feedback.push('Avoid common patterns and words.');
  }
  
  // Sequential characters check
  let hasSequential = false;
  for (let i = 0; i < password.length - 2; i++) {
    const charCode1 = password.charCodeAt(i);
    const charCode2 = password.charCodeAt(i + 1);
    const charCode3 = password.charCodeAt(i + 2);
    
    if (
      (charCode1 + 1 === charCode2 && charCode2 + 1 === charCode3) ||
      (charCode1 - 1 === charCode2 && charCode2 - 1 === charCode3)
    ) {
      hasSequential = true;
      break;
    }
  }
  
  if (hasSequential) {
    score -= 1;
    feedback.push('Avoid sequential characters.');
  }
  
  // Ensure score is between 0 and 5
  score = Math.max(0, Math.min(5, score));
  
  return {
    score,
    feedback: feedback.join(' ')
  };
}

export default {
  RateLimiter,
  apiRateLimiter,
  authRateLimiter,
  formRateLimiter,
  useRateLimit,
  sanitize,
  csp,
  useCspReporting,
  csrf,
  useCsrf,
  checkPasswordStrength
};
