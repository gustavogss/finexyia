'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useTransactions } from '@/lib/transactions-context';
import { formatCurrency } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export function AssistantModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { transactions, balance, totalIncome, totalExpenses } = useTransactions();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Olá! Sou o Assistente FinexyIA. Analisei seu padrão de consumo e notei que você pode economizar mais R$ 200 este mês. Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key not found');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const context = `
Você é o Assistente FinexyIA, um consultor financeiro pessoal inteligente e amigável.
Sua missão é ajudar o usuário a entender seus gastos, dar dicas de economia e responder perguntas sobre suas finanças.
Responda de forma concisa, direta e sempre em português do Brasil.
Use formatação markdown para destacar informações importantes (negrito, listas, etc).

Dados atuais do usuário:
- Saldo: ${formatCurrency(balance)}
- Receitas do mês: ${formatCurrency(totalIncome)}
- Despesas do mês: ${formatCurrency(totalExpenses)}

Últimas transações:
${transactions.slice(0, 10).map(t => `- ${t.description}: ${formatCurrency(t.amount)} (${t.type === 'income' ? 'Receita' : 'Despesa'}) em ${new Date(t.date).toLocaleDateString('pt-BR')}`).join('\n')}
      `;

      const contents = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
          systemInstruction: context,
        }
      });

      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text! }]);
      }
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Desculpe, ocorreu um erro ao processar sua solicitação. Verifique sua conexão ou tente novamente mais tarde.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-surface w-full sm:max-w-lg h-[85vh] sm:h-[600px] sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl border border-outline-variant/20 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-surface-container-low px-6 py-4 flex items-center justify-between border-b border-outline-variant/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-on-surface">Assistente FinexyIA</h3>
                  <p className="text-[10px] text-secondary font-medium">Sempre online para ajudar</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-surface scrollbar-hide">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-tertiary text-on-tertiary' : 'bg-primary/10 text-primary'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-tertiary text-on-tertiary rounded-tr-sm' 
                        : 'bg-surface-container-low text-on-surface rounded-tl-sm border border-outline-variant/10'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p>{msg.text}</p>
                    ) : (
                      <div className="markdown-body prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-surface-container-highest prose-pre:text-on-surface">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-surface-container-low rounded-2xl rounded-tl-sm px-4 py-3 border border-outline-variant/10 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs text-secondary font-medium">Analisando...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/10 shrink-0">
              <form 
                onSubmit={handleSend}
                className="flex items-center gap-2 bg-surface-container-low rounded-full p-1.5 border border-outline-variant/20 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all"
              >
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pergunte sobre seus gastos..."
                  className="flex-1 bg-transparent border-none px-4 py-2 text-sm focus:outline-none text-on-surface placeholder:text-secondary"
                  disabled={isLoading}
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
