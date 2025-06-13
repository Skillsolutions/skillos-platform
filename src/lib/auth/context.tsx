"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserSession, 
  AuthResponse, 
  LoginCredentials, 
  RegistrationData,
  AuthError,
  AuthErrorType
} from './types';
import AuthService from './service';

// Define the shape of the auth context
interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  error: AuthError | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// LocalStorage keys
const ACCESS_TOKEN_KEY = 'skillOS_access_token';
const REFRESH_TOKEN_KEY = 'skillOS_refresh_token';
const USER_DATA_KEY = 'skillOS_user_data';

/**
 * Authentication Provider Component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Use localStorage instead of cookies for demo environment
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const userData = localStorage.getItem(USER_DATA_KEY);
        
        if (accessToken && userData) {
          // Verify token and set user
          try {
            await AuthService.verifyToken(accessToken);
            setUser(JSON.parse(userData));
          } catch (error) {
            // Token is invalid or expired, try refresh token
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
            if (refreshToken) {
              try {
                const newAccessToken = await AuthService.refreshAccessToken(refreshToken);
                
                // Set new access token in localStorage
                localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken.token);
                
                setUser(JSON.parse(userData));
              } catch (refreshError) {
                // Refresh token also invalid, clear auth state
                clearAuthState();
              }
            } else {
              clearAuthState();
            }
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Clear authentication state
   */
  const clearAuthState = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    setUser(null);
  };

  /**
   * Login handler
   */
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!credentials.email || !credentials.password) {
        throw {
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: 'Email and password are required'
        } as AuthError;
      }
      
      const response = await AuthService.login(credentials);
      
      // Store tokens and user data in localStorage
      localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken.token);
      
      if (response.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken.token);
      }
      
      // Store user data in localStorage (non-sensitive data only)
      const userData = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        department: response.user.department,
        organizationId: response.user.organizationId,
        permissions: response.user.permissions,
        isActive: response.user.isActive
      };
      
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      
      setUser(response.user);
      router.push('/platform/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registration handler
   */
  const register = async (data: RegistrationData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate inputs
      if (!data.email || !data.password || !data.name) {
        throw {
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: 'Email, password, and name are required'
        } as AuthError;
      }
      
      // Validate password strength
      const passwordValidation = AuthService.validatePassword(data.password);
      if (!passwordValidation.valid) {
        throw {
          type: AuthErrorType.INVALID_CREDENTIALS,
          message: passwordValidation.message || 'Invalid password'
        } as AuthError;
      }
      
      const response = await AuthService.register(data);
      
      // Store tokens and user data in localStorage
      localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken.token);
      
      if (response.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken.token);
      }
      
      // Store user data in localStorage (non-sensitive data only)
      const userData = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        department: response.user.department,
        organizationId: response.user.organizationId,
        permissions: response.user.permissions,
        isActive: response.user.isActive
      };
      
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      
      setUser(response.user);
      router.push('/platform/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error as AuthError);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout handler
   */
  const logout = () => {
    clearAuthState();
    router.push('/login');
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Check if user has specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return AuthService.hasPermission(user, permission);
  };

  // Context value
  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use the auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
