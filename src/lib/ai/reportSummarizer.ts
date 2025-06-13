"use client";

import { Course } from '@/types/course';
import { User } from '@/types/user';
import { SkillGap } from './learningPathRecommender';

// Define report types
export interface LearningMetrics {
  totalLearningHours: number;
  coursesCompleted: number;
  coursesInProgress: number;
  averageCompletionRate: number;
  skillsImproved: number;
  topSkillCategory: string;
  learningTrend: 'increasing' | 'stable' | 'decreasing';
  comparisonToPeers: 'above' | 'average' | 'below';
}

export interface TeamLearningMetrics extends LearningMetrics {
  teamSize: number;
  teamEngagementRate: number;
  topPerformer: string;
  skillGapsClosed: number;
  departmentRanking: number;
  totalDepartments: number;
}

export interface ROIMetrics {
  totalInvestment: number;
  estimatedReturn: number;
  roi: number;
  timeToValue: number;
  confidenceScore: number;
  keyFactors: string[];
}

export interface InsightSummary {
  title: string;
  summary: string;
  keyPoints: string[];
  recommendations: string[];
  dataPoints: Record<string, any>;
}

/**
 * AI-driven data summarization for learning reports
 */
export class ReportSummarizer {
  /**
   * Generate a natural language summary of individual learning progress
   * @param user User data
   * @param metrics Learning metrics
   * @returns Insight summary with natural language explanation
   */
  summarizeIndividualProgress(user: User, metrics: LearningMetrics): InsightSummary {
    // Determine overall engagement level
    let engagementLevel = 'moderate';
    if (metrics.totalLearningHours > 40 && metrics.coursesCompleted > 5) {
      engagementLevel = 'high';
    } else if (metrics.totalLearningHours < 10 && metrics.coursesCompleted < 2) {
      engagementLevel = 'low';
    }
    
    // Determine progress trend
    const trendDescription = metrics.learningTrend === 'increasing' 
      ? 'upward trajectory' 
      : metrics.learningTrend === 'stable' 
        ? 'consistent pace' 
        : 'declining engagement';
    
    // Generate key points based on metrics
    const keyPoints = [
      `${user.name} has completed ${metrics.coursesCompleted} courses, representing ${metrics.averageCompletionRate}% of assigned learning.`,
      `Total learning time is ${metrics.totalLearningHours} hours, showing ${engagementLevel} engagement.`,
      `Learning trend shows a ${trendDescription} compared to previous periods.`,
      `Performance is ${metrics.comparisonToPeers} average compared to peers in similar roles.`
    ];
    
    // Generate recommendations
    const recommendations = [];
    
    if (metrics.learningTrend === 'decreasing') {
      recommendations.push('Consider scheduling dedicated learning time to address declining engagement.');
    }
    
    if (metrics.comparisonToPeers === 'below') {
      recommendations.push('Explore potential barriers to learning and provide additional support or resources.');
    }
    
    if (metrics.coursesInProgress > 3) {
      recommendations.push('Focus on completing current courses before starting new ones to improve completion rate.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue with current learning plan, which is showing positive results.');
      
      if (metrics.comparisonToPeers === 'above') {
        recommendations.push('Consider mentoring opportunities to share knowledge with team members.');
      }
    }
    
    // Generate summary
    const summary = `
      ${user.name}'s learning progress shows ${engagementLevel} engagement with ${metrics.totalLearningHours} hours 
      of learning completed across ${metrics.coursesCompleted} courses. The learning trend is on a ${trendDescription}, 
      with performance ${metrics.comparisonToPeers === 'above' ? 'exceeding' : metrics.comparisonToPeers === 'average' ? 'meeting' : 'below'} 
      the average for peers in similar roles. The primary focus has been on ${metrics.topSkillCategory} skills, 
      with ${metrics.skillsImproved} measurable skill improvements.
    `.replace(/\s+/g, ' ').trim();
    
    return {
      title: `Learning Progress Summary for ${user.name}`,
      summary,
      keyPoints,
      recommendations,
      dataPoints: { ...metrics }
    };
  }
  
