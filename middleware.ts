import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    
    // Check if the user is authenticated
    const isAuthenticated = request.cookies.has('auth-token');
    
    // Define public paths that don't require authentication
    const isPublicPath = path === '/signin' || path === '/signup';
    
    // Always redirect root path to signup if not authenticated
    if (path === '/' && !isAuthenticated) {
        return NextResponse.redirect(new URL('/signup', request.url));
    }
    
    // If the user is not authenticated and trying to access a protected route, redirect to signup
    if (!isAuthenticated && !isPublicPath) {
        return NextResponse.redirect(new URL('/signup', request.url));
    }
    
    // If the user is authenticated and trying to access signin/signup, redirect to home
    if (isAuthenticated && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon\.ico|public).*)',
    ],
}
