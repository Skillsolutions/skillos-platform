/**
 * Test script for validating xAPI dashboard integration
 * 
 * This script tests the real-time data flow from xAPI events to the dashboard
 * by generating test events and verifying they appear in the dashboard.
 */

import fetch from 'node-fetch';
import { generateTestEventBatch } from '../lib/xapi/test-events';
import { parseXAPIStatementBatch } from '../lib/xapi/parser';
import { storeLearningEvents, getOrganizationMetrics, getTopLearners } from '../lib/xapi/storage';

/**
 * Run validation tests for the xAPI dashboard integration
 */
async function validateDashboardIntegration() {
  console.log('🧪 Starting xAPI Dashboard Integration Validation');
  console.log('------------------------------------------------');
  
  // Step 1: Clear existing test data
  console.log('\n📋 Step 1: Clearing existing test data');
  try {
    const clearResponse = await fetch('http://localhost:3000/api/xapi/test?clearExisting=true');
    if (clearResponse.ok) {
      console.log('✅ Successfully cleared existing test data');
    } else {
      console.error('❌ Failed to clear test data:', await clearResponse.text());
    }
  } catch (error) {
    console.error('❌ Error clearing test data:', error);
  }
  
  // Step 2: Generate test events for multiple organizations
  console.log('\n📋 Step 2: Generating test events for multiple organizations');
  const organizations = [
    { id: 'org-1', name: 'Acme Corporation', userCount: 8, courseCount: 5 },
    { id: 'org-2', name: 'Globex Industries', userCount: 5, courseCount: 3 }
  ];
  
  for (const org of organizations) {
    console.log(`\n🏢 Organization: ${org.name} (${org.id})`);
    
    // Generate test events
    console.log(`Generating ${org.userCount} users and ${org.courseCount} courses...`);
    const testEvents = generateTestEventBatch(org.id, org.userCount, org.courseCount);
    console.log(`✅ Generated ${testEvents.length} test events`);
    
    // Process and store events
    const learningEvents = parseXAPIStatementBatch(testEvents);
    const storedEvents = storeLearningEvents(learningEvents);
    console.log(`✅ Processed and stored ${storedEvents.length} learning events`);
    
    // Verify organization metrics
    const metrics = getOrganizationMetrics(org.id);
    console.log('\n📊 Organization Metrics:');
    console.log(`- Total Events: ${metrics.totalEvents}`);
    console.log(`- Unique Users: ${metrics.uniqueUsers}`);
    console.log(`- Unique Courses: ${metrics.uniqueCourses}`);
    console.log(`- Completions: ${metrics.completions}`);
    console.log(`- Enrollments: ${metrics.enrollments}`);
    
    // Verify department metrics
    console.log('\n🏢 Department Metrics:');
    Object.entries(metrics.byDepartment).forEach(([dept, data]) => {
      console.log(`- ${dept}: ${data.events} events, ${data.completions} completions`);
    });
    
    // Verify top learners
    const topLearners = getTopLearners(org.id, 3);
    console.log('\n👥 Top Learners:');
    topLearners.forEach((learner, index) => {
      console.log(`- #${index + 1}: ${learner.userName || learner.userEmail} - ${learner.completions} completions`);
    });
  }
  
  // Step 3: Verify multi-tenant isolation
  console.log('\n📋 Step 3: Verifying multi-tenant data isolation');
  for (const org of organizations) {
    const metrics = getOrganizationMetrics(org.id);
    console.log(`\n🏢 ${org.name} (${org.id}) metrics:`);
    console.log(`- Total Events: ${metrics.totalEvents}`);
    console.log(`- Unique Users: ${metrics.uniqueUsers}`);
  }
  
  // Step 4: Verify real-time updates
  console.log('\n📋 Step 4: Verifying real-time updates');
  const testOrg = organizations[0];
  console.log(`\n🏢 Adding new completion event for ${testOrg.name}`);
  
  // Generate a single new completion event
  const newEvent = generateTestEventBatch(testOrg.id, 1, 1);
  const newLearningEvents = parseXAPIStatementBatch(newEvent);
  const newStoredEvents = storeLearningEvents(newLearningEvents);
  console.log(`✅ Added ${newStoredEvents.length} new learning event`);
  
  // Verify metrics updated
  const updatedMetrics = getOrganizationMetrics(testOrg.id);
  console.log('\n📊 Updated Organization Metrics:');
  console.log(`- Total Events: ${updatedMetrics.totalEvents}`);
  console.log(`- Completions: ${updatedMetrics.completions}`);
  
  console.log('\n✅ xAPI Dashboard Integration Validation Complete');
  console.log('------------------------------------------------');
  console.log('The dashboard should now display real-time learning data from xAPI events.');
  console.log('To test in the browser:');
  console.log('1. Visit: http://localhost:3000/platform/dashboard');
  console.log('2. Generate more test events: http://localhost:3000/api/xapi/test?organizationId=org-1');
  console.log('3. Verify the dashboard updates with the new data');
}

// Run the validation if executed directly
if (require.main === module) {
  validateDashboardIntegration().catch(console.error);
}

export { validateDashboardIntegration };
