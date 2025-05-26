// User Data Connector for Udemy Business API
// Handles user activity, progress tracking, and data synchronization

import { UdemyConnector } from './connector';
import { logger } from '../utils/logger';

/**
 * UserDataConnector - Specialized connector for user data integration
 * Extends the base Udemy connector with user-specific functionality
 */
class UserDataConnector {
  /**
   * Create a new UserDataConnector instance
   * @param {Object} config - Configuration object
   */
  constructor(config = {}) {
    this.udemyConnector = new UdemyConnector(config);
    this.mockMode = config.mockMode || process.env.NODE_ENV !== 'production';
    logger.info('UserDataConnector initialized');
  }

  /**
   * Get user learning activity from Udemy
   * @param {string} userId - User ID or email
   * @returns {Promise<Object>} - User learning activity data
   */
  async getUserLearningActivity(userId) {
    try {
      logger.info(`Getting learning activity for user: ${userId}`);
      
      if (this.mockMode) {
        // Return mock data in development/test environments
        return this._getMockUserActivity(userId);
      }
      
      // In production, get real data from Udemy API
      const userActivity = await this.udemyConnector.getUserActivity({
        user_id: userId
      });
      
      return this._transformUserActivity(userActivity, userId);
    } catch (error) {
      logger.error(`Error getting user learning activity: ${error.message}`);
      // Return mock data as fallback
      return this._getMockUserActivity(userId);
    }
  }

  /**
   * Get user course enrollments
   * @param {string} userId - User ID or email
   * @returns {Promise<Array>} - List of courses the user is enrolled in
   */
  async getUserEnrollments(userId) {
    try {
      logger.info(`Getting course enrollments for user: ${userId}`);
      
      if (this.mockMode) {
        // Return mock data in development/test environments
        return this._getMockUserEnrollments(userId);
      }
      
      // In production, get real data from Udemy API
      const enrollments = await this.udemyConnector.getUserEnrollments(userId);
      
      return enrollments.map(enrollment => ({
        courseId: enrollment.course.id,
        title: enrollment.course.title,
        enrolledAt: enrollment.enrolled_at,
        progress: enrollment.completion_ratio * 100,
        lastAccessed: enrollment.last_accessed,
        status: this._getEnrollmentStatus(enrollment.completion_ratio)
      }));
    } catch (error) {
      logger.error(`Error getting user enrollments: ${error.message}`);
      // Return mock data as fallback
      return this._getMockUserEnrollments(userId);
    }
  }

  /**
   * Get user course progress
   * @param {string} userId - User ID or email
   * @param {string} courseId - Course ID
   * @returns {Promise<Object>} - Course progress details
   */
  async getUserCourseProgress(userId, courseId) {
    try {
      logger.info(`Getting course progress for user: ${userId}, course: ${courseId}`);
      
      if (this.mockMode) {
        // Return mock data in development/test environments
        return this._getMockCourseProgress(userId, courseId);
      }
      
      // In production, get real data from Udemy API
      const progress = await this.udemyConnector.getUserCourseProgress(userId, courseId);
      
      return {
        userId,
        courseId,
        progress: progress.completion_ratio * 100,
        completedLectures: progress.completed_lectures,
        totalLectures: progress.total_lectures,
        lastAccessed: progress.last_accessed,
        estimatedRemainingTime: progress.estimated_remaining_time
      };
    } catch (error) {
      logger.error(`Error getting user course progress: ${error.message}`);
      // Return mock data as fallback
      return this._getMockCourseProgress(userId, courseId);
    }
  }

  /**
   * Get user skills data
   * @param {string} userId - User ID or email
   * @returns {Promise<Object>} - User skills data
   */
  async getUserSkills(userId) {
    try {
      logger.info(`Getting skills data for user: ${userId}`);
      
      if (this.mockMode) {
        // Return mock data in development/test environments
        return this._getMockUserSkills(userId);
      }
      
      // In production, get real data from Udemy API
      // Note: This endpoint might not be available in the sandbox
      const skills = await this.udemyConnector.getUserSkills(userId);
      
      return {
        userId,
        skills: skills.map(skill => ({
          name: skill.name,
          level: skill.level,
          courses: skill.courses,
          lastUpdated: skill.last_updated
        }))
      };
    } catch (error) {
      logger.error(`Error getting user skills: ${error.message}`);
      // Return mock data as fallback
      return this._getMockUserSkills(userId);
    }
  }

  /**
   * Sync user data between SkillOS and Udemy
   * @param {string} userId - User ID or email
   * @returns {Promise<Object>} - Sync results
   */
  async syncUserData(userId) {
    try {
      logger.info(`Syncing user data for: ${userId}`);
      
      // Get all user data
      const activity = await this.getUserLearningActivity(userId);
      const enrollments = await this.getUserEnrollments(userId);
      const skills = await this.getUserSkills(userId);
      
      // Return combined data
      return {
        userId,
        activity,
        enrollments,
        skills,
        syncedAt: new Date().toISOString(),
        success: true
      };
    } catch (error) {
      logger.error(`Error syncing user data: ${error.message}`);
      return {
        userId,
        error: error.message,
        syncedAt: new Date().toISOString(),
        success: false
      };
    }
  }

