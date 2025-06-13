// Udemy Business API Configuration
import { loadUdemyEnvironment } from './environment';

export interface UdemyBusinessConfig {
  clientId: string;
  clientSecret: string;
  organizationId: string;
  baseUrl: string;
  authUrl: string;
  apiRateLimit: number;
  apiRateWindow: number;
}

/**
 * Get Udemy Business API configuration from environment variables
 */
export const getUdemyBusinessConfig = (): UdemyBusinessConfig => {
  // Load environment variables
  loadUdemyEnvironment();

  const config: UdemyBusinessConfig = {
    clientId: process.env.UDEMY_CLIENT_ID || '',
    clientSecret: process.env.UDEMY_CLIENT_SECRET || '',
    organizationId: process.env.UDEMY_ORGANIZATION_ID || '',
    baseUrl: process.env.UDEMY_BASE_URL || 'https://sksolutions-sandbox.udemy.com/api-2.0',
    authUrl: process.env.UDEMY_AUTH_URL || 'https://sksolutions-sandbox.udemy.com/api-2.0/oauth2/token/',
    apiRateLimit: parseInt(process.env.UDEMY_API_RATE_LIMIT || '100'),
    apiRateWindow: parseInt(process.env.UDEMY_API_RATE_WINDOW || '3600'),
  };

  return config;
};

/**
 * Validate Udemy Business API configuration
 */
export const validateConfig = (config: UdemyBusinessConfig): boolean => {
  const required = ['clientId', 'clientSecret', 'organizationId', 'baseUrl'];
  
  for (const field of required) {
    if (!config[field as keyof UdemyBusinessConfig]) {
      console.error(`Missing required Udemy Business API configuration: ${field}`);
      return false;
    }
  }

  return true;
};

/**
 * Get API endpoints for Udemy Business
 */
export const getApiEndpoints = (config: UdemyBusinessConfig) => ({
  auth: config.authUrl,
  users: `${config.baseUrl}/organizations/${config.organizationId}/users/`,
  groups: `${config.baseUrl}/organizations/${config.organizationId}/groups/`,
  courses: `${config.baseUrl}/courses/`,
  analytics: `${config.baseUrl}/organizations/${config.organizationId}/analytics/`,
  userProgress: (userId: string) => `${config.baseUrl}/users/${userId}/courses/`,
  userDetails: (userId: string) => `${config.baseUrl}/users/${userId}/`,
  groupMembers: (groupId: string) => `${config.baseUrl}/organizations/${config.organizationId}/groups/${groupId}/users/`,
});

export default {
  getUdemyBusinessConfig,
  validateConfig,
  getApiEndpoints,
};

