// xAPI Integration Module for Udemy Business API
// Handles real-time learning events via xAPI

const axios = require('axios');
const { logger } = require('../utils/logger');

class XApiModule {
  constructor(authModule, config) {
    this.auth = authModule;
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://business-api.udemy.com';
    this.xapiEndpoint = config.xapiEndpoint;
    this.eventHandlers = [];
  }

  /**
   * Register an event handler for xAPI statements
   * @param {Function} handler - Event handler function
   */
  registerHandler(handler) {
    if (typeof handler === 'function') {
      this.eventHandlers.push(handler);
      logger.info('xAPI event handler registered');
    } else {
      logger.error('Invalid xAPI event handler');
      throw new Error('Handler must be a function');
    }
  }

  /**
   * Configure xAPI endpoint
   * @param {string} endpoint - xAPI endpoint URL
   * @returns {Promise<Object>} - Configuration result
   */
  async configureEndpoint(endpoint) {
    try {
      const headers = await this.auth.getAuthHeaders();
      
      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/xapi/configure`,
        headers,
        data: {
          endpoint_url: endpoint,
          enabled: true
        }
      });
      
      this.xapiEndpoint = endpoint;
      logger.info(`xAPI endpoint configured: ${endpoint}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to configure xAPI endpoint', error);
      throw new Error(`xAPI configuration failed: ${error.message}`);
    }
  }

  /**
   * Process an xAPI statement
   * @param {Object} statement - xAPI statement
   */
  processStatement(statement) {
    try {
      logger.debug('Processing xAPI statement', statement);
      
      // Notify all registered handlers
      this.eventHandlers.forEach(handler => {
        try {
          handler(statement);
        } catch (handlerError) {
          logger.error('Error in xAPI event handler', handlerError);
        }
      });
    } catch (error) {
      logger.error('Error processing xAPI statement', error);
    }
  }

  /**
   * Simulate receiving an xAPI statement (for testing)
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @param {string} verb - xAPI verb (e.g., 'progressed', 'completed')
   * @param {Object} result - Result data
   */
  simulateStatement(userId, courseId, verb, result = {}) {
    const statement = {
      actor: {
        mbox: `mailto:${userId}@example.com`,
        name: userId
      },
      verb: {
        id: `http://adlnet.gov/expapi/verbs/${verb}`,
        display: { 'en-US': verb }
      },
      object: {
        id: `http://udemy.com/courses/${courseId}`,
        definition: {
          name: { 'en-US': `Course ${courseId}` }
        }
      },
      result
    };
    
    this.processStatement(statement);
    return statement;
  }
}

module.exports = XApiModule;
