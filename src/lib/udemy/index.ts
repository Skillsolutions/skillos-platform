// Main index file for Udemy Business API
import { loadUdemyEnvironment, initializeUdemyApi } from './environment';
import { getUdemyBusinessConfig, validateConfig } from './config';

// Export utility functions
export {
  loadUdemyEnvironment,
  initializeUdemyApi,
  getUdemyBusinessConfig,
  validateConfig
};

// Default export
export default {
  loadUdemyEnvironment,
  initializeUdemyApi,
  getUdemyBusinessConfig,
  validateConfig
};
