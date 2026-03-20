'use client';

import React, { createContext, useContext } from 'react';
import {
  createBudget,
  createTransaction,
  deleteBudgetRecord,
  deleteTransactionRecord,
  getUserProfile,
  subscribeToBudgets,
  subscribeToTransactions,
  updateBudgetRecord,
  updateTransactionRecord,
} from '@/lib/firestore-data';
import { useAuthUser } from '@/lib/use-auth-user';
import type { BudgetRecord, TransactionRecord } from '@/lib/firestore-types';

export interface Transaction extends Omit<TransactionRecord, 'userId' | 'createdAt'> {}
export interface Budget extends Omit<BudgetRecord, 'userId' | 'createdAt'> {}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  totalReservedBudget: number;
  availableIncome: number;
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  deleteBudget: (id: string) => void;
  updateBudget: (id: string, budget: Partial<Omit<Budget, 'id'>>) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthUser();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [openingBalance, setOpeningBalance] = React.useState(0);

  React.useEffect(() => {
    if (!user) {
      setTransactions([]);
      setBudgets([]);
      setOpeningBalance(0);
      return;
    }

    let isMounted = true;

    getUserProfile(user.uid)
      .then((profile) => {
        if (isMounted) {
          setOpeningBalance(profile?.openingBalance ?? 0);
        }
      })
      .catch(() => {
        if (isMounted) {
          setOpeningBalance(0);
        }
      });

    const unsubscribeTransactions = subscribeToTransactions(user.uid, (items) => {
      setTransactions(items.map(({ userId, createdAt, ...item }) => item));
    });

    const unsubscribeBudgets = subscribeToBudgets(user.uid, (items) => {
      setBudgets(items.map(({ userId, createdAt, ...item }) => item));
    });

    return () => {
      isMounted = false;
      unsubscribeTransactions();
      unsubscribeBudgets();
    };
  }, [user]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    if (!user) {
      return;
    }

    void createTransaction(user.uid, newTx);
  };

  const deleteTransaction = (id: string) => {
    void deleteTransactionRecord(id);
  };

  const updateTransaction = (id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
    void updateTransactionRecord(id, updates);
  };

  const addBudget = (newBudget: Omit<Budget, 'id'>) => {
    if (!user) {
      return;
    }

    void createBudget(user.uid, newBudget);
  };

  const deleteBudget = (id: string) => {
    void deleteBudgetRecord(id);
  };

  const updateBudget = (id: string, updates: Partial<Omit<Budget, 'id'>>) => {
    void updateBudgetRecord(id, updates);
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalReservedBudget = budgets.reduce((acc, b) => acc + b.amount, 0);

  const balance = openingBalance + totalIncome - totalExpenses;
  const availableIncome = balance - totalReservedBudget;

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        balance,
        totalIncome,
        totalExpenses,
        totalReservedBudget,
        availableIncome,
        budgets,
        addBudget,
        deleteBudget,
        updateBudget,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
