'use client';

import React, { useState } from 'react';
import {
  Lock,
  Eye,
  ArrowRight,
  Sun,
  Bell,
  TrendingUp  
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { auth, db, googleProvider } from '@/lib/firebase';
import { GoogleIcon } from '@/components/google-icon';
import { buildTrialSubscription } from '@/lib/subscription';
import { buildDefaultUserFields } from '@/lib/firestore-data';
import { getPlansConfig } from '@/lib/plans-config';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const isNewUser = !userDoc.exists();

      if (isNewUser) {
        const plansConfig = await getPlansConfig();
        await setDoc(userRef, {
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
          ...buildDefaultUserFields(),
          ...buildTrialSubscription(plansConfig.trialDays),
        });
      }

      const existingUserTrial = userDoc.exists() ? Boolean(userDoc.data().trial) : true;

      router.push(isNewUser || existingUserTrial ? '/pricing' : '/');
    } catch {
      setError('Erro ao criar conta com Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Informe seu nome.');
    if (password.length < 8) return setError('Senha mínimo 8 caracteres.');
    if (password !== confirmPassword) return setError('Senhas não coincidem.');

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, { displayName: name });

      const plansConfig = await getPlansConfig();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        id: userCredential.user.uid,
        name,
        email,
        photoURL: '',
        createdAt: serverTimestamp(),
        ...buildDefaultUserFields(),
        ...buildTrialSubscription(plansConfig.trialDays),
      });

      router.push('/pricing');
    } catch {
      setError('Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col text-on-background">
      
      {/* Navbar */}
      <nav className="h-16 flex items-center justify-between px-6 bg-on-secondary-fixed sticky top-0">
        <Sun className="w-6 h-6 text-on-primary" />
        <div className="font-bold text-lg tracking-widest">FINANCY</div>
        <Bell className="w-6 h-6 text-on-primary" />
      </nav>

      {/* Conteúdo */}
      <main className="flex-grow flex flex-col items-center justify-center p-6">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-10 h-10 text-on-primary" />
          </div>
          <h1 className="text-3xl font-bold mt-4">FINANCY</h1>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-8 shadow-xl space-y-6 "
        >
          <div className="text-center ">
            <h2 className="text-2xl font-bold">Criar conta</h2>
            <p className="text-sm text-secondary">
              Comece a organizar sua vida financeira
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">

            <input
              placeholder="Nome completo"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-14 px-4 rounded-lg bg-surface-container-high"
            />

            <input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full h-14 px-4 rounded-lg bg-surface-container-high"
            />

            <div className="relative">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-14 px-4 rounded-lg bg-surface-container-high"
              />
              <Eye className="absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full h-14 px-4 rounded-lg bg-surface-container-high"
              />
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-green-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 hover:cursor-pointer transition-colors"
            >
              {loading ? 'Criando...' : (
                <>
                  Criar conta <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>

          {/* Divider */}
          <div className="text-center text-xs text-secondary">
            ou continue com
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full h-14 border rounded-xl flex items-center justify-center gap-2 hover:cursor-pointer transition-colors"
          >
            <GoogleIcon />
            Criar com Google
          </button>

          <p className="text-center text-sm">
            Já tem conta?
            <Link href="/login" className="text-primary ml-1">
              Entrar
            </Link>
          </p>
        </motion.div>      

      </main>

      <footer className="text-center text-xs p-4 text-secondary">
        © 2026 FINANCY
      </footer>
    </div>
  );
}
