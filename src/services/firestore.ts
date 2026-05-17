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

// ─── Error handling ─────────────────────────────────────────────────

/**
 * Logs errors in a structured way
 */
function logError(operation: string, error: unknown): void {
  console.error(`[Firestore] ${operation} failed:`, error);
}

/**
 * Validates that a user ID is provided
 */
function validateUserId(userId: string): void {
  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid user ID");
  }
}

// ─── Users ──────────────────────────────────────────────────────────

/**
 * Create or update a user profile
 *
 * @param user - User profile data
 * @throws Error if user ID is invalid
 */
export async function createUserProfile(user: User): Promise<void> {
  try {
    validateUserId(user.id);

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
  } catch (error) {
    logError("createUserProfile", error);
    throw error;
  }
}

/**
 * Get a user profile by ID
 *
 * @param userId - User ID
 * @returns User profile or null if not found
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    validateUserId(userId);

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
        typeof data.monthlyCreditLimit === "number" ? data.monthlyCreditLimit : 100,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
      currentPeriodEnd: data.currentPeriodEnd ?? null,
    } as User;
  } catch (error) {
    logError("getUserProfile", error);
    throw error;
  }
}

/**
 * Update a user profile
 *
 * @param userId - User ID
 * @param data - Partial user data to update
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<Omit<User, "id">>,
): Promise<void> {
  try {
    validateUserId(userId);

    await setDoc(doc(db, "users", userId), data, { merge: true });
  } catch (error) {
    logError("updateUserProfile", error);
    throw error;
  }
}

/**
 * Toggle auto-renewal for a user subscription
 *
 * @param userId - User ID
 * @param cancelAtPeriodEnd - Whether to cancel at period end
 */
export async function toggleAutoRenew(
  userId: string,
  cancelAtPeriodEnd: boolean,
): Promise<void> {
  try {
    validateUserId(userId);

    await setDoc(
      doc(db, "users", userId),
      {
        cancelAtPeriodEnd,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  } catch (error) {
    logError("toggleAutoRenew", error);
    throw error;
  }
}

// ─── Transactions ───────────────────────────────────────────────────

/**
 * Add a new transaction
 *
 * @param data - Transaction data
 * @returns Document ID
 */
export async function addTransaction(data: CreateTransaction): Promise<string> {
  try {
    validateUserId(data.userId);

    if (!data.amount || data.amount <= 0) {
      throw new Error("Invalid transaction amount");
    }

    const docRef = await addDoc(transactionsCol, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    logError("addTransaction", error);
    throw error;
  }
}

/**
 * Get all transactions for a user
 *
 * @param userId - User ID
 * @returns Array of transactions
 */
export async function getTransactions(userId: string): Promise<Transaction[]> {
  try {
    validateUserId(userId);

    const q = query(
      transactionsCol,
      where("userId", "==", userId),
      orderBy("date", "desc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Transaction);
  } catch (error) {
    logError("getTransactions", error);
    throw error;
  }
}

/**
 * Delete a transaction
 *
 * @param id - Transaction ID
 */
export async function deleteTransaction(id: string): Promise<void> {
  try {
    if (!id) throw new Error("Invalid transaction ID");

    await deleteDoc(doc(db, "transactions", id));
  } catch (error) {
    logError("deleteTransaction", error);
    throw error;
  }
}

// ─── Goals ──────────────────────────────────────────────────────────

/**
 * Add a new goal
 *
 * @param data - Goal data
 * @returns Document ID
 */
export async function addGoal(data: CreateGoal): Promise<string> {
  try {
    validateUserId(data.userId);

    const docRef = await addDoc(goalsCol, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    logError("addGoal", error);
    throw error;
  }
}

/**
 * Get all goals for a user
 *
 * @param userId - User ID
 * @returns Array of goals
 */
export async function getGoals(userId: string): Promise<Goal[]> {
  try {
    validateUserId(userId);

    const q = query(goalsCol, where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Goal);
  } catch (error) {
    logError("getGoals", error);
    throw error;
  }
}

/**
 * Update a goal
 *
 * @param goalId - Goal ID
 * @param data - Partial goal data
 */
export async function updateGoal(
  goalId: string,
  data: Partial<Omit<Goal, "id">>,
): Promise<void> {
  try {
    if (!goalId) throw new Error("Invalid goal ID");

    await updateDoc(doc(db, "goals", goalId), data);
  } catch (error) {
    logError("updateGoal", error);
    throw error;
  }
}

/**
 * Delete a goal
 *
 * @param id - Goal ID
 */
export async function deleteGoal(id: string): Promise<void> {
  try {
    if (!id) throw new Error("Invalid goal ID");

    await deleteDoc(doc(db, "goals", id));
  } catch (error) {
    logError("deleteGoal", error);
    throw error;
  }
}

// ─── Bills ──────────────────────────────────────────────────────────

/**
 * Add a new bill
 *
 * @param data - Bill data
 * @returns Document ID
 */
export async function addBill(data: CreateBill): Promise<string> {
  try {
    validateUserId(data.userId);

    const docRef = await addDoc(billsCol, {
      ...data,
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    logError("addBill", error);
    throw error;
  }
}

/**
 * Get all bills for a user
 *
 * @param userId - User ID
 * @returns Array of bills
 */
export async function getBills(userId: string): Promise<Bill[]> {
  try {
    validateUserId(userId);

    const q = query(
      billsCol,
      where("userId", "==", userId),
      orderBy("dueDate", "asc"),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Bill);
  } catch (error) {
    logError("getBills", error);
    throw error;
  }
}

/**
 * Update a bill
 *
 * @param billId - Bill ID
 * @param data - Partial bill data
 */
export async function updateBill(
  billId: string,
  data: Partial<Omit<Bill, "id">>,
): Promise<void> {
  try {
    if (!billId) throw new Error("Invalid bill ID");

    await updateDoc(doc(db, "bills", billId), data);
  } catch (error) {
    logError("updateBill", error);
    throw error;
  }
}

/**
 * Delete a bill
 *
 * @param id - Bill ID
 */
export async function deleteBill(id: string): Promise<void> {
  try {
    if (!id) throw new Error("Invalid bill ID");

    await deleteDoc(doc(db, "bills", id));
  } catch (error) {
    logError("deleteBill", error);
    throw error;
  }
}
