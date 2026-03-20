import { getRewardsConfig } from '@/lib/rewards-config';

const getDocMock = jest.fn();

jest.mock('@/lib/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({})),
  getDoc: (...args: unknown[]) => getDocMock(...args),
}));

describe('rewards-config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads valid rewards config', async () => {
    getDocMock.mockResolvedValue({
      data: () => ({
        usage: { thresholds: [1, 10, 30], rewards: [1, 2, 3] },
        plan: { basicReward: 10, premiumReward: 25 },
        engagement: {
          firstIncomeReward: 1,
          firstExpenseReward: 1,
          balancedThreshold: 5,
          balancedReward: 2,
        },
        goals: { completeGoalReward: 2 },
      }),
    });

    const config = await getRewardsConfig();
    expect(config.usage.thresholds).toEqual([1, 10, 30]);
    expect(config.plan.premiumReward).toBe(25);
    expect(config.goals.completeGoalReward).toBe(2);
  });
});

