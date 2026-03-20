'use client';

import React, { useState } from 'react';
import { TopAppBar, BottomNavBar } from '@/components/navigation';
import { 
  Flame, 
  BarChart3, 
  BrainCircuit, 
  Users, 
  CreditCard, 
  Megaphone, 
  Target,
  ChevronRight,
  CheckCircle2,
  Clock,
  Lock,
  Gift,
  ArrowRight,
  Copy,
  MessageCircle,
  Send,
  X,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  status: 'in-progress' | 'completed' | 'locked';
}

interface RewardCategory {
  id: string;
  title: string;
  description: string;
  summary: string;
  icon: React.ElementType;
  color: string;
  tasks: Task[];
}

const REWARDS_DATA: RewardCategory[] = [
  {
    id: 'streak',
    title: 'Sequência Financeira',
    description: 'Registre suas finanças diariamente e ganhe recompensas',
    summary: 'Até +3 créditos',
    icon: Flame,
    color: 'text-orange-500 bg-orange-500/10',
    tasks: [
      { id: 's1', title: '7 dias consecutivos', description: 'Registre 1 transação por dia por uma semana', reward: 1, progress: 3, total: 7, status: 'in-progress' },
      { id: 's2', title: '15 dias consecutivos', description: 'Registre 1 transação por dia por 15 dias', reward: 2, progress: 3, total: 15, status: 'in-progress' },
      { id: 's3', title: '30 dias consecutivos', description: 'Registre 1 transação por dia por um mês', reward: 3, progress: 3, total: 30, status: 'in-progress' },
    ]
  },
  {
    id: 'usage',
    title: 'Uso do Aplicativo',
    description: 'Registre receitas e despesas para gerar insights inteligentes',
    summary: 'Até +3 créditos',
    icon: BarChart3,
    color: 'text-blue-500 bg-blue-500/10',
    tasks: [
      { id: 'u1', title: 'Registrar 1 transação', description: 'Sua primeira transação no app', reward: 1, progress: 1, total: 1, status: 'completed' },
      { id: 'u2', title: 'Registrar 10 transações', description: 'Mantenha seu controle em dia', reward: 2, progress: 5, total: 10, status: 'in-progress' },
      { id: 'u3', title: 'Registrar 30 transações', description: 'Domine suas finanças', reward: 3, progress: 5, total: 30, status: 'in-progress' },
    ]
  },
  {
    id: 'ai',
    title: 'Insights com IA',
    description: 'Desbloqueie análises inteligentes ao usar o app',
    summary: 'Até +3 créditos',
    icon: BrainCircuit,
    color: 'text-purple-500 bg-purple-500/10',
    tasks: [
      { id: 'a1', title: 'Gerar primeiro insight', description: 'Use a IA para analisar seus gastos', reward: 1, progress: 0, total: 1, status: 'in-progress' },
      { id: 'a2', title: 'Detectar padrões', description: 'A IA encontrou um padrão nos seus gastos', reward: 2, progress: 0, total: 1, status: 'locked' },
      { id: 'a3', title: 'Gerar relatório completo', description: 'Análise profunda mensal com IA', reward: 3, progress: 0, total: 1, status: 'locked' },
    ]
  },
  {
    id: 'referral',
    title: 'Indicações',
    description: 'Convide amigos e ganhe créditos quando eles assinarem',
    summary: 'Até +2 créditos',
    icon: Users,
    color: 'text-emerald-500 bg-emerald-500/10',
    tasks: [
      { id: 'r1', title: 'Amigo cadastrado', description: 'Um amigo se cadastrou pelo seu link', reward: 1, progress: 2, total: 5, status: 'in-progress' },
      { id: 'r2', title: 'Amigo assina plano Básico', description: 'Ganhe créditos por indicação paga', reward: 1, progress: 0, total: 1, status: 'in-progress' },
      { id: 'r3', title: 'Amigo assina plano Premium', description: 'Recompensa máxima por indicação', reward: 2, progress: 0, total: 1, status: 'in-progress' },
    ]
  },
  {
    id: 'loyalty',
    title: 'Assinatura e Fidelidade',
    description: 'Mantenha sua assinatura ativa e ganhe benefícios',
    summary: 'Até +2 créditos',
    icon: CreditCard,
    color: 'text-indigo-500 bg-indigo-500/10',
    tasks: [
      { id: 'l1', title: 'Renovação Automática', description: 'Cadastrar cartão + ativar renovação', reward: 1, progress: 1, total: 1, status: 'completed' },
      { id: 'l2', title: 'Fidelidade 30 dias', description: 'Manter assinatura ativa por um mês', reward: 2, progress: 12, total: 30, status: 'in-progress' },
    ]
  },
  {
    id: 'social',
    title: 'Divulgação',
    description: 'Divulgue o app nas redes sociais e ganhe recompensas',
    summary: 'Até +20 créditos',
    icon: Megaphone,
    color: 'text-pink-500 bg-pink-500/10',
    tasks: [
      { id: 'd1', title: 'Criador Iniciante', description: 'Postar sobre o app (+1k seguidores)', reward: 5, progress: 0, total: 1, status: 'in-progress' },
      { id: 'd2', title: 'Criador Influente', description: 'Postar sobre o app (+5k seguidores)', reward: 10, progress: 0, total: 1, status: 'locked' },
      { id: 'd3', title: 'Criador Estrela', description: 'Postar sobre o app (+10k seguidores)', reward: 20, progress: 0, total: 1, status: 'locked' },
    ]
  },
  {
    id: 'weekly',
    title: 'Missões Semanais',
    description: 'Complete desafios e ganhe créditos extras',
    summary: 'Variável',
    icon: Target,
    color: 'text-amber-500 bg-amber-500/10',
    tasks: [
      { id: 'w1', title: 'Registrar 5 transações', description: 'Meta semanal de registros', reward: 2, progress: 5, total: 5, status: 'completed' },
      { id: 'w2', title: 'Convidar 1 amigo', description: 'Expanda a comunidade esta semana', reward: 3, progress: 0, total: 1, status: 'in-progress' },
      { id: 'w3', title: 'Usar IA', description: 'Consulte a IA para uma dica financeira', reward: 2, progress: 1, total: 1, status: 'completed' },
    ]
  }
];

