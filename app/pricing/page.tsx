'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TopAppBar } from '@/components/top-bar';
import { BottomNavBar } from '@/components/bottom-bar';
import { auth, db } from '@/lib/firebase';
import { buildPaidSubscription, buildTrialSubscription, type SubscriptionPlan } from '@/lib/subscription';
import { createSubscriptionEvent } from '@/lib/firestore-data';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { 
  Check, 
  X, 
  Coins as Token, 
  Banknote as Payments, 
  Target as TrackChanges, 
  Award as WorkspacePremium,
  PlayCircle,
  Sun,
  Bell
} from 'lucide-react';
import { motion } from 'motion/react';

function buildSessionUrl(params: {
  userId: string;
  plan: SubscriptionPlan;
  trial: boolean;
  trialActivated?: boolean;
  trialExpiresAt: string | null;
}) {
  return {
    userId: params.userId,
    plan: params.plan,
    trial: params.trial,
    trialActivated: Boolean(params.trialActivated),
    trialExpiresAt: params.trialExpiresAt ?? ''
  };
}

export default function PricingPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = React.useState<SubscriptionPlan | null>(null);
  const [error, setError] = React.useState('');
  const [authUser, setAuthUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, []);

  const activatePlan = async (plan: SubscriptionPlan) => {
    setError('');
    setLoadingPlan(plan);

    try {
      if (!isAuthReady) {
        setError('Estamos preparando sua sessao. Tente novamente em alguns segundos.');
        setLoadingPlan(null);
        return;
      }

      const user = authUser;

      if (!user) {
        setError('Sua sessao expirou. Entre novamente para continuar.');
        setLoadingPlan(null);
        router.push('/login');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        setError('Sua conta nao foi localizada. Entre novamente para continuar.');
        return;
      }

      const subscriptionData = plan === 'visitante'
        ? { ...buildTrialSubscription(), trialActivated: true }
        : buildPaidSubscription(plan);

      await updateDoc(userRef, subscriptionData);
      await createSubscriptionEvent(user.uid, {
        plan: subscriptionData.plan,
        trial: subscriptionData.trial,
        credits: subscriptionData.credits,
        expiresAt: subscriptionData.trialExpiresAt
      });

      const sessionPayload = buildSessionUrl({
        userId: user.uid,
        plan: subscriptionData.plan,
        trial: subscriptionData.trial,
        trialActivated: subscriptionData.trialActivated,
        trialExpiresAt: subscriptionData.trialExpiresAt
      });
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 }
      });

      window.setTimeout(() => {
        fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(sessionPayload)
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error('SESSION_ERROR');
            }

            return response.json();
          })
          .then((data: { redirectTo: string }) => {
            window.location.assign(data.redirectTo);
          })
          .catch(() => {
            setError('Nao foi possivel concluir sua sessao agora.');
            setLoadingPlan(null);
          });
      }, 700);
    } catch {
      setError('Nao foi possivel ativar o plano agora.');
      setLoadingPlan(null);
      return;
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen">
      <TopAppBar />
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Editorial Header Section */}
        <section className="mb-8 md:mb-16 text-center">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-on-background leading-tight max-w-2xl mx-auto">
            Escolha o plano ideal para sua evolução financeira.
          </h2>
          <p className="text-secondary font-medium text-base md:text-lg max-w-xl mx-auto">
            Ferramentas arquitetadas para oferecer clareza, controle e crescimento real do seu patrimônio.
          </p>
          {error && (
            <p className="text-sm text-red-500 mt-4">{error}</p>
          )}
        </section>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 md:mb-20 items-stretch">
          {/* Plano Básico */}
          <motion.div 
            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            className="bg-surface-container-low rounded-[2rem] p-8 sm:p-10 flex flex-col transition-all shadow-md border border-outline-variant/10 relative group"
          >
            <div className="mb-8 text-center md:text-left">
              <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-secondary mb-3 block opacity-70">Essencial</span>
              <h3 className="font-headline text-2xl md:text-3xl font-bold mb-2">Plano Básico</h3>
              <div className="flex items-baseline justify-center md:justify-start gap-1 mt-4">
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
                  <p className="text-[10px] md:text-xs text-secondary font-medium uppercase tracking-widest">Plano pago com trial desativado</p>
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
                <p className="font-bold text-on-surface text-sm">Trial encerrado ao assinar</p>
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
            <button
              type="button"
              onClick={() => activatePlan('basic')}
              disabled={loadingPlan !== null || !isAuthReady}
              className="w-full py-4 bg-secondary text-on-secondary font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loadingPlan === 'basic' ? 'Ativando...' : 'Selecionar Básico'}
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
            <div className="mb-8 text-center md:text-left">
              <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-primary mb-3 block">Ilimitado</span>
              <h3 className="font-headline text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                Plano Premium <WorkspacePremium className="w-6 h-6 fill-primary text-primary" />
              </h3>
              <div className="flex items-baseline justify-center md:justify-start gap-1 mt-4">
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
                  <p className="text-[10px] md:text-xs text-secondary font-medium uppercase tracking-widest">Plano pago com trial desativado</p>
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
                  <Check className="w-4 h-4 text-tertiary" />
                </div>
                <p className="font-bold text-on-surface text-sm">Trial encerrado ao assinar</p>
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
            <button
              type="button"
              onClick={() => activatePlan('premium')}
              disabled={loadingPlan !== null || !isAuthReady}
              className="w-full py-4 bg-primary text-on-primary font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loadingPlan === 'premium' ? 'Ativando...' : 'Assinar Premium'}
            </button>
          </motion.div>
        </div>

        {/* Free Trial CTA Section */}
        <section className="bg-surface-container-low rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md border border-outline-variant/10">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h4 className="font-headline text-xl md:text-2xl font-bold">Ainda na dúvida?</h4>
            <p className="text-sm md:text-base text-secondary font-medium">Teste o plano básico por 7 dias, com 0 créditos e trial ativo.</p>
          </div>
          <button
            type="button"
            onClick={() => activatePlan('visitante')}
            disabled={loadingPlan !== null || !isAuthReady}
            className="w-full md:w-auto h-14 px-10 bg-surface-container-highest/50 border border-dashed border-outline-variant/30 text-primary font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-2xl hover:bg-primary/10 transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            <PlayCircle className="w-5 h-5" />
            {loadingPlan === 'visitante' ? 'Ativando...' : 'Testar 7 Dias Grátis'}
          </button>
        </section>
      </main>      
    <BottomNavBar />
      {/* Visual Background Element */}
      <div className="fixed top-0 right-0 -z-10 w-[300px] md:w-[500px] h-[300px] md:h-[500px] primary-gradient opacity-5 blur-[80px] md:blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
    </div>
  );
}
