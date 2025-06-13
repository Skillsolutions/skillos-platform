/**
 * Mock server setup for SkillOS platform tests
 * 
 * This file configures the MSW (Mock Service Worker) server
 * to intercept API requests during tests.
 */

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { mockUsers } from './data/users';
import { mockCourses } from './data/courses';
import { mockAssessments } from './data/assessments';
import { mockReports } from './data/reports';

// Create mock server
export const server = setupServer(
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as any;
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return HttpResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }),
  
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // For testing, we'll return the first user as the authenticated user
    const user = mockUsers[0];
    
    return HttpResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  }),
  
  // User endpoints
  http.get('/api/users', () => {
    return HttpResponse.json(mockUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })));
  }),
  
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  }),
  
  // Course endpoints
  http.get('/api/courses', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const category = url.searchParams.get('category');
    
    let filteredCourses = [...mockCourses];
    
    if (category) {
      filteredCourses = filteredCourses.filter(course => 
        course.categories.includes(category)
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      courses: paginatedCourses,
      pagination: {
        total: filteredCourses.length,
        page,
        limit,
        pages: Math.ceil(filteredCourses.length / limit)
      }
    });
  }),
  
  http.get('/api/courses/:id', ({ params }) => {
    const { id } = params;
    const course = mockCourses.find(c => c.id === id);
    
    if (!course) {
      return HttpResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(course);
  }),
  
  // Assessment endpoints
  http.get('/api/assessments', () => {
    return HttpResponse.json(mockAssessments);
  }),
  
  http.post('/api/assessments', async ({ request }) => {
    const assessment = await request.json() as any;
    
    return HttpResponse.json({
      ...assessment,
      id: `assessment-${Date.now()}`,
      createdAt: new Date().toISOString()
    }, { status: 201 });
  }),
  
  http.get('/api/assessments/:id', ({ params }) => {
    const { id } = params;
    const assessment = mockAssessments.find(a => a.id === id);
    
    if (!assessment) {
      return HttpResponse.json(
        { message: 'Assessment not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(assessment);
  }),
  
  // Report endpoints
  http.get('/api/reports', () => {
    return HttpResponse.json(mockReports);
  }),
  
  http.get('/api/reports/:id', ({ params }) => {
    const { id } = params;
    const report = mockReports.find(r => r.id === id);
    
    if (!report) {
      return HttpResponse.json(
        { message: 'Report not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(report);
  }),
  
  // Settings endpoints
  http.get('/api/settings', () => {
    return HttpResponse.json({
      organizationName: 'SkillOS Demo Organization',
      theme: 'dark',
      language: 'en',
      features: {
        assessments: true,
        reports: true,
        ai: true
      }
    });
  }),
  
  http.put('/api/settings', async ({ request }) => {
    const settings = await request.json() as any;
    
    return HttpResponse.json(settings);
  })
);
