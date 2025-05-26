// Udemy Business API Connector
// Main entry point for the connector

const AuthModule = require('./modules/auth');
const CourseDiscoveryModule = require('./modules/courseDiscovery');
const AnalyticsModule = require('./modules/analytics');
const SkillsGapModule = require('./modules/skillsGap');
const XApiModule = require('./modules/xapi');
const { logger } = require('./utils/logger');
const config = require('./config');

class UdemyConnector {
  constructor(options = {}) {
    this.config = {
      ...config,
      ...options
    };
    
    // Initialize modules
    this.auth = new AuthModule(this.config);
    this.courses = new CourseDiscoveryModule(this.auth, this.config);
    this.analytics = new AnalyticsModule(this.auth, this.config);
    this.skills = new SkillsGapModule(this.auth, this.config);
    this.xapi = new XApiModule(this.auth, this.config);
    
    logger.info('Udemy Business API Connector initialized');
  }
  
  /**
   * Initialize the connector with authentication
   */
  async initialize() {
    try {
      await this.auth.authenticate();
      logger.info('Udemy Business API Connector authenticated successfully');
      return true;
    } catch (error) {
      logger.error('Failed to initialize Udemy connector', error);
      throw error;
    }
  }
  
  /**
   * Search for courses in the Udemy catalog
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} - List of courses
   */
  async searchCourses(params = {}) {
    try {
      return await this.courses.search(params);
    } catch (error) {
      logger.error('Error searching courses', error);
      throw error;
    }
  }
  
  /**
   * Get course details by ID
   * @param {string} courseId - Udemy course ID
   * @returns {Promise<Object>} - Course details
   */
  async getCourseDetails(courseId) {
    try {
      return await this.courses.getDetails(courseId);
    } catch (error) {
      logger.error(`Error getting course details for ${courseId}`, error);
      throw error;
    }
  }
  
  /**
   * Generate SSO URL for course launch
   * @param {string} courseId - Udemy course ID
   * @param {string} userId - User ID for SSO
   * @returns {Promise<string>} - SSO URL
   */
  async generateCourseSSO(courseId, userId) {
    try {
      return await this.courses.generateSSO(courseId, userId);
    } catch (error) {
      logger.error(`Error generating SSO for course ${courseId}`, error);
      throw error;
    }
  }
  
  /**
   * Get analytics data for the organization
   * @param {Object} params - Filter parameters
   * @returns {Promise<Object>} - Analytics data
   */
  async getAnalytics(params = {}) {
    try {
      return await this.analytics.getReports(params);
    } catch (error) {
      logger.error('Error getting analytics data', error);
      throw error;
    }
  }
  
  /**
   * Get user progress for a specific course
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} - Progress data
   */
  async getUserProgress(userId, courseId) {
    try {
      return await this.analytics.getUserProgress(userId, courseId);
    } catch (error) {
      logger.error(`Error getting progress for user ${userId} on course ${courseId}`, error);
      throw error;
    }
  }
  
  /**
   * Get course recommendations based on skills gap
   * @param {string} userId - User ID
   * @param {Array} skills - List of skills to match
   * @returns {Promise<Array>} - Recommended courses
   */
  async getRecommendations(userId, skills = []) {
    try {
      return await this.skills.getRecommendations(userId, skills);
    } catch (error) {
      logger.error(`Error getting recommendations for user ${userId}`, error);
      throw error;
    }
  }
  
  /**
   * Register xAPI event handler
   * @param {Function} handler - Event handler function
   */
  registerXApiHandler(handler) {
    this.xapi.registerHandler(handler);
    logger.info('xAPI event handler registered');
  }
}

module.exports = UdemyConnector;
