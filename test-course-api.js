// Test script for Udemy Business Course API access

const AuthModule = require('./modules/auth');
const config = require('./config');
const { logger } = require('./utils/logger');

async function testCourseAPI() {
  try {
    logger.info('Starting Course API test');
    
    // Create auth module instance
    const auth = new AuthModule(config);
    
    // Test listing courses
    logger.info(`Attempting to list courses for account ID: ${config.accountId}`);
    const endpoint = `organizations/${config.accountId}/courses/list/`;
    
    // Optional parameters for fields and pagination
    const params = {
      'page': 1,
      'page_size': 10,
      'fields[course]': 'title,headline,url,image_480x270'
    };
    
    const coursesResponse = await auth.makeRequest('get', endpoint, null, params);
    
    if (coursesResponse && coursesResponse.results) {
      logger.info(`Successfully retrieved ${coursesResponse.results.length} courses`);
      logger.info(`Total courses available: ${coursesResponse.count}`);
      
      // Log the first course details
      if (coursesResponse.results.length > 0) {
        const firstCourse = coursesResponse.results[0];
        logger.info(`First course: ${JSON.stringify(firstCourse, null, 2)}`);
      }
      
      return true;
    } else {
      logger.error('No course results received');
      return false;
    }
  } catch (error) {
    logger.error('Course API test failed', error);
    return false;
  }
}

// Run the test
testCourseAPI()
  .then(success => {
    if (success) {
      logger.info('Course API test completed successfully');
      process.exit(0);
    } else {
      logger.error('Course API test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    logger.error('Unexpected error during Course API test', error);
    process.exit(1);
  });
