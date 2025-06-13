// Authentication and authorization types

/**
 * User role types for role-based access control
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  LEARNER = 'learner'
}

/**
 * User session data structure
 */
export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  organizationId: string;
  permissions: string[];
  isActive: boolean;
  exp: number; // JWT expiration timestamp
  iat: number; // JWT issued at timestamp
}

/**
 * JWT token structure
 */
export interface JwtToken {
  token: string;
  expiresAt: number;
}

/**
 * Authentication response structure
 */
export interface AuthResponse {
  user: UserSession;
  accessToken: JwtToken;
  refreshToken?: JwtToken;
}

/**
 * Login credentials structure
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration data structure
 */
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  department?: string;
  role?: UserRole;
  organizationId?: string;
}

/**
 * Password reset request structure
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset confirmation structure
 */
export interface PasswordResetConfirmation {
  token: string;
  newPassword: string;
}

/**
 * Permission structure
 */
export interface Permission {
  id: string;
  name: string;
  description: string;
}

/**
 * Role with permissions structure
 */
export interface RoleWithPermissions {
  id: string;
  name: UserRole;
  description: string;
  permissions: Permission[];
}

/**
 * Auth error types
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'invalid_credentials',
  ACCOUNT_DISABLED = 'account_disabled',
  TOKEN_EXPIRED = 'token_expired',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  SERVER_ERROR = 'server_error',
  NETWORK_ERROR = 'network_error'
}

/**
 * Auth error structure
 */
export interface AuthError {
  type: AuthErrorType;
  message: string;
  details?: any;
}
