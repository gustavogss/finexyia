export const TRIAL_DURATION_DAYS = 7;

export type SubscriptionPlan = 'basic' | 'premium' | 'visitante';

export function getTrialExpiresAtIso() {
  return new Date(Date.now() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

export function buildTrialSubscription() {
  return {
    plan: 'basic' as const,
    trial: true,
    trialExpiresAt: getTrialExpiresAtIso(),
    credits: 0
  };
}

export function buildPaidSubscription(plan: Extract<SubscriptionPlan, 'basic' | 'premium'>) {
  return {
    plan,
    trial: false,
    trialExpiresAt: null,
    credits: plan === 'premium' ? 25 : 10
  };
}
