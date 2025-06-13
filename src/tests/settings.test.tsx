/**
 * Settings page tests for SkillOS platform
 * 
 * Tests the settings configuration, organization settings, and user preferences
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SettingsPage } from '@/app/platform/settings/page';
import { AuthProvider } from '@/lib/auth/context';
import { CacheEventProvider } from '@/lib/cache';
import { ToastProvider } from '@/components/ui/toast';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    pathname: '/platform/settings',
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

describe('Settings Page Flow', () => {
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

  test('Settings page renders correctly with all sections', async () => {
    renderWithProviders(<SettingsPage />);
    
    // Check for page title
    await waitFor(() => {
      expect(screen.getByText(/settings/i)).toBeInTheDocument();
    });
    
    // Check for settings sections
    expect(screen.getByText(/organization settings/i)).toBeInTheDocument();
    expect(screen.getByText(/user preferences/i)).toBeInTheDocument();
    expect(screen.getByText(/api configuration/i)).toBeInTheDocument();
    expect(screen.getByText(/notification settings/i)).toBeInTheDocument();
  });

  test('Organization settings can be updated', async () => {
    renderWithProviders(<SettingsPage />);
    
    // Wait for settings to load
    await waitFor(() => {
      expect(screen.getByLabelText(/organization name/i)).toBeInTheDocument();
    });
    
    // Update organization name
    fireEvent.change(screen.getByLabelText(/organization name/i), {
      target: { value: 'Updated Organization Name' },
    });
    
    // Save changes
    const saveButtons = screen.getAllByText(/save changes/i);
    fireEvent.click(saveButtons[0]);
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/organization settings updated successfully/i)).toBeInTheDocument();
    });
  });

  test('Theme settings can be changed', async () => {
    renderWithProviders(<SettingsPage />);
    
    // Wait for settings to load
    await waitFor(() => {
      expect(screen.getByLabelText(/theme/i)).toBeInTheDocument();
    });
    
    // Change theme to light
    fireEvent.change(screen.getByLabelText(/theme/i), {
      target: { value: 'light' },
    });
    
    // Check that theme preview updates
    expect(screen.getByText(/light theme preview/i)).toBeInTheDocument();
    
    // Save changes
    const saveButtons = screen.getAllByText(/save changes/i);
    fireEvent.click(saveButtons[1]);
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/user preferences updated successfully/i)).toBeInTheDocument();
    });
  });

  test('API configuration can be updated', async () => {
    renderWithProviders(<SettingsPage />);
    
    // Wait for settings to load
    await waitFor(() => {
      expect(screen.getByLabelText(/api key/i)).toBeInTheDocument();
    });
    
    // Update API key
    fireEvent.change(screen.getByLabelText(/api key/i), {
      target: { value: 'new-api-key-12345' },
    });
    
    // Save changes
    const saveButtons = screen.getAllByText(/save changes/i);
    fireEvent.click(saveButtons[2]);
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/api configuration updated successfully/i)).toBeInTheDocument();
    });
  });

  test('Notification settings can be updated', async () => {
    renderWithProviders(<SettingsPage />);
    
    // Wait for settings to load
    await waitFor(() => {
      expect(screen.getByLabelText(/email notifications/i)).toBeInTheDocument();
    });
    
    // Toggle email notifications
    fireEvent.click(screen.getByLabelText(/email notifications/i));
    
    // Toggle browser notifications
    fireEvent.click(screen.getByLabelText(/browser notifications/i));
    
    // Save changes
    const saveButtons = screen.getAllByText(/save changes/i);
    fireEvent.click(saveButtons[3]);
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/notification settings updated successfully/i)).toBeInTheDocument();
    });
  });

  test('Language can be changed', async () => {
    renderWithProviders(<SettingsPage />);
    
    // Wait for settings to load
    await waitFor(() => {
      expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
    });
    
    // Change language to Spanish
    fireEvent.change(screen.getByLabelText(/language/i), {
      target: { value: 'es' },
    });
    
    // Save changes
    const saveButtons = screen.getAllByText(/save changes/i);
    fireEvent.click(saveButtons[1]);
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/user preferences updated successfully/i)).toBeInTheDocument();
    });
    
    // Note: We can't fully test language change in this environment,
    // but we can verify the setting is saved
  });
});
