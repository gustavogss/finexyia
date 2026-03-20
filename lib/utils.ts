import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number | string): string {
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) / 100 : value;
  if (isNaN(numericValue)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numericValue);
}

export function formatAmount(value: number | string): string {
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) / 100 : value;
  if (isNaN(numericValue)) return '0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

export function formatPixKey(value: string): string {
  const clean = value.replace(/\D/g, '');
  
  // CPF: 000.000.000-00
  if (clean.length === 11) {
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  // CNPJ: 00.000.000/0000-00
  if (clean.length === 14) {
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Phone: (00) 00000-0000
  if (clean.length === 11 && value.startsWith('(')) {
     // Already formatted or partially formatted
  }
  
  if (clean.length === 11 && !value.includes('.') && !value.includes('-')) {
    // Could be phone or CPF, default to CPF if no other hints
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  if (clean.length === 11 && (value.startsWith('(') || value.length > 11)) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  return value;
}
