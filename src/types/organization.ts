export interface Organization {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Udemy-specific properties
  udemyClientId?: string;
  udemyClientSecret?: string;
  udemyOrganizationId?: string;
  udemyApiUrl?: string;
}

export interface OrganizationDetectionResult {
  organization: Organization | null;
  domain: string;
  email: string;
  matched: boolean;
}

export interface OrganizationUser {
  id: string;
  organizationId: string;
  userId: string;
  email: string;
  role: 'admin' | 'user';
  department?: string;
  jobTitle?: string;
  employeeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Context type for organization context
export interface OrganizationContextType {
  organization: Organization | null;
  user: OrganizationUser | null;
  isLoading: boolean;
  error: string | null;
  setOrganization: (org: Organization | null) => void;
  setUser: (user: OrganizationUser | null) => void;
}
