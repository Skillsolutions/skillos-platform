/**
 * User management tests for SkillOS platform
 * 
 * Tests the user listing, creation, editing, and role management flows
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TeamManagementPage } from '@/app/platform/team-management/page';
import { AuthProvider } from '@/lib/auth/context';
import { CacheEventProvider } from '@/lib/cache';
import { ToastProvider } from '@/components/ui/toast';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    pathname: '/platform/team-management',
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

describe('User Management Flow', () => {
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

  test('Team management page renders correctly with all users', async () => {
    renderWithProviders(<TeamManagementPage />);
    
    // Check for page title
    await waitFor(() => {
      expect(screen.getByText(/team management/i)).toBeInTheDocument();
    });
    
    // Check for user management actions
    expect(screen.getByText(/add new user/i)).toBeInTheDocument();
    expect(screen.getByText(/import users/i)).toBeInTheDocument();
    
    // Check for user table headers
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/role/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();
    
    // Check for user entries
    await waitFor(() => {
      expect(screen.getByText(/admin user/i)).toBeInTheDocument();
      expect(screen.getByText(/manager user/i)).toBeInTheDocument();
      expect(screen.getByText(/learner user/i)).toBeInTheDocument();
    });
    
    // Check for user emails
    expect(screen.getByText(/admin@skillos.com/i)).toBeInTheDocument();
    expect(screen.getByText(/manager@skillos.com/i)).toBeInTheDocument();
    expect(screen.getByText(/learner@skillos.com/i)).toBeInTheDocument();
  });

  test('User filtering works correctly', async () => {
    renderWithProviders(<TeamManagementPage />);
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText(/admin user/i)).toBeInTheDocument();
    });
    
    // Filter by role
    const roleFilter = screen.getByLabelText(/filter by role/i);
    fireEvent.change(roleFilter, { target: { value: 'manager' } });
    
    // Check that only managers are shown
    await waitFor(() => {
      expect(screen.queryByText(/admin user/i)).not.toBeInTheDocument();
      expect(screen.getByText(/manager user/i)).toBeInTheDocument();
      expect(screen.queryByText(/learner user/i)).not.toBeInTheDocument();
    });
  });

  test('User search works correctly', async () => {
    renderWithProviders(<TeamManagementPage />);
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText(/admin user/i)).toBeInTheDocument();
    });
    
    // Search for "learner"
    const searchInput = screen.getByPlaceholderText(/search users/i);
    fireEvent.change(searchInput, { target: { value: 'learner' } });
    
    // Check that only learner users are shown
    await waitFor(() => {
      expect(screen.queryByText(/admin user/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/manager user/i)).not.toBeInTheDocument();
      expect(screen.getByText(/learner user/i)).toBeInTheDocument();
    });
  });

  test('User creation flow works correctly', async () => {
    renderWithProviders(<TeamManagementPage />);
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();
    });
    
    // Click add new user button
    fireEvent.click(screen.getByText(/add new user/i));
    
    // Check that user form is shown
    await waitFor(() => {
      expect(screen.getByText(/create new user/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    });
    
    // Fill out user form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Test User' },
    });
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@skillos.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: 'learner' },
    });
    
    // Submit form
    fireEvent.click(screen.getByText(/create user/i));
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/user created successfully/i)).toBeInTheDocument();
    });
    
    // Check that new user appears in the list
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    expect(screen.getByText(/test@skillos.com/i)).toBeInTheDocument();
  });

  test('User editing flow works correctly', async () => {
    renderWithProviders(<TeamManagementPage />);
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText(/learner user/i)).toBeInTheDocument();
    });
    
    // Find and click edit button for a user
    const editButtons = screen.getAllByText(/edit/i);
    fireEvent.click(editButtons[2]); // Edit learner user
    
    // Check that edit form is shown
    await waitFor(() => {
      expect(screen.getByText(/edit user/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toHaveValue('Learner User');
      expect(screen.getByLabelText(/email address/i)).toHaveValue('learner@skillos.com');
      expect(screen.getByLabelText(/role/i)).toHaveValue('learner');
    });
    
    // Change user role
    fireEvent.change(screen.getByLabelText(/role/i), {
      target: { value: 'manager' },
    });
    
    // Save changes
    fireEvent.click(screen.getByText(/save changes/i));
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/user updated successfully/i)).toBeInTheDocument();
    });
    
    // Check that user role has been updated
    expect(screen.getAllByText(/manager/i)[1]).toBeInTheDocument();
  });

  test('User deletion flow works correctly', async () => {
    renderWithProviders(<TeamManagementPage />);
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText(/learner user/i)).toBeInTheDocument();
    });
    
    // Count initial number of users
    const initialUserCount = screen.getAllByText(/edit/i).length;
    
    // Find and click delete button for a user
    const deleteButtons = screen.getAllByText(/delete/i);
    fireEvent.click(deleteButtons[2]); // Delete learner user
    
    // Check that confirmation dialog is shown
    await waitFor(() => {
      expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();
      expect(screen.getByText(/are you sure you want to delete this user/i)).toBeInTheDocument();
    });
    
    // Confirm deletion
    fireEvent.click(screen.getByText(/confirm/i));
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/user deleted successfully/i)).toBeInTheDocument();
    });
    
    // Check that user has been removed from the list
    const finalUserCount = screen.getAllByText(/edit/i).length;
    expect(finalUserCount).toBe(initialUserCount - 1);
    expect(screen.queryByText(/learner user/i)).not.toBeInTheDocument();
  });
});
