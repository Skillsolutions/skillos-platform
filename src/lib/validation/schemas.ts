import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const employeeIdSchema = z.string()
  .min(3, 'Employee ID must be at least 3 characters')
  .max(20, 'Employee ID must be less than 20 characters')
  .regex(/^[A-Z0-9-]+$/, 'Employee ID can only contain uppercase letters, numbers, and hyphens');

export const departmentSchema = z.string()
  .min(2, 'Department must be at least 2 characters')
  .max(50, 'Department must be less than 50 characters');

export const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
  .optional();

// User validation schemas
export const userRegistrationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  employeeId: employeeIdSchema,
  department: departmentSchema,
  role: z.enum(['admin', 'manager', 'learner'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  phone: phoneSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const userUpdateSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  employeeId: employeeIdSchema.optional(),
  department: departmentSchema.optional(),
  phone: phoneSchema,
}).partial();

// Assessment validation schemas
export const assessmentSchema = z.object({
  title: z.string()
    .min(3, 'Assessment title must be at least 3 characters')
    .max(100, 'Assessment title must be less than 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  type: z.enum(['360-feedback', 'technical', 'skills-gap', 'retention', 'soft-skills'], {
    errorMap: () => ({ message: 'Please select a valid assessment type' })
  }),
  duration: z.number()
    .min(5, 'Assessment duration must be at least 5 minutes')
    .max(180, 'Assessment duration must be less than 180 minutes'),
  passingScore: z.number()
    .min(0, 'Passing score must be at least 0%')
    .max(100, 'Passing score must be at most 100%'),
  questions: z.array(z.object({
    id: z.string(),
    text: z.string().min(10, 'Question text must be at least 10 characters'),
    type: z.enum(['multiple-choice', 'true-false', 'short-answer', 'scenario']),
    options: z.array(z.string()).optional(),
    correctAnswer: z.string().optional(),
    points: z.number().min(1, 'Question must be worth at least 1 point'),
  })).min(1, 'Assessment must have at least one question'),
});

// Course validation schemas
export const courseSchema = z.object({
  title: z.string()
    .min(3, 'Course title must be at least 3 characters')
    .max(100, 'Course title must be less than 100 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z.string()
    .min(2, 'Category is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Please select a valid difficulty level' })
  }),
  duration: z.number()
    .min(30, 'Course duration must be at least 30 minutes')
    .max(2400, 'Course duration must be less than 40 hours'),
  skills: z.array(z.string())
    .min(1, 'Course must have at least one skill tag'),
  prerequisites: z.array(z.string()).optional(),
});

// Report validation schemas
export const reportSchema = z.object({
  title: z.string()
    .min(3, 'Report title must be at least 3 characters')
    .max(100, 'Report title must be less than 100 characters'),
  type: z.enum(['engagement', 'completion', 'skills-gap', 'roi', 'performance'], {
    errorMap: () => ({ message: 'Please select a valid report type' })
  }),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).refine((data) => data.end > data.start, {
    message: 'End date must be after start date',
    path: ['end'],
  }),
  filters: z.object({
    departments: z.array(z.string()).optional(),
    roles: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
  }).optional(),
});

// Settings validation schemas
export const organizationSettingsSchema = z.object({
  name: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be less than 100 characters'),
  domain: z.string()
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, 'Please enter a valid domain'),
  timezone: z.string()
    .min(1, 'Timezone is required'),
  language: z.enum(['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'], {
    errorMap: () => ({ message: 'Please select a valid language' })
  }),
  features: z.object({
    assessments: z.boolean(),
    reports: z.boolean(),
    ai: z.boolean(),
    integrations: z.boolean(),
  }),
});

// Search validation schemas
export const searchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters'),
  filters: z.object({
    type: z.enum(['courses', 'assessments', 'users', 'reports']).optional(),
    category: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    department: z.string().optional(),
  }).optional(),
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine((file) => ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/csv'].includes(file.type), 
      'File type must be JPEG, PNG, GIF, PDF, or CSV'),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
});

// Export all schemas
export const validationSchemas = {
  user: {
    registration: userRegistrationSchema,
    login: userLoginSchema,
    update: userUpdateSchema,
  },
  assessment: assessmentSchema,
  course: courseSchema,
  report: reportSchema,
  settings: organizationSettingsSchema,
  search: searchSchema,
  fileUpload: fileUploadSchema,
  common: {
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
    employeeId: employeeIdSchema,
    department: departmentSchema,
    phone: phoneSchema,
  },
};

export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type Assessment = z.infer<typeof assessmentSchema>;
export type Course = z.infer<typeof courseSchema>;
export type Report = z.infer<typeof reportSchema>;
export type OrganizationSettings = z.infer<typeof organizationSettingsSchema>;
export type Search = z.infer<typeof searchSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;

