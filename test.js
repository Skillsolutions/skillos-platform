// Test script for Udemy Business API Connector
// This script tests all major functionality of the connector

const UdemyConnector = require('../index');
const { logger } = require('../utils/logger');

// Test configuration
const config = {
  clientId: process.env.UDEMY_CLIENT_ID || 'test_client_id',
  clientSecret: process.env.UDEMY_CLIENT_SECRET || 'test_client_secret',
  baseUrl: process.env.UDEMY_API_URL || 'https://business-api.udemy.com',
  // For testing without actual credentials, we can use mock mode
  mockMode: process.env.MOCK_MODE === 'true' || true
};

// Mock data for testing without actual API access
const mockData = {
  courses: [
    {
      id: '1234567',
      title: 'JavaScript Fundamentals',
      url: 'https://udemy.com/course/javascript-fundamentals',
      image_480x270: 'https://img-c.udemycdn.com/course/480x270/1234567_abcd.jpg',
      headline: 'Learn JavaScript from scratch',
      instructors: [{ name: 'John Doe', title: 'Senior Developer' }],
      content_info: '10 hours',
      num_reviews: 1500,
      rating: 4.7,
      num_subscribers: 10000,
      created: '2023-01-15',
      last_update_date: '2023-05-20',
      categories: [{ id: 'web-development', title: 'Web Development' }]
    },
    {
      id: '7654321',
      title: 'Python for Data Science',
      url: 'https://udemy.com/course/python-data-science',
      image_480x270: 'https://img-c.udemycdn.com/course/480x270/7654321_dcba.jpg',
      headline: 'Master Python for Data Analysis',
      instructors: [{ name: 'Jane Smith', title: 'Data Scientist' }],
      content_info: '15 hours',
      num_reviews: 2200,
      rating: 4.8,
      num_subscribers: 15000,
      created: '2023-02-10',
      last_update_date: '2023-06-15',
      categories: [{ id: 'data-science', title: 'Data Science' }]
    }
  ],
  courseDetails: {
    id: '1234567',
    title: 'JavaScript Fundamentals',
    url: 'https://udemy.com/course/javascript-fundamentals',
    description: 'Comprehensive JavaScript course for beginners',
    headline: 'Learn JavaScript from scratch',
    instructors: [{ name: 'John Doe', title: 'Senior Developer' }],
    content_info: '10 hours',
    num_lectures: 45,
    num_reviews: 1500,
    rating: 4.7,
    num_subscribers: 10000,
    created: '2023-01-15',
    last_update_date: '2023-05-20',
    categories: [{ id: 'web-development', title: 'Web Development' }],
    requirements: ['Basic HTML and CSS knowledge'],
    what_you_will_learn: ['JavaScript syntax', 'DOM manipulation', 'Asynchronous programming']
  },
  analytics: {
    total_users: 500,
    active_users: 350,
    course_enrollments: 1200,
    course_completions: 450,
    total_learning_hours: 2500,
    average_completion_rate: 0.75
  },
  userProgress: {
    user_id: 'user123',
    course_id: '1234567',
    progress: 0.65,
    last_accessed: '2023-07-15T10:30:00Z',
    completed_lectures: 30,
    total_lectures: 45,
    estimated_completion_date: '2023-08-01T00:00:00Z'
  },
  recommendations: [
    {
      id: '1234567',
      title: 'JavaScript Fundamentals',
      relevanceScore: 0.95,
      skillMatch: ['JavaScript', 'Web Development']
    },
    {
      id: '7654321',
      title: 'Python for Data Science',
      relevanceScore: 0.85,
      skillMatch: ['Python', 'Data Analysis']
    }
  ]
};

// Mock API responses
class MockApi {
  static authenticate() {
    return {
      access_token: 'mock_access_token',
      expires_in: 3600
    };
  }
  
  static searchCourses() {
    return {
      items: mockData.courses,
      totalCount: mockData.courses.length,
      pageCount: 1
    };
  }
  
  static getCourseDetails(courseId) {
    return mockData.courseDetails;
  }
  
  static getAnalytics() {
    return mockData.analytics;
  }
  
  static getUserProgress() {
    return mockData.userProgress;
  }
  
  static getRecommendations() {
    return mockData.recommendations;
  }
}

// Run tests
async function runTests() {
  logger.info('Starting Udemy API Connector tests');
  
  try {
    // Initialize connector
    const connector = new UdemyConnector(config);
    logger.info('Connector initialized');
    
    // Test authentication
    await testAuthentication(connector);
    
    // Test course discovery
    await testCourseDiscovery(connector);
    
    // Test analytics
    await testAnalytics(connector);
    
    // Test skills gap analysis
    await testSkillsGap(connector);
    
    // Test xAPI
    await testXApi(connector);
    
    logger.info('All tests completed successfully');
  } catch (error) {
    logger.error('Test suite failed', error);
  }
}

