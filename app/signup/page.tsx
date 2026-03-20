'use client';

import React from 'react';
import { 
  Mail, 
  Lock, 
  Eye as Visibility, 
  ArrowRight as ArrowForward, 
  ShieldCheck, 
  ShieldCheck as VerifiedUser,
  Sun,
  Bell
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="bg-background font-body text-on-background min-h-screen flex flex-col">
      {/* Top Bar Navigation */}
      <nav className="h-16 flex items-center justify-between px-6 bg-on-secondary-fixed sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Sun className="w-6 h-6 text-on-primary" />
        </div>
        <div className="text-on-primary font-headline font-bold tracking-widest text-lg">FINANCY</div>
        <div className="flex items-center gap-4">
          <Bell className="w-6 h-6 text-on-primary" />
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Architectural Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-container opacity-20 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-container opacity-10 blur-3xl"></div>

        <div className="w-full max-w-md z-10">
          {/* Branding/Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="font-headline font-bold text-on-background mb-4 tracking-tight text-4xl">Comece agora.</h1>
            <p className="text-secondary font-medium text-lg px-8">Organize sua vida financeira com clareza editorial e segurança absoluta.</p>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container-lowest rounded-xl p-8 cloud-shadow"
          >
            <form className="space-y-6">
              {/* Nome Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-secondary-fixed-variant ml-1" htmlFor="name">Nome completo</label>
                <div className="relative">
                  <input 
                    className="w-full h-14 bg-surface-container-high border-none rounded-lg px-4 pt-1 focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline-variant transition-all" 
                    id="name" 
                    placeholder="Seu nome" 
                    type="text"
                  />
                </div>
              </div>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-secondary-fixed-variant ml-1" htmlFor="email">E-mail</label>
                <div className="relative">
                  <input 
                    className="w-full h-14 bg-surface-container-high border-none rounded-lg px-4 pt-1 focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline-variant transition-all" 
                    id="email" 
                    placeholder="exemplo@email.com" 
                    type="email"
                  />
                </div>
              </div>
              {/* Senha Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-secondary-fixed-variant ml-1" htmlFor="password">Senha</label>
                <div className="relative flex items-center">
                  <input 
                    className="w-full h-14 bg-surface-container-high border-none rounded-lg px-4 pt-1 focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline-variant transition-all" 
                    id="password" 
                    placeholder="Mínimo 8 caracteres" 
                    type="password"
                  />
                  <Visibility className="absolute right-4 text-outline cursor-pointer w-5 h-5" />
                </div>
              </div>
              {/* Confirmar Senha Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-secondary-fixed-variant ml-1" htmlFor="confirm-password">Confirmar senha</label>
                <div className="relative flex items-center">
                  <input 
                    className="w-full h-14 bg-surface-container-high border-none rounded-lg px-4 pt-1 focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline-variant transition-all" 
                    id="confirm-password" 
                    placeholder="Repita sua senha" 
                    type="password"
                  />
                  <Lock className="absolute right-4 text-outline cursor-pointer w-5 h-5" />
                </div>
              </div>
              {/* Submit Button */}
              <div className="pt-4">
                <Link 
                  href="/"
                  className="w-full h-14 bg-orange-gradient text-on-primary font-headline font-bold text-lg rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Criar Conta
                  <ArrowForward className="w-5 h-5" />
                </Link>
              </div>
            </form>
            {/* Footer of Form */}
            <div className="mt-8 pt-8 border-t border-surface-container text-center">
              <p className="text-secondary text-sm">
                Já possui uma conta? 
                <Link className="text-primary font-bold hover:underline ml-1" href="/login">Entrar</Link>
              </p>
            </div>
          </motion.div>

          {/* Social Proof / Security Badge */}
          <div className="mt-12 flex items-center justify-center gap-6 opacity-60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">Segurança 256-bit</span>
            </div>
            <div className="h-4 w-[1px] bg-outline-variant"></div>
            <div className="flex items-center gap-2">
              <VerifiedUser className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">LGPD Compliant</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-outline-variant text-xs font-medium tracking-wide">
        © 2024 FINANCY. Todos os direitos reservados.
      </footer>
    </div>
  );
}
