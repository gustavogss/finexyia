'use client';

import React from 'react';
import { Mail, Lock, Eye, Sun, Bell, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const [error, setError] = React.useState('');

  const onSubmit = async (data: LoginForm) => {
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const json = await res.json();
        setError(json.error || 'Erro ao fazer login.');
      }
    } catch {
      setError('Erro ao conectar ao servidor.');
    }
  };

  return (
    <div className="bg-surface font-body text-on-background min-h-screen flex flex-col">
      {/* Top Bar */}
      <nav className="h-16 flex items-center justify-between px-6 bg-on-secondary-fixed sticky top-0 z-50">
        <Sun className="w-6 h-6 text-on-primary" />
        <div className="text-on-primary font-bold tracking-widest text-lg">FINANCY</div>
        <Bell className="w-6 h-6 text-on-primary" />
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center p-6 space-y-12">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-10 h-10 text-on-primary" />
          </div>
          <h1 className="font-bold text-4xl tracking-tight">FINANCY</h1>
        </div>

        <div className="w-full max-w-md space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold">Bem-vindo</h2>
            <p className="text-secondary font-medium">
              Acesse sua liberdade financeira
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-xl p-8 shadow space-y-8"
          >
            <form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold" htmlFor="email">
                  E-mail
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                  <input
                    className="w-full h-14 pl-12 pr-4 rounded-lg border"
                    id="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    {...register('email')}
                  />
                </div>

                {errors.email && (
                  <span className="text-red-500 text-xs">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label className="text-sm font-semibold" htmlFor="password">
                  Senha
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                  <input
                    className="w-full h-14 pl-12 pr-12 rounded-lg border"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  <Eye className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" />
                </div>

                {errors.password && (
                  <span className="text-red-500 text-xs">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-green-700 text-white font-bold rounded-xl hover:bg-green-600"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="text-center text-xs text-gray-400">
              Ou continue com
            </div>

            {/* Social (placeholder) */}
            <button
              type="button"
              className="w-full h-14 border rounded-xl flex items-center justify-center gap-2"
            >
              <Image
                src="/favicon.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Entrar com Google
            </button>

            <div className="text-center">
              <p className="text-sm">
                Não tem uma conta?
                <Link href="/signup" className="text-blue-600  ml-1">
                  Criar
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-gray-500">
        © 2026 FINANCY
      </footer>
    </div>
  );
}