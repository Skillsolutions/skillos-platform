/**
 * Mock data for courses in SkillOS platform tests
 */

export const mockCourses = [
  {
    id: 'course-1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
    instructor: 'John Smith',
    duration: '10 hours',
    level: 'Beginner',
    rating: 4.7,
    reviews: 852,
    enrolled: 12543,
    thumbnail: '/images/courses/web-dev.jpg',
    categories: ['Web Development', 'Programming', 'Frontend'],
    skills: ['HTML', 'CSS', 'JavaScript'],
    chapters: [
      {
        id: 'chapter-1-1',
        title: 'HTML Fundamentals',
        duration: '2 hours'
      },
      {
        id: 'chapter-1-2',
        title: 'CSS Styling',
        duration: '3 hours'
      },
      {
        id: 'chapter-1-3',
        title: 'JavaScript Basics',
        duration: '5 hours'
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Advanced React Development',
    description: 'Master React hooks, context API, and performance optimization techniques.',
    instructor: 'Sarah Johnson',
    duration: '15 hours',
    level: 'Advanced',
    rating: 4.9,
    reviews: 1243,
    enrolled: 8765,
    thumbnail: '/images/courses/react.jpg',
    categories: ['Web Development', 'Programming', 'Frontend', 'React'],
    skills: ['React', 'JavaScript', 'Redux', 'Performance Optimization'],
    chapters: [
      {
        id: 'chapter-2-1',
        title: 'React Hooks Deep Dive',
        duration: '4 hours'
      },
      {
        id: 'chapter-2-2',
        title: 'Context API and State Management',
        duration: '5 hours'
      },
      {
        id: 'chapter-2-3',
        title: 'Performance Optimization',
        duration: '6 hours'
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Data Science Fundamentals',
    description: 'Introduction to data analysis, visualization, and machine learning concepts.',
    instructor: 'Michael Chen',
    duration: '20 hours',
    level: 'Intermediate',
    rating: 4.5,
    reviews: 987,
    enrolled: 6543,
    thumbnail: '/images/courses/data-science.jpg',
    categories: ['Data Science', 'Programming', 'Machine Learning'],
    skills: ['Python', 'Pandas', 'NumPy', 'Data Visualization'],
    chapters: [
      {
        id: 'chapter-3-1',
        title: 'Python for Data Science',
        duration: '5 hours'
      },
      {
        id: 'chapter-3-2',
        title: 'Data Analysis with Pandas',
        duration: '7 hours'
      },
      {
        id: 'chapter-3-3',
        title: 'Data Visualization',
        duration: '4 hours'
      },
      {
        id: 'chapter-3-4',
        title: 'Introduction to Machine Learning',
        duration: '4 hours'
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Leadership Skills for Managers',
    description: 'Develop essential leadership skills to effectively manage teams and drive results.',
    instructor: 'Emily Rodriguez',
    duration: '12 hours',
    level: 'All Levels',
    rating: 4.8,
    reviews: 1567,
    enrolled: 9876,
    thumbnail: '/images/courses/leadership.jpg',
    categories: ['Leadership', 'Management', 'Soft Skills'],
    skills: ['Leadership', 'Communication', 'Team Management', 'Conflict Resolution'],
    chapters: [
      {
        id: 'chapter-4-1',
        title: 'Effective Communication',
        duration: '3 hours'
      },
      {
        id: 'chapter-4-2',
        title: 'Team Building',
        duration: '3 hours'
      },
      {
        id: 'chapter-4-3',
        title: 'Conflict Resolution',
        duration: '3 hours'
      },
      {
        id: 'chapter-4-4',
        title: 'Performance Management',
        duration: '3 hours'
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Cloud Computing with AWS',
    description: 'Learn to design, deploy, and manage applications on Amazon Web Services.',
    instructor: 'David Wilson',
    duration: '18 hours',
    level: 'Intermediate',
    rating: 4.6,
    reviews: 1123,
    enrolled: 7654,
    thumbnail: '/images/courses/aws.jpg',
    categories: ['Cloud Computing', 'AWS', 'DevOps'],
    skills: ['AWS', 'Cloud Architecture', 'Serverless', 'Infrastructure as Code'],
    chapters: [
      {
        id: 'chapter-5-1',
        title: 'AWS Fundamentals',
        duration: '4 hours'
      },
      {
        id: 'chapter-5-2',
        title: 'Compute Services',
        duration: '4 hours'
      },
      {
        id: 'chapter-5-3',
        title: 'Storage and Database Services',
        duration: '5 hours'
      },
      {
        id: 'chapter-5-4',
        title: 'Serverless Architecture',
        duration: '5 hours'
      }
    ]
  }
];
