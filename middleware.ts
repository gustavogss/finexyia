import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt, type JwtPayload } from '@/lib/jwt';
import { getRedirectForPlan } from '@/lib/plan-routing';

const PUBLIC_ROUTES = ['/login', '/pricing', '/signup'];
const TRIAL_ALLOWED_ROUTES = ['/', '/pricing', '/checkout'];

function isTrialExpired(payload: JwtPayload | null) {
  if (!payload?.trial || !payload.trialExpiresAt) {
    return false;
  }

  return new Date(payload.trialExpiresAt).getTime() < Date.now();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const payload = token ? (verifyJwt(token) as JwtPayload | null) : null;
  const isTrialUser = payload?.trial === true;
  const isTrialActivated = payload?.trialActivated === true;
  const trialExpired = isTrialExpired(payload);

  if (pathname === '/') {
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (trialExpired) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }

    return NextResponse.next();
  }

  if ((pathname === '/login' || pathname === '/signup') && payload) {
    return NextResponse.redirect(new URL(getRedirectForPlan(payload), request.url));
  }

  if (PUBLIC_ROUTES.includes(pathname)) {
    if (pathname === '/pricing' && payload && !trialExpired && !payload.trial) {
      return NextResponse.redirect(new URL(getRedirectForPlan(payload), request.url));
    }

    return NextResponse.next();
  }

  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (trialExpired) {
    if (pathname !== '/pricing' && pathname !== '/checkout') {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }

  if (isTrialUser && isTrialActivated && pathname !== '/' && pathname !== '/pricing' && pathname !== '/checkout') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|favicon.svg).*)'],
};
