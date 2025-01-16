import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define paths that are publicly accessible
    const publicPaths = ['/login', '/signup'];
    const isPublicPath = publicPaths.includes(pathname);

    const token = request.cookies.get('token')?.value || '';

    // Redirect authenticated users away from public pages (like login and signup)
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    // Debugging log for path and token
    console.log("Requested path:", pathname);
    console.log("Token present:", Boolean(token));

    // Redirect unauthenticated users to login when accessing protected pages
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Handle specific route: `/api/upload` with custom headers
    if (pathname === '/api/upload') {
        return NextResponse.next({
            headers: {
                "Accept": "multipart/form-data",
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*",
            },
        });
    }

    // If none of the conditions are met, proceed with the request
    return NextResponse.next();
}

// Middleware config to specify matched routes
export const config = {
    matcher: [
        '/',                // Root path, typically protected
        '/profile',         // Protected profile path
        '/dashboard',       // Additional protected path
        '/login',           // Public login path
        '/signup',          // Public signup path
        '/AddNewClient',    // Protected path
        '/addNewUser',      // Protected path
        '/AllClinets',      // Protected path
        '/clientdetails/view', // Protected path
        '/clientdetails/edit', // Protected path
        '/userClients',     // Protected path
        '/userDetails/viewuser', // Protected path
        '/userDetails/edituser', // Protected path
    ],
};