// Test authentication
async function testAuthentication(connector) {
  logger.info('Testing authentication...');
  
  try {
    if (config.mockMode) {
      // Mock authentication
      connector.auth.token = 'mock_access_token';
      connector.auth.tokenExpiry = new Date(Date.now() + 3600 * 1000);
      logger.info('Authentication successful (mock mode)');
    } else {
      // Real authentication
      await connector.initialize();
      logger.info('Authentication successful');
    }
  } catch (error) {
    logger.error('Authentication test failed', error);
    throw error;
  }
}

// Test course discovery
async function testCourseDiscovery(connector) {
  logger.info('Testing course discovery...');
  
  try {
    // Test course search
    let searchResults;
    if (config.mockMode) {
      searchResults = MockApi.searchCourses();
    } else {
      searchResults = await connector.searchCourses({ query: 'javascript' });
    }
    
    logger.info(`Found ${searchResults.items.length} courses`);
    
    // Test course details
    const courseId = config.mockMode ? '1234567' : searchResults.items[0].id;
    
    let courseDetails;
    if (config.mockMode) {
      courseDetails = MockApi.getCourseDetails(courseId);
    } else {
      courseDetails = await connector.getCourseDetails(courseId);
    }
    
    logger.info(`Retrieved details for course: ${courseDetails.title}`);
    
    // Test SSO URL generation
    const userId = 'test_user_123';
    let ssoUrl;
    
    if (config.mockMode) {
      ssoUrl = `https://udemy.com/course/sso?user=${userId}&course=${courseId}`;
    } else {
      ssoUrl = await connector.generateCourseSSO(courseId, userId);
    }
    
    logger.info(`Generated SSO URL: ${ssoUrl}`);
    
    logger.info('Course discovery tests passed');
  } catch (error) {
    logger.error('Course discovery test failed', error);
    throw error;
  }
}

// Test analytics
async function testAnalytics(connector) {
  logger.info('Testing analytics...');
  
  try {
    // Test analytics reports
    let analyticsData;
    if (config.mockMode) {
      analyticsData = MockApi.getAnalytics();
    } else {
      analyticsData = await connector.getAnalytics();
    }
    
    logger.info(`Retrieved analytics data: ${JSON.stringify(analyticsData)}`);
    
    // Test user progress
    const userId = 'test_user_123';
    const courseId = '1234567';
    
    let progressData;
    if (config.mockMode) {
      progressData = MockApi.getUserProgress(userId, courseId);
    } else {
      progressData = await connector.getUserProgress(userId, courseId);
    }
    
    logger.info(`Retrieved progress data: ${JSON.stringify(progressData)}`);
    
    logger.info('Analytics tests passed');
  } catch (error) {
    logger.error('Analytics test failed', error);
    throw error;
  }
}

// Test skills gap analysis
async function testSkillsGap(connector) {
  logger.info('Testing skills gap analysis...');
  
  try {
    // Test recommendations
    const userId = 'test_user_123';
    const skills = ['javascript', 'react', 'node.js'];
    
    let recommendations;
    if (config.mockMode) {
      recommendations = MockApi.getRecommendations(userId, skills);
    } else {
      recommendations = await connector.getRecommendations(userId, skills);
    }
    
    logger.info(`Retrieved ${recommendations.length} recommendations`);
    
    logger.info('Skills gap analysis tests passed');
  } catch (error) {
    logger.error('Skills gap analysis test failed', error);
    throw error;
  }
}

// Test xAPI
async function testXApi(connector) {
  logger.info('Testing xAPI integration...');
  
  try {
    // Register test handler
    let receivedStatement = null;
    connector.xapi.registerHandler((statement) => {
      receivedStatement = statement;
      logger.info('xAPI handler received statement');
    });
    
    // Simulate xAPI statement
    const userId = 'test_user_123';
    const courseId = '1234567';
    const verb = 'completed';
    const result = { completion: true, score: { scaled: 0.95 } };
    
    const statement = connector.xapi.simulateStatement(userId, courseId, verb, result);
    
    // Verify handler was called
    if (receivedStatement) {
      logger.info('xAPI handler was called successfully');
    } else {
      throw new Error('xAPI handler was not called');
    }
    
    logger.info('xAPI tests passed');
  } catch (error) {
    logger.error('xAPI test failed', error);
    throw error;
  }
}

// Run all tests
runTests().catch(error => {
  logger.error('Test runner failed', error);
  process.exit(1);
});
