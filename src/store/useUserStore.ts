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

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;

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

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const user = await loginUser(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loginGoogle: async () => {
    set({ isLoading: true });
    try {
      const user = await loginWithGoogle();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const user = await registerUser(name, email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await logoutUser();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  useCredit: async () => {
    const { user } = get();
    if (!user || user.credits <= 0) return false;

    const newCredits = user.credits - 1;
    await updateUserProfile(user.id, { credits: newCredits });
    set({ user: { ...user, credits: newCredits } });
    return true;
  },

  addCredits: async (amount) => {
    const { user } = get();
    if (!user) return;

    const newCredits = user.credits + amount;
    await updateUserProfile(user.id, { credits: newCredits });
    set({ user: { ...user, credits: newCredits } });
  },

  upgradeToPremium: async () => {
    const { user } = get();
    if (!user) return;

    const updates = { plan: "premium" as const, credits: user.credits + 50 };
    await updateUserProfile(user.id, updates);
    set({ user: { ...user, ...updates } });
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
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        set({
          user: profile,
          isAuthenticated: !!profile,
          isLoading: false,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    });
    return unsubscribe;
  },
}));
