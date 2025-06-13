/**
 * xAPI Statements Endpoint for SkillOS
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { parseXAPIStatement, validateAuthHeader } from '@/lib/xapi/parser';
import { storeLearningEvent } from '@/lib/xapi/storage';
import { XAPIStatement } from '@/lib/xapi/types';

/**
 * Handle POST requests to the xAPI statements endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Validate Authorization header
    const authHeader = request.headers.get('Authorization') || undefined;
    if (!validateAuthHeader(authHeader)) {
      return NextResponse.json(
        { error: 'unauthorized', error_description: 'Invalid or missing authorization token' },
        { status: 401 }
      );
    }
    
    // Parse request body
    let statements: XAPIStatement | XAPIStatement[];
    try {
      statements = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Extract organization ID from request
    // In production, this would come from the authenticated token
    const organizationId = request.nextUrl.searchParams.get('organizationId') || 'default';
    
    // Process single statement
    if (!Array.isArray(statements)) {
      const event = parseXAPIStatement(statements, organizationId);
      
      if (!event) {
        return NextResponse.json(
          { error: 'invalid_statement', error_description: 'Failed to parse xAPI statement' },
          { status: 400 }
        );
      }
      
      const storedEvent = storeLearningEvent(event);
      
      return NextResponse.json({
        id: storedEvent.id,
        status: 'stored'
      });
    }
    
    // Process multiple statements
    const results = [];
    
    for (const statement of statements) {
      const event = parseXAPIStatement(statement, organizationId);
      
      if (event) {
        const storedEvent = storeLearningEvent(event);
        results.push({
          id: storedEvent.id,
          status: 'stored'
        });
      } else {
        results.push({
          id: statement.id || 'unknown',
          status: 'failed',
          error: 'Failed to parse statement'
        });
      }
    }
    
    return NextResponse.json(results);
    
  } catch (error) {
    console.error('Error processing xAPI statements:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Handle GET requests to the xAPI statements endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'SkillOS xAPI statements endpoint is ready to receive statements',
    documentation: 'https://skillsolutions.io/docs/xapi'
  } );
}
