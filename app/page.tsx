'use client';

import React from 'react';
import { TopAppBar } from '@/components/top-bar';
import { cn, formatCurrency } from '@/lib/utils';
import { 
  TrendingDown, 
  PlusCircle, 
  ArrowUp as ArrowUpward, 
  ArrowDown as ArrowDownward, 
  Bot as SmartToy, 
  ChevronRight, 
  ArrowRight as ArrowForward,
  Crown,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';

import { useTransactions } from '@/lib/transactions-context';
import { AssistantModal } from '@/components/assistant-modal';
import { getCategoryIcon, getCategoryColor } from '@/lib/categories';
import { BottomNavBar } from '@/components/bottom-bar';

export default function DashboardPage() {
  const { balance, transactions, budgets } = useTransactions();
  const [isAssistantOpen, setIsAssistantOpen] = React.useState(false);

  // Calcular receitas e despesas do mês atual
  const now = new Date();
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

  const getBudgetSpent = (category: string) => {
    return currentMonthTransactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  };

  return (
    <div className="min-h-screen pb-24">
      <TopAppBar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 sm:space-y-10">
        {/* Smart Message Section */}
        <section className="flex flex-col items-start gap-4 sm:gap-6">
          <div className="space-y-1 text-left">
            <p className="text-on-surface-variant text-[10px] sm:text-sm font-medium tracking-wide">Olá, Gustavo Silva</p>
            <h2 className="font-headline text-2xl sm:text-4xl font-semibold text-on-background">Dashboard</h2>
          </div>
        </section>

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
              <span className="text-secondary-fixed-dim text-[10px] sm:text-xs font-medium block mt-1 opacity-80">Inclui R$ 2.000,00 do mês anterior</span>
            </div>
            <div className="bg-white/10 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl flex items-center gap-3 backdrop-blur-sm border border-white/5 w-full sm:w-auto">
              <div className="bg-tertiary-fixed p-1.5 rounded-full shrink-0">
                <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-on-tertiary-fixed-variant" />
              </div>
              <p className="text-[9px] sm:text-xs font-medium text-secondary-fixed-dim">
                Você gastou <span className="text-tertiary-fixed font-bold">12% menos</span> que no mês passado
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
              <p className="text-on-secondary-container/80 text-sm leading-relaxed font-medium max-w-xl">Analisei seu padrão de consumo. Posso te ajudar a economizar mais R$ 200 este mês.</p>
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
          {/* Goals Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-secondary-container p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between gap-4 border border-outline-variant/15 h-full"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-on-secondary-container/10 p-2 rounded-xl">
                  <Target className="w-5 h-5 text-on-secondary-container" />
                </div>
                <h4 className="font-headline text-sm font-bold text-on-secondary-container uppercase tracking-widest">Meta: Viagem</h4>
              </div>
              <p className="text-on-secondary-container/80 text-xs leading-relaxed font-medium">
                Faltam <span className="font-black text-on-secondary-container">{formatCurrency(1500)}</span> para atingir sua meta!
              </p>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-on-secondary-container">
                <span>{formatCurrency(3500)}</span>
                <span>{formatCurrency(5000)}</span>
              </div>
              <div className="w-full bg-on-secondary-container/10 h-2 rounded-full overflow-hidden p-0.5">
                <div className="bg-on-secondary-container h-full rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </motion.div>

          {/* Emergency Goal Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-[#FEF9C3] p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between gap-4 border border-yellow-200 h-full"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-500/10 p-2 rounded-xl">
                  <Target className="w-5 h-5 text-yellow-700" />
                </div>
                <h4 className="font-headline text-sm font-bold text-yellow-900 uppercase tracking-widest">Meta: Emergência</h4>
              </div>
              <p className="text-yellow-800/80 text-xs leading-relaxed font-medium">
                Faltam <span className="font-black text-yellow-900">{formatCurrency(3000)}</span> para atingir sua meta!
              </p>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-yellow-900">
                <span>{formatCurrency(12000)}</span>
                <span>{formatCurrency(15000)}</span>
              </div>
              <div className="w-full bg-yellow-900/10 h-2 rounded-full overflow-hidden p-0.5">
                <div className="bg-yellow-500 h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </motion.div>

          {/* Premium Credits Card */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-tertiary-container/55 p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between gap-4 border border-outline-variant/15 h-full"
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-on-tertiary-container/10 p-2 rounded-xl">
                  <Crown className="w-5 h-5 text-on-tertiary-container" />
                </div>
                <h4 className="font-headline text-sm font-bold text-on-tertiary-container uppercase tracking-widest">Premium Gratuito</h4>
              </div>
              <p className="text-on-tertiary-container/80 text-xs leading-relaxed font-medium">
                Faltam <span className="font-black text-on-tertiary-container">13 créditos</span> para você resgatar 1 mês de Premium!
              </p>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-on-tertiary-container">
                <span>12</span>
                <span>25</span>
              </div>
              <div className="w-full bg-on-tertiary-container/10 h-2 rounded-full overflow-hidden p-0.5">
                <div className="bg-tertiary h-full rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>
          </motion.div>
        </section>

      </main>
       <BottomNavBar />
      <AssistantModal isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </div>
  );
}
