// Test script for Udemy Business Course Discovery Module

const AuthModule = require('./modules/auth');
const CourseDiscoveryModule = require('./modules/courseDiscovery');
const config = require('./config');
const { logger } = require('./utils/logger');

async function testCourseDiscovery() {
  try {
    logger.info('Starting Course Discovery Module test');
    
    // Create auth module instance
    const auth = new AuthModule(config);
    
    // Create course discovery module instance
    const courseDiscovery = new CourseDiscoveryModule(auth, config);
    
    // Test 1: Basic course search
    logger.info('Test 1: Basic course search');
    const searchResults = await courseDiscovery.search({ page_size: 5 });
    logger.info(`Found ${searchResults.count} total courses, showing first ${searchResults.results.length}`);
    
    // Test 2: Search courses by keyword
    logger.info('Test 2: Search courses by keyword "python"');
    const pythonCourses = await courseDiscovery.search({ 
      search: 'python',
      page_size: 5
    });
    logger.info(`Found ${pythonCourses.count} Python courses`);
    
    // Test 3: Get course details
    if (searchResults.results.length > 0) {
      const courseId = searchResults.results[0].id;
      logger.info(`Test 3: Get details for course ID ${courseId}`);
      const courseDetails = await courseDiscovery.getDetails(courseId);
      logger.info(`Retrieved details for course: ${courseDetails.title}`);
    }
    
    // Test 4: Get popular courses
    logger.info('Test 4: Get popular courses');
    const popularCourses = await courseDiscovery.getPopularCourses(3);
    logger.info(`Retrieved ${popularCourses.length} popular courses`);
    
    // Test 5: Get newest courses
    logger.info('Test 5: Get newest courses');
    const newestCourses = await courseDiscovery.getNewestCourses(3);
    logger.info(`Retrieved ${newestCourses.length} newest courses`);
    
    // Test 6: Search by skills
    logger.info('Test 6: Search by skills');
    const skillCourses = await courseDiscovery.searchBySkills(['javascript', 'react'], { page_size: 5 });
    logger.info(`Found ${skillCourses.count} courses matching skills`);
    
    logger.info('All tests completed successfully');
    return true;
  } catch (error) {
    logger.error('Course Discovery test failed', error);
    return false;
  }
}

// Run the test
testCourseDiscovery()
  .then(success => {
    if (success) {
      logger.info('Course Discovery module tests completed successfully');
      process.exit(0);
    } else {
      logger.error('Course Discovery module tests failed');
      process.exit(1);
    }
  })
  .catch(error => {
    logger.error('Unexpected error during Course Discovery tests', error);
    process.exit(1);
  });
