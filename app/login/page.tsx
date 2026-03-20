'use client';

import React from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  ArrowRight as ArrowForward, 
  Sun,
  Bell,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="bg-surface font-body text-on-background min-h-screen flex flex-col">
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

      <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-12">
        {/* Logo and Welcome */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-10 h-10 text-on-primary" />
          </div>
          <h1 className="font-headline font-bold text-4xl tracking-tight">FINANCY</h1>
        </div>

        <div className="w-full max-w-md space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-headline text-4xl font-bold">Bem-vindo</h2>
            <p className="text-secondary font-medium">Acesse sua liberdade financeira</p>
          </div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-xl p-8 cloud-shadow space-y-8"
          >
            <form className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-secondary-fixed-variant ml-1" htmlFor="email">E-mail</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-outline w-5 h-5" />
                  <input 
                    className="w-full h-14 bg-surface-container-high border-none rounded-lg pl-12 pr-4 focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline-variant transition-all" 
                    id="email" 
                    placeholder="nome@exemplo.com" 
                    type="email"
                  />
                </div>
              </div>

              {/* Senha Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-semibold text-on-secondary-fixed-variant" htmlFor="password">Senha</label>
                  <Link href="#" className="text-sm font-bold text-primary hover:underline">Esqueceu?</Link>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-outline w-5 h-5" />
                  <input 
                    className="w-full h-14 bg-surface-container-high border-none rounded-lg pl-12 pr-12 focus:ring-2 focus:ring-primary/40 text-on-surface placeholder:text-outline-variant transition-all" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                  />
                  <Eye className="absolute right-4 text-outline cursor-pointer w-5 h-5" />
                </div>
              </div>

              {/* Submit Button */}
              <Link 
                href="/"
                className="w-full h-14 btn-gradient text-on-primary font-headline font-bold text-lg rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Entrar
              </Link>
            </form>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-container"></div>
              </div>
              <span className="relative px-4 bg-surface-container-lowest text-[10px] font-bold uppercase tracking-widest text-secondary">Ou continue com</span>
            </div>

            {/* Social Login */}
            <button className="w-full h-14 bg-surface-container-low text-on-surface font-bold rounded-xl border border-surface-container-high flex items-center justify-center gap-3 hover:bg-surface-container transition-colors">
              <Image src="https://picsum.photos/seed/google/24/24" alt="Google" width={24} height={24} className="rounded-full" />
              Entrar com Google
            </button>

            <div className="text-center pt-4">
              <p className="text-secondary text-sm">
                Não tem uma conta? 
                <Link className="text-primary font-bold hover:underline ml-1" href="/signup">Criar nova conta</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="p-8 flex flex-col items-center space-y-4">
        <div className="flex gap-6 text-xs font-medium text-secondary">
          <Link href="#" className="hover:text-on-surface">Termos de Uso</Link>
          <Link href="#" className="hover:text-on-surface">Privacidade</Link>
          <Link href="#" className="hover:text-on-surface">Segurança</Link>
        </div>
        <p className="text-outline-variant text-[10px] font-medium tracking-wide">
          © 2024 FINANCY. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
