// Environment variables loader for Udemy Business API
import { getUdemyBusinessConfig } from './config';

/**
 * Load environment variables for Udemy Business API
 * This function should be called during application initialization
 */
export const loadUdemyEnvironment = (): void => {
  try {
    const config = getUdemyBusinessConfig();
    
    // Log configuration status (without sensitive details)
    console.log('Udemy Business API environment loaded', {
      baseUrl: config.baseUrl,
      clientIdPresent: !!config.clientId,
      clientSecretPresent: !!config.clientSecret
    });
    
    // Check if configuration is valid
    if (!config.clientId || !config.clientSecret) {
      console.warn('Udemy Business API configuration is incomplete. Some features may not work correctly.');
    }
  } catch (error) {
    console.error('Failed to load Udemy Business API environment', { error: (error as Error).message });
  }
};

/**
 * Initialize Udemy Business API with environment variables
 * @returns {Promise<boolean>} Whether initialization was successful
 */
export const initializeUdemyApi = async (): Promise<boolean> => {
  try {
    // Load environment first
    loadUdemyEnvironment();
    
    console.log('Udemy Business API initialized', {
      environment: process.env.NODE_ENV,
      mockMode: true // Always use mock mode for now
    });
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Udemy Business API', { error: (error as Error).message });
    return false;
  }
};

export default {
  loadUdemyEnvironment,
  initializeUdemyApi
};
