import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const isDevelopment = process.env.NODE_ENV === 'development';

  // 1. Handle Preflight (OPTIONS) - always respond properly
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
      },
    });
  }

  // 2. Origin validation - ONLY for actual requests
  let isAllowed = true; // default allow (we'll restrict below if needed)

  if (!isDevelopment) {
    // In production: only allow requests that have a invalid origin (browsers)
    if (origin) isAllowed = false;
  } else {
    // Development: be more permissive
    isAllowed =
      !origin ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:');
  }

  if (!isAllowed) {
    const errorResponse = NextResponse.json(
      { error: 'Unauthorized Origin' },
      { status: 403 },
    );
    if (origin) {
      errorResponse.headers.set('Access-Control-Allow-Origin', origin);
      errorResponse.headers.set('Vary', 'Origin');
    }
    return errorResponse;
  }

  // 3. Allow request + attach CORS headers
  const response = NextResponse.next();

  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Vary', 'Origin');
  }

  return response;
}

// <<< THIS IS THE MOST IMPORTANT PART >>>
export const config = {
  matcher: [
    '/api/:path*', // Only apply to API routes
    // Do NOT include pages here unless you have a very specific reason
  ],
};
