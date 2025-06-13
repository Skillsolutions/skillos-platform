/**
 * SkillOS Super Admin Types
 * Types for SkillOS team to manage customer organizations
 */

export interface SkillOSAdmin {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'support' | 'sales' | 'customer_success';
  permissions: SuperAdminPermissions;
  created_at: string;
  last_login: string;
}

export interface SuperAdminPermissions {
  canCreateOrganizations: boolean;
  canDeleteOrganizations: boolean;
  canViewBilling: boolean;
  canManageFeatureFlags: boolean;
  canAccessSupport: boolean;
  canViewAnalytics: boolean;
  canManageBetaProgram: boolean;
  canImpersonateUsers: boolean;
}

export interface OrganizationProvisioningRequest {
  // Company Information
  company_name: string;
  domain: string;
  industry?: string;
  company_size?: string;
  
  // Admin Contact
  admin_email: string;
  admin_name: string;
  admin_phone?: string;
  admin_job_title?: string;
  
  // Subscription Details
  subscription_tier: 'starter' | 'professional' | 'enterprise';
  billing_cycle: 'monthly' | 'yearly';
  seats_purchased: number;
  contract_value: number;
  start_date: string;
  end_date?: string;
  
  // Sales Information
  sales_rep: string;
  deal_source: 'website' | 'demo' | 'referral' | 'cold_outreach' | 'inbound';
  crm_deal_id?: string;
  
  // Special Requirements
  custom_branding: boolean;
  sso_integration: boolean;
  custom_domain: boolean;
  priority_support: boolean;
  notes?: string;
  
  // Udemy Integration (Optional)
  udemy_client_id?: string;
  udemy_client_secret?: string;
  udemy_organization_id?: string;
}

export interface CustomerOnboardingStatus {
  organization_id: string;
  status: 'pending' | 'invited' | 'setup_in_progress' | 'udemy_connected' | 'team_invited' | 'active' | 'churned';
  
  steps_completed: {
    organization_created: boolean;
    admin_invited: boolean;
    admin_logged_in: boolean;
    udemy_configured: boolean;
    first_sync_completed: boolean;
    team_members_invited: boolean;
    first_analytics_viewed: boolean;
  };
  
  metrics: {
    time_to_first_login: number; // hours
    time_to_udemy_connection: number; // hours
    time_to_first_value: number; // hours (first analytics view)
    team_adoption_rate: number; // percentage
  };
  
  created_at: string;
  activated_at?: string;
  last_activity: string;
  assigned_success_manager?: string;
}

export interface BetaApplication {
  id: string;
  company_name: string;
  domain: string;
  applicant_name: string;
  applicant_email: string;
  job_title: string;
  company_size: string;
  use_case: string;
  has_udemy_business: boolean;
  expected_users: number;
  
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  applied_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
  
  // If approved
  beta_organization_id?: string;
  trial_end_date?: string;
}

export interface BetaOrganization extends Organization {
  beta_status: {
    is_beta: true;
    trial_start_date: string;
    trial_end_date: string;
    trial_duration_days: number;
    seat_limit: number;
    feature_restrictions: {
      advanced_analytics: boolean;
      custom_branding: boolean;
      api_access: boolean;
      export_data: boolean;
    };
    conversion_target_date?: string;
    feedback_sessions_completed: number;
  };
}

export interface CustomerHealthScore {
  organization_id: string;
  score: number; // 0-100
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  
  factors: {
    usage_frequency: number; // 0-100
    feature_adoption: number; // 0-100
    team_engagement: number; // 0-100
    support_satisfaction: number; // 0-100
    billing_health: number; // 0-100
  };
  
  risk_indicators: string[];
  recommended_actions: string[];
  last_calculated: string;
}

export interface ProvisioningTask {
  id: string;
  type: 'new_customer' | 'beta_approval' | 'plan_upgrade' | 'custom_setup';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  organization_data: OrganizationProvisioningRequest;
  assigned_to?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  
  created_at: string;
  due_date?: string;
  completed_at?: string;
  notes?: string;
}

export interface CustomerSupportTicket {
  id: string;
  organization_id: string;
  user_id?: string;
  
  subject: string;
  description: string;
  category: 'technical' | 'billing' | 'onboarding' | 'feature_request' | 'bug_report';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  
  messages: Array<{
    id: string;
    sender_type: 'customer' | 'support';
    sender_name: string;
    message: string;
    timestamp: string;
    attachments?: string[];
  }>;
}

// API Request/Response Types
export interface CreateOrganizationResponse {
  success: boolean;
  organization_id: string;
  admin_invitation_token: string;
  activation_link: string;
  message: string;
}

export interface BetaApprovalRequest {
  application_id: string;
  trial_duration_days: number;
  seat_limit: number;
  feature_flags: {
    advanced_analytics: boolean;
    custom_branding: boolean;
    api_access: boolean;
  };
  admin_notes?: string;
}

export interface CustomerAnalytics {
  total_organizations: number;
  active_organizations: number;
  beta_organizations: number;
  churned_organizations: number;
  
  onboarding_metrics: {
    average_time_to_activation: number; // hours
    completion_rate: number; // percentage
    common_blockers: Array<{
      issue: string;
      frequency: number;
    }>;
  };
  
  health_distribution: {
    healthy: number;
    at_risk: number;
    critical: number;
  };
  
  revenue_metrics: {
    mrr: number;
    arr: number;
    churn_rate: number;
    expansion_revenue: number;
  };
}

