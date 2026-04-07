import { create } from "zustand";

type ColorScheme = "light" | "dark";

interface ThemeState {
  colorScheme: ColorScheme;
  toggleTheme: () => void;
  setTheme: (scheme: ColorScheme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  colorScheme: "light",
  toggleTheme: () =>
    set((state) => ({
      colorScheme: state.colorScheme === "light" ? "dark" : "light",
    })),
  setTheme: (scheme) => set({ colorScheme: scheme }),
}));
