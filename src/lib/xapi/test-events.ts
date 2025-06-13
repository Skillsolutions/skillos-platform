/**
 * Test xAPI Events for SkillOS - Udemy Business Integration
 * 
 * This module provides functions to generate test xAPI events for development and testing.
 * These events simulate real Udemy Business learning activities.
 */

import { XAPIStatement, XAPIVerbs } from './types';

/**
 * Generate a test course completion event
 * 
 * @param options Configuration options for the event
 * @returns An xAPI statement representing a course completion
 */
export function generateCourseCompletionEvent(options: {
  userEmail: string;
  userName: string;
  organizationId: string;
  courseId: string;
  courseName: string;
  employeeId?: string;
  department?: string;
  jobTitle?: string;
}): XAPIStatement {
  const {
    userEmail,
    userName,
    organizationId,
    courseId,
    courseName,
    employeeId,
    department,
    jobTitle
  } = options;
  
  return {
    id: `completion-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
    actor: {
      objectType: 'Agent',
      name: userName,
      mbox: `mailto:${userEmail}`,
      extensions: {
        'https://skillsolutions.io/xapi/extensions/employee-id': employeeId,
        'https://skillsolutions.io/xapi/extensions/department': department,
        'https://skillsolutions.io/xapi/extensions/job-title': jobTitle,
        'https://skillsolutions.io/xapi/extensions/organization-id': organizationId
      }
    },
    verb: {
      id: XAPIVerbs.COMPLETED,
      display: {
        'en-US': 'completed'
      }
    },
    object: {
      objectType: 'Activity',
      id: courseId,
      definition: {
        name: {
          'en-US': courseName
        },
        type: 'http://adlnet.gov/expapi/activities/course'
      }
    },
    result: {
      completion: true,
      success: true,
      duration: 'PT2H30M15S', // 2 hours, 30 minutes, 15 seconds
      extensions: {
        'https://skillsolutions.io/xapi/extensions/progress': 100
      }
    },
    context: {
      platform: 'Udemy Business',
      extensions: {
        'https://skillsolutions.io/xapi/extensions/organization-id': organizationId
      }
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate a test course progress event
 * 
 * @param options Configuration options for the event
 * @returns An xAPI statement representing course progress
 */
export function generateCourseProgressEvent(options: {
  userEmail: string;
  userName: string;
  organizationId: string;
  courseId: string;
  courseName: string;
  progress: number; // 0-100
  employeeId?: string;
  department?: string;
  jobTitle?: string;
}): XAPIStatement {
  const {
    userEmail,
    userName,
    organizationId,
    courseId,
    courseName,
    progress,
    employeeId,
    department,
    jobTitle
  } = options;
  
  return {
    id: `progress-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
    actor: {
      objectType: 'Agent',
      name: userName,
      mbox: `mailto:${userEmail}`,
      extensions: {
        'https://skillsolutions.io/xapi/extensions/employee-id': employeeId,
        'https://skillsolutions.io/xapi/extensions/department': department,
        'https://skillsolutions.io/xapi/extensions/job-title': jobTitle,
        'https://skillsolutions.io/xapi/extensions/organization-id': organizationId
      }
    },
    verb: {
      id: XAPIVerbs.PROGRESSED,
      display: {
        'en-US': 'progressed'
      }
    },
    object: {
      objectType: 'Activity',
      id: courseId,
      definition: {
        name: {
          'en-US': courseName
        },
        type: 'http://adlnet.gov/expapi/activities/course'
      }
    },
    result: {
      completion: false,
      duration: 'PT45M20S', // 45 minutes, 20 seconds
      extensions: {
        'https://skillsolutions.io/xapi/extensions/progress': progress
      }
    },
    context: {
      platform: 'Udemy Business',
      extensions: {
        'https://skillsolutions.io/xapi/extensions/organization-id': organizationId
      }
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate a test course enrollment event
 * 
 * @param options Configuration options for the event
 * @returns An xAPI statement representing course enrollment
 */
export function generateCourseEnrollmentEvent(options: {
  userEmail: string;
  userName: string;
  organizationId: string;
  courseId: string;
  courseName: string;
  employeeId?: string;
  department?: string;
  jobTitle?: string;
}): XAPIStatement {
  const {
    userEmail,
    userName,
    organizationId,
    courseId,
    courseName,
    employeeId,
    department,
    jobTitle
  } = options;
  
  return {
    id: `enrollment-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
    actor: {
      objectType: 'Agent',
      name: userName,
      mbox: `mailto:${userEmail}`,
      extensions: {
        'https://skillsolutions.io/xapi/extensions/employee-id': employeeId,
        'https://skillsolutions.io/xapi/extensions/department': department,
        'https://skillsolutions.io/xapi/extensions/job-title': jobTitle,
        'https://skillsolutions.io/xapi/extensions/organization-id': organizationId
      }
    },
    verb: {
      id: XAPIVerbs.INITIALIZED,
      display: {
        'en-US': 'initialized'
      }
    },
    object: {
      objectType: 'Activity',
      id: courseId,
      definition: {
        name: {
          'en-US': courseName
        },
        type: 'http://adlnet.gov/expapi/activities/course'
      }
    },
    context: {
      platform: 'Udemy Business',
      extensions: {
        'https://skillsolutions.io/xapi/extensions/organization-id': organizationId
      }
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate a batch of test events for an organization
 * 
 * @param organizationId The organization ID
 * @param userCount Number of users to generate events for
 * @param courseCount Number of courses to generate events for
 * @returns Array of xAPI statements
 */
export function generateTestEventBatch(
  organizationId: string,
  userCount: number = 5,
  courseCount: number = 3
): XAPIStatement[] {
  const events: XAPIStatement[] = [];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const jobTitles = ['Manager', 'Director', 'Specialist', 'Analyst', 'Developer'];
  
  // Generate users
  const users = Array.from({ length: userCount }).map((_, i) => ({
    email: `user${i + 1}@example.com`,
    name: `Test User ${i + 1}`,
    employeeId: `EMP${1000 + i}`,
    department: departments[i % departments.length],
    jobTitle: jobTitles[i % jobTitles.length]
  }));
  
  // Generate courses
  const courses = Array.from({ length: courseCount }).map((_, i) => ({
    id: `course-${i + 1}`,
    name: `Test Course ${i + 1}`
  }));
  
  // Generate enrollments for all users in all courses
  users.forEach(user => {
    courses.forEach(course => {
      events.push(generateCourseEnrollmentEvent({
        userEmail: user.email,
        userName: user.name,
        organizationId,
        courseId: course.id,
        courseName: course.name,
        employeeId: user.employeeId,
        department: user.department,
        jobTitle: user.jobTitle
      }));
    });
  });
  
  // Generate progress events (50% of users, random progress)
  users.slice(0, Math.ceil(userCount / 2)).forEach(user => {
    courses.forEach(course => {
      const progress = Math.floor(Math.random() * 80) + 10; // 10-90%
      events.push(generateCourseProgressEvent({
        userEmail: user.email,
        userName: user.name,
        organizationId,
        courseId: course.id,
        courseName: course.name,
        progress,
        employeeId: user.employeeId,
        department: user.department,
        jobTitle: user.jobTitle
      }));
    });
  });
  
  // Generate completion events (25% of users)
  users.slice(0, Math.ceil(userCount / 4)).forEach(user => {
    courses.slice(0, Math.ceil(courseCount / 2)).forEach(course => {
      events.push(generateCourseCompletionEvent({
        userEmail: user.email,
        userName: user.name,
        organizationId,
        courseId: course.id,
        courseName: course.name,
        employeeId: user.employeeId,
        department: user.department,
        jobTitle: user.jobTitle
      }));
    });
  });
  
  return events;
}
