'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  X, 
  Copy, 
  Check, 
  MessageCircle, 
  Download,
  QrCode as QrIcon
} from 'lucide-react';
import { cn, formatCurrency, formatPixKey } from '@/lib/utils';
import { useNotifications } from '@/hooks/use-notifications';

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
  description: string;
  pixKey?: string;
}

export function PixModal({ isOpen, onClose, amount, description, pixKey: customPixKey }: PixModalProps) {
  const [copied, setCopied] = useState(false);
  const { notify } = useNotifications();
  
  // Mock or Custom Pix Key (Payload)
  const pixKey = customPixKey || ("00020126360014br.gov.bcb.pix0114+55119999999995204000053039865404" + (amount || "0.00") + "5802BR5925FINANCY APP6009SAO PAULO62070503***6304");

  const handleCopy = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    notify('Copiado!', { body: 'Chave Pix copiada para a área de transferência.', type: 'success' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const message = `Olá! Segue a cobrança de R$ ${amount || '0,00'} referente a: ${description || 'Serviços'}.\n\nChave Pix (Copia e Cola):\n${pixKey}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleDownload = () => {
    const canvas = document.getElementById('pix-qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `pix-financy-${description || 'cobranca'}.png`;
      link.href = url;
      link.click();
      notify('Download Iniciado', { body: 'O QR Code do Pix foi salvo como imagem.', type: 'success' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm max-h-[90vh] bg-surface-container-lowest rounded-3xl shadow-2xl z-[110] overflow-y-auto scrollbar-hide"
          >
            {/* Close Button */}
            <button 
              onClick={onClose} 
              className="absolute right-4 top-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-[120] backdrop-blur-sm border border-white/10"
              aria-label="Fechar"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="p-10 bg-tertiary text-on-tertiary flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-2">
                <QrIcon className="w-10 h-10" />
              </div>
              <h3 className="font-headline font-bold text-2xl text-center">Receber via Pix</h3>
            </div>

            <div className="p-8 space-y-8 text-center">
              {/* QR Code */}
              <div className="relative group">
                <div className="bg-white p-4 rounded-2xl inline-block shadow-inner border border-outline-variant/20">
                  <QRCodeCanvas 
                    id="pix-qr-code"
                    value={pixKey} 
                    size={200} 
                    level="H" 
                    includeMargin={true} 
                  />
                </div>
                <button 
                  onClick={handleDownload}
                  title="Baixar QR Code"
                  className="absolute -bottom-2 -right-2 bg-surface-container-highest p-3 rounded-full shadow-lg hover:scale-110 transition-transform text-on-surface border border-outline-variant/20"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold text-secondary uppercase tracking-widest">Valor a Receber</p>
                <p className="text-4xl font-headline font-black text-on-background">{formatCurrency(amount || '0,00')}</p>
                {description && <p className="text-sm text-secondary italic">&quot;{description}&quot;</p>}
                {customPixKey && (
                  <div className="mt-4 p-3 bg-surface-container rounded-xl border border-outline-variant/10">
                    <p className="text-[10px] text-secondary uppercase font-bold mb-1">Chave Pix</p>
                    <p className="text-sm font-mono font-medium text-on-surface-variant">{formatPixKey(customPixKey)}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={handleCopy}
                  className={cn(
                    "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all",
                    copied ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  )}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? "Copiado!" : "Copiar Código Pix"}
                </button>

                <button 
                  onClick={handleShareWhatsApp}
                  className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-lg shadow-green-500/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Enviar por WhatsApp
                </button>
              </div>

              <p className="text-[10px] text-secondary opacity-60 leading-relaxed">
                Esta chave é gerada de forma segura pelo sistema FINANCY. <br/>
                O pagamento cai instantaneamente na sua conta vinculada.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
