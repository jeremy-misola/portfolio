import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// CORS configuration
function applyCorsHeaders(response: NextResponse) {
  // Allow all origins
  response.headers.set('Access-Control-Allow-Origin', '*');
  // Allow all standard HTTP methods, including HEAD
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS, TRACE, CONNECT'
  );
  // Allow common headers
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  // Set maximum age for preflight cache
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Handle CORS preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      return applyCorsHeaders(response);
    }

    // API routes should not be localized
    if (pathname.startsWith('/api')) {
      // Apply CORS headers to all API responses
      // For API routes, we just pass through without localization
      // First, check if it's an authenticated admin API route
      const isAdminApiRoute = pathname.startsWith('/api/admin');
      if (isAdminApiRoute) {
        const isAuthEndpoint = pathname.includes('/api/admin/auth');
        const isPublicApi = pathname === '/api/cluster-state';

        if (!isAuthEndpoint && !isPublicApi) {
          const sessionToken = request.cookies.get('admin_session');

          if (!sessionToken) {
            // Return 401 for API endpoints
            return NextResponse.json(
              { error: 'Authentication required' },
              { status: 401 }
            );
          }
        }
      }
      
      // For all API routes, return the response without localization
      return applyCorsHeaders(NextResponse.next());
    }

    // 1. Handle Admin Authentication
    // Check if it's an admin or admin API route (with or without locale)
    const isAdminRoute = pathname.match(/^\/(?:en|fr|zh)\/admin(?:\/|$)/) || pathname.startsWith('/admin');
    const isAdminApiRoute = pathname.startsWith('/api/admin');

    if (isAdminRoute || isAdminApiRoute) {
        // Allow access to auth endpoints and login page without authentication
        const isAuthEndpoint = pathname.includes('/api/admin/auth') ||
            pathname.match(/^\/(?:en|fr|zh)\/admin\/login(?:\/|$)/) ||
            pathname === '/admin/login';

        // Also allow cluster-state API
        const isPublicApi = pathname === '/api/cluster-state';

        if (!isAuthEndpoint && !isPublicApi) {
            const sessionToken = request.cookies.get('admin_session');

            if (!sessionToken) {
                // Redirect to localized login page if unauthenticated
                if (isAdminRoute) {
                    // Extract locale or default to 'en'
                    const locale = pathname.split('/')[1];
                    const supportedLocales = ['en', 'fr', 'zh'];
                    const targetLocale = supportedLocales.includes(locale) ? locale : 'en';

                    return NextResponse.redirect(new URL(`/${targetLocale}/admin/login`, request.url));
                }

                // Return 401 for API endpoints
                return NextResponse.json(
                    { error: 'Authentication required' },
                    { status: 401 }
                );
            }
        }
    }

    // 2. Handle Localization
    return intlMiddleware(request);
}

export const config = {
    // Match internationalized pathnames, admin routes, and all API routes
    matcher: ['/', '/(fr|en|zh)/:path*', '/admin/:path*', '/api/:path*']
};
