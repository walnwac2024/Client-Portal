// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
 

// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname

//   const isPublicPath = path === '/login' || path === '/signup'

//   const token = request.cookies.get('token')?.value || ''

//   if(isPublicPath && token) {
//     return NextResponse.redirect(new URL('/', request.nextUrl))
//   }
// console.log("the path is;",isPublicPath)
// console.log("the token is is;",token)
//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL('/login', request.nextUrl))
//   }
    
// }

 
// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     '/',
//     '/profile',
//     '/login',
//     '/signup',
//     '/verifyemail'
//   ]
// }


// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//     const path =  request.nextUrl.pathname;
//     // console.log("the pthe at the start is:",request)
//     // Define public paths
//     const isPublicPath = path === '/login' || path === '/signup';

//     // Retrieve the token from cookies
//     const token = request.cookies.get('token')?.value || '';

//     // Redirect if the user is authenticated but trying to access public pages
//     if (isPublicPath && token) {
//         return NextResponse.redirect(new URL('/', request.nextUrl));
//     }

//     // Log the path and token for debugging
//     console.log("The path is:", path);
//     console.log("The token is:", token);

//     // Redirect if the user is not authenticated and trying to access protected routes
//     if (!isPublicPath && !token) {
//         return NextResponse.redirect(new URL('/login', request.nextUrl));
//     }

//     // If neither condition is met, continue the request
//     return NextResponse.next();
// }

// // Specify the paths to match for the middleware
// export const config = {
//     matcher: [
//         '/',             // Root path
//         '/profile',      // Protected profile path
//         '/login',        // Public login path
//         '/signup',       // Public signup path
     
//     ],
// };
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

    // If none of the conditions are met, proceed with the request
    return NextResponse.next();
}

// Middleware config to specify matched routes
export const config = {
    matcher: [
        '/',             // Root path, typically protected
        '/profile',      // Protected profile path
        '/dashboard',    // Add additional protected paths as needed
        '/login',        // Public login path
        '/signup',       
        '/AddNewClient',
        '/addNewUser',
        '/AllClinets',
        '/clientdetails/view',
        '/clientdetails/edit',
        '/userClients',
        '/userDetails/viewuser',
        '/userDetails/edituser',     
    ],
};

