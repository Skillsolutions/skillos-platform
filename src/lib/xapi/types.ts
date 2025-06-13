/**
 * xAPI Types for SkillOS
 */

// Basic xAPI Statement structure
export interface XAPIStatement {
  id?: string;
  actor: {
    objectType: string;
    name?: string;
    mbox?: string;
    account?: {
      name: string;
      homePage: string;
    };
  };
  verb: {
    id: string;
    display: {
      [key: string]: string;
    };
  };
  object: {
    id: string;
    objectType?: string;
    definition?: {
      name?: {
        [key: string]: string;
      };
      description?: {
        [key: string]: string;
      };
      type?: string;
    };
  };
  result?: {
    score?: {
      scaled?: number;
      raw?: number;
      min?: number;
      max?: number;
    };
    success?: boolean;
    completion?: boolean;
    duration?: string;
    response?: string;
    extensions?: {
      [key: string]: any;
    };
  };
  context?: {
    registration?: string;
    instructor?: {
      objectType: string;
      name?: string;
      mbox?: string;
    };
    team?: {
      objectType: string;
      name?: string;
      mbox?: string;
    };
    contextActivities?: {
      parent?: any[];
      grouping?: any[];
      category?: any[];
      other?: any[];
    };
    platform?: string;
    language?: string;
    statement?: {
      objectType: string;
      id: string;
    };
    extensions?: {
      [key: string]: any;
    };
  };
  timestamp?: string;
  stored?: string;
  authority?: {
    objectType: string;
    name?: string;
    mbox?: string;
  };
  version?: string;
  attachments?: any[];
}

// OAuth Token Request
export interface OAuthTokenRequest {
  grant_type: string;
  client_id: string;
  client_secret: string;
  scope?: string;
}

// OAuth Token Response
export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

// Processed xAPI Event
export interface XAPIEvent {
  id: string;
  organizationId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  courseId: string;
  courseName?: string;
  eventType: 'enrollment' | 'progress' | 'completion' | 'interaction';
  timestamp: Date;
  data: any;
  department?: string;
  employeeId?: string;
}

// Organization Metrics
export interface XAPIMetrics {
  totalEvents: number;
  uniqueUsers: number;
  uniqueCourses: number;
  completions: number;
  enrollments: number;
  totalDuration: number;
  byDepartment: {
    [department: string]: {
      events: number;
      completions: number;
      users: number;
    };
  };
}

// Top Learner
export interface XAPITopLearner {
  userId: string;
  userName?: string;
  userEmail?: string;
  department?: string;
  completions: number;
  enrollments: number;
  totalDuration: number;
}
