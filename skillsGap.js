// Skills Gap Analysis Module for Udemy Business API
// Handles skills mapping, course recommendations, and personalized learning paths

const axios = require('axios');
const { logger } = require('../utils/logger');

class SkillsGapModule {
  constructor(authModule, config) {
    this.auth = authModule;
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://business-api.udemy.com';
    this.graphqlUrl = config.graphqlUrl || 'https://business-api.udemy.com/graphql';
  }

  /**
   * Get course recommendations based on skills
   * @param {string} userId - User ID
   * @param {Array} skills - List of skills to match
   * @returns {Promise<Array>} - Recommended courses
   */
  async getRecommendations(userId, skills = []) {
    try {
      const headers = await this.auth.getAuthHeaders();
      
      // GraphQL query for skill-based course recommendations
      const query = `
        query SkillBasedRecommendations($userId: String!, $skills: [String!]!) {
          recommendations(userId: $userId, skills: $skills) {
            courses {
              id
              title
              url
              image_480x270
              headline
              instructors {
                name
              }
              content_info
              rating
              relevanceScore
              skillMatch
            }
          }
        }
      `;
      
      const variables = {
        userId,
        skills
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
      
      return response.data.data.recommendations.courses;
    } catch (error) {
      logger.error(`Failed to get recommendations for user ${userId}`, error);
      throw new Error(`Recommendations retrieval failed: ${error.message}`);
    }
  }

  /**
   * Map skills to courses
   * @param {Array} skills - List of skills
   * @returns {Promise<Object>} - Skills to courses mapping
   */
  async mapSkillsToCourses(skills = []) {
    try {
      const headers = await this.auth.getAuthHeaders();
      
      // GraphQL query for skills to courses mapping
      const query = `
        query SkillsMapping($skills: [String!]!) {
          skillsMapping(skills: $skills) {
            skill
            courses {
              id
              title
              relevanceScore
            }
          }
        }
      `;
      
      const variables = {
        skills
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
      
      return response.data.data.skillsMapping;
    } catch (error) {
      logger.error('Failed to map skills to courses', error);
      throw new Error(`Skills mapping failed: ${error.message}`);
    }
  }

  /**
   * Get personalized onboarding recommendations
   * @param {string} userId - User ID
   * @param {Object} profile - User profile data
   * @returns {Promise<Array>} - Onboarding recommendations
   */
  async getOnboardingRecommendations(userId, profile = {}) {
    try {
      const headers = await this.auth.getAuthHeaders();
      
      const response = await axios({
        method: 'post',
        url: `${this.baseUrl}/recommendations/onboarding`,
        headers,
        data: {
          user_id: userId,
          job_title: profile.jobTitle,
          department: profile.department,
          interests: profile.interests || [],
          experience_level: profile.experienceLevel
        }
      });
      
      return response.data.recommendations;
    } catch (error) {
      logger.error(`Failed to get onboarding recommendations for user ${userId}`, error);
      throw new Error(`Onboarding recommendations failed: ${error.message}`);
    }
  }
}

module.exports = SkillsGapModule;
