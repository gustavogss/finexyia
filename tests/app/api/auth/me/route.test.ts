import express from 'express';
import request from 'supertest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/auth/me/route';

const verifyJwtMock = jest.fn();

jest.mock('@/lib/jwt', () => ({
  verifyJwt: (...args: unknown[]) => verifyJwtMock(...args),
}));

function createServer() {
  const app = express();

  app.get('/api/auth/me', async (req, res) => {
    const cookieHeader = req.headers.cookie;
    const nextReq = new NextRequest('http://localhost/api/auth/me', {
      headers: cookieHeader ? { cookie: String(cookieHeader) } : {},
    });
    const nextRes = await GET(nextReq);
    const body = await nextRes.text();
    const contentType = nextRes.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    res.status(nextRes.status).send(body);
  });

  return app;
}

describe('api/auth/me route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns authenticated user payload', async () => {
    verifyJwtMock.mockReturnValue({
      userId: 'u1',
      plan: 'premium',
      trial: false,
      trialActivated: true,
      trialExpiresAt: null,
    });

    const app = createServer();
    const response = await request(app).get('/api/auth/me').set('Cookie', 'token=abc');

    expect(response.status).toBe(200);
    expect(response.body.authenticated).toBe(true);
    expect(response.body.plan).toBe('premium');
  });

  it('returns 401 when token is invalid', async () => {
    verifyJwtMock.mockReturnValue(null);
    const app = createServer();
    const response = await request(app).get('/api/auth/me').set('Cookie', 'token=invalid');
    expect(response.status).toBe(401);
    expect(response.body.authenticated).toBe(false);
  });
});

