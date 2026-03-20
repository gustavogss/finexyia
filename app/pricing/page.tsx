'use client';

import React from 'react';
import { TopAppBar } from '@/components/navigation';
import { 
  Check, 
  X, 
  Coins as Token, 
  Banknote as Payments, 
  Target as TrackChanges, 
  Award as WorkspacePremium,
  PlayCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function PricingPage() {
  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen">
      <TopAppBar />
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Editorial Header Section */}
        <section className="mb-8 md:mb-16 text-center lg:text-left">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-on-background leading-tight max-w-2xl mx-auto lg:mx-0">
            Escolha o plano ideal para sua evolução financeira.
          </h2>
          <p className="text-secondary font-medium text-base md:text-lg max-w-xl mx-auto lg:mx-0">
            Ferramentas arquitetadas para oferecer clareza, controle e crescimento real do seu patrimônio.
          </p>
        </section>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 md:mb-20 items-stretch">
          {/* Plano Básico */}
          <motion.div 
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            className="bg-surface-container-low rounded-[2rem] p-8 sm:p-10 flex flex-col transition-all shadow-md border border-outline-variant/10 relative group"
          >
            <div className="mb-8">
              <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-secondary mb-3 block opacity-70">Essencial</span>
              <h3 className="font-headline text-2xl md:text-3xl font-bold mb-2">Plano Básico</h3>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-xs md:text-sm font-bold text-on-surface-variant">R$</span>
                <span className="text-3xl sm:text-4xl md:text-5xl font-headline font-black">29,90</span>
                <span className="text-secondary font-medium text-sm md:text-base">/mês</span>
              </div>
            </div>
            <div className="flex flex-col gap-5 flex-grow mb-10">
              <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Token className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm md:text-base">10 Créditos</p>
                  <p className="text-[10px] md:text-xs text-secondary font-medium uppercase tracking-widest">Acesso mensal renovável</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-2">
                <div className="w-8 h-8 shrink-0 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-tertiary" />
                </div>
                <p className="font-bold text-on-surface text-sm">Relatórios Básicos</p>
              </div>
              <div className="flex items-center gap-4 px-2">
                <div className="w-8 h-8 shrink-0 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-tertiary" />
                </div>
                <p className="font-bold text-on-surface text-sm">Suporte via Email</p>
              </div>
              <div className="flex items-center gap-4 px-2 opacity-40">
                <div className="w-8 h-8 shrink-0 rounded-full bg-surface-container-highest flex items-center justify-center">
                  <X className="w-4 h-4" />
                </div>
                <p className="font-medium text-sm">Pix e QR Code ilimitados</p>
              </div>
            </div>
            <button className="w-full py-4 bg-secondary text-on-secondary font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Selecionar Básico
            </button>
          </motion.div>

          {/* Plano Premium */}
          <motion.div 
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            className="bg-surface-container-low rounded-[2rem] p-8 sm:p-10 flex flex-col relative overflow-hidden border-2 border-primary shadow-md transition-all group"
          >
            <div className="absolute top-0 right-0">
              <div className="bg-primary text-on-primary text-[9px] md:text-[10px] font-black px-4 py-1.5 rounded-bl-2xl tracking-widest uppercase">
                RECOMENDADO
              </div>
            </div>
            <div className="mb-8">
              <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-primary mb-3 block">Ilimitado</span>
              <h3 className="font-headline text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                Plano Premium <WorkspacePremium className="w-6 h-6 fill-primary text-primary" />
              </h3>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-xs md:text-sm font-bold text-on-surface-variant">R$</span>
                <span className="text-3xl sm:text-4xl md:text-5xl font-headline font-black text-primary">54,90</span>
                <span className="text-secondary font-medium text-sm md:text-base">/mês</span>
              </div>
            </div>
            <div className="flex flex-col gap-5 flex-grow mb-10">
              <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Token className="w-5 h-5 text-primary fill-current" />
                </div>
                <div>
                  <p className="font-bold text-on-surface text-sm md:text-base">25 Créditos</p>
                  <p className="text-[10px] md:text-xs text-secondary font-medium uppercase tracking-widest">Para operações avançadas</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-2">
                <div className="w-8 h-8 shrink-0 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <Payments className="w-4 h-4 text-tertiary" />
                </div>
                <p className="font-bold text-on-surface text-sm">Pix e QR Code Ilimitados</p>
              </div>
              <div className="flex items-center gap-4 px-2">
                <div className="w-8 h-8 shrink-0 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <TrackChanges className="w-4 h-4 text-tertiary" />
                </div>
                <p className="font-bold text-on-surface text-sm">Metas e Planejamento</p>
              </div>
              <div className="flex items-center gap-4 px-2">
                <div className="w-8 h-8 shrink-0 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <WorkspacePremium className="w-4 h-4 text-tertiary" />
                </div>
                <p className="font-bold text-on-surface text-sm">Recompensas Exclusivas</p>
              </div>
            </div>
            <button className="w-full py-4 bg-primary text-on-primary font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Assinar Premium
            </button>
          </motion.div>
        </div>

        {/* Free Trial CTA Section */}
        <section className="bg-surface-container-low rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md border border-outline-variant/10">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h4 className="font-headline text-xl md:text-2xl font-bold">Ainda na dúvida?</h4>
            <p className="text-sm md:text-base text-secondary font-medium">Explore as funcionalidades básicas sem custo.</p>
          </div>
          <button className="w-full md:w-auto h-14 px-10 bg-surface-container-highest/50 border border-dashed border-outline-variant/30 text-primary font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-2xl hover:bg-primary/10 transition-all flex items-center justify-center gap-3 active:scale-95">
            <PlayCircle className="w-5 h-5" />
            Testar versão gratuita
          </button>
        </section>
      </main>
      

      {/* Visual Background Element */}
      <div className="fixed top-0 right-0 -z-10 w-[300px] md:w-[500px] h-[300px] md:h-[500px] primary-gradient opacity-5 blur-[80px] md:blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
    </div>
  );
}
