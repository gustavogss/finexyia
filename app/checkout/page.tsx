'use client';

import React, { Suspense, useState } from 'react';
import { TopAppBar } from '@/components/top-bar';
import { BottomNavBar } from '@/components/bottom-bar';
import { formatCurrency } from '@/lib/utils';
import { 
  Wifi as Contactless, 
  Banknote as Payments, 
  User as Person, 
  CreditCard, 
  HelpCircle, 
  BadgeCheck as Verified, 
  ArrowRight as ArrowForward 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'next/navigation';

function CheckoutPageContent() {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const totalAmount = React.useMemo(() => {
    const raw = searchParams.get('amount') ?? searchParams.get('total');
    if (!raw) return null;

    // Accept formats like: "1250", "1250.50", "1.250,50"
    const normalized = raw.replace(/\./g, '').replace(',', '.');
    const value = Number(normalized);
    return Number.isFinite(value) ? value : null;
  }, [searchParams]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCvv(value);
  };

  return (
    <div className="bg-surface font-body text-on-background min-h-screen flex flex-col">
      <TopAppBar />
      <main className="max-w-xl mx-auto px-6 py-10 space-y-12 pb-24">
        {/* Page Title */}
        <section className="space-y-2">
          <h2 className="text-4xl font-headline font-bold text-on-secondary-fixed">Finalizar</h2>
          <p className="text-secondary font-medium">Insira os detalhes do seu cartão para concluir.</p>
        </section>

        {/* Visual Credit Card */}
        <motion.section 
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.6 }}
          className="relative group perspective-1000"
        >
          <div className="card-gradient w-full aspect-[1.586/1] rounded-xl p-8 text-white flex flex-col justify-between shadow-2xl transform transition-transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest opacity-70">Credit Card</p>
                <div className="w-12 h-8 bg-primary-fixed-dim/20 rounded-lg flex items-center justify-center">
                  <Contactless className="w-6 h-6 text-primary-fixed" />
                </div>
              </div>
              <div className="w-14 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Payments className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <motion.p 
                  key={cardNumber}
                  animate={focusedField === 'card_number' ? { scale: [1, 1.02, 1], y: [0, -2, 0] } : {}}
                  transition={{ duration: 0.15 }}
                  className="text-2xl font-headline tracking-[0.2em] opacity-90"
                >
                  {cardNumber || '•••• •••• •••• ••••'}
                </motion.p>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest opacity-60">Nome no Cartão</p>
                  <p className="font-headline font-medium tracking-wide uppercase truncate max-w-[180px]">
                    {cardName || 'SEU NOME AQUI'}
                  </p>
                </div>
                <div className="flex gap-8">
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] uppercase tracking-widest opacity-60">Validade</p>
                    <p className="font-headline font-medium">{expiry || 'MM/AA'}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] uppercase tracking-widest opacity-60">CVV</p>
                    <p className="font-headline font-medium">{cvv ? '•••' : '•••'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative atmospheric glow */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/5 blur-[80px] rounded-full"></div>
        </motion.section>

        {/* Form Fields */}
        <form className="space-y-8">
          <div className="space-y-6">
            {/* Field: Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-secondary-fixed-variant ml-1" htmlFor="card_name">Nome no cartão</label>
              <div className="relative group">
                <input 
                  className="w-full bg-surface-container-high border-none rounded-xl h-16 px-6 focus:ring-2 focus:ring-primary/40 text-lg font-medium transition-all" 
                  id="card_name" 
                  placeholder="Ex: João A. Silva" 
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  onFocus={() => setFocusedField('card_name')}
                  onBlur={() => setFocusedField(null)}
                />
                <Person className="absolute right-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
              </div>
            </div>
            {/* Field: Card Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-secondary-fixed-variant ml-1" htmlFor="card_number">Número do cartão</label>
              <div className="relative group">
                <input 
                  className="w-full bg-surface-container-high border-none rounded-xl h-16 px-6 focus:ring-2 focus:ring-primary/40 text-lg font-medium tracking-widest transition-all" 
                  id="card_number" 
                  placeholder="0000 0000 0000 0000" 
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  onFocus={() => setFocusedField('card_number')}
                  onBlur={() => setFocusedField(null)}
                />
                <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
              </div>
            </div>
            {/* Row: Expiry and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-secondary-fixed-variant ml-1" htmlFor="expiry">Validade</label>
                <input 
                  className="w-full bg-surface-container-high border-none rounded-xl h-16 px-6 focus:ring-2 focus:ring-primary/40 text-lg font-medium transition-all text-center" 
                  id="expiry" 
                  placeholder="MM/AA" 
                  type="text"
                  value={expiry}
                  onChange={handleExpiryChange}
                  onFocus={() => setFocusedField('expiry')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-secondary-fixed-variant ml-1" htmlFor="cvv">CVV</label>
                <div className="relative group">
                  <input 
                    className="w-full bg-surface-container-high border-none rounded-xl h-16 px-6 focus:ring-2 focus:ring-primary/40 text-lg font-medium transition-all text-center" 
                    id="cvv" 
                    placeholder="•••" 
                    type="password"
                    value={cvv}
                    onChange={handleCvvChange}
                    onFocus={() => setFocusedField('cvv')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <HelpCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-outline w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-surface-container-low rounded-xl p-6 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm text-secondary font-medium">Total da Compra</p>
              <p className="text-2xl font-headline font-bold text-on-secondary-fixed">
                {totalAmount === null ? '—' : formatCurrency(totalAmount)}
              </p>
            </div>
            <div className="flex items-center gap-2 text-tertiary bg-tertiary-fixed/30 px-3 py-1 rounded-full">
              <Verified className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-tighter">Seguro</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full btn-gradient text-on-primary h-[72px] rounded-xl font-headline font-bold text-xl shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3" type="submit">
            <span>Confirmar Compra</span>
            <ArrowForward className="w-6 h-6" />
          </button>
          {/* Secondary Action */}
          <button className="w-full text-secondary font-medium py-2 hover:text-on-secondary-fixed transition-colors" type="button">
            Cancelar e voltar
          </button>
        </form>
      </main>      
      <BottomNavBar />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
