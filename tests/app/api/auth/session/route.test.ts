import express from 'express';
import request from 'supertest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/auth/session/route';

const signJwtMock = jest.fn((_payload: unknown) => 'token.mock');
const getRedirectForPlanMock = jest.fn((_payload?: unknown) => '/');
const getAuthCookieOptionsMock = jest.fn(() => ({ path: '/', httpOnly: true }));

jest.mock('@/lib/jwt', () => ({
  signJwt: (payload: unknown) => signJwtMock(payload),
}));

jest.mock('@/lib/plan-routing', () => ({
  getRedirectForPlan: (payload?: unknown) => getRedirectForPlanMock(payload),
}));

jest.mock('@/lib/auth-cookie', () => ({
  getAuthCookieOptions: () => getAuthCookieOptionsMock(),
}));

function createServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/auth/session', async (req, res) => {
    const nextReq = new NextRequest(`http://localhost${req.originalUrl}`);
    const nextRes = await GET(nextReq);
    const body = await nextRes.text();
    res.status(nextRes.status);
    const contentType = nextRes.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    const setCookie = nextRes.headers.get('set-cookie');
    if (setCookie) res.setHeader('set-cookie', setCookie);
    const location = nextRes.headers.get('location');
    if (location) res.setHeader('location', location);
    res.send(body);
  });

  app.post('/api/auth/session', async (req, res) => {
    const nextReq = new NextRequest('http://localhost/api/auth/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const nextRes = await POST(nextReq);
    const body = await nextRes.text();
    res.status(nextRes.status);
    const contentType = nextRes.headers.get('content-type');
    if (contentType) res.setHeader('content-type', contentType);
    const setCookie = nextRes.headers.get('set-cookie');
    if (setCookie) res.setHeader('set-cookie', setCookie);
    const location = nextRes.headers.get('location');
    if (location) res.setHeader('location', location);
    res.send(body);
  });

  return app;
}

describe('api/auth/session route', () => {
  it('creates session with valid POST payload', async () => {
    const app = createServer();
    const response = await request(app).post('/api/auth/session').send({
      userId: 'u1',
      plan: 'basic',
      trial: false,
      trialActivated: true,
      trialExpiresAt: null,
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.headers['set-cookie']).toBeDefined();
    expect(signJwtMock).toHaveBeenCalled();
  });

  it('rejects invalid payload', async () => {
    const app = createServer();
    const response = await request(app).post('/api/auth/session').send({
      userId: 'u1',
      plan: 'invalid',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('redirects GET when query params are invalid', async () => {
    const app = createServer();
    const response = await request(app).get('/api/auth/session?userId=u1&plan=invalid');
    expect(response.status).toBe(307);
    expect(response.headers.location).toContain('/pricing');
  });
});

