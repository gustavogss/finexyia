'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Scan, 
  Camera, 
  Zap, 
  Image as ImageIcon,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (data: { amount: string; description: string; category: string }) => void;
}

import { Html5Qrcode } from 'html5-qrcode';

export function QrScannerModal({ isOpen, onClose, onScan }: QrScannerModalProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'processing' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);
  const scannerRef = React.useRef<Html5Qrcode | null>(null);
  const isRunningRef = React.useRef(false);

  const [isFlashOn, setIsFlashOn] = useState(false);

  const handleScanSuccess = useCallback((decodedText: string) => {
    setStatus('processing');
    
    // Stop scanner immediately on success
    if (scannerRef.current && isRunningRef.current) {
      isRunningRef.current = false;
      scannerRef.current.stop().catch(err => console.error(err));
    }

    let amount = "0,00";
    let description = "Compra via QR Code";
    
    try {
      // 1. Tentar processar como JSON primeiro (alguns sistemas modernos usam JSON no QR)
      if (decodedText.trim().startsWith('{')) {
        try {
          const data = JSON.parse(decodedText);
          const val = data.vVal || data.valor || data.total || data.amount || data.value;
          const desc = data.xNome || data.description || data.merchantName || data.nome;
          
          if (val) amount = String(val).replace('.', ',');
          if (desc) description = desc;
        } catch (e) {
          // Não é JSON válido, segue para processamento de URL
        }
      }

      // 2. Normalizar texto para lidar com formatos SEFAZ (trocar pipe por &)
      const normalizedText = decodedText.replace(/\|/g, '&');
      
      // 3. Tentar extrair via URLSearchParams (mais seguro para URLs válidas)
      let foundViaUrl = false;
      try {
        const urlString = normalizedText.includes('?') ? normalizedText : `?${normalizedText}`;
        const url = new URL(urlString, 'https://example.com'); // Base dummy para parsear caminhos relativos
        const params = url.searchParams;
        
        const val = params.get('vVal') || params.get('valor') || params.get('total') || params.get('amount');
        const desc = params.get('xNome') || params.get('desc') || params.get('description') || params.get('merchantName');
        
        if (val) {
          amount = val.replace('.', ',');
          foundViaUrl = true;
        }
        if (desc) description = desc;
      } catch (e) {
        // Falha no parse da URL
      }

      // 4. Fallback para Regex (robusto para URLs malformadas ou fragmentos)
      if (!foundViaUrl || amount === "0,00") {
        const valMatch = normalizedText.match(/[?&](vVal|valor|total|amount|value)=([\d,.]+)/i);
        if (valMatch) {
          amount = valMatch[2].replace('.', ',');
        } else {
          // Se for apenas um número puro no QR Code
          const pureNumberMatch = decodedText.trim().match(/^(\d+([,.]\d{1,2})?)$/);
          if (pureNumberMatch) {
            amount = pureNumberMatch[1].replace('.', ',');
          }
        }
      }

      // Extração de descrição via Regex se não encontrada
      if (description === "Compra via QR Code") {
        const descMatch = normalizedText.match(/[?&](xNome|desc|description|merchantName|nome)=([^&]+)/i);
        if (descMatch) {
          description = decodeURIComponent(descMatch[2].replace(/\+/g, ' '));
        }
      }

    } catch (e) {
      console.error('Erro ao processar dados do QR Code:', e);
    }

    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onScan({
          amount,
          description,
          category: 'Outros'
        });
        onClose();
        setStatus('idle');
      }, 800);
    }, 1000);
  }, [onScan, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Use a timeout to avoid synchronous state update in effect
      const timer = setTimeout(() => {
        setStatus('scanning');
        setError(null);
      }, 0);
      
      // Initialize scanner
      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          // Success callback
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Error callback (usually just "no QR code found in frame")
        }
      ).then(() => {
        isRunningRef.current = true;
      }).catch((err) => {
        console.error("Unable to start scanning", err);
        setError("Não foi possível acessar a câmera. Verifique as permissões.");
        setStatus('idle');
        isRunningRef.current = false;
      });

      return () => {
        clearTimeout(timer);
        if (scannerRef.current && isRunningRef.current) {
          isRunningRef.current = false;
          scannerRef.current.stop().then(() => {
            scannerRef.current?.clear();
          }).catch(err => console.error("Failed to stop scanner", err));
        }
      };
    }
  }, [isOpen, handleScanSuccess]);

  const toggleFlash = async () => {
    if (!scannerRef.current) return;
    try {
      const newState = !isFlashOn;
      // Note: torch support is experimental and browser-dependent
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: newState } as any]
      });
      setIsFlashOn(newState);
    } catch (err) {
      console.error("Flash not supported", err);
    }
  };

  const handlePickFromGallery = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setStatus('processing');
      
      // Create a temporary hidden element for file scanning to avoid conflict with camera
      const tempId = "qr-file-reader";
      let tempElem = document.getElementById(tempId);
      if (!tempElem) {
        tempElem = document.createElement('div');
        tempElem.id = tempId;
        tempElem.style.display = 'none';
        document.body.appendChild(tempElem);
      }

      const html5QrCode = new Html5Qrcode(tempId);
      try {
        const decodedText = await html5QrCode.scanFile(file, true);
        handleScanSuccess(decodedText);
      } catch (err) {
        console.error(err);
        setError("Não foi possível encontrar um QR Code nesta imagem.");
        setStatus('idle');
      } finally {
        html5QrCode.clear();
      }
    };
    fileInput.click();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[100] flex flex-col overflow-y-auto scrollbar-hide"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between text-white z-10">
              <div className="flex items-center gap-3">
                <Scan className="w-6 h-6 text-primary" />
                <h3 className="font-headline font-bold text-xl">Scanner de Nota</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

              {/* Scanner Viewport */}
              <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {/* Camera Container */}
                <div id="qr-reader" className="w-full h-full"></div>

                {/* Pulsing Overlay Square */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-[250px] h-[250px]">
                    {/* Corner Borders */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                    
                    {/* Pulsing Inner Box */}
                    <motion.div 
                      animate={{ 
                        opacity: [0.1, 0.3, 0.1],
                        scale: [0.98, 1.02, 0.98]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                    />

                    {/* Scanning Line */}
                    <motion.div 
                      animate={{ 
                        top: ['0%', '100%', '0%']
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute left-0 right-0 h-0.5 bg-primary/50 shadow-[0_0_10px_rgba(150,73,0,0.5)] z-10"
                    />
                  </div>
                </div>

                {/* Error Message */}
              {error && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-error/90 text-on-error p-6 rounded-2xl text-center z-50 max-w-[80%]">
                  <p className="font-bold">{error}</p>
                  <button 
                    onClick={() => setStatus('scanning')}
                    className="mt-4 bg-white text-error px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}

              {/* Status Overlays */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
                <AnimatePresence mode="wait">
                  {status === 'processing' && (
                    <motion.div 
                      key="processing"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-black/60 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center gap-3 text-white"
                    >
                      <Loader2 className="w-10 h-10 text-primary animate-spin" />
                      <span className="text-sm font-bold uppercase tracking-widest">Processando...</span>
                    </motion.div>
                  )}
                  {status === 'success' && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-tertiary p-6 rounded-2xl flex flex-col items-center gap-3 text-on-tertiary"
                    >
                      <CheckCircle2 className="w-12 h-12" />
                      <span className="text-sm font-bold uppercase tracking-widest">Concluído!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Instructions */}
              <div className="absolute bottom-20 left-0 right-0 text-center px-10 space-y-2 z-30">
                <p className="text-white font-medium">Posicione o QR Code da nota fiscal no centro do quadrado</p>
                <p className="text-white/40 text-xs uppercase tracking-widest">A detecção é automática</p>
              </div>
            </div>

            {/* Controls */}
            <div className="p-10 flex justify-center gap-8 bg-black/50 backdrop-blur-xl z-30">
              <button 
                onClick={toggleFlash}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
                  isFlashOn ? "bg-yellow-400/20" : "bg-white/10 group-hover:bg-white/20"
                )}>
                  <Zap className={cn("w-6 h-6", isFlashOn ? "text-yellow-400 fill-yellow-400" : "text-yellow-400")} />
                </div>
                <span className="text-[10px] text-white/60 font-bold uppercase">Flash</span>
              </button>
              <button 
                onClick={handlePickFromGallery}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] text-white/60 font-bold uppercase">Galeria</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
