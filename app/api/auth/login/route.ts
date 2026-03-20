import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { signJwt } from '@/lib/jwt';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Simulação de banco de dados
const users = [
  {
    id: '1',
    email: 'basic@finexyia.com',
    password: '123456',
    plan: 'basic' as const,
    trial: false,
    trialExpiresAt: null
  },
  {
    id: '2',
    email: 'premium@finexyia.com',
    password: '123456',
    plan: 'premium' as const,
    trial: false,
    trialExpiresAt: null
  },
  {
    id: '3',
    email: 'visitante@finexyia.com',
    password: '123456',
    plan: 'visitante' as const,
    trial: true,
    trialExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
] as const;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
  }
  const { email, password } = result.data;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 });
  }
  const token = signJwt({
    userId: user.id,
    plan: user.plan,
    trial: user.trial,
    trialExpiresAt: user.trialExpiresAt
  });
  const response = NextResponse.json({ success: true });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}
