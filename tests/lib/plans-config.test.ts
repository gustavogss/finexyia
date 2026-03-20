import { getPlansConfig } from '@/lib/plans-config';

const getDocMock = jest.fn();

jest.mock('@/lib/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(() => ({})),
  getDoc: (...args: unknown[]) => getDocMock(...args),
}));

describe('plans-config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads valid plans config from Firestore', async () => {
    getDocMock.mockResolvedValue({
      data: () => ({
        trialDays: 7,
        basic: { priceMonthlyCents: 2990, credits: 10 },
        premium: { priceMonthlyCents: 5490, credits: 25 },
      }),
    });

    const config = await getPlansConfig();
    expect(config.trialDays).toBe(7);
    expect(config.basic.credits).toBe(10);
    expect(config.premium.credits).toBe(25);
  });

  it('throws when config is missing', async () => {
    getDocMock.mockResolvedValue({ data: () => undefined });
    await expect(getPlansConfig()).rejects.toThrow('Plans config not found');
  });
});

