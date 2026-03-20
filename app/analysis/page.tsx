'use client';

import React from 'react';
import { TopAppBar } from '@/components/navigation';
import { cn, formatCurrency } from '@/lib/utils';
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle as Warning, 
  Activity,
  Utensils,
  Car,
  Home,
  BrainCircuit,
  ChevronRight,
  ShoppingBag,
  Heart,
  Briefcase,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { useTransactions } from '@/lib/transactions-context';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { GoogleGenAI, Type } from "@google/genai";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Alimentação': return Utensils;
    case 'Transporte': return Car;
    case 'Moradia': return Home;
    case 'Saúde': return Heart;
    case 'Educação': return Briefcase;
    case 'Lazer': return ShoppingBag;
    default: return Layers;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Alimentação': return { bg: 'bg-primary-fixed', text: 'text-primary', hex: '#964900' };
    case 'Transporte': return { bg: 'bg-secondary-fixed', text: 'text-secondary', hex: '#525f71' };
    case 'Moradia': return { bg: 'bg-tertiary-fixed', text: 'text-tertiary', hex: '#1b6d24' };
    case 'Saúde': return { bg: 'bg-error-container', text: 'text-error', hex: '#ba1a1a' };
    case 'Lazer': return { bg: 'bg-primary-container', text: 'text-primary', hex: '#f57c00' };
    case 'Educação': return { bg: 'bg-secondary-container', text: 'text-secondary', hex: '#d3e1f6' };
    default: return { bg: 'bg-surface-container-highest', text: 'text-on-surface', hex: '#d9dadb' };
  }
};

