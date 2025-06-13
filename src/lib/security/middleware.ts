import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) {
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(sessionToken, 'hex')
  );
}

/**
 * CSRF middleware for API routes
 */
export function withCSRFProtection(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Skip CSRF for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return handler(req);
    }
    
    const csrfToken = req.headers.get('x-csrf-token');
    const sessionToken = req.cookies.get('csrf-token')?.value;
    
    if (!csrfToken || !sessionToken || !verifyCSRFToken(csrfToken, sessionToken)) {
      return NextResponse.json(
        { error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
    
    return handler(req);
  };
}

/**
 * Rate limiting store (in-memory for demo, use Redis in production)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Maximum requests per window
    keyGenerator?: (req: NextRequest) => string; // Custom key generator
  }
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const { windowMs, maxRequests, keyGenerator } = options;
    
    // Generate rate limit key (IP address by default)
    const key = keyGenerator ? keyGenerator(req) : req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);
    
    if (!entry || entry.resetTime <= windowStart) {
      entry = { count: 0, resetTime: now + windowMs };
      rateLimitStore.set(key, entry);
    }
    
    entry.count++;
    
    // Check if rate limit exceeded
    if (entry.count > maxRequests) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((entry.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': Math.max(0, maxRequests - entry.count).toString(),
            'X-RateLimit-Reset': entry.resetTime.toString(),
          }
        }
      );
    }
    
    // Add rate limit headers to response
    const response = await handler(req);
    
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count).toString());
    response.headers.set('X-RateLimit-Reset', entry.resetTime.toString());
    
    return response;
  };
}

/**
 * Input validation middleware
 */
export function withInputValidation(
  handler: (req: NextRequest) => Promise<NextResponse>,
  validator: (data: any) => { isValid: boolean; errors?: any }
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const body = await req.json();
      const validation = validator(body);
      
      if (!validation.isValid) {
        return NextResponse.json(
          { 
            error: 'Validation failed',
            details: validation.errors
          },
          { status: 400 }
        );
      }
      
      // Attach validated data to request
      (req as any).validatedData = body;
      
      return handler(req);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      );
    }
  };
}

/**
 * Security headers middleware
 */
export function withSecurityHeaders(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const response = await handler(req);
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', csp);
    
    return response;
  };
}

/**
 * Authentication middleware
 */
export function withAuth(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    requiredRole?: 'admin' | 'manager' | 'learner';
    allowedRoles?: ('admin' | 'manager' | 'learner')[];
  } = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    
    try {
      // Verify JWT token (simplified for demo)
      // In production, use proper JWT verification
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      
      // Check role requirements
      if (options.requiredRole && payload.role !== options.requiredRole) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      if (options.allowedRoles && !options.allowedRoles.includes(payload.role)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      // Attach user to request
      (req as any).user = payload;
      
      return handler(req);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  };
}

/**
 * Combine multiple middleware functions
 */
export function combineMiddleware(
  ...middlewares: Array<(handler: any) => any>
) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}

/**
 * Common security middleware stack
 */
export const securityMiddleware = combineMiddleware(
  withSecurityHeaders,
  withCSRFProtection,
  (handler) => withRateLimit(handler, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per window
  })
);

/**
 * Admin-only middleware stack
 */
export const adminMiddleware = combineMiddleware(
  withSecurityHeaders,
  withCSRFProtection,
  (handler) => withAuth(handler, { requiredRole: 'admin' }),
  (handler) => withRateLimit(handler, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 200, // Higher limit for admins
  })
);

/**
 * Manager/Admin middleware stack
 */
export const managerMiddleware = combineMiddleware(
  withSecurityHeaders,
  withCSRFProtection,
  (handler) => withAuth(handler, { allowedRoles: ['admin', 'manager'] }),
  (handler) => withRateLimit(handler, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 150,
  })
);

