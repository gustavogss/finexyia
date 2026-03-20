import { getRedirectForPlan } from '@/lib/plan-routing';

describe('plan-routing', () => {
  it('returns login when payload is empty', () => {
    expect(getRedirectForPlan(null)).toBe('/login');
    expect(getRedirectForPlan(undefined)).toBe('/login');
  });

  it('returns home for active trial', () => {
    expect(getRedirectForPlan({ plan: 'visitante', trial: true, trialActivated: false })).toBe('/');
  });

  it('returns home for basic and premium paid plans', () => {
    expect(getRedirectForPlan({ plan: 'basic', trial: false, trialActivated: true })).toBe('/');
    expect(getRedirectForPlan({ plan: 'premium', trial: false, trialActivated: true })).toBe('/');
  });

  it('returns pricing for visitante without trial', () => {
    expect(getRedirectForPlan({ plan: 'visitante', trial: false, trialActivated: false })).toBe('/pricing');
  });
});

