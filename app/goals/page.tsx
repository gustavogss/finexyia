'use client';

import React from 'react';
import { TopAppBar } from '@/components/top-bar';
import {BottomNavBar} from '@/components/bottom-bar';
import { cn, formatCurrency } from '@/lib/utils';
import { 
  TrendingDown,
  TrendingUp,
  PlusCircle, 
  Sparkles,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTransactions } from '@/lib/transactions-context';
import { useAuthUser } from '@/lib/use-auth-user';
import { subscribeToGoals } from '@/lib/firestore-data';
import type { GoalRecord } from '@/lib/firestore-types';

export default function GoalsPage() {
  const { transactions } = useTransactions();
  const { user } = useAuthUser();
  const [goals, setGoals] = React.useState<GoalRecord[]>([]);

  React.useEffect(() => {
    if (!user) {
      setGoals([]);
      return;
    }

    const unsubscribeGoals = subscribeToGoals(user.uid, setGoals);
    return () => {
      unsubscribeGoals();
    };
  }, [user]);

  const now = new Date();

  const currentMonthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const currentMonthExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense')
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

  const expenseDelta = previousMonthExpenses - currentMonthExpenses; // positivo => você gastou menos
  const expenseChangePercent = previousMonthExpenses > 0 ? (expenseDelta / previousMonthExpenses) * 100 : null;

  const totalEconomizado = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const metasAtivas = goals.length;

  const projectedCompletionDate = React.useMemo(() => {
    if (goals.length === 0) return null;

    const candidates = goals
      .filter((g) => g.targetAmount > g.currentAmount && g.monthlyTarget > 0)
      .map((g) => {
        const remaining = g.targetAmount - g.currentAmount;
        const months = Math.ceil(remaining / g.monthlyTarget);
        const d = new Date();
        d.setMonth(d.getMonth() + months);
        return d;
      });

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => a.getTime() - b.getTime());
    return candidates[0];
  }, [goals]);

  const projectedText = projectedCompletionDate
    ? projectedCompletionDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
    : '—';

  const goalsToShow = goals.slice(0, 3);
  const emergencyGoal = goals.find((g) => g.name.toLowerCase().includes('emerg')) ?? goals[0] ?? null;

  return (
    <div className="min-h-screen pb-24">
      <TopAppBar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-12">
        {/* Hero Section */}
        <section className="space-y-2">
          <span className="text-primary font-semibold tracking-wider text-xs uppercase">Seu Caminho para o Futuro</span>
          <div className="flex justify-between items-start">
            <h2 className="font-headline text-5xl tracking-tighter text-on-surface font-bold">Metas</h2>
            <button className="primary-gradient text-on-primary px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity mt-2">
              <PlusCircle className="w-5 h-5" /> Nova Meta
            </button>
          </div>
        </section>

        {/* Summary Statistics Bento */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-48 border-l-4 border-l-primary shadow-sm border border-outline-variant/10">
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Total Economizado</span>
            <div>
              <span className="font-headline text-3xl font-bold tracking-tight">{formatCurrency(totalEconomizado)}</span>
              <p className="text-[10px] text-tertiary mt-2 flex items-center gap-1 font-black uppercase tracking-widest">
                {expenseChangePercent === null ? (
                  'Sem comparação com o mês passado'
                ) : expenseChangePercent >= 0 ? (
                  <>
                    <TrendingUp className="w-3 h-3" /> +{Math.round(expenseChangePercent)}% em relação ao mês passado
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3" /> {Math.round(Math.abs(expenseChangePercent))}% acima do mês passado
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-48 shadow-sm border border-outline-variant/10">
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Metas Ativas</span>
            <div>
              <span className="font-headline text-3xl font-bold tracking-tight">{String(metasAtivas).padStart(2, '0')}</span>
              <p className="text-[10px] text-on-surface-variant mt-2 font-black uppercase tracking-widest">Trabalhando para atingir marcos</p>
            </div>
          </div>
          <div className="bg-secondary-container p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-48 shadow-sm border border-outline-variant/10">
            <span className="text-on-secondary-container font-bold text-sm uppercase tracking-widest">Conclusão Projetada</span>
            <div>
              <span className="font-headline text-3xl font-bold tracking-tight text-on-secondary-fixed">{projectedText}</span>
              <p className="text-[10px] text-on-secondary-fixed-variant mt-2 font-black uppercase tracking-widest">Meta mais próxima de ser atingida</p>
            </div>
          </div>
        </section>

        {/* Goals Grid */}
        <section className="space-y-6">
          <h3 className="font-headline text-xl font-bold text-on-surface">Metas Prioritárias</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goalsToShow.length === 0 ? (
              <div className="bg-surface-container-low p-8 rounded-2xl shadow-sm border border-outline-variant/10 text-center md:col-span-2">
                <p className="text-secondary text-sm font-medium">Nenhuma meta cadastrada ainda.</p>
                <p className="text-xs text-on-surface-variant mt-2">Vá em <span className="font-black">Perfil</span> para criar sua primeira meta.</p>
              </div>
            ) : (
              goalsToShow.map((goal, i) => {
                const progress = goal.targetAmount > 0 ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0;
                const progressRounded = Math.round(progress);
                const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

                return (
                  <motion.article 
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-surface-container-low p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm bg-primary/10 text-primary">
                        <Target className="w-8 h-8" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-surface-container-highest text-on-surface">
                        Meta
                      </span>
                    </div>
                    <h4 className="font-headline text-2xl font-black mb-1">{goal.name}</h4>
                    <p className="text-secondary text-xs mb-6 font-medium">
                      {goal.monthlyTarget > 0 ? `Alvo mensal: ${formatCurrency(goal.monthlyTarget)}` : 'Sua meta'}
                    </p>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest text-secondary block mb-1 font-black">Atual</span>
                          <span className="text-2xl font-black text-primary">{formatCurrency(goal.currentAmount)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-widest text-secondary block mb-1 font-black">Objetivo</span>
                          <span className="text-lg font-bold text-on-surface opacity-60">{formatCurrency(goal.targetAmount)}</span>
                        </div>
                      </div>
                      <div className="relative h-3 w-full bg-surface-container-highest rounded-full overflow-hidden border border-outline-variant/5">
                        <div
                          className={cn(
                            "absolute top-0 left-0 h-full rounded-full transition-all duration-1000",
                            progressRounded >= 80 ? "bg-tertiary-fixed" : "bg-primary-fixed"
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-secondary pt-1">
                        <span>{progressRounded}% Atingido</span>
                        <span className={cn(progressRounded >= 80 ? "text-tertiary" : "")}>
                          {progressRounded >= 80 ? 'Quase lá!' : `Faltam ${formatCurrency(remaining)}`}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            )}
          
            {/* Motivation Card */}
            <article className="primary-gradient p-8 rounded-2xl shadow-xl flex flex-col justify-between text-on-primary relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Sparkles className="w-[200px] h-[200px]" />
              </div>
              <div>
                <h4 className="font-headline text-3xl font-black mb-4 leading-tight">
                  {expenseChangePercent === null ? (
                    'Compare seus gastos com o mês passado!'
                  ) : expenseDelta > 0 ? (
                    `Você economizou ${formatCurrency(expenseDelta)} vs o mês passado!`
                  ) : (
                    `Seus gastos aumentaram em ${formatCurrency(Math.abs(expenseDelta))} vs o mês passado!`
                  )}
                </h4>
                <p className="text-primary-fixed opacity-90 font-light text-lg">
                  {expenseDelta > 0 && emergencyGoal ? (
                    <>
                      Se quiser, realoque esse valor para sua meta de <span className="font-bold">{emergencyGoal.name}</span>.
                    </>
                  ) : (
                    'Se quiser, revise suas despesas variáveis e ajuste seu planejamento para o próximo mês.'
                  )}
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <button className="bg-surface-container-lowest text-primary px-6 py-2 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform">Aplicar Valor Extra</button>
                <button className="border border-on-primary border-opacity-30 px-6 py-2 rounded-full font-bold text-sm active:scale-95 transition-transform">Ignorar</button>
              </div>
            </article>
          </div>
        </section>

        {/* Visualization Section */}
        <section className="bg-surface-container-low p-8 sm:p-10 rounded-2xl shadow-sm border border-outline-variant/10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h3 className="font-headline text-3xl font-bold tracking-tight">Projeção de Crescimento</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Com base nas suas metas, sua próxima meta deve ser concluída em <span className="font-bold text-on-surface">{projectedText}</span>.
              </p>
              <div className="pt-4">
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary">TAXA DE ECONOMIA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary">JUROS RENDIDOS</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full flex justify-center">
              <div className="w-full h-40 flex items-end justify-between gap-3 px-4">
                {goals.slice(0, 6).length === 0 ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-full rounded-t-lg bg-surface-container-highest opacity-30" style={{ height: '0%' }} />
                  ))
                ) : (
                  goals.slice(0, 6).map((g, i) => {
                    const progress = g.targetAmount > 0 ? Math.min(100, (g.currentAmount / g.targetAmount) * 100) : 0;
                    const isLast = i === Math.min(goals.length, 6) - 1;
                    return (
                      <div
                        key={g.id}
                        className={cn(
                          "w-full rounded-t-lg transition-all",
                          isLast ? "primary-gradient" : "bg-primary opacity-60"
                        )}
                        style={{ height: `${progress}%` }}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </main>    
      <BottomNavBar />
    </div>
  );
}