  /**
   * Generate a natural language summary of team learning progress
   * @param teamName Team name
   * @param metrics Team learning metrics
   * @returns Insight summary with natural language explanation
   */
  summarizeTeamProgress(teamName: string, metrics: TeamLearningMetrics): InsightSummary {
    // Calculate engagement rating
    const engagementRating = metrics.teamEngagementRate >= 80 ? 'excellent' 
      : metrics.teamEngagementRate >= 60 ? 'good' 
      : metrics.teamEngagementRate >= 40 ? 'moderate' 
      : 'needs improvement';
    
    // Determine departmental standing
    const departmentStanding = metrics.departmentRanking <= Math.ceil(metrics.totalDepartments * 0.25) ? 'top quartile'
      : metrics.departmentRanking <= Math.ceil(metrics.totalDepartments * 0.5) ? 'second quartile'
      : metrics.departmentRanking <= Math.ceil(metrics.totalDepartments * 0.75) ? 'third quartile'
      : 'bottom quartile';
    
    // Generate key points
    const keyPoints = [
      `Team engagement rate is ${metrics.teamEngagementRate}%, which is ${engagementRating}.`,
      `The team has collectively completed ${metrics.coursesCompleted} courses with ${metrics.totalLearningHours} total learning hours.`,
      `${metrics.topPerformer} is the top performer with the highest learning engagement.`,
      `The team has closed ${metrics.skillGapsClosed} identified skill gaps.`,
      `The team ranks ${metrics.departmentRanking} out of ${metrics.totalDepartments} departments (${departmentStanding}).`
    ];
    
    // Generate recommendations
    const recommendations = [];
    
    if (metrics.teamEngagementRate < 60) {
      recommendations.push('Implement team learning challenges or incentives to boost engagement.');
    }
    
    if (metrics.learningTrend === 'decreasing') {
      recommendations.push('Schedule a team discussion to identify barriers to learning and address them.');
    }
    
    if (metrics.departmentRanking > Math.ceil(metrics.totalDepartments * 0.5)) {
      recommendations.push('Benchmark against higher-performing departments to identify improvement opportunities.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Maintain current learning momentum and consider sharing best practices with other teams.');
      
      if (departmentStanding === 'top quartile') {
        recommendations.push('Recognize and celebrate team learning achievements to reinforce positive behaviors.');
      }
    }
    
    // Generate summary
    const summary = `
      The ${teamName} team demonstrates ${engagementRating} learning engagement at ${metrics.teamEngagementRate}%, 
      with ${metrics.totalLearningHours} total learning hours across ${metrics.teamSize} team members. 
      The team has completed ${metrics.coursesCompleted} courses and closed ${metrics.skillGapsClosed} skill gaps. 
      ${metrics.topPerformer} stands out as the top performer. The team currently ranks ${metrics.departmentRanking} 
      out of ${metrics.totalDepartments} departments, placing it in the ${departmentStanding}. 
      The learning trend is ${metrics.learningTrend}, indicating ${metrics.learningTrend === 'increasing' ? 'growing momentum' : metrics.learningTrend === 'stable' ? 'consistent engagement' : 'potential challenges'}.
    `.replace(/\s+/g, ' ').trim();
    
    return {
      title: `Learning Progress Summary for ${teamName} Team`,
      summary,
      keyPoints,
      recommendations,
      dataPoints: { ...metrics }
    };
  }
  
