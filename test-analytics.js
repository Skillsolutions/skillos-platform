// Test script for Udemy Business Analytics Module

const AuthModule = require('./modules/auth');
const AnalyticsModule = require('./modules/analytics');
const config = require('./config');
const { logger } = require('./utils/logger');

async function testAnalytics() {
  try {
    logger.info('Starting Analytics Module test');
    
    // Create auth module instance
    const auth = new AuthModule(config);
    
    // Create analytics module instance
    const analytics = new AnalyticsModule(auth, config);
    
    // Test 1: Get course activity metrics
    try {
      logger.info('Test 1: Get course activity metrics');
      const courseActivity = await analytics.getCourseActivity({ page_size: 5 });
      logger.info(`Retrieved activity data for ${courseActivity.results.length} courses`);
      
      if (courseActivity.results.length > 0) {
        logger.info(`Sample course activity: ${JSON.stringify(courseActivity.results[0], null, 2)}`);
      }
    } catch (error) {
      logger.error('Course activity test failed', error);
    }
    
    // Test 2: Get user activity metrics
    try {
      logger.info('Test 2: Get user activity metrics');
      const userActivity = await analytics.getUserActivity({ page_size: 5 });
      logger.info(`Retrieved activity data for ${userActivity.results.length} users`);
      
      if (userActivity.results.length > 0) {
        logger.info(`Sample user activity: ${JSON.stringify(userActivity.results[0], null, 2)}`);
      }
    } catch (error) {
      logger.error('User activity test failed', error);
    }
    
    // Test 3: Get top courses
    try {
      logger.info('Test 3: Get top courses');
      const topCourses = await analytics.getTopCourses(3);
      logger.info(`Retrieved ${topCourses.length} top courses`);
      
      if (topCourses.length > 0) {
        logger.info(`Top course: ${topCourses[0].course.title} with completion ratio ${topCourses[0].completion_ratio}`);
      }
    } catch (error) {
      logger.error('Top courses test failed', error);
    }
    
    // Test 4: Get learning insights
    try {
      logger.info('Test 4: Get learning insights');
      const insights = await analytics.getLearningInsights();
      logger.info('Retrieved learning insights');
      logger.info(`Learning insights: ${JSON.stringify(insights, null, 2)}`);
    } catch (error) {
      logger.error('Learning insights test failed', error);
    }
    
    // Test 5: Get learning time metrics
    try {
      logger.info('Test 5: Get learning time metrics');
      const learningTime = await analytics.getLearningTime({ page_size: 3 });
      logger.info('Retrieved learning time metrics');
      
      if (learningTime.results && learningTime.results.length > 0) {
        logger.info(`Sample learning time: ${JSON.stringify(learningTime.results[0], null, 2)}`);
      }
    } catch (error) {
      logger.error('Learning time test failed', error);
    }
    
    logger.info('Analytics module tests completed');
    return true;
  } catch (error) {
    logger.error('Analytics module test failed', error);
    return false;
  }
}

// Run the test
testAnalytics()
  .then(success => {
    if (success) {
      logger.info('Analytics module tests completed');
      process.exit(0);
    } else {
      logger.error('Analytics module tests failed');
      process.exit(1);
    }
  })
  .catch(error => {
    logger.error('Unexpected error during Analytics tests', error);
    process.exit(1);
  });
