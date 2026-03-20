/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'expense' | 'income';
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
}

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTransactions = localStorage.getItem('financy_transactions');
      const savedBudgets = localStorage.getItem('financy_budgets');
      if (savedTransactions) {
        try {
          setTransactions(JSON.parse(savedTransactions));
        } catch (e) {
          console.error('Failed to parse transactions', e);
        }
      } else {
        // Initial mock data if nothing saved
        const mockData: Transaction[] = [
          { id: '1', description: 'Supermercado Silva', amount: 420.50, category: 'Alimentação', date: new Date().toISOString(), type: 'expense' as const },
          { id: '2', description: 'Salário Mensal', amount: 5500.00, category: 'Salário', date: new Date().toISOString(), type: 'income' as const },
          { id: '3', description: 'Posto Shell', amount: 180.00, category: 'Transporte', date: new Date().toISOString(), type: 'expense' as const },
        ].map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9) }));
        setTransactions(mockData);
      }
      if (savedBudgets) {
        try {
          setBudgets(JSON.parse(savedBudgets));
        } catch (e) {
          console.error('Failed to parse budgets', e);
        }
      }
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('financy_transactions', JSON.stringify(transactions));
      localStorage.setItem('financy_budgets', JSON.stringify(budgets));
    }
  }, [transactions, budgets, isInitialized]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addBudget = (newBudget: Omit<Budget, 'id'>) => {
    const budget: Budget = {
      ...newBudget,
      id: Math.random().toString(36).substr(2, 9),
    };
    setBudgets(prev => [...prev, budget]);
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  const updateBudget = (id: string, updates: Partial<Omit<Budget, 'id'>>) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const previousBalance = 2000;

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalReservedBudget = budgets.reduce((acc, b) => acc + b.amount, 0);

  const balance = previousBalance + totalIncome - totalExpenses;
  const availableIncome = balance - totalReservedBudget;

  return (
    <TransactionContext.Provider value={{ 
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
      updateBudget
    }}>
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
