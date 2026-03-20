import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const payload = token ? verifyJwt(token) : null;

  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    plan: payload.plan,
    trial: payload.trial,
    trialActivated: payload.trialActivated ?? false,
    trialExpiresAt: payload.trialExpiresAt
  });
}
