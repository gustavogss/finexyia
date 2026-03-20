'use client';

import React from 'react';
import { TopAppBar} from '@/components/top-bar';
import { 
  FileText as EditNote, 
  LayoutGrid as Category, 
  Calendar as CalendarToday, 
  ScanQrCode as QrCodeScanner, 
  QrCode, 
  Wallet as AccountBalanceWallet,
  ArrowRight as ArrowForward,
  CheckCircle2,
  Trash2,
  Plus  
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '@/hooks/use-notifications';
import { cn, formatCurrency, formatAmount, formatPixKey } from '@/lib/utils';
import { PixModal } from '@/components/pix-modal';
import { QrScannerModal } from '@/components/qr-scanner-modal';
import { AddBudgetModal } from '@/components/add-budget-modal';

import { useTransactions } from '@/lib/transactions-context';
import { getCategoryIcon, getCategoryColor } from '@/lib/categories';
import { BottomNavBar } from '@/components/bottom-bar';

export default function TransactionsPage() {
  const { addTransaction, transactions, deleteTransaction, updateTransaction, balance, budgets, addBudget, deleteBudget, updateBudget } = useTransactions();
  const now = new Date();
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const [activeTab, setActiveTab] = React.useState<'expense' | 'income'>('expense');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isAddingBudget, setIsAddingBudget] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState<any | null>(null);
  
  const initialFormState = {
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    pixKey: ''
  };

  const [forms, setForms] = React.useState({
    expense: { ...initialFormState },
    income: { ...initialFormState }
  });

  const currentForm = forms[activeTab];

  const updateForm = (updates: Partial<typeof initialFormState>) => {
    setForms(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], ...updates }
    }));
  };
  
  const [isPixModalOpen, setIsPixModalOpen] = React.useState(false);
  const [isScannerOpen, setIsScannerOpen] = React.useState(false);
  
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [lastTransaction, setLastTransaction] = React.useState<{ amount: string, description: string } | null>(null);
  
  const { notify } = useNotifications();

  React.useEffect(() => {
    budgets.forEach(budget => {
      const spent = currentMonthTransactions
        .filter(t => t.category === budget.category && t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
      
      if (spent >= budget.amount) {
        notify('Limite de Orçamento Atingido', { 
          body: `Você atingiu o limite do orçamento para a categoria "${budget.category}".`,
          type: 'error'
        });
      }
    });
  }, [currentMonthTransactions, budgets, notify]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      updateForm({ amount: '' });
      return;
    }
    
    // Convert to number and format
    const numericValue = parseInt(value) / 100;
    updateForm({ amount: formatAmount(numericValue) });
  };

  const handleDeleteTransaction = () => {
    if (editingId) {
      deleteTransaction(editingId);
      setEditingId(null);
      updateForm({ ...initialFormState });
      notify('Transação Excluída', { 
        body: 'A transação foi removida com sucesso.',
        type: 'success'
      });
    }
  };

  const handleSave = () => {
    const { amount, description, category, date } = currentForm;
    if (!amount || !description) {
      notify('Erro no Formulário', { 
        body: 'Por favor, preencha o valor e a descrição.',
        type: 'error'
      });
      return;
    }

    // Parse amount correctly (handle currency formatting)
    const numericAmount = parseInt(amount.replace(/\D/g, '')) / 100;
    if (isNaN(numericAmount)) {
      notify('Erro no Valor', { 
        body: 'Por favor, insira um valor numérico válido.',
        type: 'error'
      });
      return;
    }

    if (editingId) {
      updateTransaction(editingId, {
        amount: numericAmount,
        description,
        category: category || 'Outros',
        date: new Date(date).toISOString(),
        type: activeTab
      });
      notify('Transação Atualizada', { 
        body: `Sua transação foi atualizada com sucesso.`,
        type: 'success'
      });
      setEditingId(null);
    } else {
      addTransaction({
        amount: numericAmount,
        description,
        category: category || 'Outros',
        date: new Date(date).toISOString(),
        type: activeTab
      });

      const typeLabel = activeTab === 'expense' ? 'Despesa' : 'Receita';
      setLastTransaction({ amount, description });
      setIsSuccess(true);
      
      notify(`${typeLabel} Registrada`, { 
        body: `${typeLabel} de R$ ${amount} em "${description}" salva com sucesso.`,
        type: 'success'
      });
    }

    // Reset current form
    updateForm({ ...initialFormState });
  };

  const handleEdit = (transaction: any) => {
    setActiveTab(transaction.type);
    setEditingId(transaction.id);
    setForms(prev => ({
      ...prev,
      [transaction.type]: {
        amount: formatAmount(transaction.amount),
        description: transaction.description,
        category: transaction.category,
        date: transaction.date.split('T')[0],
        pixKey: ''
      }
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    notify('Transação Excluída', { 
      body: 'A transação foi removida permanentemente.',
      type: 'success'
    });
  };

  const handleScanResult = (data: { amount: string; description: string; category: string }) => {
    updateForm({
      amount: data.amount,
      description: data.description,
      category: data.category
    });
    notify('Nota Escaneada', { body: 'Dados da nota fiscal importados com sucesso.', type: 'success' });
  };

  const categories = {
    expense: ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Moradia', 'Educação', 'Outros'],
    income: ['Salário', 'Freelance', 'Investimentos', 'Presente', 'Venda', 'Outros']
  };

  return (
    <div className="min-h-screen pb-24">
      <TopAppBar />
      <main className="max-w-xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8 sm:space-y-12">
        {/* Tab Selector */}
        <section className="flex flex-col space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2 text-center">
            <h2 className="font-headline text-2xl sm:text-4xl font-semibold tracking-tight">Transações</h2>
            <p className="text-on-secondary-fixed-variant opacity-70 font-medium text-xs sm:text-base">Gestão de fluxo de caixa</p>
          </div>

          <div className="flex p-1 bg-surface-container-low rounded-2xl relative">
            <button 
              onClick={() => setActiveTab('expense')}
              className={cn(
                "flex-1 py-3 sm:py-4 text-center font-headline font-medium text-base sm:text-lg rounded-xl transition-all duration-300 z-10",
                activeTab === 'expense' ? "bg-surface-container-lowest shadow-sm text-on-surface" : "text-on-secondary-fixed-variant opacity-60 hover:opacity-100"
              )}
            >
              Nova Despesa
            </button>
            <button 
              onClick={() => setActiveTab('income')}
              className={cn(
                "flex-1 py-3 sm:py-4 text-center font-headline font-medium text-base sm:text-lg rounded-xl transition-all duration-300 z-10",
                activeTab === 'income' ? "bg-surface-container-lowest shadow-sm text-on-surface" : "text-on-secondary-fixed-variant opacity-60 hover:opacity-100"
              )}
            >
              Nova Receita
            </button>
          </div>
        </section>

        {/* Transaction Form Canvas */}
        <section className="space-y-8 sm:space-y-10">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-surface-container-lowest rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-xl text-center space-y-6 sm:space-y-8 border border-tertiary/20"
              >
                <div className="flex justify-center">
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-tertiary/10 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-tertiary" />
                  </motion.div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-1 sm:space-y-2"
                >
                  <h3 className="font-headline text-xl sm:text-2xl font-bold">Transação Salva!</h3>
                  <p className="text-secondary text-sm sm:text-base">Sua {activeTab === 'expense' ? 'despesa' : 'receita'} foi registrada com sucesso.</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-surface-container-low p-4 sm:p-6 rounded-2xl space-y-3 sm:space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] sm:text-sm font-bold text-secondary uppercase tracking-widest">Valor</span>
                    <span className="font-black text-lg sm:text-xl">{formatCurrency(lastTransaction?.amount || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] sm:text-sm font-bold text-secondary uppercase tracking-widest">Descrição</span>
                    <span className="font-bold text-sm sm:text-base">{lastTransaction?.description}</span>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 gap-3 pt-2 sm:pt-4"
                >
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="w-full py-3 sm:py-4 bg-surface-container-high text-on-surface rounded-xl font-bold hover:bg-surface-container-highest transition-colors text-sm sm:text-base"
                  >
                    Nova Transação
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'expense' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === 'expense' ? 20 : -20 }}
                className="bg-surface-container-lowest rounded-[2rem] sm:rounded-xl p-6 sm:p-8 shadow-[0_12px_32px_rgba(25,28,29,0.04)] space-y-6 sm:space-y-8"
              >
              {/* Amount Display */}
              <div className="space-y-1 sm:space-y-2 text-center py-2 sm:py-4">
                <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
                  Valor da {activeTab === 'expense' ? 'Despesa' : 'Receita'}
                </label>
                <div className="flex items-center justify-center gap-2">
                  <span className={cn(
                    "text-xl sm:text-2xl font-headline font-light",
                    activeTab === 'expense' ? "text-error" : "text-tertiary"
                  )}>R$</span>
                  <input 
                    className="w-full max-w-[160px] sm:max-w-[200px] text-3xl sm:text-5xl font-headline font-bold text-on-background bg-transparent border-none focus:ring-0 text-center p-0" 
                    placeholder="0,00" 
                    type="text"
                    value={currentForm.amount}
                    onChange={handleAmountChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Description */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-semibold text-on-surface ml-1">Descrição</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-on-surface-variant opacity-50"><EditNote className="w-5 h-5" /></span>
                    <input 
                      className="w-full pl-12 pr-4 py-3 sm:py-4 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/40 text-on-background placeholder:opacity-40 text-sm sm:text-base" 
                      placeholder={activeTab === 'expense' ? "Ex: Supermercado Semanal" : "Ex: Salário Mensal"}
                      type="text"
                      value={currentForm.description}
                      onChange={(e) => updateForm({ description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Category & Date Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-on-surface ml-1">Categoria</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-on-surface-variant opacity-50"><Category className="w-5 h-5" /></span>
                      <select 
                        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/40 text-on-background appearance-none text-sm sm:text-base"
                        value={currentForm.category}
                        onChange={(e) => updateForm({ category: e.target.value })}
                      >
                        <option value="" disabled>Selecionar...</option>
                        {categories[activeTab].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <label className="block text-xs sm:text-sm font-semibold text-on-surface ml-1">Data</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-on-surface-variant opacity-50"><CalendarToday className="w-5 h-5" /></span>
                      <input 
                        className="w-full pl-12 pr-4 py-3 sm:py-4 bg-surface-container-high rounded-xl border-none focus:ring-2 focus:ring-primary/40 text-on-background text-sm sm:text-base" 
                        type="date"
                        value={currentForm.date}
                        onChange={(e) => updateForm({ date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

                {/* QR Code Assistant Section (Only for Expenses) */}
                {activeTab === 'expense' && (
                  <div className="pt-2 sm:pt-4">
                    <button 
                      onClick={() => setIsScannerOpen(true)}
                      className="w-full flex items-center justify-center gap-3 py-3 sm:py-4 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-container-low transition-colors group"
                    >
                      <QrCodeScanner className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-xs sm:text-sm">Ler nota fiscal (QR Code)</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Revenue Action - Pix Card (Only for Income) */}
          {activeTab === 'income' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="absolute -top-4 -right-2 w-24 h-24 bg-tertiary-fixed opacity-20 rounded-full blur-3xl"></div>
              <div className="bg-surface-container-low rounded-[2rem] sm:rounded-xl p-6 sm:p-8 space-y-4 sm:space-y-6 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-headline text-lg sm:text-xl font-bold text-on-tertiary-fixed-variant">Receber via Pix</h3>
                    <p className="text-xs sm:text-sm text-on-secondary-fixed-variant opacity-70">Gere uma chave única para esta transação</p>
                  </div>
                  <div className="bg-tertiary-fixed p-2 sm:p-3 rounded-full">
                    <AccountBalanceWallet className="w-5 h-5 sm:w-6 sm:h-6 text-on-tertiary-fixed-variant" />
                  </div>
                </div>
                <button 
                  onClick={() => setIsPixModalOpen(true)}
                  disabled={!currentForm.amount || !currentForm.description || !currentForm.category || !currentForm.date}
                  className={cn(
                    "w-full py-4 sm:py-5 bg-tertiary text-on-tertiary rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-tertiary/20 hover:scale-[1.02] transition-transform text-sm sm:text-base disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  )}
                >
                  <QrCode className="w-5 h-5" />
                  Gerar Chave Pix
                </button>
                
                {/* Pix Key Input - Only visible when form is valid */}
                {currentForm.amount && currentForm.description && currentForm.category && currentForm.date && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2"
                  >
                    <input 
                      type="text"
                      value={currentForm.pixKey}
                      onChange={(e) => updateForm({ pixKey: formatPixKey(e.target.value) })}
                      placeholder="CPF, CNPJ, Celular ou E-mail"
                      className="w-full px-4 py-3 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-tertiary/40 text-on-background placeholder:opacity-40 text-sm sm:text-base"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Primary Action Button */}
          {!isSuccess && (
            <div className="py-6 sm:py-10">
              <div className="flex gap-3 sm:gap-4">
                {editingId && (
                  <button 
                    onClick={handleDeleteTransaction}
                    className="p-4 sm:p-6 bg-error/10 text-error rounded-xl hover:bg-error/20 transition-colors shadow-lg shadow-error/10"
                    title="Excluir Transação"
                  >
                    <Trash2 className="w-6 h-6 sm:w-7 sm:h-7" />
                  </button>
                )}
                <button 
                  onClick={handleSave}
                  className={cn(
                    "flex-1 py-4 sm:py-6 text-on-primary rounded-xl font-headline text-lg sm:text-xl font-bold shadow-xl flex items-center justify-center gap-3 sm:gap-4 hover:opacity-90 transition-all active:scale-[0.98]",
                    activeTab === 'expense' ? "btn-gradient shadow-primary/30" : "bg-tertiary shadow-tertiary/30"
                  )}
                >
                  {editingId ? 'Atualizar' : 'Salvar'} {activeTab === 'expense' ? 'Despesa' : 'Receita'}
                  <ArrowForward className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              {editingId && (
                <button 
                  onClick={() => {
                    setEditingId(null);
                    updateForm({ ...initialFormState });
                  }}
                  className="w-full mt-4 py-3 text-secondary font-bold hover:text-on-surface transition-colors"
                >
                  Cancelar Edição
                </button>
              )}
            </div>
          )}

          {/* Budget Card */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-headline text-xl font-black text-on-background tracking-tight">Meus Orçamentos</h3>
              <button 
                onClick={() => setIsAddingBudget(true)}
                className="w-10 h-10 bg-primary text-on-primary rounded-2xl hover:scale-105 transition-transform shadow-md flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {budgets.length === 0 ? (
                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 text-center shadow-sm">
                  <p className="text-secondary text-sm font-medium">Nenhum orçamento configurado.</p>
                </div>
              ) : (
                budgets.map((budget) => {
                  const spent = currentMonthTransactions
                    .filter(t => t.category === budget.category && t.type === 'expense')
                    .reduce((acc, t) => acc + t.amount, 0);
                  const progress = Math.min(100, (spent / budget.amount) * 100);
                  const isOverBudget = spent > budget.amount;
                  const Icon = getCategoryIcon(budget.category);
                  const colors = getCategoryColor(budget.category);
                  
                  return (
                    <motion.div 
                      key={budget.id} 
                      whileHover={{ scale: 1.01 }}
                      className="flex flex-col p-6 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 hover:shadow-md transition-all cursor-default space-y-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", colors.bg, colors.text)}>
                            <Icon className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="font-bold text-base block text-on-surface">{budget.category}</span>
                            <span className="text-[10px] text-secondary font-black uppercase tracking-widest">Limite: {formatCurrency(budget.amount)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => deleteBudget(budget.id)} 
                            className="p-2 text-secondary hover:text-error transition-colors hover:bg-surface-container-high rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden p-0.5">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-500", isOverBudget ? "bg-error shadow-[0_0_8px_rgba(var(--error),0.4)]" : progress > 80 ? "bg-tertiary shadow-[0_0_8px_rgba(var(--tertiary),0.4)]" : "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]")} 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-secondary font-black uppercase tracking-widest">
                          <span>{formatCurrency(spent)} gastos</span>
                          <span>{Math.round(progress)}% usado</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </section>
          
          <AnimatePresence>
            {(isAddingBudget || !!editingBudget) && (
              <AddBudgetModal 
                key={editingBudget ? `edit-${editingBudget.id}` : 'new'}
                isOpen={true}
                onClose={() => {
                  setIsAddingBudget(false);
                  setEditingBudget(null);
                }}
                onAdd={addBudget}
                onEdit={(budget) => updateBudget(budget.id, budget)}
                onDelete={deleteBudget}
                budgetToEdit={editingBudget}
              />
            )}
          </AnimatePresence>

          {/* Transactions List Section */}
          <section className="space-y-6 pt-10 border-t border-outline-variant/20">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-headline text-xl font-black text-on-background tracking-tight">Histórico de Transações</h3>
              <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-surface-container-high px-3 py-1 rounded-full">Este Mês</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentMonthTransactions.length === 0 ? (
                <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 text-center shadow-sm">
                  <p className="text-secondary text-sm font-medium">Nenhuma transação neste mês.</p>
                </div>
              ) : (
                currentMonthTransactions.map((item) => {
                  const Icon = getCategoryIcon(item.category);
                  const colors = getCategoryColor(item.category);
                  return (
                    <motion.div 
                      key={item.id} 
                      layout
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-5 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 hover:shadow-md transition-all cursor-default shadow-sm group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", colors.bg, colors.text)}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{item.description}</p>
                          <p className="text-[10px] text-secondary font-black uppercase tracking-widest">
                            {new Date(item.date).toLocaleDateString('pt-BR')} • {item.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={cn(
                            "font-headline text-base font-black tracking-tight", 
                            (item.type === 'expense' || item.amount === 0) ? "text-error" : "text-tertiary"
                          )}>
                            {item.type === 'expense' ? '-' : '+'} {formatCurrency(item.amount)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-secondary hover:text-error transition-colors hover:bg-surface-container-high rounded-full"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </section>
        </section>

        <PixModal 
          isOpen={isPixModalOpen} 
          onClose={() => setIsPixModalOpen(false)} 
          amount={currentForm.amount}
          description={currentForm.description}
          pixKey={currentForm.pixKey}
        />

        <QrScannerModal 
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScan={handleScanResult}
        />

      </main>     
      <BottomNavBar />
    </div>
  );
}
