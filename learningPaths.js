// Learning Paths Module for Udemy Business API
// Handles learning path listing, details, and management

const { logger } = require('../utils/logger');

class LearningPathsModule {
  constructor(auth, config) {
    this.auth = auth;
    this.config = config;
    this.accountId = config.accountId;
  }

  /**
   * List all learning paths
   * @param {Object} params - Query parameters for filtering and pagination
   * @returns {Promise<Object>} - List of learning paths with pagination
   */
  async listLearningPaths(params = {}) {
    try {
      logger.info('Listing learning paths');
      
      const endpoint = `organizations/${this.accountId}/learning-paths/list/`;
      
      // Default parameters
      const defaultParams = {
        page: 1,
        page_size: 20,
        'fields[learning_path]': 'url,title,description,editors,created,last_modified,estimated_content_length,number_of_content_items,is_pro_path,sections,locales,categories,folders'
      };
      
      // Merge default parameters with provided parameters
      const queryParams = { ...defaultParams, ...params };
      
      const response = await this.auth.makeRequest('get', endpoint, null, queryParams);
      
      logger.info(`Retrieved ${response.results.length} learning paths`);
      return response;
    } catch (error) {
      logger.error('Failed to list learning paths', error);
      throw new Error(`Learning paths listing failed: ${error.message}`);
    }
  }

  /**
   * Get learning path details by ID
   * @param {string} pathId - Learning path ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} - Learning path details
   */
  async getLearningPathDetails(pathId, params = {}) {
    try {
      logger.info(`Getting details for learning path ID: ${pathId}`);
      
      const endpoint = `organizations/${this.accountId}/learning-paths/${pathId}/`;
      
      // Default parameters
      const defaultParams = {
        'fields[learning_path]': 'url,title,description,editors,created,last_modified,estimated_content_length,number_of_content_items,is_pro_path,sections,locales,categories,folders'
      };
      
      // Merge default parameters with provided parameters
      const queryParams = { ...defaultParams, ...params };
      
      const response = await this.auth.makeRequest('get', endpoint, null, queryParams);
      
      logger.info(`Successfully retrieved details for learning path: ${response.title}`);
      return response;
    } catch (error) {
      logger.error(`Failed to get learning path details for ${pathId}`, error);
      throw new Error(`Learning path details retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get learning path sections
   * @param {string} pathId - Learning path ID
   * @returns {Promise<Array>} - List of sections in the learning path
   */
  async getLearningPathSections(pathId) {
    try {
      logger.info(`Getting sections for learning path ID: ${pathId}`);
      
      const endpoint = `organizations/${this.accountId}/learning-paths/${pathId}/sections/`;
      
      const response = await this.auth.makeRequest('get', endpoint);
      
      logger.info(`Retrieved ${response.results.length} sections for learning path ${pathId}`);
      return response.results;
    } catch (error) {
      logger.error(`Failed to get sections for learning path ${pathId}`, error);
      throw new Error(`Learning path sections retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get learning path items in a section
   * @param {string} pathId - Learning path ID
   * @param {string} sectionId - Section ID
   * @returns {Promise<Array>} - List of items in the section
   */
  async getLearningPathItems(pathId, sectionId) {
    try {
      logger.info(`Getting items for section ${sectionId} in learning path ${pathId}`);
      
      const endpoint = `organizations/${this.accountId}/learning-paths/${pathId}/sections/${sectionId}/items/`;
      
      const response = await this.auth.makeRequest('get', endpoint);
      
      logger.info(`Retrieved ${response.results.length} items for section ${sectionId}`);
      return response.results;
    } catch (error) {
      logger.error(`Failed to get items for section ${sectionId} in learning path ${pathId}`, error);
      throw new Error(`Learning path items retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get all items in a learning path across all sections
   * @param {string} pathId - Learning path ID
   * @returns {Promise<Array>} - List of all items in the learning path
   */
  async getAllLearningPathItems(pathId) {
    try {
      logger.info(`Getting all items for learning path ID: ${pathId}`);
      
      // First get the learning path details to get sections
      const pathDetails = await this.getLearningPathDetails(pathId);
      
      if (!pathDetails.sections || pathDetails.sections.length === 0) {
        logger.info(`Learning path ${pathId} has no sections`);
        return [];
      }
      
      // Get items for each section
      const allItems = [];
      
      for (const section of pathDetails.sections) {
        try {
          const sectionItems = await this.getLearningPathItems(pathId, section.id);
          allItems.push(...sectionItems);
        } catch (sectionError) {
          logger.error(`Error getting items for section ${section.id}`, sectionError);
        }
      }
      
      logger.info(`Retrieved a total of ${allItems.length} items across all sections`);
      return allItems;
    } catch (error) {
      logger.error(`Failed to get all items for learning path ${pathId}`, error);
      throw new Error(`Learning path items retrieval failed: ${error.message}`);
    }
  }

  /**
   * Search for learning paths
   * @param {string} query - Search query
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} - Search results
   */
  async searchLearningPaths(query, params = {}) {
    try {
      logger.info(`Searching learning paths with query: ${query}`);
      
      const searchParams = {
        ...params,
        search: query
      };
      
      return await this.listLearningPaths(searchParams);
    } catch (error) {
      logger.error('Failed to search learning paths', error);
      throw new Error(`Learning path search failed: ${error.message}`);
    }
  }

  /**
   * Get learning paths by category
   * @param {string} category - Category name
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} - Learning paths in the category
   */
  async getLearningPathsByCategory(category, params = {}) {
    try {
      logger.info(`Getting learning paths for category: ${category}`);
      
      const categoryParams = {
        ...params,
        'filter[category]': category
      };
      
      return await this.listLearningPaths(categoryParams);
    } catch (error) {
      logger.error(`Failed to get learning paths for category ${category}`, error);
      throw new Error(`Category learning paths retrieval failed: ${error.message}`);
    }
  }

  /**
   * Get learning paths by folder
   * @param {string} folderId - Folder ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} - Learning paths in the folder
   */
  async getLearningPathsByFolder(folderId, params = {}) {
    try {
      logger.info(`Getting learning paths for folder ID: ${folderId}`);
      
      const folderParams = {
        ...params,
        'filter[folder]': folderId
      };
      
      return await this.listLearningPaths(folderParams);
    } catch (error) {
      logger.error(`Failed to get learning paths for folder ${folderId}`, error);
      throw new Error(`Folder learning paths retrieval failed: ${error.message}`);
    }
  }
}

module.exports = LearningPathsModule;
