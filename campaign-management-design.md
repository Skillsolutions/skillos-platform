# Campaign Management Design for SkillOS Engagement Planner

## Overview
This document outlines the design for adding campaign management capabilities to the SkillOS Engagement Planner, allowing administrators to create, manage, and track learning campaigns across the organization.

## Key Features

### 1. Campaign Creation
- **Campaign Types**:
  - Learning Challenges
  - Skill Development Programs
  - Seasonal/Holiday Campaigns
  - Special Events (e.g., Company Milestones)
  - Onboarding Campaigns

- **Campaign Components**:
  - Title and Description
  - Start and End Dates
  - Goals and Objectives
  - Required Courses/Activities
  - Rewards and Recognition
  - Progress Tracking Metrics

### 2. Audience Selection
- **Targeting Options**:
  - Individual Employees
  - Teams/Departments
  - Skill Levels/Roles
  - Entire Organization
  - Custom Groups

- **Filtering Capabilities**:
  - By Location
  - By Tenure
  - By Previous Engagement
  - By Skill Gaps

### 3. Pre-made Campaign Templates
- **Seasonal Templates**:
  - New Year Learning Resolutions
  - Women's Day Leadership Skills
  - Ramadan Reflection and Growth
  - Q3 Learning Sprint

- **Thematic Templates**:
  - Technical Skills Bootcamp
  - Leadership Development
  - Digital Transformation
  - Diversity and Inclusion

### 4. Campaign Dashboard
- **Admin View**:
  - Campaign Overview
  - Participation Metrics
  - Completion Rates
  - Engagement Analytics
  - Leaderboards

- **Participant View**:
  - Active Campaigns
  - Personal Progress
  - Rewards Status
  - Peer Comparison

## UI Components

### Campaign Management Tab
- Campaign creation button
- List of active/draft/completed campaigns
- Campaign search and filtering
- Campaign analytics summary

### Campaign Creation Wizard
1. **Basic Information**:
   - Campaign name, description, dates
   - Campaign type selection
   - Template selection (optional)

2. **Content Selection**:
   - Courses/activities to include
   - Learning objectives
   - Required vs. optional content

3. **Audience Selection**:
   - Target audience configuration
   - Inclusion/exclusion rules
   - Notification preferences

4. **Rewards Configuration**:
   - Points/badges system
   - Certificates
   - Physical/digital rewards
   - Recognition methods

5. **Review and Launch**:
   - Campaign summary
   - Preview for different audience segments
   - Schedule or immediate launch options

## Data Model

### Campaign Entity
```
{
  id: string,
  title: string,
  description: string,
  type: string,
  startDate: Date,
  endDate: Date,
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'archived',
  createdBy: string,
  createdAt: Date,
  updatedAt: Date,
  content: {
    courses: Array<CourseReference>,
    activities: Array<ActivityReference>,
    resources: Array<ResourceReference>
  },
  audience: {
    targetType: 'individual' | 'team' | 'department' | 'organization' | 'custom',
    targets: Array<TargetReference>,
    filters: Object
  },
  rewards: {
    points: number,
    badges: Array<BadgeReference>,
    certificates: Array<CertificateReference>,
    otherRewards: Array<RewardReference>
  },
  metrics: {
    participationRate: number,
    completionRate: number,
    engagementScore: number,
    // Other analytics
  }
}
```

## Implementation Approach

1. Add a new "Campaigns" tab to the Engagement Planner
2. Create campaign creation wizard components
3. Implement audience selection functionality
4. Add pre-made campaign templates
5. Develop campaign analytics dashboard
6. Integrate with existing notification system

## User Flows

### Admin Creates New Campaign
1. Admin navigates to Engagement Planner
2. Selects "Campaigns" tab
3. Clicks "Create Campaign" button
4. Chooses to start from scratch or use a template
5. Completes campaign wizard steps
6. Reviews and launches campaign

### Admin Manages Existing Campaign
1. Admin navigates to Campaigns tab
2. Views list of all campaigns
3. Selects specific campaign to view details
4. Can edit, pause, resume, or end campaign
5. Views real-time analytics on campaign performance

### User Participates in Campaign
1. User receives notification about new campaign
2. Views campaign details on their dashboard
3. Enrolls in required/optional courses
4. Tracks personal progress
5. Receives rewards upon completion
