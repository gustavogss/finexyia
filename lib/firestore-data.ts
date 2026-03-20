'use client';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type {
  BudgetRecord,
  CardRecord,
  FirestoreDateValue,
  GoalRecord,
  ReminderRecord,
  SubscriptionEventRecord,
  TransactionRecord,
  UserProfile,
  UserNotifications,
} from '@/lib/firestore-types';

function toIsoDate(value: FirestoreDateValue) {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return null;
}

function defaultNotifications(): UserNotifications {
  return {
    spendingAlerts: true,
    monthlyReports: false,
    dueAlerts: false,
  };
}

export function buildDefaultUserFields() {
  return {
    notifications: defaultNotifications(),
    autoRenewal: true,
    openingBalance: 0,
  };
}

function mapUserProfile(snapshot: QueryDocumentSnapshot<DocumentData> | { id: string; data(): DocumentData }): UserProfile {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name ?? '',
    email: data.email ?? '',
    photoURL: data.photoURL ?? '',
    createdAt: toIsoDate(data.createdAt),
    plan: data.plan ?? 'basic',
    credits: Number(data.credits ?? 0),
    trial: Boolean(data.trial),
    trialActivated: Boolean(data.trialActivated),
    trialExpiresAt: toIsoDate(data.trialExpiresAt),
    notifications: {
      ...defaultNotifications(),
      ...(data.notifications ?? {}),
    },
    autoRenewal: Boolean(data.autoRenewal ?? true),
    openingBalance: Number(data.openingBalance ?? 0),
  };
}

function mapTransaction(snapshot: QueryDocumentSnapshot<DocumentData>): TransactionRecord {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: data.userId,
    amount: Number(data.amount ?? 0),
    description: data.description ?? '',
    category: data.category ?? 'Outros',
    date: toIsoDate(data.date) ?? new Date().toISOString(),
    type: data.type === 'income' ? 'income' : 'expense',
    createdAt: toIsoDate(data.createdAt),
  };
}

function mapBudget(snapshot: QueryDocumentSnapshot<DocumentData>): BudgetRecord {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: data.userId,
    category: data.category ?? '',
    amount: Number(data.amount ?? 0),
    createdAt: toIsoDate(data.createdAt),
  };
}

function mapGoal(snapshot: QueryDocumentSnapshot<DocumentData>): GoalRecord {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: data.userId,
    name: data.name ?? '',
    currentAmount: Number(data.currentAmount ?? 0),
    targetAmount: Number(data.targetAmount ?? 0),
    monthlyTarget: Number(data.monthlyTarget ?? 0),
    history: Array.isArray(data.history) ? data.history : [],
    createdAt: toIsoDate(data.createdAt),
  };
}

function mapReminder(snapshot: QueryDocumentSnapshot<DocumentData>): ReminderRecord {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: data.userId,
    name: data.name ?? '',
    amount: Number(data.amount ?? 0),
    dueDate: toIsoDate(data.dueDate) ?? '',
    createdAt: toIsoDate(data.createdAt),
  };
}

function mapCard(snapshot: QueryDocumentSnapshot<DocumentData>): CardRecord {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: data.userId,
    name: data.name ?? '',
    number: data.number ?? '',
    expiry: data.expiry ?? '',
    cvv: data.cvv ?? '',
    createdAt: toIsoDate(data.createdAt),
  };
}

function mapSubscriptionEvent(snapshot: QueryDocumentSnapshot<DocumentData>): SubscriptionEventRecord {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    userId: data.userId,
    plan: data.plan ?? 'basic',
    trial: Boolean(data.trial),
    credits: data.credits ?? 0,
    createdAt: toIsoDate(data.createdAt),
    expiresAt: toIsoDate(data.expiresAt),
  };
}

export async function getUserProfile(userId: string) {
  const userSnapshot = await getDoc(doc(db, 'users', userId));
  if (!userSnapshot.exists()) {
    return null;
  }

  return mapUserProfile(userSnapshot);
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  await updateDoc(doc(db, 'users', userId), updates);
}

export function subscribeToTransactions(userId: string, onChange: (items: TransactionRecord[]) => void): Unsubscribe {
  const q = query(collection(db, 'transactions'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) =>
      onChange(
        snapshot.docs
          .map(mapTransaction)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      ),
    (error) => {
      console.error('Failed to subscribe to transactions', error);
      onChange([]);
    }
  );
}

export function subscribeToBudgets(userId: string, onChange: (items: BudgetRecord[]) => void): Unsubscribe {
  const q = query(collection(db, 'budgets'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) =>
      onChange(
        snapshot.docs
          .map(mapBudget)
          .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      ),
    (error) => {
      console.error('Failed to subscribe to budgets', error);
      onChange([]);
    }
  );
}

