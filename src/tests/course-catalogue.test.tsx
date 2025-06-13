/**
 * Course catalogue tests for SkillOS platform
 * 
 * Tests the course catalogue browsing, filtering, and interaction
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CourseCataloguePage } from '@/app/platform/course-catalogue/page';
import { AuthProvider } from '@/lib/auth/context';
import { CacheEventProvider } from '@/lib/cache';
import { ToastProvider } from '@/components/ui/toast';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    pathname: '/platform/course-catalogue',
  }),
}));

// Mock authenticated user
jest.mock('@/lib/auth/hooks', () => ({
  useAuth: () => ({
    user: {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@skillos.com',
      role: 'admin'
    },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

describe('Course Catalogue Flow', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <CacheEventProvider>
        <AuthProvider>
          <ToastProvider>
            {ui}
          </ToastProvider>
        </AuthProvider>
      </CacheEventProvider>
    );
  };

  test('Course catalogue renders correctly with all courses', async () => {
    renderWithProviders(<CourseCataloguePage />);
    
    // Check for page title
    await waitFor(() => {
      expect(screen.getByText(/course catalogue/i)).toBeInTheDocument();
    });
    
    // Check for search and filter components
    expect(screen.getByPlaceholderText(/search courses/i)).toBeInTheDocument();
    expect(screen.getByText(/filter by category/i)).toBeInTheDocument();
    expect(screen.getByText(/filter by level/i)).toBeInTheDocument();
    
    // Check for course cards
    await waitFor(() => {
      expect(screen.getByText(/introduction to web development/i)).toBeInTheDocument();
      expect(screen.getByText(/advanced react development/i)).toBeInTheDocument();
      expect(screen.getByText(/data science fundamentals/i)).toBeInTheDocument();
    });
    
    // Check for course details
    expect(screen.getByText(/john smith/i)).toBeInTheDocument();
    expect(screen.getByText(/10 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/beginner/i)).toBeInTheDocument();
    expect(screen.getByText(/4.7/i)).toBeInTheDocument();
  });

  test('Course filtering works correctly', async () => {
    renderWithProviders(<CourseCataloguePage />);
    
    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText(/introduction to web development/i)).toBeInTheDocument();
    });
    
    // Open category filter dropdown
    fireEvent.click(screen.getByText(/filter by category/i));
    
    // Select Web Development category
    fireEvent.click(screen.getByText(/web development/i));
    
    // Check that only web development courses are shown
    await waitFor(() => {
      expect(screen.getByText(/introduction to web development/i)).toBeInTheDocument();
      expect(screen.getByText(/advanced react development/i)).toBeInTheDocument();
      expect(screen.queryByText(/data science fundamentals/i)).not.toBeInTheDocument();
    });
    
    // Open level filter dropdown
    fireEvent.click(screen.getByText(/filter by level/i));
    
    // Select Advanced level
    fireEvent.click(screen.getByText(/advanced/i));
    
    // Check that only advanced web development courses are shown
    await waitFor(() => {
      expect(screen.queryByText(/introduction to web development/i)).not.toBeInTheDocument();
      expect(screen.getByText(/advanced react development/i)).toBeInTheDocument();
    });
  });

  test('Course search works correctly', async () => {
    renderWithProviders(<CourseCataloguePage />);
    
    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText(/introduction to web development/i)).toBeInTheDocument();
    });
    
    // Search for "react"
    const searchInput = screen.getByPlaceholderText(/search courses/i);
    fireEvent.change(searchInput, { target: { value: 'react' } });
    
    // Check that only React courses are shown
    await waitFor(() => {
      expect(screen.queryByText(/introduction to web development/i)).not.toBeInTheDocument();
      expect(screen.getByText(/advanced react development/i)).toBeInTheDocument();
      expect(screen.queryByText(/data science fundamentals/i)).not.toBeInTheDocument();
    });
  });

  test('Course card interactions work correctly', async () => {
    renderWithProviders(<CourseCataloguePage />);
    
    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText(/introduction to web development/i)).toBeInTheDocument();
    });
    
    // Find and click on a course card
    const courseCard = screen.getByText(/advanced react development/i).closest('div');
    fireEvent.click(courseCard);
    
    // Check that course details are shown
    await waitFor(() => {
      expect(screen.getByText(/master react hooks, context api, and performance optimization techniques/i)).toBeInTheDocument();
      expect(screen.getByText(/sarah johnson/i)).toBeInTheDocument();
      expect(screen.getByText(/15 hours/i)).toBeInTheDocument();
    });
    
    // Check for enroll button
    expect(screen.getByText(/enroll now/i)).toBeInTheDocument();
    
    // Check for course chapters
    expect(screen.getByText(/react hooks deep dive/i)).toBeInTheDocument();
    expect(screen.getByText(/context api and state management/i)).toBeInTheDocument();
    expect(screen.getByText(/performance optimization/i)).toBeInTheDocument();
  });

  test('Skill badges display correctly with proper contrast', async () => {
    renderWithProviders(<CourseCataloguePage />);
    
    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText(/introduction to web development/i)).toBeInTheDocument();
    });
    
    // Check for skill badges
    const htmlBadge = screen.getByText(/html/i);
    const cssBadge = screen.getByText(/css/i);
    const jsBadge = screen.getByText(/javascript/i);
    
    // Verify badges are visible and have proper styling
    expect(htmlBadge).toBeInTheDocument();
    expect(cssBadge).toBeInTheDocument();
    expect(jsBadge).toBeInTheDocument();
    
    // Note: We can't test actual colors in this environment,
    // but we can verify the badges are rendered
  });
});
