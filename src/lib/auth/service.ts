"use client";

import { jwtVerify, SignJWT } from 'jose';
import { nanoid } from 'nanoid';
import { 
  UserSession, 
  JwtToken, 
  AuthResponse, 
  LoginCredentials,
  RegistrationData,
  AuthError,
  AuthErrorType,
  UserRole
} from './types';

// Constants - Use environment variables
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET 
  ? new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET)
  : new TextEncoder().encode('secure-jwt-secret-for-skillos-platform-authentication');

// Token expiry settings
const ACCESS_TOKEN_EXPIRY = '2h'; // 2 hours
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// Convert time string to seconds
const parseExpiryTime = (expiry: string): number => {
  const unit = expiry.slice(-1);
  const value = parseInt(expiry.slice(0, -1));
  
  switch(unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 24 * 60 * 60;
    default: return 3600; // Default to 1 hour
  }
};

/**
 * Authentication service for JWT operations
 */
export class AuthService {
  /**
   * Sign a JWT token
   * @param payload - Data to include in the token
   * @param expiry - Token expiry time
   * @returns Promise resolving to the signed token
   */
  static async signToken(payload: any, expiry: string): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + parseExpiryTime(expiry);
    
    try {
      return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt(iat)
        .setExpirationTime(exp)
        .setJti(nanoid())
        .sign(JWT_SECRET);
    } catch (error) {
      console.error('Error signing JWT token:', error);
      throw new Error('Failed to sign token');
    }
  }

  /**
   * Verify a JWT token
   * @param token - Token to verify
   * @returns Promise resolving to the decoded payload
   */
  static async verifyToken(token: string): Promise<any> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload;
    } catch (error) {
      console.error('Error verifying JWT token:', error);
      throw {
        type: AuthErrorType.TOKEN_EXPIRED,
        message: 'Token is invalid or expired'
      } as AuthError;
    }
  }

  /**
   * Generate access and refresh tokens
   * @param user - User data to include in tokens
   * @returns Object containing access and refresh tokens
   */
  static async generateTokens(user: Partial<UserSession>): Promise<{
    accessToken: JwtToken;
    refreshToken: JwtToken;
  }> {
    const accessTokenExpSecs = parseExpiryTime(ACCESS_TOKEN_EXPIRY);
    const refreshTokenExpSecs = parseExpiryTime(REFRESH_TOKEN_EXPIRY);
    
    const accessToken = await this.signToken(user, ACCESS_TOKEN_EXPIRY);
    const refreshToken = await this.signToken(
      { id: user.id, email: user.email },
      REFRESH_TOKEN_EXPIRY
    );

    return {
      accessToken: {
        token: accessToken,
        expiresAt: Math.floor(Date.now() / 1000) + accessTokenExpSecs
      },
      refreshToken: {
        token: refreshToken,
        expiresAt: Math.floor(Date.now() / 1000) + refreshTokenExpSecs
      }
    };
  }

  /**
   * Set tokens in localStorage (for client-side storage in demo environment)
   * @param accessToken - Access token
   * @param refreshToken - Refresh token
   */
  static setAuthStorage(accessToken: JwtToken, refreshToken?: JwtToken): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillOS_access_token', accessToken.token);
      
      if (refreshToken) {
        localStorage.setItem('skillOS_refresh_token', refreshToken.token);
      }
    }
  }

  /**
   * Clear auth storage
   */
  static clearAuthStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skillOS_access_token');
      localStorage.removeItem('skillOS_refresh_token');
    }
  }
  
  // Note: HTTP-only cookie methods removed as they're not compatible with client-side rendering in this demo

  /**
   * Login function - to be replaced with actual API call
   * @param credentials - User login credentials
   * @returns Promise resolving to auth response with user data and tokens
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Validate inputs
      if (!credentials.email || !credentials.password) {
        throw {
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: 'Email and password are required'
        } as AuthError;
      }
      
      if (!this.validateEmail(credentials.email)) {
        throw {
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: 'Invalid email format'
        } as AuthError;
      }

      // TODO: Replace with actual API call
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock user data based on email
      let user: UserSession;
      
      if (credentials.email === 'admin@skillsolutions.io') {
        user = {
          id: '1',
          email: 'admin@skillsolutions.io',
          name: 'Admin User',
          role: UserRole.ADMIN,
          organizationId: 'org-1',
          permissions: ['all'],
          isActive: true,
          exp: 0,
          iat: 0
        };
      } else if (credentials.email === 'manager@skillsolutions.io') {
        user = {
          id: '2',
          email: 'manager@skillsolutions.io',
          name: 'Manager User',
          role: UserRole.MANAGER,
          department: 'Engineering',
          organizationId: 'org-1',
          permissions: ['manage_team', 'view_reports', 'manage_learning'],
          isActive: true,
          exp: 0,
          iat: 0
        };
      } else if (credentials.email === 'learner@skillsolutions.io') {
        user = {
          id: '3',
          email: 'learner@skillsolutions.io',
          name: 'Learner User',
          role: UserRole.LEARNER,
          department: 'Marketing',
          organizationId: 'org-1',
          permissions: ['view_courses', 'take_assessments'],
          isActive: true,
          exp: 0,
          iat: 0
        };
      } else {
        throw {
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: 'Invalid email or password'
        } as AuthError;
      }

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(user);

      return {
        user,
        accessToken,
        refreshToken
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Registration function - to be replaced with actual API call
   * @param data - User registration data
   * @returns Promise resolving to auth response with user data and tokens
   */
  static async register(data: RegistrationData): Promise<AuthResponse> {
    try {
      // Validate inputs
      if (!data.email || !data.password || !data.name) {
        throw {
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: 'Email, password, and name are required'
        } as AuthError;
      }
      
      if (!this.validateEmail(data.email)) {
        throw {
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: 'Invalid email format'
        } as AuthError;
      }
      
      if (data.password.length < 8) {
        throw {
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: 'Password must be at least 8 characters'
        } as AuthError;
      }

      // TODO: Replace with actual API call
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock user creation
      const user: UserSession = {
        id: nanoid(),
        email: data.email,
        name: data.name,
        role: data.role || UserRole.LEARNER,
        department: data.department,
        organizationId: data.organizationId || 'org-1',
        permissions: data.role === UserRole.ADMIN 
          ? ['all'] 
          : data.role === UserRole.MANAGER
            ? ['manage_team', 'view_reports', 'manage_learning']
            : ['view_courses', 'take_assessments'],
        isActive: true,
        exp: 0,
        iat: 0
      };

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(user);

      return {
        user,
        accessToken,
        refreshToken
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Current refresh token
   * @returns Promise resolving to new access token
   */
  static async refreshAccessToken(refreshToken: string): Promise<JwtToken> {
    try {
      // Verify refresh token
      const payload = await this.verifyToken(refreshToken);
      
      // Check if token is blacklisted (to be implemented)
      // await this.checkTokenBlacklist(refreshToken);
      
      // Generate new access token
      const accessToken = await this.signToken(
        { id: payload.id, email: payload.email },
        ACCESS_TOKEN_EXPIRY
      );

      return {
        token: accessToken,
        expiresAt: Math.floor(Date.now() / 1000) + parseExpiryTime(ACCESS_TOKEN_EXPIRY)
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Get user permissions based on role
   * @param role - User role
   * @returns Array of permission strings
   */
  static getPermissionsForRole(role: UserRole): string[] {
    switch (role) {
      case UserRole.ADMIN:
        return ['all'];
      case UserRole.MANAGER:
        return [
          'manage_team',
          'view_reports',
          'manage_learning',
          'view_analytics',
          'create_assessments',
          'view_all_learners'
        ];
      case UserRole.LEARNER:
        return [
          'view_courses',
          'take_assessments',
          'view_own_profile',
          'view_learning_paths'
        ];
      default:
        return [];
    }
  }

  /**
   * Check if user has specific permission
   * @param user - User session data
   * @param permission - Permission to check
   * @returns Boolean indicating if user has permission
   */
  static hasPermission(user: UserSession, permission: string): boolean {
    if (!user || !user.permissions) return false;
    
    // Admin has all permissions
    if (user.permissions.includes('all')) return true;
    
    // Check specific permission
    return user.permissions.includes(permission);
  }
  
  /**
   * Validate email format
   * @param email - Email to validate
   * @returns Boolean indicating if email is valid
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns Object with validation result and message
   */
  static validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    
    // Check for complexity requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
      return { 
        valid: false, 
        message: 'Password must contain uppercase, lowercase, and numbers' 
      };
    }
    
    return { valid: true };
  }
}

export default AuthService;

