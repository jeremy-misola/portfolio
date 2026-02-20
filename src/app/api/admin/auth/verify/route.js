import { NextResponse } from 'next/server';
import { isValidSession } from '@/lib/admin';
import { applyCorsHeaders, createPreflightResponse } from '@/lib/cors';

// Handle CORS preflight
export async function OPTIONS() {
  return createPreflightResponse();
}

// Handle HEAD requests
export async function HEAD() {
  const response = new NextResponse(null);
  return applyCorsHeaders(response);
}

export async function GET(request) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('admin_session')?.value;
    
    if (!sessionToken || !isValidSession(sessionToken)) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      ));
    }

    return applyCorsHeaders(NextResponse.json(
      { message: 'Session is valid' },
      { status: 200 }
    ));
  } catch (error) {
    console.error('Session verification error:', error);
    return applyCorsHeaders(NextResponse.json(
      { error: 'Session verification failed' },
      { status: 500 }
    ));
  }
}
