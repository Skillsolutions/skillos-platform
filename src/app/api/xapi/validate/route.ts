export const dynamic = 'force-dynamic';
/**
 * xAPI Dashboard Validation Endpoint for SkillOS
 * 
 * This endpoint validates the real-time data flow from xAPI events to the dashboard
 * by generating test events and verifying they appear in the dashboard.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateTestEventBatch } from '@/lib/xapi/test-events';
import { parseXAPIStatementBatch } from '@/lib/xapi/parser';
import { storeLearningEvents, getOrganizationMetrics, getTopLearners, clearAllEvents } from '@/lib/xapi/storage';

/**
 * Handle GET requests to the validation endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'validate';
    
    if (action === 'clear') {
      // Clear all test data
      clearAllEvents();
      return NextResponse.json({
        success: true,
        message: 'All test data cleared successfully'
      });
    }
    
    // Run validation tests
    const validationResults = await validateDashboardIntegration();
    
    return NextResponse.json({
      success: true,
      message: 'Dashboard validation completed successfully',
      results: validationResults
    });
    
  } catch (error) {
    console.error('Error validating dashboard integration:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An unexpected error occurred during validation' },
      { status: 500 }
    );
  }
}

/**
 * Run validation tests for the xAPI dashboard integration
 */
async function validateDashboardIntegration() {
  const results = {
    organizations: [] as any[],
    multiTenantIsolation: true,
    realTimeUpdates: true
  };
  
  // Step 1: Clear existing test data
  clearAllEvents();
  
  // Step 2: Generate test events for multiple organizations
  const organizations = [
    { id: 'org-1', name: 'Acme Corporation', userCount: 8, courseCount: 5 },
    { id: 'org-2', name: 'Globex Industries', userCount: 5, courseCount: 3 }
  ];
  
  for (const org of organizations) {
    // Generate test events
    const testEvents = generateTestEventBatch(org.id, org.userCount, org.courseCount);
    
    // Process and store events
    const learningEvents = parseXAPIStatementBatch(testEvents);
    const storedEvents = storeLearningEvents(learningEvents);
    
    // Verify organization metrics
    const metrics = getOrganizationMetrics(org.id);
    
    // Verify top learners
    const topLearners = getTopLearners(org.id, 3);
    
    // Store results
    results.organizations.push({
      id: org.id,
      name: org.name,
      eventsGenerated: testEvents.length,
      eventsStored: storedEvents.length,
      metrics: {
        totalEvents: metrics.totalEvents,
        uniqueUsers: metrics.uniqueUsers,
        uniqueCourses: metrics.uniqueCourses,
        completions: metrics.completions,
        enrollments: metrics.enrollments,
        departments: Object.keys(metrics.byDepartment).length
      },
      topLearners: topLearners.map(learner => ({
        name: learner.userName || learner.userEmail,
        completions: learner.completions
      }))
    });
  }
  
  // Step 3: Verify multi-tenant isolation
  const org1Metrics = getOrganizationMetrics('org-1');
  const org2Metrics = getOrganizationMetrics('org-2');
  
  // Organizations should have different metrics
  results.multiTenantIsolation = 
    org1Metrics.totalEvents !== org2Metrics.totalEvents &&
    org1Metrics.uniqueUsers !== org2Metrics.uniqueUsers;
  
  // Step 4: Verify real-time updates
  const beforeMetrics = getOrganizationMetrics('org-1');
  
  // Generate a single new completion event
  const newEvent = generateTestEventBatch('org-1', 1, 1);
  const newLearningEvents = parseXAPIStatementBatch(newEvent);
  storeLearningEvents(newLearningEvents);
  
  // Verify metrics updated
  const afterMetrics = getOrganizationMetrics('org-1');
  
  // Metrics should have changed
  results.realTimeUpdates = afterMetrics.totalEvents > beforeMetrics.totalEvents;
  
  return results;
}
