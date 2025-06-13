"use client";

import { Course } from '@/types/course';

// Define skill taxonomy types
export interface Skill {
  id: string;
  name: string;
  description?: string;
  category: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  keywords: string[];
  parentSkillId?: string;
  relatedSkillIds?: string[];
}

export interface SkillTaxonomy {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
}

// Sample SFIA-inspired skill taxonomy (simplified)
export const sfiaTaxonomy: SkillTaxonomy = {
  id: 'sfia',
  name: 'Skills Framework for the Information Age',
  description: 'A global skills and competency framework for the digital world',
  skills: [
    {
      id: 'prog',
      name: 'Programming/Software Development',
      category: 'Development',
      level: 'intermediate',
      keywords: ['coding', 'programming', 'software development', 'developer', 'javascript', 'python', 'java', 'c#', 'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring', 'hibernate', 'typescript', 'frontend', 'backend', 'fullstack']
    },
    {
      id: 'data',
      name: 'Data Analysis',
      category: 'Data',
      level: 'intermediate',
      keywords: ['data analysis', 'analytics', 'data science', 'statistics', 'data visualization', 'tableau', 'power bi', 'excel', 'sql', 'database', 'big data', 'data mining', 'data modeling', 'pandas', 'numpy', 'r', 'matplotlib', 'seaborn', 'data wrangling']
    },
    {
      id: 'ai',
      name: 'Artificial Intelligence',
      category: 'Data',
      level: 'advanced',
      keywords: ['artificial intelligence', 'ai', 'machine learning', 'ml', 'deep learning', 'neural networks', 'nlp', 'natural language processing', 'computer vision', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'reinforcement learning', 'supervised learning', 'unsupervised learning']
    },
    {
      id: 'pm',
      name: 'Project Management',
      category: 'Management',
      level: 'intermediate',
      keywords: ['project management', 'agile', 'scrum', 'kanban', 'waterfall', 'prince2', 'pmp', 'pmbok', 'jira', 'asana', 'trello', 'project planning', 'risk management', 'stakeholder management', 'project delivery', 'sprint', 'backlog', 'retrospective']
    },
    {
      id: 'lead',
      name: 'Leadership',
      category: 'Management',
      level: 'advanced',
      keywords: ['leadership', 'management', 'team lead', 'team management', 'people management', 'coaching', 'mentoring', 'delegation', 'motivation', 'performance management', 'conflict resolution', 'decision making', 'strategic thinking', 'emotional intelligence']
    },
    {
      id: 'comm',
      name: 'Communication',
      category: 'Soft Skills',
      level: 'intermediate',
      keywords: ['communication', 'presentation', 'public speaking', 'writing', 'listening', 'feedback', 'negotiation', 'persuasion', 'storytelling', 'facilitation', 'interpersonal', 'verbal', 'non-verbal', 'written', 'email', 'documentation']
    },
    {
      id: 'ux',
      name: 'User Experience Design',
      category: 'Design',
      level: 'intermediate',
      keywords: ['user experience', 'ux', 'ui', 'user interface', 'usability', 'wireframing', 'prototyping', 'user research', 'user testing', 'information architecture', 'interaction design', 'visual design', 'accessibility', 'figma', 'sketch', 'adobe xd', 'invision']
    },
    {
      id: 'devops',
      name: 'DevOps',
      category: 'Operations',
      level: 'advanced',
      keywords: ['devops', 'ci/cd', 'continuous integration', 'continuous deployment', 'continuous delivery', 'infrastructure as code', 'docker', 'kubernetes', 'jenkins', 'gitlab ci', 'github actions', 'aws', 'azure', 'gcp', 'cloud', 'monitoring', 'logging', 'terraform', 'ansible', 'chef', 'puppet']
    },
    {
      id: 'sec',
      name: 'Cybersecurity',
      category: 'Security',
      level: 'advanced',
      keywords: ['cybersecurity', 'security', 'information security', 'network security', 'application security', 'penetration testing', 'ethical hacking', 'vulnerability assessment', 'threat modeling', 'encryption', 'authentication', 'authorization', 'compliance', 'risk management', 'incident response']
    },
    {
      id: 'cloud',
      name: 'Cloud Computing',
      category: 'Infrastructure',
      level: 'intermediate',
      keywords: ['cloud', 'cloud computing', 'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud platform', 'iaas', 'paas', 'saas', 'serverless', 'lambda', 'ec2', 's3', 'rds', 'dynamodb', 'cloudformation', 'cloud architecture']
    }
  ]
};