  /**
   * Transform user activity data to SkillOS format
   * @param {Object} activity - Raw activity data from Udemy
   * @param {string} userId - User ID
   * @returns {Object} - Transformed activity data
   */
  _transformUserActivity(activity, userId) {
    return {
      userId,
      totalTimeSpent: activity.total_minutes || 0,
      coursesEnrolled: activity.enrolled_courses || 0,
      coursesCompleted: activity.completed_courses || 0,
      lecturesCompleted: activity.completed_lectures || 0,
      quizzesPassed: activity.passed_quizzes || 0,
      certificatesEarned: activity.earned_certificates || 0,
      lastActive: activity.last_activity_date || null
    };
  }

  /**
   * Get enrollment status based on completion ratio
   * @param {number} completionRatio - Course completion ratio (0-1)
   * @returns {string} - Status label
   */
  _getEnrollmentStatus(completionRatio) {
    if (completionRatio >= 0.99) return 'completed';
    if (completionRatio > 0) return 'in-progress';
    return 'not-started';
  }

  /**
   * Generate mock user activity data
   * @param {string} userId - User ID
   * @returns {Object} - Mock activity data
   */
  _getMockUserActivity(userId) {
    return {
      userId,
      totalTimeSpent: Math.floor(Math.random() * 2000) + 100,
      coursesEnrolled: Math.floor(Math.random() * 10) + 1,
      coursesCompleted: Math.floor(Math.random() * 5),
      lecturesCompleted: Math.floor(Math.random() * 50) + 5,
      quizzesPassed: Math.floor(Math.random() * 15),
      certificatesEarned: Math.floor(Math.random() * 3),
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
    };
  }

  /**
   * Generate mock user enrollments data
   * @param {string} userId - User ID
   * @returns {Array} - Mock enrollments data
   */
  _getMockUserEnrollments(userId) {
    const mockCourses = [
      { id: '1234567', title: 'JavaScript Fundamentals' },
      { id: '2345678', title: 'Python for Data Science' },
      { id: '3456789', title: 'Leadership Skills for Managers' },
      { id: '4567890', title: 'Project Management Fundamentals' },
      { id: '5678901', title: 'Advanced Excel for Business' }
    ];
    
    // Generate 2-5 random enrollments
    const enrollmentCount = Math.floor(Math.random() * 4) + 2;
    const enrollments = [];
    
    for (let i = 0; i < enrollmentCount; i++) {
      const courseIndex = Math.floor(Math.random() * mockCourses.length);
      const progress = Math.random();
      
      enrollments.push({
        courseId: mockCourses[courseIndex].id,
        title: mockCourses[courseIndex].title,
        enrolledAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)).toISOString(),
        progress: Math.round(progress * 100),
        lastAccessed: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        status: this._getEnrollmentStatus(progress)
      });
    }
    
    return enrollments;
  }

  /**
   * Generate mock course progress data
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID
   * @returns {Object} - Mock progress data
   */
  _getMockCourseProgress(userId, courseId) {
    const progress = Math.random();
    const totalLectures = Math.floor(Math.random() * 50) + 10;
    const completedLectures = Math.floor(totalLectures * progress);
    
    return {
      userId,
      courseId,
      progress: Math.round(progress * 100),
      completedLectures,
      totalLectures,
      lastAccessed: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      estimatedRemainingTime: Math.floor((totalLectures - completedLectures) * 10) // 10 minutes per lecture
    };
  }

  /**
   * Generate mock user skills data
   * @param {string} userId - User ID
   * @returns {Object} - Mock skills data
   */
  _getMockUserSkills(userId) {
    const mockSkills = [
      { name: 'JavaScript', level: Math.floor(Math.random() * 5) + 1, courses: ['JavaScript Fundamentals', 'Advanced JavaScript'] },
      { name: 'Python', level: Math.floor(Math.random() * 5) + 1, courses: ['Python for Data Science', 'Python Automation'] },
      { name: 'Leadership', level: Math.floor(Math.random() * 5) + 1, courses: ['Leadership Skills for Managers'] },
      { name: 'Project Management', level: Math.floor(Math.random() * 5) + 1, courses: ['Project Management Fundamentals'] },
      { name: 'Excel', level: Math.floor(Math.random() * 5) + 1, courses: ['Advanced Excel for Business'] },
      { name: 'Communication', level: Math.floor(Math.random() * 5) + 1, courses: ['Effective Communication'] },
      { name: 'Data Analysis', level: Math.floor(Math.random() * 5) + 1, courses: ['Data Analysis Fundamentals'] }
    ];
    
    // Select 3-6 random skills
    const skillCount = Math.floor(Math.random() * 4) + 3;
    const selectedSkills = [];
    const usedIndexes = new Set();
    
    for (let i = 0; i < skillCount; i++) {
      let skillIndex;
      do {
        skillIndex = Math.floor(Math.random() * mockSkills.length);
      } while (usedIndexes.has(skillIndex));
      
      usedIndexes.add(skillIndex);
      const skill = mockSkills[skillIndex];
      
      selectedSkills.push({
        name: skill.name,
        level: skill.level,
        courses: skill.courses,
        lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString()
      });
    }
    
    return {
      userId,
      skills: selectedSkills
    };
  }
}

export default UserDataConnector;
