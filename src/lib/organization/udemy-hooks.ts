"use client";

/**
 * Organization-specific Udemy Business API Hooks for SkillOS
 */

import { useState, useEffect } from 'react';
import { Organization } from '@/types/organization';
import { createOrganizationUdemyClient } from './udemy-client';

/**
 * Hook to fetch courses from Udemy Business for an organization
 */
export function useOrganizationCourses(organization: Organization, params?: Record<string, any>) {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!organization) {
        setCourses([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const client = createOrganizationUdemyClient(organization);
        const response = await client.getOrganizationCourses(params);
        
        setCourses(response.results || []);
      } catch (err) {
        console.error('Error fetching organization courses:', err);
        setError('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [organization, params]);
  
  return { courses, isLoading, error };
}

/**
 * Hook to fetch users from Udemy Business for an organization
 */
export function useOrganizationUsers(organization: Organization, params?: Record<string, any>) {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!organization) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const client = createOrganizationUdemyClient(organization);
        // Changed from getOrganizationUsersWithDepartments to getOrganizationUsers
        const response = await client.getOrganizationUsers(params);
        
        setUsers(response.results || []);
      } catch (err) {
        console.error('Error fetching organization users:', err);
        setError('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [organization, params]);
  
  return { users, isLoading, error };
}

/**
 * Hook to fetch analytics from Udemy Business for an organization
 */
export function useOrganizationAnalytics(organization: Organization, params?: Record<string, any>) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!organization) {
        setAnalytics(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const client = createOrganizationUdemyClient(organization);
        const response = await client.getOrganizationAnalytics(params);
        
        setAnalytics(response);
      } catch (err) {
        console.error('Error fetching organization analytics:', err);
        setError('Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [organization, params]);
  
  return { analytics, isLoading, error };
}
