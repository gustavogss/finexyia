import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export type ColorScheme = "light" | "dark";

interface ThemeState {
  colorScheme: ColorScheme;
  toggleTheme: () => Promise<void>;
  setTheme: (scheme: ColorScheme) => Promise<void>;
  initTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = "@finexyia_theme";

export const useThemeStore = create<ThemeState>((set) => ({
  colorScheme: "light",

  toggleTheme: async () => {
    set((state) => {
      const newScheme = state.colorScheme === "light" ? "dark" : "light";
      // Persist to storage asynchronously
      AsyncStorage.setItem(THEME_STORAGE_KEY, newScheme).catch((error) => {
        console.error("[Theme] Failed to save theme preference:", error);
      });
      return { colorScheme: newScheme };
    });
  },

  setTheme: async (scheme: ColorScheme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
      set({ colorScheme: scheme });
    } catch (error) {
      console.error("[Theme] Failed to save theme preference:", error);
      throw error;
    }
  },

  /**
   * Initialize theme from persistent storage
   * Call this once during app startup
   */
  initTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "light" || savedTheme === "dark") {
        set({ colorScheme: savedTheme });
      }
    } catch (error) {
      console.error("[Theme] Failed to load theme preference:", error);
      // Fallback to light theme
      set({ colorScheme: "light" });
    }
  },
}));
