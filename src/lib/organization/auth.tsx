"use client";

/**
 * Organization Authentication Context for SkillOS
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Organization, OrganizationUser, OrganizationContextType } from '@/types/organization';
import { OrganizationDetectionService } from './detection';

// Create the context
const OrganizationContext = createContext<OrganizationContextType>({
  organization: null,
  user: null,
  isLoading: true,
  error: null,
  setOrganization: () => {},
  setUser: () => {}
});

// Provider props
interface OrganizationProviderProps {
  children: ReactNode;
}

/**
 * Organization Provider Component
 */
export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [user, setUser] = useState<OrganizationUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Detect organization on mount
  useEffect(() => {
    const detectOrganization = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get organization from session or detect from domain
        const detectionService = new OrganizationDetectionService();
        const result = await detectionService.detectOrganization();

        if (result.matched && result.organization) {
          setOrganization(result.organization);
          
          // Get user information if organization is detected
          try {
            const userResponse = await fetch(`/api/organizations/${result.organization.id}/me`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUser(userData);
            }
          } catch (userError) {
            console.error('Failed to fetch user information:', userError);
          }
        } else {
          setError('Organization not found');
        }
      } catch (err) {
        console.error('Error detecting organization:', err);
        setError('Failed to detect organization');
      } finally {
        setIsLoading(false);
      }
    };

    detectOrganization();
  }, []);

  /**
   * Switch to a different organization
   */
  const switchOrganization = async (orgId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call API to switch organization
      const response = await fetch(`/api/organizations/${orgId}/switch`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setOrganization(data.organization);
        setUser(data.user);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to switch organization');
      }
    } catch (err) {
      console.error('Error switching organization:', err);
      setError('Failed to switch organization');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update organization details
   */
  const updateOrganization = async (orgData: Partial<Organization>) => {
    if (!organization) {
      setError('No organization selected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call API to update organization
      const response = await fetch(`/api/organizations/${organization.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orgData),
      });

      if (response.ok) {
        const updatedOrg = await response.json();
        setOrganization(updatedOrg);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update organization');
      }
    } catch (err) {
      console.error('Error updating organization:', err);
      setError('Failed to update organization');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update user details
   */
  const updateUser = async (userData: Partial<OrganizationUser>) => {
    if (!user) {
      setError('No user logged in');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call API to update user
      const response = await fetch(`/api/organizations/${organization?.id}/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Invite a user to the organization
   */
  const inviteUser = async (email: string, role: 'admin' | 'user' = 'user') => {
    if (!organization) {
      setError('No organization selected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call API to invite user
      const response = await fetch(`/api/organizations/${organization.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to invite user');
      }

      return response.ok;
    } catch (err) {
      console.error('Error inviting user:', err);
      setError('Failed to invite user');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove a user from the organization
   */
  const removeUser = async (userId: string) => {
    if (!organization) {
      setError('No organization selected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call API to remove user
      const response = await fetch(`/api/organizations/${organization.id}/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to remove user');
      }

      return response.ok;
    } catch (err) {
      console.error('Error removing user:', err);
      setError('Failed to remove user');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has admin role
  const isAdmin = user?.role === 'admin';

  // Check if user has specific permission
  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // TODO: Implement more granular permission checks if needed
    return false;
  };

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        user,
        isLoading,
        error,
        setOrganization,
        setUser
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

/**
 * Hook to use the organization context
 */
export const useOrganization = () => useContext(OrganizationContext);

/**
 * Hook to check if user is authenticated in an organization
 */
export const useOrganizationAuth = () => {
  const { organization, user, isLoading, error } = useOrganization();
  
  return {
    isAuthenticated: !!organization && !!user,
    isLoading,
    organization,
    user,
    error
  };
};

/**
 * Higher-order component to require organization authentication
 */
export function withOrganizationAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useOrganizationAuth();
    
    if (isLoading) {
      return <div>Loading organization...</div>;
    }
    
    if (!isAuthenticated) {
      // Redirect to login or show access denied
      return <div>Organization access required</div>;
    }
    
    return <Component {...props} />;
  };
}
