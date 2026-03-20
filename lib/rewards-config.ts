import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type RewardsConfig = {
  usage: {
    thresholds: number[]; // e.g. [1, 10, 30]
    rewards: number[]; // e.g. [1, 2, 3]
  };
  plan: {
    basicReward: number;
    premiumReward: number;
  };
  engagement: {
    firstIncomeReward: number;
    firstExpenseReward: number;
    balancedThreshold: number;
    balancedReward: number;
  };
  goals: {
    completeGoalReward: number;
  };
};

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asNumberArray(value: unknown): number[] | null {
  if (!Array.isArray(value)) return null;
  const numbers = value.map((v) => asNumber(v));
  if (numbers.some((v) => v === null)) return null;
  return numbers as number[];
}

export async function getRewardsConfig(): Promise<RewardsConfig> {
  const snapshot = await getDoc(doc(db, 'config', 'rewards'));
  const data = snapshot.data();
  if (!data) {
    throw new Error('Rewards config not found: config/rewards');
  }

  const usageThresholds = asNumberArray(data.usage?.thresholds);
  const usageRewards = asNumberArray(data.usage?.rewards);
  const planBasicReward = asNumber(data.plan?.basicReward);
  const planPremiumReward = asNumber(data.plan?.premiumReward);
  const firstIncomeReward = asNumber(data.engagement?.firstIncomeReward);
  const firstExpenseReward = asNumber(data.engagement?.firstExpenseReward);
  const balancedThreshold = asNumber(data.engagement?.balancedThreshold);
  const balancedReward = asNumber(data.engagement?.balancedReward);
  const completeGoalReward = asNumber(data.goals?.completeGoalReward);

  if (
    !usageThresholds ||
    !usageRewards ||
    usageThresholds.length !== usageRewards.length ||
    planBasicReward === null ||
    planPremiumReward === null ||
    firstIncomeReward === null ||
    firstExpenseReward === null ||
    balancedThreshold === null ||
    balancedReward === null ||
    completeGoalReward === null
  ) {
    throw new Error('Invalid rewards config shape');
  }

  return {
    usage: { thresholds: usageThresholds, rewards: usageRewards },
    plan: { basicReward: planBasicReward, premiumReward: planPremiumReward },
    engagement: {
      firstIncomeReward,
      firstExpenseReward,
      balancedThreshold,
      balancedReward,
    },
    goals: { completeGoalReward },
  };
}

