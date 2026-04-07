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
 * Firestore document data (without id, since Firestore provides it)
 */
export type CreateUser = Omit<User, 'id'>;
export type CreateTransaction = Omit<Transaction, 'id'>;
export type CreateGoal = Omit<Goal, 'id'>;
export type CreateBill = Omit<Bill, 'id'>;
