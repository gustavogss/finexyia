'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: { name: string; number: string; expiry: string; cvv: string };
  onDelete: () => void;
  canDelete: boolean;
}

export function CardModal({ isOpen, onClose, card, onDelete, canDelete }: CardModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm scrollbar-hide">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Detalhes do Cartão</h2>
              <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Card Preview */}
            <div className="relative w-full h-40 mb-8 [perspective:1000px]">
              <div className="w-full h-full bg-[#001f3f] rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl">
                <CreditCard className="w-6 h-6 opacity-80" />
                <p className="text-xl font-mono tracking-widest text-center my-2">
                  {card.number.replace(/(\d{4})/g, '$1 ').trim()}
                </p>
                <div className="flex justify-between items-end">
                  <p className="text-xs font-semibold truncate max-w-[60%]">{card.name.toUpperCase()}</p>
                  <p className="text-xs font-mono">{card.expiry}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container-high p-4 rounded-xl">
                <p className="text-xs text-secondary font-bold uppercase">Titular</p>
                <p className="text-sm font-medium">{card.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-high p-4 rounded-xl">
                  <p className="text-xs text-secondary font-bold uppercase">Validade</p>
                  <p className="text-sm font-medium">{card.expiry}</p>
                </div>
                <div className="bg-surface-container-high p-4 rounded-xl">
                  <p className="text-xs text-secondary font-bold uppercase">CVV</p>
                  <p className="text-sm font-medium">{card.cvv}</p>
                </div>
              </div>
            </div>

            {canDelete && (
              <button 
                onClick={onDelete}
                className="w-full mt-8 py-4 bg-error/10 text-error rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-error/20 transition-all"
              >
                <Trash2 className="w-5 h-5" />
                Excluir Cartão
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
