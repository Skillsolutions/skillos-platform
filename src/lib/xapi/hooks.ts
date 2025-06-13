/**
 * xAPI React Hooks for SkillOS - Udemy Business Integration
 * 
 * These hooks provide access to real-time learning data from xAPI events
 * for use in SkillOS platform components.
 */

import { useState, useEffect } from 'react';
import { 
  getOrganizationMetrics, 
  getTopLearners, 
  getTopCourses,
  getLearningEventsByOrganization,
  getLearningEventsByUser,
  getLearningEventsByCourse
} from './storage';
import { SkillOSLearningEvent } from './types';

/**
 * Hook to access organization-level learning metrics
 * 
 * @param organizationId The organization ID
 * @returns Object containing aggregated metrics for the organization
 */
export function useOrganizationMetrics(organizationId: string) {
  const [metrics, setMetrics] = useState(() => getOrganizationMetrics(organizationId));
  
  // In a real implementation, this would subscribe to real-time updates
  // For now, we'll just poll every few seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMetrics(getOrganizationMetrics(organizationId));
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [organizationId]);
  
  return metrics;
}

/**
 * Hook to access top learners for an organization
 * 
 * @param organizationId The organization ID
 * @param limit Maximum number of learners to return
 * @returns Array of top learners with completion counts
 */
export function useTopLearners(organizationId: string, limit: number = 10) {
  const [topLearners, setTopLearners] = useState(() => getTopLearners(organizationId, limit));
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTopLearners(getTopLearners(organizationId, limit));
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [organizationId, limit]);
  
  return topLearners;
}

/**
 * Hook to access top courses for an organization
 * 
 * @param organizationId The organization ID
 * @param metric 'enrollments' or 'completions'
 * @param limit Maximum number of courses to return
 * @returns Array of top courses with metrics
 */
export function useTopCourses(
  organizationId: string, 
  metric: 'enrollments' | 'completions' = 'enrollments',
  limit: number = 10
) {
  const [topCourses, setTopCourses] = useState(() => 
    getTopCourses(organizationId, metric, limit)
  );
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTopCourses(getTopCourses(organizationId, metric, limit));
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [organizationId, metric, limit]);
  
  return topCourses;
}

/**
 * Hook to access all learning events for an organization
 * 
 * @param organizationId The organization ID
 * @returns Array of learning events for the organization
 */
export function useLearningEvents(organizationId: string) {
  const [events, setEvents] = useState<SkillOSLearningEvent[]>(() => 
    getLearningEventsByOrganization(organizationId)
  );
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setEvents(getLearningEventsByOrganization(organizationId));
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [organizationId]);
  
  return events;
}

/**
 * Hook to access learning events for a specific user
 * 
 * @param organizationId The organization ID
 * @param userId The user ID
 * @returns Array of learning events for the user
 */
export function useUserLearningEvents(organizationId: string, userId: string) {
  const [events, setEvents] = useState<SkillOSLearningEvent[]>(() => 
    getLearningEventsByUser(organizationId, userId)
  );
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setEvents(getLearningEventsByUser(organizationId, userId));
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [organizationId, userId]);
  
  return events;
}

/**
 * Hook to access learning events for a specific course
 * 
 * @param organizationId The organization ID
 * @param courseId The course ID
 * @returns Array of learning events for the course
 */
export function useCourseLearningEvents(organizationId: string, courseId: string) {
  const [events, setEvents] = useState<SkillOSLearningEvent[]>(() => 
    getLearningEventsByCourse(organizationId, courseId)
  );
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setEvents(getLearningEventsByCourse(organizationId, courseId));
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [organizationId, courseId]);
  
  return events;
}

/**
 * Hook to access recent learning activity for an organization
 * 
 * @param organizationId The organization ID
 * @param limit Maximum number of events to return
 * @returns Array of recent learning events
 */
export function useRecentActivity(organizationId: string, limit: number = 20) {
  const [recentActivity, setRecentActivity] = useState<SkillOSLearningEvent[]>(() => {
    const events = getLearningEventsByOrganization(organizationId);
    return [...events]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  });
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const events = getLearningEventsByOrganization(organizationId);
      setRecentActivity([...events]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, limit)
      );
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [organizationId, limit]);
  
  return recentActivity;
}
