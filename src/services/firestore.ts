import type {
  Bill,
  CreateBill,
  CreateGoal,
  CreateTransaction,
  Goal,
  Transaction,
  User,
} from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

// ─── Collection references ──────────────────────────────────────────
const usersCol = collection(db, "users");
const transactionsCol = collection(db, "transactions");
const goalsCol = collection(db, "goals");
const billsCol = collection(db, "bills");

// ─── Users ──────────────────────────────────────────────────────────

export async function createUserProfile(user: User): Promise<void> {
  await setDoc(
    doc(db, "users", user.id),
    {
      name: user.name,
      email: user.email,
      plan: user.plan,
      credits: user.credits ?? 5,
      monthlyCreditLimit: user.monthlyCreditLimit ?? 5,
      avatar: user.avatar ?? null,
      createdAt: user.createdAt,
      subscriptionStatus: user.subscriptionStatus ?? "active",
      isTrial: user.isTrial ?? true,
      currentPeriodStart: user.currentPeriodStart ?? new Date().toISOString(),
      currentPeriodEnd:
        user.currentPeriodEnd ??
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: user.cancelAtPeriodEnd ?? false,
      mesesConsecutivos: user.mesesConsecutivos ?? 0,
      stripeCustomerId: user.stripeCustomerId ?? null,
      stripeSubscriptionId: user.stripeSubscriptionId ?? null,
      updatedAt: user.updatedAt ?? new Date().toISOString(),
    },
    { merge: true },
  );
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", userId));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    ...data,
    id: snap.id,
    plan: data.plan || "free",
    subscriptionStatus: data.subscriptionStatus || "inactive",
    credits: typeof data.credits === "number" ? data.credits : 0,
    monthlyCreditLimit:
      typeof data.monthlyCreditLimit === "number"
        ? data.monthlyCreditLimit
        : 100,
    cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
    currentPeriodEnd: data.currentPeriodEnd ?? null,
  } as User;
}

export async function updateUserProfile(
  userId: string,
  data: Partial<Omit<User, "id">>,
): Promise<void> {
  // Use setDoc with merge: true to avoid errors if the document does not exist yet.
  await setDoc(doc(db, "users", userId), data, { merge: true });
}

export async function toggleAutoRenew(
  userId: string,
  cancelAtPeriodEnd: boolean,
): Promise<void> {
  // Use setDoc with merge: true to avoid errors if the document does not exist yet.
  await setDoc(
    doc(db, "users", userId),
    {
      cancelAtPeriodEnd,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
}

// ─── Transactions ───────────────────────────────────────────────────

export async function addTransaction(data: CreateTransaction): Promise<string> {
  const docRef = await addDoc(transactionsCol, data);
  return docRef.id;
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const q = query(
    transactionsCol,
    where("userId", "==", userId),
    orderBy("date", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Transaction);
}

export async function deleteTransaction(id: string): Promise<void> {
  await deleteDoc(doc(db, "transactions", id));
}

// ─── Goals ──────────────────────────────────────────────────────────

export async function addGoal(data: CreateGoal): Promise<string> {
  const docRef = await addDoc(goalsCol, data);
  return docRef.id;
}

export async function getGoals(userId: string): Promise<Goal[]> {
  const q = query(goalsCol, where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Goal);
}

export async function updateGoal(
  goalId: string,
  data: Partial<Omit<Goal, "id">>,
): Promise<void> {
  await updateDoc(doc(db, "goals", goalId), data);
}

export async function deleteGoal(id: string): Promise<void> {
  await deleteDoc(doc(db, "goals", id));
}

// ─── Bills ──────────────────────────────────────────────────────────

export async function addBill(data: CreateBill): Promise<string> {
  const docRef = await addDoc(billsCol, data);
  return docRef.id;
}

export async function getBills(userId: string): Promise<Bill[]> {
  const q = query(
    billsCol,
    where("userId", "==", userId),
    orderBy("dueDate", "asc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bill);
}

export async function updateBill(
  billId: string,
  data: Partial<Omit<Bill, "id">>,
): Promise<void> {
  await updateDoc(doc(db, "bills", billId), data);
}

export async function deleteBill(id: string): Promise<void> {
  await deleteDoc(doc(db, "bills", id));
}
