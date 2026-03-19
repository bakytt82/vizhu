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
    <div className="bg-background min-h-screen pb-72 lg:hidden">
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
                   <div className="w-24 h-24 bg-secondary/50 rounded-3xl flex items-center justify-center p-4 overflow-hidden relative">
                      {item.selectedColor?.image || item.product.images?.[0] ? (
                        <img 
                          src={item.selectedColor?.image || item.product.images?.[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-5xl">{item.product.category === 'sunglasses' ? '🕶️' : '👓'}</div>
                      )}
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
                         {item.selectedColor && (
                           <div className="flex items-center gap-3 text-[9px] text-muted-foreground font-bold uppercase tracking-widest bg-secondary/80 px-3 py-1.5 rounded-full">
                              <div className="w-2 h-2 rounded-full border border-black/5" style={{ backgroundColor: item.selectedColor.hex }} />
                              {getLangText(item.selectedColor.name as any, language)}
                           </div>
                         )}
                         
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
      <div className="fixed bottom-20 left-4 right-4 p-4 bg-background/40 backdrop-blur-2xl border border-white/20 z-40 space-y-3 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between px-1">
           <button 
            onClick={() => {
              if (selectedItems.size === items.length) {
                items.forEach(i => selectedItems.has(i.product.id) && toggleItem(i.product.id));
              } else {
                items.forEach(i => !selectedItems.has(i.product.id) && toggleItem(i.product.id));
              }
            }}
            className="flex items-center gap-2 active:scale-95 transition-transform"
           >
              <div className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                selectedItems.size === items.length ? "bg-vizhu-purple border-vizhu-purple" : "border-muted-foreground/20 bg-white/5"
              )}>
                 {selectedItems.size === items.length && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60">{t.cart_select_all}</span>
           </button>
           
           <div className="text-right">
              <div className="flex items-baseline justify-end gap-1.5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/30 tracking-widest">{t.cart_summary}</span>
                <span className="text-2xl font-display font-bold text-vizhu-orange leading-none">{formatPrice(selectedTotal, '').trim()}</span>
                <span className="text-[10px] font-bold text-vizhu-orange opacity-50 uppercase">{t.som}</span>
              </div>
           </div>
        </div>

        <Link 
          href="/checkout"
          className={cn(
            "w-full h-12 rounded-2xl flex items-center justify-center text-[9px] font-bold uppercase tracking-[0.25em] transition-all shadow-lg active:scale-95",
            selectedItems.size === 0 
              ? "bg-muted text-muted-foreground opacity-40 pointer-events-none" 
              : "bg-vizhu-purple text-white shadow-vizhu-purple/30"
          )}
        >
          {t.cart_checkout} — {selectedItems.size}
        </Link>
      </div>
    </div>
  );
}
