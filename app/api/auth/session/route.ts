import { NextRequest, NextResponse } from 'next/server';
import { signJwt } from '@/lib/jwt';
import { getRedirectForPlan } from '@/lib/plan-routing';
import { getAuthCookieOptions } from '@/lib/auth-cookie';
import type { JwtPayload } from '@/lib/jwt';

type SessionPayload = JwtPayload;

function buildSessionPayload(params: {
  userId: string | null;
  plan: string | null;
  trial: boolean;
  trialActivated: boolean;
  trialExpiresAt: string | null;
}): SessionPayload | null {
  const { userId, plan, trial, trialActivated, trialExpiresAt } = params;
  if (!userId || (plan !== 'basic' && plan !== 'premium' && plan !== 'visitante')) {
    return null;
  }

  return {
    userId,
    plan: plan as SessionPayload['plan'],
    trial,
    trialActivated,
    trialExpiresAt
  };
}

function buildSessionResponse(payload: SessionPayload) {
  const token = signJwt(payload);
  const redirectTo = getRedirectForPlan(payload);
  const response = NextResponse.json({ success: true, redirectTo });

  response.cookies.set('token', token, getAuthCookieOptions());

  return response;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const payload = buildSessionPayload({
    userId: searchParams.get('userId'),
    plan: searchParams.get('plan'),
    trial: searchParams.get('trial') === 'true',
    trialActivated: searchParams.get('trialActivated') === 'true',
    trialExpiresAt: searchParams.get('trialExpiresAt') || null
  });

  if (!payload) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  return buildSessionResponse(payload);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const payload = buildSessionPayload({
    userId: body.userId ?? null,
    plan: body.plan ?? null,
    trial: body.trial === true,
    trialActivated: body.trialActivated === true,
    trialExpiresAt: body.trialExpiresAt ?? null
  });

  if (!payload) {
    return NextResponse.json({ error: 'Dados de sessão inválidos.' }, { status: 400 });
  }

  return buildSessionResponse(payload);
}
