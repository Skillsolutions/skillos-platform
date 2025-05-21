// Mock Udemy Business API
// This is a simplified mock and does not represent the full API

export interface UdemyCourse {
  id: string;
  title: string;
  url: string;
  category?: string;
  topic?: string;
}

export interface UdemyUserActivity {
  userId: string; // This would be the SkillOS internal user ID, mapped to Udemy user
  courseId: string;
  completed: boolean;
  progress: number; // 0-100
  lastAccessed: string; // ISO Date string
  timeSpent?: number; // in minutes
}

const mockUdemyCourses: UdemyCourse[] = [
  { id: "udemy101", title: "Advanced JavaScript Concepts", url: "https://www.udemy.com/course/advanced-javascript-concepts/", category: "Development", topic: "JavaScript" },
  { id: "udemy102", title: "Python for Data Science", url: "https://www.udemy.com/course/python-for-data-science/", category: "Data Science", topic: "Python" },
  { id: "udemy103", title: "Cloud Architecture with AWS", url: "https://www.udemy.com/course/cloud-architecture-with-aws/", category: "IT & Software", topic: "AWS" },
  { id: "udemy201", title: "Effective Project Management", url: "https://www.udemy.com/course/effective-project-management/", category: "Business", topic: "Project Management" },
];

const mockUdemyUserActivities: UdemyUserActivity[] = [
  // Alex Johnson (user123 - from dashboard mock)
  { userId: "user123", courseId: "udemy101", completed: false, progress: 75, lastAccessed: "2025-05-08T10:00:00Z", timeSpent: 120 },
  { userId: "user123", courseId: "udemy201", completed: true, progress: 100, lastAccessed: "2025-04-20T14:30:00Z", timeSpent: 300 },
  // Charlie Brown (learner1 - from dashboard mock)
  { userId: "learner1", courseId: "udemy102", completed: true, progress: 100, lastAccessed: "2025-05-01T09:00:00Z", timeSpent: 240 },
  { userId: "learner1", courseId: "udemy103", completed: false, progress: 50, lastAccessed: "2025-05-09T11:00:00Z", timeSpent: 90 },
  // Lucy Van Pelt (learner2)
  { userId: "learner2", courseId: "udemy101", completed: true, progress: 100, lastAccessed: "2025-04-15T16:00:00Z", timeSpent: 150 },
];

export const getUdemyUserActivity = async (userId: string): Promise<UdemyUserActivity[]> => {
  console.log(`Mock API: Fetching Udemy activity for user ${userId}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUdemyUserActivities.filter(activity => activity.userId === userId);
};

export const getUdemyCourseDetails = async (courseId: string): Promise<UdemyCourse | undefined> => {
  console.log(`Mock API: Fetching Udemy course details for ${courseId}`);
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockUdemyCourses.find(course => course.id === courseId);
};

export const getAllUdemyCourses = async (): Promise<UdemyCourse[]> => {
    console.log("Mock API: Fetching all Udemy courses");
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockUdemyCourses;
};

// Add more mock functions as needed, e.g., for fetching all users activity for an org, etc.

