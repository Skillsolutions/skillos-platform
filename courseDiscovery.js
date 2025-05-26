// Course Discovery Module for Udemy Business API
// Handles course search, details retrieval, and SSO launch

const axios = require('axios');
const { logger } = require('../utils/logger');

class CourseDiscoveryModule {
  constructor(authModule, config) {
    this.auth = authModule;
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://business-api.udemy.com';
    this.graphqlUrl = config.graphqlUrl || 'https://business-api.udemy.com/graphql';
  }

  /**
   * Search for courses using GraphQL API
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} - List of courses
   */
  async search(params = {}) {
    try {
      const headers = await this.auth.getAuthHeaders();
      
      // GraphQL query for course search
      const query = `
        query CourseSearch($query: String, $filters: CourseFilters, $page: Int, $pageSize: Int) {
          courses(query: $query, filters: $filters, page: $page, pageSize: $pageSize) {
            items {
              id
              title
              url
              image_480x270
              headline
              instructors {
                name
                title
              }
              content_info
              num_reviews
              rating
              num_subscribers
              created
              last_update_date
              categories {
                id
                title
              }
            }
            totalCount
            pageCount
          }
        }
      `;
      
      const variables = {
        query: params.query || '',
        filters: {
          categoryIds: params.categoryIds || [],
          subcategoryIds: params.subcategoryIds || [],
          instructorIds: params.instructorIds || [],
          priceRanges: params.priceRanges || [],
          ratings: params.ratings || [],
          languages: params.languages || []
        },
        page: params.page || 1,
        pageSize: params.pageSize || 20
      };
      
      const response = await axios({
        method: 'post',
        url: this.graphqlUrl,
        headers,
        data: {
          query,
          variables
        }
      });
      
      return response.data.data.courses;
    } catch (error) {
      logger.error('Course search failed', error);
      throw new Error(`Course search failed: ${error.message}`);
    }
  }

  /**
   * Get course details by ID
   * @param {string} courseId - Udemy course ID
   * @returns {Promise<Object>} - Course details
   */
  async getDetails(courseId) {
    try {
      const headers = await this.auth.getAuthHeaders();
      
      const response = await axios({
        method: 'get',
        url: `${this.baseUrl}/courses/${courseId}`,
        headers
      });
      
      return response.data;
    } catch (error) {
      logger.error(`Failed to get course details for ${courseId}`, error);
      throw new Error(`Course details retrieval failed: ${error.message}`);
    }
  }

  /**
   * Generate SSO URL for course launch
   * @param {string} courseId - Udemy course ID
   * @param {string} userId - User ID for SSO
   * @returns {Promise<string>} - SSO URL
   */
  async generateSSO(courseId, userId) {
    try {
      // Get course URL first
      const courseDetails = await this.getDetails(courseId);
      const courseUrl = courseDetails.url;
      
      // Generate SSO URL with course as return URL
      return await this.auth.generateSSOUrl(userId, courseUrl);
    } catch (error) {
      logger.error(`Failed to generate SSO for course ${courseId}`, error);
      throw new Error(`SSO generation failed: ${error.message}`);
    }
  }

  /**
   * Get course curriculum
   * @param {string} courseId - Udemy course ID
   * @returns {Promise<Object>} - Course curriculum
   */
  async getCurriculum(courseId) {
    try {
      const headers = await this.auth.getAuthHeaders();
      
      const response = await axios({
        method: 'get',
        url: `${this.baseUrl}/courses/${courseId}/curriculum`,
        headers
      });
      
      return response.data;
    } catch (error) {
      logger.error(`Failed to get curriculum for course ${courseId}`, error);
      throw new Error(`Curriculum retrieval failed: ${error.message}`);
    }
  }
}

module.exports = CourseDiscoveryModule;
