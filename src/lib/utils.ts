import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'сом'): string {
  return `${price.toLocaleString('ru-RU')} ${currency}`;
}

export function calculateDiscount(price: number, oldPrice: number): number {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function generateStars(rating: number): string[] {
  const stars: string[] = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push('full');
    else if (i - 0.5 <= rating) stars.push('half');
    else stars.push('empty');
  }
  return stars;
}

export function getLangText(text: string | { ru: string; kg: string; en: string } | undefined, lang: string): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  const typedText = text as Record<string, string>;
  return typedText[lang] || typedText['ru'] || '';
}
