// Test script for Udemy Business API authentication

const AuthModule = require('./modules/auth');
const config = require('./config');
const { logger } = require('./utils/logger');

async function testAuthentication() {
  try {
    logger.info('Starting authentication test');
    
    // Create auth module instance
    const auth = new AuthModule(config);
    
    // Attempt to authenticate and get token
    logger.info('Attempting to authenticate with Udemy Business API');
    const token = await auth.authenticate();
    
    if (token) {
      logger.info('Authentication successful!');
      logger.info(`Token received (first 10 chars): ${token.substring(0, 10)}...`);
      
      // Get auth headers
      const headers = await auth.getAuthHeaders();
      logger.info('Auth headers generated successfully');
      
      return true;
    } else {
      logger.error('No token received');
      return false;
    }
  } catch (error) {
    logger.error('Authentication test failed', error);
    return false;
  }
}

// Run the test
testAuthentication()
  .then(success => {
    if (success) {
      logger.info('Authentication module test completed successfully');
      process.exit(0);
    } else {
      logger.error('Authentication module test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    logger.error('Unexpected error during authentication test', error);
    process.exit(1);
  });
