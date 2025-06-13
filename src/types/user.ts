export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role?: 'admin' | 'departmentHead' | 'teamLeader' | 'employee';
  department?: string;
  jobTitle?: string;
  manager?: string;
  managerId?: string;
  hireDate?: string;
  lastActive?: string;
  skills?: {
    skillId: string;
    skillName: string;
    proficiency: number;
    lastAssessed?: string;
  }[];
  learningPreferences?: {
    preferredFormat?: 'video' | 'interactive' | 'reading' | 'mixed';
    preferredDuration?: 'short' | 'medium' | 'long';
    preferredDifficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  careerGoals?: string[];
  completedCourses?: string[];
  enrolledCourses?: string[];
  certifications?: {
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }[];
}
