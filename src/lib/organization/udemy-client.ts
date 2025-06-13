"use client";

/**
 * Organization-specific Udemy Business API Client for SkillOS
 */

import { Organization } from '@/types/organization';
import { UdemyClient, UdemyClientConfig } from '@/lib/udemy/client';

export class OrganizationUdemyClient extends UdemyClient {
  private organization: Organization;

  constructor(organization: Organization) {
    // Initialize parent with organization-specific credentials
    const config: UdemyClientConfig = {
      clientId: organization.udemyClientId || process.env.UDEMY_CLIENT_ID || '',
      clientSecret: organization.udemyClientSecret || process.env.UDEMY_CLIENT_SECRET || '',
      organizationId: organization.udemyOrganizationId,
      baseUrl: organization.udemyApiUrl || 'https://api.udemy.com/organizations'
    };
    
    super(config );
    this.organization = organization;
  }

  /**
   * Get courses specific to this organization
   */
  async getOrganizationCourses(params?: Record<string, any>): Promise<any> {
    return this.getCourses(params);
  }

  /**
   * Get users specific to this organization
   */
  async getOrganizationUsers(params?: Record<string, any>): Promise<any> {
    return this.getUsers(params);
  }

  /**
   * Get organization-specific analytics
   */
  async getOrganizationAnalytics(params?: Record<string, any>): Promise<any> {
    return this.get('/analytics/', params);
  }
}

/**
 * Create a new organization-specific Udemy Business API client
 */
export function createOrganizationUdemyClient(organization: Organization): OrganizationUdemyClient {
  return new OrganizationUdemyClient(organization);
}