export default function AnalysisPage() {
  const { transactions } = useTransactions();
  const [selectedPeriod, setSelectedPeriod] = React.useState<'current' | 'last' | 'quarter'>('current');
  const [aiInsight, setAiInsight] = React.useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);
  const [investmentInsight, setInvestmentInsight] = React.useState<{
    title: string;
    rate: string;
    description: string;
    projectedAmount: number;
  } | null>(null);
  const [isLoadingInvestment, setIsLoadingInvestment] = React.useState(false);

  // Filter transactions based on period
  const now = React.useMemo(() => new Date(), []);
  
  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      if (selectedPeriod === 'current') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      } else if (selectedPeriod === 'last') {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
      } else {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        return d >= threeMonthsAgo;
      }
    });
  }, [transactions, selectedPeriod, now]);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  // Calculate category distribution for expenses
  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(expensesByCategory)
    .map(([label, amount]) => ({
      label,
      amount,
      percent: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      icon: getCategoryIcon(label),
      ...getCategoryColor(label)
    }))
    .sort((a, b) => b.amount - a.amount);

  // Trend Data (Last 6 months)
  const trendData = React.useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleDateString('pt-BR', { month: 'short' });
      
      const monthIncome = transactions
        .filter(t => {
          const td = new Date(t.date);
          return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear() && t.type === 'income';
        })
        .reduce((acc, t) => acc + t.amount, 0);

      const monthExpense = transactions
        .filter(t => {
          const td = new Date(t.date);
          return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear() && t.type === 'expense';
        })
        .reduce((acc, t) => acc + t.amount, 0);

      months.push({
        name: monthName,
        receita: monthIncome,
        despesa: monthExpense
      });
    }
    return months;
  }, [transactions, now]);

  // Top Spending
  const topSpending = React.useMemo(() => {
    return [...filteredTransactions]
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [filteredTransactions]);

  // AI Insight Generation
  const generateAIInsight = React.useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) return;
    
    setIsLoadingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

      const summary = filteredTransactions.map(t => `${t.date}: ${t.description} (${t.category}) - R$ ${t.amount} [${t.type}]`).join('\n');
      
      const goals = [
        { title: 'Viagem para o Japão', current: 8500, target: 25000 },
        { title: 'Reserva de Emergência', current: 12000, target: 15000 },
        { title: 'Novo SUV 2024', current: 45000, target: 80000 }
      ];
      const goalsSummary = goals.map(g => `${g.title}: R$ ${g.current} de R$ ${g.target}`).join('\n');

      const prompt = `Analise este histórico financeiro e considere as metas do usuário. Dê um conselho curto e prático (máximo 2 parágrafos) para economizar ou investir melhor, sugerindo ações específicas para atingir as metas. Seja direto e use um tom amigável de fintech.
      
      Metas do Usuário:
      ${goalsSummary}
      
      Histórico de Transações:
      ${summary}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      setAiInsight(response.text || "Não foi possível gerar uma análise clara.");
    } catch (error) {
      console.error("Erro ao gerar insight:", error);
      setAiInsight("Não foi possível gerar insights no momento. Tente novamente mais tarde.");
    } finally {
      setIsLoadingAI(false);
    }
  }, [filteredTransactions]);

  const generateInvestmentInsight = React.useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY || totalIncome <= 0) return;
    
    setIsLoadingInvestment(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const amountToInvest = totalIncome / 2;

      const prompt = `Você é um consultor financeiro. O usuário tem R$ ${amountToInvest.toFixed(2)} (metade da sua receita mensal) disponíveis para investir hoje.
      Busque na internet as taxas atuais de investimentos de renda fixa no Brasil (como Tesouro Selic, CDBs, LCI/LCA).
      Escolha a melhor opção segura com prazo de 12 meses.
      Calcule o valor bruto projetado após 12 meses.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Nome do Investimento (ex: CDB 110% CDI)" },
              rate: { type: Type.STRING, description: "Taxa anual (ex: 11,5% a.a.)" },
              description: { type: Type.STRING, description: "Breve explicação de por que é uma boa opção e como funciona." },
              projectedAmount: { type: Type.NUMBER, description: "Valor bruto projetado após 12 meses" }
            },
            required: ["title", "rate", "description", "projectedAmount"]
          }
        }
      });
      
      if (response.text) {
        const data = JSON.parse(response.text);
        setInvestmentInsight(data);
      }
    } catch (error) {
      console.error("Erro ao gerar insight de investimento:", error);
    } finally {
      setIsLoadingInvestment(false);
    }
  }, [totalIncome]);

  React.useEffect(() => {
    if (filteredTransactions.length > 0) {
      generateAIInsight();
    }
  }, [selectedPeriod, filteredTransactions.length, generateAIInsight]);

  React.useEffect(() => {
    if (totalIncome > 0) {
      generateInvestmentInsight();
    }
  }, [totalIncome, generateInvestmentInsight]);

  return (
    <div className="min-h-screen pb-32 bg-surface">
      <TopAppBar />
      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-10 flex flex-col items-center">
        {/* Hero Analysis Section */}
        <section className="w-full space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 text-center">
            <div className="space-y-1 w-full">
              <h2 className="font-headline text-2xl sm:text-4xl font-bold tracking-tight text-on-background">Análise Financeira</h2>
              <p className="text-secondary font-medium text-[10px] sm:text-base">
                {selectedPeriod === 'current' ? 'Este Mês' : selectedPeriod === 'last' ? 'Mês Passado' : 'Últimos 3 Meses'}
              </p>
            </div>
            
            {/* Period Filter */}
            <div className="flex bg-surface-container-high p-1 rounded-2xl self-center sm:self-end">
              {[
                { id: 'current', label: 'Este Mês' },
                { id: 'last', label: 'Anterior' },
                { id: 'quarter', label: 'Trimestre' }
              ].map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id as any)}
                  className={cn(
                    "px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all",
                    selectedPeriod === period.id 
                      ? "bg-primary text-on-primary shadow-sm" 
                      : "text-secondary hover:text-on-surface"
                  )}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bento Grid Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
            {/* Saúde Financeira */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sm:col-span-2 bg-surface-container-lowest p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl shadow-sm border-l-8 border-tertiary flex flex-col justify-between min-h-[160px] sm:min-h-[240px] relative overflow-hidden"
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2 sm:space-y-3">
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Saúde Financeira</span>
                  <h3 className="font-headline text-lg sm:text-3xl font-bold leading-tight">
                    {totalIncome > totalExpenses ? 'Excelente controle \n este mês' : 'Atenção aos seus \n gastos'}
                  </h3>
                </div>
                <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-2xl bg-tertiary/10 flex items-center justify-center shrink-0 rotate-3">
                  <ShieldCheck className="w-6 h-6 sm:w-10 sm:h-10 text-tertiary" />
                </div>
              </div>
              <p className="text-secondary text-xs sm:text-base leading-relaxed max-w-sm mt-2 sm:mt-4 relative z-10">
                {totalIncome > totalExpenses 
                  ? `Sua receita está ${totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0}% acima das suas despesas. Ótimo trabalho!`
                  : 'Suas despesas estão próximas ou superando sua receita. Considere revisar seus gastos variáveis.'}
              </p>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-tertiary/5 rounded-full blur-3xl"></div>
            </motion.div>

            {/* Alerta de Gastos */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-error-container p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl shadow-sm flex flex-col justify-between min-h-[160px] sm:min-h-[240px] relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="bg-error text-white px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Resumo</span>
                <h3 className="font-headline text-sm sm:text-xl font-bold mt-2 sm:mt-4 text-on-error-container">Taxa de Comprometimento</h3>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-on-error-container relative z-10">
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl">
                  <Activity className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <span className="font-black text-xl sm:text-4xl tracking-tighter">
                  {totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0}%
                </span>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-error/10 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </section>

        {/* Totais Section */}
        <section className="w-full">
          <div className="bg-surface-container-low p-5 sm:p-8 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="font-black text-lg sm:text-3xl text-tertiary">{formatCurrency(totalIncome)}</span>
                <span className="text-[9px] sm:text-[10px] text-secondary font-bold uppercase tracking-widest">Total Receitas</span>
              </div>
              <div className="w-px h-10 sm:h-12 bg-outline-variant/30"></div>
              <div className="flex flex-col items-center gap-1 w-full">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-error/10 border-2 border-error flex items-center justify-center">
                  <span className="font-black text-sm sm:text-lg text-error">{formatCurrency(totalExpenses)}</span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-secondary font-bold uppercase tracking-widest">Total Despesas</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trend Chart Section */}
        <section className="w-full bg-surface-container-lowest p-5 sm:p-8 rounded-2xl shadow-sm space-y-4 sm:space-y-6 relative">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center text-center flex-1">
              <h3 className="font-headline text-lg sm:text-xl font-bold">Tendência de Fluxo</h3>
              <p className="text-secondary text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Últimos 6 meses</p>
            </div>
          </div>
          <div className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1b6d24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1b6d24" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#9ca3af' }}
                />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="receita" 
                  stroke="#1b6d24" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="despesa" 
                  stroke="#ba1a1a" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Category Analysis */}
        <section className="bg-surface-container-lowest p-5 sm:p-8 rounded-2xl shadow-sm space-y-6 sm:space-y-10 w-full relative">
          <div className="flex items-center justify-center">
            <div className="text-center flex-1">
              <h3 className="font-headline text-xl sm:text-2xl font-bold">Gastos por categoria</h3>
              <p className="text-secondary text-xs sm:text-sm font-medium mt-1">Distribuição do seu orçamento no período selecionado</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 md:gap-16 items-center">
            <div className="relative flex justify-center items-center h-48 sm:h-64 sm:h-80">
              {sortedCategories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sortedCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="amount"
                      nameKey="label"
                    >
                      {sortedCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.hex} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => formatCurrency(Number(value))}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-[10px] sm:border-[16px] border-surface-container flex items-center justify-center">
                  <div className="text-center px-2">
                    <span className="block font-headline text-sm sm:text-2xl font-black">{formatCurrency(0)}</span>
                    <span className="text-[8px] sm:text-[10px] text-secondary font-black uppercase tracking-widest">Sem Dados</span>
                  </div>
                </div>
              )}
              {sortedCategories.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <span className="block font-headline text-sm sm:text-2xl font-black">{formatCurrency(totalExpenses)}</span>
                    <span className="text-[8px] sm:text-[10px] text-secondary font-black uppercase tracking-widest">Total Gasto</span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3 sm:space-y-4">
              {sortedCategories.length > 0 ? (
                sortedCategories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 sm:p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all cursor-default">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={cn("w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-sm", cat.bg, cat.text)}>
                        <cat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm sm:text-base block">{cat.label}</span>
                        <span className="text-[9px] sm:text-[10px] text-secondary font-bold uppercase tracking-tight">{cat.percent}% do total</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-black text-sm sm:text-base">{formatCurrency(cat.amount)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8 text-secondary font-medium text-xs sm:text-sm">
                  Nenhuma despesa registrada para este período.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Maiores Gastos */}
        {topSpending.length > 0 && (
          <section className="bg-surface-container p-4 sm:p-6 rounded-3xl border border-outline-variant/10 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline text-xl sm:text-2xl font-bold">Maiores Gastos</h3>
                <p className="text-secondary text-xs sm:text-sm font-medium mt-1">Os itens que mais pesaram no seu bolso</p>
              </div>
              <div className="bg-error/10 p-2 rounded-xl">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-error" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {topSpending.map((t, i) => {
                const colors = getCategoryColor(t.category);
                const Icon = getCategoryIcon(t.category);
                return (
                  <motion.div 
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 sm:p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary/20 transition-all cursor-default"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={cn("w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-sm", colors.bg, colors.text)}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm sm:text-base block">{t.description}</span>
                        <span className="text-[9px] sm:text-[10px] text-secondary font-bold uppercase tracking-tight">{t.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block font-black text-sm sm:text-base text-error">{formatCurrency(t.amount)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Economia Inteligente Card */}
        <section className="w-full bg-on-secondary-fixed p-6 sm:p-10 rounded-[2.5rem] sm:rounded-3xl text-white flex flex-col md:flex-row items-center gap-6 sm:gap-8 shadow-2xl overflow-hidden relative">
          <div className="z-10 text-center space-y-4 sm:space-y-5 flex-1">
            <span className="bg-white/10 text-white/90 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-white/10 mb-2 sm:mb-4 inline-block">Economia Inteligente</span>
            <h3 className="font-headline text-2xl sm:text-4xl font-bold leading-tight">Dicas Personalizadas</h3>
            <div className="text-white/70 text-sm sm:text-lg max-w-lg min-h-[60px] sm:min-h-[80px] flex items-center">
              {isLoadingAI ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="animate-pulse text-xs sm:text-base">Analisando seus dados com IA...</span>
                </div>
              ) : (
                <p className="text-xs sm:text-base">{aiInsight || (totalExpenses > totalIncome 
                  ? 'Seus gastos superaram sua renda. Tente reduzir gastos em categorias não essenciais como Lazer.' 
                  : 'Seu saldo está positivo! Considere investir parte do valor economizado para o seu futuro.')}</p>
              )}
            </div>
            <button 
              onClick={generateAIInsight}
              disabled={isLoadingAI}
              className="bg-primary-gradient text-on-primary font-black px-8 py-3 sm:px-10 sm:py-4 rounded-xl sm:rounded-2xl mt-2 sm:mt-4 hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100 text-xs sm:text-base"
            >
              Recalcular Insights
            </button>
          </div>
          <div className="z-10 opacity-10 md:opacity-40 shrink-0">
            <BrainCircuit className="w-24 h-24 sm:w-48 sm:h-48" />
          </div>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl"></div>
        </section>

        {/* Investment Insight Card */}
        <section className="w-full bg-tertiary-container/30 p-6 sm:p-10 rounded-[2.5rem] sm:rounded-3xl flex flex-col md:flex-row items-center gap-6 sm:gap-8 shadow-sm border border-tertiary/20 relative overflow-hidden">
          <div className="z-10 text-center md:text-left space-y-4 sm:space-y-5 flex-1 w-full">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2 sm:mb-4">
              <span className="bg-tertiary text-on-tertiary px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">Dica de Investimento</span>
              <span className="bg-surface-container-high text-secondary px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">IA</span>
            </div>
            
            <h3 className="font-headline text-2xl sm:text-3xl font-bold leading-tight text-on-surface">Faça seu dinheiro render</h3>
            
            <div className="min-h-[120px] flex flex-col justify-center">
              {isLoadingInvestment ? (
                <div className="flex flex-col items-center md:items-start gap-3">
                  <div className="flex items-center gap-3 text-tertiary">
                    <div className="w-5 h-5 border-2 border-tertiary/30 border-t-tertiary rounded-full animate-spin"></div>
                    <span className="animate-pulse text-sm sm:text-base font-medium">Buscando as melhores taxas do mercado...</span>
                  </div>
                </div>
              ) : investmentInsight ? (
                <div className="space-y-4 bg-surface/50 p-4 sm:p-6 rounded-2xl border border-outline-variant/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-lg sm:text-xl text-on-surface">{investmentInsight.title}</h4>
                    <span className="bg-tertiary/10 text-tertiary font-black px-3 py-1 rounded-lg text-sm sm:text-base">{investmentInsight.rate}</span>
                  </div>
                  <p className="text-secondary text-sm sm:text-base leading-relaxed text-left">
                    {investmentInsight.description}
                  </p>
                  <div className="pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm text-secondary font-medium">Investindo 50% da sua renda (R$ {(totalIncome / 2).toFixed(2)}) por 12 meses:</span>
                    <span className="font-black text-xl sm:text-2xl text-tertiary">{formatCurrency(investmentInsight.projectedAmount)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-secondary text-sm sm:text-base">
                  {totalIncome > 0 
                    ? 'Não foi possível carregar a dica de investimento no momento.' 
                    : 'Registre receitas para receber dicas de investimento personalizadas.'}
                </p>
              )}
            </div>
            
            <button 
              onClick={generateInvestmentInsight}
              disabled={isLoadingInvestment || totalIncome <= 0}
              className="bg-surface text-on-surface border border-outline-variant font-bold px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl hover:bg-surface-container transition-all shadow-sm disabled:opacity-50 text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto md:mx-0"
            >
              <TrendingUp className="w-4 h-4" />
              Atualizar Simulação
            </button>
          </div>
          <div className="z-10 opacity-20 shrink-0 hidden md:block">
            <TrendingUp className="w-32 h-32 text-tertiary" />
          </div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl"></div>
        </section>
      </main>      
    </div>
  );
}