export function subscribeToGoals(userId: string, onChange: (items: GoalRecord[]) => void): Unsubscribe {
  const q = query(collection(db, 'goals'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) =>
      onChange(
        snapshot.docs
          .map(mapGoal)
          .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      ),
    (error) => {
      console.error('Failed to subscribe to goals', error);
      onChange([]);
    }
  );
}

export function subscribeToReminders(userId: string, onChange: (items: ReminderRecord[]) => void): Unsubscribe {
  const q = query(collection(db, 'reminders'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) =>
      onChange(
        snapshot.docs
          .map(mapReminder)
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      ),
    (error) => {
      console.error('Failed to subscribe to reminders', error);
      onChange([]);
    }
  );
}

export function subscribeToCards(userId: string, onChange: (items: CardRecord[]) => void): Unsubscribe {
  const q = query(collection(db, 'cards'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) =>
      onChange(
        snapshot.docs
          .map(mapCard)
          .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      ),
    (error) => {
      console.error('Failed to subscribe to cards', error);
      onChange([]);
    }
  );
}

export function subscribeToSubscriptionEvents(userId: string, onChange: (items: SubscriptionEventRecord[]) => void): Unsubscribe {
  const q = query(collection(db, 'subscription_events'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) =>
      onChange(
        snapshot.docs
          .map(mapSubscriptionEvent)
          .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      ),
    (error) => {
      console.error('Failed to subscribe to subscription events', error);
      onChange([]);
    }
  );
}

export async function createTransaction(userId: string, data: Omit<TransactionRecord, 'id' | 'userId' | 'createdAt'>) {
  await addDoc(collection(db, 'transactions'), {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateTransactionRecord(id: string, updates: Partial<Omit<TransactionRecord, 'id' | 'userId' | 'createdAt'>>) {
  await updateDoc(doc(db, 'transactions', id), updates);
}

export async function deleteTransactionRecord(id: string) {
  await deleteDoc(doc(db, 'transactions', id));
}

export async function createBudget(userId: string, data: Omit<BudgetRecord, 'id' | 'userId' | 'createdAt'>) {
  await addDoc(collection(db, 'budgets'), {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateBudgetRecord(id: string, updates: Partial<Omit<BudgetRecord, 'id' | 'userId' | 'createdAt'>>) {
  await updateDoc(doc(db, 'budgets', id), updates);
}

export async function deleteBudgetRecord(id: string) {
  await deleteDoc(doc(db, 'budgets', id));
}

export async function createGoal(userId: string, data: Omit<GoalRecord, 'id' | 'userId' | 'createdAt'>) {
  await addDoc(collection(db, 'goals'), {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateGoalRecord(id: string, updates: Partial<Omit<GoalRecord, 'id' | 'userId' | 'createdAt'>>) {
  await updateDoc(doc(db, 'goals', id), updates);
}

export async function deleteGoalRecord(id: string) {
  await deleteDoc(doc(db, 'goals', id));
}

export async function createReminder(userId: string, data: Omit<ReminderRecord, 'id' | 'userId' | 'createdAt'>) {
  await addDoc(collection(db, 'reminders'), {
    userId,
    ...data,
    dueDate: new Date(data.dueDate),
    createdAt: serverTimestamp(),
  });
}

export async function updateReminderRecord(id: string, updates: Partial<Omit<ReminderRecord, 'id' | 'userId' | 'createdAt'>>) {
  await updateDoc(doc(db, 'reminders', id), {
    ...updates,
    ...(updates.dueDate ? { dueDate: new Date(updates.dueDate) } : {}),
  });
}

export async function deleteReminderRecord(id: string) {
  await deleteDoc(doc(db, 'reminders', id));
}

export async function createCard(userId: string, data: Omit<CardRecord, 'id' | 'userId' | 'createdAt'>) {
  await addDoc(collection(db, 'cards'), {
    userId,
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function deleteCardRecord(id: string) {
  await deleteDoc(doc(db, 'cards', id));
}

export async function createSubscriptionEvent(userId: string, data: Omit<SubscriptionEventRecord, 'id' | 'userId' | 'createdAt'>) {
  await addDoc(collection(db, 'subscription_events'), {
    userId,
    ...data,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    createdAt: serverTimestamp(),
  });
}

export async function ensureUserDocument(userId: string, data: Record<string, unknown>) {
  await setDoc(doc(db, 'users', userId), data, { merge: true });
}
