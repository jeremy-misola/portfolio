import { NextResponse } from 'next/server';
import { validateAdminCredentials, generateSessionToken, addActiveSession, removeActiveSession } from '@/lib/admin';
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

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      ));
    }

    const isValid = validateAdminCredentials(username, password);

    if (!isValid) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Invalid credentials or missing admin environment configuration' },
        { status: 401 }
      ));
    }

    const sessionToken = generateSessionToken();
    if (!sessionToken) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Admin session secret is missing or invalid' },
        { status: 500 }
      ));
    }
    
    // Add session to active sessions
    addActiveSession(sessionToken);
    
    const response = NextResponse.json({
      success: true,
      message: 'Login successful'
    });

    // Set secure cookie
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });

    return applyCorsHeaders(response);
  } catch (error) {
    console.error('Auth error:', error);
    return applyCorsHeaders(NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    ));
  }
}

export async function DELETE(request) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear the session from active sessions
    const sessionToken = request.cookies.get('admin_session')?.value;
    if (sessionToken) {
      removeActiveSession(sessionToken);
    }

    // Clear the session cookie
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return applyCorsHeaders(response);
  } catch (error) {
    console.error('Logout error:', error);
    return applyCorsHeaders(NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    ));
  }
}
