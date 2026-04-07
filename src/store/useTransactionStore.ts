/**
 * useTransactionStore — Zustand store para transações
 *
 * Gerencia transações, lembretes, orçamentos e metas financeiras.
 */

import { create } from "zustand";

// ─── Types ──────────────────────────────────────────────────────────────────

export type TransactionType = "expense" | "income";

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: Date;
  description?: string;
}

export interface Reminder {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  startDate: string;
  endDate: string;
  recurring: boolean;
  paid: boolean;
}

export interface Budget {
  id: string;
  name: string;
  categoryId: string;
  limit: number;
  spent: number;
}

export interface Goal {
  id: string;
  name: string;
  categoryId: string;
  current: number;
  target: number;
  deadline?: string;
}

interface TransactionState {
  transactions: Transaction[];
  reminders: Reminder[];
  budgets: Budget[];
  goals: Goal[];

  // Actions
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  addReminder: (r: Omit<Reminder, "id">) => void;
  removeReminder: (id: string) => void;
  toggleReminderPaid: (id: string) => void;
  addBudget: (b: Omit<Budget, "id">) => void;
  removeBudget: (id: string) => void;
  addGoal: (g: Omit<Goal, "id">) => void;
  removeGoal: (id: string) => void;
  addToGoal: (id: string, amount: number) => void;

  // Computed
  totalIncome: () => number;
  totalExpenses: () => number;
  balance: () => number;
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

// ─── Initial Data ───────────────────────────────────────────────────────────

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    name: "Uber",
    amount: 10,
    type: "expense",
    categoryId: "transporte",
    date: new Date(2026, 3, 1),
    description: "Corrida para o trabalho",
  },
  {
    id: "tx2",
    name: "Salário",
    amount: 5000,
    type: "income",
    categoryId: "salario",
    date: new Date(2026, 3, 1),
    description: "Salário mensal",
  },
  {
    id: "tx3",
    name: "Lanche",
    amount: 20,
    type: "expense",
    categoryId: "alimentacao",
    date: new Date(2026, 3, 1),
    description: "Lanche da tarde",
  },
  {
    id: "tx4",
    name: "Freelance",
    amount: 1200,
    type: "income",
    categoryId: "freelance",
    date: new Date(2026, 3, 3),
    description: "Projeto web finalizado",
  },
  {
    id: "tx5",
    name: "Supermercado",
    amount: 280,
    type: "expense",
    categoryId: "alimentacao",
    date: new Date(2026, 3, 2),
    description: "Compras da semana",
  },
  {
    id: "tx6",
    name: "Academia",
    amount: 89.9,
    type: "expense",
    categoryId: "saude",
    date: new Date(2026, 3, 5),
    description: "Mensalidade SmartFit",
  },
  {
    id: "tx7",
    name: "Netflix",
    amount: 39.9,
    type: "expense",
    categoryId: "lazer",
    date: new Date(2026, 3, 5),
    description: "Assinatura mensal",
  },
];

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: "r1",
    name: "Aluguel",
    amount: 1000,
    categoryId: "moradia",
    startDate: "10/04/2026",
    endDate: "∞",
    recurring: true,
    paid: false,
  },
  {
    id: "r2",
    name: "Internet",
    amount: 119.9,
    categoryId: "moradia",
    startDate: "15/04/2026",
    endDate: "∞",
    recurring: true,
    paid: false,
  },
];

const INITIAL_BUDGETS: Budget[] = [
  { id: "b1", name: "Lazer", categoryId: "lazer", limit: 200, spent: 39.9 },
  {
    id: "b2",
    name: "Alimentação",
    categoryId: "alimentacao",
    limit: 800,
    spent: 300,
  },
  {
    id: "b3",
    name: "Transporte",
    categoryId: "transporte",
    limit: 300,
    spent: 10,
  },
];

const INITIAL_GOALS: Goal[] = [
  {
    id: "g1",
    name: "Mudança",
    categoryId: "moradia",
    current: 1250,
    target: 5000,
    deadline: "Maio 2026",
  },
  {
    id: "g2",
    name: "Reserva de Emergência",
    categoryId: "investimento",
    current: 3800,
    target: 10000,
    deadline: "Dezembro 2026",
  },
];

// ─── Store ──────────────────────────────────────────────────────────────────

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: INITIAL_TRANSACTIONS,
  reminders: INITIAL_REMINDERS,
  budgets: INITIAL_BUDGETS,
  goals: INITIAL_GOALS,

  addTransaction: (tx) =>
    set((s) => ({
      transactions: [{ ...tx, id: uid() }, ...s.transactions],
    })),

  removeTransaction: (id) =>
    set((s) => ({
      transactions: s.transactions.filter((t) => t.id !== id),
    })),

  addReminder: (r) =>
    set((s) => ({
      reminders: [...s.reminders, { ...r, id: uid() }],
    })),

  removeReminder: (id) =>
    set((s) => ({
      reminders: s.reminders.filter((r) => r.id !== id),
    })),

  toggleReminderPaid: (id) =>
    set((s) => ({
      reminders: s.reminders.map((r) =>
        r.id === id ? { ...r, paid: !r.paid } : r
      ),
    })),

  addBudget: (b) =>
    set((s) => ({
      budgets: [...s.budgets, { ...b, id: uid() }],
    })),

  removeBudget: (id) =>
    set((s) => ({
      budgets: s.budgets.filter((b) => b.id !== id),
    })),

  addGoal: (g) =>
    set((s) => ({
      goals: [...s.goals, { ...g, id: uid() }],
    })),

  removeGoal: (id) =>
    set((s) => ({
      goals: s.goals.filter((g) => g.id !== id),
    })),

  addToGoal: (id, amount) =>
    set((s) => ({
      goals: s.goals.map((g) =>
        g.id === id ? { ...g, current: Math.min(g.current + amount, g.target) } : g
      ),
    })),

  totalIncome: () =>
    get()
      .transactions.filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),

  totalExpenses: () =>
    get()
      .transactions.filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),

  balance: () => get().totalIncome() - get().totalExpenses(),
}));
