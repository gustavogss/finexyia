/**
 * Finexyia — Shared type definitions
 * Aligned with Firestore collections defined in docs/core/sdd.md
 */

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium';
  credits: number;
  avatar?: string;
  createdAt: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'inactive';
  isTrial?: boolean;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  mesesConsecutivos?: number;
  monthlyCreditLimit?: number;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDate: string;
  reminderEnabled: boolean;
}

/**
 * Reminder for bills/recurring payments
 */
export interface Reminder {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  startDate: string;
  endDate: string;
  recurring: boolean;
  paid: boolean;
}

/**
 * Budget tracking for categories
 */
export interface Budget {
  id: string;
  userId: string;
  name: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly'; // Added for clarity
}

/**
 * Firestore document data (without id, since Firestore provides it)
 */
export type CreateUser = Omit<User, 'id'>;
export type CreateTransaction = Omit<Transaction, 'id'>;
export type CreateGoal = Omit<Goal, 'id'>;
export type CreateBill = Omit<Bill, 'id'>;
export type CreateReminder = Omit<Reminder, 'id'>;
export type CreateBudget = Omit<Budget, 'id'>;

/**
 * Error handling types
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Pagination types
 */
export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
}
