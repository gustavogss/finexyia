import { buildPaidSubscription, buildTrialSubscription, getTrialExpiresAtIso } from '@/lib/subscription';

describe('subscription business rules', () => {
  it('creates trial subscription for configured days', () => {
    const result = buildTrialSubscription(7);
    expect(result.plan).toBe('basic');
    expect(result.trial).toBe(true);
    expect(result.trialActivated).toBe(false);
    expect(result.credits).toBe(0);
    expect(typeof result.trialExpiresAt).toBe('string');
  });

  it('creates paid basic subscription with provided credits', () => {
    const result = buildPaidSubscription('basic', 10);
    expect(result).toEqual({
      plan: 'basic',
      trial: false,
      trialActivated: true,
      trialExpiresAt: null,
      credits: 10,
    });
  });

  it('creates paid premium subscription with provided credits', () => {
    const result = buildPaidSubscription('premium', 25);
    expect(result.credits).toBe(25);
    expect(result.plan).toBe('premium');
  });

  it('handles invalid trial days defensively', () => {
    const date = getTrialExpiresAtIso(Number.NaN);
    expect(typeof date).toBe('string');
  });
});

