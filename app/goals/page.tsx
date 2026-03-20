'use client';

import React from 'react';
import { TopAppBar } from '@/components/navigation';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  PlusCircle, 
  Sparkles,
  ArrowRight as ArrowForward,
  ChevronRight,
  PlaneTakeoff,
  Home,
  Car,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { getCategoryIcon, getCategoryColor } from '@/lib/categories';

export default function GoalsPage() {
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
          <div className="bg-surface-container-low p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-48 border-l-4 border-primary shadow-sm border border-outline-variant/10">
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Total Economizado</span>
            <div>
              <span className="font-headline text-3xl font-bold tracking-tight">R$ 14.200</span>
              <p className="text-[10px] text-tertiary mt-2 flex items-center gap-1 font-black uppercase tracking-widest">
                <TrendingUp className="w-3 h-3" /> +12% em relação ao mês passado
              </p>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-48 shadow-sm border border-outline-variant/10">
            <span className="text-secondary font-bold text-sm uppercase tracking-widest">Metas Ativas</span>
            <div>
              <span className="font-headline text-3xl font-bold tracking-tight">04</span>
              <p className="text-[10px] text-on-surface-variant mt-2 font-black uppercase tracking-widest">Trabalhando para atingir marcos</p>
            </div>
          </div>
          <div className="bg-secondary-container p-6 sm:p-8 rounded-2xl flex flex-col justify-between h-48 shadow-sm border border-outline-variant/10">
            <span className="text-on-secondary-container font-bold text-sm uppercase tracking-widest">Conclusão Projetada</span>
            <div>
              <span className="font-headline text-3xl font-bold tracking-tight text-on-secondary-fixed">Nov 2024</span>
              <p className="text-[10px] text-on-secondary-fixed-variant mt-2 font-black uppercase tracking-widest">Meta mais próxima de ser atingida</p>
            </div>
          </div>
        </section>

        {/* Goals Grid */}
        <section className="space-y-6">
          <h3 className="font-headline text-xl font-bold text-on-surface">Metas Prioritárias</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                title: 'Viagem para o Japão', 
                subtitle: 'Estimado para Outubro de 2025', 
                current: 8500, 
                target: 25000, 
                percent: 34, 
                category: 'Viagem',
              },
              { 
                title: 'Reserva de Emergência', 
                subtitle: 'Reserva de segurança (6 meses de despesas)', 
                current: 12000, 
                target: 15000, 
                percent: 80, 
                category: 'Ativo',
              },
              { 
                title: 'Novo SUV 2024', 
                subtitle: 'Meta para valor de entrada', 
                current: 45000, 
                target: 80000, 
                percent: 56, 
                category: 'Sonho',
              },
            ].map((goal, i) => {
              const Icon = getCategoryIcon(goal.category);
              const colors = getCategoryColor(goal.category);
              return (
                <motion.article 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface-container-low p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", colors.bg, colors.text)}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", colors.bg, colors.text)}>{goal.category}</span>
                  </div>
                  <h4 className="font-headline text-2xl font-black mb-1">{goal.title}</h4>
                  <p className="text-secondary text-xs mb-6 font-medium">{goal.subtitle}</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-secondary block mb-1 font-black">Atual</span>
                        <span className="text-2xl font-black text-primary">R$ {goal.current.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-widest text-secondary block mb-1 font-black">Objetivo</span>
                        <span className="text-lg font-bold text-on-surface opacity-60">R$ {goal.target.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="relative h-3 w-full bg-surface-container-highest rounded-full overflow-hidden border border-outline-variant/5">
                      <div className={cn("absolute top-0 left-0 h-full rounded-full transition-all duration-1000", colors.bg)} style={{ width: `${goal.percent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-secondary pt-1">
                      <span>{goal.percent}% Atingido</span>
                      <span className={cn(goal.percent >= 80 ? "text-tertiary" : "")}>
                        {goal.percent >= 80 ? 'Quase lá!' : `Faltam R$ ${(goal.target - goal.current).toLocaleString('pt-BR')}`}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}

            {/* Motivation Card */}
            <article className="primary-gradient p-8 rounded-2xl shadow-xl flex flex-col justify-between text-on-primary relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Sparkles className="w-[200px] h-[200px]" />
              </div>
              <div>
                <h4 className="font-headline text-3xl font-black mb-4 leading-tight">Você economizou R$ 1.200 a mais que no mês passado!</h4>
                <p className="text-primary-fixed opacity-90 font-light text-lg">Aloque este valor extra para atingir sua meta de <span className="font-bold">Reserva de Emergência</span> 2 meses antes.</p>
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
              <p className="text-on-surface-variant leading-relaxed text-sm">Com base na sua taxa de economia atual de <span className="font-bold text-on-surface">R$ 2.450/mês</span>, você está no caminho certo para completar as 4 metas até <span className="font-bold text-on-surface">Março de 2026</span>.</p>
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
                {[40, 55, 45, 70, 85, 100].map((h, i) => (
                  <div key={i} className={cn("w-full rounded-t-lg transition-all", i === 5 ? "primary-gradient h-full" : `bg-primary h-[${h}%] opacity-${(i + 2) * 10}`)} style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>    
    </div>
  );
}
