import type { JwtPayload } from '@/lib/jwt';

export function getRedirectForPlan(payload?: Pick<JwtPayload, 'plan' | 'trial' | 'trialActivated'> | null) {
  if (!payload) {
    return '/login';
  }

  if (payload.trial) {
    return '/';
  }

  switch (payload.plan) {
    case 'basic':
    case 'premium':
      return '/';
    case 'visitante':
    default:
      return '/pricing';
  }
}
