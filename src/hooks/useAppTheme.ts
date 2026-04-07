/**
 * useAppTheme — hook centralizado de tema
 *
 * Retorna cores semânticas (bg, text, card, border, etc.) baseadas
 * no estado do useThemeStore. Qualquer tela que importe este hook
 * será automaticamente reativa ao toggle light/dark.
 *
 * Header e Tab Bar permanecem com cor fixa (independem do tema).
 */

import { useThemeStore } from "@/store/useThemeStore";

export function useAppTheme() {
  const { colorScheme } = useThemeStore();
  const isDark = colorScheme === "dark";

  return {
    isDark,

    // ── Backgrounds ──────────────────────────────────────
    /** Background principal da tela */
    bg: isDark ? "#121212" : "#FFFFFF",
    /** Background de cards e superfícies elevadas */
    card: isDark ? "#1E1E1E" : "#FFFFFF",
    /** Background de inputs, chips e elementos secundários */
    surface: isDark ? "#2A2A2A" : "#F9FAFB",

    // ── Textos ───────────────────────────────────────────
    /** Título principal */
    textPrimary: isDark ? "#F9FAFB" : "#0F3D3E",
    /** Texto de body, descrições */
    textSecondary: isDark ? "#9CA3AF" : "#6B7280",
    /** Texto de placeholder, labels sutis */
    textMuted: isDark ? "#6B7280" : "#9CA3AF",

    // ── Bordas ───────────────────────────────────────────
    border: isDark ? "#2A2A2A" : "#E5E7EB",
    borderSubtle: isDark ? "#1F1F1F" : "#F3F4F6",

    // ── Sombras ──────────────────────────────────────────
    /** Intensidade da sombra (0 no dark, pois some em fundos escuros) */
    shadowOpacity: isDark ? 0 : 0.06,

    // ── Ícones ───────────────────────────────────────────
    iconColor: isDark ? "#D1D5DB" : "#4B5563",
  } as const;
}
