"use client";

/**
 * xAPI Storage for SkillOS
 */

import { XAPIEvent, XAPIMetrics, XAPITopLearner } from './types';

// In-memory storage for development
// In production, this would be replaced with a database
const eventStorage: XAPIEvent[] = [];

/**
 * Store a learning event
 */
export function storeLearningEvent(event: XAPIEvent): XAPIEvent {
  eventStorage.push(event);
  return event;
}

/**
 * Store multiple learning events
 */
export function storeLearningEvents(events: XAPIEvent[]): XAPIEvent[] {
  events.forEach(event => eventStorage.push(event));
  return events;
}

/**
 * Get all learning events for an organization
 */
export function getOrganizationEvents(organizationId: string): XAPIEvent[] {
  return eventStorage.filter(event => event.organizationId === organizationId);
}

/**
 * Get organization metrics
 */
export function getOrganizationMetrics(organizationId: string): XAPIMetrics {
  const events = getOrganizationEvents(organizationId);
  
  // Calculate metrics
  const uniqueUserIds = new Set(events.map(event => event.userId));
  const uniqueCourseIds = new Set(events.map(event => event.courseId));
  
  const completions = events.filter(event => event.eventType === 'completion').length;
  const enrollments = events.filter(event => event.eventType === 'enrollment').length;
  
  // Calculate total duration (if available in event data)
  let totalDuration = 0;
  events.forEach(event => {
    const durationStr = event.data?.result?.duration;
    if (durationStr) {
      totalDuration += parseDuration(durationStr);
    }
  });
  
  // Calculate department metrics
  const byDepartment: XAPIMetrics['byDepartment'] = {};
  
  events.forEach(event => {
    const department = event.department || 'Uncategorized';
    
    if (!byDepartment[department]) {
      byDepartment[department] = {
        events: 0,
        completions: 0,
        users: 0
      };
    }
    
    byDepartment[department].events++;
    
    if (event.eventType === 'completion') {
      byDepartment[department].completions++;
    }
  });
  
  // Count unique users per department
  const userDepartments = new Map<string, Set<string>>();
  
  events.forEach(event => {
    const department = event.department || 'Uncategorized';
    
    if (!userDepartments.has(department)) {
      userDepartments.set(department, new Set());
    }
    
    userDepartments.get(department)?.add(event.userId);
  });
  
  userDepartments.forEach((users, department) => {
    byDepartment[department].users = users.size;
  });
  
  return {
    totalEvents: events.length,
    uniqueUsers: uniqueUserIds.size,
    uniqueCourses: uniqueCourseIds.size,
    completions,
    enrollments,
    totalDuration,
    byDepartment
  };
}

/**
 * Get top learners for an organization
 */
export function getTopLearners(organizationId: string, limit: number = 5): XAPITopLearner[] {
  const events = getOrganizationEvents(organizationId);
  
  // Group events by user
  const userEvents = new Map<string, XAPIEvent[]>();
  
  events.forEach(event => {
    if (!userEvents.has(event.userId)) {
      userEvents.set(event.userId, []);
    }
    
    userEvents.get(event.userId)?.push(event);
  });
  
  // Calculate metrics for each user
  const learners: XAPITopLearner[] = [];
  
  userEvents.forEach((userEventList, userId) => {
    const firstEvent = userEventList[0];
    
    const completions = userEventList.filter(event => event.eventType === 'completion').length;
    const enrollments = userEventList.filter(event => event.eventType === 'enrollment').length;
    
    // Calculate total duration
    let totalDuration = 0;
    userEventList.forEach(event => {
      const durationStr = event.data?.result?.duration;
      if (durationStr) {
        totalDuration += parseDuration(durationStr);
      }
    });
    
    learners.push({
      userId,
      userName: firstEvent.userName,
      userEmail: firstEvent.userEmail,
      department: firstEvent.department,
      completions,
      enrollments,
      totalDuration
    });
  });
  
  // Sort by completions (descending)
  learners.sort((a, b) => b.completions - a.completions);
  
  // Return top N learners
  return learners.slice(0, limit);
}

/**
 * Get recent activity for an organization
 */
export function getRecentActivity(organizationId: string, limit: number = 10): XAPIEvent[] {
  const events = getOrganizationEvents(organizationId);
  
  // Sort by timestamp (descending)
  events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  // Return most recent events
  return events.slice(0, limit);
}

/**
 * Parse ISO 8601 duration string to seconds
 */
function parseDuration(durationStr: string): number {
  // Simple implementation for common formats
  // PT1H30M15S = 1 hour, 30 minutes, 15 seconds
  
  let seconds = 0;
  
  // Hours
  const hourMatch = durationStr.match(/(\d+)H/);
  if (hourMatch) {
    seconds += parseInt(hourMatch[1]) * 3600;
  }
  
  // Minutes
  const minuteMatch = durationStr.match(/(\d+)M/);
  if (minuteMatch && !durationStr.includes('T')) {
    // If no T, this is months not minutes
    seconds += parseInt(minuteMatch[1]) * 2592000; // Approximate seconds in a month
  } else if (minuteMatch) {
    seconds += parseInt(minuteMatch[1]) * 60;
  }
  
  // Seconds
  const secondMatch = durationStr.match(/(\d+)S/);
  if (secondMatch) {
    seconds += parseInt(secondMatch[1]);
  }
  
  return seconds;
}

/**
 * Clear all events (for testing)
 */
export function clearAllEvents(): void {
  eventStorage.length = 0;
}
