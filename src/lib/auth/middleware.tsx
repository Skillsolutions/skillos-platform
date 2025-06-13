"use client";

import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from './types';
import AuthService from './service';
import { parseCookies } from 'nookies';
import React from 'react';

// CSRF token header name
const CSRF_HEADER = 'X-CSRF-Token';

/**
 * Middleware to protect routes based on authentication and roles
 * @param req - Next.js request object
 * @param allowedRoles - Array of roles allowed to access the route
 * @returns NextResponse or null if authentication passes
 */
export async function protectRoute(
  req: NextRequest,
  allowedRoles: UserRole[] = []
): Promise<NextResponse | null> {
  try {
    // Get token from cookies
    const cookies = req.cookies;
    const accessToken = cookies.get('skillOS_access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // For state-changing operations, verify CSRF token
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const csrfToken = req.headers.get(CSRF_HEADER);
      const storedCsrfToken = cookies.get('skillOS_csrf_token')?.value;
      
      if (!csrfToken || !storedCsrfToken || csrfToken !== storedCsrfToken) {
        return NextResponse.json(
          { error: 'CSRF token validation failed' },
          { status: 403 }
        );
      }
    }
    
    // Verify token
    const payload = await AuthService.verifyToken(accessToken);
    
    // Check role if specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Authentication and authorization passed
    return null;
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Try to refresh token if expired
    try {
      const refreshToken = req.cookies.get('skillOS_refresh_token')?.value;
      
      if (refreshToken) {
        const newAccessToken = await AuthService.refreshAccessToken(refreshToken);
        
        // Create response with new access token
        const response = NextResponse.next();
        response.cookies.set({
          name: 'skillOS_access_token',
          value: newAccessToken.token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 2, // 2 hours
          path: '/'
        });
        
        return response;
      }
    } catch (refreshError) {
      console.error('Token refresh error:', refreshError);
    }
    
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

/**
 * Higher-order component to protect React components based on roles
 * @param Component - Component to protect
 * @param allowedRoles - Array of roles allowed to access the component
 * @returns Protected component
 */
export function withRoleProtection(
  Component: React.ComponentType<any>,
  allowedRoles: UserRole[] = []
) {
  return function ProtectedComponent(props: any) {
    const { useAuth } = require('./context');
    const { user, isLoading } = useAuth();
    const { useRouter } = require('next/navigation');
    const router = useRouter();
    
    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return null;
    }
    
    // Check role if specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
      return null;
    }
    
    // Render component if authorized
    return <Component {...props} />;
  };
}

/**
 * Custom hook to check if user has access to a specific feature
 * @param requiredPermission - Permission required to access the feature
 * @returns Boolean indicating if user has access
 */
export function useHasAccess(requiredPermission: string): boolean {
  const { useAuth } = require('./context');
  const { user, hasPermission } = useAuth();
  
  if (!user) return false;
  return hasPermission(requiredPermission);
}

/**
 * Component to conditionally render content based on permissions
 */
export function PermissionGate({ 
  permission, 
  fallback = null, 
  children 
}: { 
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  const hasAccess = useHasAccess(permission);
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Generate CSRF token
 * @returns Random CSRF token
 */
export function generateCsrfToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Set CSRF token in cookie and return it
 * @returns CSRF token
 */
export function setupCsrfProtection(): string {
  const token = generateCsrfToken();
  
  // Set in cookie
  document.cookie = `skillOS_csrf_token=${token}; path=/; secure; samesite=strict`;
  
  return token;
}

export default {
  protectRoute,
  withRoleProtection,
  useHasAccess,
  PermissionGate,
  generateCsrfToken,
  setupCsrfProtection
};