  /**
   * Generate a natural language summary of learning ROI
   * @param initiative Learning initiative name
   * @param metrics ROI metrics
   * @returns Insight summary with natural language explanation
   */
  summarizeROI(initiative: string, metrics: ROIMetrics): InsightSummary {
    // Determine ROI rating
    const roiRating = metrics.roi >= 300 ? 'exceptional' 
      : metrics.roi >= 200 ? 'excellent' 
      : metrics.roi >= 100 ? 'good' 
      : metrics.roi >= 0 ? 'positive' 
      : 'negative';
    
    // Determine confidence level
    const confidenceLevel = metrics.confidenceScore >= 80 ? 'high' 
      : metrics.confidenceScore >= 60 ? 'moderate' 
      : 'low';
    
    // Generate key points
    const keyPoints = [
      `The ${initiative} initiative shows a ${roiRating} ROI of ${metrics.roi}%.`,
      `Total investment was ${formatCurrency(metrics.totalInvestment)} with an estimated return of ${formatCurrency(metrics.estimatedReturn)}.`,
      `Expected time to value is ${metrics.timeToValue} months.`,
      `Confidence in these projections is ${confidenceLevel} at ${metrics.confidenceScore}%.`,
      `Key factors influencing ROI: ${metrics.keyFactors.join(', ')}.`
    ];
    
    // Generate recommendations
    const recommendations = [];
    
    if (metrics.roi < 100) {
      recommendations.push('Review initiative structure to identify opportunities for improved returns.');
    }
    
    if (metrics.confidenceScore < 70) {
      recommendations.push('Implement additional measurement points to increase confidence in ROI calculations.');
    }
    
    if (metrics.timeToValue > 12) {
      recommendations.push('Explore ways to accelerate time to value through focused implementation.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue with current approach, which is delivering strong returns.');
      
      if (metrics.roi >= 200) {
        recommendations.push('Consider scaling this initiative to other departments or teams.');
      }
    }
    
    // Generate summary
    const summary = `
      The ${initiative} learning initiative demonstrates a ${roiRating} return on investment of ${metrics.roi}%, 
      based on a total investment of ${formatCurrency(metrics.totalInvestment)} and an estimated return of 
      ${formatCurrency(metrics.estimatedReturn)}. The expected time to value is ${metrics.timeToValue} months, 
      with a ${confidenceLevel} confidence level of ${metrics.confidenceScore}%. Key factors influencing this ROI 
      include ${metrics.keyFactors.join(', ')}. This analysis is based on the Kirkpatrick and Phillips ROI frameworks.
    `.replace(/\s+/g, ' ').trim();
    
    return {
      title: `ROI Analysis for ${initiative}`,
      summary,
      keyPoints,
      recommendations,
      dataPoints: { ...metrics }
    };
  }
  
  /**
   * Generate a natural language summary of skill gaps
   * @param skillGaps Identified skill gaps
   * @returns Insight summary with natural language explanation
   */
  summarizeSkillGaps(skillGaps: SkillGap[]): InsightSummary {
    // Count gaps by priority
    const highPriorityCount = skillGaps.filter(gap => gap.priority === 'high').length;
    const mediumPriorityCount = skillGaps.filter(gap => gap.priority === 'medium').length;
    const lowPriorityCount = skillGaps.filter(gap => gap.priority === 'low').length;
    
    // Group gaps by category
    const categoryCounts: Record<string, number> = {};
    skillGaps.forEach(gap => {
      const category = gap.skill.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // Find top category
    let topCategory = '';
    let topCount = 0;
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > topCount) {
        topCategory = category;
        topCount = count;
      }
    });
    
    // Generate key points
    const keyPoints = [
      `Identified ${skillGaps.length} skill gaps: ${highPriorityCount} high priority, ${mediumPriorityCount} medium priority, and ${lowPriorityCount} low priority.`,
      `The most common skill gap category is ${topCategory} with ${topCount} gaps.`,
      `Top 3 skill gaps: ${skillGaps.slice(0, 3).map(gap => gap.skill.name).join(', ')}.`
    ];
    
    // Generate recommendations
    const recommendations = [];
    
    if (highPriorityCount > 0) {
      recommendations.push(`Focus immediate learning resources on the ${highPriorityCount} high-priority skill gaps.`);
    }
    
    if (topCount > skillGaps.length / 3) {
      recommendations.push(`Consider a focused learning initiative for ${topCategory} skills to address multiple gaps efficiently.`);
    }
    
    if (skillGaps.length > 5) {
      recommendations.push('Develop a phased approach to address skill gaps over time, starting with high-priority areas.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Address identified skill gaps through targeted learning opportunities.');
    }
    
