"use client";

/**
 * Udemy Business Auto-Discovery for SkillOS
 */

import { UdemyClient } from './client';

interface UdemyGroup {
  id: number;
  name: string;
  member_count: number;
}

interface UdemyCourse {
  id: number;
  title: string;
  url: string;
  image_480x270: string;
}

interface UdemyUser {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

export class UdemyAutoDiscovery {
  private client: UdemyClient;
  
  constructor(client: UdemyClient) {
    this.client = client;
  }
  
  /**
   * Run the auto-discovery process
   */
  async runDiscovery(): Promise<{
    organization: any;
    groups: UdemyGroup[];
    topCourses: UdemyCourse[];
    activeUsers: UdemyUser[];
  }> {
    try {
      // Step 1: Get organization information
      const orgInfo = await this.client.getOrganizationInfo();
      console.log(`📊 Organization: ${orgInfo.name} (${orgInfo.id})`);
      
      // Step 2: Discover all groups (future departments)
      const groups = await this.discoverGroups();
      console.log(`👥 Discovered ${groups.length} groups`);
      
      // Step 3: Discover top courses
      const topCourses = await this.discoverTopCourses();
      console.log(`📚 Discovered ${topCourses.length} top courses`);
      
      // Step 4: Discover active users
      const activeUsers = await this.discoverActiveUsers();
      console.log(`👤 Discovered ${activeUsers.length} active users`);
      
      return {
        organization: orgInfo,
        groups,
        topCourses,
        activeUsers
      };
    } catch (error) {
      console.error('Error during Udemy auto-discovery:', error);
      throw error;
    }
  }
  
  /**
   * Discover all groups in the organization
   */
  private async discoverGroups(): Promise<UdemyGroup[]> {
    try {
      const response = await this.client.getGroups({
        page_size: 100,
        ordering: '-member_count'
      });
      
      return response.results || [];
    } catch (error) {
      console.error('Error discovering groups:', error);
      return [];
    }
  }
  
  /**
   * Discover top courses in the organization
   */
  private async discoverTopCourses(): Promise<UdemyCourse[]> {
    try {
      const response = await this.client.getCourses({
        page_size: 20,
        ordering: '-num_enrollments'
      });
      
      return response.results || [];
    } catch (error) {
      console.error('Error discovering top courses:', error);
      return [];
    }
  }
  
  /**
   * Discover active users in the organization
   */
  private async discoverActiveUsers(): Promise<UdemyUser[]> {
    try {
      const response = await this.client.getUsers({
        page_size: 100,
        is_active: true
      });
      
      return response.results || [];
    } catch (error) {
      console.error('Error discovering active users:', error);
      return [];
    }
  }
}
