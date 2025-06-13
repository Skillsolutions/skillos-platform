"use client";

/**
 * xAPI Parser for SkillOS
 */

import { XAPIStatement, XAPIEvent } from './types';

/**
 * Parse a single xAPI statement into a SkillOS learning event
 */
export function parseXAPIStatement(statement: XAPIStatement, organizationId: string): XAPIEvent | null {
  try {
    // Extract user information
    const userId = extractUserId(statement.actor);
    const userName = statement.actor.name || undefined;
    const userEmail = extractUserEmail(statement.actor);
    
    // Extract course information
    const courseId = statement.object.id;
    const courseName = statement.object.definition?.name?.['en-US'] || undefined;
    
    // Determine event type
    const eventType = determineEventType(statement);
    
    // Extract department and employee ID from extensions if available
    const department = statement.context?.extensions?.['http://skillsolutions.io/xapi/extensions/department'];
    const employeeId = statement.context?.extensions?.['http://skillsolutions.io/xapi/extensions/employeeId'];
    
    // Create event
    return {
      id: statement.id || `${Date.now( )}-${Math.random().toString(36).substring(2, 15)}`,
      organizationId,
      userId,
      userName,
      userEmail,
      courseId,
      courseName,
      eventType,
      timestamp: new Date(statement.timestamp || Date.now()),
      data: statement,
      department,
      employeeId
    };
  } catch (error) {
    console.error('Error parsing xAPI statement:', error);
    return null;
  }
}

/**
 * Parse a batch of xAPI statements
 */
export function parseXAPIStatementBatch(statements: XAPIStatement[], organizationId: string = 'default'): XAPIEvent[] {
  return statements
    .map(statement => parseXAPIStatement(statement, organizationId))
    .filter((event): event is XAPIEvent => event !== null);
}

/**
 * Extract user ID from actor
 */
function extractUserId(actor: XAPIStatement['actor']): string {
  if (actor.account) {
    return `${actor.account.homePage}/${actor.account.name}`;
  }
  
  if (actor.mbox) {
    return actor.mbox.replace('mailto:', '');
  }
  
  return `unknown-${Date.now()}`;
}

/**
 * Extract user email from actor
 */
function extractUserEmail(actor: XAPIStatement['actor']): string | undefined {
  if (actor.mbox) {
    return actor.mbox.replace('mailto:', '');
  }
  
  return undefined;
}

/**
 * Determine event type from statement
 */
function determineEventType(statement: XAPIStatement): XAPIEvent['eventType'] {
  const verbId = statement.verb.id;
  
  // Common verb IDs
  const completionVerbs = [
    'http://adlnet.gov/expapi/verbs/completed',
    'https://w3id.org/xapi/dod-isd/verbs/completed'
  ];
  
  const enrollmentVerbs = [
    'http://adlnet.gov/expapi/verbs/registered',
    'https://w3id.org/xapi/dod-isd/verbs/enrolled'
  ];
  
  const progressVerbs = [
    'http://adlnet.gov/expapi/verbs/progressed',
    'http://adlnet.gov/expapi/verbs/attempted',
    'http://adlnet.gov/expapi/verbs/experienced'
  ];
  
  if (completionVerbs.includes(verbId ) || statement.result?.completion === true) {
    return 'completion';
  }
  
  if (enrollmentVerbs.includes(verbId)) {
    return 'enrollment';
  }
  
  if (progressVerbs.includes(verbId)) {
    return 'progress';
  }
  
  return 'interaction';
}

/**
 * Validate authorization header
 */
export function validateAuthHeader(authHeader: string | undefined): boolean {
  if (!authHeader) {
    return false;
  }
  
  // Bearer token validation
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return token.length > 0;
  }
  
  // Basic auth validation
  if (authHeader.startsWith('Basic ')) {
    const credentials = authHeader.substring(6);
    return credentials.length > 0;
  }
  
  return false;
}
