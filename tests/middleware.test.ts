import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

const verifyJwtMock = jest.fn();

jest.mock('@/lib/jwt', () => ({
  verifyJwt: (...args: unknown[]) => verifyJwtMock(...args),
}));

function makeRequest(pathname: string, cookie?: string) {
  return new NextRequest(`http://localhost${pathname}`, {
    headers: cookie ? { cookie } : {},
  });
}

describe('middleware plan rules', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects unauthenticated user to login on private route', () => {
    verifyJwtMock.mockReturnValue(null);
    const response = middleware(makeRequest('/profile'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/login');
  });

  it('redirects expired trial user to pricing', () => {
    verifyJwtMock.mockReturnValue({
      userId: 'u1',
      plan: 'visitante',
      trial: true,
      trialActivated: false,
      trialExpiresAt: new Date(Date.now() - 60_000).toISOString(),
    });

    const response = middleware(makeRequest('/analysis', 'token=abc'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/pricing');
  });

  it('allows trial user to access home', () => {
    verifyJwtMock.mockReturnValue({
      userId: 'u1',
      plan: 'visitante',
      trial: true,
      trialActivated: false,
      trialExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    });

    const response = middleware(makeRequest('/', 'token=abc'));
    expect(response.status).toBe(200);
  });
});