export default function RewardsPage() {
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | null>(null);
  const [userCredits] = useState(12); // Simulated user credits
  const premiumGoal = 25;
  const progressPercent = Math.min(100, (userCredits / premiumGoal) * 100);

  const handleCopyLink = () => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText('https://finflow.app/convite/gustavo123');
        alert('Link de convite copiado!');
      } else {
        // Fallback para navegadores antigos
        alert('Link: https://finflow.app/convite/gustavo123');
      }
    } catch (error) {
      alert('Erro ao copiar link. Link: https://finflow.app/convite/gustavo123');
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-surface">
      <TopAppBar />
      
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6 sm:space-y-8">
        <header className="space-y-2 text-center">
          <h2 className="font-headline text-3xl sm:text-4xl font-black text-on-background tracking-tight">
            Recompensas
          </h2>
          <p className="text-secondary text-sm sm:text-base font-medium max-w-xs mx-auto">
            Complete missões e desbloqueie o Plano Premium gratuitamente.
          </p>
        </header>

        {/* Categories List */}
        <div className="grid grid-cols-1 gap-4">
          {REWARDS_DATA.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedCategory(category)}
                className="bg-surface-container-low p-5 rounded-[2.5rem] border border-outline-variant/10 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-all group shadow-sm"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", category.color)}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-on-surface truncate">{category.title}</h3>
                    <p className="text-xs text-secondary font-medium line-clamp-1">{category.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-full">
                        {category.summary}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Credit Balance Card */}
        <motion.section 
          id="credit-card"
          whileHover={{ scale: 1.01 }}
          className="bg-surface-container-low p-8 rounded-[3rem] text-center space-y-8 shadow-sm border border-outline-variant/10 mt-12"
        >
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-secondary">Saldo de Créditos FinexyIA</p>
            <div className="flex items-center justify-center gap-3">
              <Gift className="w-8 h-8 text-primary" />
              <p className="font-headline text-5xl sm:text-6xl font-black text-primary tracking-tighter">{userCredits}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end px-1">
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
                {progressPercent >= 100 ? 'Meta Atingida!' : progressPercent >= 80 ? 'Você está quase lá!' : 'Missão Premium Grátis'}
              </span>
              <span className="text-xs font-bold text-primary">
                {userCredits} / {premiumGoal} ({Math.round(progressPercent)}%)
              </span>
            </div>
            <div className="h-3.5 w-full bg-surface-container-highest rounded-full overflow-hidden border border-outline-variant/10 p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  progressPercent >= 100 ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" : "bg-primary shadow-[0_0_12px_rgba(var(--primary),0.4)]"
                )}
              />
            </div>
            <p className="text-xs text-secondary font-medium">
              {progressPercent >= 100 
                ? 'Você já pode ativar o Plano Premium!' 
                : `Faltam ${premiumGoal - userCredits} créditos para desbloquear o Premium`}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {progressPercent >= 100 ? (
              <button className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all uppercase tracking-widest text-xs">
                Ativar Premium
              </button>
            ) : (
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-primary text-on-primary py-5 rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Ganhar mais créditos
              </button>
            )}
            <button 
              onClick={handleCopyLink}
              className="w-full bg-surface-container-high text-on-surface py-5 rounded-2xl font-black active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-outline-variant/10"
            >
              <Users className="w-4 h-4" />
              Convidar amigos
            </button>
          </div>
        </motion.section>

      </main>

      <BottomNavBar />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCategory(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative bg-surface w-full max-w-xl rounded-t-[3rem] sm:rounded-[3rem] p-8 space-y-8 shadow-2xl border-t sm:border border-outline-variant/20 max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <div className="flex justify-center items-center relative">
                <div className="flex flex-col items-center gap-4">
                  <div className={cn("w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-sm", selectedCategory.color)}>
                    <selectedCategory.icon className="w-8 h-8" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="font-headline text-2xl font-black text-on-surface tracking-tight">{selectedCategory.title}</h3>
                    <p className="text-sm text-secondary font-medium">{selectedCategory.summary}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="absolute right-0 top-0 p-3 bg-surface-container-high hover:bg-surface-container-highest rounded-full transition-all hover:rotate-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Tarefas Disponíveis</h4>
                  <div className="space-y-4">
                    {selectedCategory.tasks.map((task) => (
                      <div 
                        key={task.id}
                        className={cn(
                          "p-6 rounded-[2rem] border transition-all space-y-4 shadow-sm",
                          task.status === 'completed' 
                            ? "bg-emerald-500/5 border-emerald-500/20" 
                            : task.status === 'locked'
                            ? "bg-surface-container-high/50 border-outline-variant/10 opacity-60"
                            : "bg-surface-container-low border-outline-variant/10"
                        )}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-base text-on-surface">{task.title}</h5>
                              {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              {task.status === 'locked' && <Lock className="w-3.5 h-3.5 text-secondary" />}
                            </div>
                            <p className="text-xs text-secondary font-medium leading-relaxed">{task.description}</p>
                          </div>
                          <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap shadow-sm">
                            +{task.reward} CRÉD.
                          </div>
                        </div>

                        {task.total > 1 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-secondary">
                              <span>Progresso</span>
                              <span>{task.progress} / {task.total}</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden p-0.5">
                              <div 
                                className={cn(
                                  "h-full rounded-full transition-all duration-500",
                                  task.status === 'completed' ? "bg-emerald-500" : "bg-primary"
                                )}
                                style={{ width: `${(task.progress / task.total) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-sm",
                            task.status === 'completed' 
                              ? "bg-emerald-500/10 text-emerald-500" 
                              : task.status === 'locked'
                              ? "bg-secondary/10 text-secondary"
                              : "bg-primary/10 text-primary"
                          )}>
                            {task.status === 'completed' ? '✅ Concluído' : task.status === 'locked' ? '🔒 Bloqueado' : '⏳ Em andamento'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedCategory.id === 'referral' && (
                  <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 space-y-6 shadow-sm">
                    <div className="space-y-1.5 text-center">
                      <h4 className="font-bold text-lg text-on-surface">Seu link de convite</h4>
                      <p className="text-xs text-secondary font-medium">Compartilhe com seus amigos para ganhar créditos</p>
                    </div>
                    <div className="flex items-center gap-2 bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10 shadow-inner">
                      <code className="flex-1 text-[11px] font-mono text-primary px-2 truncate">finflow.app/convite/gustavo123</code>
                      <button 
                        onClick={handleCopyLink}
                        className="p-3 bg-primary text-on-primary rounded-xl hover:scale-105 transition-all shadow-md active:scale-95"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-[#25D366] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </button>
                      <button className="bg-[#0088cc] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md">
                        <Send className="w-4 h-4" /> Telegram
                      </button>
                    </div>
                  </div>
                )}

                {selectedCategory.id === 'social' && (
                  <div className="bg-surface-container-high/30 p-8 rounded-[2.5rem] border border-outline-variant/10 flex items-start gap-5 shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 shadow-sm">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-base">Validação de Divulgação</h4>
                      <p className="text-xs text-secondary font-medium leading-relaxed">
                        Para validar sua divulgação, envie o link do seu post ou perfil para nossa equipe através do suporte.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
