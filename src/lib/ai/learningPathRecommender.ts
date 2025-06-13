"use client";

import { Course } from '@/types/course';
import { User } from '@/types/user';
import { Skill, skillTagger } from './skillTagging';

// Define learning path types
export interface LearningPathItem {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  durationHours: number;
  order: number;
  requiredForCompletion: boolean;
  targetSkills: Skill[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  targetRole?: string;
  targetLevel?: string;
  estimatedDurationHours: number;
  items: LearningPathItem[];
  skillsCovered: Skill[];
  recommendationScore?: number;
  matchReason?: string;
}

export interface SkillGap {
  skill: Skill;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  priority: 'low' | 'medium' | 'high';
}

export interface UserProfile {
  user: User;
  currentSkills: { skill: Skill; level: number }[];
  completedCourses: string[];
  currentRole?: string;
  targetRole?: string;
  learningPreferences?: {
    preferredFormat?: 'video' | 'interactive' | 'reading' | 'mixed';
    preferredDuration?: 'short' | 'medium' | 'long';
    preferredDifficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  careerGoals?: string[];
}

/**
 * Rules-based learning path recommendation engine
 */
export class LearningPathRecommender {
  private courses: Course[] = [];
  private predefinedPaths: LearningPath[] = [];
  
  /**
   * Constructor for LearningPathRecommender
   * @param courses Available courses
   * @param predefinedPaths Optional predefined learning paths
   */
  constructor(courses: Course[] = [], predefinedPaths: LearningPath[] = []) {
    this.courses = courses;
    this.predefinedPaths = predefinedPaths;
  }
  
  /**
   * Set available courses
   * @param courses Courses to use for recommendations
   */
  setCourses(courses: Course[]): void {
    this.courses = courses;
  }
  
  /**
   * Set predefined learning paths
   * @param paths Predefined learning paths
   */
  setPredefinedPaths(paths: LearningPath[]): void {
    this.predefinedPaths = paths;
  }
  
