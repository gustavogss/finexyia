'use client';

import React, { useState, useEffect } from 'react';
import { TopAppBar } from '@/components/navigation';
import { 
  HandCoins, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  Mail,
  Camera,
  Star,
  Info,
  Check,
  X,
  AlertCircle,
  CalendarClock,
  Plus,
  Trash2,
  Gift,
  Target,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { cn, formatCurrency, formatAmount } from '@/lib/utils';
import { useTransactions } from '@/lib/transactions-context';
import { AddCardModal } from '@/components/add-card-modal';
import { CardModal } from '@/components/card-modal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

export default function ProfilePage() {
  const { balance, totalExpenses, totalIncome } = useTransactions();
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [user, setUser] = useState({
    name: 'Gustavo Silva',
    email: 'gustavogss.jp@gmail.com',
    plan: 'Premium', // 'Básico' | 'Premium'
    credits: 20,
    notifications: {
      spendingAlerts: true,
      monthlyReports: false,
    },
    autoRenewal: true,
  });

  const [reminders, setReminders] = useState([
    { id: 1, name: 'Aluguel', amount: 1200, dueDate: '2026-04-05' },
    { id: 2, name: 'Internet', amount: 99.90, dueDate: '2026-04-10' },
  ]);

  const [goals, setGoals] = useState([
    { 
      id: 1, 
      name: 'Viagem de Férias', 
      currentAmount: 3500, 
      targetAmount: 5000,
      monthlyTarget: 500,
      history: [
        { month: 'Jan', saved: 400 },
        { month: 'Fev', saved: 500 },
        { month: 'Mar', saved: 600 }
      ]
    },
    {
      id: 2,
      name: 'Reserva de Emergência',
      currentAmount: 12000,
      targetAmount: 15000,
      monthlyTarget: 3000,
      history: [
        { month: 'Jan', saved: 2000 },
        { month: 'Fev', saved: 2500 },
        { month: 'Mar', saved: 3500 }
      ]
    }
  ]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<{ id: number; name: string; currentAmount: string; targetAmount: string; monthlyTarget: string } | null>(null);
  const [newGoal, setNewGoal] = useState({ name: '', currentAmount: '', targetAmount: '', monthlyTarget: '' });

  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);

  // Carregar preferência de notificações do localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreference = localStorage.getItem('pushNotificationsEnabled');
      if (savedPreference === 'true') {
        setPushNotificationsEnabled(true);
      } else if ("Notification" in window && Notification.permission === "granted") {
        setPushNotificationsEnabled(true);
      }
    }
  }, []);

  // Salvar preferência de notificações no localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pushNotificationsEnabled', String(pushNotificationsEnabled));
    }
  }, [pushNotificationsEnabled]);

  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [editingReminder, setEditingReminder] = useState<{ id: number; name: string; amount: string; dueDate: string } | null>(null);
  const [reminderToDelete, setReminderToDelete] = useState<number | null>(null);
  const [newReminder, setNewReminder] = useState({ name: '', amount: '', dueDate: '' });

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [showSuccessModal, setShowSuccessModal] = useState<{ show: boolean; plan: string }>({ show: false, plan: '' });

  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubscribe = async (plan: string) => {
    setUser(prev => ({ ...prev, plan }));
    
    // Trigger confetti
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: plan === 'Premium' ? ['#FFD700', '#FFA500', '#FF4500'] : ['#4CAF50', '#8BC34A', '#CDDC39']
      });
    } catch (error) {
      console.error('Failed to load confetti:', error);
    }

    setShowSuccessModal({ show: true, plan });
  };

  // Lógica de alerta de gastos
  useEffect(() => {
    if (user.notifications.spendingAlerts && totalIncome > 0) {
      if (totalExpenses > totalIncome * 0.8) {
        console.warn('Alerta: Seus gastos excederam 80% da sua renda!');
        // Aqui você pode integrar com um sistema de notificação visual
      }
    }
  }, [totalExpenses, totalIncome, user.notifications.spendingAlerts]);

  const toggleNotification = (key: 'spendingAlerts' | 'monthlyReports') => {
    setUser(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const toggleAutoRenewal = () => {
    setUser(prev => ({ ...prev, autoRenewal: !prev.autoRenewal }));
  };

  const handleSaveName = () => {
    setUser(prev => ({ ...prev, name: newName }));
    setIsEditingName(false);
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      window.location.href = '/login';
    }
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.monthlyTarget) return;
    
    const targetAmountNum = parseInt(newGoal.targetAmount.replace(/\D/g, '')) / 100;
    const currentAmountNum = newGoal.currentAmount ? parseInt(newGoal.currentAmount.replace(/\D/g, '')) / 100 : 0;
    const monthlyTargetNum = parseInt(newGoal.monthlyTarget.replace(/\D/g, '')) / 100;
    
    setGoals(prev => [...prev, {
      id: Date.now(),
      name: newGoal.name,
      currentAmount: currentAmountNum,
      targetAmount: targetAmountNum,
      monthlyTarget: monthlyTargetNum,
      history: []
    }]);
    
    setNewGoal({ name: '', currentAmount: '', targetAmount: '', monthlyTarget: '' });
    setIsAddingGoal(false);
  };

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !editingGoal.name || !editingGoal.targetAmount || !editingGoal.monthlyTarget) return;

    const targetAmountNum = parseInt(editingGoal.targetAmount.replace(/\D/g, '')) / 100;
    const currentAmountNum = editingGoal.currentAmount ? parseInt(editingGoal.currentAmount.replace(/\D/g, '')) / 100 : 0;
    const monthlyTargetNum = parseInt(editingGoal.monthlyTarget.replace(/\D/g, '')) / 100;

    setGoals(prev => prev.map(g => g.id === editingGoal.id ? {
      ...g,
      name: editingGoal.name,
      currentAmount: currentAmountNum,
      targetAmount: targetAmountNum,
      monthlyTarget: monthlyTargetNum
    } : g));
    
    setEditingGoal(null);
  };

  const removeGoal = (id: number) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    setEditingGoal(null);
  };

  const handleGoalAmountChange = (value: string, field: 'currentAmount' | 'targetAmount' | 'monthlyTarget', isEditing = false) => {
    let numericValue = value.replace(/\D/g, '');
    if (numericValue === '') {
      if (isEditing) {
        setEditingGoal(prev => prev ? ({ ...prev, [field]: '' }) : null);
      } else {
        setNewGoal(prev => ({ ...prev, [field]: '' }));
      }
      return;
    }
    
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseInt(numericValue) / 100);
    
    if (isEditing) {
      setEditingGoal(prev => prev ? ({ ...prev, [field]: formatted }) : null);
    } else {
      setNewGoal(prev => ({ ...prev, [field]: formatted }));
    }
  };

  const handleReminderAmountChange = (value: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
    let numericValue = value.replace(/\D/g, '');
    if (numericValue === '') {
      setter((prev: any) => ({ ...prev, amount: '' }));
      return;
    }
    
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseInt(numericValue) / 100);
    
    setter((prev: any) => ({ ...prev, amount: formatted }));
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.name || !newReminder.amount || !newReminder.dueDate) return;

    const numericAmount = parseInt(newReminder.amount.replace(/\D/g, '')) / 100;
    const reminder = {
      id: Date.now(),
      name: newReminder.name,
      amount: numericAmount,
      dueDate: newReminder.dueDate
    };

    setReminders(prev => [...prev, reminder]);
    setNewReminder({ name: '', amount: '', dueDate: '' });
    setIsAddingReminder(false);

    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("Notificações ativadas para lembretes.");
        }
      });
    }
  };

  const removeReminder = (id: number) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    if (editingReminder?.id === id) setEditingReminder(null);
    setReminderToDelete(null);
  };

  const handleUpdateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReminder || !editingReminder.name || !editingReminder.amount || !editingReminder.dueDate) return;

    const numericAmount = parseInt(editingReminder.amount.replace(/\D/g, '')) / 100;
    setReminders(prev => prev.map(r => r.id === editingReminder.id ? {
      ...r,
      name: editingReminder.name,
      amount: numericAmount,
      dueDate: editingReminder.dueDate
    } : r));
    
    setEditingReminder(null);
  };

  const togglePushNotifications = async () => {
    if (!pushNotificationsEnabled) {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setPushNotificationsEnabled(true);
          new Notification("FinexyIA ✓", {
            body: "Alertas de vencimento ativados! Você receberá notificações 24h antes do vencimento das contas.",
            icon: "/favicon.ico",
            badge: "/favicon.ico"
          });
          console.log("✓ Alertas de vencimento ATIVADOS");
        } else {
          alert("❌ Permissão negada. Por favor, permita as notificações nas configurações do seu navegador para ativar os Alertas de Vencimento.");
        }
      } else {
        alert("⚠️ Seu navegador não suporta notificações push. Atualize seu navegador para usar esta função.");
      }
    } else {
      setPushNotificationsEnabled(false);
      console.log("✗ Alertas de vencimento DESATIVADOS");
    }
  };

  // Logic to check for upcoming bills and expired reminders
  useEffect(() => {
    if (reminders.length === 0) return;

    const notifiedToday = new Set<string>();

    const checkBills = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayStr = today.toISOString().split('T')[0];

      reminders.forEach(reminder => {
        const [year, month, day] = reminder.dueDate.split('-').map(Number);
        const due = new Date(year, month - 1, day);
        
        const diffTime = due.getTime() - today.getTime();
        const diffHours = diffTime / (1000 * 60 * 60);
        const diffDays = Math.round(diffHours / 24);

        const reminderKey = `${reminder.id}-${todayStr}`;
        if (notifiedToday.has(reminderKey)) return;

        // Check for expired reminders (today or past)
        if (today >= due) {
          const message = `Sua conta "${reminder.name}" de ${formatCurrency(reminder.amount)} venceu ou vence hoje (${reminder.dueDate})!`;
          
          if (pushNotificationsEnabled && "Notification" in window && Notification.permission === "granted") {
            new Notification("Lembrete de Conta Expirado", {
              body: message,
              icon: "/favicon.ico"
            });
            notifiedToday.add(reminderKey);
          } else {
            console.warn(`[Lembrete Expirado] ${message}`);
            notifiedToday.add(reminderKey);
          }
        } 
        // Notifica quando faltam 24h ou menos até o vencimento
        else if (diffHours > 0 && diffHours <= 24) {
          const hoursLeft = Math.floor(diffHours);
          let timeText = '';
          
          if (diffHours > 1) {
            timeText = `em ${hoursLeft} hora${hoursLeft > 1 ? 's' : ''}`;
          } else {
            timeText = 'em menos de 1 hora';
          }
          
          if (pushNotificationsEnabled && "Notification" in window && Notification.permission === "granted") {
            new Notification("Alerta de Vencimento - Próximas 24h", {
              body: `Sua conta "${reminder.name}" (${formatCurrency(reminder.amount)}) vence ${timeText}!`,
              icon: "/favicon.ico",
              tag: `bill-alert-${reminder.id}`,
              requireInteraction: true
            });
            notifiedToday.add(reminderKey);
          }
        }
      });
    };

    // Check once on mount/change
    checkBills();
    
    // Check every hour
    const interval = setInterval(checkBills, 3600000);
    return () => clearInterval(interval);
  }, [pushNotificationsEnabled, reminders]);

  const renewalDate = "17 de Abr, 2026";

  const subscriptionHistory = [
    { date: '17/03/2026', plan: 'Premium', credits: 25, expiry: '17/04/2026' },
    { date: '17/02/2026', plan: 'Premium', credits: 'Bônus', expiry: '17/03/2026' },
    { date: '17/01/2026', plan: 'Básico', credits: 10, expiry: '17/02/2026' },
  ];

  return (
    <div className="min-h-screen pb-32 bg-surface">
      <TopAppBar />
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8 sm:space-y-10">
        {/* Profile Header */}
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-primary/10 overflow-hidden relative shadow-xl">
              <Image 
                src={profilePic || `https://picsum.photos/seed/${user.name}/200/200`} 
                alt={user.name} 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 sm:p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfilePic(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
          
          <div className="space-y-2 sm:space-y-3 w-full px-4">
            {isEditingName ? (
              <div className="flex items-center justify-center gap-2">
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-surface-container-high border-none rounded-xl px-3 py-1.5 text-center font-headline text-xl sm:text-2xl font-bold focus:ring-2 focus:ring-primary outline-none w-full max-w-[240px]"
                  autoFocus
                />
                <button onClick={handleSaveName} className="p-2 bg-tertiary text-white rounded-xl shadow-sm"><Check className="w-4 h-4" /></button>
                <button onClick={() => setIsEditingName(false)} className="p-2 bg-error text-white rounded-xl shadow-sm"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <h2 
                onClick={() => setIsEditingName(true)}
                className="font-headline text-2xl sm:text-3xl font-bold text-on-background cursor-pointer hover:text-primary transition-colors"
              >
                {user.name}
              </h2>
            )}
            
            <p className="text-secondary text-xs sm:text-sm font-medium opacity-80">{user.email}</p>
            
            <div className={cn(
              "inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-sm transition-all",
              user.plan === 'Premium' ? "bg-primary-container text-on-primary-container" : "bg-secondary-container text-on-secondary-container"
            )}>
              <Star className={cn("w-3.5 h-3.5", user.plan === 'Premium' && "fill-current")} />
              Plano {user.plan}
            </div>
          </div>
        </section>

        {/* Settings Groups */}
        <div className="space-y-6 px-2 sm:px-0">
          {/* Dados Pessoais & Plano */}
          <section className="bg-surface-container-low rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 space-y-6 shadow-md border border-outline-variant/10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-inner">
                <HandCoins className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-headline text-lg sm:text-xl font-bold text-center">Assinatura e Plano</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* Plano Básico */}
              <div 
                onClick={() => setUser(prev => ({ ...prev, plan: 'Básico' }))}
                className={cn(
                  "relative py-6 sm:py-8 px-5 rounded-2xl border-2 transition-all cursor-pointer",
                  user.plan === 'Básico' 
                    ? "border-tertiary bg-tertiary/5 shadow-md" 
                    : "border-primary/20 bg-surface-container-lowest hover:border-primary/50"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-base sm:text-lg">Básico</h4>
                    <p className="text-[10px] sm:text-xs text-secondary font-medium">10 Créditos inclusos</p>
                  </div>
                  {user.plan === 'Básico' && (
                    <div className="bg-tertiary text-on-tertiary p-1 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  {['Dashboard', 'Transações', 'Análise Financeira', 'Gastos por Categoria'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[10px] sm:text-[11px] font-medium text-on-surface">
                      <Check className="w-3 h-3 text-tertiary" /> {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe('Básico');
                  }}
                  className={cn(
                    "w-full py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all",
                    user.plan === 'Básico' 
                      ? "bg-tertiary text-on-tertiary shadow-tertiary/20" 
                      : "bg-transparent border-2 border-primary text-primary shadow-primary/10"
                  )}
                >
                  ASSINAR
                </button>
              </div>

              {/* Plano Premium */}
              <div 
                onClick={() => setUser(prev => ({ ...prev, plan: 'Premium' }))}
                className={cn(
                  "relative py-6 sm:py-8 px-5 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden",
                  user.plan === 'Premium' 
                    ? "border-tertiary bg-tertiary/5 shadow-lg" 
                    : "border-primary/20 bg-surface-container-lowest hover:border-primary/50"
                )}
              >
                <div className="absolute top-0 right-0 bg-primary text-on-primary text-[7px] sm:text-[8px] font-black px-2 sm:px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                  Mais Completo
                </div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-base sm:text-lg flex items-center gap-2">
                      Premium <Star className="w-4 h-4 fill-primary text-primary" />
                    </h4>
                    <p className="text-[10px] sm:text-xs text-secondary font-medium">25 Créditos inclusos</p>
                  </div>
                  {user.plan === 'Premium' && (
                    <div className="bg-tertiary text-on-tertiary p-1 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold text-tertiary">
                    <Star className="w-3 h-3 fill-current" /> Tudo do Básico
                  </li>
                  {['Assistente FinexyIA', 'QRCode Nota Fiscal', 'Receita por Pix', 'Insights de IA', 'Planejamento de Metas', 'Lembretes de Pagamento'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[10px] sm:text-[11px] font-medium text-on-surface">
                      <Check className="w-3 h-3 text-tertiary" /> {item}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe('Premium');
                  }}
                  className={cn(
                    "w-full py-3 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all",
                    user.plan === 'Premium' 
                      ? "bg-tertiary text-on-tertiary shadow-tertiary/20" 
                      : "bg-transparent border-2 border-primary text-primary shadow-primary/10"
                  )}
                >
                  ASSINAR
                </button>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-surface-container-highest/20 p-3 rounded-2xl border border-outline-variant/10 space-y-2">
                <p className="text-[11px] text-center text-secondary font-bold flex items-center justify-center gap-2">
                  🪙 10 créditos custa {formatCurrency(29.90)}
                </p>
                <p className="text-[11px] text-center text-secondary font-bold flex items-center justify-center gap-2">
                  💎 25 créditos custa {formatCurrency(54.90)}
                </p>
              </div>
            </div>

            <div className="space-y-1 pt-2 text-center">
              <p className="text-[10px] uppercase tracking-widest text-secondary font-black">Próxima Renovação</p>
              <p className="text-lg font-bold text-on-surface">{renewalDate}</p>
            </div>

            <div className="pt-4 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-secondary text-center">Histórico de Assinaturas</h4>
              <div className="overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-lowest/30">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high/50">
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-secondary">Data</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-secondary">Plano</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-secondary text-center">Créd.</th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-secondary text-right">Expiração</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {subscriptionHistory.map((item, index) => (
                      <tr key={index} className="hover:bg-surface-container-high/20 transition-colors">
                        <td className="px-4 py-3 text-[11px] font-medium text-on-surface">{item.date}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter",
                            item.plan === 'Premium' ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                          )}>
                            {item.plan}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] font-bold text-on-surface text-center">{item.credits}</td>
                        <td className="px-4 py-3 text-[11px] font-medium text-secondary text-right">{item.expiry}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Método de Pagamento */}
          <section className="bg-surface-container-low rounded-3xl p-6 space-y-6 shadow-md border border-outline-variant/10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-inner">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-xl font-bold text-center">Método de Pagamento</h3>
            </div>
            
            <div className="space-y-4">
              {cards.map((card, index) => (
                <div 
                  key={index} 
                  onClick={() => {
                    setSelectedCard({ ...card, index });
                    setIsCardModalOpen(true);
                  }}
                  className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/5 flex items-center gap-4 cursor-pointer hover:bg-surface-container transition-all"
                >
                  <CreditCard className="w-6 h-6 text-primary" />
                  <div className="flex-1">
                    <p className="font-bold text-on-surface text-sm">{card.name}</p>
                    <p className="text-xs text-secondary font-medium">**** **** **** {card.number.slice(-4)}</p>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setIsAddCardModalOpen(true)}
                className="w-full bg-surface-container-highest text-on-surface py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Plus className="w-5 h-5" />
                Cadastrar um cartão
              </button>
            </div>
          </section>

          <AddCardModal 
            isOpen={isAddCardModalOpen} 
            onClose={() => setIsAddCardModalOpen(false)} 
            onAdd={(card) => setCards([...cards, card])}
          />
          
          {selectedCard && (
            <CardModal 
              isOpen={isCardModalOpen}
              onClose={() => setIsCardModalOpen(false)}
              card={selectedCard}
              onDelete={() => {
                setCards(cards.filter((_, i) => i !== selectedCard.index));
                setIsCardModalOpen(false);
              }}
              canDelete={cards.length > 1}
            />
          )}

          <AnimatePresence>
            {!user.autoRenewal && (
              <motion.div 
                initial={{ height: 0, opacity: 0, scale: 0.95 }}
                animate={{ height: 'auto', opacity: 1, scale: 1 }}
                exit={{ height: 0, opacity: 0, scale: 0.95 }}
                className="bg-error/5 border border-error/20 p-4 rounded-2xl flex items-start gap-3 overflow-hidden shadow-sm"
              >
                <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <p className="text-xs text-error font-medium leading-relaxed">
                  Desabilitar a função de atualização automática você pode perder alguns benefícios e inclusive seu plano pode vencer.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Programa de Recompensas */}
          <Link href="/recompensas" className="block">
            <motion.section 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-surface-container-low rounded-3xl p-6 flex flex-col items-center justify-center gap-4 shadow-sm border border-outline-variant/10 cursor-pointer group relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                <Gift className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-headline text-xl font-bold">Programa de Recompensas</h3>
                <p className="text-xs text-secondary font-medium">Ganhe créditos e desbloqueie o Premium</p>
              </div>
              <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors absolute right-6" />
            </motion.section>
          </Link>

          {/* Metas */}
          <section className="bg-surface-container-low rounded-3xl p-6 space-y-6 shadow-sm border border-outline-variant/10 relative">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-inner">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-xl font-bold text-center">Minhas Metas</h3>
              <button 
                onClick={() => setIsAddingGoal(true)}
                className="absolute top-4 right-6 p-2 bg-secondary text-on-secondary rounded-xl hover:scale-105 transition-transform shadow-md"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {goals.length === 0 ? (
                <p className="text-center text-secondary text-xs py-4">Nenhuma meta configurada.</p>
              ) : (
                goals.map((goal) => {
                  const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                  return (
                    <div 
                      key={goal.id} 
                      onClick={() => setEditingGoal({
                        id: goal.id,
                        name: goal.name,
                        currentAmount: formatAmount(goal.currentAmount),
                        targetAmount: formatAmount(goal.targetAmount),
                        monthlyTarget: formatAmount(goal.monthlyTarget)
                      })}
                      className="relative bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/5 flex flex-col gap-3 group hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-on-surface text-sm">{goal.name}</p>
                        <p className="text-[10px] text-secondary font-medium">
                          Faltam <span className="text-on-surface-variant font-bold">
                            {formatCurrency(goal.targetAmount - goal.currentAmount)}
                          </span> para atingir sua meta!
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-on-surface">
                          <span>{formatCurrency(goal.currentAmount)}</span>
                          <span>{formatCurrency(goal.targetAmount)}</span>
                        </div>
                        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                          <div className="bg-secondary h-full" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>

                      {goal.history && goal.history.length > 0 ? (
                        <div className="mt-4 pt-4 border-t border-outline-variant/10">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-xs font-bold text-on-surface-variant">Progresso Mensal</p>
                            <p className="text-[10px] text-secondary font-medium">
                              Alvo: <span className="font-bold">{formatCurrency(goal.monthlyTarget)}</span>/mês
                            </p>
                          </div>
                          <div className="h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={goal.history} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <XAxis 
                                  dataKey="month" 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.6 }} 
                                  dy={10}
                                />
                                <YAxis 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.6 }}
                                  tickFormatter={(value) => `R$${value}`}
                                  domain={[0, (dataMax: number) => Math.max(dataMax, goal.monthlyTarget) * 1.2]}
                                />
                                <ReferenceLine 
                                  y={goal.monthlyTarget} 
                                  stroke="#FF5252" 
                                  strokeDasharray="3 3" 
                                  label={{ 
                                    position: 'top', 
                                    value: `Alvo: ${formatCurrency(goal.monthlyTarget)}`, 
                                    fill: '#FF5252', 
                                    fontSize: 8,
                                    fontWeight: 'bold'
                                  }} 
                                />
                                <Tooltip 
                                  cursor={{ fill: 'transparent' }}
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      const isTargetMet = data.saved >= goal.monthlyTarget;
                                      return (
                                        <div className="bg-surface-container-highest p-2 rounded-lg shadow-lg border border-outline-variant/10 text-xs">
                                          <p className="font-bold mb-1">{data.month}</p>
                                          <p className="text-on-surface">Economizado: <span className="font-bold">{formatCurrency(data.saved)}</span></p>
                                          <p className={cn("font-medium", isTargetMet ? "text-primary" : "text-error")}>
                                            {isTargetMet ? 'Alvo atingido!' : `Faltou ${formatCurrency(goal.monthlyTarget - data.saved)}`}
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Bar dataKey="saved" radius={[4, 4, 0, 0]}>
                                  {goal.history.map((entry, index) => {
                                    const isTargetMet = entry.saved >= goal.monthlyTarget;
                                    const isCurrentMonth = index === goal.history.length - 1;
                                    
                                    // Base color
                                    let fill = isTargetMet ? '#4CAF50' : '#FF9800';
                                    
                                    return <Cell key={`cell-${index}`} fill={fill} fillOpacity={isCurrentMonth ? 1 : 0.6} />;
                                  })}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          
                          {/* Comparação com o mês anterior */}
                          {goal.history.length >= 2 && (
                            <div className="mt-3 flex items-center justify-between text-[10px]">
                              <span className="text-secondary">vs. mês anterior:</span>
                              {(() => {
                                const current = goal.history[goal.history.length - 1].saved;
                                const previous = goal.history[goal.history.length - 2].saved;
                                const diff = current - previous;
                                const isPositive = diff >= 0;
                                
                                return (
                                  <span className={cn("font-bold flex items-center gap-1", isPositive ? "text-primary" : "text-error")}>
                                    {isPositive ? '+' : ''}{formatCurrency(diff)}
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-4 pt-4 border-t border-outline-variant/10">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-xs font-bold text-on-surface-variant">Progresso Mensal</p>
                            <p className="text-[10px] text-secondary font-medium">
                              Alvo: <span className="font-bold">{formatCurrency(goal.monthlyTarget)}</span>/mês
                            </p>
                          </div>
                          <div className="h-32 w-full flex items-center justify-center bg-surface-container-high/50 rounded-xl border border-dashed border-outline-variant/20">
                            <p className="text-xs text-secondary text-center px-4">
                              Nenhum histórico de economia ainda.<br/>Comece a economizar este mês!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Lembretes de Contas */}
          <section className="bg-surface-container-low rounded-3xl p-6 space-y-6 shadow-md border border-outline-variant/10 relative">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-inner">
                <CalendarClock className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-xl font-bold text-center">Lembretes de Contas</h3>
              <button 
                onClick={() => setIsAddingReminder(true)}
                className="absolute top-4 right-6 p-2 bg-primary text-on-primary rounded-xl hover:scale-105 transition-transform shadow-md"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {reminders.length === 0 ? (
                <p className="text-center text-secondary text-xs py-4">Nenhum lembrete configurado.</p>
              ) : (
                reminders.map((reminder) => (
                  <div 
                    key={reminder.id} 
                    onClick={() => setEditingReminder({
                      id: reminder.id,
                      name: reminder.name,
                      amount: formatAmount(reminder.amount),
                      dueDate: reminder.dueDate
                    })}
                    className="relative bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/5 flex items-center justify-between gap-4 group hover:shadow-md transition-all cursor-pointer"
                  >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <p className="font-bold text-on-surface text-sm sm:text-base truncate">{reminder.name}</p>
                          <p className="text-[10px] sm:text-xs text-secondary font-medium whitespace-nowrap">
                            Vence em <span className="text-on-surface-variant font-bold">
                              {new Date(reminder.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                            </span>
                          </p>
                        </div>
                      </div>
                    <div className="text-right shrink-0">
                      <span className="block font-black text-sm sm:text-base text-primary">
                        {formatCurrency(reminder.amount)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>


          {/* Notificações */}
          <section className="bg-surface-container-low rounded-3xl p-6 space-y-6 shadow-md border border-outline-variant/10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-inner">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-xl font-bold text-center">Preferências</h3>
            </div>
            
            <div className="space-y-6">
              <div className={cn(
                "flex items-center justify-between p-4 rounded-2xl transition-all",
                pushNotificationsEnabled 
                  ? "bg-primary/10 border border-primary/20" 
                  : "bg-surface-container-highest border border-outline-variant/10"
              )}>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-on-surface">Alertas de Vencimento</p>
                    {pushNotificationsEnabled && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/20 rounded-full">
                        <Check className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-bold text-primary">Ativado</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-secondary font-medium">
                    {pushNotificationsEnabled 
                      ? "Você receberá notificações 24h antes do vencimento"
                      : "Notificar 24h antes do vencimento de contas"
                    }
                  </p>
                </div>
                <button 
                  onClick={togglePushNotifications}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0",
                    pushNotificationsEnabled ? "bg-primary" : "bg-surface-container-highest"
                  )}
                >
                  <motion.div 
                    animate={{ x: pushNotificationsEnabled ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>

              <div className="h-px bg-outline-variant/10" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-bold text-on-surface">Alertas de Gastos</p>
                  <p className="text-xs text-secondary font-medium">Aviso quando exceder 80% do teto</p>
                </div>
                <button 
                  onClick={() => toggleNotification('spendingAlerts')}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    user.notifications.spendingAlerts ? "bg-primary" : "bg-surface-container-highest"
                  )}
                >
                  <motion.div 
                    animate={{ x: user.notifications.spendingAlerts ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-bold text-on-surface">Relatórios Mensais</p>
                  <p className="text-xs text-secondary font-medium">Resumo financeiro por e-mail</p>
                </div>
                <button 
                  onClick={() => toggleNotification('monthlyReports')}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    user.notifications.monthlyReports ? "bg-primary" : "bg-surface-container-highest"
                  )}
                >
                  <motion.div 
                    animate={{ x: user.notifications.monthlyReports ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Segurança */}
          <section className="bg-surface-container-low rounded-3xl p-6 space-y-6 shadow-md border border-outline-variant/10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-error-container flex items-center justify-center text-error shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-headline text-xl font-bold text-center">Segurança</h3>
            </div>
            <p className="text-xs text-secondary font-medium leading-relaxed">
              Para sua proteção, a troca de senha exige verificação em duas etapas via e-mail cadastrado.
            </p>
            <button className="w-full bg-surface-container-highest text-on-surface py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-error/10 hover:text-error transition-all">
              Redefinição de Senha
            </button>
          </section>

          <button 
            onClick={handleLogout}
            className="w-full py-5 text-error font-black text-lg hover:bg-error/5 rounded-3xl transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </button>
        </div>
      </main>     

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal.show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal({ show: false, plan: '' })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface-container-low w-full max-w-sm max-h-[90vh] rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-10 text-center space-y-6 shadow-2xl border border-outline-variant/20 overflow-y-auto scrollbar-hide"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 text-primary fill-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-xl sm:text-2xl font-black text-on-surface">Parabéns! 🎉</h3>
                <p className="text-secondary text-xs sm:text-sm font-medium leading-relaxed">
                  Sua assinatura <span className="text-primary font-bold">{showSuccessModal.plan}</span> foi realizada com sucesso. Aproveite!
                </p>
              </div>
              <button 
                onClick={() => setShowSuccessModal({ show: false, plan: '' })}
                className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs sm:text-sm"
              >
                VAMOS LÁ!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {isAddingGoal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingGoal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface-container-low w-full max-w-sm max-h-[90vh] rounded-[40px] p-8 space-y-6 shadow-2xl border border-outline-variant/20 overflow-y-auto scrollbar-hide"
            >
              <div className="flex justify-center items-center relative">
                <h3 className="font-headline text-xl font-black text-on-surface text-center">Nova Meta</h3>
                <button onClick={() => setIsAddingGoal(false)} className="absolute right-0 p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Nome da Meta</label>
                  <input 
                    type="text" 
                    required
                    value={newGoal.name}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Viagem de Férias"
                    className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1 whitespace-nowrap">Valor Atual</label>
                    <input 
                      type="text" 
                      value={newGoal.currentAmount}
                      onChange={(e) => handleGoalAmountChange(e.target.value, 'currentAmount')}
                      placeholder="R$ 0,00"
                      className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1 whitespace-nowrap">Meta</label>
                    <input 
                      type="text" 
                      required
                      value={newGoal.targetAmount}
                      onChange={(e) => handleGoalAmountChange(e.target.value, 'targetAmount')}
                      placeholder="R$ 0,00"
                      className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Alvo Mensal</label>
                  <input 
                    type="text" 
                    required
                    value={newGoal.monthlyTarget}
                    onChange={(e) => handleGoalAmountChange(e.target.value, 'monthlyTarget')}
                    placeholder="Ex: R$ 500,00"
                    className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-secondary text-on-secondary py-4 rounded-2xl font-black shadow-lg shadow-secondary/20 active:scale-95 transition-all text-xs sm:text-sm"
                >
                  SALVAR META
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Goal Modal */}
      <AnimatePresence>
        {editingGoal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingGoal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface-container-low w-full max-w-sm max-h-[90vh] rounded-[40px] p-8 space-y-6 shadow-2xl border border-outline-variant/20 overflow-y-auto scrollbar-hide"
            >
              <div className="flex justify-center items-center relative">
                <h3 className="font-headline text-xl font-black text-on-surface text-center">Editar Meta</h3>
                <button onClick={() => setEditingGoal(null)} className="absolute right-0 p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateGoal} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Nome da Meta</label>
                  <input 
                    type="text" 
                    required
                    value={editingGoal.name}
                    onChange={(e) => setEditingGoal(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    placeholder="Ex: Viagem de Férias"
                    className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1 whitespace-nowrap">Valor Atual</label>
                    <input 
                      type="text" 
                      value={editingGoal.currentAmount}
                      onChange={(e) => handleGoalAmountChange(e.target.value, 'currentAmount', true)}
                      placeholder="R$ 0,00"
                      className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1 whitespace-nowrap">Meta</label>
                    <input 
                      type="text" 
                      required
                      value={editingGoal.targetAmount}
                      onChange={(e) => handleGoalAmountChange(e.target.value, 'targetAmount', true)}
                      placeholder="R$ 0,00"
                      className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Alvo Mensal</label>
                  <input 
                    type="text" 
                    required
                    value={editingGoal.monthlyTarget}
                    onChange={(e) => handleGoalAmountChange(e.target.value, 'monthlyTarget', true)}
                    placeholder="Ex: R$ 500,00"
                    className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-secondary outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => removeGoal(editingGoal.id)}
                    className="w-14 h-14 bg-error/10 text-error flex items-center justify-center rounded-2xl hover:bg-error/20 transition-colors active:scale-95"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-secondary text-on-secondary py-4 rounded-2xl font-black shadow-lg shadow-secondary/20 active:scale-95 transition-all text-xs sm:text-sm"
                  >
                    SALVAR ALTERAÇÕES
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {isAddingReminder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingReminder(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface-container-low w-full max-w-sm max-h-[90vh] rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-8 space-y-6 shadow-2xl border border-outline-variant/20 overflow-y-auto scrollbar-hide"
            >
              <div className="flex justify-center items-center relative">
                <h3 className="font-headline text-lg sm:text-xl font-black text-on-surface text-center">Novo Lembrete</h3>
                <button onClick={() => setIsAddingReminder(false)} className="absolute right-0 p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddReminder} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Nome da Conta</label>
                  <input 
                    type="text" 
                    required
                    value={newReminder.name}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Aluguel"
                    className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Valor</label>
                    <input 
                      type="text" 
                      required
                      value={newReminder.amount}
                      onChange={(e) => handleReminderAmountChange(e.target.value, setNewReminder)}
                      placeholder="R$ 0,00"
                      className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Vencimento</label>
                    <input 
                      type="date" 
                      required
                      value={newReminder.dueDate}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs sm:text-sm"
                >
                  SALVAR LEMBRETE
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Edit Reminder Modal */}
      <AnimatePresence>
        {editingReminder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingReminder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface-container-low w-full max-w-sm max-h-[90vh] rounded-[40px] p-8 space-y-6 shadow-2xl border border-outline-variant/20 overflow-y-auto scrollbar-hide"
            >
              <div className="flex justify-center items-center relative">
                <h3 className="font-headline text-xl font-black text-on-surface text-center">Editar Lembrete</h3>
                <button onClick={() => setEditingReminder(null)} className="absolute right-0 p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateReminder} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Nome da Conta</label>
                  <input 
                    type="text" 
                    required
                    value={editingReminder.name}
                    onChange={(e) => setEditingReminder(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    placeholder="Ex: Aluguel"
                    className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Valor</label>
                    <input 
                      type="text" 
                      required
                      value={editingReminder.amount}
                      onChange={(e) => handleReminderAmountChange(e.target.value, setEditingReminder)}
                      placeholder="R$ 0,00"
                      className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Vencimento</label>
                    <input 
                      type="date" 
                      required
                      value={editingReminder.dueDate}
                      onChange={(e) => setEditingReminder(prev => prev ? ({ ...prev, dueDate: e.target.value }) : null)}
                      className="w-full bg-surface-container-high border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => removeReminder(editingReminder.id)}
                    className="w-14 h-14 bg-error/10 text-error flex items-center justify-center rounded-2xl hover:bg-error/20 transition-colors active:scale-95"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-black shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    SALVAR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {reminderToDelete !== null && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReminderToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-surface-container-low w-full max-w-xs rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl border border-outline-variant/20"
            >
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-error" />
              </div>
              <div className="space-y-2">
                <h3 className="font-headline text-xl font-black text-on-surface">Excluir Lembrete?</h3>
                <p className="text-secondary text-xs font-medium leading-relaxed">
                  Tem certeza que deseja remover este lembrete? Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => removeReminder(reminderToDelete)}
                  className="w-full bg-error text-white py-4 rounded-2xl font-black shadow-lg shadow-error/20 active:scale-95 transition-all text-xs"
                >
                  SIM, EXCLUIR
                </button>
                <button 
                  onClick={() => setReminderToDelete(null)}
                  className="w-full bg-surface-container-high text-on-surface py-4 rounded-2xl font-black active:scale-95 transition-all text-xs"
                >
                  CANCELAR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
