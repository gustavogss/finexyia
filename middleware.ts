import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

const PUBLIC_PATHS = ['/login', '/planos'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  const payload = verifyJwt(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  // Controle de planos
  if (payload.plan === 'visitante') {
    if (!payload.trialExpiresAt || new Date(payload.trialExpiresAt) < new Date()) {
      return NextResponse.redirect(new URL('/planos', req.url));
    }
  }
  // Permite acesso
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/transactions', '/analysis', '/goals', '/recompensas', '/profile', '/checkout']
};
