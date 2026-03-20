import type {Metadata} from 'next';
import { Comfortaa, Quicksand } from 'next/font/google';
import './globals.css';

const comfortaa = Comfortaa({
  subsets: ['latin'],
  variable: '--font-headline',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'FinexyIA - Gestão Financeira',
  description: 'Gestão financeira pessoal com clareza editorial e segurança absoluta.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

import { TransactionProvider } from '@/lib/transactions-context';
import { ThemeProvider } from '@/lib/theme-context';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${comfortaa.variable} ${quicksand.variable}`}>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TransactionProvider>
            {children}
          </TransactionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
