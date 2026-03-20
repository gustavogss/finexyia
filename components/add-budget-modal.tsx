'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (budget: any) => void;
  onEdit?: (budget: any) => void;
  onDelete?: (id: string) => void;
  budgetToEdit?: any;
}

const categories = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Moradia', 'Educação', 'Outros'];

export function AddBudgetModal({ isOpen, onClose, onAdd, onEdit, onDelete, budgetToEdit }: AddBudgetModalProps) {
  const [budgetData, setBudgetData] = useState(() => {
    if (budgetToEdit) {
      return {
        category: budgetToEdit.category,
        amount: formatCurrency(budgetToEdit.amount),
      };
    }
    return { category: categories[0], amount: '' };
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setBudgetData(prev => ({ ...prev, amount: '' }));
      return;
    }
    
    const numericValue = parseInt(value) / 100;
    setBudgetData(prev => ({ ...prev, amount: formatCurrency(numericValue) }));
  };

  const handleSave = () => {
    if (!budgetData.amount) return;
    const budget = {
      ...budgetData,
      id: budgetToEdit ? budgetToEdit.id : Date.now().toString(),
      amount: parseInt(budgetData.amount.replace(/\D/g, '')) / 100
    };
    
    if (budgetToEdit && onEdit) {
      onEdit(budget);
    } else {
      onAdd(budget);
    }
    
    setBudgetData({ category: categories[0], amount: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{budgetToEdit ? 'Editar Orçamento' : 'Novo Orçamento'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <select 
            value={budgetData.category}
            onChange={(e) => setBudgetData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full p-3 rounded-xl bg-surface-container-high"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <input 
            placeholder="R$ 0,00" 
            value={budgetData.amount}
            onChange={handleAmountChange}
            className="w-full p-3 rounded-xl bg-surface-container-high" 
          />
          <div className="flex gap-3">
            {budgetToEdit && onDelete && (
              <button 
                onClick={() => {
                  onDelete(budgetToEdit.id);
                  onClose();
                }}
                className="p-4 bg-error/10 text-error rounded-xl hover:bg-error/20 transition-colors"
                title="Excluir Orçamento"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            )}
            <button onClick={handleSave} className="flex-1 py-4 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90">
              Salvar Orçamento
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
