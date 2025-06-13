/**
 * Mock data for assessments in SkillOS platform tests
 */

export const mockAssessments = [
  {
    id: 'assessment-1',
    title: '360-Degree Feedback',
    type: '360-degree',
    status: 'active',
    dueDate: '2025-06-30',
    assignedTo: [
      {
        id: 'user-3',
        name: 'Learner User',
        email: 'learner@skillos.com',
        status: 'pending'
      }
    ],
    createdBy: {
      id: 'user-2',
      name: 'Manager User'
    },
    createdAt: '2025-06-01T10:00:00Z',
    questions: [
      {
        id: 'q1',
        text: 'How effectively does this person communicate with team members?',
        type: 'rating',
        options: [
          { value: 1, label: 'Poor' },
          { value: 2, label: 'Below Average' },
          { value: 3, label: 'Average' },
          { value: 4, label: 'Good' },
          { value: 5, label: 'Excellent' }
        ]
      },
      {
        id: 'q2',
        text: 'How well does this person handle challenging situations?',
        type: 'rating',
        options: [
          { value: 1, label: 'Poor' },
          { value: 2, label: 'Below Average' },
          { value: 3, label: 'Average' },
          { value: 4, label: 'Good' },
          { value: 5, label: 'Excellent' }
        ]
      },
      {
        id: 'q3',
        text: 'What are this person\'s greatest strengths?',
        type: 'text'
      },
      {
        id: 'q4',
        text: 'What areas could this person improve in?',
        type: 'text'
      }
    ]
  },
  {
    id: 'assessment-2',
    title: 'Technical Skills Assessment',
    type: 'technical',
    status: 'active',
    dueDate: '2025-06-28',
    assignedTo: [
      {
        id: 'user-3',
        name: 'Learner User',
        email: 'learner@skillos.com',
        status: 'in-progress'
      }
    ],
    createdBy: {
      id: 'user-2',
      name: 'Manager User'
    },
    createdAt: '2025-06-02T14:30:00Z',
    questions: [
      {
        id: 'q1',
        text: 'Explain the difference between REST and GraphQL APIs.',
        type: 'text'
      },
      {
        id: 'q2',
        text: 'Which of the following are valid HTTP methods?',
        type: 'multiple-choice',
        options: [
          { value: 'get', label: 'GET' },
          { value: 'post', label: 'POST' },
          { value: 'delete', label: 'DELETE' },
          { value: 'update', label: 'UPDATE' },
          { value: 'patch', label: 'PATCH' }
        ],
        correctAnswers: ['get', 'post', 'delete', 'patch']
      },
      {
        id: 'q3',
        text: 'Write a function that reverses a string without using built-in reverse methods.',
        type: 'code',
        language: 'javascript'
      }
    ]
  },
  {
    id: 'assessment-3',
    title: 'Learning Retention Quiz',
    type: 'quiz',
    status: 'overdue',
    dueDate: '2025-05-30',
    assignedTo: [
      {
        id: 'user-3',
        name: 'Learner User',
        email: 'learner@skillos.com',
        status: 'not-started'
      }
    ],
    createdBy: {
      id: 'user-2',
      name: 'Manager User'
    },
    createdAt: '2025-05-15T09:00:00Z',
    questions: [
      {
        id: 'q1',
        text: 'What is the primary benefit of using React hooks?',
        type: 'single-choice',
        options: [
          { value: 'a', label: 'They make code more complex' },
          { value: 'b', label: 'They allow functional components to use state and lifecycle features' },
          { value: 'c', label: 'They are required for all React applications' },
          { value: 'd', label: 'They replace the need for components entirely' }
        ],
        correctAnswer: 'b'
      },
      {
        id: 'q2',
        text: 'Which hook would you use to perform side effects in a functional component?',
        type: 'single-choice',
        options: [
          { value: 'a', label: 'useState' },
          { value: 'b', label: 'useReducer' },
          { value: 'c', label: 'useEffect' },
          { value: 'd', label: 'useContext' }
        ],
        correctAnswer: 'c'
      }
    ]
  }
];