  /**
   * Identify skill gaps for a user based on their profile and target role
   * @param userProfile User profile with current skills
   * @param targetRoleSkills Skills required for target role
   * @returns Array of identified skill gaps
   */
  identifySkillGaps(userProfile: UserProfile, targetRoleSkills: { skill: Skill; requiredLevel: number }[]): SkillGap[] {
    const skillGaps: SkillGap[] = [];
    
    // Check each required skill for the target role
    targetRoleSkills.forEach(({ skill, requiredLevel }) => {
      // Find if user has this skill
      const userSkill = userProfile.currentSkills.find(s => s.skill.id === skill.id);
      const currentLevel = userSkill ? userSkill.level : 0;
      
      // If user's level is below required, it's a gap
      if (currentLevel < requiredLevel) {
        const gap = requiredLevel - currentLevel;
        
        // Determine priority based on gap size
        let priority: 'low' | 'medium' | 'high';
        if (gap >= 3) {
          priority = 'high';
        } else if (gap >= 2) {
          priority = 'medium';
        } else {
          priority = 'low';
        }
        
        skillGaps.push({
          skill,
          currentLevel,
          targetLevel: requiredLevel,
          gap,
          priority
        });
      }
    });
    
    // Sort gaps by priority (high to low) and gap size
    return skillGaps.sort((a, b) => {
      if (a.priority === b.priority) {
        return b.gap - a.gap;
      }
      
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  /**
   * Recommend learning paths for a user based on their profile and skill gaps
   * @param userProfile User profile
   * @param skillGaps Identified skill gaps
   * @returns Array of recommended learning paths with scores
   */
  recommendLearningPaths(userProfile: UserProfile, skillGaps: SkillGap[]): LearningPath[] {
    const recommendations: LearningPath[] = [];
    
    // First, check predefined paths for matches
    this.predefinedPaths.forEach(path => {
      // Calculate how well this path addresses the user's skill gaps
      let gapsCovered = 0;
      let totalGapSize = 0;
      
      // Check which skill gaps this path addresses
      skillGaps.forEach(gap => {
        const pathCoversSkill = path.skillsCovered.some(s => s.id === gap.skill.id);
        if (pathCoversSkill) {
          gapsCovered++;
          totalGapSize += gap.gap;
        }
      });
      
      // Calculate a recommendation score based on gaps covered and relevance
      let score = 0;
      let matchReason = '';
      
      if (gapsCovered > 0) {
        // Base score on percentage of gaps covered and their sizes
        score += (gapsCovered / skillGaps.length) * 50;
        score += Math.min(totalGapSize * 10, 30); // Cap at 30 points
        
        matchReason = `Addresses ${gapsCovered} of your skill gaps`;
        
        // Bonus for matching target role
        if (path.targetRole && path.targetRole === userProfile.targetRole) {
          score += 20;
          matchReason += `, aligned with your target role: ${path.targetRole}`;
        }
      }
      
      // Check if user has already completed courses in this path
      const completedItems = path.items.filter(item => 
        userProfile.completedCourses.includes(item.courseId)
      );
      
      if (completedItems.length > 0) {
        // If user has started this path, it might be good to continue
        const completionPercentage = completedItems.length / path.items.length;
        
        if (completionPercentage < 0.5) {
          // If less than 50% complete, give a small boost
          score += 5;
          matchReason += `, you've started this path (${Math.round(completionPercentage * 100)}% complete)`;
        } else {
          // If more than 50% complete, give a bigger boost
          score += 15;
          matchReason += `, you're well on your way (${Math.round(completionPercentage * 100)}% complete)`;
        }
      }
      
      // Only recommend if score is above threshold
      if (score > 20) {
        recommendations.push({
          ...path,
          recommendationScore: score,
          matchReason
        });
      }
    });
    
    // If no predefined paths match well, generate a custom path
    if (recommendations.length < 3 && skillGaps.length > 0) {
      const customPath = this.generateCustomLearningPath(userProfile, skillGaps);
      if (customPath) {
        recommendations.push(customPath);
      }
    }
    
    // Sort by recommendation score
    return recommendations.sort((a, b) => 
      (b.recommendationScore || 0) - (a.recommendationScore || 0)
    );
  }
  
  /**
   * Generate a custom learning path based on skill gaps
   * @param userProfile User profile
   * @param skillGaps Identified skill gaps
   * @returns Custom learning path
   */
  private generateCustomLearningPath(userProfile: UserProfile, skillGaps: SkillGap[]): LearningPath | null {
    // Focus on top skill gaps (max 3)
    const topGaps = skillGaps.slice(0, 3);
    
    // Find courses that address these gaps
    const relevantCourses: (Course & { relevanceScore: number })[] = [];
    
    this.courses.forEach(course => {
      // Skip courses the user has already completed
      if (userProfile.completedCourses.includes(course.id)) {
        return;
      }
      
      // Tag the course with skills if not already tagged
      const courseSkills = course.skills || skillTagger.tagCourse(course);
      
      // Calculate relevance to the user's top gaps
      let relevanceScore = 0;
      
      topGaps.forEach(gap => {
        const matchingSkill = courseSkills.find(s => s.id === gap.skill.id);
        if (matchingSkill) {
          // Higher score for higher priority gaps
          const priorityMultiplier = gap.priority === 'high' ? 3 : gap.priority === 'medium' ? 2 : 1;
          relevanceScore += gap.gap * priorityMultiplier;
        }
      });
      
      if (relevanceScore > 0) {
        relevantCourses.push({ ...course, relevanceScore });
      }
    });
    
    // If no relevant courses found, return null
    if (relevantCourses.length === 0) {
      return null;
    }
    
    // Sort courses by relevance
    relevantCourses.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Take top courses (max 5)
    const pathCourses = relevantCourses.slice(0, 5);
    
    // Create learning path items
    const items: LearningPathItem[] = pathCourses.map((course, index) => ({
      id: `custom_${Date.now()}_${index}`,
      courseId: course.id,
      title: course.title || '',
      description: course.description,
      durationHours: course.durationHours || 0,
      order: index + 1,
      requiredForCompletion: index < 3, // First 3 courses are required
      targetSkills: course.skills || []
    }));
    
    // Calculate total duration
    const totalDuration = items.reduce((sum, item) => sum + item.durationHours, 0);
    
    // Collect all skills covered
    const allSkills = Array.from(
      new Set(
        items.flatMap(item => item.targetSkills)
          .map(skill => skill.id)
      )
    ).map(skillId => {
      const allSkillsList = items.flatMap(item => item.targetSkills);
      return allSkillsList.find(s => s.id === skillId)!;
    });
    
    // Create custom path
    return {
      id: `custom_${Date.now()}`,
      title: `Custom Path: ${topGaps[0].skill.name} Development`,
      description: `Personalized learning path to address your skill gaps in ${topGaps.map(g => g.skill.name).join(', ')}`,
      estimatedDurationHours: totalDuration,
      items,
      skillsCovered: allSkills,
      recommendationScore: 85, // High score for custom paths
      matchReason: `Custom path created specifically for your top ${topGaps.length} skill gaps`
    };
  }
  
  /**
   * Get courses that address specific skill gaps
   * @param skillGaps Skill gaps to address
   * @returns Array of relevant courses with relevance scores
   */
  getCoursesForSkillGaps(skillGaps: SkillGap[]): (Course & { relevanceScore: number })[] {
    const relevantCourses: (Course & { relevanceScore: number })[] = [];
    
    this.courses.forEach(course => {
      // Tag the course with skills if not already tagged
      const courseSkills = course.skills || skillTagger.tagCourse(course);
      
      // Calculate relevance to the skill gaps
      let relevanceScore = 0;
      let matchedGaps: SkillGap[] = [];
      
      skillGaps.forEach(gap => {
        const matchingSkill = courseSkills.find(s => s.id === gap.skill.id);
        if (matchingSkill) {
          // Higher score for higher priority gaps
          const priorityMultiplier = gap.priority === 'high' ? 3 : gap.priority === 'medium' ? 2 : 1;
          relevanceScore += gap.gap * priorityMultiplier;
          matchedGaps.push(gap);
        }
      });
      
      if (relevanceScore > 0) {
        relevantCourses.push({ 
          ...course, 
          relevanceScore,
          matchedSkillGaps: matchedGaps // Add matched gaps for reference
        } as Course & { relevanceScore: number, matchedSkillGaps: SkillGap[] });
      }
    });
    
    // Sort by relevance score
    return relevantCourses.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}

// Create a singleton instance
export const learningPathRecommender = new LearningPathRecommender();

export default learningPathRecommender;
