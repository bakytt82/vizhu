'use client';

import { ChevronLeft, ShoppingBag, Heart, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/types';
import { formatPrice, cn, getLangText } from '@/lib/utils';
import Link from 'next/link';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';

interface MobileCartViewProps {
  items: CartItem[];
  selectedItems: Set<string>;
  toggleItem: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
  removeItem: (id: string) => void;
  selectedTotal: number;
}

export default function MobileCartView({
  items,
  selectedItems,
  toggleItem,
  updateQuantity,
  removeItem,
  selectedTotal,
}: MobileCartViewProps) {
  const { language } = useLanguageStore();
  const t = translations[language];

  // Group items by brand
  const groupedItems = items.reduce((acc, item) => {
    const brand = item.product.brand;
    if (!acc[brand]) acc[brand] = [];
    acc[brand].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  return (
    <div className="bg-background min-h-screen pb-48 lg:hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-30 border-b border-border/50">
        <div className="flex items-center gap-4">
          <Link href="/catalog" className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-2xl active:scale-95 transition-transform">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl font-serif font-medium">{t.cart_title} <span className="text-muted-foreground font-light text-base ml-2 opacity-50">{items.length}</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center bg-card border border-border rounded-2xl">
             <ShoppingBag size={20} />
             <span className="absolute -top-1 -right-1 bg-vizhu-purple w-5 h-5 rounded-full text-[10px] flex items-center justify-center text-white border-2 border-background font-bold shadow-lg">{items.length}</span>
          </div>
        </div>
      </header>

      {/* Cart Items Grouped by Brand */}
      <div className="px-6 py-8 space-y-12">
        {Object.entries(groupedItems).map(([brand, brandItems]) => (
          <div key={brand} className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
               <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground/60">{brand}</span>
               <div className="h-px bg-border flex-1" />
            </div>

            {brandItems.map((item) => (
              <div key={item.product.id} className="flex gap-4 group">
                <div className="flex items-start pt-6">
                   <button 
                     onClick={() => toggleItem(item.product.id)}
                     className={cn(
                       "w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all active:scale-90",
                       selectedItems.has(item.product.id) ? "bg-vizhu-purple border-vizhu-purple" : "bg-card border-border"
                     )}
                   >
                     {selectedItems.has(item.product.id) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                   </button>
                </div>

                <div className="flex-1 bg-card rounded-4xl p-6 flex gap-6 border border-border/50 shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform">
                   <div className="w-24 h-24 bg-secondary/50 rounded-3xl flex items-center justify-center p-4">
                      <div className="text-5xl">👓</div>
                   </div>
                   
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="font-serif font-medium text-lg leading-tight line-clamp-1">{item.product.name}</h3>
                         <button 
                          onClick={() => removeItem(item.product.id)}
                          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive active:scale-90 transition-all"
                         >
                            <Trash2 size={16} className="opacity-40" />
                         </button>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                         <span className="text-lg font-display font-bold text-vizhu-orange">{formatPrice(item.product.price, t.som)}</span>
                         {item.product.oldPrice && (
                           <span className="text-xs text-muted-foreground line-through opacity-50">{formatPrice(item.product.oldPrice, t.som)}</span>
                         )}
                         <span className="bg-destructive/10 text-destructive text-[8px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-tighter">-{item.product.discount || 15}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3 text-[9px] text-muted-foreground font-bold uppercase tracking-widest bg-secondary/80 px-3 py-1.5 rounded-full">
                            <div className="w-2 h-2 rounded-full border border-black/5" style={{ backgroundColor: item.selectedColor.hex }} />
                            {getLangText(item.selectedColor.name as any, language)}
                         </div>
                         
                         <div className="flex items-center gap-3 bg-secondary rounded-2xl p-0.5 border border-border/30">
                            <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-card rounded-xl shadow-sm active:scale-90 transition-transform">
                               <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-card rounded-xl shadow-sm text-foreground active:scale-90 transition-transform">
                               <Plus size={12} />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Sticky Bottom Summary */}
      <div className="fixed bottom-24 left-0 right-0 p-6 bg-background/80 backdrop-blur-2xl border-t border-border z-40 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
           <button 
            onClick={() => {
              if (selectedItems.size === items.length) {
                // none
              } else {
                // select all
              }
            }}
            className="flex items-center gap-4 group"
           >
              <div className="w-7 h-7 rounded-xl border-2 border-muted-foreground/30 flex items-center justify-center group-active:scale-90 transition-transform">
                 {selectedItems.size === items.length && <div className="w-2 h-2 bg-vizhu-purple rounded-full" />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t.cart_select_all}</span>
           </button>
           <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/50 block tracking-widest mb-1">{t.cart_summary}</span>
              <span className="text-3xl font-display font-bold text-vizhu-orange">{formatPrice(selectedTotal, t.som)}</span>
           </div>
        </div>
        <Link 
          href="/checkout"
          className={cn(
            "w-full h-16 rounded-[32px] flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95",
            selectedItems.size === 0 
              ? "bg-muted text-muted-foreground opacity-50 pointer-events-none" 
              : "bg-vizhu-purple text-white shadow-vizhu-purple/20"
          )}
        >
          {t.cart_checkout} ({selectedItems.size})
        </Link>
      </div>
    </div>
  );
}