// Sample O*NET-inspired skill taxonomy (simplified)
export const onetTaxonomy: SkillTaxonomy = {
  id: 'onet',
  name: 'O*NET Skill Framework',
  description: 'Occupational Information Network skill framework',
  skills: [
    {
      id: 'crit_think',
      name: 'Critical Thinking',
      category: 'Basic Skills',
      level: 'intermediate',
      keywords: ['critical thinking', 'analysis', 'analytical', 'problem solving', 'reasoning', 'logical thinking', 'evaluation', 'judgment', 'decision making', 'root cause analysis']
    },
    {
      id: 'act_listen',
      name: 'Active Listening',
      category: 'Basic Skills',
      level: 'intermediate',
      keywords: ['active listening', 'listening', 'attentiveness', 'comprehension', 'understanding', 'focus', 'concentration', 'attention to detail']
    },
    {
      id: 'complex_prob',
      name: 'Complex Problem Solving',
      category: 'Complex Problem Solving Skills',
      level: 'advanced',
      keywords: ['complex problem solving', 'problem solving', 'troubleshooting', 'debugging', 'root cause analysis', 'analytical thinking', 'solution design', 'systems thinking']
    },
    {
      id: 'soc_percep',
      name: 'Social Perceptiveness',
      category: 'Social Skills',
      level: 'intermediate',
      keywords: ['social perceptiveness', 'empathy', 'emotional intelligence', 'interpersonal awareness', 'social awareness', 'reading people', 'understanding others', 'cultural sensitivity']
    },
    {
      id: 'coord',
      name: 'Coordination',
      category: 'Social Skills',
      level: 'intermediate',
      keywords: ['coordination', 'organizing', 'planning', 'scheduling', 'resource allocation', 'team coordination', 'collaboration', 'synchronization', 'orchestration']
    },
    {
      id: 'time_mgmt',
      name: 'Time Management',
      category: 'Resource Management Skills',
      level: 'intermediate',
      keywords: ['time management', 'prioritization', 'scheduling', 'productivity', 'efficiency', 'deadlines', 'planning', 'organization', 'work-life balance']
    },
    {
      id: 'sys_analysis',
      name: 'Systems Analysis',
      category: 'Systems Skills',
      level: 'advanced',
      keywords: ['systems analysis', 'system design', 'requirements gathering', 'business analysis', 'process mapping', 'process improvement', 'workflow analysis', 'system architecture']
    },
    {
      id: 'tech_design',
      name: 'Technology Design',
      category: 'Technical Skills',
      level: 'advanced',
      keywords: ['technology design', 'system design', 'software design', 'architecture', 'technical planning', 'solution architecture', 'technical specifications', 'technical documentation']
    }
  ]
};

/**
 * AI-driven skill tagging system that analyzes course content and maps to skills
 */
export class SkillTagger {
  private taxonomies: SkillTaxonomy[] = [sfiaTaxonomy, onetTaxonomy];
  
  /**
   * Constructor for SkillTagger
   * @param customTaxonomies Optional additional taxonomies to include
   */
  constructor(customTaxonomies: SkillTaxonomy[] = []) {
    this.taxonomies = [...this.taxonomies, ...customTaxonomies];
  }
  
  /**
   * Tag a course with relevant skills based on its content
   * @param course The course to analyze and tag
   * @returns Array of identified skills
   */
  tagCourse(course: Course): Skill[] {
    const identifiedSkills: Skill[] = [];
    const contentToAnalyze = this.prepareContentForAnalysis(course);
    
    // For each taxonomy, check if the course content matches any skills
    this.taxonomies.forEach(taxonomy => {
      taxonomy.skills.forEach(skill => {
        // Check if any keywords from the skill match the course content
        const matchScore = this.calculateMatchScore(contentToAnalyze, skill);
        
        // If the match score is above threshold, add the skill
        if (matchScore > 0.15) {
          identifiedSkills.push({
            ...skill,
            // Add match confidence as a property
            matchConfidence: matchScore
          } as Skill & { matchConfidence: number });
        }
      });
    });
    
    // Sort by match confidence and return top skills
    return identifiedSkills
      .sort((a, b) => (b as any).matchConfidence - (a as any).matchConfidence)
      .slice(0, 5); // Return top 5 skills
  }
  
  /**
   * Prepare course content for analysis by combining relevant fields
   * @param course The course to prepare content from
   * @returns Normalized string of course content
   */
  private prepareContentForAnalysis(course: Course): string {
    // Combine relevant course fields for analysis
    const contentParts = [
      course.title || '',
      course.description || '',
      course.objectives?.join(' ') || '',
      course.topics?.join(' ') || '',
      course.keywords?.join(' ') || '',
      course.instructors?.map(i => i.expertise).join(' ') || ''
    ];
    
    // Join and normalize the content
    return contentParts.join(' ').toLowerCase();
  }
  
  /**
   * Calculate match score between content and skill
   * @param content Normalized content string
   * @param skill Skill to match against
   * @returns Match score between 0 and 1
   */
  private calculateMatchScore(content: string, skill: Skill): number {
    let matchCount = 0;
    let totalKeywords = skill.keywords.length;
    
    // Check each keyword for the skill
    skill.keywords.forEach(keyword => {
      // For multi-word keywords, check exact match
      if (keyword.includes(' ')) {
        if (content.includes(keyword.toLowerCase())) {
          matchCount += 2; // Higher weight for multi-word matches
        }
      } else {
        // For single words, check word boundaries
        const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
        if (regex.test(content)) {
          matchCount += 1;
        }
      }
    });
    
    // Calculate score as a ratio of matched keywords to total keywords
    return matchCount / (totalKeywords * 2);
  }
  
  /**
   * Get all available skills across all taxonomies
   * @returns Array of all skills
   */
  getAllSkills(): Skill[] {
    return this.taxonomies.flatMap(taxonomy => taxonomy.skills);
  }
  
  /**
   * Get skills by category
   * @param category Category to filter by
   * @returns Array of skills in the category
   */
  getSkillsByCategory(category: string): Skill[] {
    return this.getAllSkills().filter(skill => skill.category === category);
  }
  
  /**
   * Find skills that match a search term
   * @param searchTerm Term to search for
   * @returns Array of matching skills
   */
  findSkills(searchTerm: string): Skill[] {
    const term = searchTerm.toLowerCase();
    return this.getAllSkills().filter(skill => 
      skill.name.toLowerCase().includes(term) || 
      skill.keywords.some(keyword => keyword.toLowerCase().includes(term))
    );
  }
}

/**
 * Create a singleton instance of the skill tagger
 */
export const skillTagger = new SkillTagger();

export default skillTagger;
