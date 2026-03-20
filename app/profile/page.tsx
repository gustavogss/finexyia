'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Bell,
  CalendarClock,
  Check,
  CreditCard,
  Gift,
  LogOut,
  Mail,
  Plus,
  ShieldCheck,
  Star,
  Target,
  Trash2,
  Wallet,
  X,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { TopAppBar } from '@/components/top-bar';
import { BottomNavBar } from '@/components/bottom-bar';
import { AddCardModal } from '@/components/add-card-modal';
import { CardModal } from '@/components/card-modal';
import { auth } from '@/lib/firebase';
import { useAuthUser } from '@/lib/use-auth-user';
import {
  createCard,
  createGoal,
  createReminder,
  deleteCardRecord,
  deleteGoalRecord,
  deleteReminderRecord,
  getUserProfile,
  subscribeToCards,
  subscribeToGoals,
  subscribeToReminders,
  subscribeToSubscriptionEvents,
  updateGoalRecord,
  updateReminderRecord,
  updateUserProfile,
} from '@/lib/firestore-data';
import type {
  CardRecord,
  GoalRecord,
  ReminderRecord,
  SubscriptionEventRecord,
  UserProfile,
} from '@/lib/firestore-types';
import { cn, formatAmount, formatCurrency } from '@/lib/utils';

function formatPlan(plan: UserProfile['plan']) {
  switch (plan) {
    case 'premium':
      return 'Premium';
    case 'basic':
      return 'Básico';
    default:
      return 'Visitante';
  }
}

