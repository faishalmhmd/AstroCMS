import { getUserFromRequest } from './lib/auth.js';

export async function onRequest(context, next) {
  const { request, url } = context;
  
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/admin'];
  const authRoutes = ['/login', '/register'];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    url.pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    url.pathname.startsWith(route)
  );

  try {
    const user = await getUserFromRequest(request);
    
    // Redirect authenticated users away from auth pages
    if (user && isAuthRoute) {
      return Response.redirect(new URL('/dashboard', url));
    }
    
    // Redirect unauthenticated users from protected pages
    if (!user && isProtectedRoute) {
      return Response.redirect(new URL('/login', url));
    }
    
    // Add user to locals for use in pages
    context.locals.user = user;
  } catch (error) {
    console.error('Middleware auth error:', error);
    if (isProtectedRoute) {
      return Response.redirect(new URL('/login', url));
    }
  }

  return next();
}