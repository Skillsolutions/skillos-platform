"use client";

/**
 * Organization Detection Service for SkillOS
 */

import { Organization, OrganizationDetectionResult } from '@/types/organization';

export class OrganizationDetectionService {
  /**
   * Detect organization based on domain or session
   */
  async detectOrganization(): Promise<OrganizationDetectionResult> {
    try {
      // First check if we have an organization in the session
      const sessionOrg = await this.getOrganizationFromSession();
      if (sessionOrg) {
        return {
          organization: sessionOrg,
          domain: sessionOrg.domain,
          email: '',
          matched: true
        };
      }

      // If no organization in session, detect from domain
      const domain = this.getCurrentDomain();
      const email = this.getCurrentUserEmail();

      // Call API to detect organization
      const response = await fetch(`/api/organizations/detect?domain=${domain}&email=${email}`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          organization: data.organization,
          domain,
          email,
          matched: !!data.organization
        };
      }

      return {
        organization: null,
        domain,
        email,
        matched: false
      };
    } catch (error) {
      console.error('Error detecting organization:', error);
      return {
        organization: null,
        domain: this.getCurrentDomain(),
        email: this.getCurrentUserEmail(),
        matched: false
      };
    }
  }

  /**
   * Get organization from session
   */
  private async getOrganizationFromSession(): Promise<Organization | null> {
    try {
      const response = await fetch('/api/organizations/current');
      if (response.ok) {
        const data = await response.json();
        return data.organization;
      }
      return null;
    } catch (error) {
      console.error('Error getting organization from session:', error);
      return null;
    }
  }

  /**
   * Get current domain
   */
  private getCurrentDomain(): string {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      // Skip localhost and IP addresses
      if (hostname === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
        return '';
      }
      
      // Extract domain from hostname
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
      }
      
      return hostname;
    }
    return '';
  }

  /**
   * Get current user email
   */
  private getCurrentUserEmail(): string {
    // This would typically come from your auth system
    // For now, return empty string or mock value
    return '';
  }
}
