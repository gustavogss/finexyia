import type { Timestamp } from 'firebase/firestore';

export type PlanType = 'basic' | 'premium' | 'visitante';

export interface UserNotifications {
  spendingAlerts: boolean;
  monthlyReports: boolean;
  dueAlerts: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: string | null;
  plan: PlanType;
  credits: number;
  trial: boolean;
  trialActivated: boolean;
  trialExpiresAt: string | null;
  notifications: UserNotifications;
  autoRenewal: boolean;
  openingBalance: number;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'expense' | 'income';
  createdAt: string | null;
}

export interface BudgetRecord {
  id: string;
  userId: string;
  category: string;
  amount: number;
  createdAt: string | null;
}

export interface GoalHistoryEntry {
  month: string;
  saved: number;
}

export interface GoalRecord {
  id: string;
  userId: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  monthlyTarget: number;
  history: GoalHistoryEntry[];
  createdAt: string | null;
}

export interface ReminderRecord {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string;
  createdAt: string | null;
}

export interface CardRecord {
  id: string;
  userId: string;
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  createdAt: string | null;
}

export interface SubscriptionEventRecord {
  id: string;
  userId: string;
  plan: PlanType;
  trial: boolean;
  credits: number | string;
  createdAt: string | null;
  expiresAt: string | null;
}

export type FirestoreDateValue = string | Timestamp | null | undefined;
