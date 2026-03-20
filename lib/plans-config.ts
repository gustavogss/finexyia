import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type PlanType = 'basic' | 'premium' | 'visitante';

export type PlansConfig = {
  trialDays: number;
  basic: {
    priceMonthlyCents: number;
    credits: number;
  };
  premium: {
    priceMonthlyCents: number;
    credits: number;
  };
};

function assertFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export async function getPlansConfig(): Promise<PlansConfig> {
  // Expected Firestore doc: `config/plans`
  const snapshot = await getDoc(doc(db, 'config', 'plans'));
  const data = snapshot.data();

  if (!data) {
    throw new Error('Plans config not found: config/plans');
  }

  const trialDays = assertFiniteNumber(data.trialDays);
  const basicPriceMonthlyCents = assertFiniteNumber(data.basic?.priceMonthlyCents);
  const basicCredits = assertFiniteNumber(data.basic?.credits);
  const premiumPriceMonthlyCents = assertFiniteNumber(data.premium?.priceMonthlyCents);
  const premiumCredits = assertFiniteNumber(data.premium?.credits);

  if (
    trialDays === null ||
    basicPriceMonthlyCents === null ||
    basicCredits === null ||
    premiumPriceMonthlyCents === null ||
    premiumCredits === null
  ) {
    throw new Error('Invalid plans config shape');
  }

  return {
    trialDays,
    basic: { priceMonthlyCents: basicPriceMonthlyCents, credits: basicCredits },
    premium: { priceMonthlyCents: premiumPriceMonthlyCents, credits: premiumCredits },
  };
}

export function planTypeFromString(value: string): PlanType | null {
  if (value === 'basic' || value === 'premium' || value === 'visitante') return value;
  return null;
}

