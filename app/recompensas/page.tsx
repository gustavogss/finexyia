'use client';

import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  BrainCircuit,
  CreditCard,
  Flame,
  Gift,
  Target,
  Users,
} from 'lucide-react';
import { TopAppBar } from '@/components/top-bar';
import { BottomNavBar } from '@/components/bottom-bar';
import { cn } from '@/lib/utils';
import { useTransactions } from '@/lib/transactions-context';
import { useAuthUser } from '@/lib/use-auth-user';
import { getUserProfile, subscribeToGoals } from '@/lib/firestore-data';
import type { GoalRecord, UserProfile } from '@/lib/firestore-types';
import { getPlansConfig } from '@/lib/plans-config';

type RewardTask = {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
};

type RewardCategory = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  tasks: RewardTask[];
};

export default function RewardsPage() {
  const { transactions } = useTransactions();
  const { user } = useAuthUser();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [goals, setGoals] = React.useState<GoalRecord[]>([]);
  const [premiumCreditsGoal, setPremiumCreditsGoal] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!user) {
      setProfile(null);
      setGoals([]);
      return;
    }

    const unsubscribeGoals = subscribeToGoals(user.uid, setGoals);

    getUserProfile(user.uid).then(setProfile).catch(() => setProfile(null));

    return () => {
      unsubscribeGoals();
    };
  }, [user]);

  const transactionCount = transactions.length;
  const hasCompletedGoal = goals.some((g) => g.targetAmount > 0 && g.currentAmount >= g.targetAmount);
  const usageTasks: RewardTask[] = [
    { id: 'u1', title: 'Registrar 1 transação', description: 'Sua primeira transação no app', reward: 1, progress: Math.min(transactionCount, 1), total: 1 },
    { id: 'u2', title: 'Registrar 10 transações', description: 'Mantenha seu controle em dia', reward: 2, progress: Math.min(transactionCount, 10), total: 10 },
    { id: 'u3', title: 'Registrar 30 transações', description: 'Domine suas finanças', reward: 3, progress: Math.min(transactionCount, 30), total: 30 },
  ];

  const categories: RewardCategory[] = [
    {
      id: 'usage',
      title: 'Uso do Aplicativo',
      description: 'Seu progresso real no app',
      icon: BarChart3,
      color: 'text-blue-500 bg-blue-500/10',
      tasks: usageTasks,
    },
    {
      id: 'plan',
      title: 'Plano e Fidelidade',
      description: 'Baseado na sua assinatura atual',
      icon: CreditCard,
      color: 'text-indigo-500 bg-indigo-500/10',
      tasks: [
        { id: 'p1', title: 'Conta em Trial Ativo', description: 'Teste grátis liberado', reward: 0, progress: profile?.trial ? 1 : 0, total: 1 },
        { id: 'p2', title: 'Plano Básico Ativo', description: 'Assinatura básica confirmada', reward: 10, progress: profile?.plan === 'basic' && !profile?.trial ? 1 : 0, total: 1 },
        { id: 'p3', title: 'Plano Premium Ativo', description: 'Assinatura premium confirmada', reward: 25, progress: profile?.plan === 'premium' && !profile?.trial ? 1 : 0, total: 1 },
      ],
    },
    {
      id: 'engagement',
      title: 'Engajamento',
      description: 'Indicadores derivados do uso real',
      icon: Flame,
      color: 'text-orange-500 bg-orange-500/10',
      tasks: [
        {
          id: 'e1',
          title: 'Primeiro fluxo positivo',
          description: 'Registrar pelo menos uma receita',
          reward: 1,
          progress: transactions.some((item) => item.type === 'income') ? 1 : 0,
          total: 1,
        },
        {
          id: 'e2',
          title: 'Primeiro gasto registrado',
          description: 'Registrar pelo menos uma despesa',
          reward: 1,
          progress: transactions.some((item) => item.type === 'expense') ? 1 : 0,
          total: 1,
        },
        {
          id: 'e3',
          title: 'Controle equilibrado',
          description: 'Registrar 5 receitas ou despesas',
          reward: 2,
          progress: Math.min(transactionCount, 5),
          total: 5,
        },
      ],
    },
    {
      id: 'future',
      title: 'Próximas Missões',
      description: 'Estrutura pronta para próximos eventos reais',
      icon: Target,
      color: 'text-amber-500 bg-amber-500/10',
      tasks: [
        {
          id: 'f1',
          title: 'Metas financeiras',
          description: 'Meta será concluída ao atingir o alvo salvo',
          reward: 2,
          progress: hasCompletedGoal ? 1 : 0,
          total: 1
        },
      ],
    },
  ];

  const userCredits = profile?.credits ?? 0;
  const progressPercent =
    premiumCreditsGoal === null || premiumCreditsGoal <= 0
      ? 0
      : Math.min(100, (userCredits / premiumCreditsGoal) * 100);

  React.useEffect(() => {
    let isMounted = true;
    getPlansConfig()
      .then((cfg) => {
        if (!isMounted) return;
        setPremiumCreditsGoal(cfg.premium.credits);
      })
      .catch(() => {
        if (!isMounted) return;
        setPremiumCreditsGoal(null);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen pb-32 bg-surface">
      <TopAppBar />
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6 sm:space-y-8">
        <header className="space-y-2 text-center">
          <h2 className="font-headline text-3xl sm:text-4xl font-black text-on-background tracking-tight">Recompensas</h2>
          <p className="text-secondary text-sm sm:text-base font-medium max-w-xs mx-auto">
            Seus créditos e missões agora refletem os dados reais da sua conta.
          </p>
        </header>

        <motion.section whileHover={{ scale: 1.01 }} className="bg-surface-container-low p-8 rounded-[3rem] text-center space-y-8 shadow-sm border border-outline-variant/10">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-secondary">Saldo de Créditos FinexyIA</p>
            <div className="flex items-center justify-center gap-3">
              <Gift className="w-8 h-8 text-primary" />
              <p className="font-headline text-5xl sm:text-6xl font-black text-primary tracking-tighter">{userCredits}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-secondary">
              <span>Progresso para {premiumCreditsGoal === null ? '—' : `${premiumCreditsGoal} créditos`}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <section key={category.id} className="bg-surface-container-low p-5 rounded-[2.5rem] border border-outline-variant/10 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm', category.color)}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-on-surface">{category.title}</h3>
                    <p className="text-xs text-secondary font-medium">{category.description}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {category.tasks.map((task) => {
                    const completed = task.progress >= task.total;
                    const width = task.total > 0 ? Math.min(100, (task.progress / task.total) * 100) : 0;
                    return (
                      <div key={task.id} className="bg-surface-container-lowest rounded-2xl p-4 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-bold text-sm">{task.title}</p>
                            <p className="text-xs text-secondary">{task.description}</p>
                          </div>
                          <span className={cn('text-[10px] font-black uppercase tracking-widest', completed ? 'text-primary' : 'text-secondary')}>
                            +{task.reward}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden">
                          <div className={cn('h-full rounded-full', completed ? 'bg-primary' : 'bg-secondary')} style={{ width: `${width}%` }} />
                        </div>
                        <p className="text-[10px] font-bold text-secondary">{task.progress} / {task.total}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <section className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant/10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="font-bold">Relacionamentos Preparados</h3>
              <p className="text-xs text-secondary">A estrutura de recompensas agora pode usar dados reais de transações, assinatura e créditos.</p>
            </div>
          </div>
        </section>
      </main>
      <BottomNavBar />
    </div>
  );
}
