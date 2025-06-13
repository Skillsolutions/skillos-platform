/**
 * Dashboard navigation tests for SkillOS platform
 * 
 * Tests the dashboard layout, navigation, and key components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DashboardPage } from '@/app/platform/dashboard/page';
import { AuthProvider } from '@/lib/auth/context';
import { CacheEventProvider } from '@/lib/cache';
import { ToastProvider } from '@/components/ui/toast';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    pathname: '/platform/dashboard',
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

describe('Dashboard Navigation Flow', () => {
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

  test('Dashboard renders correctly with all key metrics', async () => {
    renderWithProviders(<DashboardPage />);
    
    // Check for welcome message
    await waitFor(() => {
      expect(screen.getByText(/welcome to skillos/i)).toBeInTheDocument();
    });
    
    // Check for key metrics sections
    expect(screen.getByText(/analytics insights/i)).toBeInTheDocument();
    expect(screen.getByText(/course completion rate/i)).toBeInTheDocument();
    expect(screen.getByText(/active learners/i)).toBeInTheDocument();
    expect(screen.getByText(/avg. learning time/i)).toBeInTheDocument();
    
    // Check for ROI section
    expect(screen.getByText(/roi of learning/i)).toBeInTheDocument();
    expect(screen.getByText(/business impact of learning initiatives/i)).toBeInTheDocument();
    
    // Check for engagement overview
    expect(screen.getByText(/engagement overview/i)).toBeInTheDocument();
    expect(screen.getByText(/team learning activity and participation/i)).toBeInTheDocument();
    
    // Check for pending assessments
    expect(screen.getByText(/pending assessments/i)).toBeInTheDocument();
    expect(screen.getByText(/assessments requiring your attention/i)).toBeInTheDocument();
  });

  test('Dashboard metrics display correct values and trends', async () => {
    renderWithProviders(<DashboardPage />);
    
    await waitFor(() => {
      // Check course completion rate
      expect(screen.getByText(/78%/)).toBeInTheDocument();
      expect(screen.getByText(/\+12% from last month/i)).toBeInTheDocument();
      
      // Check active learners
      expect(screen.getByText(/425/)).toBeInTheDocument();
      expect(screen.getByText(/\+8% from last month/i)).toBeInTheDocument();
      
      // Check average learning time
      expect(screen.getByText(/3.2 hrs\/week/i)).toBeInTheDocument();
      expect(screen.getByText(/\-5% from last month/i)).toBeInTheDocument();
    });
  });

  test('ROI metrics display correctly', async () => {
    renderWithProviders(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/overall roi/i)).toBeInTheDocument();
      expect(screen.getByText(/240%/i)).toBeInTheDocument();
      
      expect(screen.getByText(/employee retention/i)).toBeInTheDocument();
      expect(screen.getByText(/\+11%/i)).toBeInTheDocument();
      
      expect(screen.getByText(/customer satisfaction/i)).toBeInTheDocument();
      expect(screen.getByText(/\+18%/i)).toBeInTheDocument();
      
      expect(screen.getByText(/time to competency/i)).toBeInTheDocument();
      expect(screen.getByText(/\+29%/i)).toBeInTheDocument();
    });
  });

  test('Engagement metrics display correctly', async () => {
    renderWithProviders(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/course participation/i)).toBeInTheDocument();
      expect(screen.getByText(/85%/i)).toBeInTheDocument();
      
      expect(screen.getByText(/discussion activity/i)).toBeInTheDocument();
      expect(screen.getByText(/62%/i)).toBeInTheDocument();
      
      expect(screen.getByText(/assessment completion/i)).toBeInTheDocument();
      expect(screen.getByText(/78%/i)).toBeInTheDocument();
      
      expect(screen.getByText(/team satisfaction/i)).toBeInTheDocument();
    });
  });

  test('Pending assessments display correctly', async () => {
    renderWithProviders(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/sarah miller/i)).toBeInTheDocument();
      expect(screen.getByText(/360-degree feedback/i)).toBeInTheDocument();
      expect(screen.getByText(/due: may 25/i)).toBeInTheDocument();
      
      expect(screen.getByText(/john davis/i)).toBeInTheDocument();
      expect(screen.getByText(/technical skills test/i)).toBeInTheDocument();
      expect(screen.getByText(/due: may 28/i)).toBeInTheDocument();
      
      expect(screen.getByText(/michael brown/i)).toBeInTheDocument();
      expect(screen.getByText(/learning retention quiz/i)).toBeInTheDocument();
      expect(screen.getByText(/due: may 5/i)).toBeInTheDocument();
      expect(screen.getByText(/overdue/i)).toBeInTheDocument();
    });
  });

  test('Dashboard action buttons work correctly', async () => {
    const { container } = renderWithProviders(<DashboardPage />);
    
    // Find and click "View Full ROI Dashboard" button
    const roiButton = screen.getByText(/view full roi dashboard/i);
    fireEvent.click(roiButton);
    
    // Find and click "View Engagement Planner" button
    const engagementButton = screen.getByText(/view engagement planner/i);
    fireEvent.click(engagementButton);
    
    // Find and click "Review" buttons for assessments
    const reviewButtons = screen.getAllByText(/review/i);
    fireEvent.click(reviewButtons[0]);
    
    // Note: We can't fully test navigation in this environment,
    // but we can verify the buttons are clickable and don't cause errors
  });
});
