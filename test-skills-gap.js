// Test script for Udemy Business Skills Gap Module

const AuthModule = require('./modules/auth');
const CourseDiscoveryModule = require('./modules/courseDiscovery');
const SkillsGapModule = require('./modules/skillsGap');
const config = require('./config');
const { logger } = require('./utils/logger');

async function testSkillsGap() {
  try {
    logger.info('Starting Skills Gap Module test');
    
    // Create auth module instance
    const auth = new AuthModule(config);
    
    // Create course discovery module instance
    const courseDiscovery = new CourseDiscoveryModule(auth, config);
    
    // Create skills gap module instance
    const skillsGap = new SkillsGapModule(auth, courseDiscovery, config);
    
    // Test 1: Identify skills gap
    logger.info('Test 1: Identify skills gap');
    
    const userSkills = [
      { name: 'JavaScript', proficiency: 3 },
      { name: 'Python', proficiency: 2 },
      { name: 'Data Analysis', proficiency: 1 }
    ];
    
    const targetSkills = [
      { name: 'JavaScript', proficiency: 4 },
      { name: 'Python', proficiency: 3 },
      { name: 'Data Analysis', proficiency: 3 },
      { name: 'Machine Learning', proficiency: 2 }
    ];
    
    const identifiedGaps = skillsGap.identifySkillsGap(userSkills, targetSkills);
    logger.info(`Identified ${identifiedGaps.length} skill gaps`);
    logger.info(`Skills gap: ${JSON.stringify(identifiedGaps, null, 2)}`);
    
    // Test 2: Get recommendations for skills gap
    logger.info('Test 2: Get recommendations for skills gap');
    
    try {
      const recommendations = await skillsGap.getRecommendationsForSkillsGap(identifiedGaps);
      
      // Log recommendations for each skill
      for (const skill in recommendations) {
        logger.info(`Found ${recommendations[skill].length} course recommendations for ${skill}`);
        if (recommendations[skill].length > 0) {
          logger.info(`Top recommendation for ${skill}: ${recommendations[skill][0].title}`);
        }
      }
    } catch (recError) {
      logger.error('Recommendations test failed', recError);
    }
    
    // Test 3: Create personalized learning path
    logger.info('Test 3: Create personalized learning path');
    
    try {
      const learningPath = await skillsGap.createPersonalizedLearningPath(
        userSkills,
        targetSkills,
        'Test Learning Path'
      );
      
      logger.info(`Created learning path with ${learningPath.sections.length} sections and ${learningPath.courses.length} courses`);
      logger.info(`Learning path: ${JSON.stringify(learningPath, null, 2)}`);
    } catch (pathError) {
      logger.error('Learning path creation test failed', pathError);
    }
    
    // Test 4: Generate career development plan
    logger.info('Test 4: Generate career development plan');
    
    try {
      const developmentPlan = await skillsGap.generateCareerDevelopmentPlan(
        'test-user-123',
        'data-scientist'
      );
      
      logger.info(`Generated career development plan for role: ${developmentPlan.targetRole}`);
      logger.info(`Plan contains ${developmentPlan.skillsGap.length} skill gaps to address`);
      
      // Log a few key details from the plan
      if (developmentPlan.skillsGap.length > 0) {
        logger.info(`Top skill gap: ${developmentPlan.skillsGap[0].skill} (current: ${developmentPlan.skillsGap[0].currentProficiency}, required: ${developmentPlan.skillsGap[0].requiredProficiency})`);
      }
    } catch (planError) {
      logger.error('Career development plan test failed', planError);
    }
    
    logger.info('Skills Gap module tests completed');
    return true;
  } catch (error) {
    logger.error('Skills Gap module test failed', error);
    return false;
  }
}

// Run the test
testSkillsGap()
  .then(success => {
    if (success) {
      logger.info('Skills Gap module tests completed');
      process.exit(0);
    } else {
      logger.error('Skills Gap module tests failed');
      process.exit(1);
    }
  })
  .catch(error => {
    logger.error('Unexpected error during Skills Gap tests', error);
    process.exit(1);
  });
