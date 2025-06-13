/**
 * Mock data for reports in SkillOS platform tests
 */

export const mockReports = [
  {
    id: 'report-1',
    title: 'Learning Engagement Q2 2025',
    type: 'engagement',
    createdAt: '2025-06-01T10:00:00Z',
    createdBy: {
      id: 'user-2',
      name: 'Manager User'
    },
    metrics: {
      courseCompletionRate: 78,
      courseCompletionRatePrevious: 66,
      activeLearners: 425,
      activeLearnersPrevious: 393,
      averageLearningTime: 3.2,
      averageLearningTimePrevious: 3.4,
      courseParticipation: 85,
      discussionActivity: 62,
      assessmentCompletion: 78
    },
    summary: 'Overall learning engagement has increased by 12% compared to Q1 2025. Course completion rates have improved significantly, and the number of active learners has grown by 8%. The average learning time per week has slightly decreased, which may indicate more efficient learning patterns or a need to investigate potential barriers to extended engagement.',
    recommendations: [
      'Implement micro-learning modules to increase daily engagement',
      'Create more interactive discussion opportunities',
      'Recognize top learners to encourage continued participation'
    ]
  },
  {
    id: 'report-2',
    title: 'Skills Gap Analysis - Engineering Team',
    type: 'skills-gap',
    createdAt: '2025-05-15T14:30:00Z',
    createdBy: {
      id: 'user-1',
      name: 'Admin User'
    },
    department: 'Engineering',
    teamSize: 24,
    currentSkills: [
      { name: 'JavaScript', proficiency: 85 },
      { name: 'React', proficiency: 78 },
      { name: 'Node.js', proficiency: 72 },
      { name: 'Python', proficiency: 65 },
      { name: 'AWS', proficiency: 60 }
    ],
    requiredSkills: [
      { name: 'JavaScript', required: 80 },
      { name: 'React', required: 75 },
      { name: 'Node.js', required: 75 },
      { name: 'Python', required: 70 },
      { name: 'AWS', required: 80 },
      { name: 'GraphQL', required: 70 },
      { name: 'Docker', required: 75 }
    ],
    gapAnalysis: [
      { name: 'AWS', gap: 20, priority: 'High' },
      { name: 'GraphQL', gap: 'Not Present', priority: 'High' },
      { name: 'Docker', gap: 'Not Present', priority: 'Medium' }
    ],
    recommendedCourses: [
      { id: 'course-5', title: 'Cloud Computing with AWS' },
      { id: 'course-6', title: 'GraphQL API Development' },
      { id: 'course-7', title: 'Docker and Containerization' }
    ]
  },
  {
    id: 'report-3',
    title: 'ROI Analysis - Leadership Training Program',
    type: 'roi',
    createdAt: '2025-05-20T09:00:00Z',
    createdBy: {
      id: 'user-1',
      name: 'Admin User'
    },
    program: 'Leadership Excellence',
    participants: 45,
    duration: '3 months',
    cost: 67500,
    metrics: {
      employeeRetention: {
        before: 82,
        after: 93,
        improvement: 11,
        impact: 247500
      },
      teamPerformance: {
        before: 76,
        after: 89,
        improvement: 13,
        impact: 195000
      },
      customerSatisfaction: {
        before: 84,
        after: 92,
        improvement: 8,
        impact: 120000
      }
    },
    totalBenefit: 562500,
    roi: 733,
    summary: 'The Leadership Excellence program has demonstrated exceptional return on investment, with a calculated ROI of 733%. The most significant impact was observed in employee retention, which improved by 11 percentage points, resulting in estimated savings of $247,500 from reduced turnover costs. Team performance metrics also showed substantial improvement, contributing an estimated $195,000 in productivity gains.'
  }
];