function formatDate(date: string | null) {
  if (!date) {
    return '-';
  }

  return new Date(date).toLocaleDateString('pt-BR');
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isReady } = useAuthUser();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [goals, setGoals] = React.useState<GoalRecord[]>([]);
  const [reminders, setReminders] = React.useState<ReminderRecord[]>([]);
  const [cards, setCards] = React.useState<CardRecord[]>([]);
  const [subscriptionHistory, setSubscriptionHistory] = React.useState<SubscriptionEventRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [isAddCardModalOpen, setIsAddCardModalOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState<CardRecord | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false);
  const [isAddingGoal, setIsAddingGoal] = React.useState(false);
  const [isAddingReminder, setIsAddingReminder] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<GoalRecord | null>(null);
  const [editingReminder, setEditingReminder] = React.useState<ReminderRecord | null>(null);
  const [goalForm, setGoalForm] = React.useState({ name: '', currentAmount: '', targetAmount: '', monthlyTarget: '' });
  const [reminderForm, setReminderForm] = React.useState({ name: '', amount: '', dueDate: '' });

  React.useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    let isMounted = true;

    getUserProfile(user.uid)
      .then((nextProfile) => {
        if (isMounted) {
          setProfile(nextProfile);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Não foi possível carregar seu perfil.');
          setLoading(false);
        }
      });

    const unsubGoals = subscribeToGoals(user.uid, setGoals);
    const unsubReminders = subscribeToReminders(user.uid, setReminders);
    const unsubCards = subscribeToCards(user.uid, setCards);
    const unsubEvents = subscribeToSubscriptionEvents(user.uid, setSubscriptionHistory);

    return () => {
      isMounted = false;
      unsubGoals();
      unsubReminders();
      unsubCards();
      unsubEvents();
    };
  }, [isReady, router, user]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.assign('/login');
  };

  const toggleNotification = async (key: keyof UserProfile['notifications']) => {
    if (!user || !profile) {
      return;
    }

    const notifications = {
      ...profile.notifications,
      [key]: !profile.notifications[key],
    };

    setProfile({ ...profile, notifications });
    await updateUserProfile(user.uid, { notifications });
  };

  const toggleAutoRenewal = async () => {
    if (!user || !profile) {
      return;
    }

    const autoRenewal = !profile.autoRenewal;
    setProfile({ ...profile, autoRenewal });
    await updateUserProfile(user.uid, { autoRenewal });
  };

  const handleAddCard = async (card: { name: string; number: string; expiry: string; cvv: string }) => {
    if (!user) {
      return;
    }

    await createCard(user.uid, card);
  };

  const handleDeleteCard = async () => {
    if (!selectedCard) {
      return;
    }

    await deleteCardRecord(selectedCard.id);
    setIsCardModalOpen(false);
    setSelectedCard(null);
  };

  const handleGoalAmountChange = (value: string, field: 'currentAmount' | 'targetAmount' | 'monthlyTarget') => {
    let numericValue = value.replace(/\D/g, '');
    if (numericValue === '') {
      setGoalForm((prev) => ({ ...prev, [field]: '' }));
      return;
    }

    setGoalForm((prev) => ({ ...prev, [field]: formatAmount(parseInt(numericValue, 10) / 100) }));
  };

  const saveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !goalForm.name || !goalForm.targetAmount || !goalForm.monthlyTarget) {
      return;
    }

    const payload = {
      name: goalForm.name,
      currentAmount: goalForm.currentAmount ? parseInt(goalForm.currentAmount.replace(/\D/g, ''), 10) / 100 : 0,
      targetAmount: parseInt(goalForm.targetAmount.replace(/\D/g, ''), 10) / 100,
      monthlyTarget: parseInt(goalForm.monthlyTarget.replace(/\D/g, ''), 10) / 100,
      history: editingGoal?.history ?? [],
    };

    if (editingGoal) {
      await updateGoalRecord(editingGoal.id, payload);
      setEditingGoal(null);
    } else {
      await createGoal(user.uid, payload);
      setIsAddingGoal(false);
    }

    setGoalForm({ name: '', currentAmount: '', targetAmount: '', monthlyTarget: '' });
  };

  const beginEditGoal = (goal: GoalRecord) => {
    setEditingGoal(goal);
    setGoalForm({
      name: goal.name,
      currentAmount: formatAmount(goal.currentAmount),
      targetAmount: formatAmount(goal.targetAmount),
      monthlyTarget: formatAmount(goal.monthlyTarget),
    });
  };

  const handleDeleteGoal = async () => {
    if (!editingGoal) {
      return;
    }

    await deleteGoalRecord(editingGoal.id);
    setEditingGoal(null);
    setGoalForm({ name: '', currentAmount: '', targetAmount: '', monthlyTarget: '' });
  };

  const handleReminderAmountChange = (value: string) => {
    let numericValue = value.replace(/\D/g, '');
    if (numericValue === '') {
      setReminderForm((prev) => ({ ...prev, amount: '' }));
      return;
    }

    setReminderForm((prev) => ({ ...prev, amount: formatAmount(parseInt(numericValue, 10) / 100) }));
  };

  const saveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !reminderForm.name || !reminderForm.amount || !reminderForm.dueDate) {
      return;
    }

    const payload = {
      name: reminderForm.name,
      amount: parseInt(reminderForm.amount.replace(/\D/g, ''), 10) / 100,
      dueDate: reminderForm.dueDate,
    };

    if (editingReminder) {
      await updateReminderRecord(editingReminder.id, payload);
      setEditingReminder(null);
    } else {
      await createReminder(user.uid, payload);
      setIsAddingReminder(false);
    }

    setReminderForm({ name: '', amount: '', dueDate: '' });
  };

  const beginEditReminder = (reminder: ReminderRecord) => {
    setEditingReminder(reminder);
    setReminderForm({
      name: reminder.name,
      amount: formatAmount(reminder.amount),
      dueDate: reminder.dueDate.slice(0, 10),
    });
  };

  const handleDeleteReminder = async () => {
    if (!editingReminder) {
      return;
    }

    await deleteReminderRecord(editingReminder.id);
    setEditingReminder(null);
    setReminderForm({ name: '', amount: '', dueDate: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-32 bg-surface">
        <TopAppBar />
        <main className="max-w-xl mx-auto px-4 sm:px-6 pt-10">
          <p className="text-secondary text-center">Carregando perfil...</p>
        </main>
        <BottomNavBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-surface">
      <TopAppBar />
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8">
        {error && <p className="text-sm text-error text-center">{error}</p>}

        {profile && (
          <section className="flex flex-col items-center text-center space-y-4">
            <div className="w-28 h-28 rounded-full border-4 border-primary/10 overflow-hidden relative shadow-xl bg-surface-container-high flex items-center justify-center">
              {profile.photoURL ? (
                <Image
                  src={profile.photoURL}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="font-headline text-3xl font-bold text-primary">
                  {getInitials(profile.name || 'U')}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <h2 className="font-headline text-3xl font-bold">{profile.name || 'Usuário'}</h2>
              <p className="text-secondary text-sm flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {profile.email}
              </p>
              <div
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm',
                  profile.plan === 'premium'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-secondary-container text-on-secondary-container'
                )}
              >
                <Star className={cn('w-3.5 h-3.5', profile.plan === 'premium' && 'fill-current')} />
                Plano {formatPlan(profile.plan)}
              </div>
            </div>
          </section>
        )}

        {profile && (
          <section className="bg-surface-container-low rounded-[2.5rem] p-6 space-y-5 shadow-md border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-secondary">Assinatura</p>
                <h3 className="font-headline text-xl font-bold">Conta e Plano</h3>
              </div>
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Créditos</p>
                <p className="text-2xl font-headline font-bold text-primary">{profile.credits}</p>
              </div>
              <div className="bg-surface-container-lowest rounded-2xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary">Saldo Inicial</p>
                <p className="text-lg font-bold">{formatCurrency(profile.openingBalance)}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/pricing')}
              className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
            >
              Gerenciar Plano
            </button>
          </section>
        )}

        <section className="bg-surface-container-low rounded-[2.5rem] p-6 space-y-4 shadow-md border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold">Histórico de Assinaturas</h3>
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          {subscriptionHistory.length === 0 ? (
            <p className="text-sm text-secondary">Nenhum evento de assinatura registrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {subscriptionHistory.map((item) => (
                <div key={item.id} className="bg-surface-container-lowest rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold">{formatPlan(item.plan)}</p>
                    <p className="text-xs text-secondary">
                      {item.trial ? 'Trial' : 'Pago'} • {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{item.credits} créditos</p>
                    <p className="text-xs text-secondary">Expira: {formatDate(item.expiresAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-surface-container-low rounded-[2.5rem] p-6 space-y-4 shadow-md border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold">Cartões</h3>
            <button onClick={() => setIsAddCardModalOpen(true)} className="p-2 bg-primary text-on-primary rounded-xl">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {cards.length === 0 ? (
            <p className="text-sm text-secondary">Nenhum cartão cadastrado.</p>
          ) : (
            cards.map((card) => (
              <button
                key={card.id}
                onClick={() => {
                  setSelectedCard(card);
                  setIsCardModalOpen(true);
                }}
                className="w-full bg-surface-container-lowest rounded-2xl p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-bold">{card.name}</p>
                    <p className="text-xs text-secondary">**** **** **** {card.number.slice(-4)}</p>
                  </div>
                </div>
                <span className="text-xs text-secondary">{card.expiry}</span>
              </button>
            ))
          )}
        </section>

        <section className="bg-surface-container-low rounded-[2.5rem] p-6 space-y-4 shadow-md border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold">Metas</h3>
            <button
              onClick={() => {
                setEditingGoal(null);
                setGoalForm({ name: '', currentAmount: '', targetAmount: '', monthlyTarget: '' });
                setIsAddingGoal(true);
              }}
              className="p-2 bg-secondary text-on-secondary rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {goals.length === 0 ? (
            <p className="text-sm text-secondary">Nenhuma meta cadastrada.</p>
          ) : (
            goals.map((goal) => {
              const progress = goal.targetAmount > 0 ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0;
              return (
                <button key={goal.id} onClick={() => beginEditGoal(goal)} className="w-full bg-surface-container-lowest rounded-2xl p-4 text-left space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold">{goal.name}</p>
                      <p className="text-xs text-secondary">{formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}</p>
                    </div>
                    <Target className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </button>
              );
            })
          )}
        </section>

        <section className="bg-surface-container-low rounded-[2.5rem] p-6 space-y-4 shadow-md border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold">Lembretes</h3>
            <button
              onClick={() => {
                setEditingReminder(null);
                setReminderForm({ name: '', amount: '', dueDate: '' });
                setIsAddingReminder(true);
              }}
              className="p-2 bg-primary text-on-primary rounded-xl"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {reminders.length === 0 ? (
            <p className="text-sm text-secondary">Nenhum lembrete cadastrado.</p>
          ) : (
            reminders.map((reminder) => (
              <button key={reminder.id} onClick={() => beginEditReminder(reminder)} className="w-full bg-surface-container-lowest rounded-2xl p-4 text-left flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold">{reminder.name}</p>
                  <p className="text-xs text-secondary">Vence em {formatDate(reminder.dueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatCurrency(reminder.amount)}</p>
                  <CalendarClock className="w-4 h-4 text-secondary ml-auto" />
                </div>
              </button>
            ))
          )}
        </section>

        {profile && (
          <section className="bg-surface-container-low rounded-[2.5rem] p-6 space-y-5 shadow-md border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-xl font-bold">Preferências</h3>
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-4">
              {([
                ['spendingAlerts', 'Alertas de Gastos'],
                ['monthlyReports', 'Relatórios Mensais'],
                ['dueAlerts', 'Alertas de Vencimento'],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between bg-surface-container-lowest rounded-2xl p-4">
                  <p className="font-medium">{label}</p>
                  <button
                    onClick={() => toggleNotification(key)}
                    className={cn('w-12 h-6 rounded-full relative transition-colors', profile.notifications[key] ? 'bg-primary' : 'bg-surface-container-high')}
                  >
                    <motion.div animate={{ x: profile.notifications[key] ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between bg-surface-container-lowest rounded-2xl p-4">
                <p className="font-medium">Renovação Automática</p>
                <button
                  onClick={toggleAutoRenewal}
                  className={cn('w-12 h-6 rounded-full relative transition-colors', profile.autoRenewal ? 'bg-primary' : 'bg-surface-container-high')}
                >
                  <motion.div animate={{ x: profile.autoRenewal ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="bg-surface-container-low rounded-[2.5rem] p-6 space-y-4 shadow-md border border-outline-variant/10">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold">Segurança</h3>
            <ShieldCheck className="w-5 h-5 text-error" />
          </div>
          <p className="text-sm text-secondary">Para sua proteção, sua sessão e preferências agora são carregadas do Firestore e do Firebase Auth.</p>
        </section>

        <button onClick={handleLogout} className="w-full py-5 text-error font-black text-lg hover:bg-error/5 rounded-3xl transition-all flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </main>

      <BottomNavBar />

      <AddCardModal isOpen={isAddCardModalOpen} onClose={() => setIsAddCardModalOpen(false)} onAdd={handleAddCard} />

      {selectedCard && (
        <CardModal
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          card={selectedCard}
          onDelete={handleDeleteCard}
          canDelete={cards.length > 1}
        />
      )}

      {(isAddingGoal || editingGoal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setIsAddingGoal(false); setEditingGoal(null); }} />
          <div className="relative bg-surface-container-low w-full max-w-sm rounded-[2.5rem] p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-headline text-xl font-black">{editingGoal ? 'Editar Meta' : 'Nova Meta'}</h3>
              <button onClick={() => { setIsAddingGoal(false); setEditingGoal(null); }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveGoal} className="space-y-4">
              <input value={goalForm.name} onChange={(e) => setGoalForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nome da meta" className="w-full bg-surface-container-high rounded-2xl px-4 py-3" required />
              <input value={goalForm.currentAmount} onChange={(e) => handleGoalAmountChange(e.target.value, 'currentAmount')} placeholder="Valor atual" className="w-full bg-surface-container-high rounded-2xl px-4 py-3" />
              <input value={goalForm.targetAmount} onChange={(e) => handleGoalAmountChange(e.target.value, 'targetAmount')} placeholder="Meta" className="w-full bg-surface-container-high rounded-2xl px-4 py-3" required />
              <input value={goalForm.monthlyTarget} onChange={(e) => handleGoalAmountChange(e.target.value, 'monthlyTarget')} placeholder="Alvo mensal" className="w-full bg-surface-container-high rounded-2xl px-4 py-3" required />
              <div className="flex gap-3">
                {editingGoal && (
                  <button type="button" onClick={handleDeleteGoal} className="w-14 h-14 bg-error/10 text-error rounded-2xl flex items-center justify-center">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button type="submit" className="flex-1 bg-secondary text-on-secondary py-4 rounded-2xl font-black">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(isAddingReminder || editingReminder) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setIsAddingReminder(false); setEditingReminder(null); }} />
          <div className="relative bg-surface-container-low w-full max-w-sm rounded-[2.5rem] p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-headline text-xl font-black">{editingReminder ? 'Editar Lembrete' : 'Novo Lembrete'}</h3>
              <button onClick={() => { setIsAddingReminder(false); setEditingReminder(null); }}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveReminder} className="space-y-4">
              <input value={reminderForm.name} onChange={(e) => setReminderForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Nome da conta" className="w-full bg-surface-container-high rounded-2xl px-4 py-3" required />
              <input value={reminderForm.amount} onChange={(e) => handleReminderAmountChange(e.target.value)} placeholder="Valor" className="w-full bg-surface-container-high rounded-2xl px-4 py-3" required />
              <input type="date" value={reminderForm.dueDate} onChange={(e) => setReminderForm((prev) => ({ ...prev, dueDate: e.target.value }))} className="w-full bg-surface-container-high rounded-2xl px-4 py-3" required />
              <div className="flex gap-3">
                {editingReminder && (
                  <button type="button" onClick={handleDeleteReminder} className="w-14 h-14 bg-error/10 text-error rounded-2xl flex items-center justify-center">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button type="submit" className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-black">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
