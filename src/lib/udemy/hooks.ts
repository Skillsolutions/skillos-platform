/**
 * Udemy Business API React Hooks
 * Custom hooks for integrating with Udemy Business API in SkillOS
 */

import { useState, useEffect, useCallback } from 'react';
import { UdemyUser, UdemyCourse, UdemyUserCourseActivity, UdemyLearningPath } from './types';
import { UdemyClient } from './client';

// Initialize Udemy client
const udemyClient = new UdemyClient();

/**
 * Hook for fetching organization users from Udemy Business
 */
export function useUdemyUsers() {
  const [users, setUsers] = useState<UdemyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await udemyClient.getOrganizationUsers();
      setUsers(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching Udemy users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}

/**
 * Hook for fetching organization courses from Udemy Business
 */
export function useUdemyCourses() {
  const [courses, setCourses] = useState<UdemyCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await udemyClient.getOrganizationCourses();
      setCourses(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      console.error('Error fetching Udemy courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
}

/**
 * Hook for fetching user course activities (learning progress)
 */
export function useUdemyUserActivities() {
  const [activities, setActivities] = useState<UdemyUserCourseActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await udemyClient.getUserCourseActivities();
      setActivities(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user activities');
      console.error('Error fetching Udemy user activities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, loading, error, refetch: fetchActivities };
}

/**
 * Hook for organization metrics derived from Udemy data
 */
export function useUdemyOrganizationMetrics() {
  const { users, loading: usersLoading } = useUdemyUsers();
  const { activities, loading: activitiesLoading } = useUdemyUserActivities();
  const { courses, loading: coursesLoading } = useUdemyCourses();

  const [metrics, setMetrics] = useState({
    totalHoursSpent: 0,
    totalCoursesCompleted: 0,
    totalActiveLearners: 0,
    completionRate: 0,
    averageRating: 0,
    totalCourses: 0
  });

  useEffect(() => {
    if (!usersLoading && !activitiesLoading && !coursesLoading) {
      // Calculate total hours spent
      const totalHours = activities.reduce((sum, activity) => {
        return sum + (activity.time_spent || 0);
      }, 0);

      // Calculate completed courses
      const completedCourses = activities.filter(activity => 
        activity.completion_ratio >= 1.0
      ).length;

      // Calculate active learners (users with activity in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeLearners = new Set(
        activities
          .filter(activity => new Date(activity.last_accessed_time) > thirtyDaysAgo)
          .map(activity => activity.user.id)
      ).size;

      // Calculate completion rate
      const totalEnrollments = activities.length;
      const completionRate = totalEnrollments > 0 
        ? (completedCourses / totalEnrollments) * 100 
        : 0;

      // Calculate average course rating
      const averageRating = courses.length > 0
        ? courses.reduce((sum, course) => sum + (course.avg_rating || 0), 0) / courses.length
        : 0;

      setMetrics({
        totalHoursSpent: Math.round(totalHours / 3600), // Convert seconds to hours
        totalCoursesCompleted: completedCourses,
        totalActiveLearners: activeLearners,
        completionRate: Math.round(completionRate * 10) / 10,
        averageRating: Math.round(averageRating * 10) / 10,
        totalCourses: courses.length
      });
    }
  }, [users, activities, courses, usersLoading, activitiesLoading, coursesLoading]);

  const loading = usersLoading || activitiesLoading || coursesLoading;

  return { metrics, loading };
}

/**
 * Hook for department-based analytics
 */
export function useUdemyDepartmentAnalytics() {
  const { users, loading: usersLoading } = useUdemyUsers();
  const { activities, loading: activitiesLoading } = useUdemyUserActivities();

  const [departmentStats, setDepartmentStats] = useState<Array<{
    name: string;
    headcount: number;
    activeLearners: number;
    hoursSpent: number;
    coursesCompleted: number;
    topSkill: string;
  }>>([]);

  useEffect(() => {
    if (!usersLoading && !activitiesLoading) {
      // Group users by department
      const departmentGroups = users.reduce((groups, user) => {
        const dept = user.department || 'General';
        if (!groups[dept]) {
          groups[dept] = [];
        }
        groups[dept].push(user);
        return groups;
      }, {} as Record<string, UdemyUser[]>);

      // Calculate stats for each department
      const stats = Object.entries(departmentGroups).map(([deptName, deptUsers]) => {
        const userIds = new Set(deptUsers.map(u => u.id));
        const deptActivities = activities.filter(a => userIds.has(a.user.id));

        const hoursSpent = deptActivities.reduce((sum, activity) => {
          return sum + (activity.time_spent || 0);
        }, 0);

        const coursesCompleted = deptActivities.filter(a => a.completion_ratio >= 1.0).length;

        const activeLearners = new Set(
          deptActivities
            .filter(a => {
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return new Date(a.last_accessed_time) > thirtyDaysAgo;
            })
            .map(a => a.user.id)
        ).size;

        // Determine top skill (simplified - could be enhanced)
        const topSkill = deptName === 'Engineering' ? 'JavaScript' :
                         deptName === 'Marketing' ? 'Digital Marketing' :
                         deptName === 'Sales' ? 'Communication' : 'General Skills';

        return {
          name: deptName,
          headcount: deptUsers.length,
          activeLearners,
          hoursSpent: Math.round(hoursSpent / 3600), // Convert to hours
          coursesCompleted,
          topSkill
        };
      });

      setDepartmentStats(stats);
    }
  }, [users, activities, usersLoading, activitiesLoading]);

  const loading = usersLoading || activitiesLoading;

  return { departmentStats, loading };
}

/**
 * Hook for top performing learners
 */
export function useUdemyTopLearners(limit: number = 10) {
  const { activities, loading: activitiesLoading } = useUdemyUserActivities();

  const [topLearners, setTopLearners] = useState<Array<{
    id: string;
    name: string;
    email: string;
    department: string;
    coursesCompleted: number;
    hoursSpent: number;
    lastActive: string;
  }>>([]);

  useEffect(() => {
    if (!activitiesLoading) {
      // Group activities by user
      const userStats = activities.reduce((stats, activity) => {
        const userId = activity.user.id.toString();
        if (!stats[userId]) {
          stats[userId] = {
            id: userId,
            name: activity.user.display_name,
            email: activity.user.email,
            department: activity.user.department || 'General',
            coursesCompleted: 0,
            hoursSpent: 0,
            lastActive: activity.last_accessed_time
          };
        }

        if (activity.completion_ratio >= 1.0) {
          stats[userId].coursesCompleted++;
        }
        stats[userId].hoursSpent += (activity.time_spent || 0);

        // Update last active time if this activity is more recent
        if (new Date(activity.last_accessed_time) > new Date(stats[userId].lastActive)) {
          stats[userId].lastActive = activity.last_accessed_time;
        }

        return stats;
      }, {} as Record<string, any>);

      // Convert to array and sort by courses completed, then by hours spent
      const sortedLearners = Object.values(userStats)
        .map(learner => ({
          ...learner,
          hoursSpent: Math.round(learner.hoursSpent / 3600) // Convert to hours
        }))
        .sort((a, b) => {
          if (b.coursesCompleted !== a.coursesCompleted) {
            return b.coursesCompleted - a.coursesCompleted;
          }
          return b.hoursSpent - a.hoursSpent;
        })
        .slice(0, limit);

      setTopLearners(sortedLearners);
    }
  }, [activities, activitiesLoading, limit]);

  const loading = activitiesLoading;

  return { topLearners, loading };
}

/**
 * Hook for course completion rates
 */
export function useUdemyCourseCompletionRates() {
  const { courses, loading: coursesLoading } = useUdemyCourses();
  const { activities, loading: activitiesLoading } = useUdemyUserActivities();

  const [completionRates, setCompletionRates] = useState<Array<{
    courseId: number;
    title: string;
    enrollments: number;
    completions: number;
    completionRate: number;
    averageRating: number;
  }>>([]);

  useEffect(() => {
    if (!coursesLoading && !activitiesLoading) {
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

      // Sort by completion rate descending
      const sortedRates = courseStats
        .sort((a, b) => b.completionRate - a.completionRate)
        .slice(0, 20); // Top 20 courses

      setCompletionRates(sortedRates);
    }
  }, [courses, activities, coursesLoading, activitiesLoading]);

  const loading = coursesLoading || activitiesLoading;

  return { completionRates, loading };
}

/**
 * Hook for popular courses (by enrollment)
 */
export function useUdemyPopularCourses(limit: number = 10) {
  const { courses, loading: coursesLoading } = useUdemyCourses();
  const { activities, loading: activitiesLoading } = useUdemyUserActivities();

  const [popularCourses, setPopularCourses] = useState<Array<{
    id: number;
    title: string;
    enrollments: number;
    averageRating: number;
    category: string;
    instructor: string;
  }>>([]);

  useEffect(() => {
    if (!coursesLoading && !activitiesLoading) {
      const courseEnrollments = activities.reduce((counts, activity) => {
        const courseId = activity.course.id;
        counts[courseId] = (counts[courseId] || 0) + 1;
        return counts;
      }, {} as Record<number, number>);

      const popular = courses
        .map(course => ({
          id: course.id,
          title: course.title,
          enrollments: courseEnrollments[course.id] || 0,
          averageRating: course.avg_rating || 0,
          category: course.primary_category?.title || 'Uncategorized',
          instructor: course.visible_instructors?.[0]?.display_name || 'Unknown'
        }))
        .sort((a, b) => b.enrollments - a.enrollments)
        .slice(0, limit);

      setPopularCourses(popular);
    }
  }, [courses, activities, coursesLoading, activitiesLoading, limit]);

  const loading = coursesLoading || activitiesLoading;

  return { popularCourses, loading };
}

