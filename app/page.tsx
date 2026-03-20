'use client';

import React from 'react';
import { TopAppBar } from '@/components/top-bar';
import { cn, formatCurrency } from '@/lib/utils';
import { 
  TrendingDown, 
  TrendingUp,
  PlusCircle, 
  ArrowUp as ArrowUpward, 
  ArrowDown as ArrowDownward, 
  Bot as SmartToy, 
  ChevronRight, 
  ArrowRight as ArrowForward,
  Crown,
  Target,
  Clock3
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

import { useTransactions } from '@/lib/transactions-context';
import { AssistantModal } from '@/components/assistant-modal';
import { getCategoryIcon, getCategoryColor } from '@/lib/categories';
import { BottomNavBar } from '@/components/bottom-bar';
import { getUserProfile, subscribeToGoals } from '@/lib/firestore-data';
import { useAuthUser } from '@/lib/use-auth-user';
import type { GoalRecord, UserProfile } from '@/lib/firestore-types';

type SessionState = {
  authenticated: boolean;
  plan: 'basic' | 'premium' | 'visitante';
  trial: boolean;
  trialActivated?: boolean;
  trialExpiresAt: string | null;
};

export default function DashboardPage() {
  const { balance, transactions, budgets } = useTransactions();
  const [isAssistantOpen, setIsAssistantOpen] = React.useState(false);
  const [sessionState, setSessionState] = React.useState<SessionState | null>(null);
  const [displayName, setDisplayName] = React.useState('Usuário');
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [goals, setGoals] = React.useState<GoalRecord[]>([]);
  const { user } = useAuthUser();
  const [nowMs, setNowMs] = React.useState(() => Date.now());

  React.useEffect(() => {
    // Keep trial countdown and month comparisons up to date.
    const id = window.setInterval(() => setNowMs(Date.now()), 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          cache: 'no-store'
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (isMounted) {
          setSessionState(data);
        }
      } catch {
        // Silently ignore session banner failures to avoid blocking the dashboard.
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!user) {
      setDisplayName('Usuário');
      setProfile(null);
      setGoals([]);
      return;
    }

    let isMounted = true;
    const unsubscribeGoals = subscribeToGoals(user.uid, setGoals);

    getUserProfile(user.uid)
      .then((nextProfile) => {
        if (!isMounted) return;
        setProfile(nextProfile);
        setDisplayName(nextProfile?.name || user.displayName || 'Usuário');
      })
      .catch(() => {
        if (!isMounted) return;
        setProfile(null);
        setDisplayName(user.displayName || 'Usuário');
      });

    return () => {
      isMounted = false;
      unsubscribeGoals();
    };
  }, [user]);

  // Calcular receitas e despesas do mês atual
  const now = new Date(nowMs);
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const currentMonthIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const currentMonthExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const previousMonthDate = new Date(now);
  previousMonthDate.setMonth(now.getMonth() - 1);
  const previousMonthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === previousMonthDate.getMonth() && d.getFullYear() === previousMonthDate.getFullYear();
  });

  const previousMonthExpenses = previousMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseChangePercent =
    previousMonthExpenses > 0 ? ((previousMonthExpenses - currentMonthExpenses) / previousMonthExpenses) * 100 : null;
  const expenseChangeAbsPercent =
    expenseChangePercent === null ? null : Math.round(Math.abs(expenseChangePercent));

  const getBudgetSpent = (category: string) => {
    return currentMonthTransactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const trialDaysRemaining = React.useMemo(() => {
    if (!sessionState?.trial || !sessionState.trialExpiresAt) {
      return null;
    }

    const expiresAt = new Date(sessionState.trialExpiresAt).getTime();
    const remainingMs = expiresAt - nowMs;

    if (remainingMs <= 0) {
      return 0;
    }

    return Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  }, [sessionState]);

  return (
    <div className="min-h-screen pb-24">
      <TopAppBar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 sm:space-y-10">
        {/* Smart Message Section */}
        <section className="flex flex-col items-start gap-4 sm:gap-6">
          <div className="space-y-1 text-left">
            <p className="text-on-surface-variant text-[10px] sm:text-sm font-medium tracking-wide">Olá, {displayName}</p>
            <h2 className="font-headline text-2xl sm:text-4xl font-semibold text-on-background">Dashboard</h2>
          </div>
        </section>

        {sessionState?.trial && trialDaysRemaining !== null && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-primary-container/40 p-5 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-primary/15 p-3 text-primary">
                  <Clock3 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                    Teste Gratis Ativo
                  </p>
                  <h3 className="font-headline text-lg sm:text-2xl font-bold text-on-background">
                    {trialDaysRemaining === 1 ? 'Falta 1 dia do seu trial' : `Faltam ${trialDaysRemaining} dias do seu trial`}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Voce esta usando o plano basico em modo de teste com 0 creditos. Assine para liberar os recursos pagos.
                  </p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-black uppercase tracking-widest text-on-primary transition-transform hover:scale-[1.02] active:scale-95"
              >
                Ver Planos
              </Link>
            </div>
          </motion.section>
        )}

        {/* Main Balance Card */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-on-secondary-fixed rounded-[2rem] sm:rounded-3xl p-6 sm:p-8 text-on-secondary cloud-shadow"
        >
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-1 text-left">
              <span className="text-secondary-fixed-dim text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium">Saldo Atual</span>
              <div className="flex items-baseline justify-start gap-2">
                <h3 className="font-headline text-4xl sm:text-6xl font-bold tracking-tighter">{formatCurrency(balance)}</h3>
              </div>
              <span className="text-secondary-fixed-dim text-[10px] sm:text-xs font-medium block mt-1 opacity-80">
                {profile ? `Inclui saldo inicial de ${formatCurrency(profile.openingBalance)}` : 'Inclui seu saldo inicial'}
              </span>
            </div>
            <div className="bg-white/10 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl flex items-center gap-3 backdrop-blur-sm border border-white/5 w-full sm:w-auto">
              <div className="bg-tertiary-fixed p-1.5 rounded-full shrink-0">
                {expenseChangePercent === null ? (
                  <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-on-tertiary-fixed-variant" />
                ) : expenseChangePercent >= 0 ? (
                  <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-on-tertiary-fixed-variant" />
                ) : (
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-on-tertiary-fixed-variant" />
                )}
              </div>
              <p className="text-[9px] sm:text-xs font-medium text-secondary-fixed-dim">
                {expenseChangePercent === null ? (
                  'Compare seus gastos com o mês passado'
                ) : expenseChangePercent >= 0 ? (
                  <>
                    Você gastou <span className="text-tertiary-fixed font-bold">{expenseChangeAbsPercent}% menos</span> que no mês passado
                  </>
                ) : (
                  <>
                    Você gastou <span className="text-tertiary-fixed font-bold">{expenseChangeAbsPercent}% a mais</span> que no mês passado
                  </>
                )}
              </p>
            </div>
          </div>
          {/* Decorative abstraction */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary opacity-10 rounded-full blur-3xl"></div>
        </motion.section>

        {/* Metrics Bento Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Receitas */}
          <div className="bg-surface-container-low p-6 rounded-[2rem] shadow-sm border border-outline-variant/10">
            <div className="flex items-start gap-3 mb-5">
              <div className="bg-tertiary/10 p-2.5 rounded-2xl">
                <ArrowUpward className="w-5 h-5 text-tertiary" />
              </div>
              <span className="font-headline text-sm font-bold text-secondary uppercase tracking-widest">Receitas</span>
            </div>
            <p className="font-headline text-2xl sm:text-3xl font-black text-tertiary tracking-tight">{formatCurrency(currentMonthIncome)}</p>
            <div className="mt-4 w-full bg-surface-container-highest h-2 rounded-full overflow-hidden p-0.5">
              <div className="bg-tertiary h-full rounded-full" style={{ width: `${Math.min(100, (currentMonthIncome / (currentMonthIncome + currentMonthExpenses || 1)) * 100)}%` }}></div>
            </div>
          </div>

          {/* Despesas */}
          <div className="bg-surface-container-low p-6 rounded-[2rem] shadow-sm border border-outline-variant/10">
            <div className="flex items-start gap-3 mb-5">
              <div className="bg-error/10 p-2.5 rounded-2xl">
                <ArrowDownward className="w-5 h-5 text-error" />
              </div>
              <span className="font-headline text-sm font-bold text-secondary uppercase tracking-widest">Despesas</span>
            </div>
            <p className="font-headline text-2xl sm:text-3xl font-black text-error tracking-tight">{formatCurrency(currentMonthExpenses)}</p>
            <div className="mt-4 w-full bg-surface-container-highest h-2 rounded-full overflow-hidden p-0.5">
              <div className="bg-error h-full rounded-full" style={{ width: `${Math.min(100, (currentMonthExpenses / (currentMonthIncome + currentMonthExpenses || 1)) * 100)}%` }}></div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-6 pt-4">
          <div className="flex items-start justify-between px-2">
            <h3 className="font-headline text-xl font-black text-on-background tracking-tight text-left">Atividades Recentes</h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors">
                <PlusCircle className="w-4 h-4" />
              </button>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Ver todas</button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {currentMonthTransactions.length === 0 ? (
              <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 text-center shadow-sm">
                <p className="text-secondary text-sm font-medium">Nenhuma atividade neste mês.</p>
              </div>
            ) : (
              currentMonthTransactions.slice(0, 5).map((item) => {
                const Icon = getCategoryIcon(item.category);
                const colors = getCategoryColor(item.category);
              return (
                <motion.div 
                  key={item.id} 
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-5 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 hover:shadow-md transition-all cursor-default shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", colors.bg, colors.text)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{item.description}</p>
                      <p className="text-[10px] text-secondary font-black uppercase tracking-widest">
                        {new Date(item.date).toLocaleDateString('pt-BR')} • {item.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-headline text-base font-black tracking-tight", item.type === 'expense' ? "text-error" : "text-tertiary")}>
                      {item.type === 'expense' ? '-' : '+'} {formatCurrency(item.amount)}
                    </p>
                  </div>
                </motion.div>
              );
            }))}
          </div>
        </section>

        {/* Monthly Budgets Section */}
        {budgets.length > 0 && (
          <section className="space-y-6 pb-8 pt-4">
          <div className="flex items-start justify-between px-2">
            <h3 className="font-headline text-xl font-black text-on-background tracking-tight text-left">Orçamentos Mensais</h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 bg-primary/10 rounded-lg text-primary hover:bg-primary/20 transition-colors">
                <PlusCircle className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-surface-container-high px-3 py-1 rounded-full">Este Mês</span>
            </div>
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {budgets.map((budget) => {
                const spent = getBudgetSpent(budget.category);
                const progress = Math.min(100, (spent / budget.amount) * 100);
                const isOverBudget = spent > budget.amount;
                const Icon = getCategoryIcon(budget.category);
                const colors = getCategoryColor(budget.category);

                return (
                  <motion.div 
                    key={budget.id} 
                    whileHover={{ scale: 1.01 }}
                    className="flex flex-col p-6 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 hover:shadow-md transition-all cursor-default space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", colors.bg, colors.text)}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <span className="font-bold text-base block text-on-surface">{budget.category}</span>
                          <span className="text-[10px] text-secondary font-black uppercase tracking-widest">Limite: {formatCurrency(budget.amount)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("block font-black text-lg", isOverBudget ? "text-error" : "text-on-surface")}>{formatCurrency(spent)}</span>
                        <span className="text-[10px] text-secondary font-black uppercase tracking-widest">{Math.round(progress)}% usado</span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden p-0.5">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-500", isOverBudget ? "bg-error shadow-[0_0_8px_rgba(var(--error),0.4)]" : progress > 80 ? "bg-tertiary shadow-[0_0_8px_rgba(var(--tertiary),0.4)]" : "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]")} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Assistente Card (FinexyIA) */}
        <section className="pb-6">
          <div className="bg-secondary-container p-6 rounded-[2.5rem] shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-6 border border-outline-variant/15">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-on-secondary-container/10 p-2 rounded-xl">
                  <SmartToy className="w-5 h-5 text-on-secondary-container" />
                </div>
                <h4 className="font-headline text-sm font-bold text-on-secondary-container uppercase tracking-widest">FinexyIA</h4>
              </div>
              <p className="text-on-secondary-container/80 text-sm leading-relaxed font-medium max-w-xl">
                {expenseChangePercent === null ? (
                  'Posso te ajudar a planejar seu próximo mês com base no seu histórico.'
                ) : previousMonthExpenses - currentMonthExpenses > 0 ? (
                  <>
                    Boa! Você reduziu suas despesas em{' '}
                    <span className="font-black text-on-secondary-container">
                      {formatCurrency(previousMonthExpenses - currentMonthExpenses)}
                    </span>{' '}
                    vs. o mês passado. Quer que eu proponha um ajuste para manter esse ritmo?
                  </>
                ) : (
                  <>
                    Para voltar ao patamar do mês passado, considere reduzir cerca{' '}
                    <span className="font-black text-on-secondary-container">
                      {formatCurrency(currentMonthExpenses - previousMonthExpenses)}
                    </span>{' '}
                    nas suas próximas despesas.
                  </>
                )}
              </p>
            </div>
            <button 
              onClick={() => setIsAssistantOpen(true)}
              className="bg-surface-container-lowest text-on-secondary-container px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-outline-variant/20 hover:bg-surface-bright transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 shrink-0"
            >
              Perguntar algo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Goals and Premium Cards Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-12 items-stretch">
          {/* Goal Card 1 */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-secondary-container p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between gap-4 border border-outline-variant/15 h-full"
          >
            {goals[0] ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-on-secondary-container/10 p-2 rounded-xl">
                      <Target className="w-5 h-5 text-on-secondary-container" />
                    </div>
                    <h4 className="font-headline text-sm font-bold text-on-secondary-container uppercase tracking-widest">
                      Meta: {goals[0].name}
                    </h4>
                  </div>
                  <p className="text-on-secondary-container/80 text-xs leading-relaxed font-medium">
                    Faltam{' '}
                    <span className="font-black text-on-secondary-container">
                      {formatCurrency(Math.max(0, goals[0].targetAmount - goals[0].currentAmount))}
                    </span>{' '}
                    para atingir sua meta!
                  </p>
                </div>
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-on-secondary-container">
                    <span>{formatCurrency(goals[0].currentAmount)}</span>
                    <span>{formatCurrency(goals[0].targetAmount)}</span>
                  </div>
                  <div className="w-full bg-on-secondary-container/10 h-2 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-on-secondary-container h-full rounded-full"
                      style={{
                        width:
                          goals[0].targetAmount > 0
                            ? `${Math.min(100, (goals[0].currentAmount / goals[0].targetAmount) * 100)}%`
                            : '0%'
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-on-secondary-container/10 p-2 rounded-xl">
                    <Target className="w-5 h-5 text-on-secondary-container" />
                  </div>
                  <h4 className="font-headline text-sm font-bold text-on-secondary-container uppercase tracking-widest">
                    Crie sua meta
                  </h4>
                </div>
                <p className="text-on-secondary-container/80 text-xs leading-relaxed font-medium">
                  Adicione uma meta em <span className="font-black">Perfil</span> para ver seu progresso aqui.
                </p>
              </div>
            )}
          </motion.div>

          {/* Goal Card 2 */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-[#FEF9C3] p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between gap-4 border border-yellow-200 h-full"
          >
            {goals[1] ? (
              <>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-500/10 p-2 rounded-xl">
                      <Target className="w-5 h-5 text-yellow-700" />
                    </div>
                    <h4 className="font-headline text-sm font-bold text-yellow-900 uppercase tracking-widest">
                      Meta: {goals[1].name}
                    </h4>
                  </div>
                  <p className="text-yellow-800/80 text-xs leading-relaxed font-medium">
                    Faltam{' '}
                    <span className="font-black text-yellow-900">
                      {formatCurrency(Math.max(0, goals[1].targetAmount - goals[1].currentAmount))}
                    </span>{' '}
                    para atingir sua meta!
                  </p>
                </div>
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-yellow-900">
                    <span>{formatCurrency(goals[1].currentAmount)}</span>
                    <span>{formatCurrency(goals[1].targetAmount)}</span>
                  </div>
                  <div className="w-full bg-yellow-900/10 h-2 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-yellow-500 h-full rounded-full"
                      style={{
                        width:
                          goals[1].targetAmount > 0
                            ? `${Math.min(100, (goals[1].currentAmount / goals[1].targetAmount) * 100)}%`
                            : '0%'
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-500/10 p-2 rounded-xl">
                    <Target className="w-5 h-5 text-yellow-700" />
                  </div>
                  <h4 className="font-headline text-sm font-bold text-yellow-900 uppercase tracking-widest">
                    Segunda meta
                  </h4>
                </div>
                <p className="text-yellow-800/80 text-xs leading-relaxed font-medium">
                  Você ainda não cadastrou uma segunda meta.
                </p>
              </div>
            )}
          </motion.div>

          {/* Premium Credits Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-tertiary-container/55 p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between gap-4 border border-outline-variant/15 h-full"
          >
            {(() => {
              const creditsGoal = 25;
              const userCredits = Math.round(profile?.credits ?? 0);
              const creditsRemaining = Math.max(0, creditsGoal - userCredits);
              const progress =
                creditsGoal > 0 ? Math.min(100, (userCredits / creditsGoal) * 100) : 0;

              return (
                <>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-on-tertiary-container/10 p-2 rounded-xl">
                        <Crown className="w-5 h-5 text-on-tertiary-container" />
                      </div>
                      <h4 className="font-headline text-sm font-bold text-on-tertiary-container uppercase tracking-widest">
                        Premium
                      </h4>
                    </div>
                    <p className="text-on-tertiary-container/80 text-xs leading-relaxed font-medium">
                      {creditsRemaining > 0 ? (
                        <>
                          Faltam{' '}
                          <span className="font-black text-on-tertiary-container">{creditsRemaining}</span> créditos para você
                          resgatar 1 mês de Premium!
                        </>
                      ) : (
                        <>
                          Você já tem <span className="font-black text-on-tertiary-container">{userCredits}</span> créditos para
                          resgatar 1 mês de Premium!
                        </>
                      )}
                    </p>
                  </div>
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-on-tertiary-container">
                      <span>{userCredits}</span>
                      <span>{creditsGoal}</span>
                    </div>
                    <div className="w-full bg-on-tertiary-container/10 h-2 rounded-full overflow-hidden p-0.5">
                      <div
                        className="bg-tertiary h-full rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </section>

      </main>
       <BottomNavBar />
      <AssistantModal isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </div>
  );
}
