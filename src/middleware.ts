import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Custom Cookies
  const appAuth = request.cookies.get('app_auth')?.value;
  const adminAuth = request.cookies.get('admin_auth')?.value;

  // 1. Admin Area Protection
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (adminAuth !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. Main App Protection
  if (path === '/') {
    // If admin is browsing, they get a free pass, otherwise check app_auth
    if (adminAuth !== 'true' && appAuth !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. API Protection (RAG API)
  if (path.startsWith('/api/rag')) {
    if (adminAuth !== 'true' && appAuth !== 'true') {
      return NextResponse.json({ error: 'Unauthorized. Please login.' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
