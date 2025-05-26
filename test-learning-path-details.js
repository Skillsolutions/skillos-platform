// Test script for Udemy Business Learning Path Details

const AuthModule = require('./modules/auth');
const config = require('./config');
const { logger } = require('./utils/logger');

async function testLearningPathDetails() {
  try {
    logger.info('Starting Learning Path Details API test');
    
    // Create auth module instance
    const auth = new AuthModule(config);
    
    // First, get a list of learning paths to find valid IDs
    logger.info('Fetching learning paths list to find valid IDs');
    const endpoint = `organizations/${config.accountId}/learning-paths/list/`;
    
    const params = {
      'page': 1,
      'page_size': 5
    };
    
    const pathsResponse = await auth.makeRequest('get', endpoint, null, params);
    
    if (pathsResponse && pathsResponse.results && pathsResponse.results.length > 0) {
      logger.info(`Retrieved ${pathsResponse.results.length} learning paths`);
      
      // Log all learning path IDs and titles
      pathsResponse.results.forEach((path, index) => {
        logger.info(`Learning Path ${index + 1}: ID=${path.id}, Title="${path.title}"`);
      });
      
      // Try to get details for each learning path
      for (const path of pathsResponse.results) {
        try {
          logger.info(`Attempting to get details for learning path ID: ${path.id}`);
          
          // Try with different endpoint patterns
          const endpoints = [
            `organizations/${config.accountId}/learning-paths/${path.id}/`,
            `organizations/${config.accountId}/learning-paths/get/?path_id=${path.id}`,
            `learning-paths/${path.id}/`,
            `learning-paths/get/?id=${path.id}`
          ];
          
          let success = false;
          
          for (const testEndpoint of endpoints) {
            try {
              logger.info(`Testing endpoint: ${testEndpoint}`);
              const detailsResponse = await auth.makeRequest('get', testEndpoint);
              
              logger.info(`SUCCESS with endpoint ${testEndpoint}`);
              logger.info(`Learning path details: ${JSON.stringify(detailsResponse, null, 2)}`);
              
              success = true;
              break;
            } catch (endpointError) {
              logger.error(`Failed with endpoint ${testEndpoint}: ${endpointError.message}`);
            }
          }
          
          if (!success) {
            logger.error(`Could not retrieve details for learning path ID ${path.id} with any endpoint pattern`);
          }
        } catch (pathError) {
          logger.error(`Error processing learning path ID ${path.id}: ${pathError.message}`);
        }
      }
      
      return true;
    } else {
      logger.error('No learning paths found in listing');
      return false;
    }
  } catch (error) {
    logger.error('Learning Path Details test failed', error);
    return false;
  }
}

// Run the test
testLearningPathDetails()
  .then(success => {
    if (success) {
      logger.info('Learning Path Details test completed');
      process.exit(0);
    } else {
      logger.error('Learning Path Details test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    logger.error('Unexpected error during Learning Path Details test', error);
    process.exit(1);
  });
