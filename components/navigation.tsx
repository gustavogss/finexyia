'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  ChartNoAxesCombined, 
  User, 
  Bell, 
  Sun, 
  Moon,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import { useNotifications } from '@/hooks/use-notifications';
import { NotificationCenter } from './notification-center';
import { useTheme } from '@/lib/theme-context';

export function TopAppBar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const { unreadCount } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-50 bg-on-secondary-fixed text-white px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Alternar tema"
          >
            {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </button>
        </div>
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <div className="bg-primary-container p-1.5 rounded-xl flex items-center justify-center shadow-sm">
            <TrendingUp className="w-5 h-5 text-on-primary" />
          </div>
          <h1 className="font-headline font-bold tracking-tight text-2xl">FinexyIA</h1>
        </div>
        <button 
          onClick={() => setIsNotificationsOpen(true)}
          className="p-2 relative hover:bg-white/10 rounded-full transition-colors"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-on-secondary-fixed"></span>
          )}
        </button>
      </header>
      
      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </>
  );
}

export function BottomNavBar() {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: ReceiptText, label: 'Transações', href: '/transactions' },
    { icon: ChartNoAxesCombined, label: 'Análise', href: '/analysis' },
    { icon: User, label: 'Perfil', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-outline-variant/15 px-6 py-3 flex justify-between items-center z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 group transition-colors",
              isActive ? "text-primary" : "text-on-secondary-fixed-variant opacity-40 hover:opacity-100"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
