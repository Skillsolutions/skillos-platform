/**
 * Reports module tests for SkillOS platform
 * 
 * Tests the reports viewing, generation, and interaction flows
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReportsPage } from '@/app/platform/reports/page';
import { AuthProvider } from '@/lib/auth/context';
import { CacheEventProvider } from '@/lib/cache';
import { ToastProvider } from '@/components/ui/toast';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    pathname: '/platform/reports',
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

describe('Reports Module Flow', () => {
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

  test('Reports page renders correctly with all reports', async () => {
    renderWithProviders(<ReportsPage />);
    
    // Check for page title
    await waitFor(() => {
      expect(screen.getByText(/reports/i)).toBeInTheDocument();
    });
    
    // Check for report generation options
    expect(screen.getByText(/generate new report/i)).toBeInTheDocument();
    
    // Check for reports list
    await waitFor(() => {
      expect(screen.getByText(/learning engagement q2 2025/i)).toBeInTheDocument();
      expect(screen.getByText(/skills gap analysis - engineering team/i)).toBeInTheDocument();
      expect(screen.getByText(/roi analysis - leadership training program/i)).toBeInTheDocument();
    });
    
    // Check for report types
    expect(screen.getByText(/engagement/i)).toBeInTheDocument();
    expect(screen.getByText(/skills-gap/i)).toBeInTheDocument();
    expect(screen.getByText(/roi/i)).toBeInTheDocument();
  });

  test('Report filtering works correctly', async () => {
    renderWithProviders(<ReportsPage />);
    
    // Wait for reports to load
    await waitFor(() => {
      expect(screen.getByText(/learning engagement q2 2025/i)).toBeInTheDocument();
    });
    
    // Filter by type
    const typeFilter = screen.getByLabelText(/filter by type/i);
    fireEvent.change(typeFilter, { target: { value: 'roi' } });
    
    // Check that only ROI reports are shown
    await waitFor(() => {
      expect(screen.queryByText(/learning engagement q2 2025/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/skills gap analysis - engineering team/i)).not.toBeInTheDocument();
      expect(screen.getByText(/roi analysis - leadership training program/i)).toBeInTheDocument();
    });
  });

  test('Report search works correctly', async () => {
    renderWithProviders(<ReportsPage />);
    
    // Wait for reports to load
    await waitFor(() => {
      expect(screen.getByText(/learning engagement q2 2025/i)).toBeInTheDocument();
    });
    
    // Search for "engineering"
    const searchInput = screen.getByPlaceholderText(/search reports/i);
    fireEvent.change(searchInput, { target: { value: 'engineering' } });
    
    // Check that only engineering reports are shown
    await waitFor(() => {
      expect(screen.queryByText(/learning engagement q2 2025/i)).not.toBeInTheDocument();
      expect(screen.getByText(/skills gap analysis - engineering team/i)).toBeInTheDocument();
      expect(screen.queryByText(/roi analysis - leadership training program/i)).not.toBeInTheDocument();
    });
  });

  test('Report generation flow works correctly', async () => {
    renderWithProviders(<ReportsPage />);
    
    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText(/generate new report/i)).toBeInTheDocument();
    });
    
    // Click generate new report button
    fireEvent.click(screen.getByText(/generate new report/i));
    
    // Check that report type selection is shown
    await waitFor(() => {
      expect(screen.getByText(/select report type/i)).toBeInTheDocument();
      expect(screen.getByText(/engagement report/i)).toBeInTheDocument();
      expect(screen.getByText(/skills gap analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/roi analysis/i)).toBeInTheDocument();
    });
    
    // Select engagement report
    fireEvent.click(screen.getByText(/engagement report/i));
    
    // Check that report form is shown
    await waitFor(() => {
      expect(screen.getByLabelText(/report title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time period/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    });
    
    // Fill out report form
    fireEvent.change(screen.getByLabelText(/report title/i), {
      target: { value: 'New Engagement Report' },
    });
    
    fireEvent.change(screen.getByLabelText(/time period/i), {
      target: { value: 'Q2 2025' },
    });
    
    fireEvent.change(screen.getByLabelText(/department/i), {
      target: { value: 'Marketing' },
    });
    
    // Generate report
    fireEvent.click(screen.getByText(/generate report/i));
    
    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText(/generating report/i)).toBeInTheDocument();
    });
    
    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/report generated successfully/i)).toBeInTheDocument();
    });
  });

  test('Report viewing works correctly', async () => {
    renderWithProviders(<ReportsPage />);
    
    // Wait for reports to load
    await waitFor(() => {
      expect(screen.getByText(/learning engagement q2 2025/i)).toBeInTheDocument();
    });
    
    // Click on a report
    fireEvent.click(screen.getByText(/learning engagement q2 2025/i));
    
    // Check that report details are shown
    await waitFor(() => {
      expect(screen.getByText(/report details/i)).toBeInTheDocument();
      expect(screen.getByText(/course completion rate/i)).toBeInTheDocument();
      expect(screen.getByText(/78%/i)).toBeInTheDocument();
      expect(screen.getByText(/active learners/i)).toBeInTheDocument();
      expect(screen.getByText(/425/i)).toBeInTheDocument();
    });
    
    // Check for summary and recommendations
    expect(screen.getByText(/overall learning engagement has increased/i)).toBeInTheDocument();
    expect(screen.getByText(/implement micro-learning modules/i)).toBeInTheDocument();
  });

  test('AI-generated report summaries display correctly', async () => {
    renderWithProviders(<ReportsPage />);
    
    // Wait for reports to load
    await waitFor(() => {
      expect(screen.getByText(/learning engagement q2 2025/i)).toBeInTheDocument();
    });
    
    // Click on ROI report
    fireEvent.click(screen.getByText(/roi analysis - leadership training program/i));
    
    // Check that AI-generated summary is shown
    await waitFor(() => {
      expect(screen.getByText(/the leadership excellence program has demonstrated exceptional return on investment/i)).toBeInTheDocument();
    });
    
    // Check for AI badge on summary
    expect(screen.getByText(/ai-generated summary/i)).toBeInTheDocument();
  });
});
