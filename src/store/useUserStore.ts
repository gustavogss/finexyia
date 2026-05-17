import {
  loginUser,
  loginWithGoogle,
  logoutUser,
  onAuthChange,
  registerUser,
} from "@/services/auth";
import { getUserProfile, updateUserProfile } from "@/services/firestore";
import { User } from "@/types";
import { create } from "zustand";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;

  // Credit actions (persisted to Firestore)
  useCredit: () => Promise<boolean>;
  addCredits: (amount: number) => Promise<void>;
  upgradeToPremium: () => Promise<void>;

  // Auth listener
  initAuthListener: () => () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }),

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginUser(email, password);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fazer login";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  loginGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginWithGoogle();
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fazer login com Google";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await registerUser(name, email, password);
      set({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao registrar";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  logout: async () => {
    try {
      await logoutUser();
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao fazer logout";
      set({ error: errorMessage });
      throw error;
    }
  },

  useCredit: async () => {
    const { user } = get();
    if (!user || user.credits <= 0) {
      set({ error: "Créditos insuficientes" });
      return false;
    }

    try {
      const newCredits = user.credits - 1;
      await updateUserProfile(user.id, { credits: newCredits });
      set({ user: { ...user, credits: newCredits }, error: null });
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao usar crédito";
      set({ error: errorMessage });
      return false;
    }
  },

  addCredits: async (amount) => {
    const { user } = get();
    if (!user) {
      set({ error: "Usuário não autenticado" });
      return;
    }

    if (amount <= 0) {
      set({ error: "Quantidade de créditos inválida" });
      return;
    }

    try {
      const newCredits = user.credits + amount;
      await updateUserProfile(user.id, { credits: newCredits });
      set({ user: { ...user, credits: newCredits }, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao adicionar créditos";
      set({ error: errorMessage });
      throw error;
    }
  },

  upgradeToPremium: async () => {
    const { user } = get();
    if (!user) {
      set({ error: "Usuário não autenticado" });
      return;
    }

    try {
      const updates = {
        plan: "premium" as const,
        credits: 50,
        monthlyCreditLimit: 50,
        updatedAt: new Date().toISOString(),
      };
      await updateUserProfile(user.id, updates);
      set({ user: { ...user, ...updates }, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao fazer upgrade para Premium";
      set({ error: errorMessage });
      throw error;
    }
  },

  /**
   * Listen for Firebase Auth state changes.
   * When the user reopens the app, this restores their session
   * by fetching their Firestore profile.
   *
   * Call this once in the root layout. Returns unsubscribe fn.
   */
  initAuthListener: () => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const profile = await getUserProfile(firebaseUser.uid);

          if (!profile) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: "Perfil do usuário não encontrado",
            });
            return;
          }

          // Fix old users initialized with 100 credits by buggy code
          if (profile.plan === "free" && profile.credits === 100) {
            profile.credits = 5;
            profile.monthlyCreditLimit = 5;
            await updateUserProfile(profile.id, {
              credits: 5,
              monthlyCreditLimit: 5,
            });
          }

          set({
            user: profile,
            isAuthenticated: !!profile,
            isLoading: false,
            error: null,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erro ao restaurar sessão";
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: errorMessage,
        });
      }
    });
    return unsubscribe;
  },
}));
