'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  XCircle,
  Trash2,
  BellOff
} from 'lucide-react';
import { useNotifications, NotificationItem } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { notifications, unreadCount, markAsRead, clearAll, permission, requestPermission } = useNotifications();

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-tertiary" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-error" />;
      case 'error': return <XCircle className="w-5 h-5 text-error" />;
      default: return <Info className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />
          
          {/* Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-container-lowest shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-on-secondary-fixed text-white">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6" />
                <div>
                  <h3 className="font-headline font-bold text-xl">Notificações</h3>
                  <p className="text-xs opacity-70 font-medium">
                    {unreadCount > 0 ? `${unreadCount} novas mensagens` : 'Nenhuma notificação nova'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Permission Banner */}
            {permission === 'default' && (
              <div className="p-4 bg-primary-container text-on-primary-container flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <BellOff className="w-5 h-5 shrink-0" />
                  <p className="text-xs font-medium">Ative as notificações push para não perder nada.</p>
                </div>
                <button 
                  onClick={() => requestPermission()}
                  className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap"
                >
                  Ativar
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-20">
                  <Bell className="w-16 h-16" />
                  <p className="font-medium">Você ainda não tem notificações.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <motion.div 
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer group relative",
                      n.read 
                        ? "bg-surface-container-low border-outline-variant/30" 
                        : "bg-surface-container border-primary/20 shadow-sm"
                    )}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 mt-1">
                        {getIcon(n.type)}
                      </div>
                      <div className="space-y-1 pr-4">
                        <h4 className={cn("font-bold text-sm", !n.read && "text-on-surface")}>{n.title}</h4>
                        <p className="text-xs text-secondary leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-outline font-medium block pt-1">
                          {n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    {!n.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-outline-variant">
                <button 
                  onClick={clearAll}
                  className="w-full flex items-center justify-center gap-2 py-3 text-error font-bold text-sm hover:bg-error/5 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar tudo
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
