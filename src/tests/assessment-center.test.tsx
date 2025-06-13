/**
 * Assessment center tests for SkillOS platform
 * 
 * Tests the assessment creation, assignment, and management flows
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssessmentCenterPage } from '@/app/platform/assessments/custom-center/page';
import { AuthProvider } from '@/lib/auth/context';
import { CacheEventProvider } from '@/lib/cache';
import { ToastProvider } from '@/components/ui/toast';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    pathname: '/platform/assessments/custom-center',
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

describe('Assessment Center Flow', () => {
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

  test('Assessment center renders correctly with all assessments', async () => {
    renderWithProviders(<AssessmentCenterPage />);
    
    // Check for page title
    await waitFor(() => {
      expect(screen.getByText(/assessment center/i)).toBeInTheDocument();
    });
    
    // Check for assessment creation options
    expect(screen.getByText(/create new assessment/i)).toBeInTheDocument();
    
    // Check for assessment table headers
    expect(screen.getByText(/assessment title/i)).toBeInTheDocument();
    expect(screen.getByText(/type/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/due date/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();
    
    // Check for assessment items
    await waitFor(() => {
      expect(screen.getByText(/360-degree feedback/i)).toBeInTheDocument();
      expect(screen.getByText(/technical skills assessment/i)).toBeInTheDocument();
      expect(screen.getByText(/learning retention quiz/i)).toBeInTheDocument();
    });
  });

  test('Assessment filtering works correctly', async () => {
    renderWithProviders(<AssessmentCenterPage />);
    
    // Wait for assessments to load
    await waitFor(() => {
      expect(screen.getByText(/360-degree feedback/i)).toBeInTheDocument();
    });
    
    // Filter by type
    const typeFilter = screen.getByLabelText(/filter by type/i);
    fireEvent.change(typeFilter, { target: { value: 'technical' } });
    
    // Check that only technical assessments are shown
    await waitFor(() => {
      expect(screen.queryByText(/360-degree feedback/i)).not.toBeInTheDocument();
      expect(screen.getByText(/technical skills assessment/i)).toBeInTheDocument();
      expect(screen.queryByText(/learning retention quiz/i)).not.toBeInTheDocument();
    });
    
    // Filter by status
    const statusFilter = screen.getByLabelText(/filter by status/i);
    fireEvent.change(statusFilter, { target: { value: 'overdue' } });
    
    // Check that only overdue assessments are shown
    await waitFor(() => {
      expect(screen.queryByText(/technical skills assessment/i)).not.toBeInTheDocument();
      expect(screen.getByText(/learning retention quiz/i)).toBeInTheDocument();
    });
  });

  test('Assessment search works correctly', async () => {
    renderWithProviders(<AssessmentCenterPage />);
    
    // Wait for assessments to load
    await waitFor(() => {
      expect(screen.getByText(/360-degree feedback/i)).toBeInTheDocument();
    });
    
    // Search for "technical"
    const searchInput = screen.getByPlaceholderText(/search assessments/i);
    fireEvent.change(searchInput, { target: { value: 'technical' } });
    
    // Check that only technical assessments are shown
    await waitFor(() => {
      expect(screen.queryByText(/360-degree feedback/i)).not.toBeInTheDocument();
      expect(screen.getByText(/technical skills assessment/i)).toBeInTheDocument();
      expect(screen.queryByText(/learning retention quiz/i)).not.toBeInTheDocument();
    });
  });

  test('Assessment creation flow works correctly', async () => {
    renderWithProviders(<AssessmentCenterPage />);
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText(/create new assessment/i)).toBeInTheDocument();
    });
    
    // Click create new assessment button
    fireEvent.click(screen.getByText(/create new assessment/i));
    
    // Check that creation options are shown
    await waitFor(() => {
      expect(screen.getByText(/custom assessment/i)).toBeInTheDocument();
      expect(screen.getByText(/use ai to generate/i)).toBeInTheDocument();
      expect(screen.getByText(/browse pre-made assessments/i)).toBeInTheDocument();
    });
    
    // Select custom assessment option
    fireEvent.click(screen.getByText(/custom assessment/i));
    
    // Check that assessment form is shown
    await waitFor(() => {
      expect(screen.getByLabelText(/assessment title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/assessment type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    });
    
    // Fill out assessment form
    fireEvent.change(screen.getByLabelText(/assessment title/i), {
      target: { value: 'New Test Assessment' },
    });
    
    fireEvent.change(screen.getByLabelText(/assessment type/i), {
      target: { value: '360-degree' },
    });
    
    fireEvent.change(screen.getByLabelText(/due date/i), {
      target: { value: '2025-07-15' },
    });
    
    // Add a question
    fireEvent.click(screen.getByText(/add question/i));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/question text/i)).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByLabelText(/question text/i), {
      target: { value: 'How would you rate this person\'s communication skills?' },
    });
    
    fireEvent.change(screen.getByLabelText(/question type/i), {
      target: { value: 'rating' },
    });
    
    // Save assessment
    fireEvent.click(screen.getByText(/save assessment/i));
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/assessment created successfully/i)).toBeInTheDocument();
    });
  });

  test('Assessment actions work correctly', async () => {
    renderWithProviders(<AssessmentCenterPage />);
    
    // Wait for assessments to load
    await waitFor(() => {
      expect(screen.getByText(/360-degree feedback/i)).toBeInTheDocument();
    });
    
    // Find and click view button for an assessment
    const viewButtons = screen.getAllByText(/view/i);
    fireEvent.click(viewButtons[0]);
    
    // Check that assessment details are shown
    await waitFor(() => {
      expect(screen.getByText(/assessment details/i)).toBeInTheDocument();
      expect(screen.getByText(/assigned to/i)).toBeInTheDocument();
    });
    
    // Go back to assessment list
    fireEvent.click(screen.getByText(/back to list/i));
    
    // Find and click edit button for an assessment
    const editButtons = screen.getAllByText(/edit/i);
    fireEvent.click(editButtons[0]);
    
    // Check that edit form is shown
    await waitFor(() => {
      expect(screen.getByLabelText(/assessment title/i)).toBeInTheDocument();
      expect(screen.getByText(/save changes/i)).toBeInTheDocument();
    });
  });
});
