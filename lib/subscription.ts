export type SubscriptionPlan = 'basic' | 'premium' | 'visitante';

export function getTrialExpiresAtIso(trialDays: number) {
  const safeDays = Number.isFinite(trialDays) ? Math.max(0, trialDays) : 0;
  return new Date(Date.now() + safeDays * 24 * 60 * 60 * 1000).toISOString();
}

export function buildTrialSubscription(trialDays: number) {
  return {
    plan: 'basic' as const, // durante trial, o plano base continua sendo "basic"
    trial: true,
    trialActivated: false,
    trialExpiresAt: getTrialExpiresAtIso(trialDays),
    credits: 0,
  };
}

export function buildPaidSubscription(plan: Extract<SubscriptionPlan, 'basic' | 'premium'>, credits: number) {
  return {
    plan,
    trial: false,
    trialActivated: true,
    trialExpiresAt: null,
    credits,
  };
}
