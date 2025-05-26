// Integration test for Udemy User Data Connector
// Tests the ability to pull user data from Udemy into SkillOS

import UserDataConnector from '../lib/udemy/userDataConnector';
import { logger } from '../utils/logger';

/**
 * Test the UserDataConnector functionality
 */
async function testUserDataConnector() {
  try {
    logger.info('Starting UserDataConnector test');
    
    // Initialize connector with mock mode enabled for testing
    const userDataConnector = new UserDataConnector({
      mockMode: true
    });
    
    // Test user IDs (would be actual user IDs/emails in production)
    const testUsers = [
      'user1@example.com',
      'user2@example.com',
      'user3@example.com'
    ];
    
    // Test results container
    const results = {
      users: [],
      summary: {
        total: testUsers.length,
        successful: 0,
        failed: 0
      }
    };
    
    // Test each user
    for (const userId of testUsers) {
      try {
        logger.info(`Testing data retrieval for user: ${userId}`);
        
        // Get user learning activity
        const activity = await userDataConnector.getUserLearningActivity(userId);
        
        // Get user enrollments
        const enrollments = await userDataConnector.getUserEnrollments(userId);
        
        // Get user skills
        const skills = await userDataConnector.getUserSkills(userId);
        
        // Get course progress for first enrollment if available
        let courseProgress = null;
        if (enrollments.length > 0) {
          const firstCourseId = enrollments[0].courseId;
          courseProgress = await userDataConnector.getUserCourseProgress(userId, firstCourseId);
        }
        
        // Add results for this user
        results.users.push({
          userId,
          activity,
          enrollments,
          skills,
          courseProgress,
          success: true
        });
        
        results.summary.successful++;
        logger.info(`Successfully retrieved data for user: ${userId}`);
      } catch (userError) {
        logger.error(`Error retrieving data for user ${userId}: ${userError.message}`);
        
        // Add error result for this user
        results.users.push({
          userId,
          error: userError.message,
          success: false
        });
        
        results.summary.failed++;
      }
    }
    
    // Test full sync for one user
    try {
      const syncUserId = testUsers[0];
      logger.info(`Testing full data sync for user: ${syncUserId}`);
      
      const syncResult = await userDataConnector.syncUserData(syncUserId);
      results.syncTest = {
        userId: syncUserId,
        result: syncResult,
        success: syncResult.success
      };
      
      logger.info(`Data sync ${syncResult.success ? 'successful' : 'failed'} for user: ${syncUserId}`);
    } catch (syncError) {
      logger.error(`Error during data sync test: ${syncError.message}`);
      results.syncTest = {
        error: syncError.message,
        success: false
      };
    }
    
    // Log summary
    logger.info(`UserDataConnector test completed. Success: ${results.summary.successful}/${results.summary.total}`);
    
    return results;
  } catch (error) {
    logger.error('UserDataConnector test failed', error);
    throw error;
  }
}

// Run the test
testUserDataConnector()
  .then(results => {
    console.log('Test results:', JSON.stringify(results, null, 2));
  })
  .catch(error => {
    console.error('Test error:', error);
  });
