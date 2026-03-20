import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt, type JwtPayload } from '@/lib/jwt';
import { getRedirectForPlan } from '@/lib/plan-routing';

const PUBLIC_ROUTES = ['/login', '/pricing', '/signup'];
const TRIAL_ALLOWED_ROUTES = ['/pricing', '/checkout'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const payload = token ? (verifyJwt(token) as JwtPayload | null) : null;
  const isVisitor = payload?.plan === 'visitante';

  if (pathname === '/') {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.redirect(new URL(getRedirectForPlan(payload.plan), request.url));
  }

  if ((pathname === '/login' || pathname === '/signup') && payload) {
    return NextResponse.redirect(new URL(getRedirectForPlan(payload.plan), request.url));
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isVisitor && !TRIAL_ALLOWED_ROUTES.includes(pathname)) {
    if (pathname !== '/pricing') {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|favicon.svg).*)'],
};
