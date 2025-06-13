/**
 * Organization-Aware Udemy Hooks
 * React hooks that use organization context for Udemy Business API calls
 */

import { useState, useEffect, useCallback } from 'react';
import { useOrganization } from '@/lib/organization/auth';
import { createOrganizationUdemyClient } from '@/lib/organization/udemy-client';
import { UdemyUser, UdemyCourse, UdemyUserCourseActivity } from '@/lib/udemy/types';

/**
 * Hook for organization-specific Udemy users
 */
export function useOrganizationUdemyUsers() {
  const { organization } = useOrganization();
  const [users, setUsers] = useState<UdemyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!organization) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const client = createOrganizationUdemyClient(organization);
      const organizationUsers = await client.getOrganizationUsersWithDepartments();
      setUsers(organizationUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching organization Udemy users:', err);
    } finally {
      setLoading(false);
    }
  }, [organization]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

/**
 * Hook for organization-specific Udemy courses
 */
export function useOrganizationUdemyCourses() {
  const { organization } = useOrganization();
  const [courses, setCourses] = useState<UdemyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!organization) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const client = createOrganizationUdemyClient(organization);
      const organizationCourses = await client.getAllCourses();
      setCourses(organizationCourses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      console.error('Error fetching organization Udemy courses:', err);
    } finally {
      setLoading(false);
    }
  }, [organization]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
}

/**
 * Hook for organization-specific learning analytics
 */
export function useOrganizationLearningAnalytics() {
  const { organization } = useOrganization();
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalActivities: 0,
    completionRate: 0,
    totalHoursSpent: 0,
    activeLearners: 0,
    departmentBreakdown: [] as Array<{
      department: string;
      userCount: number;
      completedCourses: number;
      hoursSpent: number;
    }>
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!organization) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const client = createOrganizationUdemyClient(organization);
      const analyticsData = await client.getOrganizationLearningAnalytics();
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      console.error('Error fetching organization learning analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [organization]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
}

/**
 * Hook for organization Udemy integration status
 */
export function useOrganizationUdemyIntegration() {
  const { organization } = useOrganization();
  const [integrationStatus, setIntegrationStatus] = useState({
    enabled: false,
    connected: false,
    lastSync: null as string | null,
    canAccessUsers: false,
    canAccessCourses: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const testConnection = useCallback(async () => {
    if (!organization) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const client = createOrganizationUdemyClient(organization);
      const testResult = await client.testOrganizationConnection();
      
      setIntegrationStatus({
        enabled: client.isIntegrationEnabled(),
        connected: testResult.success,
        lastSync: organization.udemy_config.last_sync || null,
        canAccessUsers: testResult.organizationInfo?.canAccessUsers || false,
        canAccessCourses: testResult.organizationInfo?.canAccessCourses || false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test integration');
      console.error('Error testing organization Udemy integration:', err);
    } finally {
      setLoading(false);
    }
  }, [organization]);

  const syncData = useCallback(async () => {
    if (!organization) {
      throw new Error('No organization context');
    }

    try {
      setLoading(true);
      setError(null);
      
      const client = createOrganizationUdemyClient(organization);
      const syncResult = await client.syncOrganizationData();
      
      if (syncResult.success) {
        // Update last sync time
        setIntegrationStatus(prev => ({
          ...prev,
          lastSync: new Date().toISOString()
        }));
      }
      
      return syncResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sync failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [organization]);

  useEffect(() => {
    testConnection();
  }, [testConnection]);

  return { 
    integrationStatus, 
    loading, 
    error, 
    testConnection, 
    syncData 
  };
}

/**
 * Hook for organization-specific top learners
 */
export function useOrganizationTopLearners(limit: number = 10) {
  const { organization } = useOrganization();
  const [topLearners, setTopLearners] = useState<Array<{
    id: string;
    name: string;
    email: string;
    department: string;
    coursesCompleted: number;
    hoursSpent: number;
    lastActive: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopLearners = useCallback(async () => {
    if (!organization) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const client = createOrganizationUdemyClient(organization);
      const activities = await client.getAllUserActivities();
      
      // Process activities to get top learners
      const userStats = activities.reduce((stats, activity) => {
        const userId = activity.user.id.toString();
        if (!stats[userId]) {
          stats[userId] = {
            id: userId,
            name: activity.user.display_name,
            email: activity.user.email,
            department: activity.user.department || organization.settings.default_department,
            coursesCompleted: 0,
            hoursSpent: 0,
            lastActive: activity.last_accessed_time
          };
        }

        if (activity.completion_ratio >= 1.0) {
          stats[userId].coursesCompleted++;
        }
        stats[userId].hoursSpent += (activity.time_spent || 0);

        if (new Date(activity.last_accessed_time) > new Date(stats[userId].lastActive)) {
          stats[userId].lastActive = activity.last_accessed_time;
        }

        return stats;
      }, {} as Record<string, any>);

      const sortedLearners = Object.values(userStats)
        .map(learner => ({
          ...learner,
          hoursSpent: Math.round(learner.hoursSpent / 3600)
        }))
        .sort((a, b) => {
          if (b.coursesCompleted !== a.coursesCompleted) {
            return b.coursesCompleted - a.coursesCompleted;
          }
          return b.hoursSpent - a.hoursSpent;
        })
        .slice(0, limit);

      setTopLearners(sortedLearners);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch top learners');
      console.error('Error fetching organization top learners:', err);
    } finally {
      setLoading(false);
    }
  }, [organization, limit]);

  useEffect(() => {
    fetchTopLearners();
  }, [fetchTopLearners]);

  return { topLearners, loading, error, refetch: fetchTopLearners };
}

/**
 * Hook for organization-specific course completion rates
 */
export function useOrganizationCourseCompletionRates() {
  const { organization } = useOrganization();
  const [completionRates, setCompletionRates] = useState<Array<{
    courseId: number;
    title: string;
    enrollments: number;
    completions: number;
    completionRate: number;
    averageRating: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompletionRates = useCallback(async () => {
    if (!organization) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const client = createOrganizationUdemyClient(organization);
      const [courses, activities] = await Promise.all([
        client.getAllCourses(),
        client.getAllUserActivities()
      ]);

      const courseStats = courses.map(course => {
        const courseActivities = activities.filter(a => a.course.id === course.id);
        const enrollments = courseActivities.length;
        const completions = courseActivities.filter(a => a.completion_ratio >= 1.0).length;
        const completionRate = enrollments > 0 ? (completions / enrollments) * 100 : 0;

        return {
          courseId: course.id,
          title: course.title,
          enrollments,
          completions,
          completionRate: Math.round(completionRate * 10) / 10,
          averageRating: course.avg_rating || 0
        };
      });

      const sortedRates = courseStats
        .sort((a, b) => b.completionRate - a.completionRate)
        .slice(0, 20);

      setCompletionRates(sortedRates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch completion rates');
      console.error('Error fetching organization course completion rates:', err);
    } finally {
      setLoading(false);
    }
  }, [organization]);

  useEffect(() => {
    fetchCompletionRates();
  }, [fetchCompletionRates]);

  return { completionRates, loading, error, refetch: fetchCompletionRates };
}

