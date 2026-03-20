import Link from 'next/link';
import { TopAppBar, BottomNavBar } from '@/components/navigation';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopAppBar />
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="bg-surface-container-high p-6 rounded-3xl shadow-inner">
          <FileQuestion className="w-16 h-16 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="font-headline text-4xl font-bold text-on-background">404</h2>
          <p className="text-secondary font-medium text-lg">Página não encontrada</p>
        </div>
        <p className="text-on-surface-variant max-w-xs mx-auto">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Link 
          href="/" 
          className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
        >
          Voltar ao Início
        </Link>
      </main>
      <BottomNavBar />
    </div>
  );
}
