import { 
  Utensils, 
  Car, 
  Home, 
  Heart, 
  Briefcase, 
  ShoppingBag, 
  Layers,
  HandCoins,
  TrendingDown,
  ShoppingCart,
  Coins,
  Target,
  PlaneTakeoff,
  Sparkles,
  CreditCard,
  Users,
  Megaphone,
  Flame,
  BarChart3,
  BrainCircuit
} from 'lucide-react';

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Alimentação': return Utensils;
    case 'Transporte': return Car;
    case 'Moradia': return Home;
    case 'Saúde': return Heart;
    case 'Educação': return Briefcase;
    case 'Lazer': return ShoppingBag;
    case 'Renda': return HandCoins;
    case 'Salário': return HandCoins;
    case 'Investimentos': return TrendingDown;
    case 'Freelance': return Briefcase;
    case 'Presente': return GiftIcon;
    case 'Venda': return ShoppingCart;
    case 'Viagem': return PlaneTakeoff;
    case 'Sonho': return Sparkles;
    case 'Ativo': return Target;
    case 'Assinatura': return CreditCard;
    case 'Fidelidade': return StarIcon;
    case 'Indicações': return Users;
    case 'Divulgação': return Megaphone;
    case 'Sequência': return Flame;
    case 'Uso': return BarChart3;
    case 'IA': return BrainCircuit;
    default: return Layers;
  }
};

// Simple icons that might be missing from the list above
const GiftIcon = Gift;
const StarIcon = Star;

import { Gift, Star } from 'lucide-react';

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Alimentação': return { bg: 'bg-primary-fixed', text: 'text-primary', hex: '#964900' };
    case 'Transporte': return { bg: 'bg-secondary-fixed', text: 'text-secondary', hex: '#525f71' };
    case 'Moradia': return { bg: 'bg-tertiary-fixed', text: 'text-tertiary', hex: '#1b6d24' };
    case 'Saúde': return { bg: 'bg-error-container', text: 'text-error', hex: '#ba1a1a' };
    case 'Lazer': return { bg: 'bg-primary-container', text: 'text-primary', hex: '#f57c00' };
    case 'Educação': return { bg: 'bg-secondary-container', text: 'text-secondary', hex: '#d3e1f6' };
    case 'Renda':
    case 'Salário':
    case 'Investimentos':
    case 'Freelance':
    case 'Venda': return { bg: 'bg-tertiary-fixed', text: 'text-tertiary', hex: '#1b6d24' };
    case 'Presente': return { bg: 'bg-primary-container', text: 'text-primary', hex: '#f57c00' };
    case 'Viagem': return { bg: 'bg-tertiary-fixed', text: 'text-tertiary', hex: '#1b6d24' };
    case 'Sonho': return { bg: 'bg-primary-fixed', text: 'text-primary', hex: '#964900' };
    case 'Ativo': return { bg: 'bg-secondary-fixed', text: 'text-secondary', hex: '#525f71' };
    default: return { bg: 'bg-surface-container-highest', text: 'text-on-surface', hex: '#d9dadb' };
  }
};
