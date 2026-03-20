'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (card: any) => void;
}

export function AddCardModal({ isOpen, onClose, onAdd }: AddCardModalProps) {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [isFlipped, setIsFlipped] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    onAdd(cardData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Cadastrar Cartão</h2>
              <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Card Preview */}
            <div className="relative w-full h-[168px] mb-6 [perspective:1000px]">
              <motion.div
                className="w-full h-full relative [transform-style:preserve-3d]"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Front */}
                <div className="absolute inset-0 [backface-visibility:hidden] bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-5 text-white flex flex-col justify-between shadow-lg">
                  <CreditCard className="w-6 h-6" />
                  <p className="text-lg font-mono tracking-widest">{cardData.number || '•••• •••• •••• ••••'}</p>
                  <div className="flex justify-between">
                    <p className="text-xs">{cardData.name || 'NOME DO TITULAR'}</p>
                    <p className="text-xs">{cardData.expiry || 'MM/AA'}</p>
                  </div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 [backface-visibility:hidden] bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-5 text-white flex flex-col justify-center [transform:rotateY(180deg)] shadow-lg">
                  <div className="h-8 bg-black/30 w-full mb-4" />
                  <div className="bg-white text-black p-2 rounded text-right font-mono text-base">
                    {cardData.cvv || '•••'}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <input name="number" placeholder="Número do Cartão" onChange={handleInputChange} className="w-full p-3 rounded-xl bg-surface-container-high" />
              <input name="name" placeholder="Nome no Cartão" onChange={handleInputChange} className="w-full p-3 rounded-xl bg-surface-container-high" />
              <div className="grid grid-cols-2 gap-4">
                <input name="expiry" placeholder="MM/AA" onChange={handleInputChange} className="w-full p-3 rounded-xl bg-surface-container-high" />
                <input 
                  name="cvv" 
                  placeholder="CVV" 
                  onChange={handleInputChange} 
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                  className="w-full p-3 rounded-xl bg-surface-container-high" 
                />
              </div>
              <button onClick={handleSave} className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90">
                Salvar Cartão
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
