// Authentication Module for Udemy Business API
// Handles OAuth 2.0 authentication, token management, and SSO

const axios = require('axios');
const { logger } = require('../utils/logger');

class AuthModule {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://business-api.udemy.com';
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.token = null;
    this.tokenExpiry = null;
  }

  /**
   * Authenticate with Udemy Business API
   * @returns {Promise<string>} - Access token
   */
  async authenticate() {
    try {
      // Check if we have a valid token
      if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
        logger.debug('Using existing token');
        return this.token;
      }

      logger.info('Authenticating with Udemy Business API');
      
      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/oauth2/token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        auth: {
          username: this.clientId,
          password: this.clientSecret
        },
        data: 'grant_type=client_credentials'
      });

      this.token = response.data.access_token;
      
      // Set token expiry (subtract 5 minutes for safety margin)
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = new Date(Date.now() + (expiresIn - 300) * 1000);
      
      logger.info('Successfully authenticated with Udemy Business API');
      return this.token;
    } catch (error) {
      logger.error('Authentication failed', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Get authorization header with token
   * @returns {Promise<Object>} - Headers object with authorization
   */
  async getAuthHeaders() {
    const token = await this.authenticate();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Generate SSO URL for a user
   * @param {string} userId - User ID for SSO
   * @param {string} returnUrl - URL to return to after authentication
   * @returns {Promise<string>} - SSO URL
   */
  async generateSSOUrl(userId, returnUrl) {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/sso/generate`,
        headers,
        data: {
          user_id: userId,
          return_url: returnUrl
        }
      });
      
      return response.data.sso_url;
    } catch (error) {
      logger.error('Failed to generate SSO URL', error);
      throw new Error(`SSO URL generation failed: ${error.message}`);
    }
  }
}

module.exports = AuthModule;