    // Generate summary
    const summary = `
      Analysis has identified ${skillGaps.length} skill gaps across the organization, with 
      ${highPriorityCount} high-priority, ${mediumPriorityCount} medium-priority, and ${lowPriorityCount} low-priority gaps. 
      The most prevalent gap category is ${topCategory}, representing ${Math.round((topCount / skillGaps.length) * 100)}% 
      of all identified gaps. The top three skill gaps to address are ${skillGaps.slice(0, 3).map(gap => gap.skill.name).join(', ')}.
      Addressing these gaps would significantly enhance organizational capabilities and performance.
    `.replace(/\s+/g, ' ').trim();
    
    return {
      title: 'Skill Gap Analysis Summary',
      summary,
      keyPoints,
      recommendations,
      dataPoints: {
        totalGaps: skillGaps.length,
        highPriorityGaps: highPriorityCount,
        mediumPriorityGaps: mediumPriorityCount,
        lowPriorityGaps: lowPriorityCount,
        topCategory,
        categoryCounts
      }
    };
  }
  
  /**
   * Generate a natural language summary of course effectiveness
   * @param course Course data
   * @param completionRate Completion rate percentage
   * @param averageRating Average rating (1-5)
   * @param skillImprovements Skill improvements observed
   * @returns Insight summary with natural language explanation
   */
  summarizeCourseEffectiveness(
    course: Course, 
    completionRate: number, 
    averageRating: number,
    skillImprovements: { skillName: string, averageImprovement: number }[]
  ): InsightSummary {
    // Determine effectiveness rating
    const effectivenessScore = (completionRate / 100 * 0.4) + (averageRating / 5 * 0.6);
    const effectivenessRating = effectivenessScore >= 0.8 ? 'highly effective' 
      : effectivenessScore >= 0.6 ? 'effective' 
      : effectivenessScore >= 0.4 ? 'moderately effective' 
      : 'needs improvement';
    
    // Generate key points
    const keyPoints = [
      `"${course.title}" has a completion rate of ${completionRate}% and an average rating of ${averageRating.toFixed(1)}/5.0.`,
      `Overall effectiveness rating: ${effectivenessRating}.`,
      `Top skill improvements: ${skillImprovements.slice(0, 3).map(si => `${si.skillName} (+${si.averageImprovement.toFixed(1)})`).join(', ')}.`
    ];
    
    // Generate recommendations
    const recommendations = [];
    
    if (completionRate < 70) {
      recommendations.push('Review course length and structure to improve completion rates.');
    }
    
    if (averageRating < 4.0) {
      recommendations.push('Gather detailed feedback to identify specific areas for content improvement.');
    }
    
    if (skillImprovements.length > 0 && skillImprovements[0].averageImprovement < 1.0) {
      recommendations.push('Enhance practical exercises to improve skill development outcomes.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Continue offering this course as part of learning programs.');
      
      if (effectivenessScore >= 0.8) {
        recommendations.push('Consider developing advanced follow-up courses building on this successful format.');
      }
    }
    
    // Generate summary
    const summary = `
      "${course.title}" demonstrates ${effectivenessRating} learning outcomes with a ${completionRate}% completion rate 
      and ${averageRating.toFixed(1)}/5.0 average learner rating. The course is particularly effective at developing 
      ${skillImprovements.length > 0 ? skillImprovements.slice(0, Math.min(2, skillImprovements.length)).map(si => si.skillName).join(' and ') : 'relevant'} skills, with measurable improvements 
      averaging ${skillImprovements.length > 0 ? 
        (skillImprovements.slice(0, Math.min(3, skillImprovements.length)).reduce((sum, si) => sum + si.averageImprovement, 0) / 
        Math.min(3, skillImprovements.length)).toFixed(1) : '0.0'} points on assessment scales. ${
        effectivenessScore >= 0.7 
          ? 'This course represents a valuable asset in the learning catalog.' 
          : 'This course has potential but may benefit from targeted improvements.'
      }
    `.replace(/\s+/g, ' ').trim();
    
    return {
      title: `Effectiveness Analysis: ${course.title}`,
      summary,
      keyPoints,
      recommendations,
      dataPoints: {
        course: course.title,
        completionRate,
        averageRating,
        effectivenessScore,
        effectivenessRating,
        skillImprovements
      }
    };
  }
}

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Create a singleton instance
export const reportSummarizer = new ReportSummarizer();

export default reportSummarizer;
