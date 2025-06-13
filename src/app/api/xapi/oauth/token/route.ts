/**
 * xAPI OAuth Token Endpoint for SkillOS - Udemy Business Integration
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { OAuthTokenRequest, OAuthTokenResponse } from '@/lib/xapi/types';

// In a production environment, these would be stored securely in a database
// For development, we're using environment variables
const VALID_CLIENTS: Record<string, string> = {
  // Format: client_id: client_secret
  // These are configured in Udemy Business admin panel
  "nE5uF4wm0S62hFNrBg28bjgsIifCb124n4rd845E": "t2FHdGtY9iIkyoVSjFLabOebz9KQGbX4sSJrgCU8ABVPGiXedbyd2dAh02cbcqeuRq1HOK46nGrCEjylKwJCWGbVGf2sIvZJSsDA1cxo33tAWslCzEQvsJ6ao68UTNf7"
};

/**
 * Handle POST requests to the OAuth token endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let tokenRequest: OAuthTokenRequest;
    try {
      tokenRequest = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'invalid_request', error_description: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate grant type
    if (tokenRequest.grant_type !== 'client_credentials') {
      return NextResponse.json(
        { error: 'unsupported_grant_type', error_description: 'Only client_credentials grant type is supported' },
        { status: 400 }
      );
    }
    
    // Validate client credentials
    const { client_id, client_secret } = tokenRequest;
    if (!client_id || !client_secret) {
      return NextResponse.json(
        { error: 'invalid_client', error_description: 'Missing client credentials' },
        { status: 401 }
      );
    }
    
    // Check if client exists and secret matches
    // In development, accept any client for testing
    const isProduction = process.env.NODE_ENV === 'production';
    const isValidClient = isProduction 
      ? VALID_CLIENTS[client_id] === client_secret
      : true;
    
    if (!isValidClient) {
      return NextResponse.json(
        { error: 'invalid_client', error_description: 'Invalid client credentials' },
        { status: 401 }
      );
    }
    
    // Generate access token
    // In production, use a proper token generation library with expiration
    const accessToken = isProduction
      ? generateSecureToken()
      : 'dev-token-' + Math.random().toString(36).substring(2, 15);
    
    // Create token response
    const tokenResponse: OAuthTokenResponse = {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600, // 1 hour
      scope: tokenRequest.scope || 'statements/write'
    };
    
    // Return token response
    return NextResponse.json(tokenResponse);
    
  } catch (error) {
    console.error('Error processing OAuth token request:', error);
    return NextResponse.json(
      { error: 'server_error', error_description: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Generate a secure random token
 * In production, use a proper token generation library
 */
function generateSecureToken(): string {
  return 'sk_' + 
    Date.now().toString(36) + 
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}

/**
 * Handle GET requests to the OAuth token endpoint
 * This is not part of the OAuth spec but useful for testing
 */
export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'SkillOS OAuth token endpoint is ready to issue tokens',
    grant_types_supported: ['client_credentials'],
    documentation: 'https://skillsolutions.io/docs/oauth'
  } );
}
