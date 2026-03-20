'use client';


import { 
  LayoutDashboard, 
  ReceiptText, 
  ChartNoAxesCombined, 
  User,   
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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