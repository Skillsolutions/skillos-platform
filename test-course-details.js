// Test script for Udemy Business Course Details API

const AuthModule = require('./modules/auth');
const config = require('./config');
const { logger } = require('./utils/logger');

async function testCourseDetails() {
  try {
    logger.info('Starting Course Details API test');
    
    // Create auth module instance
    const auth = new AuthModule(config);
    
    // First, get a list of courses to find valid IDs
    logger.info('Fetching course list to find valid IDs');
    const endpoint = `organizations/${config.accountId}/courses/list/`;
    
    const params = {
      'page': 1,
      'page_size': 5,
      'fields[course]': 'id,title,url'
    };
    
    const coursesResponse = await auth.makeRequest('get', endpoint, null, params);
    
    if (coursesResponse && coursesResponse.results && coursesResponse.results.length > 0) {
      logger.info(`Retrieved ${coursesResponse.results.length} courses`);
      
      // Log all course IDs and titles
      coursesResponse.results.forEach((course, index) => {
        logger.info(`Course ${index + 1}: ID=${course.id}, Title="${course.title}"`);
      });
      
      // Try to get details for each course
      for (const course of coursesResponse.results) {
        try {
          logger.info(`Attempting to get details for course ID: ${course.id}`);
          
          // Try with different endpoint patterns
          const endpoints = [
            `organizations/${config.accountId}/courses/${course.id}/`,
            `organizations/${config.accountId}/courses/get/?course_id=${course.id}`,
            `courses/${course.id}/`
          ];
          
          let success = false;
          
          for (const testEndpoint of endpoints) {
            try {
              logger.info(`Testing endpoint: ${testEndpoint}`);
              const detailsResponse = await auth.makeRequest('get', testEndpoint);
              
              logger.info(`SUCCESS with endpoint ${testEndpoint}`);
              logger.info(`Course details: ${JSON.stringify(detailsResponse, null, 2)}`);
              
              success = true;
              break;
            } catch (endpointError) {
              logger.error(`Failed with endpoint ${testEndpoint}: ${endpointError.message}`);
            }
          }
          
          if (!success) {
            logger.error(`Could not retrieve details for course ID ${course.id} with any endpoint pattern`);
          }
        } catch (courseError) {
          logger.error(`Error processing course ID ${course.id}: ${courseError.message}`);
        }
      }
      
      return true;
    } else {
      logger.error('No courses found in listing');
      return false;
    }
  } catch (error) {
    logger.error('Course Details test failed', error);
    return false;
  }
}

// Run the test
testCourseDetails()
  .then(success => {
    if (success) {
      logger.info('Course Details test completed');
      process.exit(0);
    } else {
      logger.error('Course Details test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    logger.error('Unexpected error during Course Details test', error);
    process.exit(1);
  });
