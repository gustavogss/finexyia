/**
 * Finexyia Design Tokens — Single Source of Truth
 *
 * Todas as cores do app são definidas aqui e sincronizadas com:
 * - tailwind.config.js (NativeWind)
 * - Componentes que precisam de cores programáticas (ex: tabs)
 */

export const colors = {
  primary: {
    DEFAULT: "#0F3D3E",
    light: "#1A6466",
    dark: "#082526",
    contrast: "#FFFFFF",
  },
  secondary: {
    DEFAULT: "#FF7A00",
    light: "#FF9533",
    dark: "#D46600",
    contrast: "#FFFFFF",
  },
  accent: {
    DEFAULT: "#00C2FF",
  },
  success: {
    DEFAULT: "#4ADE80",
    dark: "#22C55E",
  },
  error: {
    DEFAULT: "#F87171",
    dark: "#EF4444",
  },
  warning: {
    DEFAULT: "#FBBF24",
    dark: "#F59E0B",
  },
  neutral: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  background: {
    light: "#FFFFFF",
    dark: "#121212",
  },
  surface: {
    light: "#F8F9FA",
    dark: "#1E1E1E",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const roundness = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  full: 999,
} as const;

export const theme = { colors, spacing, roundness } as const;
