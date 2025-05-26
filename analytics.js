// Analytics Module for Udemy Business API
// Handles reporting, user progress tracking, and engagement data

const axios = require('axios');
const { logger } = require('../utils/logger');

class AnalyticsModule {
  constructor(authModule, config) {
    this.auth = authModule;
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://business-api.udemy.com';
  }

  /**
   * Get analytics reports
   * @param {Object} params - Filter parameters
   * @returns {Promise<Object>} - Analytics data
   */
  async getReports(params = {}) {
    try {
      const headers = await this.auth.getAuthHeaders();
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('start_date', params.startDate);
      if (params.endDate) queryParams.append('end_date', params.endDate);
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('page_size', params.pageSize);
      
      const response = await axios({
        method: 'get',
        url: `${this.baseUrl}/analytics/reports?${queryParams.toString()}`,
        headers
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to get analytics reports', error);
      throw new Error(`Analytics reports retrieval failed: ${error.message}`);
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
      const headers = await this.auth.getAuthHeaders();
      
      const response = await axios({
        method: 'get',
        url: `${this.baseUrl}/users/${userId}/courses/${courseId}/progress`,
        headers
      });
      
      return response.data;
    } catch (error) {
      logger.error(`Failed to get progress for user ${userId} on course ${courseId}`, error);
      throw new Error(`User progress retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get course completion data
   * @param {Object} params - Filter parameters
   * @returns {Promise<Array>} - Completion data
   */
  async getCourseCompletions(params = {}) {
    try {
      const headers = await this.auth.getAuthHeaders();
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('start_date', params.startDate);
      if (params.endDate) queryParams.append('end_date', params.endDate);
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('page_size', params.pageSize);
      
      const response = await axios({
        method: 'get',
        url: `${this.baseUrl}/analytics/course-completions?${queryParams.toString()}`,
        headers
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to get course completions', error);
      throw new Error(`Course completions retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get user activity data
   * @param {Object} params - Filter parameters
   * @returns {Promise<Array>} - User activity data
   */
  async getUserActivity(params = {}) {
    try {
      const headers = await this.auth.getAuthHeaders();
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('start_date', params.startDate);
      if (params.endDate) queryParams.append('end_date', params.endDate);
      if (params.userId) queryParams.append('user_id', params.userId);
      if (params.page) queryParams.append('page', params.page);
      if (params.pageSize) queryParams.append('page_size', params.pageSize);
      
      const response = await axios({
        method: 'get',
        url: `${this.baseUrl}/analytics/user-activity?${queryParams.toString()}`,
        headers
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to get user activity', error);
      throw new Error(`User activity retrieval failed: ${error.message}`);
    }
  }
}

module.exports = AnalyticsModule;
