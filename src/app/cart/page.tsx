'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice, cn, getLangText } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import MobileCartView from '@/components/shared/MobileCartView';
import { useLanguageStore } from '@/stores/languageStore';
import { translations } from '@/lib/translations';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setSelectedItems(new Set(items.map((item) => item.product.id)));
  }, [items]);

  if (!isMounted) return null;

  const toggleItem = (id: string) => {
    const next = new Set(selectedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedItems(next);
  };

  const toggleAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.product.id)));
    }
  };

  const selectedTotal = items
    .filter((item) => selectedItems.has(item.product.id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <div className="text-8xl mb-8 grayscale opacity-30">🛒</div>
          <h1 className="text-3xl font-serif font-bold mb-4">{t.cart_empty}</h1>
          <p className="text-muted-foreground mb-10 max-w-sm mx-auto">{t.cart_empty_desc}</p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-3 px-10 py-5 bg-vizhu-purple hover:bg-vizhu-purple-dark text-white rounded-2xl font-display font-bold transition-all shadow-xl shadow-vizhu-purple/20 hover:scale-105"
          >
            <ShoppingBag size={20} />
            {t.cart_go_to_catalog}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block pt-32 pb-24 bg-background min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-6 mb-12">
            <Link href="/catalog" className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-2xl hover:bg-muted transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-4xl font-serif font-medium">
              {t.cart_title} <span className="text-muted-foreground text-xl font-light ml-4 opacity-50">{items.length} {t.cart_items_count}</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              {/* Select all */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/50">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <Checkbox
                    checked={selectedItems.size === items.length}
                    onCheckedChange={toggleAll}
                    className="w-6 h-6 rounded-lg border-2"
                  />
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{t.cart_select_all}</span>
                </label>
                <button
                  onClick={clearCart}
                  className="text-sm font-bold uppercase tracking-widest text-destructive hover:opacity-80 transition-opacity"
                >
                  {t.cart_clear}
                </button>
              </div>

              {/* Items */}
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className={cn(
                      'flex gap-6 p-6 rounded-[32px] border transition-all relative overflow-hidden group',
                      selectedItems.has(item.product.id)
                        ? 'border-vizhu-purple/30 bg-vizhu-purple/5'
                        : 'border-border/50 bg-card hover:border-vizhu-purple/20'
                    )}
                  >
                    <div className="flex items-start pt-2">
                      <Checkbox
                        checked={selectedItems.has(item.product.id)}
                        onCheckedChange={() => toggleItem(item.product.id)}
                        className="w-6 h-6 rounded-lg border-2"
                      />
                    </div>

                    {/* Product image */}
                    <div className="w-32 h-32 bg-secondary/50 rounded-3xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 duration-500 overflow-hidden relative">
                      {item.selectedColor?.image || item.product.images?.[0] ? (
                        <img 
                          src={item.selectedColor?.image || item.product.images?.[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl">{item.product.category === 'sunglasses' ? '🕶️' : '👓'}</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">{item.product.brand}</p>
                          <Link
                            href={`/catalog/${item.product.slug}`}
                            className="font-serif font-medium text-xl hover:text-vizhu-purple transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          {item.selectedColor && (
                            <div className="flex items-center gap-2 mt-3">
                              <div
                                className="w-4 h-4 rounded-full border border-black/5"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                {getLangText(item.selectedColor.name as any, language)}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-destructive/10 rounded-2xl transition-colors text-muted-foreground hover:text-destructive group/trash"
                        >
                          <Trash2 size={20} className="group-hover/trash:scale-110 transition-transform" />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-6">
                        {/* Quantity */}
                        <div className="flex items-center gap-3 bg-secondary rounded-2xl p-1 border border-border/50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center bg-card rounded-xl hover:shadow-md transition-all active:scale-95"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center bg-card rounded-xl hover:shadow-md transition-all active:scale-95"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-display font-bold text-vizhu-orange">{formatPrice(item.product.price * item.quantity, t.som)}</p>
                          {item.product.oldPrice && (
                            <p className="text-sm text-muted-foreground line-through opacity-50">
                              {formatPrice(item.product.oldPrice * item.quantity, t.som)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="sticky top-32 space-y-6">
              <div className="bg-card rounded-4xl p-8 border border-border/50 shadow-2xl shadow-black/5">
                <h2 className="text-2xl font-serif font-medium mb-8 uppercase tracking-widest text-[10px] text-muted-foreground">{t.cart_summary.toUpperCase()}</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-muted-foreground">{selectedItems.size} {t.cart_items_count}</span>
                    <span>{formatPrice(selectedTotal, t.som)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-muted-foreground">{language === 'ru' ? 'Доставка' : language === 'kg' ? 'Жеткирүү' : 'Shipping'}</span>
                    <span className="text-green-500">{language === 'ru' ? 'Бесплатно' : language === 'kg' ? 'Акысыз' : 'Free'}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{t.cart_summary}</span>
                    <span className="text-4xl font-display font-bold">{formatPrice(selectedTotal, t.som)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className={cn(
                    'w-full flex items-center justify-center gap-3 py-6 rounded-[32px] font-display font-bold text-lg transition-all shadow-xl',
                    selectedItems.size > 0
                      ? 'bg-vizhu-orange hover:bg-vizhu-orange-dark text-white hover:scale-[1.02] shadow-vizhu-orange/20'
                      : 'bg-muted text-muted-foreground cursor-not-allowed pointer-events-none'
                  )}
                >
                  {t.cart_checkout} ({selectedItems.size})
                  <ArrowRight size={20} />
                </Link>
              </div>

              <div className="p-8 bg-vizhu-purple/5 rounded-4xl border border-vizhu-purple/10 flex items-center gap-4">
                 <div className="w-12 h-12 bg-vizhu-purple/10 rounded-2xl flex items-center justify-center shrink-0">
                    <span className="text-2xl">✨</span>
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ru' ? 'Получите бесплатную проверку зрения при покупке любых очков сегодня!' : 
                     language === 'kg' ? 'Бүгүн каалаган көз айнекти сатып алууда көрүүнү акысыз текшерүүдөн өтүңүз!' :
                     'Get a free eye exam with any glasses purchase today!'}
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <MobileCartView
        items={items}
        selectedItems={selectedItems}
        toggleItem={toggleItem}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        selectedTotal={selectedTotal}
      />
    </>
  );
}
