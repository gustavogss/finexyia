/**
 * Finexyia — Application Constants
 * Centralized configuration and magic values
 */

// ─── Auth ────────────────────────────────────────────────────────────────
export const AUTH_CONSTANTS = {
  INITIAL_CREDITS: 5,
  INITIAL_MONTHLY_LIMIT: 5,
  TRIAL_DURATION_DAYS: 30,
  DEFAULT_PLAN: 'free' as const,
  DEFAULT_SUBSCRIPTION_STATUS: 'active' as const,
} as const;

// ─── Premium Plan ────────────────────────────────────────────────────────
export const PREMIUM_CONSTANTS = {
  PLAN_NAME: 'premium',
  MONTHLY_PRICE: 39.90,
  MONTHLY_CREDITS: 50,
  MONTHLY_CREDIT_LIMIT: 50,
} as const;

// ─── Credits ─────────────────────────────────────────────────────────────
export const CREDIT_CONSTANTS = {
  COST_PER_AI_CALL: 1,
  CREDIT_PACKAGES: [
    { credits: 10, price: 15.90 },
    { credits: 30, price: 29.90 },
    { credits: 50, price: 39.90 },
  ] as const,
} as const;

// ─── Rewards ─────────────────────────────────────────────────────────────
export const REWARD_CONSTANTS = {
  RELEASE_DAY: 10, // 10th of the month
  CONSECUTIVE_DAYS_BONUS: 7,
  CONSECUTIVE_DAYS_CREDITS: 1,
  RENEWAL_MONTHS_BONUS: 2,
  RENEWAL_MONTHS_CREDITS: 2,
  REFERRAL_BONUS_CREDITS: 5,
} as const;

// ─── Categories ──────────────────────────────────────────────────────────
export const TRANSACTION_CATEGORIES = {
  EXPENSE: [
    { id: 'moradia', label: 'Moradia', color: '#6366F1' },
    { id: 'transporte', label: 'Transporte', color: '#F59E0B' },
    { id: 'alimentacao', label: 'Alimentação', color: '#EF4444' },
    { id: 'compras', label: 'Compras', color: '#EC4899' },
    { id: 'lazer', label: 'Lazer', color: '#8B5CF6' },
    { id: 'saude', label: 'Saúde', color: '#10B981' },
    { id: 'educacao', label: 'Educação', color: '#3B82F6' },
  ] as const,
  INCOME: [
    { id: 'salario', label: 'Salário', color: '#22C55E' },
    { id: 'freelance', label: 'Freelance', color: '#14B8A6' },
    { id: 'investimento', label: 'Investimento', color: '#0EA5E9' },
  ] as const,
} as const;

// ─── UI/UX ───────────────────────────────────────────────────────────────
export const UI_CONSTANTS = {
  LOADER_DURATION_MS: 800,
  TOAST_DURATION_MS: 2500,
  ANIMATION_DURATION_MS: 300,
  DEBOUNCE_DELAY_MS: 500,
} as const;

// ─── Validation ──────────────────────────────────────────────────────────
export const VALIDATION_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TRANSACTION_AMOUNT: 999999.99,
  MIN_TRANSACTION_AMOUNT: 0.01,
} as const;

// ─── Error Messages ──────────────────────────────────────────────────────
export const ERROR_MESSAGES = {
  AUTH_FAILED: 'Falha na autenticação. Tente novamente.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  INVALID_CREDENTIALS: 'Email ou senha inválidos.',
  USER_NOT_FOUND: 'Usuário não encontrado.',
  INSUFFICIENT_CREDITS: 'Créditos insuficientes.',
  OPERATION_FAILED: 'Operação falhou. Tente novamente.',
} as const;

// ─── Success Messages ────────────────────────────────────────────────────
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
  TRANSACTION_ADDED: 'Transação registrada com sucesso!',
  UPGRADE_SUCCESS: 'Plano atualizado com sucesso!',
  CREDITS_ADDED: 'Créditos adicionados com sucesso!',
} as const;
