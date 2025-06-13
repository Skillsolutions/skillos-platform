"use client";

/**
 * Udemy Business API Hooks for SkillOS
 */

import { useState, useEffect } from 'react';
import { UdemyClient, createUdemyClient } from './client';

// Initialize Udemy client with default configuration from environment variables
const udemyClient = createUdemyClient({
  clientId: process.env.NEXT_PUBLIC_UDEMY_CLIENT_ID || '',
  clientSecret: process.env.NEXT_PUBLIC_UDEMY_CLIENT_SECRET || '',
});

/**
 * Hook for fetching organization users from Udemy Business
 */
export function useUdemyUsers(params?: Record<string, any>) {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await udemyClient.getUsers(params);
        setUsers(response.results || []);
      } catch (err) {
        console.error('Error fetching Udemy users:', err);
        setError('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [params]);
  
  return { users, isLoading, error };
}

/**
 * Hook for fetching courses from Udemy Business
 */
export function useUdemyCourses(params?: Record<string, any>) {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await udemyClient.getCourses(params);
        setCourses(response.results || []);
      } catch (err) {
        console.error('Error fetching Udemy courses:', err);
        setError('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [params]);
  
  return { courses, isLoading, error };
}

/**
 * Hook for fetching a specific course from Udemy Business
 */
export function useUdemyCourse(courseId: string) {
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setCourse(null);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await udemyClient.getCourse(courseId);
        setCourse(response);
      } catch (err) {
        console.error(`Error fetching Udemy course ${courseId}:`, err);
        setError('Failed to load course');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);
  
  return { course, isLoading, error };
}

/**
 * Hook for fetching groups from Udemy Business
 */
export function useUdemyGroups(params?: Record<string, any>) {
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await udemyClient.getGroups(params);
        setGroups(response.results || []);
      } catch (err) {
        console.error('Error fetching Udemy groups:', err);
        setError('Failed to load groups');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroups();
  }, [params]);
  
  return { groups, isLoading, error };
}

/**
 * Hook for fetching enrollments from Udemy Business
 */
export function useUdemyEnrollments(params?: Record<string, any>) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await udemyClient.getEnrollments(params);
        setEnrollments(response.results || []);
      } catch (err) {
        console.error('Error fetching Udemy enrollments:', err);
        setError('Failed to load enrollments');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEnrollments();
  }, [params]);
  
  return { enrollments, isLoading, error };
}
