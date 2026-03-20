import type { JwtPayload } from '@/lib/jwt';

export function getRedirectForPlan(plan?: JwtPayload['plan'] | null) {
  switch (plan) {
    case 'basic':
      return '/dashboard/basic';
    case 'premium':
      return '/dashboard/premium';
    case 'visitante':
    default:
      return '/pricing';
  }
}
