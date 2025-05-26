// Test script for Udemy Business Learning Paths Module

const AuthModule = require('./modules/auth');
const LearningPathsModule = require('./modules/learningPaths');
const config = require('./config');
const { logger } = require('./utils/logger');

async function testLearningPaths() {
  try {
    logger.info('Starting Learning Paths Module test');
    
    // Create auth module instance
    const auth = new AuthModule(config);
    
    // Create learning paths module instance
    const learningPaths = new LearningPathsModule(auth, config);
    
    // Test 1: List learning paths
    try {
      logger.info('Test 1: List learning paths');
      const pathsList = await learningPaths.listLearningPaths({ page_size: 5 });
      logger.info(`Retrieved ${pathsList.count} total learning paths, showing first ${pathsList.results.length}`);
      
      if (pathsList.results.length > 0) {
        logger.info(`First learning path: ${JSON.stringify(pathsList.results[0], null, 2)}`);
        
        // Store first path ID for subsequent tests
        const firstPathId = pathsList.results[0].id;
        
        // Test 2: Get learning path details
        try {
          logger.info(`Test 2: Get details for learning path ID ${firstPathId}`);
          const pathDetails = await learningPaths.getLearningPathDetails(firstPathId);
          logger.info(`Retrieved details for learning path: ${pathDetails.title}`);
          
          // Test 3: Get learning path sections
          try {
            logger.info(`Test 3: Get sections for learning path ID ${firstPathId}`);
            const sections = await learningPaths.getLearningPathSections(firstPathId);
            logger.info(`Retrieved ${sections.length} sections`);
            
            if (sections.length > 0) {
              const firstSectionId = sections[0].id;
              
              // Test 4: Get learning path items in a section
              try {
                logger.info(`Test 4: Get items for section ${firstSectionId}`);
                const items = await learningPaths.getLearningPathItems(firstPathId, firstSectionId);
                logger.info(`Retrieved ${items.length} items in section`);
              } catch (itemsError) {
                logger.error('Items retrieval test failed', itemsError);
              }
            }
          } catch (sectionsError) {
            logger.error('Sections retrieval test failed', sectionsError);
          }
          
          // Test 5: Get all items in a learning path
          try {
            logger.info(`Test 5: Get all items for learning path ID ${firstPathId}`);
            const allItems = await learningPaths.getAllLearningPathItems(firstPathId);
            logger.info(`Retrieved a total of ${allItems.length} items across all sections`);
          } catch (allItemsError) {
            logger.error('All items retrieval test failed', allItemsError);
          }
        } catch (detailsError) {
          logger.error('Path details test failed', detailsError);
        }
      }
      
      // Test 6: Search learning paths
      try {
        logger.info('Test 6: Search learning paths');
        const searchQuery = 'leadership';
        const searchResults = await learningPaths.searchLearningPaths(searchQuery, { page_size: 3 });
        logger.info(`Found ${searchResults.count} learning paths matching "${searchQuery}"`);
      } catch (searchError) {
        logger.error('Search test failed', searchError);
      }
      
    } catch (listError) {
      logger.error('Learning paths listing test failed', listError);
    }
    
    logger.info('Learning Paths module tests completed');
    return true;
  } catch (error) {
    logger.error('Learning Paths module test failed', error);
    return false;
  }
}

// Run the test
testLearningPaths()
  .then(success => {
    if (success) {
      logger.info('Learning Paths module tests completed');
      process.exit(0);
    } else {
      logger.error('Learning Paths module tests failed');
      process.exit(1);
    }
  })
  .catch(error => {
    logger.error('Unexpected error during Learning Paths tests', error);
    process.exit(1);
  });
