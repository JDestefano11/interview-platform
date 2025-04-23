import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that should be exempt from authentication checks
const PUBLIC_PATHS = ['/signin', '/signup', '/api/auth'];


export function middleware(request: NextRequest) {
    try {
        const path = request.nextUrl.pathname;
        
        // Check if the user is authenticated
        const isAuthenticated = request.cookies.has('auth-token');
        
        // Check if the path is public (doesn't require authentication)
        const isPublicPath = PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
        
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
    } catch (error) {
        console.error('Middleware error:', error);
        // In case of any error, allow the request to proceed
        // This prevents blocking the application if there's an issue with the middleware
        return NextResponse.next();
    }
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
