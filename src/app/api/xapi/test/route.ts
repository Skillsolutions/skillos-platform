export const dynamic = 'force-dynamic';
/**
 * xAPI Test Endpoint for SkillOS - Udemy Business Integration
 * 
 * This endpoint allows testing the xAPI integration by simulating
 * Udemy Business learning events.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateTestEventBatch } from '@/lib/xapi/test-events';
import { parseXAPIStatementBatch } from '@/lib/xapi/parser';
import { storeLearningEvents, clearAllEvents } from '@/lib/xapi/storage';

/**
 * Handle POST requests to the test endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { 
      organizationId = 'test-org',
      userCount = 5,
      courseCount = 3,
      clearExisting = false
    } = body;
    
    // Clear existing events if requested
    if (clearExisting) {
      clearAllEvents();
    }
    
    // Generate test events
    const testEvents = generateTestEventBatch(organizationId, userCount, courseCount);
    
    // Process and store events
    const learningEvents = parseXAPIStatementBatch(testEvents);
    const storedEvents = storeLearningEvents(learningEvents);
    
    // Return success response
    return NextResponse.json({
      success: true,
      generated: testEvents.length,
      processed: storedEvents.length,
      organizationId
    });
    
  } catch (error) {
    console.error('Error generating test events:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Handle GET requests to the test endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get('organizationId') || 'test-org';
    const userCount = parseInt(searchParams.get('userCount') || '5', 10);
    const courseCount = parseInt(searchParams.get('courseCount') || '3', 10);
    const clearExisting = searchParams.get('clearExisting') === 'true';
    
    // Clear existing events if requested
    if (clearExisting) {
      clearAllEvents();
    }
    
    // Generate test events
    const testEvents = generateTestEventBatch(organizationId, userCount, courseCount);
    
    // Process and store events
    const learningEvents = parseXAPIStatementBatch(testEvents);
    const storedEvents = storeLearningEvents(learningEvents);
    
    // Return success response
    return NextResponse.json({
      success: true,
      generated: testEvents.length,
      processed: storedEvents.length,
      organizationId,
      message: 'Test events generated and processed successfully',
      usage: 'Access the dashboard to see the test data in action'
    });
    
  } catch (error) {
    console.error('Error generating test events:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
